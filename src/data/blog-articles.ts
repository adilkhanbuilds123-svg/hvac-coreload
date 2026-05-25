export interface Article {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
}

export const articles: Article[] = [
  {
    slug: 'under-the-hood-coreload-physics',
    title: 'Under the Hood: The Physics Engine of CoreLoad',
    date: '2024-12-01',
    readTime: '10 min',
    excerpt: 'An explicit breakdown of the geometry, barometric thermodynamics, and solar multipliers driving the CoreLoad engine.',
    content: `CoreLoad is not a UI toy. It is a strict, mathematical implementation of the ACCA Manual J simplified block-load methodology. Every architectural input you provide actively alters the thermodynamic equations in the background. Here is exactly how the engine handles the physics of your building.

### Altitude and Air Density
As elevation increases, air pressure drops. Thinner air carries less thermal energy, which radically alters infiltration loads and equipment capacity. When you adjust the elevation slider, CoreLoad runs the Standard Barometric Formula:
\`Density Multiplier = (1 - 0.000006875 * elevation)^5.2559\`

At sea level, this is 1.0. At Denver's 5,280-foot elevation, the multiplier is approximately 0.83x. This multiplier is strictly applied to all sensible infiltration calculations (\`Infiltration = Volume * ACH * 0.018 * ΔT * Density Multiplier\`).

### Architectural Geometry
When you change the Footprint Shape from Rectangle to L-Shape or U-Shape, the engine applies geometric multipliers (1.15x and 1.25x respectively) to the base perimeter to account for the additional external wall surface area created by inside/outside corners. 
If you check "Vaulted Ceilings," the engine switches to trigonometry: \`Math.sqrt(halfWidth² + vaultedHeight²)\`. This calculates the exact hypotenuse of the roof slope, increasing the roof surface area and adding massive cubic footage to the air volume calculation, heavily impacting the final infiltration load.

### Solar Heat Gain Coefficients
Solar heat gain is highly dependent on orientation. The engine applies a baseline 1.0x solar multiplier to North-facing windows but a brutal 1.8x multiplier to West-facing windows. If you input 500 sqft of glass on the West wall instead of the North wall, the required cooling tonnage will skyrocket, exactly as it would in reality.

### Duct Thermodynamics
If you place ducts in a "Vented Attic" instead of a "Conditioned" space, the engine applies severe thermodynamic penalties. It assumes the attic will hit 135°F+ in the summer and calculates the heat transfer directly through the duct insulation into the 55°F supply air (\`Heat Gain = Surface Area * U-Value * ΔT * 1.5\`). This adds massive sensible and latent cooling penalties to your final required tonnage.

We expose these exact mathematical penalties dynamically in the "Physics Modifiers & Telemetry" section of every generated report.`
  },
  {
    slug: 'how-to-size-ac',
    title: 'How to Properly Size an Air Conditioning System',
    date: '2024-11-15',
    readTime: '8 min',
    excerpt: 'Why the "rule of thumb" fails and what Manual J gets right.',
    content: `The most common mistake in residential HVAC is oversizing. Contractors who use the "400-600 sqft per ton" rule of thumb routinely install equipment 40-60% larger than what the building actually needs. This creates a cascade of problems: short cycling, poor humidity control, higher energy bills, and premature equipment failure.

ACCA Manual J solves this by calculating the actual heat transfer through every component of the building envelope. The method accounts for wall and roof R-values, window solar heat gain coefficients, infiltration rates, internal loads from occupants and appliances, and duct system losses. Each of these variables affects the peak load calculation differently for heating versus cooling.

The altitude correction factor is particularly important and frequently overlooked. At Denver's 5,280-foot elevation, air density drops to roughly 83% of sea level. This means infiltration loads decrease, but it also means equipment capacity decreases. The standard barometric formula (1 - 0.000006875 * elevation)^5.2559 quantifies this effect precisely.

Perhaps the most critical output of a proper Manual J calculation is the sensible heat ratio (SHR). This ratio tells you what fraction of the cooling load is temperature-driven versus humidity-driven. In Houston, where latent grains can exceed 125, the SHR might be 0.65 — meaning 35% of your cooling load is dehumidification. A system sized only for total BTU without considering SHR will leave the space clammy and uncomfortable.`,
  },
  {
    slug: 'manual-j-vs-rule-of-thumb',
    title: 'Manual J vs. Rule of Thumb: The Real Cost of Oversizing',
    date: '2024-10-28',
    readTime: '6 min',
    excerpt: 'Oversized HVAC systems cost more to install, more to run, and fail sooner.',
    content: `A 2,000-square-foot home in Atlanta might get a 5-ton system using the "one ton per 400 sqft" rule. Run a proper Manual J calculation and you'll often find the actual load is 3.0-3.5 tons. That's $2,000-3,000 in unnecessary equipment cost, plus 15-25% higher annual energy consumption from short cycling.

Short cycling is the primary failure mode of oversized systems. When a 5-ton unit satisfies a 3-ton load, it reaches the thermostat setpoint in 6-8 minutes instead of the design 15-20 minutes. During those shortened cycles, the evaporator coil never gets cold enough to effectively condense moisture from the air. Indoor humidity stays at 60-65% instead of the comfortable 45-50%.

The compressor bears the brunt of the damage. Every start cycle sends a current spike 6-8x the running amperage through the motor windings. A properly sized system might cycle 6-8 times per hour during peak conditions. An oversized system cycles 12-15 times. Over a 15-year equipment life, that's millions of additional high-stress start events.

Manual J eliminates this waste by calculating the actual peak load. The key insight is that peak load depends on design conditions — the 99th percentile winter temperature and 1st percentile summer temperature for your specific location — not annual averages.`,
  },
  {
    slug: 'sensible-vs-latent-heat',
    title: 'Sensible vs. Latent Heat: Why Humidity Matters More Than Temperature',
    date: '2024-09-20',
    readTime: '7 min',
    excerpt: 'Understanding the physics of moisture removal in air conditioning.',
    content: `Every air conditioning system does two jobs simultaneously: it lowers the dry-bulb temperature (sensible cooling) and removes moisture from the air (latent cooling). The ratio between these two — the sensible heat ratio (SHR) — is the most important number in equipment selection that most homeowners never hear about.

In arid climates like Phoenix (latent grains: 8), cooling is almost entirely sensible. The SHR is typically 0.90-0.95, meaning you can focus purely on BTU capacity when selecting equipment. But in Houston (latent grains: 125), the SHR drops to 0.60-0.70. More than a third of the cooling load is moisture removal.

This matters because conventional air conditioners have a fixed SHR. A standard single-stage unit operates at roughly 0.75 SHR. If your building's load SHR is 0.65, you need either a variable-speed compressor that can modulate its operating SHR, or supplemental dehumidification.

The infiltration component is the primary driver of latent load. Each air change brings outdoor humidity into the conditioned space. The formula Q_latent = 0.68 * CFM * ΔGrains quantifies this. A leaky house (1.2 ACH) in Miami can have an infiltration latent load exceeding 8,000 BTU/hr — enough to overwhelm an undersized or improperly selected system.`,
  },
  {
    slug: 'understanding-seer2',
    title: 'Understanding SEER2: The New Efficiency Standard',
    date: '2024-08-12',
    readTime: '5 min',
    excerpt: 'What changed with SEER2 and what it means for equipment selection.',
    content: `In January 2023, the DOE shifted efficiency ratings from SEER to SEER2. The new metric uses a modified testing procedure (AHRI 210/240-2023) with higher external static pressure on the indoor unit, simulating realistic ductwork resistance rather than laboratory conditions.

The practical impact: SEER2 numbers are approximately 4.7% lower than equivalent SEER ratings. A system that rated 16 SEER now rates approximately 15.2 SEER2. The minimum federal standards also changed: 14.3 SEER2 for the North region, 15.0 SEER2 for the South and Southwest.

For load calculations, SEER2 doesn't change the fundamental physics. Your building's heating and cooling loads are determined by envelope characteristics and climate, not by equipment efficiency. Where SEER2 matters is in operating cost calculations and equipment selection.

A properly sized 16 SEER2 system running 1,200 hours per year at $0.12/kWh costs roughly $450/year to operate for cooling. The same load on a 20 SEER2 variable-speed unit drops to approximately $360/year. The $90/year savings typically doesn't justify the $3,000-5,000 premium for residential applications unless utility rates exceed $0.18/kWh or cooling hours exceed 2,000 per year.`,
  },
  {
    slug: 'window-orientation-matters',
    title: 'Why Window Orientation Matters More Than Window Area',
    date: '2024-07-05',
    readTime: '6 min',
    excerpt: 'West-facing windows contribute 4x the solar heat gain of north-facing glazing.',
    content: `Solar heat gain is the single largest variable in residential cooling loads, and it's entirely dependent on orientation. A west-facing window receives direct afternoon sun at the peak of the day's heat — the solar insolation coefficient is roughly 80 BTU/hr/sqft. The same window facing north receives only diffuse radiation at approximately 20 BTU/hr/sqft.

This 4:1 ratio means that 50 sqft of west-facing glass adds more cooling load than 200 sqft of north-facing glass. Yet the "window percentage" rules of thumb treat all orientations equally. Manual J corrects this by applying orientation-specific solar factors to each window direction.

The Solar Heat Gain Coefficient (SHGC) of the glazing modifies this further. Single-pane glass has an SHGC of 0.86 — it transmits 86% of incident solar energy. Triple-pane low-E glass drops to 0.40. The interaction between orientation and SHGC creates a design optimization space: aggressive low-E glazing on west and south faces, standard glazing on north faces where you actually want passive solar gain in winter.

For cooling-dominated climates, the most impactful energy improvement is often replacing or shading west-facing windows rather than adding insulation to walls. A 100-sqft west window with single-pane glass contributes 6,880 BTU/hr of solar gain. Upgrading to triple-pane drops this to 3,200 BTU/hr — equivalent to adding R-19 insulation to 400+ sqft of wall area.`,
  },
  {
    slug: 'duct-losses-hidden-tax',
    title: 'Duct Losses: The Hidden Tax on HVAC Efficiency',
    date: '2024-06-18',
    readTime: '7 min',
    excerpt: 'Ducts in unconditioned spaces can waste 20-40% of your heating and cooling.',
    content: `The most efficient HVAC system in the world loses its advantage if the distribution system wastes energy. Ducts in unconditioned spaces — vented attics, crawlspaces, garages — are subject to the same heat transfer physics as the building envelope, but contractors rarely give them the same attention.

Consider a standard duct system in a vented attic during summer. Supply air enters the duct at 55°F. The attic temperature on a 95°F design day can reach 135°F or higher. With uninsulated ducts (U-value = 1.0), the heat gain is staggering. For a typical 1,500-sqft home with 375 sqft of duct surface area: 375 * 1.0 * (135 - 55) * 1.5 = 45,000 BTU/hr. That's roughly equal to the entire cooling load of the house being added by the duct system alone.

R-8 duct insulation reduces this dramatically. The U-value drops to 0.125, cutting duct losses by 87%. The calculation: 375 * 0.125 * 80 * 1.5 = 5,625 BTU/hr. Still significant, but manageable.

The optimal solution is bringing ducts inside the conditioned envelope. In-conditioned ducts have zero temperature differential with the surroundings, eliminating conductive losses entirely. This is why spray-foam encapsulated attics and sealed crawlspaces have become standard practice in high-performance homes. The energy savings from eliminating duct losses often exceed the cost of the encapsulation.`,
  },
  {
    slug: 'heat-pumps-at-altitude',
    title: 'Heat Pumps at Altitude: Performance Considerations Above 4,000 Feet',
    date: '2024-05-22',
    readTime: '8 min',
    excerpt: 'Air density drops and equipment capacity falls. Here is what the math says.',
    content: `The standard barometric formula (1 - 0.000006875 * elevation)^5.2559 quantifies how air pressure — and therefore air density — decreases with altitude. At 5,280 feet (Denver), the multiplier is approximately 0.826. At 7,000 feet (Santa Fe), it drops to 0.772. This has direct implications for both load calculations and equipment performance.

On the load side, lower air density reduces infiltration heat transfer. The sensible infiltration formula Q = Volume * ACH * 0.018 * ΔT includes an implicit sea-level air density. At Denver, the actual infiltration load is 82.6% of the sea-level calculation. This is a favorable effect — your building needs less heating and cooling to offset air leakage.

On the equipment side, the effect is unfavorable. Heat pump capacity depends on the mass flow rate of air across the outdoor coil. At reduced air density, the compressor moves the same volume of air but less mass. Rated capacity drops roughly proportional to the density multiplier. A 3-ton heat pump rated at sea level delivers approximately 2.5 tons at Denver's elevation.

The net effect varies by climate. In heating-dominated high-altitude locations like Denver, the reduced infiltration load partially offsets the reduced equipment capacity. But the building envelope loads (conduction through walls, roof, windows) are unaffected by altitude — they depend on temperature difference, not air density.

For Manual J calculations at altitude, the CoreLoad engine applies the 0.65 floor clamp to the density multiplier. This prevents unrealistic results at extreme elevations while maintaining accuracy across the 0-12,000 foot range where residential construction occurs. Below this floor, the formula would underpredict both loads and capacity in ways that don't match empirical data.`,
  },
];
