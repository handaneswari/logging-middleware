import { blue, yellow, green, white, red } from 'colorette';

export enum ConsoleColors {
  Blue = 'blue',
  Green = 'green',
  Yellow = 'yellow',
  White = 'white', 
  Red = 'red',
}

export function printColoredText(text: string, color: ConsoleColors) {
  const colorFunction = getColorFunction(color);
  console.log(colorFunction(text));
}

function getColorFunction(color: ConsoleColors) {
  switch (color) {
    case ConsoleColors.Blue:
      return blue;
    case ConsoleColors.Green:
      return green;
    case ConsoleColors.Yellow:
      return yellow;
    case ConsoleColors.Red:
      return red;
    default:
      return white; // Default to white if the color is not recognized
  }
}
