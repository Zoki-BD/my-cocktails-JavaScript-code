class CocktailDB {
   //Save the fav. coctails into the LS
   saveIntoDb(drinkInfo) {
      const drinks = this.getFromDB();

      drinks.push(drinkInfo);

      localStorage.setItem('drinks', JSON.stringify(drinks));

   }


   //Get the fav. cocktails from LS method
   getFromDB() {
      let drinks;
      //check the LS


      if (localStorage.getItem('drinks') === null) {
         drinks = [];
      } else {
         drinks = JSON.parse(localStorage.getItem('drinks'));
      }
      return drinks;
   }


   // Remove from LS
   removeFromDB(id) {
      // Prvo mora da gi izvleceme od LS
      const drinks = this.getFromDB();

      //Loop
      drinks.forEach((drink, index) => {
         if (id === drink.id) { // sporedba na id povlecen so dataset sto e vo <tr-ot>, so id na objektot izvlecen od LS. Posto
            drinks.splice(index, 1) // ova znacese od ova indexno mesto nagore izbrisi eden elemenent.Sto znaci samo nego ke go izbriseme
         }
      });
      // Set the array into LS - sega pak go vrakjame vo LS kako string
      localStorage.setItem('drinks', JSON.stringify(drinks));

   }
}