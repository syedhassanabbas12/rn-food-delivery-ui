import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCartStore } from '../store/cartStore';
import { colors, spacing, typography } from '../theme';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';

type CartNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'CartTab'>,
  StackNavigationProp<RootStackParamList>
>;

const DELIVERY_FEE = 3.99;

export function CartScreen() {
  const navigation = useNavigation<CartNavigationProp>();
  const insets = useSafeAreaInsets();
  const items = useCartStore((state) => state.items);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const totals = useMemo(() => {
    const itemTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      itemTotal,
      deliveryFee: items.length > 0 ? DELIVERY_FEE : 0,
      grandTotal: itemTotal + (items.length > 0 ? DELIVERY_FEE : 0),
    };
  }, [items]);

  const emptyCart = items.length === 0;

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}> 
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Your Cart</Text>
          <Text style={styles.subtitle}>{items.length} items ready to checkout</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {emptyCart ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyIcon}>🛒</Text>
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Add a few dishes from any restaurant to start your order.
            </Text>
            <Pressable
              onPress={() => navigation.navigate('HomeTab')}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Browse restaurants</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.itemList}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemContent}>
                  <View style={styles.itemTopRow}>
                    <View style={styles.itemTextWrap}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    </View>
                    <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>

                  <View style={styles.itemBottomRow}>
                    <Text style={styles.unitPrice}>${item.price.toFixed(2)} each</Text>
                    <View style={styles.quantityRow}>
                      <Pressable onPress={() => decrementItem(item.id)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                      </Pressable>
                      <Text style={styles.quantityValue}>{item.quantity}</Text>
                      <Pressable onPress={() => incrementItem(item.id)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Item total</Text>
            <Text style={styles.summaryValue}>${totals.itemTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery fee</Text>
            <Text style={styles.summaryValue}>${totals.deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totals.grandTotal.toFixed(2)}</Text>
          </View>

          <Pressable
            onPress={() => {
              clearCart();
              navigation.navigate('OrderTracking');
            }}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          >
            <Text style={styles.primaryButtonText}>Place Order</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  backIcon: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: 18,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
  },
  subtitle: {
    marginTop: 2,
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  emptyIconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyIcon: {
    fontSize: 34,
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
  },
  emptyText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: typography.lineHeights.sm,
  },
  itemList: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  itemImage: {
    width: 110,
    backgroundColor: colors.surfaceSoft,
  },
  itemContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  itemTextWrap: {
    flex: 1,
  },
  itemName: {
    color: colors.text,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.md,
  },
  itemDescription: {
    marginTop: 4,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    lineHeight: typography.lineHeights.xs,
  },
  itemPrice: {
    color: colors.primaryDark,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },
  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  unitPrice: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    padding: 4,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  quantityButtonText: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },
  quantityValue: {
    minWidth: 22,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
  },
  summaryValue: {
    color: colors.text,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  totalLabel: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },
  totalValue: {
    color: colors.primaryDark,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: colors.surface,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },
});
