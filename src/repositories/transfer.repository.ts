import { prisma } from "../lib/prisma";
import { ICreateTransfer } from "../types";

class TransferRepository {
  async create(data: ICreateTransfer) {
    return await prisma.transfers.create({
      data: {
        player_id: data.player_id,
        from_team_id: data.from_team_id,
        to_team_id: data.to_team_id,
        transfer_date: data.transfer_date ?? new Date(),
        transfer_fee: data.transfer_fee,
        transfer_type: data.transfer_type,
      },
    });
  }

  async findByPlayer(player_id: string) {
    return await prisma.transfers.findMany({
      where: { player_id },
    });
  }

  async findByteam(team_id: string) {
    return await prisma.transfers.findMany({
      where: {
        OR: [{ from_team_id: team_id }, { to_team_id: team_id }],
      },
    });
  }
}

export const transferREpository = new TransferRepository();
