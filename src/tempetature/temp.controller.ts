import { Controller, Get, Param } from '@nestjs/common';
import { TempService } from './temp.service';

//import { ITemp } from './temp.interface';

@Controller()
export class TempController {
  constructor(private readonly tempService: TempService) {}

  @Get('/temp/:device/:start/:end')
  getTemp(
    @Param('device') device: string,
    @Param('start') startDate: string,
    @Param('end') endDate: string,
  ) {
    return this.tempService.getTemp(device, startDate, endDate);
  }

  @Get('/temps/:start/:end')
  getTemps(@Param('start') startDate: string, @Param('end') endDate: string) {
    return this.tempService.getTemps(startDate, endDate);
  }
}
