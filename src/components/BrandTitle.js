import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
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
 * Figma. The outline uses layered text shadows on web and offset text copies on native.
 */
export default function BrandTitle({ fontSize = 32, stroke = 1 }) {
  const base = {
    fontSize,
    lineHeight: Math.round(fontSize * 1.22),
    includeFontPadding: false,
    // Keep the offset outline copies inside their Text paint bounds at both ends.
    paddingHorizontal: stroke + 1,
  };
  const webOutline = Platform.OS === 'web'
    ? {
      textShadow: [
        `${stroke}px 0 0 ${colors.black}`,
        `${-stroke}px 0 0 ${colors.black}`,
        `0 ${stroke}px 0 ${colors.black}`,
        `0 ${-stroke}px 0 ${colors.black}`,
        `${stroke}px ${stroke}px 0 ${colors.black}`,
        `${stroke}px ${-stroke}px 0 ${colors.black}`,
        `${-stroke}px ${stroke}px 0 ${colors.black}`,
        `${-stroke}px ${-stroke}px 0 ${colors.black}`,
      ].join(', '),
    }
    : null;

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
      {Platform.OS !== 'web' && OFFSETS.map(([dx, dy]) => (
        <Text
          key={`${dx},${dy}`}
          numberOfLines={1}
          allowFontScaling={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.text, base, styles.outline, { left: dx * stroke, top: dy * stroke }]}
        >
          {renderText(colors.black, colors.black)}
          {'\u00a0'}
        </Text>
      ))}
      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={[styles.text, base, webOutline]}
      >
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
