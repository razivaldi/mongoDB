const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    colors: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
    },
    brand: {
      type: String,
    },
    reviews: [
      {
        message : {
          type: String
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      }
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.methods.addReview = function (userId, message) {
  this.reviews.push({ userId, message });
  return this.save();
}

module.exports = mongoose.model("Product", productSchema);
