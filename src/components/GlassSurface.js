import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { glassShadow } from '../theme/tokens';

/**
 * True when the real iOS 26 Liquid Glass material can be used (and the user has not
 * enabled "Reduce Transparency"). Everywhere else the Figma-matched fallback is drawn.
 */
export function useNativeGlass() {
  const [reduceTransparency, setReduceTransparency] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceTransparencyEnabled?.()
      .then((v) => mounted && setReduceTransparency(!!v))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.('reduceTransparencyChanged', (v) =>
      setReduceTransparency(!!v)
    );
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);

  return isLiquidGlassAvailable() && !reduceTransparency;
}

function isDarkColor(color) {
  if (typeof color !== 'string' || !/^#([0-9a-f]{6})$/i.test(color)) return false;
  const n = parseInt(color.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 110;
}

const fill = StyleSheet.absoluteFill;

/**
 * One Liquid Glass surface. It mirrors the layer stack of the Figma components:
 *
 *   Fill + Shadow  -> `shadow` (exact multi-shadow string, see glassShadow in tokens.js)
 *   White Backing  -> `backing` (opacity of a white layer under the tint)
 *   Tint           -> `tint`    (solid colour under the glass)
 *   Glass Effect   -> <GlassView> on iOS 26+, BlurView + gradient sheen elsewhere
 *
 * Children are rendered in normal flow above the glass, so the surface sizes itself
 * from its content (chips, buttons) exactly like an auto-layout frame in Figma.
 */
export default function GlassSurface({
  radius, // number; omit for a fully rounded pill (height / 2)
  tint,
  backing,
  effect = 'regular',
  interactive = false,
  shadow = glassShadow.button,
  borderColor,
  borderWidth = 0,
  borderStyle = 'solid',
  style,
  children,
  onLayout,
  ...rest
}) {
  const nativeGlass = useNativeGlass();
  const flat = StyleSheet.flatten(style) || {};
  const [height, setHeight] = useState(typeof flat.height === 'number' ? flat.height : 0);
  const r = radius ?? height / 2;

  const dark = tint ? isDarkColor(tint) : false;

  const baseLayers = (
    <>
      {backing != null && (
        <View pointerEvents="none" style={[fill, { backgroundColor: '#ffffff', opacity: backing }]} />
      )}
      {tint ? <View pointerEvents="none" style={[fill, { backgroundColor: tint }]} /> : null}
    </>
  );

  return (
    <View
      {...rest}
      style={[style, { borderRadius: r, boxShadow: shadow }]}
      onLayout={(e) => {
        setHeight(e.nativeEvent.layout.height);
        onLayout?.(e);
      }}
    >
      {/* Base colour layers (clipped to the pill) */}
      <View pointerEvents="none" style={[fill, { borderRadius: r, overflow: 'hidden' }]}>
        {baseLayers}

        {/* ---- Fallback glass: Android, iOS < 26, or Reduce Transparency ---- */}
        {!nativeGlass && (
          <>
            {!tint && <BlurView intensity={45} tint="light" style={fill} />}
            {!tint && (
              <View style={[fill, { backgroundColor: 'rgba(255,255,255,0.32)' }]} />
            )}
            <LinearGradient
              pointerEvents="none"
              style={fill}
              locations={[0, 0.45, 1]}
              colors={
                dark
                  ? ['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.09)']
                  : tint
                    ? ['rgba(255,255,255,0.45)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.22)']
                    : ['rgba(17,17,17,0.06)', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0.16)']
              }
            />
          </>
        )}
      </View>

      {/* ---- Real Liquid Glass on iOS 26+ ---- */}
      {nativeGlass && (
        <GlassView
          pointerEvents={interactive ? 'auto' : 'none'}
          glassEffectStyle={effect}
          isInteractive={interactive}
          colorScheme="light"
          style={[fill, { borderRadius: r }]}
        />
      )}

      {/* Optional stroke (selected swatch, outlined chips, text inputs) */}
      {borderWidth > 0 && (
        <View
          pointerEvents="none"
          style={[fill, { borderRadius: r, borderWidth, borderColor, borderStyle }]}
        />
      )}

      {children}
    </View>
  );
}
