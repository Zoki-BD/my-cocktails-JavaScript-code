class UI {
   // Display all the Drink Categories
   displayCategories() {
      const categoryList = cocktailAPI
         .getCategories() //prvo mora da gi fatime preku fetch za da imame sto da display
         .then((categories) => {
            const catList = categories.categories.drinks;

            // Append a first option without value - da stoi select napisano
            const firstOption = document.createElement("option");
            firstOption.textContent = "- Select -";
            firstOption.value = "";
            document.querySelector("#search").appendChild(firstOption);

            // Append into the Select
            catList.forEach((category) => {
               const option = document.createElement("option");
               option.textContent = category.strCategory;
               option.value = category.strCategory.split(" ").join("_"); //ova e mnogu bitno za moze posle ova da go iskoristime
               //api-to koe pravi filter po kategorii kade pisuva deka ako se dva ili povekje zbora treba da se kucnat odvoeni
               //so '_'. Ova znaci deka i value-to koe mu go dodeluvame na sekoj tag <option > mora da izgleda taka.
               document.querySelector("#search").appendChild(option);
            });
         });
   }

   // Display the cocktails without ingredient
   displayDrinks(drinks) {
      // Show the Results
      const resultsWrapper = document.querySelector(".results-wrapper");
      resultsWrapper.style.display = "block";

      // Insert the results
      const resultsDiv = document.querySelector("#results");

      // Loop trought drinks
      drinks.forEach((drink) => {
         resultsDiv.innerHTML += `
                    <div class="col-md-4">
                         <div class="card my-3">
                              <button type="button" data-id="${drink.idDrink}" class="favorite-btn btn btn-outline-info">
                              +
                              </button>
                              <img class="card-img-top" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                              <div class="card-body">
                                   <h2 class="card-title text-center">${drink.strDrink}</h2>
                                   <a data-target="#recipe" class="btn btn-success get-recipe" href="#" data-toggle="modal" data-id="${drink.idDrink}">Get Recipe</a>
                              </div>
                         </div>
                    </div>
               `;
      });




      this.isFavorite();
   }




   //Da gi pokazeme dole najdenite po name cocktails ama i so povekje detali preku objektot koj vleguva kako parametar
   displayDrinksWithIngredients(foundCocktailsByName) {
      //Show the results on web. Pazi result divot e so style-diplay none, zatoa ne se gleda, tuka ke go smenime vo block
      const resultsWrapper = document.querySelector(".results-wrapper");
      resultsWrapper.style.display = "block";

      //Insert the results - ova e divot kade ke se pokazat koktelite so sliki i se drugo
      const resultsDiv = document.querySelector("#results");

      //drinks t.e najdenite po ime kokteli se array i zatoa odime so forEach
      foundCocktailsByName.forEach((drink) => {
         resultsDiv.innerHTML += `
                    <div class="col-md-6">
                         <div class="card my-3">
                              <button type="button" data-id="${drink.idDrink
            }" class="favorite-btn btn btn-outline-info"> + </button> 
                              <img class="card-img-top" src="${drink.strDrinkThumb
            }" alt="${drink.strDrink}">

                              <div class="card-body">
                                   <h2 class="card-title text-center">${drink.strDrink
            }</h2>
                                   <p class="card-text font-weight-bold">Instructions: </p>
                                   <p class="card-text">
                                         ${drink.strInstructions}
                                        
                                   </p>
                                  <p class="card-text">
                                        <ul class="list-group">
                                             <li class="list-group-item alert alert-danger">Ingredients</li>
                                            ${this.displayIngredients(drink)}
                                        </ul>
                                   </p> 
                                   <p class="card-text font-weight-bold">Extra Information:</p>
                                   <p class="card-text">
                                        <span class="badge badge-pill badge-success">
                                             ${drink.strAlcoholic}
                                        </span>
                                        <span class="badge badge-pill badge-warning">
                                             Category: ${drink.strCategory}
                                        </span>
                                   </p>
                              </div>
                         </div>
                    </div>
               `;
      });

      this.isFavorite();
   }

   //prints the ingredients and measurments-pazi koga imame metod vo HTML dinamicki,odime so 'this.' bez razlika na forEach iteratorot
   displayIngredients(drink) {
      let ingredients = []; // kreirame prazen array koj ke go polnime preku for loop

      for (let i = 1; i < 16; i++) {
         //ova se brojki na mozni ingredients i soodvetno za niv measurments. nekoi se null treba tie da ne se povlecat vo objektot
         const ingredientMeasure = {}; //ova ke bidat objekti koi ke go polnat arrayot gore
         if (
            drink[`strIngredient${i}`] !== null &&
            drink[`strMeasure${i}`] !== null
         ) {
            ingredientMeasure.ingredient = drink[`strIngredient${i}`];
            ingredientMeasure.measure = drink[`strMeasure${i}`];
            ingredients.push(ingredientMeasure);
         }
      }
      //Build the template -  ova dopolnitelno ke se vmetne vo displayDrinksWithIngredients template-ot koj go kreiravme

      //Posto vekje imame array so objects odime preku forEach da dodademe <li> elem. koj ke gi nosi sostojkite i merkite
      let ingredientsTemplate = "";
      ingredients.forEach((ingredient) => {
         ingredientsTemplate += `
                    <li class="list-group-item">${ingredient.ingredient} - ${ingredient.measure}</li>
               `;
      });

      return ingredientsTemplate;
   }

   // Display single recipe
   displaySingleRecipe(recipe) {
      // Get variables - we fetch the polinjata od modalot kreiran vo html-ot za da moze da im preneseme dinamicki values od objektot
      const modalTitle = document.querySelector(".modal-title"),
         modalDescription = document.querySelector(
            ".modal-body .description-text"
         ),
         modalIngredients = document.querySelector(
            ".modal-body .ingredient-list .list-group"
         );
      console.log(modalTitle);
      // Set the values
      modalTitle.innerHTML = recipe.strDrink;
      modalDescription.innerHTML = recipe.strInstructions;

      // Display the ingredients
      modalIngredients.innerHTML = this.displayIngredients(recipe); //vekje go kreiravme ovoj metod prethodno
   }

   // Show the message if there is one into the new div on screen
   printMessage(message, className) {
      const div = document.createElement("div");

      // Add the HTML
      div.innerHTML = `
               <div class="alert alert-dismissible alert-${className}">
                    <button type="button" class="close" data-dismiss="alert">x</button>
                    ${message}                 <!--ova data-dissmiss pravi da x brise -->
               </div>
          `;

      // Insert before
      const reference = document.querySelector(".jumbotron");
      reference.insertBefore(div, reference.querySelector("h1"));

      // remove after 3 seconds
      setTimeout(() => {
         // document.querySelector('.alert').remove();
         div.remove(); //moze i kako gore preku alert clasata koga go naogjame novo kreiraniot div
      }, 3000);
   }

   //Clear preview results off the screen
   clearResults() {
      const resultsDiv = document.querySelector("#results");
      resultsDiv.innerHTML = "";
   }

   //Display the favorites drinks after we get backed them from the LS on Doc.ready start load
   displayFavorites(favorites) {
      const favoritesTable = document.querySelector("#favorites tbody");

      console.log(favorites);
      //Posto vrakja array LS mozeme preku forEach da za sekoj od niv napravime tableRow t.e <tr>, posto imame tbody
      // Objektot  nosi so sebe tri properties:name,id i image koi gi koritime tuka za dinam.da popolnime
      favorites.forEach((drink) => {
         const tr = document.createElement("tr");

         tr.innerHTML = `
                    <td>  <img src="${drink.image}" alt="${drink.name}" width=100>   </td>
                    <td>  ${drink.name}  </td>
                    <td>
                         <a href="#" data-toggle="modal" data-target="#recipe" data-id="${drink.id}" class="btn btn-success get-recipe" >
                              View
                         </a>
                    </td>
                    <td>
                         <a href="#" data-id="${drink.id}" class="btn btn-danger remove-recipe" >
                              Remove
                         </a>
                    </td>
               `;

         favoritesTable.appendChild(tr);
      });
   }
   // Remove single favorite from dom
   removeFavorite(element) {
      element.remove();
   }

   // Add a Class when cocktail is favorite - Potocno da ako e vo LS bide minus pokroj toj koktel vo search, za da znaeme deka vekje go imame vo favorites i LS
   isFavorite() {
      const drinks = cocktailDB.getFromDB();

      drinks.forEach((drink) => {
         // destructuring the id
         let { id } = drink; //we destructure here

         // Select the favorites
         let favoriteDrink = document.querySelector(`[data-id="${id}"]`);
         if (favoriteDrink) {
            favoriteDrink.classList.add("is-favorite");
            favoriteDrink.textContent = "-";
         }
      });
   }
}
