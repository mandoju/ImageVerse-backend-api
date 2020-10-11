import { Router } from 'express';
import { Image } from '../models/Image';

const routes = Router();

routes.get('/', async (req, res) => {
  const images = await Image.scan().exec();
  return res.json({ images });
});

routes.get('/:id', async (req, res) => {
  const image = await Image.get(req.params.id);
  return res.json(image);
});

routes.post('/', async (req, res) => {
  const image = await Image.create(req.body);
  return res.json(image);
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
