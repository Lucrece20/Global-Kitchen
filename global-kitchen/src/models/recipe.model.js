const mongoose = require('mongoose');

/**
 * Recipe Schema
 *
 * Schema-level validation enforces data hygiene before any document
 * is committed to MongoDB — no duplicated validation logic in services.
 *
 * BSON Types used:
 *  - cookingTime: explicit Number (not string) for numeric comparisons
 *  - createdAt / updatedAt: real Date types via timestamps option
 *  - ingredients: Array of trimmed strings
 */
const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one ingredient is required',
      },
    },

    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
      trim: true,
      minlength: [10, 'Instructions must be at least 10 characters'],
    },

    cookingTime: {
      type: Number, // Explicit BSON Number — enables $gt/$lt queries and arithmetic
      required: [true, 'Cooking time is required'],
      min: [1, 'Cooking time must be at least 1 minute'],
    },

    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: 'Difficulty must be Easy, Medium, or Hard',
      },
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: [
          'Breakfast',
          'Lunch',
          'Dinner',
          'Dessert',
          'Snack',
          'Soup',
          'Salad',
          'Beverage',
          'Other',
        ],
        message: 'Invalid category',
      },
    },
  },
  {
    // Automatically adds createdAt and updatedAt as real BSON Date types
    timestamps: true,
    // Remove Mongoose __v version key from API responses
    versionKey: false,
  }
);

/**
 * Indexes
 * category is expected to handle heavy lookup rates (GET /recipes?category=...)
 * title gets a text index for potential search features
 */
recipeSchema.index({ category: 1 });
recipeSchema.index({ title: 'text' });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
