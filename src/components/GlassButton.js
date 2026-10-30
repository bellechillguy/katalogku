import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import GlassSurface from './GlassSurface';
import { colors, fonts, glassShadow } from '../theme/tokens';

// NOTE: never animate `opacity` on a parent of a glass surface — it flattens the effect.
// Press feedback therefore uses a small scale transform instead.
const pressScale = ({ pressed }) => ({ transform: [{ scale: pressed ? 0.96 : 1 }] });

/** Opaque black "Glass Prominent" pill — Add to Favorite / Save Profile (Button/*). */
export function GlassButton({ label, onPress, style, accessibilityLabel }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={(s) => [pressScale(s), style]}
    >
      <View style={[styles.primary, { boxShadow: glassShadow.primary }]}>
        <Text style={styles.primaryLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

/** Category / size chip (Button - Liquid Glass - Text, Medium). */
export function GlassChip({ label, selected, onPress, style, hitSlop = 0 }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      hitSlop={hitSlop}
      style={(s) => [pressScale(s), style]}
    >
      {selected ? (
        <View style={[styles.chip, styles.selectedChip, { boxShadow: glassShadow.button }]}>
          <Text style={[styles.chipLabel, styles.chipLabelSelected]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      ) : (
        <GlassSurface
          interactive
          backing={0.94}
          borderColor={colors.blueText}
          borderWidth={1}
          shadow={glassShadow.button}
          style={styles.chip}
        >
          <Text style={styles.chipLabel} numberOfLines={1}>
            {label}
          </Text>
        </GlassSurface>
      )}
    </Pressable>
  );
}

/** 35px colour swatch; the selected one gets a dashed blue ring. */
export function GlassSwatch({ color, selected, onPress, accessibilityLabel, hitSlop = 5 }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `Color ${color}`}
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      hitSlop={hitSlop}
      style={pressScale}
    >
      <View
        style={[
          styles.swatch,
          { backgroundColor: color, boxShadow: glassShadow.button },
          selected ? styles.selectedSwatch : styles.unselectedSwatch,
        ]}
      />
    </Pressable>
  );
}

/** Round glass button (search "X"). */
export function GlassIconButton({ children, onPress, size = 48, accessibilityLabel, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={(s) => [pressScale(s), style]}
    >
      <GlassSurface
        interactive
        shadow={glassShadow.surface}
        style={[styles.iconButton, { width: size, height: size }]}
      >
        {children}
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    height: 44,
    minWidth: 127.824,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontFamily: fonts.montserratMedium,
    fontSize: 17.1,
    lineHeight: 18.106,
    color: colors.white,
    textAlign: 'center',
  },
  chip: {
    height: 34,
    minWidth: 35,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedChip: {
    backgroundColor: colors.blue,
    borderRadius: 17,
  },
  chipLabel: {
    fontFamily: fonts.openSans,
    fontSize: 17,
    color: colors.black,
  },
  chipLabelSelected: {
    color: colors.black,
  },
  swatch: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  selectedSwatch: {
    borderColor: colors.blueText,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  unselectedSwatch: {
    borderColor: 'rgba(17,17,17,0.2)',
    borderWidth: 0.5,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
