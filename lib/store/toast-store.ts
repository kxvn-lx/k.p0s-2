import { create } from "zustand"

// ----- Types -----
export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastData {
  id: string
  title: string
  message?: string
  type?: ToastType
  duration?: number
}

interface ToastState {
  activeToast: ToastData | null
  show: (data: Omit<ToastData, "id">) => void
  hide: () => void
  success: (title: string, message?: string, duration?: number) => void
  error: (title: string, message?: string, duration?: number) => void
  info: (title: string, message?: string, duration?: number) => void
  warning: (title: string, message?: string, duration?: number) => void
}

// ----- Store -----
export const useToastStore = create<ToastState>((set) => ({
  activeToast: null,
  show: (data) =>
    set({
      activeToast: { ...data, id: Math.random().toString(36).substring(7) },
    }),
  hide: () => set({ activeToast: null }),
  success: (title, message, duration) =>
    set({
      activeToast: {
        id: Math.random().toString(36).substring(7),
        title,
        message,
        type: "success",
        duration,
      },
    }),
  error: (title, message, duration) =>
    set({
      activeToast: {
        id: Math.random().toString(36).substring(7),
        title,
        message,
        type: "error",
        duration,
      },
    }),
  info: (title, message, duration) =>
    set({
      activeToast: {
        id: Math.random().toString(36).substring(7),
        title,
        message,
        type: "info",
        duration,
      },
    }),
  warning: (title, message, duration) =>
    set({
      activeToast: {
        id: Math.random().toString(36).substring(7),
        title,
        message,
        type: "warning",
        duration,
      },
    }),
}))

// ----- Imperative API -----
export const toast = {
  show: (data: Omit<ToastData, "id">) => useToastStore.getState().show(data),
  hide: () => useToastStore.getState().hide(),
  success: (title: string, message?: string, duration?: number) =>
    useToastStore.getState().success(title, message, duration),
  error: (title: string, message?: string, duration?: number) =>
    useToastStore.getState().error(title, message, duration),
  info: (title: string, message?: string, duration?: number) =>
    useToastStore.getState().info(title, message, duration),
  warning: (title: string, message?: string, duration?: number) =>
    useToastStore.getState().warning(title, message, duration),
}
