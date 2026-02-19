import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

type Role = "ADMIN" | "PROFESSIONAL" | "CLIENT";

type RoleRule = {
  prefix: string;
  roles: Role[];
  unauthRedirect: string;
  forbiddenRedirect: string;
};

const ROLE_RULES: RoleRule[] = [
  {
    prefix: "/painel/admin",
    roles: ["ADMIN"],
    unauthRedirect: "/login",
    forbiddenRedirect: "/unauthorized",
  },
  {
    prefix: "/painel/professional",
    roles: ["PROFESSIONAL"],
    unauthRedirect: "/login",
    forbiddenRedirect: "/unauthorized",
  },
  {
    prefix: "/cliente",
    roles: ["CLIENT"],
    unauthRedirect: "/login",
    forbiddenRedirect: "/unauthorized",
  },
];

async function getRoleFromToken(token?: string): Promise<Role | null> {
  if (!token) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ["HS256"] },
    );
    const role = payload.role as Role | undefined;
    return role ?? null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const url = request.nextUrl.clone();

  const rule = ROLE_RULES.find(({ prefix }) =>
    url.pathname.startsWith(prefix),
  );

  if (!rule) {
    return NextResponse.next();
  }

  if (!token && !refreshToken) {
    url.pathname = rule.unauthRedirect;
    return NextResponse.redirect(url);
  }

  const role = (await getRoleFromToken(token)) ??
    (await getRoleFromToken(refreshToken));

  if (!role) {
    url.pathname = rule.unauthRedirect;
    return NextResponse.redirect(url);
  }

  if (!rule.roles.includes(role)) {
    url.pathname = rule.forbiddenRedirect;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cliente/:path*", "/painel/:path*"],
};

