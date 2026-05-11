import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { Restaurant } from '../types/food';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress?: () => void;
}

export function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {restaurant.rating.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.cuisine}>{restaurant.cuisineType}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⏱ {restaurant.deliveryTime}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{restaurant.minimumOrder}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  image: {
    width: '100%',
    height: 170,
    backgroundColor: colors.surfaceSoft,
  },
  content: {
    padding: spacing.lg,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  name: {
    flex: 1,
    color: colors.text,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.lg,
    lineHeight: typography.lineHeights.lg,
  },
  ratingBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  ratingText: {
    color: colors.primaryDark,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.xs,
  },
  cuisine: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
  },
  metaRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
  },
  metaDot: {
    marginHorizontal: spacing.sm,
    color: colors.textSecondary,
  },
});
