export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  description: string;
}

export interface AccessibilityIssue {
  type: string;
  description: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  count: number;
}

export interface AccessibilityScore {
  overall: number;
  issues: AccessibilityIssue[];
}

export interface Insight {
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface Report {
  id: string;
  url: string;
  timestamp: string;
  metrics: PerformanceMetric[];
  accessibility: AccessibilityScore;
  insights: Insight[];
  error?: string;
}