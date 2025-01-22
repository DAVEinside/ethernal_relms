# Ethernal Relms - AI Based Dungeon Game

An interactive text-based RPG game with anime-style visuals, powered by AI. Create unique characters, explore magical realms, and engage in dynamic combat with AI-generated imagery.

![Game Preview](![image](https://github.com/user-attachments/assets/871d00c4-7ea0-4c9b-a758-a5e7f8805968)


## Features

- 🎮 Character Creation with AI-Generated Portraits
- ⚔️ Dynamic Combat System
- 🌍 Interactive World Exploration
- 🎨 AI-Generated Visuals for Characters, Locations, and Combat
- 📝 Dynamic Story Generation
- 🎯 Quest System

## Game Screenshots

### Character Creation
Create your unique character by selecting:
- Character Name
- Archetype
- Special Abilities
- Character Goals

![Character Creation](![image](https://github.com/user-attachments/assets/0fb46c82-c322-4f09-9002-bb2b130e17fa)
)

### World Exploration
Explore various locations with AI-generated scenery:
- Crystal Valley Academy
- Neo Tokyo
- Mystic Forest
- And more!

![World Exploration](![image](https://github.com/user-attachments/assets/6307326a-bce4-49a8-bacf-13a8dba78a15)
)

### Combat System
Engage in tactical combat with:
- Basic Attacks
- Special Abilities
- Dynamic Combat Log
- AI-Generated Combat Scenes

![Combat System](![image](https://github.com/user-attachments/assets/c5d033ff-9a34-46c8-8609-457e13f959bc)
)

## Technology Stack

### Frontend
- React
- Tailwind CSS
- Vite

### Backend
- FastAPI
- OpenAI API (DALL-E for image generation)
- Python

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- OpenAI API key

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a config.py file with your OpenAI API key:
```python
openai_api_key = "your-api-key-here"
```

5. Start the backend server:
```bash
uvicorn main:app --reload
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Pushing to Git Repository

1. Initialize a new git repository:
```bash
git init
```

2. Add all files:
```bash
git add .
```

3. Create initial commit:
```bash
git commit -m "Initial commit"
```

4. Link to remote repository:
```bash
git remote add origin <your-repository-url>
```

5. Push to remote repository:
```bash
git push -u origin main
```

## Game Mechanics

### Character Creation
- Choose from 5 unique archetypes
- Select up to 3 special abilities
- Set character goals
- Get AI-generated character portrait

### Combat
- Turn-based combat system
- Special ability usage
- Dynamic combat outcomes
- Flee option available

### Exploration
- Visit different locations
- Encounter random events
- Find quests
- Interact with NPCs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- OpenAI for DALL-E API
- React and FastAPI communities
- All contributors and testers

## Contact

Nimit Dave
Project Link: [\(https://github.com/DAVEinside/ethernal_relms.git)](https://github.com/DAVEinside/ethernal_relms.git)
