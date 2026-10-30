import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassSurface from './GlassSurface';
import { colors, fonts, glassShadow, layout } from '../theme/tokens';

/**
 * BottomNavigation/Home + BottomNavigation/Favorite + BottomNavigation/Profile.
 * Two separate glass shapes: a 244x62 pill (Home, Favorite) and a 62px circle (Profile).
 * The selected tab gets the "Selection" fill (Fills - Vibrant/Tertiary) and the blue tint.
 */
export default function BottomNavigation() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname.startsWith('/profile')
    ? 'profile'
    : pathname.startsWith('/favorites')
      ? 'favorite'
      : 'home';

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { bottom: insets.bottom + layout.navBottomOffset }]}
    >
      <GlassSurface shadow={glassShadow.surface} style={styles.pill}>
        <Tab
          label="Home"
          icon="home-outline"
          active={selected === 'home'}
          onPress={() => router.navigate('/home')}
        />
        <Tab
          label="Favorite"
          icon="heart-outline"
          active={selected === 'favorite'}
          onPress={() => router.navigate('/favorites')}
        />
      </GlassSurface>

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
            size={44}
            color={selected === 'profile' ? colors.blueText : colors.black}
          />
        </Pressable>
      </GlassSurface>
    </View>
  );
}

function Tab({ label, icon, active, onPress }) {
  const tint = active ? colors.blueText : colors.labelControlsPrimary;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.tab}
    >
      {active && <View style={styles.tabSelection} />}
      <Ionicons name={icon} size={28} color={tint} />
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
  pill: {
    width: 244,
    height: 62,
    flexDirection: 'row',
    padding: 4,
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
  circleSelection: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
    backgroundColor: colors.fillVibrantTertiary,
  },
});
