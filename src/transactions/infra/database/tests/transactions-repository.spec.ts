import { DataSource, InsertResult } from "typeorm";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { TransactionsMockSchema } from "../../../../transactions/infra/database/tests/fixtures/mock-schema";
import { Transaction } from "../../../entities/transaction";
import { TransactionsRepository } from "../transactions.repository";

jest.mock("typeorm", () => {
  return {
    ...jest.requireActual("typeorm"),
  };
});

describe("TransactionsRepository", () => {
  const dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    logging: false,
    entities: [TransactionsMockSchema],
  });

  const transactionsModel = dataSource.getRepository(Transaction);

  const repository = new TransactionsRepository(
    transactionsModel,
  );

  beforeAll(async () => {
    await dataSource.initialize();
  });

  beforeEach(async () => {
    await dataSource.query("delete from transactions");
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  it("should be defined", async () => {
    expect(repository).toBeDefined();
  });

  describe("createTransaction", () => {
    it("Should create a transaction", async () => {
      const payload = {
        id: 2,
        sender_id: 11,
        receiver_id: 6,
        amount: 100.0,
        status: "PENDING",
        created_at: new Date(),
      };

      jest
        .spyOn(transactionsModel, "insert")
        .mockResolvedValueOnce(payload as unknown as InsertResult);

      jest
        .spyOn(transactionsModel, "findOne")
        .mockResolvedValueOnce(payload);

      await repository.createTransaction(payload);
      const transaction = await repository.getTransactionById(2);
      expect(transaction.amount).toBe(100.0);
    });
  });

  describe("getTransactionById", () => {
    it("Should search transaction by id", async () => {
      const payload = {
        id: 2,
        sender_id: 11,
        receiver_id: 6,
        amount: 100.0,
        status: "PENDING",
        created_at: new Date(),
      };

      jest.spyOn(transactionsModel, "findOne").mockResolvedValueOnce(payload);
      const transactionById = await repository.getTransactionById(2);
      const query = { "where": { "id": 2 } };

      expect(transactionsModel.findOne).toHaveBeenCalledWith(query);

      expect(transactionById).toEqual(payload);
    });

    it("Should throw a NotFoundException if transaction does not exists", async () => {
      jest
        .spyOn(transactionsModel, "findOne")
        .mockRejectedValueOnce(new NotFoundException("some error"));

      await expect(repository.getTransactionById(999)).rejects.toThrow(NotFoundException);
    });

    it("Should throw a InternalServerErrorException if database return other error", async () => {
      jest
        .spyOn(transactionsModel, "findOne")
        .mockRejectedValueOnce(new Error("some error"));

      await expect(repository.getTransactionById(999)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("getTransactionsByUserId", () => {
    it("Should search transaction by user id", async () => {
      const payload = [{
        id: 2,
        sender_id: 11,
        receiver_id: 6,
        amount: 100.0,
        status: "PENDING",
        created_at: new Date(),
      }];

      jest.spyOn(transactionsModel, "find").mockResolvedValueOnce(payload);
      await repository.getTransactionsByUserId(11);

      const query = { "where": [{ "receiver_id": 11 }, { "sender_id": 11 }] };

      expect(transactionsModel.find).toHaveBeenCalledWith(query);
    });

    it("Should throw a NotFoundException if transaction does not exists", async () => {
      jest
        .spyOn(transactionsModel, "find")
        .mockRejectedValueOnce(new NotFoundException("some error"));

      await expect(repository.getTransactionsByUserId(999)).rejects.toThrow(NotFoundException);
    });

    it("Should throw a InternalServerErrorException if database return other error", async () => {
      jest
        .spyOn(transactionsModel, "find")
        .mockRejectedValueOnce(new Error("some error"));

      await expect(repository.getTransactionsByUserId(999)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("revertTransaction", () => {
    it("Should update reversed_at correctly", async () => {
      const transactionId = { id: 2 };
      const reversedDate = { reversed_at: new Date() }

      jest.spyOn(transactionsModel, "update").getMockImplementation();
      await repository.revertTransaction(2);

      expect(transactionsModel.update).toHaveBeenCalledWith(transactionId, reversedDate);
    });

    it("Should throw a NotFoundException if transaction does not exists", async () => {
      jest
        .spyOn(transactionsModel, "update")
        .mockRejectedValueOnce(new NotFoundException("some error"));

      await expect(repository.revertTransaction(999)).rejects.toThrow(NotFoundException);
    });

    it("Should throw a InternalServerErrorException if database return other error", async () => {
      jest
        .spyOn(transactionsModel, "update")
        .mockRejectedValueOnce(new Error("some error"));

      await expect(repository.revertTransaction(999)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("updateTransactionStatusToSuccess", () => {
    it("Should update status to success correctly", async () => {
      jest.spyOn(transactionsModel, "update").getMockImplementation();
      await repository.updateTransactionStatusToSuccess(1);

      const queryId = { "id": 1 };
      const queryStatus = { "status": "SUCCESS" };

      expect(transactionsModel.update).toHaveBeenCalledWith(queryId, queryStatus);
    });

    it("Should throw a NotFoundException if transaction does not exists", async () => {
      jest
        .spyOn(transactionsModel, "update")
        .mockRejectedValueOnce(new NotFoundException("some error"));

      await expect(repository.updateTransactionStatusToSuccess(999)).rejects.toThrow(NotFoundException);
    });

    it("Should throw a InternalServerErrorException if database return a error", async () => {
      jest
        .spyOn(transactionsModel, "update")
        .mockRejectedValueOnce(new Error("some error"));

      await expect(repository.updateTransactionStatusToSuccess(1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("updateTransactionStatusToFailed", () => {
    it("Should update status to failed correctly", async () => {
      jest.spyOn(transactionsModel, "update").getMockImplementation();
      await repository.updateTransactionStatusToFailed(1);

      const queryId = { "id": 1 };
      const queryStatus = { "status": "FAILED" };

      expect(transactionsModel.update).toHaveBeenCalledWith(queryId, queryStatus);
    });

    it("Should throw a NotFoundException if transaction does not exists", async () => {
      jest
        .spyOn(transactionsModel, "update")
        .mockRejectedValueOnce(new NotFoundException("some error"));

      await expect(repository.updateTransactionStatusToFailed(999)).rejects.toThrow(NotFoundException);
    });

    it("Should throw a InternalServerErrorException if database return other error", async () => {
      jest
        .spyOn(transactionsModel, "update")
        .mockRejectedValueOnce(new Error("some error"));

      await expect(repository.updateTransactionStatusToFailed(1)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
