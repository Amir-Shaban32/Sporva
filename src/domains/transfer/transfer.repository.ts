import { prisma } from "@shared/lib/prisma";
import { ICreateTransfer } from "./transfer.types";
import { IPlayer } from "@domains/player/player.types";

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

  async createWithPlayerUpdate(data: ICreateTransfer, player: IPlayer) {
    return await prisma.$transaction(async (tx) => {
      const transfer = await tx.transfers.create({
        data: {
          player_id: data.player_id,
          from_team_id: data.from_team_id,
          to_team_id: data.to_team_id,
          transfer_date: data.transfer_date ?? new Date(),
          transfer_fee: data.transfer_fee,
          transfer_type: data.transfer_type,
        },
      });

      await tx.players.update({
        where: { id: player.id },
        data: {
          team_id: data.to_team_id,
        },
      });
      return transfer;
    });
  }

  async findById(id: string) {
    return await prisma.transfers.findUnique({ where: { id } });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await prisma.transfers.findMany({
      skip,
      take: limit,
    });
  }

  async findByPlayer(player_id: string) {
    return await prisma.transfers.findMany({
      where: { player_id },
    });
  }

  async findByTeam(team_id: string) {
    return await prisma.transfers.findMany({
      where: {
        OR: [{ from_team_id: team_id }, { to_team_id: team_id }],
      },
    });
  }

  async count() {
    return await prisma.transfers.count();
  }
}

export const transferRepository = new TransferRepository();
