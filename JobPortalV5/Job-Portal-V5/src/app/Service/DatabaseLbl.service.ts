import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Constants } from '../Helper/Constant';
import { AppConfigService } from '@app/Service/app-config.service';


@Injectable()
export class Labels {

    public MustSignedIn: string = "";
    public FirstName: string = "";
    public MiddleName: string = "";
    public LastName: string = "";
    public DateofBirth: string = "";
    public Gender: string = "";
    public IDCardNo: string = "";
    public PassportNo: string = "";
    public lblAccountId: string = "";
    public lblConfirmPassword: string = "";
    public lblTellUsAboutYourSelf: string = "";
    public btnSignUp: string = "";
    public APEmail: string = "";
    public Password: string = "";
    public lblStaySignedIn: string = "";
    public Login: string = "";
    public lblForgotPassword: string = "";
    public btnLogin: string = "";
    public ApplicantStatus: string = "";
    public OfferLetter: string = "";
    public OfferRescind: string = "";

    public lblOfferLetterStatus: string = "";
    public Department: string = "";
    public lblTotalPositions: string = "";
    public lblApplicationDeadline: string = "";
    public Description: string = "";
    public lblJobsIhaveAppliedFor: string = "";
    public lblWelcomeHeading1: string = "";
    public ApplyForAnySuiDept: string = "";
    public lblJobCode: string = "";
    public JobTitle: string = "";
    public lblJobStatus: string = "";
    public IDCardRemarks: string = "";
    public lblAreaOfInterest: string = "";
    public lblContactNoMobile: string = "";
    public lblContactNoOff: string = "";
    public lblContactNoRes: string = "";
    public lblCountryOfCurrentRes: string = "";
    public lblCityOfCurrentRes: string = "";
    public CompetenciesSkills: string = "";
    public ProfessionalReferences: string = "";
    public Degree: string = "";
    public SpecializationSubject: string = "";
    public EducationStatus: string = "";
    public Institute: string = "";
    public PercentageCGPA: string = "";
    public PassingYear: string = "";
    public Country: string = "";
    public City: string = "";
    public ScoreType: string = "";
    public DateFrom: string = "";
    public lblDateofcompletion: string = "";
    public Certification: string = "";
    public lblDateofAchievement: string = "";
    public DateofExpiry: string = "";
    public Institutes: string = "";
    public lblCurrentLastBenefits: string = "";
    public EmployerPhoneNo: string = "";
    public EmployerAddress: string = "";
    public lblIamcurrentlyworkinghere: string = "";
    public Competency: string = "";
    public Address: string = "";
    public lblIntroductoryVideoAttachment: string = "";
    public lblMiximumSize: string = "";
    public FinancialLiabilities: string = "";
    public ExistingInsuranceDetail: string = "";
    public SocialMediaConnections: string = "";
    public PersonalAttributes: string = "";
    public DocAttachment: string = "";
    public LoanDescription: string = "";
    public FinancialInstitution: string = "Financial Institution";
    public InstallmentRemaining: string = "";
    public RemainingLoanAmount: string = "";
    public Remarks: string = "";
    public InsuranceType: string = "";
    public InsuranceCompany: string = "";
    public PolicyNumber: string = "";
    public DateofPolicyExpiry: string = "";
    public SocialMediaType: string = "";
    public SocialMediaID: string = "";
    public AttributeType: string = "";
    public DocumentCategory: string = "";
    public DateofAttach: string = "";
    public Subject: string = "";
    public DocImgView: string = "";
    public Edit: string = "";
    public Add: string = "";
    public AcademicQualifications: string = "";
    public Certifications: string = "";
    public Trainings: string = "";
    public Experience: string = "";
    public lblCourseTitle: string = "";
    public TrainingSubject: string = "";
    public DateTo: string = "";
    public Company: string = "";
    public Designation: string = "";
    public lblJobResponsibilities: string = "";
    public LeavingReason: string = "";
    public CurrentLastSal: string = "";
    public Currency: string = "";
    public lblChangePassword: string = "";
    public lblChangeEmail: string = "";
    public lblCurrentPassword: string = "";
    public lblNewPassword: string = "";
    public lblChange: string = "";
    public Close: string = "";
    public lblWelcome: string = "";
    public lblWelcomePage1: string = "";
    public lblWelcomePage2: string = "";
    public Organization: string = "";
    public Apply: string = "";
    public BasicInformation1: string = "";
    public BasicInformation2: string = "";
    public ContactInformation: string = "";
    public lblTitle: string = "";
    public Religion: string = "";
    public WhencanyouJoin: string = "";
    public Nationality: string = "";
    public FamilyCardNo: string = "";
    public NativeLanguage: string = "";
    public ExpectedSalary: string = "";
    public MaritalStatus: string = "";
    public CountryofBirth: string = "";
    public CityofBirth: string = "";
    public Name: string = "";
    public RequiredRating: string = "";
    public ProfessionalRelationship: string = "";
    public lblCompanyCurrent: string = "";
    public ReportingTo: string = "";
    public ContactNumber: string = "";
    public AddressType: string = "";
    public PostalAddress: string = "";
    public Save: string = "";
    public lblSettings: string = "";
    public lblLogout: string = "";
    public lblChangeYourRegistrationEmail: string = "";
    public lblNewEmail: string = "";
    public BehavioralAssessment: string = "";
    public lblLastupdated: string = "";
    public CapabilityAssessment: string = "";
    public EmotionalIntelligenceAssessments: string = "";
    public lblSubmitBetween: string = "";
    public AssessmentStatus: string = "";
    public Questionnaire: string = "";
    public lblMyJobs: string = "";
    public PersonalInformation: string = "";
    public ProfessionalInformation: string = "";
    public Assessments: string = "";
    public lblApplicantPicture: string = "";
    public Upload: string = "";
    public Nodata: string = "";
    public lblJobDetail: string = "";
    public lblProfessionalInfo: string = "";
    public CapabilityAssessments: string = "";
    public lblPersonalInfo: string = "";

    // additon // 
    public LblPassword: string = "";
    public DepartmentMyJobs: string = "";
    public lblPleaseEnterYourEmailAddress: string = "";
    public lblConfirm: string = "";
    public lblPinCode: string = "";
    public lblPinCodeHeading: string = "";
    public lblReset: string = "";
    public lblVerifyEmail: string = "";
    public ThankYou: string = "";
    public Cancel: string = "";
    public DateofBirthdashboard: string = "";
    public lblMobileNumber: string = "";
    public EmailAddress: string = "";
    public Age: string = "";
    public lblProfileCompletion: string = "";
    public lblRemainingLoanAmount: string = "Remaining Loan Amount"
    public PhoneNoOff: string = "Phone No. (Office)";
    public PhoneNoRes: string = "Phone No. (Residence)"
    public lblAll: string = "All"
    public lblLocation: string = "Location"

    // yeh hoey nh hn (if wali condition)//

    public lblDear: string = "";
    public lblAccountActivation: string = "";
    public lblViewProfile: string = "";
    public lblThankYou: string = "";
    public IntroductoryVideo: string = "";




    constructor(private http: HttpClient, private _config: AppConfigService) {

        this.getLabels();
      
    }

    Code: string;
    dashLabels: boolean = false;

    getLabels() {

        
        let getlabels = this._config.environment.baseUrl + Constants.GetLabels + "?Culture=" + Constants.Culture;
        this.http.get(getlabels).subscribe((response: any) => {
            this.dashLabels = response.IsValid;
            for (let value of response.LabelModel) {

                // For Home //

                if (value.Code == "lblLogout" && value.FormID == "Welcome") {
                    this.lblLogout = value.LabelDescription;
                }
                if (value.Code == "lblChangePassword" && value.FormID == "Welcome") {

                    this.lblChangePassword = value.LabelDescription;
                }
                if (value.Code == "lblChangeEmail" && value.FormID == "Welcome") {

                    this.lblChangeEmail = value.LabelDescription;
                }
                if (value.Code == "lblCurrentPassword" && value.FormID == "Welcome") {

                    this.lblCurrentPassword = value.LabelDescription;
                }
                if (value.Code == "lblNewPassword" && value.FormID == "Welcome") {

                    this.lblNewPassword = value.LabelDescription;
                }
                if (value.Code == "lblConfirmPassword" && value.FormID == "Welcome") {

                    this.lblConfirmPassword = value.LabelDescription;
                }
                if (value.Code == "lblChange" && value.FormID == "Welcome") {

                    this.lblChange = value.LabelDescription;
                }
                if (value.Code == "Close" && value.FormID == "Welcome") {

                    this.Close = value.LabelDescription;
                }
                if (value.Code == "lblWelcome" && value.FormID == "Welcome") {

                    this.lblWelcome = value.LabelDescription;
                }
                if (value.Code == "lblWelcomeHeading1" && value.FormID == "Welcome") {

                    this.lblWelcomeHeading1 = value.LabelDescription;
                }
                if (value.Code == "lblWelcomePage1" && value.FormID == "Welcome") {

                    this.lblWelcomePage1 = value.LabelDescription;
                }
                if (value.Code == "lblWelcomePage2" && value.FormID == "Welcome") {

                    this.lblWelcomePage2 = value.LabelDescription;
                }
                if (value.Code == "Organization" && value.FormID == "Welcome") {

                    this.Organization = value.LabelDescription;
                }
                if (value.Code == "lblJobCode" && value.FormID == "Welcome") {

                    this.lblJobCode = value.LabelDescription;
                }
                if (value.Code == "JobTitle" && value.FormID == "Welcome") {

                    this.JobTitle = value.LabelDescription;
                }
                if (value.Code == "Department" && value.FormID == "Welcome") {

                    this.Department = value.LabelDescription;
                }
                if (value.Code == "lblTotalPositions" && value.FormID == "Welcome") {

                    this.lblTotalPositions = value.LabelDescription;
                }
                if (value.Code == "lblApplicationDeadline" && value.FormID == "Welcome") {

                    this.lblApplicationDeadline = value.LabelDescription;
                }
                if (value.Code == "Apply" && value.FormID == "Welcome") {

                    this.Apply = value.LabelDescription;
                }
                if (value.Code == "Nodata" && value.FormID == "Welcome") {

                    this.Nodata = value.LabelDescription;
                }
                if (value.Code == "lblJobDetail" && value.FormID == "Welcome") {

                    this.lblJobDetail = value.LabelDescription;
                }

                // for Login //

                if (value.Code == "btnLogin" && value.FormID == "Login") {

                    this.btnLogin = value.LabelDescription;
                }
                if (value.Code == "btnSignUp" && value.FormID == "Login") {

                    this.btnSignUp = value.LabelDescription;
                }
                if (value.Code == "Login" && value.FormID == "Login") {

                    this.Login = value.LabelDescription;
                }
                if (value.Code == "APEmail" && value.FormID == "Login") {

                    this.APEmail = value.LabelDescription;
                }
                if (value.Code == "Password" && value.FormID == "Login") {

                    this.LblPassword = value.LabelDescription;
                }
                if (value.Code == "lblStaySignedIn" && value.FormID == "Login") {

                    this.lblStaySignedIn = value.LabelDescription;
                }
                if (value.Code == "lblForgotPassword" && value.FormID == "Login") {

                    this.lblForgotPassword = value.LabelDescription;
                }

                // for SignUp // 

                if (value.Code == "MustSignedIn" && value.FormID == "Login") {

                    this.MustSignedIn = value.LabelDescription;
                }

                if (value.Code == "FirstName" && value.FormID == "Login") {

                    this.FirstName = value.LabelDescription;
                }
                if (value.Code == "MiddleName" && value.FormID == "Login") {

                    this.MiddleName = value.LabelDescription;
                }
                if (value.Code == "LastName" && value.FormID == "Login") {

                    this.LastName = value.LabelDescription;
                }
                if (value.Code == "DateofBirth" && value.FormID == "Login") {

                    this.DateofBirth = value.LabelDescription;
                }
                if (value.Code == "Gender" && value.FormID == "Login") {

                    this.Gender = value.LabelDescription;
                }
                if (value.Code == "IDCardNo" && value.FormID == "Login") {

                    this.IDCardNo = value.LabelDescription;
                }
                if (value.Code == "PassportNo" && value.FormID == "Login") {

                    this.PassportNo = value.LabelDescription;
                }
                if (value.Code == "lblAccountId" && value.FormID == "Login") {

                    this.lblAccountId = value.LabelDescription;
                }
                if (value.Code == "lblConfirmPassword" && value.FormID == "Login") {

                    this.lblConfirmPassword = value.LabelDescription;
                }
                if (value.Code == "lblTellUsAboutYourSelf" && value.FormID == "Login") {

                    this.lblTellUsAboutYourSelf = value.LabelDescription;
                }
                if (value.Code == "btnSignUp" && value.FormID == "Login") {

                    this.btnSignUp = value.LabelDescription;
                }

                // For Myjobs //

                if (value.Code == "ApplicantStatus" && value.FormID == "MyJobs") {

                    this.ApplicantStatus = value.LabelDescription;
                }
                if (value.Code == "OfferLetter" && value.FormID == "MyJobs") {

                    this.OfferLetter = value.LabelDescription;
                }
                if (value.Code == "lblOfferLetterStatus" && value.FormID == "MyJobs") {

                    this.lblOfferLetterStatus = value.LabelDescription;
                }
                if (value.Code == "Department" && value.FormID == "MyJobs") {

                    this.DepartmentMyJobs = value.LabelDescription;
                }
                if (value.Code == "lblTotalPositions" && value.FormID == "MyJobs") {

                    this.lblTotalPositions = value.LabelDescription;
                }
                if (value.Code == "lblApplicationDeadline" && value.FormID == "MyJobs") {

                    this.lblApplicationDeadline = value.LabelDescription;
                }
                if (value.Code == "Description" && value.FormID == "MyJobs") {

                    this.Description = value.LabelDescription;
                }
                if (value.Code == "lblJobsIhaveAppliedFor" && value.FormID == "MyJobs") {

                    this.lblJobsIhaveAppliedFor = value.LabelDescription;
                }
                if (value.Code == "lblWelcomeHeading1" && value.FormID == "MyJobs") {

                    this.lblWelcomeHeading1 = value.LabelDescription;
                }
                if (value.Code == "ApplyForAnySuiDept" && value.FormID == "MyJobs") {

                    this.ApplyForAnySuiDept = value.LabelDescription;
                }
                if (value.Code == "lblJobCode" && value.FormID == "MyJobs") {

                    this.lblJobCode = value.LabelDescription;
                }
                if (value.Code == "JobTitle" && value.FormID == "MyJobs") {

                    this.JobTitle = value.LabelDescription;
                }
                if (value.Code == "lblJobStatus" && value.FormID == "MyJobs") {

                    this.lblJobStatus = value.LabelDescription;
                }
                if (value.Code == "lblMobileNumber" && value.FormID == "MyJobs") {

                    this.lblMobileNumber = value.LabelDescription;
                }
                if (value.Code == "EmailAddress" && value.FormID == "MyJobs") {

                    this.EmailAddress = value.LabelDescription;
                }
                if (value.Code == "Address" && value.FormID == "MyJobs") {

                    this.Address = value.LabelDescription;
                }
                if (value.Code == "DateofBirth" && value.FormID == "MyJobs") {

                    this.DateofBirthdashboard = value.LabelDescription;
                }
                if (value.Code == "Age" && value.FormID == "MyJobs") {

                    this.Age = value.LabelDescription;
                }
                if (value.Code == "lblProfileCompletion" && value.FormID == "MyJobs") {

                    this.lblProfileCompletion = value.LabelDescription;
                }
   

                        // For PersonalInfo //

                if (value.Code == "IDCardRemarks" && value.FormID == "PersonalInfo") {

                    this.IDCardRemarks = value.LabelDescription;
                }
                if (value.Code == "PhoneNoOff" && value.FormID == "PersonalInfo") {

                    this.PhoneNoOff = value.LabelDescription;
                }
                if (value.Code == "PhoneNoRes" && value.FormID == "PersonalInfo") {

                    this.PhoneNoRes = value.LabelDescription;
                }
                if (value.Code == "lblAreaOfInterest" && value.FormID == "PersonalInfo") {

                    this.lblAreaOfInterest = value.LabelDescription;
                }
                if (value.Code == "lblContactNoMobile" && value.FormID == "PersonalInfo") {

                    this.lblContactNoMobile = value.LabelDescription;
                }
                if (value.Code == "lblContactNoOff" && value.FormID == "PersonalInfo") {

                    this.lblContactNoOff = value.LabelDescription;
                }
                if (value.Code == "lblContactNoRes" && value.FormID == "PersonalInfo") {

                    this.lblContactNoRes = value.LabelDescription;
                }
                if (value.Code == "lblCountryOfCurrentRes" && value.FormID == "PersonalInfo") {

                    this.lblCountryOfCurrentRes = value.LabelDescription;
                }
                if (value.Code == "lblCityOfCurrentRes" && value.FormID == "PersonalInfo") {

                    this.lblCityOfCurrentRes = value.LabelDescription;
                }
                if (value.Code == "Address" && value.FormID == "PersonalInfo") {

                    this.Address = value.LabelDescription;
                } 
                if (value.Code == "IntroductoryVideo" && value.FormID == "PersonalInfo") {

                    this.IntroductoryVideo = value.LabelDescription;
                }
                if (value.Code == "lblIntroductoryVideoAttachment" && value.FormID == "PersonalInfo") {

                    this.lblIntroductoryVideoAttachment = value.LabelDescription;
                }
                if (value.Code == "lblMiximumSize" && value.FormID == "PersonalInfo") {

                    this.lblMiximumSize = value.LabelDescription;
                }
                if (value.Code == "FinancialLiabilities" && value.FormID == "PersonalInfo") {

                    this.FinancialLiabilities = value.LabelDescription;
                }
                if (value.Code == "ExistingInsuranceDetail" && value.FormID == "PersonalInfo") {

                    this.ExistingInsuranceDetail = value.LabelDescription;
                }
                if (value.Code == "SocialMediaConnections" && value.FormID == "PersonalInfo") {

                    this.SocialMediaConnections = value.LabelDescription;
                }
                if (value.Code == "PersonalAttributes" && value.FormID == "PersonalInfo") {

                    this.PersonalAttributes = value.LabelDescription;
                }
                if (value.Code == "DocAttachment" && value.FormID == "PersonalInfo") {

                    this.DocAttachment = value.LabelDescription;
                }
                if (value.Code == "LoanDescription" && value.FormID == "PersonalInfo") {

                    this.LoanDescription = value.LabelDescription;
                }
                if (value.Code == "FinancialInstitution" && value.FormID == "PersonalInfo") {

                    this.FinancialInstitution = value.LabelDescription;
                }
                if (value.Code == "InstallmentRemaining" && value.FormID == "PersonalInfo") {

                    this.InstallmentRemaining = value.LabelDescription;
                }
                if (value.Code == "RemainingLoanAmount" && value.FormID == "MyJoPersonalInfobs") {

                    this.RemainingLoanAmount = value.LabelDescription;
                }
                if (value.Code == "Remarks" && value.FormID == "PersonalInfo") {

                    this.Remarks = value.LabelDescription;
                }
                if (value.Code == "InsuranceType" && value.FormID == "PersonalInfo") {

                    this.InsuranceType = value.LabelDescription;
                }
                if (value.Code == "InsuranceCompany" && value.FormID == "PersonalInfo") {

                    this.InsuranceCompany = value.LabelDescription;
                }
                if (value.Code == "PolicyNumber" && value.FormID == "PersonalInfo") {

                    this.PolicyNumber = value.LabelDescription;
                }
                if (value.Code == "DateofPolicyExpiry" && value.FormID == "PersonalInfo") {

                    this.DateofPolicyExpiry = value.LabelDescription;
                }
                if (value.Code == "SocialMediaType" && value.FormID == "PersonalInfo") {

                    this.SocialMediaType = value.LabelDescription;
                }
                if (value.Code == "SocialMediaID" && value.FormID == "PersonalInfo") {

                    this.SocialMediaID = value.LabelDescription;
                }
                if (value.Code == "AttributeType" && value.FormID == "PersonalInfo") {

                    this.AttributeType = value.LabelDescription;
                }
                if (value.Code == "DocumentCategory" && value.FormID == "PersonalInfo") {

                    this.DocumentCategory = value.LabelDescription;
                }
                if (value.Code == "DateofAttach" && value.FormID == "PersonalInfo") {

                    this.DateofAttach = value.LabelDescription;
                }
                if (value.Code == "Subject" && value.FormID == "PersonalInfo") {

                    this.Subject = value.LabelDescription;
                }
                if (value.Code == "DocImgView" && value.FormID == "PersonalInfo") {

                    this.DocImgView = value.LabelDescription;
                }
                if (value.Code == "Edit" && value.FormID == "PersonalInfo") {

                    this.Edit = value.LabelDescription;
                }
                if (value.Code == "Add" && value.FormID == "PersonalInfo") {

                    this.Add = value.LabelDescription;
                }
                if (value.Code == "BasicInformation1" && value.FormID == "PersonalInfo") {

                    this.BasicInformation1 = value.LabelDescription;
                }
                if (value.Code == "BasicInformation2" && value.FormID == "PersonalInfo") {

                    this.BasicInformation2 = value.LabelDescription;
                }
                if (value.Code == "ContactInformation" && value.FormID == "PersonalInfo") {

                    this.ContactInformation = value.LabelDescription;
                }
                if (value.Code == "Title" && value.FormID == "PersonalInfo") {

                    this.lblTitle = value.LabelDescription;
                }
                if (value.Code == "Religion" && value.FormID == "PersonalInfo") {

                    this.Religion = value.LabelDescription;
                }
                if (value.Code == "WhencanyouJoin" && value.FormID == "PersonalInfo") {

                    this.WhencanyouJoin = value.LabelDescription;
                }
                if (value.Code == "PassportNo" && value.FormID == "PersonalInfo") {

                    this.PassportNo = value.LabelDescription;
                }
                if (value.Code == "Nationality" && value.FormID == "PersonalInfo") {

                    this.Nationality = value.LabelDescription;
                }
                if (value.Code == "CurrentLastSal" && value.FormID == "PersonalInfo") {

                    this.CurrentLastSal = value.LabelDescription;
                }
                if (value.Code == "FamilyCardNo" && value.FormID == "PersonalInfo") {

                    this.FamilyCardNo = value.LabelDescription;
                }
                if (value.Code == "NativeLanguage" && value.FormID == "PersonalInfo") {

                    this.NativeLanguage = value.LabelDescription;
                }
                if (value.Code == "ExpectedSalary" && value.FormID == "PersonalInfo") {

                    this.ExpectedSalary = value.LabelDescription;
                }
                if (value.Code == "FirstName" && value.FormID == "PersonalInfo") {

                    this.FirstName = value.LabelDescription;
                }
                if (value.Code == "LastName" && value.FormID == "PersonalInfo") {

                    this.LastName = value.LabelDescription;
                }
                if (value.Code == "MiddleName" && value.FormID == "PersonalInfo") {

                    this.MiddleName = value.LabelDescription;
                }
                if (value.Code == "MaritalStatus" && value.FormID == "PersonalInfo") {

                    this.MaritalStatus = value.LabelDescription;
                }
                if (value.Code == "Gender" && value.FormID == "PersonalInfo") {

                    this.Gender = value.LabelDescription;
                }
                if (value.Code == "DateofBirth" && value.FormID == "PersonalInfo") {

                    this.DateofBirth = value.LabelDescription;
                }
                if (value.Code == "CountryofBirth" && value.FormID == "PersonalInfo") {

                    this.CountryofBirth = value.LabelDescription;
                }
                if (value.Code == "CityofBirth" && value.FormID == "PersonalInfo") {

                    this.CityofBirth = value.LabelDescription;
                }
                if (value.Code == "IDCardNo" && value.FormID == "PersonalInfo") {

                    this.IDCardNo = value.LabelDescription;
                }
                if (value.Code == "Save" && value.FormID == "ProfessionalInfo") {

                    this.Save = value.LabelDescription;
                }


                // For Professional // 

                if (value.Code == "CompetenciesSkills" && value.FormID == "ProfessionalInfo") {

                    this.CompetenciesSkills = value.LabelDescription;
                }
                if (value.Code == "ProfessionalReferences" && value.FormID == "ProfessionalInfo") {

                    this.ProfessionalReferences = value.LabelDescription;
                }
                if (value.Code == "Degree" && value.FormID == "ProfessionalInfo") {

                    this.Degree = value.LabelDescription;
                }
                if (value.Code == "SpecializationSubject" && value.FormID == "ProfessionalInfo") {

                    this.SpecializationSubject = value.LabelDescription;
                }
                if (value.Code == "EducationStatus" && value.FormID == "ProfessionalInfo") {

                    this.EducationStatus = value.LabelDescription;
                }
                if (value.Code == "Institute" && value.FormID == "ProfessionalInfo") {

                    this.Institute = value.LabelDescription;
                }
                if (value.Code == "PercentageCGPA" && value.FormID == "ProfessionalInfo") {

                    this.PercentageCGPA = value.LabelDescription;
                }
                if (value.Code == "PassingYear" && value.FormID == "ProfessionalInfo") {

                    this.PassingYear = value.LabelDescription;
                }
                if (value.Code == "Country" && value.FormID == "ProfessionalInfo") {

                    this.Country = value.LabelDescription;
                }
                if (value.Code == "City" && value.FormID == "ProfessionalInfo") {

                    this.City = value.LabelDescription;
                }
                if (value.Code == "ScoreType" && value.FormID == "ProfessionalInfo") {

                    this.ScoreType = value.LabelDescription;
                }
                if (value.Code == "DateFrom" && value.FormID == "ProfessionalInfo") {

                    this.DateFrom = value.LabelDescription;
                }
                if (value.Code == "lblDateofcompletion" && value.FormID == "ProfessionalInfo") {

                    this.lblDateofcompletion = value.LabelDescription;
                }
                if (value.Code == "Certifications" && value.FormID == "ProfessionalInfo") {

                    this.Certification = value.LabelDescription;
                }
                if (value.Code == "lblDateofAchievement" && value.FormID == "ProfessionalInfo") {

                    this.lblDateofAchievement = value.LabelDescription;
                }
                if (value.Code == "DateofExpiry" && value.FormID == "ProfessionalInfo") {

                    this.DateofExpiry = value.LabelDescription;
                }
                if (value.Code == "Institutes" && value.FormID == "ProfessionalInfo") {

                    this.Institutes = value.LabelDescription;
                }
                if (value.Code == "lblCurrentLastBenefits" && value.FormID == "ProfessionalInfo") {

                    this.lblCurrentLastBenefits = value.LabelDescription;
                }
                if (value.Code == "EmployerPhoneNo" && value.FormID == "ProfessionalInfo") {

                    this.EmployerPhoneNo = value.LabelDescription;
                }
                if (value.Code == "EmployerAddress" && value.FormID == "ProfessionalInfo") {

                    this.EmployerAddress = value.LabelDescription;
                }
                if (value.Code == "lblIamcurrentlyworkinghere" && value.FormID == "ProfessionalInfo") {

                    this.lblIamcurrentlyworkinghere = value.LabelDescription;
                }
                if (value.Code == "Competency" && value.FormID == "ProfessionalInfo") {

                    this.Competency = value.LabelDescription;
                }
                if (value.Code == "AcademicQualifications" && value.FormID == "ProfessionalInfo") {

                    this.AcademicQualifications = value.LabelDescription;
                }
                if (value.Code == "Certifications" && value.FormID == "ProfessionalInfo") {

                    this.Certifications = value.LabelDescription;
                }
                if (value.Code == "Trainings" && value.FormID == "ProfessionalInfo") {

                    this.Trainings = value.LabelDescription;
                }
                if (value.Code == "Experience" && value.FormID == "ProfessionalInfo") {

                    this.Experience = value.LabelDescription;
                }
                if (value.Code == "Address" && value.FormID == "ProfessionalInfo") {

                    this.Address = value.LabelDescription;
                }
                if (value.Code == "lblCourseTitle" && value.FormID == "ProfessionalInfo") {

                    this.lblCourseTitle = value.LabelDescription;
                }
                if (value.Code == "TrainingSubject" && value.FormID == "ProfessionalInfo") {

                    this.TrainingSubject = value.LabelDescription;
                }
                if (value.Code == "DateTo" && value.FormID == "ProfessionalInfo") {

                    this.DateTo = value.LabelDescription;
                }
                if (value.Code == "Company" && value.FormID == "ProfessionalInfo") {

                    this.Company = value.LabelDescription;
                }
                if (value.Code == "Designation" && value.FormID == "ProfessionalInfo") {

                    this.Designation = value.LabelDescription;
                }
                if (value.Code == "lblJobResponsibilities" && value.FormID == "ProfessionalInfo") {

                    this.lblJobResponsibilities = value.LabelDescription;
                }
                if (value.Code == "LeavingReason" && value.FormID == "ProfessionalInfo") {

                    this.LeavingReason = value.LabelDescription;
                }
                if (value.Code == "CurrentLastSal" && value.FormID == "ProfessionalInfo") {

                    this.CurrentLastSal = value.LabelDescription;
                }
                if (value.Code == "Currency" && value.FormID == "ProfessionalInfo") {

                    this.Currency = value.LabelDescription;
                }
                if (value.Code == "RequiredRating" && value.FormID == "ProfessionalInfo") {

                    this.RequiredRating = value.LabelDescription;
                }
                if (value.Code == "Name" && value.FormID == "ProfessionalInfo") {

                    this.Name = value.LabelDescription;
                }
                if (value.Code == "ProfessionalRelationship" && value.FormID == "ProfessionalInfo") {

                    this.ProfessionalRelationship = value.LabelDescription;
                }
                if (value.Code == "lblCompany (Current)" && value.FormID == "ProfessionalInfo") {

                    this.lblCompanyCurrent = value.LabelDescription;
                }
                if (value.Code == "ReportingTo" && value.FormID == "ProfessionalInfo") {

                    this.ReportingTo = value.LabelDescription;
                }
                if (value.Code == "APEmail" && value.FormID == "ProfessionalInfo") {

                    this.APEmail = value.LabelDescription;
                }
                if (value.Code == "ContactNumber" && value.FormID == "ProfessionalInfo") {

                    this.ContactNumber = value.LabelDescription;
                }
                if (value.Code == "AddressType" && value.FormID == "ProfessionalInfo") {

                    this.AddressType = value.LabelDescription;
                }
                if (value.Code == "PostalAddress" && value.FormID == "ProfessionalInfo") {

                    this.PostalAddress = value.LabelDescription;
                }
                if (value.Code == "Add" && value.FormID == "ProfessionalInfo") {

                    this.Add = value.LabelDescription;
                }
                if (value.Code == "Save" && value.FormID == "ProfessionalInfo") {

                    this.Save = value.LabelDescription;
                }
                if (value.Code == "lblSettings" && value.FormID == "ProfessionalInfo") {

                    this.lblSettings = value.LabelDescription;
                }
                if (value.Code == "ProfessionalInformation" && value.FormID == "ProfessionalInfo") {

                    this.ProfessionalInformation = value.LabelDescription;
                }
                if (value.Code == "lblProfessionalInfo" && value.FormID == "ProfessionalInfo") {

                    this.lblProfessionalInfo = value.LabelDescription;
                }

                // Assessments //

                if (value.Code == "BehavioralAssessment" && value.FormID == "Assessment") {

                    this.BehavioralAssessment = value.LabelDescription;
                }
                if (value.Code == "CapabilityAssessment" && value.FormID == "Assessment") {

                    this.CapabilityAssessment = value.LabelDescription;
                }
                if (value.Code == "CapabilityAssessments" && value.FormID == "Assessment") {

                    this.CapabilityAssessments = value.LabelDescription;
                }
                if (value.Code == "EmotionalIntelligenceAssessments" && value.FormID == "Assessment") {

                    this.EmotionalIntelligenceAssessments = value.LabelDescription;
                }
                if (value.Code == "lblSubmitBetween" && value.FormID == "Assessment") {

                    this.lblSubmitBetween = value.LabelDescription;
                }
                if (value.Code == "AssessmentStatus" && value.FormID == "Assessment") {

                    this.AssessmentStatus = value.LabelDescription;
                }
                if (value.Code == "Questionnaire" && value.FormID == "Assessment") {

                    this.Questionnaire = value.LabelDescription;
                }
                if (value.Code == "Assessments" && value.FormID == "Assessment") {

                    this.Assessments = value.LabelDescription;
                }
                if (value.Code == "lblApplicantPicture" && value.FormID == "Assessment") {

                    this.lblApplicantPicture = value.LabelDescription;
                }
                if (value.Code == "Upload" && value.FormID == "Assessment") {

                    this.Upload = value.LabelDescription;
                }

                // Dashboard // lblPersonalInfo

                if (value.Code == "lblPersonalInfo" && value.FormID == "PersonalInfo") {

                    this.lblPersonalInfo = value.LabelDescription;
                } 
                if (value.Code == "lblMyJobs" && value.FormID == "MyJobs") {

                    this.lblMyJobs = value.LabelDescription;
                }

                // for Forgot Password //

                if (value.Code == "lblPleaseEnterYourEmailAddress" && value.FormID == "ForgotPassword") {

                    this.lblPleaseEnterYourEmailAddress = value.LabelDescription;
                }
                if (value.Code == "lblConfirm" && value.FormID == "ForgotPassword") {

                    this.lblConfirm = value.LabelDescription;
                }
                if (value.Code == "lblPinCode" && value.FormID == "ForgotPassword") {

                    this.lblPinCode = value.LabelDescription;
                }
                if (value.Code == "lblPinCodeHeading" && value.FormID == "ForgotPassword") {

                    this.lblPinCodeHeading = value.LabelDescription;
                }
                if (value.Code == "lblReset" && value.FormID == "ForgotPassword") {

                    this.lblReset = value.LabelDescription;
                }
                if (value.Code == "lblVerifyEmail" && value.FormID == "ForgotPassword") {

                    this.lblVerifyEmail = value.LabelDescription;
                }
                if (value.Code == "Cancel" && value.FormID == "ForgotPassword") {

                    this.Cancel = value.LabelDescription;
                }

                // For Acount activation //

                if (value.Code == "ThankYou" && value.FormID == "ActivateAccount") {

                    this.ThankYou = value.LabelDescription;
                }
                //General Lbls
                if (value.Code == "All") 
                    this.lblAll = value.LabelDescription;
                
                if (value.Code == "Location") 
                    this.lblLocation = value.LabelDescription;    

            }
        });
    }


} 
