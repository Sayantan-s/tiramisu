# Fonts

The design system's type scale (`src/theme/theme.ts`) references three Google fonts:

| Role      | Family   | Files to add                                  |
| --------- | -------- | --------------------------------------------- |
| Display   | `Anton`  | `Anton-Regular.ttf`                           |
| Body / UI | `Inter`  | `Inter-Regular.ttf`, `Inter-Medium.ttf`, `Inter-SemiBold.ttf`, `Inter-Bold.ttf` |
| Numeric   | `Geist`  | `Geist-Regular.ttf`, `Geist-Medium.ttf`       |

Until the `.ttf` files are added and linked, text falls back to the system font
(layout is unaffected — only the typeface changes).

## How to add them

1. Download the families from Google Fonts and drop the `.ttf` files into this
   folder. The PostScript name of each file must match the `fontFamily` value in
   `theme.ts` (`Anton`, `Inter`, `Geist`).
2. Link the assets (registers `UIAppFonts` on iOS and copies to Android assets):

   ```sh
   npx react-native-asset
   ```

3. Rebuild the app: `yarn ios` / `yarn android`.

`react-native.config.js` at the repo root already points the asset linker at this
directory.
