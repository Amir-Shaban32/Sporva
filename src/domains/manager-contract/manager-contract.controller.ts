import { Request, Response } from "express";
import { catchAsync } from "@shared/utils/catch-async";
import { BadRequestError } from "@shared/errors/app-error";
import {
  createManagerContractService,
  getActiveManagerContractsService,
  getExpiredManagerContractsService,
  getManagerContractsByManagerService,
  deActivateManagerContractService,
  getManagerContractsByIntervalService,
  getAllManagerContractsService,
  countManagerContractsService,
} from "./manager-contract.service";
import { parsePagination } from "@shared/utils/parse-pagination";
import { parsePeriod } from "@shared/utils/parse-period";

export const createManagerContract = catchAsync(
  async (req: Request, res: Response) => {
    const contract = await createManagerContractService(req.body);
    return res.created("Manager contract created successfully", { contract });
  },
);

export const getAllManagerContracts = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req);

    const result = await getAllManagerContractsService(page, limit);
    if (!result) return res.noContent();

    const { managerContracts, total } = result;

    return res.paginated(
      managerContracts,
      total,
      page,
      limit,
      "Manager Contracts retrieved successfully",
    );
  },
);

export const getActiveManagerContracts = catchAsync(
  async (_req: Request, res: Response) => {
    const contracts = await getActiveManagerContractsService();
    if (!contracts) return res.noContent();

    return res.ok("Active manager contracts retrieved successfully", {
      contracts,
    });
  },
);

export const getExpiredManagerContracts = catchAsync(
  async (_req: Request, res: Response) => {
    const contracts = await getExpiredManagerContractsService();
    if (!contracts) return res.noContent();

    return res.ok("Expired manager contracts retrieved successfully", {
      contracts,
    });
  },
);

export const getManagerContractsByManager = catchAsync(
  async (req: Request, res: Response) => {
    const { managerId } = req.params;
    if (!managerId) {
      throw new BadRequestError("Bad request! Manager ID is required");
    }

    const contracts = await getManagerContractsByManagerService(
      managerId as string,
    );
    if (!contracts) return res.noContent();

    return res.ok("Manager contracts retrieved successfully", { contracts });
  },
);

export const deActivateManagerContract = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Bad request! ID is required");
    }

    await deActivateManagerContractService(id as string);
    return res.ok("Contract deactivated successfully");
  },
);

export const getManagerContractsByInterval = catchAsync(
  async (req: Request, res: Response) => {
    const period = parsePeriod(req);
    if (!period) {
      throw new BadRequestError("Bad request! Period is required");
    }

    const contracts = await getManagerContractsByIntervalService(period);
    if (!contracts) return res.noContent();

    return res.ok("Manager contracts retrieved successfully", { contracts });
  },
);

export const countManagerContracts = catchAsync(
  async (_req: Request, res: Response) => {
    const count = await countManagerContractsService();

    return res.ok("Manager Contracts count retrieved successfully", { count });
  },
);
