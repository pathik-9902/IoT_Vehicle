import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./pageC.css";

function PageC() {
  const navigate = useNavigate(); // Initialize navigate object

  const [modals, setModals] = useState({
    vehicleLocationModal: false,
    trafficRulesModal: false,
    documentsModal: false,
    alertsModal: false,
    vehicleHealthModal: false,
    driverBehaviorModal: false,
    historicalDataModal: false,
  });

  const [data, setData] = useState({
    vehicleLocation: "Location: Retrieving...",
    signalRules: "Signal Rules: Checking...",
    rashDriving: "Rash Driving: Checking...",
    speedRestriction: "Speed Restriction: Checking...",
    seatbelt: "Seatbelt: Checking...",
    insuranceStatus: "Insurance: Verifying...",
    insuranceAlert: "Alert: Fake/False Insurance Claims",
    rcStatus: "Registration Certificate: Verifying...",
    pucStatus: "PUC Status: Verifying...",
    fitnessCertificate: "Fitness Certificate: Verifying...",
    taxPayment: "Tax Payment Status: Verifying...",
    cameraFeed: "Camera Feed: Not Available",
    fuelLevel: "Fuel Level: Checking...",
    engineStatus: "Engine Status: Checking...",
    batteryHealth: "Battery Health: Checking...",
    alerts: "Alerts: No alerts at this moment.",
    harshBraking: "Harsh Braking: Checking...",
    rapidAcceleration: "Rapid Acceleration: Checking...",
    mobileUsage: "Mobile Usage While Driving: Checking...",
    historicalViolations: "Historical Violations: Retrieving data...",
    locationHistory: "Location History: Retrieving data...",
  });

  useEffect(() => {
    // Mock data fetched from an API
    const fetchedData = {
      vehicleLocation: "Location: Latitude 23.0225, Longitude 72.5714",
      signalRules: "Signal Rules: Violated at Intersection A",
      rashDriving: "Rash Driving: Detected on Highway",
      speedRestriction: "Speed: 120 km/h (Over Speeding)",
      seatbelt: "Seatbelt: Not Worn",
      insuranceStatus: "Insurance: Active",
      insuranceAlert: "No fake/false claims detected.",
      rcStatus: "Registration Certificate: Valid",
      pucStatus: "PUC Status: Valid",
      fitnessCertificate: "Fitness Certificate: Valid",
      taxPayment: "Tax Payment Status: Paid",
      cameraFeed: "Camera Feed: Live Feed Available",
      fuelLevel: "Fuel Level: 70%",
      engineStatus: "Engine Status: Good",
      batteryHealth: "Battery Health: Normal",
      alerts: "Alerts: Vehicle entered restricted zone.",
      harshBraking: "Harsh Braking: Detected 3 times today",
      rapidAcceleration: "Rapid Acceleration: Detected 2 times today",
      mobileUsage: "Mobile Usage While Driving: Detected",
      historicalViolations:
        "Historical Violations: 5 signal violations in the last month",
      locationHistory: "Location History: Available for the last 30 days",
    };

    // Simulating an API call
    setTimeout(() => {
      setData(fetchedData);
    }, 1000);
  }, []);

  const openModal = (modalId) => {
    setModals({ ...modals, [modalId]: true });
  };

  const closeModal = (modalId) => {
    setModals({ ...modals, [modalId]: false });
  };

  const handleClick = () => {
    navigate("/pageA"); // Use navigate to navigate to '/pageA'
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Vehicle Monitoring Portal</h1>
      </header>
      <main className="page-main">
        <Section
          title="Locating the Stolen Vehicle"
          onClick={() => {
            openModal("vehicleLocationModal");
            handleClick(); 
          }}
        />
        <Section
          title="Traffic Rules Analysis"
          onClick={() => openModal("trafficRulesModal")}
        />
        <Section
          title="Documents"
          onClick={() => openModal("documentsModal")}
        />
        <Section
          title="Alerts and Warnings"
          onClick={() => openModal("alertsModal")}
        />
        <Section
          title="Vehicle Health Monitoring"
          onClick={() => openModal("vehicleHealthModal")}
        />
        <Section
          title="Driver Behavior Analysis"
          onClick={() => openModal("driverBehaviorModal")}
        />
        <Section
          title="Historical Data and Trends"
          onClick={() => openModal("historicalDataModal")}
        />
      </main>

      <Modal
        isOpen={modals.vehicleLocationModal}
        onClose={() => closeModal("vehicleLocationModal")}
        title="Locating the Stolen Vehicle"
      >
        <p>{data.vehicleLocation}</p>
      </Modal>

      <Modal
        isOpen={modals.trafficRulesModal}
        onClose={() => closeModal("trafficRulesModal")}
        title="Traffic Rules Analysis"
      >
        <p>{data.signalRules}</p>
        <p>{data.rashDriving}</p>
        <p>{data.speedRestriction}</p>
        <p>{data.seatbelt}</p>
      </Modal>

      <Modal
        isOpen={modals.documentsModal}
        onClose={() => closeModal("documentsModal")}
        title="Documents Validity"
      >
        <p>{data.insuranceStatus}</p>
        <p>{data.insuranceAlert}</p>
        <p>{data.rcStatus}</p>
        <p>{data.pucStatus}</p>
        <p>{data.fitnessCertificate}</p>
        <p>{data.taxPayment}</p>
      </Modal>

      <Modal
        isOpen={modals.alertsModal}
        onClose={() => closeModal("alertsModal")}
        title="Alerts and Warnings"
      >
        <p>{data.alerts}</p>
      </Modal>

      <Modal
        isOpen={modals.vehicleHealthModal}
        onClose={() => closeModal("vehicleHealthModal")}
        title="Vehicle Health Monitoring"
      >
        <p>{data.fuelLevel}</p>
        <p>{data.engineStatus}</p>
        <p>{data.batteryHealth}</p>
        <p>{data.cameraFeed}</p>
      </Modal>

      <Modal
        isOpen={modals.driverBehaviorModal}
        onClose={() => closeModal("driverBehaviorModal")}
        title="Driver Behavior Analysis"
      >
        <p>{data.harshBraking}</p>
        <p>{data.rapidAcceleration}</p>
        <p>{data.mobileUsage}</p>
      </Modal>

      <Modal
        isOpen={modals.historicalDataModal}
        onClose={() => closeModal("historicalDataModal")}
        title="Historical Data and Trends"
      >
        <p>{data.historicalViolations}</p>
        <p>{data.locationHistory}</p>
      </Modal>
    </div>
  );
}

function Section({ title, onClick }) {
  return (
    <div className="section-container">
      <button className="section-button" onClick={onClick}>
        {title}
      </button>
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default PageC;
