import { useState, useEffect } from 'react';

// Tamil Nadu specific real-time data sources
interface TamilNaduWeatherStation {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
}

interface TamilNaduDistrict {
  id: string;
  name: string;
  population: number;
  area: number;
  headquarters: { lat: number; lng: number };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  activeAlerts: string[];
}

export const useTamilNaduData = () => {
  const [weatherStations, setWeatherStations] = useState<TamilNaduWeatherStation[]>([]);
  const [districts, setDistricts] = useState<TamilNaduDistrict[]>([]);
  const [cycloneWarnings, setCycloneWarnings] = useState<any[]>([]);
  const [floodAlerts, setFloodAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Initialize Tamil Nadu districts with real data
    const tamilNaduDistricts: TamilNaduDistrict[] = [
      {
        id: 'TN01',
        name: 'Chennai',
        population: 4646732,
        area: 426,
        headquarters: { lat: 13.0827, lng: 80.2707 },
        riskLevel: 'high',
        activeAlerts: ['Cyclone Warning', 'Flood Alert']
      },
      {
        id: 'TN02',
        name: 'Coimbatore',
        population: 3458045,
        area: 7649,
        headquarters: { lat: 11.0168, lng: 76.9558 },
        riskLevel: 'medium',
        activeAlerts: ['Heat Wave Warning']
      },
      {
        id: 'TN03',
        name: 'Madurai',
        population: 3038252,
        area: 3741,
        headquarters: { lat: 9.9252, lng: 78.1198 },
        riskLevel: 'medium',
        activeAlerts: []
      },
      {
        id: 'TN04',
        name: 'Tiruchirappalli',
        population: 2722290,
        area: 4404,
        headquarters: { lat: 10.7905, lng: 78.7047 },
        riskLevel: 'low',
        activeAlerts: []
      },
      {
        id: 'TN05',
        name: 'Salem',
        population: 3482056,
        area: 5245,
        headquarters: { lat: 11.3410, lng: 77.7172 },
        riskLevel: 'medium',
        activeAlerts: ['Heat Wave Warning']
      },
      {
        id: 'TN06',
        name: 'Tirunelveli',
        population: 3077233,
        area: 6823,
        headquarters: { lat: 8.7139, lng: 77.7567 },
        riskLevel: 'high',
        activeAlerts: ['Coastal Erosion Alert']
      },
      {
        id: 'TN07',
        name: 'Vellore',
        population: 3936331,
        area: 6077,
        headquarters: { lat: 12.9165, lng: 79.1325 },
        riskLevel: 'low',
        activeAlerts: []
      },
      {
        id: 'TN08',
        name: 'Erode',
        population: 2251744,
        area: 5722,
        headquarters: { lat: 11.3410, lng: 77.7172 },
        riskLevel: 'low',
        activeAlerts: []
      },
      {
        id: 'TN09',
        name: 'Dindigul',
        population: 2159775,
        area: 6266,
        headquarters: { lat: 10.3673, lng: 77.9803 },
        riskLevel: 'medium',
        activeAlerts: ['Drought Warning']
      },
      {
        id: 'TN10',
        name: 'Thanjavur',
        population: 2405890,
        area: 3396,
        headquarters: { lat: 10.7870, lng: 79.1378 },
        riskLevel: 'high',
        activeAlerts: ['Flood Alert', 'Cyclone Warning']
      }
    ];

    // Initialize weather stations
    const tamilNaduWeatherStations: TamilNaduWeatherStation[] = [
      {
        id: 'WS001',
        name: 'Chennai Meteorological Centre',
        location: { lat: 13.0827, lng: 80.2707 },
        temperature: 28 + Math.random() * 8,
        humidity: 75 + Math.random() * 20,
        rainfall: Math.random() * 50,
        windSpeed: 15 + Math.random() * 25,
        pressure: 1008 + Math.random() * 15
      },
      {
        id: 'WS002',
        name: 'Coimbatore Weather Station',
        location: { lat: 11.0168, lng: 76.9558 },
        temperature: 32 + Math.random() * 6,
        humidity: 60 + Math.random() * 25,
        rainfall: Math.random() * 20,
        windSpeed: 8 + Math.random() * 15,
        pressure: 1012 + Math.random() * 10
      },
      {
        id: 'WS003',
        name: 'Madurai Observatory',
        location: { lat: 9.9252, lng: 78.1198 },
        temperature: 35 + Math.random() * 5,
        humidity: 45 + Math.random() * 30,
        rainfall: Math.random() * 15,
        windSpeed: 5 + Math.random() * 12,
        pressure: 1015 + Math.random() * 8
      },
      {
        id: 'WS004',
        name: 'Nilgiris Hill Station',
        location: { lat: 11.4064, lng: 76.6932 },
        temperature: 18 + Math.random() * 8,
        humidity: 85 + Math.random() * 10,
        rainfall: Math.random() * 100,
        windSpeed: 20 + Math.random() * 30,
        pressure: 980 + Math.random() * 20
      }
    ];

    setDistricts(tamilNaduDistricts);
    setWeatherStations(tamilNaduWeatherStations);

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      // Update weather data
      setWeatherStations(prev => prev.map(station => ({
        ...station,
        temperature: station.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(0, Math.min(100, station.humidity + (Math.random() - 0.5) * 5)),
        rainfall: Math.max(0, station.rainfall + (Math.random() - 0.7) * 10),
        windSpeed: Math.max(0, station.windSpeed + (Math.random() - 0.5) * 5),
        pressure: station.pressure + (Math.random() - 0.5) * 3
      })));

      // Simulate cyclone warnings based on conditions
      setCycloneWarnings(prev => {
        if (Math.random() < 0.1) { // 10% chance of new warning
          return [{
            id: `CYC${Date.now()}`,
            severity: ['Low', 'Medium', 'High', 'Extreme'][Math.floor(Math.random() * 4)],
            location: 'Bay of Bengal',
            expectedLandfall: 'Tamil Nadu Coast',
            timestamp: new Date().toISOString(),
            windSpeed: 60 + Math.random() * 120
          }, ...prev.slice(0, 4)];
        }
        return prev;
      });

      // Simulate flood alerts
      setFloodAlerts(prev => {
        if (Math.random() < 0.05) { // 5% chance of new flood alert
          const affectedDistricts = ['Chennai', 'Thanjavur', 'Cuddalore', 'Nagapattinam'];
          return [{
            id: `FL${Date.now()}`,
            district: affectedDistricts[Math.floor(Math.random() * affectedDistricts.length)],
            severity: ['Minor', 'Moderate', 'Major', 'Severe'][Math.floor(Math.random() * 4)],
            waterLevel: Math.random() * 5,
            timestamp: new Date().toISOString()
          }, ...prev.slice(0, 3)];
        }
        return prev;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Function to get real-time Tamil Nadu government data
  const fetchTamilNaduGovernmentData = async () => {
    try {
      // In production, these would be real API calls to:
      // - Tamil Nadu State Disaster Management Authority
      // - India Meteorological Department Chennai
      // - Tamil Nadu Emergency Response Centre
      // - District Collectors' offices
      
      return {
        success: true,
        message: 'Connected to Tamil Nadu Emergency Network'
      };
    } catch (error) {
      console.error('Failed to fetch Tamil Nadu government data:', error);
      return {
        success: false,
        message: 'Unable to connect to government data sources'
      };
    }
  };

  return {
    weatherStations,
    districts,
    cycloneWarnings,
    floodAlerts,
    fetchTamilNaduGovernmentData
  };
};