import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { IconButton, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

interface LearningItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'segregation' | 'recycling' | 'composting' | 'reduction';
  gradient: [string, string];
  content: string;
}

export const LearnScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | LearningItem['category']>('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const learningContent: LearningItem[] = [
    {
      id: '1',
      title: 'Waste Segregation',
      description: 'Learn how to properly separate recyclable materials from general waste',
      icon: 'sort',
      category: 'segregation',
      gradient: ['#4CAF50', '#81C784'],
      content: 'Proper waste segregation involves separating materials into categories: recyclables (paper, plastic, metal, glass), organic waste (food scraps, garden waste), and general waste. This helps improve recycling rates and reduces contamination.',
    },
    {
      id: '2',
      title: 'Recycling Benefits',
      description: 'Understanding the environmental and economic benefits of recycling',
      icon: 'recycle',
      category: 'recycling',
      gradient: ['#2196F3', '#64B5F6'],
      content: 'Recycling helps conserve natural resources, reduces pollution, saves energy, and decreases landfill waste. Every item you recycle makes a significant difference in protecting our environment and reducing carbon footprint.',
    },
    {
      id: '3',
      title: 'Composting Basics',
      description: 'Turn your organic waste into nutrient-rich soil',
      icon: 'sprout',
      category: 'composting',
      gradient: ['#FF9800', '#FFB74D'],
      content: 'Composting is the natural process of recycling organic matter into valuable fertilizer. Suitable materials include fruit and vegetable scraps, coffee grounds, eggshells, and yard waste. Avoid meat, dairy, and oily foods in home compost.',
    },
    {
      id: '4',
      title: 'Reducing Waste',
      description: 'Tips to minimize waste generation in daily life',
      icon: 'minus-circle',
      category: 'reduction',
      gradient: ['#9C27B0', '#BA68C8'],
      content: 'The best way to manage waste is to reduce it. Use reusable bags, bottles, and containers. Buy products with less packaging, repair items instead of replacing them, and donate or sell items you no longer need.',
    },
    {
      id: '5',
      title: 'Plastic Alternatives',
      description: 'Discover eco-friendly alternatives to single-use plastics',
      icon: 'bottle-tonic',
      category: 'reduction',
      gradient: ['#00BCD4', '#4DD0E1'],
      content: 'Replace single-use plastics with reusable alternatives: stainless steel or glass bottles instead of plastic, cloth bags instead of plastic bags, bamboo or metal straws, and beeswax wraps instead of plastic wrap.',
    },
    {
      id: '6',
      title: 'E-Waste Management',
      description: 'Proper disposal of electronic waste',
      icon: 'cellphone',
      category: 'recycling',
      gradient: ['#607D8B', '#90A4AE'],
      content: 'Electronic waste contains hazardous materials and should never be thrown in regular trash. Find certified e-waste recyclers in your area. Many electronics stores offer take-back programs for old devices.',
    },
  ];

  const filteredContent = learningContent.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const categories = [
    { value: 'all', label: 'All', icon: 'view-grid' },
    { value: 'segregation', label: 'Segregation', icon: 'sort' },
    { value: 'recycling', label: 'Recycling', icon: 'recycle' },
    { value: 'composting', label: 'Composting', icon: 'sprout' },
    { value: 'reduction', label: 'Reduction', icon: 'minus-circle' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#F0F9F1', '#F5F7FA']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Learn & Educate</Text>
              <Text style={styles.headerSubtitle}>Expand your knowledge about waste management</Text>
            </View>
            <IconButton icon="book-open-variant" size={32} iconColor={theme.colors.primary} />
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.value && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.value as any)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={
                    selectedCategory === category.value
                      ? ['#4CAF50', '#81C784']
                      : ['#FFFFFF', '#FFFFFF']
                  }
                  style={styles.categoryChipGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <IconButton
                    icon={category.icon}
                    size={20}
                    iconColor={
                      selectedCategory === category.value
                        ? '#FFFFFF'
                        : theme.colors.textSecondary
                    }
                    style={styles.categoryIcon}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category.value && styles.categoryTextActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredContent.map((item, index) => (
            <Animated.View
              key={item.id}
              style={[
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Card style={styles.learningCard}>
                <Card.Content>
                  <View style={styles.cardContent}>
                    {/* Icon */}
                    <LinearGradient
                      colors={item.gradient}
                      style={styles.iconContainer}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <IconButton icon={item.icon} size={32} iconColor="#FFFFFF" style={styles.icon} />
                    </LinearGradient>

                    {/* Text Content */}
                    <View style={styles.textContainer}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                      <Text style={styles.cardBodyText} numberOfLines={3}>
                        {item.content}
                      </Text>
                      <TouchableOpacity style={styles.readMoreButton}>
                        <Text style={styles.readMoreText}>Read More →</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </Animated.View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs / 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  filterContainer: {
    marginBottom: theme.spacing.md,
  },
  filterScroll: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  categoryChip: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginRight: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.outlineVariant,
    ...theme.shadows.sm,
  },
  categoryChipActive: {
    borderColor: theme.colors.primary,
    ...theme.shadows.md,
  },
  categoryChipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minWidth: 100,
  },
  categoryIcon: {
    margin: 0,
    marginRight: theme.spacing.xs,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  learningCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  cardContent: {
    flexDirection: 'row',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
  },
  icon: {
    margin: 0,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  cardBodyText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
