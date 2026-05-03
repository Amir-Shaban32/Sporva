import {
  matchEventRepository,
  matchRepository,
  playerRepository,
} from "../repositories";
import { IMatchEvent, ICreateMatchEvent } from "../types";
import { Event_types } from "../../generated/prisma";
import { NotFoundError } from "../errors/app-error";
import { checkValidCreateMatchEvent } from "../utils/check-create-event";
import { logger } from "../config";

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
  const logData = {
    match_id: match.id,
    player_id: player.id,
    team_id: data.team_id,
    event: data.event_type,
  };

  const isHighPriority =
    data.event_type === "GOAL" ||
    data.event_type === "SCORE_PENALTY" ||
    data.event_type === "OWN_GOAL" ||
    data.event_type === "RED_CARD" ||
    data.event_type === "YELLOW_CARD";

  if (isHighPriority) logger.info(logData, "Match event recorded");
  else logger.debug(logData, "Match event recorded");

  return event;
};

export const getMatchEventByIdService = async (
  id: string,
): Promise<IMatchEvent> => {
  const event = await matchEventRepository.findById(id);
  if (!event) throw new NotFoundError("No events found");
  return event;
};

export const getMatchEventsByMatchService = async (
  match_id: string,
): Promise<IMatchEvent[] | null> => {
  const events = await matchEventRepository.findByMatch(match_id);
  if (!events.length) return null;
  return events;
};

export const getMatchEventsByTypeService = async (
  event_type: Event_types,
): Promise<IMatchEvent[] | null> => {
  const events = await matchEventRepository.findByEvent(event_type);
  if (!events.length) return null;
  return events;
};

export const getMatchEventsByPlayerService = async (
  player_id: string,
): Promise<IMatchEvent[] | null> => {
  const events = await matchEventRepository.findByPlayer(player_id);
  if (!events.length) return null;
  return events;
};

export const deleteMatchEventService = async (id: string): Promise<void> => {
  const event = await matchEventRepository.findById(id);
  if (!event) throw new NotFoundError("No event found");
  await matchEventRepository.delete(id);
};
