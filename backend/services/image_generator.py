import os
from typing import Optional
from openai import OpenAI
import base64
import requests
from config import settings

class ImageGenerator:
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
        
    async def generate_character_image(self, character_data: dict) -> str:
        """Generate character image using DALL-E."""
        prompt = self._create_character_prompt(character_data)
        
        try:
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            
            return response.data[0].url
            
        except Exception as e:
            print(f"Error generating character image: {e}")
            return "/api/placeholder/200/200"
    
    async def generate_location_image(self, location_name: str, description: str) -> str:
        """Generate location image using DALL-E."""
        prompt = self._create_location_prompt(location_name, description)
        
        try:
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            
            return response.data[0].url
            
        except Exception as e:
            print(f"Error generating location image: {e}")
            return "/api/placeholder/400/200"
    
    async def generate_combat_scene(self, combat_data: dict) -> str:
        """Generate combat scene image using DALL-E."""
        prompt = self._create_combat_prompt(combat_data)
        
        try:
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            
            return response.data[0].url
            
        except Exception as e:
            print(f"Error generating combat image: {e}")
            return "/api/placeholder/400/300"
    
    # def _create_character_prompt(self, character_data: dict) -> str:
    #     """Create detailed prompt for character image generation."""
    #     return f"""Create an anime-style character portrait with these characteristics:
    #     - {character_data['archetype']} named {character_data['name']}
    #     - Their abilities include {', '.join(character_data['abilities'])}
    #     - Highly detailed, professional anime art style
    #     - Dynamic pose, front view, upper body focus
    #     - Clear facial features and distinctive clothing matching their archetype
    #     - Vibrant colors and dramatic lighting"""

    # def _create_location_prompt(self, location_name: str, description: str) -> str:
    #     """Create detailed prompt for location image generation."""
    #     return f"""Create an anime-style background scene of {location_name}:
    #     - {description}
    #     - Wide establishing shot
    #     - Detailed environment with appropriate atmospher
    #     - Anime art style with dramatic lighting
    #     - Rich colors and clear composition"""

    # def _create_combat_prompt(self, combat_data: dict) -> str:
    #     """Create detailed prompt for combat scene image generation."""
    #     return f"""Create an anime-style combat scene between:
    #     - {combat_data['attacker']['name']} ({combat_data['attacker']['archetype']})
    #     - {combat_data['defender']['name']} ({combat_data['defender']['archetype']})
    #     - Dynamic action pose with both characters
    #     - Dramatic lighting and effects
    #     - High energy anime combat style
    #     - Show special abilities or weapons in use"""

    def _create_character_prompt(self, character_data: dict) -> str:
        """Create detailed prompt for character image generation."""
        return f"""Create a full-body anime-style character portrait with these characteristics:
            - {character_data['archetype']} named {character_data['name']}
            - Their abilities include {', '.join(character_data['abilities'])}
            - Dynamic pose with clear, centered composition
            - Full body visible from head to toe
            - Detailed facial features and expressive eyes
            - Distinctive clothing matching their {character_data['archetype']} archetype
            - Clean anime art style with vibrant colors
            - Centered in frame with good lighting and background detail
            - Character should take up roughly 70% of the image height
            - Show character's personality and power through pose and expression"""

    def _create_location_prompt(self, location_name: str, description: str) -> str:
        """Create detailed prompt for location image generation."""
        return f"""Create a wide, sweeping anime-style background scene of {location_name}:
            - {description}
            - Wide establishing shot showing the full environment
            - Rich atmospheric details and proper perspective
            - Clean anime art style with dramatic lighting
            - No characters in scene, focus on architecture and environment
            - Show time of day and weather effects
            - High level of detail in both foreground and background
            - Strong sense of scale and depth"""

    def _create_combat_prompt(self, combat_data: dict) -> str:
        """Create detailed prompt for combat scene image generation."""
        return f"""Create a dynamic anime-style combat scene between:
            - {combat_data['attacker']['name']} ({combat_data['attacker']['archetype']})
            - {combat_data['defender']['name']} ({combat_data['defender']['archetype']})
            - Both characters clearly visible and centered in frame
            - Action-packed scene with energy effects and movement
            - Clear view of both characters' faces and expressions
            - Dramatic lighting and impactful composition
            - Show special abilities or weapons in use
            - Characters should fill the frame but not be cropped
            - High contrast and vibrant energy effects
            - Clean, detailed anime art style"""