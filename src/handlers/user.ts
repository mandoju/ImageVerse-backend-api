import { Router } from 'express';
import { Image } from '../models/Image';
import { isAuthenticated } from '../utils/passport';

const routes = Router();

routes.get('/', isAuthenticated, async (req, res) => {
  return res.json(req.user);
});

routes.get('/images', isAuthenticated, async (req, res) => {
  //@ts-ignore
  const userId: string = req.user!.id;
  const query = Image.query('creator').where('id').eq(userId);
  // @ts-ignore: dynamoose type error.
  const images = await query.exec();
  return res.json({ images });
});

export const UserRoutes = routes;
