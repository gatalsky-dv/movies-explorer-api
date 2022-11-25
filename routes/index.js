const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');
const { createUser, login } = require('../controllers/users');
const { loginValidation, createUserValidation } = require('../middlewares/validation');

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('/*', (req, res, next) => {
  next(new NotFound('Пользователь не найден'));
});

module.exports = router;