const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Admin = new Schema({
  id: Schema.Types.ObjectId,
  email: String,
  password: String,
  session: String,
})

const Product = new Schema({
  id: Schema.Types.ObjectId,
  name: String,
  size: String,
  type: String,
  price: Number,
  amount: { type: Number, required: false }
}, {timestamps: true});

const Contractor = new Schema({
  id: Schema.Types.ObjectId,
  name: String,
  location: String,
}, {timestamps: true})

const Sale = new Schema({
  id: Schema.Types.ObjectId,
  custormer: { type: Schema.Types.ObjectId, ref: 'Contractor' },
  product: [Product],
  delivered: { type: Boolean, default: false}

}, {timestamps: true})

module.exports = {
  Admin: mongoose.model("Admin", Admin),
  Product: mongoose.model("Product", Product),
  Contractor: mongoose.model("Contractor", Contractor),
  Sale: mongoose.model("Sale", Sale)
}