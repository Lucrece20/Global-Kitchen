const recipeService = require('../services/recipe.service');

/**
 * Recipe Controller — Request/Response Layer
 *
 * Controllers are intentionally thin. Each method:
 *  1. Extracts data from req
 *  2. Calls the appropriate service method
 *  3. Sends a response — every path ends with res.json() (no hanging clients)
 *
 * Errors are forwarded to the global error handler via next(error).
 */

/**
 * GET /recipes
 * Retrieves all recipes. Supports ?category= query param for filtering.
 */
const getAllRecipes = async (req, res, next) => {
  try {
    const { category } = req.query;
    const recipes = await recipeService.getAllRecipes(category);
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /recipes/:id
 * Retrieves a single recipe by ID.
 */
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await recipeService.getRecipeById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /recipes
 * Creates a new recipe from the request body.
 */
const createRecipe = async (req, res, next) => {
  try {
    const newRecipe = await recipeService.createRecipe(req.body);
    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: newRecipe,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /recipes/:id
 * Partially updates a recipe — only fields present in the body are changed.
 */
const updateRecipe = async (req, res, next) => {
  try {
    const updatedRecipe = await recipeService.updateRecipe(req.params.id, req.body);

    if (!updatedRecipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      data: updatedRecipe,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /recipes/:id
 * Removes a recipe from the collection.
 */
const deleteRecipe = async (req, res, next) => {
  try {
    const deletedRecipe = await recipeService.deleteRecipe(req.params.id);

    if (!deletedRecipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully',
      data: deletedRecipe,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
