import { RulesEnum } from "../infra/database/schemas/user.schema";

export class User {
  id?: number;
  name: string;
  cpf: string;
  password: string;
  balance: number;
  date_of_birth: Date;
  rule: RulesEnum;
  created_at?: Date;
  updated_at?: Date
}
