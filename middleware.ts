import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { authRoutes, protectedRoutes, noRedirectRoutes } from "./routes";

//import { validateToken } from "./services/auth";

const homeRoute = "/";

export async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("token");

  const { pathname } = request.nextUrl;

  const response = NextResponse.next();
  if (tokenCookie?.value) {
    const { success } = {success:true};  //await validateToken(tokenCookie.value);

    if (success) {
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

export const config = { matcher: ["/"] };

