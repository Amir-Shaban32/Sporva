export type SortKey =
  | "points"
  | "wins"
  | "draws"
  | "losses"
  | "goals_for"
  | "goals_against";

export const sortKeyToOrderBy = (
  key: SortKey,
): Record<string, "asc" | "desc"> => {
  const map: Record<SortKey, Record<string, "asc" | "desc">> = {
    points: { points: "desc" },
    wins: { wins: "desc" },
    draws: { draws: "desc" },
    losses: { losses: "asc" },
    goals_for: { goals_for: "desc" },
    goals_against: { goals_against: "asc" },
  };
  return map[key];
};
