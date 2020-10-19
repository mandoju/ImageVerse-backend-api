import { Like } from '../models/Like';

export const likeImage = async ({
  UserId,
  ImageId,
  type
}: {
  UserId: number;
  ImageId: number;
  type: string;
}) => {
  //@ts-ignore
  const checkLiked = await Like.findOne({ where: { UserId, ImageId } });
  if (type === 'remove') {
    await checkLiked.destroy();
    return { message: 'like deleted' };
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
  return { message: 'success' };
};
