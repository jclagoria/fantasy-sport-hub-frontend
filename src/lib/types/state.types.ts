// Authentication state types
export interface User {
    id: string
    username: string
    email: string
    avatar?: string
    roles: string[]
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean

    // Actions
    setUser: (user: User | null) => void
    logout: () => void
    setLoading: (loading: boolean) => void
}

// UI state types
export interface UIState {
    //Theme
    theme: 'light' | 'dark' | 'system'
    setTheme: (theme: 'light' | 'dark' | 'system') => void

    // Sidebar
    sidebarOpen: boolean
    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void

    // Modals
    activeModal: string | null
    openModal: (modalName: string) => void
    closeModal: () => void

    // Notifications
    notifications: Notification[]
    addNotification: (notification: Omit<Notification, 'id'>) => void
    removeNotification: (id: string) => void
    clearNotifications: () => void
}

export interface Notification {
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    message: string
    duration?: number // in milliseconds
}