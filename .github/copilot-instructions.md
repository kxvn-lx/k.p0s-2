# Expo React Native - Project Override

> Copy to: `<project>/.github/copilot-instructions.md`  
> Also symlink to `./AGENTS.md` for Cursor compatibility

---

## Platform: Expo React Native

Follow strictly all instructions under `.github/instructions/`.

### Tech Stack
- React 19 + Expo + React Native exclusively (per docs).
- NativeWind/Tailwind v4 only for styling; fallback to custom styles only where NativeWind fails.

### UI Components
- UI is from react-native-reusables and NativeWind: https://reactnativereusables.com/docs
- Never update bare components from react-native-reusables or NativeWind. Only extend them in your own components. Place extensions under `/components/shared/`.

### Images
- Always use `expo-image` instead of React Native's Image component.

### Documentation
Always consult the official Expo documentation:
- https://docs.expo.dev/llms-full.txt - Complete Expo documentation
- https://docs.expo.dev/llms-eas.txt - EAS documentation
- https://docs.expo.dev/llms-sdk.txt - SDK documentation
