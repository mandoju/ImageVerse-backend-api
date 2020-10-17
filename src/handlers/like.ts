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
      const UserId: number = Number(req.user!.id);
      const ImageId: number = Number(req.params.id);
      if (!ImageId) {
        res.send(400).send({ message: 'missing image id' });
      }
      //@ts-ignore
      const checkLiked = await Like.findOne({ where: { UserId, ImageId } });
      if (checkLiked) {
        //@ts-ignore
        Like.destroy({ where: { userId, imageId } });
      } else {
        await Like.create({
          //@ts-ignore
          UserId,
          //@ts-ignore
          ImageId,
          type: true
        });
      }
      return res.json({ message: 'success' });
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
    const UserId: string = req.user!.id;
    const user = await User.findByPk(UserId);
    if (!user) {
      return res.status(500).json({ message: 'User does not exist' });
    }
    //@ts-ignore
    const likedImages = await user.getImagesLiked();
    return res.json(likedImages);
  } catch (error) {
    console.log(error.stack);
    return res.status(500).send({
      errors: [{ title: 'Internal Server Error', detail: error }]
    });
  }
});

export const LikeRoutes = routes;
