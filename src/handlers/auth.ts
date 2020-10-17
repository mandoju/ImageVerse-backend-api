import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import passport from 'passport';
import { User } from '../models/User';
import { getJwtEnviromentVariables } from '../utils/enviroment';
import { isAuthenticated } from '../utils/passport';

const routes = Router();

routes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

routes.get(
  '/google/redirect',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }),
  (req, res) => {
    if (!req.user) {
      return res.status(400).send('Missing user');
    }
    const { jwtSecret } = getJwtEnviromentVariables();

    let token = sign(
      {
        data: req.user
      },
      jwtSecret,
      { expiresIn: 60 }
    ); // expiry in seconds
    res.cookie('jwt', token);
    res.redirect('/');
  }
);

routes.get('/logout', isAuthenticated, (req, res) => {
  req.logout();
  res.send({ message: 'ok' });
});

export const AuthRoutes = routes;
