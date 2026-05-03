
# 🏆 GoldDesk: Professional Gold Laboratory OS

[![React Native](https://img.shields.io/badge/React_Native_Mobile-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Electron](https://img.shields.io/badge/Electron_Desktop-2B2E3A?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase_Sync-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![MERN](https://img.shields.io/badge/MERN_Backend-000000?style=for-the-badge&logo=mern&logoColor=white)](https://www.mongodb.com/mern-stack)


**GoldDesk (Gold Bazar)** is a **unified cross-platform laboratory ecosystem** consisting of a **React Native mobile app** and an **Electron desktop application**, fully synced via a cloud backend. It untethers jewelers from their desks, enabling lab-grade gold testing, real-time market intelligence, and professional reporting from anywhere.

---

## 🎯 The Problem We Saw

The gold testing industry is trapped by a "Legacy Desk" paradigm, creating critical risks and inefficiencies:

- 🪑 **Tethered to a Terminal** — Jewelers are paralyzed by decade-old, offline desktop software. High-stakes testing and live pricing can't be performed away from the front counter.
- 🔄 **No Sync, No Freedom** — Data lives on one machine. If a jeweler tests gold in the field or at a client's location, that record never makes it back to the main office system.
- 💸 **Decimal-Level Financial Risk** — Manually calculating gold purity via fluid physics and converting to traditional units (**Tola/Masha/Ratti**) is error-prone. A tiny decimal mistake can cost thousands.
- 🖥️ **Two Worlds, One Choice** — Shops are forced to choose between a **powerful desktop terminal** (static) or a **basic mobile app** (weak features). No one offers both with sync.
- 📉 **Stale Market Data** — Most shops rely on manually updated rate boards. There's no real-time, automated feed for Ounce Spot (OS) prices.

> *The result?* Financial risk, operational paralysis, and a fragmented workflow where data lives in silos.

---
## 💡 The Solution We Built

**GoldDesk** is a **Mobile-First Revolution** that doesn't abandon the desktop. We built **two powerful clients** — React Native (Mobile) and Electron (Desktop) — that **talk to each other in real time**.

| Problem | Our Solution |
|:--------|:-------------|
| **Tethered to a Terminal** | **React Native Mobile App** — Perform lab-grade tests, generate PDF/thermal receipts, and access live market data from any iOS or Android device. |
| **No Sync, No Freedom** | **Bi-Directional Cloud Sync (Firebase)** — Test data, client records, and session states sync instantly between Mobile and Desktop. Start on mobile, finish on desktop. |
| **Decimal-Level Risk** | **Lab-Grade Physics Engine** — Archimedes' Principle algorithms tuned to 19.29g/cm³ density standards. Handles complex "borrowing" math for negative impurity (Kaat). |
| **Two Worlds, One Choice** | **Unified Ecosystem** — A powerful **Electron Desktop terminal** for front-counter operations + a **full-featured Mobile app** for field work. Same data, same features. |
| **Stale Market Data** | **Live Market Terminal (Electron)** — Real-time OS (Ounce Spot) Price board for Gold & Silver with custom cloud-caching to avoid API rate limits. |

### 🧠 What Makes GoldDesk Different?

- **One Ecosystem, Two Clients, Zero Compromise** — The mobile app isn't a "lite" version. It runs the same physics engine, generates the same reports, and syncs seamlessly with the desktop.
- **Physics Over Guesswork** — The app doesn't just calculate; it educates. It implements Archimedes' Principle to a **lab-grade standard**, removing human error from purity determination.
- **Enterprise-Grade Security Across Devices** — Strict **Device Fingerprinting** (max 2 devices per license) and remote session revocation. If a phone is lost, kill its access from the desktop.
- **Localized Math for Global Markets** — Custom logic flawlessly converts decimal grams into **Tola/Masha/Ratti** formats, respecting traditional South Asian market standards.

---

## 🔄 The Unified Ecosystem: Mobile + Desktop + Sync

```mermaid
graph LR
    A[React Native Mobile App<br/>iOS/Android] <-->|Firebase Realtime Sync| C[Cloud Backend<br/>Firestore + Auth]
    B[Electron Desktop App<br/>Windows/Mac/Linux] <-->|Firebase Realtime Sync| C
    C -->|Bi-Directional| A
    C -->|Bi-Directional| B
```

| Client | Technology | Primary Use Case |
|:-------|:-----------|:-----------------|
| **Mobile** | React Native (Expo) | Field testing, on-site client visits, instant PDF/thermal receipts |
| **Desktop** | Electron + React | Front-counter operations, live market board, admin controls, heavy data entry |
| **Sync Engine** | Firebase Auth + Firestore | Real-time bi-directional sync, device fingerprinting, session management |

---

## ✨ Key Features & Technical Scope

### 🔄 Bi-Directional Sync (The Secret Sauce)
- **Real-time Cloud Sync** — Test records, client profiles, and session states sync instantly between Mobile and Desktop.
- **Offline-First Queue** — Mobile app queues operations when offline; syncs automatically when connection returns.
- **Device Fingerprinting** — Each license allows max 2 active devices. Remotely revoke any device from the admin portal.

