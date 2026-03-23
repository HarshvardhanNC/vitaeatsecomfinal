const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Meal = require('./models/Meal');

// Inherit strict environmental configuration logic
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Engine Online for Algorithmic Seeding');
  } catch (error) {
    console.error(`Error resolving database connection: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Await structural cluster connection securely
    await connectDB();
    
    // Explicit array encompassing diverse macro schemas strictly mapping distinct medical tags
    const newMeals = [
      {
        name: "Wild Caught Keto Salmon Bowl",
        price: 349.00,
        calories: 450,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
        stock: 50,
        protein: 42,
        carbs: 12,
        fats: 24,
        dietTags: ["Keto", "High Protein", "Heart-friendly", "Diabetes Safe"],
        ingredients: ["Wild Salmon", "Avocado", "Spinach", "Cauliflower Rice", "Sesame Seeds"],
        oilType: "Olive Oil",
        sugarLevel: "zero"
      },
      {
        name: "Vegan Quinoa Power Salad",
        price: 249.00,
        calories: 320,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
        stock: 100,
        protein: 15,
        carbs: 45,
        fats: 10,
        dietTags: ["Vegan", "Gluten-Free", "Heart-friendly", "Low Sodium"],
        ingredients: ["Organic Quinoa", "Kale", "Cherry Tomatoes", "Chickpeas", "Lemon Vinaigrette"],
        oilType: "Olive Oil",
        sugarLevel: "zero"
      },
      {
        name: "Lean Chicken Sweet Potato Mash",
        price: 289.00,
        calories: 380,
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
        stock: 75,
        protein: 38,
        carbs: 35,
        fats: 8,
        dietTags: ["High Protein", "Gluten-Free", "Low Sodium"],
        ingredients: ["Grilled Chicken Breast", "Sweet Potato", "Broccoli", "Garlic"],
        oilType: "Olive Oil",
        sugarLevel: "low"
      },
      {
        name: "Low-Sodium Mediterranean Tofu",
        price: 229.00,
        calories: 290,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        stock: 45,
        protein: 22,
        carbs: 18,
        fats: 16,
        dietTags: ["Vegan", "Heart-friendly", "Low Sodium", "Diabetes Safe"],
        ingredients: ["Firm Tofu", "Kalamata Olives", "Cucumber", "Red Onion", "Oregano"],
        oilType: "Olive Oil",
        sugarLevel: "zero"
      },
      {
        name: "Grass-Fed Sirloin & Asparagus",
        price: 499.00,
        calories: 520,
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e",
        stock: 30,
        protein: 55,
        carbs: 10,
        fats: 28,
        dietTags: ["Keto", "High Protein", "Gluten-Free"],
        ingredients: ["Grass-fed Sirloin", "Grilled Asparagus", "Grass-fed Butter", "Black Pepper"],
        oilType: "Butter",
        sugarLevel: "zero"
      },
      {
        name: "Diabetic-Friendly Turkey Chili",
        price: 279.00,
        calories: 340,
        image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6",
        stock: 60,
        protein: 32,
        carbs: 25,
        fats: 12,
        dietTags: ["Diabetes Safe", "High Protein", "Low Sodium", "Heart-friendly"],
        ingredients: ["Lean Ground Turkey", "Kidney Beans", "Diced Tomatoes", "Cumin", "Onions"],
        oilType: "Standard",
        sugarLevel: "low"
      }
    ];

    // Bulk Insertion Operator naturally pushing the JSON into Atlas
    await Meal.insertMany(newMeals);
    console.log('Ultra-Premium Health Commodities algorithmically deployed natively into MongoDB cluster!');
    
    // Conclude process implicitly
    process.exit();

  } catch (error) {
    console.error(`Runtime scripting fault isolated: ${error.message}`);
    process.exit(1);
  }
};

// Terminally execute the seeding paradigm
seedData();
