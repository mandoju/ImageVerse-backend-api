import { Router } from 'express';
import passport from 'passport';
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
    res.send(req.user);
  }
);

routes.get('/logout', isAuthenticated, (req, res) => {
  req.logout();
  res.send({ message: 'ok' });
});

export const AuthRoutes = routes;
