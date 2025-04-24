export class Transaction {
  id?: number;
  sender_id: number;
  receiver_id: number;
  amount: number;
  status: string;
  created_at: Date;
  reversed_at?: Date | null;
}
