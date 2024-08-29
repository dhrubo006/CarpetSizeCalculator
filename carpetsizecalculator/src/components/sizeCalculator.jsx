import React, { useState } from "react";
import "./SizeCalculator.css"; // Assuming your CSS is correctly imported

function SizeCalculator() {
  const [rooms, setRooms] = useState([{ length: "", width: "", innerRooms: [] }]);
  const [totalArea, setTotalArea] = useState(null);

  const addRoom = () => {
    setRooms([...rooms, { length: "", width: "", innerRooms: [] }]);
  };

  const addInnerRoom = (parentIndex) => {
    const updatedRooms = rooms.map((room, index) => {
      if (index === parentIndex) {
        return { ...room, innerRooms: [...room.innerRooms, { length: "", width: "", innerRooms: [] }] };
      }
      return room;
    });
    setRooms(updatedRooms);
  };

  const handleChange = (roomIndex, field, value, innerRoomIndex = null, innerParentRoomIndex = null) => {
    const updatedRooms = [...rooms];
    if (innerParentRoomIndex !== null) {
      updatedRooms[roomIndex].innerRooms[innerParentRoomIndex].innerRooms[innerRoomIndex][field] = value;
    } else if (innerRoomIndex !== null) {
      updatedRooms[roomIndex].innerRooms[innerRoomIndex][field] = value;
    } else {
      updatedRooms[roomIndex][field] = value;
    }
    setRooms(updatedRooms);
  };

  const calculate = async () => {
    const response = await fetch("http://localhost:8000/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rooms }),
    });
    const data = await response.json();
    setTotalArea(data.total_area);
  };

  const renderInnerRooms = (innerRooms, parentIndex, roomNumber) => {
    return innerRooms.map((innerRoom, innerIndex) => (
      <div key={innerIndex} className="room">
        <h4>Inner Room {`${roomNumber}.${innerIndex + 1}`}</h4>
        <div className="roomInputRow">
          <input
            type="number"
            placeholder="Length"
            value={innerRoom.length}
            onChange={(e) => handleChange(parentIndex, "length", e.target.value, innerIndex)}
            className="input"
          />
          <input
            type="number"
            placeholder="Width"
            value={innerRoom.width}
            onChange={(e) => handleChange(parentIndex, "width", e.target.value, innerIndex)}
            className="input"
          />
          <button onClick={() => addInnerRoom(innerIndex)} className="addButton">
            ➕
          </button>
        </div>
        <button onClick={() => addInnerRoom(parentIndex)} className="addRoomButton">
          ➕ Add Inner Room
        </button>
        {innerRoom.innerRooms.length > 0 && (
          <div className="innerRooms">
            {renderInnerRooms(innerRoom.innerRooms, parentIndex, `${roomNumber}.${innerIndex + 1}`)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="container">
      <h1>Carpet Size Calculator</h1>
      {rooms.map((room, index) => (
        <div key={index} className="room">
          <h3>Room {index + 1}</h3>
          <div className="roomInputRow">
            <input
              type="number"
              placeholder="Length"
              value={room.length}
              onChange={(e) => handleChange(index, "length", e.target.value)}
              className="input"
            />
            <input
              type="number"
              placeholder="Width"
              value={room.width}
              onChange={(e) => handleChange(index, "width", e.target.value)}
              className="input"
            />
            <button onClick={() => addInnerRoom(index)} className="addButton">
              ➕
            </button>
          </div>
          <button onClick={addRoom} className="addRoomButton">
            ➕ Add New Room
          </button>
          {room.innerRooms.length > 0 && (
            <div className="innerRooms">
              {renderInnerRooms(room.innerRooms, index, index + 1)}
            </div>
          )}
        </div>
      ))}
      <button onClick={calculate} className="calculateButton">
        Calculate
      </button>
      {totalArea !== null && (
        <div className="result">
          Total Carpet Area: {totalArea} sq units
        </div>
      )}
    </div>
  );
}

export default SizeCalculator;
