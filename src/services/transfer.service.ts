import { transferREpository } from "../repositories";
import { ServiceResult, ITransfer, ICreateTransfer } from "../types";

export const createTransferService = async (
  data: ICreateTransfer,
): Promise<ServiceResult<ITransfer>> => {
  try {
    const transfer = await transferREpository.create(data);
    return { success: true, data: transfer };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getTransfersByPlayerService = async (
  player_id: string,
): Promise<ServiceResult<ITransfer[]>> => {
  try {
    const transfers = await transferREpository.findByPlayer(player_id);
    if (!transfers.length)
      return {
        success: false,
        error: "No transfers found",
        code: "NOT_FOUND",
      };
    return { success: true, data: transfers };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getTransfersByTeamService = async (
  team_id: string,
): Promise<ServiceResult<ITransfer[]>> => {
  try {
    const transfers = await transferREpository.findByteam(team_id);
    if (!transfers.length)
      return {
        success: false,
        error: "No transfers found",
        code: "NOT_FOUND",
      };
    return { success: true, data: transfers };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
