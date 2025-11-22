"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const recipe_entity_1 = require("../entities/recipe.entity");
let RecipesService = class RecipesService {
    constructor(recipesRepository, configService) {
        this.recipesRepository = recipesRepository;
        this.configService = configService;
        this.geminiApiKey = null;
        this.geminiApiKey = this.configService.get('GEMINI_API_KEY') || null;
        if (!this.geminiApiKey) {
            console.warn('GEMINI_API_KEY no está configurada. La generación con IA no funcionará.');
        }
    }
    async create(createRecipeDto) {
        const recipe = this.recipesRepository.create(createRecipeDto);
        return this.recipesRepository.save(recipe);
    }
    findAll() {
        return this.recipesRepository.find();
    }
    async findOne(id, userId) {
        const recipe = await this.recipesRepository.findOne({ where: { id } });
        if (!recipe) {
            throw new common_1.NotFoundException(`Recipe with ID ${id} not found`);
        }
        if (userId && recipe.userId !== userId) {
            throw new common_1.NotFoundException(`Recipe with ID ${id} not found`);
        }
        return recipe;
    }
    async findByUserId(userId) {
        return this.recipesRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }
    async update(id, updateRecipeDto, userId) {
        const recipe = await this.findOne(id, userId);
        Object.assign(recipe, updateRecipeDto);
        return this.recipesRepository.save(recipe);
    }
    async remove(id, userId) {
        const recipe = await this.findOne(id, userId);
        await this.recipesRepository.remove(recipe);
    }
    async generateRecipe(generateRecipeDto, userId, autoSave = true) {
        if (!this.geminiApiKey) {
            throw new common_1.ServiceUnavailableException('GEMINI_API_KEY no está configurada. Configura GEMINI_API_KEY en el archivo .env');
        }
        const { ingredients, style } = generateRecipeDto;
        const prompt = `Genera una receta de cocina con los siguientes ingredientes: ${ingredients}. ${style ? `Estilo culinario: ${style}.` : ''}

Por favor, devuelve la respuesta en formato JSON con la siguiente estructura:
{
  "title": "Título de la receta",
  "ingredients": "Lista de ingredientes con cantidades",
  "steps": "Pasos detallados para preparar la receta, numerados y separados por saltos de línea"
}`;
        try {
            const generatedRecipe = await this.generateWithGemini(prompt);
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
            return generatedRecipe;
        }
        catch (error) {
            throw new Error(`Error con Gemini: ${error.message}`);
        }
    }
    async generateWithGemini(prompt) {
        try {
            return await this.generateWithGeminiSDK(prompt);
        }
        catch (sdkError) {
            console.log('SDK de Gemini falló, intentando con API REST directa...', sdkError.message);
            try {
                return await this.generateWithGeminiREST(prompt);
            }
            catch (restError) {
                throw new Error(`Error con Gemini (SDK y REST fallaron): ${restError.message}. Verifica tu API key en: https://aistudio.google.com/app/apikey`);
            }
        }
    }
    async generateWithGeminiSDK(prompt) {
        let GoogleGenerativeAI;
        try {
            GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
        }
        catch (error) {
            throw new Error('Gemini SDK no está instalado. Ejecuta: npm install @google/generative-ai');
        }
        const genAI = new GoogleGenerativeAI(this.geminiApiKey);
        const modelsToTry = [
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-pro',
        ];
        let lastError = null;
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
                }
                else if (cleanText.startsWith('```')) {
                    cleanText = cleanText.replace(/^```\n?/, '').replace(/```\n?$/, '');
                }
                return this.parseRecipeResponse(cleanText);
            }
            catch (error) {
                lastError = error;
                console.log(`Modelo ${modelName} no disponible: ${error.message}`);
                continue;
            }
        }
        throw new Error(`Ningún modelo SDK disponible: ${lastError?.message || 'Desconocido'}`);
    }
    async generateWithGeminiREST(prompt) {
        let availableModels = [];
        try {
            console.log('Listando modelos disponibles...');
            const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.geminiApiKey}`;
            const listResponse = await fetch(listUrl);
            if (listResponse.ok) {
                const listData = await listResponse.json();
                availableModels = listData.models
                    ?.filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
                    ?.map((m) => m.name?.replace('models/', '') || m.name)
                    ?.filter((name) => name && name.includes('gemini')) || [];
                console.log(`Modelos disponibles: ${availableModels.join(', ')}`);
            }
        }
        catch (error) {
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
                    }
                    else if (cleanText.startsWith('```')) {
                        cleanText = cleanText.replace(/^```\n?/, '').replace(/```\n?$/, '');
                    }
                    return this.parseRecipeResponse(cleanText);
                }
                catch (error) {
                    console.log(`Modelo REST ${modelName} (${apiVersion}) falló: ${error.message}`);
                    continue;
                }
            }
        }
        throw new Error('Ningún modelo REST disponible. Verifica tu API key y que tenga acceso a los modelos de Gemini.');
    }
    parseRecipeResponse(content) {
        const recipeData = JSON.parse(content);
        const title = recipeData.title || recipeData.titulo || 'Receta generada';
        let ingredients = '';
        if (Array.isArray(recipeData.ingredients)) {
            ingredients = recipeData.ingredients
                .map((ing) => {
                if (typeof ing === 'string')
                    return ing;
                return `${ing.cantidad || ''} ${ing.nombre || ing.name || ''} ${ing.tipo || ''}`.trim();
            })
                .join('\n');
        }
        else {
            ingredients = recipeData.ingredients || '';
        }
        let steps = '';
        if (Array.isArray(recipeData.steps)) {
            steps = recipeData.steps
                .map((step, index) => `${index + 1}. ${typeof step === 'string' ? step : step.paso || step.step || step}`)
                .join('\n');
        }
        else {
            steps = recipeData.steps || '';
        }
        return {
            title,
            ingredients,
            steps,
        };
    }
};
exports.RecipesService = RecipesService;
exports.RecipesService = RecipesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(recipe_entity_1.Recipe)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], RecipesService);
//# sourceMappingURL=recipes.service.js.map