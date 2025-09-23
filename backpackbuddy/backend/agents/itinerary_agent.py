"""
This module contains the primary agent responsible for generating the travel itinerary.
"""
from langchain.agents import AgentExecutor, create_structured_chat_agent, Tool
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from backpackbuddy.backend.utils.api_clients import get_groq_llm, get_serper_tool, get_places_of_interest, get_route

# --- Pydantic Schemas for Tool Inputs ---
class PlacesInput(BaseModel):
    lon: float = Field(description="Longitude of the center point for the search.")
    lat: float = Field(description="Latitude of the center point for the search.")
    kinds: str = Field(default="interesting_places", description="Comma-separated list of categories (e.g., 'museums', 'restaurants').")

class RouteInput(BaseModel):
    start_lon: float = Field(description="Longitude of the starting point.")
    start_lat: float = Field(description="Latitude of the starting point.")
    end_lon: float = Field(description="Longitude of the ending point.")
    end_lat: float = Field(description="Latitude of the ending point.")


# 1. Define Tools
# The descriptions are crucial for the agent to decide when and how to use each tool.
tools = [
    Tool(
        name="web_search",
        func=get_serper_tool().run,
        description="Use this for broad, up-to-date web searches. Good for finding geographic coordinates (latitude, longitude) of a city, current events, weather, or general travel advice.",
    ),
    Tool(
        name="find_places_of_interest",
        func=get_places_of_interest,
        description="Finds specific attractions, restaurants, or points of interest near a given latitude and longitude. Use this to populate the itinerary with concrete activities.",
        args_schema=PlacesInput,
    ),
    Tool(
        name="get_route_information",
        func=get_route,
        description="Calculates travel time and distance between two geographic points. Use this to group activities logically and estimate travel between them.",
        args_schema=RouteInput,
    ),
]

# 2. Create the Prompt
# This is the agent's instruction manual and persona.
prompt_template = """
You are BackpackBuddy, an expert travel agent AI. Your mission is to create a personalized, budget-friendly travel itinerary for a backpacker.

You MUST generate a detailed, day-by-day itinerary based on the user's request.
The final output MUST be a single, valid JSON object representing the full itinerary. Do not add any commentary before or after the JSON.

**User's Requirements:**
- Destination: {destination}
- Travel Dates: {travel_dates}
- Budget: {budget_mode}
- Preferences: {preferences}

**Your Thought Process:**
1.  **Deconstruct Request:** Identify key constraints and preferences. What is the main city? What are the user's interests?
2.  **Initial Research:** Use `web_search` to get the latitude and longitude for the destination city. This is essential for other tools. Also, search for any major local events or holidays during the travel dates.
3.  **Build Daily Plan:** For each day, find a few points of interest using `find_places_of_interest`. Use a variety of `kinds` in your searches to match the user's preferences.
4.  **Logical Flow:** Group activities by location to be efficient. Use `get_route_information` to check travel times between locations to ensure the plan is realistic. A backpacker won't want to spend all day in transit.
5.  **Add Details:** For each activity, include a brief description, estimated time, and budget notes (e.g., "Free entry," "Expect to pay ~$10 for food").
6.  **Final Output:** Assemble the complete plan into the required JSON format. Ensure the JSON is well-formed.

**JSON Output Structure:**
{{
  "itinerary": [
    {{
      "day": <integer>,
      "date": "<string>",
      "theme": "<string: e.g., 'Cultural Immersion & Street Food Tour'>",
      "activities": [
        {{
          "time": "<string: e.g., '09:00 - 11:00'>",
          "description": "<string: Detailed description of the activity>",
          "location": {{
            "name": "<string>",
            "lat": <float>,
            "lon": <float>
          }},
          "budget_notes": "<string>"
        }}
      ]
    }}
  ]
}}

Now, begin planning for the user.

User Input:
- Destination: {destination}
- Travel Dates: {travel_dates}
- Budget: {budget_mode}
- Preferences: {preferences}

{agent_scratchpad}
"""

prompt = ChatPromptTemplate.from_template(prompt_template)

# 3. Create the Agent
llm = get_groq_llm()
agent = create_structured_chat_agent(llm=llm, tools=tools, prompt=prompt)

# 4. Create the Agent Executor
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,  # Set to False in production
    handle_parsing_errors=True,
    max_iterations=15,
)

# 5. Main function to generate itinerary
def generate_itinerary(destination: str, travel_dates: str, budget_mode: str, preferences: str) -> dict:
    """
    Invokes the itinerary agent to generate a travel plan.
    """
    response = agent_executor.invoke({
        "destination": destination,
        "travel_dates": travel_dates,
        "budget_mode": budget_mode,
        "preferences": preferences,
    })
    # The agent is prompted to return a JSON object, which is parsed from the 'output' field.
    return response.get('output', {})

if __name__ == '__main__':
    # This block is for direct testing of the agent.
    # Note: Requires .env file with API keys at the root of the project.
    dest = "Chiang Mai, Thailand"
    dates = "December 5-9, 2024"
    budget = "Budget-conscious but loves food"
    prefs = "I love ancient temples, hiking in nature, and authentic northern Thai food. Not a big party person."

    try:
        itinerary_result = generate_itinerary(dest, dates, budget, prefs)
        import json
        print(json.dumps(itinerary_result, indent=2))
    except Exception as e:
        print(f"An error occurred: {e}")
