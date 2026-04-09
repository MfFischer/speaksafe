const fs = require('fs');
const path = require('path');

function replaceInDir(dir, depth = 0) {
    if (!fs.existsSync(dir) || depth > 8) return;
    try {
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                // skip heavy subdirectories if possible
                if (file === '.cache' || file === 'rxjs' || file === 'core-js') return;
                replaceInDir(fullPath, depth + 1);
            } else if (fullPath.endsWith('.js') || fullPath.endsWith('.mjs') || fullPath.endsWith('.cjs')) {
                let content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes("with { type:") || content.includes("with type:")) {
                    console.log("Fixing:", fullPath);
                    // Match both 'with { type: "json" }' and 'with type: "json"' 
                    content = content.replace(/with\s*\{?\s*type:\s*['"]json['"]\s*\}?/g, ""); 
                    fs.writeFileSync(fullPath, content);
                }
            }
        });
    } catch(e) {}
}

console.log("Applying Base-Org Webpack parse hotfix...");
replaceInDir('./node_modules/@base-org');
console.log("Hotfix applied successfully.");
