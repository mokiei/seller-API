const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema({
    sellername: { type: String , required:true, unique: true},
    email:{type: String, required:true, unique: true},
    password: {type: String},
    isAdmin: {
        type: Boolean,
        default: false,
    },  
    sellerId: { type: String, unique: true},
    productId: { type: String, unique: true},
    image:  {type: String , required:true, unique: true},
    price: { type: Number , required:true, unique: true},
    description:  {type: String , required:true, unique: true},
    nicheId: { type:String, unique: true},
    niche:  {type: String , required:true, unique: true},
    tag: { type:String, required:true, unique: true}
},
 { timestamps: true }
);

module.exports = mongoose.model("Seller", SellerSchema)