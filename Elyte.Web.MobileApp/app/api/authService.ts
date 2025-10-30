import { ResponseResult } from './../models/responseResult';
import { LoginResult } from './../models/auth/loginResult';
import { LoginCommand } from '../models/auth/loginCommand';
import http from './httpService';

function login(user: LoginCommand) {
  return http.post<LoginCommand, ResponseResult<LoginResult>>(`login`, user);
}

export default {
  login,
};
