// Ejemplo de uso de OpenAI API
// Este archivo es solo para referencia. NO subas tu API key a git.

// Para usar este ejemplo:
// 1. Instala: npm install openai
// 2. Crea un archivo .env con: OPENAI_API_KEY=tu_clave_aqui
// 3. Ejecuta: node examples/openai-example.js

// IMPORTANTE: Usa variables de entorno para la API key, nunca la hardcodees

import OpenAI from "openai";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ejemplo 1: Generar una receta
async function generateRecipe() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un chef experto que genera recetas de cocina. Siempre responde en formato JSON válido.",
        },
        {
          role: "user",
          content: "Dame una receta con estos ingredientes: pollo, arroz, tomate. Estilo latino. Devuelve JSON con título, ingredientes y pasos.",
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    const recipe = JSON.parse(content);
    console.log("Receta generada:", recipe);
    return recipe;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Ejemplo 2: Generar un haiku (corrigiendo el ejemplo original)
async function generateHaiku() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "write a haiku about ai",
        },
      ],
      temperature: 0.7,
    });

    const haiku = response.choices[0].message.content;
    console.log("Haiku generado:", haiku);
    return haiku;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Ejecutar ejemplos
console.log("=== Ejemplo 1: Generar Receta ===");
generateRecipe();

console.log("\n=== Ejemplo 2: Generar Haiku ===");
generateHaiku();

