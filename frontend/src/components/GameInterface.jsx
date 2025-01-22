// import React, { useState, useEffect } from 'react';
// import ImageDisplay from './ImageDisplay';

// const CombatView = ({ gameState, onAction }) => {
//   const [combatLog, setCombatLog] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [combatImage, setCombatImage] = useState(null);
//   const [actionInProgress, setActionInProgress] = useState(false);

//   useEffect(() => {
//     // Initialize combat when component mounts
//     setCombatLog([`Combat begins with ${gameState.current_enemy.name}!`]);
//     generateCombatImage();
//   }, []);

//   const handleCombatAction = async (action) => {
//     if (actionInProgress) return;
    
//     setActionInProgress(true);
//     try {
//       const result = await onAction(action);
      
//       // Update combat log with action results
//       if (result?.message) {
//         setCombatLog(prev => [...prev, result.message]);
//       }
      
//       // Add combat summary if available
//       if (result?.combat_summary) {
//         setCombatLog(prev => [...prev, result.combat_summary]);
//       }
      
//       // Handle combat outcome
//       if (result?.combat_over) {
//         const outcomeMessage = result.outcome === 'victory' 
//           ? '🎉 You are victorious!' 
//           : result.outcome === 'defeat' 
//           ? '💀 You have been defeated...' 
//           : '⚔️ Combat has ended.';
//         setCombatLog(prev => [...prev, outcomeMessage]);
//       }
      
//       // Handle flee attempt
//       if (result?.fled) {
//         setCombatLog(prev => [...prev, "🏃 Successfully fled from battle!"]);
//       }
      
//     } catch (error) {
//       console.error('Combat action error:', error);
//       setCombatLog(prev => [...prev, "❌ Error processing action"]);
//     } finally {
//       setActionInProgress(false);
//     }
//   };

//   const generateCombatImage = async () => {
//     try {
//       const response = await fetch('http://localhost:8000/game/generate-combat-image', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           attacker: gameState.player,
//           defender: gameState.current_enemy,
//           action: "combat_start"
//         }),
//       });

//       if (!response.ok) throw new Error('Failed to generate combat image');

//       const data = await response.json();
//       setCombatImage(data.image_url);
//     } catch (error) {
//       console.error('Error generating combat image:', error);
//       setCombatImage('/api/placeholder/400/300');
//     }
//   };

//   const { player, current_enemy: enemy } = gameState;

//   // Loading overlay for actions
//   const LoadingOverlay = () => actionInProgress && (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
//         <div className="text-white text-lg">Processing combat action...</div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <LoadingOverlay />
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Combat Image Display */}
//         <div className="md:col-span-2 mb-4">
//           <ImageDisplay
//             imageUrl={combatImage}
//             alt="Combat Scene"
//             type="combat"
//             onRegenerate={generateCombatImage}
//           />
//         </div>

//         {/* Combat Status */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <h2 className="text-xl font-bold mb-4">Combat Status</h2>

//           {/* Player Status */}
//           <div className="mb-4">
//             <h3 className="font-bold text-blue-400">{player.name}</h3>
//             <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
//               <div
//                 className="bg-blue-600 rounded-full h-4 transition-all duration-300"
//                 style={{ width: `${(player.hp / player.max_hp) * 100}%` }}
//               />
//             </div>
//             <p>HP: {player.hp}/{player.max_hp}</p>
//           </div>

//           {/* Enemy Status */}
//           <div className="mb-4">
//             <h3 className="font-bold text-red-400">{enemy.name}</h3>
//             <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
//               <div
//                 className="bg-red-600 rounded-full h-4 transition-all duration-300"
//                 style={{ width: `${(enemy.hp / enemy.max_hp) * 100}%` }}
//               />
//             </div>
//             <p>HP: {enemy.hp}/{enemy.max_hp}</p>
//           </div>
//         </div>

//         {/* Combat Actions */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <h2 className="text-xl font-bold mb-4">Combat Actions</h2>
//           <div className="grid grid-cols-2 gap-2">
//             <button
//               onClick={() => handleCombatAction('basic_attack')}
//               disabled={actionInProgress}
//               className="bg-blue-600 hover:bg-blue-500 p-2 rounded disabled:opacity-50 transition-all duration-200"
//             >
//               Basic Attack
//             </button>

//             {player.abilities.map((ability, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleCombatAction('special_ability')}
//                 disabled={actionInProgress}
//                 className="bg-purple-600 hover:bg-purple-500 p-2 rounded disabled:opacity-50 transition-all duration-200"
//               >
//                 {ability}
//               </button>
//             ))}

//             <button
//               onClick={() => handleCombatAction('flee')}
//               disabled={actionInProgress}
//               className="col-span-2 bg-red-600 hover:bg-red-500 p-2 rounded disabled:opacity-50 transition-all duration-200"
//             >
//               Attempt to Flee
//             </button>
//           </div>
//         </div>

//         {/* Combat Log */}
//         <div className="md:col-span-2 bg-gray-800 p-4 rounded-lg">
//           <h2 className="text-xl font-bold mb-4">Combat Log</h2>
//           <div className="h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
//             {combatLog.map((log, index) => (
//               <p 
//                 key={index} 
//                 className="border-b border-gray-700 pb-2 animate-fadeIn"
//               >
//                 {log}
//               </p>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CombatView;

import React, { useState, useEffect } from 'react';
import ImageDisplay from './ImageDisplay';

const GameInterface = ({ gameState, onAction }) => {
  const [actionResult, setActionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationImage, setLocationImage] = useState(gameState?.location_image || null);

  // Check if gameState is valid
  if (!gameState || !gameState.player) {
    return (
      <div className="text-center p-4">
        <p>Loading game state...</p>
      </div>
    );
  }

  const handleAction = async (action, parameters = {}) => {
    setIsLoading(true);
    try {
      const result = await onAction(action, parameters);
      setActionResult(result);
    } catch (error) {
      console.error('Action error:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Character Info Panel */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Character Info</h2>
        <div className="space-y-2">
          <p><span className="font-bold">Name:</span> {gameState.player.name}</p>
          <p><span className="font-bold">Archetype:</span> {gameState.player.archetype}</p>
          <p><span className="font-bold">HP:</span> {gameState.player.hp}/{gameState.player.max_hp}</p>
          <p><span className="font-bold">Level:</span> {gameState.player.level}</p>

          <div className="mt-4">
            <h3 className="font-bold">Abilities:</h3>
            <ul className="list-disc list-inside">
              {gameState.player.abilities.map((ability, index) => (
                <li key={index}>{ability}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="md:col-span-2 space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Current Location</h2>
          <div className="mb-4">
            <ImageDisplay
              imageUrl={locationImage}
              alt={gameState.current_location}
              type="location"
            />
          </div>
          <p className="font-bold">{gameState.current_location}</p>
          <p className="mt-4 italic">{gameState.story_context}</p>
        </div>

        {actionResult && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Result:</h3>
            <p>{actionResult.message}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAction('explore')}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 p-2 rounded disabled:opacity-50"
            >
              Explore Area
            </button>
          </div>
        </div>

        {/* Quest Log */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Quest Log</h2>
          {gameState.quest_log && gameState.quest_log.length > 0 ? (
            <ul className="list-disc list-inside">
              {gameState.quest_log.map((quest, index) => (
                <li key={index}>{quest}</li>
              ))}
            </ul>
          ) : (
            <p className="italic">No active quests</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameInterface;