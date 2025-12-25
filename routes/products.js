import express from 'express';
import { v4 as uuidv4 } from 'uuid' //to generate unique IDs
const router = express.Router(); //instatiating routes

//all routes here starts with /users

//ALL Products

let allProducts = [
    {
    product:"Mouse",
    price:8500,
    store:"Sidswipe Gadgets",
    quantity:60,
    isStoreVerified:false,
     productId:uuidv4()
},
]; //Just in memory database

//Get all Products
router.get('/all', (req,res)=>{
res.send(allProducts);
});



//Add a Product
router.post('/addproduct',(req,res)=>{
let newProduct = {...req.body,productId:uuidv4()}; //Using spread operator to include all static product details then a dynamic ID
allProducts.push(newProduct); //pushing into in-memory database
res.send(`${newProduct.product} from ${newProduct.store} added successfully\nallProducts: ${JSON.stringify(allProducts)}`);
})



//Find a particcular producct by ID
router.get('/:id',(req,res)=>{ //notice how : is added in path, thats so we can pass anything there which we will collect as ID
let querryId = req.params.id;
let theProduct = allProducts.find((aProd)=> aProd.productId==querryId);
if(theProduct){
    res.send(theProduct);
}else{
    res.send(`Product with ID: ${querryId} not found`);     
}}
);

router.delete('/:id',(req,res)=>{
    let querryId= req.params.id;
    let productTodelete = allProducts.find((aProd)=> aProd.productId==querryId);
    if(productTodelete) {
        //splice the list or filter
       allProducts = allProducts.filter((aProduct)=> aProduct.productId!=querryId); //Returns all elements of the array that meets the condition then removes the one that doesn't meet it
        res.send(`Product with ID: ${querryId} deleted successfully\nallProducts: ${JSON.stringify(allProducts)}`);
    }
    else{
    res.send(`Product with ID: ${querryId} not found`);     
}

})




export default router; //so we can read it in Index.js
