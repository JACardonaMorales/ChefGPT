import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto, @CurrentUser() user: any) {
    return this.favoritesService.create(
      user.userId,
      createFavoriteDto.recipeId,
    );
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.favoritesService.findByUserId(user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.favoritesService.findOne(id, user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.favoritesService.remove(id, user.userId);
  }

  @Delete('recipe/:recipeId')
  removeByRecipe(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @CurrentUser() user: any,
  ) {
    return this.favoritesService.removeByUserAndRecipe(user.userId, recipeId);
  }
}

