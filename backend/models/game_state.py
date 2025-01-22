from dataclasses import dataclass, field
from typing import Optional, List, Dict
from .character import Character

@dataclass
class GameState:
    def __init__(
        self,
        player: Character,
        current_location: str,
        story_context: str,
        combat_active: bool = False,
        current_enemy: Optional[Character] = None,
        location_image: Optional[str] = None,
        quest_log: Optional[List[str]] = None
    ):
        self.player = player
        self.current_location = current_location
        self.story_context = story_context
        self.combat_active = combat_active
        self.current_enemy = current_enemy
        self.location_image = location_image
        self.quest_log = quest_log or []

    def to_dict(self) -> Dict:
        return {
            "player": self.player.to_dict(),
            "current_location": self.current_location,
            "story_context": self.story_context,
            "combat_active": self.combat_active,
            "current_enemy": self.current_enemy.to_dict() if self.current_enemy else None,
            "location_image": self.location_image,
            "quest_log": self.quest_log
        }