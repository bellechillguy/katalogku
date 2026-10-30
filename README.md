# KatalogKu

KatalogKu is an Expo app built with Expo Router. It includes Welcome, Home, Product Details, Favorites, Cart, Profile, and About screens.

<p>
<img width="206" height="458.5" alt="Image" src="https://github.com/user-attachments/assets/9225888e-53d8-4b8e-a2c3-af11c3ff1892" />
<img width="206" height="458.5" alt="Image" src="https://github.com/user-attachments/assets/ab416492-7661-4e8a-97b0-16c983492682" />
<img width="206" height="458.5" alt="Image" src="https://github.com/user-attachments/assets/da9d4881-1df0-472b-b075-c4fc2736e7a1" />
<img width="206" height="458.5" alt="Image" src="https://github.com/user-attachments/assets/f2d3795f-9a44-4bf9-aa60-a929fd3c4074" />
<img width="206" height="458.5" alt="Image" src="https://github.com/user-attachments/assets/f153b3e1-4d0b-44c5-ba9f-bcb93086201d" />
<img width="206" height="458.5" alt="Image" src="https://github.com/user-attachments/assets/8717e3c5-84c9-4e89-bb33-5c22a7ab2137" />
<img width="206" height="458.5" alt="Image" src="https://github.com/user-attachments/assets/1cc1640c-52f7-4d40-8ce7-86c816ae7eac" />
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
| `app/(tabs)/favorites.js` | Screen/Favorites |
| `app/(tabs)/cart.js` | Screen/Cart |
| `app/(tabs)/profile.js` | Screen/Profile |
| `app/product/[id].js` | Screen/ProductDetails |
| `app/about.js` | Screen/About |

Navigation uses Expo Router layouts in `app/_layout.js` and `app/(tabs)/_layout.js` instead of a separate `AppNavigator.js`. The root Stack handles Welcome and pushed screens; the Tabs layout handles Home, Favorites, Cart, and Profile.

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
- The "KatalogKu" wordmark uses a web text shadow and offset text copies on native platforms to reproduce the Figma outline.
- The Welcome screen's background blobs use gradients. The Figma export uses a blurred SVG, so the result is an approximation.
- Product data is static prototype data. Seller details, stock, delivery information, full descriptions, and ratings are not connected to a catalog service. Verify these values with an authoritative source before using them in production.
