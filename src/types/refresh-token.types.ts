import {
  JsonValue,
  InputJsonValue,
} from "../../generated/prisma/runtime/client";

export interface IRefreshToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
  last_used: Date;
  device_info: JsonValue;
  is_revoked?: boolean;
}

export interface ICreateRefreshToken {
  user_id: string;
  token: string;
  expires_at: Date;
  last_used: Date;
  device_info: InputJsonValue;
  is_revoked?: boolean;
}

export interface IUserId {
  user_id: string;
}
