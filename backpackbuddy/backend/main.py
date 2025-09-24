from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import io

from backend.agents.itinerary_agent import generate_itinerary
from backend.agents.repack_agent import generate_packing_list
from backend.utils.pdf_generator import create_itinerary_pdf

app = FastAPI(
    title="BackpackBuddy API",
    description="API for BackpackBuddy, the AI-powered travel itinerary planner.",
    version="0.1.0",
)

# CORS (Cross-Origin Resource Sharing)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models for API Requests ---
class ItineraryRequest(BaseModel):
    destination: str
    travel_dates: str
    budget_mode: str
    preferences: str

class ItineraryData(BaseModel):
    itinerary: dict

# --- API Endpoints ---
@app.get("/")
def read_root():
    """Root endpoint to check if the API is running."""
    return {"message": "Welcome to the BackpackBuddy API! 🎒"}

@app.post("/generate-itinerary")
async def generate_itinerary_endpoint(request: ItineraryRequest):
    """Endpoint to generate a new travel itinerary."""
    try:
        print(f"Generating itinerary for: {request.destination}")
        itinerary_result = generate_itinerary(
            destination=request.destination,
            travel_dates=request.travel_dates,
            budget_mode=request.budget_mode,
            preferences=request.preferences,
        )

        if isinstance(itinerary_result, str):
            try:
                itinerary_json = json.loads(itinerary_result)
            except json.JSONDecodeError:
                print(f"Failed to parse JSON: {itinerary_result}")
                raise HTTPException(status_code=500, detail="Agent returned a non-JSON string.")
        elif isinstance(itinerary_result, dict):
            itinerary_json = itinerary_result
        else:
            print(f"Unknown data type returned: {type(itinerary_result)}")
            raise HTTPException(status_code=500, detail="Agent returned an unknown data type.")

        print("Itinerary generated successfully")
        return itinerary_json
    except Exception as e:
        print(f"Error in generate_itinerary_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {str(e)}")

@app.post("/download-itinerary-pdf")
async def download_itinerary_pdf_endpoint(request: ItineraryData):
    """Endpoint to generate and download an itinerary as a PDF."""
    try:
        pdf_bytes = create_itinerary_pdf(request.itinerary)

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=BackpackBuddy_Itinerary.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@app.post("/generate-packing-list")
async def generate_packing_list_endpoint(request: ItineraryData):
    """Endpoint to generate a packing list for a given itinerary."""
    try:
        print("Generating packing list...")
        packing_list_result = generate_packing_list(request.itinerary)

        if isinstance(packing_list_result, str):
            try:
                packing_list_json = json.loads(packing_list_result)
            except json.JSONDecodeError:
                print(f"Failed to parse packing list JSON: {packing_list_result}")
                raise HTTPException(status_code=500, detail="Agent returned a non-JSON string for packing list.")
        elif isinstance(packing_list_result, dict):
            packing_list_json = packing_list_result
        else:
            print(f"Unknown packing list data type: {type(packing_list_result)}")
            raise HTTPException(status_code=500, detail="Agent returned an unknown data type for packing list.")

        print("Packing list generated successfully")
        return packing_list_json
    except Exception as e:
        print(f"Error in generate_packing_list_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred while generating packing list: {str(e)}")
