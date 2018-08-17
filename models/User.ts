import * as Sequelize from "sequelize-typescript";

@Sequelize.Table({ tableName: "users" })
export default class User extends Sequelize.Model<User> {
  @Sequelize.IsUUID(4)
  @Sequelize.PrimaryKey
  @Sequelize.Unique
  @Sequelize.Column({ defaultValue: Sequelize.DataType.UUIDV4 })
  id: string;

  @Sequelize.Unique
  @Sequelize.Column
  email: string;

  @Sequelize.Column
  name: string;

  @Sequelize.CreatedAt
  @Sequelize.Column
  createdAt: Date;
}
