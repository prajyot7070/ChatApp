import { Router } from "express";
import { register } from "../controllers/authentication";
const userRouter = Router();

//Signup
//- name, email, password
userRouter.post("/signup", register);

//Signin
//- email, password
userRouter.post("/signin", (req, res) => {
  res.send("Signin route");
})

userRouter.post("/logout", (req, res) => {
  res.send("logout route");
})

export default userRouter;



//4pzQmkovzFjBAl8s mongodb password
//maneprajyot756 username
