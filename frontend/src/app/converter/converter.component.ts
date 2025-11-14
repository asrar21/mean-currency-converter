import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { HistoryService, ConversionRecord } from '../service/history.service';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-converter',
  standalone: true,
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Material modules
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class ConverterComponent implements OnInit {
  symbolsList: { [key:string]: string } = {};
  loadingSymbols = false;
  converting = false;

  baseControl = new FormControl('USD');
  targetControl = new FormControl('EUR');
  amountControl = new FormControl(1);
  dateControl = new FormControl(); // optional date (mat-datepicker)

  convertedValue: number | null = null;
  usedRate: number | null = null;
  history: ConversionRecord[] = [];

  constructor(private api: ApiService, private historyService: HistoryService) {}

  ngOnInit() {
    this.loadSymbols();
    this.history = this.historyService.load();
  }

  loadSymbols() {
    this.loadingSymbols = true;
    this.api.symbols().subscribe({
      next: (res:any) => {
        // console.log("res",res)
        // API returns object in res.data or res (structure may vary). defensive:
        const payload = res?.data ?? res;
        // payload may be { USD: "United States Dollar", ... } or similar
        this.symbolsList = payload?.symbols ?? payload ?? {};
        console.log("this.symbolsList",this.symbolsList)
        this.loadingSymbols = false;
      },
      error: () => this.loadingSymbols = false
    })
  }

  onConvert() {
    const base = this.baseControl.value;
    const target = this.targetControl.value;
    const amount = Number(this.amountControl.value) || 0;
    const dateVal: Date = this.dateControl.value;
    let dateString: string | undefined;
    if (dateVal) {
      const yyyy = dateVal.getFullYear();
      const mm = String(dateVal.getMonth() + 1).padStart(2,'0');
      const dd = String(dateVal.getDate()).padStart(2,'0');
      dateString = `${yyyy}-${mm}-${dd}`;
    }

    if (!base || !target || amount <= 0) return;
    this.converting = true;
    this.api.convert(base, target, amount, dateString).subscribe({
      next: (res:any) => {
        // defensive parsing
        const rate = res?.rate ?? res?.data?.rates?.[target] ?? res?.data?.rates?.[target];
        const converted = res?.converted ?? (rate ? Number((rate * amount).toFixed(6)) : null);
        this.usedRate = rate;
        this.convertedValue = converted;
        // add to history
        const rec: ConversionRecord = {
          id: Date.now().toString(36),
          timestamp: Date.now(),
          dateUsed: dateString,
          base, target, amount, result: converted, rate
        };
        this.historyService.save(rec);
        this.history = this.historyService.load();
        this.converting = false;
      },
      error: () => { this.converting = false; }
    });
  }

  swap() {
    const b = this.baseControl.value;
    this.baseControl.setValue(this.targetControl.value);
    this.targetControl.setValue(b);
  }

  clearHistory() {
    this.historyService.clear();
    this.history = [];
  }
}
