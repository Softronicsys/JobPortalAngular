import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Constants } from '../../../../Helper/Constant';
import { AppConfigService } from '@app/Service/app-config.service';
import { DataService } from '@app/Shared/Services/data.services';
declare var $: any;

@Component({
  selector: 'app-ctc-offer-letter-view',
  templateUrl: './ctc-offer-letter-view.component.html',
  styleUrls: ['./ctc-offer-letter-view.component.css']
})
export class CtcOfferLetterViewComponent implements OnInit {
  recPositionAppliedId: number = 0;
  loading: boolean = false;

  applicantRow: any = null;
  headerRow: any = null;
  lines: any[] = [];

  monthlyBenefits: any[] = [];
  annualBenefits: any[] = [];
  contributions: any[] = [];
  deductions: any[] = [];
  docText: string = '';
  selectedJob: number = 0;
  selectedAction: number = 0;
  expectedJoiningDate: string = '';
  remarks: string = '';
  isRejectOrRespond: boolean = false;
  ExpectedDateMandatory: boolean = false;
  PreviousDateMandatory: boolean = false;
  responseMessage: string = '';
  jobCode: string = '';
  recommendedByEmpId: number = 0;
  companyId: number = 0;
  viewMode: string = 'ctc';
  pageTitle: string = 'Offer Acceptance (Job Portal)';
  pageSubtitle: string = 'Review and accept the proposed offer details.';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private config: AppConfigService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.recPositionAppliedId = Number(params['recPositionAppliedId'] || params['RecPositionAppliedId'] || 0);
      this.selectedJob = Number(params['offerLetterStatus'] || 0);
      this.jobCode = (params['jobCode'] || '').toString();
      this.recommendedByEmpId = Number(params['recommendedByEmpId'] || 0);
      this.companyId = Number(params['companyId'] || 0);
      this.docText = (params['docText'] || '').toString();
      this.viewMode = (params['viewMode'] || 'ctc').toString();
      if (this.viewMode === 'offer-letter') {
        this.pageTitle = 'Offer Letter';
        this.pageSubtitle = 'Review the offer letter details.';
      } else {
        this.pageTitle = 'Offer Acceptance (Job Portal)';
        this.pageSubtitle = 'Review and accept the proposed offer details.';
      }
      if (this.recPositionAppliedId > 0) {
        this.loadOffer();
      }
    });
  }

  canRespond(): boolean {
    // The legacy offer-letter view should keep the action buttons available,
    // regardless of the current offer status.
    if (this.viewMode === 'offer-letter') {
      return true;
    }
    return this.selectedJob !== 1 && this.selectedJob !== 2 && this.selectedJob !== 4;
  }

  onViewOfferLetter() {
    try {
      if (this.docText) {
        $('#myModalofferCTC .modal-body').html(this.docText);
      } else {
        $('#myModalofferCTC .modal-body').html('<p>No offer letter template found.</p>');
      }
      $('#myModalofferCTC').modal('show');
    } catch {
      // no-op
    }
  }

  openDateModal(action: number) {
    this.selectedAction = action;
    this.expectedJoiningDate = '';
    this.remarks = '';
    this.isRejectOrRespond = false;
    this.ExpectedDateMandatory = false;
    this.PreviousDateMandatory = false;
    $('#expectedDateModalCTC').modal('show');
  }

  closeOfferModals() {
    $('#expectedDateModalCTC').modal('hide');
  }

  submitExpectedDate() {
    if (this.selectedAction === 1) {
      if (!this.expectedJoiningDate) {
        this.ExpectedDateMandatory = true;
        return;
      }
      const selectedDate = new Date(this.expectedJoiningDate);
      const currentDate = new Date();
      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      if (selectedDate < currentDate) {
        this.PreviousDateMandatory = true;
        return;
      }
      this.PreviousDateMandatory = false;
      this.ExpectedDateMandatory = false;
    }

    this.submitOfferResponse(this.selectedAction, this.selectedAction === 1 ? this.expectedJoiningDate : '');
  }

  submitOfferResponse(action: number, expectedDate: string) {
    if ((action === 2 || action === 3) && !this.remarks) {
      this.isRejectOrRespond = true;
      return;
    }

    const requestObject = {
      ApplicantId: localStorage.getItem('AppId'),
      Culture: Constants.Culture,
      CompanyId: this.companyId > 0 ? this.companyId : -1,
      CompanyGroupID: this.config.environment.CompanyGroupID,
      OfferLetterAcceptanceStatus: action,
      OfferLetterRemarks: this.remarks,
      JobCode: this.jobCode,
      ExpectedJoiningDate: expectedDate,
      ApplicantEmail: localStorage.getItem('Email'),
      RecommendedByEmpId: this.recommendedByEmpId
    };

    const apiUrl = this.config.environment.baseUrl + Constants.SubmitOfferResponse;
    this.dataService.post(apiUrl, requestObject).subscribe(
      (response: any) => {
        $('#expectedDateModalCTC').modal('hide');
        if (response && response.IsValid) {
          this.responseMessage = 'Your response has been submitted. You will be contacted soon by the HR department.';
          this.selectedJob = action;
          // Persist latest status in URL so refresh keeps button visibility correct.
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { offerLetterStatus: action },
            queryParamsHandling: 'merge',
            replaceUrl: true
          });
        } else {
          this.responseMessage = 'An error occurred. Please try again later.';
        }
        $('#responseModalCTC').modal('show');
      },
      () => {
        this.responseMessage = 'An error occurred. Please try again later.';
        $('#responseModalCTC').modal('show');
      }
    );
  }

  private loadOffer() {
    this.loading = true;
    const url = this.config.environment.baseUrl + Constants.GetApplicantOfferByRecPositionAppliedIdFromPolicy + '?recPositionAppliedId=' + this.recPositionAppliedId;

    this.dataService.get(url).subscribe((response: any) => {
      this.applicantRow = this.getFirstRow(response, 'Table0');
      this.headerRow = this.getFirstRow(response, 'Table1');
      this.lines = this.getRows(response, 'Table2');
      this.mapSections();
      this.loading = false;
    }, () => {
      this.applicantRow = null;
      this.headerRow = null;
      this.lines = [];
      this.mapSections();
      this.loading = false;
    });
  }

  private getFirstRow(response: any, tableName: string): any {
    const rows = this.getRows(response, tableName);
    return rows.length > 0 ? rows[0] : null;
  }

  private getRows(response: any, tableName: string): any[] {
    if (!response) { return []; }
    if (Array.isArray(response[tableName])) { return response[tableName]; }

    const tableIndex = tableName === 'Table0' ? 0 : tableName === 'Table1' ? 1 : 2;
    if (response.DataSet && Array.isArray(response.DataSet.Tables) && response.DataSet.Tables.length > tableIndex) {
      const t = response.DataSet.Tables[tableIndex];
      return Array.isArray(t) ? t : [];
    }

    return [];
  }

  private mapSections() {
    this.monthlyBenefits = [];
    this.annualBenefits = [];
    this.contributions = [];
    this.deductions = [];

    (this.lines || []).forEach((row: any) => {
      const group = this.value(row, 'ComponentGroup').toLowerCase();
      const isAnnualAmortized = (group === 'benefitpolicy' || group === 'annualbenefits');
      const currentRaw = this.numVal(row, 'Value_Current');
      const probationRaw = this.numVal(row, 'Value_Probation');
      const confirmedRaw = this.numVal(row, 'Value_Confirmed');
      const mapped = {
        name: this.value(row, 'ComponentName'),
        description: this.value(row, 'Description'),
        currentTaxable: this.boolValCurrent(row),
        isTaxable: this.boolVal(row, 'IsTaxable'),
        taxable: this.boolVal(row, 'IsTaxable') ? 'Taxable' : 'Non-Taxable',
        current: this.resolveCurrentDisplayValue(row, currentRaw, isAnnualAmortized),
        probation: this.resolveDisplayValue(row, probationRaw, 'probation', isAnnualAmortized),
        confirmed: this.resolveDisplayValue(row, confirmedRaw, 'confirmed', isAnnualAmortized)
      };

      if (group === 'taxableallowance' || group === 'nontaxableallowance' || group === 'monthlybenefits') {
        this.monthlyBenefits.push(mapped);
      } else if (group === 'contribution') {
        this.contributions.push(mapped);
      } else if (group === 'employeecontribution' || group === 'monthlydeductions') {
        this.deductions.push(mapped);
      } else if (group === 'benefitpolicy' || group === 'annualbenefits') {
        this.annualBenefits.push(mapped);
      }
    });
  }

  private resolveCurrentDisplayValue(row: any, rawValue: number, isAnnualAmortized: boolean): number {
    const basis = this.resolvePercentBasis(row);
    const percentFromColumn = this.numVal(row, 'PercentValue');
    const inferredPercent = this.inferPercentFromRow(row, rawValue);
    const isPercentage = this.boolVal(row, 'IsPercentage')
      || !!basis
      || percentFromColumn > 0
      || inferredPercent > 0;

    if (isAnnualAmortized && !isPercentage) {
      return Math.round(Number(rawValue || 0) / 12);
    }
    return Number(rawValue || 0);
  }

  private resolveDisplayValue(row: any, rawValue: number, column: 'probation' | 'confirmed', isAnnualAmortized: boolean): number {
    const basis = this.resolvePercentBasis(row);
    const percentFromColumn = this.numVal(row, 'PercentValue');
    const inferredPercent = this.inferPercentFromRow(row, rawValue);
    const isPercentage = this.boolVal(row, 'IsPercentage')
      || !!basis
      || percentFromColumn > 0
      || inferredPercent > 0;

    if (!isPercentage) {
      if (isAnnualAmortized) {
        return Math.round(Number(rawValue || 0) / 12);
      }
      return Number(rawValue || 0);
    }

    if (!basis) {
      return Number(rawValue || 0);
    }

    let percent = percentFromColumn > 0 ? percentFromColumn : inferredPercent;
    if (!(percent > 0)) {
      return Number(rawValue || 0);
    }

    const base = this.getBasisAmount(column, basis);
    if (!(base > 0)) {
      return Number(rawValue || 0);
    }

    let computed = Math.round((base * percent) / 100);
    if (isAnnualAmortized) {
      computed = Math.round(computed / 12);
    }
    return computed;
  }

  private inferPercentFromRow(row: any, fallbackRaw: number): number {
    const rawCandidates = [
      this.numVal(row, 'PercentValue'),
      this.numVal(row, 'Value_Probation'),
      this.numVal(row, 'Value_Confirmed'),
      this.numVal(row, 'Value_Current'),
      Number(fallbackRaw || 0)
    ];

    for (let i = 0; i < rawCandidates.length; i++) {
      const v = Number(rawCandidates[i] || 0);
      if (v > 0 && v <= 100) {
        return v;
      }
    }
    return 0;
  }

  private resolvePercentBasis(row: any): 'gross' | 'basic' | '' {
    const combined = (this.value(row, 'PercentBasis') + ' ' + this.value(row, 'Unit')).toLowerCase();
    if (combined.indexOf('gross') >= 0) {
      return 'gross';
    }
    if (combined.indexOf('basic') >= 0) {
      return 'basic';
    }
    return '';
  }

  private getBasisAmount(column: 'probation' | 'confirmed', basis: 'gross' | 'basic'): number {
    if (basis === 'gross') {
      return column === 'probation' ? Number(this.grossProbation || 0) : Number(this.grossConfirmed || 0);
    }
    return column === 'probation' ? Number(this.basicProbation || 0) : Number(this.basicConfirmed || 0);
  }

  private value(row: any, key: string): string {
    return ((row && (row[key] != null ? row[key] : row[this.lowerFirst(key)])) || '').toString();
  }

  private numVal(row: any, key: string): number {
    const raw = row && (row[key] != null ? row[key] : row[this.lowerFirst(key)]);
    return Number(raw || 0);
  }

  private boolVal(row: any, key: string): boolean {
    const raw = row && (row[key] != null ? row[key] : row[this.lowerFirst(key)]);
    if (typeof raw === 'string') {
      const v = raw.toLowerCase();
      return v === 'true' || v === '1' || v === 'yes';
    }
    return !!raw;
  }

  private boolValCurrent(row: any): boolean {
    const raw = row && (row['IsTaxableCurrent'] != null ? row['IsTaxableCurrent'] : row['isTaxableCurrent']);
    if (raw == null || raw === '') {
      return this.boolVal(row, 'IsTaxable');
    }
    if (typeof raw === 'string') {
      const v = raw.toLowerCase();
      return v === 'true' || v === '1' || v === 'yes';
    }
    return !!raw;
  }

  private lowerFirst(v: string): string {
    return v ? v.charAt(0).toLowerCase() + v.slice(1) : v;
  }

  asCurrency(v: number): string {
    const n = Math.round(Number(v || 0));
    return 'Rs ' + n.toLocaleString('en-US');
  }

  asCurrencyNullable(v: number | null): string {
    return v == null ? '--' : this.asCurrency(v);
  }

  get grossProbation(): number | null {
    const row = (this.lines || []).find((x: any) => this.value(x, 'ComponentName').toLowerCase() === 'monthly gross salary');
    if (row) {
      const raw = row && (row.Value_Probation != null ? row.Value_Probation : row.value_Probation);
      if (raw != null && raw !== '') {
        const lineValue = Number(raw);
        if (lineValue > 0) {
          return lineValue;
        }
      }
    }

    const headerValue = this.headerRow && (this.headerRow.GrossProbation != null ? this.headerRow.GrossProbation : this.headerRow.grossProbation);
    return (headerValue == null || headerValue === '') ? null : Number(headerValue);
  }

  get grossConfirmed(): number | null {
    const row = (this.lines || []).find((x: any) => this.value(x, 'ComponentName').toLowerCase() === 'monthly gross salary');
    if (row) {
      const raw = row && (row.Value_Confirmed != null ? row.Value_Confirmed : row.value_Confirmed);
      if (raw != null && raw !== '') {
        const lineValue = Number(raw);
        if (lineValue > 0) {
          return lineValue;
        }
      }
    }

    const headerValue = this.headerRow && (this.headerRow.GrossConfirmed != null ? this.headerRow.GrossConfirmed : this.headerRow.grossConfirmed);
    return (headerValue == null || headerValue === '') ? null : Number(headerValue);
  }

  get benefitsCurrentTotal(): number {
    return this.sumRows(this.monthlyBenefits, 'current');
  }

  get benefitsProbationTotal(): number {
    return this.sumRows(this.monthlyBenefits, 'probation');
  }

  get benefitsConfirmedTotal(): number {
    return this.sumRows(this.monthlyBenefits, 'confirmed');
  }

  get deductionsCurrentTotal(): number {
    return this.sumRows(this.deductions, 'current');
  }

  get deductionsProbationTotal(): number {
    return this.sumRows(this.deductions, 'probation');
  }

  get deductionsConfirmedTotal(): number {
    return this.sumRows(this.deductions, 'confirmed');
  }

  get annualBenefitsCurrentTotal(): number {
    return this.sumRows(this.annualBenefits, 'current');
  }

  get annualBenefitsProbationTotal(): number {
    return this.sumRows(this.annualBenefits, 'probation');
  }

  get annualBenefitsConfirmedTotal(): number {
    return this.sumRows(this.annualBenefits, 'confirmed');
  }

  get companyContribCurrentTotal(): number {
    return this.sumRows(this.contributions, 'current');
  }

  get companyContribProbationTotal(): number {
    return this.sumRows(this.contributions, 'probation');
  }

  get companyContribConfirmedTotal(): number {
    return this.sumRows(this.contributions, 'confirmed');
  }

  private taxableSum(rows: any[], key: string, taxableKey: 'isTaxable' | 'currentTaxable' = 'isTaxable'): number {
    return (rows || []).reduce((acc: number, r: any) => {
      return acc + ((r && r[taxableKey]) ? Number((r[key] != null) ? r[key] : 0) : 0);
    }, 0);
  }

  private calculateAnnualTax(taxableAnnualIncome: number): number {
    const income = Number(taxableAnnualIncome || 0);
    if (income <= 600000) { return 0; }
    if (income <= 1200000) { return (income - 600000) * 0.05; }
    if (income <= 2200000) { return 30000 + ((income - 1200000) * 0.15); }
    if (income <= 3200000) { return 180000 + ((income - 2200000) * 0.25); }
    if (income <= 4100000) { return 430000 + ((income - 3200000) * 0.30); }
    return 700000 + ((income - 4100000) * 0.35);
  }

  private monthlyTaxFromTaxableIncome(taxableMonthlyIncome: number): number {
    const annualTaxable = Number(taxableMonthlyIncome || 0) * 12;
    return this.calculateAnnualTax(annualTaxable) / 12;
  }

  get taxCurrent(): number {
    const taxableGross = this.grossCurrentTaxable ? this.grossCurrent : 0;
    const taxableMonthlyBenefits = this.taxableSum(this.monthlyBenefits, 'current', 'currentTaxable');
    const taxableAnnualBenefitsMonthlyEqv = this.taxableSum(this.annualBenefits, 'current', 'currentTaxable');
    return this.monthlyTaxFromTaxableIncome(taxableGross + taxableMonthlyBenefits + taxableAnnualBenefitsMonthlyEqv);
  }

  get taxProbation(): number {
    const taxableGross = Number(this.grossProbation || 0);
    const taxableBenefits = this.taxableSum(this.monthlyBenefits, 'probation');
    return this.monthlyTaxFromTaxableIncome(taxableGross + taxableBenefits);
  }

  get taxConfirmed(): number {
    const taxableGross = Number(this.grossConfirmed || 0);
    const taxableMonthlyBenefits = this.taxableSum(this.monthlyBenefits, 'confirmed');
    const taxableAnnualBenefitsMonthlyEqv = this.taxableSum(this.annualBenefits, 'confirmed');
    return this.monthlyTaxFromTaxableIncome(taxableGross + taxableMonthlyBenefits + taxableAnnualBenefitsMonthlyEqv);
  }

  get grossCurrentTaxable(): boolean {
    const row = (this.lines || []).find((x: any) => this.value(x, 'ComponentName').toLowerCase() === 'monthly gross salary');
    if (!row) {
      return true;
    }
    return this.boolValCurrent(row);
  }

  get netCurrent(): number {
    return this.grossCurrent + this.benefitsCurrentTotal - this.taxCurrent - this.deductionsCurrentTotal;
  }

  get netProbation(): number {
    return Number(this.grossProbation || 0) + this.benefitsProbationTotal - this.taxProbation - this.deductionsProbationTotal;
  }

  get netConfirmed(): number {
    return Number(this.grossConfirmed || 0) + this.benefitsConfirmedTotal - this.taxConfirmed - this.deductionsConfirmedTotal;
  }

  get varianceProbationMonthlyNet(): number {
    return this.netProbation - this.netCurrent;
  }

  get varianceConfirmedMonthlyNet(): number {
    return this.netConfirmed - this.netCurrent;
  }

  get varianceProbationPercent(): number {
    if (!this.netCurrent) { return 0; }
    return (this.varianceProbationMonthlyNet / this.netCurrent) * 100;
  }

  get varianceConfirmedPercent(): number {
    if (!this.netCurrent) { return 0; }
    return (this.varianceConfirmedMonthlyNet / this.netCurrent) * 100;
  }

  pctWidth(v: number): number {
    const abs = Math.abs(Number(v || 0));
    return Math.min(abs, 100);
  }

  abs(v: number): number {
    return Math.abs(Number(v || 0));
  }

  get annualGrossCurrent(): number {
    return (this.grossCurrent + this.benefitsCurrentTotal + this.annualBenefitsCurrentTotal + this.companyContribCurrentTotal) * 12;
  }

  get annualGrossProbation(): number {
    return (Number(this.grossProbation || 0) + this.benefitsProbationTotal + this.annualBenefitsProbationTotal + this.companyContribProbationTotal) * 12;
  }

  get annualGrossConfirmed(): number {
    return (Number(this.grossConfirmed || 0) + this.benefitsConfirmedTotal + this.annualBenefitsConfirmedTotal + this.companyContribConfirmedTotal) * 12;
  }

  private sumRows(rows: any[], key: string): number {
    return (rows || []).reduce((acc: number, r: any) => acc + Number((r && r[key] != null) ? r[key] : 0), 0);
  }

  get basicCurrent(): number {
    const value = this.headerRow && (this.headerRow.BasicCurrent != null ? this.headerRow.BasicCurrent : this.headerRow.basicCurrent);
    return Number(value || 0);
  }

  get grossCurrent(): number {
    const value = this.headerRow && (this.headerRow.GrossCurrent != null ? this.headerRow.GrossCurrent : this.headerRow.grossCurrent);
    return Number(value || 0);
  }

  get basicProbation(): number | null {
    const value = this.headerRow && (this.headerRow.BasicProbation != null ? this.headerRow.BasicProbation : this.headerRow.basicProbation);
    return (value == null || value === '') ? null : Number(value);
  }

  get basicConfirmed(): number | null {
    const value = this.headerRow && (this.headerRow.BasicConfirmed != null ? this.headerRow.BasicConfirmed : this.headerRow.basicConfirmed);
    return (value == null || value === '') ? null : Number(value);
  }
}
