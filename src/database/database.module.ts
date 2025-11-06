import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { Favorite } from '../favorites/entities/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_URL?.replace('sqlite:', '') || process.env.DATABASE_PATH || './chefgpt.db',
      entities: [User, Profile, Recipe, Favorite],
      synchronize: true,
      logging: false,
    }),
  ],
})
export class DatabaseModule {}

