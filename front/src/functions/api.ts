export const API_URL = 'http://localhost:3333';


export function USER_GET() {
  return {
    url: API_URL + '/users/me',
  };
}

export function USER_REFRESH_TOKEN() {
  return {
    url: API_URL + '/auth/refresh-token',
  };
}

export function USER_LOGIN() {
  return {
    url: API_URL + '/auth/login',
  };
}
