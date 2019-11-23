# Practica-3-recetario.
## Instalar/Run

```js
npm install
```

ejecutar el GraphQLServer en: http://localhost:4000



## Query

- Imprimir todas las recetas

```js
query{
  recipes{
    title
  }
```

- Imprimir todos los autores de la base de datos

```js
query{
  authors{
    name
    email
  }
```
- Imprimir todos los ingredientes de la base de datos

```js
query{
  ingredients{
    name
  }
```

- Imprimir todas las recetas de la base de datos

```js
query{
  recipes{
    title
    description
    author{
      name
    }
    ingredients{
      name
    }
  }
}
```


## Mutations

- Añadir receta

```js
mutation{
  addRecipe(title:"patata",description:"nada",author:"364783264",ingredients:["378432647345287","234632846328"]){
    title
  }
}
```

- Añadir autor

```js
mutation{
  addAuthor(name:"stef",email:"stef@gmail.com"){
    name
  }
}
```

- Añadir ingrediente

```js
mutation{
  addIngredient(name:"patata"){
    name
  }
}
```

- Eleminar receta

```js
mutation{
  removeRecipe(title:"patata")
}
```

- Eliminar autor

```js
mutation{
  removeAuthor(name:"stef")
}
```

- Eliminar un ingrediente

```js
mutation{
  removeIngredient(name:"patata")
}
```

- Modificar los datos del autor

```js
mutation{
  updateAuthor(_id:"24623847326",name:"steff",email:"steff@gmail.com"){
     name
  }
}
```

- Modifcar un ingrediente

```js
mutation{
  updateIngredient(_id:"34326487326",name:"patatas"){
  name
  }
}
```
- Modifcar una receta

```js
mutation{
  updateRecipe(_id:"34326487326",name:"receta", author:"32482346",ingredients:"76487254"){
    name
  }
}
```
