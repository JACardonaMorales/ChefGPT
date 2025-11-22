import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class GenerateRecipeDto {
  @IsString()
  @IsNotEmpty()
  ingredients: string;

  @IsString()
  @IsOptional()
  style?: string;

  @IsBoolean()
  @IsOptional()
  autoSave?: boolean; // 🆕 Opción para auto-guardar (default: true)
}