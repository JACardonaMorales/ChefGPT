import { User } from '../../users/entities/user.entity';
import { Recipe } from '../../recipes/entities/recipe.entity';
export declare class Favorite {
    id: number;
    userId: number;
    recipeId: number;
    user: User;
    recipe: Recipe;
    createdAt: Date;
}
