import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async create(userId: number, recipeId: number): Promise<Favorite> {
    // Verificar si ya existe
    const existing = await this.favoritesRepository.findOne({
      where: { userId, recipeId },
    });

    if (existing) {
      throw new ConflictException('Recipe already in favorites');
    }

    const favorite = this.favoritesRepository.create({ userId, recipeId });
    return this.favoritesRepository.save(favorite);
  }

  findAll(): Promise<Favorite[]> {
    return this.favoritesRepository.find({
      relations: ['user', 'recipe'],
    });
  }

  async findByUserId(userId: number): Promise<Favorite[]> {
    return this.favoritesRepository.find({
      where: { userId },
      relations: ['user', 'recipe'],
    });
  }

  async findOne(id: number, userId?: number): Promise<Favorite> {
    const favorite = await this.favoritesRepository.findOne({
      where: { id },
      relations: ['user', 'recipe'],
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }

    // Si se proporciona userId, verificar que el favorito pertenezca al usuario
    if (userId && favorite.userId !== userId) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }

    return favorite;
  }

  async remove(id: number, userId?: number): Promise<void> {
    const favorite = await this.findOne(id, userId);
    await this.favoritesRepository.remove(favorite);
  }

  async removeByUserAndRecipe(userId: number, recipeId: number): Promise<void> {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, recipeId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoritesRepository.remove(favorite);
  }
}

