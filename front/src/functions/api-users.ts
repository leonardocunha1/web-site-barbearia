export function USER_GET() {
  return {
    url: process.env.NEXT_PUBLIC_API_URL + '/users/me',
  };
}

export function USER_REFRESH_TOKEN() {
  return {
    url: process.env.NEXT_PUBLIC_API_URL + '/auth/refresh-token',
  };
}

export function USER_LOGIN() {
  return {
    url: process.env.NEXT_PUBLIC_API_URL + '/auth/login',
  };
}


