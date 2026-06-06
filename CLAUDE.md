# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React Native 0.85 app (TypeScript) named `tiramisu`. Entry point is `index.js` → `App.tsx`. Requires Node `>= 22.11.0`.

## Commands

```sh
yarn start              # Metro bundler
yarn ios                # build & run on iOS simulator
yarn android            # build & run on Android emulator
yarn lint               # eslint (@react-native config)
yarn test               # jest (@react-native/jest-preset)
yarn test <pattern>     # single test file or name pattern, e.g. `yarn test App.test`
```

iOS native dependencies are managed via CocoaPods + Bundler. After cloning, after any native dep change, and after editing `ios/Podfile`:

```sh
bundle install          # first time only — installs CocoaPods itself
bundle exec pod install # from repo root (not ios/) — installs pods
```

## Architecture notes

- **New Architecture is enabled** (`RCTNewArchEnabled=true` in `ios/tiramisu/Info.plist`). Native modules must be Fabric/TurboModule-compatible. Do not introduce legacy bridge modules.
- **Nitro Modules** (`react-native-nitro-modules`, `react-native-nitro-image`) are used for high-performance JSI-based native interop. These generate native bindings from TypeScript specs; treat their generated artifacts as build output, not hand-edited code.
- **Camera**: `react-native-vision-camera` v5. Camera + microphone usage strings are already declared in `ios/tiramisu/Info.plist` (`NSCameraUsageDescription`, `NSMicrophoneUsageDescription`). Permission requests go through `useCameraPermission()` before activating a `<Camera>` instance.
- **Safe areas**: `react-native-safe-area-context` is the source of truth — wrap the tree in `SafeAreaProvider` (done in `App.tsx`) and use `SafeAreaView` from this package, not the one from `react-native`.

## Conventions

- Prettier config lives in `.prettierrc.js`; ESLint extends `@react-native`. Run `yarn lint` before committing.
- Tests live under `__tests__/` and use `react-test-renderer`.
