import React from "react";

interface PhoneFrameProps {
  children: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
      {/* Phone Device */}
      <div className="relative w-full max-w-[375px] h-[812px] bg-foreground rounded-[3rem] p-2 shadow-2xl">
        {/* Inner bezel */}
        <div className="relative w-full h-full bg-card rounded-[2.5rem] overflow-hidden shadow-inner">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-11 bg-card/80 backdrop-blur-sm z-50 flex items-center justify-between px-8">
            <span className="text-xs font-medium text-foreground">9:41</span>
            <div className="absolute left-1/2 -translate-x-1/2 w-32 h-7 bg-foreground rounded-b-2xl" />
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.5 2a9.5 9.5 0 0 1 9.5 9.5c0 .28-.01.56-.04.83l-1.97-.24c.01-.2.01-.39.01-.59a7.5 7.5 0 0 0-7.5-7.5V2z"/>
                <path d="M2 11.5C2 6.25 6.25 2 11.5 2v2a7.5 7.5 0 0 0-7.5 7.5H2z"/>
                <path d="M11.5 7a4.5 4.5 0 0 1 4.5 4.5h-2a2.5 2.5 0 0 0-2.5-2.5V7z"/>
                <path d="M7 11.5a4.5 4.5 0 0 1 4.5-4.5v2a2.5 2.5 0 0 0-2.5 2.5H7z"/>
                <circle cx="11.5" cy="11.5" r="1.5"/>
              </svg>
              <svg className="w-4 h-4 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.24 4.24 0 0 0-6 0zm-4-4l2 2a7.07 7.07 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
              </svg>
              <svg className="w-6 h-4 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                <rect x="4" y="8" width="12" height="8" rx="1" fill="currentColor"/>
                <rect x="20" y="9" width="2" height="6" rx="1" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          {/* App Content */}
          <div className="h-full pt-11 pb-0 overflow-hidden">
            {children}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/30 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;
