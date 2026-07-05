# Formula 1 Telemetry & Standings Dashboard

A responsive, high-performance, premium Formula 1 racing telemetry and statistics dashboard for the 2026 season. Built using Next.js 15 (App Router), TypeScript, and Vanilla CSS with custom interactive SVG charts and map tracking.

⚡ **Live Demo**: [https://f1-dashboard-swart.vercel.app](https://f1-dashboard-swart.vercel.app)

---

## 🏎️ Key Features

1.  **F1 Premium Carbon Dark Theme**: Sleek glassmorphism dashboards with racing red accents, supporting full responsiveness on Mobile, Tablet, and Desktop.
2.  **Live Telemetry Simulator**: Tracks coordinates of 10 drivers on the Austria Red Bull Ring SVG map in real-time, calculating sectors, DRS activation, and safety car incident logs.
3.  **Drivers & Constructors Standings**: Features full global search matching, custom filters, sorting, and positioning medals.
4.  **CSV Standing Exporter**: Generates instant browser download of driver/constructor standings in CSV format.
5.  **Driver & Constructor Comparison Panels**: Interactively compare speed traces and qualifications utilizing mathematical SVG Radar charts and points distribution grids.
6.  **Circuit Explorer**: Overview of specs (length, laps, corners count) alongside detailed weather widgets and historical podium results.
7.  **Latest Motorsport News**: Card grids with read-time trackers and filtering categories.

---

## 📂 Folder Structure

```text
f1-dashboard/
├── next-env.d.ts
├── next.config.js
├── package.json
├── tsconfig.json
├── .env.example
├── .env.local
└── src/
    ├── app/               # Next.js App Router Viewports
    │   ├── layout.tsx     # Global sidebar layout wrapper
    │   ├── page.tsx       # Home dashboard
    │   ├── standings/     # Driver/Constructor tables
    │   ├── calendar/      # Schedule list with countdowns
    │   ├── live/          # Live Timing and Track visualizer
    │   ├── compare/       # SVG Radar Head-to-Head
    │   ├── circuits/      # Layout and specs explorer
    │   └── stats/         # Points progression curves
    ├── components/
    │   ├── Layout/        # Sidebar and Header components
    │   └── UI/            # Modals, Toast notifications, overlays
    ├── services/
    │   ├── f1Api.ts       # Jolpica / Ergast API endpoints + Mock Fallback
    │   └── liveSim.ts     # Telemetry mathematics and coordinates simulators
    ├── store/
    │   └── f1Store.tsx    # Context provider coordination
    └── styles/
        └── globals.css    # Carbon theme CSS tokens
```

---

## ⚙️ Installation & Running

### Prerequisites
*   [Node.js](https://nodejs.org/) (Version 18.x or newer recommended)
*   NPM or Yarn package manager

### Steps

1.  **Clone or navigate to the project directory**:
    ```bash
    cd f1-dashboard
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run development server**:
    ```bash
    npm run dev
    ```

4.  **Open browser dashboard**:
    Navigate to `http://localhost:3000` to interact with the F1 Race Center!

5.  **Compile production bundle**:
    ```bash
    npm run build
    ```

---

## 🔧 Environment Configuration

Customize settings using the `.env.local` file:
*   `NEXT_PUBLIC_F1_API_URL`: Points to the Jolpica/Ergast compatible endpoint (Default: `https://api.jolpica.info/ergast/v1`).
*   `NEXT_PUBLIC_ENABLE_SIMULATOR`: Sets if the live timing simulator is active (Default: `true`).
