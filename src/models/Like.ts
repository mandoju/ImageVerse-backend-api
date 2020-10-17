import { Model, DataTypes, Association, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { User } from './User';
import { Image } from './Image';
interface LikeAttributes {
  type: boolean;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface LikeCreationAttributes extends LikeAttributes {}

class Like
  extends Model<LikeAttributes, LikeCreationAttributes>
  implements LikeAttributes {
  public type!: boolean;
  public UserId!: number;
  public ImageId!: number;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly User?: User;
  public readonly Image?: Image;

  public static associations: {
    User: Association<User, Like>;
    Image: Association<Image, Like>;
  };
}
Like.init(
  {
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
//Like.belongsTo(User, { targetKey: 'id', foreignKey: 'userId' });
// Like.belongsTo(Image, { targetKey: 'id' });

export { Like };
