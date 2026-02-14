import React from 'react';
import { View, Text } from 'react-native';

interface BinIconProps {
  size?: number;
  color?: string;
  fillLevel?: number;
}

export const BinIcon: React.FC<BinIconProps> = ({ 
  size = 32, 
  color = '#4CAF50',
  fillLevel = 0 
}) => {
  // Determine color based on fill level
  const getBinColor = () => {
    if (fillLevel >= 85) return '#F44336'; // Red
    if (fillLevel >= 50) return '#FF9800'; // Orange
    return color; // Default green
  };

  const binColor = getBinColor();

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      {/* Bin body */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: size * 0.15,
          right: size * 0.15,
          height: size * 0.7,
          backgroundColor: binColor,
          borderRadius: 2,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      />
      
      {/* Bin lid */}
      <View
        style={{
          position: 'absolute',
          top: size * 0.2,
          left: size * 0.1,
          right: size * 0.1,
          height: size * 0.15,
          backgroundColor: binColor,
          borderRadius: 2,
        }}
      />
      
      {/* Lid handle */}
      <View
        style={{
          position: 'absolute',
          top: size * 0.22,
          left: '50%',
          width: size * 0.2,
          height: size * 0.1,
          backgroundColor: '#FFFFFF',
          borderRadius: 2,
          transform: [{ translateX: -size * 0.1 }],
        }}
      />
      
      {/* Fill level indicator */}
      {fillLevel > 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: 2,
            left: size * 0.16,
            right: size * 0.16,
            height: (size * 0.66 * fillLevel) / 100,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 1,
          }}
        />
      )}
    </View>
  );
};
