import cookieParser from 'cookie-parser';
import express from "express";
import session from "express-session";
import 'dotenv/config';
import users from "./route/user.js"
import advisingRoutes from "./route/advising.js";
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

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin:process.env.FE_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    }),
);

app.set("trust proxy", 1);

app.use(
    session({
        secret: process.env.SESSION_TICKET || "secretkey",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: true,
            sameSize: "none",
            maxAge: 1000 * 60 * 60
        },
    })
);


app.use(myLogger);
app.use('/user', users);
app.use("/api/advising", advisingRoutes);

export default app;
