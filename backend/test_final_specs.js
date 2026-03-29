const fs = require('fs');

const state = JSON.parse(fs.readFileSync('state.json', 'utf8'));
const specs = {};

// Helper to extract specs from the crazy nested structure
function extractSpecs(obj) {
    if (!obj || typeof obj !== 'object') return;
    
    // Look for patterns that look like [ {label: "Name", value: "S24"}, ... ]
    // Or grids of data
    if (obj.label && obj.value && typeof obj.label === 'object' && typeof obj.value === 'object') {
        const key = obj.label.value?.text || obj.label.text;
        const val = obj.value.value?.text || obj.value.text;
        if (key && val && typeof key === 'string' && typeof val === 'string' && key.length < 50) {
            specs[key] = val;
        }
    }

    if (Array.isArray(obj)) {
        obj.forEach(item => extractSpecs(item));
    } else {
        for (const key in obj) {
            extractSpecs(obj[key]);
        }
    }
}

extractSpecs(state.multiWidgetState.widgetsData);
console.log("Extracted Specs:", JSON.stringify(specs, null, 2));
console.log("Count:", Object.keys(specs).length);
