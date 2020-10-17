import { Image } from './Image';
import {
  Sequelize,
  Model,
  ModelDefined,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional
} from 'sequelize';
import { sequelize } from '../services/database';

interface UserAttributes {
  id: number;
  providerId: string;
  email: string;
  name: string;
  provider: string;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public providerId!: string;
  public email!: string;
  public name!: string;
  public provider!: string; // for nullable fields

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getImages!: HasManyGetAssociationsMixin<Image>; // Note the null assertions!
  public addImage!: HasManyAddAssociationMixin<Image, number>;
  public hasImage!: HasManyHasAssociationMixin<Image, number>;
  public countImagess!: HasManyCountAssociationsMixin;
  public createImage!: HasManyCreateAssociationMixin<Image>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  public readonly images?: Image[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    images: Association<User, Image>;
  };
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    providerId: {
      type: new DataTypes.STRING(30)
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false
    },
    provider: {
      type: new DataTypes.STRING(8),
      allowNull: false
    }
  },
  {
    tableName: 'user',
    sequelize // passing the `sequelize` instance is required
  }
);

export { User };
