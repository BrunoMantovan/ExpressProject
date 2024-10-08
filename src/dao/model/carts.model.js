import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
        },
        quantity:{
            type: Number,
            default: 1
        }
      },
    ],
    default: [],
  },
});

export const cartsModel = mongoose.model("carts", cartsSchema)
