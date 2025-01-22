// import React, { useState } from 'react';
// import ImageDisplay from './ImageDisplay';

// const CombatView = ({ gameState, onAction }) => {
//   const [combatLog, setCombatLog] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [combatImage, setCombatImage] = useState(null);

//   const handleCombatAction = async (action) => {
//     setIsLoading(true);
//     const result = await onAction(action);
//     setCombatLog((prev) => [...prev, result.message]);
//     setIsLoading(false);
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
//         }),
//       });

//       const data = await response.json();
//       setCombatImage(data.image_url);
//     } catch (error) {
//       console.error('Error generating combat image:', error);
//     }
//   };

//   const { player, current_enemy: enemy } = gameState;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {/* Combat Image Display */}
//       <div className="md:col-span-2 mb-4">
//         <ImageDisplay
//           imageUrl={combatImage}
//           alt="Combat Scene"
//           type="combat"
//           onRegenerate={generateCombatImage}
//         />
//       </div>

//       {/* Combat Status */}
//       <div className="bg-gray-800 p-4 rounded-lg">
//         <h2 className="text-xl font-bold mb-4">Combat Status</h2>

//         {/* Player Status */}
//         <div className="mb-4">
//           <h3 className="font-bold text-blue-400">{player.name}</h3>
//           <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
//             <div
//               className="bg-blue-600 rounded-full h-4"
//               style={{ width: `${(player.hp / player.max_hp) * 100}%` }}
//             />
//           </div>
//           <p>HP: {player.hp}/{player.max_hp}</p>
//         </div>

//         {/* Enemy Status */}
//         <div className="mb-4">
//           <h3 className="font-bold text-red-400">{enemy.name}</h3>
//           <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
//             <div
//               className="bg-red-600 rounded-full h-4"
//               style={{ width: `${(enemy.hp / enemy.max_hp) * 100}%` }}
//             />
//           </div>
//           <p>HP: {enemy.hp}/{enemy.max_hp}</p>
//         </div>
//       </div>

//       {/* Combat Actions */}
//       <div className="bg-gray-800 p-4 rounded-lg">
//         <h2 className="text-xl font-bold mb-4">Combat Actions</h2>
//         <div className="grid grid-cols-2 gap-2">
//           <button
//             onClick={() => handleCombatAction('basic_attack')}
//             disabled={isLoading}
//             className="bg-blue-600 hover:bg-blue-500 p-2 rounded"
//           >
//             Basic Attack
//           </button>

//           {player.abilities.map((ability, index) => (
//             <button
//               key={index}
//               onClick={() => handleCombatAction('special_ability')}
//               disabled={isLoading}
//               className="bg-purple-600 hover:bg-purple-500 p-2 rounded"
//             >
//               {ability}
//             </button>
//           ))}

//           <button
//             onClick={() => handleCombatAction('flee')}
//             disabled={isLoading}
//             className="col-span-2 bg-red-600 hover:bg-red-500 p-2 rounded"
//           >
//             Attempt to Flee
//           </button>
//         </div>
//       </div>

//       {/* Combat Log */}
//       <div className="md:col-span-2 bg-gray-800 p-4 rounded-lg">
//         <h2 className="text-xl font-bold mb-4">Combat Log</h2>
//         <div className="h-48 overflow-y-auto space-y-2">
//           {combatLog.map((log, index) => (
//             <p key={index} className="border-b border-gray-700 pb-2">
//               {log}
//             </p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CombatView;

import React, { useState, useEffect } from 'react';
import ImageDisplay from './ImageDisplay';

const CombatView = ({ gameState, onAction }) => {
  const [combatLog, setCombatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [combatImage, setCombatImage] = useState(null);

  // Initialize combat log with intro message
  useEffect(() => {
    setCombatLog([`Combat begins with ${gameState.current_enemy.name}!`]);
    generateCombatImage();
  }, []);

  const handleCombatAction = async (action) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await onAction(action);
      
      // Add action result to combat log
      if (result?.message) {
        setCombatLog(prev => [...prev, result.message]);
      }
      
      // Handle combat results
      if (result?.combat_summary) {
        setCombatLog(prev => [...prev, result.combat_summary]);
      }
      
      if (result?.combat_over) {
        const outcomeMessage = result.outcome === 'victory' 
          ? 'You are victorious!' 
          : result.outcome === 'defeat' 
          ? 'You have been defeated...' 
          : 'Combat has ended.';
        setCombatLog(prev => [...prev, outcomeMessage]);
      }
      
      if (result?.fled) {
        setCombatLog(prev => [...prev, "Successfully fled from battle!"]);
      }
      
    } catch (error) {
      console.error('Combat action error:', error);
      setCombatLog(prev => [...prev, "Error processing action"]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCombatImage = async () => {
    try {
      const response = await fetch('http://localhost:8000/game/generate-combat-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attacker: gameState.player,
          defender: gameState.current_enemy,
          action: "combat_start"
        }),
      });

      if (!response.ok) throw new Error('Failed to generate combat image');

      const data = await response.json();
      setCombatImage(data.image_url);
    } catch (error) {
      console.error('Error generating combat image:', error);
      setCombatImage('/api/placeholder/400/300');
    }
  };

  const { player, current_enemy: enemy } = gameState;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-white">Processing combat action...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Combat Image Display */}
      <div className="md:col-span-2 mb-4">
        <ImageDisplay
          imageUrl={combatImage}
          alt="Combat Scene"
          type="combat"
          onRegenerate={generateCombatImage}
        />
      </div>

      {/* Combat Status */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Combat Status</h2>

        {/* Player Status */}
        <div className="mb-4">
          <h3 className="font-bold text-blue-400">{player.name}</h3>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div
              className="bg-blue-600 rounded-full h-4 transition-all duration-300"
              style={{ width: `${(player.hp / player.max_hp) * 100}%` }}
            />
          </div>
          <p>HP: {player.hp}/{player.max_hp}</p>
        </div>

        {/* Enemy Status */}
        <div className="mb-4">
          <h3 className="font-bold text-red-400">{enemy.name}</h3>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div
              className="bg-red-600 rounded-full h-4 transition-all duration-300"
              style={{ width: `${(enemy.hp / enemy.max_hp) * 100}%` }}
            />
          </div>
          <p>HP: {enemy.hp}/{enemy.max_hp}</p>
        </div>
      </div>

      {/* Combat Actions */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Combat Actions</h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleCombatAction('basic_attack')}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 p-2 rounded disabled:opacity-50"
          >
            Basic Attack
          </button>

          {player.abilities.map((ability, index) => (
            <button
              key={index}
              onClick={() => handleCombatAction('special_ability')}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-500 p-2 rounded disabled:opacity-50"
            >
              {ability}
            </button>
          ))}

          <button
            onClick={() => handleCombatAction('flee')}
            disabled={isLoading}
            className="col-span-2 bg-red-600 hover:bg-red-500 p-2 rounded disabled:opacity-50"
          >
            Attempt to Flee
          </button>
        </div>
      </div>

      {/* Combat Log */}
      <div className="md:col-span-2 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Combat Log</h2>
        <div className="h-48 overflow-y-auto space-y-2">
          {combatLog.map((log, index) => (
            <p key={index} className="border-b border-gray-700 pb-2">
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CombatView;