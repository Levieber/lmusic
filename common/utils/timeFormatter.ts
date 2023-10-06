const formatter = new Intl.NumberFormat("pt-BR", {
  minimumIntegerDigits: 2,
});

export function timeFormatter(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const formattedMinutes = formatter.format(minutes);
  const formattedSeconds = formatter.format(seconds);

  return `${formattedMinutes}:${formattedSeconds}`;
}
