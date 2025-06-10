import { topicsData } from "@/data/topics";

export function generateMarkdownContent(subtopic) {
  return `# ${subtopic.id}: ${subtopic.name}

## Overview
${subtopic.content}

## Test Objectives
1. Verify the implementation of security controls
2. Identify potential vulnerabilities
3. Assess the effectiveness of security measures

## How to Test
1. Review the application's security documentation
2. Analyze the implementation of security controls
3. Perform security testing using appropriate tools
4. Document findings and recommendations

## Remediation
1. Implement proper security controls
2. Follow security best practices
3. Regular security assessments
4. Keep security measures up to date

## References
- OWASP Testing Guide
- Security Best Practices
- Industry Standards
`;
}

export function generateAllMarkdownFiles() {
  topicsData.forEach(topic => {
    topic.subtopics.forEach(subtopic => {
      const content = generateMarkdownContent(subtopic);
      const fileName = `${subtopic.id}.md`;
      // You can implement file writing logic here
      console.log(`Generated ${fileName}`);
    });
  });
} 