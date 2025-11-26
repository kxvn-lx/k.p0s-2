import * as Haptics from 'expo-haptics'

export type HapticType = 'selection' | 'impact' | 'notification'

export async function haptic(type: HapticType) {
  try {
    switch (type) {
      case 'impact':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        break
      case 'notification':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        break
      case 'selection':
      default:
        await Haptics.selectionAsync()
        break
    }
  } catch {
    // best-effort — don't crash if haptics unavailable
  }
}

export default haptic
