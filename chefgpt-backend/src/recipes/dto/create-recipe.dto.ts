import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  ingredients: string;

  @IsString()
  @IsNotEmpty()
  steps: string;

  @IsString()
  @IsOptional()
  style?: string;

  userId?: number; // Se asigna automáticamente desde el token
}

