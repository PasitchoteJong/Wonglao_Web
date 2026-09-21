export const DAY_SHORT = [
  "Sun.",
  "Mon.",
  "Tues",
  "Wed",
  "Thurs",
  "Fri",
  "Sat",
];

export const startOfWeekSunday = (date = new Date()) => {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  result.setDate(
    result.getDate() - result.getDay()
  );

  return result;
};

export const addDays = (date, days) => {
  const result = new Date(date);

  result.setDate(
    result.getDate() + days
  );

  return result;
};

export const addWeeks = (date, weeks) => {
  return addDays(date, weeks * 7);
};

export const isSameDate = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isCurrentWeek = (weekStart) => {
  const currentWeekStart =
    startOfWeekSunday(new Date());

  return isSameDate(
    weekStart,
    currentWeekStart
  );
};

export const formatWeekRange = (weekStart) => {
  const weekEnd = addDays(
    weekStart,
    6
  );

  const start =
    weekStart.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
      }
    );

  const end =
    weekEnd.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  return `${start} - ${end}`;
};