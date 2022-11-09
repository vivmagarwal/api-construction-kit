import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
// https://chancejs.com/usage/node.html
// https://fakerjs.dev/api/commerce.html#price
import { recipeCategories, ingredients, recipes, areas} from "./raw-data/meals.js";

import dotenv from "dotenv";
dotenv.config();

import config from 'config';

let PROTOCOL = 'http://';
let HOST = config.get('host');
let PORT = config.get('port');
const ABSOLUTE_IMG_URL = false;
let HOST_FOR_IMAGE = ABSOLUTE_IMG_URL ? HOST == 'localhost' ? `${PROTOCOL}${HOST}:${PORT}` : `${PROTOCOL}${HOST}` : '' ;



var database = {
  cats: [],
  users: [],
  posts: [],
  comments: [],
  photos: [],
  todos: [],
  recipeCategories: [],
  recipeIngredients: [],
  recipes: [],
  areas: [],
  recipeTags: [],
  orders: []
};

// 336 cats for simple apps
for (var i = 1; i <= 336; i++) {
  database.cats.push({
    id: i,
    name: faker.name.firstName(),
    cost: roundToTwo(Math.random() * 100),
    likes: Math.round(Math.random() * 1000),
    image: encodeURI(`${HOST_FOR_IMAGE}/images/cat/cat-unsplash-${i}.jpg`),
    thumb: encodeURI(`${HOST_FOR_IMAGE}/images/cat/cat-unsplash-${i}-thumb.jpg`),
    description: faker.lorem.paragraph(),
    breed: faker.animal.cat(),
    createdAt: Date.now(),
  });
}

// admin user with admin as password
// total 50 users created
database.users.push({
  id: 1,
  username: "admin",
  firstname: "Ad",
  lastname: "Minister",
  email: "admin@mail.com",
  password: bcrypt.hashSync("admin", 10),
  avatar: faker.image.avatar(),
  userLevel: getRandomInt(1,5),
  createdAt: Date.now(),
});

for (var i = 2; i <= 50; i++) {
  let username = faker.internet.userName();
  database.users.push({
    id: i,
    username: username,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync(username, 10),
    avatar: faker.image.avatar(),
    userLevel: getRandomInt(1,5),
    createdAt: Date.now(),
  });
}

// 500 posts written by 50 users
for (var i = 1; i <= 500; i++) {
  database.posts.push({
    id: i,
    userId: getRandomInt(1, 50),
    title: faker.word.adjective() + " " + faker.animal.cat(),
    image: "https://loremflickr.com/640/480/random",
    body: faker.lorem.paragraph(10),
    createdAt: Date.now(),
  });
}

// 5000 comments for 500 posts
for (var i = 1; i <= 5000; i++) {
  database.comments.push({
    id: i,
    postId: getRandomInt(1, 500),
    userId: getRandomInt(1, 50),
    title: faker.word.adjective() + " " + faker.animal.cat(),
    body: faker.lorem.paragraph(5),
    createdAt: Date.now(),
  });
}

// 1000 photos for 50 users
for (var i = 1; i <= 1000; i++) {
  database.photos.push({
    id: i,
    userId: getRandomInt(1, 50),
    title: faker.word.adjective() + " " + faker.animal.cat(),
    image: "https://loremflickr.com/640/480/random",
    thumb: "https://loremflickr.com/150/150/random",
    description: faker.lorem.paragraph(10),
    createdAt: Date.now(),
  });
}

// 500 todos for 50 users
for (var i = 1; i <= 500; i++) {
  database.todos.push({
    id: i,
    userId: getRandomInt(1, 50),
    title: faker.word.adjective() + " " + faker.animal.cat(),
    completed: Math.random() < 0.3,
    createdAt: Date.now(),
  });
}

// Recipe
recipeCategories.forEach((item) => {
  database.recipeCategories.push({
    id: item.idCategory,
    name: item.strCategory,
    image: `${HOST_FOR_IMAGE}/images/recipe-category/${item.strCategory.toLowerCase()}.png`,
    description: item.strCategoryDescription,
    createdAt: Date.now(),
  });
});

let categoriesDirectory = database.recipeCategories.reduce(((acc, item) => {
  acc[item.name] = item.id;
  return acc;
}))



ingredients.forEach((item) => {
  database.recipeIngredients.push({
    id: item.idIngredient,
    name: item.strIngredient,
    image: encodeURI(`${HOST_FOR_IMAGE}/images/recipe-ingredient/${item.strIngredient}.png`),
    description: item.strDescription,
    createdAt: Date.now(),
  });
});


let ingredientsDirectory = ingredients.reduce((acc, item) => {
  acc[((item.strIngredient).toLowerCase()).trim()] = item.idIngredient;
  return acc;
}, {})


areas.forEach((item, index) => {
  database.areas.push({
    id: index + 1,
    name: item.strArea,
  })
})

let areasDirectory = database.areas.reduce(((acc, item) => {
  acc[item.name] = item.id;
  return acc;
}),{})

let recipeTagsDirectory = {};
let recipeTagIndex = 0;
recipes.forEach((item) => {
  if (item && item.strTags) {
    let tagsArray = item.strTags.split(',')
    tagsArray.forEach((tag) => {
      let trimmedTag = (tag.toLowerCase().trim());
      if (trimmedTag) {
        if (!(trimmedTag in recipeTagsDirectory)) {
          recipeTagIndex++;
  
          recipeTagsDirectory[trimmedTag] = recipeTagIndex;
  
          database.recipeTags.push({
            id: recipeTagIndex,
            name: trimmedTag,
            createdAt: Date.now(),
          })
        }
      }
    })
  }
})

recipes.forEach((item) => {
  let filename = item.strMealThumb.split('/').pop().split('#')[0].split('?')[0];
  let imgPath = encodeURI(`${HOST_FOR_IMAGE}/images/meals/${filename}`);
  let tagsArray = [];

  if (item.strTags) {
    let tagsArrayRaw = item.strTags.split(',');
    tagsArrayRaw.forEach((tag) => {
      let trimmedTag = tag.trim().toLowerCase();
      if (trimmedTag) {
        tagsArray.push(recipeTagsDirectory[trimmedTag])
      }
    })
  }

  let ingredients = [];
  for (let i=1; i <= 20; i++) {
    let ingredientKey = `strIngredient${i}`;
    let measureKey = `strMeasure${i}`;
    if (item[ingredientKey]) {
      let strIngredient = (item[ingredientKey]).trim().toLowerCase();
      let strMeasure = item[measureKey];
      let ingredientId = ingredientsDirectory[strIngredient];
      if (ingredientId) {
        ingredients.push({
          ingredientId: ingredientId,
          ingredientMeasure: strMeasure
        })
      }
    }
  }

  database.recipes.push({
    id: item.idMeal,
    name: item.strMeal,
    recipeCategoryId: categoriesDirectory[item.strCategory] || null,
    areaId: areasDirectory[item.strArea] || null,
    instructions: item.strInstructions || null,
    image: imgPath,
    tags: tagsArray,
    youtube: item.strYoutube,
    ingredients: ingredients,
    recipeSource: item.strSource,
    imageSource: item.strImageSource,
    price: faker.commerce.price(50, 500),
    stock: getRandomInt(1, 20),
    discount: getRandomInt(1, 20),
    createdAt: Date.now(),
  })
})

database.orders.push({
  id: 1,
  userId: 1,
  items: [
    { recipeId: 52768, quantity: getRandomInt(1,5),},
    { recipeId: 52893, quantity: getRandomInt(1,5),}
  ]
})

// required for the generate script
console.log(JSON.stringify(database));

// helpers
function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
