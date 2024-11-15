/**
 * Convert a quantity of seconds to a duration string in the format of HH:MM:SS
 * @example: toHHMMSS(42069) -> "11:41:09"
 */
export const toHHMMSS = (noSeconds: number) => {
  const hours = Math.floor(noSeconds / 3600);
  const minutes = Math.floor((noSeconds - hours * 3600) / 60);
  const seconds = Math.floor(noSeconds - hours * 3600 - minutes * 60);

  const hoursString = hours < 10 ? `0${hours}` : hours.toString();
  const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondsString = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${hoursString}:${minutesString}:${secondsString}`;
};