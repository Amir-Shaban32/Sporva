import { matchEventRepository } from "../repositories";
import { IMatchEvent, ICreateMatchEvent } from "../types";
import { Event_types } from "../../generated/prisma";
import { NotFoundError } from "../errors/app-error";

export const createMatchEventService = async (
  data: ICreateMatchEvent,
): Promise<IMatchEvent> => {
  const event = await matchEventRepository.create(data);
  return event;
};

export const getMatchEventsByMatchService = async (
  match_id: string,
): Promise<IMatchEvent[]> => {
  const events = await matchEventRepository.findByMatch(match_id);
  if (!events.length) {
    throw new NotFoundError("No events found");
  }
  return events;
};

export const getMatchEventsByTypeService = async (
  event_type: Event_types,
): Promise<IMatchEvent[]> => {
  const events = await matchEventRepository.findByEvent(event_type);
  if (!events.length) {
    throw new NotFoundError("No events found");
  }
  return events;
};

export const getMatchEventsByPlayerService = async (
  player_id: string,
): Promise<IMatchEvent[]> => {
  const events = await matchEventRepository.findByPlayer(player_id);
  if (!events.length) {
    throw new NotFoundError("No events found");
  }
  return events;
};

export const deleteMatchEventService = async (
  id: string,
): Promise<IMatchEvent> => {
  const event = await matchEventRepository.delete(id);
  return event;
};
