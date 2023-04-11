export function secondsToHms(d: number) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  const value = (hDisplay + mDisplay + sDisplay).trim();

  if (value[value.length - 1] === ",") {
    return value.slice(0, value.length - 1);
  } else {
    return value;
  }
}

export function formatTime(
  timestamp: number,
  options?: Intl.DateTimeFormatOptions
) {
  const date = new Date(timestamp * 1000);
  if (!options) {
    options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
  }

  return new Intl.DateTimeFormat("en-US", options).format(date);
}
