"use strict";
var Constants = (function () {
    function Constants() {
    }
    return Constants;
}());
/// <summary>
/// Use for validating the WebApi Headers
/// </summary>
Constants.userId = "maazo";
Constants.Password = "abc";
// static readonly BaseURl: string = "https://jobportalapi.azurewebsites.net/";
//  static readonly BaseURl: string = "http://10.20.2.252/API/";
//   static readonly BaseURl: string = "http://10.20.0.6/JP-API/";
//    static readonly BaseURl: string = "http://10.20.2.58/API/";
Constants.BaseURl = "http://10.20.2.252/API/";
//      static readonly BaseURl: string = "http://localhost:31697/";
/// <summary>
/// Method name for Welcome page
/// </summary>
Constants.GetOpenVacancies = "GetOpenVacancies";
Constants.GetOpenVacanciesForCloud = "GetOpenVacanciesForCloud";
Constants.GetMPRDetail = "GetMPRDetail";
/// <summary>
/// Method name for Login page
/// </summary>
Constants.SaveUser = "SaveUser";
Constants.Login = "Login";
/// <summary>
/// Method name for ForgotPassword page
/// </summary>
Constants.ForgotPassword = "ForgotPassword";
Constants.ForgotPassSubmitPin = "ForgotPassSubmitPin";
Constants.ForgotPassChangePassword = "ForgotPassChangePassword";
Constants.ForgotPasswordClickBtn = "ForgotPasswordClickBtn";
/// <summary>
/// Method name for change password
/// </summary>
Constants.ChangePasswordSave = "ChangePasswordSave";
Constants.ChangeRegistrationEmail = "ChangeRegistrationEmail";
// Method for activation account //
Constants.ActivateAccount = "ActivateAccount";
Constants.GenerateNewLink = "GenerateNewLink";
Constants.PersonalInfo = "PersonalInfo";
/// <summary>
/// Method name for MyJobs page
/// </summary>
Constants.GetAppliedJobs = "GetAppliedJobs";
Constants.GetDepartmentJobs = "GetDepartmentJobs";
Constants.SaveOfferLetterStatus = "SaveOfferLetterStatus";
Constants.ApplyForDepartmentJob = "ApplyForDepartmentJob";
Constants.ApplyJob = "ApplyJob";
/// <summary>
/// Method name for personalInfo page
/// </summary>
/// Applicant
Constants.GetApplicantData = "GetApplicantData";
Constants.UpdateApplicantData = "UpdateApplicantData";
Constants.GetApplicantImage = "GetApplicantImage";
Constants.DeleteApplicantUploadedDoc = "DeleteApplicantUploadedDoc";
Constants.GetRecBasicFieldsTrack = "GetRecBasicFieldsTrack";
//Financial
Constants.GetFinancialDetail = "GetFinancialDetail";
Constants.SaveFinancialDetail = "SaveFinancialDetail";
Constants.DeleteFinancialDetail = "DeleteFinancialDetail";
//Insurance
Constants.GetExistingInsuranceDetail = "GetExistingInsuranceDetail";
Constants.SaveInsuranceDetail = "SaveInsuranceDetail";
Constants.DeleteInsuranceDetail = "DeleteInsuranceDetail";
//SocialMedia
Constants.GetSocialMediaConnections = "GetSocialMediaConnections";
Constants.SaveSocialMedia = "SaveSocialMedia";
Constants.DeleteSocialMedia = "DeleteSocialMedia";
//DocumentAttachment
Constants.GetDocumentAttachments = "GetDocumentAttachments";
Constants.SaveDocumentAttachment = "SaveDocumentAttachment";
Constants.DeleteDocumentAttachment = "DeleteDocumentAttachment";
Constants.DeleteApplicantUploadedDocumentAttachment = "DeleteApplicantUploadedDocumentAttachment";
//PersonalAttributes
Constants.GetAllPersonalAttributes = "GetAllPersonalAttributes";
Constants.SavePersonalAttributes = "SavePersonalAttributes";
Constants.DeletePersonalAttributes = "DeletePersonalAttributes";
//Grids Count
Constants.GetPersonalInfoGridsCount = "GetPersonalInfoGridsCount";
/// <summary>
/// Method name for ProfessionalInfo page
/// </summary>
/// Applicant
/// Qualification
Constants.GetQualificationDetail = "GetQualificationDetail";
Constants.SaveQualification = "SaveQualification";
Constants.DeleteQualification = "DeleteQualification";
//Certification
Constants.GetCertificationDetail = "GetCertificationDetail";
Constants.SaveCertification = "SaveCertification";
Constants.DeleteCertification = "DeleteCertification";
//Experience
Constants.GetExperienceDetail = "GetExperienceDetail";
Constants.SaveExperience = "SaveExperience";
Constants.DeleteExperience = "DeleteExperience";
//Professional References
Constants.GetProfessRefDetail = "GetProfessRefDetail";
Constants.SaveProfessionalReferences = "SaveProfessionalReferences";
Constants.DeleteProfReference = "DeleteProfReference";
//Training
Constants.GetTrainingDetail = "GetTrainingDetail";
Constants.SaveTraining = "SaveTraining";
Constants.DeleteTraining = "DeleteTraining";
//Competencies/Skills
Constants.GetCompetencySkillsDetail = "GetCompetencySkillsDetail";
Constants.SaveCompetencieSkills = "SaveCompetencieSkills";
Constants.DeleteCompetencies = "DeleteCompetencies";
/// <summary>
///  Method name for Dropdowns
/// </summary>
Constants.GetAssociatedCompanies = "GetAssociatedCompanies";
Constants.GetCountries = "GetCountries";
Constants.GetCities = "GetCities";
Constants.GetCitiesByCountryId = "GetCitiesByCountryId";
Constants.GetMaritalStatus = "GetMaritalStatus";
Constants.GetGender = "GetGender";
Constants.GetNationality = "GetNationality";
Constants.GetReligion = "GetReligion";
Constants.GetNativeLanguage = "GetNativeLanguage";
Constants.GetTitle = "GetTitle";
Constants.GetCurrency = "GetCurrency?Culture=en-GB";
Constants.GetInstitute = "GetInstitute?Culture=en-GB";
Constants.GetDegree = "GetDegree?Culture=en-GB";
Constants.GetIqamaProfession = "GetIqamaProfession";
Constants.GetSponsorShipType = "GetSponsorShipType";
Constants.GetSponsorShipCategory = "GetSponsorShipCategory";
Constants.GetInsuranceType = "GetInsuranceType";
Constants.GetInsuranceCompany = "GetInsuranceCompany";
Constants.GetSocialMediaPlatform = "GetSocialMediaPlatform";
Constants.GetCertifications = "GetCertifications";
Constants.GetDocumentCategory = "GetDocumentCategory";
Constants.GetPersonalAttributes = "GetPersonalAttributes";
Constants.GetTrainingCategory = "GetTrainingCategory";
Constants.GetTrainingSubject = "GetTrainingSubject";
Constants.GetRating = "GetRating";
Constants.GetCompetencyLevel3 = "GetCompetencyLevel3";
Constants.GetWhenCanYouJoin = "GetWhenCanYouJoin";
Constants.GetYears = "GetYears";
//Assessments
Constants.Assessments_Behavioral = "GetPersonalityAssessments";
Constants.Assessments_Intelligence = "GetIntelligenceAssessments";
Constants.Assessments_Emotional = "GetEmotionalAssessments";
//Intelligence
Constants.fixPracticeQuestionsList = "fixPracticeQuestionsList";
Constants.GetIntelligenceQuestionBULK = "GetIntelligenceQuestionBULK";
Constants.GetPracticeQuestionsListIntelligence = "GetPracticeQuestionsListIntelligence";
// For Last updated Profile //
Constants.GetLastProfileUpdateValue = "GetLastProfileUpdateValue";
// For multiple languages //
Constants.CompanyGroupID = "1007";
Constants.Culture = "en-GB";
Constants.LinkExpiryTime = "4";
Constants.Multilingual = "Y";
Constants.IsInternationalDeployment = "Y";
Constants.IsApplicationDown = "N";
Constants.FromEmail = "support@people.partners";
// Terminal //
Constants.GetTerminal = "GetTerminal";
Constants.TerminalIP = "";
Constants.TerminalName = "";
// for Counter // 
Constants.GetMyJobsGridsCount = "GetMyJobsGridsCount";
// For Company Parameters //
Constants.GetCompanyParameter = "GetCompanyParameter";
Constants.CompanyName = "";
Constants.RedirectPath = "";
Constants.CompanyLogoBase64 = "";
// for Get JobPortal Configuration //
Constants.GetJobPortalConfiguration = "GetJobPortalConfiguration";
// for GetWebConfiguration //
Constants.GetWebConfiguration = "GetWebConfiguration";
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
Constants.default = "007FFF";
exports.Constants = Constants;
//# sourceMappingURL=Constant.js.map