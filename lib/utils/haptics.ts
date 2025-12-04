import * as Haptics from 'expo-haptics'

export type HapticType = 'selection' | 'impact' | 'notification'

// ----- Fire-and-forget haptic feedback -----
export function haptic(type: HapticType) {
  switch (type) {
    case 'impact':
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      break
    case 'notification':
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      break
    case 'selection':
    default:
      void Haptics.selectionAsync()
      break
  }
}

export default haptic
