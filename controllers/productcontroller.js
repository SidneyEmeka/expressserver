import { v4 as uuidv4 } from 'uuid' //to generate unique IDs


let allProducts = [
    {
        product: "Mouse",
        price: 8500,
        store: "Sidswipe Gadgets",
        quantity: 60,
        isStoreVerified: false,
        productId: uuidv4()
    },
]; //Just in memory database for all products


///VALIDATIONS
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

function checkTypeMatch(bodyToCheck) {
    const errors = [];

    if (bodyToCheck["product"] !== undefined && typeof bodyToCheck["product"] !== 'string') {
        errors.push(`Product Must be a string`)
    }
    if (bodyToCheck["price"] !== undefined && typeof bodyToCheck["price"] !== 'number') {
        errors.push(`Price Must be a number`)
    }
    if (bodyToCheck["store"] !== undefined && typeof bodyToCheck["store"] !== 'string') {
        errors.push(`Store Must be a string`)
    }
    if (bodyToCheck["quantity"] !== undefined && typeof bodyToCheck["quantity"] !== 'number') {
        errors.push(`Quantity Must be a number`)
    }
    if (bodyToCheck["isStoreVerified"] !== undefined && typeof bodyToCheck["isStoreVerified"] !== 'boolean') {
        errors.push(`isStoreVerified Must be a boolean`)
    }

    return errors;
}


///CRUD
export const getAllProducts = (req, res) => { res.send(allProducts); }

export const addAProduct = (req, res) => {

    //validate the body
    const wrongParameters = validateBodyParams(req.body);
    const missingParammeters = checkMissingBodyParams(req.body);
    const typeMismatch = checkTypeMatch(req.body);

    if (wrongParameters.length > 0) {
        res.send(wrongParameters.join('\n'));
    }
    else if (missingParammeters.length > 0) {
        res.send(missingParammeters.join('\n'));
    }
    else if (typeMismatch.length > 0) {
        res.send(typeMismatch.join('\n'));
    }
    else {
        let newProduct = { ...req.body, productId: uuidv4() }; //Using spread operator to include all static product details then a dynamic ID
        allProducts.push(newProduct); //pushing into in-memory database
        res.send(`${newProduct.product} from ${newProduct.store} added successfully\nallProducts: ${JSON.stringify(allProducts)}`);

    }

}

export const getAProductById = (req, res) => { //notice how : is added in path, thats so we can pass anything there which we will collect as ID
    let querryId = req.params.id;
    let theProduct = allProducts.find((aProd) => aProd.productId == querryId);
    if (theProduct) {
        res.send(theProduct);
    } else {
        res.send(`Product with ID: ${querryId} not found`);
    }
}

export const deleteAProduct = (req, res) => {
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

}

export const updateAProduct = (req, res) => {
    let querryId = req.params.id;

    //extract any passed data that requires change
    const updProduct = req.body.product;
    const updPrice = req.body.price;
    const updStore = req.body.store;
    const updQuantity = req.body.quantity;
    const updIsStoreVerified = req.body.isStoreVerified;

    let productToUpdate = allProducts.find((aProd) => aProd.productId == querryId); //Get a reference of the object if it exists

    //validate body
    const wrongParameters = validateBodyParams(req.body);
    const typeMismatch = checkTypeMatch(req.body);

    if (wrongParameters.length > 0) {
        res.send(wrongParameters.join('\n'))
    }
    else if (typeMismatch.length > 0) {
        res.send(typeMismatch.join('\n'))
    }
    else {
        if (productToUpdate) { //If the product exists

            if (updProduct) {
                productToUpdate.product = updProduct;
            }

            if (updPrice) {
                productToUpdate.price = updPrice;
            }

            if (updStore) {
                productToUpdate.store = updStore;
            }

            if (updQuantity) {
                productToUpdate.quantity = updQuantity;
            }
            if (updIsStoreVerified !== undefined) {
                productToUpdate.isStoreVerified = updIsStoreVerified;
            }
            res.send(`Product with ID: ${querryId} updated successfully\nProduct: ${JSON.stringify(productToUpdate)}`);


        }
        else {
            res.send(`Product with ID: ${querryId} not found`);
        }
    }


}

