import { Router } from 'express';
import passport from 'passport';
import { Image } from '../models/Image';
import { upload } from '../services/image-upload';
import { isAuthenticated } from '../utils/passport';
import * as ImageManager from '../controllers/ImageManager';

const routes = Router();
const singleUpload = upload.single('image');

routes.get(
  '/',
  passport.authenticate(['jwt', 'anonymous'], { session: false }),
  async (req, res, next) => {
    const page = Number(req.query.page) || 0;
    const user = req.user;
    const images = await ImageManager.getImages({ user, page });
    return res.json({ images });
  }
);

routes.get<{ id: string }>('/:id', async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'Missing image id' });
  }
  const image = await Image.findByPk(req.params.id);
  return res.json(image);
});

routes.post('/', isAuthenticated, async (req, res) => {
  singleUpload(req, res, async function (err: any) {
    if (err) {
      return res
        .status(422)
        .send({ title: 'Image Upload Error', message: err.message });
    }
    try {
      const { file, user } = req;
      const { title } = req.body;
      const image = await ImageManager.createImage({ user, title, file });
      return res.json(image.toJSON());
    } catch (error) {
      console.log(error.stack);
      return res
        .status(500)
        .send({ title: 'Internal Server Error', detail: error });
    }
  });
});

routes.delete('/:id', isAuthenticated, async (req, res) => {
  const { id: idString } = req.params;
  const id = Number(idString);
  await ImageManager.destroyImage({ id });
  return res.json({ msg: 'Deleted' });
});

export const ImageRoutes = routes;
