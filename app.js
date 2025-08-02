const Express = require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const Bcrypt = require("bcrypt")
const Jwt = require("jsonwebtoken")
const userModel = require("./models/users")

let app = Express()


app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb+srv://amruthabinu:amruthabinu2002@cluster0.bwn2sfy.mongodb.net/blogDb?retryWrites=true&w=majority&appName=Cluster0")


// SignIn
app.post("/signin", async (req, res) => {

    let input = req.body;
    let result = userModel.find({ email: req.body.email }).then(
        (items) => {
            if (items.length > 0) {

                const passwordValidator = Bcrypt.compareSync(req.body.password, items[0].password);
                if (passwordValidator) {

                    Jwt.sign({ email: req.body.email }, "blogApp", { expiresIn: "1d" },
                        (error, token) => {
                            if (error) {

                                res.json({ "status": "error", "errormessage": error });

                            } else {

                                res.json({ "status": "success", "token": token, "userId": items[0]._id });

                            }
                        });

                }
                else {
                    res.json({ "status": "Incorrect password" });
                }

            } else {
                res.json({ "status": "Invalid email id" });
            }
        }
    ).catch((err) => {
        res.json({ "status": "error", "errormessage": err.message });
    });
});





// Signup
app.post("/signup", async (req, res) => {

    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword


    userModel.find({ email: req.body.email }).then(
        (items) => {
            if (items.length > 0) 
            {
                res.json({ "status": "email id already exist" })
            }
            else 
            {
                let result = new userModel(input)
                result.save()
                res.json({ "status": "success" })
            }

        }
    ).catch(
        (error) => { }
    )




})



app.listen(3030, () => {
    console.log("server is running")
})