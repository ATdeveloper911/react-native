import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PhoneFrame from '../components/PhoneFrame';
import LoginScreen from '../components/LoginScreen';
import SignupScreen from '../components/SignupScreen';
import DashboardScreen from '../components/DashboardScreen';

type Screen = 'login' | 'signup' | 'dashboard';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const screenVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={() => setCurrentScreen('dashboard')}
            onSignupClick={() => setCurrentScreen('signup')}
          />
        );
      case 'signup':
        return (
          <SignupScreen
            onSignup={() => setCurrentScreen('dashboard')}
            onLoginClick={() => setCurrentScreen('login')}
          />
        );
      case 'dashboard':
        return <DashboardScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted/50">
      {/* App Title - Outside phone */}
      <div className="text-center pt-6 pb-2">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gradient"
        >
          Smart Waste Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground mt-1"
        >
          COMSATS University Islamabad (Vehari Campus)
        </motion.p>
      </div>

      {/* Phone Preview */}
      <PhoneFrame>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </PhoneFrame>

      {/* Navigation hint - Outside phone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pb-8 pt-4"
      >
        <div className="flex justify-center gap-2">
          {(['login', 'signup', 'dashboard'] as Screen[]).map((screen) => (
            <button
              key={screen}
              onClick={() => setCurrentScreen(screen)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentScreen === screen
                  ? 'gradient-primary text-primary-foreground shadow-primary'
                  : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }`}
            >
              {screen.charAt(0).toUpperCase() + screen.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Click buttons above to navigate between screens
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
