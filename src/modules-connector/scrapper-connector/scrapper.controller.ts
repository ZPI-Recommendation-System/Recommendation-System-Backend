import { Controller, Get, Post } from "@nestjs/common";
import { AdminAccess } from "../../users/auth.decorators";
import { ScrapperService } from "./scrapper.service";

@Controller('scrapper')
@AdminAccess
export class ScrapperController {
  constructor(private scrapperService: ScrapperService) {}

  @Get('authlink')
  getAuthLink() {
    return {
      status: 'ok',
      link: this.scrapperService.getAuthLink(),
    };
  }

  @Post('request')
  requestAuthLink() {
    return this.scrapperService.requestAuthLink().then((it) => {
      return {
        status: 'ok',
        authlink: it,
      };
    });
  }
}
