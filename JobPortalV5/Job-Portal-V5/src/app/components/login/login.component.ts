import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { isNullOrUndefined, debug } from 'util';
import { Constants } from '../../Helper/Constant';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetCompanyParameter } from '../../Service/CompanyParameter.service';
import { ThemeColorService } from '../../Service/ThemeColor.service'; 
import { AppConfigService } from '@app/Service/app-config.service';
import { Labels } from '@app/Service/DatabaseLbl.service'
import { DataService } from '../../Shared/Services/data.services'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  MsgRegEmail: string = "";
  emailForRegLink: string = '';
  isAccountActivated: boolean = true;


    isMandatoryfields: boolean = false;
    isMandatoryfields1: boolean = false;
    showMessage: boolean = false;
    DisconnectInternet: boolean = false;

    // for backgrouud color // 

    BackgroundImage: string = "";
    ThemeFontColor: string = "";
    DefaultFontColor: string = "";

    isHideLinkedIn: boolean = false;
    WrongUrl: boolean = true;




    Email: string = "";
    Password: string = "";
    ImageLinkedIn: any;
    public responseData;
    check: string = "False"
    res: any;

    

    constructor(private dataService: DataService, private Labels: Labels, private _config: AppConfigService, private http: HttpClient, private objRouter: Router, public activatedRoute: ActivatedRoute, private toastr: ToastrService, private spinner: NgxSpinnerService, public CompanyIdService: GetCompanyParameter, public ClrThemeChng: ThemeColorService) {


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

        
        
        this.bankName = this.objRouter.routerState.snapshot.url.split("login?Param=")[1]
      
        if (!isNullOrUndefined(this.bankName) && this.bankName != '') {
            debugger;
        
                this.bankName1 = this.bankName.split(',');
                this.EmailLinkedIn = this.bankName1[2];
                this.FirstName = this.bankName1[0];
                this.lastName = this.bankName1[1];
                this.ImageLinkedIn = this.bankName1[3];
                this.ImageLinkedIn = this.ImageLinkedIn.replace('amp;', '');
                this.ImageLinkedIn = this.ImageLinkedIn.replace('amp;', '');
                this.ImageLinkedIn = this.ImageLinkedIn.replace('#', '?');
                this.ImageLinkedIn = decodeURIComponent(this.ImageLinkedIn);
                this.isEmailExist();
                
            }
    
    }


    forChanges: any;
    breakcode: any;
    code: any;
    BorderColor: string = "";
    DefaultBorderColor: string = "";
    //  this.BackgroundImage = "../../../assets/images/" + this.code + "/general.PNG";


    Color() {
        
        this.forChanges = this.ClrThemeChng.ChangeTheme;
        this.breakcode = this.forChanges.split('#');
        this.code = this.breakcode[1];

        if (isNullOrUndefined(this.forChanges)) {
            this.DefaultFontColor = "#" + Constants.default;
            this.BackgroundImage = "assets/images/" + Constants.default + "/general.png";
            this.DefaultBorderColor = "1px solid #" + Constants.default;
        }
        else if (!isNullOrUndefined(this.forChanges)) {
            this.ThemeFontColor = this.forChanges;
            this.BackgroundImage = "assets/images/" + this.code + "/general.png";
            this.BorderColor = "1px solid" + this.forChanges;
        }
      //  this.HideSpinner()

    }



    showButton: boolean = false;
    btnLogin: string = "SIGN IN";
    APEmail: string = "Email";
    LblPassword: string = "Password";
    lblStaySignedIn: string = "Stay signed in";
    lblForgotPassword: string = "Forgot Password?";
    MustSignedIn: string = "You must be signed in to apply against any vacancies";


    getHomeLabels() {
      
        this.showButton = true;
        if (this.Labels.dashLabels == true) {
          if (this.Labels.btnLogin != "" && !isNullOrUndefined(this.Labels.btnLogin))
            this.btnLogin = this.Labels.btnLogin;

          if (this.Labels.btnLogin != "" && !isNullOrUndefined(this.Labels.btnLogin))
            this.btnLogin = this.Labels.btnLogin;


          if (this.Labels.APEmail != "" && !isNullOrUndefined(this.Labels.APEmail))
            this.APEmail = this.Labels.APEmail;

          if (this.Labels.LblPassword != "" && !isNullOrUndefined(this.Labels.LblPassword))
            this.LblPassword = this.Labels.LblPassword;

          if (this.Labels.lblStaySignedIn != "" && !isNullOrUndefined(this.Labels.lblStaySignedIn))
            this.lblStaySignedIn = this.Labels.lblStaySignedIn;

          if (this.Labels.lblForgotPassword != "" && !isNullOrUndefined(this.Labels.lblForgotPassword))
            this.lblForgotPassword = this.Labels.lblForgotPassword;
          
          if (this.Labels.MustSignedIn != "" && !isNullOrUndefined(this.Labels.MustSignedIn))
            this.MustSignedIn = this.Labels.MustSignedIn;

        }
    }

   // linkedIntoken: any;

   // linkedin() {
   //     

   //     let RequestObject = {

   //         code: 'AQQnCMnK6NRcxOFoQMBf3WvgMzJ8ARd3WCQ6vThpWnr-3hLlsyM98xZcKAgANnbRMbc3oRADlSRDdnsVa6wUyc9KIjmclp-Oti7uuOGKQFYj97vY2i_Dm16gPgtB2v1gDtrQ0GtdLMVg_UEZqM48o6NVlAeys1-WEmNleBwmri8Q3nBe-sRHv0GqB4ag7g',
   //         redirect_uri: 'https://jobportal-v5.azurewebsites.net/login',
   //         grant_type: 'client_credentials',
   //         client_id: '78wo10jv2ra4jd',
   //         client_secret: 'VmJ86hTlZGhPfpZ7',
			////Content-Type: 'application/x-www-form-urlencoded'

   //     }
   //     //this.openSpinner()
   //     this.http.post('https://www.linkedin.com/uas/oauth2/accessToken' , RequestObject)
   //         .subscribe((response: any) => {
   //             
   //             this.linkedIntoken = response.DataList;


   //         }, (error: any) => {
   //             console.log(error);
   //         });
   // }


    //DocCatId: string = "";
    //remarksDocument: string = "";
    //SubjectDocument: string = "";
    //isMandatoryDocument: boolean = false;
    DisconnectInternetDocument: boolean = false;
    //MsgForDoc: any;
    //SelectAtleastOneFile: boolean = false;

  

    obj: any = {};
    linkedin() {
        if (navigator.onLine) {

            this.obj.client_id = '78wo10jv2ra4jd'
            this.obj.response_type = 'code'
            this.obj.redirect_uri = 'http://localhost:4200/login'
            this.obj.state = 'aRandomString'



            //var json = JSON.stringify(this.obj)
            
            const fd = new FormData;

            fd.append("Model", this.obj);
            const request = new XMLHttpRequest();

            request.onreadystatechange = () => {
              //  console.log("messageeeee", request.response)
                //var obj1 = JSON.parse(request.response)
                if (request.readyState == 4 && request.status == 200) {

                 //   console.log("messageeeee", obj1)

                }
            }


            var saveDocumentAttachment = 'https://www.linkedin.com/oauth/v2/authorization';
            request.open("POST", saveDocumentAttachment);
            request.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
        //    request.setRequestHeader("Access-Control-Allow-Credentials", 'true');
            request.send(fd);
         //   this.openSpinner();

        }
        else {

            this.DisconnectInternetDocument = true;
        }
    }


 linkedIn1() {

     
     //let headers: HttpHeaders = new HttpHeaders();
     //headers = headers.append("Content-Type", 'application/x-www-form-urlencoded');
    // headers = headers.append("Access-Control-Allow-Credentials", 'true');
     this.http.get(this._config.environment.baseUrl + 'TestHttp').subscribe(response => {
         console.log('Linkedin : ', response);
         alert(response);
       })

 }
   //// j: string = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\"\n\"http://www.w3.org/TR/html4/loose.dtd\">\n<html>\n<head>\n  <title>Your LinkedIn Network Will Be Back Soon</title>\n  <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"//www.linkedin.com/css/style.css\">\n  <meta http-equiv=Refresh content=\"120; URL=http://www.linkedin.com/\">\n</head>\n\n<body class=\"errorpg\">\n\n<div id=\"header\">\n  <a href=\"//www.linkedin.com/home\"><img src=\"//www.linkedin.com/img/logos/logo.gif\" width=\"129\" height=\"36\" alt=\"Linkedin\"></a>\n</div>\n\n<div id=\"main\">\n  <h1>Your LinkedIn Network Will Be Back Soon</h1>\n  <p>We&#8217;ve notified our operations staff that you are having a problem reaching LinkedIn.  We&#8217;ll get you reconnected soon.</p>\n  <p>You can leave this window open and we&#8217;ll automatically take you back to your LinkedIn home page in a few minutes.</p>\n  <p>We apologize for the interruption.</p>\n</div>\n\n<!-- 500: Internal Server Error -->\n\n</body>\n</html>\n";

    ChangeTheme: any;

    getJobPortalConfiguration() {

        
        let RequestObject = {

            CompanyId: this.CompanyIdService.CompanyId,
        };
        let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
        this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
            // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
            .subscribe((response: any) => {
              console.log(response.ThemeColor);
              if (response.ThemeColor != null || !isNullOrUndefined(response.ThemeColor)) {
                this.ClrThemeChng.ChangeTheme = response.ThemeColor;
              } 
                this.Color();
                this.HideSpinner();

            })
    }



    btnPost1_Click() {
        if (navigator.onLine) {
            
            this.isMandatoryfields = false;
            this.DisconnectInternet = false;
            localStorage.removeItem("showMessage");
            
            if (this.Email == "" || this.Password == "") {
                this.isMandatoryfields = true;
                this.correctEmail = false;
                this.DisconnectInternet = false;
            }
            else {
                let RequestObject = {
                    Email: this.Email,
                    Password: this.Password,
                    CompanyId: this.CompanyIdService.CompanyId,

                }
                

                this.openSpinner();
                this.emailForRegLink = RequestObject.Email;
                let login = this._config.environment.baseUrl + Constants.Login;
                this.PostData(RequestObject, login, { headers: this.dataService.headers });
                //  this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/Login");

            }
        } else {
            this.DisconnectInternet = true;
        }
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


            if (response.CompanyId != 0 && response.CompanyId != null) {

              this.CompanyIdService.CompanyId = response.CompanyId;

                var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + this.staySigned + ",,,,";
                localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
                localStorage.setItem("LastLoginId", response.CompanyId + "," + this._config.environment.CompanyGroupID )
            }

            this.CompanyIdService.CompanyName = response.CompanyName;
            this.CompanyIdService.RedirectPath = response.RedirectPath;
            this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
            this.CompanyIdService.IsLinkedInLogin = '0';
      //    localStorage.setItem('DisplayId', response.CompanyId);
            this.getHomeLabels();
            this.getJobPortalConfiguration();
            //this.Color();
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



    openSpinner() {
        

        /** spinner starts on init */
        this.spinner.show(); 
    }


    HideSpinner() {
        

        /** spinner starts on init */
        this.spinner.hide();  
    }


    private ApplyJob(): Promise<any> {

        return new Promise((resolve, reject) => {

            if (!isNullOrUndefined(localStorage.getItem("JobCode")) && !isNullOrUndefined(localStorage.getItem("CompanyID"))) {

                let jobCode: string = localStorage.getItem("JobCode");
                let companyID: number = Number(localStorage.getItem("CompanyID"));

               

                let RequestObject = {
                    Culture: "en-GB",
                    MPRCode: jobCode,
                    ApplicantId: Number(localStorage.getItem("AppId")),
                    CompanyId: companyID,
                    Email: localStorage.getItem("Email")
                }

                this.openSpinner();
                let applyJob = this._config.environment.baseUrl + Constants.ApplyJob;
                this.dataService.post(applyJob, RequestObject)
                    .subscribe((response: any) => {
                         localStorage.setItem("IsValid", response.IsValid);
                        if (response.IsValid == true) {
                            localStorage.setItem("ApplicantApplyJob", "true");
                            localStorage.setItem("ApplyJobMsg", response.msg);
                        }
                        if (response.IsValid == false) {
                            localStorage.setItem("ApplicantApplyJob", "false");
                            localStorage.setItem("ApplyJobMsg", response.msg);
                        }
                        localStorage.removeItem("JobCode");
                        localStorage.removeItem("CompanyID");
                        this.HideSpinner();

                        resolve();
                    }, (error: any) => {
                        console.log(error);
                        reject();
                    });
            }
            else
                resolve();
        });
    }

    msg: string = "";
    correctEmail: boolean = false

    marked: boolean = false;
    staySigned: boolean = false;
    key: any;
    bankName: any;
    bankName1: any;

    public PostData(model, url: string,headers: any) {
        

        if (navigator.onLine) {
        const retVal = this.http.post(url, model, this.dataService.getHeaders('login'))
            .subscribe(async (response: any) => {
                
            //    console.log(response);
                this.HideSpinner();

                if (!isNullOrUndefined(response) && response.isValid == true) {
                    
                    localStorage.setItem('UserName', response.UserName);
                    localStorage.setItem('Email', response.Email);
                    localStorage.setItem('AppId', response.AppId);
                    if (response.AccessToken) {
                        localStorage.setItem('AccessToken', response.AccessToken);
                        localStorage.setItem('AccessTokenExpiresUtc', response.AccessTokenExpiresUtc || '');
                        this.dataService.PassHeader();
                    }

                    localStorage.setItem("IsLinkedInLogin", "0");
                    this.CompanyIdService.IsLinkedInLogin = "0";

                    this.msg = response.Message;

                    await this.ApplyJob();
                    
                    if (this.showMessage == true) {
                        this.objRouter.navigate(['/MyProfile']);
                    //    for Create Array in localStorage
                        var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + this.staySigned + "," + response.AppId +
                            "," + response.Email + "," + response.UserName + ",";
                        localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
                        localStorage.setItem("LastLoginId", this.CompanyIdService.CompanyId + "," + this._config.environment.CompanyGroupID)

                    }
                    else {
                        this.objRouter.navigate(['/MyProfile']);
                        //    for Create Array in localStorage
                        var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + this.staySigned + "," + response.AppId +
                            "," + response.Email + "," + response.UserName + ",";
                        localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
                        localStorage.setItem("LastLoginId", this.CompanyIdService.CompanyId + "," + this._config.environment.CompanyGroupID )
                    }
                }

                if (response.isValid == false) {
                  if (response.Message == 'Your account is not activated.')
                  {
                    this.isAccountActivated = false;
                    this.msg = response.Message;
                  }
                  else
                  {
                    this.isAccountActivated = true;
                    this.msg = response.Message;
                  }
                    this.correctEmail = true;
                    this.DisconnectInternet = false;
                    this.isMandatoryfields = false;
                }

            }, error => {
                console.log(error);
                this.isMandatoryfields1 = true;
             
            }
            );
        }
        else {
            
              this.HideSpinner();
              this.DisconnectInternet = true;
              this.isMandatoryfields = false;
              this.correctEmail = false;
      }

    }


    ShowMessageRemove() {

        localStorage.removeItem("showMessage");
        this.objRouter.navigate(['/forget-password'])

    }

    staySignedIn1(){

        
        localStorage.getItem('Email');
        localStorage.getItem('AppId');
}



    toggleVisibility(e){

        

        if (this.marked = e.target.checked) {
            this.staySigned = true
            localStorage.setItem('StaySignedIn', "true");
            localStorage.getItem('StaySignedIn');
        } else {

            localStorage.removeItem('StaySignedIn');
        }
    }



    isEmailExist() {
        if (navigator.onLine) {
            this.openSpinner();
            this.CompanyIdService.CompanyId = localStorage.getItem("LastLoginId").split(",")[0];
                let RequestObject = {
                    Email: this.EmailLinkedIn,
                    CompanyId: localStorage.getItem("LastLoginId").split(",")[0]

                }           
                let IsEmailExist = this._config.environment.baseUrl + Constants.IsEmailExist;
            this.http.post(IsEmailExist, RequestObject, { headers: this.dataService.headers })
                .subscribe((response: any) => {
                    
               //     console.log(response);
                    if (response.isValid == true) {
                        this.LinkedInLogin();
                    }
                    if (response.isValid == false){
                        localStorage.setItem("bankName", this.bankName);
                   //     localStorage.setItem("ImageLinkedIn", this.ImageLinkedIn);
                        this.objRouter.navigate(['/registration'])
                    }
                }, (error: any) => {
                    console.log(error);
                });
    }
        }


    LinkedInLogin() {
        if (navigator.onLine) {
            this.openSpinner();
            this.CompanyIdService.CompanyId = localStorage.getItem("LastLoginId").split(",")[0];
            let RequestObject = {
                Email: this.EmailLinkedIn,
                Password: "",
                ConfirmPassword: "",
                CompanyId: this.CompanyIdService.CompanyId,
                FirstName: this.FirstName,
                MiddleName: "",
                LastName: this.lastName,
                Culture: Constants.Culture,
                DOB: "",
                PassportNumber: "",
                IdCardNumber: "",
                IsRequestFromMobile: false, 
            }
           // this.openSpinner();
            let IsEmailExist = this._config.environment.baseUrl + Constants.LinkedInLogin;
            this.http.post(IsEmailExist, RequestObject, { headers: this.dataService.headers })
                .subscribe((response: any) => {
                    debugger;
                    console.log(response);
                    if (response.isValid == true) {
                        var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + this.staySigned + "," + response.AppId +
                            "," + response.Email + "," + response.UserName + ",";
                        localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
                        localStorage.setItem("LastLoginId", this.CompanyIdService.CompanyId + "," + this._config.environment.CompanyGroupID);
                 
                        this.objRouter.navigate(['/MyProfile'])
                    }
                    if (response.isValid == false)  {
                        this.objRouter.navigate(['/login'])
                    }
                    this.HideSpinner();
                }, (error: any) => {
                    console.log(error);
                });
        }
    }


    EmailLinkedIn: any;
    FirstName: any;
    lastName: any;

    ngOnInit() {
        
      //  this.bankName = this.activatedRoute.queryParams
        //this.bankName = this.bankName.value.Param

        //if (!isNullOrUndefined(this.bankName) && this.bankName != '') {
        ////    localStorage.setItem("bankName", this.bankName)
        //    this.bankName1 = this.bankName.split(',');
        //    this.EmailLinkedIn = this.bankName1[2];
        //    this.FirstName = this.bankName1[0];
        //    this.lastName = this.bankName1[1];
        //    this.isEmailExist();
        // //   this.objRouter.navigate(['/registration'])
        //}

        this.getCompanyParameter();
  
    }

    getLinkedInUrl: any;
    getLinkedIn()
    {
        
      this.openSpinner();

      let linkedInCredentials = {
        clientId: this._config.environment.SigninWithLinkedInCred.clientId,
        redirectUrl: this._config.environment.SigninWithLinkedInCred.redirectUrl
      };
       
      var LinkedInAuthenticationLink = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=" + linkedInCredentials.clientId + "&redirect_uri=" + linkedInCredentials.redirectUrl + "&state=" + this.CompanyIdService.CompanyId + "&scope=r_liteprofile%20r_emailaddress";          
      window.open(LinkedInAuthenticationLink, "_self");

      //   window.open("https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=81cscdihgfc5ke&redirect_uri=http://10.20.2.252/JobPortalAPI/LinkedInRedirection&state=62&scope=r_liteprofile%20r_emailaddress%20w_member_social", "_self")          
      //  window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${
      //  this.linkedInCredentials.clientId
      //  }&redirect_uri=${this.linkedInCredentials.redirectUrl}&state=${this.CompanyIdService.CompanyId}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;

    }


    ResendActivaionEmail() {
      this.openSpinner();
      this.ReGenerateLink();
    }

    ReGenerateLink() {
      debugger;

      $("#myModalSingupErr").modal("hide");

      let RequestObject = {
        CompanyId: this.CompanyIdService.CompanyId,
        FromEmail: this.emailForRegLink,
      }

      let generateNewLink = this._config.environment.baseUrl + Constants.ReGenerateEmailLink;
      this.http.post(generateNewLink, RequestObject, { headers: this.dataService.headers })
        .subscribe((response: any) => {
          console.log('response : ', response);

          this.HideSpinner();
          debugger;
          if (!isNullOrUndefined(response) && response.Valid == true) {

            this.MsgRegEmail = "Registration email has been sent on " + this.emailForRegLink + ".<br/>Please check your email.<br/>If you can't find the email, please check your spam or junk folder.";

            $("#myModalSingupErr").modal("show");

          }
          else {
            this.MsgRegEmail = "Email sending failed! Please try again."
            $("#myModalSingupErr").modal("show");
          }
        }, (error: any) => {
          console.log(error);
        });
    }

   
}
