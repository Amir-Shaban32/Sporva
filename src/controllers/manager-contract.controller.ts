import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BadRequestError } from "../errors/app-error";
import {
  createManagerContractService,
  getActiveManagerContractsService,
  getExpiredManagerContractsService,
  getManagerContractsByManagerService,
  deActivateManagerContractService,
  getManagerContractsByIntervalService,
  getAllManagerContractsService,
  countManagerContractsService,
} from "../services";
import { parsePagination } from "../utils/parse-pagination";

export const createManagerContract = catchAsync(
  async (req: Request, res: Response) => {
    const contract = await createManagerContractService(req.body);
    return res.created("Manager contract created successfully", { contract });
  },
);

export const getAllManagerContracts = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req);

    const { managerContracts, total } = await getAllManagerContractsService(
      page,
      limit,
    );

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
    return res.ok("Active manager contracts retrieved successfully", {
      contracts,
    });
  },
);

export const getExpiredManagerContracts = catchAsync(
  async (_req: Request, res: Response) => {
    const contracts = await getExpiredManagerContractsService();
    return res.ok("Expired manager contracts retrieved successfully", {
      contracts,
    });
  },
);

export const getManagerContractsByManager = catchAsync(
  async (req: Request, res: Response) => {
    const { manager_id } = req.params;
    if (!manager_id) {
      throw new BadRequestError("Bad request! Manager ID is required");
    }

    const contracts = await getManagerContractsByManagerService(
      manager_id as string,
    );
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
    const { period } = req.query;
    if (!period) {
      throw new BadRequestError("Bad request! Period is required");
    }

    const contracts = await getManagerContractsByIntervalService(
      parseInt(period as string),
    );
    return res.ok("Manager contracts retrieved successfully", { contracts });
  },
);

export const countManagerContracts = catchAsync(
  async (_req: Request, res: Response) => {
    const count = await countManagerContractsService();

    return res.ok("Manager Contracts count retrieved successfully", { count });
  },
);
