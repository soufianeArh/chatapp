import { type Transaction } from "sequelize";

export interface RegisterInput{
      email: string;
      password: string;
      displayName: string;
};

export interface LoginInput{
      emailL: string;
      password: string;
};

export interface UserData {
      id: string;
      email: string;
      displayName: string;
      createdAt: string;
};

export interface AuthToken {
      accessToken: string;
      refreshToken: string;
};
export interface createTokenInput {
      userId: string,
      transaction?: Transaction
}
export interface AuthResponse extends AuthToken{
      user: UserData
}

export interface ResfreshTokenResponse {
      id: string;
      userId: string;
      tokenId: string;
      expiresAt: Date;
      createdAt: Date;
      updatedAt: Date
}