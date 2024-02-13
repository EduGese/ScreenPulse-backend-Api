import {router} from './user.routes';
import UserController from './user.controller';
import UserService from './user.service';


export const userModule =  {router, UserController, UserService};