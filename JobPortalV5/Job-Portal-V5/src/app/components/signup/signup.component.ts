import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot } from '@angular/router';
import { Constants } from '../../Helper/Constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GetCompanyParameter } from '../../Service/CompanyParameter.service';
import { ThemeColorService } from '../../Service/ThemeColor.service'; 
declare var $: any;
import { AppConfigService } from '@app/Service/app-config.service';
import { Labels } from '@app/Service/DatabaseLbl.service';
import { DataService } from '@app/Shared/Services/data.services';


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  RegType: string = "1";
  JobCode: string = "1";
    Email: string = "";
    Password: string = "";
    ConfirmPassword: string = "";
    FirstName: string = "";
    MiddleName: string = "";
    LastName: string = "";
    PassportNumber: string = "";
    IdCardNumber: string = "";


    isMandatoryfields: boolean = false;
    isMandatoryfields1: boolean = false;
    generateLink: boolean = false;

    WrongUrl: boolean = true;


    public responseData;



    // for backgrouud color // 

    BackgroundImage: string = "";
    ThemeFontColor: string = "";
    DefaultFontColor: string = "";



    // Years dropdowns //

    YearsDropdown: any;
    Years: string = '0';
    ddlGenders: string = "";
    res: any;
    check: string = "False"

    constructor(private activatedRoute: ActivatedRoute, private Labels: Labels, private _config: AppConfigService, private http: HttpClient, private objRouter: Router, private spinner: NgxSpinnerService,
      private toastr: ToastrService, public CompanyIdService: GetCompanyParameter, public ClrThemeChng: ThemeColorService, private dataService: DataService, ) {


      //if (localStorage.length > 0) {
      //  let groupid = localStorage.getItem("LastLoginId").split(",")[1];
      //  var ArrayLoginId = localStorage.getItem(groupid).split(',')[1];
      //  var LastLoginId = localStorage.getItem("LastLoginId").split(",")[0];
      //  var lenghtOfCheck = localStorage.getItem(groupid).split(',')[2].length;


      //  if (LastLoginId == ArrayLoginId) {
      //    var lenghtOfGroupId = localStorage.getItem(groupid).split(',')[0].length;
      //    this.check = localStorage.getItem(groupid).split(',')[2].slice(0, lenghtOfCheck);
      //    this._config.environment.CompanyGroupID = localStorage.getItem(groupid).split(',')[0].slice(1, lenghtOfGroupId);
      //    if (this.check == "true") {
      //      this.WrongUrl = false;
      //    }
      //    return;
      //  }
      //}
       
      //if (localStorage.length < 0) {
      //  $("#myModalWrongURL").modal("toggle");
      //  this.WrongUrl = false;
      //}
        

    }


    ShowIdValidation0: boolean = false;

    validateIDCard(cnic: string): boolean {
      const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
      return cnicPattern.test(cnic);
    }

    onInput(event: any): void {
      let value = event.target.value;

      // Remove non-numeric characters first
      value = value.replace(/\D/g, '');

      // Format the CNIC as ###-#######-#
      if (value.length <= 5) {
        this.IdCardNumber = value;
      } else if (value.length <= 12) {
        this.IdCardNumber = `${value.slice(0, 5)}-${value.slice(5)}`;
      } else {
        this.IdCardNumber = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12, 13)}`;
      }
    }

    getYears() {
        debugger;
        let RequestObject = {

            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId,

        }

        let getYears = this._config.environment.baseUrl + Constants.GetYears;
        this.http.post(getYears, RequestObject, { headers: this.dataService.headers })
            //  this.http.get("https://jobportalapi.azurewebsites.net/GetYears")
            .subscribe((response: any) => {
                this.YearsDropdown = response;
                debugger;

            }, (error: any) => {
                console.log(error);
            });

    }


    openSpinner() {
        debugger;

        /** spinner starts on init */
        this.spinner.show();
    }


    HideSpinner() {
        debugger;

        /** spinner starts on init */
        this.spinner.hide();
    }


    // get Labels //

    lblFirstName: string = "First Name";
    lblMiddleName: string = "Middle Name";
    lblLastName: string = "Last Name";
    DateofBirth: string = "Date of Birth";
    Gender: string = "Gender";
    IDCardNo: string = "ID Card No.";
    PassportNo: string = "Passport No.";
    lblAccountId: string = "Account ID (Email Address)";
    lblConfirmPassword: string = "Confirm Password";
    lblTellUsAboutYourSelf: string = "Tell us about yourself!";
    btnSignUp: string = "SIGN UP";
    LblPassword: string = "Password";
    isShow: boolean = false;



    getHomeLabels() {
        debugger;
        this.isShow = true;
        if (this.Labels.dashLabels == true) {
          if (this.Labels.FirstName != "" && !isNullOrUndefined(this.Labels.FirstName))
            this.lblFirstName = this.Labels.FirstName;

          if (this.Labels.MiddleName != "" && !isNullOrUndefined(this.Labels.MiddleName))
            this.lblMiddleName = this.Labels.MiddleName;

          if (this.Labels.LastName != "" && !isNullOrUndefined(this.Labels.LastName))
            this.lblLastName = this.Labels.LastName;

          if (this.Labels.DateofBirth != "" && !isNullOrUndefined(this.Labels.DateofBirth))
            this.DateofBirth = this.Labels.DateofBirth;

          if (this.Labels.Gender != "" && !isNullOrUndefined(this.Labels.Gender))
            this.Gender = this.Labels.Gender;

          if (this.Labels.IDCardNo != "" && !isNullOrUndefined(this.Labels.IDCardNo))
            this.IDCardNo = this.Labels.IDCardNo;

          if (this.Labels.PassportNo != "" && !isNullOrUndefined(this.Labels.PassportNo))
            this.PassportNo = this.Labels.PassportNo;

          if (this.Labels.lblAccountId != "" && !isNullOrUndefined(this.Labels.lblAccountId))
            this.lblAccountId = this.Labels.lblAccountId;

          if (this.Labels.lblConfirmPassword != "" && !isNullOrUndefined(this.Labels.lblConfirmPassword))
            this.lblConfirmPassword = this.Labels.lblConfirmPassword;

          if (this.Labels.lblTellUsAboutYourSelf != "" && !isNullOrUndefined(this.Labels.lblTellUsAboutYourSelf))
            this.lblTellUsAboutYourSelf = this.Labels.lblTellUsAboutYourSelf;

          if (this.Labels.btnSignUp != "" && !isNullOrUndefined(this.Labels.btnSignUp))
            this.btnSignUp = this.Labels.btnSignUp;

          if (this.Labels.LblPassword != "" && !isNullOrUndefined(this.Labels.LblPassword))
            this.LblPassword = this.Labels.LblPassword;

        }
    }


    // for backgroung Image //

    forChanges: any;
    breakcode: any;
    code: any;
    BorderColor: string = "";
    DefaultBorderColor: string = "";
    // this.BackgroundImage = "../../../assets/images/" + this.code + "/general.PNG";

    Color() {
      //console.log("test" + this.ClrThemeChng.ChangeTheme)
        debugger;
        this.openSpinner();
        this.forChanges = this.ClrThemeChng.ChangeTheme;
       

        if (isNullOrUndefined(this.forChanges)) {
            this.DefaultFontColor = "#" + Constants.default;
            this.BackgroundImage = "assets/images/" + Constants.default + "/general.png";
            this.DefaultBorderColor = "1px solid #" + Constants.default;
        }
        else if (!isNullOrUndefined(this.forChanges)) {

          this.breakcode = this.forChanges.split('#');
          this.code = this.breakcode[1];

            this.ThemeFontColor = this.forChanges;
            this.BackgroundImage = "assets/images/" + this.code + "/general.png";
            this.BorderColor = "1px solid" + this.forChanges;
        }

    }

    //GenerateNewLink(Gid,CompId) {
   
    //  let RequestObject = {
    //    Guid: Gid,
    //    CompanyId: CompId,
    //  };
    //  let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GenerateNewLink;
    //  this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers }) 
    //    .subscribe((response: any) => {

    //      this.ClrThemeChng.ChangeTheme = response.ThemeColor;
    //      this.Color();
    //      this.HideSpinner();

    //    })
    //}

    ChangeTheme: any;

    getJobPortalConfiguration() {

        debugger;
        let RequestObject = {

            CompanyId: this.CompanyIdService.CompanyId,
        };
        let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
        this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
            // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
            .subscribe((response: any) => {
              if (response.ThemeColor != null || !isNullOrUndefined(response.ThemeColor)) {
                this.ClrThemeChng.ChangeTheme = response.ThemeColor;
              } 
                this.Color();
                this.HideSpinner();

            })
    }


    getCompanyParameter() {
        this.openSpinner();
        let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;
        this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {

            if (response.CompanyId == 0) {
                $("#myModalWrongURL").modal("toggle");
                this.WrongUrl = false;
                localStorage.removeItem(this._config.environment.CompanyGroupID);
                return;
            }
            this.CompanyIdService.CompanyId = response.CompanyId;
            if (response.CompanyId != 0) {
                var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + this.check + ",,,,";
                localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
                localStorage.setItem("LastLoginId", response.CompanyId + "," + this._config.environment.CompanyGroupID)
            }

            this.CompanyIdService.CompanyName = response.CompanyName;
            this.CompanyIdService.RedirectPath = response.RedirectPath;
            this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
            this.getHomeLabels();
            this.getJobPortalConfiguration();
            this.getYears();
            this.getGenderDropdown();
            this.Color();

        });


    }


    // Gender Dropdown //
    GenderDropdown: any;
    Genders: string = "";

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
                debugger;
                if (!isNullOrUndefined(this.GenderDropdown) && this.GenderDropdown.length > 0)
                    this.ddlGenders = this.GenderDropdown[0].Id;
            }, (error: any) => {
                console.log(error);
            });
    }


    link: any;
    PopupMsg: string = "";
    ShowPopup: boolean = true;
    Linkbutton: boolean = true;
    linkProcessValid: boolean = false;
    LinkMsgGenerate: string = "";
    LinkMsgGenerate1: string = "";
    MsgValidate: string = "";

    GenerateLink() {
        debugger;
        this.LinkMsgGenerate = "";
        this.LinkMsgGenerate1 = "";

        //$("#myModalSingupErr").modal("hide");
        let RequestObject = {

            Guid: localStorage.getItem('GuidID'),
            CompanyId: this.CompanyIdService.CompanyId,
            FromEmail: Constants.FromEmail,
        }

        this.openSpinner();
        let generateNewLink = this._config.environment.baseUrl + Constants.GenerateNewLink;
        this.http.post(generateNewLink, RequestObject, { headers: this.dataService.headers })
            //  this.http.post("https://jobportalapi.azurewebsites.net/GenerateNewLink", RequestObject)
            .subscribe((response: any) => {
                console.log('response : ', response);
                this.link = response;
                this.HideSpinner();
                debugger;
                if (!isNullOrUndefined(response) && response.Valid == true) {
                  $("#myModalSingupErr").modal("hide");
                    let msgs = response.Message.split('<br/>');
                    let successMsg = msgs[0];
                    let msg1 = msgs[1].split('.');
                    let msg2 = msg1[0];
                    let msg3 = msg1[1];
                    console.log('Msg : ', msgs);
                    console.log('Success : ', successMsg);
                    console.log('Msg1 : ', msg1);

                    localStorage.setItem('msg', successMsg);
                    localStorage.setItem('msg1', msg2);
                    localStorage.setItem('msg2', msg3);
                    
                    this.objRouter.navigate(['/account-success']);
                    this.openSpinner();
                    localStorage.setItem('ForShowAccountSuccess', "For Show Account-Success");

                    localStorage.removeItem("bankName");
                    localStorage.removeItem("CheckForAllBtn"); 

                }

                if (!isNullOrUndefined(response) && response.Valid == false) {
                  this.MsgValidate = response.Message;
                  this.generateLink = false;
                }

            }, (error: any) => {
                console.log(error);
            });
    }



    DOB: string = "";
    RestrictMsg: string = "";
    ErrMsg: boolean = false;
    RestrictMsg1: any;
    genLink1: any;
    genLink12: any ;
    genLink13: any;
    genLink14: any;
    genLink15: any;
    txtMonth: string = '00';
    txtDay: string = '00';
    RestrictMsg2: string = "";
    genderval;


    private safeTrim(value: string | null | undefined): string {
      return (value || "").trim();
    }

    btnPost1_Click() {
        debugger;
        if (this.isImageView == false) {

            this.isMandatoryfields = false;
            this.isMandatoryfields1 = false;


            if (
              this.safeTrim(this.IdCardNumber) !== "" &&
              !this.validateIDCard(this.safeTrim(this.IdCardNumber))
            ) {
              this.ShowIdValidation0 = true;
              return;
            }

            let DOB = this.txtDay.toString() + "-" + this.txtMonth.toString() + "-" + this.Years.toString();
            //let genderforValidation = this.GenderDropdown.find(x => x.Id == this.ddlGenders);
            //this.genderval = genderforValidation.Name;
            //  || genderforValidation.Name == 'N/A'

            if (this.Email == "" || DOB == "" || this.Password == "" || this.ConfirmPassword == "" || this.LastName == "" || this.FirstName == "" || this.txtDay == '00' || this.Years == '0' || this.txtMonth == '00') {
                this.isMandatoryfields = true;
                this.isMandatoryfields1 = false;

                $('html, body').animate({
                    scrollTop: $("#elementID").offset().top
                }, 500);

                return;
            }
            if (this.PassportNumber == "" && this.IdCardNumber == "") {
                this.isMandatoryfields1 = true;
                this.isMandatoryfields = false;

                $('html, body').animate({
                    scrollTop: $("#elementID").offset().top
                }, 500);

                return;
            }

            let RequestObject = {
              Email: this.dataService.ReplaceApostropheWthTelda(this.Email),
                Password: this.Password,
                ConfirmPassword: this.ConfirmPassword,
                FirstName: this.dataService.ReplaceApostropheWthTelda(this.FirstName),
                MiddleName: this.dataService.ReplaceApostropheWthTelda(this.MiddleName),
                LastName: this.dataService.ReplaceApostropheWthTelda(this.LastName),
                DOB: DOB,
                GenderId: this.ddlGenders,
                PassportNumber: this.dataService.ReplaceApostropheWthTelda(this.PassportNumber),
                IdCardNumber: this.dataService.ReplaceApostropheWthTelda(this.IdCardNumber),
                Culture: Constants.Culture,
                CompanyId: this.CompanyIdService.CompanyId,
                GroupCompanyId: this._config.environment.CompanyGroupID,
                CompanyName: this.CompanyIdService.CompanyName,
                //RedirectURL: this.CompanyIdService.RedirectPath,
                //FromEmail: Constants.FromEmail,
                RegType: this.RegType,
                JobCode: this.JobCode
            }
            debugger;

            this.openSpinner();
            let saveUser = this._config.environment.baseUrl + Constants.SaveUser;
            this.PostData(RequestObject, saveUser, { headers: this.dataService.headers });
        }
        else {

            this.isMandatoryfields = false;
            this.isMandatoryfields1 = false;

            let DOB = this.txtDay.toString() + "-" + this.txtMonth.toString() + "-" + this.Years.toString();
            //let genderforValidation = this.GenderDropdown.find(x => x.Id == this.ddlGenders);
            //this.genderval = genderforValidation.Name;
            //  || genderforValidation.Name == 'N/A'

            if (this.Email == "" || DOB == "" || this.Password == "" || this.ConfirmPassword == "" || this.LastName == "" || this.FirstName == "" || this.txtDay == '00' || this.Years == '0' || this.txtMonth == '00') {
                this.isMandatoryfields = true;
                this.isMandatoryfields1 = false;

                $('html, body').animate({
                    scrollTop: $("#elementID").offset().top
                }, 500);

                return;
            }
            if (this.PassportNumber == "" && this.IdCardNumber == "") {
                this.isMandatoryfields1 = true;
                this.isMandatoryfields = false;

                $('html, body').animate({
                    scrollTop: $("#elementID").offset().top
                }, 500);

                return;
            }

            let RequestObject = {
              Email: this.dataService.ReplaceApostropheWthTelda(this.Email),
                Password: this.Password,
                ConfirmPassword: this.ConfirmPassword,
                FirstName: this.dataService.ReplaceApostropheWthTelda(this.FirstName),
                MiddleName: this.dataService.ReplaceApostropheWthTelda(this.MiddleName),
                LastName: this.dataService.ReplaceApostropheWthTelda(this.LastName),
                DOB: DOB,
                GenderId: this.ddlGenders,
                PassportNumber: this.dataService.ReplaceApostropheWthTelda(this.PassportNumber),
                IdCardNumber: this.dataService.ReplaceApostropheWthTelda(this.IdCardNumber),
                Culture: Constants.Culture,
                CompanyId: this.CompanyIdService.CompanyId,
                GroupCompanyId: this._config.environment.CompanyGroupID,
                CompanyName: this.CompanyIdService.CompanyName,
                IsImageFromLinkedin: true,
                LinkedInImagePath: this.ImageLinkedIn

            }
            debugger;

            this.openSpinner();
            let saveUser = this._config.environment.baseUrl + Constants.LinkedInLogin;
            this.PostData(RequestObject, saveUser, { headers: this.dataService.headers });

        }
    }


    passwordError: string = "";
    EmailError: string = "";
    DOBError: string = "";



    public PostData(model, url: string,headers:any) {
        const retVal = this.http.post(url, model,headers)
            .subscribe((response: any) => {
                debugger;
                this.LinkMsgGenerate = "";
                this.LinkMsgGenerate1 = "";
                console.log(response);

 
                if (response.Valid == false || response.isValid == false) {
                  debugger;
                    if (!isNullOrUndefined(response) && response.isValidationForGenerateLink == false) {
                        this.RestrictMsg = response.Message;

                        if (
                          response.Message === "Password and confirm password does not match." ||
                          response.Message === "Invalid Password! Please enter at least 6 characters long password." ||
                          response.Message === "Invalid Email Address!" ||
                          response.Message === "Email address already in use by another applicant." ||
                          response.Message === "Email address is already registered." ||
                          response.Message === "The selected date is not valid." ||
                          response.Message === "It looks like you've entered the wrong info. Please make sure that you use your real date of birth."
                        ) {
                        if (response.Message === "Password and confirm password does not match.") {
                          this.passwordError = response.Message; 
                        }
                        else if (response.Message === "Invalid Password! Please enter at least 6 characters long password.") {
                          this.passwordError = response.Message; 
                        }

                        if (response.Message === "Invalid Email Address!") {
                          this.EmailError = response.Message;
                        }
                        else if (response.Message === "Email address already in use by another applicant.") {
                          this.EmailError = response.Message;
                        }
                        else if (response.Message === "Email address is already registered.") {
                          this.EmailError = response.Message;
                        }
                        if (response.Message === "The selected date is not valid.") {
                          this.DOBError = response.Message;
                        }
                        else if (response.Message === "It looks like you've entered the wrong info.Please make sure that you use your real date of birth.") {
                          this.DOBError = response.Message;
                        }
                      
                    } else {
                      // If none of the above conditions are met, show the message in the modal
                      this.RestrictMsg = response.Message;
                      this.passwordError = "";
                      this.EmailError = "";
                      this.DOBError = "";
                      $("#myModalSingupErr").modal("show");
                    }
                    }
                }
                if (response.Valid == false || response.isValid == false) {
                    if (!isNullOrUndefined(response) && response.isValidationForGenerateLink == true) {
                        this.generateLink = true;
                        this.RestrictMsg1 = response.Message;
                        //  console.log("RestrictMsg111", this.RestrictMsg1);
                        debugger;
                        this.genLink1 = this.RestrictMsg1.split('.');
                        this.genLink12 = this.genLink1[0];
                        this.genLink13 = this.genLink1[1].split('to');
                        this.genLink14 = this.genLink13[0];
                        this.genLink15 = " to "+this.genLink13[1];


                        //this.RestrictMsg2 = this.RestrictMsg1.replace("href=""#"","");
                        //let generateLinkMsg = response.Message.split('.');
                        //let generateLinkMsg1 = generateLinkMsg[0];
                        //let generateLinkMsg2 = generateLinkMsg[1];
                        let GuidID = response.GuidID;
                        localStorage.setItem('GuidID', GuidID);
                        $("#myModalSingupErr").modal("show");

                    }
                }

                this.HideSpinner();
                if (response.Valid == true || response.isValid == true)
                {
                  if (!response.ActiveWithoutEmail)
                  {
                    let msgs = response.Message.split('<br/>');
                    let successMsg = msgs[0];
                    let msg1 = msgs[1].split('.');
                    let msg2 = msg1[0];
                    let msg3 = msg1[1];
                    console.log('Msg : ', msgs);
                    console.log('Success : ', successMsg);
                    console.log('Msg1 : ', msg1);

                    localStorage.setItem('msg', successMsg);
                    localStorage.setItem('msg1', msg2);
                    localStorage.setItem('msg2', msg3);

                    localStorage.setItem('emailForRegLink', model.Email);
                    localStorage.setItem('compIDForRegLink', model.CompanyId);

                    this.objRouter.navigate(['/account-success', { RegType: this.RegType, JobCode: this.JobCode }]);

                    this.openSpinner();
                    localStorage.setItem('ForShowAccountSuccess', "For Show Account-Success");
                    localStorage.removeItem("bankName");
                    localStorage.removeItem("CheckForAllBtn");
                  }
                  else
                  {
                    const queryParams = { g: response.GuidID, id: this._config.environment.CompanyGroupID };
                    this.objRouter.navigate(['/AccountActivation'], { queryParams });
                  }
                  
                }
                 
            }, (error: any) => {
                alert(error.error.Message);
            });
    }

    emptyPopup() {
        this.RestrictMsg = "";
        this.RestrictMsg1 = "";
        this.RestrictMsg2 = "";
        this.genLink1 = "";
        this.genLink12 = "";
        this.genLink13 = "";
        this.genLink14 = "";
        this.genLink15 = "";
 }

    bankName: any;
    ImageLinkedIn: any;
    isImageView: boolean = false;

    ngOnInit()
    {
        debugger;
        this.getCompanyParameter();
    //    localStorage.removeItem("bankName");
        localStorage.removeItem("CheckForAllBtn");
        this.bankName = localStorage.getItem("bankName");
        if (!isNullOrUndefined(this.bankName) && this.bankName != "") {
            this.bankName = this.bankName.split(',');
            this.Email = this.bankName[2];
            this.ImageLinkedIn = this.bankName[3];
            this.ImageLinkedIn = this.ImageLinkedIn.replace('amp;', '');
            this.ImageLinkedIn = this.ImageLinkedIn.replace('amp;', '');
             this.ImageLinkedIn = this.ImageLinkedIn.replace('#', '?');
            this.ImageLinkedIn = decodeURIComponent(this.ImageLinkedIn);
            this.FirstName = this.bankName[0];
            this.LastName = this.bankName[1];
            this.isImageView = true;
      //    var DecodeUrl = decodeURIComponent(this.ImageOfUser);
            localStorage.setItem("CheckForAllBtn", 'true');

            
        }

        this.activatedRoute.params.subscribe(params => {
          if (params['regtype'] && params['jobcode'])
          {
            this.RegType = params['regtype']; //1=Normal, 2=via AppyJob
            this.JobCode = params['jobcode'];            
          }          
        });
    }

    getLinkedIn()
    {
      this.openSpinner();

      let linkedInCredentials = {
        clientId: this._config.environment.SigninWithLinkedInCred.clientId,
        redirectUrl: this._config.environment.SigninWithLinkedInCred.redirectUrl
      };

      var LinkedInAuthenticationLink = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=" + linkedInCredentials.clientId + "&redirect_uri=" + linkedInCredentials.redirectUrl + "&state=" + this.CompanyIdService.CompanyId + "&scope=r_liteprofile%20r_emailaddress";
      window.open(LinkedInAuthenticationLink, "_self");
    }

}
