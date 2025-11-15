import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService {
  private apiKey = process.env.FREECURRENCY_API_KEY;
  private baseUrl = 'https://api.freecurrencyapi.com/v1';

  constructor(private http: HttpService) {}

  // ----- HARDCODED CURRENCIES ------
  private hardcodedCurrencies = {
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
    "USD": {
      "symbol": "$",
      "name": "US Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "USD",
      "name_plural": "US dollars"
    },
    "PKR": {
      "symbol": "Rs",
      "name": "Pakistani Rupee",
      "symbol_native": "Rs",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "PKR",
      "name_plural": "Pakistani rupees"
    }
  };

  // ----- HARDCODED RATES ------
  private hardcodedRates = {
    "USD": { "PKR": 280, "AED": 3.67, "AFN": 70 },
    "PKR": { "USD": 0.00357, "AED": 0.013, "AFN": 0.25 },
    "AED": { "USD": 0.272, "PKR": 76.2, "AFN": 19 },
    "AFN": { "USD": 0.014, "PKR": 4.1, "AED": 0.053 }
  };

  // ------------------------------
  // LIST CURRENCIES (API + FALLBACK)
  // ------------------------------

  async listCurrencies() {
    try {
      const url = `${this.baseUrl}/currencies`;
      const resp = await lastValueFrom(
        this.http.get(url, { headers: { apikey: this.apiKey } })
      );

      return resp.data?.data ?? this.hardcodedCurrencies;

    } catch (err) {
      console.warn("API FAILED — USING HARDCODED CURRENCIES");
      return this.hardcodedCurrencies;
    }
  }

  // ------------------------------
  // CONVERSION (API + FALLBACK)
  // ------------------------------

  async convert({
    base,
    target,
    amount,
    date
  }: {
    base: string;
    target: string;
    amount: number;
    date?: string;
  }) {
    try {
      let url = date
        ? `${this.baseUrl}/historical`
        : `${this.baseUrl}/latest`;

      const params: any = { base, symbols: target };
      if (date) params.date = date;

      const resp = await lastValueFrom(
        this.http.get(url, {
          headers: { apikey: this.apiKey },
          params
        })
      );

      const rate =
        resp.data?.data?.rates?.[target] ??
        resp.data?.data?.[target] ??
        null;

      if (!rate) throw new Error("API returned no rate");

      return {
        rate,
        converted: Number((rate * amount).toFixed(6)),
        raw: resp.data,
        source: "api"
      };

    } catch (err) {
      console.warn("API FAILED — USING HARDCODED RATES");

      // FALLBACK RATE
      const rate = this.hardcodedRates[base]?.[target] ?? null;

      return {
        rate,
        converted: rate ? Number((rate * amount).toFixed(6)) : null,
        raw: { base, target, amount, rate },
        source: "fallback"
      };
    }
  }
}
