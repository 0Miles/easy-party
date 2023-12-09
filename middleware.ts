import acceptLanguage from 'accept-language'
import { locales, defaultLocale } from '@/locales/locale'

acceptLanguage.languages(locales)

export function middleware(request: any) {
    // Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) return

    // Redirect if there is no locale
    const locale = acceptLanguage.get(request.headers.get('Accept-Language')) ?? defaultLocale
    request.nextUrl.pathname = `/${locale}${pathname}`
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return Response.redirect(request.nextUrl)
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next|favicon|images).*)',
        // Optional: only run on root (/) URL
        // '/'
    ],
}