# Smart Waste Management System (SWMS)

A comprehensive mobile application built with Expo React Native for managing waste collection and monitoring smart bins in real-time.

## Features

### For Citizens
- **Real-time Bin Map**: View nearby waste bins with color-coded status indicators
- **Issue Reporting**: Report problems with photo uploads and offline support
- **Educational Content**: Learn about waste segregation and recycling

### For Collection Workers
- **Task Dashboard**: View assigned collection tasks
- **Route Navigation**: Optimized routes with Google Maps integration
- **Task Management**: Update task status and track progress

### For Administrators
- **Bin Monitoring**: Real-time dashboard showing all bins and their status
- **Task Assignment**: Assign and manage collection tasks
- **Analytics**: View system statistics and reports

## Tech Stack

- **Framework**: Expo React Native (~51.0.0)
- **Language**: TypeScript
- **Backend**: Firebase (Realtime Database, Authentication, Cloud Storage, Cloud Messaging)
- **Navigation**: React Navigation (Bottom Tabs, Stack, Drawer)
- **Maps**: react-native-maps with Google Maps
- **UI**: React Native Paper
- **State Management**: React Context API
- **Offline Support**: AsyncStorage with sync queue

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Firebase project with Realtime Database enabled
- Google Maps API key (for map functionality)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart_waste_management_system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Ensure `google-services.json` is in the project root
   - Update Firebase configuration in `src/config/firebase.ts` if needed
   - Set up Firebase Realtime Database rules

4. **Configure Google Maps**
   - Get a Google Maps API key
   - Update `app.json` with your API key:
     ```json
     "android": {
       "config": {
         "googleMaps": {
           "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
         }
       }
     }
     ```

5. **Start the development server**
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/          # Screen components
│   ├── auth/        # Authentication screens
│   ├── citizen/     # Citizen role screens
│   ├── worker/      # Worker role screens
│   └── admin/       # Admin role screens
├── navigation/       # Navigation configuration
├── services/         # Firebase services and API calls
├── context/          # React Context providers
├── types/            # TypeScript type definitions
├── utils/            # Helper functions and constants
├── hooks/            # Custom React hooks
└── config/           # Configuration files
```

## Firebase Database Structure

```
{
  "users": {
    "{userId}": {
      "id": string,
      "email": string,
      "role": "citizen" | "worker" | "admin",
      "name": string,
      "createdAt": number,
      "isActive": boolean
    }
  },
  "bins": {
    "{binId}": {
      "id": string,
      "location": {
        "latitude": number,
        "longitude": number
      },
      "fillLevel": number (0-100),
      "status": "empty" | "filling" | "full" | "overflow" | "offline",
      "lastUpdate": number,
      "isOnline": boolean
    }
  },
  "tasks": {
    "{taskId}": {
      "id": string,
      "workerId": string,
      "binIds": string[],
      "route": {
        "waypoints": Array<{
          "binId": string,
          "latitude": number,
          "longitude": number,
          "order": number
        }>
      },
      "status": "pending" | "in-progress" | "completed" | "cancelled",
      "priority": "low" | "medium" | "high",
      "assignedAt": number,
      "completedAt": number (optional)
    }
  },
  "reports": {
    "{reportId}": {
      "id": string,
      "userId": string,
      "binId": string (optional),
      "type": "missed-collection" | "bin-damage" | "illegal-dumping" | "other",
      "description": string,
      "photos": string[] (optional),
      "location": {
        "latitude": number,
        "longitude": number
      } (optional),
      "status": "pending" | "in-review" | "resolved" | "rejected",
      "createdAt": number,
      "resolvedAt": number (optional)
    }
  }
}
```

## Features Implementation

### Authentication
- Email/password authentication via Firebase Auth
- Role-based access control (Citizen, Worker, Admin)
- User profile management

### Real-time Updates
- Firebase Realtime Database listeners for bin status
- Automatic UI updates when data changes
- Optimized for performance with minimal re-renders

### Offline Support
- Reports and task updates queued when offline
- Automatic sync when connection is restored
- Local caching of bin data

### Push Notifications
- Expo Notifications with FCM support
- Notification channels for different alert types
- Background and foreground notification handling

## Building for Production

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

## Environment Variables

Create a `.env` file (optional) for local development:
```
GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create a Realtime Database
4. Set up Cloud Storage for report photos
5. Configure Cloud Messaging for push notifications
6. Download `google-services.json` and place it in the project root

## Testing

Run tests with:
```bash
npm test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions, please open an issue on the repository.

