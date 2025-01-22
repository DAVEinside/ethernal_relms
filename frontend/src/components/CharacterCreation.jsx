import React, { useState, useEffect } from 'react';
import ImageDisplay from './ImageDisplay';

const ARCHETYPES = [
  'Magical Student',
  'Martial Artist',
  'Spirit Warrior',
  'Tech Ninja',
  'Mystic Healer'
];

const ABILITIES = [
  'Energy Blast',
  'Healing Touch',
  'Shadow Step',
  'Lightning Strike',
  'Force Field',
  'Mind Read',
  'Time Slow',
  'Element Control'
];

const CharacterCreation = ({ onCharacterCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    archetype: ARCHETYPES[0],
    abilities: [],
    goals: ['']
  });
  const [characterImage, setCharacterImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageGenerating, setImageGenerating] = useState(false);

  // Generate initial image when abilities are selected
  useEffect(() => {
    const shouldGenerateImage = formData.name.trim() && 
                              formData.abilities.length > 0 && 
                              !characterImage && 
                              !imageGenerating;
    
    if (shouldGenerateImage) {
      generateCharacterImage(formData);
    }
  }, [formData.abilities, formData.name, characterImage, imageGenerating]);

  const generateCharacterImage = async (characterData) => {
    try {
      setImageGenerating(true);
      const response = await fetch('http://localhost:8000/game/generate-character-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate character image');
      }

      const data = await response.json();
      setCharacterImage(data.image_url);
      return data.image_url;
    } catch (error) {
      console.error('Error generating character image:', error);
      return '/api/placeholder/200/200';
    } finally {
      setImageGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.abilities.length > 0) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Generate character image if not already generated
        let currentImage = characterImage;
        if (!currentImage) {
          currentImage = await generateCharacterImage(formData);
        }

        // Start the game
        const gameResponse = await fetch('http://localhost:8000/game/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            imageUrl: currentImage,
            goals: formData.goals.filter(goal => goal.trim() !== '')
          }),
        });

        if (!gameResponse.ok) {
          throw new Error('Failed to start game');
        }

        const gameData = await gameResponse.json();
        if (!gameData.game_state) {
          throw new Error('Invalid game state received');
        }

        onCharacterCreated(gameData);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAbilityToggle = (ability) => {
    setFormData(prev => ({
      ...prev,
      abilities: prev.abilities.includes(ability)
        ? prev.abilities.filter(a => a !== ability)
        : [...prev.abilities, ability].slice(0, 3)
    }));
  };

  const handleGoalChange = (index, value) => {
    const newGoals = [...formData.goals];
    newGoals[index] = value;
    setFormData(prev => ({ ...prev, goals: newGoals }));
  };

  const addGoal = () => {
    if (formData.goals.length < 3) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, '']
      }));
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur-sm card-float">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Your Character</h2>
      
      {error && (
        <div className="bg-red-600/90 text-white p-4 rounded mb-4 backdrop-blur-sm glow-effect">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glow-effect p-4 rounded-lg">
            <label className="block mb-2">Character Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 bg-gray-700/70 rounded text-white backdrop-blur-sm"
              required
            />
          </div>
          
          <div className="glow-effect p-4 rounded-lg">
            <label className="block mb-2">Archetype</label>
            <select
              value={formData.archetype}
              onChange={(e) => setFormData(prev => ({ ...prev, archetype: e.target.value }))}
              className="w-full p-2 bg-gray-700/70 rounded text-white backdrop-blur-sm"
            >
              {ARCHETYPES.map(archetype => (
                <option key={archetype} value={archetype}>
                  {archetype}
                </option>
              ))}
            </select>
          </div>
          
          <div className="glow-effect p-4 rounded-lg">
            <label className="block mb-2">Abilities (Choose up to 3)</label>
            <div className="grid grid-cols-2 gap-2">
              {ABILITIES.map(ability => (
                <label key={ability} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.abilities.includes(ability)}
                    onChange={() => handleAbilityToggle(ability)}
                    disabled={!formData.abilities.includes(ability) && formData.abilities.length >= 3}
                    className="text-blue-600"
                  />
                  <span>{ability}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="glow-effect p-4 rounded-lg">
            <label className="block mb-2">Goals</label>
            {formData.goals.map((goal, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => handleGoalChange(index, e.target.value)}
                  className="w-full p-2 bg-gray-700/70 rounded text-white backdrop-blur-sm"
                  placeholder={`Goal ${index + 1}`}
                  required
                />
              </div>
            ))}
            {formData.goals.length < 3 && (
              <button
                type="button"
                onClick={addGoal}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                + Add another goal
              </button>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-bold disabled:opacity-50 transition-all duration-200 glow-effect"
            disabled={!formData.name || formData.abilities.length === 0 || isLoading}
          >
            {isLoading ? 'Creating Character...' : 'Create Character'}
          </button>
        </form>

        <div className="flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold mb-4">Character Preview</h3>
          <div className="card-float">
            <ImageDisplay
              imageUrl={characterImage}
              alt="Character Preview"
              type="character"
              onRegenerate={() => generateCharacterImage(formData)}
              isLoading={imageGenerating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;