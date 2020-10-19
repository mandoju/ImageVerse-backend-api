import { Model, DataTypes, Association, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { Like } from './Like';
import { User } from './User';
interface TokenAttributes {
  id: number;
  tokenId: string;
  userId: number;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface TokenCreationAttributes extends Optional<TokenAttributes, 'id'> {}

class Token
  extends Model<TokenAttributes, TokenCreationAttributes>
  implements TokenAttributes {
  public id!: number;
  public tokenId!: string;
  public userId!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: User;

  public static associations: {
    creator: Association<Token, User>;
  };
}
Token.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER
    },
    tokenId: {
      type: new DataTypes.STRING(256),
      allowNull: true
    }
  },
  {
    tableName: 'token',
    sequelize // passing the `sequelize` instance is required
  }
);
Token.belongsTo(User, { targetKey: 'id', foreignKey: 'userId' });
User.hasMany(Token);

export { Token };
