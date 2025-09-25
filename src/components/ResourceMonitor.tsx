import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Truck, Users, MapPin, Battery, AlertTriangle, CheckCircle } from 'lucide-react';

interface Resource {
  id: string;
  type: string;
  status: string;
  location: { lat: number; lng: number };
  capacity: number;
  assignedTo?: string;
}

interface ResourceMonitorProps {
  resources: Resource[];
}

const ResourceMonitor: React.FC<ResourceMonitorProps> = ({ resources }) => {
  const [selectedResourceType, setSelectedResourceType] = useState('all');

  const resourceTypes = ['all', 'ambulance', 'fire_truck', 'police_unit', 'rescue_team'];
  
  const filteredResources = selectedResourceType === 'all' 
    ? resources 
    : resources.filter(resource => resource.type === selectedResourceType);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'ambulance': return <Truck className="h-5 w-5 text-emergency" />;
      case 'fire_truck': return <Truck className="h-5 w-5 text-warning" />;
      case 'police_unit': return <Users className="h-5 w-5 text-primary" />;
      case 'rescue_team': return <Users className="h-5 w-5 text-success" />;
      default: return <Truck className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'destructive';
      case 'available': return 'default';
      case 'maintenance': return 'secondary';
      case 'offline': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <AlertTriangle className="h-4 w-4 text-emergency" />;
      case 'available': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'maintenance': return <Battery className="h-4 w-4 text-warning" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const resourceStats = {
    total: resources.length,
    deployed: resources.filter(r => r.status === 'deployed').length,
    available: resources.filter(r => r.status === 'available').length,
    maintenance: resources.filter(r => r.status === 'maintenance').length
  };

  const deploymentRate = (resourceStats.deployed / resourceStats.total) * 100;

  return (
    <div className="space-y-6">
      {/* Resource Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Resources</p>
                <p className="text-2xl font-bold">{resourceStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emergency/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-emergency" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deployed</p>
                <p className="text-2xl font-bold text-emergency">{resourceStats.deployed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-success">{resourceStats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Battery className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deployment Rate</p>
                <p className="text-2xl font-bold">{deploymentRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployment Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Deployment Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Deployment</span>
              <span>{resourceStats.deployed}/{resourceStats.total} deployed</span>
            </div>
            <Progress value={deploymentRate} className="h-2" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-lg font-semibold text-success">{resourceStats.available}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deployed</p>
              <p className="text-lg font-semibold text-emergency">{resourceStats.deployed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Maintenance</p>
              <p className="text-lg font-semibold text-warning">{resourceStats.maintenance}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Type Filter */}
      <div className="flex flex-wrap gap-2">
        {resourceTypes.map((type) => (
          <Button
            key={type}
            variant={selectedResourceType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedResourceType(type)}
            className="capitalize"
          >
            {type.replace('_', ' ')}
          </Button>
        ))}
      </div>

      {/* Resource List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getResourceIcon(resource.type)}
                  <CardTitle className="text-lg capitalize">
                    {resource.type.replace('_', ' ')}
                  </CardTitle>
                </div>
                <Badge variant={getStatusColor(resource.status)}>
                  {resource.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Resource ID:</span>
                <span className="font-mono">{resource.id}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Capacity:</span>
                <span>{resource.capacity} personnel</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {resource.location.lat.toFixed(4)}, {resource.location.lng.toFixed(4)}
                </span>
              </div>

              {resource.assignedTo && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assigned to:</span>
                  <Badge variant="outline" className="text-xs">
                    {resource.assignedTo}
                  </Badge>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                {getStatusIcon(resource.status)}
                <span className="text-sm capitalize text-muted-foreground">
                  {resource.status === 'deployed' ? 'On Mission' :
                   resource.status === 'available' ? 'Ready for Deployment' :
                   resource.status === 'maintenance' ? 'Under Maintenance' : 'Offline'}
                </span>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Track Location
                </Button>
                <Button 
                  size="sm" 
                  variant={resource.status === 'available' ? 'default' : 'outline'}
                  className="flex-1"
                  disabled={resource.status !== 'available'}
                >
                  {resource.status === 'available' ? 'Deploy' : 'View Details'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground">
              No resources match the selected filter criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResourceMonitor;