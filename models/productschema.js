import mongoose, { Mongoose } from "mongoose"; //for mongodb

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    store: {
      type: String,
      required: [true, "Product store is required"],
    },
    imgUrl: {
      type: String,
      required: [true, "Product img is required"],
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, "Product img is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Product available quantity is required"],
    },
  },
  { timestamps: true },
);

// export default productSchema;

export const Product = mongoose.model('Product', productSchema);