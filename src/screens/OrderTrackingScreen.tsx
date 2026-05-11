import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type TrackingNavigationProp = StackNavigationProp<RootStackParamList, 'OrderTracking'>;

const trackingSteps = ['Order Confirmed', 'Preparing', 'On the Way', 'Delivered'] as const;

function TrackingStep({
  title,
  description,
  index,
  activeStep,
}: {
  title: string;
  description: string;
  index: number;
  activeStep: number;
}) {
  const progress = useSharedValue(activeStep >= index ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(activeStep >= index ? 1 : 0, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeStep, index, progress]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.72, 1]) }],
    opacity: interpolate(progress.value, [0, 1], [0.5, 1]),
  }));

  return (
    <Animated.View
      entering={FadeInUp.duration(450).delay(index * 120)}
      style={[styles.stepCard, activeStep === index && styles.stepCardActive]}
    >
      <Animated.View
        style={[
          styles.stepBadge,
          activeStep >= index ? styles.stepBadgeActive : styles.stepBadgeInactive,
          badgeStyle,
        ]}
      >
        <Text style={styles.stepBadgeText}>{activeStep >= index ? '✓' : index + 1}</Text>
      </Animated.View>
      <View style={styles.stepTextWrap}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
}

export function OrderTrackingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const etaPulse = useSharedValue(0);
  const navigation = useNavigation<TrackingNavigationProp>();

  const etaLabel = useMemo(() => 'Estimated delivery: 18 min', []);

  useEffect(() => {
    etaPulse.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    const timers = [
      setTimeout(() => setActiveStep(1), 1200),
      setTimeout(() => setActiveStep(2), 2600),
      setTimeout(() => setActiveStep(3), 4200),
    ];

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [etaPulse]);

  const etaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(etaPulse.value, [0, 1], [0.98, 1.02]) }],
    opacity: interpolate(etaPulse.value, [0, 1], [0.84, 1]),
  }));

  return (
    <View style={styles.screen}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.headerCard}>
        <View style={styles.confirmationPill}>
          <Text style={styles.confirmationPillText}>Order placed</Text>
        </View>
        <Text style={styles.title}>Your food is on its way</Text>
        <Text style={styles.subtitle}>
          The kitchen has confirmed your order and the courier is moving through the delivery flow.
        </Text>

        <Animated.View style={[styles.etaCard, etaStyle]}>
          <Text style={styles.etaLabel}>{etaLabel}</Text>
          <Text style={styles.etaValue}>Driver arriving soon</Text>
        </Animated.View>
      </Animated.View>

      <View style={styles.timelineWrap}>
        {trackingSteps.map((step, index) => (
          <TrackingStep
            key={step}
            title={step}
            index={index}
            activeStep={activeStep}
            description={
              index === 0
                ? 'We have received your order and sent it to the kitchen.'
                : index === 1
                  ? 'The team is preparing your food with care and speed.'
                  : index === 2
                    ? 'Your order is on the way with live delivery progress.'
                    : 'Your meal has arrived and is ready to enjoy.'
            }
          />
        ))}
      </View>

      <Animated.View entering={FadeInUp.duration(500).delay(450)} style={styles.mapCard}>
        <View style={styles.mapGlowOne} />
        <View style={styles.mapGlowTwo} />
        <View style={styles.mapPin}>
          <Text style={styles.mapPinText}>📍</Text>
        </View>
        <Text style={styles.mapTitle}>Live map placeholder</Text>
        <Text style={styles.mapSubtitle}>A polished map component can slot in here later.</Text>
      </Animated.View>

      <View style={styles.footerNote}>
        <Text style={styles.footerNoteText}>
          You’ll get a notification once the order is marked delivered.
        </Text>
      </View>

      <Pressable
        onPress={() => navigation.replace('MainTabs', { screen: 'HomeTab' })}
        style={({ pressed }) => [styles.homeButton, pressed && styles.homeButtonPressed]}
      >
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
    paddingBottom: spacing.lg,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  confirmationPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    marginBottom: spacing.md,
  },
  confirmationPillText: {
    color: colors.primaryDark,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    color: colors.text,
    fontFamily: typography.fonts.bold,
    fontSize: 30,
    lineHeight: 36,
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.md,
  },
  etaCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  etaLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  etaValue: {
    marginTop: spacing.xs,
    color: colors.primaryDark,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
  },
  timelineWrap: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  stepCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF6F1',
  },
  stepBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  stepBadgeActive: {
    backgroundColor: colors.primary,
  },
  stepBadgeInactive: {
    backgroundColor: colors.surfaceSoft,
  },
  stepBadgeText: {
    color: colors.surface,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
  },
  stepTextWrap: {
    flex: 1,
  },
  stepTitle: {
    color: colors.text,
    fontFamily: typography.fonts.semibold,
    fontSize: typography.sizes.md,
  },
  stepDescription: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.sm,
  },
  mapCard: {
    position: 'relative',
    marginTop: spacing.lg,
    minHeight: 210,
    borderRadius: 30,
    padding: spacing.xl,
    overflow: 'hidden',
    backgroundColor: '#1F1F1F',
    justifyContent: 'flex-end',
  },
  mapGlowOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 107, 53, 0.25)',
    top: -30,
    right: -70,
  },
  mapGlowTwo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 214, 196, 0.16)',
    bottom: -40,
    left: -30,
  },
  mapPin: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  mapPinText: {
    fontSize: 30,
  },
  mapTitle: {
    color: colors.surface,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
  },
  mapSubtitle: {
    marginTop: spacing.xs,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.sm,
  },
  footerNote: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  footerNoteText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    textAlign: 'center',
  },
  homeButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  homeButtonPressed: {
    opacity: 0.9,
  },
  homeButtonText: {
    color: colors.surface,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },
});
