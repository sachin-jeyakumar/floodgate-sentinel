import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Activity, Shield, Zap } from 'lucide-react';
import EmergencyDashboard from '@/components/EmergencyDashboard';
import heroImage from '@/assets/hero-emergency.jpg';

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <EmergencyDashboard />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-primary/20 rounded-full mr-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              AI-Powered Emergency Response
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
            Crisis Command Center
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Real-time disaster coordination platform with AI-powered prediction, 
            resource optimization, and multi-agency emergency response management
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={() => setShowDashboard(true)}
            >
              <Activity className="mr-2 h-5 w-5" />
              Enter Command Center
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2"
            >
              <MapPin className="mr-2 h-5 w-5" />
              View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Advanced Emergency Management</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Leveraging artificial intelligence and real-time data to save lives and optimize emergency response
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Real-Time Monitoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Live data feeds from weather services, seismic sensors, traffic systems, and emergency calls
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-warning/20 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-warning" />
                  </div>
                  <CardTitle>Predictive Analytics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI-powered forecasting to predict disaster evolution and optimize preventive actions
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-success hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success/20 rounded-lg">
                    <MapPin className="h-6 w-6 text-success" />
                  </div>
                  <CardTitle>Resource Optimization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Intelligent allocation of emergency resources to maximize response effectiveness
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-info hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-info/20 rounded-lg">
                    <Shield className="h-6 w-6 text-info" />
                  </div>
                  <CardTitle>Multi-Agency Coordination</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Unified command center for police, fire, medical, and rescue team coordination
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emergency hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emergency/20 rounded-lg">
                    <Zap className="h-6 w-6 text-emergency" />
                  </div>
                  <CardTitle>Automated Response</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Intelligent agents for routine tasks while maintaining human oversight for critical decisions
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Activity className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <CardTitle>Mobile Integration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Field-ready mobile apps for first responders with offline capabilities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Emergency Response?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Experience the power of AI-driven crisis management in real-time
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => setShowDashboard(true)}
          >
            Launch Command Center
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
