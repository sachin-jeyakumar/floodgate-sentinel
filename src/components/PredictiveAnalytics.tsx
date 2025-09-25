import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, AlertTriangle, Brain, BarChart3, Activity, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

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

interface Incident {
  id: string;
  type: string;
  severity: string;
  location: { lat: number; lng: number };
  description: string;
  status: string;
  timestamp: string;
}

interface Prediction {
  id: string;
  type: string;
  probability: number;
  timeframe: string;
  severity: string;
  description: string;
  recommendedActions: string[];
}

interface PredictiveAnalyticsProps {
  weatherData: WeatherData | null;
  seismicData: SeismicData[];
  incidents: Incident[];
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ 
  weatherData, 
  seismicData, 
  incidents 
}) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [modelAccuracy, setModelAccuracy] = useState(87);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Simulate AI model predictions based on current data
    generatePredictions();
  }, [weatherData, seismicData, incidents]);

  const generatePredictions = () => {
    setIsAnalyzing(true);
    
    // Simulate processing time
    setTimeout(() => {
      const newPredictions: Prediction[] = [];

      // Weather-based predictions
      if (weatherData) {
        if (weatherData.windSpeed > 25) {
          newPredictions.push({
            id: 'PRED001',
            type: 'High Wind Event',
            probability: 78,
            timeframe: 'Next 6 hours',
            severity: 'medium',
            description: 'Strong winds may cause power outages and structural damage',
            recommendedActions: [
              'Pre-position utility crews',
              'Issue public safety advisory',
              'Check emergency shelter readiness'
            ]
          });
        }

        if (weatherData.humidity > 85 && weatherData.temperature > 20) {
          newPredictions.push({
            id: 'PRED002',
            type: 'Flash Flood Risk',
            probability: 65,
            timeframe: 'Next 12 hours',
            severity: 'high',
            description: 'High humidity and temperature increase flood probability',
            recommendedActions: [
              'Monitor river levels',
              'Prepare evacuation routes',
              'Alert low-lying area residents'
            ]
          });
        }
      }

      // Incident pattern predictions
      const recentFloodIncidents = incidents.filter(i => 
        i.type.toLowerCase().includes('flood') && 
        Date.now() - new Date(i.timestamp).getTime() < 3600000 // Last hour
      );

      if (recentFloodIncidents.length > 1) {
        newPredictions.push({
          id: 'PRED003',
          type: 'Flood Escalation',
          probability: 84,
          timeframe: 'Next 3 hours',
          severity: 'critical',
          description: 'Multiple flood incidents suggest widespread flooding event',
          recommendedActions: [
            'Activate emergency coordination center',
            'Deploy all available water rescue teams',
            'Issue evacuation orders for flood zones'
          ]
        });
      }

      // Seismic predictions
      if (seismicData.length > 0 && seismicData[0].magnitude > 1.5) {
        newPredictions.push({
          id: 'PRED004',
          type: 'Aftershock Sequence',
          probability: 42,
          timeframe: 'Next 24 hours',
          severity: 'low',
          description: 'Minor aftershocks possible following recent seismic activity',
          recommendedActions: [
            'Monitor structural integrity',
            'Brief search and rescue teams',
            'Check emergency communication systems'
          ]
        });
      }

      setPredictions(newPredictions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-emergency';
    if (probability >= 50) return 'text-warning';
    return 'text-success';
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const riskFactors = [
    {
      name: 'Weather Conditions',
      risk: weatherData ? Math.min(90, (weatherData.windSpeed + weatherData.humidity) / 2) : 0,
      status: weatherData?.windSpeed > 25 ? 'High' : 'Normal'
    },
    {
      name: 'Incident Density',
      risk: Math.min(100, incidents.length * 10),
      status: incidents.length > 5 ? 'High' : 'Normal'
    },
    {
      name: 'Resource Availability',
      risk: 100 - Math.min(100, incidents.length * 15),
      status: incidents.length < 3 ? 'Good' : 'Limited'
    },
    {
      name: 'Communication Systems',
      risk: 15,
      status: 'Operational'
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI Status Banner */}
      <Alert className="border-primary bg-primary/10">
        <Brain className="h-4 w-4 text-primary" />
        <AlertDescription className="text-primary">
          <strong>AI Predictive Engine Active:</strong> Analyzing {weatherData ? '1' : '0'} weather feed, 
          {seismicData.length} seismic sensors, and {incidents.length} active incidents. 
          Model accuracy: {modelAccuracy}%
        </AlertDescription>
      </Alert>

      {/* Model Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Model Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{modelAccuracy}%</div>
            <Progress value={modelAccuracy} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Predictions Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isAnalyzing ? 'text-warning' : 'text-success'}`}>
              {isAnalyzing ? 'Analyzing' : 'Active'}
            </div>
            {isAnalyzing && <div className="w-4 h-4 border-2 border-warning border-t-transparent rounded-full animate-spin mt-2" />}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Active Predictions</TabsTrigger>
          <TabsTrigger value="risk-assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="scenarios">What-If Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          {predictions.length > 0 ? (
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <Card key={prediction.id} className={`${
                  prediction.severity === 'critical' ? 'border-emergency shadow-emergency/20' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className={`h-5 w-5 ${getProbabilityColor(prediction.probability)}`} />
                          <span>{prediction.type}</span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{prediction.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityBadge(prediction.severity)}>
                          {prediction.severity}
                        </Badge>
                        <div className={`text-right ${getProbabilityColor(prediction.probability)}`}>
                          <div className="text-lg font-bold">{prediction.probability}%</div>
                          <div className="text-xs">probability</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Expected timeframe: {prediction.timeframe}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Recommended Actions:</h4>
                      <ul className="space-y-1">
                        {prediction.recommendedActions.map((action, index) => (
                          <li key={index} className="text-sm flex items-start space-x-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="default">
                        Implement Actions
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Adjust Prediction
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Predictions Available</h3>
                <p className="text-muted-foreground mb-4">
                  {isAnalyzing 
                    ? 'AI model is analyzing current data patterns...'
                    : 'Current conditions do not indicate any significant risks in the near future.'}
                </p>
                <Button onClick={generatePredictions} disabled={isAnalyzing}>
                  {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="risk-assessment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskFactors.map((factor, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{factor.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                    <Badge variant={factor.risk > 60 ? 'destructive' : factor.risk > 30 ? 'secondary' : 'outline'}>
                      {factor.status}
                    </Badge>
                  </div>
                  <Progress value={factor.risk} className="h-2" />
                  <div className="text-right text-sm text-muted-foreground">
                    {factor.risk}% risk score
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Center</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex-col">
                  <AlertTriangle className="h-6 w-6 mb-2" />
                  <span>Major Flood Scenario</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Zap className="h-6 w-6 mb-2" />
                  <span>Power Grid Failure</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>Mass Evacuation</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Activity className="h-6 w-6 mb-2" />
                  <span>Resource Shortage</span>
                </Button>
              </div>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  What-if scenarios help test response strategies and optimize resource allocation before real emergencies occur.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveAnalytics;