import { Router } from 'express';
import passport from 'passport';

const routes = Router();

routes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

routes.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send(req.user);
  res.send('you reached the redirect URI');
});

routes.get('/logout', (req, res) => {
  req.logout();
  res.send(req.user);
});

export const AuthRoutes = routes;
