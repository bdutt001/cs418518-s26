import cookieParser from 'cookie-parser';
import express from "express";
import session from "express-session";
import 'dotenv/config';
import users from "./route/user.js"
import advisingRoutes from "./route/advising.js";
import cors from "cors";

const app = express();

const myLogger = function(req,res,next){
    console.log("middleware logged");
    next()
}

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin:process.env.FE_ORIGIN,
        credentials: true,
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
            sameSite: "none",
            maxAge: 1000 * 60 * 60
        },
    })
);


app.use(myLogger);
app.use('/user', users);
app.use("/api/advising", advisingRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

export default app;
