const route = require("express").Router();

const {signUp, signIn}=require("../services/auth.services")


route.post("/signup",signUp);

route.post("/signin", signIn);


module.exports = route;