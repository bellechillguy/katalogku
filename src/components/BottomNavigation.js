import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassSurface from './GlassSurface';
import { useCart } from '../context/CartContext';
import { colors, fonts, glassShadow, layout } from '../theme/tokens';

/**
 * BottomNavigation/Home + BottomNavigation/Favorites + BottomNavigation/Cart + BottomNavigation/Profile.
 * Two separate glass shapes: a responsive pill (Home, Favorites, Cart) and a 62px Profile circle.
 * The selected tab gets the "Selection" fill (Fills - Vibrant/Tertiary) and the blue tint.
 */
export default function BottomNavigation() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  const { items: cartItems } = useCart();
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const tabletLayout = width >= 700;
  const pillWidth = tabletLayout
    ? Math.min(640, width - 48)
    : Math.max(196, Math.min(288, width - 124));
  const selected = pathname.startsWith('/profile')
    ? 'profile'
    : pathname.startsWith('/cart')
      ? 'cart'
      : pathname.startsWith('/favorites')
        ? 'favorite'
        : 'home';

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        tabletLayout && styles.tabletContainer,
        { bottom: insets.bottom + layout.navBottomOffset },
      ]}
    >
      <GlassSurface
        shadow={glassShadow.surface}
        style={[styles.pill, tabletLayout && styles.tabletPill, { width: pillWidth }]}
      >
        <Tab
          label="Home"
          icon="home-outline"
          active={selected === 'home'}
          onPress={() => router.navigate('/home')}
        />
        <Tab
          label="Favorites"
          icon="heart-outline"
          active={selected === 'favorite'}
          onPress={() => router.navigate('/favorites')}
        />
        <Tab
          label="Cart"
          icon="cart-outline"
          active={selected === 'cart'}
          badge={cartCount}
          onPress={() => router.navigate('/cart')}
        />
        {tabletLayout ? (
          <Tab
            label="Profile"
            icon="person-circle-outline"
            active={selected === 'profile'}
            onPress={() => router.navigate('/profile')}
          />
        ) : null}
      </GlassSurface>

      {!tabletLayout ? (
        <GlassSurface shadow={glassShadow.surface} style={styles.circle}>
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="Profile"
            accessibilityState={{ selected: selected === 'profile' }}
            onPress={() => router.navigate('/profile')}
            style={styles.circleHit}
          >
            {selected === 'profile' && <View style={styles.circleSelection} />}
            <Ionicons
              name="person-circle-outline"
              size={26}
              color={selected === 'profile' ? colors.blueText : colors.black}
            />
            <Text
              style={[
                styles.circleLabel,
                { color: selected === 'profile' ? colors.blueText : colors.black },
              ]}
            >
              Profile
            </Text>
          </Pressable>
        </GlassSurface>
      ) : null}
    </View>
  );
}

function Tab({ label, icon, active, onPress, badge = 0 }) {
  const tint = active ? colors.blueText : colors.labelControlsPrimary;
  const accessibleLabel = badge > 0
    ? `${label}, ${badge} ${label === 'Cart' ? (badge === 1 ? 'item' : 'items') : 'saved'}`
    : label;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={accessibleLabel}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.tab}
    >
      {active && <View style={styles.tabSelection} />}
      <View style={styles.tabIconArea}>
        <Ionicons name={icon} size={28} color={tint} />
        {badge > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.tabLabel, { color: tint }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 21,
  },
  tabletContainer: {
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pill: {
    height: 62,
    flexDirection: 'row',
    padding: 4,
  },
  tabletPill: {
    height: 68,
    padding: 6,
  },
  tab: {
    flex: 1,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0.5,
  },
  tabSelection: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
    backgroundColor: colors.fillVibrantTertiary,
  },
  tabIconArea: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueText,
  },
  badgeLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 9,
    lineHeight: 11,
    color: colors.white,
  },
  tabLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
  },
  circle: {
    width: 62,
    height: 62,
    padding: 4,
  },
  circleHit: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
  },
  circleSelection: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
    backgroundColor: colors.fillVibrantTertiary,
  },
});
