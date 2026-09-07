const service = require('./users.service');
const { success } = require('../../utils/apiResponse');

async function list(req, res, next) {
  try {
    const { data, pagination } = await service.listUsers(req.query);
    return success(res, 200, data, { pagination });
  } catch (err) {
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const user = await service.getUserById(req.params.id);
    return success(res, 200, user);
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const user = await service.createUser(req.body);
    return success(res, 201, user);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const user = await service.updateUser(req.params.id, req.body);
    return success(res, 200, user);
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteUser(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
