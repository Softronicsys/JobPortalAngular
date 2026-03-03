import { Component, OnInit } from '@angular/core';
import { UpdateProfileService } from '../../../../Service/UpdateProfile.service';
import { ThemeColorService } from '../../../../Service/ThemeColor.service';
import { isNullOrUndefined } from 'util';
import { Constants } from '../../../../Helper/Constant';
declare var $: any;
import { EventEmitter, Output, ViewChildren, QueryList, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Action } from '../../../../Helper/Enums';
import { ToastrService } from 'ngx-toastr';
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
  get grossMonthly(): number {
    return this.basicSalary + this.monthlyGrossSalary + this.carTransportAllowance + this.fuelAllowance + this.opd;
  }

  get estimatedTax(): number {
    // Dummy calculation example
    return (this.basicSalaryTaxable ? this.basicSalary * 0.10 : 0)
      + (this.monthlyGrossSalaryTaxable ? this.monthlyGrossSalary * 0.10 : 0)
      + (this.carTransportAllowanceTaxable ? this.carTransportAllowance * 0.10 : 0);
  }

  get netMonthly(): number {
    return this.grossMonthly - this.estimatedTax;
  }

  get currentAnnualGross(): number {
    return this.grossMonthly * 12;
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
  selectedBenefit: any = null;

  // Form Fields
  BenefitName: string = '';
  BenefitProvider: string = '';
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

  annualBenefitName: string = '';
  annualBenefitProvider: string = '';

  isMandatoryFields: boolean = false;
  isAmountInvalid: boolean = false;
  isDateInvalid: boolean = false;

  saveAnnualBenefit() {
    // your logic here
  }

  nodata: string = 'No data available';

  // Functions
  handleBenefitsEdit(item: any) {
    this.selectedBenefit = item;
    $('#myModalBenefits').modal('show');
  }

  handleBenefitsDeleteClick(item: any) {
    // Add confirmation & delete logic here
  }

  SaveBenefit() {
    // Add save logic here, API call to save Benefits
    console.log('Saving Benefit:', {
      BenefitName: this.BenefitName,
      BenefitProvider: this.BenefitProvider,
      BenefitAmount: this.BenefitAmount,
      BenefitStartDate: this.BenefitStartDate,
      BenefitEndDate: this.BenefitEndDate,
      selectedBenefitCountry: this.selectedBenefitCountry
    });
  }


  LblchangeToTextBoxInfo25_Click() {   // Applicant & Package Information
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

    if (!this.ApplicantName || !this.PositionApplied) {
      this.isApplicantPackageInfo = true;
      return;
    }

    this.isApplicantPackageInfo = false;

    /* After successful save */
    this.isBasicInformation25 = false;
    this.isBtnHide25 = false;

    /* Update labels */
    this.LabelApplicantName = this.ApplicantName;
    this.LabelPositionApplied = this.PositionApplied;
    this.LabelBasicSalary = this.BasicSalary;
    this.LabelGrossSalary = this.MonthlyGrossSalary;
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



  constructor(public updateProfService: UpdateProfileService, public ClrThemeChng: ThemeColorService) { }

  ngOnInit() {
    this.checkIfMobile();
    this.SaveGridViewStyleForInitialload(-1);
    this.Color();
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
 
