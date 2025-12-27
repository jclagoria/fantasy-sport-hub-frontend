import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Notification, UIState } from '@/lib/types/state.types'

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Theme state
      theme: 'dark',
      setTheme: (theme) => set({ theme }, false, 'ui/setTheme'),

      // Sidebar state
      sidebarOpen: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'ui/toggleSidebar'),
      setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'ui/setSidebarOpen'),

      // Modal State
      activeModal: null,
      openModal: (modalId) => set({ activeModal: modalId }, false, 'ui/openModal'),
      closeModal: () => set({ activeModal: null }, false, 'ui/closeModal'),

      // Notifications state
      notifications: [],
      addNotification: (notification) =>
        set(
          (state) => ({
            notifications: [...state.notifications, { ...notification, id: crypto.randomUUID() }],
          }),
          false,
          'ui/addNotification'
        ),
      removeNotification: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          'ui/removeNotification'
        ),
      clearNotifications: () => set({ notifications: [] }, false, 'ui/clearNotifications'),
    }),
    {
      name: 'UIStore', // DevTools name
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)
