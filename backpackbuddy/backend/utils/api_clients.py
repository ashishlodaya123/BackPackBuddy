"""
This module contains functions to interact with external APIs like
Groq, Serper, OpenTripMap, etc.
"""
import os
import requests
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_community.utilities import GoogleSerperAPIWrapper

# Load environment variables from .env file
load_dotenv()

# --- API Key Checks ---
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
SERPER_API_KEY = os.environ.get("SERPER_API_KEY")
OPENTRIPMAP_API_KEY = os.environ.get("OPENTRIPMAP_API_KEY")
OSRM_API_URL = os.environ.get("OSRM_API_URL", "http://router.project-osrm.org")

# --- LLM Client ---
def get_groq_llm() -> ChatGroq:
    """
    Initializes and returns the Groq LLM client.

    Raises:
        ValueError: If the GROQ_API_KEY is not set.

    Returns:
        ChatGroq: An instance of the ChatGroq client.
    """
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY environment variable not set.")
    return ChatGroq(api_key=GROQ_API_KEY, model_name=os.environ.get("GROQ_MODEL"))

# --- Search Tool ---
def get_serper_tool() -> GoogleSerperAPIWrapper:
    """
    Initializes and returns the Serper (Google Search) API wrapper.

    Raises:
        ValueError: If the SERPER_API_KEY is not set.

    Returns:
        GoogleSerperAPIWrapper: An instance of the GoogleSerperAPIWrapper.
    """
    if not SERPER_API_KEY:
        raise ValueError("SERPER_API_KEY environment variable not set.")
    return GoogleSerperAPIWrapper(serper_api_key=SERPER_API_KEY)

# --- Travel APIs ---
def get_places_of_interest(lon: float, lat: float, radius: int = 5000, kinds: str = "interesting_places") -> list:
    """
    Fetches a list of places of interest from OpenTripMap.

    Args:
        lon (float): Longitude of the center point.
        lat (float): Latitude of the center point.
        radius (int): Search radius in meters.
        kinds (str): Comma-separated list of kinds of places to search for.

    Returns:
        list: A list of features (places), or an empty list if an error occurs.
    """
    if not OPENTRIPMAP_API_KEY:
        print("Warning: OPENTRIPMAP_API_KEY not set. Skipping place search.")
        return []

    base_url = "https://api.opentripmap.com/0.1/en/places/radius"
    params = {
        "radius": radius,
        "lon": lon,
        "lat": lat,
        "kinds": kinds,
        "apikey": OPENTRIPMAP_API_KEY,
        "format": "json",
        "limit": 20,
    }
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from OpenTripMap: {e}")
        return []

def get_route(start_lon: float, start_lat: float, end_lon: float, end_lat: float) -> dict:
    """
    Fetches a route from the OSRM API.

    Args:
        start_lon (float): Longitude of the starting point.
        start_lat (float): Latitude of the starting point.
        end_lon (float): Longitude of the ending point.
        end_lat (float): Latitude of the ending point.

    Returns:
        dict: The route information from OSRM, or an empty dict if an error occurs.
    """
    url = f"{OSRM_API_URL}/route/v1/driving/{start_lon},{start_lat};{end_lon},{end_lat}?overview=false"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if data.get("code") == "Ok":
            return data.get("routes", [{}])[0]
        else:
            print(f"OSRM API returned an error: {data.get('message')}")
            return {}
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from OSRM: {e}")
        return {}
