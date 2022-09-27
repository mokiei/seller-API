const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const userRoute = require("./routes/userRoutes")
const authRoute = require("./routes/auth")
const sellerRoute = require("./routes/sellerRoutes")
const sellerAuthRoute = require("./routes/sellerauth")

dotenv.config()

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DBConnection successful")).catch((err)=>{console.log(err)})

app.use(express.json())
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/seller", sellerRoute);
app.use("/api/sellerauth", sellerAuthRoute);

app.listen(process.env.PORT || 5000, ()=>{
   console.log("Backend server is running");
});