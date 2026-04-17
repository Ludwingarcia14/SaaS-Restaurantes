declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      restaurantId: string;
      role: string;
    };
  }
}