# CoreLoad: HVAC Block Load Estimator

![CoreLoad HVAC Estimator](/images/hvac-calculator-rendered.png)

## What Problem It Solves

Sizing an HVAC system correctly is critical. An undersized system cannot keep a home comfortable on extreme days, while an oversized system "short-cycles," failing to properly dehumidify the air and wearing out its compressor prematurely. 

The residential HVAC industry has traditionally relied on either incredibly complex, outdated CAD/grid software (which takes hours and requires a steep learning curve) or overly simplistic "rules of thumb" (e.g., 500 sq ft per ton, which leads to wildly inaccurate, oversized systems and unhappy homeowners).

**CoreLoad** solves this binary dilemma. It provides a real-time, interactive, and beautifully designed web application that performs complex block-load calculations under the hood in seconds, without requiring the user to draw a physical floor plan.

## Who It Is For

CoreLoad is perfectly positioned as a **Premium Lead Magnet and Interactive Sales Tool** for:

*   **HVAC Contractors & Sales Professionals:** For use at the kitchen table to instantly provide homeowners with a trustworthy, data-driven estimate of their home's required tonnage before sending the job to an engineer for a final permit-grade Manual J.
*   **Energy Auditors & Home Inspectors:** To quickly demonstrate the impact of envelope improvements (like adding R-49 attic insulation or switching to double-pane windows) on a home's heating and cooling requirements.
*   **Curious Homeowners:** For individuals who want to understand the physics of their home's thermal envelope before receiving quotes for a $15,000+ HVAC replacement.

## Why It’s Better (The CoreLoad Advantage)

*   **10x Better UX & Aesthetics:** While legacy HVAC software looks like Windows 95 spreadsheets, CoreLoad features a premium 2024 "SaaS" aesthetic with glassmorphism, dynamic sliders, interactive micro-animations, and a highly polished UI. 
*   **Instant Visual Feedback:** As you adjust sliders for insulation or window area, the "Live Estimate" BTU numbers change instantly, and the `HouseVisualizer` dynamically updates its background color to reflect the envelope quality.
*   **Mobile-First Design:** CoreLoad is fully responsive, meaning it works flawlessly on an iPad or iPhone in the field, complete with sticky CTA bars.
*   **Frictionless Sharing:** No accounts or logins required. The entire state of the complex 4-step wizard is automatically serialized and encoded into a shareable `?config=` URL. A contractor can configure a house and text the exact results URL to a homeowner.

## Feature List

### 1. Robust Climate Database
Includes built-in ACCA Manual J Design conditions for over **200+ North American cities**. It automatically populates:
*   Winter 99% Heating Design Temperature
*   Summer 1% Sensible Cooling Design Temperature
*   Summer Latent Grain Difference (critical for dehumidification loads)

### 2. Comprehensive Envelope Modeling
*   Floor Area & Ceiling Height (Dynamic Gross Wall calculation)
*   Wall & Roof Insulation toggles (R-Value mapping)
*   Window Area & Pane Type (U-Value and SHGC mapping)
*   Solar Multipliers (accounting for primary sun-facing direction)
*   Blower Door / Building Tightness (Dynamic ACH Infiltration mapping for drafty vs. tight homes)

### 3. Internal & Sensible/Latent System Loads
*   Occupant Sensible & Latent heat contributions (BTU/person)
*   Heavy vs. Standard Appliance load footprints
*   Convective Duct Loss modifiers based on duct location (Conditioned, Unconditioned Basement, Vented Attic) and R-value insulation.

### 4. Dynamic Results Engine
*   **Total Recommended Tonnage**
*   Separated Peak Heating BTU & Cooling BTU
*   Granular Heat Loss/Gain Breakdown (Walls, Roof, Windows, Infiltration, Internal, Ducts)
*   Smart Recommendation Engine (suggesting Variable-Speed vs. Two-Stage equipment based on specific Sensible Heat Ratios and total load).
*   Print-optimized CSS for generating clean PDF reports directly from the browser.

## Accuracy Standard & Engineering Methodology

CoreLoad's algorithm (`hvac-math.ts`) is heavily informed by **ACCA Manual J Standards** and **ASHRAE Fundamentals**. 

While it abstracts the geometry to avoid requiring the user to draw 2D CAD floor plans (meaning it cannot be used for legal room-by-room "Manual D" permitting), the underlying math is authentic physics:

*   Calculates **Sensible Heat Transfer ($Q = U \times A \times \Delta T$)** for conductive surfaces (Walls, Roofs, Windows).
*   Calculates **Air Flow Infiltration ($Q = 1.08 \times CFM \times \Delta T$)** based on dynamically calculated building volume and ACH (Air Changes per Hour).
*   Calculates **Latent Heat Transfer** using the specific moisture grain difference of the chosen geographical climate.
*   Applies Solar Heat Gain Coefficients (SHGC) to window area.

## Installation & Deployment

CoreLoad is a modern Frontend SPA build with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Zustand**. 

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/coreload-estimator.git
    cd coreload-estimator
    ```
2.  **Install exactly 33 dependencies:**
    ```bash
    npm install
    ```
3.  **Start the lightning-fast Vite dev server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### Production Build

To generate the optimized static bundle (which weighs in at an incredibly lightweight ~76 KB gzipped):
```bash
npm run build
```

### SaaS Usage & Deployment (Vercel)

CoreLoad is designed to be hosted statically on platforms like Vercel or Netlify.

1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` to link the project.
3. Run `vercel --prod` to deploy to the live edge network.

*Live Demo / Production Environment: [https://coreload-hvac.vercel.app](https://coreload-hvac.vercel.app)*
