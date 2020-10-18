import { Model, DataTypes, Association, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { Like } from './Like';
import { User } from './User';
interface ImageAttributes {
  id: number;
  title: string;
  url: string;
}

interface ImageCreationAttributes extends Optional<ImageAttributes, 'id'> {}

class Image
  extends Model<ImageAttributes, ImageCreationAttributes>
  implements ImageAttributes {
  public id!: number;
  public title!: string;
  public url!: string;
  public UserId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly User?: User;

  public static associations: {
    User: Association<Image, User>;
    Like: Association<Image, Like>;
  };
}
Image.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    url: {
      type: new DataTypes.STRING(256),
      allowNull: false
    }
  },
  {
    tableName: 'image',
    sequelize // passing the `sequelize` instance is required
  }
);
Image.belongsTo(User, {
  targetKey: 'id'
});
// @ts-ignore
Image.belongsToMany(User, { through: Like, as: 'usersLiked' });
Image.hasMany(Like);
// @ts-ignore
User.belongsToMany(Image, { through: Like, as: 'imagesLiked' });
User.hasMany(Image);

export { Image };
