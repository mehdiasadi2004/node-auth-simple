require("dotenv").config();
const express = require("express");
const conectToDB = require("./database/db")
const authRoutes = require("./routes/auth-routs")
const homeRoutes = require("./routes/home-routes")
const adminRoutes = require("./routes/admin-routes")
const uploudImageRoutes = require("./routes/image-routes")
// middleware 



conectToDB()
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", uploudImageRoutes);

app.listen(port, () => {
  console.log("server is running");
});
