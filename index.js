const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

//

//


app.use((req, res)=>{
    res.send("This is home page");
})

app.listen(port, ()=>{
    console.log(`Server is running at ${port}`);
});