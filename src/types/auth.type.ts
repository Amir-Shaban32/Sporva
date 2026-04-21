export interface DeviceInfo {
  ip?: string;
  userAgent?: string;
  browser?: string;
  os?: string;
  device?: string;
  [key: string]: unknown;
}

export interface LoginInput {
  username: string;
  password: string;
  deviceInfo: DeviceInfo;
  incomingCookieToken?: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutInput {
  cookieToken?: string;
}

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}
export interface RefreshTokenInput {
  cookieToken?: string;
  deviceInfo: DeviceInfo;
}

export interface JWTPayload {
  userInfo: {
    username: string;
    role: string;
    id: string;
  };
}
