"""
This module contains the agent responsible for autonomous replanning and packing list generation.
"""
from langchain.agents import AgentExecutor, create_structured_chat_agent, Tool
from langchain_core.prompts import ChatPromptTemplate
import json

from backpackbuddy.backend.utils.api_clients import get_groq_llm, get_serper_tool

# --- Tools for this agent ---
# This agent primarily needs to search the web for information like weather.
tools = [
    Tool(
        name="web_search",
        func=get_serper_tool().run,
        description="Use this tool to search the web for current information, especially weather forecasts for a specific location and date.",
    ),
]

# --- LLM and Agent Setup ---
llm = get_groq_llm()

# --- 1. Packing List Generator ---

packing_list_prompt_template = """
You are BackpackBuddy's "Repack Expert". Your job is to generate a practical packing list for a traveler based on their itinerary.

**Your Task:**
Create a comprehensive packing list based on the provided itinerary.

**Your Process:**
1.  **Analyze the Itinerary:** Review the destination, duration, and planned activities.
2.  **Check the Weather:** Use the `web_search` tool to get the weather forecast for the destination during the travel dates. This is the most important step.
3.  **Categorize Items:** Group packing items into logical categories: Clothing, Toiletries, Electronics, Documents, and Miscellaneous.
4.  **Suggest Quantities:** Be specific where possible (e.g., "3x T-shirts", "1x Rain jacket").
5.  **Be Smart:** Suggest items based on activities. Hiking? Suggest hiking boots. Beach? Suggest swimwear.
6.  **Final Output:** Return a single, valid JSON object representing the packing list.

**JSON Output Structure:**
{{
  "packing_list": {{
    "Clothing": ["..."],
    "Toiletries": ["..."],
    "Electronics": ["..."],
    "Documents": ["..."],
    "Miscellaneous": ["..."]
  }},
  "weather_summary": "<A brief summary of the expected weather>"
}}

**Itinerary Details:**
{itinerary}

Begin!

{agent_scratchpad}
"""
packing_list_prompt = ChatPromptTemplate.from_template(packing_list_prompt_template)
packing_list_agent = create_structured_chat_agent(llm=llm, tools=tools, prompt=packing_list_prompt)
packing_list_executor = AgentExecutor(agent=packing_list_agent, tools=tools, verbose=True, handle_parsing_errors=True)

def generate_packing_list(itinerary: dict) -> dict:
    """
    Invokes the agent to generate a packing list for the given itinerary.
    """
    # The itinerary dictionary needs to be a string for the prompt
    itinerary_str = json.dumps(itinerary, indent=2)
    response = packing_list_executor.invoke({"itinerary": itinerary_str})
    return response.get('output', {})


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
