import fs from "fs";
import * as uuid from "uuid";
import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import "babel-polyfill"

const dbConnect = async () => {
  const uri = "mongodb+srv://stefani:contraseña@scluster-jlu1s.gcp.mongodb.net/test";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client;
}

const runGraphQLServer = function (context) {
  const typeDefs = `
    type Query {
      getAuthor(_id: ID!): Author!
      recipes(author: ID, ingredient: ID): [Recipe!]
      authors: [Author!]
      ingredients: [Ingredient!]
    }

    type Mutation {
      addAuthor(name: String!, email: String!): Author!
      addIngredient(name: String!): Ingredient!
      addRecipe(title: String!, description: String!, author: ID!, ingredients: [ID!]): Recipe!
      removeAuthor(_id: ID!): Author
      removeRecipe(_id: ID!): Recipe
      removeIngredient(_id: ID!): Ingredient
      updateIngredient(_id: ID!, name: String!): Ingredient!
      updateAuthor(_id: ID!, name: String, email: String): Author!
      udpateRecipe(_id:ID!, title: String, description: String, author: ID, ingredients: [ID!]): Recipe!
    }

    type Recipe {
      title: String!
      description: String!
      date: String!
      author: Author!
      ingredients: [Ingredient!]!
      _id: ID!
    }

    type Author {
      name: String!
      email: String!
      recipes: [Recipe!]!
      _id:ID!
    }

    type Ingredient {
      _id:ID
      name: String!
      recipes: [Recipe!]!

    }
  `

  const resolvers = {
    Query: {
      getAuthor: async (parent, args, ctx, info) => {
        const {_id } = args;
        const { client } = ctx;
        const db = client.db("cookbook");
        const collection = db.collection("authors");
        const result = await collection.findOne({ _id: ObjectID(_id) });
        return result;
      },
      recipes: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const {author,ingredient} =args;

        const db = client.db("cookbook");
        const collection = db.collection("recipes");
        let result = await collection.find({}).toArray();
        if(author){
          result = result.filter(elem => elem._id == author);
        }
        if(ingredient){
          result = result.filter(elem =>elem.ingredients.some(elem =>elem == ingredient));
        }
        return result;

      },
      authors: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("cookbook");
        const collection = db.collection("authors");
        const result = await collection.find({}).toArray();
        return result;

      },
      ingredients: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("cookbook");
        const collection = db.collection("ingredients");
        const result = await collection.find({}).toArray();
        return result;
      }
    },
    Mutation: {
      addAuthor: async (parent, args, ctx, info) => {
        const { name, email } = args;
        const { client } = ctx;

        const db = client.db("cookbook");
        const collection = db.collection("authors");
        let result = await collection.find({}).toArray();
        
        if(result.some(elem =>elem.email === email)){
          throw new Error (`ya existe un usuario con ese email: ${email}`);
        }
        result = await collection.insertOne({ name, email });
        return {
          name,
          email,
          _id: result.ops[0]._id
        };
      },

      addIngredient: async (parent, args, ctx, info) => {
        const { name } = args;
        const { client } = ctx;

        const db = client.db("cookbook");
        const collection = db.collection("ingredients");
        let result = await collection.find({}).toArray();
        if(result.some(elem =>elem.name === name)){
          throw new Error (`ya existe un usuario con ese nombre: ${name}`);
        }
        const response = await collection.insertOne({ name });
        return {
          name,
          _id: response.ops[0]._id
        };
      },

      addRecipe: async (parent, args, ctx, info) => {
        const { title,description,ingredients,author} = args;
        const { client } = ctx;
       
        const db = client.db("cookbook");
        const collection = db.collection("recipes");

        const result = await collection.find({}).toArray();
        if(result.some(elem =>elem.title === title)){
          throw new Error (`ya existe una receta con ese nombre: ${title}`);
        }
        const response = await collection.insertOne({ title,description,ingredients,author });
        return {
          title,
          description,
          author,
          ingredients,
          _id: response.ops[0]._id
        };
      },

      removeRecipe: async (parent, args, ctx, info) => {
        const { _id} = args;
        const {client} = ctx;
        const db = client.db("cookbook");
        const collection = db.collection("recipes");
        const resul = await collection.find({}).toArray();

        if(!result.some(obj => obj._id == _id)){
            throw new Error(`no hay ninguna receta con este id: ${_id}`);
        }

        return (await collection.findOneAndDelete({_id: ObjectID(_id)})).value;
    },

    removeAuthor: async (parent, args, ctx, info) => {
        const { _id} = args;
        const {client} = ctx;
        const db = client.db("cookbook");
        const authorsCollection = db.collection("authors");
        const recipesCollection = db.collection("recipes");
        const result = await authorsCollection.find({}).toArray();
        const result2 = await recipesCollection.find({}).toArray();

        if(!result.some(obj => obj._id == _id))
            throw new Error(`no hay ningun autor con este id: ${_id}`);

        result2.filter(obj => obj.author == _id).forEach(async (elem) => {
            await recipesCollection.findOneAndDelete({_id: elem._id});
        });

        return (await authorsCollection.findOneAndDelete({_id: ObjectID(_id)})).value;
    },

    removeIngredient: async (parent, args, ctx, info) => {
        const { _id} = args;
        const {client} = ctx;
        const db = client.db("cookbook");
        const ingredientsCollection = db.collection("ingredients");
        const recipesCollection = db.collection("recipes");
        const result = await ingredientsCollection.find({}).toArray();
        const result2 = await recipesCollection.find({}).toArray();

        if(!result.some(obj => obj._id == _id))
            throw new Error(`no hay ningun ingrediente con este id: ${_id}`);
        
        result2.filter(obj => obj.ingredients.some(elem => elem == _id)).forEach(async (elem) => {
            await recipesCollection.findOneAndDelete({_id: elem._id});
        });

        return (await ingredientsCollection.findOneAndDelete({_id: ObjectID(_id)})).value;
    },

      updateIngredient: async (parent, args, ctx, info) => {
        const { _id, name } = args;
        const { client } = ctx;
        const db = client.db("cookbook");
        const collection = db.collection("ingredients");
        const result = await collection.find({}).toArray();

        if(!result.some(elem =>elem._id == _id))
          throw new Error (`no hay ningun ingrediente con ete id ${_id}`);
        if(result.some(elem=> elem.name == name))
          throw new Error (`este nombre${name} ya existe`);
        await collection.updateOne({_id: ObjectID(_id)}, {$set:{name:name }},(error,response)=>{
          if(error){
              throw error;
          }
        });
        return await collection.findOne({_id: ObjectID(_id)});
      },
      updateAuthor: async (parent, args, ctx, info) => {
        const { name, email,_id } = args;
        const { client } = ctx;
        const db = client.db("cookbook");
        const collection = db.collection("authors");
        let result = await collection.find({}).toArray();

        if(!result.some(elem =>elem._id == _id))
          throw new Error (`no hay ningun ingrediente con ete id ${_id}`);
        if(result.some(elem=> elem.email == email))
          throw new Error (`este email ${email} ya existe`);

        await collection.updateOne({_id: ObjectID(_id)},{$set:{name:name, email:email}},(error,response)=>{
          if(error){
              throw error;
          }
        });
        return await collection.findOne({_id: ObjectID(_id)});
      },

      udpateRecipe: async(parent, args, ctx, info) => {
        const { title,_id,description,author,ingredient} = args;
        const { client } = ctx;

        const db = client.db("cookbook");
        const collection = db.collection("recipes");
        if(!result.some(elem =>elem._id == _id))
          throw new Error (`no hay ningun ingrediente con ete id ${_id}`);
        if(!result.some(elem=> elem.title == title))
          throw new Error (`este titulo ${title} ya existe`);

        await collection.updateOne({_id: ObjectID(_id)},{$set:{name:name, email:email}},(error,response)=>{
          if(error){
              throw error;
          }
      });
      return await collection.findOne({_id: objectID(_id)});

      },
    },

    Recipe: {
      author: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("cookbook");
        const collection = db.collection("authors");
        const response = await collection.findOne({ _id: ObjectID(parent.author)});
        return response;
      },
      ingredients: async (parent, args, ctx, info) => {
        const ingredients = [];
        const { client } = ctx;
        const db = client.db("cookbook");
        const collection = db.collection("ingredients");
        parent.ingredients.forEach(elem =>{
          ingredients.push(collection.findOne({_id:ObjectID(elem)}));
        });
        
        return ingredients;
      }
    },

    Author: {
      recipes: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("cookbook");
        const collection = db.collection("recipes");
        const response = await collection.find({ author: parent._id }).toArray();
        return response;
      }
    },
    Ingredient: {
        recipes: async (parent,args,ctx,info) =>{
        const { client } = ctx;
        const db = client.db("cookbook");
        const collection = db.collection("recipes");
        const result = await collection.find({ingredients:parent._id}).toArray();
        return result;
        }
    },
  };
  const server = new GraphQLServer({ typeDefs, resolvers, context });
  const options = {
    port: 4000
  };
  try {
    server.start(options, ({ port }) =>
      console.log(
        `Server started, listening on port ${port} for incoming requests.`
      )
    );
  } catch (e) {
    console.info(e);
  }
}
const runApp = async function () {
  const client = await dbConnect();
  console.log("Connect to Mongo DB");
  try {
    runGraphQLServer({ client });
  } catch (e) {
    console.log(e);
    client.close();
  }
};
runApp();