import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-muted via-background to-muted/50 p-4 sm:p-8">
      <div className="phone-frame w-full max-w-[375px] aspect-[9/19.5]">
        <div className="phone-screen w-full h-full bg-background relative">
          {/* Notch */}
          <div className="phone-notch" />
          
          {/* Screen content */}
          <div className="w-full h-full overflow-hidden">
            {children}
          </div>
          
          {/* Home indicator */}
          <div className="home-indicator" />
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;
