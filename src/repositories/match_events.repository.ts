import { prisma } from "../lib/prisma";
import { Event_types } from "../../generated/prisma";
import { ICreateMatchEvent } from "../types";

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
