"""
This module contains the logic for generating the downloadable PDF
offline survival pack using the ReportLab library.
"""
from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT

def create_itinerary_pdf(itinerary_data: dict) -> bytes:
    """
    Generates a PDF document from a structured itinerary dictionary.

    Args:
        itinerary_data (dict): A dictionary containing the itinerary details,
                               expected to have an 'itinerary' key with a list
                               of daily plans.

    Returns:
        bytes: The generated PDF file as a byte string.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer,
                            rightMargin=inch,
                            leftMargin=inch,
                            topMargin=inch,
                            bottomMargin=inch)

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='MainTitle',
                              fontSize=24,
                              leading=28,
                              alignment=TA_CENTER,
                              spaceAfter=20))
    styles.add(ParagraphStyle(name='DayHeader',
                              fontSize=18,
                              leading=22,
                              spaceBefore=20,
                              spaceAfter=10))
    styles.add(ParagraphStyle(name='Activity',
                              leftIndent=inch/2,
                              spaceBefore=5))
    styles.add(ParagraphStyle(name='ActivityDetails',
                              leftIndent=inch,
                              textColor='grey'))

    story = []

    # Title Page
    # Assuming the top-level dict might have trip-wide info, but the agent returns it inside 'itinerary'.
    # We will try to find a destination name from the first activity if possible.
    destination_name = "Your Adventure"
    try:
        # A bit of a heuristic to find a general destination name
        first_location_name = itinerary_data.get('itinerary', [{}])[0].get('activities', [{}])[0].get('location', {}).get('name', '')
        if first_location_name:
            # e.g., "Wat Pho, Bangkok" -> "Bangkok"
            parts = first_location_name.split(',')
            if len(parts) > 1:
                destination_name = parts[-1].strip()
            else:
                destination_name = first_location_name
    except (IndexError, KeyError):
        pass

    story.append(Paragraph(f"BackpackBuddy Itinerary: {destination_name}", styles['MainTitle']))
    story.append(Spacer(1, 2 * inch))

    # Itinerary Details
    daily_plans = itinerary_data.get('itinerary', [])
    for day_plan in daily_plans:
        story.append(Paragraph(f"Day {day_plan.get('day', '')}: {day_plan.get('theme', '')}", styles['DayHeader']))
        story.append(Paragraph(f"Date: {day_plan.get('date', 'N/A')}", styles['Normal']))
        story.append(Spacer(1, 0.2 * inch))

        activities = day_plan.get('activities', [])
        if not activities:
            story.append(Paragraph("No activities planned for this day.", styles['Activity']))

        for activity in activities:
            story.append(Paragraph(f"<b>{activity.get('time', '')}:</b> {activity.get('description', '')}", styles['Activity']))

            location_info = ""
            if 'location' in activity and activity['location'].get('name'):
                location_info = f"Location: {activity['location']['name']}"

            budget_info = ""
            if 'budget_notes' in activity:
                budget_info = f"Budget: {activity['budget_notes']}"

            details_text = f"{location_info} | {budget_info}".strip(" |")
            if details_text:
                story.append(Paragraph(details_text, styles['ActivityDetails']))

            story.append(Spacer(1, 0.1 * inch))

    doc.build(story)

    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

if __name__ == '__main__':
    # Example usage for testing
    mock_itinerary = {
      "itinerary": [
        {
          "day": 1,
          "date": "2024-12-05",
          "theme": "Temple Hopping & City Exploration",
          "activities": [
            {
              "time": "09:00 - 12:00",
              "description": "Visit the ancient temple of Wat Chedi Luang.",
              "location": { "name": "Wat Chedi Luang, Chiang Mai", "lat": 18.7869, "lon": 98.9863 },
              "budget_notes": "Entrance fee: 40 THB"
            },
            {
              "time": "12:30 - 14:00",
              "description": "Lunch at a local Khao Soi restaurant near the temple.",
              "location": { "name": "Khao Soi Khun Yai", "lat": 18.795, "lon": 98.985 },
              "budget_notes": "~80-120 THB per person"
            }
          ]
        }
      ]
    }

    pdf_output = create_itinerary_pdf(mock_itinerary)
    with open("test_itinerary.pdf", "wb") as f:
        f.write(pdf_output)
    print("Test PDF 'test_itinerary.pdf' generated.")
