const service = require('./auth.service');
const { success } = require('../../utils/apiResponse');

async function register(req, res, next) {
  try {
    const result = await service.register(req.body);
    return success(res, 201, result);
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await service.login(req.body.email, req.body.password);
    return success(res, 200, result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };
