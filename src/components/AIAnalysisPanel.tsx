import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  MapPin, 
  Zap,
  RefreshCw,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  analyzeDisasterData, 
  generateDisasterPrediction,
  validateOpenAIConfig,
  type DisasterAnalysisData,
  type AIAnalysisResponse 
} from '@/lib/openai';

interface AIAnalysisPanelProps {
  incidents: DisasterAnalysisData['incidents'];
  resources: DisasterAnalysisData['resources'];
  weatherData?: DisasterAnalysisData['weatherData'];
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  incidents,
  resources,
  weatherData
}) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Check API key configuration on mount
  useEffect(() => {
    setApiKeyConfigured(validateOpenAIConfig());
  }, []);

  // Auto-refresh analysis every 30 seconds if enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && apiKeyConfigured) {
      interval = setInterval(performAnalysis, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, apiKeyConfigured, incidents, resources, weatherData]);

  // Perform initial analysis when data changes
  useEffect(() => {
    if (apiKeyConfigured && (incidents.length > 0 || resources.length > 0)) {
      performAnalysis();
    }
  }, [incidents, resources, weatherData, apiKeyConfigured]);

  const performAnalysis = async () => {
    if (!apiKeyConfigured) return;
    
    setLoading(true);
    setError(null);

    try {
      const analysisData: DisasterAnalysisData = {
        incidents,
        resources,
        weatherData
      };

      const [analysisResult, predictionResult] = await Promise.all([
        analyzeDisasterData(analysisData),
        generateDisasterPrediction(incidents, weatherData || {})
      ]);

      setAnalysis(analysisResult);
      setPrediction(predictionResult);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!apiKeyConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Analysis</span>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription className="space-y-3">
              <p>OpenAI API key not configured. To enable real-time AI analysis:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Get your API key from <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">OpenAI Platform</a></li>
                <li>Add <code className="bg-muted px-1 rounded">NEXT_PUBLIC_OPENAI_API_KEY</code> to your environment</li>
                <li>Restart the application</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Disaster Analysis</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-green-50' : ''}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto: {autoRefresh ? 'ON' : 'OFF'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={performAnalysis}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-1" />
                )}
                Analyze
              </Button>
            </div>
          </CardTitle>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </CardHeader>
        {error && (
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      {/* Risk Assessment */}
      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ) : analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Overall Risk Level</span>
                <Badge className={getRiskColor(analysis.riskAssessment.overallRisk)}>
                  {analysis.riskAssessment.overallRisk.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <span className="font-medium">Risk Score</span>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      analysis.riskAssessment.score >= 80 ? 'bg-red-500' :
                      analysis.riskAssessment.score >= 60 ? 'bg-orange-500' :
                      analysis.riskAssessment.score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${analysis.riskAssessment.score}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {analysis.riskAssessment.score}/100
                </span>
              </div>

              <div className="space-y-2">
                <span className="font-medium">Key Risk Factors</span>
                <div className="flex flex-wrap gap-2">
                  {analysis.riskAssessment.factors.map((factor, index) => (
                    <Badge key={index} variant="outline">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>AI Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-red-600 mb-2">Immediate Actions</h4>
                <ul className="space-y-1">
                  {analysis.recommendations.immediate.map((action, index) => (
                    <li key={index} className="text-sm flex items-start space-x-2">
                      <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-orange-600 mb-2">Short-term Planning</h4>
                <ul className="space-y-1">
                  {analysis.recommendations.shortTerm.map((action, index) => (
                    <li key={index} className="text-sm flex items-start space-x-2">
                      <span className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-2">Long-term Strategy</h4>
                <ul className="space-y-1">
                  {analysis.recommendations.longTerm.map((action, index) => (
                    <li key={index} className="text-sm flex items-start space-x-2">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resource Allocation */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Resource Optimization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Priority Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.resourceAllocation.priority.map((resource, index) => (
                    <Badge key={index} variant="default">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Allocation Suggestions</h4>
                <ul className="space-y-1">
                  {analysis.resourceAllocation.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Summary */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Analysis Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{analysis.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Predictive Analysis */}
      {prediction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Predictive Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm leading-relaxed whitespace-pre-line">
              {prediction}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIAnalysisPanel;
