# SmartQueue

### Digital Queue Management System for Hospitals & Public Service Centers

SmartQueue is a web-based digital queue management system designed to reduce physical waiting lines and make queue handling easier for both visitors and staff.

Visitors can join a queue digitally, receive a token, and monitor their position. Staff can manage queues from an operations console, while a dedicated display board can show live token and counter information to people waiting in the facility.

---

## Problem

Traditional queue systems in hospitals and public service centers often rely on physical lines, paper tokens, or manually managed queues.

This can lead to:

* Long physical waiting lines
* Uncertainty about waiting time
* Crowded waiting areas
* Difficulty managing multiple counters
* Poor visibility of queue status
* Inefficient handling of priority cases
* Confusion when a token is called

SmartQueue provides a digital alternative that makes the queue visible, manageable, and easier to navigate.

---

## Solution

SmartQueue divides the queue experience into three main interfaces:

**Visitor → Queue Status → Operations → Public Display**

Visitors receive a digital token, staff control the queue from an operations console, and the public display communicates the current queue status.

The system is designed around a simple principle:

> **Join the queue once. Then know exactly what is happening.**

---

## Key Features

### 🎫 Digital Token Generation

Visitors can select the required service and receive a queue token without needing to stand in a physical line.

Supported services include:

* General Consultation
* Prescription & Pharmacy
* Laboratory & Diagnostics
* Specialist Referrals

Each token contains information such as:

* Token number
* Service
* Queue status
* Current position
* Estimated waiting time
* Assigned counter

---

### 📍 Live Queue Status

The queue status screen provides a simple overview of a visitor's position.

It displays:

* **My Token**
* **Now Serving**
* **People Ahead**
* **Estimated Wait**
* **Assigned Counter**

This allows visitors to monitor the queue without repeatedly asking staff for updates.

---

### 🖥️ Operations Console

Staff members can manage queues from a dedicated administration interface.

Available operations include:

* Call Next
* Skip Token
* Recall Token
* Complete Token
* Mark Priority
* Hold Token
* Transfer Token
* Open / Close Counters
* Switch between departments
* Switch active counters

The console also provides queue metrics such as:

* Average wait time
* Longest current wait
* Total visitors served
* Completion rate
* Current throughput

---

### 📺 Public Display Board

SmartQueue includes a dedicated display mode for TVs and large screens.

The display board shows:

* Current token
* Counter number
* Service name
* Upcoming tokens
* Counter status
* Current date and time

It also supports fullscreen mode for use on a **1920×1080 public display**.

The interface is intentionally designed with large, high-contrast information so that queue information can be read from a distance.

---

### 🔔 Audio Notifications

When a token is called or recalled, SmartQueue can generate an audio chime to attract the visitor's attention.

Audio alerts can also be enabled or disabled from the system.

---

### ⚡ Real-Time Multi-Tab Synchronization

The application uses browser storage events to synchronize queue changes between open tabs.

For example:

```text
Admin Console
      │
      ▼
 Queue State
      │
      ├──────────► Queue Status
      │
      └──────────► Public Display
```

This allows different views of the application to reflect queue changes while running in the same browser environment.

---

## Queue Workflow

```text
Visitor
   │
   ▼
Select Service
   │
   ▼
Generate Token
   │
   ▼
WAITING
   │
   ▼
CALL NEXT
   │
   ▼
NOW SERVING
   │
   ├──────────────► RECALL
   │
   ├──────────────► HOLD
   │
   ├──────────────► SKIP
   │
   └──────────────► COMPLETE
                         │
                         ▼
                     COMPLETED
```

Priority tokens can be moved ahead of normal waiting tokens according to the queue's priority handling.

---

## Application Routes

| Route             | Purpose                           |
| ----------------- | --------------------------------- |
| `/join`           | Join a queue and generate a token |
| `/queue/:tokenId` | Track an individual token         |
| `/admin`          | Staff operations console          |
| `/display`        | Public queue display              |

---

## Technology Stack

### Frontend

* **React 19**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Lucide React**

### Application State

* React Context API
* React Hooks
* Browser `localStorage`
* Browser `StorageEvent` synchronization

### Additional Libraries

* Motion
* Express
* Google GenAI SDK

> The current queue implementation primarily uses React state and browser storage. No external database is required for the demo version.

---

## Project Structure

```text
smartqueue/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── HeaderNav.tsx
│   │   │   ├── HairlineDivider.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── WayfinderNumeral.tsx
│   │   │   └── DesignSystemFoundation.tsx
│   │   │
│   │   └── screens/
│   │       ├── JoinScreen.tsx
│   │       ├── QueueStatusScreen.tsx
│   │       ├── AdminConsoleScreen.tsx
│   │       └── DisplayBoardScreen.tsx
│   │
│   ├── context/
│   │   └── QueueContext.tsx
│   │
│   ├── types/
│   │   └── queue.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Running Locally

### Prerequisites

Make sure you have:

* Node.js
* npm

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd smartqueue
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Available Commands

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Preview Production Build

```bash
npm run preview
```

Runs the production build locally for testing.

### Type Checking

```bash
npm run lint
```

Runs TypeScript checking without generating output files.

---

## Demo Flow

A simple way to demonstrate SmartQueue:

### 1. Visitor

Open:

```text
/join
```

Select a service and generate a token.

### 2. Queue Status

The visitor is taken to:

```text
/queue/:tokenId
```

The visitor can monitor their position and estimated waiting time.

### 3. Staff

Open:

```text
/admin
```

Staff can:

* Call the next visitor
* Recall a token
* Complete a token
* Skip a token
* Change priority
* Hold or transfer tokens
* Manage counters

### 4. Public Display

Open:

```text
/display
```

Use fullscreen mode to simulate a hospital/public-service display screen.

---

## Responsive Design

SmartQueue is designed for multiple environments:

| Device             | Primary Use              |
| ------------------ | ------------------------ |
| Mobile             | Visitor queue tracking   |
| Tablet             | Staff operations         |
| Desktop            | Operations console       |
| Large Display / TV | Public queue information |

The public display is optimized for large **1920×1080** screens, while the visitor and administration interfaces adapt to smaller screens.

---

## Accessibility

The interface follows accessibility-focused design principles including:

* Semantic HTML
* ARIA labels
* Keyboard-accessible controls
* High-contrast text
* Large touch targets
* Status information using both text and visual indicators
* Reduced visual clutter
* Large numerals for important queue information

Important queue states are communicated using labels such as:

```text
WAITING
NOW SERVING
PRIORITY
HELD
SKIPPED
COMPLETED
```

rather than relying only on color.

---

## Queue States

SmartQueue uses the following token states:

```text
WAITING
   │
   ▼
NOW SERVING
   │
   ├──► COMPLETED
   │
   ├──► SKIPPED
   │
   ├──► HELD
   │
   └──► RECALLED
```

Tokens can also be marked as **Priority** for queue handling.

---

## Current Architecture

The current demo is intentionally lightweight and does not require a backend database.

```text
                 ┌─────────────────────┐
                 │     React App       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   QueueContext      │
                 │                     │
                 │ Queue State         │
                 │ Token Operations    │
                 │ Counter Operations  │
                 │ Queue Metrics       │
                 └──────────┬──────────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
          ┌─────────────┐       ┌──────────────┐
          │ localStorage│       │Storage Events│
          └─────────────┘       └──────────────┘
                 │                     │
                 └──────────┬──────────┘
                            ▼
                 ┌─────────────────────┐
                 │ Multiple App Views  │
                 │                     │
                 │ Visitor             │
                 │ Admin               │
                 │ Public Display      │
                 └─────────────────────┘
```

---

## Example Use Case

### Hospital OPD

A patient arrives at a hospital and needs a general consultation.

Instead of standing in a physical queue:

```text
1. Patient opens SmartQueue
        ↓
2. Selects General Consultation
        ↓
3. Receives Token #21
        ↓
4. Leaves the physical waiting line
        ↓
5. Monitors queue position
        ↓
6. Token is called
        ↓
7. Patient proceeds to assigned counter
        ↓
8. Staff completes the visit
```

Meanwhile, the public display shows the current token and counter for everyone in the waiting area.

---

## Future Improvements

The current version is a functional queue-management prototype. A production deployment could extend it with:

* Backend database
* Cloud-based real-time synchronization
* User authentication and staff roles
* QR-code based queue joining
* SMS / WhatsApp notifications
* Push notifications
* Multiple physical locations
* Advanced analytics
* Queue history
* Appointment integration
* Token expiration and recovery policies
* Hospital information-system integration
* Cloud deployment
* Persistent server-side queue state

---

## Why SmartQueue?

SmartQueue focuses on solving a simple but common problem:

> **People should not have to physically wait in a line just to know when it is their turn.**

By combining digital tokens, live queue information, staff controls, and public displays, SmartQueue creates a more organized and transparent queue experience.

---

## Project Status

**Prototype / Hackathon Project**

The current version demonstrates the core SmartQueue experience using a browser-based queue state and responsive interfaces.

---

## License

This project is developed for educational and hackathon purposes.
