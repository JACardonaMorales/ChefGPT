import { RecipesService } from '../services/recipes.service';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { GenerateRecipeDto } from '../dto/generate-recipe.dto';
export declare class RecipesController {
    private readonly recipesService;
    constructor(recipesService: RecipesService);
    create(createRecipeDto: CreateRecipeDto, user: any): Promise<import("../entities/recipe.entity").Recipe>;
    generateRecipe(generateRecipeDto: GenerateRecipeDto, user: any): Promise<import("../entities/recipe.entity").Recipe | {
        title: string;
        ingredients: string;
        steps: string;
    }>;
    findAll(user: any): Promise<import("../entities/recipe.entity").Recipe[]>;
    findOne(id: number, user: any): Promise<import("../entities/recipe.entity").Recipe>;
    update(id: number, updateRecipeDto: Partial<CreateRecipeDto>, user: any): Promise<import("../entities/recipe.entity").Recipe>;
    remove(id: number, user: any): Promise<void>;
}
