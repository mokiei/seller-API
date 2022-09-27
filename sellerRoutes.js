const Seller = require("../models/Seller");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//get sellerId, productId, nicheId


 //Update
 router.put("/:id", verifyTokenAndAuthorization, async (req,res)=> {
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

    try{
       const updatedSeller = await User.findByIdAndUpdate(req.params.id, {
        $set:req.body
       },
       { new:true }
    );
    res.status(200).json(updatedSeller)
    }catch(err){
        res.status(500).json(err);
    }
});
//Delete
router.delete("/:sellerId", verifyTokenAndAdmin, async (req,res)=>{
  try{
   await Seller.findByIdAndDelete(req.params.id)
   res.status(200).json("Seller has been deleted...")
  }catch(err){
    res.status(500).json(err)
  }

});

//Get Seller
router.get("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
     const seller = await Seller.findById(req.params.id)
     const { password, ...others } = seller._doc;

        res.status(200).json(others);
    }catch(err){
      res.status(500).json(err)
    }
  
  });

//Get all Sellers
  router.get("/", verifyTokenAndAdmin, async (req,res) => {
    try{
     const sellers = query ? await Seller.find().sort({_id:-1}).limit(5) : await Seller.find();

        res.status(200).json(sellers);
    }catch(err){
      res.status(500).json(err)
    }
  
  });

  //Get user stats (Can be used on the admin dashboard)
  router.get("/stats", verifyTokenAndAdmin, async (req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try{

      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project:{
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          }, 
        },
      ])
      res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }

  });

//Get monthly income of seller
router.get("/income", verifyTokenAndAdmin, async (req,res)=> {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try{
          const income = await Seller.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "createdAt" },
                    sales: "$price",
                },
            },
                {
                    $group:{
                        _id: "$month",
                        total: { $sum: "$sales" },
                    },
                },
          ]);
      res.status(200).json(income)
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router;