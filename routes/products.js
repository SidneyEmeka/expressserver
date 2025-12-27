//Here will be for routing, all routes here starts with /products
import express from 'express';
const router = express.Router(); //instatiating routes
import { getAllProducts, addAProduct, getAProductById, deleteAProduct, updateAProduct }  from '../controllers/productcontroller.js';




///ROUTES
//Get all Products
router.get('/all', getAllProducts);

//Find a particcular producct by ID
router.get('/:id', getAProductById
);

//Add a Product
router.post('/addproduct', addAProduct)

//delete a product by ID
router.delete('/:id', deleteAProduct)


//Update a user by ID
router.patch('/:id', updateAProduct)



export default router; //so we can read it in Index.js. PS: the default keyword is used so that you can noww import it anywhere with any name of choice. like it mmakes the impoort naame flexible



//PATCH: change a data of a producct
//PUT: change the entire data of a product