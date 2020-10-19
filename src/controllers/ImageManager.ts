import Multer from 'multer';
import { Sequelize } from 'sequelize';
import { Image } from '../models/Image';
import { User } from '../models/User';

export const getImages = async ({
  user,
  page
}: {
  user: any;
  page: number;
}) => {
  // @ts-ignore
  var attributes: any[] = Object.keys(Image.rawAttributes);
  const offset = page * 20;
  attributes.push([
    Sequelize.literal(
      '(SELECT COUNT(*)::integer FROM "like" where "like"."ImageId" = "Image"."id" and "like"."type" = \'like\')'
    ),
    'likesCount'
  ]);
  attributes.push([
    Sequelize.literal(
      '(SELECT COUNT(*)::integer FROM "like" where "like"."ImageId" = "Image"."id" and "like"."type" = \'dislike\')'
    ),
    'dislikesCount'
  ]);
  if (user) {
    //@ts-ignore
    const userId = user.id;

    attributes.push([
      Sequelize.literal(
        `(SELECT EXISTS (SELECT type FROM "like" where "like"."ImageId" = "Image"."id" and "like"."type" = 'like' and "like"."UserId" = ${userId}))`
      ),
      'liked'
    ]);
    attributes.push([
      Sequelize.literal(
        `(SELECT EXISTS (SELECT type FROM "like" where "like"."ImageId" = "Image"."id" and "like"."type" = 'dislike' and "like"."UserId" = ${userId}))`
      ),
      'disliked'
    ]);
  }
  const images = await Image.findAll({
    attributes,
    include: [
      //@ts-ignore
      { model: User, attributes: ['id', 'name'] }
    ],
    limit: 20,
    offset,
    order: [['createdAt', 'DESC']]
  });
  return images;
};

interface createImageProps {
  user: any;
  title: string;
  file: Express.Multer.File;
}

export const createImage = async ({ user, title, file }: createImageProps) => {
  const databaseUser = await User.findOne({ where: { id: user.id } });
  if (!databaseUser) {
    throw new Error('User does not exist!');
  }
  const image = await databaseUser.createImage({
    title: title,
    // @ts-ignore : Problem o @type, attribute location does exist on file
    url: file.location
  });
  return image;
};

export const updateImage = async ({ body, id }: { body: any; id: number }) => {
  const newImage: Image = { ...body, id };
  const oldImage = await Image.findByPk(id);
  if (!oldImage) {
    throw new Error('image does not exist');
  }
  const image = await oldImage.update(newImage);
  return image;
};

export const destroyImage = async ({ id }: { id: number }) => {
  return await Image.destroy({ where: { id: id } });
};
