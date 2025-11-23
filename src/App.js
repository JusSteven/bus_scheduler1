import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Calendar, MessageCircle, Send, X, User, Bus, Navigation, Moon, Sun, UserPlus, Edit3 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('schedules');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your bus assistant.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [bookings, setBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [registeredBuses, setRegisteredBuses] = useState([]);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [isDriverMode, setIsDriverMode] = useState(false);
  const chatEndRef = useRef(null);

  // HARDCODED ROUTES WITH DIVERSIFIED PHONE NUMBERS
  const busRoutes = [
    {
      id: 1,
      name: 'Thika Express',
      route: 'CBD → Thika',
      schedule: [
        { time: '05:30', phone: '+254712345678' },
        { time: '06:00', phone: '+254723456789' },
        { time: '06:30', phone: '+254734567890' },
        { time: '07:00', phone: '+254745678901' },
        { time: '07:30', phone: '+254756789012' },
        { time: '08:00', phone: '+254767890123' },
        { time: '08:30', phone: '+254778901234' },
        { time: '09:00', phone: '+254789012345' },
        { time: '09:30', phone: '+254712345678' },
        { time: '10:00', phone: '+254723456789' },
        { time: '10:30', phone: '+254734567890' },
        { time: '11:00', phone: '+254745678901' },
        { time: '11:30', phone: '+254756789012' },
        { time: '12:00', phone: '+254767890123' },
        { time: '12:30', phone: '+254778901234' },
        { time: '13:00', phone: '+254789012345' },
        { time: '13:30', phone: '+254712345678' },
        { time: '14:00', phone: '+254723456789' },
        { time: '14:30', phone: '+254734567890' },
        { time: '15:00', phone: '+254745678901' },
        { time: '15:30', phone: '+254756789012' },
        { time: '16:00', phone: '+254767890123' },
        { time: '16:30', phone: '+254778901234' },
        { time: '17:00', phone: '+254789012345' },
        { time: '17:30', phone: '+254712345678' },
        { time: '18:00', phone: '+254723456789' },
        { time: '18:30', phone: '+254734567890' },
        { time: '19:00', phone: '+254745678901' },
        { time: '19:30', phone: '+254756789012' },
        { time: '20:00', phone: '+254767890123' }
      ],
      price: 80,
      duration: '60 min',
      stops: ['CBD', 'Ngara', 'Allsops', 'Githurai', 'Bypass', 'Ruiru', 'Kimbo', 'Juja', 'Thika']
    },
    {
      id: 2,
      name: 'Ruiru Shuttle',
      route: 'CBD → Ruiru',
      schedule: [
        { time: '05:30', phone: '+254798765432' },
        { time: '06:00', phone: '+254787654321' },
        { time: '06:30', phone: '+254776543210' },
        { time: '07:00', phone: '+254765432109' },
        { time: '07:30', phone: '+254754321098' },
        { time: '08:00', phone: '+254743210987' },
        { time: '08:30', phone: '+254732109876' },
        { time: '09:00', phone: '+254721098765' },
        { time: '09:30', phone: '+254798765432' },
        { time: '10:00', phone: '+254787654321' },
        { time: '10:30', phone: '+254776543210' },
        { time: '11:00', phone: '+254765432109' },
        { time: '11:30', phone: '+254754321098' },
        { time: '12:00', phone: '+254743210987' },
        { time: '12:30', phone: '+254732109876' },
        { time: '13:00', phone: '+254721098765' },
        { time: '13:30', phone: '+254798765432' },
        { time: '14:00', phone: '+254787654321' },
        { time: '14:30', phone: '+254776543210' },
        { time: '15:00', phone: '+254765432109' },
        { time: '15:30', phone: '+254754321098' },
        { time: '16:00', phone: '+254743210987' },
        { time: '16:30', phone: '+254732109876' },
        { time: '17:00', phone: '+254721098765' },
        { time: '17:30', phone: '+254798765432' },
        { time: '18:00', phone: '+254787654321' },
        { time: '18:30', phone: '+254776543210' },
        { time: '19:00', phone: '+254765432109' },
        { time: '19:30', phone: '+254754321098' },
        { time: '20:00', phone: '+254743210987' }
      ],
      price: 60,
      duration: '45 min',
      stops: ['CBD', 'Ngara', 'Allsops', 'Githurai', 'Bypass', 'Ruiru']
    },
    {
      id: 3,
      name: 'Juja Direct',
      route: 'CBD → Juja',
      schedule: [
        { time: '05:30', phone: '+254711222333' },
        { time: '06:00', phone: '+254722333444' },
        { time: '06:30', phone: '+254733444555' },
        { time: '07:00', phone: '+254744555666' },
        { time: '07:30', phone: '+254755666777' },
        { time: '08:00', phone: '+254766777888' },
        { time: '08:30', phone: '+254777888999' },
        { time: '09:00', phone: '+254788999000' },
        { time: '09:30', phone: '+254711222333' },
        { time: '10:00', phone: '+254722333444' },
        { time: '10:30', phone: '+254733444555' },
        { time: '11:00', phone: '+254744555666' },
        { time: '11:30', phone: '+254755666777' },
        { time: '12:00', phone: '+254766777888' },
        { time: '12:30', phone: '+254777888999' },
        { time: '13:00', phone: '+254788999000' },
        { time: '13:30', phone: '+254711222333' },
        { time: '14:00', phone: '+254722333444' },
        { time: '14:30', phone: '+254733444555' },
        { time: '15:00', phone: '+254744555666' },
        { time: '15:30', phone: '+254755666777' },
        { time: '16:00', phone: '+254766777888' },
        { time: '16:30', phone: '+254777888999' },
        { time: '17:00', phone: '+254788999000' },
        { time: '17:30', phone: '+254711222333' },
        { time: '18:00', phone: '+254722333444' },
        { time: '18:30', phone: '+254733444555' },
        { time: '19:00', phone: '+254744555666' },
        { time: '19:30', phone: '+254755666777' },
        { time: '20:00', phone: '+254766777888' }
      ],
      price: 70,
      duration: '50 min',
      stops: ['CBD', 'Ngara', 'Allsops', 'Githurai', 'Bypass', 'Ruiru', 'Kimbo', 'Juja']
    },
    {
      id: 4,
      name: 'Githurai Local',
      route: 'CBD → Githurai',
      schedule: [
        { time: '05:30', phone: '+254799888777' },
        { time: '06:00', phone: '+254788777666' },
        { time: '06:30', phone: '+254777666555' },
        { time: '07:00', phone: '+254766555444' },
        { time: '07:30', phone: '+254755444333' },
        { time: '08:00', phone: '+254744333222' },
        { time: '08:30', phone: '+254733222111' },
        { time: '09:00', phone: '+254722111000' },
        { time: '09:30', phone: '+254799888777' },
        { time: '10:00', phone: '+254788777666' },
        { time: '10:30', phone: '+254777666555' },
        { time: '11:00', phone: '+254766555444' },
        { time: '11:30', phone: '+254755444333' },
        { time: '12:00', phone: '+254744333222' },
        { time: '12:30', phone: '+254733222111' },
        { time: '13:00', phone: '+254722111000' },
        { time: '13:30', phone: '+254799888777' },
        { time: '14:00', phone: '+254788777666' },
        { time: '14:30', phone: '+254777666555' },
        { time: '15:00', phone: '+254766555444' },
        { time: '15:30', phone: '+254755444333' },
        { time: '16:00', phone: '+254744333222' },
        { time: '16:30', phone: '+254733222111' },
        { time: '17:00', phone: '+254722111000' },
        { time: '17:30', phone: '+254799888777' },
        { time: '18:00', phone: '+254788777666' },
        { time: '18:30', phone: '+254777666555' },
        { time: '19:00', phone: '+254766555444' },
        { time: '19:30', phone: '+254755444333' },
        { time: '20:00', phone: '+254744333222' }
      ],
      price: 40,
      duration: '30 min',
      stops: ['CBD', 'Ngara', 'Allsops', 'Githurai']
    }
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: -1.2921, lng: 36.8219 })
      );
    }
  }, []);

  useEffect(() => {
    if (isDriverMode) {
      fetchBuses();
    }
  }, [isDriverMode]);

  const fetchBuses = async () => {
    try {
      const response = await fetch(`${API_URL}/buses`);
      const buses = await response.json();
      setRegisteredBuses(buses.map(bus => ({
        ...bus,
        driverName: bus.driver_name,
        numberPlate: bus.number_plate,
        conductorPhone: bus.conductor_phone,
        currentLocation: bus.current_location,
        nextDeparture: bus.next_departure,
        lastUpdated: new Date(bus.updated_at).toLocaleString()
      })));
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const handleBooking = (route, scheduleItem) => {
    setSelectedBooking({ 
      route, 
      time: scheduleItem.time, 
      conductorPhone: scheduleItem.phone 
    });
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    const booking = {
      id: Date.now(),
      route: selectedBooking.route.name,
      time: selectedBooking.time,
      price: selectedBooking.route.price,
      date: new Date().toLocaleDateString(),
      status: 'Pending Confirmation',
      conductorPhone: selectedBooking.conductorPhone
    };
    setBookings([...bookings, booking]);
    
    const msg = {
      role: 'assistant',
      content: `Booking saved! Contact conductor at ${selectedBooking.conductorPhone}. Reference: #${booking.id}`
    };
    setChatMessages([...chatMessages, msg]);
    
    setShowBookingModal(false);
    setSelectedBooking(null);
  };

  const openWhatsApp = (phone, route, time) => {
    const msg = `Hi, I would like to book a seat on ${route.name} at ${time} today. Route: ${route.route}. Price: KES ${route.price}. Please confirm availability.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', content: chatInput };
    setChatMessages([...chatMessages, userMsg]);

    setTimeout(() => {
      let response = '';
      const input = chatInput.toLowerCase();
      
      if (input.includes('schedule') || input.includes('time')) {
        response = 'I can help you check bus schedules! Go to the Schedules tab to see all available routes and times.';
      } else if (input.includes('book') || input.includes('ticket')) {
        response = 'To book a ticket, select a route from the Schedules tab and click Book Now next to your preferred time.';
      } else if (input.includes('location') || input.includes('map')) {
        response = 'Check the Map tab to see your current location and nearby bus stops.';
      } else if (input.includes('price') || input.includes('cost')) {
        response = 'Bus fares: Githurai (KES 40), Ruiru (KES 60), Juja (KES 70), Thika (KES 80).';
      } else if (input.includes('driver') || input.includes('register')) {
        response = 'Drivers can register their buses in the Drivers tab! Switch to Driver Mode to get started.';
      } else {
        response = 'I am here to help with Thika Superhighway bus schedules, bookings, and navigation!';
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);

    setChatInput('');
  };

  const registerBus = async (data) => {
    try {
      const response = await fetch(`${API_URL}/buses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const newBus = await response.json();
        setRegisteredBuses([...registeredBuses, {
          ...newBus,
          lastUpdated: new Date().toLocaleTimeString(),
          driverName: data.driverName,
          numberPlate: data.numberPlate
        }]);
        setShowDriverModal(false);
        
        const msg = {
          role: 'assistant',
          content: `Bus ${data.numberPlate} registered successfully!`
        };
        setChatMessages([...chatMessages, msg]);
      }
    } catch (error) {
      console.error('Error registering bus:', error);
      alert('Failed to register bus');
    }
  };

  const updateDeparture = async (id, time, loc) => {
    try {
      const response = await fetch(`${API_URL}/buses/${id}/departure`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departureTime: time, location: loc })
      });
      
      if (response.ok) {
        setRegisteredBuses(prev => prev.map(b => 
          b.id === id 
            ? { ...b, nextDeparture: time, currentLocation: loc, lastUpdated: new Date().toLocaleTimeString(), status: 'Updated' }
            : b
        ));
      }
    } catch (error) {
      console.error('Error updating departure:', error);
    }
  };

  return (
    <div className={darkMode ? 'bg-black min-h-screen' : 'bg-gray-50 min-h-screen'}>
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-black text-white p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Bus Scheduler</h1>
            <p className="text-purple-200 text-sm">Thika Superhighway</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-white/20">
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>

        <div className="pb-20">
          {activeTab === 'schedules' && (
            <div className="p-4 space-y-4">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Bus Schedules</h2>
              {busRoutes.map(route => (
                <div key={route.id} className={`rounded-lg shadow p-4 border-l-4 border-purple-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{route.name}</h3>
                      <p className={`text-sm flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Bus className="w-4 h-4 mr-1" />
                        {route.route}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{route.duration} • KES {route.price}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)} 
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      {selectedRoute === route.id ? 'Hide' : 'View'} Times
                    </button>
                  </div>
                  
                  {selectedRoute === route.id && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Today's Schedule:</h4>
                      <div className="grid grid-cols-2 gap-2 mb-4 max-h-48 overflow-y-auto">
                        {route.schedule.map((item, idx) => (
                          <div key={idx} className={`flex justify-between items-center p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-purple-600" />
                              <span className={darkMode ? 'text-white' : 'text-gray-800'}>{item.time}</span>
                            </span>
                            <button 
                              onClick={() => handleBooking(route, item)} 
                              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                            >
                              Book
                            </button>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Stops:</h4>
                        <div className="flex flex-wrap gap-2">
                          {route.stops.map(stop => (
                            <span key={stop} className={`px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                              {stop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="p-4">
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>My Bookings</h2>
              {bookings.length === 0 ? (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Bus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No bookings yet. Book your first bus ticket from the Schedules tab!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(b => (
                    <div key={b.id} className={`rounded-lg shadow p-4 border-l-4 border-purple-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{b.route}</h3>
                          <p className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <Calendar className="w-4 h-4 mr-1" />
                            {b.date} at {b.time}
                          </p>
                          <p className="text-purple-600 font-medium">KES {b.price}</p>
                          {b.conductorPhone && (
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Conductor: {b.conductorPhone}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            b.status === 'Confirmed'
                              ? (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                              : (darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800')
                          }`}>
                            {b.status}
                          </span>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>#{b.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'map' && (
            <div className="p-4">
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Map & Location</h2>
              <div className={`rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Current Location</h3>
                  <Navigation className="w-5 h-5 text-purple-600" />
                </div>
                
                {userLocation ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                      <p className={`flex items-center ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                        <MapPin className="w-4 h-4 mr-2" />
                        Latitude: {userLocation.lat.toFixed(6)}
                      </p>
                      <p className={`flex items-center mt-1 ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                        <MapPin className="w-4 h-4 mr-2" />
                        Longitude: {userLocation.lng.toFixed(6)}
                      </p>
                    </div>
                    
                    <div className={`h-64 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <MapPin className="w-12 h-12 mx-auto mb-2 text-purple-600" />
                        <p>Interactive Map View</p>
                        <p className="text-sm">Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Nearby Bus Stops:</h4>
                      {['CBD Stage', 'Ngara Stage', 'Allsops Stage', 'Githurai 44'].map((stop, i) => (
                        <div key={stop} className={`flex justify-between items-center p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                          <span className={darkMode ? 'text-white' : 'text-gray-800'}>{stop}</span>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{[0.2, 1.5, 3.2, 12.8][i]} km</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Getting your location...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'drivers' && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {isDriverMode ? 'Driver Dashboard' : 'Bus Management'}
                </h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsDriverMode(!isDriverMode)} 
                    className={`px-3 py-1 rounded-lg text-sm ${
                      isDriverMode 
                        ? 'bg-purple-600 text-white' 
                        : (darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700')
                    }`}
                  >
                    {isDriverMode ? 'Passenger View' : 'Driver Mode'}
                  </button>
                  {isDriverMode && (
                    <button 
                      onClick={() => setShowDriverModal(true)} 
                      className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 flex items-center"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Register
                    </button>
                  )}
                </div>
              </div>

              {!isDriverMode ? (
                <div className={`rounded-lg p-6 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <Bus className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Driver Registration Portal
                  </h3>
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Are you a bus driver on Thika Superhighway? Register your bus to manage real-time schedules.
                  </p>
                  <button 
                    onClick={() => setIsDriverMode(true)} 
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                  >
                    Switch to Driver Mode
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {registeredBuses.length === 0 ? (
                    <div className={`rounded-lg p-6 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <Bus className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />
                      <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        No Buses Registered
                      </h3>
                      <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Register your first bus to start managing real-time departures.
                      </p>
                      <button 
                        onClick={() => setShowDriverModal(true)} 
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center mx-auto"
                      >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Register Your Bus
                      </button>
                    </div>
                  ) : (
                    registeredBuses.map(bus => (
                      <div key={bus.id} className={`rounded-lg shadow p-4 border-l-4 border-purple-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{bus.numberPlate}</h3>
                            <p className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              <Bus className="w-4 h-4 mr-1" />
                              {bus.route}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Driver: {bus.driverName} | Conductor: {bus.conductorPhone}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            bus.status === 'Active'
                              ? (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                              : (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800')
                          }`}>
                            {bus.status}
                          </span>
                        </div>

                        <div className={`p-3 rounded-lg mb-3 ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Current Location:</span>
                            <span className={`font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>{bus.currentLocation}</span>
                          </div>
                          {bus.nextDeparture && (
                            <div className="flex justify-between items-center mb-2">
                              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Next Departure:</span>
                              <span className={`font-semibold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>{bus.nextDeparture}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Updated:</span>
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{bus.lastUpdated}</span>
                          </div>
                        </div>

                        <BusUpdateForm bus={bus} onUpdate={updateDeparture} darkMode={darkMode} />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`fixed bottom-0 left-0 right-0 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-md mx-auto flex justify-around py-1">
            {[
              { tab: 'schedules', Icon: Clock, label: 'Schedules' },
              { tab: 'bookings', Icon: Calendar, label: 'Bookings' },
              { tab: 'map', Icon: MapPin, label: 'Map' },
              { tab: 'drivers', Icon: User, label: 'Drivers' }
            ].map(({ tab, Icon, label }) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`flex flex-col items-center px-1 py-2 rounded-lg ${
                  activeTab === tab ? 'text-purple-600' : (darkMode ? 'text-gray-400' : 'text-gray-500')
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setChatOpen(!chatOpen)} 
          className="fixed bottom-20 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700"
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        <ChatBot 
          chatOpen={chatOpen} 
          setChatOpen={setChatOpen} 
          chatMessages={chatMessages} 
          chatInput={chatInput} 
          setChatInput={setChatInput} 
          handleChatSend={handleChatSend} 
          chatEndRef={chatEndRef}
          darkMode={darkMode}
        />

        {showBookingModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-lg p-6 w-full max-w-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-center mb-4">
                <Bus className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Book Your Seat</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedBooking.route.name} at {selectedBooking.time}
                </p>
              </div>

              <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Contact Conductor:</h4>
                <p className={`font-mono text-lg mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                  {selectedBooking.conductorPhone}
                </p>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => openWhatsApp(selectedBooking.conductorPhone, selectedBooking.route, selectedBooking.time)} 
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </button>
                  
                  <button 
                    onClick={() => window.open(`sms:${selectedBooking.conductorPhone}?body=${encodeURIComponent(`Hi, I want to book ${selectedBooking.route.name} at ${selectedBooking.time}. Route: ${selectedBooking.route.route}. Price: KES ${selectedBooking.route.price}`)}`)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Send SMS
                  </button>
                </div>
              </div>

              <div className={`border-l-4 p-3 mb-4 ${darkMode ? 'bg-orange-900/30 border-orange-500' : 'bg-orange-50 border-orange-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                  <strong>⚠️ Important:</strong> Contacting the conductor does not guarantee your booking. 
                  Please wait for the conductor to confirm seat availability before traveling.
                </p>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowBookingModal(false)} 
                  className={`flex-1 py-2 px-4 rounded-lg ${darkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmBooking} 
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                >
                  Save Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {showDriverModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <DriverForm onSubmit={registerBus} onCancel={() => setShowDriverModal(false)} darkMode={darkMode} />
          </div>
        )}
      </div>
    </div>
  );
}

function BusUpdateForm({ bus, onUpdate, darkMode }) {
  const [departureTime, setDepartureTime] = useState('');
  const [currentLocation, setCurrentLocation] = useState(bus.currentLocation);

  const handleUpdate = () => {
    if (departureTime) {
      onUpdate(bus.id, departureTime, currentLocation);
      setDepartureTime('');
    }
  };

  const locations = bus.route.includes('Thika') 
    ? ['CBD', 'Ngara', 'Allsops', 'Githurai', 'Bypass', 'Ruiru', 'Kimbo', 'Juja', 'Thika']
    : bus.route.includes('Ruiru')
    ? ['CBD', 'Ngara', 'Allsops', 'Githurai', 'Bypass', 'Ruiru']
    : bus.route.includes('Juja')
    ? ['CBD', 'Ngara', 'Allsops', 'Githurai', 'Bypass', 'Ruiru', 'Kimbo', 'Juja']
    : ['CBD', 'Ngara', 'Allsops', 'Githurai'];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <select
          value={currentLocation}
          onChange={(e) => setCurrentLocation(e.target.value)}
          className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
          }`}
        >
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        
        <input
          type="time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
          }`}
        />
      </div>
      
      <button
        onClick={handleUpdate}
        disabled={!departureTime}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Edit3 className="w-4 h-4 mr-2" />
        Update Departure Time
      </button>
    </div>
  );
}

function DriverForm({ onSubmit, onCancel, darkMode }) {
  const [form, setForm] = useState({ 
    driverName: '', 
    numberPlate: '', 
    route: '', 
    conductorPhone: '' 
  });

  const handleSubmit = () => {
    if (form.driverName && form.numberPlate && form.route && form.conductorPhone) {
      onSubmit(form);
      setForm({ driverName: '', numberPlate: '', route: '', conductorPhone: '' });
    }
  };

  return (
    <div className={`rounded-lg p-6 w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="text-center mb-4">
        <UserPlus className="w-12 h-12 mx-auto mb-3 text-purple-600" />
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Register Your Bus
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Join Thika Superhighway network
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Driver Name"
          value={form.driverName}
          onChange={(e) => setForm({ ...form, driverName: e.target.value })}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
          }`}
        />
        
        <input
          type="text"
          placeholder="Number Plate (e.g., KAA 123A)"
          value={form.numberPlate}
          onChange={(e) => setForm({ ...form, numberPlate: e.target.value.toUpperCase() })}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
          }`}
        />
        
        <select
          value={form.route}
          onChange={(e) => setForm({ ...form, route: e.target.value })}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}
        >
          <option value="">Select Route</option>
          <option value="CBD → Thika">CBD → Thika</option>
          <option value="CBD → Ruiru">CBD → Ruiru</option>
          <option value="CBD → Juja">CBD → Juja</option>
          <option value="CBD → Githurai">CBD → Githurai</option>
        </select>
        
        <input
          type="tel"
          placeholder="Conductor Phone (e.g., +254 712 345 678)"
          value={form.conductorPhone}
          onChange={(e) => setForm({ ...form, conductorPhone: e.target.value })}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
          }`}
        />
      </div>

      <div className={`border-l-4 p-3 my-4 ${darkMode ? 'bg-blue-900/30 border-blue-500' : 'bg-blue-50 border-blue-200'}`}>
        <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
          <strong>📱 Note:</strong> Passengers will use your conductor's phone number for booking confirmations via WhatsApp or SMS.
        </p>
      </div>

      <div className="flex space-x-3">
        <button 
          onClick={onCancel} 
          className={`flex-1 py-2 px-4 rounded-lg ${darkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={!form.driverName || !form.numberPlate || !form.route || !form.conductorPhone}
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Register Bus
        </button>
      </div>
    </div>
  );
}

function ChatBot({ chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, handleChatSend, chatEndRef, darkMode }) {
  return (
    <div className={`fixed bottom-20 right-4 w-80 rounded-lg shadow-xl border transition-all duration-300 ${
      chatOpen ? 'h-96' : 'h-0 overflow-hidden'
    } ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between p-4 border-b bg-purple-600 text-white rounded-t-lg">
        <div className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">Bus Assistant</span>
        </div>
        <button onClick={() => setChatOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {chatMessages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-purple-600 text-white' 
                : (darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800')
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      
      <div className={`p-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
            placeholder="Ask me anything..."
            className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
            }`}
          />
          <button 
            onClick={handleChatSend} 
            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}