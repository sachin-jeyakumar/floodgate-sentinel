import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle, Truck, Users, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Incident {
  id: string;
  type: string;
  severity: string;
  location: { lat: number; lng: number };
  description: string;
  status: string;
  timestamp: string;
}

interface Resource {
  id: string;
  type: string;
  status: string;
  location: { lat: number; lng: number };
  capacity: number;
  assignedTo?: string;
}

interface RealTimeMapProps {
  incidents: Incident[];
  resources: Resource[];
}

const RealTimeMap: React.FC<RealTimeMapProps> = ({ incidents, resources }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [mapToken, setMapToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Tamil Nadu coordinates
  const TAMIL_NADU_CENTER: [number, number] = [78.6569, 11.1271];
  const TAMIL_NADU_BOUNDS: [[number, number], [number, number]] = [
    [76.2297, 8.0681], // Southwest
    [80.3480, 13.4347]  // Northeast
  ];

  // Initialize real Mapbox map
  useEffect(() => {
    if (!mapToken || !mapRef.current || mapInstanceRef.current) return;

    mapboxgl.accessToken = mapToken;
    
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: TAMIL_NADU_CENTER,
      zoom: 7,
      maxBounds: TAMIL_NADU_BOUNDS
    });

    const map = mapInstanceRef.current;

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add fullscreen control
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.on('load', () => {
      setIsMapLoaded(true);
      
      // Add Tamil Nadu districts layer (would be real GeoJSON in production)
      map.addSource('tamil-nadu-districts', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [] // Would load real Tamil Nadu district boundaries
        }
      });

      // Add incidents and resources as they come in
      updateMapMarkers();
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapToken]);

  const updateMapMarkers = () => {
    if (!mapInstanceRef.current || !isMapLoaded) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapbox-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add incident markers
    incidents.forEach((incident) => {
      const el = document.createElement('div');
      el.className = 'mapbox-marker';
      el.innerHTML = `
        <div class="relative p-2 rounded-full shadow-lg cursor-pointer ${
          incident.severity === 'critical' ? 'bg-red-600 animate-pulse' :
          incident.severity === 'high' ? 'bg-orange-500' : 'bg-blue-500'
        }">
          <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        </div>
      `;

      el.addEventListener('click', () => setSelectedIncident(incident));

      new mapboxgl.Marker(el)
        .setLngLat([incident.location.lng, incident.location.lat])
        .addTo(map);
    });

    // Add resource markers
    resources.forEach((resource) => {
      const el = document.createElement('div');
      el.className = 'mapbox-marker';
      el.innerHTML = `
        <div class="p-2 rounded-full shadow-lg ${
          resource.status === 'deployed' ? 'bg-green-600' :
          resource.status === 'available' ? 'bg-blue-600' : 'bg-gray-500'
        }">
          <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        </div>
      `;

      new mapboxgl.Marker(el)
        .setLngLat([resource.location.lng, resource.location.lat])
        .addTo(map);
    });
  };

  // Update markers when incidents or resources change
  useEffect(() => {
    if (isMapLoaded) {
      updateMapMarkers();
    }
  }, [incidents, resources, isMapLoaded]);

  const MapContainer = () => (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />
      
      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-2 z-10">
        <h4 className="font-semibold text-sm">Tamil Nadu Emergency Response</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600 rounded-full" />
            <span>Critical Incident</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded-full" />
            <span>Deployed Resource</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <span>Available Resource</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (showTokenInput) {
    return (
      <div className="space-y-4">
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            To display real-time Tamil Nadu map with satellite imagery, please provide your Mapbox access token.
            <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">
              Get your token here
            </a>
          </AlertDescription>
        </Alert>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Mapbox token for real Tamil Nadu map"
            className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm"
            value={mapToken}
            onChange={(e) => setMapToken(e.target.value)}
          />
          <Button 
            onClick={() => setShowTokenInput(false)}
            disabled={!mapToken}
          >
            Load Tamil Nadu Map
          </Button>
        </div>
        <MapContainer />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MapContainer />
      
      {/* Incident Details Modal */}
      {selectedIncident && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{selectedIncident.type}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedIncident.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={
                    selectedIncident.severity === 'critical' ? 'destructive' :
                    selectedIncident.severity === 'high' ? 'secondary' : 'outline'
                  }>
                    {selectedIncident.severity}
                  </Badge>
                  <Badge variant="outline">{selectedIncident.status}</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedIncident(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeMap;