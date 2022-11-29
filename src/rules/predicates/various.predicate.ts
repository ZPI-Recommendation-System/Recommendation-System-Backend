import { PredicateWithCustom } from "./base.predicate";
import { LessThan, MoreThan } from "typeorm";

export const GLOBAL_PRICE_MARGIN = 1000;

export const CONNECTION_HAS = (...value: string[]): PredicateWithCustom => {
  return { connectionsHas: value };
};

export const COMMUNICATION_HAS = (...value: string[]): PredicateWithCustom => {
  return { communicationHas: value };
};
export const BATTERY_RUN_TIME_MORE = (value: number): PredicateWithCustom => {
  return { batteryTime: MoreThan(value) };
};

export const PRICE_LOWER = (value: number): PredicateWithCustom => {
  return { price: LessThan(value+GLOBAL_PRICE_MARGIN) }
}
