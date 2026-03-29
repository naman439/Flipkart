const fs = require('fs');
const state = JSON.parse(fs.readFileSync('state.json', 'utf8'));

function findKeyPath(obj, target, path = "state") {
    if (!obj || typeof obj !== 'object') return;
    
    for (const key in obj) {
        if (typeof obj[key] === 'string' && obj[key].includes(target)) {
            console.log(`Path: ${path}.${key} -> ${obj[key]}`);
        }
        findKeyPath(obj[key], target, `${path}.${key}`);
    }
}

findKeyPath(state, "Display Size");
