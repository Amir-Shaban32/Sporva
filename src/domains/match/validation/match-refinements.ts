import { z } from "zod";
import { ExtraTimeAndPenalty } from "../match.types";
import { Match_status } from "@generated/prisma";

export const teamIdRefinement = (
  data: { guest_team_id: string; host_team_id: string },
  ctx: z.RefinementCtx,
) => {
  if (
    data.guest_team_id &&
    data.host_team_id &&
    data.guest_team_id === data.host_team_id
  ) {
    ctx.addIssue({
      code: "custom",
      message: "Host and guest team cannot be the same",
      path: ["host_team_id"],
    });
    ctx.addIssue({
      code: "custom",
      message: "Host and guest team cannot be the same",
      path: ["guest_team_id"],
    });
  }
};

export const extraTimeAndPenaltyRefinement = (
  data: ExtraTimeAndPenalty,
  ctx: z.RefinementCtx,
) => {
  const competition = data.competition;
  const isExtraCompetition = competition !== "LEAGUE";
  if (!isExtraCompetition && data.got_extra_time) {
    ctx.addIssue({
      code: "custom",
      message: "League matches cannot have extra time",
      path: ["got_extra_time"],
    });
  }
  if (!isExtraCompetition && data.got_penalties) {
    ctx.addIssue({
      code: "custom",
      message: "League matches cannot have penalties",
      path: ["got_penalties"],
    });
  }

  if (
    data.got_extra_time &&
    (data.host_team_score === undefined || data.guest_team_score === undefined)
  ) {
    ctx.addIssue({
      code: "custom",
      message: "Scores must be provided when extra time is set",
      path: ["got_extra_time"],
    });
  }
  const isRelevant =
    data.status === Match_status.FINISHED || data.status === Match_status.LIVE;
  if (
    !isRelevant &&
    (data.got_extra_time ||
      data.got_penalties ||
      data.guest_team_score ||
      data.host_team_score)
  ) {
    ctx.addIssue({
      code: "custom",
      message: `Match is ${data.status}. You can't do changes`,
    });
  }
  const scoreEqual = data.guest_team_score === data.host_team_score;
  if (data.got_extra_time && !scoreEqual) {
    ctx.addIssue({
      code: "custom",
      message: "Extra Time can only be set when scores are equal",
      path: ["got_extra_time"],
    });
  }

  if (data.got_penalties && !scoreEqual) {
    ctx.addIssue({
      code: "custom",
      message: "Penalties can only be set when scores are equal",
      path: ["got_penalties"],
    });
  }
};
