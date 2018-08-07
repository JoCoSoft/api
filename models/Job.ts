import * as Sequelize from "sequelize-typescript";

@Sequelize.Table({ tableName: "jobs", updatedAt: false })
export default class Job extends Sequelize.Model<Job> {
  @Sequelize.IsUUID(4)
  @Sequelize.PrimaryKey
  @Sequelize.Column({ defaultValue: Sequelize.DataType.UUIDV4 })
  id: string;

  @Sequelize.CreatedAt createdAt: Date;

  @Sequelize.Column name: string;

  @Sequelize.Column({ type: Sequelize.DataType.JSON })
  data: string;
}
