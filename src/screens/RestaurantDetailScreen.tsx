import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { restaurants } from '../data/restaurants';
import type { RootStackParamList } from '../navigation/types';
import { useCartStore } from '../store/cartStore';
import { colors, spacing, typography } from '../theme';
import type { MenuItem, Restaurant } from '../types/food';

type RestaurantDetailNavigationProp = StackNavigationProp<RootStackParamList, 'RestaurantDetail'>;
type RestaurantDetailRouteProp = RouteProp<RootStackParamList, 'RestaurantDetail'>;

type MenuCategory = 'All' | string;

function getRestaurantById(restaurantId: string): Restaurant | undefined {
  return restaurants.find((restaurant) => restaurant.id === restaurantId);
}

function buildCategories(menuItems: MenuItem[]): MenuCategory[] {
  return ['All', ...Array.from(new Set(menuItems.map((item) => item.category)))];
}

function MenuItemRow({ item }: { item: MenuItem }) {
  const quantity = useCartStore((state) => state.getItemQuantity(item.id));
  const addItem = useCartStore((state) => state.addItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);

  return (
    <View style={styles.menuCard}>
      <Image source={{ uri: item.image }} style={styles.menuImage} />
      <View style={styles.menuContent}>
        <View style={styles.menuTextWrap}>
          <Text style={styles.menuTitle}>{item.name}</Text>
          <Text style={styles.menuDescription}>{item.description}</Text>
          <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
        </View>

        {quantity > 0 ? (
          <View style={styles.quantityRow}>
            <Pressable onPress={() => decrementItem(item.id)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </Pressable>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <Pressable onPress={() => incrementItem(item.id)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => addItem(item)} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function RestaurantDetailScreen() {
  const route = useRoute<RestaurantDetailRouteProp>();
  const navigation = useNavigation<RestaurantDetailNavigationProp>();
  const scrollY = useSharedValue(0);
  const cartItemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  const restaurant = useMemo(
    () => getRestaurantById(route.params.restaurantId),
    [route.params.restaurantId],
  );

  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');

  const filteredMenuItems = useMemo(() => {
    if (!restaurant) {
      return [];
    }

    if (selectedCategory === 'All') {
      return restaurant.menuItems;
    }

    return restaurant.menuItems.filter((item) => item.category === selectedCategory);
  }, [restaurant, selectedCategory]);

  const topHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [20, 90], [0, 1]),
  }));

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (!restaurant) {
    return (
      <View style={styles.screenCenter}>
        <Text style={styles.fallbackTitle}>Restaurant not found</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.backCta}>
          <Text style={styles.backCtaText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.stickyHeader, topHeaderStyle]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.stickyBackButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <View style={styles.stickyTitleWrap}>
          <Text style={styles.stickyTitle} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <Text style={styles.stickySubtitle}>{restaurant.cuisineType}</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
          style={styles.stickyCartButton}
        >
          <MaterialCommunityIcons name="cart-outline" size={22} color={colors.primaryDark} />
          {cartItemCount > 0 ? (
            <View style={styles.stickyCartBadge}>
              <Text style={styles.stickyCartBadgeText}>{cartItemCount > 9 ? '9+' : cartItemCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </Animated.View>

      <Animated.FlatList
        data={filteredMenuItems}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.heroWrap}>
              <Image source={{ uri: restaurant.image }} style={styles.heroImage} />
              <Pressable onPress={() => navigation.goBack()} style={styles.heroBackButton}>
                <Text style={styles.backIcon}>←</Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
                style={styles.heroCartButton}
              >
                <MaterialCommunityIcons name="cart-outline" size={22} color={colors.primaryDark} />
                {cartItemCount > 0 ? (
                  <View style={styles.heroCartBadge}>
                    <Text style={styles.heroCartBadgeText}>{cartItemCount > 9 ? '9+' : cartItemCount}</Text>
                  </View>
                ) : null}
              </Pressable>
              <View style={styles.heroOverlay} />
              <View style={styles.heroCaption}>
                <Text style={styles.heroCaptionTitle}>{restaurant.name}</Text>
                <Text style={styles.heroCaptionText}>{restaurant.deliveryTime} delivery</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoTopRow}>
                <View style={styles.infoTitleWrap}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantCuisine}>{restaurant.cuisineType}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {restaurant.rating.toFixed(1)}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>⏱ {restaurant.deliveryTime}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{restaurant.minimumOrder}</Text>
              </View>
            </View>

            <View style={styles.tabsWrap}>
              {buildCategories(restaurant.menuItems).map((category) => {
                const active = selectedCategory === category;

                return (
                  <Pressable
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={({ pressed }) => [
                      styles.tab,
                      active && styles.tabActive,
                      pressed && styles.tabPressed,
                    ]}
                  >
                    <Text style={[styles.tabText, active && styles.tabTextActive]}>{category}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Menu</Text>
              <Text style={styles.sectionCount}>{filteredMenuItems.length} items</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => <MenuItemRow item={item} />}
        ItemSeparatorComponent={() => <View style={styles.menuSeparator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No items in this category</Text>
            <Text style={styles.emptyStateText}>Try a different menu tab.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenCenter: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  fallbackTitle: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
  },
  backCta: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backCtaText: {
    color: colors.surface,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.sm,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 54,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  stickyBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stickyTitleWrap: {
    flex: 1,
  },
  stickyCartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
    position: 'relative',
  },
  stickyCartIcon: {
    fontSize: 18,
  },
  stickyCartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  stickyCartBadgeText: {
    color: colors.surface,
    fontFamily: typography.fonts.bold,
    fontSize: 9,
    lineHeight: 11,
  },
  stickyTitle: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },
  stickySubtitle: {
    marginTop: 2,
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
  },
  backIcon: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: 18,
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: spacing.xxl,
  },
  heroWrap: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: colors.surfaceSoft,
  },
  heroBackButton: {
    position: 'absolute',
    top: 54,
    left: spacing.lg,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  heroCartButton: {
    position: 'absolute',
    top: 54,
    right: spacing.lg,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  heroCartIcon: {
    fontSize: 18,
  },
  heroCartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  heroCartBadgeText: {
    color: colors.surface,
    fontFamily: typography.fonts.bold,
    fontSize: 9,
    lineHeight: 11,
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.14)',
  },
  heroCaption: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: spacing.lg,
  },
  heroCaptionTitle: {
    color: colors.surface,
    fontFamily: typography.fonts.bold,
    fontSize: 28,
    lineHeight: 34,
  },
  heroCaptionText: {
    marginTop: spacing.xs,
    color: colors.surface,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
  },
  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  infoTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  infoTitleWrap: {
    flex: 1,
  },
  restaurantName: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
  },
  restaurantCuisine: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
  },
  ratingBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  ratingText: {
    color: colors.primaryDark,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
  },
  metaRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
  },
  metaDot: {
    marginHorizontal: spacing.sm,
    color: colors.textSecondary,
  },
  tabsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabPressed: {
    opacity: 0.85,
  },
  tabText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.sm,
  },
  tabTextActive: {
    color: colors.surface,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
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
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
  },
  menuImage: {
    width: 112,
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceSoft,
  },
  menuContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  menuTextWrap: {
    gap: 4,
  },
  menuTitle: {
    color: colors.text,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.md,
  },
  menuDescription: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    lineHeight: typography.lineHeights.xs,
  },
  menuPrice: {
    color: colors.primaryDark,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    marginTop: spacing.xs,
  },
  addButton: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  addButtonText: {
    color: colors.surface,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.xs,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    padding: 4,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md,
  },
  quantityValue: {
    minWidth: 22,
    textAlign: 'center',
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    marginHorizontal: spacing.sm,
  },
  menuSeparator: {
    height: spacing.md,
  },
  emptyState: {
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  emptyStateTitle: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },
  emptyStateText: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
  },
});
