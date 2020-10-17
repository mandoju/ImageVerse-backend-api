import { Router } from 'express';
import { bodyParserBodyMiddleware } from '../middlewares/bodyParser';
import { Image } from '../models/Image';
import { Like } from '../models/Like';
import { User } from '../models/User';
import { isAuthenticated } from '../utils/passport';

const routes = Router();

routes.post(
  '/:id',
  isAuthenticated,
  bodyParserBodyMiddleware,
  async (req, res) => {
    try {
      //@ts-ignore
      const userId: number = Number(req.user!.id);
      const imageId: number = Number(req.params.id);
      if (!imageId) {
        res.send(400).send({ message: 'missing image id' });
      }

      const checkLiked = await Like.findOne({ where: { userId, imageId } });
      if (checkLiked) {
        Like.destroy({ where: { userId, imageId } });
      } else {
        await Like.create({
          userId,
          imageId,
          type: true
        });
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
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(500).json({ message: 'User does not exist' });
    }
    //@ts-ignore
    const likedImages = await user.getImagesLikes();
    return res.json(likedImages.toJSON());
  } catch (error) {
    return res.status(500).send({
      errors: [{ title: 'Internal Server Error', detail: error }]
    });
  }
});

export const LikeRoutes = routes;
