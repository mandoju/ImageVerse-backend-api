import { Condition } from 'dynamoose';
import { SortOrder } from 'dynamoose/dist/General';
import { Router } from 'express';
import { Image } from '../models/Image';
import { User } from '../models/User';
import { upload } from '../services/image-upload';
import { isAuthenticated } from '../utils/passport';

const routes = Router();
const singleUpload = upload.single('image');

routes.get('/', async (req, res) => {
  const images = await Image.findAll({
    include: 'User',
    limit: 20,
    order: [['createdAt', 'DESC']]
  });
  return res.json({ images });
});

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
      return res.status(422).send({
        errors: [{ title: 'Image Upload Error', detail: err.message }]
      });
    }
    try {
      //@ts-ignore
      const user = await User.findOne({ where: { id: req.user.id } });
      if (!user) {
        throw new Error('User does not exist!');
      }
      const image = await user.createImage({
        title: req.body.title,
        // @ts-ignore : Problem o @type, attribute location does exist on file
        url: req.file.location
      });
      return res.json(image.toJSON());
    } catch (error) {
      console.log(error.stack);
      return res.status(500).send({
        errors: [{ title: 'Internal Server Error', detail: error }]
      });
    }
  });
});

routes.put<{ id: string }, any, any>(
  '/:id',
  isAuthenticated,
  async (req, res) => {
    const id = Number(req.params.id);

    const newImage: Image = { ...req.body, id };
    //@ts-ignore
    const oldImage = await Image.findByPk(id);
    if (!oldImage) {
      return res.status(500).json({ message: 'image does not exist' });
    }
    const image = await oldImage.update(newImage);
    return res.json(image.toJSON());
  }
);

routes.delete('/:id', isAuthenticated, async (req, res) => {
  await Image.destroy({ where: { id: req.params.id } });
  return res.json({ msg: 'Deleted' });
});

export const ImageRoutes = routes;
