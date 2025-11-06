import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GenerateRecipeDto {
  @IsString()
  @IsNotEmpty()
  ingredients: string;

  @IsString()
  @IsOptional()
  style?: string;
}

