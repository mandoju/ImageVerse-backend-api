import { Router } from 'express';
import { Image } from '../models/Image';
import { upload } from '../services/image-upload';

const routes = Router();
const singleUpload = upload.single('image');

routes.get('/', async (req, res) => {
  const images = await Image.scan().exec();
  return res.json({ images });
});

routes.get('/:id', async (req, res) => {
  const image = await Image.get(req.params.id);
  return res.json(image);
});

routes.post('/', async (req, res) => {
  singleUpload(req, res, async function (err: any) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: 'Image Upload Error', detail: err.message }]
      });
    }
    const image = await Image.create({
      title: req.body.title,
      // @ts-ignore : Problem o @type, attribute location does exist on file
      url: req.file.location
    });
    return res.json({ ...image });
  });
});

routes.put('/:id', async (req, res) => {
  // @ts-ignore
  const image = await Image.update(req.params.id, req.body);
  return res.json(image);
});

routes.delete('/:id', async (req, res) => {
  await Image.delete(req.params.id);
  return res.json({ msg: 'Deleted' });
});

export { routes };
