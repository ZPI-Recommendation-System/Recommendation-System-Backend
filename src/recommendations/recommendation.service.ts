import { Injectable, Logger } from "@nestjs/common";
import { FormDto } from "./dto/form.dto";
import { ModelEntity } from "../db/entities/model.entity";
import { Predicate } from "../rules/predicates/base.predicate";
import { getInternalWeakFilters, WeakFilter } from "./filters/weak.filter";
import { getStrongFilter } from "./filters/strong.filter";
import { LaptopsServices } from "../laptops/laptops.service";
import { AND } from "../rules/predicates/relation.predicate";
import { ScoreService } from "./scoring/score.service";

@Injectable()
export class RecommendationService {
  private logger = new Logger(RecommendationService.name);
  constructor(
    private laptopService: LaptopsServices,
    private scoreService: ScoreService,
  ) {}

  async countLaptopsWithMaxPrice(usageType: string, maxPrice: number) {
    const strong = this.getStrongFilters({ usageType: usageType });
    const strongPrice = this.getStrongFilters({
      usageType: usageType,
      maxPricePLN: maxPrice,
    });
    return this.laptopService.count(strong, strongPrice);
  }

  getLaptopEntryWithScores(
    form: FormDto,
    strongFilters: Predicate,
    weakFilters: WeakFilter[],
    deletedWeakFilters: WeakFilter[],
    limit: number,
  ) {
    return this.laptopService
      .findLaptop(
        this.combineStrongAndWeak(strongFilters, weakFilters),
        limit,
        0,
      )
      .then(async (it) => {
        return await this.scoreService.generateLaptopScores(form, it);
      })
      .then((it) => {
        return {
          items: it.map((it) => it.model),
          weakFilters: weakFilters.map((it) => it.ruleName),
          deletedWeakFilters: deletedWeakFilters.map((it) => it.ruleName),
        };
      });
  }

  async processRecommendation(
    form: FormDto,
    limit = 50,
  ): Promise<{ items: ModelEntity | any[]; weakFilters: any[] }[]> {
    if (limit > 20) limit = 20;
    else if (limit < 5) limit = 5;
    const strongFilter = this.getStrongFilters(form);
    const weakFilters = this.getWeakFilters(form);
    // return {
    //   strong: strongFilter,
    //   weak: weakFilters,
    //   finalResult: this.combineStrongAndWeak(strongFilter, weakFilters)
    // };
    // return strongFilter;
    const lists = [];
    let lastLaptops = undefined;
    const currentWeakFilters = [
      ...weakFilters.sort((it, it2) => it.weight - it2.weight),
    ];
    let deletedWeakFilters = [];
    this.logger.debug(currentWeakFilters.map((it) => [it.ruleName, it.weight]));
    while (
      lastLaptops == undefined ||
      (currentWeakFilters.length > 0 && lastLaptops.items.length < 3)
    ) {
      lastLaptops = await this.getLaptopEntryWithScores(
        form,
        strongFilter,
        currentWeakFilters,
        deletedWeakFilters,
        limit,
      );
      lists.push(lastLaptops);
      deletedWeakFilters = deletedWeakFilters.concat(
        currentWeakFilters.splice(0, 1),
      );
    }
    return lists;
  }

  combineStrongAndWeak(strongFilters: Predicate, weakFilters: WeakFilter[]) {
    // strongFilters,
    this.logger.debug(
      AND([strongFilters, AND(weakFilters.map((it) => it.filterPredicate))]),
    );
    return AND([
      strongFilters,
      AND(weakFilters.map((it) => it.filterPredicate)),
    ]);
  }

  getStrongFilters(form: Partial<FormDto>): Predicate {
    return getStrongFilter(form);
  }

  getWeakFilters(form: FormDto): WeakFilter[] {
    return getInternalWeakFilters(form);
  }
}
