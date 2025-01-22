from dataclasses import dataclass
from typing import List, Optional, Dict

@dataclass
class Character:
    def __init__(
        self,
        name: str,
        archetype: str,
        abilities: List[str],
        goals: List[str],
        level: int = 1,
        hp: int = 100,
        max_hp: int = 100,
        stats: Dict[str, int] = None,
        image_url: str = None
    ):
        self.name = name
        self.archetype = archetype
        self.abilities = abilities
        self.goals = goals
        self.level = level
        self.hp = hp
        self.max_hp = max_hp
        self.stats = stats or {"strength": 10, "magic": 10, "defense": 10}
        self.image_url = image_url

    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "archetype": self.archetype,
            "abilities": self.abilities,
            "goals": self.goals,
            "level": self.level,
            "hp": self.hp,
            "max_hp": self.max_hp,
            "stats": self.stats,
            "image_url": self.image_url
        }
    @classmethod
    def from_dict(cls, data):
        return cls(**data)