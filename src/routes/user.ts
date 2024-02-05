import express from "express";

import userController from "../controllers/user.controller";

const _router = express.Router();



//Login
_router.post("/user/login", userController.loginUser);

//Register
_router.post("/user/register", userController.registertUser);

export const routerUsers = _router;
