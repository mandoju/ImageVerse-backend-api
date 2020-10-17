import { Router } from 'express';
import { bodyParserBodyMiddleware } from '../middlewares/bodyParser';
import { Image } from '../models/Image';
import { Like } from '../models/Like';
import { User } from '../models/User';
import { upload } from '../services/image-upload';
import { isAuthenticated } from '../utils/passport';

const routes = Router();

routes.post(
  '/',
  isAuthenticated,
  bodyParserBodyMiddleware,
  async (req, res) => {
    try {
      if (!req.body.id) {
        res.send(400).send({ message: 'missing image id' });
      }
      //@ts-ignore
      const userId: string = req.user!.id;
      const imageId: string = req.body.id;
      const checkLiked = await Like.get({ userId, imageId }); //de(userId);
      if (checkLiked) {
        Like.delete({ userId, imageId });
        Image.update({ id: imageId }, { $ADD: { likeCount: -1 } });
      } else {
        await Like.create({
          userId,
          imageId
        });
        Image.update({ id: imageId }, { $ADD: { likeCount: 1 } });
      }
      return res.json();
    } catch (error) {
      return res.status(500).send({
        errors: [{ title: 'Internal Server Error', detail: error }]
      });
    }
  }
);

routes.get('/user', isAuthenticated, async (req, res) => {
  try {
    //@ts-ignore
    const userId: string = req.user!.id;
    const userLikes = await Like.query({ userId }).all().exec(); //de(userId);
    return res.json(userLikes);
  } catch (error) {
    return res.status(500).send({
      errors: [{ title: 'Internal Server Error', detail: error }]
    });
  }
});

export const LikeRoutes = routes;
