// Design tokens pulled from the Figma file "PAWM" (page "Hi-Fi Dev*").

export const colors = {
  white: '#f9fafb', // --white
  black: '#111111', // --black
  green: '#87c879', // --green (header gradient start)
  blue: '#85b4eb', // --blue (accent / selected state)
  blueText: '#316FA7', // accessible blue for text and thin control outlines
  red: '#f45841', // --red (price)
  redText: '#B52E1D', // accessible red for small error text
  starFilled: '#111111', // rendered stars are black; Figma also defines Star-Dark #DFB300
  starEmpty: '#d1d1d6',
  labelSecondary: 'rgba(60,60,67,0.6)',
  labelControlsPrimary: '#1a1a1a', // Labels - Vibrant - Controls/Primary
  labelControlsTertiary: '#6e6e73', // readable secondary text and placeholders
  fillVibrantTertiary: '#ededed', // Fills - Vibrant/Tertiary (tab selection)
  priceMuted: '#6e6e73',
  cardMediaTint: '#f9fafb', // neutral backdrop keeps white-background product photos seamless
};

export const fonts = {
  montserrat: 'Montserrat_400Regular',
  montserratMedium: 'Montserrat_500Medium',
  montserratSemiBold: 'Montserrat_600SemiBold',
  montserratBold: 'Montserrat_700Bold',
  montserratBoldItalic: 'Montserrat_700Bold_Italic',
  openSans: 'OpenSans_400Regular',
  openSansSemiBold: 'OpenSans_600SemiBold',
};

// The exact multi-layer shadows from the "Fill + Shadow" layers of the Liquid Glass
// components. React Native >= 0.76 supports `boxShadow` (spread + multiple shadows).
export const glassShadow = {
  // Tab bar, profile tab, search field, text inputs
  surface:
    '1.25px 0px 0px -0.75px #d0d0d0, -1.25px 0px 0px -0.75px #d0d0d0, 0px 0px 0px 0.5px #e8e8e8, 0px 8px 15px 0px rgba(0,0,0,0.02)',
  // Chips, swatches
  button:
    '1.25px 0px 0px 0px #e6e6e6, -1.25px 0px 0px 0px #e6e6e6, 0px 8px 15px 0px rgba(0,0,0,0.02)',
  // Add to Favorite / Save Profile
  primary:
    '1.525px 0px 0px 0px #e6e6e6, -1.525px 0px 0px 0px #e6e6e6, 0px 9.76px 18.299px 0px rgba(0,0,0,0.02)',
};

export const layout = {
  screenPadding: 35,
  headerHeight: 132,
  gridPadding: 33,
  cardSize: 164,
  cardHeaderHeight: 68,
  cardRadius: 11.524,
  navBottomOffset: 10, // added to the bottom safe-area inset (Figma: 44px from the bottom edge)
};

// Language used by expo-speech-recognition for the search mic.
export const SPEECH_LANG = 'en-US';
