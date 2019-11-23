# Practica-3-recetario.
para instalar:
npm install
GraphQL:
http://localhost:4000
- query{
  authors{
    name
    _id
    email
  }
  ingredients{
    name
    _id
  }
  recipes{
    title
    _id
    description
    authors{
    name
    email
    }
  }
 }
