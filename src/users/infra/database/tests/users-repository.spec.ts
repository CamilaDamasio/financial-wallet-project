import { DataSource, InsertResult } from "typeorm";
import { UsersRepository } from "../users-repository";
import { UsersMockSchema } from "./fixtures/mock-schema";
import { User } from "../../../entities/user";
import { ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { RulesEnum } from "../schemas/user.schema";

jest.mock("typeorm", () => {
  return {
    ...jest.requireActual("typeorm"),
  };
});

describe("UsersRepository", () => {
  const dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    logging: false,
    entities: [UsersMockSchema],
  });

  const usersModel = dataSource.getRepository(User);

  const repository = new UsersRepository(
    usersModel,
  );

  beforeAll(async () => {
    await dataSource.initialize();
  });

  beforeEach(async () => {
    await dataSource.query("delete from users");
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  it("should be defined", async () => {
    expect(repository).toBeDefined();
  });

  describe("createUser", () => {
    it("Should create a user", async () => {
      const payload = {
        id: 2,
        name: "Camila",
        cpf: "12345678900",
        password: "senha123",
        balance: 100.0,
        date_of_birth: new Date("1990-01-01"),
        rule: RulesEnum.CLIENT,
      };

      jest
        .spyOn(usersModel, "insert")
        .mockResolvedValueOnce(payload as unknown as InsertResult);

      jest
        .spyOn(usersModel, "findOne")
        .mockResolvedValueOnce(payload);

      await repository.createUser(payload);
      const user = await repository.getUserByIdentity(payload.cpf);
      expect(user.name).toBe("Camila");
    });

    it("Should throw a ConflictException if identity is duplicated key", async () => {
      const payload = {
        name: "Camila",
        cpf: "12345678900",
        password: "senha123",
        balance: 100.0,
        date_of_birth: new Date("1990-01-01"),
        rule: RulesEnum.CLIENT,
      };

      jest
        .spyOn(usersModel, "insert")
        .mockRejectedValueOnce(new ConflictException("some error"));

      await expect(repository.createUser(payload)).rejects.toThrow(ConflictException);
    });
  });

  describe("getUserById", () => {
    it("Should search user by id", async () => {
      const user = {
        id: 1,
        name: "João",
        cpf: "11122233344",
        password: "abc123",
        balance: 50.0,
        date_of_birth: new Date("1995-05-05"),
        rule: RulesEnum.CLIENT,
      };

      jest.spyOn(usersModel, "findOne").mockResolvedValueOnce(user);
      const userById = await repository.getUserById(1);
      const query = { "where": { "id": 1 } };

      expect(usersModel.findOne).toHaveBeenCalledWith(query);

      expect(userById).toEqual(user);
    });

    it("Should throw a NotFoundException if user does not exists", async () => {
      jest
        .spyOn(usersModel, "findOne")
        .mockRejectedValueOnce(new NotFoundException("some error"));

      await expect(repository.getUserById(999)).rejects.toThrow(NotFoundException);
    });

    it("Should throw a InternalServerErrorException if database return other error", async () => {
      jest
        .spyOn(usersModel, "findOne")
        .mockRejectedValueOnce(new Error("some error"));

      await expect(repository.getUserById(999)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("getUserByIdentity", () => {
    it("Should search user by identity", async () => {
      const user = {
        id: 1,
        name: "João",
        cpf: "11122233344",
        password: "abc123",
        balance: 50.0,
        date_of_birth: new Date("1995-05-05"),
        rule: RulesEnum.CLIENT,
      };

      jest.spyOn(usersModel, "findOne").mockResolvedValueOnce(user);
      await repository.getUserByIdentity('11231');

      const query = { "where": { "cpf": "11231" } };

      expect(usersModel.findOne).toHaveBeenCalledWith(query);
    });

    it("Should throw a NotFoundException if user does not exists", async () => {
      jest
        .spyOn(usersModel, "findOne")
        .mockRejectedValueOnce(new NotFoundException("some error"));

      await expect(repository.getUserById(999)).rejects.toThrow(NotFoundException);
    });

    it("Should throw a InternalServerErrorException if database return other error", async () => {
      jest
        .spyOn(usersModel, "findOne")
        .mockRejectedValueOnce(new Error("some error"));

      await expect(repository.getUserById(999)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("updateBalanceByUserId", () => {
    it("Should update balance bu user id correctly", async () => {
      jest.spyOn(usersModel, "update").getMockImplementation();
      await repository.updateBalanceByUserId(1, 80.00);

      const queryId = { "id": 1 };
      const queryBalance = { "balance": 80.00 };

      expect(usersModel.update).toHaveBeenCalledWith(queryId, queryBalance);
    });

    it("Should throw a InternalServerErrorException if database return a error", async () => {
      jest
        .spyOn(usersModel, "update")
        .mockRejectedValueOnce(new Error("some error"));

      await expect(repository.updateBalanceByUserId(1, 80.00)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
