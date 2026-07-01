export const AUTH_USERNAME = "shnook";

export function getAuthPassword(now = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  });

  return formatter
    .formatToParts(now)
    .filter((part) => part.type === "month" || part.type === "day" || part.type === "year")
    .map((part) => part.value)
    .join("");
}

export function buildBasicAuthHeader(username: string, password: string) {
  return `Basic ${btoa(`${username}:${password}`)}`;
}
