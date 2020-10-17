import { Model, DataTypes, Association, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { User } from './User';
import { Image } from './Image';
interface LikeAttributes {
  userId: number;
  imageId: number;
  type: boolean;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface LikeCreationAttributes extends LikeAttributes {}

class Like
  extends Model<LikeAttributes, LikeCreationAttributes>
  implements LikeAttributes {
  public userId!: number;
  public imageId!: number;
  public type!: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: User;
  public readonly image?: Image;

  public static associations: {
    user: Association<User, Like>;
    image: Association<Image, Like>;
  };
}
Like.init(
  {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    imageId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    type: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  },
  {
    tableName: 'like',
    sequelize // passing the `sequelize` instance is required
  }
);
// Like.belongsTo(User, { targetKey: 'id', foreignKey: 'userId' });
// Like.belongsTo(Image, { targetKey: 'id', foreignKey: 'imageId' });

export { Like };
