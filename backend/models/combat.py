from dataclasses import dataclass
from typing import List, Optional
from .character import Character

@dataclass
class CombatAction:
    name: str
    damage_range: tuple
    accuracy: float
    description: str

@dataclass
class CombatState:
    attacker: Character
    defender: Character
    turn_count: int = 0
    combat_log: List[str] = None
    last_action: Optional[str] = None
    
    def __post_init__(self):
        if self.combat_log is None:
            self.combat_log = []
    
    def add_log_entry(self, entry: str):
        self.combat_log.append(entry)
    
    def to_dict(self):
        return {
            "attacker": self.attacker.to_dict(),
            "defender": self.defender.to_dict(),
            "turn_count": self.turn_count,
            "combat_log": self.combat_log,
            "last_action": self.last_action
        }