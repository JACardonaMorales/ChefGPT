import { User } from '../../users/entities/user.entity';
export declare class Recipe {
    id: number;
    title: string;
    ingredients: string;
    steps: string;
    style: string;
    userId: number;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
