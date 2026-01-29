import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Product } from '../models/productschema.js';
import CloudinaryService from '../configs/cloudinaryconfig.js';

///CRUD OPERATIONS WITH IMAGE UPLOAD

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
export const getAllProducts = async (req, res) => { 
    try {
        const allProducts = await Product.find();
        res.status(200).send({
            "message": allProducts.length > 1 ? `There are ${allProducts.length} products` : `You have ${allProducts.length} product`, 
            "data": allProducts
        }); 
    } catch (err) {
        res.status(400).send({
            "message": "Products not found", 
            "data": err.message
        });
    }
}


export const addAProduct = async (req, res) => {
    console.log('📦 Adding new product...');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    try {
        if (req.file) {
            console.log('📸 Uploading image to Cloudinary...');
            
            try {
                const uploadResult = await CloudinaryService.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {folder: 'products'});
      console.log(uploadResult);
                let productData = {
            name : req.body.name,
  description: req.body.description,
  price: req.body.price,
  store: req.body.store,
  quantity: req.body.quantity,
  imgUrl: uploadResult.secure_url,
  cloudinaryPublicId:uploadResult.public_id
        };
                console.log('✅ Image uploaded successfully:', productData);
                 
        // Create and save product
       const theProduct = new Product(productData);
        await theProduct.save();

        res.status(201).send({
            "message": `${theProduct.name} from ${theProduct.store} added successfully`,
            "data": theProduct
        });

            } catch (uploadError) {
                console.error('❌ Image upload failed:', uploadError);
                return res.status(400).send({
                    "message": "Failed to upload image",
                    "data": uploadError.message
                });
            }
        }
    } catch (error) {
        console.error('❌ Error adding product:', error);
        res.status(500).send({
            "message": "Product not added",
            "data": error.message
        });
    }
}


export const getAProductById = async (req, res) => {
    let querryId = req.params.id;
    try {
        let theProduct = await Product.findById(querryId);
        
        if (theProduct) {
            res.status(200).send({
                "message": "Product found", 
                "data": theProduct
            });
        } else {
            res.status(404).send({
                "message": "Product not found", 
                "data": `Product with ID: ${querryId} not found`
            });
        }
    } catch (err) {
        res.status(500).send({
            "message": "Product not found", 
            "data": err.message
        });
    }
}

/**
 * @desc    Delete a product and its image from Cloudinary
 * @route   DELETE /api/products/:id
 * @access  Public
 */
export const deleteAProduct = async (req, res) => {
    let querryId = req.params.id;
    try {
        // First, find the product to get the cloudinary public ID
        let theProduct = await Product.findById(querryId);
        
        if (!theProduct) {
            return res.status(404).send({
                "message": "Product not found", 
                "data": `Product with ID: ${querryId} not found`
            });
        }

        // Delete image from Cloudinary if exists
        if (theProduct.cloudinaryPublicId) {
            console.log('🗑️  Deleting image from Cloudinary...');
            try {
                await CloudinaryService.deleteImage(theProduct.cloudinaryPublicId);
                console.log('✅ Image deleted from Cloudinary');
            } catch (deleteError) {
                console.error('⚠️  Warning: Failed to delete image from Cloudinary:', deleteError);
                // Continue with product deletion even if image deletion fails
            }
        }

        // Delete product from database
        await Product.findByIdAndDelete(querryId);
        
        res.status(200).send({
            "message": "Product deleted", 
            "data": theProduct
        });
    } catch (err) {
        res.status(500).send({
            "message": "Product not deleted", 
            "data": err.message
        });
    }
}

/**
 * @desc    Update a product with optional new image
 * @route   PUT /api/products/:id
 * @access  Public
 */
export const updateAProduct = async (req, res) => {
    let querryId = req.params.id;
    
    console.log('📝 Updating product...');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    try {
        // Find existing product
        let product = await Product.findById(querryId);
        
        if (!product) {
            return res.status(404).send({
                "message": "Product not found", 
                "data": `Product with ID: ${querryId} not found`
            });
        }

        // Update basic fields (convert types properly from form-data strings)
        if (req.body.name) product.name = req.body.name;
        if (req.body.price) product.price = parseFloat(req.body.price);
        if (req.body.store) product.store = req.body.store;
        if (req.body.quantity !== undefined) product.quantity = parseInt(req.body.quantity);

        // Handle new image upload
        if (req.file) {
            console.log('📸 Uploading new image to Cloudinary...');
            
            try {
                // Delete old image if exists
                if (product.cloudinaryPublicId) {
                    console.log('🗑️  Deleting old image from Cloudinary...');
                    await CloudinaryService.deleteImage(product.cloudinaryPublicId);
                }
                
                // Upload new image
                const uploadResult = await CloudinaryService.uploadImage(req.file.buffer, 'products');
                product.imageUrl = uploadResult.url;
                product.cloudinaryPublicId = uploadResult.publicId;
                
                console.log('✅ New image uploaded successfully');
            } catch (uploadError) {
                console.error('❌ Image upload failed:', uploadError);
                return res.status(400).send({
                    "message": "Failed to upload new image",
                    "data": uploadError.message
                });
            }
        }

        // Save updated product
        await product.save();

        res.status(200).send({
            "message": "Product updated", 
            "data": product
        });
    } catch (error) {
        console.error('❌ Error updating product:', error);
        res.status(500).send({
            "message": "Product not updated", 
            "data": error.message
        });
    }
}

// JWT Token generation (your existing functions)
export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_WEB_TOKEN_SECRET, { expiresIn: "15m" });
}

export const allRefreshTokens = [];
export const generateRefreshsToken = (user) => {
    const rToken = jwt.sign(user, process.env.REFRESH_WEB_TOKEN_SECRET);
    allRefreshTokens.push(rToken);
    return rToken;
}

// Middleware (your existing middleware)
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const theToken = authHeader.split(' ')[1];
        console.log(`The token: ${theToken}`);
        console.log(authHeader);
        
        jwt.verify(theToken, process.env.ACCESS_WEB_TOKEN_SECRET, (err, foundUser) => {
            if (err) {
                return res.status(403).send({
                    "message": `Invalid Token`, 
                    "data": `Kindly use a correct token: ${err}`
                });
            }
            console.log(foundUser);
            req.foundUser = foundUser;
            next();
        });
    } else {
        res.status(400).send({
            "message": `Requires Token`, 
            "data": `Kindly use an Authorization Token`
        });
    }
}