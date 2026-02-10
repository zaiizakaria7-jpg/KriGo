import React from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { UserAuthProvider } from '@/lib/user-auth-context';
import { LayoutShell } from '@/components/layout-shell';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

// Note: Google Fonts are loaded via index.html or CSS imports in React
// The Next.js font optimization is replaced with standard font loading

export default function MainLayout({ children }) {
    return (
        <div className="font-sans antialiased">
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <AuthProvider>
                    <UserAuthProvider>
                        <LayoutShell>{children}</LayoutShell>
                        <Toaster richColors position="top-right" />
                    </UserAuthProvider>
                </AuthProvider>
            </ThemeProvider>
        </div>
    );
}
