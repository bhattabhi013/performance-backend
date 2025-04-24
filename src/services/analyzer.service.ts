import puppeteer from 'puppeteer';
import { PerformanceService } from './performance.service';
import { AccessibilityService } from './accessibility.service';
import { generateInsights } from '../utils/insights.util';
import logger from '../utils/logger';
import config from '../config';
import { Report } from '../types';

export class AnalyzerService {
  private performanceService: PerformanceService;
  private accessibilityService: AccessibilityService;

  constructor() {
    this.performanceService = new PerformanceService();
    this.accessibilityService = new AccessibilityService();
  }

  async analyzeWebsite(url: string): Promise<Report> {
    let browser;
    
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Set timeout
      await page.setDefaultNavigationTimeout(config.analysisTimeout);
      
      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // Collect performance metrics
      const performanceMetrics = await this.performanceService.collectMetrics(page);
      
      // Collect accessibility data
      const accessibilityData = await this.accessibilityService.analyze(page);
      
      // Generate insights
      const insights = generateInsights(performanceMetrics, accessibilityData);
      
      // Create the report
      const report: Report = {
        id: crypto.randomUUID(), // Generate a random ID for reference
        url,
        timestamp: new Date().toISOString(),
        metrics: performanceMetrics,
        accessibility: accessibilityData,
        insights
      };
      
      logger.info(`Analysis completed for ${url}`);
      
      return report;
    } catch (error) {
      logger.error(`Error analyzing ${url}: ${error}`);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}