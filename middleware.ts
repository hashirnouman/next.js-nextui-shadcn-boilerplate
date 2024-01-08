import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    console.log(req.cookies)
    return NextResponse.next();
    
  },
  {
    callbacks: {
      authorized({ token }) {
        if(!token){
          return false;
        }
        return true; //token?.role === "admin";
      },
    },
  }
);

//export const config = { matcher: () => true };
// export const config = {
//   matcher: ["/admin/:path*", "/user/:path*"],
// };

export const config = { matcher: ["/", "/dashboard", "/users", "/restaurant","/clientpreference"] };
