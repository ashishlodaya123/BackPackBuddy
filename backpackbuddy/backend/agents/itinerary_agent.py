"""
This module contains the primary agent responsible for generating the travel itinerary.
"""
import json
from langchain_core.prompts import ChatPromptTemplate
from backend.utils.api_clients import get_groq_llm, get_serper_tool, get_places_of_interest, get_route

# Create a simple prompt for direct LLM usage
SYSTEM_PROMPT = """
You are BackpackBuddy, an expert travel agent AI. Your mission is to create a personalized, budget-friendly travel itinerary for a backpacker.

You MUST generate a detailed, day-by-day itinerary based on the user's request.
The final output MUST be a single, valid JSON object representing the full itinerary. Do not add any commentary before or after the JSON.

**JSON Output Structure:**
The final output must be a JSON object with the following structure:
{{
  "itinerary": [
    {{
      "day": 1,
      "date": "2024-11-10",
      "theme": "Cultural Immersion & Street Food Tour",
      "activities": [
        {{
          "time": "09:00 - 11:00",
          "description": "Visit the Grand Palace and Wat Phra Kaew (Temple of the Emerald Buddha)",
          "location": {{
            "name": "Grand Palace",
            "lat": 13.7500,
            "lon": 100.4915
          }},
          "budget_notes": "Entry fee: ~500 THB ($15)"
        }}
      ]
    }}
  ]
}}

Create a realistic itinerary with:
- 3-5 activities per day
- Logical geographic grouping
- Mix of cultural sites, food experiences, and local attractions
- Budget-conscious recommendations
- Realistic time estimates
- Specific location coordinates (use reasonable estimates for major attractions)
"""

USER_PROMPT = """
**User's Requirements:**
- Destination: {destination}
- Travel Dates: {travel_dates}
- Budget: {budget_mode}
- Preferences: {preferences}

Generate a complete itinerary as a JSON object:
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("human", USER_PROMPT)
])

# Initialize the LLM
llm = get_groq_llm()

# Main function to generate itinerary
def generate_itinerary(destination: str, travel_dates: str, budget_mode: str, preferences: str) -> dict:
    """
    Generates a travel itinerary using direct LLM invocation.
    """
    try:
        # Create the chain
        chain = prompt | llm
        
        # Invoke the chain
        response = chain.invoke({
            "destination": destination,
            "travel_dates": travel_dates,
            "budget_mode": budget_mode,
            "preferences": preferences,
        })
        
        # Extract content from the response
        content = response.content if hasattr(response, 'content') else str(response)
        
        # Try to parse JSON from the response
        # Look for JSON content between curly braces
        start_idx = content.find('{')
        end_idx = content.rfind('}') + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_content = content[start_idx:end_idx]
            return json.loads(json_content)
        else:
            # If no JSON found, return a basic structure
            return {
                "error": "Could not extract JSON from response",
                "raw_response": content
            }
            
    except json.JSONDecodeError as e:
        print(f"JSON decode error in generate_itinerary: {e}")
        return {"error": "Failed to parse the itinerary from the model's response."}
    except Exception as e:
        print(f"An unexpected error occurred in generate_itinerary: {e}")
        return {"error": str(e)}

if __name__ == '__main__':
    # This block is for direct testing of the agent.
    # Note: Requires .env file with API keys at the root of the project.
    dest = "Chiang Mai, Thailand"
    dates = "December 5-9, 2025"
    budget = "Budget-conscious but loves food"
    prefs = "I love ancient temples, hiking in nature, and authentic northern Thai food. Not a big party person."

    try:
        itinerary_result = generate_itinerary(dest, dates, budget, prefs)
        print(json.dumps(itinerary_result, indent=2))
    except Exception as e:
        print(f"An error occurred during testing: {e}")