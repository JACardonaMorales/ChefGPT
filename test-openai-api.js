/**
 * Script de prueba para verificar que la API key de OpenAI funciona correctamente
 * 
 * Uso: node test-openai-api.js
 */

require('dotenv').config();
const { OpenAI } = require('openai');

async function test() {
  try {
    console.log('🔍 Probando conexión con OpenAI...\n');

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ ERROR: OPENAI_API_KEY no está configurada en el archivo .env');
      process.exit(1);
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un chef experto que crea recetas deliciosas y sencillas.',
        },
        {
          role: 'user',
          content: 'Tengo arroz, pollo y zanahoria. Hazme una receta fácil y rápida. Devuelve la respuesta en formato JSON con título, ingredientes y pasos.',
        },
      ],
      response_format: { type: 'json_object' },
    });

    console.log('✅ Conexión exitosa. Respuesta recibida:\n');
    const content = response.choices[0].message.content;
    console.log(JSON.stringify(JSON.parse(content), null, 2));
    
    // Procesar y mostrar la receta formateada
    const recipe = JSON.parse(content);
    console.log('\n📋 Receta formateada:');
    console.log('─'.repeat(50));
    console.log(`Título: ${recipe.title || recipe.titulo || 'N/A'}`);
    
    if (recipe.ingredients) {
      console.log('\nIngredientes:');
      if (Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach((ing, i) => {
          if (typeof ing === 'string') {
            console.log(`  ${i + 1}. ${ing}`);
          } else {
            console.log(`  ${i + 1}. ${ing.cantidad || ''} ${ing.nombre || ing.name || ''}`.trim());
          }
        });
      } else {
        console.log(`  ${recipe.ingredients}`);
      }
    }
    
    if (recipe.steps) {
      console.log('\nPasos:');
      if (Array.isArray(recipe.steps)) {
        recipe.steps.forEach((step, i) => {
          console.log(`  ${i + 1}. ${typeof step === 'string' ? step : step.paso || step.step || step}`);
        });
      } else {
        console.log(`  ${recipe.steps}`);
      }
    }
    console.log('─'.repeat(50));
    console.log('\n✅ ¡Prueba completada exitosamente!');
    
  } catch (err) {
    console.error('❌ Error al probar la API:', err.message);
    if (err.response) {
      console.error('Detalles:', err.response.data);
    }
    process.exit(1);
  }
}

test();
