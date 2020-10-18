import { Router } from 'express';
import { Image } from '../models/Image';
import { isAuthenticated } from '../utils/passport';

const routes = Router();

routes.get('/', isAuthenticated, async (req, res) => {
  return res.json(req.user);
});

routes.get('/images', isAuthenticated, async (req, res) => {
  //@ts-ignore
  const UserId: number = req.user!.id;
  //@ts-ignore
  const images = await Image.findAll({ where: { UserId } });
  return res.json(images);
});

export const UserRoutes = routes;
