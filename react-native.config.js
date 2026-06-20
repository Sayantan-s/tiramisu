/**
 * React Native CLI config — registers the design system's bundled fonts so
 * `npx react-native-asset` can link them into iOS (Info.plist `UIAppFonts`) and
 * Android (`assets/fonts`). See src/assets/fonts/README.md for the font files.
 */
module.exports = {
  assets: ['./src/assets/fonts'],
};
