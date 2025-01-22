import random
from typing import Dict, List
from models.character import Character

class WorldManager:
    def __init__(self):
        self.locations = {
            "Crystal Valley Academy": {
                "description": "A prestigious school of magic nestled between mystical mountains.",
                "connected_areas": ["Training Grounds", "Library of Secrets", "Dormitory"],
                "possible_events": ["class", "duel", "study"]
            },
            "Neo Tokyo": {
                "description": "A cyberpunk metropolis where magic meets technology.",
                "connected_areas": ["Neon District", "Underground", "Sky Towers"],
                "possible_events": ["chase", "negotiation", "hack"]
            },
            "Mystic Forest": {
                "description": "An ancient woodland filled with magical creatures and hidden secrets.",
                "connected_areas": ["Sacred Grove", "Dark Thicket", "River of Dreams"],
                "possible_events": ["exploration", "gathering", "creature_encounter"]
            }
        }
        
        self.npc_templates = {
            "Mentor": {
                "archetypes": ["Wise Sage", "Battle Master", "Ancient Spirit"],
                "abilities": ["Teach", "Guide", "Protect"],
                "goals": ["Train the hero", "Preserve knowledge", "Maintain balance"]
            },
            "Rival": {
                "archetypes": ["Dark Prodigy", "Competing Student", "Mysterious Warrior"],
                "abilities": ["Challenge", "Compete", "Push limits"],
                "goals": ["Surpass others", "Prove worth", "Gain power"]
            }
        }
    
    def get_location_info(self, location_name: str) -> Dict:
        return self.locations.get(location_name, {
            "description": "A mysterious new area.",
            "connected_areas": [],
            "possible_events": ["exploration"]
        })
    
    def generate_npc(self, npc_type: str) -> Character:
        template = self.npc_templates.get(npc_type, self.npc_templates["Mentor"])
        
        return Character(
            name=f"{random.choice(['Master', 'Sir', 'Lady'])} {random.choice(['Kai', 'Luna', 'Nova', 'Zephyr'])}",
            archetype=random.choice(template["archetypes"]),
            abilities=random.sample(template["abilities"], 2),
            goals=random.sample(template["goals"], 2)
        )
    
    def describe_area(self, location: str) -> str:
        loc_info = self.get_location_info(location)
        
        time_of_day = random.choice(["morning", "afternoon", "evening", "night"])
        weather = random.choice(["clear", "rainy", "misty", "stormy"])
        
        description = f"""
        As the {time_of_day} {weather} settles over {location}, you find yourself in {loc_info['description']}
        
        Nearby areas: {', '.join(loc_info['connected_areas'])}
        """
        
        return description
    
    def get_available_actions(self, location: str) -> List[str]:
        loc_info = self.get_location_info(location)
        
        basic_actions = ["Explore", "Talk to NPCs", "Check surroundings"]
        location_specific = [f"Investigate {area}" for area in loc_info['connected_areas']]
        
        return basic_actions + location_specific