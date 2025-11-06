import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { CreateRecipeDto } from '@/services/recipes';
import { Save, Loader2 } from 'lucide-react';

interface RecipeFormProps {
  onSubmit: (data: CreateRecipeDto) => void;
  initialData?: Partial<CreateRecipeDto>;
  isLoading?: boolean;
}

export default function RecipeForm({ onSubmit, initialData, isLoading }: RecipeFormProps) {
  const [formData, setFormData] = useState<CreateRecipeDto>({
    title: initialData?.title || '',
    ingredients: initialData?.ingredients || '',
    steps: initialData?.steps || '',
    style: initialData?.style || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="card"
    >
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Título de la Receta
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input-field"
          required
          placeholder="Ej: Pollo al estilo italiano"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="style" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Estilo Culinario (opcional)
        </label>
        <input
          type="text"
          id="style"
          value={formData.style}
          onChange={(e) => setFormData({ ...formData, style: e.target.value })}
          className="input-field"
          placeholder="Ej: Italiano, Mexicano, Asiático..."
        />
      </div>

      <div className="mb-6">
        <label htmlFor="ingredients" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Ingredientes
        </label>
        <textarea
          id="ingredients"
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          className="input-field"
          rows={8}
          required
          placeholder={
            `FORMATO EXACTO (uno por línea):\n` +
            `- 200 g de pasta\n` +
            `- 200 g de pollo\n` +
            `- 2 tomates maduros\n` +
            `- 2 dientes de ajo\n` +
            `- Aceite de oliva, sal y pimienta`
          }
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Usa una línea por ingrediente, con cantidades claras. Ejemplo arriba.
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="steps" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Pasos de Preparación
        </label>
        <textarea
          id="steps"
          value={formData.steps}
          onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
          className="input-field"
          rows={10}
          required
          placeholder={
            `FORMATO EXACTO (uno por línea):\n` +
            `1) Cocina la pasta según el paquete.\n` +
            `2) Saltea el pollo con ajo en aceite de oliva.\n` +
            `3) Agrega tomates picados y cocina 5 minutos.\n` +
            `4) Mezcla con la pasta, ajusta sal y pimienta.\n` +
            `5) Sirve caliente.`
          }
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Escribe cada paso en una nueva línea, numerado si prefieres.
        </p>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Guardar Receta</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
