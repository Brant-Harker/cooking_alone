import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ChefHat, Clock, Users } from 'lucide-react';

export default function RecipeApp() {
  const [recipes, setRecipes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    prepTime: '',
    servings: '',
    ingredients: '',
    instructions: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const result = await window.storage.get('recipes');
      if (result && result.value) {
        setRecipes(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No recipes found yet');
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecipes = async (newRecipes) => {
    try {
      await window.storage.set('recipes', JSON.stringify(newRecipes));
    } catch (error) {
      console.error('Failed to save recipes:', error);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.prepTime || !formData.servings || !formData.ingredients || !formData.instructions) {
      alert('Please fill in all fields');
      return;
    }
    
    const newRecipe = {
      id: editingId || Date.now(),
      ...formData,
      ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
      instructions: formData.instructions.split('\n').filter(i => i.trim())
    };

    let updatedRecipes;
    if (editingId) {
      updatedRecipes = recipes.map(r => r.id === editingId ? newRecipe : r);
    } else {
      updatedRecipes = [...recipes, newRecipe];
    }

    setRecipes(updatedRecipes);
    saveRecipes(updatedRecipes);
    resetForm();
  };

  const handleEdit = (recipe) => {
    setFormData({
      name: recipe.name,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients.join('\n'),
      instructions: recipe.instructions.join('\n')
    });
    setEditingId(recipe.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    const updatedRecipes = recipes.filter(r => r.id !== id);
    setRecipes(updatedRecipes);
    saveRecipes(updatedRecipes);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      prepTime: '',
      servings: '',
      ingredients: '',
      instructions: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-orange-600 text-xl">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 pt-4">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-800">My Recipes</h1>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Recipe
            </button>
          )}
        </div>

        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {editingId ? 'Edit Recipe' : 'New Recipe'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Chocolate Chip Cookies"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prep Time
                  </label>
                  <input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({...formData, prepTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 30 mins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Servings
                  </label>
                  <input
                    type="text"
                    value={formData.servings}
                    onChange={(e) => setFormData({...formData, servings: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 4-6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredients (one per line)
                </label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="2 cups flour&#10;1 cup sugar&#10;2 eggs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions (one step per line)
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Preheat oven to 350°F&#10;Mix dry ingredients&#10;Add wet ingredients"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-medium"
                >
                  {editingId ? 'Update Recipe' : 'Save Recipe'}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {recipes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No recipes yet. Add your first recipe to get started!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
                  <h3 className="text-xl font-bold text-white">{recipe.name}</h3>
                  <div className="flex gap-4 mt-2 text-white text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {recipe.prepTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {recipe.servings} servings
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Ingredients:</h4>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      {recipe.ingredients.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Instructions:</h4>
                    <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
                      {recipe.instructions.map((inst, idx) => (
                        <li key={idx}>{inst}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(recipe)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}