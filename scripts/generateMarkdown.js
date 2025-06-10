const fs = require('fs');
const path = require('path');
const { topicsData } = require('../src/data/topics');

function generateMarkdownContent(subtopic) {
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

function generateAllMarkdownFiles() {
  // Create content directory if it doesn't exist
  const contentDir = path.join(__dirname, '../content');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // Create topic directories and markdown files
  topicsData.forEach(topic => {
    const topicDir = path.join(contentDir, topic.id);
    if (!fs.existsSync(topicDir)) {
      fs.mkdirSync(topicDir, { recursive: true });
    }

    topic.subtopics.forEach(subtopic => {
      const content = generateMarkdownContent(subtopic);
      const fileName = `${subtopic.id}.md`;
      const filePath = path.join(topicDir, fileName);
      
      fs.writeFileSync(filePath, content);
      console.log(`Generated ${filePath}`);
    });
  });
}

// Run the generator
generateAllMarkdownFiles(); 