import { Component, OnInit, EventEmitter, Output, ViewChildren, QueryList, ViewChild, Input, ChangeDetectorRef  } from '@angular/core';
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
import { SharedDataService } from '@app/Shared/Services/shared-data.service';


import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-personal-info',
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {

  itemId: string | null = null;

  @Input() isFF: boolean;

    //SearchCountryField = SearchCountryField;
    //TooltipLabel = TooltipLabel;
    //CountryISO = CountryISO;
    //preferredCountries: CountryISO[] = [CountryISO.Qatar];
    //phoneForm = new FormGroup({
    //  phone: new FormControl("", [Validators.required])
    //});



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
    isGrid:boolean = true;
    HRLooping: any[3] = [1, 2, 3];
    IsLinkedInLogin: boolean = false;

    isValidIBAN: boolean = false; // IBAN validity flag

    
    public responseData;

    // Newly added 
    idcardexp: string = "";
    DrivingLicenseExp: string = "";

    SelectedKinid: number = -1;
    SelectedRecdepid: number = -1;


    deleteSocialMedia: any;


    socialMediaConnections: any;


    socialMediaConnectionsGrid: any;


  // Nextof Kin 
    nextofkininformationGrid: any;
    KinId: string = "";
    selectedNextofKinId: number = -1;
    deleteNextofKininfo: any;
  
    isUpdateNextofKin: boolean = false;
    isUpdateEducationalDoc: boolean = false;
    isUpdateOtherDoc: boolean = false;



    // Dependents Info 
    DependentsinformationGrid: any;
    Recdepid: string = "";
    selectedDependentsId: number = -1;
    deletedependentsinfo: any;
    isUpdateDependents: boolean = false;


    // Educational Doc
    EducationalDocGrid: any;
    //Recdepid: string = "";
    selectedEducationalDocId: number = -1;
    deletedEducationalGrid: any;
    //isUpdateDependents: boolean = false;


    //// Other Doc
    OtherDocGrid: any;
    //Recdepid: string = "";
    selectedOtherDocId: number = -1;
    deleteOtherDocGrid: any;
    //isUpdateDependents: boolean = false;

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

   // Bank Dropdown  start //

    BankDropdown: any;
    BankdropdownId: string = "";
    BankDropdownName: string = "";
    selectedBank: string = "";
    LabelBankName: string = "";


    combinedbankdropdownvalue: string = "";

    // Bank Dropdown  End //

   // Bloodgroup Dropdown

    GetBloodGroup: any;
    BloodGroup: string = "";


   // Relationship Dropdown

    RelationshipDropdown: any;
    RelationdropdownId: string = "";
    RelationDropdownName: string = "";
    selectedRelationship: string = "";

    //combinedbankdropdownvalue: string = "";


  // End Relationship Dropdown 

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

    // new added for bank information
    ddlBankName: { Name: string; Id: number } = { Name: '', Id: 0 };
    PreviousBankName: number = 0;
    
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
    CNICEXpry: string = "";
    //BloodGroup: string = "";
    DrivingLicenseNo: string = "";
    DrivingLicenseExpiry: string = "";
    LabelDrivingLicenseNo: string = "";
    SpouseName: string = "";
    IsSpouseEmployed: string = "";
    AnyotherSourceofIncome: string = "";
    OtherSourceofIncomeDetail: string = "";
    LabelOtherSourceofIncomeDetail: string = "";
    AnyPhysicalDisability: string = "";
    DisabilityDetail: string = "";
    LabelDisabilityDetail: string = "";
    txtIDCardExpiry: string = "";
    txtDrivingLicenseExpiry: string = "";



    IDCardExpiry11 :string = "";

    newdate: string = "";

    ddlWhenCanYouJoin: any;
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
    DrivingLicenseno: string = "";
    DrivingLicExp: string = "";
    SpouseEmp: string = "";


    //Contact Information

    ResidStatus: string = "";
    
    


    //Bank Information for binding

    
    AccountNoIBAN_No: string = "";
    LabelAccountNoIBAN_No: string = "";
    LabelAccounttitle: string = "";
    Accounttitle: string = "";
    PreviousBankId: number = 0;
    accountEvidenceLabel: string = "Account Evidance";
    accountEvidenceAllowedTypes: string = ".png,.jpg,.jpeg,.doc,.docx,.pdf";
    accountEvidenceSelectedFile: File | null = null;
    accountEvidenceSelectedFileName: string = "";
    accountEvidenceValidationMsg: string = "";
    accountEvidenceTypeId: number = 0;
    accountEvidenceTypeName: string = "";
    accountEvidenceDocCategoryId: number = 0;
    accountEvidenceExistingDocId: number = 0;
    accountEvidenceExistingDocName: string = "";
    accountEvidenceNeedsUpload: boolean = false;

    Branchcode: string = "";
    Bankdropdownid: string = "";

    //Father's Information  for binding

    FatherFullName: string = "";
    FatherPhoneNoCell: string = "";
    FatherOccupation: string = "";
    FatherIDCardNo: string = "";

    LabelFatherFullName: string = "";
    LabelFatherPhoneNoCell: string = "";
    labelFatherOccupation: string = "";
    labelFatherIDCardNo: string = "";


    //Emergency Contact Information for binding

    EmergencyFullName: string = "";
    EmergencyPhoneNoCell: string = "";
    EmergencyRelation: string = "";
    Relationshipdropdownid: string = "";

    LabelEmergencyFullName: string = "";
    LabelEmergencyPhoneNoCell: string = "";


    
    //Conveyance  Information for binding

    Conveyancemake: string = "";
    ConveyanceModal: string = "";
    ConveyanceYear: string = "";
    ConveyancemakeRegNo: string = "";
    isOwnConveyance: string = "";
    ConveyanceType1: string = "";


    LabelConveyancemake: string = "";
    LabelConveyanceModal: string = "";
    LabelConveyanceYear: string = "";
    LabelConveyancemakeRegNo: string = "";

    ApprovalStatus: string = "";
    Company_Name: string = "";

    //-Next Of Kin Informationfor binding

    NextOfKinName: string = "";
    NextOfKinPhonecell: string = "";
    NextOfKinAddress: string = "";

    //Dependents Information for binding

    DepenfirstName: string = "";
    DepenlastName: string = "";
    DependentDateOfBirth: string = "";
    DepenIdCardNo: string = "";

    
    //Educational Documents for binding

    EduDocumentType: string = "";
    DoctypeId: string = "";
    EduDocumentTitle: string = "";
    EduDocFile: string = "";
    EduDocFilename: string = "";

    otherFileInput: string = "";
    //Other Documents for binding

    OtherdocumentTitle: string = "";
    OtherDocumentsType: string = "";
    OtherDocFile: string = "";

    OtherDocFilename: string = "";
    

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
    showFFBankAccountQuestion: boolean = false;
    ffBankAccountChoice: string = 'No';

    isBasicInformation23: boolean = false;
    isBtnHide23: boolean = false;

    isBasicInformation24: boolean = false;
    isBtnHide24: boolean = false;

    isBasicInformation25: boolean = false;
    isBtnHide25: boolean = false;

    showConveyanceFields: boolean = false;


    // Basic Information 1  => label change into text input//
    isBasicInformation1: boolean = false;
    isBtnHide1: boolean = false;



    // Basic Information 2  => label change into text input//
    isBasicInformation2: boolean = false;
    isBtnHide2: boolean = false;
    ShowCnicValidation2: boolean = false;


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
        public ClrThemeChng: ThemeColorService, private dataService: DataService, private cdr: ChangeDetectorRef, private sharedDataService: SharedDataService) {

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


    // Newly added
    deltNextofInfo: any;
    delDependentsinfo: any;
    delEducationalDoc: any;
    delOtherDoc: any;

    isfinance: boolean = false;
    isAttr: boolean = false;
    isInsu: boolean = false;
    isMed: boolean = false;

    // Newly added
    isKin: boolean = false;
    isDependents: boolean = false;
    isEducationalDoc: boolean = false;
    isOtherDoc1: boolean = false;

    isDoc: boolean = false;
    DocId: any;
    type: any;
    DeleteEventIdentifier: number;

    IsNewDocUpload: boolean = true;

    setId(item, identifier,DeleteEventId) {

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


      if (this.DeleteEventIdentifier == 7) {
        if (!isNullOrUndefined(item.KinId)) {
          this.deltNextofInfo = item.KinId;
          this.isKin = true;
        }
      }


      if (this.DeleteEventIdentifier == 8) {
        if (!isNullOrUndefined(item.Recdepid)) {
          this.delDependentsinfo = item.Recdepid;
          this.isDependents = true;
        }
      }

      if (this.DeleteEventIdentifier == 9) {
        if (!isNullOrUndefined(item.AppDocId)) {
          this.delEducationalDoc = item.AppDocId;
          this.isEducationalDoc = true;
        }
      }


      if (this.DeleteEventIdentifier == 10) {
        if (!isNullOrUndefined(item.AppDocId)) {
          this.delOtherDoc = item.AppDocId;
          this.isOtherDoc1 = true;
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

      // Next Of kin 
      if (this.DeleteEventIdentifier == 7) {
        this.getDeleteNextOfkin(this.deltNextofInfo);
      }

      // Dependents info 
      if (this.DeleteEventIdentifier == 8) {
        this.DeleteDependents(this.delDependentsinfo);
      }

      // Educational Doc
      if (this.DeleteEventIdentifier == 9) {
        this.DeleteEducationalDoc(this.delEducationalDoc);
      }

      // Other Doc
      if (this.DeleteEventIdentifier == 10) {
        this.DeleteOtherDocGrid(this.delOtherDoc);
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


    showMandatory1: boolean = false;

    LblchangeToTextBoxInfo1_Click() {
      debugger;
        // Basic Information 1  => label change into text input//

        this.showMandatory1 = true;
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
      debugger;
        this.showMandatory1 = false;
        this.isBasicInformation1 = false;
        this.isBtnHide1 = false;
        this.isMandatoryfields = false;
        this.isMandatoryfieldsbasic1 = false;
        this.forDateVlaidationcity = false;
        this.forDOBValidate = false;
    
    }

    txtAreaOfInterest: string = "";

    LblchangeToTextBoxInfo22_Click() {
      debugger;//Bank Information
      this.isBasicInformation22 = true;
      this.isBtnHide22 = true;
      this.DisconnectInternet1 = false;
      this.showFFBankAccountQuestion = this.isFF === true;
      this.accountEvidenceValidationMsg = "";
      this.accountEvidenceSelectedFile = null;
      this.accountEvidenceSelectedFileName = "";


      this.AccountNoIBAN_No = this.LabelAccountNoIBAN_No;
      this.Accounttitle = this.LabelAccounttitle;
      //this.ddlBankName = (isNullOrUndefined(this.LabelBankName) || this.LabelBankName == '') ? this.BankDropdown[0].id : this.PreviousBankId;

      this.ddlBankName = (isNullOrUndefined(this.BankDropdown) || this.BankDropdown == '') ? this.GetBankDropdown[0] : this.GetBankDropdown.find(bankDropdown => bankDropdown.Name == this.BankDropdown) || null;
      if (this.isFF === true) {
        this.ffBankAccountChoice = this.hasAnyBankInfoData() ? 'Yes' : 'No';
        this.persistFFBankAccountChoiceForValidation();
        this.refreshAccountEvidenceBinding();
      }

      //const selectedBank = this.Bankdropdownid ? this.BankDropdown.find(bank => bank.Id == this.Bankdropdownid) : this.BankDropdown[0];


      //if (selectedBank) {

      //  this.ddlBankName = selectedBank;
      //  this.selectedBank = selectedBank.Name;
      //} else {
      //  // If no bank is found, set the default "N/A" bank
      //  this.ddlBankName = { Name: "N/A", Id: 511 };
      //  this.selectedBank = "N/A"; 
      //}

    
      

    }

    isCloseEditLbl22_Click() {

      this.isBasicInformation22 = false;
      this.isBtnHide22 = false;
      this.showFFBankAccountQuestion = false;
      this.isMandatoryfieldsAnyOne = false;
      this.SelectCurrency = false;
      this.ExpectedRange = false;
      this.isMndBankInfo = false;
      this.isValidIBAN = false;
      this.accountEvidenceValidationMsg = "";
      this.accountEvidenceSelectedFile = null;
      this.accountEvidenceSelectedFileName = "";

    }

    LblchangeToTextBoxInfo23_Click() {    //Father's Information
      this.isBasicInformation23 = true;
      this.isBtnHide23 = true;
      this.DisconnectInternet1 = false;

      this.FatherFullName = this.LabelFatherFullName;
      this.FatherPhoneNoCell = this.LabelFatherPhoneNoCell;
      this.FatherOccupation = this.labelFatherOccupation;
      this.FatherIDCardNo = this.labelFatherIDCardNo;


    }


    isCloseEditLbl23_Click() {

      this.isBasicInformation23 = false;
      this.isBtnHide23 = false;
      this.isMandatoryfieldsAnyOne = false;
      this.SelectCurrency = false;
      this.ExpectedRange = false;
      this.isMndFatherInfo = false;
      this.ShowCnicValidation = false;


    }

    LblchangeToTextBoxInfo24_Click() { // Emergency Contact Information
      debugger;
      this.isBasicInformation24 = true;
      this.isBtnHide24 = true;
      this.DisconnectInternet1 = false;

      this.showPhoneNumberError = false;


      this.EmergencyFullName = this.LabelEmergencyFullName;
      this.EmergencyPhoneNoCell = this.LabelEmergencyPhoneNoCell;


      this.Relationship = (isNullOrUndefined(this.EmergencyRelationDropdown) || this.EmergencyRelationDropdown == '') ? this.RelationshipDropdown[0] : this.RelationshipDropdown.find(R => R.Name == this.EmergencyRelationDropdown) || null;


      //this.Relationship = (isNullOrUndefined(this.EmergencyRelation) || this.EmergencyRelation == '') ? this.relation[0] : this.relation.find(relation => relation.Name == this.EmergencyRelation) || null;

      //const selectedRelationship = this.Relationshipdropdownid
      //  ? this.RelationshipDropdown.find(relation => relation.Id == this.Relationshipdropdownid)
      //  : this.RelationshipDropdown[0];


      ////console.log(selectedRelationship);
      //if (selectedRelationship) {

      //  this.Relationship = selectedRelationship;
      //  this.selectedRelationship = selectedRelationship.Name;
      //}
      //else {
      //  // If no bank is found, set the default "N/A" bank
      //  this.Relationship = { Name: "N/A", Id: "51" };
      //  this.selectedRelationship = "N/A"; // Update the selected bank name
      //}

     

    }



    isCloseEditLbl24_Click() {

      this.isBasicInformation24 = false;
      this.isBtnHide24 = false;
      this.isMandatoryfieldsAnyOne = false;
      this.SelectCurrency = false;
      this.ExpectedRange = false;
      this.isEmergencyContactInfo = false;

    }

    previousConveyance: { Id: boolean, Name: string } | null = null;
    previousConveyanceType: { Id: string, Name: string } | null = null;
    previousConveyancemake: string | null = null;
    previousConveyanceModal: string | null = null;
    previousConveyanceYear: string | null = null;
    previousConveyancemakeRegNo: string | null = null;


    LblchangeToTextBoxInfo25_Click() {  //Conveyance information
      debugger;
      this.isBasicInformation25 = true;
      this.isBtnHide25 = true;
      this.DisconnectInternet1 = false;

      this.selectedConveyance = (isNullOrUndefined(this.isOwnConveyance) || this.isOwnConveyance == '') ? this.ddlConveyance[0] : this.ddlConveyance.find(conveyance => conveyance.Name == this.isOwnConveyance) || null;
      this.selectedConveyanceType = (isNullOrUndefined(this.ConveyanceType1) || this.ConveyanceType1 == '') ? this.conveyanceTypes[0] : this.conveyanceTypes.find(conveyancetype => conveyancetype.Name == this.ConveyanceType1) || null;
      
     
      //// Store the current values before making changes
      this.previousConveyance = this.selectedConveyance;
      this.previousConveyanceType = this.selectedConveyanceType;
      //this.previousConveyancemake = this.Conveyancemake;
      //this.previousConveyanceModal = this.ConveyanceModal;
      //this.previousConveyanceYear = this.ConveyanceYear;
      //this.previousConveyancemakeRegNo = this.ConveyancemakeRegNo;


     

      this.Conveyancemake = this.LabelConveyancemake;
      this.ConveyanceModal = this.LabelConveyanceModal;
      this.ConveyanceYear = this.LabelConveyanceYear;
      this.ConveyancemakeRegNo = this.LabelConveyancemakeRegNo;
      
     
    }


    isCloseEditLbl25_Click() {


    
        const isAnyFieldEmpty = !this.Conveyancemake || !this.ConveyanceModal || !this.ConveyanceYear || !this.ConveyancemakeRegNo;

        if (isAnyFieldEmpty) {
         
          this.selectedConveyance = this.ddlConveyance.find(conveyance => conveyance.Id == false) || null;
        } else {
         
          this.selectedConveyance = this.selectedConveyance;
        }

        
        this.isBasicInformation25 = false;

       
        this.isBtnHide25 = false;
        this.isMandatoryfieldsAnyOne = false;
        this.SelectCurrency = false;
        this.ExpectedRange = false;
        this.isConveyanceInfo = false;
      }


    onFileSelected(event: any) {
      const file: File = event.target.files[0]; // Get the selected file
      // Now you can do something with the file, like sending it to a server or storing it in a variable
      //console.log('Selected file:', file);
    }

    showMandatory2: boolean = false;

    LblchangeToTextBoxInfo2_Click() {
      debugger;
      // Basic Information 2  => label change into text input//

        this.showMandatory2 = true;
        this.isBasicInformation2 = true;
        this.isBtnHide2 = true;
        this.DisconnectInternet1 = false;

        //Newly added
        this.idcardexp = this.getControlDate(this.IDCardExpiry);
        this.DrivingLicenseExp = this.getControlDate(this.DrivingLicenseExpiry);

        this.selectedBloodGroup = (isNullOrUndefined(this.BloodGroup) || this.BloodGroup == '') ? this.GetBloodGroup[0] : this.GetBloodGroup.find(bloodGroup => bloodGroup.Name == this.BloodGroup) || null;
        this.spouseEmployed = (isNullOrUndefined(this.IsSpouseEmployed) || this.IsSpouseEmployed == '') ? this.spouseEmploymentStatuses[0] : this.spouseEmploymentStatuses.find(sp => sp.Name == this.IsSpouseEmployed) || null;
        this.otherIncome = (isNullOrUndefined(this.AnyotherSourceofIncome) || this.AnyotherSourceofIncome == '') ? this.otherIncomeSelect[0] : this.otherIncomeSelect.find(sourceany => sourceany.Name == this.AnyotherSourceofIncome) || null;
        this.DisabilitySelect = (isNullOrUndefined(this.AnyPhysicalDisability) || this.AnyPhysicalDisability == '') ? this.Disability_Select[0] : this.Disability_Select.find(disability => disability.Name == this.AnyPhysicalDisability) || null;

        this.txtNICNo = this.NICNo;
        this.txtIdRemarks = this.IdCardRemarks;
        this.DrivingLicenseNo = this.LabelDrivingLicenseNo;
        this.OtherSourceofIncomeDetail = this.LabelOtherSourceofIncomeDetail;
        this.DisabilityDetail = this.LabelDisabilityDetail;


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


        this.cdr.detectChanges();
    }

    isCloseEditLbl2_Click() {
      debugger;

        this.showMandatory2 = false;
        this.isBasicInformation2 = false;
        this.isBtnHide2 = false;
        this.isMandatoryfieldsAnyOne = false;
        this.SelectCurrency = false;
        this.ExpectedRange = false;
        this.Mandatory = false;
        this.ShowCnicValidation2 = false;

    }

        CountryOfResidence: number = 0;
        CityOfResidence: any;

        ContactInfoMandatory: boolean = false;
    LblchangeToTextBoxInfo3_Click() {
        ;
        // Basic Information 3  => label change into text input//
        this.ContactInfoMandatory = true;
        this.isBasicInformation3 = true;
        this.isBtnHide3 = true;
        this.DisconnectInternet = false;
        this.selectedCountry = (isNullOrUndefined(this.CountryOfResidence)) ? this.CountriesDropdown[0].Id : this.CountryOfResidence1;
        this.getCitiesByCountryIdDropdown();
//      this.ddlCitiesByCountryId = this.selectedCountry == 1 ? this.CitiesDropdown[0].Id : this.CityOfResidence1;
        this.ddlCitiesByCountryId =  this.CityOfResidence1;
        this.txtTelOffice = this.TelOffice;
        this.txtTelMobile = this.TelMobile;
        this.txtTelRes = this.TelRes;
        this.txtAddress = this.Address;

        this.selectedResidentialStatus = (isNullOrUndefined(this.ResidStatus) || this.ResidStatus == '') ? this.residentialStatuses[0] : this.residentialStatuses.find(residential => residential.Name == this.ResidStatus) || null;

    }

    isCloseEditLbl3_Click() {

        this.ContactInfoMandatory = false;
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


              this.sharedDataService.setSocialMediaInfo(this.SocialMediaTypeId, this.SocialMediaId);

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


    btnAdd_Click(item: string): void {
      this.getSocialMediaConnections();
     
        this.SocialMediaMsg1 = false;
        this.SocialMediaMsg = '';

        this.isFileName = "";
        this.isDocCheck = false;
        this.ShowValidation = false;
        this.isUpdate = false;
        this.isUpdatefinancial = false;
        this.isUpdateInsurance = false;
        this.isUpdateNextofKin = false;
        this.isUpdateEducationalDoc = false;
        this.isUpdateOtherDoc = false;

        this.isUpdateDependents = false;
        this.isMandatoryfields = false;
        this.DisconnectInternet = false;
        this.isMandatoryfieldsbasic1 = false;
        this.ShowCnicValidation = false;

        


      // Next of Kin info 

        this.isNextofKin = false;


        this.NextOfKinName = "";
        this.NextOfKinPhonecell = "";
        this.Relationship1 = this.RelationshipDropdown[0] || null;
        this.NextOfKinAddress = "";

        // Dependents info
        this.isDependent = false;

        this.DepenfirstName = "";
        this.DepenlastName = "";
        this.DependentDateOfBirth = "";
        this.DependentDateOfBirth = this.getControlDate(this.DependentDateOfBirth);
        this.selectedGender1 = this.GenderDropdown[0]|| null;
        this.DepenIdCardNo = "";
        this.Relationship2 = this.RelationshipDropdown[0] || null;

        // Educational Doc
        this.isEducational = false;
        this.ShowValidationDocumentType = false;


        this.selectedDocumentType = { DocumentID: "", TypeName: ""};

        //this.EduDocumentTitle = "";
        //this.DocumentType = this.DocumentTypeDropdown.find(doc => doc.Id == '-1') || null;
        this.EduDocumentTitle = "";

        const fileInput = document.getElementById('EducattachmentFileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ''; // Clear the file input
        }


        // Othe rDoc
        this.isOtherDoc = false;

        this.otherDocumentType = this.otherDocumentTypeDropdown.find(doc => doc.Id == '-1') || null;
        
        this.OtherdocumentTitle = "";

        const OtherfileInput = document.getElementById('otherFileInput') as HTMLInputElement;
         if (OtherfileInput) {
          OtherfileInput.value = ''; // Clear the file input
         }


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
      debugger;
 

        if (navigator.onLine) {
            const retVal = this.http.post(url, model,headers)
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
                      if (this.isUpdate == false && this.isUpdatefinancial == false && this.isUpdateInsurance == false && this.isUpdateNextofKin == false && this.isUpdatePersonalAttribute == false && this.isUpdateDocumentAttach == false) {
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
                        this.getnextofkininformationGrid();
                        this.getDependentsinformationGrid();
                        this.getEducationalDocGrid();
                        this.getOtherDocGrid();
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


  

    //--Next Of Kin Information--

    isNextofKin: boolean = false;

    SaveNextofkinInfo() {
      debugger;

      if (navigator.onLine) {

        //let NextOfKinPhonecell = this.nextofkininformationGrid.find(x => x.Id == this.NextOfKinPhonecell);
        if (this.NextOfKinPhonecell.trim() !== "" && !this.validatePhoneNumber(this.NextOfKinPhonecell)) {
          this.showPhoneNumberError = true;
          this.isNextofKin = false;
          return;
        }

        if (this.NextOfKinName.trim() == "" || this.Relationship1 == null || this.Relationship1.Name == "N/A"){
          this.isNextofKin = true;
          this.DisconnectInternet = false;
          return;
        }

        
        else {

         

          this.isNextofKin = false;
          this.DisconnectInternet = false;
        }

        let RequestObject = {

          AppId: localStorage.getItem("AppId"),
          Email: localStorage.getItem("Email"),
          KinId: (this.isUpdateNextofKin == true ) ? this.selectedNextofKinId : 0,
          //KinId: this.KinId,
          Nextofkin: this.NextOfKinName,
          Nextofkincell: this.NextOfKinPhonecell,
          NextofkinAddress: this.NextOfKinAddress,
          NextofkinRelation: this.Relationship1.Id,
          Action: (this.isUpdateNextofKin == true) ? Action.Update : Action.Insert,
          ApplicationID: "string",
          CompanyId: this.CompanyIdService.CompanyId,
          UserId: localStorage.getItem("Email"),

        }

        this.openSpinner();
        let SaveNextofKinDetail = this._config.environment.baseUrl + Constants.SaveNextofKinDetail;
        this.PostData(RequestObject, SaveNextofKinDetail, { headers: this.dataService.headers });
        // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SaveNextofKinDetail");
        $("#myModal21").modal("toggle");
      }

      else {

        this.DisconnectInternet = true;
      }

    }



    selectedNextofKinId1: number = 0;
    updateDataNextofkin(selectedRow: any) {

      if (navigator.onLine) {
        this.selectedNextofKinId1 = selectedRow.NextOfKinId;
        let RequestObject = {
          AppId: localStorage.getItem("AppId"),
          Email: localStorage.getItem("Email"),
          KinId: this.isUpdate ? this.SelectedKinid : 12365,
          Nextofkin: selectedRow.Name,
          Nextofkincell: selectedRow.Mobile,
          NextofkinAddress: selectedRow.Address,
          NextofkinRelation: this.Relationship1,
          ApplicationID: "string",
          CompanyId: this.CompanyIdService.CompanyId,
          UserId: localStorage.getItem("Email"),
          Action: Action.Update,

        }

        this.openSpinner();
        let SaveNextofKinDetail = this._config.environment.baseUrl + Constants.SaveNextofKinDetail;
        this.http.post(SaveNextofKinDetail, RequestObject, { headers: this.dataService.headers })
          //this.http.post("https://jobportalapi.azurewebsites.net/SaveNextofKinDetail", RequestObject)
          .subscribe((response: any) => {

            this.HideSpinner();
            if (!isNullOrUndefined(response) && response.isValid == true) {
              this.getnextofkininformationGrid();


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


    handleEditClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.onUpdateNextOfKin_Click(item);
        this.ForSelectedRowColor5();
      }
    }

    handleDeleteClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.setId(item, 0, 7);
        $('#myModalFordelete').modal('show');
      } else {
       
      }
    }

    handleDeleteDependentClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.setId(item, 0, 8); 
       
        $('#myModalFordelete').modal('show');
      } else {
       
       
      }
    }

    handleDeleteDocumentsClick(item: any): void {
      debugger;
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.setId(item, 0, 9); 
       
        $('#myModalFordelete').modal('show');
      } else {
        
       
      }
    }


    handleFinancialEditClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.onUpdateFinancial_Click(item); 
        this.ForSelectedRowColor1(); 
      } else {
      
       
      }
    }

    handleFinancialDeleteClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.setId(item, 0, 2); 
        $('#myModalFordelete').modal('show');
      } else {
      
       
      }
    }

    handleInsuranceEdit(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.onUpdateInsurance_Click(item);
        this.ForSelectedRowColor(); 
      } else {


      }
    }

    handleInsuranceDeleteClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.setId(item, 0, 3);
        $('#myModalFordelete').modal('show');
      } else {


      }
    }


    handleSocialMediaEdit(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.onUpdate_Click(item);
        this.ForSelectedRowColor2();
      } else {


      }
    }

    handleSocialMediaDeleteClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.setId(item, 0, 4);
        $('#myModalFordelete').modal('show');
      } else {


      }
    }







    onUpdateNextOfKin_Click(selectedRow: any) {

      this.isUpdate = true;
      this.isNextofKin = false;
      this.showPhoneNumberError = false;
      this.isUpdateNextofKin = true;
      this.selectedNextofKinId = selectedRow.KinId; 
      this.NextOfKinName = selectedRow.Name;
      this.NextOfKinPhonecell = selectedRow.Mobile;
      //this.Relationship = selectedRow.Relation;

      // Find the relationship object
      const relation = this.RelationshipDropdown.find(r => r.Id == String(selectedRow.Relation));
      this.Relationship1 = relation || null;
      //console.log(this.Relationship1);

      this.NextOfKinAddress = selectedRow.Address;
    }


    getDeleteNextOfkin(KinId: number) {
      if (this.isKin == true) {
        this.deltNextofInfo

        let RequestObject = {

          // NextkinId: NextkinId
          KinId: KinId,
          AppId: localStorage.getItem("AppId"),
          Email: localStorage.getItem("Email"),

        };
        this.openSpinner();
        let DeleteNextofKinGrid = this._config.environment.baseUrl + Constants.DeleteNextofKinGrid;
        this.http.post(DeleteNextofKinGrid, RequestObject, { headers: this.dataService.headers })
          // this.http.post("https://jobportalapi.azurewebsites.net/DeleteNextofKinGrid", RequestObject)
          .subscribe((response: any) => {

            this.deleteNextofKininfo = response.Data;
            this.getnextofkininformationGrid();
            this.getLastProfileUpdateValue();
            this.HideSpinner();

            if (this.isKin == true) {
              $("#videoPopup1").modal('show');
              this.isTick = true;
              this.ApplyJobMsg = response.Msg;
              this.isKin = false;
              this.popuphide();
            }
          }, (error: any) => {
            console.log(error);
          });
      }
    }


    getnextofkininformationGrid() {

      let RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId,

      }
      this.openSpinner();
      let GetNextofKinGrid = this._config.environment.baseUrl + Constants.GetNextofKinGrid;
      this.http.post(GetNextofKinGrid, RequestObject, { headers: this.dataService.headers })
        //this.http.post("https://jobportalapi.azurewebsites.net/GetNextofKinGrid", RequestObject)
        .subscribe((response: any) => {


        
          this.nextofkininformationGrid = response;
          //console.log(this.nextofkininformationGrid);
          this.HideSpinner();
         

        }, (error: any) => {
          console.log(error);
        });
    }


    getRelationName(Relation: string | null): string {
      try {
        if (this.RelationshipDropdown != null) {
          const relation = this.RelationshipDropdown.find(rkin => rkin.Id == Relation);
          //console.log(relation);
          return relation ? relation.Name : 'N/A';
        }
      } catch (error) {
        console.error('Error occurred while fetching Relationship in Next Of Kin:', error);
        return 'N/A'; // Return 'N/A' if an error occurs
      }

      return 'N/A'; // Fallback return if RelationshipDropdown is null
    }




  // Social Media

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

      var anchor = document.querySelector("#ProfessionalInfo a");
      var event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      anchor.dispatchEvent(event);


      document.querySelector("#move").scrollIntoView();
    }

    GetFF_Value: boolean;

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

            //this.GetFF_Value = response.isFFEnable;          

            //console.log(this.GetFF_Value)

            

            // Check if GetFF_Value is true
            if (this.isFF) {

              this.getJobPortalConfigurationFF();

            } else {
              this.getJobPortalConfiguration1();
            }

            this.getSocialMediaConnections();

           // Newly added 
            this.getnextofkininformationGrid();

            this.getDependentsinformationGrid();

            this.getEducationalDocGrid();

            

            if (this.isFF) {

              this.getDoc_Cat_TypeFF();

            } else {
              this.getDoc_Cat_Type();
            }

            this.getOtherDocGrid();

            this.getsocialMediaConnectionsGrid();

            this.getFinancialDetail();

            this.getInsuranceCompanyDropdown();

            this.getInsurancetypeDropdown();

            //this.getBloodGrups();
            //this.getBankDropdown();
            //this.getRelationDropdown();

            

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

            //this.getApplicantData();

            this.loadDropdownsAndApplicant();

        });
    }

  

    ngOnInit() {
      
      debugger;

      //this.phoneForm.patchValue({
      //  number: "+97431422391",
      //  internationalNumber: "+974 3142 2391",
      //  nationalNumber: "3142 2391",
      //  countryCode: "QA",
      //  dialCode: "+974"
      //});

      this.checkIfMobile();
      // For Instant Hide button after submit the form 
      this.sharedDataService.hideButton$.subscribe(() => {
       
        $('#BasicinfoEdit1').hide();
        $('#BasicinfoEdit2').hide();
        $('#ContactEditButton').hide();
        $('#BankEditButton').hide();
        $('#FatherInfoEdit').hide();
        $('#EmergencyEditButton').hide();
        $('#ConveyanceEditButton').hide();
        $('#NextKinaddButton').hide();
        $('#DependentaddButton').hide();
        $('#CvButton').hide();
        $('#CvButton2').hide();
        $('#EducationaladdButton').hide();
        $('#FinancialaddButton').hide();
        $('#InsuranceaddButton').hide();
        $('#SocialMediaAddButton').hide();

      });
        
         console.log(this.isFF);
     
        this.applicantId = localStorage.getItem('AppId');

        this.getCompanyParameter();
        if (this.GenderDropdown && this.GenderDropdown.length > 0) {
          this.selectedGender = this.GenderDropdown[0];  // Select first index by default
        }
        this.getWhenCanYouJoin();
        this.getCV();
        this.SaveGridViewStyleForInitialload(-1);
        //this.SaveGridViewStyle(-1);

        if (localStorage.getItem("IsLinkedInLogin") === null) {
          this.CompanyIdService.IsLinkedInLogin = "0";
        }
        else
        {
          this.CompanyIdService.IsLinkedInLogin = localStorage.getItem('IsLinkedInLogin');
        }


       

      
    }

    isMobile: boolean = false;

    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;  // Adjust screen width threshold for mobile devices
      //console.log(window.innerWidth);
      //console.log(this.isMobile);
    }
   


    selectedConveyance: { Id: boolean, Name: string } | null = null;
    ddlConveyance = [
      { Id: null, Name: "N/A" },
      { Id: true, Name: "Yes" },
      { Id: false, Name: "No" }
    ];

    Relationship1: { Id: string, Name: string } | null = null;  // Next of kin  info NgModel 
    Relationship2: { Id: string, Name: string } | null = null; // dependents info NgModel 

    Relationship: { Id: string, Name: string } | null = null;

    relation = [

      { Id: "-1", Name: "N/A" },
      { Id: "1", Name: "Father" },
      { Id: "2", Name: "Mother" },
      { Id: "3", Name: "Wife" },
      { Id: "4", Name: "Brother" },
      { Id: "5", Name: "Sister" },
      { Id: "6", Name: "Son" },
      { Id: "7", Name: "Daughter" }
    
      

    ];

    otherIncome: { Id: boolean, Name: string } | null = null;

    otherIncomeSelect = [

      { Id: null, Name: "N/A" },
      { Id: true, Name: "Yes" },
      { Id: false, Name: "No" }


    ];


    selectedGender1: { Id: string, Name: string } | null = null;

    selectedGender: { Id: string, Name: string } | null = null;

    genders = [
      { Id: "-1", Name: "N/A" },
      { Id: "1", Name: "Male" },
      { Id: "2", Name: "Female" },
      { Id: "3", Name: "Other" }
    ];




    DisabilitySelect: { Id: boolean, Name: string } | null = null;

    Disability_Select = [

      { Id: null, Name: "N/A" },
      { Id: true, Name: "Yes" },
      { Id: false, Name: "No" }


    ];

    spouseEmployed: { Id: boolean, Name: string } | null = null;

    spouseEmploymentStatuses = [
      { Id: null, Name: "N/A" },
      { Id: true, Name: "Yes" },
      { Id: false, Name: "No" }
    ];


    selectedBloodGroup: { Id: string, Name: string } | null = null;

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


    selectedResidentialStatus: { Id: string, Name: string } | null;

    residentialStatuses = [
      { Id: "-1", Name: "N/A" },
      { Id: "1", Name: "Own" },
      { Id: "2", Name: "Rent" }
    ];
    selectedConveyanceType: { Id: string, Name: string } | null;
    conveyanceTypes = [
      { Id: "-1", Name: "N/A" },
      { Id: "1", Name: "Bike" },
      { Id: "2", Name: "Car" }

    ];

    selectedBankName: { Id: string, Name: string } | null;

    bankNames = [
      { Id: "-1", Name: "N/A" },
      { Id: "1", Name: "UBL" },
      { Id: "2", Name: "HBL" },
      { Id: "2", Name: "ABL" }

      // Add more banks as needed
    ];

    Selectbranchcode: { Id: string, Name: string } | null;

    branchCodes = [
      { Id: "-1", Name: "N/A" },
      { Id: "1", Name: "0056 -- Bhadrabad" },
      { Id: "2", Name: "0057 -- Nazimabad" },
      { Id: "3", Name: "0000 -- Other" }
    ];

    selectedDocumentType: { DocumentID: any, TypeName: string };


    //DocumentTypeDropdown = [
    //  { Id: "-1", Name: "N/A" },
    //  { Id: "1", Name: 'A-level' },
    //  { Id: "2", Name: 'Matriculation' },
    //  { Id: "3", Name: 'Graduation' }
    //];


    otherDocumentType: { Id: string, Name: string } | null;

    otherDocumentTypeDropdown = [
      { Id: "-1", Name: "N/A" },
      { Id: "1", Name: 'CNIC' },
      { Id: "2", Name: 'Cheque Book' }

    ];

    SaveGridViewStyle(IsNormalView) {
      debugger

      if (IsNormalView == 1)
        localStorage.setItem("IsGridView", "true");//this.ClrThemeChng.IsGridViewShow.emit(true);

      if (IsNormalView == 0)
        localStorage.setItem("IsGridView", "false");//this.ClrThemeChng.IsGridViewShow.emit(false);

      if (!isNullOrUndefined(localStorage.getItem("IsGridView"))) {
        this.isGrid = localStorage.getItem("IsGridView") == "true" ? true : false;
        this.updateProfService.IsGridStyle = this.isGrid;
      }
    }

    SaveGridViewStyleForInitialload(IsNormalView) {
      debugger

      if (this.isMobile) {
        IsNormalView = 0;
      }
      else {
        IsNormalView = 1;
      }

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
     lblContactNoMobile: string = "Phone No. (Cell)";
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
     OtherSourceofIncomeDetails: string = "Other Source of Income Details";
     lblAnyPhysicalDisability: string = "Any Physical Disability?";
     DisabilityDetails: string = "Disability Details";
     

     Bankinformation: string = "Bank Information";
     BankName: string = "Bank Name";
     BranchCode: string = "Branch Code";
     AccountNoIBANNo: string = "IBAN No.";
     AccountTitle1: string = "Account Title";
     FatherInformation: string = "Father Information";
     FullName: string = "Full Name";
     PhoneNoCell: string = "Phone No. (Cell)";
     Occupation: string = "Occupation";
     EmergencyContactInformation: string = "Emergency Contact Information";
     Relation: string = "Relation";
     Conveyanceinformation: string = "Conveyance Information";
     IhavemyownConveyance: string = "I have my own Conveyance";
     ConveyanceType: string = "Conveyance Type";
     Make: string = "Make";
     ConveyModel: string = "Model";
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
       debugger;
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
        //console.log(getSocialMediaConnections);
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


  
  

   


    //--Dependents Information--


    onInputDepen(event: any): void {
      let value = event.target.value;

      // Remove any non-digit characters (just numbers)
      value = value.replace(/\D/g, '');

      // Format the CNIC as ###-#######-#
      if (value.length <= 5) {
        this.DepenIdCardNo = value;
      } else if (value.length <= 12) {
        this.DepenIdCardNo = `${value.slice(0, 5)}-${value.slice(5)}`;
      } else {
        this.DepenIdCardNo = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12, 13)}`;
      }
    }

    isDependent: boolean = false;

    SaveDependentDetail() {
      debugger;
      if (navigator.onLine) {
        if (this.DepenfirstName.trim() == "" || this.DepenlastName.trim() === "" || this.selectedGender1 == null || this.selectedGender1.Name == 'N/A' || this.DepenIdCardNo.trim() == "" || this.Relationship2 == null || this.Relationship2.Name == "N/A" || this.DependentDateOfBirth == '') {
          this.isDependent = true;
          this.DisconnectInternet = false;
          return;
        }

        if (this.DepenIdCardNo.trim() && !this.validateCNIC(this.DepenIdCardNo)) {
          this.ShowCnicValidation = true;
          this.isBtnHide23 = true;
          return;
        }
        else {

          this.sharedDataService.setDependentInfo(this.DepenfirstName,this.DepenlastName,{ Id: this.selectedGender1.Id, Name: this.selectedGender1.Name },this.DepenIdCardNo,{ Id: this.Relationship2.Id, Name: this.Relationship2.Name });

          this.isDependent = false;
          this.DisconnectInternet = false;
        }

        let RequestObject = {

          AppId: localStorage.getItem("AppId"),
          Email: localStorage.getItem("Email"),
          Recdepid: this.isUpdate ? this.selectedDependentsId : 0,

          DependName: this.DepenfirstName,
          DependlastName: this.DepenlastName,
          DependDateOfBirth: this.DependentDateOfBirth,
          DependIdCardNo: this.DepenIdCardNo,
          DependGender: this.selectedGender1.Id,
          DependRelationship: this.Relationship2.Id,

          Action: this.isUpdate ? Action.Update : Action.Insert,
          ApplicationID: "string",
          CompanyId: this.CompanyIdService.CompanyId,
          UserId: localStorage.getItem("Email"),


        }

        this.openSpinner();
        let SaveDependentsDetail = this._config.environment.baseUrl + Constants.SaveDependentsDetail;
        this.PostData(RequestObject, SaveDependentsDetail, { headers: this.dataService.headers });
        // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SaveDependentsDetail");
        $("#myModal22").modal("toggle");
      }

      else {

        this.DisconnectInternet = true;
      }

    }


    handleDependentsClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.onUpdateDependents_Info(item);
        this.ForSelectedRowColor6();
      }
    }


    dateofbirthdependent: string = "";
  // Update Dependents

    depedentsdateofbirth_default: string = "";

    onUpdateDependents_Info(selectedRow: any) {

      this.isUpdate = true;
      this.isDependent = false;
      this.isUpdateDependents = true;
      this.selectedDependentsId = selectedRow.Recdepid;
      this.DepenfirstName = selectedRow.FirstName;
      this.DepenlastName = selectedRow.LastName;
      this.DependentDateOfBirth = selectedRow.DateOfBirth;
      //console.log(selectedRow.DateOfBirth);


      this.depedentsdateofbirth_default = this.getFormattedDateString(this.DependentDateOfBirth);
      //console.log(this.depedentsdateofbirth_default);

      this.dateofbirthdependent = this.getControlDate(this.depedentsdateofbirth_default);
      //console.log(this.dateofbirthdependent);


      this.DepenIdCardNo = selectedRow.NICNo;

      // Find the relationship object
      const Relation_dependent = this.RelationshipDropdown.find(r => r.Id == String(selectedRow.rlnid));
      this.Relationship2 = Relation_dependent || null;


      //console.log(this.Relationship2);


      // Find the Gender  object
      const gender_dependent = this.GenderDropdown.find(g => g.Id == String(selectedRow.gndid));
      this.selectedGender1 = gender_dependent || null;

      //console.log(this.selectedGender1);

    }

  // Get dependents info Grid
  
    getDependentsinformationGrid() {

      let RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId,

      }
      this.openSpinner();
      let GetDependentsGrid = this._config.environment.baseUrl + Constants.GetDependentsGrid;
      this.http.post(GetDependentsGrid, RequestObject, { headers: this.dataService.headers })
        //this.http.post("https://jobportalapi.azurewebsites.net/GetDependentsGrid", RequestObject)
        .subscribe((response: any) => {



          this.DependentsinformationGrid = response;

           //console.log(this.DependentsinformationGrid);

          
          this.HideSpinner();
         

        }, (error: any) => {
          console.log(error);
        });
    }

    getDepentdentRelationName(rlnid: string | null): string {

      //console.log('Looking for relation ID:', rlnid);

      try {
        if (this.RelationshipDropdown != null) {
          const relation = this.RelationshipDropdown.find(r => r.Id == rlnid);
          return relation ? relation.Name : 'N/A';
        }
      } catch (error) {
        console.error('Error occurred while fetching relationship:', error);
        return 'N/A'; // Return 'N/A' if an error occurs
      }
    }

    getDependentGender(gndid: string | null): string {
      try {
        if (this.GenderDropdown != null) {
          const gender = this.GenderDropdown.find(g => g.Id == gndid);
          return gender ? gender.Name : 'N/A';
        }
      } catch (error) {
        console.error('Error occurred while fetching Gender:', error);
        return 'N/A'; // Return 'N/A' if an error occurs
      }
      return 'N/A'; // Fallback return if GenderDropdown is null
    }



  // Delete dependents info

    DeleteDependents(Recdepid: number) {
      if (this.isDependents == true) {
        this.delDependentsinfo

        let RequestObject = {

          // NextkinId: NextkinId
          Recdepid: Recdepid,
          AppId: localStorage.getItem("AppId"),
          Email: localStorage.getItem("Email"),

        };
        this.openSpinner();
        let DeleteDependentsGrid = this._config.environment.baseUrl + Constants.DeleteDependentsGrid;
        this.http.post(DeleteDependentsGrid, RequestObject, { headers: this.dataService.headers })
          // this.http.post("https://jobportalapi.azurewebsites.net/DeleteNextofKinGrid", RequestObject)
          .subscribe((response: any) => {

            this.deletedependentsinfo = response.Data;
            this.getDependentsinformationGrid();
            this.getLastProfileUpdateValue();
            this.HideSpinner();

            if (this.isDependents == true) {
              $("#videoPopup1").modal('show');
              this.isTick = true;
              this.ApplyJobMsg = response.Msg;
              this.isDependents = false;
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
              this.sharedDataService.setFinancialLiabilities(this.AssetDescription);

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

     // New Added.
    // Basic info-2 fields
    VisIDCardExpiry: any;
    VisBloodGroup: any;
    VisDrivingLicenseNo: any;
    VisDrivingLicenseExpiry: any;
    VisIsSpouseEmployed: any;
    VisAnyotherSourceofIncome: any;
    VisAnyPhysicalDisability: any;

    // Contact Info fields
    VisResidentialStatus: any;

    VisBnkInfo: any;
    VisFathersInfo: any;
    VisEmergencyContactInfo: any;
    VisConveyanceInfo: any;
    VisNextOfKin: any;
    VisDependentsInfo: any;
    VisEducationalDoc: any;
    VisOtherDoc: any;

    // End 
  

    VisLegalHistory: any;
    VisPersonalAttributes: any;
    MndIntroductoryVideo: any;
    VisIntroductoryVideo: any;

   
          MndCurrentLastSalary:boolean = false;
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

          // New Added.

          MndIDCardExpiry: boolean = false;
          MndBloodGroup: boolean = false;
          MndDrivingLicenseNo: boolean = false;
          MndDrivingLicenseExpiry: boolean = false;
          MndIsSpouseEmployed: boolean = false;
          MndAnyotherSourceofIncome: boolean = false;
          MndAnyPhysicalDisability: boolean = false;

          MndResidentialStatus: boolean = false;
 
          MndBnkInfo: boolean = false;
          MndFathersInfo: boolean = false;
          MndEmergencyContctInfo: boolean = false;
          MndConveyanceInfo: boolean = false;

          MndEducationalDoc: boolean = false;
          MndOtherDoc: boolean = false;
          MndNextOfKinInfo: boolean = false;
          MndDepndsInfo: boolean = false;
         
          MndDoc: boolean = false;
          DocType: boolean = false;
          //MndNextOfKinInfo: boolean = false;
          //MndDepndsInfo: boolean = false;


   
          MndSocialMediaConnections: boolean = false;
          MndWhenCanYouJoin: boolean = false;
          MndermanentAddress: boolean = false;
          MndCV: boolean = false;

          CVFileTypeAllowed: string = ".png, .jpg, .jpeg, .doc, .docx, .pdf";

    ChangeTheme: any;

    getJobPortalConfiguration1() {
      debugger;

        let RequestObject = {

            CompanyId: this.CompanyIdService.CompanyId,
        };
        let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
        this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
            // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
            .subscribe((response: any) => {
                //console.log("getJobPortalConfiguration ---", response)


                //console.log(response.ThemeColor);

                this.ClrThemeChng.ChangeTheme = response.ThemeColor;
                this.VisFinancialLiabilities = response.VisFinancialLiabilities;
                this.VisExisitingInsuranceDetail = response.VisExisitingInsuranceDetail;
                this.VisSocialMediaConnections = response.VisSocialMediaConnections;
                this.VisDocumentAttachment = response.VisDocumentAttachment;
                this.VisPersonalAttributes = response.VisPersonalAttributes;
                this.MndIntroductoryVideo = response.MndIntroductoryVideo;
                this.VisMaritalStatus = response.VisMaritalStatus;
                this.VisReligion = response.VisReligion;

                // New Added.

                // For Basic Info 2 Fields  
                this.VisIDCardExpiry = response.VisIDCardExpiry;
                this.VisBloodGroup = response.VisBloodGroup;
                this.VisDrivingLicenseNo = response.VisDrivingLicenseNo;
                this.VisDrivingLicenseExpiry = response.VisDrivingLicenseExpiry;
                this.VisIsSpouseEmployed = response.VisIsSpouseEmployed;
                this.VisAnyotherSourceofIncome = response.VisAnyotherSourceofIncome;
                this.VisAnyPhysicalDisability = response.VisAnyPhysicalDisability;

                // Contact Info fields

                this.VisResidentialStatus = response.VisResidentialStatus;


                this.VisBnkInfo = response.VisBnkInfo;
                this.VisFathersInfo = response.VisFathersInfo;
                this.VisEmergencyContactInfo = response.VisEmergencyContactInfo;
                this.VisConveyanceInfo = response.VisConveyanceInfo;
                this.VisNextOfKin = response.VisNextOfKin;
                this.VisDependentsInfo = response.VisDependentsInfo;
                this.VisEducationalDoc = response.VisEducationalDoc;
                this.VisOtherDoc = response.VisOtherDoc;

                // End 

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

                 // New Added.

                this.MndBnkInfo = response.MndBnkInfo;
                this.MndFathersInfo = response.MndFathersInfo;
                this.MndEmergencyContctInfo = response.MndEmergencyContctInfo;
                this.MndConveyanceInfo = response.MndConveyanceInfo;

                this.MndEducationalDoc = response.MndEducationalDoc;
                this.MndOtherDoc = response.MndOtherDoc;
                this.MndNextOfKinInfo = response.MndNextOfKinInfo;
                this.MndDepndsInfo = response.MndDepndsInfo;
              


                //  End

                this.MndSocialMediaConnections = response.MndSocialMediaConnections;
                this.MndWhenCanYouJoin = response.MndWhenCanYouJoin;
                this.MndermanentAddress = response.MndermanentAddress;
                if (response.CVFileTypeAllowed) {
                    this.CVFileTypeAllowed = response.CVFileTypeAllowed;
                }


                this.Color();
               // this.HideSpinner();

            })
    }
  

    getJobPortalConfigurationFF() {
      debugger;

      let RequestObject = {

        CompanyId: this.CompanyIdService.CompanyId,
      };
      let GetJobPortalConfiguration_FF = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration_FF;
      this.http.post(GetJobPortalConfiguration_FF, RequestObject, { headers: this.dataService.headers })
        // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration_FF")
        .subscribe((response: any) => {

          //console.log(response.ThemeColor);
          //console.log("getJobPortalConfiguration ---", response)

          if (response != null && response !== undefined) {

          this.ClrThemeChng.ChangeTheme = response.ThemeColor;
          //console.log(this.ClrThemeChng.ChangeTheme);
          //console.log(response.ThemeColor);

          this.VisFinancialLiabilities = response.VisFinancialLiabilitiesFF;
          this.VisExisitingInsuranceDetail = response.VisExistingInsuranceDetailFF;
          this.VisSocialMediaConnections = response.VisSocialMediaConnectionsFF;
          this.VisDocumentAttachment = response.VisDocumentAttachmentFF;
          this.VisPersonalAttributes = response.VisPersonalAttributesFF;
          this.MndIntroductoryVideo = response.MndIntroductoryVideoFF;
          this.VisMaritalStatus = response.VisMaritalStatusFF;
          this.VisReligion = response.VisReligionFF;

          // New Added

          // For Basic Info 2 Fields
          this.VisIDCardExpiry = response.VisIDCardExpiryFF;
          this.VisBloodGroup = response.VisBloodGroupFF;
          this.VisDrivingLicenseNo = response.VisDrivingLicenseNoFF;
          this.VisDrivingLicenseExpiry = response.VisDrivingLicenseExpiryFF;
          this.VisIsSpouseEmployed = response.VisIsSpouseEmployedFF;
          this.VisAnyotherSourceofIncome = response.VisAnyotherSourceofIncomeFF;
          this.VisAnyPhysicalDisability = response.VisAnyPhysicalDisabilityFF;

          // Contact Info fields
          this.VisResidentialStatus = response.VisResidentialStatusFF;

          this.VisBnkInfo = response.VisBnkInfoFF;
          this.VisFathersInfo = response.VisFathersInfoFF;
          this.VisEmergencyContactInfo = response.VisEmergencyContactInfoFF;
          this.VisConveyanceInfo = response.VisConveyanceInfoFF;
          this.VisNextOfKin = response.VisNextOfKinFF;
          this.VisDependentsInfo = response.VisDependentsInfoFF;
          this.VisEducationalDoc = response.VisEducationalDocFF;
          this.VisOtherDoc = response.VisOtherDocFF;

          this.VisLegalHistory = response.VisLegalHistoryFF;
          this.VisIntroductoryVideo = response.VisIntroductoryVideoFF;

          this.MndCurrentLastSalary = response.MndCurrentLastSalaryFF;
          this.MndCV = response.MndCVFF;
          this.MndDateofBirth = response.MndDateofBirthFF;
          this.MndEmailAddress = response.MndEmailAddressFF;
          this.MndExistingInsuranceDetails = response.MndExistingInsuranceDetailsFF;
          this.MndExpectedSalary = response.MndExpectedSalaryFF;
          this.MndFinancialLiabilities = response.MndFinancialLiabilitiesFF;
          this.MndFirstName = response.MndFirstNameFF;
          this.MndGender = response.MndGenderFF;
          this.MndIDCardNo = response.MndIDCardNoFF;
          this.MndLastName = response.MndLastNameFF;
          this.MndLegalHistory = response.MndLegalHistoryFF;
          this.MndMaritalStatus = response.MndMaritalStatusFF;
          this.MndNationality = response.MndNationalityFF;
          this.MndNativeLanguage = response.MndNativeLanguageFF;
          this.MndPassportNo = response.MndPassportNoFF;
          this.MndPersonalAttributes = response.MndPersonalAttributesFF;
          this.MndPhoneNoCell = response.MndPhoneNoCellFF;
          this.MndReligion = response.MndReligionFF;

          // New Added
          this.MndIDCardExpiry = response.MndIDCardExpiryFF;
          this.MndBloodGroup = response.MndBloodGroupFF;
          this.MndDrivingLicenseNo = response.MndDrivingLicenseNoFF;
          this.MndDrivingLicenseExpiry = response.MndDrivingLicenseExpiryFF;
          this.MndIsSpouseEmployed = response.MndIsSpouseEmployedFF;
          this.MndAnyotherSourceofIncome = response.MndAnyotherSourceofIncomeFF;
          this.MndAnyPhysicalDisability = response.MndAnyPhysicalDisabilityFF;

          //Contact Info
          this.MndResidentialStatus = response.MndResidentialStatusFF;
          //console.log(response.MndResidentialStatusFF);

          //console.log(this.MndResidentialStatus);
          this.MndBnkInfo = response.MndBnkInfoFF;
          this.MndFathersInfo = response.MndFathersInfoFF;
          this.MndEmergencyContctInfo = response.MndEmergencyContctInfoFF;
          this.MndConveyanceInfo = response.MndConveyanceInfoFF;

          this.MndEducationalDoc = response.MndEducationalDocFF;
          this.MndOtherDoc = response.MndOtherDocFF;
          this.MndNextOfKinInfo = response.MndNextOfKinInfoFF;
          this.MndDepndsInfo = response.MndDepndsInfoFF;

          // End

          this.MndSocialMediaConnections = response.MndSocialMediaConnectionsFF;
          this.MndWhenCanYouJoin = response.MndWhenCanYouJoinFF;
          this.MndermanentAddress = response.MndPermanentAddressFF;
          //this.CVFileTypeAllowed = response.CVFileTypeAllowed;

          //console.log(this.MndermanentAddress);


          this.Color();
          // this.HideSpinner();

         } else
          {
            console.log("No data received from the API");

            //this.objRouter.navigate(['/page-not-found']);
          }
            }, (error) => {
            console.error("Error occurred while fetching job portal configuration:", error);
          });
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
              //console.log(response);
              this.ExistingInsuranceDetailGrid = response;
              //console.log(this.ExistingInsuranceDetailGrid);
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

            this.sharedDataService.setInsuranceDetails(this.InsuranceType, this.InsuranceCompany, this.PolicyNumber, this.txtpolicyExpiryDate);


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
      debugger;
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
              //console.log('data : ', response.Data);
              this.ApplicantData = response.Data;
            

                this.HideSpinner();

                const row = response && response.Data && response.Data.length > 0 ? response.Data[0] : null;
                if (!row) {
                  return;
                }

                // Basic information 1 //

                this.Title = row.Title;
                this.FirstName = row.FirstName;
                this.MiddleName = row.MiddleName;
                this.LastName = row.LastName;
                this.Gender = row.Gender;
                this.DateOB = row.DateOB;//this.getDisplayDate(response.Data[0].DateOB);
                //console.log(response.Data[0].DateOB);

                localStorage.setItem("DateOfBirthForProf", this.DateOB)

                this.MaritalStatus = row.MaritalStatus;
                this.CountryOfBirth = row.CountryOfBirth;
            //    console.log("this.CountryOfBirth", this.CountryOfBirth)
                this.CityOfBirth = row.CityOfBirth;

                this.PreviousTitleId = row.TitleId;
                this.PreviousMaritalStatusId = row.MaritalStatusId;
                this.PreviousGenders = row.GenderId;
                this.PreviousCountryOfBirth = row.CountryOfBirthId;
                this.PreviousCitiesByCountryId = row.CityOfBirthId;


                // Basic information 2 //
                this.ExpectedSalary = row.ExpectedSalary;
                this.CurrentSalary = row.CurrentSalary;
                this.Religion = row.Religion;
                this.PassportNo = row.PassportNo;
                this.Nationality = row.Nationality;
                this.NativeLanguage = row.NativeLanguage;
                this.FamilyCardNo = row.FamilyCardNo;
                this.NICNo = row.NICNo;
                this.JoiningDate = row.JoiningDate;
                this.ExpectedSalaryTo = row.ExpectedSalaryTo;
                this.CurrentCurrency = row.CurrentCurrency;
                this.ExpectedSalaryType = row.ExpectedSalaryType;
                this.CurrentSalaryType = row.CurrentSalaryType;
                this.ExpectedSalaryTypeName = row.ExpectedSalaryTypeName;
                this.CurrentSalaryTypeName = row.CurrentSalaryTypeName;
                this.IdCardRemarks = row.IdCardRemarks;
                //this.AreaOfInterest = row.AreaOfInterest;
                this.ExpectedCurrencyId = row.ExpectedCurrencyId;

                this.PreviousReligions = row.ReligionId;
                this.PreviousNationalities = row.NationalityId;
                this.PreviousNativeLanguages = row.NativeLanguageId;
                this.PreviousWhenCanYouJoin = row.JoiningDate;
                this.PreviousCurrency = row.CurrencyId;
                this.PreviousExpectedSalaryTo = row.ExpectedSalaryTo;
                this.PreviousCurrentCurrencyId = row.CurrentCurrencyId;
                this.PreviousExpectedCurrency = row.ExpectedCurrencyId;

                this.CurrentCurrency = row.CurrentCurrency;
                this.ExpectedCurrency = row.ExpectedCurrency;

                // Newly added
                //this.CNICEXpry = response.Data[0].CNICExpDate;
                //console.log(this.CNICEXpry);

                this.IDCardExpiry = this.getFormattedDateString(row.CNICExpiryDate);
                //console.log(this.IDCardExpiry);

                this.DrivingLicenseExpiry = this.getFormattedDateString(row.DrivingLicenseExpiryDate);
               //console.log(row.DrivingLicenseExpiryDate);

                const bloodGroup = this.GetBloodGroup.find(r => r.Id == row.bldId);
                this.BloodGroup = bloodGroup ? bloodGroup.Name : 'N/A';

                //this.BloodGroup = this.bloodGroups.find(r => r.Id == row.bldId).Name;//this.BloodGroup = row.bldId;
                this.LabelDrivingLicenseNo = row.DrivingLicenseNo;
                this.IsSpouseEmployed = (this.spouseEmploymentStatuses.find(sp => sp.Id == row.isSpouseEmployed) || { Name: 'N/A' }).Name;//this.IsSpouseEmployed = row.isSpouseEmployed;
                this.AnyotherSourceofIncome = (this.otherIncomeSelect.find(a => a.Id == row.isAnyOtherIncomeSource) || { Name: 'N/A' }).Name; //this.AnyotherSourceofIncome = row.isAnyOtherIncomeSource;
                this.LabelOtherSourceofIncomeDetail = row.OtherIncomeSourceDetails;


                const selectedIncome = this.otherIncomeSelect.find(a => a.Id == row.isAnyOtherIncomeSource) || { Name: 'N/A' };

                if (selectedIncome.Name.toLowerCase() == 'yes') {
                  this.otherIncome = { Id: true, Name: selectedIncome.Name };
                } else {
                  this.otherIncome = { Id: false, Name: selectedIncome.Name || '' };
                }


                this.AnyPhysicalDisability = (this.Disability_Select.find(d => d.Id == row.isAnyPhysicalDisability) || { Name: 'N/A' }).Name; //this.AnyPhysicalDisability = row.isAnyPhysicalDisability;
                this.LabelDisabilityDetail = row.PhysicalDisabilityDetails;

                const SelectedDisability = this.Disability_Select.find(a => a.Id == row.isAnyPhysicalDisability) || { Name: 'N/A' };
                if (SelectedDisability.Name.toLowerCase() == 'yes') {
                  this.DisabilitySelect = { Id: true, Name: SelectedDisability.Name };
                } else {
                  this.DisabilitySelect = { Id: false, Name: SelectedDisability.Name || '' };
                }
                
                 


                // Basic information 3 // (Contact information)
                this.TelMobile = row.TelMobile;
                this.Address = row.Address;
                this.TelRes = row.TelRes;
                this.TelOffice = row.TelOffice;
                this.CountryOfResidence = row.CountryOfResidence;
                this.CityOfResidence = row.CityOfResidence;
                this.CountryOfResidence1 = row.CountryOfResidenceId;
                this.CityOfResidence1 = row.CityOfResidenceId;
                this.Age = row.Age;
                this.Email = row.Email;
                // Newly added

                //this.ResidStatus = this.residentialStatuses.find(r => r.Id == response.Data[0].ResidStatus).Name;//this.ResidStatus = response.Data[0].ResidStatus;
               
                const residentialStatus = this.residentialStatuses.find(r => r.Id == row.ResidStatus);
                this.ResidStatus = residentialStatus ? residentialStatus.Name : 'N/A';



                // Bank Information

                this.LabelAccountNoIBAN_No = row.AccountNo;
                this.LabelAccounttitle = row.PayeeName;

                //const Bankdropdownid = this.BankDropdown.find(r => r.Id == response.Data[0].bnkid);
                //this.ddlBankName.Name = Bankdropdownid ? Bankdropdownid.Name : 'N/A';

                //this.Bankdropdownid = response.Data[0].bnkid;

                const BankDropdown = this.GetBankDropdown.find(r => r.Id == row.bnkid);
                this.BankDropdown = BankDropdown ? BankDropdown.Name : 'N/A';
                if (this.isFF === true) {
                  this.ffBankAccountChoice = this.hasAnyBankInfoData() ? 'Yes' : 'No';
                  this.persistFFBankAccountChoiceForValidation();
                }

                //this.PreviousBankId = response.Data[0].bnkid;


                //console.log(this.Bankdropdownid);
               
               
                //console.log("Name h ys Id : ", this.selectedBank);


                //const selectedBank = this.BankDropdown.find(bank => bank.Id == this.Bankdropdownid);

                //console.log(selectedBank);


                //this.Branchcode = response.data[0].bnkbrnId;
               



               // Father's Information

                this.LabelFatherFullName = row.FatherfullName;
                this.LabelFatherPhoneNoCell = row.FatherPhoCell;
                this.labelFatherOccupation = row.FatherOccup;
                this.labelFatherIDCardNo = row.FatherIdcard;

               // Emergency Contact Information


                this.LabelEmergencyFullName = row.EmergencyName;
                this.LabelEmergencyPhoneNoCell = row.EmergencyPhone;
                //this.EmergencyRelation = this.relation.find(r => r.Id == response.Data[0].EmergencyRelationship).Name; //this.EmergencyRelation = response.Data[0].RelId;

                const EmergencyDropDown = this.RelationshipDropdown.find(r => r.Id == row.EmergencyRelationship);
                this.EmergencyRelationDropdown = EmergencyDropDown ? EmergencyDropDown.Name : 'N/A';

                //this.Relationshipdropdownid = response.Data[0].EmergencyRelationship;


               // Conveyance Information

                
                this.isOwnConveyance = (this.ddlConveyance.find(conveyance => conveyance.Id == row.Conveyance) || { Name: 'N/A' }).Name;//this.isOwnConveyance = row.Conveyance;
                //this.ConveyanceType1 = response.Data[0].ConveyanceType;

                const SelectedConveyance = this.ddlConveyance.find(a => a.Id == row.Conveyance) || { Name: 'N/A' };

                if (SelectedConveyance.Name.toLowerCase() == 'yes') {
                  this.selectedConveyance = { Id: true, Name: SelectedConveyance.Name };
                } else {
                  this.selectedConveyance = { Id: false, Name: SelectedConveyance.Name || '' };
                }

                this.ConveyanceType1 = (this.conveyanceTypes.find(conveyancetype => conveyancetype.Id == row.ConveyanceType) || { Name: "N/A" }).Name;


                this.LabelConveyancemake = row.ConveyanceMake;
                this.LabelConveyanceModal = row.ConveyModal;
                this.LabelConveyanceYear = row.ConveyYear;
                this.LabelConveyancemakeRegNo = row.ConveyRegNo;

                this.Company_Name = row.CompanyShortName;
                this.ApprovalStatus = row.ApprovalStatus || null;

                //console.log(this.ApprovalStatus);


                // Basic information 4 //

                this.IqamaNumber = row.IqamaNo;
                this.SponsorContactDetail = row.SpnsContactDetails;
                this.IqamaExpiryHijri = this.getDisplayDate(row.IqamaExpiryHijri);
                this.NoOfSpnsChangedOfVisa = row.NoOfSpnsChangedOfVisa;
                this.SponsorType = row.SpnsType;
                this.SpnsNatureOfBusiness = row.SpnsNatureOfBusiness;
                this.IqamaExpiryGregorian = this.getDisplayDate(row.IqamaExpiryGregorian);
                this.CurrSpnsName = row.CurrSpnsName;
                this.SpnsCategory = row.SpnsCategory;
                this.IqamaProfession = row.IqamaProfession;
                this.SpnsTransferable1 = row.SpnsTransferable;
                this.SpnsCity = row.SpnsCity;
                this.SpnsCountry = row.SpnsCountry;

                this.PreviousSponsorType = row.SpnsTypeId;
                this.PreviousSpnsCategoryId = row.SpnsCategoryId;
                this.PreviousIqamaProfession = row.IqamaProfessionId;


                //Basic Information 5 //

                this.ValidDrivingLicenseKSA = row.ValidDrivingLicenseKSAText;
                this.DateOfEntryInKSA = this.getDisplayDate(row.DOEntryKSA);
                this.DateOfExitInKSA = this.getDisplayDate(row.DOExitKSA);

                //Basic Information 6 //

                this.HstOfPersecution = row.HstOfPersecution;
                this.HstOfPenalties = row.HstOfPenalties;
                this.PendingCases = row.PendingCases;
                this.Username = row.Username;

                this.GiveLblToDshboard();

            }, (error: any) => {

                console.log(error);
            });
    }


    EmergencyRelationDropdown: any;
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

    GetBankDropdown: any;

    // Bank Dropdown //

    //getBankDropdown() {

    //  let RequestObject = {

    //    Culture: Constants.Culture,
    //    CompanyId: this.CompanyIdService.CompanyId,

    //  }

    //  let getBankDropdown = this._config.environment.baseUrl + Constants.GetBankDropdown + "?Culture=" + Constants.Culture;
    //  this.http.post(getBankDropdown, RequestObject, { headers: this.dataService.headers })
    //    //  this.http.get("https://jobportalapi.azurewebsites.net/GetBankDropdown?Culture=en-GB")
    //    .subscribe((response: any) => {

    //      //console.log("bank Response:", response);

    //      this.GetBankDropdown = response;

    //      //if (!isNullOrUndefined(this.BankDropdown) && this.BankDropdown.length > 0)
    //      //  this.BankdropdownId = this.BankDropdown[0].Id;
    //      //  this.BankDropdownName = this.BankDropdown[0].Name;

    //      //  setTimeout(() => {
    //      //    const selectedBank = this.BankDropdown.find(bank => bank.Id == this.BankDropdown);

    //      //    if (selectedBank) {
    //      //      this.selectedBank = selectedBank.Name;
    //      //    } else {
    //      //      this.selectedBank = 'N/A'; // Handle case where no bank is found
    //      //    }
    //      //  }, 1000);

    //        // Log the selected bank for debugging
    //        //console.log("Selected Bank:", this.selectedBank);

    //    }, (error: any) => {
    //      console.log(error);
    //    });
    //}



    //// Relationship Dropdown //

    //getRelationDropdown() {

    //  let RequestObject = {

    //    Culture: Constants.Culture,
    //    CompanyId: this.CompanyIdService.CompanyId,

    //  }

    //  let getRelationshipDropdown = this._config.environment.baseUrl + Constants.GetRelationshipDropdown + "?Culture=" + Constants.Culture;
    //  this.http.post(getRelationshipDropdown, RequestObject, { headers: this.dataService.headers })
    //    //  this.http.get("https://jobportalapi.azurewebsites.net/GetRelationshipDropdown?Culture=en-GB")
    //    .subscribe((response: any) => {

    //      //console.log("bank Response:", response);

    //      this.RelationshipDropdown = response;
    //      //console.log("Selected Relationship:", this.RelationshipDropdown);


    //      //if (!isNullOrUndefined(this.RelationshipDropdown) && this.RelationshipDropdown.length > 0)
    //      //  this.RelationdropdownId = this.RelationshipDropdown[0].Id;
    //      //this.RelationDropdownName = this.RelationshipDropdown[0].Name;

    //      //setTimeout(() => {
    //      //  const selectedRelationship = this.RelationshipDropdown.find(Relation => Relation.Id == this.Relationshipdropdownid);

    //      //  if (selectedRelationship) {
    //      //    this.selectedRelationship = selectedRelationship.Name;
    //      // } else {
    //      //    this.selectedRelationship = 'N/A '; 
    //      // }
    //      //}, 1000);


    //    }, (error: any) => {
    //      console.log(error);
    //    });
    //}

    // Gender Dropdown //

    getGenderDropdown() {
      debugger;
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

    

    //getBloodGrups() {
    //  let RequestObject = {

    //    Culture: Constants.Culture,
    //    CompanyId: this.CompanyIdService.CompanyId,

    //  }

    //  let GetBloodGroup = this._config.environment.baseUrl + Constants.GetBloodGroup + "?Culture=" + Constants.Culture;
    //  this.http.post(GetBloodGroup, RequestObject, { headers: this.dataService.headers })
    //    //  this.http.get("https://jobportalapi.azurewebsites.net/getBloodGroup?Culture=en-GB")
    //    .subscribe((response: any) => {

    //      this.GetBloodGroup = response;
    //      //console.log(this.GetBloodGroup);

    //      if (!isNullOrUndefined(this.GetBloodGroup) && this.GetBloodGroup.length > 0)
    //        this.BloodGroup = this.GetBloodGroup[0].Id;


    //    }, (error: any) => {
    //      console.log(error);
    //    });
    //}


    getBloodGrups(): Observable<any[]> {
      const RequestObject = {
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId
      };
      const url = this._config.environment.baseUrl + Constants.GetBloodGroup + "?Culture=" + Constants.Culture;

      return this.http.post<any[]>(url, RequestObject, { headers: this.dataService.headers });
    }

    //getBloodGrups(): Observable<any[]> {
    //  const RequestObject = { Culture: Constants.Culture, CompanyId: this.CompanyIdService.CompanyId };
    //  const url = this._config.environment.baseUrl + Constants.GetBloodGroup + "?Culture=" + Constants.Culture;
    //  return this.http.post<any[]>(url, RequestObject, { headers: this.dataService.headers });
    //}

    getBankDropdown(): Observable<any[]> {
      const RequestObject = { Culture: Constants.Culture, CompanyId: this.CompanyIdService.CompanyId };
      const url = this._config.environment.baseUrl + Constants.GetBankDropdown + "?Culture=" + Constants.Culture;
      return this.http.post<any[]>(url, RequestObject, { headers: this.dataService.headers });
    }

    getRelationDropdown(): Observable<any[]> {
      const RequestObject = { Culture: Constants.Culture, CompanyId: this.CompanyIdService.CompanyId };
      const url = this._config.environment.baseUrl + Constants.GetRelationshipDropdown + "?Culture=" + Constants.Culture;
      return this.http.post<any[]>(url, RequestObject, { headers: this.dataService.headers });
    }

    loadDropdownsAndApplicant() {
      this.openSpinner();

      this.getBloodGrups().subscribe({
        next: (blood) => {
          this.GetBloodGroup = blood || [];

          this.getBankDropdown().subscribe({
            next: (banks) => {
              this.GetBankDropdown = banks || [];

              this.getRelationDropdown().subscribe({
                next: (relations) => {
                  this.RelationshipDropdown = relations || [];

                  // ✅ All dropdowns loaded, now safe to call applicant data
                  this.getApplicantData();
                },
                error: (err) => console.error('Error loading Relations', err)
              });
            },
            error: (err) => console.error('Error loading Banks', err)
          });
        },
        error: (err) => console.error('Error loading Blood Groups', err)
      });
    }


    //loadBloodGroupAndApplicant() {
    //  this.openSpinner();

    //  this.getBloodGrups().subscribe({
    //    next: (res) => {
    //      this.GetBloodGroup = res || [];
    //      // Now BloodGroup dropdown is ready, safe to get applicant data
    //      this.getApplicantData();
    //    },
    //    error: (err) => {
    //      console.error('Error loading Blood Group', err);
    //      this.getApplicantData(); // optional: still call applicant data even if error
    //    },
    //    complete: () => this.HideSpinner()
    //  });
    //}



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
        let RequestObject = {

            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId,

        }
    
        let getCitiesByCountryId = this._config.environment.baseUrl + Constants.GetCitiesByCountryId + "?CountryId=" + this.selectedCountry;
        this.http.post(getCitiesByCountryId, RequestObject, { headers: this.dataService.headers })
            //  this.http.get("https://jobportalapi.azurewebsites.net/GetCitiesByCountryId?CountryId=en-GB")
            .subscribe((response: any) => {
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
        if (this.clickRow == false){
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

    ForSelectedRowColor5() {

      this.btnAdd_Click1();
      if (this.clickRow == false) {
        $('#myModal21').modal('hide');
        this.clickRow = true;
      }
      else {
        $('#myModal21').modal('show');
        $("tbody tr").click(function () {
          $(this).addClass('selected').siblings().removeClass("selected");
        });
      }
    }


    ForSelectedRowColor6() {

      this.btnAdd_Click1();
      if (this.clickRow == false) {
        $('#myModal22').modal('hide');
        this.clickRow = true;
      }
      else {
        $('#myModal22').modal('show');
        $("tbody tr").click(function () {
          $(this).addClass('selected').siblings().removeClass("selected");
        });
      }
    }


    ForSelectedRowColor7(item) {
   if (item.ExtDocCatId == '55964') {
        var i = 0;
      }
      if (item.ExtDocCatId == '55968') {
        var i = 1;
      }
      if (item.ExtDocCatId == '55967') {
        var i = 2;
      }
      if (item.ExtDocCatId == '55969') {
        var i = 3;
      }
      
      this.btnAdd_Click1();

      const modalId = '#myModal222' + i ;  

      if (!this.clickRow) {
        $(modalId).modal('hide'); 
        this.clickRow = true;
      } else {
        $(modalId).modal('show');  

       
        $("tbody tr").off('click').on('click', function () {
          $(this).addClass('selected').siblings().removeClass("selected");
        });
      }
    }




    ForSelectedRowColor8() {

      this.btnAdd_Click1();
      if (this.clickRow == false) {
        $('#myModal223').modal('hide');
        this.clickRow = true;
      }
      else {
        $('#myModal223').modal('show');
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

    getFormattedDate(dateString: string | null): string {
      if (dateString == null || String(dateString).trim() === '') {
        return '';
      }

      // Convert the input string to a Date object
      const dateObj = new Date(dateString);

      // Check if the Date object is valid
      if (isNaN(dateObj.getTime())) {
        return ''; // Return empty string if date is invalid
      }

      // Define an array of month abbreviations
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      // Extract the day, month, and year from the Date object
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = monthNames[dateObj.getMonth()];
      const year = dateObj.getFullYear();

      // Construct the desired date format
      return `${day}/${month}/${year}`;
    }

    getFormattedDateString(dateString: string | null): string {
      if (dateString == null || String(dateString).trim() === '') {
        return '';
      }

      // Convert the input string to a Date object
      const dateObj = new Date(dateString);

      // Check if the Date object is valid
      if (isNaN(dateObj.getTime())) {
        return ''; // Return empty string if date is invalid
      }

      // Define an array of month abbreviations
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      // Extract the day, month, and year from the Date object
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = monthNames[dateObj.getMonth()];
      const year = dateObj.getFullYear();

      // Construct the desired date format
      return `${day}/${month}/${year}`;
    }

   

    formatDateString(ds: string): string {
        var months = {
          Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
          Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
        };
        var b = ds.split('/');
        return b[2] + '-' + months[b[1]] + '-' + b[0] + ' 00:00:00';
      }

    getControlDate(_date: string | null): string {
      
      // Return an empty string if the input date is null or empty
      if (!_date) {
        return '';
      }

      // Convert the input string to a Date object
      const formattedDate = this.formatDateString(_date);
      const objDate = new Date(formattedDate);

      // Check if the Date object is valid
      if (isNaN(objDate.getTime())) {
        return ''; // Return an empty string if the date is invalid
      }

      // Extract the day, month, and year from the Date object
      const day = objDate.getDate().toString().padStart(2, '0'); // Ensure day is two digits
      const month = (objDate.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is two digits
      const year = objDate.getFullYear();

      // Construct the desired date format
      return `${day}-${month}-${year}`;
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
    forDOBValidate: boolean = false;
    SDWId: number = 0;

    forDateVlaidationcity1: boolean = false;
    // update data for Basic Information 1 //
    UpdateApplicantDataBasicInformation1_click() {
      debugger;
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
            //if (this.DOBValidate == true) {
            //  this.forDOBValidate = true;
            //  return;
            //}

            else {

              this.sharedDataService.setBasicInfo1(this.txtFirstrName, this.txtLastName, this.txtDateOB);

                this.isMandatoryfields = false;
                this.forDateVlaidationcity1 = false;

                let selectedGender = this.ddlGenders;

                let selectedGenderObj = this.GenderDropdown.find(gender => gender.Id === selectedGender);

                if (selectedGenderObj) {
                  if (selectedGenderObj.Name === "Male") {
                    this.SDWId = 0; 
                  } else if (selectedGenderObj.Name === "Female") {
                    this.SDWId = 1; 
                  } else {
                    this.SDWId = 0;  
                  }
                } else {
                  this.SDWId = 0;  
                }

                console.log(this.SDWId);

                let RequestObject = {

                    Appid: localStorage.getItem('AppId'),
                    Email: localStorage.getItem('Email'),
                    FirstName: this.dataService.ReplaceApostropheWthTelda(this.txtFirstrName),
                    MiddleName: this.dataService.ReplaceApostropheWthTelda(this.txtMiddleName),
                    LastName: this.dataService.ReplaceApostropheWthTelda(this.txtLastName),
                    CompanyId: this.CompanyIdService.CompanyId,
                    GenderId: this.ddlGenders,
                    SDWId: this.SDWId,
                    MaritalStatusId: this.ddlMaritalStatusId,
                    SimpleDateOB: this.txtDateOB,
                    CountryOfBirthId: this.selectedCountry,
                    CityOfBirthId: this.ddlCitiesByCountryId,//(isNullOrUndefined(this.CitiesByCountryId) || this.CitiesByCountryId == 'N/A') ? this.CitiesByCountryIdDropdown[0].Id : this.ddlCitiesByCountryId,   //this.ddlCitiesByCountryId,  /// this.isUpdateDocumentAttach ? Action.Update : Action.Insert;
                    TitleId: this.ddlTitle,

                    isFieldForceApplicant: this.isFF,

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
    Mandatory: boolean = false;
    UpdateApplicantDataBasicInformation2_click() {
      debugger;
       
            this.formSubmitted = true; 

            let ddlCurrentCurrencyId = this.CurrencyDropdown.find(x => x.Id == this.ddlCurrentCurrencyId);
            let ddlCurrency = this.CurrencyDropdown.find(x => x.Id == this.ddlCurrency);
            this.SelectCurrency = false;
            this.isMandatoryfieldsAnyOne = false;
            this.ExpectedRange = false;
            this.Mandatory = false;

            if (navigator.onLine) {

              if (this.safeTrim(this.txtNICNo) !== "" &&
                !this.validateCNIC(this.safeTrim(this.txtNICNo))) {
                this.ShowCnicValidation2 = true;
                this.isBtnHide2 = true;
                return;
              }

              if (this.MndBloodGroup == true && (!this.selectedBloodGroup || this.selectedBloodGroup.Id == "0")) { 
                this.MndBloodGroup = true;
                this.Mandatory = true;
                this.isBtnHide2 = true;
                return; 
              }

              if (this.MndAnyotherSourceofIncome == true && (this.otherIncome.Name == "N/A" || (this.otherIncome.Id == true && this.OtherSourceofIncomeDetail == '')) ){
                this.MndAnyotherSourceofIncome = true;
                  this.isBtnHide2 = true;
                  return; 

              }
              if (this.MndAnyPhysicalDisability == true && ( this.DisabilitySelect.Name == 'N/A' || (this.DisabilitySelect.Id == true && this.DisabilityDetail == '')) ) {
                this.MndAnyPhysicalDisability = true;
                  this.isBtnHide2 = true;
                  return; 

              }
              if (this.MndDrivingLicenseNo && this.DrivingLicenseNo.trim() == '') {
                this.Mandatory = true;  
                this.isBtnHide2 = true; 
                return; 
              }
              if (this.MndIsSpouseEmployed == true && (this.spouseEmployed.Id == null || this.spouseEmployed.Name == "N/A")) {
                this.MndIsSpouseEmployed = true;
                this.isBtnHide2 = true;
                return;

              }

              if (this.MndDrivingLicenseExpiry == true && (!this.txtDrivingLicenseExpiry || this.txtDrivingLicenseExpiry == '')) {
                this.MndDrivingLicenseExpiry = true;
                this.isBtnHide2 = true;
                return;
              }

              if (this.MndIDCardExpiry == true && (!this.txtIDCardExpiry || this.txtIDCardExpiry == '')) {
                this.MndIDCardExpiry = true;
                this.Mandatory = true;
                this.isBtnHide2 = true;
                return;

              }

              if (this.MndCurrentLastSalary == true && (!this.txtCurrentSalary || this.txtCurrentSalary == '')) {
                this.MndCurrentLastSalary = true;
                this.Mandatory = true;

                this.isBtnHide2 = true;
                return;

              }

              if (this.MndExpectedSalary == true && (!this.txtExpectedSalary || this.txtExpectedSalary == '' || !this.txtExpectedSalaryTo || this.txtExpectedSalaryTo == '' )) {
                this.MndExpectedSalary = true;
                this.Mandatory = true;
                this.isBtnHide2 = true;
                return;

              }

              if (this.MndWhenCanYouJoin == true && (!this.ddlWhenCanYouJoin || this.ddlWhenCanYouJoin == 'N/A')) {
                this.Mandatory = true;
                this.isBtnHide2 = true;
                return;

              }
              if (this.DisabilitySelect.Name == 'No' || this.DisabilityDetail == '' ) {
                this.Mandatory = false;
                this.isBtnHide2 = true;
              

              }
              if (this.otherIncome.Name == 'No' || this.OtherSourceofIncomeDetail == '') {
                this.Mandatory = false;
                this.isBtnHide2 = true;
               
              }


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

           

            this.sharedDataService.setBasicInfo2(this.selectedBloodGroup, this.otherIncome, this.DisabilitySelect, this.OtherSourceofIncomeDetail, this.DisabilityDetail);

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
                    bldId: this.selectedBloodGroup.Id,    // Usama
                    DrivingLicenseNo: this.DrivingLicenseNo,    
                    SpouseNam: this.SpouseName,
                    isSpouseEmployed: this.spouseEmployed.Id,
                    //ResidStatus: this.selectedResidentialStatus.Name,
                    isAnyOtherIncomeSource: this.otherIncome.Id,
                    OtherIncomeSourceDetails: this.otherIncome.Id == true ? this.OtherSourceofIncomeDetail : '',
                    isAnyPhysicalDisability: this.DisabilitySelect.Id,
                    PhysicalDisabilityDetails: this.DisabilitySelect.Id == true ? this.DisabilityDetail : '',
                    CNICExpDate: this.txtIDCardExpiry,
                    DrivingLicenseExpiry: this.txtDrivingLicenseExpiry,

                    isFieldForceApplicant: this.isFF,

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
      debugger;
        if (navigator.onLine) {
            this.isMandatoryfieldsContactInfo = false;
            this.isMandatoryfieldsContactInfo1 = false;
            this.showPhoneNumberError = false;
            
            if (this.MndermanentAddress == true && (this.txtAddress == "" || isNullOrUndefined(this.txtAddress) || isNullOrUndefined(this.txtTelMobile) || this.txtTelMobile == "" || !this.validatePhoneNumber(this.txtTelMobile))) {

              if (this.txtTelMobile && !this.validatePhoneNumber(this.txtTelMobile)) {
                this.showPhoneNumberError = true;
                this.isMandatoryfieldsContactInfo1 = true;
                this.isBtnHide3 = true;
                return;
              }

              if (this.txtAddress == "" || isNullOrUndefined(this.txtAddress)) {

                this.isMandatoryfieldsContactInfo = true;
                this.isBtnHide3 = true;
                return;
              }
            }
            if (this.MndPhoneNoCell == true && (isNullOrUndefined(this.txtTelMobile) || this.txtTelMobile == "")) {

                this.isMandatoryfieldsContactInfo1 = true;
                this.isBtnHide3 = true;
                return;
            }

            if (this.MndResidentialStatus == true && (isNullOrUndefined(this.selectedResidentialStatus) || this.selectedResidentialStatus.Name == "N/A")) {

              this.isMandatoryfieldsContactInfo = true;
              this.isBtnHide3 = true;
              return;
            }
           
            


            else {

              this.sharedDataService.setContactInfo(this.txtAddress, this.txtTelMobile);

                let RequestObject = {

                    Appid: localStorage.getItem('AppId'),
                    Email: localStorage.getItem('Email'),
                    TelOffice: this.dataService.ReplaceApostropheWthTelda(this.txtTelOffice),
                    TelMobile: this.dataService.ReplaceApostropheWthTelda(this.txtTelMobile),
                    TelRes: this.dataService.ReplaceApostropheWthTelda(this.txtTelRes),
                    CompanyId: this.CompanyIdService.CompanyId,
                    PermanentAddress: this.dataService.ReplaceApostropheWthTelda(this.txtAddress),
                    CountryOfResidenceId: this.selectedCountry,
                    ResidStatus: this.selectedResidentialStatus.Id,
                    CityOfResidenceId: /*this.CitiesByCountryId,*/   /*this.ddlCitiesByCountryId*/   this.selectedCountry == -1 ? '00' : this.ddlCitiesByCountryId,
                    ApplicantEmail: localStorage.getItem('Email'),

                    isFieldForceApplicant: this.isFF,

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

    // update data for Bank Information //


    isMndBankInfo: boolean = false;
    UpdateApplicantDataBasicInformation22_click() {
      debugger;


      if (navigator.onLine) {
        if (this.isFF === true && this.ffBankAccountChoice === 'No') {
          this.isCloseEditLbl22_Click();
          return;
        }

        if (!this.ddlBankName || this.ddlBankName.Name === 'N/A') {
          this.isMndBankInfo = true;
          this.isBtnHide22 = true;
          return;
        }



        if (this.safeTrim(this.Accounttitle) == '' || this.safeTrim(this.AccountNoIBAN_No) == '') {
          this.isMndBankInfo = true;
          this.isBtnHide22 = true;
          return;
        }
        if (!this.validateIBAN(this.AccountNoIBAN_No)) {
          this.isValidIBAN = true;
          this.isMndBankInfo = false;
          return; // stop submit
        }

        if (this.isFF === true && this.ffBankAccountChoice === 'Yes' && !this.canProceedWithAccountEvidence()) {
          this.isMndBankInfo = false;
          this.isBtnHide22 = true;
          return;
        }

        else {

          this.isMndBankInfo = false;
          this.isBtnHide22 = false;
          this.isValidIBAN = false;
      
        }

        
        
        let RequestObject = {

          Appid: localStorage.getItem('AppId'),
          Email: localStorage.getItem('Email'),
          bnkid: this.ddlBankName.Id,
          //bnkbrnId: this.Selectbranchcode.Name,
          AccountNo: this.AccountNoIBAN_No,
          PayeeName: this.Accounttitle,
          CompanyId: this.CompanyIdService.CompanyId,
          isFieldForceApplicant: this.isFF,

          Index: "22"

        };
        this.saveBankInfoWithAccountEvidence(RequestObject);


      }
      else {

        this.DisconnectInternet1 = true;
      }
    }

    validateIBAN(iban: string): boolean {
      if (!iban) return false;

      iban = iban.trim().toUpperCase();

      // Pakistan = PK + 2 digits + 20 alphanumeric = 24 chars
      const pkIbanPattern = /^PK\d{2}[0-9A-Z]{20}$/;

      return iban.length === 24 && pkIbanPattern.test(iban);
    }


    // Auto-add PK when field focused
    ensurePKPrefix() {
      if (!this.AccountNoIBAN_No || !this.AccountNoIBAN_No.startsWith("PK")) {
        this.AccountNoIBAN_No = "PK";
      }
    }

    // Always keep PK at start
    forcePKPrefix() {
      if (!this.AccountNoIBAN_No.startsWith("PK")) {
        this.AccountNoIBAN_No = "PK" + this.AccountNoIBAN_No.replace(/pk/i, "").trim();
      }
    }

    // Block deleting PK
    preventPKDeletion(event: KeyboardEvent) {
      const cursorPos = (event.target as HTMLInputElement).selectionStart;

      // Block Backspace or Delete if cursor is inside PK prefix
      if ((event.key === "Backspace" || event.key === "Delete") && cursorPos! <= 2) {
        event.preventDefault();
      }
    }


    // update data for Father's Information //

    private canProceedWithAccountEvidence(): boolean {
      this.accountEvidenceValidationMsg = '';
      if (this.accountEvidenceExistingDocId > 0) {
        return true;
      }
      if (this.accountEvidenceSelectedFile) {
        return true;
      }
      this.accountEvidenceValidationMsg = 'Please select Account Evidance file.';
      return false;
    }

    private saveBankInfoWithAccountEvidence(requestObject: any): void {
      this.openSpinner();
      const updateApplicantData = this._config.environment.baseUrl + Constants.UpdateApplicantData;
      this.http.post(updateApplicantData, requestObject, { headers: this.dataService.headers })
        .subscribe((response: any) => {
          if (!response || response.isValid !== true) {
            this.HideSpinner();
            $("#videoPopup1").modal('show');
            this.isTick = false;
            this.ApplyJobMsg = response && response.Msg ? response.Msg : "Invalid Data.";
            return;
          }

          const shouldUploadEvidence = this.isFF === true
            && this.ffBankAccountChoice === 'Yes'
            && !!this.accountEvidenceSelectedFile;

          if (!shouldUploadEvidence) {
            this.finalizeBankSaveSuccess(response.Msg || "Record updated successfully!");
            return;
          }

          this.saveAccountEvidenceAttachment(response.Msg || "Record updated successfully!");
        }, (error: any) => {
          this.HideSpinner();
          $("#videoPopup1").modal('show');
          this.isTick = false;
          this.ApplyJobMsg = (error && error.error && error.error.Message) ? error.error.Message : "Invalid Data.";
        });
    }

    private finalizeBankSaveSuccess(successMsg: string): void {
      this.isCloseEditLbl22_Click();
      this.ApplyJobMsg = successMsg;
      this.isTick = true;
      $("#videoPopup1").modal('show');
      this.getApplicantData();
      this.getDocumentAttachmentGrid();
      this.getLastProfileUpdateValue();
      this.popuphide();
      this.HideSpinner();
    }

    private saveAccountEvidenceAttachment(bankSuccessMsg: string): void {
      const isUpdate = this.accountEvidenceExistingDocId > 0;
      if (!this.accountEvidenceSelectedFile) {
        this.HideSpinner();
        $("#videoPopup1").modal('show');
        this.isTick = false;
        this.ApplyJobMsg = "Please select Account Evidance file.";
        return;
      }

      const model = {
        Id: isUpdate ? this.accountEvidenceExistingDocId : 0,
        Status: 2,
        Subject: this.accountEvidenceLabel,
        Remarks: this.accountEvidenceLabel,
        AppId: Number(localStorage.getItem("AppId")) || 0,
        CompanyId: Number(this.CompanyIdService.CompanyId) || 0,
        ENTUser: localStorage.getItem("Email"),
        Action: isUpdate ? "Update" : "Insert"
      };

      const formData = new FormData();
      // Keep payload contract identical to existing working document upload flow.
      formData.append("jpProfileImage", this.accountEvidenceSelectedFile, this.accountEvidenceSelectedFile.name);
      formData.append("Model", JSON.stringify(model));
      const request = new XMLHttpRequest();
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }

        let docResponse: any = null;
        try {
          docResponse = request.responseText ? JSON.parse(request.responseText) : null;
        } catch (e) {
          docResponse = null;
        }

        if (request.status === 200 && docResponse && docResponse.isValid === true) {
          this.accountEvidenceSelectedFile = null;
          this.accountEvidenceSelectedFileName = "";
          this.accountEvidenceValidationMsg = "";
          this.finalizeBankSaveSuccess(bankSuccessMsg);
          return;
        }

        this.HideSpinner();
        $("#videoPopup1").modal('show');
        this.isTick = false;
        const backendMsg =
          (docResponse && (docResponse.Msg || docResponse.Message))
            ? (docResponse.Msg || docResponse.Message)
            : (request.responseText || "");
        this.ApplyJobMsg = backendMsg ? backendMsg : "Account Evidance could not be saved.";
      };

      const saveBankAccountEvidence = this._config.environment.baseUrl + Constants.SaveBankAccountEvidence;
      request.open("POST", saveBankAccountEvidence, true);
      request.send(formData);
    }

    onSelectAccountEvidenceFile(event: any): void {
      const files = event && event.target && event.target.files ? event.target.files : null;
      const selectedFile = files && files.length > 0 ? files[0] : null;
      if (!selectedFile) {
        return;
      }

      const fileName = selectedFile.name || "";
      const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
      const allowedExtensions = this.accountEvidenceAllowedTypes.split(',').map(ext => ext.trim().toLowerCase());
      if (allowedExtensions.indexOf(extension) < 0) {
        this.accountEvidenceSelectedFile = null;
        this.accountEvidenceSelectedFileName = "";
        this.accountEvidenceValidationMsg = "Attached document format is not valid!";
        return;
      }

      if (selectedFile.size > 2097152) {
        this.accountEvidenceSelectedFile = null;
        this.accountEvidenceSelectedFileName = "";
        this.accountEvidenceValidationMsg = "Document file size cannot be greater than 2 MB.";
        return;
      }

      this.accountEvidenceSelectedFile = selectedFile;
      this.accountEvidenceSelectedFileName = selectedFile.name;
      this.accountEvidenceValidationMsg = "";
    }

    private resolveAccountEvidenceType(): any {
      if (!this.Documents_Cat_Type || !this.Documents_Cat_Type.length) {
        return null;
      }

      const normalize = (value: string) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const candidates = [
        'accountevidance',
        'accountevidence',
        'bankevidance',
        'bankevidence',
        'accountproof'
      ];

      const matched = this.Documents_Cat_Type.find(doc => {
        const typeName = normalize(doc.TypeName);
        return candidates.some(candidate => typeName.indexOf(candidate) >= 0);
      });

      if (matched) {
        this.accountEvidenceTypeId = Number(matched.DocumentID) || 0;
        this.accountEvidenceDocCategoryId = Number(matched.DocCategoryTypeId) || 0;
        this.accountEvidenceTypeName = matched.TypeName || this.accountEvidenceLabel;
      }

      return matched || null;
    }

    private refreshAccountEvidenceBinding(): void {
      if (!this.DocumentAttachmentGrid || !this.DocumentAttachmentGrid.length) {
        this.accountEvidenceExistingDocId = 0;
        this.accountEvidenceExistingDocName = "";
        return;
      }

      const normalize = (value: string) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const candidates = [
        normalize(this.accountEvidenceLabel),
        'accountevidance',
        'accountevidence',
        'bankaccountevidancedocument',
        'bankaccountevidencedocument',
        'bankevidance',
        'bankevidence'
      ];

      const found = this.DocumentAttachmentGrid.find(row => {
        const subject = normalize(row && row.Subject ? String(row.Subject) : '');
        const category = normalize(row && row.DocumentCategory ? String(row.DocumentCategory) : '');
        return candidates.some(candidate =>
          (subject && subject.indexOf(candidate) >= 0) ||
          (category && category.indexOf(candidate) >= 0));
      });
      if (!found) {
        this.accountEvidenceExistingDocId = 0;
        this.accountEvidenceExistingDocName = "";
        return;
      }

      this.accountEvidenceExistingDocId = Number(found.Id) || 0;
      const docName = found.DocumentName ? String(found.DocumentName) : "";
      const extension = found.DocumentExtension ? String(found.DocumentExtension) : "";
      this.accountEvidenceExistingDocName = (docName + extension).trim();
    }

    onFFBankAccountChoiceChange(choice: string) {
      this.ffBankAccountChoice = choice;
      this.persistFFBankAccountChoiceForValidation();
      this.accountEvidenceValidationMsg = '';
      if (choice === 'No') {
        this.isMndBankInfo = false;
        this.isValidIBAN = false;
      }
    }

    canShowFFBankFields(): boolean {
      if (this.isFF !== true) {
        return true;
      }
      // Keep load/read-only view unchanged; apply FF Yes/No visibility only in edit mode.
      if (!this.isBasicInformation22) {
        return true;
      }
      return this.ffBankAccountChoice === 'Yes';
    }

    private hasAnyBankInfoData(): boolean {
      const hasBankName = !isNullOrUndefined(this.BankDropdown) && this.safeTrim(this.BankDropdown) !== '' && this.safeTrim(this.BankDropdown) !== 'N/A';
      const hasIban = this.safeTrim(this.LabelAccountNoIBAN_No) !== '';
      const hasTitle = this.safeTrim(this.LabelAccounttitle) !== '';
      return hasBankName || hasIban || hasTitle;
    }

    private persistFFBankAccountChoiceForValidation(): void {
      if (this.isFF !== true) {
        localStorage.removeItem('FFHasBankAccount');
        return;
      }
      localStorage.setItem('FFHasBankAccount', this.ffBankAccountChoice === 'Yes' ? '1' : '0');
    }

    fatherIDCardInvalid: boolean = false;

    validateCNIC(cnic: string): boolean {
      const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
      return cnicPattern.test(cnic);
    }

    onInput(event: any): void {
      let value = event.target.value;

      // Remove non-numeric characters first
      value = value.replace(/\D/g, '');

      // Format the CNIC as ###-#######-#
      if (value.length <= 5) {
        this.FatherIDCardNo = value;
      } else if (value.length <= 12) {
        this.FatherIDCardNo = `${value.slice(0, 5)}-${value.slice(5)}`;
      } else {
        this.FatherIDCardNo = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12, 13)}`;
      }
    }


    onInput2(event: any): void {
      let value = event.target.value;

      // Remove non-numeric characters first
      value = value.replace(/\D/g, '');

      // Format the CNIC as ###-#######-#
      if (value.length <= 5) {
        this.txtNICNo = value;
      } else if (value.length <= 12) {
        this.txtNICNo = `${value.slice(0, 5)}-${value.slice(5)}`;
      } else {
        this.txtNICNo = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12, 13)}`;
      }
    }

    //formatCNIC(input: string): void {
    //  debugger;
    //  // Remove non-numeric characters first
    //  let cleanInput = input.replace(/\D/g, '');

    //  // Apply the CNIC formatting: 5 digits - 7 digits - 1 digit
    //  if (cleanInput.length <= 5) {
    //    this.FatherIDCardNo = cleanInput;
    //  } else if (cleanInput.length <= 12) {
    //    this.FatherIDCardNo = cleanInput.substring(0, 5) + '-' + cleanInput.substring(5, 12);
    //  } else {
    //    this.FatherIDCardNo = cleanInput.substring(0, 5) + '-' + cleanInput.substring(5, 12).slice(0, 7) + '-' + cleanInput.substring(12, 13);
    //  }
    //}

    isMndFatherInfo: boolean = false;
    
    ShowCnicValidation: boolean = false;

    UpdateApplicantDataBasicInformation23_click() {
      debugger;
      
      if (navigator.onLine) {



       

        if (this.safeTrim(this.FatherFullName) == "" || this.safeTrim(this.FatherIDCardNo) == "" || this.safeTrim(this.FatherOccupation) == "" ) {
          this.isMndFatherInfo = true;
          this.isBtnHide23 = true;
          return;
        }

        if (
          this.safeTrim(this.FatherPhoneNoCell) !== "" &&
          !this.validatePhoneNumber(this.safeTrim(this.FatherPhoneNoCell))
        ) {
          this.showPhoneNumberError = true;
          this.isBtnHide23 = true;
          return;
        }

        //if (this.FatherPhoneNoCell.trim() && !this.validatePhoneNumber(this.FatherPhoneNoCell)) {
        //  this.showPhoneNumberError = true;
        //  this.isBtnHide23 = true;
        //  return;
        //}


        if (
          this.safeTrim(this.FatherIDCardNo) !== "" &&
          !this.validateCNIC(this.safeTrim(this.FatherIDCardNo))
        ) {
          this.ShowCnicValidation = true;
          this.isBtnHide23 = true;
          return;
        }

        //if (this.FatherIDCardNo.trim() && !this.validateCNIC(this.FatherIDCardNo)) {
        //  this.ShowCnicValidation = true;
        //  this.isBtnHide23 = true;
        //  return;
        //}
        else {

          this.sharedDataService.setFatherInfo(this.FatherFullName, this.FatherIDCardNo, this.FatherOccupation, this.FatherPhoneNoCell);

          this.isMndFatherInfo = false;
          this.isBtnHide23 = false;

        }


        let RequestObject = {

          Appid: localStorage.getItem('AppId'),
          Email: localStorage.getItem('Email'),
          CompanyId: this.CompanyIdService.CompanyId,

          FatherfullName: this.FatherFullName,
          SDWId: this.SDWId,
          FatherPhoCell: this.FatherPhoneNoCell,
          FatherOccup: this.FatherOccupation,
          FatherIdcard: this.FatherIDCardNo,

          isFieldForceApplicant: this.isFF,
          
          ApplicantEmail: localStorage.getItem('Email'),
          Index: "23"

        }
        this.isCloseEditLbl23_Click()
        this.openSpinner();
        let updateApplicantData = this._config.environment.baseUrl + Constants.UpdateApplicantData;
        this.PostData(RequestObject, updateApplicantData, { headers: this.dataService.headers });
        // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/UpdateApplicantData");


      }
      else {

        this.DisconnectInternet1 = true;
      }
    }


    private safeTrim(value: string | null | undefined): string {
      return (value || "").trim();
    }





    // update data for Emergency Contact Information //




    validatePhoneNumber(phone: string): boolean {
      const phonePattern = /^923\d{9}$/;
      return phonePattern.test(phone);
    }

    isEmergencyContactInfo: boolean = false;

    showPhoneNumberError: boolean = false;

    UpdateApplicantDataBasicInformation24_click() {
      debugger;
      if (navigator.onLine) {

       
        if (navigator.onLine) {
          this.showPhoneNumberError = false;


          
          if (!this.EmergencyFullName || this.safeTrim(this.EmergencyFullName) == "" && this.safeTrim(this.EmergencyPhoneNoCell) == "" || this.safeTrim(this.EmergencyPhoneNoCell) == "" ) {


            this.isEmergencyContactInfo = true;
            this.isBtnHide24 = true;
            //this.showPhoneNumberError = true;
            return;

          }

          if (!this.validatePhoneNumber(this.safeTrim(this.EmergencyPhoneNoCell))) {
            this.isEmergencyContactInfo = true;
            this.isBtnHide24 = true;
            this.showPhoneNumberError = true;
            return;
          }

          else {
            this.sharedDataService.setEmergencyContactInfo(this.EmergencyFullName, this.EmergencyPhoneNoCell);

            this.isEmergencyContactInfo = false;
            this.isBtnHide24 = false;
          }

          let RequestObject = {

            Appid: localStorage.getItem('AppId'),
            Email: localStorage.getItem('Email'),
            CompanyId: this.CompanyIdService.CompanyId,

            EmergencyName: this.EmergencyFullName,
            EmergencyPhone: this.EmergencyPhoneNoCell,
            EmergencyRelationship: this.Relationship.Id,

            isFieldForceApplicant: this.isFF,

            ApplicantEmail: localStorage.getItem('Email'),
            Index: "24"

          }
          this.isCloseEditLbl24_Click()
          this.openSpinner();
          let updateApplicantData = this._config.environment.baseUrl + Constants.UpdateApplicantData;
          this.PostData(RequestObject, updateApplicantData, { headers: this.dataService.headers });
          // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/UpdateApplicantData");


        }
        else {

          this.DisconnectInternet1 = true;
        }
      }


    }



    // update data for Conveyance information //



    isConveyanceInfo: boolean = false;

    UpdateApplicantDataBasicInformation25_click() {

      if (navigator.onLine) {

        if (this.selectedConveyance.Id &&(this.selectedConveyance.Name == "N/A" || this.selectedConveyanceType.Name == 'N/A' || !this.Conveyancemake ||  !this.ConveyanceModal || !this.ConveyanceYear || !this.ConveyancemakeRegNo )) { 
          this.isConveyanceInfo = true;
          this.isBtnHide25 = true;
          return;

        } else {

          this.sharedDataService.setConveyanceInfo(
            this.selectedConveyance,
            this.selectedConveyanceType,
            this.Conveyancemake,
            this.ConveyanceModal,
            this.ConveyanceYear,
            this.ConveyancemakeRegNo);

          this.isConveyanceInfo = false;
          this.isBtnHide25 = false;

        }
        
        let RequestObject = {

          Appid: localStorage.getItem('AppId'),
          Email: localStorage.getItem('Email'),

          CompanyId: this.CompanyIdService.CompanyId,

          Conveyance: this.selectedConveyance.Id,
          ConveyanceType: this.selectedConveyance.Id == true ? this.selectedConveyanceType.Id : null,
          ConveyanceMake: this.selectedConveyance.Id == true ? this.Conveyancemake : null,
          ConveyModal: this.selectedConveyance.Id == true ? this.ConveyanceModal : null,
          ConveyYear: this.selectedConveyance.Id == true ? this.ConveyanceYear : null,
          ConveyRegNo: this.selectedConveyance.Id == true ? this.ConveyancemakeRegNo : null,

          isFieldForceApplicant: this.isFF,

          ApplicantEmail: localStorage.getItem('Email'),
          Index: "25"

        }
        this.isCloseEditLbl25_Click()
        this.openSpinner();
        let updateApplicantData = this._config.environment.baseUrl + Constants.UpdateApplicantData;
        this.PostData(RequestObject, updateApplicantData, { headers: this.dataService.headers });
        // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/UpdateApplicantData");


      }
      else {

        this.DisconnectInternet1 = true;
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

                isFieldForceApplicant: this.isFF,

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
                isFieldForceApplicant: this.isFF,
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

                isFieldForceApplicant: this.isFF,

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
    DOBValidate: boolean = false;

    datePickerChanged(eventData: any, controlID: string) {
      debugger;

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
        else if (controlID.toLowerCase().trim() == "drivinglicenseexpiry")
          this.txtDrivingLicenseExpiry = eventData.date;
        else if (controlID.toLowerCase().trim() == "id-card-expiry")
          this.txtIDCardExpiry = eventData.date;
        else if (controlID.toLowerCase().trim() === "dependentdateofbirth")
          this.DependentDateOfBirth = eventData.date;

      } else {
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
          else if (controlID.toLowerCase().trim() == "drivinglicenseexpiry")
            this.txtDrivingLicenseExpiry = "";
          else if (controlID.toLowerCase().trim() == "id-card-expiry")
            this.txtIDCardExpiry = "";
          else if (controlID.toLowerCase().trim() === "dependentdateofbirth")
            this.DependentDateOfBirth = "";
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
                    UserId:  localStorage.getItem("Email"),
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
                this.refreshAccountEvidenceBinding();

                //console.log(response);
              
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
            if (this.checkForDocAtt == true){
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
                if (this.checkForDocAttWhenupdate == false){
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
        if (this.checkForDocAttWhenupdate == true){
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

 

  // Educational Doc Grid 

    
    // Variables for Educational Documents
    isEducationalDocFileName: string = "";
    isEducationalDocUpload: boolean = false;
    lblEducationalDocValidation: string = "";
    urlEducationalDocFile: string = "";
    blobEducationalDoc: any;
    uniqueEducationalDocName: string = "";
    checkForEducationalDocum: boolean = false;
    checkForEducationalDoc: boolean = false;
    IsEducationalDocShow: any;

    // Method to handle file selection for Educational Documents
    onEducationalDocumentsFile(event) {
      debugger;

      this.isEducationalDocUpload = true;
      if (event.target.files && event.target.files[0]) {
        this.isEducationalDocFileName = event.target.files[0].name;
        this.Filesize = event.target.files[0].size;
        var reader: FileReader = new FileReader();
        var self = this;
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = function (loadEvent: any) { // called once readAsDataURL is completed
          self.urlEducationalDocFile = loadEvent.target.result;
        }
      }
    }

    // Method to convert base64 data to Blob for Educational Documents
    b64toBlobEducationalDoc(b64Data, contentType) {
      contentType = contentType || '';
      const byteString = window.atob(b64Data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      return new Blob([int8Array], { type: contentType });
    }

    // Method to save Educational Document file
    SaveEducationalDocFile(i: number) {
      debugger;
      this.isEducational = false;
      this.ShowValidationDocumentType = false;
      this.DisconnectInternet = false;

      if (this.checkForEducationalDoc === true) {
        this.SaveEducationalDocAttachment(i);
        return;
      }
      if (this.urlEducationalDocFile === '' || this.urlEducationalDocFile === "null") {
        this.checkForEducationalDocum = true;
        this.SaveEducationalDocAttachment(i);
        return;
      } else {
        const block = this.urlEducationalDocFile.split(";");
        const contentType = block[0].split(":")[1];
        const extension = contentType.split("/")[1];
        const realData = block[1].split(",")[1];
        this.blobEducationalDoc = this.b64toBlobEducationalDoc(realData, contentType);
        this.uniqueEducationalDocName = 'EducationalDoc-' + new Date().getTime() + "." + extension;
        this.SaveEducationalDocAttachment(i);
      }
    }

    // Method to save Educational Document attachment

    isEducational: boolean = false;
    ShowValidationDocumentType: boolean = false;

    SaveEducationalDocAttachment(i: number) {
      if (navigator.onLine) {

       
        if (this.selectedDocumentType.TypeName == 'N/A' || this.EduDocumentTitle.trim() === "") {
          this.isEducational = true;
          this.DisconnectInternet = false;
          return;
        }
        // Check if document type is N/A
        if (this.selectedDocumentType.TypeName === "" || this.selectedDocumentType.TypeName === 'N/A') {
          this.ShowValidationDocumentType = true;
          this.lblEducationalDocValidation = "Please select a valid Document Type.";
        
          return;
        }
        else {
          this.isEducational = false;
          this.ShowValidationDocumentType = false;
          this.DisconnectInternet = false;
        }

        // File input validation
        const fileInput = document.getElementById('EducattachmentFileInput' + i) as HTMLInputElement;

        if (!fileInput || fileInput.files.length === 0) {
          this.isEducational = true;  
          this.DisconnectInternet = false;  
          return;  
        }

        this.obj.CompanyId = this.CompanyIdService.CompanyId;

        
        this.obj.DocTypeId = this.selectedDocumentType;
        this.obj.ExtDocCategoryId = this.Documents_Cat_Type.find(doc => doc.DocumentID == this.selectedDocumentType).DocCategoryTypeId;
        this.obj.EduDocTitle = this.EduDocumentTitle;
        this.obj.Email = localStorage.getItem("Email");
        this.obj.AppId = localStorage.getItem("AppId");
        this.obj.EduDocFilename = this.isEducationalDocFileName;
        this.obj.Action = (this.isUpdateEducationalDoc === true) ? Action.Update : Action.Insert;

        var json = JSON.stringify(this.obj);

        const fd = new FormData();
        if (this.checkForEducationalDoc === false) {
          fd.append("jpProfileImage", this.blobEducationalDoc, this.uniqueEducationalDocName);
        }
        fd.append("Model", json);

        const SaveEducationalDetailUrl = this._config.environment.baseUrl + Constants.SaveEducationalDetail;

  
        this.openSpinner();

        this.http.post(SaveEducationalDetailUrl, fd, { headers: this.dataService.multipartHeaders() }).subscribe(
          (response: any) => {
            this.HideSpinner();

            if (response.isValid) {
            
              this.IsEducationalDocShow = true;
              this.isEducationalDocUpload = false;
              $("#videoPopup1").modal('show');
              this.ApplyJobMsg = response.Msg;
              this.getLastProfileUpdateValue();
              this.isTick = true;
              this.popuphide();
            } else {
         
              debugger;
              this.HideSpinner();
              this.lblEducationalDocValidation = response.Msg;
              this.ShowValidation = true;

                setTimeout(() => {
                  $("#myModal222" + i).modal('show');
              
                }, 800);
             
            }

           
            this.getEducationalDocGrid();
            
            $("#myModal222" + i).modal('hide');
           
          },
          (error) => {
            this.HideSpinner();
            this.ShowValidation = true;
            this.lblEducationalDocValidation = (error && error.error) ? (error.error.Msg || error.error || 'Failed to save document.') : 'Failed to save document.';
            setTimeout(() => {
              $("#myModal222" + i).modal('show');
            }, 800);
          }
        );

       
      
      } else {
        this.DisconnectInternetDocument = true;
      }
     

    }

    ShowValidation: boolean = false;

    onUpdateEducationalDoc_Click(selectedRow: any) {
      debugger;

      this.isUpdate = true;
      this.isMandatoryfields = false;
      this.isUpdateEducationalDoc = true;
      this.selectedEducationalDocId = selectedRow.AppDocId;

      this.EduDocumentType = selectedRow.ExtDocCatId;
      this.DoctypeId = selectedRow.DocId;
      this.EduDocumentTitle = selectedRow.Subject;
      this.EduDocFile = selectedRow.RTF;

      this.EduDocFilename = selectedRow.DocFileName;

     
      // Find the selected DocType 
      this.selectedDocumentType = this.Documents_Cat_Type.find(doc => doc.DocumentID == selectedRow.DocId).TypeName;
      //alert(this.Documents_Cat_Type);

      
     
    }

  


    DeleteEducationalDoc(AppDocId: number) {
      debugger;
      if (this.isEducationalDoc == true) {
        this.delEducationalDoc

        let RequestObject = {

          
          AppDocId: AppDocId,
          AppId: localStorage.getItem("AppId"),
          Email: localStorage.getItem("Email"),

        };
        this.openSpinner();
        let DeleteEducationalGrid = this._config.environment.baseUrl + Constants.DeleteEducationalGrid;
        this.http.post(DeleteEducationalGrid, RequestObject, { headers: this.dataService.headers })
          // this.http.post("https://jobportalapi.azurewebsites.net/DeleteEducationalGrid", RequestObject)
          .subscribe((response: any) => {

            this.deletedEducationalGrid = response.Data;
            this.getEducationalDocGrid();
            this.getLastProfileUpdateValue();
            this.HideSpinner();

            if (this.isEducationalDoc == true) {
              $("#videoPopup1").modal('show');
              this.isTick = true;
              this.ApplyJobMsg = response.Msg;
              this.isEducationalDoc = false;
              this.popuphide();
            }
          }, (error: any) => {
            console.log(error);
          });
      }
    }
   
    filteredDocs: any;
    getEducationalDocGrid() {
      debugger;

      let RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId,

      }
      this.openSpinner();
      let GetEducationalGrid = this._config.environment.baseUrl + Constants.GetEducationalGrid;
      this.http.post(GetEducationalGrid, RequestObject, { headers: this.dataService.headers })
        //this.http.post("https://jobportalapi.azurewebsites.net/GetEducationalGrid", RequestObject)
        .subscribe((response: any) => {



          this.EducationalDocGrid = response;


          //console.log(this.EducationalDocGrid);
          this.HideSpinner();

          
          if (this.EducationalDocGrid && this.EducationalDocGrid.length > 0 && this.EducationalDocGrid[0].DocFileName) {
            this.EduDocFilename = this.EducationalDocGrid[0].DocFileName;

            this.isUpdateEducationalDoc = false;

          } else {
            this.EduDocFilename = null; 
          }

          

          
          //debugger;
        
          this.filteredDocs = this.getDocsByCategory(response.ExtDocCatId); 
          //console.log(this.filteredDocs);

        }, (error: any) => {
          console.log(error);
        });
    }

  // Different section Record

    getDocsByCategory(DocCategoryTypeId: number): any {
      //debugger;
      try {
       if (this.EducationalDocGrid != null)
        return this.EducationalDocGrid.filter(doc => doc.ExtDocCatId == DocCategoryTypeId);
      } catch (error) {
        console.log(error);
        return [];
      }
    }

   // grid Dropdown 

    getdocumenttypename(DoctypeName: string | null): string {
      if (!DoctypeName) {
        return 'N/A';
      }
      const documenttype = this.Documents_Cat_Type.find(doc => doc.DocumentID == DoctypeName);
      return documenttype ? documenttype.TypeName : 'N/A';
    }


   

    distinctCategoryID: any;
    Documents_Cat_Type: any;

    distinctTypeNames: any;


    getDoc_Cat_Type() {
      //debugger;

      let RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId,

      }
      this.openSpinner();
      let GetDocumentsCat_Type = this._config.environment.baseUrl + Constants.GetDocumentsCat_Type;
      this.http.post(GetDocumentsCat_Type, RequestObject, { headers: this.dataService.headers })
        //this.http.post("https://jobportalapi.azurewebsites.net/GetDocumentsCat_Type", RequestObject)
        .subscribe((response: any) => {


          //console.log(response);
          this.Documents_Cat_Type = response;
          //console.log(this.Documents_Cat_Type);


          this.distinctCategoryID = Array.from(new Set(this.Documents_Cat_Type.map(doc => doc.DocCategoryTypeId)));

          //console.log(this.distinctCategoryID);

          this.HideSpinner();


        }, (error: any) => {
          console.log(error);
        });
    }

    getDoc_Cat_TypeFF() {
      debugger;

      let RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId,

      }
      this.openSpinner();
      let GetDocumentsCat_TypeFF = this._config.environment.baseUrl + Constants.GetDocumentsCat_TypeFF;
      this.http.post(GetDocumentsCat_TypeFF, RequestObject, { headers: this.dataService.headers })
        //this.http.post("https://jobportalapi.azurewebsites.net/GetDocumentsCat_Type", RequestObject)
        .subscribe((response: any) => {


          //console.log(response);
          this.Documents_Cat_Type = response;
          //console.log(this.Documents_Cat_Type);           // DropDown Value


          this.distinctCategoryID = Array.from(new Set(this.Documents_Cat_Type.map(doc => doc.DocCategoryTypeId))); // Section Id 
          this.refreshAccountEvidenceBinding();

          //console.log(this.distinctCategoryID);

          this.HideSpinner();


        }, (error: any) => {
          console.log(error);
        });
    }


    // Name of Section 
    getCategoryNameById(DocCategoryTypeId: string): string | undefined {
      //debugger;
      const CategoryName = this.Documents_Cat_Type.find(doc => doc.DocCategoryTypeId == DocCategoryTypeId).CategoryName;
      return CategoryName ? CategoryName : undefined;
    }

    isMandatoryCategory(categoryId: number): boolean {
      //debugger;
      return this.Documents_Cat_Type.some(doc => doc.DocCategoryTypeId == categoryId && doc.Mandatory == 1);
    }

    
  // Drop Down

    getFilteredDocsByCategory(categoryName: string): { DocumentID: number, TypeName: string }[] {
     
      return this.Documents_Cat_Type
        .filter(doc => doc.DocCategoryTypeId == categoryName)
        .map(doc => ({ DocumentID: doc.DocumentID, TypeName: doc.TypeName }));
    }


    // -- Other Documents  Grid --  

    isOtherDocFileName: string = "";
    isOtherDocUpload: boolean = false;
    lblOtherDocValidation: string = "";
    fileToUpload: File | null = null;
    urlOtherDocFile: string = "";
    blobOtherDoc: any;
    uniqueOtherImgName: string = "";
    checkForOtherDocum: boolean = false;
    checkForOtherDoc: boolean = false;
    IsOtherDocShow: any;

    onOtherDocumentsFile(event) {
      debugger;

      this.isOtherDocUpload = true;
      if (event.target.files && event.target.files[0]) {
        this.isOtherDocFileName = event.target.files[0].name;
        this.Filesize = event.target.files[0].size;
        var reader: FileReader = new FileReader();
        var self = this;
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = function (loadEvent: any) { // called once readAsDataURL is completed
          self.urlOtherDocFile = loadEvent.target.result;
        }
      }
    }

    b64toBlobOtherDoc(b64Data, contentType) {
      contentType = contentType || '';
      const byteString = window.atob(b64Data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      return new Blob([int8Array], { type: contentType });
    }

    SaveOtherDocFile() {
      debugger;
      if (this.checkForOtherDoc === true) {
        this.SaveOtherDocAttachment();
        return;
      }
      if (this.urlOtherDocFile === '' || this.urlOtherDocFile === "null") {
        this.checkForOtherDocum = true;
        this.SaveOtherDocAttachment();
        return;
      } else {
        const block = this.urlOtherDocFile.split(";");
        const contentType = block[0].split(":")[1];
        const extension = contentType.split("/")[1];
        const realData = block[1].split(",")[1];
        this.blobOtherDoc = this.b64toBlobOtherDoc(realData, contentType);
        this.uniqueOtherImgName = 'OtherDoc-' + new Date().getTime() + "." + extension;
        this.SaveOtherDocAttachment();
      }
    }


    isOtherDoc: boolean = false;

    SaveOtherDocAttachment() {
      debugger;
      if (navigator.onLine) {


        if (this.MndOtherDoc && (this.otherDocumentType.Name == 'N/A' || this.OtherdocumentTitle.trim() === "")) {
          this.isOtherDoc = true;
          this.DisconnectInternet = false;
          return;
        } else {
          this.isOtherDoc = false;
          this.DisconnectInternet = false;
        }

        this.obj.CompanyId = this.CompanyIdService.CompanyId;
        this.obj.Email = localStorage.getItem("Email");
        this.obj.AppId = localStorage.getItem("AppId");

        this.obj.OtherDocType = this.otherDocumentType.Id;
        this.obj.OtherDocTitle = this.OtherdocumentTitle;

        this.obj.OtherDocFilename = this.isOtherDocFileName;

        this.obj.Action = (this.isUpdateOtherDoc == true) ? Action.Update : Action.Insert;

      
      

        var json = JSON.stringify(this.obj);

        const fd = new FormData();
        if (this.checkForOtherDoc === false) {
          fd.append("jpProfileImage", this.blobOtherDoc, this.uniqueOtherImgName);
        }
        fd.append("Model", json);

        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
          if (request.readyState === 4 && request.status === 200) {
            var obj1 = JSON.parse(request.response);
            this.HideSpinner();
            if (obj1["isValid"]) {
              this.IsOtherDocShow = true;
              this.isOtherDocUpload = false;
              $("#videoPopup1").modal('show');
              this.ApplyJobMsg = obj1["Msg"];
              this.getLastProfileUpdateValue();
              this.isTick = true;
              this.popuphide();
            } else {
              this.isTick = false;
              this.lblOtherDocValidation = obj1["Msg"];
              this.popuphide();
              this.urlOtherDocFile = '';
            }
          }
        };

        var SaveOtherDocDetail = this._config.environment.baseUrl + Constants.SaveOtherDocDetail;
        request.open("POST", SaveOtherDocDetail, true);
        var accessToken = localStorage.getItem("AccessToken");
        if (accessToken) {
          request.setRequestHeader("Authorization", "Bearer " + accessToken);
        }
        request.send(fd);
        this.openSpinner();
        $("#myModal223").modal('hide');

        setTimeout(() => {
          this.getOtherDocGrid();
        }, 500);


      } else {
        this.DisconnectInternetDocument = true;
      }
    }


    onUpdateOtherDoc_Click(selectedRow: any) {
      debugger;

      this.isUpdate = true;
      this.isMandatoryfields = false;
      this.isUpdateOtherDoc = true;
      this.selectedOtherDocId = selectedRow.AppDocId;


      this.OtherDocumentsType = selectedRow.ExtDocCatId;
      this.OtherdocumentTitle = selectedRow.Subject;


      this.OtherDocFile = selectedRow.RTF;

      this.OtherDocFilename = selectedRow.DocFileName;

      // Find the OtherDocType 
      const OtherDoc = this.otherDocumentTypeDropdown.find(doc => doc.Id == String(selectedRow.ExtDocCatId));
      this.otherDocumentType = OtherDoc || null;


    

    }



    DeleteOtherDocGrid(AppDocId: number) {
      debugger;
      if (this.isOtherDoc1 == true) {
        this.delOtherDoc

        let RequestObject = {


          AppDocId: AppDocId,
          AppId: localStorage.getItem("AppId"),
          Email: localStorage.getItem("Email"),

        };
        this.openSpinner();
        let DeleteOtherDocGrid = this._config.environment.baseUrl + Constants.DeleteOtherDocGrid;
        this.http.post(DeleteOtherDocGrid, RequestObject, { headers: this.dataService.headers })
          // this.http.post("https://jobportalapi.azurewebsites.net/DeleteOtherDocGrid", RequestObject)
          .subscribe((response: any) => {

            this.deleteOtherDocGrid = response.Data;
            this.getOtherDocGrid();
            this.getLastProfileUpdateValue();
            this.HideSpinner();

            if (this.isOtherDoc1 == true) {
              $("#videoPopup1").modal('show');
              this.isTick = true;
              this.ApplyJobMsg = response.Msg;
              this.isOtherDoc1 = false;
              this.popuphide();
            }
          }, (error: any) => {
            console.log(error);
          });
      }
    }


    getOtherDocGrid() {
      debugger;

      let RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId,

      }
      this.openSpinner();
      let GetOtherDocGrid = this._config.environment.baseUrl + Constants.GetOtherDocGrid;
      this.http.post(GetOtherDocGrid, RequestObject, { headers: this.dataService.headers })
        //this.http.post("https://jobportalapi.azurewebsites.net/GetOtherDocGrid", RequestObject)
        .subscribe((response: any) => {

          debugger;

          this.OtherDocGrid = response;

          //console.log(this.OtherDocGrid);

          this.HideSpinner();


          if (this.OtherDocGrid && this.OtherDocGrid.length > 0 && this.OtherDocGrid[0].DocFileName) {
            this.OtherDocFilename = this.OtherDocGrid[0].DocFileName;
          } else {
            this.OtherDocFilename = null; // or any default value you prefer
          }


        }, (error: any) => {
          console.log(error);
        });
    }

    getOtherDocumentTypeName(documentTypeId: string | null): string {
      const OtherdocumentType = this.otherDocumentTypeDropdown.find(dt => dt.Id == documentTypeId);
      return OtherdocumentType ? OtherdocumentType.Name : 'N/A';
    }



  // CV Documents 


    isCVFileName: string = "";
    isCVUpload: boolean = false;
    lblCVValidation: string = "";

    //onSelectCVFile(event) {
    //  debugger;
    //  // called each time file input changes

    //  this.isCroppingImg1 = true;
    //  this.isCVUpload = true;
    //  if (event.target.files && event.target.files[0]) {
    //    this.isCVFileName = event.target.files[0].name;
    //    this.Filesize = event.target.files[0].size;
    //    var reader: FileReader = new FileReader();
    //    var self = this;
    //    reader.readAsDataURL(event.target.files[0]); // read file as data url
    //    this.updateImg = true;
    //    reader.onload = function (loadEvent: any) { // called once readAsDataURL is completed
    //      self.urlFile = loadEvent.target.result;
    //    }
    //  }
    //}

    onSelectCVFile(event) {
      // Called each time file input changes
      debugger;
      this.isCroppingImg1 = true;
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const fileName = file.name;
        const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

        // Convert CVFileTypeAllowed to an array of allowed extensions
        const allowedSource = this.CVFileTypeAllowed ? this.CVFileTypeAllowed : ".png, .jpg, .jpeg, .doc, .docx, .pdf";
        const allowedExtensions = allowedSource.split(',').map(function (ext) { return ext.trim().toLowerCase(); });

        // Check if the file extension is in the allowed extensions
        if (allowedExtensions.indexOf(fileExtension) >= 0) {
          this.isCVFileName = fileName;
          this.Filesize = file.size;

          const reader: FileReader = new FileReader();
          const self = this;

          reader.readAsDataURL(file); // Read file as data URL
          this.updateImg = true;

          reader.onload = function (loadEvent: any) { // Called once readAsDataURL is completed
            self.urlFile = loadEvent.target.result;
          }
          this.isCVUpload = true;
        } else {
          // Handle the case where the file is not allowed
          this.isCVUpload = false;
          alert('Please select a file with the following extensions:\n' + allowedSource);
        }
      }
    }

    SaveCVFile() {
      debugger;
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
        if (this.isCVFileName && this.isCVFileName.lastIndexOf('.') >= 0) {
          extension = this.isCVFileName.substring(this.isCVFileName.lastIndexOf('.') + 1).toLowerCase();
        }
        // get the real base64 content of the file
        var realData = block[1].split(",")[1];
        this.blob = this.b64toBlobDoc(realData, contentType);
        this.uniqueImgName = 'Doc-' + new Date().getTime() + "." + extension;
        this.SaveCVAttachment();
      }
    }

    SaveCVAttachment() {
      debugger;
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
      debugger;

      if (Type == 2) {
        this.clickRow = false;
      }
      var s = this._config.environment.baseUrl + Constants.GetApplicantDocuments+"?"
        + "AppId=" + localStorage.getItem("AppId")
        + "&Type=" + Type
        + "&DocId=" +DocId

      const filename = s.substring(s.lastIndexOf('/') + 1);


      const anchor = document.createElement('a');
      anchor.href = s;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }


    ViewEducationalDoc(Type, AppDocId) {
      debugger;

      if (Type == 3) {
        this.clickRow = false;
      }

     

      var fileUrl = this._config.environment.baseUrl + Constants.ViewEducationalDoc + "?"
        + "AppId=" + localStorage.getItem("AppId")
        + "&Type=" + Type
        + "&CompanyId=" + this.CompanyIdService.CompanyId
        + "&AppDocId=" + AppDocId

     
      const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

     
      const anchor = document.createElement('a');
      anchor.href = fileUrl;
      anchor.download = filename;  
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    
    }


    ViewOtherDoc(Type, AppDocId) {
      debugger;

      if (Type == 4) {
        this.clickRow = false;
      }

     
      var s = this._config.environment.baseUrl + Constants.ViewOtherDoc + "?"
        + "AppId=" + localStorage.getItem("AppId")
        + "&Type=" + Type
        + "&CompanyId=" + this.CompanyIdService.CompanyId
        + "&AppDocId=" + AppDocId


      window.open(s);
    }



    IsCVShow: any;
    
    DeleteDoc(Type, DocId) {
      debugger;
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

           if (Type == 1 && response.IsValid)
           {
             this.IsCVShow = false;


             $("#videoPopup1").modal('show');
             this.isTick = true;
             this.ApplyJobMsg = response.Msg;
             this.isfinance = false;

             this.getLastProfileUpdateValue(); 
           }

           if (Type == 2 && response.IsValid)
           {
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

    formSubmitted = false;

}
