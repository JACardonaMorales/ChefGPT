import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';
export declare class ProfilesService {
    private profilesRepository;
    constructor(profilesRepository: Repository<Profile>);
    findAll(): Promise<Profile[]>;
    findOne(id: number): Promise<Profile>;
    findByUserId(userId: number): Promise<Profile>;
    update(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile>;
    remove(id: number): Promise<void>;
}
