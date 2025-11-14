import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('api/currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('symbols')
  async symbols() {
    return this.currencyService.listCurrencies();
  }

  @Get('convert')
  async convert(
    @Query('base') base: string,
    @Query('target') target: string,
    @Query('amount') amountStr: string,
    @Query('date') date?: string,
  ) {
    const amount = Number(amountStr) || 1;
    return this.currencyService.convert({base, target, amount, date});
  }
}
