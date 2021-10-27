// Instanciate the classes
const cocktailAPI = new CocktailAPI();
const ui = new UI();
const cocktailDB = new CocktailDB();

//Events Listeners

function eventListeners() {
   //Otvorame DOMcont.loaded eventListener za da se popolni listata so cateogories na start odma
   document.addEventListener("DOMContentLoaded", documentReady);

   // Add event List when form is submitted
   const searchForm = document.querySelector("#search-form");
   if (searchForm) {
      //ova  za da koga ke otvorime drugi stranici od navbar ne dava error. Ke se aktivira samo kade ke ima searchform fateno nesto vo const

      searchForm.addEventListener("submit", getCocktails);
   }

   // Add listener to the get recipe button- using delegation , because div appears dinamicaly
   const resultDiv = document.querySelector("#results");
   if (resultDiv) {
      resultDiv.addEventListener("click", resultsDelegation);
   }
}
eventListeners();

//Functions

//Method to get the coctails
function getCocktails(e) {
   e.preventDefault();

   const searchTerm = document.querySelector("#search").value;

   if (searchTerm === "") {
      // Call UI metod to show the error message
      ui.printMessage("Search field is mandatory!", "danger"); //preku parame. dodavame klasa,za ako e success da e 'success' clasa
   } else {
      //Server response from promise
      let serverResponse;

      //Type of search(name, ingredients or cocktails)
      const type = document.querySelector("#type").value; // vaka go fakjame value=to koe e dadeno vo html-ot.Pr.name ili ingredients

      //Evaluate the type of method and then execute the query

      switch (type) {
         case "name":
            serverResponse = cocktailAPI.getDrinksByName(searchTerm);
            break;
         case "ingredient":
            serverResponse = cocktailAPI.getDrinksByIngredient(searchTerm);
            break;
         case "category":
            serverResponse = cocktailAPI.getDrinksByCategory(searchTerm);
            break;
         case "alcohol":
            serverResponse = cocktailAPI.getDrinksByAlcohol(searchTerm);
            break;
      }

      //First clear the previous results
      ui.clearResults();


      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // MNOGU BITNO: PAZI IMAS PREBARUVANJE PO INGREDIENTS I drugo baranje KOGA BARAME DA GI POKAZE INGREDIENTS OTKKAO KE GI dobieme PO NAME. DVE RAZLICNI SE raboti se.


      //Query the rest API
      serverResponse
         .then((cocktails) => {
            if (cocktails.cocktails.drinks === null) {
               //Znaci nema takov kako sto barame i printame uste eden error koristejki ja funk.prethodno kreirana
               ui.printMessage("Please add valid search word", "danger");
            } else {
               if (type === "name") {
                  // Display with ingredients
                  ui.displayDrinksWithIngredients(cocktails.cocktails.drinks);
               } else {
                  // Display without Ingredients (category, alcohol, ingredient)
                  ui.displayDrinks(cocktails.cocktails.drinks);
               }
            }
         })
         .catch((err) => console.log("De bre daa")); //mora da imame vlezen param. koj tuka ke bide neli vnesenata value vo poleto search
   }
}

//Method for deleagation for #results area and also for favorite button to send drinks into the LS and display them on fav.page
function resultsDelegation(e) {
   e.preventDefault();

   if (e.target.classList.contains("get-recipe")) {
      //cocktailAPI.getSingleRecipe(e.target.getAttribute('data-id'));  // ova e drug nacin da fatime data- atributi,isto e so dole
      cocktailAPI
         .getSingleRecipe(e.target.dataset.id) // pravime metod koj ke ima vlezen argument data-id="${drink.idDrink} od

         .then((recipe) => {
            // noviot div kaj ingredient kreiran
            //Display the recipe in the modal
            ui.displaySingleRecipe(recipe.recipe.drinks[0]);
         });
   }

   // When favorite button is clicked
   if (e.target.classList.contains("favorite-btn")) {
      if (e.target.classList.contains("is-favorite")) {
         //Dodavame class is-favorite vo css prvo pa ovde vo zavisnost ja trgame ili dodavame
         //remove the class
         e.target.classList.remove("is-favorite");
         e.target.textContent = "+"; //dodavame plus znak da ako ne e selektirano

         //Remove from the LS - Ova na kraj go napravivme.Da preku -, t.e otkako ke stisneme na minus,da go izbrise od LS koktelot
         //Istoto sto go koristime za kopceto remove vo faorites i ovde se koristi
         cocktailDB.removeFromDB(e.target.dataset.id);
      } else {
         //Add the class back
         e.target.classList.add("is-favorite");
         e.target.textContent = "-"; //dodavame minus znak da dade ako e selektirano

         // Sega najbitnoto: preku e.target parent go fakjame div-ot koj ja nosi cela card(cardBody go imenuvame ovde)
         // i vo nego preku vekje ulovenite id, img i slicno kreirame objekt koj ke go skladirame vo LS
         const cardBody = e.target.parentElement;
         //I sega kreirame new object
         const drinkInfo = {
            id: e.target.dataset.id, // vaka fakjavme preku data atribut, a mozevme i preku geAtribute
            name: cardBody.querySelector(".card-title").textContent, //  se dodava vrednost tekst
            image: cardBody.querySelector(".card-img-top").src, // se dodava src='....' za img
         };


         cocktailDB.saveIntoDb(drinkInfo);
      }
   }
}

//DOMCOntentLoaded metod on init for cateogories to be filled immediatly on page load
function documentReady() {
   // Display on load the favorites from LS - skroz na kraj ova pravime. Da briseme od fav i LS preku minus krukceto stiskanje
   ui.isFavorite();

   //select the search-category  class in html element
   const searchCategory = document.querySelector(".search-category");
   if (searchCategory) {
      ui.displayCategories();
   }

   // When favorites page is open to be filled with drinks from LS
   const favoritesTable = document.querySelector("#favorites");
   if (favoritesTable) {
      //Znaci ako ima nesto vo LS da go povlece i prikaze
      const drinks = cocktailDB.getFromDB();
      //Pa povikuvame metod koj e kreiran vo UI za da gi prikaze tie kokteli

      ui.displayFavorites(drinks);

      //When view or delete buttons in favorites is clicked-Odnosno sega vekje gi pokazuva i imame i kopcinja view i remove
      favoritesTable.addEventListener("click", (e) => {
         e.preventDefault();

         // Delegation
         //When view button is clicked - we use already created getSingleRecipe metodot
         if (e.target.classList.contains("get-recipe")) {
            cocktailAPI
               .getSingleRecipe(e.target.dataset.id) // tuka id go barame vo noviot tr, za razlika pret.koga id go imavme preku api rest
               .then((recipe) => {
                  // Displays single recipe into a modal
                  ui.displaySingleRecipe(recipe.recipe.drinks[0]);
               });
         }
         // When remove button is clicked in favorites
         if (e.target.classList.contains("remove-recipe")) {
            // Remove from dom
            ui.removeFavorite(e.target.parentElement.parentElement);

            // Remove from the Local Storage
            cocktailDB.removeFromDB(e.target.dataset.id);
         }
      });
   }
}
