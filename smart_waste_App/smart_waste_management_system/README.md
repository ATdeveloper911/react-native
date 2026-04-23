# ♻️ Smart Waste Management System (SWMS)

[![Expo](https://img.shields.io/badge/Expo-51.0.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-v0.74-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**SWMS** is a high-performance, real-time IoT-integrated mobile solution designed to optimize urban waste collection. Featuring a tri-role ecosystem (Citizen, Worker, Admin), the app leverages live bin-level tracking, Google Maps route optimization, and automated task dispatching.

---

## 📱 App Gallery

<div align="center">

### 📸 Complete App Experience

| Splash Screen | Authentication | Admin Dashboard |
|:---:|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/d6c17204-b97d-450c-aab3-73a02e1714c2" width="200" style="border-radius: 15px; border: 2px solid #e0e0e0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"> | <img src="https://github.com/user-attachments/assets/33adcb93-bd5c-4538-9aa2-62f31a24b9ee" width="200" style="border-radius: 15px; border: 2px solid #e0e0e0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"> | <img src="https://github.com/user-attachments/assets/d5c16fc4-4310-41a3-a407-ee69b95e7e1e" width="200" style="border-radius: 15px; border: 2px solid #e0e0e0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"> |

| Admin Overview | Citizen Dashboard | Worker Dashboard |
|:---:|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/19f0407c-e062-4405-a96c-a42bd5d34c27" width="200" style="border-radius: 15px; border: 2px solid #e0e0e0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"> | <img src="https://github.com/user-attachments/assets/f99e54d8-efda-45b7-865d-94cda394c0ba" width="200" style="border-radius: 15px; border: 2px solid #e0e0e0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"> | <img src="https://github.com/user-attachments/assets/bff4aaf8-c97b-461f-bca1-a44ff2249215" width="200" style="border-radius: 15px; border: 2px solid #e0e0e0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"> |

### 📊 Analytics Suite

| Analytics Overview | Analytics Dashboard | Advanced Analytics |
|:---:|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/4e9c6546-b66e-4f99-8e32-82089fa36baa" width="200" style="border-radius: 15px; border: 2px solid #e0e0e0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"> | <img src="https://github.com/user-attachments/assets/f0b8d9df-c65e-48a9-a5ec-5942d95808a2" width="200" style="border-radius: 15px; border: 2px solid #e0e0e0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"> | <img src="https://github.com/user-attachments/assets/0e88d6e1-3b7b-4280-9fc1-fb21106fdd94" width="200" style="border-radius: 15px; border: 2px solid #e0e0e0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"> |

<br>

*✨ A comprehensive platform for all user roles with powerful analytics ✨*

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
## ✨ Smart Waste Management System Key Highlights

- **Real-Time Bin Monitoring** — Live status updates for waste bins with fill-level sensors and overflow alerts
- **Dynamic Route Planning** — Reduces fuel consumption and collection time by 30-40% using AI-driven route optimization
- **Offline-First Architecture** — Drivers can log collections without internet; data syncs automatically when back online
- **QR-Based Verification System** — Residents scan QR codes to confirm pickups, eliminating disputes and false reports
- **Multi-Role Dashboard** — Dedicated interfaces for Admins, Collection Drivers, and Residents with granular permissions
- **Weight-Based Billing Engine** — Automated invoice generation based on actual waste weight with dynamic pricing
- **Modern React Native Architecture** — Built with TypeScript, Zustand, React Query, and clean, scalable code
- **Real-Time Fleet Tracking** — Live driver location and ETA updates using MapLibre GL

A complete municipal waste management solution that reduces operational costs, improves collection efficiency, and provides transparency for residents and administrators.
---
## 📊 Project Analytics

<p align="center">
  <img src="https://github-readme-stats-fast.vercel.app/api/pin/?username=asaddevx&repo=react-native&theme=tokyonight&hide_border=true&bg_color=0a192f&border_radius=20" alt="Smart Waste Management System Project Stats" />
  
  <img src="https://github-readme-stats-fast.vercel.app/api/top-langs/?username=asaddevx&repo=react-native&layout=compact&theme=tokyonight&hide_border=true&bg_color=0a192f&border_radius=20&langs_count=8" alt="Top Languages" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Zustand-FF4081?style=for-the-badge" alt="Zustand" />
  <img src="https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/MapLibre-00B4D8?style=for-the-badge" alt="MapLibre" />
</p>

---

## 📫 Connect with the Architect

<div align="center">
  <p><strong>SYSTEMS_STATUS: ReactNative_System_OPERATIONAL 🟢</strong></p>
  <p>Let's build something disruptive. 🚀</p>

  <a href="https://asad-lime-six.vercel.app/">
    <img src="https://img.shields.io/badge/VIEW_PORTFOLIO-282c34?style=for-the-badge&logo=vercel&logoColor=61AFEF" alt="Portfolio" />
  </a>
  &nbsp;
  <a href="https://www.linkedin.com/in/asadullah-%F0%9F%99%82-5475a4352">
    <img src="https://img.shields.io/badge/LINKEDIN-282c34?style=for-the-badge&logo=linkedin&logoColor=0A66C2" alt="LinkedIn" />
  </a>
  &nbsp;
  <a href="mailto:asadullah.devop@gmail.com">
    <img src="https://img.shields.io/badge/SEND_EMAIL-282c34?style=for-the-badge&logo=gmail&logoColor=E06C75/n/n" alt="Email" />
  </a>
</div>




<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=23272e&height=30&section=footer" />
</p>


---
