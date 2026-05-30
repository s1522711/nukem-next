const fs = require('fs');

const svgStr = fs.readFileSync('public/world.svg', 'utf8');

// Match all <path d="...">
const regex = /<path d="([^"]+)"/g;
let paths = [];
let match;
while ((match = regex.exec(svgStr)) !== null) {
  paths.push(match[1]);
}

const componentCode = `
import React from 'react'

export const WorldMapPaths = () => (
  <g stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" fill="rgba(0, 240, 255, 0.05)" className="opacity-60">
    {${JSON.stringify(paths)}.map((d, i) => (
      <path key={i} d={d} />
    ))}
  </g>
)
`;

fs.writeFileSync('src/components/WorldMapPaths.tsx', componentCode);
console.log("Created WorldMapPaths.tsx with " + paths.length + " paths.");
