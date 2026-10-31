# 🌿 CampusEco

### Smart Campus Carbon & Energy Audit Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Recharts-2.10-22B8CF?style=flat-square" alt="Recharts">
  <img src="https://img.shields.io/badge/Zustand-State_Mgmt-453629?style=flat-square" alt="Zustand">
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
</p>

<p align="center">
  <strong>Zero-hardware CAPEX</strong> · <strong>Real-time Telemetry</strong> · <strong>Carbon Analytics</strong> · <strong>Gamified Conservation</strong>
</p>

---

## 🎯 Overview

**CampusEco** is a pure-software digital framework that eliminates the prohibitive hardware overhead of physical IoT smart meters by replacing them with a **data-driven, algorithmic simulation engine** that tracks micro-level energy consumption and carbon footprints across university departments and laboratories.

> **Target Impact:** Achieve a **15–25% reduction** in departmental energy waste through automated anomaly detection, usage scheduling, and gamified behavioral incentives.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CampusEco Platform                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │  Telemetry    │───▶│  Carbon Engine   │───▶│  Analytics DB    │  │
│  │  Simulator    │    │  (Conversion)    │    │  (Time-Series)   │  │
│  │  (60s ticks)  │    │  CO₂e = E × GI   │    │  Hourly Records  │  │
│  └──────────────┘    └──────────────────┘    └──────────────────┘  │
│         │                      │                       │            │
│         ▼                      ▼                       ▼            │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │  Anomaly     │    │  Alert Engine    │    │  Gamification    │  │
│  │  Detector    │    │  (Thresholds)    │    │  (Leaderboard)   │  │
│  │  (>150% base)│    │  (Idle/Weekend)  │    │  (Monthly Rank)  │  │
│  └──────────────┘    └──────────────────┘    └──────────────────┘  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                    React Frontend (Dashboard)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │Analytics │ │Equipment │ │  Alerts  │ │Leaderboard│ │ Settings │ │
│  │Dashboard │ │Inventory │ │  Panel   │ │  Rankings │ │  Config  │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Spatial Hierarchy

```
Campus
├── Building A (Engineering Block)
│   ├── Department: Computer Science
│   │   ├── Lab: AI Research Lab
│   │   │   ├── Room 101 - GPU Cluster
│   │   │   └── Room 102 - Student Lab
│   │   └── Lab: Network Security Lab
│   │       └── Room 201 - Cyber Range
│   └── Department: Electrical Engineering
│       └── Lab: Power Electronics Lab
│           ├── Room 301 - High Voltage
│           └── Room 302 - PCB Workshop
├── Building B (Science Building)
│   ├── Department: Chemistry
│   │   └── Lab: Analytical Chemistry Lab
│   └── Department: Physics
│       └── Lab: Quantum Computing Lab
└── Building C (Arts & Humanities)
    └── Department: Digital Media
        └── Lab: Media Production Studio
```

---

## 🧮 Mathematical Models

### 1. Telemetry Emulation Logic

$$E(t) = P_{\text{rated}} \cdot S(t) \cdot \eta$$

| Variable | Description | Unit |
|----------|-------------|------|
| $E(t)$ | Energy consumed at time $t$ | kWh |
| $P_{\text{rated}}$ | Device wattage rating | Watts |
| $S(t)$ | Operational schedule multiplier | $\{0, 1\}$ |
| $\eta$ | Equipment efficiency factor | $[0, 1]$ |

### 2. Carbon Footprint Conversion

$$\text{CO}_2e = E(t) \times \text{Grid\_Intensity\_Factor}$$

| Region | Factor (kg CO₂e/kWh) |
|--------|---------------------|
| US Average | 0.42 |
| US Coal-Heavy | 0.65 |
| US Renewable-Heavy | 0.25 |
| EU Average | 0.28 |
| UK | 0.21 |
| India | 0.72 |
| China | 0.58 |

### 3. Anomaly Detection

$$\text{Anomaly} = \begin{cases} \text{true} & \text{if } E(t) > 1.5 \times E_{\text{baseline}} \\ \text{false} & \text{otherwise} \end{cases}$$

### 4. Monthly Reduction Score

$$\text{Reduction \%} = \frac{E_{\text{previous}} - E_{\text{current}}}{E_{\text{previous}}} \times 100$$

---

## ✨ Features

### ✅ Implemented

- [x] **User Authentication & RBAC** — Admin, Department Chair, Lab Technician roles
- [x] **Equipment Audit & Inventory Manager** — Full CRUD for devices, power ratings, schedules
- [x] **Real-Time Telemetry Simulator** — Async engine pushing metrics every 5s (simulating 60s)
- [x] **Interactive Analytics Dashboard** — Area charts, bar charts, pie charts, KPI cards
- [x] **Automated Idle Load Detector** — Flags off-peak & weekend equipment activity
- [x] **Alert System** — 4 severity levels with acknowledge/clear workflow
- [x] **Gamified Departmental Leaderboard** — Monthly rankings with scoring methodology
- [x] **Regional Carbon Intensity** — 7 configurable grid factors
- [x] **Anomaly Detection** — 150% baseline threshold monitoring
- [x] **Historical Data Generation** — 24-hour lookback for dashboard context

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | Component architecture |
| **Styling** | Tailwind CSS 4 | Utility-first responsive design |
| **Charts** | Recharts 2.10 | Area, Bar, Pie visualizations |
| **State** | Zustand | Lightweight global state management |
| **Icons** | Lucide React | Consistent iconography |
| **Build** | Vite 6 | Fast HMR & optimized bundling |
| **Animation** | Framer Motion | Smooth UI transitions |
| **Routing** | React Router 6 | Client-side navigation |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/campuseco.git
cd campuseco

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 🔴 **Administrator** | `admin@campus.edu` | `demo123` |
| 🔵 **Dept. Chair** | `sarah@campus.edu` | `demo123` |
| 🟣 **Lab Technician** | `tech@campus.edu` | `demo123` |

---

## 📊 Application Pages

### 1. 📈 Analytics Dashboard
Real-time energy consumption visualizations with:
- **KPI Cards** — Total energy, carbon footprint, active alerts, avg. reduction
- **Hourly Energy Chart** — Area chart with baseline overlay
- **Carbon by Department** — Donut chart with regional factors
- **Department Comparison** — Bar chart of energy consumption
- **Reduction Performance** — Horizontal bar chart with color-coded thresholds
- **Breakdown Table** — Detailed per-department metrics

### 2. 🔌 Equipment Inventory
Full CRUD interface for managing lab devices:
- Device name, wattage, operating hours, efficiency factor
- Room/lab/department location tracking
- Active/inactive toggle for simulation
- Search and department filtering
- Summary cards (total devices, rated power, daily estimate)

### 3. 🔔 Alerts & Notifications
Automated anomaly detection panel:
- **4 Severity Levels** — Critical, High, Medium, Low
- **4 Alert Types** — Anomaly, Idle Load, Weekend Activity, Threshold
- Filter by status (all/unacknowledged/acknowledged)
- Filter by severity
- Acknowledge and clear workflow
- Detection logic documentation

### 4. 🏆 Green Leaderboard
Gamified departmental rankings:
- **Top 3 Podium** — Visual podium with gold/silver/bronze
- **Full Rankings Table** — All departments with scores
- **Scoring Methodology** — 70% reduction, 20% efficiency, 10% compliance
- Department chair attribution

### 5. ⚙️ Settings
Platform configuration:
- Regional carbon intensity factor selection
- System architecture visualization
- Alert threshold documentation
- RBAC role descriptions

---

## 📁 Project Structure

```
campuseco/
├── index.html                    # Entry HTML
├── package.json                  # Dependencies & scripts
├── vite.config.js                # Build configuration
├── tsconfig.json                 # TypeScript config
└── src/
    ├── App.tsx                   # Root component & routing
    ├── main.tsx                  # React entry point
    ├── index.css                 # Global styles + Tailwind
    ├── types/
    │   └── index.ts              # TypeScript interfaces
    ├── utils/
    │   └── carbon.ts             # Carbon engine & math models
    ├── data/
    │   ├── campus.ts             # Campus hierarchy & equipment
    │   └── simulation.ts         # Telemetry generator
    ├── store/
    │   └── useStore.ts           # Zustand global state
    └── components/
        ├── Login.tsx             # Auth page
        ├── Layout.tsx            # Sidebar navigation
        ├── Dashboard.tsx         # Analytics charts
        ├── EquipmentManager.tsx  # CRUD interface
        ├── Alerts.tsx            # Alert panel
        ├── Leaderboard.tsx       # Gamified rankings
        └── Settings.tsx          # Configuration
```

---

## 🔐 Role-Based Access Control

| Capability | Admin | Chair | Technician |
|-----------|-------|-------|------------|
| View all departments | ✅ | ❌ | ❌ |
| View own department | ✅ | ✅ | ❌ |
| View own lab | ✅ | ✅ | ✅ |
| Manage equipment | ✅ | ✅ | ✅ |
| Configure thresholds | ✅ | ❌ | ❌ |
| View leaderboard | ✅ | ✅ | ✅ |
| Acknowledge alerts | ✅ | ✅ | ✅ |
| Regional settings | ✅ | ❌ | ❌ |

---

## 🔄 Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Equipment   │     │  Telemetry   │     │   Carbon    │
│  Registry    │────▶│  Simulator   │────▶│  Converter  │
│  (Wattage,   │     │  (60s tick)  │     │  (Grid IF)  │
│   Schedule)  │     │  E=P×S×η    │     │  CO₂=E×GI   │
└─────────────┘     └──────────────┘     └─────────────┘
                           │                      │
                           ▼                      ▼
                    ┌──────────────┐     ┌─────────────┐
                    │   Anomaly    │     │  Analytics  │
                    │  Detector    │     │  Dashboard  │
                    │  (>150% BL)  │     │  (Recharts) │
                    └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Alert       │
                    │  Engine      │
                    │  (Severity)  │
                    └──────────────┘
```

---

## 🎮 Gamification Scoring

The Green Leaderboard uses a composite scoring algorithm:

| Component | Weight | Description |
|-----------|--------|-------------|
| **Carbon Reduction** | 70% | Monthly % reduction vs. baseline |
| **Absolute Efficiency** | 20% | Lower total emissions = better |
| **Compliance** | 10% | Fewer anomalies = better management |

**Score Formula:**
```
Score = (Reduction% × 10) + (100 - min(AnomalyCount × 5, 50))
```

---

## 🌍 Environmental Impact

By deploying CampusEco across a mid-size university campus:

| Metric | Target |
|--------|--------|
| Energy waste reduction | 15–25% |
| Hardware CAPEX savings | 100% (zero IoT meters) |
| Carbon tracking granularity | Room-level |
| Anomaly response time | < 60 seconds |
| Behavioral engagement | Gamified leaderboard |

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built with 🌱 for a sustainable campus future</strong>
</p>

<p align="center">
  <sub>CampusEco v1.0 — Smart Campus Carbon & Energy Audit Platform</sub>
</p>
