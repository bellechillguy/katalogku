import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BrandTitle from './BrandTitle';
import { colors, fonts, layout } from '../theme/tokens';

function Background() {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={[colors.green, colors.white]}
      locations={[0, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    />
  );
}

/** HeaderBar/Home — KatalogKu wordmark + tagline. */
export function BrandHeader({ subtitle = 'Find the products you need' }) {
  return (
    <View style={styles.bar}>
      <Background />
      <View style={styles.brandRow}>
        <BrandTitle fontSize={32} stroke={1} />
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

/** HeaderBar/Profile — large title + subtitle. */
export function TitleHeader({ title, subtitle }) {
  return (
    <View style={styles.bar}>
      <Background />
      <View style={styles.brandRow}>
        <Text style={styles.largeTitle} accessibilityRole="header">
          {title}
        </Text>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

/** HeaderBar/Details + HeaderBar/Favorites — back arrow, title, optional right action. */
export function BackHeader({ title, onBack, right, showBack = true }) {
  return (
    <View style={styles.bar}>
      <Background />
      {showBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.back}
        >
          <Ionicons name="arrow-back" size={32} color={colors.black} />
        </Pressable>
      ) : null}
      <Text style={styles.backTitle} accessibilityRole="header">
        {title}
      </Text>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: layout.headerHeight,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.green,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: layout.headerHeight,
  },
  brandRow: {
    paddingLeft: 33,
    paddingTop: 52,
    height: 91,
  },
  largeTitle: {
    fontFamily: fonts.montserratBold,
    fontSize: 32,
    color: colors.black,
  },
  subtitle: {
    fontFamily: fonts.openSans,
    fontSize: 14,
    color: colors.black,
    paddingLeft: 35,
    paddingTop: 4,
  },
  back: {
    position: 'absolute',
    left: 30,
    top: 56,
  },
  backTitle: {
    position: 'absolute',
    left: 84,
    top: 57,
    fontFamily: fonts.montserratSemiBold,
    fontSize: 24,
    color: colors.black,
  },
  right: {
    position: 'absolute',
    right: 33,
    top: 56,
  },
});
