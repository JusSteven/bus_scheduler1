const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// JSON file path
const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database file
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ buses: [] }));
    console.log('✅ Database file created');
  }
}

// Read database
function readDB() {
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

// Write database
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Initialize on startup
initDB();
console.log('✅ JSON database ready');

// Get all buses
app.get('/api/buses', (req, res) => {
  try {
    const db = readDB();
    res.json(db.buses.filter(b => b.status === 'Active'));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
});

// Register new bus
app.post('/api/buses', (req, res) => {
  try {
    const { driverName, numberPlate, route, conductorPhone } = req.body;
    const db = readDB();
    
    const newBus = {
      id: Date.now(),
      driver_name: driverName,
      number_plate: numberPlate,
      route,
      conductor_phone: conductorPhone,
      current_location: 'CBD',
      next_departure: null,
      status: 'Active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    db.buses.push(newBus);
    writeDB(db);
    
    res.status(201).json(newBus);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to register bus' });
  }
});

// Update bus departure
app.put('/api/buses/:id/departure', (req, res) => {
  try {
    const { id } = req.params;
    const { departureTime, location } = req.body;
    const db = readDB();
    
    const busIndex = db.buses.findIndex(b => b.id == id);
    if (busIndex !== -1) {
      db.buses[busIndex].next_departure = departureTime;
      db.buses[busIndex].current_location = location;
      db.buses[busIndex].status = 'Updated';
      db.buses[busIndex].updated_at = new Date().toISOString();
      writeDB(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Bus not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update bus' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
