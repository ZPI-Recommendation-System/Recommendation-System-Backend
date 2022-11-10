import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { LaptopsCrudService } from "./laptops-crud.service";
import { UpdateLaptopsCrudDto } from "./dto/update-laptops-crud.dto";
import { ModelEntity } from "../laptops/entity/model.entity";
import { AdminAccess } from "../users/auth.decorators";

@Controller("laptops-crud")
@AdminAccess
export class LaptopsCrudController {
  constructor(private readonly laptopsCrudService: LaptopsCrudService) {
  }

  @Post()
  create(@Body() createLaptopsCrudDto: ModelEntity) {
    return this.laptopsCrudService.create(createLaptopsCrudDto);
  }

  @Get()
  findAll() {
    return this.laptopsCrudService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.laptopsCrudService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateLaptopsCrudDto: UpdateLaptopsCrudDto) {
    return this.laptopsCrudService.update(+id, updateLaptopsCrudDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.laptopsCrudService.remove(+id);
  }
}