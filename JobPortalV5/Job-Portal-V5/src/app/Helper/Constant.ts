
export class Constants {


    /// <summary>
    /// Use for validating the WebApi Headers
    /// </summary> 
    static readonly userId: string = "maazo";
    static readonly Password: string = "abc";

  //static readonly BaseURl: string = "https://jobportalapi.azurewebsites.net/";
    //  static readonly BaseURl: string = "http://10.20.2.252/API/";
   //   static readonly BaseURl: string = "http://10.20.0.6/JP-API/";
   //   static readonly BaseURl: string = "http://10.20.2.58/API/";
 // static readonly BaseURl: string = "http://10.20.2.252/API/";
 //static readonly BaseURl: string = "http://10.20.3.250/API/";
  //    static readonly BaseURl: string = "http://localhost:31697/"; 


    /// <summary>
    /// Method name for Welcome page
    /// </summary>
    static readonly GetOpenVacancies: string = "GetOpenVacancies";
    static readonly GetOpenVacanciesForCloud: string = "GetOpenVacanciesForCloud";
    static readonly GetMPRDetail: string = "GetMPRDetail";
    
    /// <summary>
    /// Method name for Login page
    /// </summary>
    static readonly SaveUser: string = "SaveUser";
    static readonly Login: string = "Login";
    static readonly LinkedInLogin: string = "LinkedInLogin";
    static readonly IsEmailExist: string = "IsEmailExist"
    /// <summary>
    /// Method name for ForgotPassword page
    /// </summary>
    static readonly ForgotPassword: string = "ForgotPassword";
    static readonly ForgotPassSubmitPin: string = "ForgotPassSubmitPin";
    static readonly ForgotPassChangePassword: string = "ForgotPassChangePassword";
    static readonly ForgotPasswordClickBtn: string = "ForgotPasswordClickBtn";

    /// <summary>
    /// Method name for change password
    /// </summary>
    static readonly ChangePasswordSave: string = "ChangePasswordSave";
    static readonly ChangeRegistrationEmail: string = "ChangeRegistrationEmail";


    // Method for activation account //

    static readonly ActivateAccount: string = "ActivateAccount";
    static readonly GenerateNewLink: string = "GenerateNewLink";
    static readonly ReGenerateEmailLink: string = "ReGenerateEmailLink";
    static readonly PersonalInfo: string = "PersonalInfo";

    // Method for Activation account Field Force

    static readonly ActivateAccount_FF: string = "ActivateAccount_FF";
    static readonly GenerateNewLinkFF: string = "GenerateNewLinkFF";
    //static readonly ReGenerateEmailLink: string = "ReGenerateEmailLink";
    static readonly PersonalInfo_FF: string = "PersonalInfo_FF";

    /// <summary>
    /// Method name for MyJobs page
    /// </summary>
    static readonly GetOfferLetter: string = "GetOfferLetter";
    static readonly SubmitOfferResponse: string = "SubmitOfferResponse";
    static readonly GetAppliedJobs: string = "GetAppliedJobs";
    static readonly GetDepartmentJobs: string = "GetDepartmentJobs";
    static readonly SaveOfferLetterStatus: string = "SaveOfferLetterStatus";
    static readonly ApplyForDepartmentJob: string = "ApplyForDepartmentJob";
    static readonly ApplyJob: string = "ApplyJob";

    /// <summary>
    /// Method name for personalInfo page
    /// </summary>

    /// Applicant
    static readonly GetApplicantData: string = "GetApplicantData";
    static readonly GetApplicantDataForApproval: string = "GetApplicantDataForApproval";

    static readonly UpdateApplicantData: string = "UpdateApplicantData";
    static readonly insertDataCFF: string = "insertDataCFF";
    static readonly GetApplicantImage: string = "GetApplicantImage";
    static readonly GetApplicantCV: string = "GetApplicantCV";    
    static readonly DeleteApplicantUploadedDoc: string = "DeleteApplicantUploadedDoc";
    static readonly GetRecBasicFieldsTrack: string = "GetRecBasicFieldsTrack";
    static readonly SaveAttachment: string = "SaveAttachment";
    static readonly GetApplicantDocuments: string = "GetApplicantDocuments";

    //Financial
    static readonly GetFinancialDetail: string = "GetFinancialDetail";
    static readonly SaveFinancialDetail: string = "SaveFinancialDetail";
    static readonly DeleteFinancialDetail: string = "DeleteFinancialDetail";


    //Educational 
   
    static readonly GetEducationalGrid: string = "GetEducationalGrid";
    static readonly SaveEducationalDetail: string = "SaveEducationalDetail";
    static readonly DeleteEducationalGrid: string = "DeleteEducationalGrid";

    static readonly ViewEducationalDoc: string = "ViewEducationalDoc";

    static readonly GetDocumentsCat_Type: string = "GetDocumentsCat_Type";

    static readonly GetDocumentsCat_TypeFF: string = "GetDocumentsCat_TypeFF";

    static readonly GetRecommendedEmpId: string = "GetRecommendedEmpId";



    //Other Documents

    static readonly GetOtherDocGrid: string = "GetOtherDocGrid";
    static readonly SaveOtherDocDetail: string = "SaveOtherDocDetail";
    static readonly DeleteOtherDocGrid: string = "DeleteOtherDocGrid";

    static readonly ViewOtherDoc: string = "ViewOtherDoc";


    //Next Of Kin Information
    static readonly GetNextofKinGrid: string = "GetNextofKinGrid";
    static readonly SaveNextofKinDetail: string = "SaveNextofKinDetail";
    static readonly DeleteNextofKinGrid: string = "DeleteNextofKinGrid";


    //Dependents Information

    static readonly GetDependentsGrid: string = "GetDependentsGrid";
    static readonly SaveDependentsDetail: string = "SaveDependentsDetail";
    static readonly DeleteDependentsGrid: string = "DeleteDependentsGrid";

    // Relative In Atco

    static readonly GetRelativeGrid: string = "GetRelativeGrid";
    static readonly SaveRelativeDetails: string = "SaveRelativeDetails";
    static readonly DeleteRelativeGrid: string = "DeleteRelativeGrid";


    // Quicksignup

    static readonly Registered_SendEmail_to_Applicant: string = "Registered_SendEmail_to_Applicant";

    static readonly SendEmailsTo_Applicant_Employee: string = "SendEmailsTo_Applicant_Employee";

    static readonly CheckValidation: string = "CheckValidation";

    static readonly GetchatMessages: string = "GetchatMessages";
    static readonly GetChatMessagesForCounter: string = "GetChatMessagesForCounter";



    //Insurance
    static readonly GetExistingInsuranceDetail: string = "GetExistingInsuranceDetail";
    static readonly SaveInsuranceDetail: string = "SaveInsuranceDetail";
    static readonly DeleteInsuranceDetail: string = "DeleteInsuranceDetail";

    //SocialMedia
    static readonly GetSocialMediaConnections: string = "GetSocialMediaConnections";
    static readonly SaveSocialMedia: string = "SaveSocialMedia";
    static readonly DeleteSocialMedia: string = "DeleteSocialMedia";

    //DocumentAttachment
    static readonly GetDocumentAttachments: string = "GetDocumentAttachments";
    static readonly SaveDocumentAttachment: string = "SaveDocumentAttachment";
    static readonly DeleteDocumentAttachment: string = "DeleteDocumentAttachment";
    static readonly DeleteApplicantUploadedDocumentAttachment: string = "DeleteApplicantUploadedDocumentAttachment";
    static readonly GetDocSize: string = "GetDocSize";

    //PersonalAttributes
    static readonly GetAllPersonalAttributes: string = "GetAllPersonalAttributes";
    static readonly SavePersonalAttributes: string = "SavePersonalAttributes";
    static readonly DeletePersonalAttributes: string = "DeletePersonalAttributes";

    //Grids Count
    static readonly GetPersonalInfoGridsCount: string = "GetPersonalInfoGridsCount";

    /// <summary>
    /// Method name for ProfessionalInfo page
    /// </summary>
    /// Applicant

    /// Qualification
    static readonly GetQualificationDetail: string = "GetQualificationDetail";
    static readonly SaveQualification: string = "SaveQualification";
    static readonly DeleteQualification: string = "DeleteQualification";

    //Certification
    static readonly GetCertificationDetail: string = "GetCertificationDetail";
    static readonly SaveCertification: string = "SaveCertification";
    static readonly DeleteCertification: string = "DeleteCertification";

    //Experience
    static readonly GetExperienceDetail: string = "GetExperienceDetail";
    static readonly SaveExperience: string = "SaveExperience";
    static readonly DeleteExperience: string = "DeleteExperience";

    //Professional References
    static readonly GetProfessRefDetail: string = "GetProfessRefDetail";
    static readonly SaveProfessionalReferences: string = "SaveProfessionalReferences";
    static readonly DeleteProfReference: string = "DeleteProfReference";

    //Training
    static readonly GetTrainingDetail: string = "GetTrainingDetail";
    static readonly SaveTraining: string = "SaveTraining";
    static readonly DeleteTraining: string = "DeleteTraining";

    //Competencies/Skills
    static readonly GetCompetencySkillsDetail: string = "GetCompetencySkillsDetail";
    static readonly SaveCompetencieSkills: string = "SaveCompetencieSkills";
    static readonly DeleteCompetencies: string = "DeleteCompetencies";

    //Grids Count
    static readonly GetProfessionalInfoGridsCount: "GetProfessionalInfoGridsCount";


    /// <summary>
    ///  Method name for Dropdowns
    /// </summary>
    static readonly GetAssociatedCompanies: string = "GetAssociatedCompanies";
    static readonly GetCountries: string = "GetCountries";
    static readonly GetCities: string = "GetCities";
    static readonly GetCitiesByCountryId: string = "GetCitiesByCountryId";
    static readonly GetMaritalStatus: string = "GetMaritalStatus";
    static readonly GetGender: string = "GetGender";

    // new dropdown add for bank informatin
    static readonly GetBankDropdown: string = "GetBankDropdown";
    static readonly GetRelationshipDropdown: string = "GetRelationshipDropdown";
    static readonly GetBloodGroup: string = "GetBloodGroup";


    
    static readonly GetNationality: string = "GetNationality";
    static readonly GetReligion: string = "GetReligion";
    static readonly GetNativeLanguage: string = "GetNativeLanguage";
    static readonly GetTitle: string = "GetTitle";
    static readonly GetCurrency: string = "GetCurrency?Culture=en-GB";
    static readonly GetInstitute: string = "GetInstitute?Culture=en-GB";
    static readonly GetDegree: string = "GetDegree?Culture=en-GB";
    static readonly GetIqamaProfession: string = "GetIqamaProfession";
    static readonly GetSponsorShipType: string = "GetSponsorShipType";
    static readonly GetSponsorShipCategory: string = "GetSponsorShipCategory";
    static readonly GetInsuranceType: string = "GetInsuranceType";
    static readonly GetInsuranceCompany: string = "GetInsuranceCompany";
    static readonly GetSocialMediaPlatform: string = "GetSocialMediaPlatform";
    static readonly GetCertifications: string = "GetCertifications";
    static readonly GetDocumentCategory: string = "GetDocumentCategory";
    static readonly GetPersonalAttributes: string = "GetPersonalAttributes";
    static readonly GetTrainingCategory: string = "GetTrainingCategory";
    static readonly GetTrainingSubject: string = "GetTrainingSubject";
    static readonly GetRating: string = "GetRating";
    static readonly GetCompetencyLevel3: string = "GetCompetencyLevel3";
    static readonly GetWhenCanYouJoin: string = "GetWhenCanYouJoin";
    static readonly GetYears: string = "GetYears";
    //Assessments
    static readonly Assessments_Behavioral: string = "GetPersonalityAssessments";
    static readonly Assessments_Intelligence: string = "GetIntelligenceAssessments";
    static readonly Assessments_Emotional: string = "GetEmotionalAssessments";


    //Intelligence
    static readonly fixPracticeQuestionsList: string = "fixPracticeQuestionsList";
    static readonly GetIntelligenceQuestionBULK: string = "GetIntelligenceQuestionBULK";
    static readonly GetPracticeQuestionsListIntelligence: string = "GetPracticeQuestionsListIntelligence";


    // For Last updated Profile //
    static readonly GetLastProfileUpdateValue: string = "GetLastProfileUpdateValue"


    // For multiple languages // 
    //static readonly CompanyGroupID: string = "1007"
    static readonly Culture: string = "en-GB"
    static readonly LinkExpiryTime: string = "4"
    static readonly Multilingual: string = "N"
    static readonly IsInternationalDeployment: string = "N"
    static readonly IsApplicationDown: string = "N" 
    static readonly FromEmail: string = "support@people.partners"


    // Terminal //
    static readonly GetTerminal: string = "GetTerminal"
    static TerminalIP: string = "";
    static TerminalName: string = "";

    // for Counter // 
    
    static readonly GetMyJobsGridsCount: string = "GetMyJobsGridsCount"

    // For Company Parameters //
    static readonly GetCompanyParameter: string = "GetCompanyParameter";
    static CompanyId: number;
    static CompanyName: string = "";
    static RedirectPath: string = "";
    static CompanyLogoBase64: string = "";


    // for Get JobPortal Configuration //

    static readonly GetJobPortalConfiguration: string = "GetJobPortalConfiguration";

    // for Get JobPortal Configuration Field Force //

    static readonly GetJobPortalConfiguration_FF: string = "GetJobPortalConfiguration_FF";


    // for GetWebConfiguration //

    static readonly GetWebConfiguration: string = "GetWebConfiguration";

    // For Upload Image //

    static readonly UploadImage: string = "UploadImage";
    //static readonly GetApplicantImage: string = "GetApplicantImage";
    static readonly ReadFromBlob: string = "ReadFromBlob";
    static readonly DeleteFromBlob: string = "DeleteFromBlob";
    static readonly GetLabels: string = "GetLabels";
    static readonly ReadDocumentFromBlob: string = "ReadDocumentFromBlob";

    // Theme background-Color // 

 // static readonly Color: string = "007FFF";         //LightBlue
    // static readonly Color: string = "4059A9";          //DarkBlue 
    //  static readonly Color: string = "79C942";           //Green 
 //   static readonly Color: string = "999999";             //Grey 
    //  static readonly Color: string = "F47117";           //Orange 
    // static readonly Color: string = "E000B6";              //Pink 
    // static readonly Color: string = "982BBC";            //Purple 
//  static readonly Color: string = "B30111";             //Red 
    //   static readonly Color: string = "EFC203";          //Yellow     

    static readonly default: string = "007FFF";





}



