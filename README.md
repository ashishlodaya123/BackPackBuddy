# 🎒 BackpackBuddy – Your AI Travel Companion

BackpackBuddy is an **AI-driven, autonomous travel planner** designed for backpackers who want smart, flexible, and budget-conscious trips. It generates **personalized itineraries**, uncovers hidden gems, creates offline survival packs, and can dynamically replan trips if conditions change.

Powered by **Groq LLMs**, BackpackBuddy is fast, modular, and built to be extended or deployed easily.

---

## ✨ Features

* 🗺️ **Dynamic Itinerary Builder**: Enter your destination, dates, and budget → receive a detailed day-by-day plan with transport and activities.
* 💎 **Hidden Gems Mode**: Choose between mainstream routes or offbeat, authentic experiences.
* 💸 **Budget-Aware Planning**: Options like “Strict,” “Chill,” or “YOLO” automatically balance food, accommodation, and travel expenses.
* 📶 **Offline Survival Pack**: Downloadable PDF including itinerary, maps, emergency contacts, local phrases, and hostel info.
* 🎭 **Local Culture Layer**: Discover events, festivals, and cultural highlights during your trip.
* 🎒 **Packing List Generator**: Smart suggestions based on weather and planned activities.
* 🚨 **Safety & Alerts**: Tips on local scams, safety advisories, and emergency numbers.
* 🛏️ **Hostel & Social Layer**: Prioritizes hostels and nearby social spots for backpackers.
* 🔄 **Autonomous Replanning**: Handles weather changes, budget adjustments, and unexpected events.

---

## 🛠️ Tech Stack

**Frontend:**

* React + Vite
* TailwindCSS + shadcn/ui for styling
* Framer Motion for animations
* Leaflet.js + OpenStreetMap for maps

**Backend:**

* FastAPI (Python)
* LangChain for agent orchestration
* **Groq API** for LLM inference
* Serper API for search
* OpenTripMap API for attractions
* OSRM API for routes and transit
* WikiTravel Scraper for contextual info
* ReportLab for PDF generation

**Infrastructure:**

* Docker + Docker Compose
* `.env` for API keys and configuration
* GitHub Actions-ready for CI/CD

---

## 📂 Project Structure

```
backpackbuddy/
│── backend/
│   ├── main.py                # FastAPI entrypoint
│   ├── agents/                # Agent logic
│   │   ├── itinerary_agent.py
│   │   ├── budget_agent.py
│   │   ├── repack_agent.py
│   ├── utils/                 # Helper modules
│   │   ├── api_clients.py
│   │   ├── pdf_generator.py
│   │   ├── maps.py
│   ├── tests/                 # Unit tests
│   └── requirements.txt
│
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ItineraryCard.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── BudgetToggle.jsx
│   │   │   ├── PackingList.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Results.jsx
│   │       ├── OfflinePack.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
│── .env.example
│── .gitignore
│── README.md
│── docker-compose.yml
```

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/backpackbuddy.git
cd backpackbuddy
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Populate `.env` with your keys:

```env
# LLM (Groq)
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama3-70b-8192  # or any supported Groq model

# Search
SERPER_API_KEY=your_key_here

# Travel APIs
OPENTRIPMAP_API_KEY=your_key_here
OSRM_API_URL=http://router.project-osrm.org
```

### 3. Install dependencies

**Backend:**

```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**

```bash
cd frontend
npm install
```

### 4. Run locally

**Backend:**

```bash
cd backend
uvicorn main:app --reload
```

**Frontend:**

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📦 Docker (Optional)

Run the full stack with Docker:

```bash
docker-compose up --build
```

---

## 🧪 Tests

```bash
cd backend
pytest
```

---

## 📸 Screenshots (to add)

* `home.png` – Landing page
* `results.png` – Sample itinerary
* `offline_pack.png` – PDF survival pack

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`feature/cool-idea`)
3. Submit a Pull Request 🚀

---

## 📜 License

MIT License – free to use, modify, and extend.

---

## 🙌 Credits

* Maps: OpenStreetMap + Leaflet.js
* Attractions: OpenTripMap API
* Search: Serper API
* LLM: Groq API
