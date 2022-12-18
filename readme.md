# API Construction kit (optimized for cyclic deployment)

## Overview
This setup is based on JSON-Server. JWT Authentication & Route protection is working out of the box. Several API endpoints has been created for you to create any app of your choice. You are free to add your own endpoints by adding a new key to db.json file. Static files like images may be served from `server-files/images` directory. You can customize route protection from the `serverConfig.js` file. Creating a new entry in db.json file would add a new route for you & you are free to create any fields at runtime. `Id` if not provided will be auto created.

## Installation
```
npm i
```

## Run the server in development (local) environment
```
npm run dev
```

## Access the server
```
http://localhost:9999/
```

## How to video
https://www.loom.com/share/f4d8c58a0e224aebbbd0d20fbe946928

## Node version
v16.x

## Deploy to [Cyclic.sh](https://app.cyclic.sh/#/join/vivmagarwal) in 2 minutes.
https://www.loom.com/share/6af88bcc45b74c19845a83457e792964

## Local server in 2 minutes
https://www.loom.com/share/a1b18ff5449e41109d8f6b3bb2e46867

## Resources
`/cats` 336x

`/users` 50x

`/posts` 500x

`/comments` 5000x

`/photos` 1000x

`/todos` 500x

`/recipeCategories` 14x

`/recipeIngredients` 570x

`/recipes` 284x

`/areas` 25x

`/recipeTags` 73x

<hr>

To access and modify `cats`, you can use any HTTP method:
`GET` `POST` `PUT` `PATCH` `DELETE` OPTIONS

For all other routes `GET` is open but all other HTTP methods requires Authentication.

For the `/orders` route, all methods are protected.

<hr>

## Authentication
### Register a new user 
```
POST http://localhost:9999/user/register
Content-Type: application/json

    {
    "username": "john.smith",
    "firstname": "John",
    "lastname": "Smith",
    "email": "John@mail.com",
    "password": "john.smith",
    "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/304.jpg"
    }
```    

### Login an existing user with password
```
POST http://localhost:9999/user/login
Content-Type: application/json

    {
      "username": "john.smith",
      "password": "john.smith"
    }
```

###

## More examples
https://github.com/vivmagarwal/mock-api-server-with-JWT-authentication/blob/main/server.rest

## VSCode extension to make API calls from the .rest file
https://marketplace.visualstudio.com/items?itemName=humao.rest-client 

## Change port
Update `PORT=3000` in the `.env` file before `npm start`.

## Add Custom Routes & Protected Routes
https://www.loom.com/share/f4d8c58a0e224aebbbd0d20fbe946928