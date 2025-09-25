import { useState, useEffect } from 'react';

interface Incident {
  id: string;
  type: string;
  severity: string;
  location: { lat: number; lng: number };
  description: string;
  status: string;
  timestamp: string;
  resourcesAssigned: string[];
}

interface Resource {
  id: string;
  type: string;
  status: string;
  location: { lat: number; lng: number };
  capacity: number;
  assignedTo?: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  condition: string;
}

interface SeismicData {
  magnitude: number;
  depth: number;
  location: string;
  timestamp: string;
}

export const useRealTimeData = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [seismicData, setSeismicData] = useState<SeismicData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate real-time data feeds
  useEffect(() => {
    // Initialize mock data
    const mockIncidents: Incident[] = [
      {
        id: 'INC001',
        type: 'Cyclone Alert',
        severity: 'critical',
        location: { lat: 11.0168, lng: 76.9558 }, // Coimbatore
        description: 'Severe cyclonic storm approaching coastal areas. High winds and heavy rainfall expected.',
        status: 'active',
        timestamp: new Date().toISOString(),
        resourcesAssigned: ['RES001', 'RES003']
      },
      {
        id: 'INC002',
        type: 'Flash Flood',
        severity: 'high',
        location: { lat: 13.0827, lng: 80.2707 }, // Chennai
        description: 'Heavy rainfall causing waterlogging in low-lying areas. Traffic severely affected.',
        status: 'active',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        resourcesAssigned: ['RES002']
      },
      {
        id: 'INC003',
        type: 'Landslide Warning',
        severity: 'medium',
        location: { lat: 11.4064, lng: 76.6932 }, // Nilgiris
        description: 'Heavy rainfall triggering landslides in hilly areas. Road blockages reported.',
        status: 'responding',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        resourcesAssigned: ['RES004']
      },
      {
        id: 'INC004',
        type: 'Heat Wave',
        severity: 'medium',
        location: { lat: 11.3410, lng: 77.7172 }, // Salem
        description: 'Extreme heat conditions affecting public health. Emergency cooling centers activated.',
        status: 'monitoring',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        resourcesAssigned: []
      }
    ];

    const mockResources: Resource[] = [
      {
        id: 'RES001',
        type: 'ambulance',
        status: 'deployed',
        location: { lat: 11.0168, lng: 76.9558 }, // Coimbatore
        capacity: 2,
        assignedTo: 'INC001'
      },
      {
        id: 'RES002',
        type: 'fire_truck',
        status: 'deployed',
        location: { lat: 13.0827, lng: 80.2707 }, // Chennai
        capacity: 6,
        assignedTo: 'INC002'
      },
      {
        id: 'RES003',
        type: 'rescue_team',
        status: 'deployed',
        location: { lat: 11.4064, lng: 76.6932 }, // Nilgiris
        capacity: 8,
        assignedTo: 'INC001'
      },
      {
        id: 'RES004',
        type: 'police_unit',
        status: 'deployed',
        location: { lat: 11.3410, lng: 77.7172 }, // Salem
        capacity: 2,
        assignedTo: 'INC003'
      },
      {
        id: 'RES005',
        type: 'ambulance',
        status: 'available',
        location: { lat: 12.9716, lng: 77.5946 }, // Bangalore border
        capacity: 2
      },
      {
        id: 'RES006',
        type: 'coast_guard',
        status: 'available',
        location: { lat: 8.7642, lng: 78.1348 }, // Tuticorin
        capacity: 10
      },
      {
        id: 'RES007',
        type: 'ndrf_team',
        status: 'standby',
        location: { lat: 10.7905, lng: 78.7047 }, // Trichy
        capacity: 15
      }
    ];

    setIncidents(mockIncidents);
    setResources(mockResources);

    // Simulate connection status
    setIsConnected(true);

    // Fetch real weather data
    fetchWeatherData();

    // Simulate seismic data for Tamil Nadu
    setSeismicData([
      {
        magnitude: 3.2,
        depth: 12,
        location: 'Western Ghats, Tamil Nadu',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        magnitude: 2.8,
        depth: 8,
        location: 'Eastern Coast, Tamil Nadu',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ]);

    // Set up real-time updates
    const interval = setInterval(() => {
      // Simulate random incident updates
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        generateNewIncident();
      }
      
      // Simulate resource status changes
      if (Math.random() < 0.2) { // 20% chance every 5 seconds
        updateResourceStatus();
      }

      // Update weather periodically
      if (Math.random() < 0.05) { // 5% chance every 5 seconds
        fetchWeatherData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchWeatherData = async () => {
    try {
      // In production, use actual weather API
      // For demo, we'll use mock data that changes
      const mockWeather: WeatherData = {
        temperature: 15 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        windSpeed: 10 + Math.random() * 20,
        visibility: 8 + Math.random() * 7,
        pressure: 1010 + Math.random() * 20,
        condition: ['Clear', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 4)]
      };
      setWeatherData(mockWeather);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    }
  };

  const generateNewIncident = () => {
    const incidentTypes = ['Medical Emergency', 'Gas Leak', 'Power Outage', 'Road Closure', 'Water Main Break', 'Coastal Erosion', 'Tree Fall', 'Building Collapse'];
    const severities = ['low', 'medium', 'high', 'critical'];
    const tamilNaduCities = [
      { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
      { lat: 11.0168, lng: 76.9558, name: 'Coimbatore' },
      { lat: 9.9252, lng: 78.1198, name: 'Madurai' },
      { lat: 10.7905, lng: 78.7047, name: 'Trichy' },
      { lat: 11.3410, lng: 77.7172, name: 'Salem' },
      { lat: 8.7642, lng: 78.1348, name: 'Tuticorin' },
      { lat: 12.2958, lng: 76.6394, name: 'Mysore Border' }
    ];
    
    const randomCity = tamilNaduCities[Math.floor(Math.random() * tamilNaduCities.length)];
    
    const newIncident: Incident = {
      id: `TN${String(incidents.length + 1).padStart(3, '0')}`,
      type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      location: {
        lat: randomCity.lat + (Math.random() - 0.5) * 0.05,
        lng: randomCity.lng + (Math.random() - 0.5) * 0.05
      },
      description: `Emergency reported in ${randomCity.name} area through Tamil Nadu emergency services.`,
      status: 'reported',
      timestamp: new Date().toISOString(),
      resourcesAssigned: []
    };

    setIncidents(prev => [newIncident, ...prev.slice(0, 9)]); // Keep only 10 most recent
  };

  const updateResourceStatus = () => {
    setResources(prev => prev.map(resource => {
      if (Math.random() < 0.3) { // 30% chance to update
        const statuses = ['available', 'deployed', 'maintenance'];
        return {
          ...resource,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          location: {
            lat: resource.location.lat + (Math.random() - 0.5) * 0.01,
            lng: resource.location.lng + (Math.random() - 0.5) * 0.01
          }
        };
      }
      return resource;
    }));
  };

  return {
    incidents,
    resources,
    weatherData,
    seismicData,
    isConnected,
    setIncidents,
    setResources
  };
};