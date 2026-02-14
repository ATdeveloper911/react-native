# ✈️ Smart Travel Planner

[![Expo](https://img.shields.io/badge/Expo-SDK_51-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-v0.74-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_&_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google-8E75FF?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

**Smart Travel Planner** is an AI-powered travel ecosystem designed to turn "where to?" into a fully planned itinerary in seconds. Featuring integrated hotel, flight, and car bookings with a native digital wallet, it’s the ultimate companion for the modern traveler.

---

## 📱 Experience the App

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="https://github.com/user-attachments/assets/d19dc026-4b7b-4170-b755-802afd24fa9e" width="150"/><br/><sub><b>Login</b></sub></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/1df9e3b5-b9ce-45d2-bd27-ca88d00e24fb" width="150"/><br/><sub><b>Home</b></sub></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/c1fbf638-f9ca-40a5-87fd-216098e55008" width="150"/><br/><sub><b>Search</b></sub></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/f9126893-c47a-4183-84df-89ece03c1944" width="150"/><br/><sub><b>Trips</b></sub></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/ed1c90f5-4a4a-4121-a985-6aa90dafa35a" width="150"/><br/><sub><b>AI Chat</b></sub></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/4efb410f-1f30-4851-a318-904fa49d72b8" width="150"/><br/><sub><b>Profile</b></sub></td>
    </tr>
  </table>
</div>

---

## 🌟 Top-Tier Features

* **🤖 AI-Powered Concierge:** Context-aware travel recommendations powered by **Google Gemini AI**.
* **🏨 Unified Booking Engine:** Seamlessly search and book Hotels, Flights, and Car Rentals in one unified interface.
* **💳 Integrated Digital Wallet:** Multi-currency support (USD, PKR) with real-time balance tracking and automated payment processing.
* **🌦️ Live Weather Insights:** Real-time climate data for your destination to help you pack smarter.
* **🔏 Biometric Security:** Secure your travel data and wallet with Fingerprint/FaceID integration.
* **📂 Smart Library:** Access educational travel guides, tips, and cultural insights on the go.

---

## 🛠️ Technical Breakdown

| Category | Technology |
| :--- | :--- |
| **Mobile Framework** | React Native (Expo) |
| **Intelligence** | Google Gemini AI |
| **Backend / Auth** | Firebase (Firestore, Auth, Storage) |
| **External APIs** | WeatherAPI.com, Unsplash Image API |
| **Payment Logic** | Native Wallet System (Custom Firebase logic) |
| **UI/UX** | Linear Gradients, Ionicons, Custom Theme |

---

## 📂 Project Logic (Core)

```bash
src/
├── components/   # Gradient-based UI & Reusable Cards
├── navigation/   # Stack & Bottom Tab architecture
├── context/      # AuthProvider & Wallet State management
├── services/     # Gemini AI & Weather API integrations
└── utils/        # PDF Generation & Data export logic
