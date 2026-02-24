import express from "express";
import users from "./route/user.js"
const app = express();
const port = 3000;

app.listen(port, ()=>{
    console.log('Server is listening on port ' + port);
})

const myLogger = function(req,res,next){
    console.log("middleware logged");
    next()
}

app.use(myLogger);
app.use('/user', users);

export default app;
