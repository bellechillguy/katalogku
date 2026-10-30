import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BrandTitle from '../src/components/BrandTitle';
import { colors } from '../src/theme/tokens';

const SPLASH_MS = 1800;

// The Figma frame uses two heavily blurred blue/green ellipses at the top and bottom edges.
// They are approximated here with vertical gradients (no react-native-svg needed).
const BLOB = ['rgba(133,180,235,0.85)', 'rgba(135,200,121,0.32)', 'rgba(249,250,251,0)'];

export default function Welcome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const logoFontSize = Math.min(54, Math.max(32, (width - 48) / 5.6));

  useEffect(() => {
    const t = setTimeout(() => router.replace('/home'), SPLASH_MS);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.screen}>
      <LinearGradient pointerEvents="none" colors={BLOB} locations={[0, 0.4, 1]} style={styles.top} />
      <LinearGradient
        pointerEvents="none"
        colors={[...BLOB].reverse()}
        locations={[0, 0.6, 1]}
        style={styles.bottom}
      />
      <BrandTitle fontSize={logoFontSize} stroke={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 270,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 270,
  },
});
