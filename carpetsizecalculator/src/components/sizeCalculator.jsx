import React, { useState } from "react";
import styles from "./SizeCalculator.css";

function SizeCalculator() {
  const [rooms, setRooms] = useState([{ length: "", width: "", innerRooms: [] }]);
  const [totalArea, setTotalArea] = useState(null);

  const addRoom = () => {
    setRooms([...rooms, { length: "", width: "", innerRooms: [] }]);
  };

  const addInnerRoom = (roomIndex) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].innerRooms.push({ length: "", width: "", innerRooms: [] });
    setRooms(newRooms);
  };

  const handleChange = (roomIndex, field, value, innerRoomIndex = null, innerParentRoomIndex = null) => {
    const newRooms = [...rooms];
    if (innerParentRoomIndex !== null) {
      newRooms[roomIndex].innerRooms[innerParentRoomIndex].innerRooms[innerRoomIndex][field] = value;
    } else if (innerRoomIndex !== null) {
      newRooms[roomIndex].innerRooms[innerRoomIndex][field] = value;
    } else {
      newRooms[roomIndex][field] = value;
    }
    setRooms(newRooms);
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

  return (
    <div className="container">
      <h1>Carpet Size Calculator</h1>
      {rooms.map((room, index) => (
        <div key={index} className="room">
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
            <button
              onClick={() => addInnerRoom(index)}
              className="addButton"
            >
              ➕
            </button>
          </div>
          <button
            onClick={() => addRoom()}
            className="addRoomButton"
          >
            ➕ Add New Room
          </button>
          {room.innerRooms.length > 0 && (
            <div className="innerRooms">
              <h4>Inner Rooms</h4>
              {room.innerRooms.map((innerRoom, innerIndex) => (
                <div key={innerIndex} className={styles.room}>
                  <div className="roomInputRow">
                    <input
                      type="number"
                      placeholder="Length"
                      value={innerRoom.length}
                      onChange={(e) =>
                        handleChange(index, "length", e.target.value, innerIndex)
                      }
                      className="input"
                    />
                    <input
                      type="number"
                      placeholder="Width"
                      value={innerRoom.width}
                      onChange={(e) =>
                        handleChange(index, "width", e.target.value, innerIndex)
                      }
                      className="input"
                    />
                    <button
                      onClick={() => addInnerRoom(innerIndex)}
                      className="addButton"
                    >
                      ➕
                    </button>
                  </div>
                  <button
                    onClick={() => addInnerRoom(index)}
                    className={styles.addRoomButton}
                  >
                    ➕ Add Inner Room
                  </button>
                  {innerRoom.innerRooms.length > 0 && (
                    <div className="innerRooms">
                      {innerRoom.innerRooms.map((innerInnerRoom, innerInnerIndex) => (
                        <div key={innerInnerIndex} className="room">
                          <div className="roomInputRow">
                            <input
                              type="number"
                              placeholder="Length"
                              value={innerInnerRoom.length}
                              onChange={(e) =>
                                handleChange(index, "length", e.target.value, innerInnerIndex, innerIndex)
                              }
                              className="input"
                            />
                            <input
                              type="number"
                              placeholder="Width"
                              value={innerInnerRoom.width}
                              onChange={(e) =>
                                handleChange(index, "width", e.target.value, innerInnerIndex, innerIndex)
                              }
                              className="input"
                            />
                            <button
                              onClick={() => addInnerRoom(innerInnerIndex)}
                              className="addButton"
                            >
                              ➕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
