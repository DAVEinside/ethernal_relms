from typing import List, Tuple
import random
from models.character import Character
from models.game_state import GameState

class StoryGenerator:
    def __init__(self):
        self.story_templates = [
            "In the mystical realm of {location}, {character_name} the {archetype} seeks {goal}.",
            "A new hero emerges in {location}. {character_name}, master of {ability}, must {goal}.",
            "The ancient prophecy speaks of {character_name}, the legendary {archetype} who will {goal}."
        ]
        
        self.locations = [
            "Crystal Valley Academy",
            "Neo Tokyo",
            "Mystic Forest",
            "Shadow Realm",
            "Sky Kingdom"
        ]
        
        self.events = [
            "A mysterious stranger approaches...",
            "The ground trembles as dark energy emerges...",
            "A magical portal opens nearby...",
            "An ancient artifact begins to glow..."
        ]
    
    def generate_introduction(self, character: Character) -> str:
        template = random.choice(self.story_templates)
        location = random.choice(self.locations)
        
        return template.format(
            location=location,
            character_name=character.name,
            archetype=character.archetype,
            ability=random.choice(character.abilities),
            goal=random.choice(character.goals)
        )
    
    def generate_next_event(self, game_state: GameState) -> Tuple[str, dict]:
        event = random.choice(self.events)
        
        # Generate potential consequences or choices
        choices = [
            "Investigate carefully",
            "Approach directly",
            "Prepare for battle",
            "Try to communicate"
        ]
        
        return event, {
            "choices": choices,
            "location": game_state.current_location,
            "context": game_state.story_context
        }
    
    def process_choice(self, game_state: GameState, choice: str) -> str:
        # Process the player's choice and generate the next story beat
        responses = {
            "Investigate carefully": "You cautiously approach, noting every detail...",
            "Approach directly": "With confidence, you stride forward...",
            "Prepare for battle": "You ready your weapons and assume a fighting stance...",
            "Try to communicate": "You attempt to establish peaceful contact..."
        }
        
        base_response = responses.get(choice, "You proceed with your action...")
        
        # Add some randomized elements to make the response more dynamic
        additional_details = [
            f"The air crackles with magical energy.",
            f"Your {random.choice(game_state.player.abilities)} ability resonates.",
            f"You sense the presence of powerful forces.",
            f"The environment responds to your actions."
        ]
        
        return f"{base_response} {random.choice(additional_details)}"