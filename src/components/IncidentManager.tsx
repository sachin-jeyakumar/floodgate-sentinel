import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

interface IncidentManagerProps {
  incidents: Incident[];
}

const IncidentManager: React.FC<IncidentManagerProps> = ({ incidents }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filteredIncidents = incidents.filter(incident => {
    const matchesFilter = filter === 'all' || incident.status === filter;
    const matchesSearch = incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="h-4 w-4 text-emergency" />;
      case 'responding': return <Clock className="h-4 w-4 text-warning" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'closed': return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const incident = new Date(timestamp);
    const diffMs = now.getTime() - incident.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Alert */}
      <Alert className="border-primary bg-primary/10">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-primary">
          <strong>AI Insight:</strong> Pattern detected - flood incidents increasing 40% in the last 2 hours. 
          Recommend activating Level 2 response protocol and predeploying resources to predicted high-risk areas.
        </AlertDescription>
      </Alert>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Incidents</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="responding">Responding</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Incidents List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredIncidents.map((incident) => (
          <Card key={incident.id} className={`cursor-pointer transition-all hover:shadow-lg ${
            incident.severity === 'critical' ? 'border-emergency shadow-emergency/20' : ''
          }`}
          onClick={() => setSelectedIncident(incident)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(incident.status)}
                  <CardTitle className="text-lg">{incident.type}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {incident.id}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{incident.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{getTimeAgo(incident.timestamp)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{incident.resourcesAssigned.length} resources assigned</span>
                </div>
                <Badge variant={incident.status === 'active' ? 'destructive' : 'secondary'}>
                  {incident.status}
                </Badge>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Assign Resources
                </Button>
                <Button size="sm" variant={incident.severity === 'critical' ? 'default' : 'outline'}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIncidents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No incidents found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'All clear! No active incidents at this time.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <Card className="fixed inset-4 z-50 bg-card border shadow-lg overflow-auto">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{selectedIncident.type}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Incident ID: {selectedIncident.id} • {formatTimestamp(selectedIncident.timestamp)}
                </p>
              </div>
              <Button variant="outline" onClick={() => setSelectedIncident(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Incident Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={selectedIncident.status === 'active' ? 'destructive' : 'secondary'}>
                      {selectedIncident.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Severity:</span>
                    <Badge variant={getSeverityColor(selectedIncident.severity)}>
                      {selectedIncident.severity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-sm">{selectedIncident.location.lat.toFixed(4)}, {selectedIncident.location.lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Assigned Resources</h4>
                <div className="space-y-2">
                  {selectedIncident.resourcesAssigned.length > 0 ? (
                    selectedIncident.resourcesAssigned.map((resourceId) => (
                      <div key={resourceId} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{resourceId}</span>
                        <Badge variant="outline">Deployed</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No resources assigned yet</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Description</h4>
              <p className="text-sm bg-muted p-3 rounded">{selectedIncident.description}</p>
            </div>

            <div className="flex space-x-3">
              <Button className="flex-1">Assign Resources</Button>
              <Button variant="outline" className="flex-1">Update Status</Button>
              <Button variant="outline" className="flex-1">Send Alert</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IncidentManager;