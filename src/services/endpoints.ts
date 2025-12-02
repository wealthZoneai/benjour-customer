const endpoints = {
    login: 'api/Alcohols/auth/login',
    register: 'api/Alcohols/auth/register/user',
    sendEmailOtp: 'api/auth/send-email-otp',
    verifyEmailOtp: "api/Alcohols/auth/verify/user",

    // Grocery Categories
    getGroceryCategories: 'api/groceries/categories',
    createGroceryCategory: 'api/groceries/categories',
    updateGroceryCategory: 'api/groceries/categories',
    deleteGroceryCategory: 'api/groceries/categories',

    // Alcohol Categories
    getAlcoholCategories: 'api/alcohols/categories',
    createAlcoholCategory: 'api/alcohols/categories',
    updateAlcoholCategory: 'api/alcohols/categories',
    deleteAlcoholCategory: 'api/alcohols/categories',

    // Grocery Items
    getGroceryItems: 'api/groceries/items',
    createGroceryItem: 'api/groceries/items',
    updateGroceryItem: 'api/groceries/items',
    deleteGroceryItem: 'api/groceries/items',

    // Alcohol Items
    getAlcoholItems: 'api/alcohols/items',
    createAlcoholItem: 'api/alcohols/items',
    updateAlcoholItem: 'api/alcohols/items',
    deleteAlcoholItem: 'api/alcohols/items',
}

export default endpoints