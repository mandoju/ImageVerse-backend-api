export const checkLikeValue = (like: string) => {
  switch (like) {
    case 'like':
    case 'dislike':
      return like;
    default:
      throw new Error('like type not exist');
  }
};
