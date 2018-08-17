import * as Sequelize from "sequelize-typescript";
import User from "./User";

@Sequelize.Table({ tableName: "passwords" })
export default class Password extends Sequelize.Model<Password> {
  @Sequelize.IsUUID(4)
  @Sequelize.PrimaryKey
  @Sequelize.Unique
  @Sequelize.Column({ defaultValue: Sequelize.DataType.UUIDV4 })
  id: string;

  @Sequelize.Column
  password: string;

  @Sequelize.ForeignKey(() => User)
  @Sequelize.Column
  userId: string;

  @Sequelize.CreatedAt
  @Sequelize.Column
  createdAt: Date;
}
