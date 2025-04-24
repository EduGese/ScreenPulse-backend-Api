import express from "express";

import userController from "./user.controller";

const _router = express.Router();



//Login
_router.post("/login", userController.loginUser);

//Register
_router.post("/register", userController.registertUser);

export const router = _router;
