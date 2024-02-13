import express from "express";

import userController from "./user.controller";

const _router = express.Router();



//Login
_router.post("/user/login", userController.loginUser);

//Register
_router.post("/user/register", userController.registertUser);

export const router = _router;
