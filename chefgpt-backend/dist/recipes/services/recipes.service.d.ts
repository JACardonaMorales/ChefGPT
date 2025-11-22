import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Recipe } from '../entities/recipe.entity';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { GenerateRecipeDto } from '../dto/generate-recipe.dto';
export declare class RecipesService {
    private recipesRepository;
    private configService;
    private geminiApiKey;
    constructor(recipesRepository: Repository<Recipe>, configService: ConfigService);
    create(createRecipeDto: CreateRecipeDto): Promise<Recipe>;
    findAll(): Promise<Recipe[]>;
    findOne(id: number, userId?: number): Promise<Recipe>;
    findByUserId(userId: number): Promise<Recipe[]>;
    update(id: number, updateRecipeDto: Partial<CreateRecipeDto>, userId?: number): Promise<Recipe>;
    remove(id: number, userId?: number): Promise<void>;
    generateRecipe(generateRecipeDto: GenerateRecipeDto, userId: number, autoSave?: boolean): Promise<Recipe | {
        title: string;
        ingredients: string;
        steps: string;
    }>;
    private generateWithGemini;
    private generateWithGeminiSDK;
    private generateWithGeminiREST;
    private parseRecipeResponse;
}
