import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MedicineMap from "./MedicineMap";
import MedicineAgreedMap from "./MedicineAgreedMap";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";
import "../../Button.css";

const MedicineForm = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [locationData, setLocationData] = useState(null);
  const navigate = useNavigate();

  const navigateToBattery = () => {
    navigate("/battery");
  };
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const userCity = localStorage.getItem("userCity");
        const response = await axios.get(
          `http://3.39.190.90/api/location/medicine`,
          {
            params: {
              state: "대구",
              city: userCity,
            },
          }
        );
        setLocationData(response.data);
        console.log("Location data fetched:", response.data);
      } catch (error) {
        console.error("Failed to fetch location data", error);
      }
    };

    if (isLoggedIn) {
      fetchLocationData();
    }
  }, [isLoggedIn]);

  return (
    <div>
      <h1>대구광역시 수거함 위치 ＞</h1>
      <div
        className="button-container"
        style={{ marginTop: "40px", marginBottom: "20px" }}
      >
        <button
          className="write-green-button"
          style={{ width: "220px", marginLeft: "0px" }}
        >
          폐의약품 수거함
        </button>
        <button
          className="gray-button"
          onClick={navigateToBattery}
          style={{ marginLeft: "10px" }}
        >
          폐건전지/폐형광등 수거함
        </button>
      </div>
      <MedicineMap />
    </div>
  );
};

export default MedicineForm;