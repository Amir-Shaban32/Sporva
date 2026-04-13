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
