class CocktailAPI {

   async getDrinksByName(searchTerm){

       //search by name
        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);

        const cocktails = await apiResponse.json();

        return {
            cocktails
        }
    }


    //search by ingredient
    async getDrinksByIngredient(searchTerm){

        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchTerm}`);

        const cocktails = await apiResponse.json();

        return {
            cocktails
        }
    }

    //search by ingredient
    async getSingleRecipe(dataset_ID){

        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${dataset_ID}`);

        const recipe = await apiResponse.json();

        return {
            recipe
        }
    }
    // Retrieves all the Categories from the REST API
    async getCategories() {
        const apiResponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
        // Wait for response and return JSON
        const categories = await apiResponse.json();

        return {
            categories
        }
    }

    //Search by category and  get the cocktails related
    async getDrinksByCategory(searchTerm){

        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${searchTerm}`);

        const cocktails = await apiResponse.json();

        return {
            cocktails
        }
    }

    //Search by alcohol inside or not
    async getDrinksByAlcohol(searchTerm){

        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${searchTerm}`);

        const cocktails = await apiResponse.json();

        return {
            cocktails
        }
    }


}

