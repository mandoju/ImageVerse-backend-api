import { Model, DataTypes, Association, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { User } from './User';
interface ImageAttributes {
  id: number;
  title: string;
  url: string;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface ImageCreationAttributes extends Optional<ImageAttributes, 'id'> {}

class Image
  extends Model<ImageAttributes, ImageCreationAttributes>
  implements ImageAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public title!: string;
  public url!: string; // for nullable fields

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  public readonly user?: User; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    creator: Association<Image, User>;
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
Image.belongsTo(User, { targetKey: 'id', foreignKey: 'creator' });
User.hasMany(Image);

export { Image };
