import { Controller, Get } from '@nestjs/common';
import { AppService } from '../app.service';


@Controller('data')
export class DataController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getData() {
    return this.appService.getLatestContactsFromCache();
  }
}
