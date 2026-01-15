import { v4 as uuidv4 } from 'uuid' //to generate unique IDs
import jwt from 'jsonwebtoken';



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
            errors.push(`kindly crosscheck the key - ${akey}`)
        }
    }

    return errors;
}

function checkMissingBodyParams(bodyToCheck) {
    const errors = [];

    for (let i = 0; i < validKeys.length; i++) {
        if (bodyToCheck[validKeys[i]] == undefined) {
            errors.push(`The key - ${validKeys[i]} is missing`)
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
export const getAllProducts =  (req, res) => { res.status(200).send({"message": allProducts.length>1?`There are ${allProducts.length} products`: `You have ${allProducts.length} product`, "data": allProducts}); }

export const addAProduct =  (req, res) => {

    //validate the body
    const wrongParameters = validateBodyParams(req.body);
    const missingParammeters = checkMissingBodyParams(req.body);
    const typeMismatch = checkTypeMatch(req.body);

    if (wrongParameters.length > 0) {
        res.status(400).send({"message":"One or more of your keys are incorrect", "data" : wrongParameters});
    }
    else if (missingParammeters.length > 0) {
        res.status(400).send({"message":"One or more of the required keys are missing", "data" : missingParammeters});
    }
    else if (typeMismatch.length > 0) {
        res.status(400).send({"message":"One or more of the required values are of the wrong data type", "data" : typeMismatch});
    }
    else {
        let newProduct = { ...req.body, productId: uuidv4() }; //Using spread operator to include all static product details then a dynamic ID
        allProducts.push(newProduct); //pushing into in-memory database
       res.status(201).send({"message": `${newProduct.product} from ${newProduct.store} added successfully`, "data":allProducts});
    }

}

export const getAProductById = (req, res) => { //notice how : is added in path, thats so we can pass anything there which we will collect as ID
    let querryId = req.params.id;
    let theProduct = allProducts.find((aProd) => aProd.productId == querryId);
    if (theProduct) {
        res.status(200).send({"message":"Product found", "data":theProduct})
    } else {
        res.status(404).send({"message":"Product not found", "data":`Product with ID: ${querryId} not found`});
    }
}

export const deleteAProduct = (req, res) => {
    let querryId = req.params.id;
    let productTodelete = allProducts.find((aProd) => aProd.productId == querryId);
    if (productTodelete) {
        //splice the list or filter
        allProducts = allProducts.filter((aProduct) => aProduct.productId != querryId); //Returns all elements of the array that meets the condition then removes the one that doesn't meet it
        res.status(200).send({"message":`Product deleted successfully`, "data":allProducts});
    }
    else {
        res.status(404).send({"message":"Product not deleted", "data":`Product with ID: ${querryId} not found`})
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
       res.status(400).send({"message":"One or more of your keys are incorrect", "data" : wrongParameters});

    }
    else if (typeMismatch.length > 0) {
    res.status(400).send({"message":"One or more of the required values are of the wrong data type", "data" : typeMismatch});

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
       res.status(200).send({"message": `Product updated successfully`, "data":productToUpdate});


        }
        else {
            res.status(400).send({"message":`Product not updated`, "data":`Product with ID: ${querryId} not found`});
        }
    }


}



//GenerateTokens
export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_WEB_TOKEN_SECRET, {expiresIn: "15s"});
}

export const allRefreshTokens = [];
export const generateRefreshsToken = (user) => {
    const rToken =jwt.sign(user, process.env.REFRESH_WEB_TOKEN_SECRET);
    allRefreshTokens.push(rToken);
    return rToken;

} 

//Middlewares
export const authenticateToken = (req,res, next) => {
const authHeader = req.headers['authorization'];
if(authHeader){
    const theToken = authHeader.split(' ')[1]; //get token position
    console.log(theToken);
     console.log(authHeader);
    jwt.verify(theToken, process.env.ACCESS_WEB_TOKEN_SECRET, (err, foundUser)=>{
        if(err) {return res.status(403).send({"message":`Invalid Token`, "data":`Kindly use an Correct Token`})}
        console.log(foundUser);
        req.foundUser = foundUser;
        next();
    })
}
else{
   res.status(400).send({"message":`Requires Token`, "data":`Kindly use an Authorization Token`});
}


}

