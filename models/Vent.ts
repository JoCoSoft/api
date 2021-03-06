import * as Sequelize from "sequelize-typescript";
import User from "./User";

export type TVentStatus = "manufactured" | "registered";

@Sequelize.Table({ tableName: "vents", createdAt: false, updatedAt: false })
export default class Vent extends Sequelize.Model<Vent> {
  @Sequelize.IsUUID(4)
  @Sequelize.PrimaryKey
  @Sequelize.Unique
  @Sequelize.Column({ defaultValue: Sequelize.DataType.UUIDV4 })
  id: string;

  @Sequelize.Unique
  @Sequelize.Column
  serial: string;

  @Sequelize.Column
  codeHash: string;

  @Sequelize.Column
  status: TVentStatus;

  @Sequelize.ForeignKey(() => User)
  @Sequelize.Column
  userId: string;
}
