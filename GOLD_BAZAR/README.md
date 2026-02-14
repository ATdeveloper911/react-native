# GoldDesk - Professional Gold Testing Laboratory Software

A comprehensive **React Native + Electron** application for jewelers to calculate gold purity, composition, and pricing using Archimedes' principle and traditional gold measurement units. Featuring robust authentication, admin controls, and premium UI/UX.

---

## 📸 Screenshots

### Home Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/ba873db8-6a8e-4c4b-9ed6-254dd8729a51" width="250" />
</p>

### Gold Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/13af3d9d-0dfb-419c-8840-71e872714180" width="250" />
  <img src="https://github.com/user-attachments/assets/5a3c3437-3ed6-4d66-9450-0670b188094a" width="250" />
</p>

### Profile & Billing
<p align="center">
  <img src="https://github.com/user-attachments/assets/710cb1bd-4afd-4219-802a-e5900e00c06c" width="250" />
  <img src="https://github.com/user-attachments/assets/7c49d35b-387f-4880-8ae6-eed98edca7a1" width="250" />
</p>

---

## 🚀 Key Features

### 🔐 Security & Authentication
- Secure Login/Signup (Firebase)
- Forgot Password recovery
- Device Fingerprinting & Session Management
- Max 2 Devices per user
- Role-Based Access Control (Admin/User)

### 🛡️ Admin Portal
- User Management (Approve/Disable/Delete)
- Session Control (Active devices, revoke remotely)
- Dashboard with system stats

### 🔬 Accurate Gold Testing
- Archimedes' Principle for purity calculation
- Real-time updates
- 9 composition analysis modes
- Traditional units: Ratti, Masha, Tola, Grams

### 💰 Advanced Pricing
- Real-time gold value calculation
- Configurable rates (per gram/tola)
- Wastage & labor cost support
- Shop branding in reports

### 🎨 Premium UI/UX
- Luxurious dark + gold theme
- Responsive design (Mobile + Desktop)
- Custom modals & profile management

---

## 🖥️ Electron Desktop App
- Live Market Board (Gold & Silver)
- Multiple providers + fallback
- CORS-proof IPC fetching
- Local caching & refresh limits
- Thermal printing & PDF export
- Role-based authentication

---

## 📱 React Native App
- Lab-grade gold testing
- Multiple report formats
- Traditional units supported
- Secure session model
- PDF/Print/Share flows

---

## 🛠️ Technical Stack
- **Frontend**: React Native, Expo
- **Backend**: Firebase (Auth, Firestore)
- **State Management**: React Context API
- **Storage**: SecureStore, AsyncStorage
- **UI**: React Native Paper, Vector Icons
- **Utils**: Expo Print, Sharing, MathJS

---

## 📦 Installation

### Mobile
```bash
git clone <repository-url>
cd GoldDesk
npm install
npx expo start
