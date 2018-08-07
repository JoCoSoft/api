import * as Sequelize from "sequelize-typescript";

@Sequelize.Table({ tableName: "vents" })
export default class Vent extends Sequelize.Model<Vent> {
  @Sequelize.IsUUID(4)
  @Sequelize.PrimaryKey
  @Sequelize.Column({ defaultValue: Sequelize.DataType.UUIDV4 })
  id: string;

  @Sequelize.Column codeHash: string;
  @Sequelize.Column status: string;
}
