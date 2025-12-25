//The index.js will basically be for setup

import express from 'express'; //when in package.json set type = "module"
import bodyParser from 'body-parser'; //To take incoming post request bodies
// const express = require('express');//when in package.json set type = "commonjs"

///Other Routes
import productsRoutes from './routes/products.js';




const app = express(); 
const PORT = 2;

app.use(bodyParser.json()); 
app.use('/products', productsRoutes); //all routes mentioned here starts with /products

app.listen(PORT,()=>{
    console.log(`We are deployed on http://localhost:${PORT}`);
});



//JUST SOMETHIHNG TO TEST YOUR SERVER,
app.get('/health', (req, res) => {
  res.send('Bad guy!!!, Your server is healthy');
});

