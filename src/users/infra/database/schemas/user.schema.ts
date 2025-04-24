import { EntitySchema } from "typeorm";
import { User } from "../../../entities/user";

export enum RulesEnum {
  ADMIN = 'admin',
  CLIENT = 'client',
}

export const UsersSchema = new EntitySchema<User>({
  name: "User",
  tableName: "users",
  target: User,
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    cpf: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    balance: {
      type: "numeric",
      precision: 15,
      scale: 2,
      default: 0,
    },
    date_of_birth: {
      type: Date,
      nullable: true,
    },
    rule: {
      type: String,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
});
