# 🗓️ Cook for Calendar – AI Scheduler for Busy Lives

Welcome to **Cook for Calendar**, a smart conversational scheduling assistant designed to simplify how we book time — especially for homemakers, remote workers, and busy professionals. This project enables a seamless and beautiful user experience.

---

## 🔗 Live Project Link

👉 [Try Cook for Calendar](https://lovable.dev/projects/cccfc290-4a13-4faa-b43f-97c663a55cfb)

---

## 🎨 Features Overview

### 💬 Conversational Chat Interface
- Modern chat UI with **glassmorphism** effects
- Smooth message animations & typing indicators
- Light/Dark mode toggle
- Mobile and tablet responsive

### 🧠 Smart Conversation Capabilities
- Parses natural language requests like:
  - “Schedule a call tomorrow at 4PM”
  - “Book a 1-hr meeting next Friday”
- Context-aware back-and-forth replies
- "**Cook for Calendar**" mode – understands homemaker-friendly phrases like “after I cook lunch”

### 📅 Google Calendar Integration (Framework Ready)
- Built-in framework for Google OAuth2 login
- Detects calendar availability
- Prevents booking conflicts
- Easy slot confirmation UI

### 🎙️ Additional Functionalities
- Voice input (UI-ready, implement Web Speech API to activate)
- Smart time parsing + timezone handling
- System/browser notifications for upcoming events
- Success toasts & booking confirmations
- 10-min popup & 30-min email reminder logic (mock mode)

---

## 🚀 Technologies Used

| Stack Layer        | Technology                  |
|--------------------|-----------------------------|
| Frontend Framework | React + TypeScript          |
| Styling            | Tailwind CSS + shadcn/ui    |
| UI Toolkit         | shadcn components           |
| Animation & Effects| Framer Motion, CSS Transitions |
| State Management   | React Context API           |
| Calendar Framework | Google Calendar API (mock)  |
| AI Agent Logic     | Client-side logic (no backend) |


---

## 🛠 Local Development (Optional)
```bash
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd cook-for-calendar

# Step 3: Install dependencies
npm install

# Step 4: Start the dev server
npm run dev
```

> Ensure Node.js and npm are installed. You can use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) for easier version management.

---

## 🔐 Google Calendar Integration Steps
To connect with a real calendar:

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth credentials
3. Replace the placeholder credentials inside `CalendarContext.tsx`
4. Authorize the app to access Google Calendar

Until then, the app will function using **mock calendar data**.

---

## 👨‍💻 Developer Info

**Built and Designed by:** *Itian Sarad Agarwal*  
---

## 📌 Future Enhancements

- Integrate real-time voice recognition (Web Speech API)
- Expand AI intent detection with OpenAI API
- Multi-user support with calendar syncing
- WhatsApp/Telegram bot integration
- Export calendar events as PDF/ICS

---

*Simplify your scheduling, whether you're in the kitchen or in a meeting room.*
