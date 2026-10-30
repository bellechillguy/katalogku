# KatalogKu — Figma → Expo (JavaScript)

Source: Figma file **PAWM**, page **Hi-Fi Dev*** (Welcome, Home, Product Details, Favorites, Profile).

## 1. Install

This directory is a standalone Expo project:

```bash
npm install
```

The design uses **Montserrat** and **Open Sans**. Profile details and favorites are saved locally with AsyncStorage; the app does not yet connect to an account or product-catalog service.

The voice-search configuration is already in `app.json`.

## 2. Product images

The photos are not committed. Download them from Figma (temporary URLs, valid ~7 days):

```bash
node scripts/fetch-figma-assets.js
```

## 3. Run

```bash
npx expo start
```

`expo-speech-recognition` is a native module, so use a development build, not Expo Go.
For native iOS or Android builds, run `npx expo prebuild` followed by
`npx expo run:ios` or `npx expo run:android`. Real Liquid Glass needs iOS 26+
built with the Xcode 26 SDK.

## Routes

| Route | Figma frame |
| --- | --- |
| `app/index.js` | Welcome (1.8 s, then `/home`) |
| `app/(tabs)/home.js` | Screen/Home |
| `app/(tabs)/profile.js` | Screen/Profile |
| `app/favorites.js` | Screen/Favorites |
| `app/product/[id].js` | Screen/ProductDetails |

## How the Liquid Glass is built

`src/components/GlassSurface.js` follows the layer stack of your Figma glass components:

| Figma layer | Code |
| --- | --- |
| Fill + Shadow | `boxShadow` with the exact shadow strings (`glassShadow` in `src/theme/tokens.js`) |
| White Backing | `backing` prop (white layer, 0.94 opacity) |
| Tint | `tint` prop (solid colour under the glass) |
| Glass Effect | `GlassView` (`expo-glass-effect`) on iOS 26+ |

On Android, iOS < 26, or when **Reduce Transparency** is on, the fallback is `BlurView` plus a gradient sheen tuned to the Figma look.

Used by: tab pill and profile circle (`BottomNavigation`), search field and X button (`SearchToolbar`), chips, swatches and the black pill button (`GlassButton`), text inputs (`GlassInput`).

Notes:
- Don't put `opacity` on an ancestor of a glass surface; it flattens the effect. Press feedback uses `scale` for that reason.
- `isInteractive` is only read when `GlassView` mounts.
- The text outline on "KatalogKu" is drawn with eight offset copies (React Native has no text stroke).
- The Welcome blobs are approximated with gradients; the Figma export is a blurred SVG.
- Product records are static prototype data. Seller, stock, delivery, and complete descriptions or ratings are not connected to a catalog service; confirm those values from an authoritative source before production.
