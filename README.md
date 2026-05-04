# AI Learning Assistant 🎓

An intelligent, full-stack educational tool designed to transform any topic into a structured learning experience. Built as a technical assignment to demonstrate expertise in AI integration, robust data processing, and modern frontend development.

## 🚀 Overview

The **AI Learning Assistant** takes a complex topic and a specific grade level to generate:
- **Personalized Summaries**: Tailored to the student's age and comprehension level.
- **Key Learning Points**: High-impact takeaways for quick mastery.
- **Interactive Quizzes**: Instant knowledge checks with real-time feedback.

## ✨ Key Features & Requirements

This project fulfills all core and additional requirements of the assignment:

### 1. Backend & AI Integration
- **OpenRouter API**: Integrated with **Claude 3 Haiku** for high-quality, reliable educational content.
- **Structured JSON Output**: The system strictly enforces a JSON response format for seamless parsing.
- **Paraphrasing Layer**: Implements a dedicated pass to simplify complex summaries for younger audiences.

### 2. Data Processing Layer (Robustness)
- **Automatic Validation**: Ensures every AI response contains a valid summary, bullet points, and quiz structure.
- **AI-Powered Repair**: Includes a "Repair to JSON" mechanism that uses the LLM to fix malformed or truncated responses automatically.
- **Fault Tolerance**: Comprehensive error handling for network failures or API timeouts.

### 3. Modern Frontend Experience
- **Minimalist Aesthetic**: Clean, focused design inspired by tools like Notion and Linear.
- **Typewriter Effect**: Enhances the user experience by "streaming" the explanation in a human-like way.
- **Smart Components**: Includes a quiz progress bar, score card, and a retry mechanism.
- **Local History**: Persists the last 3 searches using `localStorage` for instant access.
- **Print Ready**: Optimized print stylesheet for saving study guides as PDFs.

## 🛠️ Tech Stack

- **Frontend**: Next.js (React), CSS Modules
- **Backend**: Next.js API Routes (Node.js)
- **AI**: OpenRouter (Claude 3 Haiku)
- **Deployment**: Vercel ready

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- An [OpenRouter API Key](https://openrouter.ai/keys)

### 2. Installation
```bash
git clone <your-repo-link>
cd AI_learning_agent
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=anthropic/claude-3-haiku
USE_MOCK_AI=false
```

### 4. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start learning!

## 🧠 Approach & Assumptions

### Approach
- **Modular AI Logic**: The AI interaction is isolated in `lib/ai.js` to make it easy to swap models or providers.
- **Two-Phase Generation**: Instead of asking the AI to "be simple" in one go, we generate a high-quality standard explanation first and then use a specialized paraphrasing pass. This results in much better educational accuracy.
- **CSS-First Design**: Used Vanilla CSS for a lightweight, performant, and completely custom look without the "clutter" of many modern frameworks.

### Assumptions
- **Grade Levels**: Assumed a standard 1-12 grade system.
- **Quiz Format**: Assumed a fixed 3-question multiple-choice format to keep the learning experience concise and high-impact.
- **Content Language**: Optimized for English language instruction.

---
*Built with care for the AI Learning Assistant Internship Assignment.*
