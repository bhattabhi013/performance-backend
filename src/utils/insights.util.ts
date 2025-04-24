import { PerformanceMetric, AccessibilityScore, Insight } from '../types';

export function generateInsights(
  performanceMetrics: PerformanceMetric[],
  accessibilityData: AccessibilityScore
): Insight[] {
  const insights: Insight[] = [];
  
  // Performance insights
  for (const metric of performanceMetrics) {
    if (metric.rating === 'poor' || metric.rating === 'needs-improvement') {
      if (metric.name.includes('Paint')) {
        insights.push({
          category: 'Performance',
          title: `Improve ${metric.name}`,
          description: `Your ${metric.name.toLowerCase()} is slower than recommended.`,
          impact: metric.rating === 'poor' ? 'high' : 'medium',
          recommendation: 'Optimize critical rendering path, reduce JavaScript and CSS blocking time, and consider lazy loading non-critical resources.'
        });
      } else if (metric.name.includes('Load')) {
        insights.push({
          category: 'Performance',
          title: 'Reduce Page Load Time',
          description: 'Your page takes too long to load completely.',
          impact: metric.rating === 'poor' ? 'high' : 'medium',
          recommendation: 'Compress images, minify CSS and JavaScript, use browser caching, and consider a CDN for static assets.'
        });
      } else if (metric.name.includes('Layout Shift')) {
        insights.push({
          category: 'User Experience',
          title: 'Reduce Layout Shifts',
          description: 'Your page has noticeable layout shifts during loading.',
          impact: 'medium',
          recommendation: 'Set explicit width and height for images and videos, avoid inserting content above existing content, and use transform animations instead of animations that trigger layout changes.'
        });
      }
    }
  }
  
  // Accessibility insights
  if (accessibilityData.overall < 90) {
    for (const issue of accessibilityData.issues) {
      if (issue.impact === 'critical' || issue.impact === 'serious') {
        if (issue.type.toLowerCase().includes('alt text')) {
          insights.push({
            category: 'Accessibility',
            title: 'Add Alt Text to Images',
            description: 'Images without alt text are not accessible to screen reader users.',
            impact: 'high',
            recommendation: 'Add descriptive alt text to all images. For decorative images, use alt="".'
          });
        } else if (issue.type.toLowerCase().includes('contrast')) {
          insights.push({
            category: 'Accessibility',
            title: 'Improve Text Contrast',
            description: 'Low contrast text is difficult to read for users with visual impairments.',
            impact: 'high',
            recommendation: 'Ensure text has a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.'
          });
        } else if (issue.type.toLowerCase().includes('form')) {
          insights.push({
            category: 'Accessibility',
            title: 'Add Labels to Form Controls',
            description: 'Form controls without labels are not accessible to screen reader users.',
            impact: 'high',
            recommendation: 'Associate labels with form controls using the \'for\' attribute or nest the control inside the label element.'
          });
        } else if (issue.type.toLowerCase().includes('heading')) {
          insights.push({
            category: 'Accessibility',
            title: 'Fix Heading Hierarchy',
            description: 'Proper heading hierarchy is important for screen reader navigation.',
            impact: 'medium',
            recommendation: 'Use headings in sequential order (h1, then h2, etc.) without skipping levels.'
          });
        }
      }
    }
  }
  
  // Add general best practices if we don't have many insights yet
  if (insights.length < 3) {
    insights.push({
      category: 'Best Practices',
      title: 'Implement Browser Caching',
      description: 'Browser caching can improve load times for returning visitors.',
      impact: 'medium',
      recommendation: 'Set appropriate cache headers for static resources to enable browser caching.'
    });
    
    insights.push({
      category: 'SEO',
      title: 'Optimize Meta Tags',
      description: 'Proper meta tags help search engines understand your content.',
      impact: 'medium',
      recommendation: 'Ensure your page has appropriate title, description, and Open Graph meta tags.'
    });
  }
  
  return insights;
}