import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { colors, spacing, typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type SplashNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

export function SplashScreen() {
  const navigation = useNavigation<SplashNavigationProp>();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    scale.value = withDelay(100, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));

    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, opacity, scale]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.screen}>
      <View style={styles.backgroundOrbPrimary} />
      <View style={styles.backgroundOrbSecondary} />
      <Animated.View style={[styles.brandCard, containerStyle]}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🍔</Text>
        </View>
        <Text style={styles.brandTitle}>Feastly</Text>
        <Text style={styles.brandSubtitle}>Fresh food, fast delivery</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    overflow: 'hidden',
  },
  backgroundOrbPrimary: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.primarySoft,
    top: -60,
    right: -80,
    opacity: 0.9,
  },
  backgroundOrbSecondary: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFD4C3',
    bottom: -50,
    left: -60,
    opacity: 0.7,
  },
  brandCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 32,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoEmoji: {
    fontSize: 40,
  },
  brandTitle: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
  },
});
