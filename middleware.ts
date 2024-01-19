import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { authRoutes, protectedRoutes, noRedirectRoutes } from './routes';
import Jwt from 'jsonwebtoken';

//import { validateToken } from "./services/auth";

const homeRoute = '/';

export async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('token');

  const { pathname } = request.nextUrl;
  const pathSegments = pathname.split('/');
  const lastPathSegment = pathSegments[pathSegments.length - 1];
  const response = NextResponse.next();
  if (tokenCookie?.value) {
    const { success } = { success: true }; //await validateToken(tokenCookie.value);

    if (success) {
      const json = Jwt.decode(tokenCookie.value) as { permission: string[] };
      const permissions = json['permission'];
      const isAllowed = permissions?.some((permission) => {
        const permissionSegments = permission.split('.');
        const permissionName = permissionSegments[1];
        const permissionType = permissionSegments[2];
        return (
          (lastPathSegment.toLowerCase() === permissionName.toLowerCase() &&
            permissionType.toLocaleLowerCase() === 'view') ||
          lastPathSegment === ''
        );
      });
      // if (!isAllowed) {
      //   return NextResponse.redirect(new URL('/notallowed', request.url));
      // }
      // User is logged in - by primaryToken

      // Accessing authRoutes when the user is logged in
      let isAuthRoute = false;

      for (let i = 0; i < authRoutes.length; i++) {
        if (pathname.startsWith(authRoutes[i])) {
          isAuthRoute = true;
          break;
        }
      }

      if (isAuthRoute) {
        return NextResponse.redirect(new URL(homeRoute, request.url));
      }

      return response;
    }
  }

  // Delete user session (if present)

  //response.cookies.delete("aliasToken");
  //response.cookies.delete("token");
  //response.cookies.delete("username");
  //response.cookies.delete("guid");
  //response.cookies.delete("onboarding");
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: [
    '/((?!login|logout|notallowed|_next/static|_next/image|favicon.ico).*)',
    '/',
  ],
};
