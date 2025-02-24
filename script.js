const API_KEY = "6b81efa0862e4f1e933fbda856d18b24";

// Search Button Event Listener
document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim();
    if (query) {
        fetchRecipes(query);
    } else {
        alert("Please enter a recipe name!");
    }
});

// Load default recipes on page load
document.addEventListener("DOMContentLoaded", () => fetchRecipes());

// Fetch Recipes (handles both random & search)
async function fetchRecipes(query = "") {
    const url = query
        ? `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${API_KEY}&number=6&addRecipeInformation=true`
        : `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=6`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Check if data exists
        if (!data || (!data.results && !data.recipes)) {
            throw new Error("No recipes found.");
        }

        displayRecipes(query ? data.results : data.recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        document.getElementById("recipeContainer").innerHTML = 
            "<p class='text-center text-red-600'>No recipes found. Try another search!</p>";
    }
}

// Display Recipes
function displayRecipes(recipes) {
    const recipeContainer = document.getElementById("recipeContainer");
    recipeContainer.innerHTML = "";

    if (!recipes || recipes.length === 0) {
        recipeContainer.innerHTML = "<p class='text-center text-red-600'>No recipes found.</p>";
        return;
    }

    recipes.forEach(meal => {
        // Check if extendedIngredients exist, otherwise display "Not Available"
        let ingredients = meal.extendedIngredients
            ? meal.extendedIngredients.map(ing => `<li>${ing.amount} ${ing.unit} ${ing.name}</li>`).join("")
            : "<li>Ingredients not available</li>";

        // Fallback image if no image is available
        const imageUrl = meal.image || "https://via.placeholder.com/400?text=No+Image";

        // Clickable title to view full recipe
        const recipeCard = `
        <div class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="text-xl font-bold">
                <a href="https://spoonacular.com/recipes/${meal.title}-${meal.id}" target="_blank" class="text-blue-600 hover:underline">${meal.title}</a>
            </h2>
            <img src="${imageUrl}" class="w-full h-40 object-cover rounded mt-2">
            <h3 class="text-lg font-semibold mt-4">Ingredients</h3>
            <ul class="list-disc list-inside">${ingredients}</ul>
        </div>
        `;

        recipeContainer.innerHTML += recipeCard;
    });
}
