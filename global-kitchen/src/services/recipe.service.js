const Recipe = require('../models/recipe.model');

/**
 * Recipe Service — Business Logic Layer
 *
 * All database interactions and business rules live here.
 * Controllers stay thin: they only handle req/res and delegate to this layer.
 */

/**
 * Retrieves all recipes, with optional category filter.
 * @param {string|undefined} category - Optional category to filter by
 * @returns {Promise<Recipe[]>}
 */
const getAllRecipes = async (category) => {
  const filter = category ? { category } : {};
  return Recipe.find(filter).sort({ createdAt: -1 });
};

/**
 * Retrieves a single recipe by its MongoDB ObjectId.
 * Returns null if not found — controller handles the 404 response.
 * @param {string} id
 * @returns {Promise<Recipe|null>}
 */
const getRecipeById = async (id) => {
  return Recipe.findById(id);
};

/**
 * Creates a new recipe after schema validation passes.
 * @param {Object} recipeData - Fields matching the Recipe schema
 * @returns {Promise<Recipe>}
 */
const createRecipe = async (recipeData) => {
  // Business rule: cookingTime must be a positive number
  if (!Number.isFinite(recipeData.cookingTime) || recipeData.cookingTime <= 0) {
    const error = new Error('Cooking time must be a positive number');
    error.statusCode = 400;
    throw error;
  }

  const recipe = new Recipe(recipeData);
  return recipe.save();
};

/**
 * Partially updates a recipe (PATCH semantics — only provided fields change).
 * Returns null if the recipe ID doesn't exist.
 * @param {string} id
 * @param {Object} updates - Partial recipe fields to update
 * @returns {Promise<Recipe|null>}
 */
const updateRecipe = async (id, updates) => {
  // Business rule: if cookingTime is being updated, it must still be positive
  if (updates.cookingTime !== undefined) {
    if (!Number.isFinite(updates.cookingTime) || updates.cookingTime <= 0) {
      const error = new Error('Cooking time must be a positive number');
      error.statusCode = 400;
      throw error;
    }
  }

  return Recipe.findByIdAndUpdate(
    id,
    updates,
    {
      new: true,           // Return the updated document, not the old one
      runValidators: true, // Re-run schema validators on updated fields
    }
  );
};

/**
 * Deletes a recipe by ID.
 * Returns null if the recipe ID doesn't exist.
 * @param {string} id
 * @returns {Promise<Recipe|null>}
 */
const deleteRecipe = async (id) => {
  return Recipe.findByIdAndDelete(id);
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
