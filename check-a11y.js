const fs = require('fs');

const path = 'c:\\\\Users\\\\aldyf\\\\Downloads\\\\CODE\\\\antigravity\\\\post-pwa\\\\lighthouse-report.json';
const data = fs.readFileSync(path, 'utf8');
const report = JSON.parse(data);

const a11yCategory = report.categories.accessibility;
console.log('Accessibility category score:', a11yCategory.score);

const failedAudits = [];
for (const auditRef of a11yCategory.auditRefs) {
  const audit = report.audits[auditRef.id];
  if (audit.score !== 1 && audit.score !== null && audit.scoreDisplayMode !== 'notApplicable') {
    failedAudits.push(audit);
  }
}

console.log('Failed accessibility audits:');
failedAudits.forEach(audit => {
  console.log(`- ${audit.id}: ${audit.title} (score: ${audit.score}, mode: ${audit.scoreDisplayMode})`);
  if (audit.details && audit.details.items) {
    audit.details.items.forEach(item => {
      console.log('  Item:', item.node ? item.node.selector : JSON.stringify(item));
    });
  }
});
