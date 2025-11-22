import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../entities/recipe.entity';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { GenerateRecipeDto } from '../dto/generate-recipe.dto';

@Injectable()
export class RecipesService {
  private geminiApiKey: string | null = null;

  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
    private configService: ConfigService,
  ) {
    this.geminiApiKey = this.configService.get<string>('GEMINI_API_KEY') || null;
    
    if (!this.geminiApiKey) {
      console.warn('GEMINI_API_KEY no está configurada. La generación con IA no funcionará.');
    }
  }

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe = this.recipesRepository.create(createRecipeDto);
    return this.recipesRepository.save(recipe);
  }

  findAll(): Promise<Recipe[]> {
    return this.recipesRepository.find();
  }

  async findOne(id: number, userId?: number): Promise<Recipe> {
    const recipe = await this.recipesRepository.findOne({ where: { id } });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    if (userId && recipe.userId !== userId) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return recipe;
  }

  async findByUserId(userId: number): Promise<Recipe[]> {
    return this.recipesRepository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updateRecipeDto: Partial<CreateRecipeDto>, userId?: number): Promise<Recipe> {
    const recipe = await this.findOne(id, userId);
    Object.assign(recipe, updateRecipeDto);
    return this.recipesRepository.save(recipe);
  }

  async remove(id: number, userId?: number): Promise<void> {
    const recipe = await this.findOne(id, userId);
    await this.recipesRepository.remove(recipe);
  }

  /**
   * 🆕 Genera una receta con IA y la guarda automáticamente
   * @param generateRecipeDto - Datos para generar la receta
   * @param userId - ID del usuario
   * @param autoSave - Si es true, guarda automáticamente la receta (default: true)
   * @returns Receta generada (y opcionalmente guardada)
   */
  async generateRecipe(
    generateRecipeDto: GenerateRecipeDto,
    userId: number,
    autoSave: boolean = true,
  ): Promise<Recipe | { title: string; ingredients: string; steps: string }> {
    if (!this.geminiApiKey) {
      throw new ServiceUnavailableException(
        'GEMINI_API_KEY no está configurada. Configura GEMINI_API_KEY en el archivo .env',
      );
    }

    const { ingredients, style } = generateRecipeDto;

    const prompt = `Genera una receta de cocina con los siguientes ingredientes: ${ingredients}. ${
      style ? `Estilo culinario: ${style}.` : ''
    }

Por favor, devuelve la respuesta en formato JSON con la siguiente estructura:
{
  "title": "Título de la receta",
  "ingredients": "Lista de ingredientes con cantidades",
  "steps": "Pasos detallados para preparar la receta, numerados y separados por saltos de línea"
}`;

    try {
      const generatedRecipe = await this.generateWithGemini(prompt);
      
      // 🆕 Si autoSave está habilitado, guardar la receta en la base de datos
      if (autoSave) {
        const savedRecipe = await this.create({
          title: generatedRecipe.title,
          ingredients: generatedRecipe.ingredients,
          steps: generatedRecipe.steps,
          style: style,
          userId: userId,
        });
        
        console.log(`✅ Receta generada con IA guardada automáticamente (ID: ${savedRecipe.id})`);
        return savedRecipe;
      }
      
      // Si no se auto-guarda, retornar solo los datos generados
      return generatedRecipe;
    } catch (error: any) {
      throw new Error(`Error con Gemini: ${error.message}`);
    }
  }

  private async generateWithGemini(prompt: string): Promise<{ title: string; ingredients: string; steps: string }> {
    try {
      return await this.generateWithGeminiSDK(prompt);
    } catch (sdkError: any) {
      console.log('SDK de Gemini falló, intentando con API REST directa...', sdkError.message);
      try {
        return await this.generateWithGeminiREST(prompt);
      } catch (restError: any) {
        throw new Error(
          `Error con Gemini (SDK y REST fallaron): ${restError.message}. Verifica tu API key en: https://aistudio.google.com/app/apikey`,
        );
      }
    }
  }

  private async generateWithGeminiSDK(prompt: string): Promise<{ title: string; ingredients: string; steps: string }> {
    let GoogleGenerativeAI: any;
    try {
      GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
    } catch (error) {
      throw new Error(
        'Gemini SDK no está instalado. Ejecuta: npm install @google/generative-ai',
      );
    }

    const genAI = new GoogleGenerativeAI(this.geminiApiKey);
    
    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro',
    ];
    
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Intentando con modelo SDK: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const fullPrompt = `Eres un chef experto que genera recetas de cocina. ${prompt}\n\nResponde SOLO con un JSON válido, sin texto adicional antes o después.`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        console.log(`Modelo ${modelName} funcionó correctamente`);

        let cleanText = text.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json\n?/, '').replace(/```\n?$/, '');
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```\n?/, '').replace(/```\n?$/, '');
        }

        return this.parseRecipeResponse(cleanText);
      } catch (error: any) {
        lastError = error;
        console.log(`Modelo ${modelName} no disponible: ${error.message}`);
        continue;
      }
    }

    throw new Error(`Ningún modelo SDK disponible: ${lastError?.message || 'Desconocido'}`);
  }

  private async generateWithGeminiREST(prompt: string): Promise<{ title: string; ingredients: string; steps: string }> {
    let availableModels: string[] = [];
    try {
      console.log('Listando modelos disponibles...');
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.geminiApiKey}`;
      const listResponse = await fetch(listUrl);
      
      if (listResponse.ok) {
        const listData = await listResponse.json();
        availableModels = listData.models
          ?.filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          ?.map((m: any) => m.name?.replace('models/', '') || m.name)
          ?.filter((name: string) => name && name.includes('gemini')) || [];
        console.log(`Modelos disponibles: ${availableModels.join(', ')}`);
      }
    } catch (error) {
      console.log('No se pudo listar modelos, usando lista predeterminada');
    }

    const modelsToTry = availableModels.length > 0 
      ? availableModels 
      : ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'models/gemini-1.5-flash', 'models/gemini-1.5-pro'];
    
    const apiVersions = ['v1beta', 'v1'];
    
    for (const apiVersion of apiVersions) {
      for (const modelName of modelsToTry) {
        try {
          const cleanModelName = modelName.replace('models/', '');
          console.log(`Intentando con API REST ${apiVersion}: ${cleanModelName}`);
          
          const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${cleanModelName}:generateContent?key=${this.geminiApiKey}`;
          
          const fullPrompt = `Eres un chef experto que genera recetas de cocina. ${prompt}\n\nResponde SOLO con un JSON válido, sin texto adicional antes o después.`;

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: fullPrompt,
                    },
                  ],
                },
              ],
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.log(`Modelo REST ${cleanModelName} (${apiVersion}) falló: HTTP ${response.status}`);
            continue;
          }

          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!text) {
            throw new Error('No se recibió texto de la respuesta');
          }

          console.log(`Modelo REST ${cleanModelName} (${apiVersion}) funcionó correctamente`);

          let cleanText = text.trim();
          if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json\n?/, '').replace(/```\n?$/, '');
          } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```\n?/, '').replace(/```\n?$/, '');
          }

          return this.parseRecipeResponse(cleanText);
        } catch (error: any) {
          console.log(`Modelo REST ${modelName} (${apiVersion}) falló: ${error.message}`);
          continue;
        }
      }
    }

    throw new Error('Ningún modelo REST disponible. Verifica tu API key y que tenga acceso a los modelos de Gemini.');
  }

  private parseRecipeResponse(content: string): { title: string; ingredients: string; steps: string } {
    const recipeData = JSON.parse(content);

    const title = recipeData.title || recipeData.titulo || 'Receta generada';

    let ingredients = '';
    if (Array.isArray(recipeData.ingredients)) {
      ingredients = recipeData.ingredients
        .map((ing: any) => {
          if (typeof ing === 'string') return ing;
          return `${ing.cantidad || ''} ${ing.nombre || ing.name || ''} ${ing.tipo || ''}`.trim();
        })
        .join('\n');
    } else {
      ingredients = recipeData.ingredients || '';
    }

    let steps = '';
    if (Array.isArray(recipeData.steps)) {
      steps = recipeData.steps
        .map(
          (step: any, index: number) =>
            `${index + 1}. ${typeof step === 'string' ? step : step.paso || step.step || step}`,
        )
        .join('\n');
    } else {
      steps = recipeData.steps || '';
    }

    return {
      title,
      ingredients,
      steps,
    };
  }
}