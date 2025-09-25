import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle, Truck, Users, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [mapToken, setMapToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Mock map implementation for demo (would use Mapbox in production)
  const MapContainer = () => (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-blue-900/20 to-green-900/20 rounded-lg overflow-hidden">
      {/* Map Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border border-muted/20" />
          ))}
        </div>
      </div>

      {/* Incidents on Map */}
      {incidents.map((incident, index) => (
        <div
          key={incident.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
            ${incident.severity === 'critical' ? 'animate-pulse' : ''}
          `}
          style={{
            left: `${20 + (index * 15) % 60}%`,
            top: `${30 + (index * 20) % 40}%`,
          }}
          onClick={() => setSelectedIncident(incident)}
        >
          <div className={`relative p-2 rounded-full shadow-lg ${
            incident.severity === 'critical' ? 'bg-emergency emergency-glow' :
            incident.severity === 'high' ? 'bg-warning' : 'bg-info'
          }`}>
            <AlertTriangle className="h-4 w-4 text-white" />
            {incident.severity === 'critical' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-card/90 backdrop-blur-sm rounded px-2 py-1 text-xs whitespace-nowrap">
            {incident.type}
          </div>
        </div>
      ))}

      {/* Resources on Map */}
      {resources.map((resource, index) => (
        <div
          key={resource.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${25 + (index * 18) % 50}%`,
            top: `${40 + (index * 25) % 30}%`,
          }}
        >
          <div className={`p-2 rounded-full shadow-lg ${
            resource.status === 'deployed' ? 'bg-success' :
            resource.status === 'available' ? 'bg-primary' : 'bg-muted'
          }`}>
            {resource.type === 'ambulance' ? <Truck className="h-3 w-3 text-white" /> :
             resource.type === 'fire_truck' ? <Zap className="h-3 w-3 text-white" /> :
             <Users className="h-3 w-3 text-white" />}
          </div>
        </div>
      ))}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
        <h4 className="font-semibold text-sm">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emergency rounded-full" />
            <span>Critical Incident</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span>Deployed Resource</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span>Available Resource</span>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <Button variant="secondary" size="sm">Zoom In</Button>
        <Button variant="secondary" size="sm">Zoom Out</Button>
        <Button variant="secondary" size="sm">Center</Button>
      </div>
    </div>
  );

  if (showTokenInput) {
    return (
      <div className="space-y-4">
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            To enable full interactive mapping with Mapbox, please provide your Mapbox access token.
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">
              Get your token here
            </a>
          </AlertDescription>
        </Alert>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Mapbox token (optional)"
            className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm"
            value={mapToken}
            onChange={(e) => setMapToken(e.target.value)}
          />
          <Button onClick={() => setShowTokenInput(false)}>
            {mapToken ? 'Use Token' : 'Use Demo Map'}
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