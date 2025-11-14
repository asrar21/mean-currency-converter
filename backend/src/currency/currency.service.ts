import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService {
  private apiKey = process.env.FREECURRENCY_API_KEY;
  private baseUrl = 'https://api.freecurrencyapi.com/v1';

  constructor(private http: HttpService) {}

  async listCurrencies() {
    // freecurrencyapi: /symbols
    const url = `${this.baseUrl}/currencies`;
    console.log("url3456",url)
    // const resp = await lastValueFrom(this.http.get(url, {
    //   headers: { apikey: this.apiKey }
    // }));
    const resp = {
    "data": {
        "AED": {
            "symbol": "AED",
            "name": "United Arab Emirates Dirham",
            "symbol_native": "د.إ",
            "decimal_digits": 2,
            "rounding": 0,
            "code": "AED",
            "name_plural": "UAE dirhams"
        },
        "AFN": {
            "symbol": "Af",
            "name": "Afghan Afghani",
            "symbol_native": "؋",
            "decimal_digits": 0,
            "rounding": 0,
            "code": "AFN",
            "name_plural": "Afghan Afghanis"
        },
       
    }
}
    // console.log("resp",resp)
    return resp.data;
  }

  async convert({base, target, amount, date}: {base:string,target:string,amount:number,date?:string}) {
    // Use historical endpoint if date provided: /historical?base=...&symbols=...&date=YYYY-MM-DD
    const params: any = { base, symbols: target };
    let url: string;
    if (date) {
      // endpoint: /historical
      url = `${this.baseUrl}/historical`;
      params.date = date;
    } else {
      url = `${this.baseUrl}/latest`;
    }
    const resp = await lastValueFrom(this.http.get(url, {
      headers: { apikey: this.apiKey },
      params
    }));
    // resp.data: {data: {rates: { ... }}, meta: ... } or shape per API
    const rate = resp.data?.data?.rates?.[target] ?? resp.data?.data?.[target] ?? null;
    return {
      rate,
      converted: rate ? Number((rate * amount).toFixed(6)) : null,
      raw: resp.data
    };
  }
}
