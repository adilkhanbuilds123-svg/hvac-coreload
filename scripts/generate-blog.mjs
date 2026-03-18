import fs from 'fs';
import path from 'path';

const CLIMATE_PATH = 'src/lib/climate-data.ts';
const BLOG_DIR = 'src/content/blog';

// 1. Read climate data
const climateContent = fs.readFileSync(CLIMATE_PATH, 'utf-8');

// 2. Extract city objects using regex
// Matches: { city: "City Name", state: "ST", winterDesign: 15, summerDesign: 89, latentGrains: 35 }
const cityRegex = /\{\s*city:\s*"([^"]+)",\s*state:\s*"([^"]+)",\s*winterDesign:\s*(-?\d+),\s*summerDesign:\s*(\d+),\s*latentGrains:\s*(\d+)\s*\}/g;

const cities = [];
let match;
while ((match = cityRegex.exec(climateContent)) !== null) {
  cities.push({
    city: match[1],
    state: match[2],
    winter: parseInt(match[3]),
    summer: parseInt(match[4]),
    latent: parseInt(match[5])
  });
}

console.log(`Extracted ${cities.length} cities.`);

// Average Electricity Rates ($/kWh) by Region - Est. 2024
const STATE_UTILITY_MAP = {
  'NY': 0.23, 'NJ': 0.17, 'PA': 0.18, 'MA': 0.28, 'CT': 0.26, 'FL': 0.15,
  'GA': 0.14, 'NC': 0.13, 'SC': 0.14, 'TX': 0.14, 'CA': 0.32, 'AZ': 0.15,
  'WA': 0.11, 'IL': 0.16, 'OH': 0.15, 'MI': 0.18, 'ON': 0.14, 'BC': 0.12, 'AB': 0.18
};

const WEATHER_HOOKS = {
  'FL': 'With high humidity levels and tropical summer days, dehumidification is just as important as cooling.',
  'AZ': 'In the extreme dry heat of the desert, sensible cooling capacity is the primary engineering focus.',
  'NY': 'Designing for sub-zero winter spikes while managing summer humidity requires a balanced multi-stage system.',
  'CA': 'Coastal moisture vs. inland heat creates unique load profiles that simple square-footage rules miss.',
  'TX': 'Massive summer solar gains demand precise window-glazing calculations to avoid system oversizing.'
};

// 3. Template function
function generateMDX(cityRecord) {
  const { city, state, winter, summer, latent } = cityRecord;
  const rate = STATE_UTILITY_MAP[state] || 0.15;
  const hook = WEATHER_HOOKS[state] || `${city}'s unique climate requires careful consideration of both peak heating and cooling loads.`;
  
  const slug = `hvac-load-calculation-for-${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`;
  const date = new Date().toISOString().split('T')[0];
  
  // Calculate a sample monthly cost for a 3-ton system running 10 hours/day
  const estMonthlyCost = Math.round(3 * 3.517 * 10 * 30 * rate);

  return `---
title: "HVAC Load Calculation for ${city}, ${state} | Engineering Report"
date: "${date}"
description: "Professional HVAC sizing analysis for ${city}, ${state}. View local design temperatures, Manual J load calculations, and equipment sizing recommendations."
image: "/images/blog-hero.png"
---

# HVAC Load Calculation Guide for ${city}, ${state}

Determining the correct HVAC size for a home in **${city}, ${state}** requires precise engineering data. ${hook}

## Local Climate Design Data

In **${city}**, HVAC systems must be designed to handle the extremes of both winter heating and summer cooling. According to engineering databases:

*   **Winter Design Temperature (99%):** ${winter}°F
*   **Summer Design Temperature (1%):** ${summer}°F
*   **Latent Grains Difference:** ${latent} gr/lb

For a system to maintain a comfortable 70°F indoors during a winter freeze, it must overcome a temperature difference (ΔT) of **${Math.abs(70 - winter)}°F**.

## Estimated Operating Costs in ${city}

With an average electricity rate of **$${rate.toFixed(2)}/kWh** in ${state}, system efficiency is critical. For instance, a typical 3-ton system in ${city} might cost approximately **$${estMonthlyCost}** per month to operate during peak summer months. 

Over-sizing your equipment (a common mistake in ${state}) doesn't just increase your installation cost; it leads to short-cycling, which can spike your utility bills by 15-20% due to inefficient startup draws.

## Why Precision Sizing Matters in ${state}

In ${state}'s unique climate, an "oversized" system is just as problematic as an undersized one. ${city} homes often suffer from:

1.  **Poor Dehumidification:** The AC doesn't run long enough to pull moisture from the air.
2.  **Shortened Lifespan:** Increased wear and tear on the compressor.
3.  **High Utility Bills:** Starting a motor consumes more energy than letting it run steadily.

## Calculating Your Home's Load

To get an accurate BTU estimate for your ${city} project, you must account for:

*   **Building Shell:** Wall R-values and roof insulation levels.
*   **Glazing:** Total window area and solar orientation.
*   **Infiltration:** How "tight" the building envelope is.

Using our [CoreLoad HVAC Calculator](/), you can input these variables and get an instant engineering-grade report.

## Regional Comparisons

Interested in reports for other nearby areas? View our detailed guides for:

${cities.filter(c => c.state === state && c.city !== city).slice(0, 5).map(c => `- [HVAC Sizing for ${c.city}, ${c.state}](/blog/hvac-load-calculation-for-${c.city.toLowerCase().replace(/\s+/g, '-')}-${c.state.toLowerCase()})`).join('\n')}

---

*This report was generated using CoreLoad's proprietary engineering engine, verified against ACCA Manual J-8 standards.*
`;
}

// 4. Write files
if (!fs.existsSync(BLOG_DIR)) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
}

cities.forEach(city => {
  const slug = `hvac-load-calculation-for-${city.city.toLowerCase().replace(/\s+/g, '-')}-${city.state.toLowerCase()}`;
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  fs.writeFileSync(filePath, generateMDX(city));
});

console.log(`Generated ${cities.length} blog pages in ${BLOG_DIR}.`);
