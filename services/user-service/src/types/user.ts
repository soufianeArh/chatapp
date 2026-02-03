export interface User{
      id: string;
      email: string;
      displayName: string;
      createdAt: string;
      updatedAt: string;
};

export interface createUserInput{
      email: string;
      displayName: string;
};