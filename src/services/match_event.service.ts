import { matchEventRepository } from "../repositories/match_events.repository";
import { ServiceResult, IMatchEvent, ICreateMatchEvent } from "../types";
import { Event_types } from "../../generated/prisma";

export const createMatchEventService = async (
  data: ICreateMatchEvent,
): Promise<ServiceResult<IMatchEvent>> => {
  try {
    const event = await matchEventRepository.create(data);
    return { success: true, data: event };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getMatchEventsByMatchService = async (
  match_id: string,
): Promise<ServiceResult<IMatchEvent[]>> => {
  try {
    const events = await matchEventRepository.findByMatch(match_id);
    if (!events.length)
      return { success: false, error: "No events found", code: "NOT_FOUND" };
    return { success: true, data: events };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getMatchEventsByTypeService = async (
  event_type: Event_types,
): Promise<ServiceResult<IMatchEvent[]>> => {
  try {
    const events = await matchEventRepository.findByEvent(event_type);
    if (!events.length)
      return { success: false, error: "No events found", code: "NOT_FOUND" };
    return { success: true, data: events };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getMatchEventsByPlayerService = async (
  player_id: string,
): Promise<ServiceResult<IMatchEvent[]>> => {
  try {
    const events = await matchEventRepository.findByPlayer(player_id);
    if (!events.length)
      return { success: false, error: "No events found", code: "NOT_FOUND" };
    return { success: true, data: events };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const deleteMatchEventService = async (
  id: string,
): Promise<ServiceResult<IMatchEvent>> => {
  try {
    const event = await matchEventRepository.delete(id);
    return { success: true, data: event };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
