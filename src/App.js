import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageA from "./pages/pageA";
import PageB from "./pages/pageB";
import PageC from "./pages/pageC";
import PageD from "./pages/pageD";
import Navbar from "./pages/Navbar";
import "./App.css";
import ReconnectingWebSocket from "reconnecting-websocket";

function App() {
  const [sensorData, setSensorData] = useState({
    gpsData: null,
    temperatureData: null,
    flameData: null,
    adxlData: null,
  });

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new ReconnectingWebSocket("wss://iot-vehicle.onrender.com/");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSensorData(data);
    };

    // Clean up on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <Router>
        <Navbar />
        <div className="app">
          <Routes>
            <Route path="/pageA" element={<PageA data={sensorData} />} />
            <Route path="/pageB" element={<PageB data={sensorData} />} />
            <Route path="/pageC" element={<PageC data={sensorData} />} />
            <Route path="/pageD" element={<PageD data={sensorData} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
