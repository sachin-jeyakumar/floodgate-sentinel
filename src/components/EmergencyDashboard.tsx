import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, MapPin, Users, Truck, Radio, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import RealTimeMap from './RealTimeMap';
import IncidentManager from './IncidentManager';
import ResourceMonitor from './ResourceMonitor';
import PredictiveAnalytics from './PredictiveAnalytics';
import { useRealTimeData } from '@/hooks/useRealTimeData';

const EmergencyDashboard = () => {
  const { incidents, resources, weatherData, seismicData, isConnected } = useRealTimeData();
  const [activeIncidents, setActiveIncidents] = useState(0);
  const [criticalAlerts, setCriticalAlerts] = useState(0);

  useEffect(() => {
    setActiveIncidents(incidents.filter(i => i.status === 'active').length);
    setCriticalAlerts(incidents.filter(i => i.severity === 'critical').length);
  }, [incidents]);

  const systemStatus = {
    dataFeeds: isConnected ? 'operational' : 'degraded',
    agencies: 'operational',
    communications: 'operational',
    predictions: 'operational'
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header with Real-time Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emergency Response Command Center</h1>
          <p className="text-muted-foreground mt-1">Real-time disaster coordination and AI-powered decision support</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            isConnected ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-warning'} ${isConnected ? 'pulse-emergency' : ''}`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Live Data Active' : 'Data Delayed'}
            </span>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts > 0 && (
        <Alert className="border-emergency bg-emergency/10">
          <AlertTriangle className="h-4 w-4 text-emergency" />
          <AlertDescription className="text-emergency font-medium">
            {criticalAlerts} critical incident{criticalAlerts > 1 ? 's' : ''} requiring immediate attention
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-foreground">{activeIncidents}</div>
              <Badge variant={activeIncidents > 5 ? "destructive" : "secondary"}>
                {activeIncidents > 5 ? 'High' : 'Normal'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resources Deployed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-foreground">{resources.filter(r => r.status === 'deployed').length}</div>
              <Truck className="h-5 w-5 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">People Evacuated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-foreground">2,847</div>
              <Users className="h-5 w-5 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-success">98%</div>
              <Radio className="h-5 w-5 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Situational Overview</span>
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Incident Management</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <span>Resource Allocation</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Predictive Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Situation Map</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <RealTimeMap incidents={incidents} resources={resources} />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(systemStatus).map(([system, status]) => (
                    <div key={system} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{system.replace(/([A-Z])/g, ' $1')}</span>
                      <Badge variant={status === 'operational' ? 'default' : 'destructive'}>
                        {status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weather Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  {weatherData && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Temperature</span>
                        <span>{weatherData.temperature}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wind Speed</span>
                        <span>{weatherData.windSpeed} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visibility</span>
                        <span>{weatherData.visibility} km</span>
                      </div>
                      <Progress value={weatherData.humidity} className="mt-2" />
                      <p className="text-xs text-muted-foreground">Humidity: {weatherData.humidity}%</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentManager incidents={incidents} />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceMonitor resources={resources} />
        </TabsContent>

        <TabsContent value="analytics">
          <PredictiveAnalytics weatherData={weatherData} seismicData={seismicData} incidents={incidents} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmergencyDashboard;