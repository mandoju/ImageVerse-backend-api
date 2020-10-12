import { Router } from 'express';
import passport from 'passport';

const routes = Router();

routes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

routes.get('/google/redirect', passport.authenticate('google'));

export const AuthRoutes = routes;
