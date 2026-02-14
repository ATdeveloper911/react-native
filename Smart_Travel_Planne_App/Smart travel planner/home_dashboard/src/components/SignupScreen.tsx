import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Leaf, Check } from 'lucide-react';

interface SignupScreenProps {
  onSignup: () => void;
  onLoginClick: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSignup, onLoginClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const passwordStrength = password.length > 8 ? (password.length > 12 ? 'strong' : 'medium') : 'weak';

  return (
    <div className="h-full bg-background flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="pt-12 px-6 pb-6 gradient-hero">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-2xl flex items-center justify-center shadow-primary"
        >
          <Leaf className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-center text-foreground"
        >
          Create Account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-muted-foreground mt-1 text-sm"
        >
          Join the smart waste revolution
        </motion.p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Name Input */}
          <div className="relative">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full h-11 pl-11 pr-4 bg-card rounded-xl border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Email Input */}
          <div className="relative">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-11 pl-11 pr-4 bg-card rounded-xl border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full h-11 pl-11 pr-11 bg-card rounded-xl border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password Strength */}
            {password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 flex gap-1">
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength !== 'weak' ? 'bg-success' : 'bg-destructive'}`} />
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' || passwordStrength === 'medium' ? 'bg-success' : 'bg-muted'}`} />
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' ? 'bg-success' : 'bg-muted'}`} />
                </div>
                <span className={`text-xs font-medium capitalize ${
                  passwordStrength === 'strong' ? 'text-success' : 
                  passwordStrength === 'medium' ? 'text-warning' : 'text-destructive'
                }`}>
                  {passwordStrength}
                </span>
              </div>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => setAgreed(!agreed)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all mt-0.5 ${
                agreed ? 'bg-primary border-primary' : 'border-border bg-card'
              }`}
            >
              {agreed && <Check className="w-3 h-3 text-primary-foreground" />}
            </button>
            <p className="text-xs text-muted-foreground leading-relaxed">
              I agree to the{' '}
              <span className="text-primary font-medium">Terms of Service</span> and{' '}
              <span className="text-primary font-medium">Privacy Policy</span>
            </p>
          </div>

          {/* Signup Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onSignup}
            disabled={!agreed}
            className="w-full h-11 gradient-primary rounded-xl text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Account
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or sign up with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social Login */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 h-11 bg-card rounded-xl border border-border flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 h-11 bg-foreground rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="px-6 pb-10 pt-2"
      >
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button onClick={onLoginClick} className="text-primary font-semibold hover:underline">
            Sign In
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupScreen;
