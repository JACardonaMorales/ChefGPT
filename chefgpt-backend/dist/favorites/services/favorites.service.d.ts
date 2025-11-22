import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
export declare class FavoritesService {
    private favoritesRepository;
    constructor(favoritesRepository: Repository<Favorite>);
    create(userId: number, recipeId: number): Promise<Favorite>;
    findAll(): Promise<Favorite[]>;
    findByUserId(userId: number): Promise<Favorite[]>;
    findOne(id: number, userId?: number): Promise<Favorite>;
    remove(id: number, userId?: number): Promise<void>;
    removeByUserAndRecipe(userId: number, recipeId: number): Promise<void>;
}
