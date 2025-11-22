import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RecipesService } from '../services/recipes.service';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { GenerateRecipeDto } from '../dto/generate-recipe.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('recipes')
@UseGuards(JwtAuthGuard)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto, @CurrentUser() user: any) {
    return this.recipesService.create({
      ...createRecipeDto,
      userId: user.userId,
    });
  }

  /**
   * 🆕 Genera una receta con IA y opcionalmente la guarda automáticamente
   * Por defecto, autoSave = true (guarda la receta)
   * Para solo generar sin guardar, enviar { autoSave: false }
   */
  @Post('ai')
  async generateRecipe(
    @Body() generateRecipeDto: GenerateRecipeDto,
    @CurrentUser() user: any,
  ) {
    const { autoSave = true } = generateRecipeDto; // Default: true
    
    return this.recipesService.generateRecipe(
      generateRecipeDto,
      user.userId,
      autoSave,
    );
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.recipesService.findByUserId(user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.recipesService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: Partial<CreateRecipeDto>,
    @CurrentUser() user: any,
  ) {
    return this.recipesService.update(id, updateRecipeDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.recipesService.remove(id, user.userId);
  }
}