export async function middleware(request) {
  const token = await getToken({ req: request });
  console.log("Token in middleware:", token); // Debugging line
  const url = request.nextUrl;

  const isAuthPage = url.pathname.startsWith("/sign-in") || 
                     url.pathname.startsWith("/sign-up") || 
                     url.pathname.startsWith("/verify");

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
