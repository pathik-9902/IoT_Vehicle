const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// State Variables
let lastTiltDetected = false;
let lastAccidentDetected = false;
let lastTemperatureTriggered = false;
let lastRFIDDetected = null;

let accidentConfirmed = false;

let sensorData = {
    gpsData: null,
    temperatureData: null,
    flameData: null,
    adxlData: null,
    rfidData: null,
    accidentDetected: false,
};

// WebSocket Server Setup
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket');
    ws.on('close', () => console.log('Client disconnected'));
});

function sendUpdateToClients() {
    const message = JSON.stringify(sensorData);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Accident Evaluation Logic
function evaluateAccident() {
    const { gpsData, adxlData, flameData, temperatureData } = sensorData;

    if (
        gpsData?.suddenStop ||
        adxlData?.status === 'accident' ||
        (flameData?.flameDetected && temperatureData?.temperature !== 'normal')
    ) {
        accidentConfirmed = true;
        sensorData.accidentDetected = true;
        console.log('Accident Confirmed based on sensor data.');
    } else {
        accidentConfirmed = false;
        sensorData.accidentDetected = false;
    }
}

// Routes
app.post('/gps-data', (req, res) => {
    const { latitude, longitude, altitude, speed } = req.body;

    if (latitude !== undefined && longitude !== undefined && altitude !== undefined && speed !== undefined) {
        const suddenStop = speed < 5 && sensorData.gpsData && sensorData.gpsData.speed > 30;
        sensorData.gpsData = { latitude, longitude, altitude, speed, suddenStop };
        console.log(`[GPS] Lat: ${latitude}, Lon: ${longitude}, Alt: ${altitude}, Speed: ${speed}, Sudden Stop: ${suddenStop}`);
        evaluateAccident();
        sendUpdateToClients();
        res.status(200).send('GPS Data received');
    } else {
        res.status(400).send('Invalid GPS data');
    }
});

app.post('/temperature-alert', (req, res) => {
    const { temperature } = req.body;

    if (temperature !== undefined) {
        if (temperature !== 'normal' && !lastTemperatureTriggered) {
            sensorData.temperatureData = { temperature };
            lastTemperatureTriggered = true;
            console.log(`[TEMP] Alert: ${temperature}°C`);
        } else if (temperature === 'normal' && lastTemperatureTriggered) {
            sensorData.temperatureData = { temperature: 'normal' };
            lastTemperatureTriggered = false;
            console.log('[TEMP] Normalized');
        }
        evaluateAccident();
        sendUpdateToClients();
        res.status(200).send('Temperature data received');
    } else {
        res.status(400).send('Invalid temperature data');
    }
});

app.post('/flame-alert', (req, res) => {
    const { flameDetected } = req.body;

    if (typeof flameDetected === 'boolean') {
        sensorData.flameData = { flameDetected };
        console.log(`[FLAME] Detection: ${flameDetected}`);
        evaluateAccident();
        sendUpdateToClients();
        res.status(200).send('Flame detection data received');
    } else {
        res.status(400).send('Invalid flame detection data');
    }
});

app.post('/adxl-alert', (req, res) => {
    const { tiltDetected, accidentDetected, impactForce } = req.body;

    if (tiltDetected === undefined && accidentDetected === undefined && impactForce === undefined) {
        return res.status(400).send('Invalid sensor data');
    }

    let status = 'none';
    let significantChange = false;
    let isAccident = accidentDetected || (impactForce !== undefined && impactForce > 5.0);

    if (tiltDetected && !lastTiltDetected) {
        status = 'tilt';
        significantChange = true;
    } else if (!tiltDetected && lastTiltDetected) {
        status = 'tilt-normal';
        significantChange = true;
    }
    lastTiltDetected = tiltDetected;

    if (isAccident && tiltDetected) {
        sensorData.adxlData = { status: 'accident', impactForce, tiltDetected };
        console.log(`[ADXL] Accident Detected: Impact - ${impactForce}, Tilt - ${tiltDetected}`);
    } else if (!isAccident && lastAccidentDetected) {
        status = 'impact-normal';
        significantChange = true;
    }

    lastAccidentDetected = isAccident;

    if (significantChange) {
        sensorData.adxlData = { status, impactForce, tiltDetected };
        console.log(`[ADXL] Update: Impact - ${impactForce}, Tilt - ${tiltDetected}, Status - ${status}`);
    }

    evaluateAccident();
    sendUpdateToClients();
    res.status(200).send('ADXL data processed');
});

app.get('/sensor-data', (req, res) => {
    res.json(sensorData);
});

// Start Server with WebSocket Support
const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack);
    res.status(500).send('Something broke!');
});
