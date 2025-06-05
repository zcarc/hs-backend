export interface ValidateUser {
  userId: string;
  email: string;
}

export interface LocalStrategyResponse {
  userId: string;
  email: string;
}

export interface JwtVerifyPayload {
  userId: string;
}

export interface JwtStrategyTokenPayload extends Request {
  userId: string;
  iat: number;
  exp: number;
}

export interface JwtStrategyResponse extends Request {
  user: {
    userId: string;
  };
}

export interface RefreshRequest extends Request {
  cookies: {
    [key: string]: string;
  };
  refreshPayload: {
    userId: string;
    refreshToken: string;
  };
}
