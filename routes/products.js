import express from 'express';
import { v4 as uuidv4 } from 'uuid' //to generate unique IDs
const router = express.Router(); //instatiating routes

//all routes here starts with /users

//ALL Products

let allProducts = [
    {
        product: "Mouse",
        price: 8500,
        store: "Sidswipe Gadgets",
        quantity: 60,
        isStoreVerified: false,
        productId: uuidv4()
    },
]; //Just in memory database

const validKeys = ['product', 'price', 'store', 'quantity', 'isStoreVerified']

function validateBodyParams(bodyTocheck) {
    const errors = [];

    for (let akey in bodyTocheck) {
        if (!validKeys.includes(akey)) {
            errors.push(`Wrong Parameter: kindly crosscheck the key - ${akey}`)
        }
    }

    return errors;
}

function checkMissingBodyParams(bodyToCheck) {
    const errors = [];

    for (let i = 0; i < validKeys.length; i++) {
        if (bodyToCheck[validKeys[i]] == undefined) {
            errors.push(`Parameters Incomplete: The key - ${validKeys[i]} is missing`)
        }
    }

    return errors;
}







///CRUD///
//Get all Products
router.get('/all', (req, res) => {
    res.send(allProducts);
});


//Add a Product
router.post('/addproduct', (req, res) => {

    const wrongParameters = validateBodyParams(req.body); //validate body
    const missingParammeters = checkMissingBodyParams(req.body);

    if (wrongParameters.length > 0) {
        res.send(wrongParameters.join('\n'));
    }
    else if (missingParammeters.length > 0) {
        res.send(missingParammeters.join('\n'));
    }
    else {
        let newProduct = { ...req.body, productId: uuidv4() }; //Using spread operator to include all static product details then a dynamic ID
        allProducts.push(newProduct); //pushing into in-memory database
        res.send(`${newProduct.product} from ${newProduct.store} added successfully\nallProducts: ${JSON.stringify(allProducts)}`);

    }

})


//Find a particcular producct by ID
router.get('/:id', (req, res) => { //notice how : is added in path, thats so we can pass anything there which we will collect as ID
    let querryId = req.params.id;
    let theProduct = allProducts.find((aProd) => aProd.productId == querryId);
    if (theProduct) {
        res.send(theProduct);
    } else {
        res.send(`Product with ID: ${querryId} not found`);
    }
}
);


//delete a product by ID
router.delete('/:id', (req, res) => {
    let querryId = req.params.id;
    let productTodelete = allProducts.find((aProd) => aProd.productId == querryId);
    if (productTodelete) {
        //splice the list or filter
        allProducts = allProducts.filter((aProduct) => aProduct.productId != querryId); //Returns all elements of the array that meets the condition then removes the one that doesn't meet it
        res.send(`Product with ID: ${querryId} deleted successfully\nallProducts: ${JSON.stringify(allProducts)}`);
    }
    else {
        res.send(`Product with ID: ${querryId} not found`);
    }

})




//PATCH: change a data of a producct
//PUT: change the entire data of a product
//Update a user by ID
router.patch('/:id', (req, res) => {
    let querryId = req.params.id;

    //extract any passed data that requires change
    const updProduct = req.body.product;
    const updPrice = req.body.price;
    const updStore = req.body.store;
    const updQuantity = req.body.quantity;
    const updIsStoreVerified = req.body.isStoreVerified;

    let productToUpdate = allProducts.find((aProd) => aProd.productId == querryId); //Get a reference of the object if it exists

    const wrongParameters = validateBodyParams(req.body); //validate body

    if (wrongParameters.length > 0) {
        res.send(wrongParameters.join('\n'))
    }
    else {
        if (productToUpdate) { //If the product exists

            if (updProduct) {
                productToUpdate.product = updProduct;
                res.send(`Product with ID: ${querryId} updated successfully\nProduct: ${JSON.stringify(productToUpdate)}`);
            }

            if (updPrice) {
                productToUpdate.price = updPrice;
                res.send(`Product with ID: ${querryId} updated successfully\nProduct: ${JSON.stringify(productToUpdate)}`);
            }

            if (updStore) {
                productToUpdate.store = updStore;
                res.send(`Product with ID: ${querryId} updated successfully\nProduct: ${JSON.stringify(productToUpdate)}`);
            }

            if (updQuantity) {
                productToUpdate.quantity = updQuantity;
                res.send(`Product with ID: ${querryId} updated successfully\nProduct: ${JSON.stringify(productToUpdate)}`);
            }

            if (updIsStoreVerified) {
                productToUpdate.isStoreVerified = updIsStoreVerified;
                res.send(`Product with ID: ${querryId} updated successfully\nProduct: ${JSON.stringify(productToUpdate)}`);
            }
        }
        else {
            res.send(`Product with ID: ${querryId} not found`);
        }
    }


})



















export default router; //so we can read it in Index.js
