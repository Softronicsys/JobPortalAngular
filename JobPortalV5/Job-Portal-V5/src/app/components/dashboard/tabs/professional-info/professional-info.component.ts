import { Component, OnInit, EventEmitter, Output, ViewChildren, QueryList, Input} from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
import { NgxSpinnerService } from 'ngx-spinner';
import { Action } from '../../../../Helper/Enums';
import { Constants } from '../../../../Helper/Constant';
import { UpdateProfileService } from '../../../../Service/UpdateProfile.service';
import { GetCompanyParameter } from '../../../../Service/CompanyParameter.service';
import { ThemeColorService } from '../../../../Service/ThemeColor.service';
import { AppConfigService } from '@app/Service/app-config.service';
import { Labels } from '@app/Service/DatabaseLbl.service';
import { DatePickerComponent } from '@app/Shared/date-picker/date-picker.component';
import { DatePipe } from '@angular/common';
import { DataService } from '@app/Shared/Services/data.services';
import { SharedDataService } from '@app/Shared/Services/shared-data.service';



@Component({
  selector: 'app-professional-info',
  templateUrl: './professional-info.component.html',
  styleUrls: ['./professional-info.component.css'],
  providers: [DatePipe]
})
export class ProfessionalInfoComponent implements OnInit {

  @Input() isFF: boolean;
  //@Input() MndEducationalDoc : boolean;


  @ViewChildren(DatePickerComponent) objDatePickerComponent: QueryList<DatePickerComponent>;

  @Output() getApplicantInfo: EventEmitter<any>;
  myDate = new Date();
  constructor(private datePipe: DatePipe, private Labels: Labels, private _config: AppConfigService, private http: HttpClient, private objRouter: Router,
    private toastr: ToastrService, private spinner: NgxSpinnerService, public updateProfService: UpdateProfileService,
    public CompanyIdService: GetCompanyParameter, public ClrThemeChng: ThemeColorService, private dataService: DataService, private sharedDataService: SharedDataService) {

    this.myDate1 = this.datePipe.transform(this.myDate, 'dd-MM-yyyy');
    //  console.log("klkllkklkklklklkllkl", this.myDate1);


    this.getApplicantInfo = new EventEmitter<any>();
  }
  isProfileImage: boolean = false;
  isProfileCompletion: boolean = false;
  isGrid: boolean = true;
  HRLooping: any[3] = [1, 2, 3];

  GiveLblToDshboard() {

    let RequestObject = {
      strengthBar: this.updateProfService.ProfilePercentage

    }

    this.getApplicantInfo.emit(RequestObject);

  }


  myDate1: any;

  DisconnectInternet: boolean = false;
  isUpdateAcademic: boolean = false;


  // New added for Relative
  isUpdateRelative: boolean = false;

  isMandatoryfields: boolean = false;
  isUpdateCertificate: boolean = false;
  isUpdateTraining: boolean = false;
  isUpdateExperience: boolean = false;
  isUpdateCompetencySkill: boolean = false;
  isUpdateProfessionalReference: boolean = false;
  isTick: boolean = false;
  SuccessMsg: string = "";

  minimum: string = "0";
  maximum: string = "4";


  isTextActive: boolean = false;
  isTextActiveInstitute: boolean = false;
  isTextActiveCertification: boolean = false;
  DateOfBirthForProf: any;

  RecommendedByEmpEmail: string = "testdevelopment135@gmail.com"
  Email: string = "testdevelopment135@gmail.com"
  // Decleartion Of Variables :

  // basic Info 1

  txtFirstrName: string = "";
  txtLastName: string = "";
  txtDateOB: string = "";

  // basic Info 2
  selectedBloodGroup: { Id: string, Name: string } | null = null;
  otherIncome: { Id: boolean, Name: string } | null = null;
  DisabilitySelect: { Id: boolean, Name: string } | null = null;
  OtherSourceofIncomeDetail: string = "";
  DisabilityDetail: string = "";

  // Contact Info

  txtAddress: string = "";
  txtTelMobile: string = "";

  // Bank Info 
  AccountNoIBAN_No: string = "";
  Accounttitle: string = "";
  ddlBankName: number = 0;
  // Father Info 
  FatherFullName: string = "";
  FatherPhoneNoCell: string = "";
  FatherOccupation: string = "";
  FatherIDCardNo: string = "";

  //Emergency Contact Information for binding

  EmergencyFullName: string = "";
  EmergencyPhoneNoCell: string = "";
  EmergencyRelation: string = "";
  //Relationshipdropdownid: string = "";


  //Conveyance  Information for binding
  selectedConveyance: { Id: boolean, Name: string } | null = null;
  selectedConveyanceType: { Id: string, Name: string } | null;
  Conveyancemake: string = "";
  ConveyanceModal: string = "";
  ConveyanceYear: string = "";
  ConveyancemakeRegNo: string = "";
  isOwnConveyance: string = "";
  ConveyanceType1: string = "";

  // Social Media

  SocialMediaId: string = "";
  SocialMediaTypeId: string = "";

  // Existing Insurance

  InsuranceType: string = "";
  InsuranceCompany: string = "";
  PolicyNumber: string = "";
  txtpolicyExpiryDate: string = "";

  // Financial Liabilities

  AssetDescription: string = "";


  Company_Name: string = "";

  //-Next Of Kin Informationfor binding

  NextOfKinName: string = "";
  NextOfKinPhonecell: string = "";
  NextOfKinAddress: string = "";


  Relationship1: { Id: string, Name: string } | null = null;  // Next of kin  info NgModel 


  //Dependents Information for binding

  DepenfirstName: string = "";
  DepenlastName: string = "";
  DependentDateOfBirth: string = "";
  DepenIdCardNo: string = "";

  selectedGender1: { Id: string, Name: string } | null = null;

  //Educational Documents for binding

  EduDocumentType: string = "";
  DoctypeId: string = "";
  EduDocumentTitle: string = "";
  EduDocFile: string = "";
  EduDocFilename: string = "";

  otherFileInput: string = "";



  ngOnInit() {

    debugger;

    this.checkIfMobile();

      //console.log(this.isFF);

        this.getCompanyParameter();
        this.SaveGridViewStyle(-1);
        //this.getApplicantData();

       
       
    }

    RelativeInCompanyLabelonly: string = "";
    RelativeInCompanyLabel: string = "";

    updateRelativeInAtco() {
      this.RelativeInCompanyLabelonly = this.CompanyIdService.CompanyShortName
      //console.log('Company Name in updateRelativeInAtco:', this.Comapany_Name);
      //console.log('New Name:', this.RelativeInCompanyLabel);


      this.RelativeInCompanyLabel = `Relative In ${this.CompanyIdService.CompanyShortName}`;
      //console.log(this.RelativeInCompanyLabel);
    }

  // Dropdown in Grid


    qualificationType: { Id: string, Name: string } | null;
    qualification_type = [
      { Id: "-1", Name: "N/A" },
      { Id: "1", Name: "Regular" },
      { Id: "2", Name: "Private" }
    ];


     // Relative in Atco

    RelativeinAtco: string = "";
    Relativedesignation: string = "";
    relation: string = "";

    Relationship2: { Id: string, Name: string } | null = null; // dependents info NgModel 
    //relativeInAtco: string = "-1";
    //items = [    //  { Id: "-1", Name: "-- Select --" },    //  { Id: "1", Name: "Yes" },    //  { Id: "2", Name: "No" }    //];

    workedInATCO: string = "-1";
    workedIn = [      { Id: "-1", Name: "-- Select --" },      { Id: "1", Name: "Yes" },      { Id: "2", Name: "No" }    ];

    referenceType: string = "-1";

    referenceTypes = [
      { Id: "-1", Name: "-- Select --" },
      { Id: "1", Name: "Relative" },
      { Id: "2", Name: "Non-Relative" }

    ];

    SaveGridViewStyle(IsNormalView) {
      debugger;
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
      debugger;

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

    isMobile: boolean = false;

    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;  // Adjust screen width threshold for mobile devices
      //console.log(window.innerWidth);
    }

    // For Labels //  

    showButton: boolean = false;
    CompetenciesSkills: string = "Competencies / Skills";
    ProfessionalReferences: string = "Professional References";
    lblDegree: string = "Degree";
    SpecializationSubject: string = "Specialization / Subject";
    EducationStatus: string = "Education Status";


    

    lblInstitute: string = "Institute"; 
    PercentageCGPA: string = "Percentage / CGPA";
    PassingYear: string = "Passing Year";
    Country: string = "Country";
    City: string = "City";
    RegularPrivate: string = "Regular / Private";

    lblScoreType: string = "Score Type"; 
    DateFrom: string = "Date From";
    lblDateofcompletion: string = "Date of completion";
    Certification: string = "Certifications";
    lblDateofAchievement: string = "Date of Achievement";

    lblDateofExpiry: string = "Date of Expiry"; 
    Institutes: string = "Institute";
    lblCurrentLastBenefits: string = "Current / Last Benefits";
    EmployerPhoneNo: string = "Employer Phone No.";
    EmployerAddress: string = "Employer Address";

    lblIamcurrentlyworkinghere: string = "I am currently working here"; 
    Competency: string = "Competency";
    AcademicQualifications: string = "Academic Qualifications";
    lblCertifications: string = "Certification";
    Trainings: string = "Trainings";

    Experience: string = "Experience"; 
    Address: string = "Address";
    lblCourseTitle: string = "Course Title";
    lblTrainingSubject: string = "Training Subject";
    DateTo: string = "Date To";

    Company: string = "Company"; 
    Designation: string = "Designation";
    lblJobResponsibilities: string = "Job Responsibilities";
    LeavingReason: string = "Leaving Reason";
    CurrentLastSal: string = "Current / Last Salary";

    //RelativeInAtco: string = "Relative In ATCO";
    FullName: string = "Full Name";
    Relation: string = "Relation";
    Designation_Department: string = "Designation / Department";



    

    lblCurrency: string = "Currency"; 
    RequiredRating: string = "Required Rating";
    Name: string = "Name";
    ProfessionalRelationship: string = "Professional Relationship";
    lblCompanyCurrent: string = "Company (Current)";

    ReportingTo: string = "Reporting To (Name & Designation)"; 
    APEmail: string = "Email";
    AddressType: string = "Address Type";
    PostalAddress: string = "Postal Address";
    Add: string = "Add";

    Save: string = "Save"; 
    lblSettings: string = "Settings";
    ProfessionalInformation: string = "Professional Information";
    lblProfessionalInfo: string = "";
    nodata: string = "No data";
    lblremarks: string = "Remarks";
    ContactNumber: string = "Contact Number";
    
   

    getLabels() {
        
        if (this.Labels.dashLabels == true) {
          if (this.Labels.CompetenciesSkills != "" && !isNullOrUndefined(this.Labels.CompetenciesSkills))
            this.CompetenciesSkills = this.Labels.CompetenciesSkills;

          if (this.Labels.ProfessionalReferences != "" && !isNullOrUndefined(this.Labels.ProfessionalReferences))
            this.ProfessionalReferences = this.Labels.ProfessionalReferences;

          if (this.Labels.ProfessionalReferences != "" && !isNullOrUndefined(this.Labels.ProfessionalReferences))
            this.ProfessionalReferences = this.Labels.ProfessionalReferences;

          if (this.Labels.Degree != "" && !isNullOrUndefined(this.Labels.Degree))
            this.lblDegree = this.Labels.Degree;

          if (this.Labels.SpecializationSubject != "" && !isNullOrUndefined(this.Labels.SpecializationSubject))
            this.SpecializationSubject = this.Labels.SpecializationSubject;

          if (this.Labels.EducationStatus != "" && !isNullOrUndefined(this.Labels.EducationStatus))
            this.EducationStatus = this.Labels.EducationStatus;

          if (this.Labels.Institute != "" && !isNullOrUndefined(this.Labels.Institute))
            this.lblInstitute = this.Labels.Institute;

          if (this.Labels.PercentageCGPA != "" && !isNullOrUndefined(this.Labels.PercentageCGPA))
            this.PercentageCGPA = this.Labels.PercentageCGPA;

          if (this.Labels.PassingYear != "" && !isNullOrUndefined(this.Labels.PassingYear))
            this.PassingYear = this.Labels.PassingYear;

          if (this.Labels.Country != "" && !isNullOrUndefined(this.Labels.Country))
            this.Country = this.Labels.Country;

          if (this.Labels.City != "" && !isNullOrUndefined(this.Labels.City))
            this.City = this.Labels.City;

          if (this.Labels.ScoreType != "" && !isNullOrUndefined(this.Labels.ScoreType))
            this.lblScoreType = this.Labels.ScoreType;

          if (this.Labels.DateFrom != "" && !isNullOrUndefined(this.Labels.DateFrom))
            this.DateFrom = this.Labels.DateFrom;

          if (this.Labels.lblDateofcompletion != "" && !isNullOrUndefined(this.Labels.lblDateofcompletion))
            this.lblDateofcompletion = this.Labels.lblDateofcompletion;

          if (this.Labels.Certification != "" && !isNullOrUndefined(this.Labels.Certification))
            this.Certification = this.Labels.Certification;

          if (this.Labels.lblDateofAchievement != "" && !isNullOrUndefined(this.Labels.lblDateofAchievement))
            this.lblDateofAchievement = this.Labels.lblDateofAchievement;

          if (this.Labels.DateofExpiry != "" && !isNullOrUndefined(this.Labels.DateofExpiry))
            this.lblDateofExpiry = this.Labels.DateofExpiry;

          if (this.Labels.Institutes != "" && !isNullOrUndefined(this.Labels.Institutes))
            this.Institutes = this.Labels.Institutes;

          if (this.Labels.lblCurrentLastBenefits != "" && !isNullOrUndefined(this.Labels.lblCurrentLastBenefits))
            this.lblCurrentLastBenefits = this.Labels.lblCurrentLastBenefits;

          if (this.Labels.EmployerPhoneNo != "" && !isNullOrUndefined(this.Labels.EmployerPhoneNo))
            this.EmployerPhoneNo = this.Labels.EmployerPhoneNo;

          if (this.Labels.EmployerAddress != "" && !isNullOrUndefined(this.Labels.EmployerAddress))
            this.EmployerAddress = this.Labels.EmployerAddress;

          if (this.Labels.lblIamcurrentlyworkinghere != "" && !isNullOrUndefined(this.Labels.lblIamcurrentlyworkinghere))
            this.lblIamcurrentlyworkinghere = this.Labels.lblIamcurrentlyworkinghere;

          if (this.Labels.Competency != "" && !isNullOrUndefined(this.Labels.Competency))
            this.Competency = this.Labels.Competency;

          if (this.Labels.AcademicQualifications != "" && !isNullOrUndefined(this.Labels.AcademicQualifications))
            this.AcademicQualifications = this.Labels.AcademicQualifications;

          if (this.Labels.Certifications != "" && !isNullOrUndefined(this.Labels.Certifications))
            this.lblCertifications = this.Labels.Certifications;

          if (this.Labels.Trainings != "" && !isNullOrUndefined(this.Labels.Trainings))
            this.Trainings = this.Labels.Trainings;

          if (this.Labels.Experience != "" && !isNullOrUndefined(this.Labels.Experience))
            this.Experience = this.Labels.Experience;

          if (this.Labels.Address != "" && !isNullOrUndefined(this.Labels.Address))
            this.Address = this.Labels.Address;

          if (this.Labels.lblCourseTitle != "" && !isNullOrUndefined(this.Labels.lblCourseTitle))
            this.lblCourseTitle = this.Labels.lblCourseTitle;

          if (this.Labels.TrainingSubject != "" && !isNullOrUndefined(this.Labels.TrainingSubject))
            this.lblTrainingSubject = this.Labels.TrainingSubject;

          if (this.Labels.DateTo != "" && !isNullOrUndefined(this.Labels.DateTo))
            this.DateTo = this.Labels.DateTo;

          if (this.Labels.Company != "" && !isNullOrUndefined(this.Labels.Company))
            this.Company = this.Labels.Company;

          if (this.Labels.Designation != "" && !isNullOrUndefined(this.Labels.Designation))
            this.Designation = this.Labels.Designation;

          if (this.Labels.lblJobResponsibilities != "" && !isNullOrUndefined(this.Labels.lblJobResponsibilities))
            this.lblJobResponsibilities = this.Labels.lblJobResponsibilities;

          if (this.Labels.LeavingReason != "" && !isNullOrUndefined(this.Labels.LeavingReason))
            this.LeavingReason = this.Labels.LeavingReason;

          if (this.Labels.CurrentLastSal != "" && !isNullOrUndefined(this.Labels.CurrentLastSal))
            this.CurrentLastSal = this.Labels.CurrentLastSal;

          if (this.Labels.Currency != "" && !isNullOrUndefined(this.Labels.Currency))
            this.lblCurrency = this.Labels.Currency;

          if (this.Labels.RequiredRating != "" && !isNullOrUndefined(this.Labels.RequiredRating))
            this.RequiredRating = this.Labels.RequiredRating;

          if (this.Labels.Name != "" && !isNullOrUndefined(this.Labels.Name))
            this.Name = this.Labels.Name;

          if (this.Labels.ProfessionalRelationship != "" && !isNullOrUndefined(this.Labels.ProfessionalRelationship))
            this.ProfessionalRelationship = this.Labels.ProfessionalRelationship;

          if (this.Labels.lblCompanyCurrent != "" && !isNullOrUndefined(this.Labels.lblCompanyCurrent))
            this.lblCompanyCurrent = this.Labels.lblCompanyCurrent;

          if (this.Labels.ReportingTo != "" && !isNullOrUndefined(this.Labels.ReportingTo))
            this.ReportingTo = this.Labels.ReportingTo;

          if (this.Labels.APEmail != "" && !isNullOrUndefined(this.Labels.APEmail))
            this.APEmail = this.Labels.APEmail;

          if (this.Labels.AddressType != "" && !isNullOrUndefined(this.Labels.AddressType))
            this.AddressType = this.Labels.AddressType;

          if (this.Labels.PostalAddress != "" && !isNullOrUndefined(this.Labels.PostalAddress))
            this.PostalAddress = this.Labels.PostalAddress;

          if (this.Labels.Add != "" && !isNullOrUndefined(this.Labels.Add))
            this.Add = this.Labels.Add;

          if (this.Labels.Save != "" && !isNullOrUndefined(this.Labels.Save))
            this.Save = this.Labels.Save;

          if (this.Labels.lblSettings != "" && !isNullOrUndefined(this.Labels.lblSettings))
            this.lblSettings = this.Labels.lblSettings;

          if (this.Labels.ProfessionalInformation != "" && !isNullOrUndefined(this.Labels.ProfessionalInformation))
            this.ProfessionalInformation = this.Labels.ProfessionalInformation;

          if (this.Labels.lblProfessionalInfo != "" && !isNullOrUndefined(this.Labels.lblProfessionalInfo))
            this.lblProfessionalInfo = this.Labels.lblProfessionalInfo;

          if (this.Labels.Nodata != "" && !isNullOrUndefined(this.Labels.Nodata))
            this.nodata = this.Labels.Nodata;

          if (this.Labels.Remarks != "" && !isNullOrUndefined(this.Labels.Remarks))
            this.lblremarks = this.Labels.Remarks;

          if (this.Labels.ContactNumber != "" && !isNullOrUndefined(this.Labels.ContactNumber))
            this.ContactNumber = this.Labels.ContactNumber;
        }
    }

    public PostData(model, url: string, headers: any,callback?) {

        

        if (navigator.onLine) {
            const retVal = this.http.post(url, model, headers)
                .subscribe((response: any) => {
                    this.getLastProfileUpdateValue();
                    this.GiveLblToDshboard();
                    

                    if (response.isValid == false) {

                        //this.toastr.warning(response.Msg, '', {
                        //    positionClass: "toast-bottom-right",
                        //});
                        $("#SuccessPopup").modal('show');
                        this.isTick = false;
                        this.SuccessMsg = response.Msg;
                        
                    }
                    else {
                      if (this.isUpdateAcademic == false && this.isUpdateRelative == false && this.isUpdateCertificate == false && this.isUpdateTraining == false && this.isUpdateExperience == false && this.isUpdateCompetencySkill == false && this.isUpdateProfessionalReference == false) {
                            if (response.Msg) {
                                //this.toastr.success(response.Msg, '', {
                                //    positionClass: "toast-bottom-right",
                                //});
                                $("#SuccessPopup").modal('show');
                                this.isTick = true;
                                this.SuccessMsg = response.Msg;

                                this.getQualificationDetail();
                                
                                this.getCertificationDetail();
                                this.getTrainingDetail();
                                this.getExperienceDetail();
                                this.getCompetencySkillsDetail();
                                this.getProfessRefDetail();
                                this.getLastProfileUpdateValue();

                                this.GetRelativeGrid();
                            }
                            if (response.msg) {
                                //this.toastr.success(response.msg, '', {
                                //    positionClass: "toast-bottom-right",
                                //});
                                $("#SuccessPopup").modal('show');
                                this.isTick = true;
                                this.SuccessMsg = response.Msg;

                            }
                            this.getLastProfileUpdateValue();

                        }
                        else {
                            //this.toastr.success(response.Msg, '', {
                            //    positionClass: "toast-bottom-right",
                            //});
                                 $("#SuccessPopup").modal('show');
                                this.isTick = true;
                                this.SuccessMsg = response.Msg;

                            this.getLastProfileUpdateValue();
                            this.getQualificationDetail();
                            this.GetRelativeGrid();
                            this.getCertificationDetail();
                            this.getTrainingDetail();
                            this.getExperienceDetail();
                            this.getCompetencySkillsDetail();
                            this.getProfessRefDetail();

                        }
                        this.getLastProfileUpdateValue();

                    }
                    this.HideSpinner();
                    this.popuphide();

                }, (error: any) => {
                    alert("Invalid Data.");
                });
        }
        else {

            this.DisconnectInternet = true;
        }
    }




    popuphide() {
        
        setTimeout(() => {

            $("#SuccessPopup").modal('hide');

        }, 4400)
    }

    GetFF_Value: boolean;


    // for CompanyID //

    getCompanyParameter() {

        this.openSpinner();
        let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;
        this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {
          this.CompanyIdService.CompanyId = response.CompanyId;
          //console.log(this.CompanyIdService.CompanyId);
            this.CompanyIdService.CompanyName = response.CompanyName;
            this.CompanyIdService.CompanyShortName = response.CompanyShortName;
            //console.log(response.CompanyShortName);
            this.CompanyIdService.RedirectPath = response.RedirectPath;
            this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
            this.getLastProfileUpdateValue();

            this.getLabels();

            //this.GetFF_Value = response.isFFEnable;

            //console.log(this.GetFF_Value)



            // Check if GetFF_Value is true
            if (this.isFF) {

              this.getJobPortalConfigurationFF();

            } else {
              this.getJobPortalConfiguration1();
            }
           // this.Color();
            this.getApplicantData();
            this.getQualificationDetail();
            
          
            this.getCertificationDetail();
            this.getTrainingDetail();
            this.getExperienceDetail();
            this.getCompetencySkillsDetail();
            this.getProfessRefDetail();

            this.updateRelativeInAtco();
            this.getRelationDropdown();
            this.GetRelativeGrid();

            if (this.isFF) {
            this.getRecommendedEmployeeId();
            }

            // dropdown // 
            this.getDegree();
            this.getInstitute();
            this.getCountriesDropdown();
            this.getCertifications();
            this.getTrainingSubject();
            this.getCurrency();
            this.getCompetencyLevel3();
            this.getRating();
        //    this.getCitiesByCountryIdDropdown();
            this.getCitiesDropdown();
           

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


    // For Bithday //
    //DateOB: string = "";

    //onApplicantInfo(eventData: any) {
    //    
    //    this.DateOB = eventData.dateOB;
    //}



    // Popup for Delete //

    delQualification: any;

   // New added

    delRelative: any;
   
    delCertification: any;
    delTraining: any;
    delExperience: any;
    delCompetency: any;
    delprofessionalRef: any;

    isqlf: boolean = false;

   // New added
    isRelative: boolean = false;

    iscrt: boolean = false;
    istrn: boolean = false;
    isexp: boolean = false;
    iscom: boolean = false;
    ispro: boolean = false;

   

    setId(item) {
        this.clickRow = false;

        if (!isNullOrUndefined(item.Recqlfid)) {
            this.delQualification = item.Recqlfid;
            this.isqlf = true;
        }
        else if (!isNullOrUndefined(item.appcrtid)) {
            this.delCertification = item.appcrtid;
            this.iscrt = true;
        }
        else if (!isNullOrUndefined(item.TrnId)) {
            this.delTraining = item.TrnId;
            this.istrn = true;
        }
        else if (!isNullOrUndefined(item.RecJobid)) {
            this.delExperience = item.RecJobid;
            this.isexp = true;
        }
        else if (!isNullOrUndefined(item.RCId)) {
            this.delCompetency = item.RCId;
            this.iscom = true;
        }
        else if (!isNullOrUndefined(item.Refid)) {
            this.delprofessionalRef = item.Refid;
            this.ispro = true;
        }

        else if (!isNullOrUndefined(item.RecRelid)) {
          this.delRelative = item.RecRelid;
          this.isRelative = true;
        }
    }
    setIdForNo() {
        

        this.delQualification = "";
        this.delCertification = "";
        this.delTraining = "";
        this.delExperience = "";
        this.delCompetency = "";
        this.delprofessionalRef = "";
        this.delRelative = "";


    }

    removeMsg() {
        this.SuccessMsg = "";
        this.isTick = false;
    }


    // other Degree //

    otherDegree() {
        
        if (this.OtherddlDegree !== "" ) {
            this.OtherddlDegree = '';
            return;
        } 
        if (this.OtherddlDegree == ""){
            this.isTextActive = false;
            this.ddlDegree = '';
            this.getDegree();
            return;
        }
    }


    // Still Working on Company //

    marked: boolean = false;
    StillWorking: boolean = true;
    
    toggleVisibility(e) {


        
       
        if (this.StillWorking) {
            this.resetDate();
            this.ExperienceLeavingReason = "";
            this.txtExperienceDateTo = "";
            this.ExperienceLeavingReason = "";

        } else {
          
            this.marked = false;

        }
    }



    // other Institute //

    otherInstitute() {
        
        if (this.OtherInstituteAcademic !== "") {
            this.OtherInstituteAcademic = '';
            return;
        }
        if (this.OtherInstituteAcademic == ""){
            this.isTextActiveInstitute = false;
            this.Institute;
            this.getInstitute();
            return;
        }
        if (this.OtherInstituteCertification !== "") {
            this.OtherInstituteCertification = '';
            return;
        }
        if (this.OtherInstituteCertification == "") {
            this.isTextActiveInstitute = false;
            this.Institute;
            this.getInstitute();
            return;
        }
    }


    otherInstitute1() {
        

        if (this.OtherInstituteCertification !== "") {
            this.OtherInstituteCertification = '';
            return;
        }
        if (this.OtherInstituteCertification == "") {
            this.isTextActiveInstitute = false;
            this.Institute = "11";
            this.getInstitute();
            return;
        }
    }

    // other certification // 

    otherCertication() {
        
        if (this.OtherCertification !== ""){
            this.OtherCertification = '';
            return;
        }
        if (this.OtherCertification == "") {
            this.isTextActiveCertification = false;
            this.crtid = "44";
            this.getCertifications();
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
                
                this.updateProfService.LastProfileUpdateValue = response.ProfileLastUpdate;
                this.updateProfService.ProfilePercentage = response.ProfilePercentage;
                this.GiveLblToDshboard();
                //this.LastProfileUpdateValue = response;
            }, (error: any) => {
                console.log(error);
            });
    }


    ChangeTheme: any;
    VisFinancialLiabilities: any;
    VisExisitingInsuranceDetail: any;
    VisSocialMediaConnections: any;
    VisDocumentAttachment: any;
    VisAcademicQualifications: any;

     // New Added.
    VisRelativeInAtco: any;
    //  End.

    VisCertifications: any;
    VisTrainings: any;
    VisExperience: any;
    VisCompetenciesSkills: any;
    VisProfessionalReferences: any;
    VisMaritalStatus: any;
    VisReligion: any;
    VisLegalHistory: any;
    VisPersonalAttributes: any;

    MndAcademicQualifications: boolean = false
    MndCertifications: boolean = false
    MndCompetenciesSkills: boolean = false
    MndExperience: boolean = false
    MndProfessionalReferences: boolean = false
    MndTrainings: boolean = false

     // New Added.

    MndRelativeInAtco: boolean = false
 
     // End


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

    getJobPortalConfiguration1() {
      debugger;
        let RequestObject = {

            CompanyId: this.CompanyIdService.CompanyId,
        };
        let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
        this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
            // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
            .subscribe((response: any) => {

                this.ClrThemeChng.ChangeTheme = response.ThemeColor;
                this.VisAcademicQualifications = response.VisAcademicQualifications;

                 // New Added.

                this.VisRelativeInAtco = response.VisRelativeInAtco;
                // End FF

                this.VisCertifications = response.VisCertifications;
                this.VisTrainings = response.VisTrainings;
                this.VisExperience = response.VisExperience;
                this.VisCompetenciesSkills = response.VisCompetenciesSkills;
                this.VisProfessionalReferences = response.VisProfessionalReferences;

                this.MndAcademicQualifications = response.MndAcademicQualifications;
                this.MndCertifications = response.MndCertifications;
                this.MndCompetenciesSkills = response.MndCompetenciesSkills;
                this.MndExperience = response.MndExperience;
                this.MndProfessionalReferences = response.MndProfessionalReferences;
                this.MndTrainings = response.MndTrainings;

               // New Added.
                this.MndRelativeInAtco = response.MndRelativeInAtco;
               // End

                // New Added.

                // For Basic Info 2 Fields  
                this.VisIDCardExpiry = response.VisIDCardExpiry;
                this.VisBloodGroup = response.VisBloodGroup;
                this.VisDrivingLicenseNo = response.VisDrivingLicenseNo;
                this.VisDrivingLicenseExpiry = response.VisDrivingLicenseExpiry;
                this.VisIsSpouseEmployed = response.VisIsSpouseEmployed;
                this.VisAnyotherSourceofIncome = response.VisAnyotherSourceofIncome;
                this.VisAnyPhysicalDisability = response.VisIDCardExpiry;

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
                //console.log(this.MndBnkInfo);
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


                this.Color();
                this.HideSpinner();

            })
    }


    ApplicantData: any;

    ApprovalStatus: string = "";
    SubmissionDate: string = "";


    getApplicantData() {
      debugger;
     
      let RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId,


      }
      this.openSpinner();
      let GetApplicantDataForApproval = this._config.environment.baseUrl + Constants.GetApplicantDataForApproval;
      this.http.post(GetApplicantDataForApproval, RequestObject, { headers: this.dataService.headers })
        // this.http.post("https://jobportalapi.azurewebsites.net/GetApplicantDataForApproval", RequestObject)
        .subscribe((response: any) => {
          //console.log('data : ', response.Data);
          this.ApplicantData = response.Data;

          this.HideSpinner();

          const row = response && response.Data && response.Data.length > 0 ? response.Data[0] : null;
          if (!row) {
            this.ApprovalStatus = '';
            this.SubmissionDate = '';
            return;
          }

          this.ApprovalStatus = row.ApprovalStatus;
          this.SubmissionDate = row.SubmissioDate;

          //console.log(this.SubmissionDate);

          //console.log(this.ApprovalStatus);
         
        }, (error: any) => {

          console.log(error);
        });
    }


    RecommendedEmpId: any;
    RecommendedEmpEmail: string = "";

    getRecommendedEmployeeId() {

      let RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId,

      }
      this.openSpinner();
      let GetRecommendedEmpId = this._config.environment.baseUrl + Constants.GetRecommendedEmpId;
      this.http.post(GetRecommendedEmpId, RequestObject, { headers: this.dataService.headers })
        // this.http.post("https://jobportalapi.azurewebsites.net/GetRecommendedEmpId", RequestObject)
        .subscribe((response: any) => {
          //console.log('data : ', response.Data);
          this.RecommendedEmpId = response.RecommendedEmpId;
          this.RecommendedEmpEmail = response.Email;
          this.HideSpinner();

          //this.ApprovalStatus = response.Data[0].ApprovalStatus;
          //console.log(this.RecommendedEmpId);

          //console.log(this.RecommendedEmpEmail);

        }, (error: any) => {

          console.log(error);
        });
    }


    getJobPortalConfigurationFF() {
      let RequestObject = {

        CompanyId: this.CompanyIdService.CompanyId,
      };
      let GetJobPortalConfiguration_FF = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration_FF;
      this.http.post(GetJobPortalConfiguration_FF, RequestObject, { headers: this.dataService.headers })
        // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration_FF")
        .subscribe((response: any) => {

          if (response != null && response !== undefined) {

          this.ClrThemeChng.ChangeTheme = response.ThemeColor;
          this.VisAcademicQualifications = response.VisAcademicQualificationsFF;

          // New Added.
          this.VisRelativeInAtco = response.VisRelativeInAtcoFF;
          // End FF

          this.VisCertifications = response.VisCertificationsFF;
          this.VisTrainings = response.VisTrainingsFF;
          this.VisExperience = response.VisExperienceFF;
          this.VisCompetenciesSkills = response.VisCompetenciesSkillsFF;
          this.VisProfessionalReferences = response.VisProfessionalReferencesFF;
          //console.log(response.VisProfessionalReferencesFF);
          this.MndAcademicQualifications = response.MndAcademicQualificationsFF;
          this.MndCertifications = response.MndCertificationsFF;
          this.MndCompetenciesSkills = response.MndCompetenciesSkillsFF;
          this.MndExperience = response.MndExperienceFF;
          this.MndProfessionalReferences = response.MndProfessionalReferencesFF;
          this.MndTrainings = response.MndTrainingsFF;

          // New Added.
          this.MndRelativeInAtco = response.MndRelativeInAtcoFF;
          // End

          // New Added.

          // For Basic Info 2 Fields  
          this.VisIDCardExpiry = response.VisIDCardExpiryFF;
          this.VisBloodGroup = response.VisBloodGroupFF;
          this.VisDrivingLicenseNo = response.VisDrivingLicenseNoFF;
          this.VisDrivingLicenseExpiry = response.VisDrivingLicenseExpiryFF;
          this.VisIsSpouseEmployed = response.VisIsSpouseEmployedFF;
          this.VisAnyotherSourceofIncome = response.VisAnyotherSourceofIncomeFF;
          this.VisAnyPhysicalDisability = response.VisIDCardExpiryFF; // Typo: Should it be VisAnyPhysicalDisability?

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

          // End 

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

          // New Added.

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

          this.MndBnkInfo = response.MndBnkInfoFF;
          //console.log(this.MndBnkInfo);
          this.MndFathersInfo = response.MndFathersInfoFF;
          this.MndEmergencyContctInfo = response.MndEmergencyContctInfoFF;
          this.MndConveyanceInfo = response.MndConveyanceInfoFF;
          this.MndEducationalDoc = response.MndEducationalDocFF;
          this.MndOtherDoc = response.MndOtherDocFF;
          this.MndNextOfKinInfo = response.MndNextOfKinInfoFF;
          this.MndDepndsInfo = response.MndDepndsInfoFF;

          //  End

          this.MndSocialMediaConnections = response.MndSocialMediaConnectionsFF;
          this.MndWhenCanYouJoin = response.MndWhenCanYouJoinFF;
          this.MndermanentAddress = response.MndermanentAddressFF;


          this.Color();
          this.HideSpinner();


        } else
          {
            console.log("No data received from the API");
          }
        }, (error) => {
            console.error("Error occurred while fetching job portal configuration:", error);
          });
    
    }


    validatePhoneNumber(phone: string): boolean {
      const phonePattern = /^923\d{9}$/;
      return phonePattern.test(phone);
    }



    openSpinner() {
        

        /** spinner starts on init */
        this.spinner.show();
    }

    ///Validate on Submit

   

    SaveRecords() {
      this.openSpinner();
      this.Validate(); 
    }

     
    

   

    closepopupError() {
      $('#myModal50').modal('hide');
    }

    closepopupSuccess() {
      $('#myModal40').modal('hide');
    }

    HideSpinner() {
        

        /** spinner starts on init */
        this.spinner.hide();
    }

    //resetDate() {

    //    $("#reset-date").click(function () {
    //        $('#datepicker').val("").datepicker("update");
    //    })

    //}


    btnAdd_Click1() {
      //  this.marked = false;
      //  this.StillWorking = false;
        this.ProvideValidDate = false;
        this.isMandatoryfields = false;


        this.isTextActive = false;
        this.isTextActiveInstitute = false;
        this.isTextActiveCertification = false;
      //  this.StillWorking = false;
        this.isPercentageValidation = false;
        this.isCGPAValidation = false;
        this.isDateValid = false;
        this.isbirthday1 = false;
        this.isbirthday = false;

     //   this.isDateValid = false;
     //   this.isdatefrom = false;

        this.isdatefromandcompletion = false;

    
    }

 
    isNullDate: string = "";

    btnAdd_Click(Identifier) {

        this.isCorrectDateAcademic = false;
        this.isCorrectDateCertificate = false;
        this.isCorrectDateTraining= false;
        this.isCorrectDateExperience = false;
        this.isCorrectDateCompetency = false;
        this.isCorrectDateRefference = false;


        this.isCurrentDate = false;
        //for Toggle
      //  e.target.checked = false;
        this.marked = false;
        this.StillWorking = false;
        this.ProvideValidDate = false;
        //this.toggleVisibility(e);
       
        this.crtid = '';

        this.isMandatoryfields = false;
        this.showPhoneNumberError = false;

        // New Added
        this.isRelativeinCompany = false;

        this.isTextActive = false;
        this.isTextActiveInstitute = false;
        this.isTextActiveCertification = false;
      //  this.StillWorking = false;
        this.isPercentageValidation = false;
        this.isCGPAValidation = false;
        this.isDateValid = false;
        this.isbirthday1 = false;
        this.isbirthday = false;

        this.isUpdateAcademic = false;

        // New added
        this.isUpdateRelative = false;


        this.isUpdateCertificate = false;
        this.isUpdateCompetencySkill = false;
        this.isUpdateExperience = false;
        this.isUpdateProfessionalReference = false;
        this.isUpdateTraining = false;
        this.isDateValid = false;
        this.isdatefrom = false;
        this.isDateValid1 = false;

        this.isdatefromandcompletion = false;

        this.EnterPercentage = false;
        this.EnterGPA = false;
        //this.ddlDegree = '';
        //this.Institute = '';
        //this.crtid = '';

        if (Identifier == "AcademicQual")
        {
          // for Academic Qualification //
          //this.ddlDegree = '15';
          this.Specialization = "";
          this.qualificationstatus = "";
          //this.institute = '11';
          this.txtAcademicDateFrom = "";
          this.txtAcademicDateOfCompletion = "";
          this.ScoreType = "";
          this.qualificationType = this.qualification_type.find(qualifictiontyp => qualifictiontyp.Id == '-1') || null;

          this.Grade = "";
          this.selectedCountryAcademic = "";
          this.OtherddlDegree = '';
          this.AcademicDateFrom = "";
          this.AcademicDateTo = "";
          console.log('from' + this.getControlDate(this.txtAcademicDateFrom))
          console.log('To' + this.getControlDate(this.txtAcademicDateOfCompletion))
          this.defaultAcademicDateFrom = this.getControlDate(this.txtAcademicDateFrom);
          this.defaultAcademicDateOfCompletion = this.getControlDate(this.txtAcademicDateOfCompletion);
        //this.defaultAcademicDateFrom = this.getControlDate(this.AcademicDateFrom);
        //this.defaultAcademicDateOfCompletion = this.getControlDate(this.AcademicDateFrom);
        }

        if (Identifier == "Certification")
        {
          // for Certification //
          //this.crtid = "44";
          this.txtCertificateDateOfAchievement = "";
          this.txtCertificateDateOfExpiry = "";
          this.Score = "";
          this.ScoreTypeCertificate = "";
          //this.Institute = "11";
          this.CountryCertificate = "";
          this.CertificateAddress = "";
          this.selectedCountry = 1;
          this.CertificateDateFrom = "";
          this.CertificateDateTo = "";
          this.defaultCertificateDateOfAchievement = this.getControlDate(this.CertificateDateFrom);
          this.defaultCertificateDateOfExpiry = this.getControlDate(this.CertificateDateTo);
        //this.defaultCertificateDateOfAchievement = "";
        //this.defaultCertificateDateOfExpiry = "";
        }

        if (Identifier == "Relative")
        {
          // for Relative //
          this.RelativeinAtco = '';
          this.Relativedesignation = '';
          this.Relationship2 = this.RelationshipDropdown[0] || null;
        }



        if (Identifier == "Training") {
          // for Training //

          this.TrainingCourseTitle = "";
          this.txtTrainingDateFrom = "";
          this.txtTrainingDateTo = "";
          this.InstituteTrainigTextBox = "";
          //this.Institute = "11";
          this.TrainingCountry = "";
          this.TrainingTrainingSubject = "375";
          this.Trianingdatefrom = "";
          this.TrianingdateTo = "";
          this.defaultTrainingDateFrom = this.getControlDate(this.Trianingdatefrom);
          this.defaultTrainingDateTo = this.getControlDate(this.TrianingdateTo);
        //this.defaultTrainingDateFrom = "";
        //this.defaultTrainingDateTo = "";
        }
        
        if (Identifier == "Experience") {
          // for Experience //

          this.ExperienceCompany = "";
          this.ExperiencePhone = "";
          this.ExperienceDesignation = "";
          this.txtExperienceDateFrom = "";
          this.txtExperienceDateTo = "";
          this.ExperienceJobResponsibilities = "";
          this.ExperienceLeavingReason = "";
          this.ExperienceSalary = "";
          this.ExperienceAddress = "";
          this.ExperienceBenefit = "";
          this.ExperienceCurrency = "126";
          this.ExperienceDateFrom = "";
          this.ExperienceDateTo = "";
          this.defaultExperienceDateFrom = this.getControlDate(this.ExperienceDateFrom);
          this.defaultExperienceDateTo = this.getControlDate(this.ExperienceDateTo);
          //    this.StillWorking = false;
          this.marked = false;
        //this.defaultExperienceDateFrom = "";
        //this.defaultExperienceDateTo = "";
        }
        
        if (Identifier == "ComptenciesSkill")
        {
          // for Competency skill //
          this.ddlCompetency = '';
          this.ddlRequiRatingCompetency = '';
          this.RemarksCompetency = '';
        }
        

        if (Identifier == "ProfReference") {
          // for Professional reference //
          this.NameProfessionalReference = "";
          this.DesignationProfessionalReference = "";
          this.CurrentCompanyProfessionalReference = "";
          this.ContactNumberProfessionalReference = "";
          this.EmailProfessionalReference = "";
          this.ReportingToProfessionalReference = "";
          this.RelationshipProfessionalReference = "";
          this.PostalAddressProfessionalReference = "";
          this.AddressTypeProfessionalReference = "";
        }


     

        this.getDegree();
        this.getInstitute();
       this.getCountriesDropdown();
        this.getCertifications();
        this.getTrainingSubject();
        this.getCurrency();
        this.getCompetencyLevel3();
        this.getRating();
       this.getCitiesDropdown();
   //   this.getCitiesByCountryIdDropdown();
      this.resetDate();
    }



    // All Dropdown //

    dldEducationalStatus: string = "";
    ddlScoreType: string = "";
    ddlScoreType1: string = "";
    ddlAddressType: string = "";


    // for Degree // 

    Degree: string = "";
    DegreeDropdown: any;


    getDegree() {
        let RequestObject = {

            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId,

        }

        let getDegree = this._config.environment.baseUrl + Constants.GetDegree + "?Culture=" + Constants.Culture;
        this.http.post(getDegree, RequestObject, { headers: this.dataService.headers })
            //  this.http.get("https://jobportalapi.azurewebsites.net/GetDegree?Culture=en-GB")
            .subscribe((response: any) => {

                this.DegreeDropdown = response;
                if (!isNullOrUndefined(this.DegreeDropdown) && this.DegreeDropdown.length > 0)
                  this.ddlDegree = this.DegreeDropdown[0].Id;
                //alert(this.ddlDegree)
            }, (error: any) => {
                console.log(error);
            });
    }



    onPaste(event: ClipboardEvent) {
        
        let clipboardData = event.clipboardData;
        let pastedText = clipboardData.getData('text');

    }

    // for Institute // 

    Institute: string = "";
    InstituteDropdown: any;


    getInstitute() {
        let RequestObject = {

            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId,

        }
        let getInstitute = this._config.environment.baseUrl + Constants.GetInstitute + "?Culture=" + Constants.Culture;
        this.http.post(getInstitute, RequestObject, { headers: this.dataService.headers })
            //  this.http.get(" https://jobportalapi.azurewebsites.net/GetInstitute?Culture=en-GB")
            .subscribe((response: any) => {

                this.InstituteDropdown = response;
                if (!isNullOrUndefined(this.InstituteDropdown) && this.InstituteDropdown.length > 0)
                    this.Institute = this.InstituteDropdown[0].Id;
            }, (error: any) => {
                console.log(error);
            });
    }

    // for backgrouud color // 

    ThemeFontColor: string = "";
    DefaultFontColor: string = "";
    BorderColor: string = "";
    DefaultBorderColor: string = "";
    tickImage: string = "";

    forChanges: any;
    breakcode: any;
    code: any;
    // this.tickImage = "../../../assets/images/" + this.code + "/tick.PNG";

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
            this.ThemeFontColor = this.forChanges;
            this.BorderColor = "1px solid" + this.forChanges;
            this.tickImage = "assets/images/" + this.code + "/tick.png";
        }
    }


    // for Country dropdown // 

    CountriesDropdown: any;
    selectedCountry: number = 1;

    getCountriesDropdown() {
        let RequestObject = {

            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId,

        }
        let getCountries = this._config.environment.baseUrl + Constants.GetCountries;
        this.http.post(getCountries, RequestObject, { headers: this.dataService.headers })
            .subscribe((response: any) => {

                this.CountriesDropdown = response;
                if (!isNullOrUndefined(this.CountriesDropdown) && this.CountriesDropdown.length > 0)
                    this.selectedCountry = this.CountriesDropdown[0].Id;
                this.getCitiesByCountryIdDropdown();
            }, (error: any) => {
                console.log(error);
            });
    }

    onChange() {
        this.getCitiesByCountryIdDropdown();

    }

    // for City dropdown // 

    CitiesByCountryIdDropdown: any;
    CitiesByCountryId: string = "";

    getCitiesByCountryIdDropdown() {
        
        let RequestObject = {

            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId,

        }
        let getCitiesByCountryId = this._config.environment.baseUrl + Constants.GetCitiesByCountryId + "?CountryId=" + this.selectedCountry;
        this.http.post(getCitiesByCountryId, RequestObject, { headers: this.dataService.headers })
             .subscribe((response: any) => {
           
                this.CitiesByCountryIdDropdown = response;
                if (!isNullOrUndefined(this.CitiesByCountryIdDropdown) && this.CitiesByCountryIdDropdown.length > 0)
                    this.CitiesByCountryId = this.CitiesByCountryIdDropdown[0].Id;
            }, (error: any) => {
               
            });
    }


    // For Certification //

    Certifications: string = "";
    CertificationsDropdown: any;


    getCertifications() {
        let RequestObject = {

            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId,

        }
        let getCertifications = this._config.environment.baseUrl + Constants.GetCertifications + "?Culture=" + Constants.Culture;
        this.http.post(getCertifications, RequestObject, { headers: this.dataService.headers })
            //  this.http.get(" https://jobportalapi.azurewebsites.net/GetCertifications?Culture=en-GB")
            .subscribe((response: any) => {

                this.CertificationsDropdown = response;
                if (!isNullOrUndefined(this.CertificationsDropdown) && this.CertificationsDropdown.length > 0)
                    this.crtid = this.CertificationsDropdown[0].Id;
            }, (error: any) => {
                console.log(error);
            });
    }




    TrainingSubject: string = "";
    TrainingSubjectDropdown: any;


    getTrainingSubject() {
        let RequestObject = {

            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId,

        }
        let getTrainingSubject = this._config.environment.baseUrl + Constants.GetTrainingSubject + "?Culture=" + Constants.Culture;
        this.http.post(getTrainingSubject, RequestObject, { headers: this.dataService.headers })
            //  this.http.get("https://jobportalapi.azurewebsites.net/GetTrainingSubject?Culture=en-GB")
            .subscribe((response: any) => {

                this.TrainingSubjectDropdown = response;
                if (!isNullOrUndefined(this.TrainingSubjectDropdown) && this.TrainingSubjectDropdown.length > 0)
                    this.TrainingTrainingSubject = this.TrainingSubjectDropdown[0].Id;
            }, (error: any) => {
                console.log(error);
            });
    }

    // For Currency // 
    CurrencyDropdown: any;
    Currency: string; "";

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
                if (!isNullOrUndefined(this.CurrencyDropdown) && this.CurrencyDropdown.length > 0)
                    this.ExperienceCurrency = this.CurrencyDropdown[0].Id; 
                this.ExperienceCurrency = this.CompanyIdService.BaseCurrencyId
               
            }, (error: any) => {
                console.log(error);
            });
    }


    // For Competency //

    CompetencyLevel3Dropdown: any;
    CompetencyLevel3: string = "";

    getCompetencyLevel3() {
        let RequestObject = {

            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId,

        }
        let getCompetencyLevel3 = this._config.environment.baseUrl + Constants.GetCompetencyLevel3;
        this.http.post(getCompetencyLevel3, RequestObject, { headers: this.dataService.headers })
            //  this.http.get("https://jobportalapi.azurewebsites.net/GetCompetencyLevel3")
            .subscribe((response: any) => {

                this.CompetencyLevel3Dropdown = response;
                if (!isNullOrUndefined(this.CompetencyLevel3Dropdown) && this.CompetencyLevel3Dropdown.length > 0)
                    this.ddlCompetency = this.CompetencyLevel3Dropdown[0].Id;
               //console.log("ddlCompetency", this.ddlCompetency)
            }, (error: any) => {
                console.log(error);
            });
    }

    // For rating // 
    RatingDropdown: any;

    getRating() {
        let RequestObject = {

            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId,

        }
        let getRating = this._config.environment.baseUrl + Constants.GetRating + "?Culture=" + Constants.Culture;
        this.http.post(getRating, RequestObject, { headers: this.dataService.headers })
            //  this.http.get("https://jobportalapi.azurewebsites.net/GetRating?Culture=en-GB")
            .subscribe((response: any) => {

                this.RatingDropdown = response;
                if (!isNullOrUndefined(this.RatingDropdown) && this.RatingDropdown.length > 0)
                    this.ddlRequiRatingCompetency = this.RatingDropdown[0].Id;
            }, (error: any) => {
                console.log(error);
            });
    }


    // Cities Dropdown //
    CitiesDropdown: any;
    Cities: any;

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
                this.getCountriesDropdown();
            }, (error: any) => {
                console.log(error);
            });
    }




    // end dropdowns //



    // date format change //

    txtAcademicDateFrom:any;
    txtAcademicDateOfCompletion;
    txtCertificateDateOfAchievement: any;
    txtCertificateDateOfExpiry: any;
    txtTrainingDateFrom: string = "";
    txtTrainingDateTo: string = "";
    txtExperienceDateFrom: any;
    txtExperienceDateTo: any;
    forDateVlaidation;
   

    datePickerChanged(eventData: any, controlID: string) {
        

        this.forDateVlaidation = eventData.isValid;
        if (eventData.year === "0000") {
            this.forDateVlaidation = false;
        }

        if (eventData.isValid == true) {

            if (controlID.toLowerCase().trim() == "academicdatefrom") 
                this.txtAcademicDateFrom = eventData.date;
            else if (controlID.toLowerCase().trim() == "academicdateofcompletion")
                this.txtAcademicDateOfCompletion = eventData.date;
            else if (controlID.toLowerCase().trim() == "certificatecateofachievement")
                this.txtCertificateDateOfAchievement = eventData.date;
            else if (controlID.toLowerCase().trim() == "certificatedateofexpiry")
                this.txtCertificateDateOfExpiry = eventData.date;
            else if (controlID.toLowerCase().trim() == "trainingdatefrom")
                this.txtTrainingDateFrom = eventData.date;
            else if (controlID.toLowerCase().trim() == "trainingdateto")
                this.txtTrainingDateTo = eventData.date;
            else if (controlID.toLowerCase().trim() == "experiencedatefrom")
                this.txtExperienceDateFrom = eventData.date;
            else if (controlID.toLowerCase().trim() == "experiencedateto")
                this.txtExperienceDateTo = eventData.date;
        }
        else {
            if (controlID.toLowerCase().trim() == "academicdatefrom")
                this.txtAcademicDateFrom = "";
            else if (controlID.toLowerCase().trim() == "academicdateofcompletion")
                this.txtAcademicDateOfCompletion = "";
            else if (controlID.toLowerCase().trim() == "certificatecateofachievement")
                this.txtCertificateDateOfAchievement = "";
            else if (controlID.toLowerCase().trim() == "certificatedateofexpiry")
                this.txtCertificateDateOfExpiry = "";
            else if (controlID.toLowerCase().trim() == "trainingdatefrom")
                this.txtTrainingDateFrom = "";
            else if (controlID.toLowerCase().trim() == "trainingdateto")
                this.txtTrainingDateTo = "";
            else if (controlID.toLowerCase().trim() == "experiencedatefrom")
                this.txtExperienceDateFrom = "";
            else if (controlID.toLowerCase().trim() == "experiencedateto")
                this.txtExperienceDateTo = "";
        }

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

    ValidationMsg: string = "";
    ValidationErrorMsg: string = "";

    Validate() {
      debugger;
      const hasBankAccountValue = this.resolveHasBankAccountForValidation();
      let RequestObject = {

        ApplicantId: localStorage.getItem("AppId"),
        Email: localStorage.getItem("Email"),
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId,
        LoginCompanyId: this.CompanyIdService.CompanyId,
        HasBankAccount: hasBankAccountValue,

      }
      this.openSpinner();
      let CheckValidation = this._config.environment.baseUrl + Constants.CheckValidation;
      this.http.post(CheckValidation, RequestObject, { headers: this.dataService.headers })
        // this.http.post("https://jobportalapi.azurewebsites.net/CheckValidation", RequestObject)
        .subscribe((response: any) => {

          this.ValidationMsg = response;
          console.log(this.ValidationMsg)

          if (response.isValid == true) {
          
            this.ValidationMsg = response.msg;

         if (this.ValidationMsg !== "All required fields are valid.") {
              $("#ValidationModal").modal("show");
              this.HideSpinner();

            }

         if (this.ValidationMsg == "All required fields are valid.") {
               this.SendEmails();
              }
         }

          if (response.isValid == false) {

            this.ValidationErrorMsg = response.msg;
              $("#ErrorOccurinValidation").modal("show");
              this.HideSpinner();
          }

          
        }, (error: any) => {
          this.HideSpinner();
        });
    }




    formatValidationMsg(msg: string): string {
        // The API groups validation fields by section as HTML lists. Keep that
        // structure intact instead of flattening it into a comma-separated sentence.
        return (msg || 'Missing mandatory input(s). Please try again.')
            .replace(/\r?\n/g, '<br>');
    }

    // helper
    private formatList(items: string[]): string {
        if (items.length === 1) return items[0];
        if (items.length === 2) return items.join(' and ');
        return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
    }

    //formatValidationMsg(msg: string): string {
    //  const fields = msg
    //    .split('<br>')
    //    .filter(item => item.trim() !== '')
    //    .join(', '); // Join all fields with a comma and space

    //  return `Missing mandatory Input(s) to apply against any Position:<br><br>${fields} are mandatory to submit the application.<br><br>Please provide information for the required field and try again!`;
    //}

//    formatValidationMsg(msg: string): string {
//        const fields = msg
//            .split('<br>')
//            .filter(item => item.trim() !== '')
//            .map(item => {
//                // Move "in Section" inside brackets for grammar correctness
//                return item
//                    .replace('. in ', ' (')
//                    .replace('Section', 'Section)');
//            })
//            .map(item => `• ${item}`)
//            .join('<br>');

//        return `
//Missing mandatory Input(s) to apply against any Position:<br><br>
//${fields}<br><br>
//Please provide the required information and try again!
//  `;
//    }


   
    //submissionDate: Date | null = null;

    TrackSendEmailsTo_Applicant_Employee: any

    SendEmails() {
      debugger;
      let RequestObject = {

        Appid: localStorage.getItem("AppId"),
         //Email: this.Email,

        Email: localStorage.getItem("Email"),
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId,
        RecommendedByEmpId: this.RecommendedEmpId,
        RecommendedByEmpEmail: this.RecommendedEmpEmail,

      }
      this.openSpinner();
      let SendEmailsTo_Applicant_Employee = this._config.environment.baseUrl + Constants.SendEmailsTo_Applicant_Employee;
      this.http.post(SendEmailsTo_Applicant_Employee, RequestObject, { headers: this.dataService.headers })
        // this.http.post("https://jobportalapi.azurewebsites.net/SendEmailsTo_Applicant_Employee", RequestObject)
        .subscribe((response: any) => {
          this.HideSpinner();

          this.TrackSendEmailsTo_Applicant_Employee = response
          console.log(this.TrackSendEmailsTo_Applicant_Employee);

          if (response.isSuccess) {
            $("#myModal40").modal("show");
            this.HideSpinner();
            this.getApplicantData();
            this.sharedDataService.hideButton('');
            this.DeclarationcheckboxVisible = true;

            //const currentDate = new Date();
            //this.submissionDate = currentDate;
           
          } else {
            console.error("Failed to send email:", response.msg);
            this.HideSpinner();
          }
        },
        (error) => {
          console.error("Error sending email:", error);
          this.HideSpinner(); 
        }
        )
    }

    isCheckboxChecked: boolean = false;
    
    checkCheckbox() {
      debugger;
      // Set checkbox to checked when button is clicked
      this.isCheckboxChecked = true;
    }

    moveToPreviousTab() {

      // document.querySelector("#ProfInfoNonCop a").click();


      // Trigger the click event on the anchor tag within the tab
      var anchor = document.querySelector("#PersonalInfo a");
      var event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      anchor.dispatchEvent(event);

      // Scroll to the beginning of the content in the tab
      document.querySelector("#moveprevious").scrollIntoView();
    }




    // Academic Qualification // 

    // for grid binding //

    QualificationDetail: any;

    getQualificationDetail() {
        
        let RequestObject = {
            ApplicantId: localStorage.getItem("AppId"),
            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId

        }
        this.openSpinner();
        let getQualificationDetail = this._config.environment.baseUrl + Constants.GetQualificationDetail;
        this.http.post(getQualificationDetail, RequestObject, { headers: this.dataService.headers })
            // this.http.post("https://jobportalapi.azurewebsites.net/GetQualificationDetail", RequestObject)
            .subscribe((response: any) => {

              this.QualificationDetail = response;
              //console.log(this.QualificationDetail)
                this.HideSpinner();
            }, (error: any) => {

            });
    }

    // for saving quallification //

    Specialization: string = "";
    qualificationstatus: string = "";
    ddlDegree: string = '';
    selectedCountryAcademic: string = "";
    academicCity: number = 1;
    ScoreType: string = "";
    Grade: string = "";
    OtherddlDegree: string = '';
    OtherInstituteAcademic: string = "";
    jjj: string = "";
    jj: boolean = true;
    isDateValid: boolean = false;
    isPercentageValidation: boolean = false;
    isCGPAValidation: boolean = false;

    btnScoreTypePlcHldrLogc() {
        if (this.ScoreType = 'C') {
            this.jjj = "CGPA between 0- 4"
        }
        if (this.ScoreType = 'P') {
            this.jjj = "Percentage between 0-100"
        }
    }

    a;
    b;
    c;
    d;
    y;
    x;
    isbirthday: boolean = false;
    isbirthday1: boolean = false;
    isdatefromandcompletion: boolean = false;
    isdatefrom: boolean = false;
    ProvideValidDate: boolean = false;
    EnterGPA: boolean = false;
    EnterPercentage: boolean = false;

    txtAcademicDateFromSplit: any;
    txtAcademicDateFromDay: any;
    txtAcademicDateFromMonth: any;
    txtAcademicDateFromYear: any;

    txtAcademicDateOfCompletionSplit: any;
    txtAcademicDateOfCompletionDay: any;
    txtAcademicDateOfCompletionMonth: any;
    txtAcademicDateOfCompletionYear: any;
    isCurrentDate: boolean = false;
    isCorrectDateAcademic: boolean = false;
    isCorrectDateCertificate: boolean = false;
    isCorrectDateTraining: boolean = false;
    isCorrectDateExperience: boolean = false;
    isCorrectDateCompetency: boolean = false;
    isCorrectDateRefference: boolean = false;



    SaveAcademicQualification() {
      //alert(this.ddlDegree)
      console.log(this.dataService.ReplaceApostropheWthTelda("maaz's"));

      if (navigator.onLine) {
         
            this.isbirthday1 = false;
            this.isbirthday = false;
            this.DisconnectInternet = false;
            this.isMandatoryfields = false;
            this.isDateValid = false;
            this.isPercentageValidation = false;
            this.isCGPAValidation = false;
            this.isdatefromandcompletion = false;
            this.isdatefrom = false;
            this.EnterPercentage = false;
            this.EnterGPA = false;

            //if (this.forDateVlaidation == false) {
            //    this.isCorrectDateAcademic = true;
            //    return;
            //}

            let ddlDegree = this.DegreeDropdown.find(x => x.Id == this.ddlDegree);
            let Institute = this.InstituteDropdown.find(x => x.Id == this.Institute);

            if (isNullOrUndefined(this.Specialization) || isNullOrUndefined(this.qualificationstatus) || Institute.Name == 'N/A' || ddlDegree.Name == 'N/A') {
                this.isMandatoryfields = true;
                this.isdatefromandcompletion = false;
                this.isDateValid = false;
                this.isPercentageValidation = false;
                this.isCGPAValidation = false;
                this.DisconnectInternet = false;
                this.isbirthday = false;
                this.isdatefrom = false;
                this.EnterPercentage = false;
                this.EnterGPA = false;
                return;
            }



            this.DateOfBirthForProf = localStorage.getItem('DateOfBirthForProf');

            let a = this.DateOfBirthForProf.split(' ');
            let b = a[2];


            //console.log("ww", y)


            if (!isNullOrUndefined(this.txtAcademicDateFrom) && this.txtAcademicDateFrom != '') {
                let c = this.txtAcademicDateFrom.split('-');
                let d = c[2];
                this.txtAcademicDateFromSplit = this.txtAcademicDateFrom.split('-');
                this.txtAcademicDateFromDay = this.txtAcademicDateFromSplit[0];
                this.txtAcademicDateFromMonth = this.txtAcademicDateFromSplit[1];
                this.txtAcademicDateFromYear = this.txtAcademicDateFromSplit[2];



                var txtAcademicDateFromSplit = this.txtAcademicDateFrom.split('-');
                var txtAcademicDateFromDay = txtAcademicDateFromSplit[0];
                var txtAcademicDateFromMonth = txtAcademicDateFromSplit[1];
                var txtAcademicDateFromYear = txtAcademicDateFromSplit[2];

                if (!isNullOrUndefined(txtAcademicDateFromMonth)) {
                    if (txtAcademicDateFromMonth == '01') {
                        txtAcademicDateFromMonth = '00';
                    }
                    if (txtAcademicDateFromMonth == '02') {
                        txtAcademicDateFromMonth = '01';
                    }
                    if (txtAcademicDateFromMonth == '03') {
                        txtAcademicDateFromMonth = '02';
                    }
                    if (txtAcademicDateFromMonth == '04') {
                        txtAcademicDateFromMonth = '03';
                    }
                    if (txtAcademicDateFromMonth == '05') {
                        txtAcademicDateFromMonth = '04';
                    }
                    if (txtAcademicDateFromMonth == '06') {
                        txtAcademicDateFromMonth = '05';
                    }
                    if (txtAcademicDateFromMonth == '07') {
                        txtAcademicDateFromMonth = '06';
                    }
                    if (txtAcademicDateFromMonth == '08') {
                        txtAcademicDateFromMonth = '07';
                    }
                    if (txtAcademicDateFromMonth == '09') {
                        txtAcademicDateFromMonth = '08';
                    }
                    if (txtAcademicDateFromMonth == '10') {
                        txtAcademicDateFromMonth = '09';
                    }
                    if (txtAcademicDateFromMonth == '11') {
                        txtAcademicDateFromMonth = '10';
                    }
                    if (txtAcademicDateFromMonth == '12') {
                        txtAcademicDateFromMonth = '11';
                    }
                }


                var txtAcademicDateFromLocal = new Date(txtAcademicDateFromYear, txtAcademicDateFromMonth, txtAcademicDateFromDay)


                var DateOfBirthSplit = this.DateOfBirthForProf.split(' ');
                var DateOfBirthDay = DateOfBirthSplit[0];
                var DateOfBirthMonth = DateOfBirthSplit[1];
                var DateOfBirthYear = DateOfBirthSplit[2];


                if (!isNullOrUndefined(DateOfBirthMonth)) {
                    if (DateOfBirthMonth == 'Jan') {
                        DateOfBirthMonth = '00';
                    }
                    if (DateOfBirthMonth == 'Feb') {
                        DateOfBirthMonth = '01';
                    }
                    if (DateOfBirthMonth == 'Mar') {
                        DateOfBirthMonth = '02';
                    }
                    if (DateOfBirthMonth == 'Apr') {
                        DateOfBirthMonth = '03';
                    }
                    if (DateOfBirthMonth == 'May') {
                        DateOfBirthMonth = '04';
                    }
                    if (DateOfBirthMonth == 'Jun') {
                        DateOfBirthMonth = '05';
                    }
                    if (DateOfBirthMonth == 'Jul') {
                        DateOfBirthMonth = '06';
                    }
                    if (DateOfBirthMonth == 'Aug') {
                        DateOfBirthMonth = '07';
                    }
                    if (DateOfBirthMonth == 'Sep') {
                        DateOfBirthMonth = '08';
                    }
                    if (DateOfBirthMonth == 'Oct') {
                        DateOfBirthMonth = '09';
                    }
                    if (DateOfBirthMonth == 'Nov') {
                        DateOfBirthMonth = '10';
                    }
                    if (DateOfBirthMonth == 'Dec') {
                        DateOfBirthMonth = '11';
                    }
                }


                var DateOfBirthLocal = new Date(DateOfBirthYear, DateOfBirthMonth, DateOfBirthDay)


                if (DateOfBirthLocal >= txtAcademicDateFromLocal) {
                    this.isbirthday = true;
                    this.DisconnectInternet = false;
                    this.isMandatoryfields = false;
                    this.isDateValid = false;
                    this.isPercentageValidation = false;
                    this.isCGPAValidation = false;
                    this.isdatefromandcompletion = false;
                    this.isdatefrom = false;
                    this.EnterPercentage = false;
                    this.EnterGPA = false;
                    return;
                }
        }
            if (!isNullOrUndefined(this.txtAcademicDateOfCompletion) && this.txtAcademicDateOfCompletion != '') {
                let y = this.txtAcademicDateOfCompletion.split('-');
                let x = y[2];
                this.txtAcademicDateOfCompletionSplit = this.txtAcademicDateOfCompletion.split('-');
                this.txtAcademicDateOfCompletionDay = this.txtAcademicDateOfCompletionSplit[0];
                this.txtAcademicDateOfCompletionMonth = this.txtAcademicDateOfCompletionSplit[1];
                this.txtAcademicDateOfCompletionYear = this.txtAcademicDateOfCompletionSplit[2];



                var DateOfBirthSplit = this.DateOfBirthForProf.split(' ');
                var DateOfBirthDay = DateOfBirthSplit[0];
                var DateOfBirthMonth = DateOfBirthSplit[1];
                var DateOfBirthYear = DateOfBirthSplit[2];

                if (!isNullOrUndefined(DateOfBirthMonth)) {
                    if (DateOfBirthMonth == 'Jan') {
                        DateOfBirthMonth = '00';
                    }
                    if (DateOfBirthMonth == 'Feb') {
                        DateOfBirthMonth = '01';
                    }
                    if (DateOfBirthMonth == 'Mar') {
                        DateOfBirthMonth = '02';
                    }
                    if (DateOfBirthMonth == 'Apr') {
                        DateOfBirthMonth = '03';
                    }
                    if (DateOfBirthMonth == 'May') {
                        DateOfBirthMonth = '04';
                    }
                    if (DateOfBirthMonth == 'Jun') {
                        DateOfBirthMonth = '05';
                    }
                    if (DateOfBirthMonth == 'Jul') {
                        DateOfBirthMonth = '06';
                    }
                    if (DateOfBirthMonth == 'Aug') {
                        DateOfBirthMonth = '07';
                    }
                    if (DateOfBirthMonth == 'Sep') {
                        DateOfBirthMonth = '08';
                    }
                    if (DateOfBirthMonth == 'Oct') {
                        DateOfBirthMonth = '09';
                    }
                    if (DateOfBirthMonth == 'Nov') {
                        DateOfBirthMonth = '10';
                    }
                    if (DateOfBirthMonth == 'Dec') {
                        DateOfBirthMonth = '11';
                    }
                }

                var txtAcademicDateOfCompletionSplit = this.txtAcademicDateOfCompletion.split('-');
                var txtAcademicDateOfCompletionDay = txtAcademicDateOfCompletionSplit[0];
                var txtAcademicDateOfCompletionMonth = txtAcademicDateOfCompletionSplit[1];
                var txtAcademicDateOfCompletionYear = txtAcademicDateOfCompletionSplit[2];

                if (!isNullOrUndefined(txtAcademicDateOfCompletionMonth)) {
                    if (txtAcademicDateOfCompletionMonth == '01') {
                        txtAcademicDateOfCompletionMonth = '00';
                    }
                    if (txtAcademicDateOfCompletionMonth == '02') {
                        txtAcademicDateOfCompletionMonth = '01';
                    }
                    if (txtAcademicDateOfCompletionMonth == '03') {
                        txtAcademicDateOfCompletionMonth = '02';
                    }
                    if (txtAcademicDateOfCompletionMonth == '04') {
                        txtAcademicDateOfCompletionMonth = '03';
                    }
                    if (txtAcademicDateOfCompletionMonth == '05') {
                        txtAcademicDateOfCompletionMonth = '04';
                    }
                    if (txtAcademicDateOfCompletionMonth == '06') {
                        txtAcademicDateOfCompletionMonth = '05';
                    }
                    if (txtAcademicDateOfCompletionMonth == '07') {
                        txtAcademicDateOfCompletionMonth = '06';
                    }
                    if (txtAcademicDateOfCompletionMonth == '08') {
                        txtAcademicDateOfCompletionMonth = '07';
                    }
                    if (txtAcademicDateOfCompletionMonth == '09') {
                        txtAcademicDateOfCompletionMonth = '08';
                    }
                    if (txtAcademicDateOfCompletionMonth == '10') {
                        txtAcademicDateOfCompletionMonth = '09';
                    }
                    if (txtAcademicDateOfCompletionMonth == '11') {
                        txtAcademicDateOfCompletionMonth = '10';
                    }
                    if (txtAcademicDateOfCompletionMonth == '12') {
                        txtAcademicDateOfCompletionMonth = '11';
                    }
                }




                var DateOfBirthLocal = new Date(DateOfBirthYear, DateOfBirthMonth, DateOfBirthDay)
                var txtAcademicDateOfCompletionLocal = new Date(txtAcademicDateOfCompletionYear, txtAcademicDateOfCompletionMonth, txtAcademicDateOfCompletionDay)




                if (DateOfBirthLocal >= txtAcademicDateOfCompletionLocal) {
                    this.isbirthday1 = true;
                    this.isbirthday = false;
                    this.DisconnectInternet = false;
                    this.isMandatoryfields = false;
                    this.isDateValid = false;
                    this.isPercentageValidation = false;
                    this.isCGPAValidation = false;
                    this.isdatefromandcompletion = false;
                    this.isdatefrom = false;
                    this.EnterPercentage = false;
                    this.EnterGPA = false;
                    return;
                }
            }

            if (this.ScoreType == '') {
                this.Grade = '';
            }


            if (this.Institute == '-1') {
                if (this.OtherInstituteAcademic == '') {
                    this.isMandatoryfields = true;
                    this.isDateValid = false;
                    this.isdatefromandcompletion = false;
                    this.isPercentageValidation = false;
                    this.isCGPAValidation = false;
                    this.DisconnectInternet = false;
                    this.isbirthday = false;
                    this.isdatefrom = false;
                    this.EnterPercentage = false;
                    this.EnterGPA = false;
                    return;
                }
            }

            //if (this.qualificationstatus == '1') {
            //    if (this.txtAcademicDateFrom == "" || this.txtAcademicDateOfCompletion == ""){
            //        this.isdatefromandcompletion = true;
            //        this.isMandatoryfields = false;
            //        this.isDateValid = false;
            //        this.isPercentageValidation = false;
            //        this.isCGPAValidation = false;
            //        this.DisconnectInternet = false;
            //        this.isbirthday = false;
            //        this.isdatefrom = false;
            //        this.EnterPercentage = false;
            //        this.EnterGPA = false;
            //        return;
            //    }
            //}

            if (this.qualificationstatus == '0' && this.txtAcademicDateFrom == "" ) {
                this.isdatefrom = true;
                this.isdatefromandcompletion = false;
                this.isMandatoryfields = false;
                this.isDateValid = false;
                this.isPercentageValidation = false;
                this.isCGPAValidation = false;
                this.DisconnectInternet = false;
                this.isbirthday = false;
                this.EnterPercentage = false;
                this.EnterGPA = false;
                return;
            }


            if (this.ddlDegree == '-1') {
                if (this.OtherddlDegree == '') {
                    this.isMandatoryfields = true;
                    this.isDateValid = false;
                    this.isPercentageValidation = false;
                    this.isCGPAValidation = false;
                    this.DisconnectInternet = false;
                    this.isbirthday = false;
                    this.isdatefromandcompletion = false;
                    this.isdatefrom = false;
                    this.EnterPercentage = false;
                    this.EnterGPA = false;
                    return;
                }
            }


          //-------------------------------

            if (!isNullOrUndefined(this.txtAcademicDateOfCompletion) && !isNullOrUndefined(this.txtAcademicDateFrom)) {

                var txtAcademicDateFromSplit = this.txtAcademicDateFrom.split('-');
                var txtAcademicDateFromDay = txtAcademicDateFromSplit[0];
                var txtAcademicDateFromMonth = txtAcademicDateFromSplit[1];
                var txtAcademicDateFromYear = txtAcademicDateFromSplit[2];


                var txtAcademicDateOfCompletionSplit = this.txtAcademicDateOfCompletion.split('-');
                var txtAcademicDateOfCompletionDay = txtAcademicDateOfCompletionSplit[0];
                var txtAcademicDateOfCompletionMonth = txtAcademicDateOfCompletionSplit[1];
                var txtAcademicDateOfCompletionYear = txtAcademicDateOfCompletionSplit[2];




                var txtAcademicDateFromLocal = new Date(txtAcademicDateFromYear, txtAcademicDateFromMonth, txtAcademicDateFromDay)
                var txtAcademicDateOfCompletionLocal = new Date(txtAcademicDateOfCompletionYear, txtAcademicDateOfCompletionMonth, txtAcademicDateOfCompletionDay )


                //this.txtAcademicDateOfCompletion = new Date(this.txtAcademicDateOfCompletion);
                //this.txtAcademicDateOfCompletion = this.datePipe.transform(this.txtAcademicDateOfCompletion, 'dd-MM-yyyy');

                //this.txtAcademicDateFrom = new Date(this.txtAcademicDateFrom);
                //this.txtAcademicDateFrom = this.datePipe.transform(this.txtAcademicDateFrom, 'dd-MM-yyyy');

                if (txtAcademicDateFromLocal > txtAcademicDateOfCompletionLocal) {
                    this.isDateValid = true;
                    this.isMandatoryfields = false;
                    this.isPercentageValidation = false;
                    this.isCGPAValidation = false;
                    this.DisconnectInternet = false;
                    this.isbirthday = false;
                    this.isdatefromandcompletion = false;
                    this.EnterPercentage = false;
                    this.EnterGPA = false;
                    return;
                } 

                //if (this.txtAcademicDateFromYear <= this.txtAcademicDateOfCompletionYear && this.txtAcademicDateFromMonth > this.txtAcademicDateOfCompletionMonth) {
                //    this.isDateValid = true;
                //    this.isMandatoryfields = false;
                //    this.isPercentageValidation = false;
                //    this.isCGPAValidation = false;
                //    this.DisconnectInternet = false;
                //    this.isbirthday = false;
                //    this.isdatefromandcompletion = false;
                //    this.EnterPercentage = false;
                //    this.EnterGPA = false;
                //    return;
                //} 

                //if (this.txtAcademicDateFromYear <= this.txtAcademicDateOfCompletionYear && this.txtAcademicDateFromMonth <= this.txtAcademicDateOfCompletionMonth && this.txtAcademicDateFromDay > this.txtAcademicDateOfCompletionDay) {
                //    this.isDateValid = true;
                //    this.isMandatoryfields = false;
                //    this.isPercentageValidation = false;
                //    this.isCGPAValidation = false;
                //    this.DisconnectInternet = false;
                //    this.isbirthday = false;
                //    this.isdatefromandcompletion = false;
                //    this.EnterPercentage = false;
                //    this.EnterGPA = false;
                //    return;
                //} 


            }
            if (!isNullOrUndefined(this.txtAcademicDateFrom) && !isNullOrUndefined(this.myDate1)) {

                var txtAcademicDateFromSplit = this.txtAcademicDateFrom.split('-');
                var txtAcademicDateFromDay = txtAcademicDateFromSplit[0];
                var txtAcademicDateFromMonth = txtAcademicDateFromSplit[1];
                var txtAcademicDateFromYear = txtAcademicDateFromSplit[2];

                if (!isNullOrUndefined(txtAcademicDateFromMonth)) {
                    if (txtAcademicDateFromMonth == '01') {
                        txtAcademicDateFromMonth = '00';
                    }
                    if (txtAcademicDateFromMonth == '02') {
                        txtAcademicDateFromMonth = '01';
                    }
                    if (txtAcademicDateFromMonth == '03') {
                        txtAcademicDateFromMonth = '02';
                    }
                    if (txtAcademicDateFromMonth == '04') {
                        txtAcademicDateFromMonth = '03';
                    }
                    if (txtAcademicDateFromMonth == '05') {
                        txtAcademicDateFromMonth = '04';
                    }
                    if (txtAcademicDateFromMonth == '06') {
                        txtAcademicDateFromMonth = '05';
                    }
                    if (txtAcademicDateFromMonth == '07') {
                        txtAcademicDateFromMonth = '06';
                    }
                    if (txtAcademicDateFromMonth == '08') {
                        txtAcademicDateFromMonth = '07';
                    }
                    if (txtAcademicDateFromMonth == '09') {
                        txtAcademicDateFromMonth = '08';
                    }
                    if (txtAcademicDateFromMonth == '10') {
                        txtAcademicDateFromMonth = '09';
                    }
                    if (txtAcademicDateFromMonth == '11') {
                        txtAcademicDateFromMonth = '10';
                    }
                    if (txtAcademicDateFromMonth == '12') {
                        txtAcademicDateFromMonth = '11';
                    }
                }



                var txtAcademicDateFromLocal = new Date(txtAcademicDateFromYear, txtAcademicDateFromMonth, txtAcademicDateFromDay)


                if (txtAcademicDateFromLocal > this.myDate) {
                    this.isCurrentDate = true;
                    this.EnterPercentage = false;
                    this.EnterGPA = false;
                    this.isPercentageValidation = false;
                    this.isDateValid = false;
                    this.isMandatoryfields = false;
                    this.isCGPAValidation = false;
                    this.DisconnectInternet = false;
                    this.isbirthday = false;
                    this.isdatefromandcompletion = false;
                    this.isdatefrom = false;
                    return;
                }
            }

            if (this.ScoreType == "P" && this.Grade == '') {
                this.EnterPercentage = true;
                this.EnterGPA = false;
                this.isPercentageValidation = false;
                this.isDateValid = false;
                this.isMandatoryfields = false;
                this.isCGPAValidation = false;
                this.DisconnectInternet = false;
                this.isbirthday = false;
                this.isdatefromandcompletion = false;
                this.isdatefrom = false;
                return;
            }
            if (this.ScoreType == "C" && this.Grade == '') {
                this.EnterGPA = true;
                this.EnterPercentage = false;
                this.isPercentageValidation = false;
                this.isDateValid = false;
                this.isMandatoryfields = false;
                this.isCGPAValidation = false;
                this.DisconnectInternet = false;
                this.isbirthday = false;
                this.isdatefromandcompletion = false;
                this.isdatefrom = false;
                return;
            }

            if (this.ScoreType == "P" && ( Number(this.Grade) > 100 || Number(this.Grade) < 1)) {
                this.isPercentageValidation = true;
                this.isDateValid = false;
                this.isMandatoryfields = false;
                this.isCGPAValidation = false;
                this.DisconnectInternet = false;
                this.isbirthday = false;
                this.isdatefromandcompletion = false;
                this.isdatefrom = false;
                this.EnterPercentage = false;
                this.EnterGPA = false;
                return;

            }
            if (this.ScoreType == "C" && ( Number(this.Grade) > 4 || Number(this.Grade) < 1)) {
                this.isCGPAValidation = true;
                this.isPercentageValidation = false;
                this.isDateValid = false;
                this.isMandatoryfields = false;
                this.DisconnectInternet = false;
                this.isbirthday = false;
                this.isdatefromandcompletion = false;
                this.isdatefrom = false;
                this.EnterPercentage = false;
                this.EnterGPA = false;
                return;

            }

            //if (this.forDateVlaidation == false) {
            //    this.ProvideValidDate = true;
            //    this.isMandatoryfields = false;
            //    this.isDateValid = false;
            //    this.isdatefromandcompletion = false;
            //    this.isPercentageValidation = false;
            //    this.isCGPAValidation = false;
            //    this.DisconnectInternet = false;
            //    this.isbirthday = false;
            //    this.isdatefrom = false;
            //    this.EnterPercentage = false;
            //    this.EnterGPA = false;
            //    return;
            //}


            //if (this.ddlDegree == "-1" && this.OtherddlDegree == "") {
            //    this.isMandatoryfields = true;
            //}
            //else {
            //  this.isMandatoryfields = false;
            this.Specialization = this.dataService.ReplaceApostropheWthTelda(this.Specialization);  
            this.qualificationstatus = this.qualificationstatus; 
            this.OtherddlDegree = this.dataService.ReplaceApostropheWthTelda(this.OtherddlDegree);  
            this.OtherInstituteAcademic = this.dataService.ReplaceApostropheWthTelda(this.OtherInstituteAcademic);
            debugger;
            let RequestObject = {
                Appid: localStorage.getItem("AppId"),
                Recqlfid: (this.isUpdateAcademic == true) ? this.selectedqlfid : 0,
                qlfid: this.ddlDegree,
                Specialization: this.Specialization,
                qualificationstatus: this.qualificationstatus,
                IntId: this.Institute,
                StrDateFrom: this.txtAcademicDateFrom,
                StrDateTo: this.txtAcademicDateOfCompletion,
              //  PYear: "",
                CompanyId: this.CompanyIdService.CompanyId,
                ScoreType: this.ScoreType,
                Grade: this.Grade,
                Country: this.selectedCountry,
                City: this.selectedCountry == 1 ? '1' : this.academicCity,
                cntId: this.selectedCountry,
                ctyId: this.selectedCountry == 1 ? '1' : this.academicCity,
                Other: this.OtherddlDegree,
                Action: (this.isUpdateAcademic == true) ? Action.Update : Action.Insert,
                OtherInstitute: this.OtherInstituteAcademic,
                QualType: this.qualificationType.Id,

                isFieldForceApplicant: !this.isFF,

            }

            this.openSpinner();
            let saveQualification = this._config.environment.baseUrl + Constants.SaveQualification;
            this.PostData(RequestObject, saveQualification, { headers: this.dataService.headers });
            // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SaveQualification");
            $("#myModal1").modal("toggle");
            this.getQualificationDetail();
    
        }
        //}
        else {

            this.DisconnectInternet = true;
            this.isMandatoryfields = false;
            this.isDateValid = false;
            this.isPercentageValidation = false;
            this.isCGPAValidation = false;
            this.isbirthday = false;
            this.isdatefromandcompletion = false;
            this.isdatefrom = false;
            this.EnterPercentage = false;
            this.EnterGPA = false;
        }

    }

    private resolveHasBankAccountForValidation(): number | null {
      if (this.isFF !== true) {
        return null;
      }
      const storedValue = localStorage.getItem('FFHasBankAccount');
      if (storedValue === '1') {
        return 1;
      }
      if (storedValue === '0') {
        return 0;
      }
      return null;
    }


    // for delete Qualification //

    deleteQualificationAcademy: any;


    getdeleteQualification(Recqlfid: number) {
        if (this.isqlf == true) {
            this.delQualification
            let RequestObject = {
                AppId: localStorage.getItem("AppId"),
                Recqlfid: Recqlfid

            };

            this.openSpinner();
            let deleteQualification = this._config.environment.baseUrl + Constants.DeleteQualification;
            this.http.post(deleteQualification, RequestObject, { headers: this.dataService.headers })
                //   this.http.post("https://jobportalapi.azurewebsites.net/DeleteFinancialDetail", RequestObject)
                .subscribe((response: any) => {
                    
                    this.deleteQualificationAcademy = response.Data;
                    this.getQualificationDetail();
                    this.getLastProfileUpdateValue();
                    this.HideSpinner();

                    //POPUP FOR DELETE//
                    if (this.isqlf == true) {
                        //this.toastr.success(response.Msg, '', {
                        //    positionClass: "toast-bottom-right",
                        //});
                        $("#SuccessPopup").modal('show');
                        this.isTick = true;
                        this.SuccessMsg = response.Msg;
                        this.delQualification = "";
                        this.isqlf = false;
                        this.popuphide();

                    }
                }, (error: any) => {
                    console.log(error);
                });
        }
    }

    // Update For Academic Qualification //

    updateAcademicQualification(selectedRow: any) {

        if (navigator.onLine) {
           
            let RequestObject = {
                Recqlfid: selectedRow.Recqlfid,
                AppId: localStorage.getItem("AppId"),
                Email: localStorage.getItem("Email"),
                Action: Action.Update,
            }

            this.openSpinner();
            let saveQualificationDelete = this._config.environment.baseUrl + Constants.SaveQualification;
            this.http.post(saveQualificationDelete, RequestObject, { headers: this.dataService.headers })
                .subscribe((response: any) => {

                    this.HideSpinner();
                    if (!isNullOrUndefined(response) && response.isValid == true) {
                        this.getQualificationDetail();

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

    selectedqlfid: number = -1;
    defaultAcademicDateFrom: string = "";
    defaultAcademicDateOfCompletion: string = "";
    AcademicDateFrom: string = "";
    AcademicDateTo: string = "";

    onUpdateAcademic_Click(selectedRow: any) {
      debugger;

        this.isMandatoryfields = false;
        this.isUpdateAcademic = true;
        this.isTextActive = false;
        this.isTextActiveInstitute = false;

         // New added

        // Find the Qualificationtype 
        const Qualificationtype = this.qualification_type.find(qual => qual.Id == String(selectedRow.QualType));
        this.qualificationType = Qualificationtype || null;

        //console.log("Usama" ,selectedRow);

        this.selectedqlfid = selectedRow.Recqlfid;
        this.ddlDegree = selectedRow.qlfid;

        this.AcademicDateFrom = selectedRow.SimpleDateFrom;
        this.AcademicDateTo = selectedRow.SimpleDateTo;

        this.Specialization = selectedRow.Specialization;
        this.qualificationstatus = selectedRow.qualificationstatus;
        this.Institute = selectedRow.IntId;
        this.ScoreType = selectedRow.ScoreType;
        this.Grade = selectedRow.Grade;
        this.selectedCountryAcademic = selectedRow.ctyId;
        this.academicCity = selectedRow.ctyId;
        this.selectedCountry = selectedRow.cntId;
        //this.OtherddlDegree = "";       
        //this.OtherInstituteAcademic = "";		
        if (this.ddlDegree == '-1') {
            this.isTextActive = true;
            this.OtherddlDegree = selectedRow.DegreeName;
        }

        if (this.Institute == '-1') {
            this.isTextActiveInstitute = true;
            this.OtherInstituteAcademic = selectedRow.InstName;
        }  

        if (!isNullOrUndefined(this.AcademicDateFrom)) {
            this.defaultAcademicDateFrom = this.getControlDate(this.AcademicDateFrom);
        }
        if (!isNullOrUndefined(this.AcademicDateTo)) {
            this.defaultAcademicDateOfCompletion = this.getControlDate(this.AcademicDateTo);
        }
        //if (isNullOrUndefined(this.AcademicDateFrom)) {
        //    this.defaultAcademicDateFrom = "";
        //    this.resetDate();
        //}
        //if (isNullOrUndefined(this.AcademicDateTo)) {
        //    this.defaultAcademicDateOfCompletion = "";
        //    this.resetDate();
        //}
        this.getCitiesByCountryIdDropdown();
    }

    submitButtonVisible: boolean = false;
    DeclarationcheckboxVisible: boolean = false;

    showButtonNext(event: any) {
      this.submitButtonVisible = event.target.checked;

    }

    getQualificationtype(QualType: string | null): string{

      const qualtype = this.qualification_type.find(qual => qual.Id == QualType);
      return qualtype ? qualtype.Name : 'N/A';
    }

   


 

  

    // Certifications  //

    // for certification grid //

    CertificationDetail: any;

    getCertificationDetail() {

        let RequestObject = {
            ApplicantId: localStorage.getItem("AppId"),
            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId
        }
        this.openSpinner();
        let getCertificationDetail = this._config.environment.baseUrl + Constants.GetCertificationDetail;
        this.http.post(getCertificationDetail, RequestObject, { headers: this.dataService.headers })
            // this.http.post("https://jobportalapi.azurewebsites.net/GetCertificationDetail", RequestObject)
            .subscribe((response: any) => {
                
              this.CertificationDetail = response;
                
                this.HideSpinner();
            }, (error: any) => {
                console.log(error);
            });
    }

    // for save certificate //

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


  

    SaveCertification() {
        
        
        if (navigator.onLine) {
            this.DateOfBirthForProf = localStorage.getItem('DateOfBirthForProf');

            this.crtidForNullValue = this.CertificationsDropdown.find(x => x.Id == this.crtid);
            this.crtidValidation = this.crtidForNullValue.Name;

            //if (this.forDateVlaidation == false) {
            //    this.isCorrectDateCertificate = true;
            //    return;
            //}

            if (this.crtidValidation == 'N/A' || this.txtCertificateDateOfAchievement == "") {
                this.isMandatoryfields = true;
                this.isDateValid = false;
                this.isPercentageValidation = false;
                this.isCGPAValidation = false;
                this.DisconnectInternet = false;
                this.isbirthday = false;
                return;
            }


            if (this.crtid == '-1') {
                if (this.OtherCertification == '') {
                    this.isMandatoryfields = true;
                    this.isDateValid = false;
                    this.isPercentageValidation = false;
                    this.isCGPAValidation = false;
                    this.DisconnectInternet = false;
                    this.isbirthday = false;
                    return;
                }
            }
            if (this.Institute == '-1') {
                if (this.OtherInstituteCertification == '') {
                    this.isMandatoryfields = true;
                    this.isDateValid = false;
                    this.isPercentageValidation = false;
                    this.isCGPAValidation = false;
                    this.DisconnectInternet = false;
                    this.isbirthday = false;
                    return;
                }
            }




            if (!isNullOrUndefined(this.DateOfBirthForProf) && !isNullOrUndefined(this.txtCertificateDateOfAchievement)) {
            //let a = this.DateOfBirthForProf.split(' ');
            //let b = a[2];

            var DateOfBirthSplit = this.DateOfBirthForProf.split(' ');
            var DateOfBirthDay = DateOfBirthSplit[0];
            var DateOfBirthMonth = DateOfBirthSplit[1];
            var DateOfBirthYear = DateOfBirthSplit[2];


            if (!isNullOrUndefined(DateOfBirthMonth)) {
                if (DateOfBirthMonth == 'Jan') {
                    DateOfBirthMonth = '00';
                }
                if (DateOfBirthMonth == 'Feb') {
                    DateOfBirthMonth = '01';
                }
                if (DateOfBirthMonth == 'Mar') {
                    DateOfBirthMonth = '02';
                }
                if (DateOfBirthMonth == 'Apr') {
                    DateOfBirthMonth = '03';
                }
                if (DateOfBirthMonth == 'May') {
                    DateOfBirthMonth = '04';
                }
                if (DateOfBirthMonth == 'Jun') {
                    DateOfBirthMonth = '05';
                }
                if (DateOfBirthMonth == 'Jul') {
                    DateOfBirthMonth = '06';
                }
                if (DateOfBirthMonth == 'Aug') {
                    DateOfBirthMonth = '07';
                }
                if (DateOfBirthMonth == 'Sep') {
                    DateOfBirthMonth = '08';
                }
                if (DateOfBirthMonth == 'Oct') {
                    DateOfBirthMonth = '09';
                }
                if (DateOfBirthMonth == 'Nov') {
                    DateOfBirthMonth = '10';
                }
                if (DateOfBirthMonth == 'Dec') {
                    DateOfBirthMonth = '11';
                }
            }

            var DateOfBirthLocal = new Date(DateOfBirthYear, DateOfBirthMonth, DateOfBirthDay)


            var txtCertificateDateOfAchievementSplit = this.txtCertificateDateOfAchievement.split('-');
            var txtCertificateDateOfAchievementDay = txtCertificateDateOfAchievementSplit[0];
            var txtCertificateDateOfAchievementMonth = txtCertificateDateOfAchievementSplit[1];
            var txtCertificateDateOfAchievementYear = txtCertificateDateOfAchievementSplit[2];

            if (!isNullOrUndefined(txtCertificateDateOfAchievementMonth)) {
                if (txtCertificateDateOfAchievementMonth == '01') {
                    txtCertificateDateOfAchievementMonth = '00';
                }
                if (txtCertificateDateOfAchievementMonth == '02') {
                    txtCertificateDateOfAchievementMonth = '01';
                }
                if (txtCertificateDateOfAchievementMonth == '03') {
                    txtCertificateDateOfAchievementMonth = '02';
                }
                if (txtCertificateDateOfAchievementMonth == '04') {
                    txtCertificateDateOfAchievementMonth = '03';
                }
                if (txtCertificateDateOfAchievementMonth == '05') {
                    txtCertificateDateOfAchievementMonth = '04';
                }
                if (txtCertificateDateOfAchievementMonth == '06') {
                    txtCertificateDateOfAchievementMonth = '05';
                }
                if (txtCertificateDateOfAchievementMonth == '07') {
                    txtCertificateDateOfAchievementMonth = '06';
                }
                if (txtCertificateDateOfAchievementMonth == '08') {
                    txtCertificateDateOfAchievementMonth = '07';
                }
                if (txtCertificateDateOfAchievementMonth == '09') {
                    txtCertificateDateOfAchievementMonth = '08';
                }
                if (txtCertificateDateOfAchievementMonth == '10') {
                    txtCertificateDateOfAchievementMonth = '09';
                }
                if (txtCertificateDateOfAchievementMonth == '11') {
                    txtCertificateDateOfAchievementMonth = '10';
                }
                if (txtCertificateDateOfAchievementMonth == '12') {
                    txtCertificateDateOfAchievementMonth = '11';
                }
            }

            var txtCertificateDateOfAchievementLocal = new Date(txtCertificateDateOfAchievementYear, txtCertificateDateOfAchievementMonth, txtCertificateDateOfAchievementDay)



            //let c = this.txtCertificateDateOfAchievement.split('-');
            //let d = c[2];
            if (DateOfBirthLocal >= txtCertificateDateOfAchievementLocal) {
                    this.isbirthday = true;
                    this.isMandatoryfields = false;
                    this.isDateValid = false;
                    this.isPercentageValidation = false;
                    this.isCGPAValidation = false;
                    this.DisconnectInternet = false;
                    return;
                }
            }

            if (this.txtCertificateDateOfExpiry !== "" && this.txtCertificateDateOfAchievement !== '') {

                var txtCertificateDateOfExpirySplit = this.txtCertificateDateOfExpiry.split('-');
                var txtCertificateDateOfExpiryDay = txtCertificateDateOfExpirySplit[0];
                var txtCertificateDateOfExpiryMonth = txtCertificateDateOfExpirySplit[1];
                var txtCertificateDateOfExpiryYear = txtCertificateDateOfExpirySplit[2];
                var txtCertificateDateOfExpiryLocal = new Date(txtCertificateDateOfExpiryYear, txtCertificateDateOfExpiryMonth, txtCertificateDateOfExpiryDay)


                var txtCertificateDateOfAchievementSplit = this.txtCertificateDateOfAchievement.split('-');
                var txtCertificateDateOfAchievementDay = txtCertificateDateOfAchievementSplit[0];
                var txtCertificateDateOfAchievementMonth = txtCertificateDateOfAchievementSplit[1];
                var txtCertificateDateOfAchievementYear = txtCertificateDateOfAchievementSplit[2];
                var txtCertificateDateOfAchievementLocal = new Date(txtCertificateDateOfAchievementYear, txtCertificateDateOfAchievementMonth, txtCertificateDateOfAchievementDay)



                if (txtCertificateDateOfAchievementLocal > txtCertificateDateOfExpiryLocal) {
                    this.isDateValid = true;
                    this.isPercentageValidation = false;
                    this.isMandatoryfields = false;
                    this.isCGPAValidation = false;
                    this.isbirthday = false;
                    this.DisconnectInternet = false;
                    return;

                }
            }

            if (this.ScoreTypeCertificate == "P" && (Number(this.Score) > 100 || Number(this.Score) < 1)) {
                this.isPercentageValidation = true;
                this.isDateValid = false;
                this.isMandatoryfields = false;
                this.isCGPAValidation = false;
                this.DisconnectInternet = false;
                this.isbirthday = false;
                return;

            }
            if (this.ScoreTypeCertificate == "C" && (Number(this.Score) > 4 || Number(this.Score) < 1)) {
                this.isCGPAValidation = true;
                this.isPercentageValidation = false;
                this.isDateValid = false;
                this.isMandatoryfields = false;
                this.DisconnectInternet = false;
                this.isbirthday = false;
                return;

            }


            if (this.forDateVlaidation == false) {
                this.ProvideValidDate = true;
                this.isbirthday = false;
                this.isMandatoryfields = false;
                this.isDateValid = false;
                this.isPercentageValidation = false;
                this.isCGPAValidation = false;
                this.DisconnectInternet = false;
                return;
            }

            //else {
            let RequestObject = {
                Appid: localStorage.getItem("AppId"),
                appcrtid: (this.isUpdateCertificate == true) ? this.selectedappcrtid : 0,
                crtid: this.crtid,
                OtherCertificate: this.dataService.ReplaceApostropheWthTelda(this.OtherCertification),
                StrDateAchieved: this.txtCertificateDateOfAchievement,
                StrExpiryDate: this.txtCertificateDateOfExpiry,
                CompanyId: this.CompanyIdService.CompanyId,
                Score: this.Score,
                ScoreType: this.ScoreTypeCertificate,
                instId: this.Institute,
                OtherInstitute: this.dataService.ReplaceApostropheWthTelda(this.OtherInstituteCertification),
                cntId: this.selectedCountry,
                ctyId: this.selectedCountry == 1 ? '1' : this.CertificateCity,
                Address: this.dataService.ReplaceApostropheWthTelda(this.CertificateAddress),
                Action: (this.isUpdateCertificate == true) ? Action.Update : Action.Insert,


                isFieldForceApplicant: !this.isFF,

            }

            this.openSpinner();
            let saveCertification = this._config.environment.baseUrl + Constants.SaveCertification;
            this.PostData(RequestObject, saveCertification, { headers: this.dataService.headers });
            // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SaveCertification");
            $("#myModal2").modal("toggle");
            this.getCertificationDetail();
        }
        //}
        else {

            this.DisconnectInternet = true;
            this.isCGPAValidation = false;
            this.isPercentageValidation = false;
            this.isDateValid = false;
            this.isMandatoryfields = false;
            this.isbirthday = false;
        }

    }


    // for delete Certification //

    deleteCertification: any;


    getdeleteCertification(appcrtid: number) {
        
        if (this.iscrt == true) {
            this.delCertification
            let RequestObject = {
                AppId: localStorage.getItem("AppId"),
                appcrtid: appcrtid

            };

            this.openSpinner();
            let deleteCertification = this._config.environment.baseUrl + Constants.DeleteCertification;
            this.http.post(deleteCertification, RequestObject, { headers: this.dataService.headers })
                //   this.http.post("https://jobportalapi.azurewebsites.net/DeleteCertification", RequestObject)
                .subscribe((response: any) => {

                    this.deleteCertification = response.Data;
                    this.getCertificationDetail();
                    this.getLastProfileUpdateValue();
                    this.HideSpinner();

                    //POPUP FOR DELETE//
                    if (this.iscrt == true) {
                        //this.toastr.success(response.Msg, '', {
                        //    positionClass: "toast-bottom-right",
                        //});
                        $("#SuccessPopup").modal('show');
                        this.isTick = true;
                        this.SuccessMsg = response.Msg;
                        this.popuphide();
                        this.delCertification = "";
                        this.iscrt = false;
                    }

                }, (error: any) => {
                    console.log(error);
                });
        }
    }


    // Update For certificate //

    updateCertification(selectedRow: any) {
        if (navigator.onLine) {
            let RequestObject = {
                appcrtid: selectedRow.appcrtid,
                AppId: localStorage.getItem("AppId"),
                Email: localStorage.getItem("Email"),
                Action: Action.Update,
            }

            this.openSpinner();
            let saveCertificationDelete = this._config.environment.baseUrl + Constants.SaveCertification;
            this.http.post(saveCertificationDelete, RequestObject, { headers: this.dataService.headers })
                .subscribe((response: any) => {

                    this.HideSpinner();
                    if (!isNullOrUndefined(response) && response.isValid == true) {
                        this.getCertificationDetail();

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

    selectedappcrtid: number = -1;
    defaultCertificateDateOfAchievement: string = "";
    defaultCertificateDateOfExpiry: string = "";
    CertificateDateFrom: string = "";
    CertificateDateTo: string = "";


    onUpdateCertification_Click(selectedRow: any) {
        
        this.isMandatoryfields = false;
        this.isUpdateCertificate = true;
        this.isTextActiveCertification = false;
        this.isTextActiveInstitute = false;

        this.CertificateDateFrom = selectedRow.SimpleDateFrom;
        this.CertificateDateTo = selectedRow.SimpleDateTo;

        this.selectedappcrtid = selectedRow.appcrtid;
        this.Score = selectedRow.Score;
        this.crtid = selectedRow.crtid,
        this.ScoreTypeCertificate = selectedRow.ScoreType;
        this.Institute = selectedRow.instId;
        this.CountryCertificate = selectedRow.selectedCountry;
        this.CertificateAddress = selectedRow.Address;
        this.selectedCountry = selectedRow.cntId;
        this.CertificateCity = selectedRow.ctyId;
        this.getCitiesByCountryIdDropdown();
        //		this.OtherInstitute = selectedRow.OtherInstitute;
        if (this.crtid == '-1') {
            this.isTextActiveCertification = true;
            this.OtherCertification = selectedRow.CrtName;
        }

        if (this.Institute == '-1') {
            this.isTextActiveInstitute = true;
            this.OtherInstituteCertification = selectedRow.InstName;
        }

        this.crtid = selectedRow.crtid;

     //   this.defaultCertificateDateOfAchievement = this.getControlDate(this.CertificateDateFrom);
     //   this.defaultCertificateDateOfExpiry = this.getControlDate(this.CertificateDateTo);

        if (!isNullOrUndefined(this.CertificateDateFrom)) {
            this.defaultCertificateDateOfAchievement = this.getControlDate(this.CertificateDateFrom);
        }
        if (!isNullOrUndefined(this.CertificateDateTo)) {
            this.defaultCertificateDateOfExpiry = this.getControlDate(this.CertificateDateTo);
        }
        //if (isNullOrUndefined(this.CertificateDateFrom)) {
        //    this.defaultCertificateDateOfAchievement = "";
        //    this.resetDate();
        //}
        //if (isNullOrUndefined(this.CertificateDateTo)) {
        //    this.defaultCertificateDateOfExpiry = "";
        //    this.resetDate();
        //}

    }





    // Training  //

    // for training grid //

    TrainingDetail: any;

    getTrainingDetail() {

        let RequestObject = {
            ApplicantId: localStorage.getItem("AppId"),
            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId
        }
        this.openSpinner();
        let getTrainingDetail = this._config.environment.baseUrl + Constants.GetTrainingDetail;
        this.http.post(getTrainingDetail, RequestObject, { headers: this.dataService.headers })
            // this.http.post("https://jobportalapi.azurewebsites.net/GetTrainingDetail", RequestObject)
            .subscribe((response: any) => {

                this.TrainingDetail = response;
                
                this.HideSpinner();
            }, (error: any) => {
                console.log(error);
            });
    }

    // for saving Training //

    TrainingCourseTitle: string = "";
    TrainingCountry: string = "";
    TrainingCity: number = 1;
    TrainingTrainingSubject: string = "";
    OtherInstituteTraining: string = "";
    InstituteTrainigTextBox: string = "";


    SaveTraining() {

        
        if (navigator.onLine) {
            

            //if (this.forDateVlaidation == false) {
            //    this.isCorrectDateTraining = true;
            //    return;
            //}

            if (this.TrainingCourseTitle == "") {
                this.isMandatoryfields = true;
                this.isDateValid = false;
                this.DisconnectInternet = false;
                return;
            }

            if (this.txtTrainingDateTo !== "" && this.txtTrainingDateFrom !== "") {
              console.log(this.txtTrainingDateFrom > this.txtTrainingDateTo, this.txtTrainingDateFrom, this.txtTrainingDateTo)
              let _dTo = new Date(this.txtTrainingDateTo.split('-')[2] + '-' + this.txtTrainingDateTo.split('-')[1] + '-' + this.txtTrainingDateTo.split('-')[0]);
              let _dFrom = new Date(this.txtTrainingDateFrom.split('-')[2] + '-' + this.txtTrainingDateFrom.split('-')[1] + '-' + this.txtTrainingDateFrom.split('-')[0]);
              if (_dFrom > _dTo) {
                    this.isDateValid = true;
                    this.isMandatoryfields = false;
                    this.DisconnectInternet = false;
                    return;
                }
            }

            //if (this.forDateVlaidation == false) {
            //    this.ProvideValidDate = true;
            //    this.isDateValid = false;
            //    this.isMandatoryfields = false;
            //    this.DisconnectInternet = false;
            //    return;
            //}

                let RequestObject = {
                    Appid: localStorage.getItem("AppId"),
                    TrnId: (this.isUpdateTraining == true) ? this.selectedTrnId : 0,
                    Course: this.dataService.ReplaceApostropheWthTelda(this.TrainingCourseTitle),
                    StrDateFrom: this.txtTrainingDateFrom,
                    StrDateTo: this.txtTrainingDateTo,
                    Institute: this.dataService.ReplaceApostropheWthTelda(this.InstituteTrainigTextBox),
                    CompanyId: this.CompanyIdService.CompanyId,
                    CntId: this.selectedCountry,
                    CtyId: this.selectedCountry == 1 ? '1' : this.TrainingCity,
                    TrnSubId: this.TrainingTrainingSubject,

                    isFieldForceApplicant: !this.isFF,

                    //Othertrainning: "",
                    //OtherTrainingSubject: "",
                    //OtherInstitute: this.OtherInstituteTraining,
                    Action: (this.isUpdateTraining == true) ? Action.Update : Action.Insert,

                }

                this.openSpinner();
                let saveTraining = this._config.environment.baseUrl + Constants.SaveTraining;
            this.PostData(RequestObject, saveTraining, { headers: this.dataService.headers });
                // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SaveTraining");
                $("#myModal3").modal("toggle");
                this.getTrainingDetail();
            }
        
        else {

            this.DisconnectInternet = true;
            this.isDateValid = false;
            this.isMandatoryfields = false;
        }

    }



    // for delete Training //

    deleteTrainingData: any;


    getdeleteTraining(TrnId: number) {
        
        if (this.istrn == true) {
            this.delTraining
            let RequestObject = {
                AppId: localStorage.getItem("AppId"),
                TrnId: TrnId

            };

            this.openSpinner();
            let deleteTraining = this._config.environment.baseUrl + Constants.DeleteTraining;
            this.http.post(deleteTraining, RequestObject, { headers: this.dataService.headers })
                //   this.http.post("https://jobportalapi.azurewebsites.net/DeleteTraining", RequestObject)
                .subscribe((response: any) => {

                    this.deleteTrainingData = response.Data;
                    this.getTrainingDetail();
                    this.getLastProfileUpdateValue();
                    this.HideSpinner();

                    //POPUP FOR DELETE//
                    if (this.istrn == true) {
                        //this.toastr.success(response.Msg, '', {
                        //    positionClass: "toast-bottom-right",
                        //});
                        $("#SuccessPopup").modal('show');
                        this.isTick = true;
                        this.SuccessMsg = response.Msg;

                        this.delTraining = "";
                        this.istrn = false;
                        this.popuphide();
                    }

                }, (error: any) => {
                    console.log(error);
                });
        }
    }

    // Update For Training //

    updateTraining(selectedRow: any) {
        if (navigator.onLine) {
            let RequestObject = {
                TrnId: selectedRow.TrnId,
                AppId: localStorage.getItem("AppId"),
                Email: localStorage.getItem("Email"),
                Action: Action.Update,
            }

            this.openSpinner();
            let updateTraining = this._config.environment.baseUrl + Constants.SaveTraining;
            this.http.post(updateTraining, RequestObject, { headers: this.dataService.headers })
                .subscribe((response: any) => {

                    this.HideSpinner();
                    if (!isNullOrUndefined(response) && response.isValid == true) {
                        this.getTrainingDetail();

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

    selectedTrnId: number = -1;
    defaultTrainingDateFrom: string = "";
    defaultTrainingDateTo: string = "";
    Trianingdatefrom: string = "";
    TrianingdateTo: string = "";


    onUpdateTraining_Click(selectedRow: any) {
        

        this.isMandatoryfields = false;
        this.isTextActiveInstitute = false;
        this.isUpdateTraining = true;
        this.selectedTrnId = selectedRow.TrnId;
        this.TrainingCourseTitle = selectedRow.Course;
        this.Trianingdatefrom = selectedRow.SimpleDateFrom;
        this.TrianingdateTo = selectedRow.SimpleDateTo;

        this.InstituteTrainigTextBox = selectedRow.Institute;
        this.TrainingTrainingSubject = selectedRow.TrnSubId;
        this.selectedCountry = selectedRow.CntId;
        this.getCitiesByCountryIdDropdown();
        this.TrainingCity = selectedRow.CtyId;
        //  Othertrainning: "",
        //   OtherTrainingSubject: "",	
        //if (this.Institute == '-1') {
        //    this.isTextActiveInstitute = true;
        //    this.OtherInstituteTraining = selectedRow.OtherInstitute;
        //}
        if (!isNullOrUndefined(this.Trianingdatefrom)) {
            this.defaultTrainingDateFrom = this.getControlDate(this.Trianingdatefrom);
        }
        if (!isNullOrUndefined(this.TrianingdateTo)) {
            this.defaultTrainingDateTo = this.getControlDate(this.TrianingdateTo);
        }
        if (isNullOrUndefined(this.Trianingdatefrom)) {
            this.defaultTrainingDateFrom = "";
            this.resetDate();
        }
        if (isNullOrUndefined(this.TrianingdateTo)) {
            this.defaultTrainingDateTo = "";
            this.resetDate();
        }

    }




    // Experience detail  //

    // For Experience detail Grid //

    ExperienceDetail: any;


    getExperienceDetail() {

        let RequestObject = {
            ApplicantId: localStorage.getItem("AppId"),
            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId
        }
        this.openSpinner();
        let getExperienceDetail = this._config.environment.baseUrl + Constants.GetExperienceDetail;
        this.http.post(getExperienceDetail, RequestObject, { headers: this.dataService.headers })
            // this.http.post("https://jobportalapi.azurewebsites.net/GetExperienceDetail", RequestObject)
            .subscribe((response: any) => {

              this.ExperienceDetail = response;
              //console.log("Experiance Details Data:", this.ExperienceDetail);
                this.HideSpinner();
            }, (error: any) => {
                console.log(error);
            });
    }

    // for saving Experience Details //

    ExperienceCompany: string = "";
    ExperienceLeavingReason: string = "";
    ExperiencePhone: string = "";
    ExperienceDesignation: string = "";
    ExperienceSalary: string = "";
    ExperienceAddress: string = "";
    ExperienceJobResponsibilities: string = "";
    ExperienceCurrency: string = "";
    ExperienceBenefit: string = "";
    myDateSplit: any;
    myDateDay: any;
    myDateMonth: any;
    myDateYear: any;
    txtExperienceDateFromSplit: any;
    txtExperienceDateFromDay: any;
    txtExperienceDateFromMonth: any;
    txtExperienceDateFromYear: any;
    isDateValid1: boolean = false;

    SaveExperince() {

        this.isDateValid1 = false;
        if (navigator.onLine) {

            //if (this.forDateVlaidation == false) {
            //    this.isCorrectDateExperience = true;
            //    return;
            //}
            
            this.DisconnectInternet = false;

            this.myDateSplit = this.myDate1.split('-');
            this.myDateDay = this.myDateSplit[0];
            this.myDateMonth = this.myDateSplit[1];
            this.myDateYear = this.myDateSplit[2];

            this.txtExperienceDateFromSplit = this.txtExperienceDateFrom.split('-');
            this.txtExperienceDateFromDay = this.txtExperienceDateFromSplit[0];
            this.txtExperienceDateFromMonth = this.txtExperienceDateFromSplit[1];
            this.txtExperienceDateFromYear = this.txtExperienceDateFromSplit[2];


            if (this.ExperienceCompany == "" || this.ExperienceDesignation == "") {
                this.isMandatoryfields = true;
                this.isDateValid = false;
                this.ProvideValidDate = false;
                return;
            }

            if (this.txtExperienceDateTo !== '' && this.StillWorking == false) {

                var txtExperienceDateToSplit = this.txtExperienceDateTo.split('-');
                var txtExperienceDateToDay = txtExperienceDateToSplit[0];
                var txtExperienceDateToMonth = txtExperienceDateToSplit[1];
                var txtExperienceDateToYear = txtExperienceDateToSplit[2];

                //if (!isNullOrUndefined(txtExperienceDateToMonth)) {
                //    if (txtExperienceDateToMonth == '01') {
                //        txtExperienceDateToMonth = '00';
                //    }
                //    if (txtExperienceDateToMonth == '02') {
                //        txtExperienceDateToMonth = '01';
                //    }
                //    if (txtExperienceDateToMonth == '03') {
                //        txtExperienceDateToMonth = '02';
                //    }
                //    if (txtExperienceDateToMonth == '04') {
                //        txtExperienceDateToMonth = '03';
                //    }
                //    if (txtExperienceDateToMonth == '05') {
                //        txtExperienceDateToMonth = '04';
                //    }
                //    if (txtExperienceDateToMonth == '06') {
                //        txtExperienceDateToMonth = '05';
                //    }
                //    if (txtExperienceDateToMonth == '07') {
                //        txtExperienceDateToMonth = '06';
                //    }
                //    if (txtExperienceDateToMonth == '08') {
                //        txtExperienceDateToMonth = '07';
                //    }
                //    if (txtExperienceDateToMonth == '09') {
                //        txtExperienceDateToMonth = '08';
                //    }
                //    if (txtExperienceDateToMonth == '10') {
                //        txtExperienceDateToMonth = '09';
                //    }
                //    if (txtExperienceDateToMonth == '11') {
                //        txtExperienceDateToMonth = '10';
                //    }
                //    if (txtExperienceDateToMonth == '12') {
                //        txtExperienceDateToMonth = '11';
                //    }
                //}

                var txtExperienceDateToLocal = new Date(txtExperienceDateToYear, txtExperienceDateToMonth -1, txtExperienceDateToDay)


                var txtExperienceDateFromSplit = this.txtExperienceDateFrom.split('-');
                var txtExperienceDateFromDay = txtExperienceDateFromSplit[0];
                var txtExperienceDateFromMonth = txtExperienceDateFromSplit[1];
                var txtExperienceDateFromYear = txtExperienceDateFromSplit[2];
                var txtExperienceDateFromLocal = new Date(txtExperienceDateFromYear, txtExperienceDateFromMonth -1, txtExperienceDateFromDay)




                if (txtExperienceDateFromLocal > this.myDate) {
                    this.isDateValid = true;
                    this.isMandatoryfields = false;
                    this.ProvideValidDate = false;
                    return;
                }




                //if (this.txtExperienceDateFromYear <= this.myDateYear && this.txtExperienceDateFromMonth > this.myDateMonth) {
                //    this.isDateValid = true;
                //    this.isMandatoryfields = false;
                //    this.ProvideValidDate = false;
                //    return;
                //}
                //if (this.txtExperienceDateFromMonth <= this.myDateMonth && this.txtExperienceDateFromYear <= this.myDateYear && this.txtExperienceDateFromDay > this.myDateDay ) {
                //    this.isDateValid = true;
                //    this.isMandatoryfields = false;
                //    this.ProvideValidDate = false;
                //    return;
                //}
            }
            if (!isNullOrUndefined(this.txtExperienceDateFrom) && !isNullOrUndefined(this.txtExperienceDateTo)) {

                var txtExperienceDateToSplit = this.txtExperienceDateTo.split('-');
                var txtExperienceDateToDay = txtExperienceDateToSplit[0];
                var txtExperienceDateToMonth = txtExperienceDateToSplit[1];
                var txtExperienceDateToYear = txtExperienceDateToSplit[2];
                var txtExperienceDateToLocal = new Date(txtExperienceDateToYear, txtExperienceDateToMonth -1, txtExperienceDateToDay)


                var txtExperienceDateFromSplit = this.txtExperienceDateFrom.split('-');
                var txtExperienceDateFromDay = txtExperienceDateFromSplit[0];
                var txtExperienceDateFromMonth = txtExperienceDateFromSplit[1];
                var txtExperienceDateFromYear = txtExperienceDateFromSplit[2];
                var txtExperienceDateFromLocal = new Date(txtExperienceDateFromYear, txtExperienceDateFromMonth -1, txtExperienceDateFromDay)



                if (txtExperienceDateFromLocal > txtExperienceDateToLocal) {
                    this.isDateValid1 = true;
                    this.isDateValid = false;
                    this.isMandatoryfields = false;
                    this.ProvideValidDate = false;
                    return;
                }
            }


            if (!isNullOrUndefined(this.txtExperienceDateFrom) && this.StillWorking == true) {




                var txtExperienceDateFromSplit = this.txtExperienceDateFrom.split('-');
                var txtExperienceDateFromDay = txtExperienceDateFromSplit[0];
                var txtExperienceDateFromMonth = txtExperienceDateFromSplit[1];
                var txtExperienceDateFromYear = txtExperienceDateFromSplit[2];

                //if (!isNullOrUndefined(txtExperienceDateToMonth)) {
                //    if (txtExperienceDateToMonth == '01') {
                //        txtExperienceDateToMonth = '00';
                //    }
                //    if (txtExperienceDateToMonth == '02') {
                //        txtExperienceDateToMonth = '01';
                //    }
                //    if (txtExperienceDateToMonth == '03') {
                //        txtExperienceDateToMonth = '02';
                //    }
                //    if (txtExperienceDateToMonth == '04') {
                //        txtExperienceDateToMonth = '03';
                //    }
                //    if (txtExperienceDateToMonth == '05') {
                //        txtExperienceDateToMonth = '04';
                //    }
                //    if (txtExperienceDateToMonth == '06') {
                //        txtExperienceDateToMonth = '05';
                //    }
                //    if (txtExperienceDateToMonth == '07') {
                //        txtExperienceDateToMonth = '06';
                //    }
                //    if (txtExperienceDateToMonth == '08') {
                //        txtExperienceDateToMonth = '07';
                //    }
                //    if (txtExperienceDateToMonth == '09') {
                //        txtExperienceDateToMonth = '08';
                //    }
                //    if (txtExperienceDateToMonth == '10') {
                //        txtExperienceDateToMonth = '09';
                //    }
                //    if (txtExperienceDateToMonth == '11') {
                //        txtExperienceDateToMonth = '10';
                //    }
                //    if (txtExperienceDateToMonth == '12') {
                //        txtExperienceDateToMonth = '11';
                //    }
                //}

                var txtExperienceDateFromLocal = new Date(txtExperienceDateFromYear, txtExperienceDateFromMonth -1, txtExperienceDateFromDay)


                if (txtExperienceDateFromLocal >= this.myDate) {
                    this.isDateValid = true;
                    this.isMandatoryfields = false;
                    this.ProvideValidDate = false;
                    return;
                }
            }

            //if (this.forDateVlaidation == false) {
            //    this.ProvideValidDate = true;
            //    this.isMandatoryfields = false;
            //    this.isDateValid = false;
            //    return;
            //}


                let RequestObject = {
                  Appid: localStorage.getItem("AppId"),
                  oldCompany: this.dataService.ReplaceApostropheWthTelda(this.ExperienceCompany),
                    PhoneNumber: this.ExperiencePhone,
                    RecJobid: (this.isUpdateExperience == true) ? this.selectedRecJobid : 0,
                    oldPosition: this.dataService.ReplaceApostropheWthTelda(this.ExperienceDesignation),
                    StrFromDate: this.txtExperienceDateFrom,
                    StrToDate: this.StillWorking == false?this.txtExperienceDateTo:"",
                    JobDescription: this.dataService.ReplaceApostropheWthTelda(this.ExperienceJobResponsibilities),
                    Reason: this.StillWorking == false ? this.dataService.ReplaceApostropheWthTelda(this.ExperienceLeavingReason) : "",
                    Action: (this.isUpdateExperience == true) ? Action.Update : Action.Insert,
                    LSalary: this.ExperienceSalary,
                    EmployerAddress: this.ExperienceAddress,
                    CompanyId: this.CompanyIdService.CompanyId,
                    CurrentBenefits: this.dataService.ReplaceApostropheWthTelda(this.ExperienceBenefit),
                    LastcurrencyId: this.ExperienceCurrency,
                    isFieldForceApplicant: !this.isFF,

                    IsCurrent: this.StillWorking

                }

                this.openSpinner();
                let saveExperience = this._config.environment.baseUrl + Constants.SaveExperience;
                this.PostData(RequestObject, saveExperience, { headers: this.dataService.headers });
                // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SaveExperience");
                $("#myModal4").modal("toggle");
                this.getExperienceDetail();
            
        }
        else {

            this.DisconnectInternet = true;
            this.isDateValid = false;
            this.isMandatoryfields = false;
            this.ProvideValidDate = false;
        }

    }

    // for delete Expereince //

    deleteExperiencegData: any;


    deleteExperience(RecJobid: number) {
        
        if (this.isexp == true) {
            this.delExperience
            let RequestObject = {
                AppId: localStorage.getItem("AppId"),
                RecJobid: RecJobid

            };

            this.openSpinner();
            let deleteExperience = this._config.environment.baseUrl + Constants.DeleteExperience;
            this.http.post(deleteExperience, RequestObject, { headers: this.dataService.headers })
                //   this.http.post("https://jobportalapi.azurewebsites.net/DeleteTraining", RequestObject)
                .subscribe((response: any) => {

                    this.deleteExperiencegData = response.Data;
                    this.getExperienceDetail();
                    this.getLastProfileUpdateValue();
                    this.HideSpinner();

                    //POPUP FOR DELETE//
                    if (this.isexp == true) {
                        //this.toastr.success(response.Msg, '', {
                        //    positionClass: "toast-bottom-right",
                        //});
                        $("#SuccessPopup").modal('show');
                        this.isTick = true;
                        this.SuccessMsg = response.Msg;

                        this.delExperience = "";
                        this.isexp = false;
                        this.popuphide();
                    }

                }, (error: any) => {
                    console.log(error);
                });
        }
    }

    // Update For Experience Data //

    updateExperience(selectedRow: any) {
        if (navigator.onLine) {
            let RequestObject = {
                TrnId: selectedRow.TrnId,
                AppId: localStorage.getItem("AppId"),
                Email: localStorage.getItem("Email"),
                Action: Action.Update,
            }

            this.openSpinner();
            let updateTraining = this._config.environment.baseUrl + Constants.SaveTraining;
            this.http.post(updateTraining, RequestObject, { headers: this.dataService.headers })
                .subscribe((response: any) => {
                    
                    this.HideSpinner();
                    if (!isNullOrUndefined(response) && response.isValid == true) {
                        this.getTrainingDetail();

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

    selectedRecJobid: number = -1;
    defaultExperienceDateFrom: string = "";
    defaultExperienceDateTo: string = "";
    ExperienceDateFrom: string = "";
    ExperienceDateTo: string = "";

    onUpdateExperience_Click(selectedRow: any) {

        

        this.isMandatoryfields = false;
        this.isUpdateExperience = true;
        this.selectedRecJobid = selectedRow.RecJobid;
        this.ExperienceCompany = selectedRow.oldCompany;
        this.ExperiencePhone = selectedRow.PhoneNumber;
        this.ExperienceDesignation = selectedRow.oldPosition;
        this.ExperienceJobResponsibilities = selectedRow.JobDescription;
        this.ExperienceLeavingReason = selectedRow.Reason;
        this.ExperienceSalary = selectedRow.LSalary;
        this.ExperienceAddress = selectedRow.EmployerAddress;
        this.ExperienceBenefit = selectedRow.CurrentBenefits;
        this.ExperienceCurrency = selectedRow.LastcurrencyId;
        this.ExperienceDateFrom = selectedRow.SimpleFromDate;
        this.StillWorking = selectedRow.IsCurrent;
        this.ExperienceDateTo = this.StillWorking == false ? selectedRow.SimpleToDate : "";
        //console.log('bc condition::', this.StillWorking, selectedRow.IsCurrent)
        //if (this.StillWorking) 
        //    this.marked = true;
        //else 
        //    this.marked = false;


     //   this.defaultExperienceDateFrom = this.getControlDate(this.ExperienceDateFrom);
     //   this.defaultExperienceDateTo = this.getControlDate(this.ExperienceDateTo);
        if (!isNullOrUndefined(this.ExperienceDateFrom)) {
            this.defaultExperienceDateFrom = this.getControlDate(this.ExperienceDateFrom);
        }
        if (!isNullOrUndefined(this.ExperienceDateTo)) {
            this.defaultExperienceDateTo = this.getControlDate(this.ExperienceDateTo);
        }
        if (isNullOrUndefined(this.ExperienceDateFrom)) {
            this.defaultExperienceDateFrom = "";
            this.resetDate();
        }
        if (isNullOrUndefined(this.ExperienceDateTo)) {
            this.defaultExperienceDateTo = "";
            this.resetDate();
        }

        console.log('bc condition 2::', this.StillWorking)
    }


    // Competency Detail  //

    CompetencySkillsDetail: any;

    getCompetencySkillsDetail() {

        let RequestObject = {
            ApplicantId: localStorage.getItem("AppId"),
            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId
        }
        this.openSpinner();
        let getCompetencySkillsDetail = this._config.environment.baseUrl + Constants.GetCompetencySkillsDetail;
        this.http.post(getCompetencySkillsDetail, RequestObject, { headers: this.dataService.headers })
            // this.http.post("https://jobportalapi.azurewebsites.net/GetCompetencySkillsDetail", RequestObject)
            .subscribe((response: any) => {

                this.CompetencySkillsDetail = response;
                
                this.HideSpinner();
            }, (error: any) => {
                console.log(error);
            });
    }


    // for saving  Competency Skill //

    ddlCompetency: string = "";
    ddlCompetency1: string = "";
    RemarksCompetency: string = "";
    ddlRequiRatingCompetency: string = "";
    ddlRequiRatingCompetency1: string = "";


    SaveCompetencySkill() {
        if (navigator.onLine) {

            

            //if (this.forDateVlaidation == false) {
            //    this.isCorrectDateCompetency = true;
            //    return;
            //}

            var ddlRequiRatingCompetency = this.RatingDropdown.find(x => x.Id == this.ddlRequiRatingCompetency);
            var ddlCompetency = this.CompetencyLevel3Dropdown.find(x => x.Id == this.ddlCompetency);
            this.ddlCompetency1 = ddlCompetency.Name;
            this.ddlRequiRatingCompetency1 = ddlRequiRatingCompetency.Name;

            if (this.ddlRequiRatingCompetency == 'N/A' || this.ddlCompetency == "N/A" || this.RemarksCompetency == "") {
                this.isMandatoryfields = true;
            }

            //if (this.RemarksCompetency == "" || this.ddlRequiRatingCompetency == 'N/A' || this.ddlCompetency == 'N/A') {
            //    this.isMandatoryfields = true;
            //}

            else {
                let RequestObject = {
                    RCId: (this.isUpdateCompetencySkill == true) ? this.selectedRCId : 0,
                    AppId: localStorage.getItem("AppId"),
                    SubSecDetailId: this.ddlCompetency,
                    Rating: this.ddlRequiRatingCompetency,
                    Remarks: this.RemarksCompetency,
                    CompanyId: this.CompanyIdService.CompanyId,
                    isFieldForceApplicant: !this.isFF,

                    Action: (this.isUpdateCompetencySkill == true) ? Action.Update : Action.Insert,
                }

                this.openSpinner();
                let saveCompetencieSkills = this._config.environment.baseUrl + Constants.SaveCompetencieSkills;
                this.PostData(RequestObject, saveCompetencieSkills, { headers: this.dataService.headers });
                // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SaveQualification");
                $("#myModal5").modal("toggle");
                this.getCompetencySkillsDetail();
            }
        }
        else {

            this.DisconnectInternet = true;
        }

    }



  // Relative In Atco

    selectedRecRelid: number = -1;
    isRelativeinCompany: boolean = false;

    SaveRelativeinCompany() {


      if (navigator.onLine) {

        if (this.RelativeinAtco.trim() === "" || this.Relationship2.Name == "N/A"){
            this.isRelativeinCompany = true;
            this.DisconnectInternet = false;
            return;
          } else {
            this.isRelativeinCompany = false;
            this.DisconnectInternet = false;
          }




          let RequestObject = {

            AppId: localStorage.getItem("AppId"),
            RecRelid: (this.isUpdateRelative == true) ? this.selectedRelatveid : 0,
            CompanyId: this.CompanyIdService.CompanyId,
            RelatName: this.RelativeinAtco,
            Relatdesignation: this.Relativedesignation,
            relatrelation: this.Relationship2.Id,
            isFieldForceApplicant: !this.isFF,

            Action: (this.isUpdateRelative == true) ? Action.Update : Action.Insert,



          }

          this.openSpinner();
          let SaveRelativeDetails = this._config.environment.baseUrl + Constants.SaveRelativeDetails;
          this.PostData(RequestObject, SaveRelativeDetails, { headers: this.dataService.headers });
          // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SaveRelativeDetails");
          $("#myModal35").modal("toggle");
          this.GetRelativeGrid();
        
      }
      else {

        this.DisconnectInternet = true;
        this.isRelativeinCompany = false;
      }

    }


  // Get Relative details Grid

   

    Comapany_Name: string = "";

    RelativeDetail: any;

    GetRelativeGrid() {
      let RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId

      }
      this.openSpinner();
      let GetRelativeGrid = this._config.environment.baseUrl + Constants.GetRelativeGrid;
      this.http.post(GetRelativeGrid, RequestObject, { headers: this.dataService.headers })
        // this.http.post("https://jobportalapi.azurewebsites.net/GetRelativeGrid", RequestObject)
        .subscribe((response: any) => {

          this.RelativeDetail = response;
          //console.log(this.RelativeDetail);

         // this.Comapany_Name = this.RelativeDetail[0].CompanyShortName;


          //console.log(this.Comapany_Name);

          this.updateRelativeInAtco();

          //console.log(this.RelativeDetail)
          this.HideSpinner();
        }, (error: any) => {

        });
    }


    // for delete Relaive  //

    deleteRelativeDetails: any;


    getdeleteRelativeDetails(RecRelid: number) {
      if (this.isRelative == true) {
        this.delRelative
        let RequestObject = {
          AppId: localStorage.getItem("AppId"),
          RecRelid: RecRelid

        };

        this.openSpinner();
        let DeleteRelativeGrid = this._config.environment.baseUrl + Constants.DeleteRelativeGrid;
        this.http.post(DeleteRelativeGrid, RequestObject, { headers: this.dataService.headers })
          //   this.http.post("https://jobportalapi.azurewebsites.net/DeleteFinancialDetail", RequestObject)
          .subscribe((response: any) => {

            this.deleteRelativeDetails = response.Data;
            this.GetRelativeGrid();
            this.getLastProfileUpdateValue();
            this.HideSpinner();

            //POPUP FOR DELETE//
            if (this.isRelative == true) {
              //this.toastr.success(response.Msg, '', {
              //    positionClass: "toast-bottom-right",
              //});
              $("#SuccessPopup").modal('show');
              this.isTick = true;
              this.SuccessMsg = response.Msg;
              this.delRelative = "";
              this.isRelative = false;
              this.popuphide();

            }
          }, (error: any) => {
            console.log(error);
          });
      }
    }

    // Update For Relative Details  //

    updateRelativeDetails(selectedRow: any) {

      if (navigator.onLine) {

        let RequestObject = {
          RecRelid: selectedRow.RecRelid,
          AppId: localStorage.getItem("AppId"),
          Email: localStorage.getItem("Email"),
          Action: Action.Update,
        }

        this.openSpinner();
        let SaveRelative = this._config.environment.baseUrl + Constants.SaveRelativeDetails;
        this.http.post(SaveRelative, RequestObject, { headers: this.dataService.headers })
          .subscribe((response: any) => {

            this.HideSpinner();
            if (!isNullOrUndefined(response) && response.isValid == true) {
              this.GetRelativeGrid();

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

    selectedRelatveid: number = -1;
   
    
    //AcademicDateFrom: string = "";
    //AcademicDateTo: string = "";

    onUpdateRelative_Click(selectedRow: any) {

      this.isMandatoryfields = false;
      this.isUpdateRelative = true;
      this.isTextActive = false;
      this.isTextActiveInstitute = false;

      console.log("Usama" ,selectedRow);

      this.selectedRelatveid = selectedRow.RecRelid;

      this.RelativeinAtco = selectedRow.Descriptive_Name;
      this.Relativedesignation = selectedRow.Descriptive_Designation;

      const Relation_relative = this.RelationshipDropdown.find(r => r.Id == String(selectedRow.RelationshipId));
      this.Relationship2 = Relation_relative || null;
      
      
      

    }

    RelationshipDropdown: any;
    RelationdropdownId: string = "";
    RelationDropdownName: string = "";
    selectedRelationship: string = "";
    Relationshipdropdownid: string = "";

    getRelativeRelationName(RelationshipId: string | null): string {

      //console.log('Looking for relation ID:', rlnid);

      try {
        if (this.RelationshipDropdown != null) {
          const relation = this.RelationshipDropdown.find(r => r.Id == RelationshipId);
          return relation ? relation.Name : 'N/A';
        }
      } catch (error) {
        console.error('Error occurred while fetching relationship:', error);
        return 'N/A'; // Return 'N/A' if an error occurs
      }
    }

    // Relationship Dropdown //

    getRelationDropdown() {

      let RequestObject = {

        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId,

      }

      let getRelationshipDropdown = this._config.environment.baseUrl + Constants.GetRelationshipDropdown + "?Culture=" + Constants.Culture;
      this.http.post(getRelationshipDropdown, RequestObject, { headers: this.dataService.headers })
        //  this.http.get("https://jobportalapi.azurewebsites.net/GetRelationshipDropdown?Culture=en-GB")
        .subscribe((response: any) => {

          //console.log("bank Response:", response);

          this.RelationshipDropdown = response;
          //console.log("Selected Relationship:11111", this.RelationshipDropdown);


          if (!isNullOrUndefined(this.RelationshipDropdown) && this.RelationshipDropdown.length > 0)
            this.RelationdropdownId = this.RelationshipDropdown[0].Id;
          this.RelationDropdownName = this.RelationshipDropdown[0].Name;

          setTimeout(() => {
            const selectedRelationship = this.RelationshipDropdown.find(Relation => Relation.Id == this.Relationshipdropdownid);

            if (selectedRelationship) {
              this.selectedRelationship = selectedRelationship.Name;
            } else {
              this.selectedRelationship = 'Relationship Not Found ';
            }
          }, 1000);


        }, (error: any) => {
          console.log(error);
        });
    }

    // for delete Competency Skill //

    deleteCompetenciesData: any;


    deleteCompetencies(RCId: number) {
        
        if (this.iscom == true) {
            this.delCompetency
            let RequestObject = {
                AppId: localStorage.getItem("AppId"),
                RCId: RCId

            };

            this.openSpinner();
            let deleteCompetencies = this._config.environment.baseUrl + Constants.DeleteCompetencies;
            this.http.post(deleteCompetencies, RequestObject, { headers: this.dataService.headers })
                //   this.http.post("https://jobportalapi.azurewebsites.net/DeleteCompetencies", RequestObject)
                .subscribe((response: any) => {

                    this.deleteCompetenciesData = response.Data;
                    this.getCompetencySkillsDetail();
                    this.getLastProfileUpdateValue();
                    this.HideSpinner();

                    //POPUP FOR DELETE//
                    if (this.iscom == true) {
                        //this.toastr.success(response.Msg, '', {
                        //    positionClass: "toast-bottom-right",
                        //});
                        $("#SuccessPopup").modal('show');
                        this.isTick = true;
                        this.SuccessMsg = response.Msg;

                        this.delCompetency = "";
                        this.iscom = false;
                        this.popuphide();
                    }
                }, (error: any) => {
                    console.log(error);
                });
        }
    }

    // Update For Competency Skill //

    updateCompetencySkill(selectedRow: any) {
        if (navigator.onLine) {
            let RequestObject = {
                RCId: selectedRow.RCId,
                AppId: localStorage.getItem("AppId"),
                Email: localStorage.getItem("Email"),
                Action: Action.Update,
            }

            this.openSpinner();
            let updateCompetencieSkills = this._config.environment.baseUrl + Constants.SaveCompetencieSkills;
            this.http.post(updateCompetencieSkills, RequestObject, { headers: this.dataService.headers })
                .subscribe((response: any) => {

                    this.HideSpinner();
                    if (!isNullOrUndefined(response) && response.isValid == true) {
                        this.getCompetencySkillsDetail();

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

    selectedRCId: number = -1;

    onUpdateCompetencySkill_Click(selectedRow: any) {

        
        this.isMandatoryfields = false;
        this.isUpdateCompetencySkill = true;
        this.selectedRCId = selectedRow.RCId;

        this.ddlCompetency = selectedRow.SubSecDetailId;
        this.ddlRequiRatingCompetency = selectedRow.Rating;
        this.RemarksCompetency = selectedRow.Remarks;


    }



    // Professional Detail  //

    ProfessRefDetail: any;

    getProfessRefDetail() {

        let RequestObject = {
            ApplicantId: localStorage.getItem("AppId"),
            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId
        }
        this.openSpinner();
        let getProfessRefDetail = this._config.environment.baseUrl + Constants.GetProfessRefDetail;
        this.http.post(getProfessRefDetail, RequestObject, { headers: this.dataService.headers })
            // this.http.post("https://jobportalapi.azurewebsites.net/GetProfessRefDetail", RequestObject)
            .subscribe((response: any) => {

                this.ProfessRefDetail = response;
                
                this.HideSpinner();
            }, (error: any) => {
                console.log(error);
            });
    }

    // for scortype Refresh //

    getScoreTypeRef() {
        this.Grade = '';
    }


    // for Proffessional reference //

    DesignationProfessionalReference: string = "";
    CurrentCompanyProfessionalReference: string = "";
    ContactNumberProfessionalReference: string = "";
    EmailProfessionalReference;
    ReportingToProfessionalReference: string = "";
    RelationshipProfessionalReference: string = "";
    AddressTypeProfessionalReference: string = "";
    NameProfessionalReference: string = "";
    PostalAddressProfessionalReference: string = "";
    EmailProfessionalReference1;
    EmailValidation: boolean = false;

    validateEmail(EmailProfessionalReference) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(EmailProfessionalReference);
    }

    showPhoneNumberError: boolean = false;

    validate() {
        this.isMandatoryfields = false;
        this.EmailValidation = false;
        var $result = $("#result");
        var EmailProfessionalReference = $("#EmailProfessionalReference").val();
        $result.text("");

        if (this.NameProfessionalReference == "" || this.DesignationProfessionalReference == "" || /*this.RelationshipProfessionalReference == "" ||*/ this.ContactNumberProfessionalReference == "") {
            this.isMandatoryfields = true;
            this.EmailValidation = false;
            return false;
        }
        if (this.ContactNumberProfessionalReference.trim() && !this.validatePhoneNumber(this.ContactNumberProfessionalReference)) {
          this.showPhoneNumberError = true;
          //this.isBtnHide23 = true;
          return;
        }


        if (this.EmailProfessionalReference !== '') {
            if (this.validateEmail(EmailProfessionalReference)) {
                // $result.text(APEmail + " is valid :)");
                this.EmailValidation = false;
                this.isMandatoryfields = false;

            } else {
                //  $result.text(APEmail + " is not valid :(");
                this.EmailValidation = true;
                this.isMandatoryfields = false;
                return false;
            }
          
        }
        this.SaveProfessionalReference();
    }

  //  $("#validate").on("click", validate);

    SaveProfessionalReference() {

        if (navigator.onLine) {
            
            //if (this.EmailProfessionalReference !== "" || this.EmailProfessionalReference !== null) {
            //    if (this.EmailProfessionalReference[0].search != '@' && this.EmailProfessionalReference[0].search != '.com') {
            //        console.log("Invalid Email");
            //        return;
            //    }
            //}

            //if (this.NameProfessionalReference == "" || this.DesignationProfessionalReference == "" || this.RelationshipProfessionalReference == "" || this.ContactNumberProfessionalReference == "") {
            //    this.isMandatoryfields = true;
            //}
            //if (this.forDateVlaidation == false) {
            //    this.isCorrectDateRefference = true;
            //    return;
            //}




                let RequestObject = {
                    Refid: (this.isUpdateProfessionalReference == true) ? this.selectedRefid : 0,
                    AppId: localStorage.getItem("AppId"),
                    RefName: this.dataService.ReplaceApostropheWthTelda(this.NameProfessionalReference),
                    Designation: this.dataService.ReplaceApostropheWthTelda(this.DesignationProfessionalReference),
                    Company: this.dataService.ReplaceApostropheWthTelda(this.CurrentCompanyProfessionalReference),
                    Phone: this.ContactNumberProfessionalReference,
                    Email: this.dataService.ReplaceApostropheWthTelda(this.EmailProfessionalReference),
                    ReportingTo: this.dataService.ReplaceApostropheWthTelda(this.ReportingToProfessionalReference),
                    Relationship: this.dataService.ReplaceApostropheWthTelda(this.RelationshipProfessionalReference),
                    CompanyId: this.CompanyIdService.CompanyId,
                    Address: this.dataService.ReplaceApostropheWthTelda(this.PostalAddressProfessionalReference),
                    AddressType: this.AddressTypeProfessionalReference,
                    Action: (this.isUpdateProfessionalReference == true) ? Action.Update : Action.Insert,

                }

                this.openSpinner();
                let saveProfessionalReferences = this._config.environment.baseUrl + Constants.SaveProfessionalReferences;
                this.PostData(RequestObject, saveProfessionalReferences, { headers: this.dataService.headers });
                // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/SaveQualification");
                $("#myModal6").modal("toggle");
                this.getProfessRefDetail();
            }
        
        else {

            this.DisconnectInternet = true;
        }

    }

    // for delete Professional Reference //

    deleteProfReferenceData: any;


    deleteProfReference(Refid: number) {
        
        this.delprofessionalRef
        if (this.ispro == true) {
            let RequestObject = {
                AppId: localStorage.getItem("AppId"),
                Refid: Refid

            };

            this.openSpinner();
            let deleteProfReference = this._config.environment.baseUrl + Constants.DeleteProfReference;
            this.http.post(deleteProfReference, RequestObject, { headers: this.dataService.headers })
                //   this.http.post("https://jobportalapi.azurewebsites.net/DeleteProfReference", RequestObject)
                .subscribe((response: any) => {

                    this.deleteProfReferenceData = response.Data;
                    this.getProfessRefDetail();
                    this.getLastProfileUpdateValue();
                    this.HideSpinner();

                    //POPUP FOR DELETE//
                    if (this.ispro == true) {
                        //this.toastr.success(response.Msg, '', {
                        //    positionClass: "toast-bottom-right",
                        //});
                        $("#SuccessPopup").modal('show');
                        this.isTick = true;
                        this.SuccessMsg = response.Msg;

                        this.delprofessionalRef = "";
                        this.ispro = false;
                        this.popuphide();
                    }

                }, (error: any) => {
                    console.log(error);
                });
        }
    }

    // Update For Professional Reference //

    updateProfessionalReference(selectedRow: any) {
        if (navigator.onLine) {
            let RequestObject = {
                Refid: selectedRow.Refid,
                AppId: localStorage.getItem("AppId"),
                Email: localStorage.getItem("Email"),
                Action: Action.Update,
            }

            this.openSpinner();
            let saveProfessionalReferences = this._config.environment.baseUrl + Constants.SaveProfessionalReferences;
            this.http.post(saveProfessionalReferences, RequestObject, { headers: this.dataService.headers })
                .subscribe((response: any) => {

                    this.HideSpinner();
                    if (!isNullOrUndefined(response) && response.isValid == true) {
                        this.getCompetencySkillsDetail();

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

    selectedRefid: number = -1;
    AddressTypeP: boolean = false;
    AddressTypeB: boolean = false;

    onUpdateProfessionalReference_Click(selectedRow: any) {
        
        this.isMandatoryfields = false;
        this.isUpdateProfessionalReference = true;
        this.selectedRefid = selectedRow.Refid;

        this.NameProfessionalReference = selectedRow.RefName;
        this.DesignationProfessionalReference = selectedRow.Designation;
        this.CurrentCompanyProfessionalReference = selectedRow.Company;
        this.ContactNumberProfessionalReference = selectedRow.Phone;

        this.EmailProfessionalReference = selectedRow.Email;
        this.ReportingToProfessionalReference = selectedRow.ReportingTo;
        this.RelationshipProfessionalReference = selectedRow.Relationship;
        this.PostalAddressProfessionalReference = selectedRow.Address;
        this.AddressTypeProfessionalReference = selectedRow.AddressType;
        //if (this.AddressTypeProfessionalReference == "P") {
        //    this.AddressTypeP = true;
        //}
        //if (this.AddressTypeProfessionalReference == "B") {
        //    this.AddressTypeB = true;
        //}

    }

    resetDate() {
      console.log(this.objDatePickerComponent)
      if (!isNullOrUndefined(this.objDatePickerComponent)) {
        console.log(this.objDatePickerComponent);
        for (var i = 0; i < this.objDatePickerComponent.length; i++) {
          this.objDatePickerComponent["_results"][i].reset();
        }
        
      //if (this.onEdit) {

      //  for (var i = 1; i <= 1; i++) {
      //    this.objDatePickerComponent["_results"][i].reset();
      //  }
      //}
 //     else {

        //for (var i = 0; i <= 0; i++) {
        //  this.objDatePickerComponent["_results"][i].reset();
        //}
        //for (var i = 1; i <= 1; i++) {
        //    this.objDatePickerComponent["_results"][i].reset();
        //}
        //for (var i = 2; i <= 2; i++) {
        //    this.objDatePickerComponent["_results"][i].reset();
        //}
        //for (var i = 3; i <= 3; i++) {
        //    this.objDatePickerComponent["_results"][i].reset();
        //}
        //for (var i = 4; i <= 4; i++) {
        //    this.objDatePickerComponent["_results"][i].reset();
        //}
        // for (var i = 5; i <= 5; i++) {
        //    this.objDatePickerComponent["_results"][i].reset();
        //}
        //for (var i = 6; i <= 6; i++) {
        //    this.objDatePickerComponent["_results"][i].reset();
        //}
        //for (var i = 7; i <= 7; i++) {
        //    this.objDatePickerComponent["_results"][i].reset();
        //}

 //     }
    }
  }


    handleAcademicEdit(item: any): void {
      debugger;
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.onUpdateAcademic_Click(item); 
        this.ForSelectedRowColor();
      } else {


      }
    }

    handleAcademicDeleteClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.setId(item);
        $('#myModalFordelete1').modal('show');
      } else {


      }
    }

    handleCertificationsEdit(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.onUpdateCertification_Click(item);
        this.ForSelectedRowColor1();
      } else {


      }
    }

    handleCertificationsDeleteClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.setId(item);
        $('#myModalFordelete1').modal('show');
      } else {


      }
    }



    handleTrainingsEdit(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.onUpdateTraining_Click(item);
        this.ForSelectedRowColor2();
      } else {


      }
    }

    handleTrainingsDeleteClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.setId(item);
        $('#myModalFordelete1').modal('show');
      } else {


      }
    }

  handleExperienceEdit(item: any): void {
    if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.onUpdateExperience_Click(item);
        this.ForSelectedRowColor3();
      } else {


      }
    }



  handleExperienceDeleteClick(item: any): void {
    if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
      this.setId(item);
      $('#myModalFordelete1').modal('show');
    } else {


    }
  }


  handleRelativeInTPSEdit(item: any): void {
    if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
      this.onUpdateRelative_Click(item);
      this.ForSelectedRowColor5();
    } else {


    }
  }

    handleRelativeInTPSDeleteClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.setId(item);
        $('#myModalFordelete1').modal('show');
      } else {


      }
  }

    handleCompetenciesEdit(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.onUpdateCompetencySkill_Click(item);
        this.ForSelectedRowColor4();
      } else {


      }
    }

    handleCompetenciesDeleteClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.setId(item);
        $('#myModalFordelete1').modal('show');
      } else {


      }
    } 



    handleReferencesEdit(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.onUpdateProfessionalReference_Click(item);
        this.ForSelectedRowColor6();
      } else {


      }
    }


    handleReferencesDeleteClick(item: any): void {
      if (this.ApprovalStatus == 'R' || this.ApprovalStatus == null) {
        this.setId(item);
        $('#myModalFordelete1').modal('show');
      } else {


      }
    }

    


    clickRow: boolean = true;


    //For Selected Row Color

    ForSelectedRowColor() {
        
        this.btnAdd_Click1();
        if (this.clickRow == false) {
            $('#myModal1').modal('hide');
            this.clickRow = true;
        }
        else {
            $('#myModal1').modal('show');
            $("tbody tr").click(function () {
                $(this).addClass('selected').siblings().removeClass("selected");
            });
        }
    }

    ForSelectedRowColor1() {
        
        this.btnAdd_Click1();
        if (this.clickRow == false) {
            $('#myModal2').modal('hide');
            this.clickRow = true;
        }
        else {
            $('#myModal2').modal('show');
            $("tbody tr").click(function () {
                $(this).addClass('selected').siblings().removeClass("selected");
            });
        }
    }

    ForSelectedRowColor2() {
        this.btnAdd_Click1();
        if (this.clickRow == false) {
            $('#myModal3').modal('hide');
            this.clickRow = true;
        }
        else {
            $('#myModal3').modal('show');
            $("tbody tr").click(function () {
                $(this).addClass('selected').siblings().removeClass("selected");
            });
        }
    }

    ForSelectedRowColor3() {
        
        this.btnAdd_Click1();
        if (this.clickRow == false) {
            $('#myModal4').modal('hide');
            this.clickRow = true;
        }
        else {
            $('#myModal4').modal('show');
            $("tbody tr").click(function () {
                $(this).addClass('selected').siblings().removeClass("selected");
            });
        }
    }

    ForSelectedRowColor4() {
        this.btnAdd_Click1();
        if (this.clickRow == false) {
            $('#myModal5').modal('hide');
            this.clickRow = true;
        }
        else {
            $('#myModal5').modal('show');
            $("tbody tr").click(function () {
                $(this).addClass('selected').siblings().removeClass("selected");
            });
        }
    }

    ForSelectedRowColor5() {
      this.btnAdd_Click1();
      if (this.clickRow == false) {
        $('#myModal35').modal('hide');
        this.clickRow = true;
      }
      else {
        $('#myModal35').modal('show');
        $("tbody tr").click(function () {
          $(this).addClass('selected').siblings().removeClass("selected");
        });
      }
    }

    ForSelectedRowColor6() {
        this.btnAdd_Click1();
        if (this.clickRow == false) {
            $('#myModal6').modal('hide');
            this.clickRow = true;
        }
        else {
            $('#myModal6').modal('show');
            $("tbody tr").click(function () {
                $(this).addClass('selected').siblings().removeClass("selected");
            });
        }
    }








}
