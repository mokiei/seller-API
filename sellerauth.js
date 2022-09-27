const router = require("express").Router();
const Seller = require("../models/Seller")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

//Register Seller && hash password
router.post("/registerseller", async (req,res) => {
    const newSeller = new Seller({
        sellername: req.body.sellername,
        sellerId: req.body.id,
        productId: req.body.id,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        nicheId: req.body.id,
        niche: req.body.niche,
        tag: req.body.niche
    });


   try{
    const savedSeller = await newSeller.save()
    res.status(201).json(savedSeller)
   } catch (err) {
    res.status(400).json(err)
   }
})



//Login seller

router.post("/loginseller", async (req, res) =>{
     try{
        const seller = await Seller.findOne({ sellername: req.body.sellername });
        !seller && res.status(401).json("Wrong credentials!")

        const hashedPassword = CryptoJS.AES.decrypt(seller.password, process.env.PASS_SEC);
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        OriginalPassword !== req.body.password &&
         res.status(401).json("Invalid credentials!")

//Login Seller


//jsonwebtoken
const accessToken = jwt.sign({
    id: seller._id,
    isAdmin: seller.isAdmin

}, 
process.env.JWT_SEC,
{expiresIn:"30d"}
)
         const { password, ...others } = seller._doc;

        res.status(200).json({...others, accessToken});
     } catch (err) {
        res.status(500).json(err)
     }
});

module.exports = router