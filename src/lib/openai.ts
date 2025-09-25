import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Only for demo purposes
});

export interface DisasterAnalysisData {
  incidents: Array<{
    id: string;
    type: string;
    severity: string;
    location: { lat: number; lng: number };
    description: string;
    status: string;
    timestamp: string;
  }>;
  resources: Array<{
    id: string;
    type: string;
    status: string;
    location: { lat: number; lng: number };
    capacity: number;
    assignedTo?: string;
  }>;
  weatherData?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    conditions: string;
  };
}

export interface AIAnalysisResponse {
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    score: number;
    factors: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  resourceAllocation: {
    priority: string[];
    suggestions: string[];
  };
  summary: string;
}

export async function analyzeDisasterData(data: DisasterAnalysisData): Promise<AIAnalysisResponse> {
  try {
    const prompt = `
    You are an expert disaster management AI assistant. Analyze the following real-time disaster data and provide comprehensive insights:

    INCIDENTS DATA:
    ${JSON.stringify(data.incidents, null, 2)}

    RESOURCES DATA:
    ${JSON.stringify(data.resources, null, 2)}

    WEATHER DATA:
    ${data.weatherData ? JSON.stringify(data.weatherData, null, 2) : 'Not available'}

    Please provide a structured analysis in the following JSON format:
    {
      "riskAssessment": {
        "overallRisk": "low|medium|high|critical",
        "score": 0-100,
        "factors": ["factor1", "factor2", ...]
      },
      "recommendations": {
        "immediate": ["action1", "action2", ...],
        "shortTerm": ["action1", "action2", ...],
        "longTerm": ["action1", "action2", ...]
      },
      "resourceAllocation": {
        "priority": ["resource1", "resource2", ...],
        "suggestions": ["suggestion1", "suggestion2", ...]
      },
      "summary": "Comprehensive summary of the situation and key insights"
    }

    Focus on:
    1. Risk level assessment based on incident severity and patterns
    2. Resource deployment efficiency
    3. Preventive measures
    4. Emergency response optimization
    5. Geographic distribution of incidents
    `;

    const response = await openai.chat.completions.create({
      model: process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a disaster management expert AI. Provide precise, actionable insights for emergency response coordination.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.NEXT_PUBLIC_OPENAI_MAX_TOKENS || '1000'),
      temperature: 0.3
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from OpenAI');

    // Parse JSON response
    const analysis = JSON.parse(content) as AIAnalysisResponse;
    return analysis;
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    // Return fallback analysis
    return {
      riskAssessment: {
        overallRisk: 'medium',
        score: 50,
        factors: ['Limited AI analysis available', 'Manual review required']
      },
      recommendations: {
        immediate: ['Review incidents manually', 'Deploy available resources'],
        shortTerm: ['Set up AI configuration', 'Monitor situation closely'],
        longTerm: ['Implement AI-powered monitoring', 'Enhance prediction capabilities']
      },
      resourceAllocation: {
        priority: ['Emergency services', 'Medical teams'],
        suggestions: ['Optimize resource distribution', 'Maintain readiness levels']
      },
      summary: 'AI analysis currently unavailable. Please configure OpenAI API key for advanced insights.'
    };
  }
}

export async function generateDisasterPrediction(historicalData: any, currentConditions: any): Promise<string> {
  try {
    const prompt = `
    Based on historical disaster data and current conditions, predict potential disaster scenarios:

    Historical Data: ${JSON.stringify(historicalData, null, 2)}
    Current Conditions: ${JSON.stringify(currentConditions, null, 2)}

    Provide a detailed prediction report focusing on:
    1. Likelihood of specific disaster types
    2. Geographical areas at risk
    3. Timeline for potential events
    4. Preventive measures
    `;

    const response = await openai.chat.completions.create({
      model: process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a disaster prediction specialist. Provide accurate, data-driven predictions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.2
    });

    return response.choices[0]?.message?.content || 'Prediction unavailable';
  } catch (error) {
    console.error('Prediction error:', error);
    return 'AI prediction service currently unavailable. Please check configuration.';
  }
}

export function validateOpenAIConfig(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
}
