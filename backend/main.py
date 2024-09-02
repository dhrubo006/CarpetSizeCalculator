from fastapi import FastAPI, Response
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openpyxl import Workbook
from io import BytesIO

app = FastAPI()


# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Room(BaseModel):
    """
    Room model representing the dimensions of a single room.

    Attributes:
    - length: The length of the room (float).
    - width: The width of the room (float).
    """

    length: float
    width: float


class CarpetSizeRequest(BaseModel):
    """
    CarpetSizeRequest model representing the request body structure for calculating carpet size.

    Attributes:
    - rooms: A list of Room objects representing the dimensions of each room.
    """

    rooms: list[Room]


@app.post("/calculate")
async def calculate_carpet_size(data: CarpetSizeRequest):
    """
    Endpoint to calculate the total carpet area required for a list of rooms.

    Args:
    - data (CarpetSizeRequest): The request body containing a list of rooms with their dimensions.

    Returns:
    - dict: A JSON response containing the total carpet area.

    Example:
    ```
    POST /calculate
    {
        "rooms": [
            {"length": 5.0, "width": 3.0},
            {"length": 4.5, "width": 2.5}
        ]
    }
    Response:
    {
        "total_area": 26.25
    }
    ```
    """
    total_area = sum(room.length * room.width for room in data.rooms)
    return {"total_area": total_area}


@app.post("/download")
async def download_carpet_size_excel(data: CarpetSizeRequest):
    # Calculate total area
    total_area = sum(room.length * room.width for room in data.rooms)

    # Create an Excel workbook and sheet
    wb = Workbook()
    ws = wb.active
    ws.title = "Carpet Size"

    # Write header
    ws.append(["Room", "Length", "Width", "Area"])

    # Write data
    for i, room in enumerate(data.rooms):
        area = room.length * room.width
        ws.append([f"Room {i + 1}", room.length, room.width, area])

    # Write total area
    ws.append(["", "", "Total Area", total_area])

    # Save the workbook to a BytesIO object
    file_stream = BytesIO()
    wb.save(file_stream)
    file_stream.seek(0)

    # Return the Excel file as a response
    headers = {
        "Content-Disposition": 'attachment; filename="carpet_area_result.xlsx"',
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
    return Response(file_stream.getvalue(), headers=headers)
