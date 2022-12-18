export default {
  protectedRoutes: [
    { route: "/users", methods: ["POST", "PUT", "DELETE", "PATCH"] },
    { route: "/posts", methods: ["POST", "PUT", "DELETE", "PATCH"] },
    { route: "/comments", methods: ["POST", "PUT", "DELETE", "PATCH"] },
    { route: "/photos", methods: ["POST", "PUT", "DELETE", "PATCH"] },
    { route: "/todos", methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] },
    { route: "/recipeCategories", methods: ["POST", "PUT", "DELETE", "PATCH"] },
    { route: "/recipeIngredients", methods: ["POST", "PUT", "DELETE", "PATCH"] },
    { route: "/recipes", methods: ["POST", "PUT", "DELETE", "PATCH"] },
    { route: "/areas", methods: ["POST", "PUT", "DELETE", "PATCH"] },
    { route: "/recipeTags", methods: ["POST", "PUT", "DELETE", "PATCH"] },
    { route: "/orders", methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] },
  ]
}

// Employees, departments & cats are not protected.