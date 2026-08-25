<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=35&duration=3000&pause=1000&color=22C55E&center=true&vCenter=true&width=600&lines=SnapDish.AI;AI+Chef+in+Your+Pocket" alt="Typing SVG" />
</p>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:22C55E,100:0EA5E9&height=200&section=header&text=SnapDish.AI&fontSize=50&fontColor=FFFFFF&animation=twinkling&fontAlignY=35" />
</div>

![Python](https://img.shields.io/badge/Javascript-3776AB?style=for-the-badge&logo=javascript&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-8E75F3?style=for-the-badge&logo=google&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)
![Level](https://img.shields.io/badge/Level-Intermediate-10B981?style=for-the-badge)

**SnapDish.AI** is an AI-powered recipe platform that turns food photos into full recipes.  
Snap a dish, get the recipe instantly. Plus browse built-in recipes, create your own, and chat with your personal **AI Chef**.

### ✨ Features

- **📸 Image to Recipe Generator**: Upload a food image → Gemini AI analyzes it and generates ingredients, steps, calories, and cooking time.
- **📚 Built-in Recipe Library**: 100+ curated recipes you can browse and cook right away.
- **✍️ Create Your Own Recipes**: Users can add, edit, and save their own recipes with AI suggestions for improvements.
- **👨‍🍳 AI Chatbot Chef**: Ask "What can I make with chicken and rice?" or "How to make this less spicy?" and get instant answers from your AI chef powered by Gemini.
- **🔍 Smart Search**: Find recipes by ingredients, cuisine, or dietary needs.

### 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **AI Model** | Google Gemini 1.5 Pro / Gemini Vision |
| **Frontend** | Streamlit / React |
| **Backend** | Python, FastAPI |
| **Database** | SQLite / Firebase |
| **Image Processing** | Pillow, OpenCV |
| **Deployment** | Streamlit Cloud / Render |

### 📦 Libraries to Install

Minimal setup. Main dependencies:

```bash
pip install streamlit google-generativeai pillow opencv-python fastapi uvicorn python-dotenv

How to Run Locally:
1-Clone the repo:
git clone https://github.com/hassanzprofile/snapdish-Ai.git
cd snapdish-ai-with-api

Create virtual environment:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies:
pip install -r requirements.txt
Add your Gemini API Key:
Create a .env file in root:
GEMINI_API_KEY= your_api_key_here
Run the app:
streamlit run app.py
Open http://localhost:8501 in your browser.

 Project Level:
Beginner to Intermediate:Perfect if you want to learn: AI API integration, Image processing, Full-stack with Python, and building AI agents.

 How the AI Chef Works:
The AI Chef is powered by Gemini. It takes your question + context of ingredients you have and generates human-like cooking advice, substitutions, and step-by-step guidance. It remembers the conversation so it feels like chatting with a real chef.

 Contributing:
Pull requests are welcome! For major changes, please open an issue first.

 License:
MIT License



