import { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../theme';
import { homeCategories, restaurants } from '../data/restaurants';
import { RestaurantCard } from '../components/RestaurantCard';
import { useCartStore } from '../store/cartStore';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';

type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  StackNavigationProp<RootStackParamList>
>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const insets = useSafeAreaInsets();
  const cartItemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const [selectedCategory, setSelectedCategory] = useState<(typeof homeCategories)[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return restaurants.filter((restaurant) => {
      const matchesCategory =
        selectedCategory === 'All' || restaurant.categories.includes(selectedCategory);

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        restaurant.name,
        restaurant.cuisineType,
        ...restaurant.menuItems.flatMap((item) => [item.name, item.description]),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [searchQuery, selectedCategory]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingTop: insets.top /* + spacing.md */ }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.locationLabel}>Deliver to</Text>
                <Text style={styles.locationValue}>Downtown Manhattan</Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
                style={styles.avatarCircle}
              >
                <MaterialCommunityIcons name="cart-outline" size={24} color={colors.surface} />
                {cartItemCount > 0 ? (
                  <View style={styles.avatarBadge}>
                    <Text style={styles.avatarBadgeText}>{cartItemCount > 9 ? '9+' : cartItemCount}</Text>
                  </View>
                ) : null}
              </Pressable>
            </View>

            <View style={styles.heroCard}>
              <View style={styles.heroTextWrap}>
                <Text style={styles.heroKicker}>30 min delivery</Text>
                <Text style={styles.heroTitle}>Dinner made simple.</Text>
                <Text style={styles.heroSubtitle}>
                  Discover the best restaurants and dishes near you.
                </Text>
              </View>
              <Image
                source={{ uri: 'https://picsum.photos/seed/food-hero/300/260' }}
                style={styles.heroImage}
              />
            </View>

            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                placeholder="Search restaurants or dishes"
                placeholderTextColor={colors.textSecondary}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                autoCorrect={false}
              />
              {searchQuery.length > 0 ? (
                <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>×</Text>
                </Pressable>
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {homeCategories.map((category) => {
                const active = selectedCategory === category;

                return (
                  <Pressable
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={({ pressed }) => [
                      styles.chip,
                      active && styles.chipActive,
                      pressed && styles.chipPressed,
                    ]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{category}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular restaurants</Text>
              <Text style={styles.sectionCount}>{filteredRestaurants.length} places</Text>
            </View>

            {filteredRestaurants.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No restaurants found</Text>
                <Text style={styles.emptyText}>
                  Try a different restaurant name, cuisine, or dish.
                </Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.duration(450).delay(index * 80)}>
            <RestaurantCard
              restaurant={item}
              onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
            />
          </Animated.View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  locationLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  locationValue: {
    marginTop: 4,
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    color: colors.surface,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
  },
  avatarBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  avatarBadgeText: {
    color: colors.surface,
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    lineHeight: 12,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  heroTextWrap: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heroKicker: {
    color: colors.primary,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    marginTop: spacing.xs,
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: 28,
    lineHeight: 34,
  },
  heroSubtitle: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.sm,
  },
  heroImage: {
    width: 104,
    height: 104,
    borderRadius: 24,
    backgroundColor: colors.surfaceSoft,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  searchIcon: {
    color: colors.textSecondary,
    fontSize: 20,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    padding: 0,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  clearButtonText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    lineHeight: 18,
    marginTop: -1,
  },
  chipRow: {
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipPressed: {
    opacity: 0.85,
  },
  chipText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.sm,
  },
  chipTextActive: {
    color: colors.surface,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
  },
  sectionCount: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.md,
  },
  emptyText: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.sm,
  },
  separator: {
    height: spacing.md,
  },
});
