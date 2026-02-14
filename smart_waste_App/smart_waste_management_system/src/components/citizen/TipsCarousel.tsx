import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - theme.spacing.md * 2;

interface Tip {
  id: number;
  title: string;
  description: string;
  icon: string;
  gradient: [string, string];
}

const tips: Tip[] = [
  {
    id: 1,
    title: 'Proper Recycling',
    description: 'Rinse containers before recycling to prevent contamination',
    icon: 'recycle',
    gradient: ['#4CAF50', '#81C784'],
  },
  {
    id: 2,
    title: 'Go Green',
    description: 'Composting food waste reduces landfill methane by 50%',
    icon: 'leaf',
    gradient: ['#2196F3', '#90CAF9'],
  },
  {
    id: 3,
    title: 'Did You Know?',
    description: 'Smart bins can reduce collection costs by up to 40%',
    icon: 'information',
    gradient: ['#FF9800', '#FFB74D'],
  },
  {
    id: 4,
    title: 'Eco Tip',
    description: 'One recycled plastic bottle saves enough energy to power a laptop for 25 minutes',
    icon: 'lightbulb-on',
    gradient: ['#4CAF50', '#81C784'],
  },
];

export const TipsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % tips.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * CARD_WIDTH,
        animated: true,
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + tips.length) % tips.length;
    setCurrentIndex(prevIndex);
    scrollViewRef.current?.scrollTo({
      x: prevIndex * CARD_WIDTH,
      animated: true,
    });
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % tips.length;
    setCurrentIndex(nextIndex);
    scrollViewRef.current?.scrollTo({
      x: nextIndex * CARD_WIDTH,
      animated: true,
    });
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH}
        snapToAlignment="start"
      >
        {tips.map((tip, index) => (
          <Animated.View key={tip.id} style={[styles.cardWrapper, { width: CARD_WIDTH }]}>
            <LinearGradient colors={tip.gradient} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <IconButton icon={tip.icon} size={32} iconColor="#FFFFFF" style={styles.icon} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{tip.title}</Text>
                  <Text style={styles.description}>{tip.description}</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={handlePrev} style={styles.navButton}>
          <IconButton icon="chevron-left" size={16} iconColor="#FFFFFF" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.navButton}>
          <IconButton icon="chevron-right" size={16} iconColor="#FFFFFF" style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {tips.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setCurrentIndex(index);
              scrollViewRef.current?.scrollTo({
                x: index * CARD_WIDTH,
                animated: true,
              });
            }}
            style={[styles.dot, index === currentIndex && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  cardWrapper: {
    paddingHorizontal: theme.spacing.xs,
  },
  card: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    minHeight: 120,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    backdropFilter: 'blur(10px)',
  },
  icon: {
    margin: 0,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
  },
  navigationContainer: {
    position: 'absolute',
    bottom: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.round,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
    paddingLeft: theme.spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  activeDot: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
});
