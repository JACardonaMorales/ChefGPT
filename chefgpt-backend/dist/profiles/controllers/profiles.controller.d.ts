import { ProfilesService } from '../services/profiles.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    findAll(): Promise<import("../entities/profile.entity").Profile[]>;
    findOne(id: number): Promise<import("../entities/profile.entity").Profile>;
    findByUserId(userId: number): Promise<import("../entities/profile.entity").Profile>;
    update(id: number, updateProfileDto: UpdateProfileDto): Promise<import("../entities/profile.entity").Profile>;
    remove(id: number): Promise<void>;
}
