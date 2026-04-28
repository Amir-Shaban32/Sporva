export const handleSeason = (season?: string) => {
  let curr_season;
  if (season) {
    curr_season = season;
  } else {
    const year = new Date().getFullYear();
    curr_season = `${year}-${year + 1}`;
  }
  return curr_season;
};
