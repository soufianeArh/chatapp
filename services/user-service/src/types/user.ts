export interface userData{
      id: string;
      email: string;
      displayName: string;
      createdAt: Date;
      updatedAt: Date;
};

export interface createUserInput{
      email: string;
      displayName: string;
};