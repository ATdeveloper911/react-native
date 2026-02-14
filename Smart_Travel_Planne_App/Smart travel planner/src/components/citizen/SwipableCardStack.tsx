import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, PanResponder } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Bin, BinStatus } from '../../types';
import { BIN_STATUS_COLORS, BIN_STATUS_LABELS } from '../../utils/constants';
import { theme } from '../../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - theme.spacing.md * 2;
const SWIPE_THRESHOLD = 100;

interface BinCard {
  id: string;
  location: string;
  address: string;
  fillLevel: number;
  status: BinStatus;
  lastUpdated: string;
}

const getStatusColor = (status: BinStatus): string => {
  return BIN_STATUS_COLORS[status] || BIN_STATUS_COLORS.offline;
};

const getStatusIcon = (status: BinStatus): string => {
  switch (status) {
    case 'empty':
      return 'check-circle';
    case 'filling':
      return 'trash-can';
    case 'full':
    case 'overflow':
      return 'alert-circle';
    default:
      return 'trash-can';
  }
};

interface SwipableCardProps {
  card: BinCard;
  index: number;
  totalCards: number;
  onSwipe: () => void;
}

const SwipableCard: React.FC<SwipableCardProps> = ({ card, index, totalCards, onSwipe }) => {
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-15deg', '0deg', '15deg'],
  });
  const opacity = position.x.interpolate({
    inputRange: [-200, -100, 0, 100, 200],
    outputRange: [0, 0.5, 1, 0.5, 0],
  });

  const stackOffset = index * 8;
  const stackScale = 1 - index * 0.05;
  const stackOpacity = 1 - index * 0.3;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
          Animated.timing(position, {
            toValue: { x: gesture.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            onSwipe();
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          top: stackOffset,
          transform: [
            { translateX: position.x },
            { rotate: rotate },
            { scale: stackScale },
          ],
          opacity: Animated.multiply(opacity, stackOpacity),
          zIndex: totalCards - index,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: getStatusColor(card.status) }]}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.statusIcon, { backgroundColor: getStatusColor(card.status) }]}>
              <IconButton
                icon={getStatusIcon(card.status)}
                size={16}
                iconColor="#FFFFFF"
                style={styles.icon}
              />
            </View>
            <View>
              <Text style={styles.locationName}>{card.location}</Text>
              <View style={styles.addressRow}>
                <IconButton icon="map-marker" size={12} iconColor={theme.colors.textSecondary} style={styles.icon} />
                <Text style={styles.address}>{card.address}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(card.status) }]}>
            <Text style={styles.statusText}>{BIN_STATUS_LABELS[card.status]}</Text>
          </View>
        </View>

        <View style={styles.fillLevelContainer}>
          <View style={styles.fillLevelHeader}>
            <Text style={styles.fillLevelLabel}>Fill Level</Text>
            <Text style={styles.fillLevelValue}>{card.fillLevel}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: `${card.fillLevel}%`,
                  backgroundColor: getStatusColor(card.status),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerRow}>
            <IconButton icon="clock-outline" size={12} iconColor={theme.colors.textSecondary} style={styles.icon} />
            <Text style={styles.lastUpdated}>Updated {card.lastUpdated}</Text>
          </View>
          <Text style={styles.swipeHint}>Swipe to view next →</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export const SwipableCardStack: React.FC<{ bins?: Bin[] }> = ({ bins }) => {
  const [displayedCards, setDisplayedCards] = useState<BinCard[]>([]);

  useEffect(() => {
    if (bins && bins.length > 0) {
      const cards: BinCard[] = bins.slice(0, 5).map((bin) => ({
        id: bin.id,
        location: bin.name || `Bin ${bin.id}`,
        address: `${bin.location.latitude.toFixed(4)}, ${bin.location.longitude.toFixed(4)}`,
        fillLevel: bin.fillLevel,
        status: bin.status,
        lastUpdated: getTimeAgo(bin.lastUpdated || Date.now()),
      }));
      setDisplayedCards(cards);
    } else {
      // Mock data for demonstration
      const mockCards: BinCard[] = [
        { id: '1', location: 'Main Street Bin', address: '123 Main St', fillLevel: 85, status: 'full', lastUpdated: '2 min ago' },
        { id: '2', location: 'Park Avenue', address: '45 Park Ave', fillLevel: 45, status: 'filling', lastUpdated: '5 min ago' },
        { id: '3', location: 'Market Square', address: '78 Market Sq', fillLevel: 20, status: 'empty', lastUpdated: '8 min ago' },
        { id: '4', location: 'Campus Area', address: 'University Rd', fillLevel: 95, status: 'overflow', lastUpdated: '1 min ago' },
      ];
      setDisplayedCards(mockCards);
    }
  }, [bins]);

  const handleSwipe = () => {
    setDisplayedCards((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  return (
    <View style={styles.container}>
      {displayedCards.slice(0, 3).map((card, index) => (
        <SwipableCard
          key={`${card.id}-${index}`}
          card={card}
          index={index}
          totalCards={3}
          onSwipe={handleSwipe}
        />
      ))}
    </View>
  );
};

const getTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: theme.spacing.md,
  },
  cardWrapper: {
    position: 'absolute',
    width: CARD_WIDTH,
    left: 0,
    right: 0,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    ...theme.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  icon: {
    margin: 0,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs / 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginLeft: -theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.round,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  fillLevelContainer: {
    marginBottom: theme.spacing.md,
  },
  fillLevelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  fillLevelLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  fillLevelValue: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.outlineVariant,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: theme.borderRadius.round,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastUpdated: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginLeft: -theme.spacing.xs,
  },
  swipeHint: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
