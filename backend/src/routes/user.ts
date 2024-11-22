import { defaultMaxListeners } from "events";
import { Router } from "express";
const userRouter = Router();

//Signup
//- name, email, password
userRouter.get("/signup", (req, res) => {
  res.send("Signup route");
})

userRouter.get("/signin", (req, res) => {
  res.send("Signin route");
})

userRouter.get("/logout", (req, res) => {
  res.send("logout route");
})

export default userRouter;




