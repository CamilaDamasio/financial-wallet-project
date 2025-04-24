import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1745514503153 implements MigrationInterface {
    name = 'CreateUsersTable1745514503153';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        cpf VARCHAR(11) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rule VARCHAR(50) NOT NULL,
        balance NUMERIC(15, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE users`);
    }
}
