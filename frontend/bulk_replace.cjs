const fs = require('fs');
const path = require('path');

const MAPPINGS = [
  { old: '#0a0a08', new: 'var(--app-bg-primary)' },
  { old: '#0d0d0a', new: 'var(--app-bg-primary)' },
  { old: 'rgba(240,236,228,0.03)', new: 'var(--app-bg-glass)' },
  { old: 'rgba(240,236,228,0.08)', new: 'var(--app-border-default)' },
  { old: 'rgba(240,236,228,0.1)', new: 'var(--app-border-default)' },
  { old: 'rgba(240,236,228,0.5)', new: 'var(--app-text-secondary)' },
  { old: 'rgba(240,236,228,0.35)', new: 'var(--app-text-tertiary)' },
  { old: '#f0ece4', new: 'var(--app-text-primary)' },
  { old: '#c9a96e', new: 'var(--app-accent-primary)' },
  { old: 'rgba(201,169,110,0.3)', new: 'var(--app-border-hover)' },
  { old: 'rgba(201,169,110,0.15)', new: 'var(--app-accent-soft)' },
  { old: 'rgba(201,169,110,0.06)', new: 'var(--app-accent-glow)' },
  // Also handle some hexes in uppercase just in case
  { old: '#0A0A08', new: 'var(--app-bg-primary)' },
  { old: '#0D0D0A', new: 'var(--app-bg-primary)' },
  { old: '#F0ECE4', new: 'var(--app-text-primary)' },
  { old: '#C9A96E', new: 'var(--app-accent-primary)' },
];

const EXCLUSIONS = [
  'LandingPage.tsx',
  'Home.tsx',
  'Login.tsx',
  'Signup.tsx',
  'index.css', // already handled
  'bulk_replace.cjs'
];

const EXCLUDED_DIRS = [
  'landing',
  'home',
  'auth'
];

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.tsx', '.ts', '.jsx', '.js', '.css'].includes(ext)) return;

  const fileName = path.basename(filePath);
  if (EXCLUSIONS.includes(fileName)) return;

  const dirName = path.basename(path.dirname(filePath));
  if (EXCLUDED_DIRS.includes(dirName)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  MAPPINGS.forEach(mapping => {
    // Escape regex characters in old string
    const escapeRegex = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    const regex = new RegExp(escapeRegex(mapping.old), 'g');
    content = content.replace(regex, mapping.new);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(file)) {
        walkDir(filePath);
      }
    } else {
      processFile(filePath);
    }
  });
}

walkDir(path.join(__dirname, 'src'));
console.log('Bulk replacement complete.');
