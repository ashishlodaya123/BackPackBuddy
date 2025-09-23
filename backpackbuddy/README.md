# BackpackBuddy 🎒

BackpackBuddy is a free, autonomous, agentic AI system that generates personalized travel itineraries for budget-conscious backpackers. It helps users plan budget-friendly, authentic travel itineraries with high autonomy. It integrates free APIs and delivers dynamic itineraries, offline packs, maps, safety tips, and more.

## ✨ Features

*   **Dynamic Itinerary Builder**: Get a day-by-day plan with activities, transport, and timings based on your destination, dates, budget, and preferences.
*   **AI-Powered Packing Lists**: Receive packing suggestions based on your itinerary and the weather forecast for your destination.
*   **Offline Survival Pack**: Download a PDF with your itinerary, maps, and essential info for offline access.
*   **Interactive Map View**: Visualize your entire trip with markers for each activity.
*   **Budget-Aware Planning**: Choose from Strict, Chill, or YOLO budget modes for automatic balancing of expenses.
*   **Autonomous Agent**: Built with LangChain and Groq for fast, intelligent travel planning.

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, TailwindCSS, shadcn/ui, Framer Motion, Leaflet.js
*   **Backend**: Python, FastAPI, LangChain, Groq, Serper, OpenTripMap, OSRM
*   **Deployment**: Docker

## 🚀 Getting Started

### Prerequisites

*   [Docker](https://www.docker.com/get-started) (for Docker setup)
*   [Node.js](https://nodejs.org/en/) (v18 or higher, for manual setup)
*   [Python](https://www.python.org/downloads/) (v3.10 or higher, for manual setup)
*   API Keys for Groq, Serper, and OpenTripMap

### 1. Installation

First, clone the repository and set up your environment variables.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/backpackbuddy.git
    cd backpackbuddy
    ```

2.  **Set up environment variables:**
    This is required for both Docker and manual setup. Create a `.env` file in the root directory by copying the example:
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and add your API keys.

### 2. Running the Application

You can run BackpackBuddy using either Docker (recommended for a production-like experience) or manually for development.

#### Option A: Running with Docker

This is the easiest way to get started. It builds the production versions of the frontend and backend and runs them in isolated containers.

1.  **Build and run the containers:**
    ```bash
    docker-compose up --build
    ```
2.  **Access the application:**
    The application will be available at `http://localhost:5173`.

#### Option B: Manual Setup (for Development)

This method is ideal for development, as it provides hot-reloading for both the frontend and backend. You will need two separate terminal windows.

**Terminal 1: Run the Backend**
```bash
# Navigate to the backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload
```
The backend will be running at `http://localhost:8000`.

**Terminal 2: Run the Frontend**
```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Run the Vite development server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

## 📜 License

This project is licensed under the MIT License.
