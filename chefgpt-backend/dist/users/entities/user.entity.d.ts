import { Profile } from '../../profiles/entities/profile.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    profile: Profile;
}
