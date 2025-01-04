import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './pageA.css';

function PageA({ data }) {
  const { gpsData, temperatureData, flameData, adxlData, historicalData, accidentDetected } = data;
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geofenceRef = useRef(null);
  const [message, setMessage] = useState('');
  const [isAccident, setIsAccident] = useState(false);

  useEffect(() => {
    const mapElement = mapContainerRef.current;
    if (!mapElement) {
      console.error("Map container not found");
      return;
    }

    if (!mapRef.current) {
      mapRef.current = L.map(mapElement).setView([23.2156, 72.6369], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const gandhinagarGeofenceCoordinates = [
      [23.3672, 72.3995],
      [23.3672, 72.7120],
      [23.1375, 72.7120],
      [23.1375, 72.3995],
      [23.2223, 72.3667],
      [23.2925, 72.3667],
      [23.2325, 72.4991],
      [23.2825, 72.4991],
      [23.2825, 72.3995]
    ];

    if (!geofenceRef.current) {
      geofenceRef.current = L.polygon(gandhinagarGeofenceCoordinates, {
        color: 'red',
        weight: 2,
        fillColor: '#f03',
        fillOpacity: 0.2,
      }).addTo(mapRef.current);

      geofenceRef.current.bindPopup("Gandhinagar District Geofence Area");
    }

    if (gpsData) {
      const { latitude, longitude } = gpsData;

      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        markerRef.current = L.marker([latitude, longitude], { icon: customIcon }).addTo(mapRef.current);
      }

      mapRef.current.setView([latitude, longitude], 18);

      const point = L.latLng(latitude, longitude);
      if (geofenceRef.current.getBounds().contains(point)) {
        setMessage('The location is within the geofence area.');
      } else {
        setMessage('The location is outside the geofence area!');
      }
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (geofenceRef.current) {
        geofenceRef.current.remove();
        geofenceRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [gpsData]);

  useEffect(() => {
    if (accidentDetected) {
      setIsAccident(true);
      setMessage("Accident Detected! Please check the vehicle's status.");
    } else {
      setIsAccident(false);
    }
  }, [accidentDetected]);

  return (
    <div className="page-a-container">
      <h1>Page A</h1>
      <div className="map-section">
        <div ref={mapContainerRef} className="map-container"></div>
        <div className="message">{message}</div>
      </div>

      <div className="data-section">
        <h2>GPS Data</h2>
        {gpsData ? (
          <div>
            <p><strong>Latitude:</strong> {gpsData.latitude}</p>
            <p><strong>Longitude:</strong> {gpsData.longitude}</p>
            <p><strong>Altitude:</strong> {gpsData.altitude}</p>
            <p><strong>Speed:</strong> {gpsData.speed} km/h</p>
            <p><strong>Accuracy:</strong> {calculateAccuracy(gpsData, historicalData)}</p>
          </div>
        ) : (
          <p>No GPS data available</p>
        )}

        <h2>Temperature Data</h2>
        {temperatureData ? (
          <p><strong>Temperature:</strong> {temperatureData.temperature}°C</p>
        ) : (
          <p>No temperature data available</p>
        )}

        <h2>Flame Data</h2>
        {flameData ? (
          <p><strong>Flame Detected:</strong> {flameData.flameDetected ? 'Yes' : 'No'}</p>
        ) : (
          <p>No flame data available</p>
        )}

        <h2>Accelerometer Data</h2>
        {adxlData ? (
          <p><strong>Status:</strong> {adxlData.status} || <strong>Accident Detected:</strong> {accidentDetected ? 'Yes' : 'No'}</p>
        ) : (
          <p>No accelerometer data available</p>
        )}
      </div>

      {isAccident && (
        <div className="accident-warning">
          <p><strong>Alert:</strong> Accident detected. Please take immediate action!</p>
        </div>
      )}
    </div>
  );
}

function calculateAccuracy(gpsData, historicalData = []) {
  if (!gpsData) {
    return "No GPS data available to calculate accuracy";
  }

  if (historicalData.length === 0) {
    return "Estimated accuracy: 5 meters (default estimate)";
  }

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
  }

  const distances = historicalData.map(point =>
    haversineDistance(gpsData.latitude, gpsData.longitude, point.latitude, point.longitude)
  );

  const totalDistance = distances.reduce((sum, dist) => sum + dist, 0);
  const averageDistance = distances.length > 0 ? totalDistance / distances.length : 0;

  return `Estimated accuracy: ${averageDistance.toFixed(2)} meters`;
}

export default PageA;
