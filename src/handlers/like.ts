import { Router } from 'express';
import { bodyParserBodyMiddleware } from '../middlewares/bodyParser';
import { User } from '../models/User';
import { isAuthenticated } from '../utils/passport';
import * as LikeManager from '../controllers/LikeManager';

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
      const resp = await LikeManager.likeImage({ UserId, ImageId, type });
      return res.json(resp);
    } catch (error) {
      console.log(error.stack);
      return res.status(500).json({
        title: 'Internal Server Error',
        detail: error.message
      });
    }
  }
);

export const LikeRoutes = routes;
