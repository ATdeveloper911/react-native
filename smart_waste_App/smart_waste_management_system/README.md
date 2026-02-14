# ♻️ Smart Waste Management System (SWMS)

[![Expo](https://img.shields.io/badge/Expo-51.0.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-v0.74-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**SWMS** is a high-performance, real-time IoT-integrated mobile solution designed to optimize urban waste collection. Featuring a tri-role ecosystem (Citizen, Worker, Admin), the app leverages live bin-level tracking, Google Maps route optimization, and automated task dispatching.

---

## 📱 App Gallery

<div align="center">
  <table style="border: none;">
    <tr>
      <td><img src="https://github.com/user-attachments/assets/a10e3097-92f9-48d7-95a7-dab6cb2e242c" width="160" alt="Splash"/></td>
      <td><img src="https://github.com/user-attachments/assets/9ccacd75-ceff-4edd-b13f-3662fa62c18c" width="160" alt="Login"/></td>
      <td><img src="https://github.com/user-attachments/assets/57883e56-c5f1-4867-b857-72a0fdce42ea" width="160" alt="Admin"/></td>
      <td><img src="https://github.com/user-attachments/assets/f99e54d8-efda-45b7-865d-94cda394c0ba" width="160" alt="Citizen"/></td>
      <td><img src="https://github.com/user-attachments/assets/bff4aaf8-c97b-461f-bca1-a44ff2249215" width="160" alt="Worker"/></td>
    </tr>
    <tr align="center">
      <td><b>Splash</b></td>
      <td><b>Auth</b></td>
      <td><b>Admin Dash</b></td>
      <td><b>Citizen Dash</b></td>
      <td><b>Worker Dash</b></td>
    </tr>
  </table>
</div>

---

## ⚡ Core Functionality

### 👤 Citizen Portal
* **Live Bin Mapping:** Interactive Google Maps interface with color-coded fill levels.
* **Smart Reporting:** Report overflows with photo proof and offline queuing (AsyncStorage).
* **Impact Tracking:** Educational modules on recycling and sustainability.

### 👷 Worker Tools
* **Dynamic Routing:** Automated pathfinding to "Full" bins via Google Maps API.
* **Task Lifecycle:** Real-time status updates (Pending → In-Progress → Completed).
* **Instant Alerts:** Push notifications for urgent overflow reports in assigned sectors.

### 🛡️ Admin Command Center
* **Fleet Management:** Real-time surveillance of all smart-bin statuses.
* **Resource Allocation:** AI-assisted worker dispatching based on bin priority.
* **Data Analytics:** Comprehensive system health reports and collection efficiency metrics.

---

## 🛠️ Technical Architecture

| Layer | Tech Stack |
| :--- | :--- |
| **Frontend** | React Native (Expo SDK 51), TypeScript |
| **UI Engine** | React Native Paper (Material Design 3) |
| **Data Engine** | Firebase Realtime Database (NoSQL) |
| **Geolocation** | react-native-maps + Google Maps SDK |
| **State** | React Context API + Custom Hooks |
| **Sync** | Offline-first sync queue with AsyncStorage |

---

## 🚀 Installation & Setup

1. **Clone & Install**
   ```bash
   git clone [https://github.com/yourusername/swms.git](https://github.com/yourusername/swms.git)
   cd swms && npm install
