export interface RegisterInput{
      email: string;
      password: string;
      displayName: String;
};

export interface LoginInput{
      emailL: string;
      password: string;
};

export interface UserData {
      id: string;
      email: string;
      displayName: String;
      createdAt: Date
};

export interface AuthToken {
      accessToken: string;
      refreshToken: string;
};

export interface AuthResponse extends AuthToken{
      user: UserData
}