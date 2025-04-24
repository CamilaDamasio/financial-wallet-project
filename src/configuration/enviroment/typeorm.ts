import { Injectable } from "@nestjs/common";
import { TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { config as dotenvConfig } from "dotenv";
import { UsersSchema } from "../../users/infra/database/schemas/user.schema";
import { TransactionsSchema } from "../../transactions/infra/database/schemas/transaction.schema";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) { }

  createTypeOrmOptions(): DataSourceOptions {
    return {
      type: "postgres",
      host: this.configService.get<string>("DATABASE_HOST"),
      port: Number(process.env.DATABASE_PORT),
      logging:
        this.configService.get<string>("APPLICATION_ENV") === "development",
      username: this.configService.get<string>("DATABASE_USER"),
      password: this.configService.get<string>("DATABASE_PASSWORD"),
      database: this.configService.get<string>("DATABASE_NAME"),
      migrations: ["dist/migrations/*.js"],
      entities: [
        UsersSchema,
        TransactionsSchema,
      ],
      synchronize: true,
    };
  }
}

dotenvConfig({ path: ".env" });
const configService = new ConfigService();
const config = new TypeOrmConfigService(configService).createTypeOrmOptions();
export const connectionSource = new DataSource(config);
