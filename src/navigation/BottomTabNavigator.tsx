import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { CartScreen } from '../screens/CartScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { useCartStore } from '../store/cartStore';
import { colors, spacing, typography } from '../theme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabLabel({ focused, label }: { focused: boolean; label: string }) {
  return <Text style={[styles.label, focused ? styles.labelActive : styles.labelInactive]}>{label}</Text>;
}

function TabIcon({ focused, glyph }: { focused: boolean; glyph: string }) {
  return (
    <View style={[styles.iconChip, focused ? styles.iconChipActive : styles.iconChipInactive]}>
      <MaterialCommunityIcons
        name={glyph as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
        size={20}
        color={focused ? colors.primaryDark : colors.textSecondary}
      />
    </View>
  );
}

function CartTabIcon({ focused, count }: { focused: boolean; count: number }) {
  return (
    <View style={[styles.iconChip, focused ? styles.iconChipActive : styles.iconChipInactive]}>
      <MaterialCommunityIcons
        name="cart-outline"
        size={20}
        color={focused ? colors.primaryDark : colors.textSecondary}
      />
      {count > 0 ? (
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      ) : null}
    </View>
  );
}

function TabButton({
  children,
  onPress,
  onLongPress,
  accessibilityState,
}: BottomTabBarButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.tabButton, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityState={accessibilityState}
        onPressIn={() => {
          scale.value = withTiming(0.96, { duration: 120, easing: Easing.out(Easing.cubic) });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) });
        }}
        style={({ pressed }) => [
          styles.tabButtonPressable,
          pressed && styles.tabButtonPressed,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export function BottomTabNavigator() {
  const cartItemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabelBase,
        tabBarIconStyle: styles.tabBarIconBase,
        tabBarButton: (props) => <TabButton {...props} />,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Home" />,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="home-variant-outline" />,
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Cart" />,
          tabBarIcon: ({ focused }) => <CartTabIcon focused={focused} count={cartItemCount} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 82,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
    elevation: 12,
  },
  tabBarItem: {
    flex: 1,
    borderRadius: 22,
    marginHorizontal: 6,
    marginTop: 4,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    flex: 1,
    borderRadius: 22,
  },
  tabButtonPressable: {
    flex: 1,
    borderRadius: 22,
  },
  tabButtonPressed: {
    opacity: 0.92,
  },
  tabBarLabelBase: {
    marginTop: 2,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.xs,
  },
  tabBarIconBase: {
    marginBottom: -2,
  },
  label: {
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.xs,
  },
  labelActive: {
    color: colors.primary,
  },
  labelInactive: {
    color: colors.textSecondary,
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    position: 'relative',
  },
  iconChipActive: {
    backgroundColor: colors.primarySoft,
  },
  iconChipInactive: {
    backgroundColor: colors.surfaceSoft,
  },
  iconGlyph: {
    fontSize: 18,
  },
  iconBadge: {
    position: 'absolute',
    top: -4,
    right: -5,
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    paddingHorizontal: 3,
    backgroundColor: colors.primaryDark,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeText: {
    color: colors.surface,
    fontFamily: typography.fonts.bold,
    fontSize: 9,
    lineHeight: 11,
  },
});
