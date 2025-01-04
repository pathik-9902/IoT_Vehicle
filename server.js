const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

let lastTiltDetected = false;
let lastAccidentDetected = false;
let lastTemperatureTriggered = false;
let lastFlameDetected = false;
let lastRFIDDetected = null;

let sensorData = {
    gpsData: null,
    temperatureData: null,
    flameData: null,
    adxlData: null,
    rfidData: null,
};

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

app.post('/gps-data', (req, res) => {
    const { latitude, longitude, altitude, speed } = req.body;

    if (latitude !== undefined && longitude !== undefined && altitude !== undefined && speed !== undefined) {
        sensorData.gpsData = { latitude, longitude, altitude, speed };
        console.log(`GPS Data - Lat: ${latitude}, Lon: ${longitude}, Alt: ${altitude}, Speed: ${speed}`);
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
            console.log(`Temperature Alert: ${temperature}°C`);
        } else if (temperature === 'normal' && lastTemperatureTriggered) {
            sensorData.temperatureData = { temperature: 'normal' };
            lastTemperatureTriggered = false;
            console.log('Temperature normalized');
        }
        sendUpdateToClients();
        res.status(200).send('Temperature data received');
    } else {
        res.status(400).send('Invalid temperature data');
    }
});

app.post('/flame-alert', (req, res) => {
    const { flameDetected } = req.body;

    if (typeof flameDetected === 'boolean') {
        if (flameDetected && !lastFlameDetected) {
            sensorData.flameData = { flameDetected };
            lastFlameDetected = true;
            console.log('Flame detected');
        } else if (!flameDetected && lastFlameDetected) {
            sensorData.flameData = { flameDetected: false };
            lastFlameDetected = false;
            console.log('Flame no longer detected');
        }
        sendUpdateToClients();
        res.status(200).send('Flame detection data received');
    } else {
        res.status(400).send('Invalid flame detection data');
    }
});

app.post('/adxl-alert', (req, res) => {
    const { tiltDetected, accidentDetected } = req.body;

    if (tiltDetected === undefined && accidentDetected === undefined) {
        return res.status(400).send('Invalid sensor data');
    }

    let status = 'none';
    let significantChange = false;

    // Determine tilt state
    if (tiltDetected && !lastTiltDetected) {
        status = 'tilt';
        significantChange = true;
    } else if (!tiltDetected && lastTiltDetected) {
        status = 'tilt-normal';
        significantChange = true;
    }
    lastTiltDetected = tiltDetected;

    // Determine accident state
    if (accidentDetected && !lastAccidentDetected) {
        status = significantChange ? 'both' : 'impact';
        significantChange = true;
    } else if (!accidentDetected && lastAccidentDetected) {
        status = 'impact-normal';
        significantChange = true;
    }
    lastAccidentDetected = accidentDetected;

    if (significantChange) {
        sensorData.adxlData = { status };
        console.log(`ADXL Update: Tilt - ${tiltDetected}, Accident - ${accidentDetected}, Status - ${status}`);
        sendUpdateToClients();
        res.json({ status });
    } else {
        res.status(200).send('No significant change');
    }
});

app.post('/rfid-alert', (req, res) => {
    const { rfidTagId } = req.body;

    if (rfidTagId !== undefined) {
        if (rfidTagId !== lastRFIDDetected) {
            sensorData.rfidData = { rfidTagId };
            lastRFIDDetected = rfidTagId;
            console.log(`RFID Tag Detected: ${rfidTagId}`);
            sendUpdateToClients();
            res.status(200).send('RFID data received');
        } else {
            res.status(200).send('RFID tag already detected');
        }
    } else {
        res.status(400).send('Invalid RFID data');
    }
});

app.get('/sensor-data', (req, res) => {
    res.json(sensorData);
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

app.use((err, req, res, next) => {
    console.error('Internal error:', err.stack);
    res.status(500).send('Something broke!');
});
