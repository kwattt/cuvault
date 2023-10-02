import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const createUser = catchAsync(async (req, res) => {
  const { email, password, name, role } = req.body;
  const user = await userService.createUser(email, password, name, role);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getMe = catchAsync(async (req, res) => {
  // get username by decoding bearer token in req header
  let bearer = req.headers.authorization;
  if (!bearer) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  bearer = bearer.split(' ')[1];
  let payload
  try {
    payload = jwt.verify(bearer, config.jwt.secret);
  }

  catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  // check if not expired 
  
  const userId = Number(payload.sub);
  let user = await userService.getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // remove password field 
  res.send({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
})

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe
};
