# 🎓 MentorPath — AI-Powered Personalized Learning Platform

**MentorPath** is an adaptive, frontend-only learning platform that generates tailored, step-by-step skill roadmaps using generative AI. It adapts to the user's role, goal, complexity preference, and real-world analogy domain.

---

## ✨ Features

- 🎯 **AI-Generated Master Roadmaps**: Creates structured multi-phase roadmaps (Foundations, Patterns, Production) customized to your career goal.
- 🗺 **Interactive Visual Roadmap (`roadmap.sh` Style)**: Interactive flowchart visualizer with concept inspector modals.
- 💡 **Dynamic Explain-o-Meter & Analogy Engine**: Adjust complexity on the fly (ELI5, High School, Undergrad, Senior Lead) and translate complex tech concepts into your preferred real-world domain (Cooking, Sports, Gaming, Music, Finance, Sci-Fi).
- 🧑‍🏫 **Mentor Personas**: Switch between *Patient Teacher*, *Strict Senior Engineer*, and *Socratic Questioner*.
- 🔄 **"Still Lost" Remediation Modal**: Simple simplification cycler and mini-quizzes so learning is never blocked.
- 📊 **90-Day Contribution Heatmap & Learner Profile**: Tracks study consistency, completed topics, streaks, and cognitive state.
- 📄 **AI Skill-Based Resume Builder**: Synthesizes completed roadmap modules into ATS-optimized CVs with template switcher (Modern, Executive, Minimalist) and PDF export.
- 📜 **Verified Mastery Certificate**: Generates official printable certificates of mastery upon completing roadmap goals.
- 🔍 **Black-Box Prompt Inspector**: Built-in prompt inspector payload logger for developers.

---

## 🛠 Tech Stack

- **Frontend**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Black-box `generatePersonalizedContent()` service compatible with OpenAI / Anthropic / Gemini endpoints.

---

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/mentorpath.git
   cd mentorpath
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🔒 Session & State Note

MentorPath is a **frontend-only prototype**. All state lives in React in-memory state for the active session. No backend or localStorage database is used.

---

## 📄 License

MIT License. Built with ❤️ for AI-Powered Learning.
