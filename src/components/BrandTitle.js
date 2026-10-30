import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';

const OFFSETS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

/**
 * "Katalog" (off-white) + "Ku" (blue, bold italic), both with the thin dark outline from
 * Figma. React Native has no text stroke, so the outline is eight offset copies drawn
 * behind the fill.
 */
export default function BrandTitle({ fontSize = 32, stroke = 1 }) {
  const base = { fontSize, lineHeight: Math.round(fontSize * 1.22), includeFontPadding: false };

  const renderText = (katalogColor, kuColor) => (
    <>
      <Text style={{ color: katalogColor }}>Katalog</Text>
      <Text style={{ color: kuColor, fontFamily: fonts.montserratBoldItalic, fontStyle: 'italic' }}>
        Ku
      </Text>
    </>
  );

  return (
    <View accessible accessibilityRole="header" accessibilityLabel="KatalogKu">
      {OFFSETS.map(([dx, dy]) => (
        <Text
          key={`${dx},${dy}`}
          numberOfLines={1}
          allowFontScaling={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.text, base, styles.outline, { left: dx * stroke, top: dy * stroke }]}
        >
          {renderText(colors.black, colors.black)}
        </Text>
      ))}
      <Text numberOfLines={1} allowFontScaling={false} style={[styles.text, base]}>
        {renderText(colors.white, colors.blue)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.montserratBold,
  },
  outline: {
    position: 'absolute',
  },
});
