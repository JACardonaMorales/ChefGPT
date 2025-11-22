import { User } from '../../users/entities/user.entity';
export declare class Profile {
    id: number;
    bio: string;
    avatar: string;
    userId: number;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
