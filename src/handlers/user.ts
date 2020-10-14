import { Router } from 'express';
import passport from 'passport';
import { Image } from '../models/Image';

const routes = Router();

routes.get('/images', passport.authenticate('google'), async (req, res) => {
  const images = await Image.scan(req.user).exec();
  return res.json({ images });
});

export { routes };
