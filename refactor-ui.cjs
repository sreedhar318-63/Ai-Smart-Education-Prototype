const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      if (file.endsWith('.jsx')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Component Style: Flat, bordered, minimal radius
  // Remove heavy shadows
  content = content.replace(/\bshadow-2xl\b/g, '');
  content = content.replace(/\bshadow-xl\b/g, '');
  content = content.replace(/\bshadow-lg\b/g, '');
  content = content.replace(/\bshadow-md\b/g, '');
  // Keep shadow-sm or remove it? Let's just remove all drop shadows for a purely flat Notion-like look, 
  // except for popovers/modals which can have shadow-sm. Let's just remove the big ones.
  content = content.replace(/\bshadow-sm\b/g, '');
  content = content.replace(/\bshadow-xs\b/g, '');

  // Ensure large radii are standardized to rounded-lg or rounded-md
  content = content.replace(/\brounded-3xl\b/g, 'rounded-lg');
  content = content.replace(/\brounded-2xl\b/g, 'rounded-lg');
  content = content.replace(/\brounded-xl\b/g, 'rounded-lg');

  // Add borders to cards if they don't have them but had large rounding
  // This is hard with regex, but most of our cards already have `border border-neutral-200`.

  // 2. Navbar height
  if (file.endsWith('Navbar.jsx')) {
    content = content.replace(/\bh-14\b/g, 'h-12');
  }

  // 3. Fix multiple spaces but do NOT remove newlines
  content = content.replace(/ {2,}/g, ' ');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('UI structural refactoring complete.');
