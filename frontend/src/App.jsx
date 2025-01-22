import React, { useState, useEffect } from 'react';
import CharacterCreation from './components/CharacterCreation';
import GameInterface from './components/GameInterface';
import CombatView from './components/CombatView';

function App() {
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Test backend connection
    fetch('http://localhost:8000/test')
      .catch(error => {
        setError('Unable to connect to server');
        console.error('Server connection error:', error);
      });
  }, []);

  const handleCharacterCreation = (data) => {
    console.log('Character creation data received:', data);
    if (data?.game_state) {
      setGameState(data.game_state);
    } else {
      setError('Invalid game state received');
      console.error('Invalid game state:', data);
    }
  };

  const handleAction = async (action, parameters = {}) => {
    if (!gameState?.player?.name) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/game/${gameState.player.name}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, parameters }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.game_state) {
        setGameState(data.game_state);
      }
      return data;
    } catch (error) {
      setError('Action failed: ' + error.message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      );
    }

    if (!gameState) {
      return <CharacterCreation onCharacterCreated={handleCharacterCreation} />;
    }

    if (gameState.combat_active) {
      return (
        <CombatView 
          gameState={gameState}
          onAction={handleAction}
        />
      );
    }

    return (
      <GameInterface
        gameState={gameState}
        onAction={handleAction}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Anime-Themed AI Dungeon Master
        </h1>
        
        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="ml-4 text-sm hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {renderMainContent()}
      </div>
    </div>
  );
}

export default App;