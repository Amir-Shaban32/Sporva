import {
  matchEventRepository,
  matchRepository,
  playerRepository,
  teamRepository,
} from "../repositories";
import { IMatchEvent, ICreateMatchEvent } from "../types";
import { Event_types } from "../../generated/prisma";
import { NotFoundError, UnprocessableEntityError } from "../errors/app-error";
import { checkValidCreateMatchEvent } from "src/utils/check-create-event";

export const createMatchEventService = async (
  data: ICreateMatchEvent,
): Promise<IMatchEvent> => {
  const [player, match] = await Promise.all([
    playerRepository.findById(data.player_id),
    matchRepository.findById(data.match_id),
  ]);
  if (!player || !match) throw new NotFoundError("Player or match not found");
  checkValidCreateMatchEvent(data, player, match);

  let event;
  if (
    data.event_type === "GOAL" ||
    data.event_type === "SCORE_PENALTY" ||
    data.event_type === "OWN_GOAL"
  ) {
    event = await matchEventRepository.createWithMatchUpdate(data, match);
  } else {
    event = await matchEventRepository.create(data);
  }
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
