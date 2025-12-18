import type  { Config } from 'tailwindcss'

// @ts-ignore
const config: Config = {
    darkMode: ['class', 'dark'],
    content: [
        './src/app/**/*.{ts,tsx}',
        './src/components/**/*.{ts,tsx}',
        './src/app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // Shadcn/ui base colors
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',

                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },

                // Brand Colors (per 23_FRONTEND_STACK.md)
                brand: {
                    primary: '#3B82F6',
                    secondary: '#10B981',
                    accent: '#F59E0B',
                },

                // Sport-specific colors
                sport: {
                    futbol: '#10B981',
                    baloncesto: '#F59E0B',
                    baseball: '#3B82F6',
                    tenis: '#EF4444',
                    hockey: '#8B5CF6',
                },

                // Position colors (for player cards)
                position: {
                    quarterback: '#8B5CF6',
                    running_back: '#10B981',
                    wide_receiver: '#3B82F6',
                    tight_end: '#F59E0B',
                    defense: '#EF4444',
                },

                // Semantic colors
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444',
                info: '#3B82F6',
            },

            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },

            keyframes: {
                // Animation for score updates
                'score-pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.2)', opacity: '0.8' },
                },
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                // Shadcn/ui animations
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },

            animation: {
                'score-pulse': 'score-pulse 0.6s ease-in-out',
                'slide-in-right': 'slide-in-right 0.3s ease-out',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [],
}

export default config