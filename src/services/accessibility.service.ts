import { Page } from 'puppeteer';
import { AccessibilityScore, AccessibilityIssue } from '../types';

export class AccessibilityService {
  async analyze(page: Page): Promise<AccessibilityScore> {
    // Run a basic accessibility audit
    const accessibilityAudit = await page.evaluate(() => {
      const issues: AccessibilityIssue[] = [];
      
      // Check for images without alt text
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
      if (imagesWithoutAlt.length > 0) {
        issues.push({
          type: 'Images without alt text',
          description: 'Images should have alternative text for screen readers',
          impact: 'serious',
          count: imagesWithoutAlt.length
        });
      }
      
      // Check for low contrast text (simplified)
      const lowContrastElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.color === style.backgroundColor;
      });
      if (lowContrastElements.length > 0) {
        issues.push({
          type: 'Low contrast text',
          description: 'Text should have sufficient contrast with its background',
          impact: 'serious',
          count: lowContrastElements.length
        });
      }
      
      // Check for missing form labels
      const inputsWithoutLabels = document.querySelectorAll('input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])');
      const inputsWithoutAssociatedLabels = Array.from(inputsWithoutLabels).filter(input => {
        return !document.querySelector(`label[for="${(input as HTMLInputElement).id}"]`);
      });
      if (inputsWithoutAssociatedLabels.length > 0) {
        issues.push({
          type: 'Form controls without labels',
          description: 'Form controls should have associated labels',
          impact: 'critical',
          count: inputsWithoutAssociatedLabels.length
        });
      }
      
      // Check for missing heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let previousLevel = 0;
      let skippedHeadings = 0;
      Array.from(headings).forEach(heading => {
        const currentLevel = parseInt(heading.tagName.charAt(1));
        if (currentLevel - previousLevel > 1) {
          skippedHeadings++;
        }
        previousLevel = currentLevel;
      });
      if (skippedHeadings > 0) {
        issues.push({
          type: 'Skipped heading levels',
          description: 'Heading levels should not be skipped for proper document structure',
          impact: 'moderate',
          count: skippedHeadings
        });
      }
      
      // Calculate overall score (simplified)
      let score = 100;
      issues.forEach(issue => {
        if (issue.impact === 'critical') score -= issue.count * 10;
        else if (issue.impact === 'serious') score -= issue.count * 5;
        else if (issue.impact === 'moderate') score -= issue.count * 2;
        else score -= issue.count;
      });
      score = Math.max(0, score);
      
      return {
        overall: score,
        issues
      };
    });
    
    return accessibilityAudit;
  }
}