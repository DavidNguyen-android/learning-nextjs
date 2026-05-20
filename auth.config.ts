import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    providers: [],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isApiRoute = nextUrl.pathname.startsWith('/api') || nextUrl.pathname.startsWith('/seed');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn && !isApiRoute){
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        }
    }
} satisfies NextAuthConfig;