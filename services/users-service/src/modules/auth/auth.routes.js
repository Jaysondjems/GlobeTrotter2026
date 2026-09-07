const { Router } = require('express');
const controller = require('./auth.controller');
const { validate } = require('../../middleware/validate');
const { validateRegister, validateLogin } = require('./auth.validation');

const router = Router();

router.post('/register', validate(validateRegister), controller.register);
router.post('/login', validate(validateLogin), controller.login);

module.exports = router;
