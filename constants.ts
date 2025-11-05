
import { PowerRating } from './types';

export const POWER_RATING_MAP: { [key in PowerRating]: number } = {
  '1/8W': 0.125,
  '1/4W': 0.25,
  '1/2W': 0.5,
  '1W': 1.0,
  '2W': 2.0,
};

export const SWITCH_RESISTANCE = {
  OPEN: 1e9, // 1 GigaOhm
  CLOSED: 1e-3, // 1 milliOhm
};
