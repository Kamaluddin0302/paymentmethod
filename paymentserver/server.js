let express = require("express");
let cors = require("cors")

let app = express();
app.listen(3001, () => {
})
app.use(cors())
app.get("/", (req, res) => {
    res.send({
        message: "Its Running"
    })
})
app.use(express.json())
app.use("/", require("./router"))