const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const mappings = [
    { regex: /bg-(blue|purple|violet|indigo)-([1-9]00|600)\/(10|20|30)/g, replace: 'bg-white/5' },
    { regex: /bg-(blue|purple|violet|indigo)-900\/30/g, replace: 'bg-bg-tertiary/50' },
    { regex: /border-(blue|purple|violet|indigo)-[1-9]00\/(10|20|30)/g, replace: 'border-white/10' },
    { regex: /text-(blue|purple|violet|indigo)-[1-9]00/g, replace: 'text-accent-bright' },
    { regex: /text-(blue|purple|violet|indigo)-(100|200|300)/g, replace: 'text-text-primary' },
    { regex: /from-(purple|blue|violet|indigo)-[1-9]00/g, replace: 'from-accent-dark' },
    { regex: /to-(blue|purple|violet|indigo)-[1-9]00/g, replace: 'to-accent-mid' },
    { regex: /from-(purple|blue|violet|indigo)-[1-9]00/g, replace: 'from-accent-dark' }, // Duplicate for safety or specific cases
    { regex: /to-blue-200/g, replace: 'to-white' }, // Specific case for App.tsx headline
    { regex: /bg-(blue|purple|violet|indigo)-[1-9]00/g, replace: 'bg-accent-mid' },
    { regex: /peer-checked:bg-(blue|purple|violet|indigo)-[1-9]00/g, replace: 'peer-checked:bg-accent-mid' },
    { regex: /ring-(blue|purple|violet|indigo)-[1-9]00/g, replace: 'ring-accent-mid' },
    { regex: /ring-(blue|purple|violet|indigo)-[1-9]00\/50/g, replace: 'ring-accent-mid/50' },
    { regex: /focus:border-(blue|purple|violet|indigo)-[1-9]00/g, replace: 'focus:border-accent-mid' },
    { regex: /focus:ring-(blue|purple|violet|indigo)-[1-9]00/g, replace: 'focus:ring-accent-mid' },
    { regex: /bg-accent-primary/g, replace: 'bg-accent-mid' },
    { regex: /text-accent-primary/g, replace: 'text-accent-bright' },
    { regex: /gradient-background-animated/g, replace: 'bg-mesh-gradient' }
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content;
            
            for (const map of mappings) {
                updated = updated.replace(map.regex, map.replace);
            }
            
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

console.log('Starting global color replacement in frontend/src...');
processDirectory(srcDir);
console.log('Finished global color replacement.');
