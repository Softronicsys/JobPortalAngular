import { Component, OnInit, EventEmitter, Output, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { Action } from '../../../../Helper/Enums';
import { Constants } from '../../../../Helper/Constant';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
import { NgxSpinnerService } from 'ngx-spinner';
import { UpdateProfileService } from '../../../../Service/UpdateProfile.service';
import { GetCompanyParameter } from '../../../../Service/CompanyParameter.service';
import { ThemeColorService } from '../../../../Service/ThemeColor.service';
import { AppConfigService } from '@app/Service/app-config.service';
import { Subject, Observable } from 'rxjs';
import { Labels } from '@app/Service/DatabaseLbl.service';
import { DatePickerComponent } from '@app/Shared/date-picker/date-picker.component';
import { DataService } from '@app/Shared/Services/data.services';

import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-personal-information-non-corporate',
  templateUrl: './personal-information-non-corporate.component.html',
  styleUrls: ['./personal-information-non-corporate.component.css']
})
export class PersonalInformationNonCorporateComponent implements OnInit {

  // for international deployement //
  @ViewChild('myname') input;

  IsInternationalDeployment = Constants.IsInternationalDeployment;

  // For refresh datePicker //

  @ViewChildren(DatePickerComponent) objDatePickerComponent: QueryList<DatePickerComponent>;

  // for declaration //

  forVideo: boolean = false;
  isMandatoryfields: boolean = false;
  isMandatoryfields1: boolean = false;
  DisconnectInternet: boolean = false;
  foriegnPolicy: boolean = true;

  SocialMediaPlatform: string = "";
  SocialMediaId: string = "";
  SocialMediaTypeId: string = "";
  selectedMediaId: number = -1;
  dob: string = "";
  isUpdate: boolean = false;
  document: boolean = false;

  isUpdatePersonalAttribute: boolean = false;
  isUpdateDocumentAttach: boolean = false;
  isGrid: boolean = true;
  HRLooping: any[3] = [1, 2, 3];
  IsLinkedInLogin: boolean = false;

  public responseData;


  deleteSocialMedia: any;


  socialMediaConnections: any;


  socialMediaConnectionsGrid: any;


  // Financial libilities //


  financialDetail: any;

  deleteFinancialLibilities: any;


  AssetDescription: string = "";
  InstallmentsRemaining: string = "";
  RemainingLoanAmount: string = "";
  Bank: string = "";
  Remarks: string = "";

  selectedCpId: number = -1;


  isUpdatefinancial: boolean = false;


  // Existance Insurance detail //

  selectedEidId: number = -1;

  isUpdateInsurance: boolean = false;

  InsuranceCompanyDropdown: any;

  InsuranceCompany: string = "";

  InsurancetypeDropdown: any;

  InsuranceType: string = "";

  ExistingInsuranceDetailGrid: string = "";

  InsuranceTypeName: string = "";
  InsuranceCompanyName: string = "";
  PolicyNumber: string = "";
  PolicyExpiryDate_DefaultValue: string = "";
  policyExpiryDate: string = "";
  PolicyExpiryDate: string = "";

  deleteInsurance: any;
  abc: boolean = false;

  // Marital Status Dropdown //

  MaritalStatusDropdown: any;

  MaritalStatuss: string = "";


  // Gender Dropdown //

  GenderDropdown: any;

  Genders: string = "";

  // Countries dropdown //

  CountriesDropdown: any;

  // dropdown for deciding month or year wise salary //

  PerMonthOrYearSalaryDropdown: number = 0;
  PerMonthOrYearSalaryDropdown1: number = 0;


  // Cities dropdown //

  CitiesDropdown: any;

  Cities: string = "";


  // Religion dropdown //

  ReligionDropdown: any;

  Religions: string = "";


  // Nationality dropdown //

  NationalityDropdown: any;

  Nationalities: string = "";


  // NativeLanguage dropdown //

  NativeLanguageDropdown: any;

  NativeLanguages: string = "";


  // CitiesByCountryId dropdown //
  CitiesByCountryIdDropdown: any;

  CitiesByCountryId: string = "";


  // WhenCanYouJoin dropdown //
  WhenCanYouJoinDropdown: any;

  WhenCanYouJoin: string = "";

  // Currency dropdown //

  CurrencyDropdown: any;

  Currency: string = "";

  CurrentCurrency: string = "";

  // Title dropdown //
  TitleDropdown: any;


  // Dropdown Iqama Profession //

  IqamaProfessionDropdown: any;

  IqamaProfession: string = "";


  // Dropdown Sponsorship Type //

  SponsorShipTypeDropdown: any;

  SponsorShipType: string = "";


  // Dropdown Sponsorship Category //

  SponsorShipCategoryDropdown: any;

  SponsorShipCategory: string = "";

  // Dropdown Sponsorship Transferable //

  SponsorshipTransferableDropdown: number = 0;

  // Personal Attribute Dropdown //

  PersonalAttributesDropdown: any;

  PersonalAttributes: string = "";


  // Applicant Data //

  ApplicantData: any;

  // Applicant Image //

  ApplicantImage: any;

  // Basic Information 1  => for bind labels//

  Title: string = "";
  FirstName: string = "";
  MiddleName: string = "";
  LastName: string = "";
  Gender: string = "";
  DateOB: string = "";
  MaritalStatus: string = "";
  CountryOfBirth: string = "";
  CityOfBirth: string = "";

  PreviousTitleId: number = 0;
  ddlTitle: number = 0;
  PreviousMaritalStatusId: number = 0;
  ddlMaritalStatusId: number = 0;
  PreviousGenders: number = 0;
  ddlGenders: number = 0;
  PreviousCountryOfBirth: number = 0;
  selectedCountry: number = 1;
  PreviousCitiesByCountryId: number = 0;
  ddlCitiesByCountryId: number = 1;
  txtMiddleName: string = "";
  txtLastName: string = "";
  txtFirstrName: string = "";
  txtDateOB: string = "";

  // Basic Information 2  => for bind labels//

  ExpectedSalary: string = "";
  ExpectedSalaryTo: string = "";
  CurrentSalary: string = "";
  Religion: string = "";
  PassportNo: string = "";
  Nationality: string = "";
  NativeLanguage: string = "";
  FamilyCardNo: string = "";
  NICNo: string = "";
  JoiningDate: string = "";
  ExpectedSalaryType: string = "";
  PreviousExpectedSalaryTo: string = "";
  IDCardExpiry: string = "";
  BloodGroup: string = "";
  DrivingLicenseNo: string = "";
  DrivingLicenseExpiry: string = "";
  SpouseName: string = "";
  IsSpouseEmployed: string = "";
  ResidentialStatus: string = "";
  AnyotherSourceofIncome: string = "";
  AnyPhysicalDisability: string = "";




  ddlWhenCanYouJoin: number;
  ddlCurrentCurrencyId: number = 0;
  PreviousWhenCanYouJoin: number = 0;
  PreviousCurrentCurrencyId: number = 0;
  ddlReligions: number = 0;
  PreviousReligions: number = 0;
  ddlNationalities: number = 0;
  ddlCurrency: number = 0;
  PreviousNationalities: number = 0;
  PreviousCurrency: number = 0;
  ddlNativeLanguages: number = 0;
  PreviousNativeLanguages: number = 0;
  txtPassportNo: string = "";
  txtCurrentSalary: string = "";
  txtExpectedSalaryTo: string = "";
  txtFamilyCardNo: string = "";
  txtExpectedSalary: string = "";
  txtNICNo: string = "";
  txtIdRemarks: string = "";
  IdCardRemarks: string = "";
  AreaOfInterest: string = "";

  // Basic Information 3  => for bind labels//

  Email: string = "";
  TelMobile: string = "";
  Address: string = "";
  TelRes: string = "";
  TelOffice: string = "";


  txtTelOffice: string = "";
  txtTelMobile: string = "";
  txtTelRes: string = "";
  txtAddress: string = "";


  // Basic Information 4  => for bind labels//
  IqamaNumber: string = "";
  txtIqamaNumber: string = "";

  SponsorContactDetail: string = "";
  txtSponsorContactDetail: string = "";

  txtIqamaExpiryHijri: string = "";
  IqamaExpiryHijri: string = "";
  iqamaExpiryDateDefaultValue: string = "";
  iqamaExpiryDate: string = "";

  txtCurrSpnsName: string = "";
  CurrSpnsName: string = "";

  ddlIqamaProfession: string = "";
  PreviousIqamaProfession: string = "";

  txtSponsorType: string = "";
  PreviousSponsorType: string = "";
  SponsorType: string = "";

  ddlSponsorShipCategory: string = "";
  SpnsCategory: string = "";
  PreviousSpnsCategoryId: string = "";

  txtSpnsNatureOfBusiness: string = "";
  SpnsNatureOfBusiness: string = "";

  txtIqamaExpiryGregorian: string = "";
  IqamaExpiryGregorian: string = "";
  iqamaExpiryDateGregorianDefaultValue: string = "";
  iqamaExpiryDateGregorian: string = "";

  NoOfSpnsChangedOfVisa: string = "";
  txtNoOfSpnsChangedOfVisa: string = "";

  SpnsTransferable1: string = "";


  // Basic Information 5  => for bind labels//
  ValidDrivingLicenseKSA: string = "";
  txtValidDrivingLicenseKSA: string = "";


  DateOfEntryInKSA: string = "";
  dateOfEntryinKSADefaultValue: string = "";
  dateOfEntryinKSA: string = "";


  DateOfExitInKSA: string = "";
  dateOfExitinKSADefaultValue: string = "";
  dateOfExitinKSA: string = "";


  // Basic Information 6  => for bind labels//
  txtHstOfPersecution: string = "";
  HstOfPersecution: string = "";

  HstOfPenalties: string = "";
  txtHstOfPenalties: string = "";

  txtPendingCases: string = "";
  PendingCases: string = "";


  isBasicInformation22: boolean = false;
  isBtnHide22: boolean = false;

  isBasicInformation23: boolean = false;
  isBtnHide23: boolean = false;

  isBasicInformation24: boolean = false;
  isBtnHide24: boolean = false;

  isBasicInformation25: boolean = false;
  isBtnHide25: boolean = false;



  // Basic Information 1  => label change into text input//
  isBasicInformation1: boolean = false;
  isBtnHide1: boolean = false;

  

  // Basic Information 2  => label change into text input//
  isBasicInformation2: boolean = false;
  isBtnHide2: boolean = false;




  // Basic Information 3  => label change into text input//
  isBasicInformation3: boolean = false;
  isBtnHide3: boolean = false;


  // Sponsorship Status  => label change into text input//
  isSponsorshipStatus: boolean = false;
  isBtnHide4: boolean = false;

  // Home Country Was Visited  => label change into text input//
  isHomeCountryWasVisited: boolean = false;
  isBtnHide5: boolean = false;


  // Legal History  => label change into text input//
  isLegalHistory: boolean = false;
  isBtnHide6: boolean = false;

  // for spinner //
  isSpinnerPopup: boolean = false;
  isSpinnerPage: boolean = true;


  Age: string = "";


  @Output() getApplicantInfo: EventEmitter<any>;

  constructor(private Labels: Labels, private _config: AppConfigService, private http: HttpClient, private objRouter: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService, public updateProfService: UpdateProfileService, public CompanyIdService: GetCompanyParameter,
    public ClrThemeChng: ThemeColorService, private dataService: DataService) {

    this.getApplicantInfo = new EventEmitter<any>();
  }

  GiveLblToDshboard() {
    let RequestObject = {
      address: this.Address,
      telMobile: this.TelMobile,
      dateOB: this.DateOB,
      age: this.Age,
      Email: this.Email,
      firstName: this.FirstName,
      middleName: this.MiddleName,
      lastName: this.LastName,
      strengthBar: this.updateProfService.ProfilePercentage,
      Username: this.Username,
      Url1: this.url1,

    }

    this.getApplicantInfo.emit(RequestObject);

  }

  // Popup for Delete //

  deltId: any;
  deltMedia: any;
  delInsurance: any;
  delFinancial: any;
  delDoc: any;

  isfinance: boolean = false;
  isAttr: boolean = false;
  isInsu: boolean = false;
  isMed: boolean = false;
  isDoc: boolean = false;
  DocId: any;
  type: any;
  DeleteEventIdentifier: number;

  IsNewDocUpload: boolean = true;

  setId(item, identifier, DeleteEventId) {
    //  $("#myModal8").modal("toggle");
    this.clickRow = false

    this.DeleteEventIdentifier = DeleteEventId;

    if (identifier == 1 && this.DeleteEventIdentifier == 1) {
      this.DocId = 0;
      this.type = identifier;
    }

    if (this.DeleteEventIdentifier == 2) {
      if (!isNullOrUndefined(item.CpId)) {
        this.delFinancial = item.CpId;
        this.isfinance = true;
      }
    }

    if (this.DeleteEventIdentifier == 3) {
      if (!isNullOrUndefined(item.EidId)) {
        this.delInsurance = item.EidId;
        this.isInsu = true;
      }
    }

    if (this.DeleteEventIdentifier == 4) {
      if (!isNullOrUndefined(item.MediaId)) {
        this.deltMedia = item.MediaId;
        this.isMed = true;
      }
    }

    if (this.DeleteEventIdentifier == 5) {
      if (!isNullOrUndefined(item.PersonalAttributeid)) {
        this.deltId = item.PersonalAttributeid;
        this.isAttr = true;

      }
    }

    if (this.DeleteEventIdentifier == 6) {
      if (!isNullOrUndefined(item.Id) && identifier == 2) {
        this.DocId = item.Id;
        this.isDoc = true;
        this.type = identifier;
      }
    }







  }
  setIdForNo() {


    this.deltId = "";
    this.deltMedia = "";
    this.delInsurance = "";
    this.delFinancial = "";
    this.delDoc = "";

  }

  DeleteEvent() {

    //CV Attachment
    if (this.DeleteEventIdentifier == 1) {
      this.DeleteDoc(this.type, this.DocId);
    }

    //Financial Liabilities
    if (this.DeleteEventIdentifier == 2) {
      this.getdeleteFinancialLibilities(this.delFinancial);
    }

    //Existing Insurance Detail
    if (this.DeleteEventIdentifier == 3) {
      this.deleteInsuranceDetail(this.delInsurance);
    }

    //Social Media Connections
    if (this.DeleteEventIdentifier == 4) {
      this.getDeleteSocialMedia(this.deltMedia);
    }

    //Personal Attributes
    if (this.DeleteEventIdentifier == 5) {
      this.DeletePersAttr(this.deltId);
    }

    //Document Attachment
    if (this.DeleteEventIdentifier == 6) {
      this.DeleteDoc(this.type, this.DocId);
    }

  }


  openSpinner() {


    /** spinner starts on init */
    this.spinner.show();
  }


  HideSpinner() {


    /** spinner starts on init */
    this.spinner.hide();
  }

  LblchangeToTextBoxInfo1_Click() {

    // Basic Information 1  => label change into text input//
    this.isBasicInformation1 = true;
    this.isBtnHide1 = true;
    this.DisconnectInternet = false;
    this.txtFirstrName = this.FirstName;
    this.txtMiddleName = this.MiddleName;
    this.txtLastName = this.LastName;
    this.dob = this.getControlDate(this.DateOB);


    this.ddlTitle = (isNullOrUndefined(this.Title) || this.Title == '') ? this.TitleDropdown[0].id : this.PreviousTitleId;
    this.ddlMaritalStatusId = (isNullOrUndefined(this.MaritalStatus) || this.MaritalStatus == '') ? this.MaritalStatusDropdown[0].id : this.PreviousMaritalStatusId;
    this.ddlGenders = (isNullOrUndefined(this.Gender) || this.Gender == '') ? this.GenderDropdown[0].id : this.PreviousGenders;
    this.selectedCountry = (isNullOrUndefined(this.CountryOfBirth) || this.CountryOfBirth == '') ? this.CountriesDropdown[0].Id : this.PreviousCountryOfBirth;
    this.getCitiesByCountryIdDropdown();
    this.ddlCitiesByCountryId = (isNullOrUndefined(this.CityOfBirth) || this.CityOfBirth == '') ? this.CitiesByCountryIdDropdown[0].Id : this.PreviousCitiesByCountryId;
    //this.ddlCitiesByCountryId = this.PreviousCitiesByCountryId;
    //    this.ddlCitiesByCountryId = (isNullOrUndefined(this.CityOfBirth) || this.CityOfBirth == '')  ? this.CitiesDropdown[0].Id : this.PreviousCitiesByCountryId;

  }

  isCloseEditLbl1_Click() {

    this.isBasicInformation1 = false;
    this.isBtnHide1 = false;
    this.isMandatoryfields = false;
    this.isMandatoryfieldsbasic1 = false;
    this.forDateVlaidationcity = false;
  }

  txtAreaOfInterest: string = "";

  LblchangeToTextBoxInfo22_Click() {

    this.isBasicInformation22 = true;
    this.isBtnHide22 = true;
    this.DisconnectInternet1 = false;

    this.txtNICNo = this.NICNo;
    this.txtIdRemarks = this.IdCardRemarks;
    //this.txtAreaOfInterest = this.AreaOfInterest;
    this.txtExpectedSalary = this.ExpectedSalary;
    this.txtFamilyCardNo = this.FamilyCardNo;
    this.txtCurrentSalary = this.CurrentSalary;
    this.txtPassportNo = this.PassportNo;
    this.ddlReligions = (isNullOrUndefined(this.Religion) || this.Religion == '') ? this.ReligionDropdown[0].Id : this.PreviousReligions;
    this.ddlNationalities = (isNullOrUndefined(this.Nationality) || this.Nationality == '') ? this.NationalityDropdown[0].Id : this.PreviousNationalities;
    this.ddlCurrency = (isNullOrUndefined(this.CurrentCurrency) || this.CurrentCurrency == '') ? this.CompanyIdService.BaseCurrencyId : this.PreviousCurrentCurrencyId;
    this.txtExpectedSalaryTo = this.PreviousExpectedSalaryTo;
    this.ddlNativeLanguages = (isNullOrUndefined(this.NativeLanguage) || this.NativeLanguage == '') ? this.NativeLanguageDropdown[0].Id : this.PreviousNativeLanguages;

    this.ddlWhenCanYouJoin = (isNullOrUndefined(this.JoiningDate) || this.JoiningDate == '') ? this.WhenCanYouJoinDropdown[0].Name : this.PreviousWhenCanYouJoin;
    this.ddlCurrentCurrencyId = (isNullOrUndefined(this.ExpectedCurrency) || this.ExpectedCurrency == '') ? this.CompanyIdService.BaseCurrencyId : this.PreviousExpectedCurrency;

  }


  isCloseEditLbl22_Click() {

    this.isBasicInformation22 = false;
    this.isBtnHide22 = false;
    this.isMandatoryfieldsAnyOne = false;
    this.SelectCurrency = false;
    this.ExpectedRange = false;

  }

  LblchangeToTextBoxInfo23_Click() {

    this.isBasicInformation23 = true;
    this.isBtnHide23 = true;
    this.DisconnectInternet1 = false;

    this.txtNICNo = this.NICNo;
    this.txtIdRemarks = this.IdCardRemarks;
    //this.txtAreaOfInterest = this.AreaOfInterest;
    this.txtExpectedSalary = this.ExpectedSalary;
    this.txtFamilyCardNo = this.FamilyCardNo;
    this.txtCurrentSalary = this.CurrentSalary;
    this.txtPassportNo = this.PassportNo;
    this.ddlReligions = (isNullOrUndefined(this.Religion) || this.Religion == '') ? this.ReligionDropdown[0].Id : this.PreviousReligions;
    this.ddlNationalities = (isNullOrUndefined(this.Nationality) || this.Nationality == '') ? this.NationalityDropdown[0].Id : this.PreviousNationalities;
    this.ddlCurrency = (isNullOrUndefined(this.CurrentCurrency) || this.CurrentCurrency == '') ? this.CompanyIdService.BaseCurrencyId : this.PreviousCurrentCurrencyId;
    this.txtExpectedSalaryTo = this.PreviousExpectedSalaryTo;
    this.ddlNativeLanguages = (isNullOrUndefined(this.NativeLanguage) || this.NativeLanguage == '') ? this.NativeLanguageDropdown[0].Id : this.PreviousNativeLanguages;

    this.ddlWhenCanYouJoin = (isNullOrUndefined(this.JoiningDate) || this.JoiningDate == '') ? this.WhenCanYouJoinDropdown[0].Name : this.PreviousWhenCanYouJoin;
    this.ddlCurrentCurrencyId = (isNullOrUndefined(this.ExpectedCurrency) || this.ExpectedCurrency == '') ? this.CompanyIdService.BaseCurrencyId : this.PreviousExpectedCurrency;

  }


  isCloseEditLbl23_Click() {

    this.isBasicInformation23 = false;
    this.isBtnHide23 = false;
    this.isMandatoryfieldsAnyOne = false;
    this.SelectCurrency = false;
    this.ExpectedRange = false;

  }

  LblchangeToTextBoxInfo24_Click() {

    this.isBasicInformation24 = true;
    this.isBtnHide24 = true;
    this.DisconnectInternet1 = false;

    this.txtNICNo = this.NICNo;
    this.txtIdRemarks = this.IdCardRemarks;
    //this.txtAreaOfInterest = this.AreaOfInterest;
    this.txtExpectedSalary = this.ExpectedSalary;
    this.txtFamilyCardNo = this.FamilyCardNo;
    this.txtCurrentSalary = this.CurrentSalary;
    this.txtPassportNo = this.PassportNo;
    this.ddlReligions = (isNullOrUndefined(this.Religion) || this.Religion == '') ? this.ReligionDropdown[0].Id : this.PreviousReligions;
    this.ddlNationalities = (isNullOrUndefined(this.Nationality) || this.Nationality == '') ? this.NationalityDropdown[0].Id : this.PreviousNationalities;
    this.ddlCurrency = (isNullOrUndefined(this.CurrentCurrency) || this.CurrentCurrency == '') ? this.CompanyIdService.BaseCurrencyId : this.PreviousCurrentCurrencyId;
    this.txtExpectedSalaryTo = this.PreviousExpectedSalaryTo;
    this.ddlNativeLanguages = (isNullOrUndefined(this.NativeLanguage) || this.NativeLanguage == '') ? this.NativeLanguageDropdown[0].Id : this.PreviousNativeLanguages;

    this.ddlWhenCanYouJoin = (isNullOrUndefined(this.JoiningDate) || this.JoiningDate == '') ? this.WhenCanYouJoinDropdown[0].Name : this.PreviousWhenCanYouJoin;
    this.ddlCurrentCurrencyId = (isNullOrUndefined(this.ExpectedCurrency) || this.ExpectedCurrency == '') ? this.CompanyIdService.BaseCurrencyId : this.PreviousExpectedCurrency;

  }



  isCloseEditLbl24_Click() {

    this.isBasicInformation24 = false;
    this.isBtnHide24 = false;
    this.isMandatoryfieldsAnyOne = false;
    this.SelectCurrency = false;
    this.ExpectedRange = false;

  }


  LblchangeToTextBoxInfo25_Click() {

    this.isBasicInformation25 = true;
    this.isBtnHide25 = true;
    this.DisconnectInternet1 = false;

    this.txtNICNo = this.NICNo;
    this.txtIdRemarks = this.IdCardRemarks;
    //this.txtAreaOfInterest = this.AreaOfInterest;
    this.txtExpectedSalary = this.ExpectedSalary;
    this.txtFamilyCardNo = this.FamilyCardNo;
    this.txtCurrentSalary = this.CurrentSalary;
    this.txtPassportNo = this.PassportNo;
    this.ddlReligions = (isNullOrUndefined(this.Religion) || this.Religion == '') ? this.ReligionDropdown[0].Id : this.PreviousReligions;
    this.ddlNationalities = (isNullOrUndefined(this.Nationality) || this.Nationality == '') ? this.NationalityDropdown[0].Id : this.PreviousNationalities;
    this.ddlCurrency = (isNullOrUndefined(this.CurrentCurrency) || this.CurrentCurrency == '') ? this.CompanyIdService.BaseCurrencyId : this.PreviousCurrentCurrencyId;
    this.txtExpectedSalaryTo = this.PreviousExpectedSalaryTo;
    this.ddlNativeLanguages = (isNullOrUndefined(this.NativeLanguage) || this.NativeLanguage == '') ? this.NativeLanguageDropdown[0].Id : this.PreviousNativeLanguages;

    this.ddlWhenCanYouJoin = (isNullOrUndefined(this.JoiningDate) || this.JoiningDate == '') ? this.WhenCanYouJoinDropdown[0].Name : this.PreviousWhenCanYouJoin;
    this.ddlCurrentCurrencyId = (isNullOrUndefined(this.ExpectedCurrency) || this.ExpectedCurrency == '') ? this.CompanyIdService.BaseCurrencyId : this.PreviousExpectedCurrency;

  }


  isCloseEditLbl25_Click() {

    this.conveyance = "-1";
    this.isBasicInformation25 = false;
    this.isBtnHide25 = false;
    this.isMandatoryfieldsAnyOne = false;
    this.SelectCurrency = false;
    this.ExpectedRange = false;

  }

  LblchangeToTextBoxInfo2_Click() {
    // Basic Information 2  => label change into text input//

    this.isBasicInformation2 = true;
    this.isBtnHide2 = true;
    this.DisconnectInternet1 = false;

    this.txtNICNo = this.NICNo;
    this.txtIdRemarks = this.IdCardRemarks;
    //this.txtAreaOfInterest = this.AreaOfInterest;
    this.txtExpectedSalary = this.ExpectedSalary;
    this.txtFamilyCardNo = this.FamilyCardNo;
    this.txtCurrentSalary = this.CurrentSalary;
    this.txtPassportNo = this.PassportNo;
    this.ddlReligions = (isNullOrUndefined(this.Religion) || this.Religion == '') ? this.ReligionDropdown[0].Id : this.PreviousReligions;
    this.ddlNationalities = (isNullOrUndefined(this.Nationality) || this.Nationality == '') ? this.NationalityDropdown[0].Id : this.PreviousNationalities;
    this.ddlCurrency = (isNullOrUndefined(this.CurrentCurrency) || this.CurrentCurrency == '') ? this.CompanyIdService.BaseCurrencyId : this.PreviousCurrentCurrencyId;
    this.txtExpectedSalaryTo = this.PreviousExpectedSalaryTo;
    this.ddlNativeLanguages = (isNullOrUndefined(this.NativeLanguage) || this.NativeLanguage == '') ? this.NativeLanguageDropdown[0].Id : this.PreviousNativeLanguages;

    this.ddlWhenCanYouJoin = (isNullOrUndefined(this.JoiningDate) || this.JoiningDate == '') ? this.WhenCanYouJoinDropdown[0].Name : this.PreviousWhenCanYouJoin;
    this.ddlCurrentCurrencyId = (isNullOrUndefined(this.ExpectedCurrency) || this.ExpectedCurrency == '') ? this.CompanyIdService.BaseCurrencyId : this.PreviousExpectedCurrency;

  }

  isCloseEditLbl2_Click() {

    this.otherIncome = "-1";
    this.DisabilitySelect = "-1";
    this.isBasicInformation2 = false;
    this.isBtnHide2 = false;
    this.isMandatoryfieldsAnyOne = false;
    this.SelectCurrency = false;
    this.ExpectedRange = false;

  }

  CountryOfResidence: number = 0;
  CityOfResidence: any;

  LblchangeToTextBoxInfo3_Click() {
    ;
    // Basic Information 3  => label change into text input//
    this.isBasicInformation3 = true;
    this.isBtnHide3 = true;
    this.DisconnectInternet = false;
    this.selectedCountry = (isNullOrUndefined(this.CountryOfResidence)) ? this.CountriesDropdown[0].Id : this.CountryOfResidence1;
    this.getCitiesByCountryIdDropdown();
    //      this.ddlCitiesByCountryId = this.selectedCountry == 1 ? this.CitiesDropdown[0].Id : this.CityOfResidence1;
    this.ddlCitiesByCountryId = this.CityOfResidence1;
    this.txtTelOffice = this.TelOffice;
    this.txtTelMobile = this.TelMobile;
    this.txtTelRes = this.TelRes;
    this.txtAddress = this.Address;

  }

  isCloseEditLbl3_Click() {

    this.isBasicInformation3 = false;
    this.isBtnHide3 = false;
    this.isMandatoryfieldsContactInfo = false;
    this.isMandatoryfieldsContactInfo1 = false
  }


  LblchangeToTextBoxSponsorship_Click() {


    // Basic Information 1  => label change into text input//
    this.DisconnectInternet3 = false;
    this.isSponsorshipStatus = true;
    this.isBtnHide4 = true;
    this.txtIqamaNumber = this.IqamaNumber;
    this.iqamaExpiryDateDefaultValue = this.getControlDate(this.IqamaExpiryHijri);
    this.iqamaExpiryDateGregorianDefaultValue = this.getControlDate(this.IqamaExpiryGregorian);
    this.ddlIqamaProfession = (isNullOrUndefined(this.IqamaProfession) || this.IqamaProfession == '') ? this.IqamaProfessionDropdown[0].Id : this.PreviousIqamaProfession;
    this.txtCurrSpnsName = this.CurrSpnsName;

    this.txtSponsorContactDetail = this.SponsorContactDetail;
    this.txtSponsorType = (isNullOrUndefined(this.SponsorType) || this.SponsorType == '') ? this.SponsorShipTypeDropdown[0].Id : this.PreviousSponsorType;
    this.txtSpnsNatureOfBusiness = this.SpnsNatureOfBusiness;
    this.txtNoOfSpnsChangedOfVisa = this.NoOfSpnsChangedOfVisa;
    this.ddlSponsorShipCategory = (isNullOrUndefined(this.SpnsCategory) || this.SpnsCategory == '') ? this.SponsorShipCategoryDropdown[0].Id : this.PreviousSpnsCategoryId;
    this.ddlCitiesByCountryId = this.PreviousCitiesByCountryId;
    this.txtValidDrivingLicenseKSA = this.ValidDrivingLicenseKSA;
  }

  isCloseEditLbl4_Click() {

    this.isSponsorshipStatus = false;
    this.isBtnHide4 = false;
  }


  LblchangeToTextBoxHomeCountryWasVisited_Click() {


    // Basic Information 1  => label change into text input//
    this.DisconnectInternet4 = false;
    this.isHomeCountryWasVisited = true;
    this.isBtnHide5 = true;
    this.dateOfEntryinKSADefaultValue = this.getControlDate(this.DateOfEntryInKSA);
    this.dateOfExitinKSADefaultValue = this.getControlDate(this.DateOfExitInKSA);
  }

  isCloseEditLbl5_Click() {

    this.isHomeCountryWasVisited = false;
    this.isBtnHide5 = false;
  }

  LblchangeToTextBoxLegalHistory_Click() {


    // Basic Information 1  => label change into text input//
    this.DisconnectInternet5 = false;
    this.isLegalHistory = true;
    this.isBtnHide6 = true;
    this.txtHstOfPersecution = this.HstOfPersecution;
    this.txtHstOfPenalties = this.HstOfPenalties;
    this.txtPendingCases = this.PendingCases;
  }

  isCloseEditLbl6_Click() {

    this.isLegalHistory = false;
    this.isBtnHide6 = false;
  }




  // Social Media Connection //

  btnPost1_Click() {
    if (navigator.onLine) {

      let SocialMediaTypeId = this.socialMediaConnections.find(x => x.Id == this.SocialMediaTypeId);

      if (SocialMediaTypeId.Name == 'N/A' || this.SocialMediaId == "") {
        this.isMandatoryfields = true;
      }
      else {
        let RequestObject = {
          SocialMediaPlatform: this.SocialMediaPlatform,
          SocialMediaId: this.dataService.ReplaceApostropheWthTelda(this.SocialMediaId),


          MediaId: this.isUpdate ? this.selectedMediaId : 0,
          SocialMediaTypeId: this.SocialMediaTypeId,
          AppId: localStorage.getItem("AppId"),
          Email: localStorage.getItem("Email"),
          CompanyId: this.CompanyIdService.CompanyId,
          UserId: localStorage.getItem("Email"),
          ApplicationID: "string",
          Action: this.isUpdate ? Action.Update : Action.Insert
        }

        this.openSpinner();
        let saveSocialMedia = this._config.environment.baseUrl + Constants.SaveSocialMedia;
        this.PostData(RequestObject, saveSocialMedia, { headers: this.dataService.headers });
        //this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SaveSocialMedia");

        $("#myModal9").modal("toggle");
        this.getLastProfileUpdateValue();
      }
    }
    else {

      this.DisconnectInternet = true;
    }
  }


  //    getWebConfiguration1: any;

  //    getWebConfiguration() {
  //        //    this.http.get("https://jobportalapi.azurewebsites.net/GetWebConfiguration")
  //        let getWebConfiguration = this._config.environment.baseUrl + Constants.GetWebConfiguration;
  //        this.http.get(getWebConfiguration)
  //        .subscribe((response: any) => {
  //            
  //            this.getWebConfiguration1 = response;

  //        }, (error: any) => {
  //            console.log(error);
  //        });
  //}


  btnAdd_Click1() {

    //    this.isUpdate = false;
    //     this.isUpdatefinancial = false;
    //     this.isUpdateInsurance = false;
    this.isMandatoryfields = false;
    this.DisconnectInternet = false;
    this.isMandatoryfieldsbasic1 = false;
    this.isMandatoryDocument = false;
    this.DisconnectInternetDocument = false;
  }

  SocialMediaMsg: string = '';
  SocialMediaMsg1: boolean = false;

  btnAdd_Click() {

    this.getSocialMediaConnections();

    this.SocialMediaMsg1 = false;
    this.SocialMediaMsg = '';

    this.isFileName = "";
    this.isDocCheck = false;

    this.isUpdate = false;
    this.isUpdatefinancial = false;
    this.isUpdateInsurance = false;
    this.isMandatoryfields = false;
    this.DisconnectInternet = false;
    this.isMandatoryfieldsbasic1 = false;
    this.isMandatoryDocument = false;
    this.DisconnectInternetDocument = false;
    this.isUpdateDocumentAttach = false;
    this.checkForDocAttWhenupdate = false;
    this.ValidationMsgDocFalse = "";
    this.ValidationMsgDocFalse1 = false;

    // for Financail liabilities //
    this.AssetDescription = "";
    this.InstallmentsRemaining = "";
    this.RemainingLoanAmount = "";
    this.Bank = "";
    this.Remarks = "";
    //this.isFileName = 's';
    // for Social media connections //
    this.SocialMediaId = "";
    //  this.SocialMediaTypeId = "109";

    // for Existance Insurance Detail //

    this.getInsuranceCompanyDropdown();
    this.getInsurancetypeDropdown();

    this.InsuranceCompany = "92";
    this.InsuranceType = "984";
    this.PolicyNumber = "";
    this.Remarks = "";
    this.PolicyExpiryDate = "";
    this.InsurancePolicyExpiryDate = "";

    this.PolicyExpiryDate_DefaultValue = this.getControlDate(this.InsurancePolicyExpiryDate);

    // for Personal Attribute //

    //   this.PersonalAttribute = 87;
    this.remarksPersAtt = "";
    this.isMandatoryfieldsPers = false;

    // Document Attachment // 

    this.DocCatId = this.DocumentCategory;
    this.remarksDocument = "";
    this.SubjectDocument = "";
    this.DocumentExtension = "";
    this.isFileSizeOfDoc = '';
    this.isFileSizeCheck = false;
    this.SelectAtleastOneFile = false;
  }



  // insert data in popup and get data in grid //

  public PostData(model, url: string, headers: any) {



    if (navigator.onLine) {
      const retVal = this.http.post(url, model, headers)
        .subscribe((response: any) => {


          if (response.Msg == 'Same Social Media ID already exist.' && response.isValid == false) {
            //   this.SocialMediaMsg = response.Msg;
            //   this.SocialMediaMsg1 = true;
            this.HideSpinner();
            //   return;
          }
          //console.log(response)
          if (response.isValid == false) {
            //alert('false')
            //this.toastr.warning(response.Msg, '', {
            //    positionClass: "toast-bottom-right",
            //});
            $("#videoPopup1").modal('show');
            this.ApplyJobMsg = response.Msg;
            this.getLastProfileUpdateValue();
            this.GiveLblToDshboard();
          }
          else {
            if (this.isUpdate == false && this.isUpdatefinancial == false && this.isUpdateInsurance == false && this.isUpdatePersonalAttribute == false && this.isUpdateDocumentAttach == false) {
              if (response.Msg) {
                if (response.Msg == undefined) {
                  return false;
                }
                else {
                  //this.toastr.success(response.Msg, '', {
                  //    positionClass: "toast-bottom-right",
                  //});
                  this.ApplyJobMsg = response.Msg;
                  $("#videoPopup1").modal('show');
                  this.isTick = true;
                  this.GiveLblToDshboard();
                }
              }
              if (response.Msg) {
                $("#videoPopup1").modal('show');
                this.isTick = true;
                this.ApplyJobMsg = response.Msg;
              }
              if (response.msg) {
                //this.toastr.success(response.msg, '', {
                //    positionClass: "toast-bottom-right",
                //});
                if (response.msg == undefined) {
                  return false;
                }
                else {
                  $("#videoPopup1").modal('show');
                  this.isTick = true;
                  this.ApplyJobMsg = response.msg;
                  this.getApplicantData();
                  this.GiveLblToDshboard();
                }
                this.getLastProfileUpdateValue();
              }
            }
            else {
              //this.toastr.success(response.Msg, '', {
              //    positionClass: "toast-bottom-right",
              //});
              //  $("#videoPopup").modal('show');
              // this.isTick = true;
              //  this.ApplyJobMsg = response.Msg;
              if (response.Msg) {
                $("#videoPopup1").modal('show');
                this.isTick = true;
                this.ApplyJobMsg = response.Msg;
              }
              if (response.msg) {
                $("#videoPopup1").modal('show');
                this.isTick = true;
                this.ApplyJobMsg = response.msg;
              }
              this.getLastProfileUpdateValue();

            }
            this.getsocialMediaConnectionsGrid();
            this.getFinancialDetail();
            this.getExistingInsuranceDetailGrid();
            this.getAllPersonalAttributesGrid();
            this.getLastProfileUpdateValue();
            this.getApplicantData();
          }

          this.popuphide();
          this.HideSpinner();
          // this.getApplicantData();

        }, (error: any) => {
          alert("Invalid Data.");
        });
    }
    else {

      this.DisconnectInternet = true;
    }
  }



  // For Last updated Profile //
  LastProfileUpdateValue: any;

  getLastProfileUpdateValue() {

    let RequestObject = {
      ApplicantId: localStorage.getItem("AppId"),
      CompanyId: this.CompanyIdService.CompanyId,
    }
    let getLastProfileUpdateValue = this._config.environment.baseUrl + Constants.GetLastProfileUpdateValue;
    this.http.post(getLastProfileUpdateValue, RequestObject, { headers: this.dataService.headers })
      //this.http.post("https://jobportalapi.azurewebsites.net/GetLastProfileUpdateValue", RequestObject)
      .subscribe((response: any) => {

        if (response.ProfileLastUpdate != "" && response.ProfileLastUpdate != null) {
          this.updateProfService.LastProfileUpdateValue = response.ProfileLastUpdate;
        }
        //this.updateProfService.ProfilePercentage = response.ProfilePercentage;
        this.GiveLblToDshboard();
        //this.LastProfileUpdateValue = response;
      }, (error: any) => {
        console.log(error);
      });
  }





  selectedSocialMediaId: number = 0;
  updateData(selectedRow: any) {

    if (navigator.onLine) {
      this.selectedSocialMediaId = selectedRow.SocialMediaId;
      let RequestObject = {
        SocialMediaPlatform: selectedRow.SocialMediaPlatform,
        SocialMediaId: 0,
        MediaId: selectedRow.SocialMediaId,
        SocialMediaTypeId: selectedRow.SocialMediaTypeId,
        AppId: localStorage.getItem("AppId"),
        Email: localStorage.getItem("Email"),
        CompanyId: 0,
        ApplicationID: "string",
        Action: Action.Update,

      }

      this.openSpinner();
      let saveSocialMedia = this._config.environment.baseUrl + Constants.SaveSocialMedia;
      this.http.post(saveSocialMedia, RequestObject, { headers: this.dataService.headers })
        //this.http.post("https://jobportalapi.azurewebsites.net/SaveSocialMedia", RequestObject)
        .subscribe((response: any) => {

          this.HideSpinner();
          if (!isNullOrUndefined(response) && response.isValid == true) {
            this.getsocialMediaConnectionsGrid();


          } else {
            alert("Invalid Data.");
          }
        }, (error: any) => {
          alert(error.error.Message);
        });
    }
    else {

      this.DisconnectInternet = true;
    }

  }

  onUpdate_Click(selectedRow: any) {

    this.isUpdate = true;
    this.isMandatoryfields = false;
    this.selectedMediaId = selectedRow.MediaId;
    this.SocialMediaId = selectedRow.SocialMediaId;
    this.SocialMediaTypeId = selectedRow.SocialMediaTypeId;
  }

  moveToTab() {

   // document.querySelector("#ProfInfoNonCop a").click();


    // Trigger the click event on the anchor tag within the tab
    var anchor = document.querySelector("#ProfInfoNonCop a");
    var event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    anchor.dispatchEvent(event);

    // Scroll to the beginning of the content in the tab
    document.querySelector("#new1").scrollIntoView();
  }






  // for CompanyID //

  getCompanyParameter() {


    this.openSpinner();
    let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;
    this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {

      this.CompanyIdService.CompanyId = response.CompanyId;
      this.CompanyIdService.CompanyName = response.CompanyName;
      this.CompanyIdService.RedirectPath = response.RedirectPath;
      this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
      this.CompanyIdService.VideoSize = response.VideoSize;
      this.CompanyIdService.BaseCurrencyId = response.BaseCurrencyId;
      //alert(this.CompanyIdService.BaseCurrencyId)
      //console.log("this.CompanyIdService.BaseCurrencyId", this.CompanyIdService.BaseCurrencyId)
      //    this.ddlCurrency = this.CompanyIdService.BaseCurrencyId;
      //    this.ddlCurrentCurrencyId = this.CompanyIdService.BaseCurrencyId;

      this.getHomeLabels();
      //     this.readFromBlob();

      // this.Color();

      this.getJobPortalConfiguration1();

      this.getSocialMediaConnections();

      this.getsocialMediaConnectionsGrid();

      this.getFinancialDetail();

      this.getInsuranceCompanyDropdown();

      this.getInsurancetypeDropdown();

      this.getApplicantData();

      this.getMaritalStatusDropdown();

      this.getGenderDropdown();

      this.getCountriesDropdown();

      //     this.getCitiesByCountryIdDropdown();

      this.getCitiesDropdown();

      this.getReligionDropdown();

      this.getNationalityDropdown();

      this.getNativeLanguageDropdown();

      this.getTitle();

      this.getCurrency();

      this.getExistingInsuranceDetailGrid();

      this.getIqamaProfession();

      this.getSponsorShipType();

      this.getSponsorShipCategory();

      //this.getWebConfiguration();

      this.getDocumentAttachmentGrid()

      this.getPersonalAttributes();

      this.getAllPersonalAttributesGrid();

      this.getDocumentCategory();

      this.readFromBlob1();

      //   this.HideSpinner();

      //this.CompanyId = response.CompanyId;
      //Constants.CompanyId = this.CompanyId;
      //this.CompanyName = response.CompanyName;
      //Constants.CompanyName = this.CompanyName;
      //this.RedirectPath = response.RedirectPath;
      //Constants.RedirectPath = this.RedirectPath;
      //this.CompanyLogoBase64 = response.CompanyLogoBase64;
      //Constants.CompanyLogoBase64 = this.CompanyLogoBase64;

    });
  }




  ngOnInit() {
    this.applicantId = localStorage.getItem('AppId');
    this.getCompanyParameter();
    this.getWhenCanYouJoin();
    this.getCV();
    this.SaveGridViewStyle(-1);

    if (localStorage.getItem("IsLinkedInLogin") === null) {
      this.CompanyIdService.IsLinkedInLogin = "0";
    }
    else {
      this.CompanyIdService.IsLinkedInLogin = localStorage.getItem('IsLinkedInLogin');
    }

    //console.log(  this.ClrThemeChng.IsCvShow)
    //this.IsCVShow = this.ClrThemeChng.IsCvShow;
    //console.log(this.IsCVShow)
  }


  conveyance: string = "-1";
  ddlConveyance = [
    { Id: "-1", Name: "-- Select --" },
    { Id: "1", Name: "Yes" },
    { Id: "2", Name: "No" }
  ];

  Relationship: string = "-1";

  relation = [

    { Id: "-1", Name: "N/A" },
    { Id: "1", Name: "Brother" },
    { Id: "2", Name: "Sister" },
    { Id: "3", Name: "Father" },
    { Id: "4", Name: "Mother" }
    
  ];

  otherIncome: string = "-1";

  otherIncomeSelect = [

    { Id: "-1", Name: "-- Select --" },
    { Id: "1", Name: "Yes" },
    { Id: "2", Name: "No" }
    

  ];


  selectedGender: string = "-1";

  genders = [
    { Id: "-1", Name: "-- Select Gender --" },
    { Id: "1", Name: "Male" },
    { Id: "2", Name: "Female" },
    { Id: "3", Name: "Other" }
  ];




  DisabilitySelect: string = "-1";

  Disability_Select = [

    { Id: "-1", Name: "N/A" },
    { Id: "1", Name: "Yes" },
    { Id: "2", Name: "No" }


  ];

  spouseEmployed: string = "-1";

  spouseEmploymentStatuses = [
    { Id: "-1", Name: "N/A" },
    { Id: "yes", Name: "Yes" },
    { Id: "no", Name: "No" }
  ];


  selectedBloodGroup: string = "0";

  bloodGroups = [
    { Id: "0", Name: "N/A" },
    { Id: "1", Name: "A+" },
    { Id: "2", Name: "A-" },
    { Id: "3", Name: "B+" },
    { Id: "4", Name: "B-" },
    { Id: "5", Name: "AB+" },
    { Id: "6", Name: "AB-" },
    { Id: "7", Name: "O+" },
    { Id: "8", Name: "O-" }
  ];


  selectedResidentialStatus: string = "-1";

  residentialStatuses = [
    { Id: "-1", Name: "-- Select --" },
    { Id: "own", Name: "Own" },
    { Id: "rent", Name: "Rent" }
   
  ];

  selectedConveyanceType: string = "-1";

  conveyanceTypes = [
    { Id: "-1", Name: "-- Select --" },
    { Id: "1", Name: "Bike" },
    { Id: "2", Name: "Car" }
   
  ];

  selectedBankName: string = "-1";

  bankNames = [
    { Id: "-1", Name: "-- Select --" },
    { Id: "1", Name: "UBL" },
    { Id: "2", Name: "HBL" },
    { Id: "2", Name: "ABL" }
    
    // Add more banks as needed
  ];

  Selectbranchcode: string = "-1";

  branchCodes = [
    { Id: "-1", Name: "-- Select --" },
    { Id: "1", Name: "0056 -- Bhadrabad" },
    { Id: "2", Name: "0057 -- Nazimabad" },
    { Id: "3", Name: "0000 -- Other" }
  ];

  DocumentType: string = "-1";

  DocumentTypeDropdown = [
    { Id: "-1", Name: "-- Select --" },
    { Id: "1", Name: 'A-level' },
    { Id: "2", Name: 'Matriculation' },
    { Id: "3", Name: 'Graduation' }
  ];


  otherDocumentType: string = "-1";

  otherDocumentTypeDropdown = [
    { Id: "-1", Name: "-- Select --" },
    { Id: "1", Name: 'CNIC' },
    { Id: "2", Name: 'Cheque Book' }
   
  ];

  
  SaveGridViewStyle(IsNormalView) {

    if (IsNormalView == 1)
      localStorage.setItem("IsGridView", "true");//this.ClrThemeChng.IsGridViewShow.emit(true);

    if (IsNormalView == 0)
      localStorage.setItem("IsGridView", "false");//this.ClrThemeChng.IsGridViewShow.emit(false);

    if (!isNullOrUndefined(localStorage.getItem("IsGridView"))) {
      this.isGrid = localStorage.getItem("IsGridView") == "true" ? true : false;
      this.updateProfService.IsGridStyle = this.isGrid;
    }
  }

  IDCardRemarks: string = "ID Card Remarks";
  lblAreaOfInterest: string = "Area of Interest";
  lblContactNoMobile: string = "Contact No. (Mobile)";
  lblContactNoOff: string = "Contact No. (Off.)";
  lblContactNoRes: string = "Contact No. (Res.)";
  lblCountryOfCurrentRes: string = "Country of Current (Res.)";
  lblCityOfCurrentRes: string = "City of Current (Res.)";
  lblAddress: string = "Address";
  lblIntroductoryVideoAttachment: string = "Introductory Video Attachment";
  lblMiximumSize: string = "Miximum Size";
  FinancialLiabilities: string = "Financial Liabilities";
  ExistingInsuranceDetail: string = "Existing Insurance Detail";
  SocialMediaConnections: string = "Social Media Connections";
  lblPersonalAttributes: string = "Personal Attributes";
  DocAttachment: string = "Document Attachment";
  LoanDescription: string = "Loan Description";
  FinancialInstitution: string = "Financial Institution";
  InstallmentRemaining: string = "Installments Remaining";
  lblRemainingLoanAmount: string = "Remaining Loan Amount";
  lblRemarks: string = "Remarks";
  lblInsuranceType: string = "Insurance Type";
  lblInsuranceCompany: string = "Insurance Company";
  lblPolicyNumber: string = "Policy Number";
  DateofPolicyExpiry: string = "Date of Policy Expiry";
  SocialMediaType: string = "Social Media Type";
  SocialMediaID: string = "Social Media ID";
  AttributeType: string = "Attribute Type";
  lblDocumentCategory: string = "Remarks";
  DateofAttach: string = "";
  Subject: string = "Subject";
  DocImgView: string = "";
  Edit: string = "Edit";
  Add: string = "Add";
  BasicInformation1: string = "Basic Information 1";
  BasicInformation2: string = "Basic Information 2";
  ContactInformation: string = "Contact Information";
  lblTitle: string = "Salutation";
  lblReligion: string = "Religion";
  WhencanyouJoin: string = "When can you Join";
  lblPassportNo: string = "Passport No.";
  lblNationality: string = "Nationality";
  CurrentLastSal: string = "Current / Last Salary";
  lblFamilyCardNo: string = "Family Card No.";
  lblNativeLanguage: string = "Native Language";
  lblExpectedSalary: string = "Expected Salary";
  lblFirstName: string = "First Name";
  lblLastName: string = "Last Name";
  lblMiddleName: string = "Middle Name";
  lblMaritalStatus: string = "Marital Status";
  lblGender: string = "Gender";
  DateofBirth: string = "Date of Birth";
  CountryofBirth: string = "Country of Birth";
  CityofBirth: string = "City of Birth";
  IDCardNo: string = "ID Card No.";
  Save: string = "Save";
  Close: string = "Close";
  Nodata: string = "No data";
  lblDocAttachment: string = "Document Attachment";
  PhoneNoOff: string = "Phone No. (Office)";
  PhoneNoRes: string = "Phone No. (Residence)";
  IntroductoryVideo: string = "Introductory Video / Elevator Pitch";
  lblIDCardExpiry: string = "ID Card Expiry";
  lblBloodGroup: string = "Blood Group";
  lblDrivingLicenseNo: string = " Driving License No."
  lblDrivingLicenseExpiry: string = "Driving License Expiry";
  lblSpouseName: string = "Spouse Name";
  lblIsSpouseEmployed: string = "Is Spouse Employed ?";
  lblResidentialStatus: string = "Residential Status";
  lblAnyotherSourceofIncome: string = "Any other Source of Income?";
  lblAnyPhysicalDisability: string = "Any Physical Disability?";
  Bankinformation: string = "Bank Information";
  BankName: string = "Bank Name";
  BranchCode: string = "Branch Code";
  AccountNoIBANNo: string = "Account No. / IBAN No.";
  AccountTitle: string = "Account Title";
  FatherInformation: string = "Father's Information";
  FullName: string = "Full Name";
  PhoneNoCell: string = "Phone No. (Cell)";
  Occupation: string = "Occupation";
  EmergencyContactInformation: string = "Emergency Contact Information";
  Relation: string = "Relation";
  Conveyanceinformation: string = "Conveyance information";
  IhavemyownConveyance: string = "I have my own Conveyance";
  ConveyanceType: string = "Conveyance Type";
  Make: string = "Make";
  Model: string = "Model";
  Year: string = "Year";
  RegistrationNo: string = "Registration No.";
  NextOfKinInformation: string = "Next Of Kin Information";
  Name: string = "Name";
  lblRelationship: string = "Relationship";
  DependentsInformation: string = "Dependents Information";
  EducationalDocuments: string = "Educational Documents";
  lblDocumentType: string = "Document Type";
  DocumentTitle: string = "Document Title";
  lblDocumnetAttachment: string = "Attachment";
  OtherDocuments: string = "Other Documents";
 




 







  
  




  Attachment: string = "CV";

  getHomeLabels() {

    if (this.Labels.dashLabels == true) {
      if (this.Labels.PhoneNoOff != "" && !isNullOrUndefined(this.Labels.PhoneNoOff))
        this.PhoneNoOff = this.Labels.PhoneNoOff;

      if (this.Labels.PhoneNoRes != "" && !isNullOrUndefined(this.Labels.PhoneNoRes))
        this.PhoneNoRes = this.Labels.PhoneNoRes;

      if (this.Labels.IDCardRemarks != "" && !isNullOrUndefined(this.Labels.IDCardRemarks))
        this.IDCardRemarks = this.Labels.IDCardRemarks;

      if (this.Labels.lblAreaOfInterest != "" && !isNullOrUndefined(this.Labels.lblAreaOfInterest))
        this.lblAreaOfInterest = this.Labels.lblAreaOfInterest;

      if (this.Labels.lblContactNoMobile != "" && !isNullOrUndefined(this.Labels.lblContactNoMobile))
        this.lblContactNoMobile = this.Labels.lblContactNoMobile;

      if (this.Labels.lblContactNoOff != "" && !isNullOrUndefined(this.Labels.lblContactNoOff))
        this.lblContactNoOff = this.Labels.lblContactNoOff;

      if (this.Labels.lblContactNoRes != "" && !isNullOrUndefined(this.Labels.lblContactNoRes))
        this.lblContactNoRes = this.Labels.lblContactNoRes;

      if (this.Labels.lblCountryOfCurrentRes != "" && !isNullOrUndefined(this.Labels.lblCountryOfCurrentRes))
        this.lblCountryOfCurrentRes = this.Labels.lblCountryOfCurrentRes;

      if (this.Labels.lblCityOfCurrentRes != "" && !isNullOrUndefined(this.Labels.lblCityOfCurrentRes))
        this.lblCityOfCurrentRes = this.Labels.lblCityOfCurrentRes;

      if (this.Labels.Address != "" && !isNullOrUndefined(this.Labels.Address))
        this.lblAddress = this.Labels.Address;

      if (this.Labels.lblIntroductoryVideoAttachment != "" && !isNullOrUndefined(this.Labels.lblIntroductoryVideoAttachment))
        this.lblIntroductoryVideoAttachment = this.Labels.lblIntroductoryVideoAttachment;

      if (this.Labels.lblMiximumSize != "" && !isNullOrUndefined(this.Labels.lblMiximumSize))
        this.lblMiximumSize = this.Labels.lblMiximumSize;

      if (this.Labels.FinancialLiabilities != "" && !isNullOrUndefined(this.Labels.FinancialLiabilities))
        this.FinancialLiabilities = this.Labels.FinancialLiabilities;

      if (this.Labels.ExistingInsuranceDetail != "" && !isNullOrUndefined(this.Labels.ExistingInsuranceDetail))
        this.ExistingInsuranceDetail = this.Labels.ExistingInsuranceDetail;

      if (this.Labels.SocialMediaConnections != "" && !isNullOrUndefined(this.Labels.SocialMediaConnections))
        this.SocialMediaConnections = this.Labels.SocialMediaConnections;

      if (this.Labels.PersonalAttributes != "" && !isNullOrUndefined(this.Labels.PersonalAttributes))
        this.lblPersonalAttributes = this.Labels.PersonalAttributes;

      if (this.Labels.DocAttachment != "" && !isNullOrUndefined(this.Labels.DocAttachment))
        this.lblDocAttachment = this.Labels.DocAttachment;

      if (this.Labels.LoanDescription != "" && !isNullOrUndefined(this.Labels.LoanDescription))
        this.LoanDescription = this.Labels.LoanDescription;

      if (this.Labels.FinancialInstitution != "" && !isNullOrUndefined(this.Labels.FinancialInstitution))
        this.FinancialInstitution = this.Labels.FinancialInstitution;

      if (this.Labels.InstallmentRemaining != "" && !isNullOrUndefined(this.Labels.InstallmentRemaining))
        this.InstallmentRemaining = this.Labels.InstallmentRemaining;

      if (this.Labels.lblRemainingLoanAmount != "" && !isNullOrUndefined(this.Labels.lblRemainingLoanAmount))
        this.lblRemainingLoanAmount = this.Labels.lblRemainingLoanAmount;

      if (this.Labels.Remarks != "" && !isNullOrUndefined(this.Labels.Remarks))
        this.lblRemarks = this.Labels.Remarks;

      if (this.Labels.InsuranceType != "" && !isNullOrUndefined(this.Labels.InsuranceType))
        this.lblInsuranceType = this.Labels.InsuranceType;

      if (this.Labels.InsuranceCompany != "" && !isNullOrUndefined(this.Labels.InsuranceCompany))
        this.lblInsuranceCompany = this.Labels.InsuranceCompany;

      if (this.Labels.PolicyNumber != "" && !isNullOrUndefined(this.Labels.PolicyNumber))
        this.lblPolicyNumber = this.Labels.PolicyNumber;

      if (this.Labels.DateofPolicyExpiry != "" && !isNullOrUndefined(this.Labels.DateofPolicyExpiry))
        this.DateofPolicyExpiry = this.Labels.DateofPolicyExpiry;

      if (this.Labels.SocialMediaType != "" && !isNullOrUndefined(this.Labels.SocialMediaType))
        this.SocialMediaType = this.Labels.SocialMediaType;

      if (this.Labels.SocialMediaID != "" && !isNullOrUndefined(this.Labels.SocialMediaID))
        this.SocialMediaID = this.Labels.SocialMediaID;

      if (this.Labels.AttributeType != "" && !isNullOrUndefined(this.Labels.AttributeType))
        this.AttributeType = this.Labels.AttributeType;

      if (this.Labels.DocumentCategory != "" && !isNullOrUndefined(this.Labels.DocumentCategory))
        this.lblDocumentCategory = this.Labels.DocumentCategory;

      if (this.Labels.DocAttachment != "" && !isNullOrUndefined(this.Labels.DocAttachment))
        this.DocAttachment = this.Labels.DocAttachment;

      if (this.Labels.DateofAttach != "" && !isNullOrUndefined(this.Labels.DateofAttach))
        this.DateofAttach = this.Labels.DateofAttach;

      if (this.Labels.Subject != "" && !isNullOrUndefined(this.Labels.Subject))
        this.Subject = this.Labels.Subject;

      if (this.Labels.DocImgView != "" && !isNullOrUndefined(this.Labels.DocImgView))
        this.DocImgView = this.Labels.DocImgView;

      if (this.Labels.Add != "" && !isNullOrUndefined(this.Labels.Add))
        this.Add = this.Labels.Add;

      if (this.Labels.Edit != "" && !isNullOrUndefined(this.Labels.Edit))
        this.Edit = this.Labels.Edit;

      if (this.Labels.BasicInformation1 != "" && !isNullOrUndefined(this.Labels.BasicInformation1))
        this.BasicInformation1 = this.Labels.BasicInformation1;

      if (this.Labels.BasicInformation2 != "" && !isNullOrUndefined(this.Labels.BasicInformation2))
        this.BasicInformation2 = this.Labels.BasicInformation2;

      if (this.Labels.ContactInformation != "" && !isNullOrUndefined(this.Labels.ContactInformation))
        this.ContactInformation = this.Labels.ContactInformation;

      if (this.Labels.lblTitle != "" && !isNullOrUndefined(this.Labels.lblTitle))
        this.lblTitle = this.Labels.lblTitle;

      if (this.Labels.Religion != "" && !isNullOrUndefined(this.Labels.Religion))
        this.lblReligion = this.Labels.Religion;

      if (this.Labels.WhencanyouJoin != "" && !isNullOrUndefined(this.Labels.WhencanyouJoin))
        this.WhencanyouJoin = this.Labels.WhencanyouJoin;

      if (this.Labels.PassportNo != "" && !isNullOrUndefined(this.Labels.PassportNo))
        this.lblPassportNo = this.Labels.PassportNo;

      if (this.Labels.Nationality != "" && !isNullOrUndefined(this.Labels.Nationality))
        this.lblNationality = this.Labels.Nationality;

      if (this.Labels.CurrentLastSal != "" && !isNullOrUndefined(this.Labels.CurrentLastSal))
        this.CurrentLastSal = this.Labels.CurrentLastSal;

      if (this.Labels.FamilyCardNo != "" && !isNullOrUndefined(this.Labels.FamilyCardNo))
        this.lblFamilyCardNo = this.Labels.FamilyCardNo;

      if (this.Labels.NativeLanguage != "" && !isNullOrUndefined(this.Labels.NativeLanguage))
        this.lblNativeLanguage = this.Labels.NativeLanguage;

      if (this.Labels.ExpectedSalary != "" && !isNullOrUndefined(this.Labels.ExpectedSalary))
        this.lblExpectedSalary = this.Labels.ExpectedSalary;

      if (this.Labels.FirstName != "" && !isNullOrUndefined(this.Labels.FirstName))
        this.lblFirstName = this.Labels.FirstName;

      if (this.Labels.LastName != "" && !isNullOrUndefined(this.Labels.LastName))
        this.lblLastName = this.Labels.LastName;

      if (this.Labels.MiddleName != "" && !isNullOrUndefined(this.Labels.MiddleName))
        this.lblMiddleName = this.Labels.MiddleName;

      if (this.Labels.MaritalStatus != "" && !isNullOrUndefined(this.Labels.MaritalStatus))
        this.lblMaritalStatus = this.Labels.MaritalStatus;

      if (this.Labels.Gender != "" && !isNullOrUndefined(this.Labels.Gender))
        this.lblGender = this.Labels.Gender;

      if (this.Labels.DateofBirth != "" && !isNullOrUndefined(this.Labels.DateofBirth))
        this.DateofBirth = this.Labels.DateofBirth;

      if (this.Labels.CountryofBirth != "" && !isNullOrUndefined(this.Labels.CountryofBirth))
        this.CountryofBirth = this.Labels.CountryofBirth;

      if (this.Labels.CityofBirth != "" && !isNullOrUndefined(this.Labels.CityofBirth))
        this.CityofBirth = this.Labels.CityofBirth;

      if (this.Labels.IDCardNo != "" && !isNullOrUndefined(this.Labels.IDCardNo))
        this.IDCardNo = this.Labels.IDCardNo;

      if (this.Labels.Save != "" && !isNullOrUndefined(this.Labels.Save))
        this.Save = this.Labels.Save;

      if (this.Labels.Close != "" && !isNullOrUndefined(this.Labels.Close))
        this.Close = this.Labels.Close;

      if (this.Labels.Nodata != "" && !isNullOrUndefined(this.Labels.Nodata))
        this.Nodata = this.Labels.Nodata;

      if (this.Labels.IntroductoryVideo != "" && !isNullOrUndefined(this.Labels.IntroductoryVideo))
        this.IntroductoryVideo = this.Labels.IntroductoryVideo;

    }
  }



  getSocialMediaConnections() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }

    let getSocialMediaPlatformDropDown = this._config.environment.baseUrl + Constants.GetSocialMediaPlatform + "?Culture=en-GB";
    //this.http.get("https:jobportalapi.azurewebsites.net/GetSocialMediaPlatform?Culture=en-GB")
    this.http.post(getSocialMediaPlatformDropDown, RequestObject, { headers: this.dataService.headers })
      .subscribe((response: any) => {

        this.socialMediaConnections = response;
        this.getLastProfileUpdateValue();
        if (!isNullOrUndefined(this.socialMediaConnections) && this.socialMediaConnections.length > 0)
          this.SocialMediaTypeId = this.socialMediaConnections[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }


  getsocialMediaConnectionsGrid() {

    let RequestObject = {
      ApplicantId: localStorage.getItem("AppId"),
      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    this.openSpinner();
    let getSocialMediaConnections = this._config.environment.baseUrl + Constants.GetSocialMediaConnections;
    this.http.post(getSocialMediaConnections, RequestObject, { headers: this.dataService.headers })
      //this.http.post("https://jobportalapi.azurewebsites.net/GetSocialMediaConnections", RequestObject)
      .subscribe((response: any) => {

        this.socialMediaConnectionsGrid = response;
        this.HideSpinner();
        //  this.SocialMediaTypeId = "109";

      }, (error: any) => {
        console.log(error);
      });
  }




  getDeleteSocialMedia(MediaId: number) {
    if (this.isMed == true) {
      this.deltMedia

      let RequestObject = {
        // ApplicationId: this.ApplicationId,
        // Culture: this.Culture,
        // MPRCode: this.MPRCode,
        // CompanyId: "-1",
        // IsApplicantPicForWeb: this.IsApplicantPicForWeb,
        // IsRequestForMobile: this.IsRequestForMobile,
        AppId: localStorage.getItem("AppId"),
        MediaId: MediaId

      };
      this.openSpinner();
      let deleteSocialMedia = this._config.environment.baseUrl + Constants.DeleteSocialMedia;
      this.http.post(deleteSocialMedia, RequestObject, { headers: this.dataService.headers })
        // this.http.post("https://jobportalapi.azurewebsites.net/DeleteSocialMedia", RequestObject)
        .subscribe((response: any) => {

          this.deleteSocialMedia = response.Data;
          this.getsocialMediaConnectionsGrid();
          this.getLastProfileUpdateValue();
          this.HideSpinner();

          if (this.isMed == true) {
            $("#videoPopup1").modal('show');
            this.isTick = true;
            this.ApplyJobMsg = response.Msg;
            this.isMed = false;
            this.popuphide();
          }
        }, (error: any) => {
          console.log(error);
        });
    }
  }


  //Financial Libilities: //


  getFinancialDetail() {

    let RequestObject = {
      ApplicantId: localStorage.getItem("AppId"),
      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,
    }
    this.openSpinner();
    let getFinancialDetail = this._config.environment.baseUrl + Constants.GetFinancialDetail;
    this.http.post(getFinancialDetail, RequestObject, { headers: this.dataService.headers })
      // this.http.post("https://jobportalapi.azurewebsites.net/GetFinancialDetail", RequestObject)
      .subscribe((response: any) => {

        this.financialDetail = response;
        this.HideSpinner();
      }, (error: any) => {
        console.log(error);
      });
  }



  btnPost2_Click() {


    if (navigator.onLine) {

      if (this.AssetDescription == "") {
        this.isMandatoryfields = true;
      }
      else {
        let RequestObject = {
          AssetDescription: this.dataService.ReplaceApostropheWthTelda(this.AssetDescription),
          InstallmentsRemaining: this.InstallmentsRemaining,
          RemainingLoanAmount: this.RemainingLoanAmount,
          Bank: this.dataService.ReplaceApostropheWthTelda(this.Bank),
          Remarks: this.dataService.ReplaceApostropheWthTelda(this.Remarks),
          AppId: localStorage.getItem("AppId"),

          CpId: (this.isUpdatefinancial == true) ? this.selectedCpId : 0,

          Action: (this.isUpdatefinancial == true) ? Action.Update : Action.Insert,
          CompanyId: this.CompanyIdService.CompanyId,

        }

        this.openSpinner();
        let saveFinancialDetail = this._config.environment.baseUrl + Constants.SaveFinancialDetail;
        this.PostData(RequestObject, saveFinancialDetail, { headers: this.dataService.headers });
        // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SaveFinancialDetail");
        $("#myModal7").modal("toggle");
      }
    }
    else {

      this.DisconnectInternet = true;
    }

  }


  getdeleteFinancialLibilities(CpId: number) {
    if (this.isfinance == true) {
      this.delFinancial
      let RequestObject = {
        AppId: localStorage.getItem("AppId"),
        CpId: CpId

      };

      this.openSpinner();
      let deleteFinancialDetail = this._config.environment.baseUrl + Constants.DeleteFinancialDetail;
      this.http.post(deleteFinancialDetail, RequestObject, { headers: this.dataService.headers })
        //   this.http.post("https://jobportalapi.azurewebsites.net/DeleteFinancialDetail", RequestObject)
        .subscribe((response: any) => {

          this.deleteFinancialLibilities = response.Data;
          this.getFinancialDetail();
          this.getLastProfileUpdateValue();
          this.HideSpinner();

          //POPUP FOR DELETE//
          if (this.isfinance == true) {

            //this.toastr.success(response.Msg, '', {
            //    positionClass: "toast-bottom-right",
            //});
            $("#videoPopup1").modal('show');
            this.isTick = true;
            this.ApplyJobMsg = response.Msg;
            this.isfinance = false;
            this.popuphide();
          }

        }, (error: any) => {
          console.log(error);
        });
    }
  }



  updateFinancialData(selectedRow: any) {
    if (navigator.onLine) {
      let RequestObject = {
        CpId: selectedRow.CpId,
        AppId: localStorage.getItem("AppId"),
        Email: localStorage.getItem("Email"),
        Action: Action.Update,
      }

      this.openSpinner();
      let saveFinancialDetail = this._config.environment.baseUrl + Constants.SaveFinancialDetail;
      this.http.post(saveFinancialDetail, RequestObject, { headers: this.dataService.headers })
        //  this.http.post("https://jobportalapi.azurewebsites.net/SaveFinancialDetail", RequestObject)
        .subscribe((response: any) => {

          this.HideSpinner();
          if (!isNullOrUndefined(response) && response.isValid == true) {
            this.getFinancialDetail();

          } else {
            alert("Invalid Data.");
          }
        }, (error: any) => {
          alert(error.error.Message);
        });
    }
    else {

      this.DisconnectInternet = true;
    }
  }



  onUpdateFinancial_Click(selectedRow: any) {

    this.isMandatoryfields = false;
    this.isUpdatefinancial = true;
    this.selectedCpId = selectedRow.CpId;
    this.AssetDescription = selectedRow.AssetDescription;
    this.InstallmentsRemaining = selectedRow.InstallmentsRemaining;
    this.RemainingLoanAmount = selectedRow.RemainingLoanAmount;
    this.Bank = selectedRow.Bank;
    this.Remarks = selectedRow.Remarks;

  }

  // for backgrouud color // 

  ThemeFontColor: string = "";
  DefaultFontColor: string = "";
  BorderColor: string = "";
  DefaultBorderColor: string = "";

  forChanges: any;
  breakcode: any;
  code: any;
  // this.tickImage = "../../../assets/images/" + this.code + "/tick.PNG";

  Color() {

    this.forChanges = this.ClrThemeChng.ChangeTheme;

    if (isNullOrUndefined(this.forChanges)) {
      this.DefaultFontColor = "#" + Constants.default;
      this.DefaultBorderColor = "3px dotted #" + Constants.default;
      this.tickImage = "assets/images/" + Constants.default + "/tick.png";
    }
    else if (!isNullOrUndefined(this.forChanges)) {

      this.breakcode = this.forChanges.split('#');
      this.code = this.breakcode[1];
      this.ThemeFontColor = this.forChanges;
      this.BorderColor = "1px solid" + this.forChanges;
      this.tickImage = "assets/images/" + this.code + "/tick.png";
    }
  }

  VisFinancialLiabilities: any;
  VisExisitingInsuranceDetail: any;
  VisSocialMediaConnections: any;
  VisDocumentAttachment: any;
  VisAcademicQualifications: any;
  VisCertifications: any;
  VisTrainings: any;
  VisExperience: any;
  VisCompetenciesSkills: any;
  VisProfessionalReferences: any;
  VisMaritalStatus: any;
  VisReligion: any;
  VisLegalHistory: any;
  VisPersonalAttributes: any;
  MndIntroductoryVideo: any;
  VisIntroductoryVideo: any;


  MndCurrentLastSalary: boolean = false;
  MndDateofBirth: boolean = false;
  MndEmailAddress: boolean = false;
  MndExistingInsuranceDetails: boolean = false;
  MndExpectedSalary: boolean = false;
  MndFinancialLiabilities: boolean = false;
  MndFirstName: boolean = false;
  MndGender: boolean = false;
  MndIDCardNo: boolean = false;
  MndLastName: boolean = false;
  MndLegalHistory: boolean = false;
  MndMaritalStatus: boolean = false;
  MndNationality: boolean = false;
  MndNativeLanguage: boolean = false;
  MndPassportNo: boolean = false;
  MndPersonalAttributes: boolean = false;
  MndPhoneNoCell: boolean = false;
  MndReligion: boolean = false;
  MndSocialMediaConnections: boolean = false;
  MndWhenCanYouJoin: boolean = false;
  MndermanentAddress: boolean = false;
  MndCV: boolean = false;


  ChangeTheme: any;

  getJobPortalConfiguration1() {


    let RequestObject = {

      CompanyId: this.CompanyIdService.CompanyId,
    };
    let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
    this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
      // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
      .subscribe((response: any) => {
        //console.log("getJobPortalConfiguration ---", response)

        this.ClrThemeChng.ChangeTheme = response.ThemeColor;
        this.VisFinancialLiabilities = response.VisFinancialLiabilities;
        this.VisExisitingInsuranceDetail = response.VisExisitingInsuranceDetail;
        this.VisSocialMediaConnections = response.VisSocialMediaConnections;
        this.VisDocumentAttachment = response.VisDocumentAttachment;
        this.VisPersonalAttributes = response.VisPersonalAttributes;
        this.MndIntroductoryVideo = response.MndIntroductoryVideo;
        this.VisMaritalStatus = response.VisMaritalStatus;
        this.VisReligion = response.VisReligion;
        this.VisLegalHistory = response.VisLegalHistory;
        this.VisIntroductoryVideo = response.VisIntroductoryVideo;

        this.MndCurrentLastSalary = response.MndCurrentLastSalary;
        this.MndCV = response.MndCV;
        this.MndDateofBirth = response.MndDateofBirth;
        this.MndEmailAddress = response.MndEmailAddress;
        this.MndExistingInsuranceDetails = response.MndExistingInsuranceDetails;
        this.MndExpectedSalary = response.MndExpectedSalary;
        this.MndFinancialLiabilities = response.MndFinancialLiabilities;
        this.MndFirstName = response.MndFirstName;
        this.MndGender = response.MndGender;
        this.MndIDCardNo = response.MndIDCardNo;
        this.MndLastName = response.MndLastName;
        this.MndLegalHistory = response.MndLegalHistory;
        this.MndMaritalStatus = response.MndMaritalStatus;
        this.MndNationality = response.MndNationality;
        this.MndNativeLanguage = response.MndNativeLanguage;
        this.MndPassportNo = response.MndPassportNo;
        this.MndPersonalAttributes = response.MndPersonalAttributes;
        this.MndPhoneNoCell = response.MndPhoneNoCell;
        this.MndReligion = response.MndReligion;
        this.MndSocialMediaConnections = response.MndSocialMediaConnections;
        this.MndWhenCanYouJoin = response.MndWhenCanYouJoin;
        this.MndermanentAddress = response.MndermanentAddress;

        this.Color();
        // this.HideSpinner();

      })
  }


  // Existence Insurance Detail //


  // Existence Insurance Detail for Grid //

  getExistingInsuranceDetailGrid() {


    let RequestObject = {
      ApplicantId: localStorage.getItem("AppId"),
      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,
      ApplicantEmail: localStorage.getItem("Email"),
      IsRequestFromMobile: false
    }

    this.openSpinner();
    let getExistingInsuranceDetail = this._config.environment.baseUrl + Constants.GetExistingInsuranceDetail;
    this.http.post(getExistingInsuranceDetail, RequestObject, { headers: this.dataService.headers })
      .subscribe((response: any) => {

        this.ExistingInsuranceDetailGrid = response;
        this.HideSpinner();
      }, (error: any) => {
        console.log(error);
      });
  }

  //onchange(event) {

  //}

  // Save Data of Existance Insurance //


  saveInsuranceDetail() {

    if (navigator.onLine) {

      this.forDateVlaidationcity1 = false;
      this.isMandatoryfields = false;
      let insurancetype = this.InsurancetypeDropdown.find(x => x.Id == this.InsuranceType);
      let InsuranceCompany = this.InsuranceCompanyDropdown.find(x => x.Id == this.InsuranceCompany);

      if (insurancetype.Name == 'N/A' || InsuranceCompany.Name == "N/A" || this.PolicyNumber == "" || this.txtpolicyExpiryDate == "") {
        this.isMandatoryfields = true;
        return;
      }
      if (this.forDateVlaidation == false) {
        this.forDateVlaidationcity1 = true;
        return;
      }


      let RequestObject = {

        EidId: (this.isUpdateInsurance == true) ? this.selectedEidId : 0,
        CompanyId: this.CompanyIdService.CompanyId,
        AppId: localStorage.getItem("AppId"),
        Email: localStorage.getItem("Email"),
        InsuranceType: this.InsuranceType,
        InsuranceCompany: this.InsuranceCompany,
        InsuranceTypeName: 0,
        InsuranceCompanyName: this.InsuranceCompanyName,
        PolicyNumber: this.PolicyNumber,
        StrPolicyExpiryDate: this.txtpolicyExpiryDate,
        //  SimplePolicyExpiryDate: "string",
        Remarks: this.dataService.ReplaceApostropheWthTelda(this.Remarks),
        //   ApplicationID: "string",
        Action: (this.isUpdateInsurance == true) ? Action.Update : Action.Insert,

      }
      this.openSpinner()
      let saveInsuranceDetail = this._config.environment.baseUrl + Constants.SaveInsuranceDetail;
      this.PostData(RequestObject, saveInsuranceDetail, { headers: this.dataService.headers });
      $("#myModal8").modal("toggle");



    }
    else {

      this.DisconnectInternet = true;
    }
  }


  // Existence Insurance Detail for Update //

  updateInsuranceData(selectedRow: any) {
    if (navigator.onLine) {
      let RequestObject = {
        EidId: selectedRow.EidId,
        AppId: localStorage.getItem("AppId"),
        Email: localStorage.getItem("Email"),
        Action: Action.Update,
      }

      this.openSpinner();
      let saveInsuranceDetail = this._config.environment.baseUrl + Constants.SaveInsuranceDetail;
      this.http.post(saveInsuranceDetail, RequestObject, { headers: this.dataService.headers })
        .subscribe((response: any) => {

          this.HideSpinner();
          if (!isNullOrUndefined(response) && response.isValid == true) {
            this.getExistingInsuranceDetailGrid();

          } else {
            alert("Invalid Data.");
          }
        }, (error: any) => {
          alert(error.error.Message);
        });
    }
    else {

      this.DisconnectInternet = true;
    }
  }

  InsurancePolicyExpiryDate: string = "";

  onUpdateInsurance_Click(selectedRow: any) {


    this.isMandatoryfields = false;
    this.isUpdateInsurance = true;
    this.selectedEidId = selectedRow.EidId;
    this.InsuranceType = selectedRow.InsuranceType;
    this.InsuranceCompany = selectedRow.InsuranceCompany;
    this.PolicyNumber = selectedRow.PolicyNumber;
    this.InsurancePolicyExpiryDate = selectedRow.PolicyExpiryDate;
    this.PolicyExpiryDate_DefaultValue = this.getControlDate(this.InsurancePolicyExpiryDate);
    this.Remarks = selectedRow.Remarks;

  }

  onUpdateInsurance1_Click(selectedRow: any) {


    this.isMandatoryfields = false;
    this.isUpdateInsurance = true;
    this.selectedEidId = selectedRow.EidId;
    this.InsuranceType = selectedRow.InsuranceType;
    this.InsuranceCompany = selectedRow.InsuranceCompany;
    this.PolicyNumber = selectedRow.PolicyNumber;
    this.InsurancePolicyExpiryDate = selectedRow.PolicyExpiryDate;
    this.PolicyExpiryDate_DefaultValue = this.getControlDate(this.InsurancePolicyExpiryDate);
    this.Remarks = selectedRow.Remarks;

  }


  // Existence Insurance Detail for Delete //

  deleteInsuranceDetail(EidId: number) {
    if (this.isInsu == true) {
      this.delInsurance
      let RequestObject = {
        EidId: EidId,
        AppId: localStorage.getItem("AppId"),
        Email: localStorage.getItem("Email"),

      };

      this.openSpinner();
      let deleteInsuranceDetail = this._config.environment.baseUrl + Constants.DeleteInsuranceDetail;
      this.http.post(deleteInsuranceDetail, RequestObject, { headers: this.dataService.headers })
        .subscribe((response: any) => {

          this.deleteInsurance = response.Data;
          this.getExistingInsuranceDetailGrid();
          this.getLastProfileUpdateValue();


          //POPUP FOR DELETE//
          if (this.isInsu == true) {

            this.HideSpinner();
            //this.toastr.success(response.Msg, '', {
            //    positionClass: "toast-bottom-right",
            //});
            $("#videoPopup1").modal('show');
            this.isTick = true;
            this.ApplyJobMsg = response.Msg;
            this.isInsu = false;
            this.popuphide();
          }

        }, (error: any) => {
          console.log(error);
        });
    }
  }

  // InsuranceCompanyDropdown //

  getInsuranceCompanyDropdown() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }

    let getInsuranceCompany = this._config.environment.baseUrl + Constants.GetInsuranceCompany + "?Culture=en-GB";
    this.http.post(getInsuranceCompany, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetInsuranceCompany?Culture=en-GB")
      .subscribe((response: any) => {

        this.InsuranceCompanyDropdown = response;
        if (!isNullOrUndefined(this.InsuranceCompanyDropdown) && this.InsuranceCompanyDropdown.length > 0)
          this.InsuranceCompany = this.InsuranceCompanyDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }


  // InsuranceTypeDropdown //

  getInsurancetypeDropdown() {

    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    let getInsuranceType = this._config.environment.baseUrl + Constants.GetInsuranceType + "?Culture=en-GB";
    this.http.post(getInsuranceType, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetInsuranceType?Culture=en-GB")
      .subscribe((response: any) => {

        this.InsurancetypeDropdown = response;
        if (!isNullOrUndefined(this.InsurancetypeDropdown) && this.InsurancetypeDropdown.length > 0)
          this.InsuranceType = this.InsurancetypeDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }





  // Application Data //

  SpnsCity: string = "";
  SpnsCountry: string = "";
  CountryOfResidence1: number = 0;
  CityOfResidence1: number = 0;
  ExpectedCurrencyId: number = 0;
  PreviousExpectedCurrency: string = "";
  CurrentCurrency1: string = "";
  ExpectedCurrency: string = "";
  CurrentSalaryType: string = "";
  ExpectedSalaryTypeName: string = "";
  CurrentSalaryTypeName: string = "";
  Username;


  getApplicantData() {


    let RequestObject = {
      ApplicantId: localStorage.getItem("AppId"),
      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId

    }
    this.openSpinner();
    let getApplicantData = this._config.environment.baseUrl + Constants.GetApplicantData;
    this.http.post(getApplicantData, RequestObject, { headers: this.dataService.headers })
      // this.http.post("https://jobportalapi.azurewebsites.net/GetApplicantData", RequestObject)
      .subscribe((response: any) => {

        this.ApplicantData = response;


        this.HideSpinner();

        // Basic information 1 //

        this.Title = response.Data[0].Title;
        this.FirstName = response.Data[0].FirstName;
        this.MiddleName = response.Data[0].MiddleName;
        this.LastName = response.Data[0].LastName;
        this.Gender = response.Data[0].Gender;
        this.DateOB = response.Data[0].DateOB;//this.getDisplayDate(response.Data[0].DateOB);
        localStorage.setItem("DateOfBirthForProf", this.DateOB)

        this.MaritalStatus = response.Data[0].MaritalStatus;
        this.CountryOfBirth = response.Data[0].CountryOfBirth;
        //    console.log("this.CountryOfBirth", this.CountryOfBirth)
        this.CityOfBirth = response.Data[0].CityOfBirth;

        this.PreviousTitleId = response.Data[0].TitleId;
        this.PreviousMaritalStatusId = response.Data[0].MaritalStatusId;
        this.PreviousGenders = response.Data[0].GenderId;
        this.PreviousCountryOfBirth = response.Data[0].CountryOfBirthId;
        this.PreviousCitiesByCountryId = response.Data[0].CityOfBirthId;


        // Basic information 2 //
        this.ExpectedSalary = response.Data[0].ExpectedSalary;
        this.CurrentSalary = response.Data[0].CurrentSalary;
        this.Religion = response.Data[0].Religion;
        this.PassportNo = response.Data[0].PassportNo;
        this.Nationality = response.Data[0].Nationality;
        this.NativeLanguage = response.Data[0].NativeLanguage;
        this.FamilyCardNo = response.Data[0].FamilyCardNo;
        this.NICNo = response.Data[0].NICNo;
        this.JoiningDate = response.Data[0].JoiningDate;
        this.ExpectedSalaryTo = response.Data[0].ExpectedSalaryTo;
        this.CurrentCurrency = response.Data[0].CurrentCurrency;
        this.ExpectedSalaryType = response.Data[0].ExpectedSalaryType;
        this.CurrentSalaryType = response.Data[0].CurrentSalaryType;
        this.ExpectedSalaryTypeName = response.Data[0].ExpectedSalaryTypeName;
        this.CurrentSalaryTypeName = response.Data[0].CurrentSalaryTypeName;
        this.IdCardRemarks = response.Data[0].IdCardRemarks;
        //this.AreaOfInterest = response.Data[0].AreaOfInterest;
        this.ExpectedCurrencyId = response.Data[0].ExpectedCurrencyId;

        this.PreviousReligions = response.Data[0].ReligionId;
        this.PreviousNationalities = response.Data[0].NationalityId;
        this.PreviousNativeLanguages = response.Data[0].NativeLanguageId;
        this.PreviousWhenCanYouJoin = response.Data[0].JoiningDate;
        this.PreviousCurrency = response.Data[0].CurrencyId;
        this.PreviousExpectedSalaryTo = response.Data[0].ExpectedSalaryTo;
        this.PreviousCurrentCurrencyId = response.Data[0].CurrentCurrencyId;
        this.PreviousExpectedCurrency = response.Data[0].ExpectedCurrencyId;

        this.CurrentCurrency = response.Data[0].CurrentCurrency;
        this.ExpectedCurrency = response.Data[0].ExpectedCurrency;



        // Basic information 3 //
        this.TelMobile = response.Data[0].TelMobile;
        this.Address = response.Data[0].Address;
        this.TelRes = response.Data[0].TelRes;
        this.TelOffice = response.Data[0].TelOffice;
        this.CountryOfResidence = response.Data[0].CountryOfResidence;
        this.CityOfResidence = response.Data[0].CityOfResidence;
        this.CountryOfResidence1 = response.Data[0].CountryOfResidenceId;
        this.CityOfResidence1 = response.Data[0].CityOfResidenceId;
        this.Age = response.Data[0].Age;
        this.Email = response.Data[0].Email;


        // Basic information 4 //

        this.IqamaNumber = response.Data[0].IqamaNo;
        this.SponsorContactDetail = response.Data[0].SpnsContactDetails;
        this.IqamaExpiryHijri = this.getDisplayDate(response.Data[0].IqamaExpiryHijri);
        this.NoOfSpnsChangedOfVisa = response.Data.NoOfSpnsChangedOfVisa;
        this.SponsorType = response.Data[0].SpnsType;
        this.SpnsNatureOfBusiness = response.Data[0].SpnsNatureOfBusiness;
        this.IqamaExpiryGregorian = this.getDisplayDate(response.Data[0].IqamaExpiryGregorian);
        this.CurrSpnsName = response.Data[0].CurrSpnsName;
        this.SpnsCategory = response.Data[0].SpnsCategory;
        this.IqamaProfession = response.Data[0].IqamaProfession;
        this.SpnsTransferable1 = response.Data[0].SpnsTransferable;
        this.SpnsCity = response.Data[0].SpnsCity;
        this.SpnsCountry = response.Data[0].SpnsCountry;

        this.PreviousSponsorType = response.Data[0].SpnsTypeId;
        this.PreviousSpnsCategoryId = response.Data[0].SpnsCategoryId;
        this.PreviousIqamaProfession = response.Data[0].IqamaProfessionId;


        //Basic Information 5 //

        this.ValidDrivingLicenseKSA = response.Data[0].ValidDrivingLicenseKSAText;
        this.DateOfEntryInKSA = this.getDisplayDate(response.Data[0].DOEntryKSA);
        this.DateOfExitInKSA = this.getDisplayDate(response.Data[0].DOExitKSA);

        //Basic Information 6 //

        this.HstOfPersecution = response.Data[0].HstOfPersecution;
        this.HstOfPenalties = response.Data[0].HstOfPenalties;
        this.PendingCases = response.Data[0].PendingCases;
        this.Username = response.Data[0].Username;

        this.GiveLblToDshboard();

      }, (error: any) => {

        console.log(error);
      });
  }



  // Marital Status Dropdown //

  getMaritalStatusDropdown() {

    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }

    let getMaritalStatus = this._config.environment.baseUrl + Constants.GetMaritalStatus + "?Culture=en-GB";
    this.http.post(getMaritalStatus, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetMaritalStatus?Culture=en-GB")
      .subscribe((response: any) => {

        this.MaritalStatusDropdown = response;
        if (!isNullOrUndefined(this.MaritalStatusDropdown) && this.MaritalStatusDropdown.length > 0)
          this.MaritalStatuss = this.MaritalStatusDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }


  // Gender Dropdown //

  getGenderDropdown() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }

    let getGender = this._config.environment.baseUrl + Constants.GetGender + "?Culture=" + Constants.Culture;
    this.http.post(getGender, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetMaritalStatus?Culture=en-GB")
      .subscribe((response: any) => {

        this.GenderDropdown = response;
        if (!isNullOrUndefined(this.GenderDropdown) && this.GenderDropdown.length > 0)
          this.Genders = this.GenderDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }


  // Countries Dropdown //

  getCountriesDropdown() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }

    let getCountries = this._config.environment.baseUrl + Constants.GetCountries;
    this.http.post(getCountries, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetCountries")
      .subscribe((response: any) => {

        this.CountriesDropdown = response;
        if (!isNullOrUndefined(this.CountriesDropdown) && this.CountriesDropdown.length > 0)
          this.selectedCountry = this.CountriesDropdown[0].Id;
        this.getCitiesByCountryIdDropdown();
      }, (error: any) => {
        console.log(error);
      });
  }

  getCitiesByCountryIdDropdown() {
    debugger;
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }

    let getCitiesByCountryId = this._config.environment.baseUrl + Constants.GetCitiesByCountryId + "?CountryId=" + this.selectedCountry;
    this.http.post(getCitiesByCountryId, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetCitiesByCountryId?CountryId=en-GB")
      .subscribe((response: any) => {
        debugger;
        this.CitiesByCountryIdDropdown = response;

        if (!isNullOrUndefined(this.CitiesByCountryIdDropdown) && this.CitiesByCountryIdDropdown.length > 0) {
          this.chk = this.CitiesByCountryIdDropdown.find(x => x.Id == this.ddlCitiesByCountryId);
          if (isNullOrUndefined(this.chk))
            this.ddlCitiesByCountryId = this.CitiesByCountryIdDropdown[0].Id;

          //    this.CitiesByCountryId = this.CitiesByCountryIdDropdown[0].Id;
          //    this.CitiesByCountryId = this.CitiesByCountryIdDropdown[0].Name;
          // console.log("this.CitiesByCountryId", this.CitiesByCountryId);
        }

      }, (error: any) => {
        console.log(error);
      });
  }

  // Cities Dropdown //

  getCitiesDropdown() {

    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }

    let getCities = this._config.environment.baseUrl + Constants.GetCities;
    this.http.post(getCities, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetCountries")
      .subscribe((response: any) => {

        this.CitiesDropdown = response;
        if (!isNullOrUndefined(this.CitiesDropdown) && this.CitiesDropdown.length > 0)
          this.Cities = this.CitiesDropdown[0].Id;
        // console.log("momomo", this.CitiesDropdown)
        this.getCountriesDropdown();
      }, (error: any) => {
        console.log(error);
      });
  }

  popuphide() {

    setTimeout(() => {

      $("#videoPopup1").modal('hide');

    }, 4400)
  }

  clickRow: boolean = true;

  //For Selected Row Color

  ForSelectedRowColor() {

    this.btnAdd_Click1();
    if (this.clickRow == false) {
      $('#myModal8').modal('hide');
      this.clickRow = true;
    }
    else {
      $('#myModal8').modal('show');
      $("tbody tr").click(function () {
        $(this).addClass('selected').siblings().removeClass("selected");
      });
    }

  }

  ForSelectedRowColor1() {

    this.btnAdd_Click1();
    if (this.clickRow == false) {
      $('#myModal7').modal('hide');
      this.clickRow = true;
    }
    else {
      $('#myModal7').modal('show');
      $("tbody tr").click(function () {
        $(this).addClass('selected').siblings().removeClass("selected");
      });
    }
  }

  ForSelectedRowColor2() {

    this.btnAdd_Click1();
    if (this.clickRow == false) {
      $('#myModal9').modal('hide');
      this.clickRow = true;
    }
    else {
      $('#myModal9').modal('show');
      $("tbody tr").click(function () {
        $(this).addClass('selected').siblings().removeClass("selected");
      });
    }
  }

  ForSelectedRowColor3() {

    this.btnAdd_Click1();
    if (this.clickRow == false) {
      $('#myModal10').modal('hide');
      this.clickRow = true;
    }
    else {
      $('#myModal10').modal('show');
      $("tbody tr").click(function () {
        $(this).addClass('selected').siblings().removeClass("selected");
      });
    }
  }

  ForSelectedRowColor4() {

    this.btnAdd_Click1();
    if (this.clickRow == false) {
      $('#myModal11').modal('hide');
      this.clickRow = true;
    }
    else {
      $('#myModal11').modal('show');
      $("tbody tr").click(function () {
        $(this).addClass('selected').siblings().removeClass("selected");
      });
    }
  }

  getReligionDropdown() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    let getReligion = this._config.environment.baseUrl + Constants.GetReligion + "?Culture=" + Constants.Culture;
    this.http.post(getReligion, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetReligion?Culture=en-GB")
      .subscribe((response: any) => {

        this.ReligionDropdown = response;
        if (!isNullOrUndefined(this.ReligionDropdown) && this.ReligionDropdown.length > 0)
          this.Religions = this.ReligionDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }


  getNationalityDropdown() {

    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    let getNationality = this._config.environment.baseUrl + Constants.GetNationality + "?Culture=" + Constants.Culture;
    this.http.post(getNationality, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetNationality?Culture=en-GB")
      .subscribe((response: any) => {

        this.NationalityDropdown = response;
        if (!isNullOrUndefined(this.NationalityDropdown) && this.NationalityDropdown.length > 0)
          this.Nationalities = this.NationalityDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }


  getNativeLanguageDropdown() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    let getNativeLanguage = this._config.environment.baseUrl + Constants.GetNativeLanguage + "?Culture=" + Constants.Culture;
    this.http.post(getNativeLanguage, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetNativeLanguage?Culture=en-GB")
      .subscribe((response: any) => {

        this.NativeLanguageDropdown = response;
        if (!isNullOrUndefined(this.NativeLanguageDropdown) && this.NativeLanguageDropdown.length > 0)
          this.NativeLanguages = this.NativeLanguageDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }




  DocMbs: any;
  isDocCheck: boolean = false;
  chk: any;

  getdMbs() {

    let RequestObject = {

      DocCatId: this.DocCatId,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    let getCitiesByCountryId = this._config.environment.baseUrl + Constants.GetDocSize;
    this.http.post(getCitiesByCountryId, RequestObject, { headers: this.dataService.headers })
      .subscribe((response: any) => {
        this.DocMbs = response.Mbs;
        this.isDocCheck = true;
        //   console.log("hahahhaha ---------- : ", this.DocMbs)

      }, (error: any) => {
        console.log(error);
      });
  }

  onChange() {
    this.getCitiesByCountryIdDropdown();
    //this.getdMbs();
    //    this.getApplicantData();

  }

  getTitle() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    let getTitle = this._config.environment.baseUrl + Constants.GetTitle + "?Culture=" + Constants.Culture;
    this.http.post(getTitle, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetTitle?Culture=en-GB")
      .subscribe((response: any) => {

        this.TitleDropdown = response;
        if (!isNullOrUndefined(this.TitleDropdown) && this.TitleDropdown.length > 0)
          this.ddlTitle = this.TitleDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }


  getIqamaProfession() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    let getIqamaProfession = this._config.environment.baseUrl + Constants.GetIqamaProfession + "?Culture=en-GB";
    this.http.post(getIqamaProfession, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetYears")
      .subscribe((response: any) => {

        this.IqamaProfessionDropdown = response;
        if (!isNullOrUndefined(this.IqamaProfessionDropdown) && this.IqamaProfessionDropdown.length > 0)
          this.IqamaProfession = this.IqamaProfessionDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }


  getSponsorShipType() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    let getSponsorShipType = this._config.environment.baseUrl + Constants.GetSponsorShipType + "?Culture=en-GB";
    this.http.post(getSponsorShipType, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetYears")
      .subscribe((response: any) => {

        this.SponsorShipTypeDropdown = response;
        if (!isNullOrUndefined(this.SponsorShipTypeDropdown) && this.SponsorShipTypeDropdown.length > 0)
          this.SponsorShipType = this.SponsorShipTypeDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }


  getSponsorShipCategory() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    let getSponsorShipCategory = this._config.environment.baseUrl + Constants.GetSponsorShipCategory + "?Culture=en-GB";
    this.http.post(getSponsorShipCategory, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetYears")
      .subscribe((response: any) => {

        this.SponsorShipCategoryDropdown = response;
        if (!isNullOrUndefined(this.SponsorShipCategoryDropdown) && this.SponsorShipCategoryDropdown.length > 0)
          this.SponsorShipCategory = this.SponsorShipCategoryDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }



  getWhenCanYouJoin() {

    let getWhenCanYouJoin = this._config.environment.baseUrl + Constants.GetWhenCanYouJoin;
    this.http.get(getWhenCanYouJoin, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetWhenCanYouJoin")
      .subscribe((response: any) => {

        this.WhenCanYouJoinDropdown = response;
        if (!isNullOrUndefined(this.WhenCanYouJoinDropdown) && this.WhenCanYouJoinDropdown.length > 0)
          this.WhenCanYouJoin = this.WhenCanYouJoinDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }


  // For getting Image //

  GetApplicantImage() {

    let RequestData = {
      ApplicantId: localStorage.getItem('AppId'),
      CompanyId: this.CompanyIdService.CompanyId,
      ApplicantEmail: localStorage.getItem('Email'),

    }

    let getApplicantImage = this._config.environment.baseUrl + Constants.GetApplicantImage;
    this.http.post(getApplicantImage, RequestData, { headers: this.dataService.headers })
      .subscribe((response: any) => {


        this.ApplicantImage = response;

      }, (error: any) => {


        console.log(error);
      });

  }


  formatDateString(ds: string): string {
    var months = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    var b = ds.split('/');
    return b[2] + '-' + months[b[1]] + '-' + b[0] + ' 00:00:00';
  }

  getControlDate(_date: string): string {

    var objDate = new Date(this.formatDateString(_date));
    let date: string = objDate.getDate().toString();
    if (Number(date) < 10)
      date = "0" + date;

    var month = objDate.getMonth() + 1;
    var year = objDate.getFullYear();
    var fullDate = date + "-" + month + "-" + year;

    return fullDate;
  }

  getDisplayDate(_date: string): string {

    if (!isNullOrUndefined(_date) && _date != "") {

      if (_date.indexOf('/') >= 0) {

        let arrDate: string[] = _date.split('/');
        let newDate: string = "";
        for (var i = 0; i < arrDate.length; i++) {
          newDate += arrDate[i] + "-";
        }
        newDate = newDate.substring(0, newDate.length - 1);
        return newDate;
      }
      else
        return _date;
    }
    return _date;
  }

  isMandatoryfieldsbasic1: boolean = false;
  genderval;
  forDateVlaidationcity: boolean = false;
  forDateVlaidationcity1: boolean = false;
  // update data for Basic Information 1 //
  UpdateApplicantDataBasicInformation1_click() {

    if (navigator.onLine) {

      //let genderforValidation = this.GenderDropdown.find(x => x.Id == this.ddlGenders);
      //this.genderval = genderforValidation.Name;
      // || this.genderval == 'N/A'

      if (this.txtFirstrName == '' || this.txtLastName == '' || this.txtDateOB == '') {
        this.isMandatoryfieldsbasic1 = true;
        this.isBtnHide1 = true;
        return;
      }
      if (this.forDateVlaidation == false) {
        this.forDateVlaidationcity = true;
        return;
      }

      else {
        this.isMandatoryfields = false;
        this.forDateVlaidationcity1 = false;

        let RequestObject = {

          Appid: localStorage.getItem('AppId'),
          Email: localStorage.getItem('Email'),
          FirstName: this.dataService.ReplaceApostropheWthTelda(this.txtFirstrName),
          MiddleName: this.dataService.ReplaceApostropheWthTelda(this.txtMiddleName),
          LastName: this.dataService.ReplaceApostropheWthTelda(this.txtLastName),
          CompanyId: this.CompanyIdService.CompanyId,
          GenderId: this.ddlGenders,
          MaritalStatusId: this.ddlMaritalStatusId,
          SimpleDateOB: this.txtDateOB,
          CountryOfBirthId: this.selectedCountry,
          CityOfBirthId: this.ddlCitiesByCountryId,//(isNullOrUndefined(this.CitiesByCountryId) || this.CitiesByCountryId == 'N/A') ? this.CitiesByCountryIdDropdown[0].Id : this.ddlCitiesByCountryId,   //this.ddlCitiesByCountryId,  /// this.isUpdateDocumentAttach ? Action.Update : Action.Insert;
          TitleId: this.ddlTitle,
          ApplicantEmail: localStorage.getItem('Email'),
          Index: "0"

        }
        this.isCloseEditLbl1_Click();
        this.openSpinner();
        let updateApplicantData = this._config.environment.baseUrl + Constants.UpdateApplicantData;
        this.PostData(RequestObject, updateApplicantData, { headers: this.dataService.headers });
        // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/UpdateApplicantData");
      }
    }
    else {

      this.DisconnectInternet = true;
    }

  }


  // update data for Basic Information 2 //
  DisconnectInternet1: boolean = false;
  isMandatoryfieldsAnyOne: boolean = false;
  ExpectedRange: boolean = false;
  SelectCurrency: boolean = false;
  UpdateApplicantDataBasicInformation2_click() {


    if (navigator.onLine) {


      let ddlCurrentCurrencyId = this.CurrencyDropdown.find(x => x.Id == this.ddlCurrentCurrencyId);
      let ddlCurrency = this.CurrencyDropdown.find(x => x.Id == this.ddlCurrency);
      this.SelectCurrency = false;
      this.isMandatoryfieldsAnyOne = false;
      this.ExpectedRange = false;

      if (this.txtPassportNo == '' && this.txtNICNo == '') {

        this.isMandatoryfieldsAnyOne = true;
        this.isBtnHide2 = true;
        return;
      }
      if (Number(this.txtExpectedSalary) > Number(this.txtExpectedSalaryTo)) {

        this.ExpectedRange = true;
        this.isBtnHide2 = true;
        return;
      }
      if (!isNullOrUndefined(this.txtCurrentSalary)) {
        if (ddlCurrency.Name == 'N/A') {
          this.SelectCurrency = true;
          return;
        }
      }

      if (!isNullOrUndefined(this.txtExpectedSalary) && !isNullOrUndefined(this.txtExpectedSalaryTo)) {
        if (Number(this.txtExpectedSalary) > Number(this.txtExpectedSalaryTo)) {

          this.ExpectedRange = true;
          this.isBtnHide2 = true;
          return;
        }
        if (Number(this.txtExpectedSalaryTo) > Number(this.txtExpectedSalary)) {
          if (ddlCurrentCurrencyId.Name == 'N/A') {
            this.SelectCurrency = true;
            return;
          }
        }
      }

      this.isMandatoryfieldsAnyOne = false;
      this.ExpectedRange = false;
      let RequestObject = {

        Appid: localStorage.getItem('AppId'),
        Email: localStorage.getItem('Email'),
        ReligionId: this.ddlReligions,
        CompanyId: this.CompanyIdService.CompanyId,
        NationalityId: this.ddlNationalities,
        NativeLanguageId: this.ddlNativeLanguages,
        CurrentSalary: this.txtCurrentSalary,
        CurrentCurrencyId: this.ddlCurrency,
        CurrentSalaryType: this.PerMonthOrYearSalaryDropdown,
        ExpectedSalary: this.txtExpectedSalary,
        ExpectedSalaryTo: this.txtExpectedSalaryTo,
        ExpectedCurrencyId: this.ddlCurrentCurrencyId,
        ExpectedSalaryType: this.PerMonthOrYearSalaryDropdown1,
        JoiningDate: this.ddlWhenCanYouJoin,
        PassportNo: this.dataService.ReplaceApostropheWthTelda(this.txtPassportNo),
        FamilyCardNo: this.dataService.ReplaceApostropheWthTelda(this.txtFamilyCardNo),
        NICNo: this.dataService.ReplaceApostropheWthTelda(this.txtNICNo),
        IdCardRemarks: this.dataService.ReplaceApostropheWthTelda(this.txtIdRemarks),
        //AreaOfInterest: this.txtAreaOfInterest,
        ApplicantEmail: localStorage.getItem('Email'),
        Index: "1"

      }
      this.isCloseEditLbl2_Click()
      this.openSpinner();
      let updateApplicantData = this._config.environment.baseUrl + Constants.UpdateApplicantData;
      this.PostData(RequestObject, updateApplicantData, { headers: this.dataService.headers });
      // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/UpdateApplicantData");


    }
    else {

      this.DisconnectInternet1 = true;
    }
  }



  // update data for Contact Information 1 //

  isMandatoryfieldsContactInfo: boolean = false;
  isMandatoryfieldsContactInfo1: boolean = false;
  UpdateApplicantDataContactInfo_click() {
    if (navigator.onLine) {
      this.isMandatoryfieldsContactInfo = false;
      this.isMandatoryfieldsContactInfo1 = false;

      if (this.txtAddress == "" || isNullOrUndefined(this.txtAddress) || isNullOrUndefined(this.txtTelMobile) || this.txtTelMobile == "") {
        if (this.txtAddress == "" || isNullOrUndefined(this.txtAddress)) {

          this.isMandatoryfieldsContactInfo1 = true;
          this.isBtnHide3 = true;

        }
        if (isNullOrUndefined(this.txtTelMobile) || this.txtTelMobile == "") {

          this.isMandatoryfieldsContactInfo = true;
          this.isBtnHide3 = true;
        }
      }
      else {
        let RequestObject = {

          Appid: localStorage.getItem('AppId'),
          Email: localStorage.getItem('Email'),
          TelOffice: this.dataService.ReplaceApostropheWthTelda(this.txtTelOffice),
          TelMobile: this.dataService.ReplaceApostropheWthTelda(this.txtTelMobile),
          TelRes: this.dataService.ReplaceApostropheWthTelda(this.txtTelRes),
          CompanyId: this.CompanyIdService.CompanyId,
          PermanentAddress: this.dataService.ReplaceApostropheWthTelda(this.txtAddress),
          CountryOfResidenceId: this.selectedCountry,
          CityOfResidenceId: /*this.CitiesByCountryId,*/   /*this.ddlCitiesByCountryId*/   this.selectedCountry == -1 ? '00' : this.ddlCitiesByCountryId,
          ApplicantEmail: localStorage.getItem('Email'),
          Index: "2"

        }
        this.isCloseEditLbl3_Click()
        this.openSpinner();
        let updateApplicantData = this._config.environment.baseUrl + Constants.UpdateApplicantData;
        this.PostData(RequestObject, updateApplicantData, { headers: this.dataService.headers });
        // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/UpdateApplicantData");

      }
    }
    else {

      this.DisconnectInternet = true;
    }

  }


  DisconnectInternet3: boolean = false;
  UpdateApplicantDataSponsorship_click() {
    if (navigator.onLine) {

      let RequestObject = {

        Appid: localStorage.getItem('AppId'),
        Email: localStorage.getItem('Email'),
        SpnsTransferableId: this.SponsorshipTransferableDropdown,
        IqamaNo: this.txtIqamaNumber,
        CompanyId: this.CompanyIdService.CompanyId,
        SpnsContactDetails: this.txtSponsorContactDetail,
        SpnsCountryId: this.selectedCountry,
        SpnsCityId: this.ddlCitiesByCountryId,
        IqamaExpiryHijriDate: this.txtiqamaExpiryDate,
        SpnsTypeId: this.txtSponsorType,
        IqamaProfessionId: this.ddlIqamaProfession,
        SpnsNatureOfBusiness: this.txtSpnsNatureOfBusiness,
        IqamaExpiryGregorianDate: this.txtiqamaExpiryDateGregorian,
        NoOfSpnsChangedOfVisa: this.txtNoOfSpnsChangedOfVisa,
        CurrSpnsName: this.txtCurrSpnsName,
        SpnsCategory: this.ddlSponsorShipCategory,
        ValidDrivingLicenseKSA: this.txtValidDrivingLicenseKSA,

        ApplicantEmail: localStorage.getItem('Email'),
        Index: "3"

      }

      this.openSpinner();
      let updateApplicantData = this._config.environment.baseUrl + Constants.UpdateApplicantData;
      this.PostData(RequestObject, updateApplicantData, { headers: this.dataService.headers });
      // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/UpdateApplicantData");

    }
    else {

      this.DisconnectInternet3 = true;
    }

  }


  DisconnectInternet4: boolean = false;
  UpdateApplicantDataHomeCountryWasVisited_click() {

    if (navigator.onLine) {

      let RequestObject = {

        Appid: localStorage.getItem('AppId'),
        DateEntryKSA: this.txtdateOfEntryinKSA1,
        DateExitKSA: this.txtdateOfExitinKSA1,
        Index: "4"

      }

      this.openSpinner();
      let updateApplicantData = this._config.environment.baseUrl + Constants.UpdateApplicantData;
      this.PostData(RequestObject, updateApplicantData, { headers: this.dataService.headers });
      // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/UpdateApplicantData");

    }
    else {

      this.DisconnectInternet4 = true;
    }

  }

  DisconnectInternet5: boolean = false;

  UpdateApplicantDataLegalHistory_click() {

    if (navigator.onLine) {

      let RequestObject = {

        Appid: localStorage.getItem('AppId'),
        Email: localStorage.getItem('Email'),
        HstOfPersecution: this.dataService.ReplaceApostropheWthTelda(this.txtHstOfPersecution),
        HstOfPenalties: this.dataService.ReplaceApostropheWthTelda(this.txtHstOfPenalties),
        PendingCases: this.dataService.ReplaceApostropheWthTelda(this.txtPendingCases),
        CompanyId: this.CompanyIdService.CompanyId,

        ENTTerminal: "mohammad-ali-khan",
        ApplicantEmail: localStorage.getItem('Email'),
        Index: "5"

      }

      this.openSpinner();
      let updateApplicantData = this._config.environment.baseUrl + Constants.UpdateApplicantData;
      this.PostData(RequestObject, updateApplicantData, { headers: this.dataService.headers });
      // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/UpdateApplicantData");

    }
    else {

      this.DisconnectInternet5 = true;
    }

  }



  // date format change //

  txtpolicyExpiryDate: string = "";
  txtiqamaExpiryDate: string = "";
  txtiqamaExpiryDateGregorian: string = "";
  txtdateOfEntryinKSA1: string = "";
  txtdateOfExitinKSA1: string = "";
  forDateVlaidation;

  datePickerChanged(eventData: any, controlID: string) {

    this.forDateVlaidation = eventData.isValid;
    if (eventData.year === "0000") {
      this.forDateVlaidation = false;
    }

    if (eventData.isValid == true) {

      if (controlID.toLowerCase().trim() == "dateofbirth")
        this.txtDateOB = eventData.date;
      else if (controlID.toLowerCase().trim() == "policyexpirydate1")
        this.txtpolicyExpiryDate = eventData.date;
      else if (controlID.toLowerCase().trim() == "iqamaexpirydate1")
        this.txtiqamaExpiryDate = eventData.date;
      else if (controlID.toLowerCase().trim() == "iqamaexpirydategregorian1")
        this.txtiqamaExpiryDateGregorian = eventData.date;
      else if (controlID.toLowerCase().trim() == "dateofentryinksa1")
        this.txtdateOfEntryinKSA1 = eventData.date;
      else if (controlID.toLowerCase().trim() == "dateofexitinksa1")
        this.txtdateOfExitinKSA1 = eventData.date;
    }
    else {
      if (controlID.toLowerCase().trim() == "dateofbirth")
        this.txtDateOB = "";
      else if (controlID.toLowerCase().trim() == "policyexpirydate1")
        this.txtpolicyExpiryDate = "";
      else if (controlID.toLowerCase().trim() == "iqamaexpirydate1")
        this.txtiqamaExpiryDate = "";
      else if (controlID.toLowerCase().trim() == "iqamaexpirydategregorian1")
        this.txtiqamaExpiryDateGregorian = "";
      else if (controlID.toLowerCase().trim() == "dateofentryinksa1")
        this.txtdateOfEntryinKSA1 = "";
      else if (controlID.toLowerCase().trim() == "dateofexitinksa1")
        this.txtdateOfExitinKSA1 = "";
    }

  }

  Currency1: boolean = false;
  getCurrency() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    let getCurrency = this._config.environment.baseUrl + Constants.GetCurrency;
    this.http.post(getCurrency, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetYears")
      .subscribe((response: any) => {

        this.CurrencyDropdown = response;
        if (!isNullOrUndefined(this.CurrencyDropdown) && this.CurrencyDropdown.length > 0) {

          this.Currency = this.CurrencyDropdown[0].Id;
        }
        this.Currency1 = true;
      }, (error: any) => {
        console.log(error);
      });
  }



  isSaveDataAppear() {

    this.getApplicantData();
  }


  // Personal Attribute Dropdown //

  getPersonalAttributes() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    let getPersonalAttributes = this._config.environment.baseUrl + Constants.GetPersonalAttributes + "?Culture=en-GB";
    this.http.post(getPersonalAttributes, RequestObject, { headers: this.dataService.headers })
      //    this.http.get("https://jobportalapi.azurewebsites.net/GetPersonalAttributes?Culture=en-GB")
      .subscribe((response: any) => {

        this.PersonalAttributesDropdown = response;
        if (!isNullOrUndefined(this.PersonalAttributesDropdown) && this.PersonalAttributesDropdown.length > 0)
          this.PersonalAttribute = this.PersonalAttributesDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }



  PersonalAttribute: any;
  remarksPersAtt: string = "";
  isMandatoryfieldsPers: boolean = false;
  DisconnectInternetPers: boolean = false;
  selectedAttributeId: number = -1;


  SavePersonalAttribute() {
    if (navigator.onLine) {

      let PersonalAttribute = this.PersonalAttributesDropdown.find(x => x.Id == this.PersonalAttribute);
      if (PersonalAttribute.Name == 'N/A') {
        this.isMandatoryfieldsPers = true;
      }
      else {

        let RequestObject = {

          Remarks: this.dataService.ReplaceApostropheWthTelda(this.remarksPersAtt),
          Attributetypeid: this.PersonalAttribute,
          AppId: localStorage.getItem("AppId"),
          Email: localStorage.getItem("Email"),
          PersonalAttributeid: (this.isUpdatePersonalAttribute == true) ? this.selectedAttributeId : 0,
          CompanyId: this.CompanyIdService.CompanyId,
          UserId: localStorage.getItem("Email"),
          Action: this.isUpdatePersonalAttribute ? Action.Update : Action.Insert

        }
        this.openSpinner();
        let savePersonalAttributes = this._config.environment.baseUrl + Constants.SavePersonalAttributes;
        this.PostData(RequestObject, savePersonalAttributes, { headers: this.dataService.headers });
        //this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SavePersonalAttributes");
        $("#myModal11").modal("toggle");

      }
    }
    else {

      this.DisconnectInternetPers = true;
    }
  }

  personalAttributeId: number = -1;
  RemarksPers: string = "";


  onUpdatePersAttr_Click(selectedRow: any) {


    this.isMandatoryfields = false;
    this.isMandatoryfieldsPers = false;
    this.isUpdatePersonalAttribute = true;
    this.selectedAttributeId = selectedRow.PersonalAttributeid;
    this.remarksPersAtt = selectedRow.Remarks;
    this.PersonalAttribute = selectedRow.Attributetypeid;
  }


  AllPersonalAttributes: any;

  getAllPersonalAttributesGrid() {

    this.isUpdatePersonalAttribute = false;

    let RequestObject = {
      ApplicantId: localStorage.getItem("AppId"),
      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }

    this.openSpinner();
    let getAllPersonalAttributes = this._config.environment.baseUrl + Constants.GetAllPersonalAttributes;
    this.http.post(getAllPersonalAttributes, RequestObject, { headers: this.dataService.headers })
      //this.http.post("https://jobportalapi.azurewebsites.net/GetAllPersonalAttributes", RequestObject)
      .subscribe((response: any) => {

        this.AllPersonalAttributes = response;
        this.HideSpinner();
      }, (error: any) => {
        console.log(error);
      });
  }


  updateDataPersAttr(selectedRow: any) {

    if (navigator.onLine) {

      let RequestObject = {

        PersonalAttributeid: selectedRow.PersonalAttributeid,
        AppId: localStorage.getItem("AppId"),
        Email: localStorage.getItem("Email"),
        Action: Action.Update,
      }

      this.openSpinner();
      let getAllPersonalAttributes = this._config.environment.baseUrl + Constants.GetAllPersonalAttributes;
      this.http.post(getAllPersonalAttributes, RequestObject, { headers: this.dataService.headers })
        //this.http.post("https://jobportalapi.azurewebsites.net/GetAllPersonalAttributes", RequestObject)
        .subscribe((response: any) => {

          this.HideSpinner();
          if (!isNullOrUndefined(response) && response.isValid == true) {
            this.getAllPersonalAttributesGrid();


          } else {
            alert("Invalid Data.");
          }
        }, (error: any) => {
          alert(error.error.Message);
        });
    }
    else {

      this.DisconnectInternetPers = true;
    }

  }


  deletePersonalAttribute: any;

  DeletePersAttr(PersonalAttributeid: number) {
    if (this.isAttr == true) {
      this.deltId
      let RequestObject = {
        // ApplicationId: this.ApplicationId,
        // Culture: this.Culture,
        // MPRCode: this.MPRCode,
        // CompanyId: "-1",
        // IsApplicantPicForWeb: this.IsApplicantPicForWeb,
        // IsRequestForMobile: this.IsRequestForMobile,
        AppId: localStorage.getItem("AppId"),
        PersonalAttributeid: PersonalAttributeid

      };

      this.openSpinner();
      let deletePersonalAttributes = this._config.environment.baseUrl + Constants.DeletePersonalAttributes;
      this.http.post(deletePersonalAttributes, RequestObject, { headers: this.dataService.headers })
        // this.http.post("https://jobportalapi.azurewebsites.net/DeletePersonalAttributes", RequestObject)
        .subscribe((response: any) => {

          this.deletePersonalAttribute = response.Data;
          this.getAllPersonalAttributesGrid();
          this.getLastProfileUpdateValue();
          this.HideSpinner();

          // POPUP FOR DELETE //
          if (this.isAttr == true) {

            //this.toastr.success(response.Msg, '', {
            //    positionClass: "toast-bottom-right",
            //});
            $("#videoPopup1").modal('show');
            this.isTick = true;
            this.ApplyJobMsg = response.Msg;
            this.isAttr = false;
            this.popuphide();
          }
        }, (error: any) => {
          console.log(error);
        });
    }
  }

  // Documnet Attachment // 

  // Get Document Attachment Grid //

  DocumentAttachmentGrid: any;

  getDocumentAttachmentGrid() {
    let RequestObject = {

      ApplicantId: localStorage.getItem("AppId"),
      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }
    let getDocumentAttachments = this._config.environment.baseUrl + Constants.GetDocumentAttachments;
    this.http.post(getDocumentAttachments, RequestObject, { headers: this.dataService.headers })

      .subscribe((response: any) => {

        this.DocumentAttachmentGrid = response;

      }, (error: any) => {
        console.log(error);
      });
  }

  // For Saving Document //
  DocumentAttachmentForView: string = '';

  //onNavigate(selectedRow: any) {

  //    this.selectedDocumentId;
  //    this.DocumentAttachmentForView == "";
  //    this.clickRow = false;
  //    if (this.selectedDocumentId != 0){

  //        this.openSpinner();
  //        let RequestObject = {

  //            ApplicantId: localStorage.getItem("AppId"),
  //            Id: this.selectedDocumentId,
  //            CompanyId: this.CompanyIdService.CompanyId,

  //        }
  //        let getDocumentAttachmentView = this._config.environment.baseUrl + Constants.ReadDocumentFromBlob;
  //        this.http.post(getDocumentAttachmentView, RequestObject, { headers: this.dataService.headers })

  //            .subscribe((response: any) => {

  //                this.DocumentAttachmentForView = response;
  //                this.clickRow = true;
  //                this.HideSpinner();
  //                if (!isNullOrUndefined(this.DocumentAttachmentForView) && this.DocumentAttachmentForView != "") {
  //                    window.open(this.DocumentAttachmentForView, "_blank");
  //                }
  //            }, (error: any) => {
  //                console.log(error);
  //            });

  //    }
  //}

  DocCatId: string = "";
  remarksDocument: string = "";
  SubjectDocument: string = "";
  isMandatoryDocument: boolean = false;
  DisconnectInternetDocument: boolean = false;
  MsgForDoc: any;
  SelectAtleastOneFile: boolean = false;
  isFileSizeOfDoc: string = '';
  isFileSizeCheck: boolean = false;
  FileSizeInMbs: any;
  ValidationMsgDocFalse: any;
  ValidationMsgDocFalse1: boolean = false;


  obj: any = {};
  SaveDocument() {
    if (navigator.onLine) {

      let DocCatId = this.DocumentCategoryDropdown.find(x => x.Id == this.DocCatId);
      //this.FileSizeInMbs = this.Filesize / 1048576;


      if (this.remarksDocument == '' || DocCatId.Name == 'N/A') {
        this.isMandatoryDocument = true;
        this.ValidationMsgDocFalse1 = false;
        this.SelectAtleastOneFile = false;
        this.isFileSizeCheck = false;
        return;
      }
      if (this.checkForDocAtt == true) {
        this.SelectAtleastOneFile = true;
        this.isMandatoryDocument = false;
        this.ValidationMsgDocFalse1 = false;
        this.isFileSizeCheck = false;
      }
      //if (this.DocMbs < this.FileSizeInMbs) {
      //    this.isFileSizeCheck = true;
      //    this.isFileSizeOfDoc = this.DocMbs;
      //    this.SelectAtleastOneFile = false;
      //    this.isMandatoryDocument = false;
      //    this.ValidationMsgDocFalse1 = false;
      //    return;
      //}

      else {
        this.blob
        this.uniqueImgName
        this.obj.DocCatId = this.DocCatId;
        this.obj.Id = this.isUpdateDocumentAttach ? this.selectedDocumentId : 0;
        this.obj.Remarks = this.dataService.ReplaceApostropheWthTelda(this.remarksDocument.trim());
        this.obj.Subject = this.dataService.ReplaceApostropheWthTelda(this.SubjectDocument);
        this.obj.CompanyId = this.CompanyIdService.CompanyId;
        this.obj.ENTUser = localStorage.getItem("Email");
        this.obj.Action = this.isUpdateDocumentAttach ? Action.Update : Action.Insert;
        //   this.obj.jpProfileImage = this.blob;
        this.obj.AppId = localStorage.getItem("AppId");

        var json = JSON.stringify(this.obj)
        //alert(this.checkForDocAttWhenupdate)
        const fd = new FormData;
        if (this.checkForDocAttWhenupdate == false) {
          fd.append("jpProfileImage", this.blob, this.uniqueImgName);
        }
        fd.append("Model", json);
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
          var obj1 = JSON.parse(request.response)
          if (request.readyState == 4 && request.status == 200) {
            if (obj1.isValid == true) {
              this.HideSpinner();
              $("#videoPopup1").modal('show');
              this.isTick = true;
              this.ApplyJobMsg = obj1['Msg'];
              this.getDocumentAttachmentGrid();
              this.popuphide();
              $("#myModal10").modal("toggle");

            }

            if (obj1.isValid == false) {
              this.HideSpinner();
              //  $("#videoPopup1").modal('show');
              this.isTick = false;
              this.ValidationMsgDocFalse1 = true;
              this.ValidationMsgDocFalse = obj1['Msg'];
              this.getDocumentAttachmentGrid();
              this.popuphide();
              this.urlFile = '';

              this.SelectAtleastOneFile = false;
              this.isMandatoryDocument = false;
              this.isFileSizeCheck = false;

            }
            //else {
            //    alert("error has been occured while saving data");
            //}
          }
        }


        var saveDocumentAttachment = this._config.environment.baseUrl + Constants.SaveDocumentAttachment;
        request.open("POST", saveDocumentAttachment);
        request.send(fd);
        this.openSpinner();
        //this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SaveDocumentAttachment");


      }
    }
    else {

      this.DisconnectInternetDocument = true;
    }
  }

  // For update Document Attachment //
  selectedDocumentId: number = 0;
  DocumentExtension: string = '';
  checkForDocAttWhenupdate: boolean = false;

  DID: number = 0;

  onUpdateDocumentAtt_Click(selectedRow: any) {

    this.IsNewDocUpload = false;
    this.SelectAtleastOneFile = false
    this.isMandatoryDocument = false;
    this.DisconnectInternetDocument = false;
    this.isUpdateDocumentAttach = true;
    this.selectedDocumentId = selectedRow.Id;
    this.DocCatId = selectedRow.DocCatId;
    this.remarksDocument = selectedRow.Remarks;
    this.SubjectDocument = selectedRow.Subject;
    this.isFileName = selectedRow.DocumentName;
    //this.DocumentExtension = selectedRow.DocumentExtension;
    this.DID = selectedRow.Id;

    if (!isNullOrUndefined(this.isFileName) && this.isFileName != '') {
      this.checkForDocAttWhenupdate = true;
    }

  }

  updateDocumentAttachment(selectedRow: any) {

    if (navigator.onLine) {

      let DocCatId = this.DocumentCategoryDropdown.find(x => x.Id == this.DocCatId);
      if (DocCatId.Name == 'N/A') {
        this.isMandatoryDocument = true;
      }
      let RequestObject = {

        Id: selectedRow.Id,
        AppId: localStorage.getItem("AppId"),
        Email: localStorage.getItem("Email"),
        Action: Action.Update,
      }

      this.openSpinner();
      let UpdateDocumentAttachment = this._config.environment.baseUrl + Constants.SaveDocumentAttachment;
      this.http.post(UpdateDocumentAttachment, RequestObject, { headers: this.dataService.headers })
        .subscribe((response: any) => {

          this.HideSpinner();
          if (!isNullOrUndefined(response) && response.isValid == true) {
            this.getDocumentAttachmentGrid();


          } else {
            alert("Invalid Data.");
          }
        }, (error: any) => {
          alert(error.error.Message);
        });
    }
    else {

      this.DisconnectInternetDocument = true;
    }

  }

  // Delete Document Attachment //

  deleteDocumentData: any;

  DeleteDocument(Id: number) {

    if (this.isDoc == true) {
      this.delDoc
      let RequestObject = {
        AppId: localStorage.getItem("AppId"),
        Id: Id

      };

      this.openSpinner();
      let deleteDocumentAttachment = this._config.environment.baseUrl + Constants.DeleteDocumentAttachment + "?Id=" + Id;
      this.http.post(deleteDocumentAttachment, RequestObject, { headers: this.dataService.headers })
        .subscribe((response: any) => {

          this.deleteDocumentData = response.Data;
          this.getDocumentAttachmentGrid();
          this.getLastProfileUpdateValue();
          this.HideSpinner();

          // POPUP FOR DELETE //
          if (this.isDoc == true) {
            $("#videoPopup1").modal('show');
            this.isTick = true;
            this.ApplyJobMsg = response.Msg;
            this.isDoc = false;
            this.popuphide();
          }
        }, (error: any) => {
          console.log(error);
        });
    }
  }

  getCV() {
    let RequestObject = {
      ApplicantId: localStorage.getItem("AppId")
    }

    let getCVURl = this._config.environment.baseUrl + Constants.GetApplicantCV + "?Culture=en-GB";
    this.http.post(getCVURl, RequestObject, { headers: this.dataService.headers })
      .subscribe((response: any) => {
        this.IsCVShow = response.IsCVShow;
      }, (error: any) => {
        console.log(error);
      });
  }

  // For Upload File in Document Attachment // 
  urlFile: string = '';

  //Save  profile Image to Blob
  SuccessfullyUploaded1: boolean = false;
  jpImgObj1: any;
  updateImg1: boolean = false;
  object1: any;
  checkForDocAtt: boolean = false;
  callSave1: Subject<string> = new Subject<string>();
  SaveDocumentFile() {
    if (this.checkForDocAttWhenupdate == true) {
      this.SaveDocument();
      return
    }
    if (this.urlFile == '' || this.urlFile == "null") {
      this.checkForDocAtt = true;
      this.SaveDocument();
      return;
    }
    else {
      //this.jpImgObj1 = ({ name: this.uniqueImgName, blob: this.blob })
      var block = this.urlFile.split(";");
      // Get the content type of the image
      var contentType = block[0].split(":")[1];
      var extension = contentType.split("/")[1];
      // get the real base64 content of the file
      var realData = block[1].split(",")[1];
      this.blob = this.b64toBlobDoc(realData, contentType);
      this.uniqueImgName = 'Doc-' + new Date().getTime() + "." + extension;
      this.SaveDocument();
    }
  }

  /*  For upload image 1*/
  isCroppingImg1: boolean = false;
  isFileName: string = "";
  Filesize: any;


  onSelectDocFile(event) {

    // called each time file input changes

    this.isCroppingImg1 = true;
    if (event.target.files && event.target.files[0]) {
      this.isFileName = event.target.files[0].name;
      this.Filesize = event.target.files[0].size;
      this.IsNewDocUpload = true;
      var reader: FileReader = new FileReader();
      var self = this;
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.updateImg = true;
      reader.onload = function (loadEvent: any) { // called once readAsDataURL is completed
        self.urlFile = loadEvent.target.result;
      }
    }
  }


  isCVFileName: string = "";
  isCVUpload: boolean = false;
  lblCVValidation: string = "";

  onSelectCVFile(event) {

    // called each time file input changes

    this.isCroppingImg1 = true;
    this.isCVUpload = true;
    if (event.target.files && event.target.files[0]) {
      this.isCVFileName = event.target.files[0].name;
      this.Filesize = event.target.files[0].size;
      var reader: FileReader = new FileReader();
      var self = this;
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.updateImg = true;
      reader.onload = function (loadEvent: any) { // called once readAsDataURL is completed
        self.urlFile = loadEvent.target.result;
      }
    }
  }

  SaveCVFile() {

    if (this.checkForDocAttWhenupdate == true) {
      this.SaveCVAttachment();
      return
    }
    if (this.urlFile == '' || this.urlFile == "null") {
      this.checkForDocAtt = true;
      this.SaveCVAttachment();
      return;
    }
    else {
      //this.jpImgObj1 = ({ name: this.uniqueImgName, blob: this.blob })
      var block = this.urlFile.split(";");
      // Get the content type of the image
      var contentType = block[0].split(":")[1];
      var extension = contentType.split("/")[1];
      // get the real base64 content of the file
      var realData = block[1].split(",")[1];
      this.blob = this.b64toBlobDoc(realData, contentType);
      this.uniqueImgName = 'Doc-' + new Date().getTime() + "." + extension;
      this.SaveCVAttachment();
    }
  }

  SaveCVAttachment() {
    if (navigator.onLine) {
      //alert(this.CompanyIdService.CompanyId)
      //  else {
      this.blob
      this.uniqueImgName
      this.obj.CompanyId = this.CompanyIdService.CompanyId;
      this.obj.Email = localStorage.getItem("Email");
      //this.obj.Action = this.isUpdateDocumentAttach ? Action.Update : Action.Insert;
      //   this.obj.jpProfileImage = this.blob;
      this.obj.AppId = localStorage.getItem("AppId");
      this.obj.Type = 1;

      var json = JSON.stringify(this.obj)

      const fd = new FormData;
      if (this.checkForDocAttWhenupdate == false) {
        fd.append("jpProfileImage", this.blob, this.uniqueImgName);
      }
      fd.append("Model", json);
      const request = new XMLHttpRequest();
      request.onreadystatechange = () => {

        //let obj1 = request.response


        if (request.readyState == 4 && request.status == 200) {
          //myObj["name"]

          var obj1 = JSON.parse(request.response)
          if (obj1["isValid"]) {
            this.HideSpinner();

            this.IsCVShow = true;
            this.isCVUpload = false;
            $("#videoPopup1").modal('show');
            this.ApplyJobMsg = obj1["Msg"];
            this.getLastProfileUpdateValue();
            this.isTick = true;
          }

          if (!obj1["isValid"]) {

            this.HideSpinner();
            //  $("#videoPopup1").modal('show');
            this.isTick = false;
            //this.ValidationMsgDocFalse1 = true;
            this.lblCVValidation = obj1["Msg"];
            //this.getDocumentAttachmentGrid();
            this.popuphide();
            this.urlFile = '';

            this.SelectAtleastOneFile = false;
            this.isMandatoryDocument = false;
            this.isFileSizeCheck = false;
          }

          //else {
          //    alert("error has been occured while saving data");
          //}
        }
      }


      var saveCVAttachment = this._config.environment.baseUrl + Constants.SaveAttachment;
      request.open("POST", saveCVAttachment);
      request.send(fd);
      this.openSpinner();


      //}
    }
    else {

      this.DisconnectInternetDocument = true;
    }
  }

  ViewCV(Type, DocId) {
    if (Type == 2) {
      this.clickRow = false;
    }
    var s = this._config.environment.baseUrl + Constants.GetApplicantDocuments + "?"
      + "AppId=" + localStorage.getItem("AppId")
      + "&Type=" + Type
      + "&DocId=" + DocId
    window.open(s);
  }

  IsCVShow: any;

  DeleteDoc(Type, DocId) {

    if (Type == 2) {
      this.clickRow = false;
    }

    let RequestObject = {
      AppId: localStorage.getItem("AppId"),
      Type: Type,
      DocId: DocId,
      CompanyId: this.CompanyIdService.CompanyId,
    }

    let deleteDocument = this._config.environment.baseUrl + Constants.DeleteApplicantUploadedDoc;
    this.http.post(deleteDocument, RequestObject, { headers: this.dataService.headers })
      .subscribe((response: any) => {

        if (Type == 1 && response.IsValid) {
          this.IsCVShow = false;


          $("#videoPopup1").modal('show');
          this.isTick = true;
          this.ApplyJobMsg = response.Msg;
          this.isfinance = false;

          this.getLastProfileUpdateValue();
        }

        if (Type == 2 && response.IsValid) {
          $("#videoPopup1").modal('show');
          this.isTick = true;
          this.ApplyJobMsg = response.Msg;
          this.isfinance = false;

          this.getDocumentAttachmentGrid();
        }
        //this.DocumentCategoryDropdown = response;
        //if (!isNullOrUndefined(this.DocumentCategoryDropdown) && this.DocumentCategoryDropdown.length > 0)
        //  this.DocumentCategory = this.DocumentCategoryDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }

  b64toBlobDoc(b64Data, contentType) {

    contentType = contentType || '';
    const byteString = window.atob(b64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: contentType });
    return blob;
    //   var sliceSize = sliceSize || 512;

    //   var byteCharacters = atob(b64Data);
    //   var byteArrays = [];

    //   for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    //       var slice = byteCharacters.slice(offset, offset + sliceSize);

    //       var byteNumbers = new Array(slice.length);
    //       for (var i = 0; i < slice.length; i++) {
    //           byteNumbers[i] = slice.charCodeAt(i);
    //       }

    //       var byteArray = new Uint8Array(byteNumbers);

    //       byteArrays.push(byteArray);
    //   }

    //   var blob = new Blob(byteArrays, { type: contentType });
    //   var files = new File(byteArrays, "Files")

    ////   console.log('Before Compress', blob)
    //   return blob;
  }

  //public progress: number;
  //public message: string;
  //public uploadFile = (files) => {
  //    if (files.length === 0) {
  //        return;
  //    }

  //    let fileToUpload = <File>files[0];
  //    const formData = new FormData();
  //    formData.append('file', fileToUpload, fileToUpload.name);
  //    
  //    this.http.post(this._config.environment.baseUrl + Constants.SaveDocumentAttachment, formData, { reportProgress: true, observe: 'events' })
  //        .subscribe(event => {
  //            
  //            //if (event.type === HttpEventType.UploadProgress)
  //            //    this.progress = Math.round(100 * event.loaded / event.total);
  //            //else if (event.type === HttpEventType.Response) {
  //            //    this.message = 'Upload success.';
  //            //    this.onUploadFinished.emit(event.body);
  //            //}
  //        });
  //}



  // Document category // 

  DocumentCategory: string = "";
  DocumentCategoryDropdown: any;


  getDocumentCategory() {
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }

    let getDocumentCategory = this._config.environment.baseUrl + Constants.GetDocumentCategory + "?Culture=en-GB";
    this.http.post(getDocumentCategory, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetDocumentCategory?Culture=en-GB")
      .subscribe((response: any) => {

        this.DocumentCategoryDropdown = response;
        if (!isNullOrUndefined(this.DocumentCategoryDropdown) && this.DocumentCategoryDropdown.length > 0)
          this.DocumentCategory = this.DocumentCategoryDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }


  //Save  profile Image to Blob
  url: string = '';
  blob;
  uniqueImgName;
  ApplyJobMsg: string = "";
  hide: boolean = false;
  SuccessfullyUploaded: boolean = false;
  jpImgObj: any;
  updateImg: boolean = false;
  isTick: boolean = false;
  applicantId: string = "";


  /*  For upload image 1*/
  isCroppingImg: boolean = false;
  isShowVideo: boolean = false;

  Uploadedimage: boolean = false;
  isDeleteHide: boolean = true;
  isView: boolean = false;

  // for Fetch image API //
  ProfileImg: string = "assets/images/defaultProfileImg.png";

  // for delete image //

  IsdeleteImg: string = "";
  isDeleteIcon: boolean = true;
  isImgDeleteSuccessfull: boolean = false;
  tickImage: string = "";

  //isRemoveVideo() {
  //    this.isShowVideo = false;
  //}

  //PopupCloseForVideo() {
  //    $("#videoPopup1").modal('hide');
  //    this.tickImage = "";
  //    this.ApplyJobMsg = "";
  //}

  //ViewVideo() {
  //    this.isShowVideo = true;
  //}

  removeMsg() {
    this.ApplyJobMsg = "";
    this.isTick = false;
  }


  // Responsive mode for video



  // Upload Video om Blob //


  //Save  profile Image to Blob
  url1: string = '';
  //blob;
  //uniqueImgName;
  //ApplyJobMsg: string = "";
  //hide: boolean = false;
  //SuccessfullyUploaded: boolean = false;
  //jpImgObj: any;
  //updateImg: boolean = false;
  //  isTick: boolean = false;
  isvideoSize1: number = 0;
  isvideoSizeForValidation: number = 0;
  // applicantId: string = "";
  ApplyJobMsgForSize: any;
  mrgLfl: boolean = false;

  callSave2: Subject<string> = new Subject<string>();
  SaveJPImgProfile1() {

    this.openSpinner();
    this.isvideoSize1 = this.isvideoSize / 1048576;
    this.isvideoSize1 = Math.round(this.isvideoSize1);
    this.isvideoSizeForValidation = this.CompanyIdService.VideoSize;
    if (this.CompanyIdService.VideoSize < this.isvideoSize1) {
      // $("#videoPopup").modal('show');
      this.isSaveBtnShow = true;
      this.ApplyJobMsgForSize = "Video size cannot exceed maximum length of " + this.isvideoSizeForValidation + " MBs.";
      this.HideSpinner();
      return;
    }
    //this.jpImgObj = ({ name: this.uniqueImgName, blob: this.blob })
    this.ApplyJobMsg = '';
    var block = this.url1.split(";");
    // Get the content type of the image
    var contentType = block[0].split(":")[1];
    var extension = contentType.split("/")[1];
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];
    this.blob = this.b64toBlob(realData, contentType);
    this.uniqueImgName = 'vid-' + new Date().getTime() + "." + extension;
    //alert(this.uniqueImgName )
    const fd = new FormData;
    fd.append("jpProfileImage", this.blob, this.uniqueImgName);
    const request = new XMLHttpRequest();

    request.onreadystatechange = () => {
      var obj = JSON.parse(request.response)

      if (request.readyState == 4 && request.status == 200) {
        if (obj['isValid'] == true) {
          this.HideSpinner();
          $("#videoPopup1").modal('show');
          this.isTick = true;
          this.SuccessfullyUploaded = true;
          this.isDeleteHide = true;
          this.isView = true;
          this.isDeleteIcon = true;
          this.isSaveBtnShow = false;            /*abi k lea for video 07/10/2019*/
          this.isShowVideo = true;
          this.isVideoPlayBtn = true;
          this.mrgLfl = true;
          this.getLastProfileUpdateValue();
          //  this.HideSpinner();
          //this.toastr.success(obj['Msg'], '', {
          //    positionClass: "toast-bottom-right",
          //});
          //this.readFromBlob();
          this.getLastProfileUpdateValue();
          this.ApplyJobMsg = obj['Msg'];
          this.url1 = obj['AppPic'];
          this.popuphide();
          // this.isShowVideo = false;
          //this.readFromBlob();
        }
        //else {
        //    this.HideSpinner();
        //    $("#videoPopup").modal('show');
        //    this.ApplyJobMsg = obj['Msg'];
        //    this.popuphide();
        //}
      }
      this.HideSpinner();
      //this.ApplyJobMsg = obj['Message'];
      //$("#videoPopup").modal('show');
      //this.isTick = false;
      //this.popuphide();
    }
    // request.open("POST", this._config.environment.baseUrl + Constants.UploadImage + "?CompanyId=" + this.CompanyIdService.CompanyId + "&AppId=" + this.applicantId);
    request.open("POST", this._config.environment.baseUrl + Constants.UploadImage + "?CompanyId=" + this.CompanyIdService.CompanyId + "&AppId=" + this.applicantId + "&Identifier=2");
    request.send(fd);
  }

  /*  For upload image 1*/
  //  isCroppingImg: boolean = false;
  isvideoSize: number = 0;
  //  isShowVideo: boolean = false;
  isPlayVideo: boolean = false;
  onSelectFile1(event) {

    // called each time file input changes
    this.isSaveBtnShow = true;
    this.isShowVideo = true;
    this.isCroppingImg = true;
    this.ApplyJobMsg = '';
    this.mrgLfl = false;
    this.isVideoPlayBtn = true;
    if (event.target.files && event.target.files[0]) {
      this.isvideoSize = event.target.files[0].size;
      var reader: FileReader = new FileReader();
      var self = this;

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      //  this.updateImg = true;
      reader.onload = function (loadEvent: any) { // called once readAsDataURL is completed
        self.url1 = loadEvent.target.result;
      }
      //   this.function();
    }
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    var files = new File(byteArrays, "Files")

    //console.log(files)
    return blob;

  }

  isSaveBtnShow;

  //function() {
  //    //this.isShowVideo = true;

  //    $(document).on("change", ".file_multi_video", function (evt) {
  //        var $source = $('#video_here');
  //        $source[0].src = URL.createObjectURL(this.files[0]);
  //        $source.parent()[0].load();

  //    });
  //}
  isVideoPlayBtn: boolean = false;

  playFunc() {


    if (this.input.nativeElement.paused == true) {
      this.isVideoPlayBtn = false;
      this.input.nativeElement.setAttribute('controls', 'controls');
    }
    if (this.input.nativeElement.paused == false) {
      this.isVideoPlayBtn = true;
      this.input.nativeElement.removeAttribute("controls")
    }
    this.input.nativeElement.paused ? this.input.nativeElement.play() : this.input.nativeElement.pause();
    return;


    //if (this.input.nativeElement.paused == true) {
    //    this.isVideoPlayBtn = false;
    //    this.input.nativeElement.setAttribute('controls', 'controls');
    //    this.input.nativeElement.play()
    //    console.log("a", this.input.nativeElement.paused)
    //} else {

    //    this.isVideoPlayBtn = true;
    //    this.input.nativeElement.removeAttribute("controls");
    //    this.input.nativeElement.pause();
    //    console.log("b", this.input.nativeElement.paused)
    //}
  }



  function() {
    console.log("insert Video funtion1")
    //var vid = document.getElementById('myVideo');
    //var vid = $('#myVideo');
    this.input.nativeElement.paused ? this.input.nativeElement.play() : this.input.nativeElement.pause();
    //this.input.nativeElement.play();
    //vid.play()
    //$('video').mediaelementplayer({
    //    alwaysShowControls: true,
    //    videoVolume: 'horizontal',
    //    features: ['playpause', 'progress', 'volume', 'fullscreen']
    //});
  }



  //function1() {

  //    $(document).ready(function () {
  //        $('#video').hover(function () {
  //            $('.play-btn').addClass('hover');
  //            $('#play').addClass('hover');
  //        }, function () {
  //            $('.play-btn').removeClass('hover');
  //            $('#play').removeClass('hover');
  //        });
  //    });

  //}

  isPlayVideoFalse() {

    this.isPlayVideo = false;

  }
  isPlayVideoTrue() {

    this.isPlayVideo = true;
  }

  //isDeleteButton() {
  //    if (this.ProfileImg == "assets/images/defaultProfileImg.png") {
  //        this.isDeleteHide = false;
  //    }
  //    else {
  //        this.isDeleteHide = true;
  //    }
  //}


  //Uploadedimage: boolean = false;
  //isDeleteHide: boolean = true;
  //  isView: boolean = false;

  //// for Fetch image API //
  //ProfileImg: string = "assets/images/defaultProfileImg.png";

  readFromBlob1() {

    let RequestObject = {
      AppId: localStorage.getItem("AppId"),
      CompanyId: this.CompanyIdService.CompanyId,
      Identifier: 2,
    }
    let readFromBlob = this._config.environment.baseUrl + Constants.ReadFromBlob;
    this.http.post(readFromBlob, RequestObject, { headers: this.dataService.headers }).subscribe((response: any) => {

      this.isShowVideo = true;
      this.isVideoPlayBtn = true;
      this.url1 = response;
      //  this.function();
      //   console.log("url", this.url1)
      this.mrgLfl = true;
      this.isView = true;
      this.isDeleteIcon = true;
      if (this.url1 == "null") {
        //this.ProfileImg = "assets/images/defaultProfileImg.png"
        //this.isDeleteHide = false;
        this.isShowVideo = false;
        this.isView = false;
        this.isDeleteIcon = false;
        this.isVideoPlayBtn = false;
        this.mrgLfl = false;
      }
      //this.Uploadedimage = true;

    });
  }

  // for delete image //

  //IsdeleteImg: string = "";
  // isDeleteIcon: boolean = false;
  //isImgDeleteSuccessfull: boolean = false;
  //tickImage: string = "";

  //setId1() {
  //    $("#myModalChangePicture").modal('hide');
  //}



  getDeleteFromBlob11() {

    this.openSpinner();
    let getDeleteFromBlob = this._config.environment.baseUrl + Constants.DeleteFromBlob + "?AppId=" + this.applicantId + "&CompanyId=" + this.CompanyIdService.CompanyId + "&Identifier=2";
    this.http.get(getDeleteFromBlob, { headers: this.dataService.headers }).subscribe((response: any) => {

      this.HideSpinner();
      if (response.IsValid == true) {
        $("#videoPopup1").modal('show');
        this.isTick = true;
        this.isView = false;
        this.isShowVideo = false;
        this.isDeleteIcon = false;
        this.isImgDeleteSuccessfull = true;
        this.ApplyJobMsg = response.Message;
        this.url1 = '';
        this.isVideoPlayBtn = false;
        this.getLastProfileUpdateValue();
        this.mrgLfl = false;
        //this.ProfileImg = "assets/images/defaultProfileImg.png";
      }
      if (response.IsValid == false) {
        this.isShowVideo = true;
        this.isView = true;
        this.isVideoPlayBtn = true;
        this.mrgLfl = true;
      }
      this.popuphide();
    });
  }

  isRemoveVideo() {
    this.isShowVideo = false;
    this.isSaveBtnShow = false;
    this.mrgLfl = false;
    this.isVideoPlayBtn = false
  }

  PopupCloseForVideo() {
    $("#videoPopup4").modal('hide');
    this.tickImage = "";
    this.ApplyJobMsg = "";
  }


  ViewVideo() {
    this.isShowVideo = true;
  }




  // Reset datePicker//

  resetDate() {

    if (!isNullOrUndefined(this.objDatePickerComponent)) {

      for (var i = 0; i <= 0; i++) {
        this.objDatePickerComponent["_results"][i].reset();
      }

    }
  }



}
