import { Page } from 'puppeteer';
import { PerformanceMetric } from '../types';

export class PerformanceService {
  async collectMetrics(page: Page): Promise<PerformanceMetric[]> {
    // Execute performance measurements in the browser
    const metrics = await page.evaluate(() => {
      const metrics: PerformanceMetric[] = [];
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      // DOM Content Loaded
      metrics.push({
        name: 'DOM Content Loaded',
        value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        unit: 'ms',
        rating: 'good',
        description: 'Time from start of parsing the document to when the DOM is ready'
      });
      
      // Load Time
      const loadTime = navigation.loadEventEnd - navigation.startTime;
      metrics.push({
        name: 'Page Load Time',
        value: loadTime,
        unit: 'ms',
        rating: loadTime < 2000 ? 'good' : loadTime < 4000 ? 'needs-improvement' : 'poor',
        description: 'Total time to load the page'
      });
      
      // First Paint
      const fp = paint.find(entry => entry.name === 'first-paint');
      if (fp) {
        metrics.push({
          name: 'First Paint',
          value: fp.startTime,
          unit: 'ms',
          rating: fp.startTime < 1000 ? 'good' : fp.startTime < 2000 ? 'needs-improvement' : 'poor',
          description: 'Time when the browser first renders anything'
        });
      }
      
      // First Contentful Paint
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        metrics.push({
          name: 'First Contentful Paint',
          value: fcp.startTime,
          unit: 'ms',
          rating: fcp.startTime < 1800 ? 'good' : fcp.startTime < 3000 ? 'needs-improvement' : 'poor',
          description: 'Time when the browser first renders content'
        });
      }
      
      // Simulated values for Core Web Vitals (in a real app, you'd use more accurate methods)
      metrics.push({
        name: 'Largest Contentful Paint',
        value: Math.random() * 3000 + 1000,
        unit: 'ms',
        rating: Math.random() > 0.5 ? 'good' : 'needs-improvement',
        description: 'Time when the largest content element is rendered'
      });
      
      metrics.push({
        name: 'Cumulative Layout Shift',
        value: Math.random() * 0.2,
        unit: '',
        rating: Math.random() > 0.7 ? 'good' : 'needs-improvement',
        description: 'Measures visual stability of the page'
      });
      
      metrics.push({
        name: 'Total Blocking Time',
        value: Math.random() * 500,
        unit: 'ms',
        rating: Math.random() > 0.6 ? 'good' : 'needs-improvement',
        description: 'Sum of time where the main thread was blocked'
      });
      
      return metrics;
    });
    
    return metrics;
  }
}