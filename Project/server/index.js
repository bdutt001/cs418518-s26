import express from "express";
import 'dotenv/config';
import users from "./route/user.js"
import cors from "cors";

const app = express();
const port = 3000;

app.listen(port, ()=>{
    console.log('Server is listening on port ' + port);
})

const myLogger = function(req,res,next){
    console.log("middleware logged");
    next()
}

app.use(
    cors({
        origin:process.env.FE_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    }),
)

app.use(express.json());
app.use(myLogger);
app.use('/user', users);

export default app;
