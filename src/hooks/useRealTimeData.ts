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
        type: 'Flood Warning',
        severity: 'critical',
        location: { lat: 40.7128, lng: -74.0060 },
        description: 'Major flooding detected in downtown area. Water level rising rapidly.',
        status: 'active',
        timestamp: new Date().toISOString(),
        resourcesAssigned: ['RES001', 'RES003']
      },
      {
        id: 'INC002',
        type: 'Building Fire',
        severity: 'high',
        location: { lat: 40.7580, lng: -73.9855 },
        description: 'Structure fire reported in residential complex. Multiple units involved.',
        status: 'active',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        resourcesAssigned: ['RES002']
      },
      {
        id: 'INC003',
        type: 'Traffic Accident',
        severity: 'medium',
        location: { lat: 40.7505, lng: -73.9934 },
        description: 'Multi-vehicle accident blocking major intersection.',
        status: 'responding',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        resourcesAssigned: ['RES004']
      }
    ];

    const mockResources: Resource[] = [
      {
        id: 'RES001',
        type: 'ambulance',
        status: 'deployed',
        location: { lat: 40.7150, lng: -74.0070 },
        capacity: 2,
        assignedTo: 'INC001'
      },
      {
        id: 'RES002',
        type: 'fire_truck',
        status: 'deployed',
        location: { lat: 40.7590, lng: -73.9865 },
        capacity: 6,
        assignedTo: 'INC002'
      },
      {
        id: 'RES003',
        type: 'rescue_team',
        status: 'deployed',
        location: { lat: 40.7140, lng: -74.0050 },
        capacity: 8,
        assignedTo: 'INC001'
      },
      {
        id: 'RES004',
        type: 'police_unit',
        status: 'deployed',
        location: { lat: 40.7515, lng: -73.9944 },
        capacity: 2,
        assignedTo: 'INC003'
      },
      {
        id: 'RES005',
        type: 'ambulance',
        status: 'available',
        location: { lat: 40.7300, lng: -73.9950 },
        capacity: 2
      }
    ];

    setIncidents(mockIncidents);
    setResources(mockResources);

    // Simulate connection status
    setIsConnected(true);

    // Fetch real weather data
    fetchWeatherData();

    // Simulate seismic data
    setSeismicData([
      {
        magnitude: 2.1,
        depth: 15,
        location: 'New York Metropolitan Area',
        timestamp: new Date(Date.now() - 3600000).toISOString()
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
    const incidentTypes = ['Medical Emergency', 'Gas Leak', 'Power Outage', 'Road Closure', 'Water Main Break'];
    const severities = ['low', 'medium', 'high', 'critical'];
    
    const newIncident: Incident = {
      id: `INC${String(incidents.length + 1).padStart(3, '0')}`,
      type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      location: {
        lat: 40.7 + Math.random() * 0.1,
        lng: -74.0 + Math.random() * 0.1
      },
      description: 'New incident reported through emergency services.',
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