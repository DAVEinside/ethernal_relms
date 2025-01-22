import random
from typing import List, Dict, Any

def generate_unique_id() -> str:
    """Generate a unique identifier for game sessions."""
    return f"{random.randint(1000, 9999)}-{random.randint(1000, 9999)}"

def calculate_damage(base_damage: int, attacker_stats: Dict[str, int], 
                    defender_stats: Dict[str, int]) -> int:
    """Calculate final damage based on attacker and defender stats."""
    attack_power = attacker_stats.get("strength", 10)
    defense = defender_stats.get("agility", 10)
    
    damage_multiplier = attack_power / (attack_power + defense)
    return int(base_damage * damage_multiplier)

def check_level_up(experience: int, current_level: int) -> bool:
    """Check if character should level up based on experience."""
    xp_threshold = current_level * 100
    return experience >= xp_threshold

def sanitize_input(text: str) -> str:
    """Sanitize user input for safety."""
    return text.strip()[:200]  # Limit length and remove whitespace

def merge_dictionaries(dict1: Dict[str, Any], dict2: Dict[str, Any]) -> Dict[str, Any]:
    """Merge two dictionaries with nested structure."""
    result = dict1.copy()
    for key, value in dict2.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = merge_dictionaries(result[key], value)
        else:
            result[key] = value
    return result