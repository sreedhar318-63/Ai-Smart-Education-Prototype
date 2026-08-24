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
      if (file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.html')) {
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

  if (file.endsWith('.jsx') || file.endsWith('.html')) {
    // 1. Remove gradients
    content = content.replace(/bg-gradient-to-[a-z]+\s?/g, '');
    content = content.replace(/from-[a-z]+-\d+(\/\d+)?\s?/g, '');
    content = content.replace(/via-[a-z]+-\d+(\/\d+)?\s?/g, '');
    content = content.replace(/to-[a-z]+-\d+(\/\d+)?\s?/g, '');

    // 2. Remove glassmorphism (backdrop-blur)
    content = content.replace(/backdrop-blur-[a-zxl]+\s?/g, '');
    content = content.replace(/backdrop-blur\s?/g, '');

    // 3. Replace bg-white with bg-neutral-100 (cards/panels)
    content = content.replace(/\bbg-white\b/g, 'bg-neutral-100');
    // Replace text-white with text-neutral-50
    content = content.replace(/\btext-white\b/g, 'text-neutral-50');
    // Replace pure black
    content = content.replace(/\bbg-black\b/g, 'bg-neutral-900');
    content = content.replace(/\btext-black\b/g, 'text-neutral-900');

    // 4. Map colors
    // We will use the 'stone' classes as our new 'neutral' but rename them to neutral
    content = content.replace(/\bstone-/g, 'neutral-');
    
    // Convert indigo to accent (primary action)
    content = content.replace(/\bindigo-/g, 'accent-');
    
    // Convert amber to accent (since it was used a lot for highlights)
    // Wait, amber was also used for warning.
    // Let's make amber -> warning, emerald -> success, rose -> error.
    content = content.replace(/\bamber-100\b/g, 'warning-100');
    content = content.replace(/\bamber-200\b/g, 'warning-200');
    content = content.replace(/\bamber-300\b/g, 'warning-300');
    content = content.replace(/\bamber-500\b/g, 'warning-500');
    content = content.replace(/\bamber-600\b/g, 'warning-600');
    content = content.replace(/\bamber-700\b/g, 'warning-700');
    content = content.replace(/\bamber-900\b/g, 'warning-900');
    content = content.replace(/\bamber-50\b/g, 'warning-50');
    
    // Any remaining amber will just become accent to be safe if we missed one, 
    // actually let's just make amber -> accent for most buttons, wait, PathScreen used amber as primary buttons.
    // Let's replace 'bg-amber-600' with 'bg-accent-600'.
    content = content.replace(/\bbg-amber-/g, 'bg-accent-');
    content = content.replace(/\btext-amber-/g, 'text-accent-');
    content = content.replace(/\bborder-amber-/g, 'border-accent-');

    // Convert emerald -> success
    content = content.replace(/\bemerald-/g, 'success-');

    // Convert rose -> error
    content = content.replace(/\brose-/g, 'error-');

    // Fix multiple spaces but do NOT remove newlines
    content = content.replace(/ {2,}/g, ' ');
    
    // Replace specific hex colors in App.jsx and index.html
    content = content.replace(/#faf9f6/gi, '#FCFBF9');
    content = content.replace(/#faf8f5/gi, '#FCFBF9');
    content = content.replace(/#242220/gi, '#161512');
    content = content.replace(/#22211f/gi, '#161512');
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('JSX/HTML refactoring complete.');
