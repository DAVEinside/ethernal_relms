
import random
from typing import Dict, Tuple
from models.character import Character
from models.game_state import GameState

class CombatManager:
    def __init__(self):
        self.combat_moves = {
            "basic_attack": {
                "damage": (5, 15),
                "accuracy": 0.9,
                "description": [
                    "{attacker} launches a swift strike at {defender}!",
                    "{attacker} unleashes a powerful attack on {defender}!",
                    "{attacker} strikes with precision at {defender}!"
                ]
            },
            "special_ability": {
                "damage": (10, 25),
                "accuracy": 0.7,
                "description": [
                    "{attacker} channels their energy for a devastating technique!",
                    "{attacker} unleashes their special ability with incredible force!",
                    "{attacker} performs an amazing combo attack!"
                ]
            },
            "flee": {
                "damage": (0, 0),
                "accuracy": 0.5,
                "description": [
                    "{attacker} attempts to flee from the battle!",
                    "{attacker} tries to escape!",
                    "{attacker} looks for an opening to retreat!"
                ]
            }
        }
    
    def generate_enemy(self, player_level: int) -> Character:
        archetypes = ["Dark Warrior", "Shadow Mage", "Chaos Beast", "Corrupted Hero"]
        abilities = [
            "Dark Strike", "Shadow Magic", "Chaos Blast", "Corrupting Touch",
            "Void Shield", "Nightmare Slash"
        ]
        
        return Character(
            name=f"Level {player_level} {random.choice(archetypes)}",
            archetype=random.choice(archetypes),
            abilities=random.sample(abilities, 3),
            goals=["Defeat the hero"],
            level=player_level,
            hp=80 + (player_level * 10),
            max_hp=80 + (player_level * 10)
        )
    
    def process_combat_turn(self, attacker: Character, defender: Character, move: str) -> Tuple[str, Dict]:
        move_data = self.combat_moves[move]
        
        if move == "flee":
            success = random.random() < move_data["accuracy"]
            if success:
                return (
                    random.choice(move_data["description"]).format(attacker=attacker.name, defender=defender.name) + " Escape successful!",
                    {"damage": 0, "hit": True, "fled": True}
                )
            return (
                f"{attacker.name} failed to escape!",
                {"damage": 0, "hit": False, "fled": False}
            )

        # Calculate hit chance
        hit_roll = random.random()
        if hit_roll > move_data["accuracy"]:
            return (
                f"{attacker.name}'s attack missed {defender.name}!",
                {"damage": 0, "hit": False}
            )
        
        # Calculate damage
        base_damage = random.randint(*move_data["damage"])
        damage = base_damage + (attacker.stats.get("strength", 0) // 5)
        
        # Apply damage
        defender.hp = max(0, defender.hp - damage)
        
        # Generate combat description
        description = random.choice(move_data["description"]).format(
            attacker=attacker.name,
            defender=defender.name
        )
        
        return (
            f"{description} Dealing {damage} damage!",
            {"damage": damage, "hit": True}
        )
    
    def is_combat_over(self, player: Character, enemy: Character) -> Tuple[bool, str]:
        if player.hp <= 0:
            return True, "defeat"
        elif enemy.hp <= 0:
            return True, "victory"
        return False, "ongoing"
    
    def generate_combat_summary(self, player: Character, enemy: Character) -> str:
        return f"""
        === Combat Status ===
        {player.name}: {player.hp}/{player.max_hp} HP
        {enemy.name}: {enemy.hp}/{enemy.max_hp} HP
        """