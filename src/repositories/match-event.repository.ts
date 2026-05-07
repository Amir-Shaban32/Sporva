import { prisma } from "../lib/prisma";
import { Event_types } from "../../generated/prisma";
import { ICreateMatchEvent, IMatch } from "../types";
import { logger } from "../config";

class MatchEventRepository {
  async create(data: ICreateMatchEvent) {
    return await prisma.match_Events.create({
      data: {
        match_id: data.match_id,
        player_id: data.player_id,
        team_id: data.team_id,
        event_type: data.event_type,
        minute: data.minute,
      },
    });
  }

  async createWithMatchUpdate(data: ICreateMatchEvent, match: IMatch) {
    return await prisma.$transaction(async (tx) => {
      const event = await tx.match_Events.create({
        data: {
          match_id: data.match_id,
          player_id: data.player_id,
          team_id: data.team_id,
          event_type: data.event_type,
          minute: data.minute,
        },
      });

      logger.info(
        {
          event_type: data.event_type,
          team_id: data.team_id,
          host_team_id: match.host_team_id,
          guest_team_id: match.guest_team_id,
          host_score: match.host_team_score,
          guest_score: match.guest_team_score,
          is_host: data.team_id === match.host_team_id,
          is_guest: data.team_id === match.guest_team_id,
        },
        "Transaction debug",
      );

      if (data.event_type === "GOAL" || data.event_type === "SCORE_PENALTY") {
        await tx.matches.update({
          where: { id: data.match_id },
          data: {
            host_team_score:
              data.team_id === match.host_team_id
                ? { increment: 1 }
                : undefined,
            guest_team_score:
              data.team_id === match.guest_team_id
                ? { increment: 1 }
                : undefined,
          },
        });
      }

      if (data.event_type === "OWN_GOAL") {
        await tx.matches.update({
          where: { id: data.match_id },
          data: {
            host_team_score:
              data.team_id === match.guest_team_id
                ? { increment: 1 }
                : undefined,
            guest_team_score:
              data.team_id === match.host_team_id
                ? { increment: 1 }
                : undefined,
          },
        });
      }

      return event;
    });
  }

  async findById(id: string) {
    return await prisma.match_Events.findUnique({ where: { id } });
  }

  async findByMatch(match_id: string) {
    return await prisma.match_Events.findMany({ where: { match_id } });
  }

  async findByEvent(event_type: Event_types) {
    return await prisma.match_Events.findMany({ where: { event_type } });
  }

  async findByPlayer(player_id: string) {
    return await prisma.match_Events.findMany({ where: { player_id } });
  }

  async delete(id: string) {
    return await prisma.match_Events.delete({ where: { id } });
  }
}

export const matchEventRepository = new MatchEventRepository();
