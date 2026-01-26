//The index.js will basically be for setup

import express from 'express'; //when in package.json set type = "module"
import bodyParser from 'body-parser'; //To take incoming post request bodies
// const express = require('express');//when in package.json set type = "commonjs"
import mongoose, { Mongoose } from 'mongoose'; //for mongodb

///Other Routes
import productsRoutes from './routes/products.js';
import userRoutes from './routes/user.js';


const app = express(); 
const PORT = 2;


//MongoDb
mongoose.connect(`${process.env.CONNECTION_STRING}`).then((e)=>{
console.log('You don chook plug');

//start app if sucessful
app.listen(PORT,()=>{
    console.log(`We are deployed on http://localhost:${PORT}`);
});

}).catch((err)=>{
  console.log(`connection no work ooo ${err}`)
});






//Middlewares
app.use(bodyParser.json()); 
app.use('/products', productsRoutes); //all routes mentioned here starts with /products
app.use('/users', userRoutes); //all routes here starts with /users





//JUST SOMETHIHNG TO TEST YOUR SERVER,
app.get('/health', (req, res) => {
  res.status(200).send('Bad guy!!!, Your server is healthy');
});





//sudo mongod --dbpath /Users/mac/data/db t