import React from 'react';
import './pageD.css'

function PageD({ data }) {
  const { gpsData, temperatureData, flameData, adxlData } = data;

  return (
      <div className="data-section">
        <h2>GPS Data</h2>
        {gpsData ? (
          <div>
            <p>Latitude: {gpsData.latitude}</p>
            <p>Longitude: {gpsData.longitude}</p>
            <p>Altitude: {gpsData.altitude}</p>
            <p>Speed: {gpsData.speed} km/h</p>
          </div>
        ) : (
          <p>No GPS data available</p>
        )}
        <h2>Temperature Data</h2>
        {temperatureData ? (
          <p>Temperature: {temperatureData.temperature}°C</p>
        ) : (
          <p>No temperature data available</p>
        )}
        <h2>Flame Data</h2>
        {flameData ? (
          <p>Flame Detected: {flameData.flameDetected ? 'Yes' : 'No'}</p>
        ) : (
          <p>No flame data available</p>
        )}
        <h2>Accelerometer Data</h2>
        {adxlData ? (
          <p>Status: {adxlData.status}</p>
        ) : (
          <p>No accelerometer data available</p>
        )}
      </div>
  );
}

export default PageD;
