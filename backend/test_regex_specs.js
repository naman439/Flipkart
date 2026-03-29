const fs = require('fs');

const html = fs.readFileSync('dump.html', 'utf8');
const specs = {};

// Regex to find label/value pairs in the JSON blob/state
// "label_0":{"properties":{},"visible":true,"value":{"text":"PROCESSOR TYPE"}},"value_0":{"properties":{},"visible":true,"value":{"text":["8 GEN 3"]}}
// This matches the common pattern in Flipkart's multi-widget state
const regex = /"label_0":\{"properties":\{\},"visible":true,"value":\{"text":"([^"]+)"\}\},"value_0":\{"properties":\{\},"visible":true,"value":\{"text":\["([^"]+)"\]\}\}/g;

let match;
while ((match = regex.exec(html)) !== null) {
    const key = match[1];
    const val = match[2];
    if (key && val && key.length < 100) {
        specs[key] = val;
    }
}

// Another variation with label/value reversed
const regexRev = /"value_0":\{"properties":\{\},"visible":true,"value":\{"text":\["([^"]+)"\]\}\},"label_0":\{"properties":\{\},"visible":true,"value":\{"text":"([^"]+)"\}\}/g;
while ((match = regexRev.exec(html)) !== null) {
    const val = match[1];
    const key = match[2];
    if (key && val && key.length < 100) {
        specs[key] = val;
    }
}

console.log("Extracted Specs:", JSON.stringify(specs, null, 2));
console.log("Count:", Object.keys(specs).length);
