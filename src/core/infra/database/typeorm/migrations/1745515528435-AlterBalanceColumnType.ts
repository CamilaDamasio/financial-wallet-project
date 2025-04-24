import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBalanceColumnType implements MigrationInterface {
    name = 'AlterBalanceColumnType';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE users
      ALTER COLUMN balance TYPE numeric(15,2)
      USING balance::numeric;
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE users
      ALTER COLUMN balance TYPE integer
      USING balance::integer;
    `);
    }
}
