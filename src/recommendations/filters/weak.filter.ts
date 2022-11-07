import { Predicate, PredicateWithCustom } from "../../rules/predicates/base.predicate";
import { FormDto } from "../dto/form.dto";
import { preGeneratedFilters, weakFilterWeights } from "./weak.filter.weights";
import { SCREEN_SIZE } from "../../rules/predicates/screen.predicate";

// import { GT, GTE } from '../../rules/predicates/value.predicate';

export class WeakFilter {
  ruleName: string;
  weight: number;
  filterPredicate: Predicate;
}

const WeakFilterCreator = (
  name: string,
  predicate: PredicateWithCustom
): WeakFilter => {
  if (name in weakFilterWeights) {
    return {
      ruleName: name,
      weight: weakFilterWeights[name],
      filterPredicate: predicate
    };
  }
  throw new Error("Name not found" + name);
};

export const getInternalWeakFilters = (form: FormDto): WeakFilter[] => {
  const filters: WeakFilter[] = [];
  if (form.screenPreferences.HDMI) {
    filters.push(preGeneratedFilters.has_hdmi);
  }
  if (form.screenPreferences.touchScreen) {
    filters.push(preGeneratedFilters.has_touchscreen);
  }
  if (form.internetPreferences.lanPort) {
    filters.push(preGeneratedFilters.has_lan_port);
  }
  filters.push(
    WeakFilterCreator("screen_size", SCREEN_SIZE(form.preferredScreenSizes))
  );
  return filters;
};
