import { EntitySchema } from "typeorm";
import { Transaction } from "../../../entities/transaction";

export const TransactionsSchema = new EntitySchema<Transaction>({
  name: "Transaction",
  tableName: "transactions",
  target: Transaction,
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    sender_id: {
      type: "int",
    },
    receiver_id: {
      type: "int",
    },
    amount: {
      type: "numeric",
      precision: 15,
      scale: 2,
    },
    status: {
      type: String,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    reversed_at: {
      type: "timestamp",
      nullable: true,
    },
  },
});
