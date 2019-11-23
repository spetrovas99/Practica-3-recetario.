# Practica-3-recetario.
Practice 2
Recipe Book

GitHub GitHub Release Date GitHub last commit

Install/Run
All the necessary packages are in the package.json file.

To install them, run this command:

npm install
To run the programme in the server 3003

npm start
Query
Print all recipes
query{
  recipes{
    title
  }
Print all authors
query{
  authors{
    name
  }
Print all ingredients
query{
  ingredients{
    name
  }
Print all recipes of an author
query{
  authorRecipes(name:"Luis"){
    title
  }
}
Print all recipes of a ingredient
query{
  ingredientRecipes(name:"Tomate"){
    title
  }
}
Mutations
Add a recipe
mutation{
  addRecipe(title:"ensalada2",description:"hi",mail:"lfresnog@gmail.com",ingredients:["1","2"]){
    title
  }
}
Add a author
mutation{
  addAuthor(name:"Hector",mail:"h@gmail.com"){
    name
  }
}
Add a ingredient
mutation{
  addIngredient(name:"Aceite"){
    name
  }
}
Delete a recipe
mutation{
  deleteRecipe(name:"ensalada2")
}
Delete an author
mutation{
  deleteAuthor(name:"Luis")
}
Delete a ingredient
mutation{
  deleteIngredient(name:"Tomate")
}
Update an author
mutation{
  updateAuthor(name:"Luis",n_name:"Hector")
}
Update a ingredient
mutation{
updateIngredient(name:"Lechuga",n_name:"Lechuga1")
}
