import { Router } from 'express';
import { bodyParserBodyMiddleware } from '../middlewares/bodyParser';
import { Like } from '../models/Like';
import { User } from '../models/User';
import { checkLikeValue } from '../utils/like';
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
      let type: string = req.body.type;
      if (!type) {
        return res.status(400).send({ message: 'missing like type' });
      }
      if (!ImageId) {
        return res.status(400).send({ message: 'missing image id' });
      }
      console.log(UserId);
      //@ts-ignore
      const checkLiked = await Like.findOne({ where: { UserId, ImageId } });
      if (type === 'remove') {
        await checkLiked.destroy();
        return res.json({ message: 'like deleted' });
      }
      if (checkLiked) {
        await checkLiked.update({
          ...checkLiked,
          type
        });
      } else {
        await Like.create({
          //@ts-ignore
          UserId,
          //@ts-ignore
          ImageId,
          type
        });
      }
      return res.json({ message: 'success' });
    } catch (error) {
      console.log(error.stack);
      return res.status(500).json({
        errors: [{ title: 'Internal Server Error', detail: error.message }]
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
    return res.send(likedImages);
  } catch (error) {
    console.log(error.stack);
    return res.status(500).send({
      errors: [{ title: 'Internal Server Error', detail: error.message }]
    });
  }
});

export const LikeRoutes = routes;
