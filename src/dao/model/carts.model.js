import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
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
