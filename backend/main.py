

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import random
from config import settings  

from models.character import Character
from models.game_state import GameState
from services.story_generator import StoryGenerator
from services.combat_manager import CombatManager
from services.world_manager import WorldManager
from services.image_generator import ImageGenerator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

story_generator = StoryGenerator()
combat_manager = CombatManager()
world_manager = WorldManager()
image_generator = ImageGenerator()

class CharacterCreate(BaseModel):
    name: str
    archetype: str
    abilities: List[str]
    goals: List[str]

class GameAction(BaseModel):
    action: str
    parameters: Optional[Dict] = {}

game_states: Dict[str, GameState] = {}

@app.get("/test")
async def test_route():
    return {"message": "API is working!"}


@app.post("/game/start")
async def start_game(character_data: CharacterCreate):
    try:
        # Create new character
        character = Character(
            name=character_data.name,
            archetype=character_data.archetype,
            abilities=character_data.abilities,
            goals=character_data.goals,
            level=1,
            hp=100,
            max_hp=100,
            stats={"strength": 10, "magic": 10, "defense": 10}
        )
        
        # Generate character image
        try:
            image_url = await image_generator.generate_character_image(character_data.dict())
            character.image_url = image_url
        except Exception as e:
            print(f"Error generating character image: {e}")
            character.image_url = "/api/placeholder/200/200"

        # Generate introduction
        intro = story_generator.generate_introduction(character)
        
        # Initialize game state
        game_state = GameState(
            player=character,
            current_location="Crystal Valley Academy",
            story_context=intro,
            combat_active=False,
            quest_log=[]
        )
        
        # Generate location image
        try:
            loc_image = await image_generator.generate_location_image(
                game_state.current_location,
                intro
            )
            game_state.location_image = loc_image
        except Exception as e:
            print(f"Error generating location image: {e}")
            game_state.location_image = "/api/placeholder/400/200"
        
        # Store game state
        game_states[character.name] = game_state
        
        # Print debug information
        print("Created game state:", game_state.to_dict())
        
        response_data = {
            "message": "Game started successfully",
            "game_state": game_state.to_dict(),
            "introduction": intro
        }
        
        print("Returning response:", response_data)  # Debug log
        
        return response_data
        
    except Exception as e:
        print(f"Error in start_game: {e}")  # Debug log
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/game/{character_name}/action")
async def process_action(character_name: str, action: GameAction):
    if character_name not in game_states:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game_state = game_states[character_name]
    
    if game_state.combat_active:
        if action.action not in ["basic_attack", "special_ability", "flee"]:
            raise HTTPException(status_code=400, detail="Invalid combat action")
        
        result, stats = combat_manager.process_combat_turn(
            game_state.player,
            game_state.current_enemy,
            action.action
        )
        
        is_over, outcome = combat_manager.is_combat_over(
            game_state.player,
            game_state.current_enemy
        )
        
        combat_summary = combat_manager.generate_combat_summary(
            game_state.player,
            game_state.current_enemy
        )

        combat_log = {
            "message": result,
            "combat_stats": stats,
            "combat_summary": combat_summary if not is_over else None,
            "combat_over": is_over,
            "outcome": outcome if is_over else "ongoing",
            "game_state": game_state.to_dict()
        }

        if 'fled' in stats:
            combat_log['fled'] = stats['fled']
            if stats['fled']:
                game_state.combat_active = False
                game_state.current_enemy = None
        elif is_over:
            game_state.combat_active = False
            game_state.current_enemy = None
            
        return combat_log
    
    if action.action == "explore":
        event, context = story_generator.generate_next_event(game_state)
        game_state.story_context = event
        
        if random.random() < 0.3:
            enemy = combat_manager.generate_enemy(game_state.player.level)
            game_state.combat_active = True
            game_state.current_enemy = enemy
            combat_start_message = f"You encountered {enemy.name}!"
            return {
                "message": combat_start_message,
                "combat_started": True,
                "enemy": enemy.to_dict(),
                "combat_summary": combat_manager.generate_combat_summary(
                    game_state.player,
                    enemy
                ),
                "game_state": game_state.to_dict()
            }
        
        return {
            "message": event,
            "context": context,
            "game_state": game_state.to_dict()
        }
    
    elif action.action == "move":
        new_location = action.parameters.get("location")
        if new_location in world_manager.locations:
            game_state.current_location = new_location
            description = world_manager.describe_area(new_location)
            return {
                "message": description,
                "available_actions": world_manager.get_available_actions(new_location),
                "game_state": game_state.to_dict()
            }
    
    return {
        "message": "Action processed",
        "game_state": game_state.to_dict()
    }

@app.post("/game/generate-character-image")
async def generate_character_image(character_data: dict):
    try:
        image_url = await image_generator.generate_character_image(character_data)
        return {"image_url": image_url or "/api/placeholder/200/200"}
    except Exception as e:
        return {"image_url": "/api/placeholder/200/200"}

@app.post("/game/generate-location-image")
async def generate_location_image(location_data: dict):
    try:
        image_url = await image_generator.generate_location_image(
            location_data["name"],
            location_data["description"]
        )
        return {"image_url": image_url or "/api/placeholder/400/200"}
    except Exception as e:
        return {"image_url": "/api/placeholder/400/200"}

@app.post("/game/generate-combat-image")
async def generate_combat_image(combat_data: dict):
    try:
        image_url = await image_generator.generate_combat_scene(combat_data)
        return {"image_url": image_url or "/api/placeholder/400/300"}
    except Exception as e:
        return {"image_url": "/api/placeholder/400/300"}

@app.get("/game/{character_name}/state")
async def get_game_state(character_name: str):
    if character_name not in game_states:
        raise HTTPException(status_code=404, detail="Game not found")
    return game_states[character_name].to_dict()