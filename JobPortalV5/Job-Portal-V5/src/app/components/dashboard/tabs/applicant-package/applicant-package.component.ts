import { Component, OnInit } from '@angular/core';
import { UpdateProfileService } from '../../../../Service/UpdateProfile.service';
import { ThemeColorService } from '../../../../Service/ThemeColor.service';
import { isNullOrUndefined } from 'util';
import { Constants } from '../../../../Helper/Constant';
declare var $: any;
import { EventEmitter, Output, ViewChildren, QueryList, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Action } from '../../../../Helper/Enums';
declare var $: any;
import { NgxSpinnerService } from 'ngx-spinner';
import { GetCompanyParameter } from '../../../../Service/CompanyParameter.service';
import { AppConfigService } from '@app/Service/app-config.service';
import { Subject, Observable } from 'rxjs';
import { Labels } from '@app/Service/DatabaseLbl.service';
import { DatePickerComponent } from '@app/Shared/date-picker/date-picker.component';
import { DataService } from '@app/Shared/Services/data.services';
import { SharedDataService } from '@app/Shared/Services/shared-data.service';








@Component({
  selector: 'app-applicant-package',
  templateUrl: './applicant-package.component.html',
  styleUrls: ['./applicant-package.component.css']
})
export class ApplicantPackageComponent implements OnInit {


  // Candidate Details
  applicantName = 'Ali Khan';
  positionApplied = 'Senior Manager HR';

  // Salary Components
  basicSalary = 100000;
  basicSalaryTaxable = true;

  monthlyGrossSalary = 160000;
  monthlyGrossSalaryTaxable = true;

  carTransportAllowance = 0;
  carTransportAllowanceTaxable = true;

  fuelAllowance = 15000;
  fuelAllowanceTaxable = false;

  opd = 0;
  opdTaxable = false;

  // Annual Benefits
  bonus = 100000;
  bonusTaxable = true;

  lfa = 8000;
  lfaTaxable = true;

  // Loan facility
  employeeLoanDetails = '';

  // Applicant's other benefits
  applicantsOtherBenefits = '';

  // Payslip upload
  payslipDate: string = '';
  //payslipFile: File | null = null;
  AttachmentList: any[] = [];
  isGrid: boolean = true;
  HRLooping: any[3] = [1, 2, 3];
  isMobile: boolean = false;

  // Package Summary - computed
  private toNumber(value: any): number {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
  }

  private isTaxableValue(value: any): boolean {
    if (typeof value === 'string') {
      const v = value.toLowerCase();
      return v === 'yes' || v === 'true' || v === '1' || v === 'taxable';
    }
    return !!value;
  }

  private getTaxableFlagFromRow(row: any): boolean {
    const raw = (row && row.IsTaxableCurrent != null) ? row.IsTaxableCurrent :
      (row && row.isTaxableCurrent != null) ? row.isTaxableCurrent :
        (row && row.IsTaxable != null) ? row.IsTaxable :
          (row && row.isTaxable != null) ? row.isTaxable :
            (row && row.Taxable != null) ? row.Taxable : false;
    return this.isTaxableValue(raw);
  }

  private calculateAnnualTax(taxableIncome: number): number {
    if (taxableIncome <= 600000) { return 0; }
    if (taxableIncome <= 1200000) { return (taxableIncome - 600000) * 0.05; }
    if (taxableIncome <= 2200000) { return 30000 + (taxableIncome - 1200000) * 0.15; }
    if (taxableIncome <= 3200000) { return 180000 + (taxableIncome - 2200000) * 0.25; }
    if (taxableIncome <= 4100000) { return 430000 + (taxableIncome - 3200000) * 0.30; }
    return 700000 + (taxableIncome - 4100000) * 0.35;
  }

  get currentBasicSalaryValue(): number {
    if (this.isBasicInformation25) {
      return this.toNumber(this.BasicSalary);
    }
    if (this.LabelBasicSalary != null) {
      return this.toNumber(this.LabelBasicSalary);
    }
    return this.toNumber(this.BasicSalary);
  }

  get currentMonthlyGrossSalaryValue(): number {
    if (this.isBasicInformation25) {
      return this.toNumber(this.MonthlyGrossSalary);
    }
    if (this.LabelGrossSalary != null) {
      return this.toNumber(this.LabelGrossSalary);
    }
    return this.toNumber(this.MonthlyGrossSalary);
  }

  get totalCurrentPackage(): number {
    return this.grossMonthly + this.currentMonthlyAllowances + this.currentAnnualBenefitsMonthly;
  }

  get currentMonthlyAllowances(): number {
    return (this.BenefitsDetail || [])
      .reduce((sum: number, row: any) => sum + this.toNumber(row && row.Amount), 0);
  }

  get currentAnnualBenefitsMonthly(): number {
    return (this.AnnualBenefitsList || [])
      .reduce((sum: number, row: any) => sum + this.toNumber(row && row.Amount), 0);
  }

  get currentEmployeeDeductions(): number {
    return (this.offerLinesForSummary || []).reduce((sum: number, row: any) => {
      const componentGroup = (((row && row.ComponentGroup) || (row && row.componentGroup) || '').toString()).toLowerCase();
      const frequency = (((row && row.Frequency) || (row && row.frequency) || '').toString()).toLowerCase();
      const isMonthly = !frequency || frequency === 'monthly';
      if (componentGroup !== 'employeecontribution' || !isMonthly) {
        return sum;
      }
      const amountRaw = (row && row.Value_Current != null) ? row.Value_Current :
        ((row && row.value_Current != null) ? row.value_Current :
          ((row && row.Amount != null) ? row.Amount : (row && row.amount)));
      const amount = this.toNumber(amountRaw);
      return sum + Math.abs(amount);
    }, 0);
  }

  get grossMonthly(): number {
    return this.currentMonthlyGrossSalaryValue;
  }

  get estimatedTax(): number {
    const taxableGrossMonthly = this.monthlyGrossSalaryTaxable ? this.grossMonthly : 0;
    const taxableAllowancesMonthly = (this.BenefitsDetail || []).reduce((sum: number, row: any) => {
      const isTaxable = this.getTaxableFlagFromRow(row);
      return sum + (isTaxable ? this.toNumber(row && row.Amount) : 0);
    }, 0);
    const taxableAnnualBenefitsMonthly = (this.AnnualBenefitsList || []).reduce((sum: number, row: any) => {
      const isTaxable = this.getTaxableFlagFromRow(row);
      return sum + (isTaxable ? this.toNumber(row && row.Amount) : 0);
    }, 0);

    const annualTaxableIncome = (taxableGrossMonthly + taxableAllowancesMonthly + taxableAnnualBenefitsMonthly) * 12;
    return this.calculateAnnualTax(annualTaxableIncome) / 12;
  }

  get netMonthly(): number {
    return (this.grossMonthly + this.currentMonthlyAllowances) - this.estimatedTax - this.currentEmployeeDeductions;
  }

  get currentAnnualGross(): number {
    return (this.grossMonthly + this.currentMonthlyAllowances + this.currentAnnualBenefitsMonthly) * 12;
  }

  addOtherBenefit() {
    alert('Add Other Benefit clicked!');
  }

  addOtherAnnualBenefit() {
    alert('Add Other Annual Benefit clicked!');
  }

  resetForm() {
    // Reset all to initial or blank
    this.applicantName = '';
    this.positionApplied = '';
    this.basicSalary = 0;
    this.basicSalaryTaxable = false;
    this.monthlyGrossSalary = 0;
    this.monthlyGrossSalaryTaxable = false;
    this.carTransportAllowance = 0;
    this.carTransportAllowanceTaxable = false;
    this.fuelAllowance = 0;
    this.fuelAllowanceTaxable = false;
    this.opd = 0;
    this.opdTaxable = false;
    this.bonus = 0;
    this.bonusTaxable = false;
    this.lfa = 0;
    this.lfaTaxable = false;
    this.employeeLoanDetails = '';
    this.applicantsOtherBenefits = '';
    this.payslipDate = '';
    this.AttachmentList = null;
  }

  saveDetails() {
    alert('Save Details clicked! Implement saving logic.');
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB.');
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, PNG allowed.');
      return;
    }

    const attachment = {
      FileName: file.name,
      UploadDate: new Date(),
      FileSize: Math.round(file.size / 1024),
      FileObject: file
    };

    this.AttachmentList.push(attachment);

    // reset input
    event.target.value = '';
  }

  //onFileSelected(event: any) {
  //  const file = event.target.files[0];
  //  if (file && file.size <= 5 * 1024 * 1024) {
  //    this.AttachmentList = file;
  //    alert(`File ${file.name} selected.`);
  //  } else {
  //    alert('File size exceeds 5MB or no file selected.');
  //  }
  //}


  onFileDrop(event: DragEvent) {
    event.preventDefault();

    if (!event.dataTransfer.files.length) return;

    const file = event.dataTransfer.files[0];

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB.');
      return;
    }

    const attachment = {
      FileName: file.name,
      UploadDate: new Date(),
      FileSize: Math.round(file.size / 1024),
      FileObject: file
    };

    this.AttachmentList.push(attachment);
  }



  viewAttachment(item: any) {
    const fileURL = URL.createObjectURL(item.FileObject);
    window.open(fileURL);
  }

  deleteAttachment(item: any) {
    this.AttachmentList = this.AttachmentList.filter(x => x !== item);
  }

  //onFileDrop(event: DragEvent) {
  //  event.preventDefault();
  //  if (event.dataTransfer.files.length) {
  //    const file = event.dataTransfer.files[0];
  //    if (file.size <= 5 * 1024 * 1024) {
  //      this.payslipFile = file;
  //      alert(`File ${file.name} dropped.`);
  //    } else {
  //      alert('File size exceeds 5MB.');
  //    }
  //  }
  //}

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }


  isSideBar: boolean = true;
  FirstName: string = "";
  MiddleName: string = "";
  LastName: string = "";
  tooltipName: string = "";
  isname: boolean = false;
  Username;

  userName: string = "";
  email: string = "";
  Address: string = "";
  TelMobile: string = "";
  DateOB: string = "";
  Age: string = "";
  Email: string = "";


  Benefits: string = "Benefits & Perks (Monthly EQV)";


  onApplicantInfo(eventData: any) {

    this.isSideBar = false;
    this.isname = true;
    this.Username = eventData.Username;
    //    console.log("Username --------------", this.Username)
    this.Address = eventData.address;
    this.TelMobile = eventData.telMobile;
    this.DateOB = eventData.dateOB;
    this.Age = eventData.age;
    this.Email = eventData.Email;
    this.FirstName = eventData.firstName,
      this.MiddleName = eventData.middleName,
      this.LastName = eventData.lastName
    this.tooltipName = this.FirstName + "&nbsp;" + this.MiddleName + "&nbsp;" + this.LastName;
    this.updateProfService.ProfilePercentage = eventData.strengthBar;
    //this.strength();
    //if (this.updateProfService.ProfilePercentage !== '0%') {
    //    this.isProfileImage = false;
    //    //this.isProfileCompletion = true;
    //} else {
    //    this.isProfileImage = true;
    //    //this.isProfileCompletion = false;
    //}
    //this.readFromBlob1();
  }


  isCorrectDateCertificate: boolean = false;

  crtid: string = "";
  Score: string = "";
  CountryCertificate: string = "";
  ScoreTypeCertificate: string = "";
  CertificateCity: number = 1;
  CertificateAddress: string = "";
  OtherCertification: string = "";
  OtherInstituteCertification: string = "";
  crtidValidation: string = "";
  crtidForNullValue: any;



  ThemeFontColor: string = "";
  DefaultFontColor: string = "";
  BorderColor: string = "";
  DefaultBorderColor: string = "";
  tickImage: string = "";

  forChanges: any;
  breakcode: any;
  code: any;




  Color() {
    this.forChanges = this.ClrThemeChng.ChangeTheme;

    if (isNullOrUndefined(this.forChanges)) {
      this.DefaultFontColor = "#" + Constants.default;
      this.DefaultBorderColor = "1px solid #" + Constants.default;
      this.tickImage = "assets/images/" + Constants.default + "/tick.png";
    }
    else if (!isNullOrUndefined(this.forChanges)) {
      this.breakcode = this.forChanges.split('#');
      this.code = this.breakcode[1];
      console.log(this.forChanges);
      this.ThemeFontColor = this.forChanges;
      console.log(this.ThemeFontColor);

      this.BorderColor = "1px solid" + this.forChanges;
      this.tickImage = "assets/images/" + this.code + "/tick.png";
    }
  }

  btnAdd_Click(Identifier) {


    this.isCorrectDateCertificate = false;






    if (Identifier == "Certification") {
      // for Certification //
      //this.crtid = "44";
      this.txtCertificateDateOfAchievement = "";
      this.txtCertificateDateOfExpiry = "";
      this.Score = "";
      this.ScoreTypeCertificate = "";
      //this.Institute = "11";
      this.CountryCertificate = "";

      //this.defaultCertificateDateOfAchievement = "";
      //this.defaultCertificateDateOfExpiry = "";
    }





    //this.getDegree();
    //this.getInstitute();
    //this.getCountriesDropdown();
    //this.getCertifications();
    //this.getTrainingSubject();
    //this.getCurrency();
    //this.getCompetencyLevel3();
    //this.getRating();
    //this.getCitiesDropdown();
    ////   this.getCitiesByCountryIdDropdown();
    //this.resetDate();

    if (Identifier == "Benefit") {
      this.resolveRecPositionAppliedId(false);
      this.BenefitName = null;
      this.OtherBenefitName = '';
      this.BenefitAmount = null;
      this.BenefitTaxable = false;
      this.selectedBenefit = null;
      this.loadMonthlyBenefitOptions();
    }
    if (Identifier == "AnnualBenefit") {
      this.resolveRecPositionAppliedId(false);
      this.annualBenefitName = null;
      this.OtherAnnualBenefitName = '';
      this.annualBenefitAmount = null;
      this.annualBenefitTaxable = false;
      this.selectedBenefit = null;
      this.loadMonthlyBenefitOptions();
    }
    if (Identifier == "CompanyContribution") {
      this.resolveRecPositionAppliedId(false);
      this.companyContributionName = null;
      this.OtherCompanyContributionName = '';
      this.companyContributionAmount = null;
      this.companyContributionTaxable = false;
      this.selectedBenefit = null;
      this.loadMonthlyBenefitOptions();
    }
    if (Identifier == "EmployeeContribution") {
      this.resolveRecPositionAppliedId(false);
      this.employeeContributionName = null;
      this.OtherEmployeeContributionName = '';
      this.employeeContributionAmount = null;
      this.employeeContributionTaxable = false;
      this.selectedBenefit = null;
      this.loadMonthlyBenefitOptions();
    }
  }





  isUpdateCertificate: boolean = false;


  txtAcademicDateFrom: any;
  txtAcademicDateOfCompletion;
  txtCertificateDateOfAchievement: any;
  txtCertificateDateOfExpiry: any;
  txtTrainingDateFrom: string = "";
  txtTrainingDateTo: string = "";
  txtExperienceDateFrom: any;
  txtExperienceDateTo: any;
  forDateVlaidation;


  // Grid & Modal Data
  BenefitsDetail: any[] = [];
  offerLinesForSummary: any[] = [];
  selectedBenefit: any = null;
  benefitOptions: { value: number; label: string; isTaxable?: boolean }[] = [];
  recPositionAppliedId: number = 0;
  readonly OTHER_OPTION_VALUE: number = -1;

  // Form Fields
  BenefitName: number | null = null;
  OtherBenefitName: string = '';
  BenefitProvider: string = '';
  BenefitTaxable: boolean = false;
  BenefitAmount: number | null = null;
  BenefitStartDate: Date | null = null;
  BenefitEndDate: Date | null = null;
  selectedBenefitCountry: any = null;

  // Labels
  lblBenefitName: string = 'Benefit Name';
  lblAmount: string = 'Amount';
  lblTaxable: string = 'Taxable (Yes / No)';

 
  //Benefits: string = 'Benefits';

  // Validation Flags
  MndBenefits: boolean = false;
  isMandatoryfields: boolean = false;
  DisconnectInternet: boolean = false;
  isDateValid: boolean = false;
  isAmountValidation: boolean = false;

  // Default Dates
  defaultBenefitStartDate: Date = new Date();
  defaultBenefitEndDate: Date = new Date();

  // Button labels
  Add: string = 'Add';
  Save: string = 'Save';
  Close: string = 'Close';
  Edit: string = "Edit";
  Nodata: string = "No data";

  MndAnnualBenefits: any[] = [];

  annualBenefitName: number | null = null;
  OtherAnnualBenefitName: string = '';
  annualBenefitTaxable: boolean = false;
  AnnualBenefitsList: any[] = [];
  annualBenefitOptions: { value: number; label: string; isTaxable?: boolean }[] = [];
  companyContributionName: number | null = null;
  OtherCompanyContributionName: string = '';
  companyContributionTaxable: boolean = false;
  companyContributionAmount: number | null = null;
  CompanyContributionsList: any[] = [];
  companyContributionOptions: { value: number; label: string; isTaxable?: boolean }[] = [];
  employeeContributionName: number | null = null;
  OtherEmployeeContributionName: string = '';
  employeeContributionTaxable: boolean = false;
  employeeContributionAmount: number | null = null;
  EmployeeContributionsList: any[] = [];
  employeeContributionOptions: { value: number; label: string; isTaxable?: boolean }[] = [];
  pendingDeletePolicyContextItemId: number = 0;
  pendingDeleteOfferLineId: number = 0;

  isMandatoryFields: boolean = false;
  isAmountInvalid: boolean = false;
  isDateInvalid: boolean = false;
  ApplyJobMsg: string = "";
  isTick: boolean = false;
  packageSubmitConsent: boolean = false;
  isSubmittingPackageEmail: boolean = false;
  packageSubmitConsentText: string = "I confirm that this package can be shared with the employee.";
  ctcSubmissionStatus: number = 0;
  isCtcSubmitted: boolean = false;

  canModifyPackage(): boolean {
    return !this.isCtcSubmitted;
  }

  private applyCtcSubmissionStatus(statusRaw: any) {
    const status = Number(statusRaw);
    this.ctcSubmissionStatus = isNaN(status) ? 0 : status;
    this.isCtcSubmitted = this.ctcSubmissionStatus === 1;
    if (this.isCtcSubmitted) {
      this.packageSubmitConsent = true;
      if (this.recPositionAppliedId > 0) {
        localStorage.setItem('CTCSubmissionStatus_' + this.recPositionAppliedId, '1');
        sessionStorage.setItem('CTCSubmissionStatus_' + this.recPositionAppliedId, '1');
      }
    } else {
      this.packageSubmitConsent = false;
      if (this.recPositionAppliedId > 0) {
        localStorage.removeItem('CTCSubmissionStatus_' + this.recPositionAppliedId);
        sessionStorage.removeItem('CTCSubmissionStatus_' + this.recPositionAppliedId);
      }
    }
  }

  saveAnnualBenefit() {
    if (!this.canModifyPackage()) {
      return;
    }
    this.isMandatoryfields = false;
    this.isMandatoryFields = false;
    this.isAmountInvalid = false;

    if (!this.annualBenefitName || (this.annualBenefitName <= 0 && !this.isAnnualOtherSelected())) {
      this.isMandatoryfields = true;
      this.isMandatoryFields = true;
      return;
    }
    if (this.isAnnualOtherSelected() && !this.safeTrim(this.OtherAnnualBenefitName)) {
      this.isMandatoryfields = true;
      this.isMandatoryFields = true;
      return;
    }

    if (this.annualBenefitAmount == null || Number(this.annualBenefitAmount) <= 0 || Number(this.annualBenefitAmount) > 100000) {
      this.isAmountInvalid = true;
      return;
    }

    if (!this.recPositionAppliedId || this.recPositionAppliedId <= 0) {
      console.error('saveAnnualBenefit skipped: recPositionAppliedId missing.');
      return;
    }

    const url = this._config.environment.baseUrl + Constants.UpdateApplicantBenefitByRecPositionAppliedId;
    const payload: any = {
      RecPositionAppliedId: Number(this.recPositionAppliedId),
      PolicyContextItemId: this.isAnnualOtherSelected() ? 0 : Number(this.annualBenefitName),
      OfferLineId: this.getSelectedAnnualOfferLineId(),
      Amount: Number(this.annualBenefitAmount || 0),
      IsTaxable: !!this.annualBenefitTaxable,
      IsOther: this.isAnnualOtherSelected(),
      OtherName: this.isAnnualOtherSelected() ? this.safeTrim(this.OtherAnnualBenefitName) : null,
      BenefitScope: 'Annual',
      FormId: 'ApplicantPackage',
      EntOperation: 'Update'
    };

    this.dataService.post(url, payload).subscribe(
      (response: any) => {
        console.log('UpdateApplicantBenefitByRecPositionAppliedId (annual) success:', response);
        $('#myModalAnnualBenefits').modal('hide');
        this.selectedBenefit = null;
        this.showSaveSuccessPopup();
        this.loadMonthlyBenefitOptions();
      },
      (err) => {
        console.error('UpdateApplicantBenefitByRecPositionAppliedId (annual) failed:', err);
        this.isTick = false;
        this.ApplyJobMsg = this.safeTrim(
          (err && err.error && (err.error.Message || err.error.message)) ||
          (err && (err.message || err.statusText)) ||
          'Failed to save annual benefit.'
        );
        $("#applicantPackageSavePopup").modal('show');
      }
    );
  }

  saveCompanyContribution() {
    if (!this.canModifyPackage()) {
      return;
    }
    this.isMandatoryfields = false;
    this.isMandatoryFields = false;
    this.isAmountInvalid = false;

    if (!this.companyContributionName || (this.companyContributionName <= 0 && !this.isCompanyContributionOtherSelected())) {
      this.isMandatoryfields = true;
      this.isMandatoryFields = true;
      return;
    }
    if (this.isCompanyContributionOtherSelected() && !this.safeTrim(this.OtherCompanyContributionName)) {
      this.isMandatoryfields = true;
      this.isMandatoryFields = true;
      return;
    }
    if (this.companyContributionAmount == null || Number(this.companyContributionAmount) <= 0 || Number(this.companyContributionAmount) > 100000) {
      this.isAmountInvalid = true;
      return;
    }
    if (!this.recPositionAppliedId || this.recPositionAppliedId <= 0) {
      console.error('saveCompanyContribution skipped: recPositionAppliedId missing.');
      return;
    }

    const url = this._config.environment.baseUrl + Constants.UpdateApplicantBenefitByRecPositionAppliedId;
    const payload: any = {
      RecPositionAppliedId: Number(this.recPositionAppliedId),
      PolicyContextItemId: this.isCompanyContributionOtherSelected() ? 0 : Number(this.companyContributionName),
      OfferLineId: this.getSelectedCompanyContributionOfferLineId(),
      Amount: Number(this.companyContributionAmount || 0),
      IsTaxable: !!this.companyContributionTaxable,
      IsOther: this.isCompanyContributionOtherSelected(),
      OtherName: this.isCompanyContributionOtherSelected() ? this.safeTrim(this.OtherCompanyContributionName) : null,
      BenefitScope: 'Contribution',
      FormId: 'ApplicantPackage',
      EntOperation: 'Update'
    };

    this.dataService.post(url, payload).subscribe(
      () => {
        $('#myModalCompanyContribution').modal('hide');
        this.selectedBenefit = null;
        this.showSaveSuccessPopup();
        this.loadMonthlyBenefitOptions();
      },
      (err) => {
        console.error('UpdateApplicantBenefitByRecPositionAppliedId (company contribution) failed:', err);
      }
    );
  }

  saveEmployeeContribution() {
    if (!this.canModifyPackage()) {
      return;
    }
    this.isMandatoryfields = false;
    this.isMandatoryFields = false;
    this.isAmountInvalid = false;

    if (!this.employeeContributionName || (this.employeeContributionName <= 0 && !this.isEmployeeContributionOtherSelected())) {
      this.isMandatoryfields = true;
      this.isMandatoryFields = true;
      return;
    }
    if (this.isEmployeeContributionOtherSelected() && !this.safeTrim(this.OtherEmployeeContributionName)) {
      this.isMandatoryfields = true;
      this.isMandatoryFields = true;
      return;
    }
    if (this.employeeContributionAmount == null || Number(this.employeeContributionAmount) <= 0 || Number(this.employeeContributionAmount) > 100000) {
      this.isAmountInvalid = true;
      return;
    }
    if (!this.recPositionAppliedId || this.recPositionAppliedId <= 0) {
      console.error('saveEmployeeContribution skipped: recPositionAppliedId missing.');
      return;
    }

    const url = this._config.environment.baseUrl + Constants.UpdateApplicantBenefitByRecPositionAppliedId;
    const payload: any = {
      RecPositionAppliedId: Number(this.recPositionAppliedId),
      PolicyContextItemId: this.isEmployeeContributionOtherSelected() ? 0 : Number(this.employeeContributionName),
      OfferLineId: this.getSelectedEmployeeContributionOfferLineId(),
      Amount: Number(this.employeeContributionAmount || 0),
      IsTaxable: !!this.employeeContributionTaxable,
      IsOther: this.isEmployeeContributionOtherSelected(),
      OtherName: this.isEmployeeContributionOtherSelected() ? this.safeTrim(this.OtherEmployeeContributionName) : null,
      BenefitScope: 'EmployeeContribution',
      FormId: 'ApplicantPackage',
      EntOperation: 'Update'
    };

    this.dataService.post(url, payload).subscribe(
      () => {
        $('#myModalEmployeeContribution').modal('hide');
        this.selectedBenefit = null;
        this.showSaveSuccessPopup();
        this.loadMonthlyBenefitOptions();
      },
      (err) => {
        console.error('UpdateApplicantBenefitByRecPositionAppliedId (employee contribution) failed:', err);
      }
    );
  }

  handleAnnualBenefitEdit(item: any) {
    const itemPolicyId = Number(
      (item && item.PolicyContextItemId != null) ? item.PolicyContextItemId :
      (item && item.policyContextItemId != null) ? item.policyContextItemId :
      (item && item.BenefitName != null) ? item.BenefitName : 0
    );
    this.annualBenefitName = itemPolicyId > 0 ? itemPolicyId : null;
    const isOther = !!((item && item.IsCurrent_Others != null) ? item.IsCurrent_Others : (item && item.isCurrent_Others));
    if (isOther) {
      this.annualBenefitName = this.OTHER_OPTION_VALUE;
      this.OtherAnnualBenefitName = this.safeTrim((item && item.BenefitName) || '');
    } else {
      this.OtherAnnualBenefitName = '';
    }
    this.annualBenefitAmount = Number((item && item.Amount != null) ? item.Amount : 0);
    this.annualBenefitTaxable = this.getTaxableFlagFromRow(item);
    $('#myModalAnnualBenefits').modal('show');
  }

  handleAnnualBenefitDelete(item: any) {
    const itemPolicyId = Number(
      (item && item.PolicyContextItemId != null) ? item.PolicyContextItemId :
      (item && item.policyContextItemId != null) ? item.policyContextItemId : 0
    );
    const offerLineId = Number(
      (item && item.OfferLineId != null) ? item.OfferLineId :
      (item && item.offerLineId != null) ? item.offerLineId : 0
    );
    if (itemPolicyId <= 0 && offerLineId <= 0) {
      return;
    }
    this.pendingDeletePolicyContextItemId = itemPolicyId;
    this.pendingDeleteOfferLineId = offerLineId;
    $('#myModalDeleteConfirm').modal('show');
  }

  handleCompanyContributionEdit(item: any) {
    this.selectedBenefit = item;
    const itemPolicyId = Number((item && item.PolicyContextItemId != null) ? item.PolicyContextItemId : (item && item.policyContextItemId != null) ? item.policyContextItemId : 0);
    this.companyContributionName = itemPolicyId > 0 ? itemPolicyId : null;
    const isOther = !!((item && item.IsCurrent_Others != null) ? item.IsCurrent_Others : (item && item.isCurrent_Others));
    if (isOther) {
      this.companyContributionName = this.OTHER_OPTION_VALUE;
      this.OtherCompanyContributionName = this.safeTrim((item && item.BenefitName) || '');
    } else {
      this.OtherCompanyContributionName = '';
    }
    this.companyContributionAmount = Number((item && item.Amount != null) ? item.Amount : 0);
    this.companyContributionTaxable = this.getTaxableFlagFromRow(item);
    $('#myModalCompanyContribution').modal('show');
  }

  handleCompanyContributionDelete(item: any) {
    this.handleAnnualBenefitDelete(item);
  }

  handleEmployeeContributionEdit(item: any) {
    this.selectedBenefit = item;
    const itemPolicyId = Number((item && item.PolicyContextItemId != null) ? item.PolicyContextItemId : (item && item.policyContextItemId != null) ? item.policyContextItemId : 0);
    this.employeeContributionName = itemPolicyId > 0 ? itemPolicyId : null;
    const isOther = !!((item && item.IsCurrent_Others != null) ? item.IsCurrent_Others : (item && item.isCurrent_Others));
    if (isOther) {
      this.employeeContributionName = this.OTHER_OPTION_VALUE;
      this.OtherEmployeeContributionName = this.safeTrim((item && item.BenefitName) || '');
    } else {
      this.OtherEmployeeContributionName = '';
    }
    this.employeeContributionAmount = Number((item && item.Amount != null) ? item.Amount : 0);
    this.employeeContributionTaxable = this.getTaxableFlagFromRow(item);
    $('#myModalEmployeeContribution').modal('show');
  }

  handleEmployeeContributionDelete(item: any) {
    this.handleAnnualBenefitDelete(item);
  }

  confirmDeleteYes() {
    if (!this.canModifyPackage()) {
      $('#myModalDeleteConfirm').modal('hide');
      return;
    }
    const itemPolicyId = Number(this.pendingDeletePolicyContextItemId || 0);
    const offerLineId = Number(this.pendingDeleteOfferLineId || 0);
    if (!this.recPositionAppliedId || this.recPositionAppliedId <= 0 || (itemPolicyId <= 0 && offerLineId <= 0)) {
      $('#myModalDeleteConfirm').modal('hide');
      return;
    }

    const url = this._config.environment.baseUrl + Constants.DeleteApplicantBenefitByRecPositionAppliedId;
    const payload: any = {
      RecPositionAppliedId: Number(this.recPositionAppliedId),
      PolicyContextItemId: itemPolicyId,
      OfferLineId: offerLineId > 0 ? offerLineId : null
    };

    this.dataService.post(url, payload).subscribe(
      () => {
        this.pendingDeletePolicyContextItemId = 0;
        this.pendingDeleteOfferLineId = 0;
        $('#myModalDeleteConfirm').modal('hide');
        this.loadMonthlyBenefitOptions();
      },
      (err) => {
        this.pendingDeletePolicyContextItemId = 0;
        this.pendingDeleteOfferLineId = 0;
        $('#myModalDeleteConfirm').modal('hide');
        console.error('DeleteApplicantBenefitByRecPositionAppliedId (annual) failed:', err);
      }
    );
  }

  confirmDeleteNo() {
    this.pendingDeletePolicyContextItemId = 0;
    this.pendingDeleteOfferLineId = 0;
    $('#myModalDeleteConfirm').modal('hide');
  }

  nodata: string = 'No data available';

  // Functions
  handleBenefitsEdit(item: any) {
    this.selectedBenefit = item;
    const itemPolicyId = Number(
      (item && item.PolicyContextItemId != null) ? item.PolicyContextItemId :
      (item && item.policyContextItemId != null) ? item.policyContextItemId :
      (item && item.BenefitName != null) ? item.BenefitName : 0
    );
    this.BenefitName = itemPolicyId > 0 ? itemPolicyId : null;
    const isOther = !!((item && item.IsCurrent_Others != null) ? item.IsCurrent_Others : (item && item.isCurrent_Others));
    if (isOther) {
      this.BenefitName = this.OTHER_OPTION_VALUE;
      this.OtherBenefitName = this.safeTrim((item && item.BenefitName) || '');
    } else {
      this.OtherBenefitName = '';
    }
    this.BenefitAmount = Number((item && item.Amount != null) ? item.Amount : 0);
    this.BenefitTaxable = this.getTaxableFlagFromRow(item);
    $('#myModalBenefits').modal('show');
  }

  handleBenefitsDeleteClick(item: any) {
    const itemPolicyId = Number(
      (item && item.PolicyContextItemId != null) ? item.PolicyContextItemId :
      (item && item.policyContextItemId != null) ? item.policyContextItemId : 0
    );
    const offerLineId = Number(
      (item && item.OfferLineId != null) ? item.OfferLineId :
      (item && item.offerLineId != null) ? item.offerLineId : 0
    );
    if (itemPolicyId <= 0 && offerLineId <= 0) {
      return;
    }
    this.pendingDeletePolicyContextItemId = itemPolicyId;
    this.pendingDeleteOfferLineId = offerLineId;
    $('#myModalDeleteConfirm').modal('show');
  }

  SaveBenefit() {
    if (!this.canModifyPackage()) {
      return;
    }
    this.isMandatoryfields = false;
    this.isAmountValidation = false;

    if (!this.BenefitName || (this.BenefitName <= 0 && !this.isMonthlyOtherSelected())) {
      this.isMandatoryfields = true;
      return;
    }
    if (this.isMonthlyOtherSelected() && !this.safeTrim(this.OtherBenefitName)) {
      this.isMandatoryfields = true;
      return;
    }

    if (this.BenefitAmount == null || Number(this.BenefitAmount) <= 0 || Number(this.BenefitAmount) > 100000) {
      this.isAmountValidation = true;
      return;
    }

    if (!this.recPositionAppliedId || this.recPositionAppliedId <= 0) {
      console.error('SaveBenefit skipped: recPositionAppliedId missing.');
      return;
    }

    const url = this._config.environment.baseUrl + Constants.UpdateApplicantBenefitByRecPositionAppliedId;
    const payload: any = {
      RecPositionAppliedId: Number(this.recPositionAppliedId),
      PolicyContextItemId: this.isMonthlyOtherSelected() ? 0 : Number(this.BenefitName),
      OfferLineId: this.getSelectedMonthlyOfferLineId(),
      Amount: Number(this.BenefitAmount || 0),
      IsTaxable: !!this.BenefitTaxable,
      IsOther: this.isMonthlyOtherSelected(),
      OtherName: this.isMonthlyOtherSelected() ? this.safeTrim(this.OtherBenefitName) : null,
      BenefitScope: 'Monthly',
      FormId: 'ApplicantPackage',
      EntOperation: 'Update'
    };

    this.dataService.post(url, payload).subscribe(
      (response: any) => {
        console.log('UpdateApplicantBenefitByRecPositionAppliedId success:', response);
        $('#myModalBenefits').modal('hide');
        this.selectedBenefit = null;
        this.showSaveSuccessPopup();
        this.loadMonthlyBenefitOptions();
      },
      (err) => {
        console.error('UpdateApplicantBenefitByRecPositionAppliedId failed:', err);
      }
    );
  }

  private loadMonthlyBenefitOptions() {
    if (!this.recPositionAppliedId || this.recPositionAppliedId <= 0) {
      this.benefitOptions = [];
      console.warn('GetApplicantOfferByRecPositionAppliedId skipped: recPositionAppliedId missing.');
      return;
    }

    const url = this._config.environment.baseUrl
      + Constants.GetApplicantOfferByRecPositionAppliedId
      + "?recPositionAppliedId=" + this.recPositionAppliedId;

    this.dataService.get(url).subscribe(
      (response: any) => {
        this.applyOfferHeaderFromResponse(response);
        const lines = this.extractOfferLines(response);
        this.offerLinesForSummary = lines || [];
        this.benefitOptions = this.withOtherOption(this.mapMonthlyBenefitOptions(lines));
        this.BenefitsDetail = this.mapMonthlyBenefitGrid(lines);
        this.annualBenefitOptions = this.withOtherOption(this.mapAnnualBenefitOptions(lines));
        this.AnnualBenefitsList = this.mapAnnualBenefitGrid(lines);
        this.companyContributionOptions = this.withOtherOption(this.mapGroupOptions(lines, 'contribution'));
        this.CompanyContributionsList = this.mapGroupGrid(lines, 'contribution');
        this.employeeContributionOptions = this.withOtherOption(this.mapGroupOptions(lines, 'employeecontribution'));
        this.EmployeeContributionsList = this.mapGroupGrid(lines, 'employeecontribution');
        console.log('GetApplicantOfferByRecPositionAppliedId called. options:', this.benefitOptions.length);
      },
      (err) => {
        this.benefitOptions = [];
        this.offerLinesForSummary = [];
        this.BenefitsDetail = [];
        this.annualBenefitOptions = [];
        this.AnnualBenefitsList = [];
        this.companyContributionOptions = [];
        this.CompanyContributionsList = [];
        this.employeeContributionOptions = [];
        this.EmployeeContributionsList = [];
        console.error('GetApplicantOfferByRecPositionAppliedId failed:', err);
      }
    );
  }

  private extractOfferLines(response: any): any[] {
    if (!response) { return []; }

    if (Array.isArray(response.Table2)) {
      return response.Table2;
    }

    if (response.DataSet && Array.isArray(response.DataSet.Tables) && response.DataSet.Tables.length > 2) {
      const table2 = response.DataSet.Tables[2];
      if (Array.isArray(table2)) {
        return table2;
      }
    }

    if (Array.isArray(response) && response.length > 2 && Array.isArray(response[2])) {
      return response[2];
    }

    return [];
  }

  private applyOfferHeaderFromResponse(response: any) {
    const header = this.extractOfferHeaderRow(response);
    const applicant = this.extractApplicantRow(response);
    let submissionStatusRaw: any = null;
    if (applicant && applicant.CTCSubmissionStatus != null) {
      submissionStatusRaw = applicant.CTCSubmissionStatus;
    } else if (applicant && applicant.ctcSubmissionStatus != null) {
      submissionStatusRaw = applicant.ctcSubmissionStatus;
    } else if (header && header.CTCSubmissionStatus != null) {
      submissionStatusRaw = header.CTCSubmissionStatus;
    } else if (header && header.ctcSubmissionStatus != null) {
      submissionStatusRaw = header.ctcSubmissionStatus;
    } else if (response && response.CTCSubmissionStatus != null) {
      submissionStatusRaw = response.CTCSubmissionStatus;
    } else if (response && response.ctcSubmissionStatus != null) {
      submissionStatusRaw = response.ctcSubmissionStatus;
    }
    if (submissionStatusRaw == null) {
      submissionStatusRaw = this.findValueByKeyLike(response, 'ctcsubmissionstatus');
    }
    if (submissionStatusRaw == null) {
      submissionStatusRaw = 0;
    }
    this.applyCtcSubmissionStatus(submissionStatusRaw);

    if (header) {
      const loan = (header.EmployeeLoanFacility != null) ? header.EmployeeLoanFacility : header.LoanFacility;
      const other = (header.ApplicantOtherBenefits != null) ? header.ApplicantOtherBenefits : header.OtherBenefits;
      this.employeeLoanDetails = this.safeTrim(loan);
      this.applicantsOtherBenefits = this.safeTrim(other);

      const basicRaw = (header.BasicCurrent != null) ? header.BasicCurrent : header.basicCurrent;
      const grossRaw = (header.GrossCurrent != null) ? header.GrossCurrent : header.grossCurrent;
      const basicNum = Number(basicRaw);
      const grossNum = Number(grossRaw);
      this.LabelBasicSalary = isNaN(basicNum) ? null : basicNum;
      this.LabelGrossSalary = isNaN(grossNum) ? null : grossNum;

      if (!this.isBasicInformation25) {
        this.BasicSalary = this.LabelBasicSalary;
        this.MonthlyGrossSalary = this.LabelGrossSalary;
      }
    }

    const applicantName = this.safeTrim(
      this.firstNonEmpty([
        response && response.ApplicantName,
        response && response.applicantName,
        response && response.Name,
        response && response.name,
        applicant && applicant.ApplicantName,
        applicant && applicant.applicantName,
        applicant && applicant.Name,
        applicant && applicant.name,
        applicant && applicant.FullName,
        applicant && applicant.fullName,
        applicant && applicant.ApplicantFullName,
        applicant && applicant.applicantFullName,
        header && header.ApplicantName,
        header && header.applicantName,
        localStorage.getItem('ApplicantName'),
        localStorage.getItem('FullName'),
        localStorage.getItem('UserName')
      ])
    );
    const positionApplied = this.safeTrim(
      this.firstNonEmpty([
        response && response.PositionApplied,
        response && response.positionApplied,
        response && response.RoleName,
        response && response.roleName,
        response && response.Designation,
        response && response.designation,
        response && response.JobTitle,
        response && response.jobTitle,
        applicant && applicant.PositionApplied,
        applicant && applicant.positionApplied,
        applicant && applicant.RoleName,
        applicant && applicant.roleName,
        applicant && applicant.Designation,
        applicant && applicant.designation,
        applicant && applicant.DesignationName,
        applicant && applicant.designationName,
        applicant && applicant.JobTitle,
        applicant && applicant.jobTitle,
        header && header.PositionApplied,
        header && header.positionApplied,
        header && header.RoleName,
        header && header.roleName,
        header && header.Designation,
        header && header.designation,
        localStorage.getItem('Designation'),
        localStorage.getItem('DesignationName'),
        localStorage.getItem('JobTitle'),
        localStorage.getItem('PositionApplied'),
        localStorage.getItem('RoleName')
      ])
    );
    if (applicantName) {
      this.LabelApplicantName = applicantName;
    }
    if (positionApplied) {
      this.LabelPositionApplied = positionApplied;
    }
  }

  private firstNonEmpty(values: any[]): any {
    for (let i = 0; i < (values || []).length; i++) {
      const v = this.safeTrim(values[i]);
      if (v) {
        return values[i];
      }
    }
    return '';
  }

  private findValueByKeyLike(source: any, keyLikeLower: string): any {
    if (source == null) {
      return null;
    }
    const needle = (keyLikeLower || '').toLowerCase();
    const queue: any[] = [source];
    const visited: any[] = [];
    while (queue.length > 0) {
      const node = queue.shift();
      if (node == null) {
        continue;
      }
      if (typeof node !== 'object') {
        continue;
      }
      if (visited.indexOf(node) >= 0) {
        continue;
      }
      visited.push(node);
      if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i++) {
          queue.push(node[i]);
        }
        continue;
      }
      const keys = Object.keys(node);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const v = (node as any)[k];
        if ((k || '').toLowerCase() === needle && v != null) {
          return v;
        }
        queue.push(v);
      }
    }
    return null;
  }

  private extractOfferHeaderRow(response: any): any {
    if (!response) { return null; }
    if (Array.isArray(response.Table1) && response.Table1.length > 0) {
      return response.Table1[0];
    }
    if (response.DataSet && Array.isArray(response.DataSet.Tables) && response.DataSet.Tables.length > 1) {
      const table1 = response.DataSet.Tables[1];
      if (Array.isArray(table1) && table1.length > 0) {
        return table1[0];
      }
    }
    if (Array.isArray(response) && response.length > 1 && Array.isArray(response[1]) && response[1].length > 0) {
      return response[1][0];
    }
    return null;
  }

  private extractApplicantRow(response: any): any {
    if (!response) { return null; }
    if (Array.isArray(response.Table0) && response.Table0.length > 0) {
      return response.Table0[0];
    }
    if (response.DataSet && Array.isArray(response.DataSet.Tables) && response.DataSet.Tables.length > 0) {
      const table0 = response.DataSet.Tables[0];
      if (Array.isArray(table0) && table0.length > 0) {
        return table0[0];
      }
    }
    if (Array.isArray(response) && response.length > 0 && Array.isArray(response[0]) && response[0].length > 0) {
      return response[0][0];
    }
    return null;
  }

  private mapMonthlyBenefitOptions(lines: any[]): { value: number; label: string; isTaxable?: boolean }[] {
    const map = new Map<number, { value: number; label: string; isTaxable?: boolean }>();

    (lines || []).forEach((row: any) => {
      const componentGroup = (((row && row.ComponentGroup) || (row && row.componentGroup) || "").toString()).toLowerCase();
      const frequency = (((row && row.Frequency) || (row && row.frequency) || "").toString()).toLowerCase();
      const isAllowanceGroup =
        componentGroup === "taxableallowance" ||
        componentGroup === "nontaxableallowance" ||
        componentGroup === "monthlybenefits";
      const isMonthly = !frequency || frequency === "monthly";

      if (!isAllowanceGroup || !isMonthly) {
        return;
      }

      const id = Number(
        (row && row.PolicyContextItemId != null) ? row.PolicyContextItemId :
        (row && row.policyContextItemId != null) ? row.policyContextItemId : 0
      );
      const label = (((row && row.ComponentName) || (row && row.componentName) || "").toString()).trim();

      if (id > 0 && label && !map.has(id)) {
        map.set(id, {
          value: id,
          label: label,
          isTaxable: this.getTaxableFlagFromRow(row)
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }

  private mapMonthlyBenefitGrid(lines: any[]): any[] {
    const rows: any[] = [];
    const seen = new Set<number>();

    (lines || []).forEach((row: any) => {
      const componentGroup = (((row && row.ComponentGroup) || (row && row.componentGroup) || "").toString()).toLowerCase();
      const frequency = (((row && row.Frequency) || (row && row.frequency) || "").toString()).toLowerCase();
      const isAllowanceGroup =
        componentGroup === "taxableallowance" ||
        componentGroup === "nontaxableallowance" ||
        componentGroup === "monthlybenefits";
      const isMonthly = !frequency || frequency === "monthly";
      if (!isAllowanceGroup || !isMonthly) {
        return;
      }

      const id = Number(
        (row && row.PolicyContextItemId != null) ? row.PolicyContextItemId :
        (row && row.policyContextItemId != null) ? row.policyContextItemId : 0
      );
      const isOther = !!((row && row.IsCurrent_Others != null) ? row.IsCurrent_Others : (row && row.isCurrent_Others));
      const offerLineId = Number((row && row.OfferLineId != null) ? row.OfferLineId : ((row && row.offerLineId != null) ? row.offerLineId : 0));
      if ((id <= 0 && !isOther) || seen.has(id <= 0 ? -offerLineId : id)) {
        return;
      }

      const label = (((row && row.ComponentName) || (row && row.componentName) || "").toString()).trim();
      const amountRaw = (row && row.Value_Current != null) ? row.Value_Current :
        ((row && row.value_Current != null) ? row.value_Current : 0);
      const amount = Number(amountRaw || 0);
      if (amount <= 0) {
        return;
      }
      const isTaxable = this.getTaxableFlagFromRow(row);

      rows.push({
        OfferLineId: offerLineId,
        PolicyContextItemId: id,
        BenefitName: label,
        Amount: amount,
        Taxable: isTaxable ? 'Yes' : 'No',
        IsTaxable: isTaxable,
        IsCurrent_Others: isOther
      });
      seen.add(id <= 0 ? -offerLineId : id);
    });

    return rows;
  }

  private mapGroupOptions(lines: any[], targetGroup: string): { value: number; label: string; isTaxable?: boolean }[] {
    const map = new Map<number, { value: number; label: string; isTaxable?: boolean }>();
    (lines || []).forEach((row: any) => {
      const componentGroup = (((row && row.ComponentGroup) || (row && row.componentGroup) || "").toString()).toLowerCase();
      const frequency = (((row && row.Frequency) || (row && row.frequency) || "").toString()).toLowerCase();
      const isMonthly = !frequency || frequency === "monthly";
      if (componentGroup !== targetGroup || !isMonthly) {
        return;
      }

      const id = Number(
        (row && row.PolicyContextItemId != null) ? row.PolicyContextItemId :
        (row && row.policyContextItemId != null) ? row.policyContextItemId : 0
      );
      const label = (((row && row.ComponentName) || (row && row.componentName) || "").toString()).trim();
      if (id > 0 && label && !map.has(id)) {
        map.set(id, {
          value: id,
          label: label,
          isTaxable: this.getTaxableFlagFromRow(row)
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }

  private mapAnnualBenefitOptions(lines: any[]): { value: number; label: string; isTaxable?: boolean }[] {
    const map = new Map<string, { value: number; label: string; isTaxable?: boolean }>();
    (lines || []).forEach((row: any) => {
      const componentGroup = (((row && row.ComponentGroup) || (row && row.componentGroup) || '').toString()).toLowerCase();
      const frequency = (((row && row.Frequency) || (row && row.frequency) || '').toString()).toLowerCase();
      const disbursement = (((row && row.DisbursementStyle) || (row && row.disbursementStyle) || '').toString()).toLowerCase();
      const isBenefitPolicy = componentGroup === 'benefitpolicy';
      const isTaxAllowance = componentGroup === 'taxableallowance' || componentGroup === 'nontaxableallowance';
      const isAnnualLike = frequency === 'annual' || frequency === 'annually' || frequency === 'yearly' || disbursement.indexOf('annual') >= 0;

      if (!isBenefitPolicy && !(isTaxAllowance && isAnnualLike)) {
        return;
      }

      const id = Number(
        (row && row.PolicyContextItemId != null) ? row.PolicyContextItemId :
          (row && row.policyContextItemId != null) ? row.policyContextItemId : 0
      );
      const baseLabel = this.safeTrim((row && (row.ComponentName != null ? row.ComponentName : row.componentName)) || '');
      if (id <= 0 || !baseLabel) {
        return;
      }
      const isTaxable = this.getTaxableFlagFromRow(row);
      const label = baseLabel;
      const key = (label + '|' + id.toString()).toLowerCase();
      if (!map.has(key)) {
        map.set(key, { value: id, label: label, isTaxable: isTaxable });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }

  private mapAnnualBenefitGrid(lines: any[]): any[] {
    const rows: any[] = [];
    const seen = new Set<string>();
    (lines || []).forEach((row: any) => {
      const componentGroup = (((row && row.ComponentGroup) || (row && row.componentGroup) || '').toString()).toLowerCase();
      const frequency = (((row && row.Frequency) || (row && row.frequency) || '').toString()).toLowerCase();
      const disbursement = (((row && row.DisbursementStyle) || (row && row.disbursementStyle) || '').toString()).toLowerCase();
      const isBenefitPolicy = componentGroup === 'benefitpolicy';
      const isTaxAllowance = componentGroup === 'taxableallowance' || componentGroup === 'nontaxableallowance';
      const isAnnualLike = frequency === 'annual' || frequency === 'annually' || frequency === 'yearly' || disbursement.indexOf('annual') >= 0;

      if (!isBenefitPolicy && !(isTaxAllowance && isAnnualLike)) {
        return;
      }

      const id = Number(
        (row && row.PolicyContextItemId != null) ? row.PolicyContextItemId :
          (row && row.policyContextItemId != null) ? row.policyContextItemId : 0
      );
      const offerLineId = Number(
        (row && row.OfferLineId != null) ? row.OfferLineId :
          ((row && row.offerLineId != null) ? row.offerLineId : 0)
      );
      const label = this.safeTrim((row && (row.ComponentName != null ? row.ComponentName : row.componentName)) || '');
      if ((!label) || (id <= 0 && offerLineId <= 0)) {
        return;
      }

      const amountRaw = (row && row.Value_Current != null) ? row.Value_Current :
        ((row && row.value_Current != null) ? row.value_Current : 0);
      const amount = Number(amountRaw || 0);
      if (amount <= 0) {
        return;
      }

      const isTaxable = this.getTaxableFlagFromRow(row);
      const isOther = !!((row && row.IsCurrent_Others != null) ? row.IsCurrent_Others : (row && row.isCurrent_Others));

      const key = (id > 0 ? id.toString() : ('line-' + offerLineId)) + '|' + label.toLowerCase();
      if (seen.has(key)) {
        return;
      }
      seen.add(key);

      rows.push({
        OfferLineId: offerLineId,
        PolicyContextItemId: id,
        BenefitName: label,
        Amount: amount,
        Taxable: isTaxable ? 'Yes' : 'No',
        IsTaxable: isTaxable,
        IsCurrent_Others: isOther
      });
    });

    return rows;
  }

  private mergeOptionListsByLabel(
    primary: { value: number; label: string; isTaxable?: boolean }[],
    secondary: { value: number; label: string; isTaxable?: boolean }[]
  ): { value: number; label: string; isTaxable?: boolean }[] {
    const map = new Map<string, { value: number; label: string; isTaxable?: boolean }>();
    (primary || []).forEach((opt: any) => {
      const label = this.safeTrim(opt && opt.label);
      const value = Number(opt && opt.value);
      if (!label || value <= 0) { return; }
      const key = label.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { value, label, isTaxable: !!(opt && opt.isTaxable) });
      }
    });
    (secondary || []).forEach((opt: any) => {
      const label = this.safeTrim(opt && opt.label);
      const value = Number(opt && opt.value);
      if (!label || value <= 0) { return; }
      const key = label.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { value, label, isTaxable: !!(opt && opt.isTaxable) });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }

  private mapGroupGrid(lines: any[], targetGroup: string): any[] {
    const rows: any[] = [];
    const seen = new Set<number>();
    (lines || []).forEach((row: any) => {
      const componentGroup = (((row && row.ComponentGroup) || (row && row.componentGroup) || "").toString()).toLowerCase();
      const frequency = (((row && row.Frequency) || (row && row.frequency) || "").toString()).toLowerCase();
      const isMonthly = !frequency || frequency === "monthly";
      if (componentGroup !== targetGroup || !isMonthly) {
        return;
      }

      const id = Number(
        (row && row.PolicyContextItemId != null) ? row.PolicyContextItemId :
        (row && row.policyContextItemId != null) ? row.policyContextItemId : 0
      );
      const isOther = !!((row && row.IsCurrent_Others != null) ? row.IsCurrent_Others : (row && row.isCurrent_Others));
      const offerLineId = Number((row && row.OfferLineId != null) ? row.OfferLineId : ((row && row.offerLineId != null) ? row.offerLineId : 0));
      if ((id <= 0 && !isOther) || seen.has(id <= 0 ? -offerLineId : id)) {
        return;
      }

      const label = (((row && row.ComponentName) || (row && row.componentName) || "").toString()).trim();
      const amountRaw = (row && row.Value_Current != null) ? row.Value_Current :
        ((row && row.value_Current != null) ? row.value_Current : 0);
      const amount = Number(amountRaw || 0);
      if (amount <= 0) {
        return;
      }
      const isTaxable = this.getTaxableFlagFromRow(row);

      rows.push({
        OfferLineId: offerLineId,
        PolicyContextItemId: id,
        BenefitName: label,
        Amount: amount,
        Taxable: isTaxable ? 'Yes' : 'No',
        IsTaxable: isTaxable,
        IsCurrent_Others: isOther
      });
      seen.add(id <= 0 ? -offerLineId : id);
    });

    return rows;
  }

  private resolveRecPositionAppliedId(loadAfterResolve: boolean = true) {
    this.activatedRoute.queryParams.subscribe(params => {
      const fromQuery = Number(
        params['RecId'] ||
        params['recId'] ||
        params['RecPositionAppliedId'] ||
        params['recPositionAppliedId'] ||
        params['RPAId'] ||
        params['rpaId'] ||
        0
      );
      if (fromQuery > 0) {
        this.recPositionAppliedId = fromQuery;
        localStorage.setItem('RecPositionAppliedId', this.recPositionAppliedId.toString());
        sessionStorage.setItem('RecPositionAppliedId', this.recPositionAppliedId.toString());
        this.loadCtcSubmissionStatus();
        console.log('Resolved recPositionAppliedId:', this.recPositionAppliedId);
        if (loadAfterResolve) {
          this.loadMonthlyBenefitOptions();
        }
        return;
      }

      const appId = Number(
        localStorage.getItem('AppId') ||
        localStorage.getItem('appId') ||
        0
      );

      if (appId <= 0) {
        const fromStorage = Number(
          localStorage.getItem('RecId') ||
          localStorage.getItem('recId') ||
          localStorage.getItem('RecPositionAppliedId') ||
          localStorage.getItem('recPositionAppliedId') ||
          sessionStorage.getItem('RecId') ||
          sessionStorage.getItem('recId') ||
          sessionStorage.getItem('RecPositionAppliedId') ||
          sessionStorage.getItem('recPositionAppliedId') ||
          0
        );
        this.recPositionAppliedId = fromStorage > 0 ? fromStorage : 0;
        console.warn('resolveRecPositionAppliedId: AppId not found in localStorage, using stored recPositionAppliedId.');
        if (loadAfterResolve) {
          this.loadMonthlyBenefitOptions();
        }
        return;
      }

      const url = this._config.environment.baseUrl
        + "GetLatestRecPositionAppliedIdByAppId"
        + "?appId=" + appId;

      this.dataService.get(url).subscribe((response: any) => {
        const recId = Number(
          (response && response.RecPositionAppliedId != null) ? response.RecPositionAppliedId :
            ((response && response.recPositionAppliedId != null) ? response.recPositionAppliedId : 0)
        );
        const roleId = Number(
          (response && response.RoleId != null) ? response.RoleId :
            ((response && response.roleId != null) ? response.roleId : 0)
        );
        const roleName = this.safeTrim(
          (response && response.RoleName != null) ? response.RoleName :
            ((response && response.roleName != null) ? response.roleName : '')
        );
        this.recPositionAppliedId = recId > 0 ? recId : 0;
        this.loadCtcSubmissionStatus();
        if (this.recPositionAppliedId > 0) {
          localStorage.setItem('RecPositionAppliedId', this.recPositionAppliedId.toString());
          sessionStorage.setItem('RecPositionAppliedId', this.recPositionAppliedId.toString());
        }
        if (roleName) {
          localStorage.setItem('RoleName', roleName);
          localStorage.setItem('PositionApplied', roleName);
        }
        if (roleId > 0) {
          localStorage.setItem('RoleId', roleId.toString());
          sessionStorage.setItem('RoleId', roleId.toString());
        }
        console.log('Resolved recPositionAppliedId via appId:', this.recPositionAppliedId);
        if (loadAfterResolve) {
          this.loadMonthlyBenefitOptions();
        }
      }, (err) => {
        console.error('GetLatestRecPositionAppliedIdByAppId failed:', err);
        this.recPositionAppliedId = 0;
        if (loadAfterResolve) {
          this.loadMonthlyBenefitOptions();
        }
      });
    });
  }

  private loadCtcSubmissionStatus() {
    if (!this.recPositionAppliedId || this.recPositionAppliedId <= 0) {
      this.applyCtcSubmissionStatus(0);
      return;
    }

    const url = this._config.environment.baseUrl
      + Constants.GetCtcSubmissionStatusByRecPositionAppliedId
      + "?recPositionAppliedId=" + this.recPositionAppliedId;

    this.dataService.get(url).subscribe(
      (response: any) => {
        const statusRaw =
          (response && response.CTCSubmissionStatus != null) ? response.CTCSubmissionStatus :
            ((response && response.ctcSubmissionStatus != null) ? response.ctcSubmissionStatus : 0);
        this.applyCtcSubmissionStatus(statusRaw);
      },
      (_err) => {
        // Fail-open for edit actions when status API is unavailable.
        this.applyCtcSubmissionStatus(0);
      }
    );
  }

  private showSaveSuccessPopup() {
    this.isTick = true;
    this.ApplyJobMsg = "Record Inserted successfully!";
    $("#applicantPackageSavePopup").modal('show');
  }

  private withOtherOption(options: { value: number; label: string; isTaxable?: boolean }[]): { value: number; label: string; isTaxable?: boolean }[] {
    const list = (options || []).slice(0);
    if (!list.some(x => Number(x.value) === this.OTHER_OPTION_VALUE)) {
      list.push({ value: this.OTHER_OPTION_VALUE, label: 'Other' });
    }
    return list;
  }

  isMonthlyOtherSelected(): boolean {
    return Number(this.BenefitName || 0) === this.OTHER_OPTION_VALUE;
  }

  isAnnualOtherSelected(): boolean {
    return Number(this.annualBenefitName || 0) === this.OTHER_OPTION_VALUE;
  }

  isCompanyContributionOtherSelected(): boolean {
    return Number(this.companyContributionName || 0) === this.OTHER_OPTION_VALUE;
  }

  isEmployeeContributionOtherSelected(): boolean {
    return Number(this.employeeContributionName || 0) === this.OTHER_OPTION_VALUE;
  }

  onMonthlyBenefitChange() {
    const selectedId = Number(this.BenefitName || 0);
    const selected = (this.benefitOptions || []).find(x => Number(x.value) === selectedId);
    if (selected && selectedId > 0 && selectedId !== this.OTHER_OPTION_VALUE) {
      this.BenefitTaxable = !!selected.isTaxable;
    }
    if (!this.isMonthlyOtherSelected()) {
      this.OtherBenefitName = '';
    }
  }

  onAnnualBenefitChange() {
    const selectedId = Number(this.annualBenefitName || 0);
    const selected = (this.annualBenefitOptions || []).find(x => Number(x.value) === selectedId);
    if (selected && selectedId > 0 && selectedId !== this.OTHER_OPTION_VALUE) {
      this.annualBenefitTaxable = !!selected.isTaxable;
    }
    if (!this.isAnnualOtherSelected()) {
      this.OtherAnnualBenefitName = '';
    }
  }

  onCompanyContributionChange() {
    const selectedId = Number(this.companyContributionName || 0);
    const selected = (this.companyContributionOptions || []).find(x => Number(x.value) === selectedId);
    if (selected && selectedId > 0 && selectedId !== this.OTHER_OPTION_VALUE) {
      this.companyContributionTaxable = !!selected.isTaxable;
    }
    if (!this.isCompanyContributionOtherSelected()) {
      this.OtherCompanyContributionName = '';
    }
  }

  onEmployeeContributionChange() {
    const selectedId = Number(this.employeeContributionName || 0);
    const selected = (this.employeeContributionOptions || []).find(x => Number(x.value) === selectedId);
    if (selected && selectedId > 0 && selectedId !== this.OTHER_OPTION_VALUE) {
      this.employeeContributionTaxable = !!selected.isTaxable;
    }
    if (!this.isEmployeeContributionOtherSelected()) {
      this.OtherEmployeeContributionName = '';
    }
  }

  private getSelectedMonthlyOfferLineId(): number | null {
    const editId = Number((this.selectedBenefit && this.selectedBenefit.OfferLineId) || 0);
    if (editId > 0) {
      return editId;
    }
    const selectedName = this.safeTrim(this.OtherBenefitName).toLowerCase();
    const row = (this.BenefitsDetail || []).find((x: any) => {
      const name = this.safeTrim(x && x.BenefitName).toLowerCase();
      const isOther = !!(x && x.IsCurrent_Others);
      return isOther && name === selectedName;
    });
    const id = Number((row && row.OfferLineId) || 0);
    return id > 0 ? id : null;
  }

  private getSelectedAnnualOfferLineId(): number | null {
    const editId = Number((this.selectedBenefit && this.selectedBenefit.OfferLineId) || 0);
    if (editId > 0) {
      return editId;
    }
    const selectedName = this.safeTrim(this.OtherAnnualBenefitName).toLowerCase();
    const row = (this.AnnualBenefitsList || []).find((x: any) => {
      const name = this.safeTrim(x && x.BenefitName).toLowerCase();
      const isOther = !!(x && x.IsCurrent_Others);
      return isOther && name === selectedName;
    });
    const id = Number((row && row.OfferLineId) || 0);
    return id > 0 ? id : null;
  }

  private getSelectedCompanyContributionOfferLineId(): number | null {
    const editId = Number((this.selectedBenefit && this.selectedBenefit.OfferLineId) || 0);
    if (editId > 0) {
      return editId;
    }
    const selectedName = this.safeTrim(this.OtherCompanyContributionName).toLowerCase();
    const row = (this.CompanyContributionsList || []).find((x: any) => {
      const name = this.safeTrim(x && x.BenefitName).toLowerCase();
      const isOther = !!(x && x.IsCurrent_Others);
      return isOther && name === selectedName;
    });
    const id = Number((row && row.OfferLineId) || 0);
    return id > 0 ? id : null;
  }

  private getSelectedEmployeeContributionOfferLineId(): number | null {
    const editId = Number((this.selectedBenefit && this.selectedBenefit.OfferLineId) || 0);
    if (editId > 0) {
      return editId;
    }
    const selectedName = this.safeTrim(this.OtherEmployeeContributionName).toLowerCase();
    const row = (this.EmployeeContributionsList || []).find((x: any) => {
      const name = this.safeTrim(x && x.BenefitName).toLowerCase();
      const isOther = !!(x && x.IsCurrent_Others);
      return isOther && name === selectedName;
    });
    const id = Number((row && row.OfferLineId) || 0);
    return id > 0 ? id : null;
  }

  private safeTrim(value: any): string {
    return ((value == null) ? '' : String(value)).trim();
  }

  private getAuditPayload(): any {
    const userId = this.safeTrim(
      localStorage.getItem('Email') ||
      localStorage.getItem('UserId') ||
      sessionStorage.getItem('Email') ||
      sessionStorage.getItem('UserId') ||
      ''
    );

    const userEmpName = this.safeTrim(
      localStorage.getItem('UserName') ||
      sessionStorage.getItem('UserName') ||
      ''
    );

    const userEmpCode = this.safeTrim(
      localStorage.getItem('UserEmpCode') ||
      localStorage.getItem('EmpCode') ||
      sessionStorage.getItem('UserEmpCode') ||
      sessionStorage.getItem('EmpCode') ||
      ''
    );

    const userEmpIdRaw =
      localStorage.getItem('LoginEmpId') ||
      localStorage.getItem('UserEmpId') ||
      sessionStorage.getItem('LoginEmpId') ||
      sessionStorage.getItem('UserEmpId') ||
      '';
    const userEmpIdNum = Number(userEmpIdRaw);

    const entTerminal = this.safeTrim(
      (Constants.TerminalName || '') ||
      localStorage.getItem('TerminalName') ||
      sessionStorage.getItem('TerminalName') ||
      ''
    );

    const entTerminalIP = this.safeTrim(
      (Constants.TerminalIP || '') ||
      localStorage.getItem('TerminalIP') ||
      sessionStorage.getItem('TerminalIP') ||
      ''
    );

    return {
      UserId: userId || null,
      ApplicationID: 'HCMS',
      UserEmpId: (!isNaN(userEmpIdNum) && userEmpIdNum > 0) ? userEmpIdNum : null,
      UserEmpName: userEmpName || null,
      UserEmpCode: userEmpCode || null,
      EntTerminal: entTerminal || null,
      EntTerminalIP: entTerminalIP || null
    };
  }

  LblchangeToTextBoxInfo25_Click() {   // Applicant & Package Information
    if (!this.canModifyPackage()) {
      return;
    }
    debugger;

    /* Enable edit mode */
    this.isBasicInformation25 = true;
    this.isBtnHide25 = true;
    this.DisconnectInternet = false;

    /* -------------------------------
       Store previous values (for CLOSE)
       ------------------------------- */
    this.previousApplicantName = this.ApplicantName;
    this.previousPositionApplied = this.PositionApplied;
    this.previousBasicSalary = this.BasicSalary;
    this.previousMonthlyGrossSalary = this.MonthlyGrossSalary;

    /* -------------------------------
       Assign label values to inputs
       ------------------------------- */
    this.ApplicantName = this.LabelApplicantName;
    this.PositionApplied = this.LabelPositionApplied;
    this.BasicSalary = this.LabelBasicSalary;
    this.MonthlyGrossSalary = this.LabelGrossSalary;
  }


  isCloseEditLbl25_Click() {

    /* Disable edit mode */
    this.isBasicInformation25 = false;
    this.isBtnHide25 = false;

    /* Restore previous values */
    this.ApplicantName = this.previousApplicantName;
    this.PositionApplied = this.previousPositionApplied;
    this.BasicSalary = this.previousBasicSalary;
    this.MonthlyGrossSalary = this.previousMonthlyGrossSalary;
  }

  UpdateApplicantPackage25_click() {
    if (!this.canModifyPackage()) {
      return;
    }

    if (!this.ApplicantName || !this.PositionApplied) {
      this.isApplicantPackageInfo = true;
      return;
    }
    if (this.BasicSalary == null || Number(this.BasicSalary) < 0 || this.MonthlyGrossSalary == null || Number(this.MonthlyGrossSalary) < 0) {
      this.isApplicantPackageInfo = true;
      return;
    }
    if (!this.recPositionAppliedId || this.recPositionAppliedId <= 0) {
      console.error('UpdateApplicantPackage25_click skipped: recPositionAppliedId missing.');
      this.isApplicantPackageInfo = true;
      return;
    }

    this.isApplicantPackageInfo = false;
    const url = this._config.environment.baseUrl + Constants.UpdateApplicantOfferHeaderCurrentSalary;
    const payload: any = {
      RecPositionAppliedId: Number(this.recPositionAppliedId),
      BasicCurrent: Number(this.BasicSalary || 0),
      GrossCurrent: Number(this.MonthlyGrossSalary || 0),
      FormId: 'ApplicantPackage',
      EntOperation: 'Update'
    };
    Object.assign(payload, this.getAuditPayload());

    this.dataService.post(url, payload).subscribe(
      (response: any) => {
        console.log('UpdateApplicantOfferHeaderCurrentSalary success:', response);
        this.isBasicInformation25 = false;
        this.isBtnHide25 = false;
        this.LabelApplicantName = this.ApplicantName;
        this.LabelPositionApplied = this.PositionApplied;
        this.LabelBasicSalary = this.BasicSalary;
        this.LabelGrossSalary = this.MonthlyGrossSalary;
        this.showSaveSuccessPopup();
      },
      (err) => {
        console.error('UpdateApplicantOfferHeaderCurrentSalary failed:', err);
      }
    );
  }

  saveEmployeeLoanFacility() {
    this.saveHeaderTextFields();
  }

  saveApplicantOtherBenefits() {
    this.saveHeaderTextFields();
  }

  private saveHeaderTextFields() {
    if (!this.canModifyPackage()) {
      return;
    }
    if (!this.recPositionAppliedId || this.recPositionAppliedId <= 0) {
      console.error('saveHeaderTextFields skipped: recPositionAppliedId missing.');
      return;
    }

    const url = this._config.environment.baseUrl + Constants.UpdateApplicantOfferHeaderTextFields;
    const payload: any = {
      RecPositionAppliedId: Number(this.recPositionAppliedId),
      EmployeeLoanFacility: this.safeTrim(this.employeeLoanDetails),
      ApplicantOtherBenefits: this.safeTrim(this.applicantsOtherBenefits),
      FormId: 'ApplicantPackage',
      EntOperation: 'Update'
    };
    Object.assign(payload, this.getAuditPayload());

    this.dataService.post(url, payload).subscribe(
      (response: any) => {
        console.log('UpdateApplicantOfferHeaderTextFields success:', response);
        this.showSaveSuccessPopup();
      },
      (err) => {
        console.error('UpdateApplicantOfferHeaderTextFields failed:', err);
      }
    );
  }

  submitApplicantPackageToEmployeeEmail() {
    if (!this.packageSubmitConsent || this.isSubmittingPackageEmail || this.isCtcSubmitted) {
      return;
    }
    if (!this.recPositionAppliedId || this.recPositionAppliedId <= 0) {
      console.error('submitApplicantPackageToEmployeeEmail skipped: recPositionAppliedId missing.');
      this.isTick = false;
      this.ApplyJobMsg = "Unable to submit package email. RecPositionAppliedId is missing.";
      $("#applicantPackageSavePopup").modal('show');
      return;
    }

    const url = this._config.environment.baseUrl + Constants.SubmitApplicantPackageToEmployeeEmail;
    const payload: any = {
      RecPositionAppliedId: Number(this.recPositionAppliedId),
      FormId: 'ApplicantPackage'
    };

    this.isSubmittingPackageEmail = true;
    this.dataService.post(url, payload).subscribe(
      (response: any) => {
        this.isSubmittingPackageEmail = false;
        this.applyCtcSubmissionStatus(1);
        this.packageSubmitConsent = true;
        this.isTick = true;
        this.ApplyJobMsg = this.safeTrim(
          (response && (response.Message || response.message)) || "Package email queued successfully."
        ) || "Package email queued successfully.";
        $("#applicantPackageSavePopup").modal('show');
      },
      (err) => {
        this.isSubmittingPackageEmail = false;
        const errMsg = this.safeTrim(
          (err && err.error && (err.error.Message || err.error.message)) ||
          (err && (err.message || err.statusText)) ||
          "Failed to submit package email."
        );
        this.isTick = false;
        this.ApplyJobMsg = errMsg || "Failed to submit package email.";
        $("#applicantPackageSavePopup").modal('show');
        console.error('SubmitApplicantPackageToEmployeeEmail failed:', err);
      }
    );
  }

  // Visibility & Edit Flags
  isBasicInformation25: boolean = false;
  isBtnHide25: boolean = false;
  isApplicantPackageInfo: boolean = false;
  MndApplicantPackageInfo: boolean = false;
  VisApplicantPackageInfo: boolean = true;

  ApplicantName: string;
  PositionApplied: string;
  BasicSalary: number;
  MonthlyGrossSalary: number;

  // Approval
  ApprovalStatus: string | null = null;


  LabelApplicantName: string = '';
  LabelPositionApplied: string = '';
  LabelBasicSalary: number | null = null;
  LabelGrossSalary: number | null = null;



  // Store previous values on EDIT click
  previousApplicantName: string = '';
  previousPositionApplied: string = '';
  previousBasicSalary: number | null = null;
  previousMonthlyGrossSalary: number | null = null;


  // Fields for the form
  annualBenefitAmount: number | null = null;
  benefitDuration: number | null = null;
  benefitName: string = '';
  benefitAmount: number | null = null;
  benefitProvider: string = '';
  benefitsList: any[] = [];





  // Function to open the modal for adding benefits
  openAddBenefitModal() {
    // Logic to show modal can go here if needed, Bootstrap modal handles it automatically
    console.log('Add Benefit Modal opened');
  }

  // Save a new benefit entry
  saveBenefit() {
    if (this.benefitName && this.benefitAmount != null && this.benefitProvider) {
      const benefit = {
        benefitName: this.benefitName,
        amount: this.benefitAmount,
        provider: this.benefitProvider,
        effectiveDate: new Date().toLocaleDateString() // Example date format
      };

      // Add the benefit to the benefits list
      this.benefitsList.push(benefit);

      // Clear the form fields
      this.benefitName = '';
      this.benefitAmount = null;
      this.benefitProvider = '';
    } else {
      alert('Please fill in all required fields!');
    }
  }

  // Edit a benefit entry
  editBenefit(benefit: any) {
    this.benefitName = benefit.benefitName;
    this.benefitAmount = benefit.amount;
    this.benefitProvider = benefit.provider;

    // Optionally, remove the old benefit from the list while editing
    this.benefitsList = this.benefitsList.filter(b => b !== benefit);

    // Open the modal for editing
    this.openAddBenefitModal();
  }

  // Delete a benefit entry
  deleteBenefit(benefit: any) {
    const index = this.benefitsList.indexOf(benefit);
    if (index > -1) {
      this.benefitsList.splice(index, 1);
    }
  }

  // Optional: calculate monthly amortized benefit
  getMonthlyBenefit(): number {
    if (this.annualBenefitAmount && this.benefitDuration) {
      return this.annualBenefitAmount / this.benefitDuration;
    }
    return 0;
  }



  constructor(
    public updateProfService: UpdateProfileService,
    public ClrThemeChng: ThemeColorService,
    private dataService: DataService,
    private _config: AppConfigService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.checkIfMobile();
    this.SaveGridViewStyleForInitialload(-1);
    this.Color();
    this.resolveRecPositionAppliedId();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  SaveGridViewStyle(IsNormalView) {
    if (IsNormalView == 1) {
      localStorage.setItem("IsGridView", "true");
    }

    if (IsNormalView == 0) {
      localStorage.setItem("IsGridView", "false");
    }

    if (!isNullOrUndefined(localStorage.getItem("IsGridView"))) {
      this.isGrid = localStorage.getItem("IsGridView") == "true" ? true : false;
      this.updateProfService.IsGridStyle = this.isGrid;
    }
  }

  SaveGridViewStyleForInitialload(IsNormalView) {
    if (this.isMobile) {
      IsNormalView = 0;
    } else {
      IsNormalView = 1;
    }

    if (IsNormalView == 1) {
      localStorage.setItem("IsGridView", "true");
    }

    if (IsNormalView == 0) {
      localStorage.setItem("IsGridView", "false");
    }

    if (!isNullOrUndefined(localStorage.getItem("IsGridView"))) {
      this.isGrid = localStorage.getItem("IsGridView") == "true" ? true : false;
      this.updateProfService.IsGridStyle = this.isGrid;
    }
  }
}
 

