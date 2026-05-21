const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');

/**
 * Recipe Routes
 *
 * Routes are purely declarative — no business logic lives here.
 * Each route maps an HTTP method + path to a controller method.
 */

// GET /recipes         — Retrieve all recipes (supports ?category= filter)
// POST /recipes        — Create a new recipe
router
  .route('/')
  .get(recipeController.getAllRecipes)
  .post(recipeController.createRecipe);

// GET /recipes/:id     — Retrieve a single recipe
// PATCH /recipes/:id   — Partially update a recipe
// DELETE /recipes/:id  — Remove a recipe
router
  .route('/:id')
  .get(recipeController.getRecipeById)
  .patch(recipeController.updateRecipe)
  .delete(recipeController.deleteRecipe);

module.exports = router;
