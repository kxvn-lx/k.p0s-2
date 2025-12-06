# AGENTS.md - Expo React Native

> Copy to: `<expo-project>/.github/instructions/AGENTS.instructions.md`

## Project Overview

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Documentation Resources

**Always consult the official Expo documentation:**

| Resource | URL |
|----------|-----|
| Index | https://docs.expo.dev/llms.txt |
| Full Docs | https://docs.expo.dev/llms-full.txt |
| EAS Docs | https://docs.expo.dev/llms-eas.txt |
| SDK Docs | https://docs.expo.dev/llms-sdk.txt |
| React Native | https://reactnative.dev/docs/getting-started |

## Essential Commands

### Development
```bash
npx expo start                  # Start dev server
npx expo start --clear          # Clear cache and start
npx expo install <package>      # Install compatible versions
npx expo install --fix          # Auto-fix invalid versions
```

### Building & Testing
```bash
npx expo doctor                 # Check project health
npx expo lint                   # Run ESLint
```

### Production
```bash
npx eas-cli@latest build --platform ios -s       # Build + Submit iOS
npx eas-cli@latest build --platform android -s   # Build + Submit Android
```

## Recommended Libraries

| Category | Library |
|----------|---------|
| Navigation | `expo-router` |
| Images | `expo-image` |
| Animations | `react-native-reanimated` |
| Gestures | `react-native-gesture-handler` |
| Storage | `@react-native-async-storage/async-storage` |
| KV Store | `expo-sqlite/kv-store` |

## Debugging

- Add `testID` props for automation
- Use React Native DevTools for debugging
- Use MCP tools if available: `automation_take_screenshot`, `automation_tap_by_testid`

## Troubleshooting

If errors in Expo Go:
1. Create a development build: `eas build:dev`
2. Expo Go has limited native modules
3. New development builds needed after adding config plugins
