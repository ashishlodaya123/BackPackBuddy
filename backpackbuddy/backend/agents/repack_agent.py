"""
This module contains the agent responsible for autonomous replanning and packing list generation.
"""
from langchain_core.prompts import ChatPromptTemplate
import json

from backend.utils.api_clients import get_groq_llm

# Initialize the LLM
llm = get_groq_llm()

# Simple prompt for packing list generation
SYSTEM_PROMPT = """
You are BackpackBuddy's "Repack Expert". Your job is to generate a practical packing list for a traveler based on their itinerary.

**Your Task:**
Create a comprehensive packing list based on the provided itinerary.

**Your Process:**
1. Analyze the destination, duration, and planned activities from the itinerary
2. Consider the typical weather for the destination and season
3. Categorize items into logical groups
4. Be specific with quantities where helpful
5. Consider the activities mentioned in the itinerary

**JSON Output Structure:**
{{
  "packing_list": {{
    "Clothing": ["3x T-shirts", "2x Pants", "1x Light jacket", "..."],
    "Toiletries": ["Toothbrush", "Toothpaste", "Shampoo", "..."],
    "Electronics": ["Phone charger", "Power bank", "Camera", "..."],
    "Documents": ["Passport", "Travel insurance", "Booking confirmations", "..."],
    "Miscellaneous": ["Backpack", "Water bottle", "First aid kit", "..."]
  }},
  "weather_summary": "Expect warm, humid weather with occasional rain showers"
}}

Return ONLY the JSON object, no additional text.
"""

USER_PROMPT = """
**Itinerary Details:**
{itinerary}

Generate a packing list as a JSON object:
"""

# Create the prompt
packing_list_prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("human", USER_PROMPT)
])

def generate_packing_list(itinerary: dict) -> dict:
    """
    Generates a packing list for the given itinerary using direct LLM invocation.
    """
    try:
        # Create the chain
        chain = packing_list_prompt | llm
        
        # Convert itinerary to string for the prompt
        itinerary_str = json.dumps(itinerary, indent=2)
        
        # Invoke the chain
        response = chain.invoke({"itinerary": itinerary_str})
        
        # Extract content from the response
        content = response.content if hasattr(response, 'content') else str(response)
        
        # Try to parse JSON from the response
        start_idx = content.find('{')
        end_idx = content.rfind('}') + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_content = content[start_idx:end_idx]
            return json.loads(json_content)
        else:
            # Return a basic packing list if JSON parsing fails
            return {
                "packing_list": {
                    "Clothing": ["T-shirts", "Pants", "Underwear", "Socks"],
                    "Toiletries": ["Toothbrush", "Toothpaste", "Shampoo"],
                    "Electronics": ["Phone charger", "Power bank"],
                    "Documents": ["Passport", "Travel insurance"],
                    "Miscellaneous": ["Backpack", "Water bottle"]
                },
                "weather_summary": "Check local weather forecast"
            }
            
    except json.JSONDecodeError as e:
        print(f"JSON decode error in generate_packing_list: {e}")
        return {"error": "Failed to parse the packing list from the model's response."}
    except Exception as e:
        print(f"An unexpected error occurred in generate_packing_list: {e}")
        return {"error": str(e)}


# --- 2. Itinerary Replanner (Simplified for now) ---
# A full replanning agent is complex. We'll start with a simplified version.
# For now, this will be a placeholder, as the main focus is the packing list.
def replan_day(itinerary: dict, day_to_replan: int, new_condition: str) -> dict:
    """
    (Placeholder) Re-plans a specific day in the itinerary based on a new condition.
    """
    print("Replanning function called, but it's a placeholder for now.")
    # In a full implementation, this would invoke another agent with a prompt like:
    # "Given the following itinerary, replan Day {day_to_replan} because {new_condition}.
    # The new plan should still be budget-conscious and logical."
    return itinerary