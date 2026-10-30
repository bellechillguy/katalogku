# KatalogKu

KatalogKu is an Expo app built. The implementation covers five screens: Welcome, Home, Product Details, Favorites, and Profile.

<p>
  <img width="206" height="458.5" alt="Welcome screen" src="https://github.com/user-attachments/assets/faa461d1-ce5f-46f4-b104-4e97eee99e40" />
  <img width="206" height="458.5" alt="Home screen" src="https://github.com/user-attachments/assets/d74d4055-3108-41b3-9e79-d1e38c55d1d0" />
  <img width="206" height="458.5" alt="Product details screen" src="https://github.com/user-attachments/assets/6d2ede34-e8f6-46bd-952b-328b98f05a2d" /> <br>
  <img width="206" height="458.5" alt="Favorites screen" src="https://github.com/user-attachments/assets/1d3d160e-1499-4458-8375-1744372cb20e" />
  <img width="206" height="458.5" alt="Profile screen" src="https://github.com/user-attachments/assets/2cc87dd9-74d0-4807-8411-00de3f95fed8" />
</p>

## Installation

This folder contains a standalone Expo project. Install its dependencies with:

```bash
npm install
```

The app uses Montserrat and Open Sans. Profile details and favorites are stored on the device with AsyncStorage. There is currently no account system or connection to a product catalog.

Voice search is configured in `app.json`.

## Product images

Product images are stored as WebP files under `assets/images/<product-id>/`. Each cardigan color swatch loads the image for its matching color.

To download the original images exported from Figma, run:

```bash
node scripts/fetch-figma-assets.js
```

The temporary source URLs are valid for approximately seven days, so download the assets before they expire.

## Run the app

Start the Expo development server with:

```bash
npx expo start
```

`expo-speech-recognition` uses native code, so the app must run in a development build. It will not work in Expo Go.

To create and run a native project, use:

```bash
npx expo prebuild
npx expo run:ios
# or
npx expo run:android
```

The native Liquid Glass effect requires iOS 26 or later and a build made with the Xcode 26 SDK.

## Routes

| File | Figma frame |
| --- | --- |
| `app/index.js` | Welcome (redirects to `/home` after 1.8 seconds) |
| `app/(tabs)/home.js` | Screen/Home |
| `app/(tabs)/profile.js` | Screen/Profile |
| `app/favorites.js` | Screen/Favorites |
| `app/product/[id].js` | Screen/ProductDetails |

## Liquid Glass implementation

`src/components/GlassSurface.js` recreates the layer structure used by the glass components in Figma.

| Figma layer | Implementation |
| --- | --- |
| Fill and Shadow | `boxShadow`, using the shadow values in `glassShadow` from `src/theme/tokens.js` |
| White Backing | The `backing` prop adds a white layer with 0.94 opacity |
| Tint | The `tint` prop sets the color beneath the glass |
| Glass Effect | `GlassView` from `expo-glass-effect` on iOS 26 and later |

On Android, earlier iOS versions, and devices with Reduce Transparency enabled, the component falls back to `BlurView` with a gradient sheen based on the Figma design.

The glass components are used in these parts of the app:

- `BottomNavigation`: the tab pill and profile circle
- `SearchToolbar`: the search field and clear button
- `GlassButton`: chips, color swatches, and the black pill button
- `GlassInput`: text inputs

A few implementation details are worth keeping in mind:

- Avoid setting `opacity` on a parent of a glass surface. It flattens the glass effect. The press state uses `scale` instead.
- `isInteractive` is read when `GlassView` mounts. Changing it afterward will not update the mounted view.
- The outline on the "KatalogKu" text is made from eight offset copies because React Native does not support text stroke.
- The Welcome screen's background blobs use gradients. The Figma export uses a blurred SVG, so the result is an approximation.
- Product data is static prototype data. Seller details, stock, delivery information, full descriptions, and ratings are not connected to a catalog service. Verify these values with an authoritative source before using them in production.
