import { FavoritesService } from '../services/favorites.service';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    create(createFavoriteDto: CreateFavoriteDto, user: any): Promise<import("../entities/favorite.entity").Favorite>;
    findAll(user: any): Promise<import("../entities/favorite.entity").Favorite[]>;
    findOne(id: number, user: any): Promise<import("../entities/favorite.entity").Favorite>;
    remove(id: number, user: any): Promise<void>;
    removeByRecipe(recipeId: number, user: any): Promise<void>;
}
