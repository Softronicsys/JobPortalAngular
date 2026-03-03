import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd, Params, ActivatedRouteSnapshot } from '@angular/router';
import { Constants } from '../../Helper/Constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { isNullOrUndefined, isString } from 'util';
import { UpdateProfileService } from '../../Service/UpdateProfile.service';
import { GetCompanyParameter } from '../../Service/CompanyParameter.service';
import { ThemeColorService } from '../../Service/ThemeColor.service';
import { AppConfigService } from '@app/Service/app-config.service';
import { Labels } from '@app/Service/DatabaseLbl.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
import { DataService } from '@app/Shared/Services/data.services';
//import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  responseData;
  filteredJobs: any[];
  DisconnectInternet: boolean = false;



  MPRDETAIL: any[];
  arrHeadings: any[] = [];
  arrJobsDetail: any[] = [];
  showMeetings: boolean = false;
  showReports: boolean = false;
  showAcademicQualifications: boolean = false;
  showTrainings: boolean = false;
  showCertification: boolean = false;
  showCompetencies: boolean = false;
  showAuthorities: boolean = false;
  slideIndex = 1;
  isGrid: boolean = false;
  HRLooping: any[3] = [1, 2, 3];
  BannerList: string[] = [];
  isBannerExists: boolean = false;
  id: any;


  ischkTraining: boolean = false;

  isSpinnerPopup: boolean = false;
  isSpinnerPage: boolean = true;


  // for backgrouud color // 

  BackgroundImage: string = "";
  ThemeFontColor: string = "";
  DefaultFontColor: string = "";
  BorderColor: string = "";
  DefaultBorderColor: string = "";
  textToFilter: string = "";
  searchFilter: string = "0";
  WrongUrl: boolean = true;
  IsDefaultTheme: boolean = true;
  isJobAvailable: boolean = false;


  //key;
  key1;
  g;
  CompanyForLocalStorage: any;
  res: any;
  obj: any;
  paramsvalue: any
  check: string = "false";

  constructor(public sanitizer: DomSanitizer, public activatedRoute: ActivatedRoute, private Labels: Labels, private _config: AppConfigService, private http: HttpClient, private spinner: NgxSpinnerService,
    private objRouter: Router, public updateProfService: UpdateProfileService,
    public CompanyIdService: GetCompanyParameter, public ClrThemeChng: ThemeColorService, private dataService: DataService) {

    //this._config.environment.CompanyGroupID = this._config.environment.CompanyGroupID;
    //this.activatedRoute.queryParams.subscribe(params => {
    //  debugger;
    //  if (!isNullOrUndefined(params.g)) {
    //    this.key = params['g'];
    //    this.paramsvalue = this.key;
    //    var Id = this.key
    //    var num = 0
    //    var IfExists = false
    //    var localValueTime = new Date();
    //    for (var i = 0; i < localStorage.length; i++) {
    //      if (localStorage.key(i) === this.key) {
    //        var abc = localStorage.key(i);
    //        var lenghtOfGroupId = localStorage.getItem(abc).split(',')[0].length;
    //        var lenghtOfCheck = localStorage.getItem(abc).split(',')[2].length;
    //        this.res = localStorage.getItem(abc).split(',')[0].slice(1, lenghtOfGroupId);
    //        if (this.res == Id) {
    //          IfExists = true;
    //          this.check = localStorage.getItem(abc).split(',')[2].slice(0, lenghtOfCheck);
    //          this._config.environment.CompanyGroupID = localStorage.getItem(abc).split(',')[0].slice(1, lenghtOfGroupId);
    //          if (this.check == "true") {
    //            this.WrongUrl = false;
    //          }
    //          return;
    //        }
    //        num++;
    //      }
    //    }

    //    if (!IfExists) {
    //      var str = this.key + "," + this.CompanyIdService.CompanyId + "," + IfExists + ",,,,";
    //      localStorage.setItem(Id, str);
    //      this._config.environment.CompanyGroupID = this.key;
    //    }

        
    //  }
    //  else if (isNullOrUndefined(params.g)) {
    //    debugger; 
    //    //  Mateen Bhai  Amendment
    //    let groupid = localStorage.getItem("LastLoginId").split(",")[1];
    //    var ArrayLoginId = localStorage.getItem(groupid).split(',')[1];
    //    var LastLoginId = localStorage.getItem("LastLoginId").split(",")[0];
    //    var lenghtOfCheck = localStorage.getItem(groupid).split(',')[2].length;


    //    if (LastLoginId == ArrayLoginId) {
    //      var lenghtOfGroupId = localStorage.getItem(groupid).split(',')[0].length;
    //      this.check = localStorage.getItem(groupid).split(',')[2].slice(0, lenghtOfCheck);
    //      this._config.environment.CompanyGroupID = localStorage.getItem(groupid).split(',')[0].slice(1, lenghtOfGroupId);
    //      if (this.check == "true") {
    //        this.WrongUrl = false;
    //      }
    //      return;
    //    }
        
    //    if (localStorage.length < 0) {
    //      $("#myModalWrongURL").modal("toggle");
    //      this.WrongUrl = false;
    //    }
        
    //  }

    //});


  } 

  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  ngOnInit() {
    this.getAssociatedCompanies();
    this.getCompanyParameter();
    this.Color();
    //this.SaveGridViewStyle(-1)

    localStorage.setItem('IsGridView', 'false');
    this.isGrid = false;
    //this.ClrThemeChng.IsGridViewShow.emit(true); 
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
  // For Welcome Labels //

  SaveGridViewStyle(IsNormalView) {

    if (IsNormalView == 1)
      localStorage.setItem("IsGridView", "true");//this.ClrThemeChng.IsGridViewShow.emit(true);

    if (IsNormalView == 0)
      localStorage.setItem("IsGridView", "false");//this.ClrThemeChng.IsGridViewShow.emit(false);

    if (!isNullOrUndefined(localStorage.getItem("IsGridView")))
      this.isGrid = localStorage.getItem("IsGridView") == "true" ? true : false;
    else
    { localStorage.setItem("IsGridView", "false"); this.isGrid = false;}

    
    //if (IsNormalView == -1) {
    //  if (this.isGrid) {
    //    let element: HTMLElement = document.getElementById('imgNormalView') as HTMLElement;
    //    element.click();
    //  }
    //  else {
    //    //let element1: HTMLElement = document.getElementById('imgGridView') as HTMLElement;
    //    //element1.click();
    //  }
    //}
  
  }

  Firstname: string = "";
  lblWelcome: string = "Welcome!"
  lblWelcomeHeading1: string = "Vacancies you can apply for";
  lblWelcomePage12: any;
  lblWelcomePage13: any = "Now it's time to make a decision about your future. Whether you've just graduate or ";
  lblWelcomePage14: any = "have already acquired some work experience, you're probably looking for the career that's";
  lblWelcomePage15: any = "rewarding and simulating.";
  lblWelcomePage1: string = "Now it's time to make a decision about your future. Whether you've just graduate or have already acquired some work experience, you're probably looking for the career that's rewarding and simulating.";
  Organization: string = "Organization";
  lblJobCode: string = "Job Code";
  JobTitle: string = "Job Title";
  Department: string = "	Department";
  lblTotalPositions: string = "Total Positions";
  lblApplicationDeadline: string = "	Application Deadline";
  btnApplyNormalView: string = "Apply";
  btnApplyListView: string = "View / Apply";
  lblWelcomePage2: string = "With a strong track record in meaningful and many learning and development opportunities we're a great place to start a career.";
  lblWelcomePage22: any;
  lblWelcomePage23: any = "With a strong track record in meaningful and many learning and development ";
  lblWelcomePage24: any = "opportunities we're a great place to start a career.";
  Nodata: string = "No data";
  Close: string = "Close";
  lblJobDetail: string = "Job Details";
  lblAll: string = "All";
  lblLocation: string = "Location";
  lblCompany: string = "Organization";
  lblJobAttributeName: string = "JobAttributeName";

  showTable: boolean = false;
  SocialLink: any;
  CurrentURL: any;

  getHomeLabels() {

    this.showTable = true;
    if (this.Labels.dashLabels == true) {
      if (this.Labels.FirstName != "" && !isNullOrUndefined(this.Labels.FirstName))
        this.Firstname = this.Labels.FirstName;

      if (this.Labels.lblWelcome != "" && !isNullOrUndefined(this.Labels.lblWelcome))
        this.lblWelcome = this.Labels.lblWelcome;

      if (this.Labels.lblWelcomeHeading1 != "" && !isNullOrUndefined(this.Labels.lblWelcomeHeading1))
        this.lblWelcomeHeading1 = this.Labels.lblWelcomeHeading1;

      if (this.Labels.lblWelcomePage1 != "" && !isNullOrUndefined(this.Labels.lblWelcomePage1))
        this.lblWelcomePage1 = this.Labels.lblWelcomePage1;

      if (this.Labels.lblWelcomePage1 != "" && !isNullOrUndefined(this.Labels.lblWelcomePage1))
        this.lblWelcomePage12 = this.Labels.lblWelcomePage1.split('\n')

      if (this.lblWelcomePage12[0] != "" && !isNullOrUndefined(this.lblWelcomePage12[0]))
        this.lblWelcomePage13 = this.lblWelcomePage12[0];

      if (this.lblWelcomePage12[1] != "" && !isNullOrUndefined(this.lblWelcomePage12[1]))
        this.lblWelcomePage14 = this.lblWelcomePage12[1];

      if (this.lblWelcomePage12[2] != "" && !isNullOrUndefined(this.lblWelcomePage12[2]))
        this.lblWelcomePage15 = this.lblWelcomePage12[2];

      if (this.Labels.Organization != "" && !isNullOrUndefined(this.Labels.Organization))
        this.Organization = this.Labels.Organization;

      if (this.Labels.lblJobCode != "" && !isNullOrUndefined(this.Labels.lblJobCode))
        this.lblJobCode = this.Labels.lblJobCode;

      if (this.Labels.JobTitle != "" && !isNullOrUndefined(this.Labels.JobTitle))
        this.JobTitle = this.Labels.JobTitle;

      if (this.Labels.Department != "" && !isNullOrUndefined(this.Labels.Department))
        this.Department = this.Labels.Department;

      if (this.Labels.lblTotalPositions != "" && !isNullOrUndefined(this.Labels.lblTotalPositions))
        this.lblTotalPositions = this.Labels.lblTotalPositions;

      if (this.Labels.lblApplicationDeadline != "" && !isNullOrUndefined(this.Labels.lblApplicationDeadline))
        this.lblApplicationDeadline = this.Labels.lblApplicationDeadline;

      if (this.Labels.Apply != "" && !isNullOrUndefined(this.Labels.Apply))
        this.btnApplyNormalView = this.Labels.Apply;

      if (this.Labels.Apply != "" && !isNullOrUndefined(this.Labels.Apply))
        this.btnApplyListView = this.Labels.Apply;

      if (this.Labels.lblWelcomePage2 != "" && !isNullOrUndefined(this.Labels.lblWelcomePage2))
        this.lblWelcomePage2 = this.Labels.lblWelcomePage2;

      if (this.lblWelcomePage2 != "" && !isNullOrUndefined(this.lblWelcomePage2))
        this.lblWelcomePage22 = this.lblWelcomePage2.split('\n');

      if (this.lblWelcomePage22[0] != "" && !isNullOrUndefined(this.lblWelcomePage22[0]))
        this.lblWelcomePage23 = this.lblWelcomePage22[0];

      if (this.lblWelcomePage22[1] != "" && !isNullOrUndefined(this.lblWelcomePage22[1]))
        this.lblWelcomePage24 = this.lblWelcomePage22[1];

      if (this.Labels.Nodata != "" && !isNullOrUndefined(this.Labels.Nodata))
        this.Nodata = this.Labels.Nodata;
      
      if (this.Labels.Close != "" && !isNullOrUndefined(this.Labels.Close))
        this.Close = this.Labels.Close;

      if (this.Labels.lblJobDetail != "" && !isNullOrUndefined(this.Labels.lblJobDetail))
        this.lblJobDetail = this.Labels.lblJobDetail;
 
      if (this.Labels.lblAll != "" && !isNullOrUndefined(this.Labels.lblAll))
        this.lblAll = this.Labels.lblAll;

      if (this.Labels.lblLocation != "" && !isNullOrUndefined(this.Labels.lblLocation))
        this.lblLocation = this.Labels.lblLocation;

      if (this.Labels.Company != "" && !isNullOrUndefined(this.Labels.Company))
        this.lblCompany = this.Labels.Company;

    } 
  }

  ShareOnSocialMedia(link, JobCode, JobTitle, CompanyId, CompanyName) {
    this.clickRow = false;
    this.CurrentURL = window.location.origin + window.location.pathname;//.split('/')[0];
    var repLink = /<%link%>/gi;
    var repText = /<%text%>/gi;
    //localStorage.setItem("GID", this._config.environment.CompanyGroupID + "," + CompanyId);
    //this.SocialLink = link.replace(repLink, this.CurrentURL + "/JobDetail?JID=" + JobCode + "," + CompanyId + "," + this._config.environment.CompanyGroupID);
    this.SocialLink = link.replace(repLink, this.CompanyIdService.RedirectPath + "/JobDetail/" + JobCode + "-" + this._config.environment.CompanyGroupID + "-" + CompanyId);
    this.SocialLink = this.SocialLink.replace(repText, "Job Opening " + JobTitle + " at " + CompanyName);
 
    window.open(
      this.SocialLink, '_blank'
    );
  }


  // For GetAssociatedCompanies dropdown //

  AssociatedCompanies: string = "";
  AssociatedCompaniesDropdown: any;
  AssociatedCompaniesDropdown1: any;
  ShowCompany: boolean = false;
  ShowCompanyInfo: boolean = false;



  getAssociatedCompanies() {


    let RequestObject = {

      CompanyGroupID: this._config.environment.CompanyGroupID,

    }
    let getAssociatedCompanies = this._config.environment.baseUrl + Constants.GetAssociatedCompanies + "?Culture=" + Constants.Culture;
    this.http.post(getAssociatedCompanies, RequestObject, { headers: this.dataService.headers })
      //  this.http.get(" https://jobportalapi.azurewebsites.net/GetAssociatedCompanies?Culture=en-GB")
      .subscribe((response: any) => {

        this.AssociatedCompaniesDropdown = response.DataList;
        this.AssociatedCompaniesDropdown1 = response.CompanyCount;
        this.getOpenVacancies();

        //if (!isNullOrUndefined(this.AssociatedCompaniesDropdown1) && this.AssociatedCompaniesDropdown1 > 1)
        //  this.ShowCompany = true;

        if (!isNullOrUndefined(this.AssociatedCompaniesDropdown1) && this.AssociatedCompaniesDropdown1 > 1) {
          this.ShowCompanyInfo = true;
        }

        this.ShowCompanyInfo = true; //always show organization

      }, (error: any) => {
        console.log(error);
      });
  }

  clickRow: boolean = true;

  ForSelectedRowColor() {

    if (this.clickRow == false) {
      $('#MPRCODE').modal('hide');
      this.clickRow = true;
    }
    else {
      $('#MPRCODE').modal('show');
      $("tbody tr").click(function () {
        console.log('clicked');
        $(this).addClass('selected').siblings().removeClass("selected");
      });
    }
  }



  forChanges: any;
  breakcode: any;
  code: any;

  public RelativeBackground = {
    height: "auto !important",
    background: ""
  }

  public DefaultViewbackground = {
    height: "",
    background: ""
  }

  // for background color //

  BackgroundImage1: any;

  Color() {

    this.forChanges = this.ClrThemeChng.ChangeTheme;
    
 
    if (isNullOrUndefined(this.forChanges)) {
      this.DefaultFontColor = "#" + Constants.default;
      this.BackgroundImage = "assets/images/" + Constants.default + "/LoginBackground.png";
      this.DefaultBorderColor = "1px solid #" + Constants.default;
      this.IsDefaultTheme = true;
    }
    else if (!isNullOrUndefined(this.forChanges)) {

      this.breakcode = this.forChanges.split('#');
      this.code = this.breakcode[1];
      this.ThemeFontColor = this.forChanges;
      this.BackgroundImage = "assets/images/" + this.code + "/LoginBackground.png";
      this.BorderColor = "1px solid" + this.forChanges;
      this.IsDefaultTheme = false;
    }

    this.DefaultViewbackground.background = "url('" + this.BackgroundImage + "') right -150px bottom -30px no-repeat";
    this.RelativeBackground.background = "url('" + this.BackgroundImage + "') bottom -22px right -156px no-repeat !important"; 
    
    
    //else{
    //    if (Constants.Color == "007FFF") {
    //        this.ThemeFontColor = "#" + Constants.Color;
    //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/LoginBackground.png";
    //        this.BorderColor = "1px solid #" + Constants.Color;
    //    }
    //    if (Constants.Color == "4059A9") {
    //        this.ThemeFontColor = "#" + Constants.Color;
    //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/LoginBackground.png";
    //        this.BorderColor = "1px solid #" + Constants.Color;
    //    }
    //    if (Constants.Color == "79C942") {
    //        this.ThemeFontColor = "#" + Constants.Color;
    //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/LoginBackground.png";
    //        this.BorderColor = "1px solid #" + Constants.Color;
    //    }
    //    if (Constants.Color == "999999") {
    //        this.ThemeFontColor = "#" + Constants.Color;
    //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/LoginBackground.png";
    //        this.BorderColor = "1px solid #" + Constants.Color;
    //    }
    //    if (Constants.Color == "F47117") {
    //        this.ThemeFontColor = "#" + Constants.Color;
    //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/LoginBackground.png";
    //        this.BorderColor = "1px solid #" + Constants.Color;
    //    }
    //    if (Constants.Color == "E000B6") {
    //        this.ThemeFontColor = "#" + Constants.Color;
    //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/LoginBackground.png";
    //        this.BorderColor = "1px solid #" + Constants.Color;
    //    }
    //    if (Constants.Color == "982BBC") {
    //        this.ThemeFontColor = "#" + Constants.Color;
    //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/LoginBackground.png";
    //        this.BorderColor = "1px solid #" + Constants.Color;
    //    }
    //    if (Constants.Color == "B30111") {
    //        this.ThemeFontColor = "#" + Constants.Color;
    //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/LoginBackground.png";
    //        this.BorderColor = "1px solid #" + Constants.Color;
    //    }
    //    if (Constants.Color == "EFC203") {
    //        this.ThemeFontColor = "#" + Constants.Color;
    //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/LoginBackground.png";
    //        this.BorderColor = "1px solid #" + Constants.Color;

    //    }

    //}

  }

  ChangeTheme: any;

  getJobPortalConfiguration() {


    let RequestObject = {

      CompanyId: this.CompanyIdService.CompanyId,
    };
    let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
    this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
      // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
      .subscribe((response: any) => {
        //console.log('GetJobPortalConfiguration',response);
        this.BannerList = [];
        this.isBannerExists = false;
        if(response && response.bannerlist && response.bannerlist.length > 0){
          this.isBannerExists = true;
          this.BannerList = response.bannerlist;
          
          // this.showSlides(this.slideIndex);
          this.id = setInterval(() => {
            let slides: any = document.getElementsByClassName("mySlides");
            if (slides[this.slideIndex - 1])
              this.plusSlides(1);
          }, 3000)
        }

        if (response.ThemeColor != null || !isNullOrUndefined(response.ThemeColor))
        {
          this.ClrThemeChng.ChangeTheme = response.ThemeColor;
          this.ClrThemeChng.themeChanged.emit(response.ThemeColor);  } 

        
        this.Color();
        this.HideSpinner();

        

      })
  }

  SelectedCompany: number = -1
  onChange() {
    debugger
    this.getOpenVacancies();
  }


  

  
  // for grid //
  getOpenVacancies() {


    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.SelectedCompany,
      ApplicantId: 0,
      CompanyGroupID: this._config.environment.CompanyGroupID,

    };

  
    //    console.log('companyID', this.CompanyIdService.CompanyId);
    this.openSpinner();
    let getOpenVacancies = this._config.environment.baseUrl + Constants.GetOpenVacancies;
    this.PostData(RequestObject, getOpenVacancies, { headers: this.dataService.headers });
    // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetOpenVacancies");
  }



  getCompanyParameter() {
    this.openSpinner();
    
    let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;
    this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {
      debugger;

      if (response != null) {
        if (response.CompanyId == 0) {
          $("#myModalWrongURL").modal("toggle");
          this.WrongUrl = false;
          localStorage.removeItem(this._config.environment.CompanyGroupID);
          return;
        }
        this.CompanyIdService.CompanyId = response.CompanyId;
        if (this.check == "true") {
          localStorage.setItem("LastLoginId", response.CompanyId + "," + this._config.environment.CompanyGroupID)
          this.objRouter.navigate(['/MyProfile']);
          return;
        }
        if (response.CompanyId != 0) {
          var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + this.check + ",,,,";
          //  this.obj.splice(0,0, str);
          localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
          localStorage.setItem("LastLoginId", response.CompanyId + "," + this._config.environment.CompanyGroupID)
        }
        //  this._config.environment.CompanyGroupID = this.key;
         
        if (response.CompanyId != null || !isNullOrUndefined(response.CompanyId))
          this.CompanyIdService.CompanyId = response.CompanyId;
        if (response.CompanyName != null || !isNullOrUndefined(response.CompanyName))
          this.CompanyIdService.CompanyName = response.CompanyName;
        if (response.RedirectPath != null || !isNullOrUndefined(response.RedirectPath))
          this.CompanyIdService.RedirectPath = response.RedirectPath;
        if (response.CompanyLogoBase64 != null || !isNullOrUndefined(response.CompanyLogoBase64))
          this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
      } 
       
      this.getHomeLabels();
      this.getOpenVacancies();
      this.getJobPortalConfiguration(); 
    });
  }


  terminalIP: any;
  terminalName: any;

  getTerminal() {


    let getTerminal = this._config.environment.baseUrl + Constants.GetTerminal;
    this.http.get(getTerminal)
      .subscribe((response: any) => {


        this.terminalIP = response.IP;
        this.terminalName = response.TerminalName;

      });
  }


  openSpinner() {


    /** spinner starts on init */
    this.spinner.show();
  }

  HideOrganization: boolean = false;
  HideJobCode: boolean = false;
  HideTotalPositions: boolean = false;
  HideJobAttributeName: boolean = false;
  HideLocation : boolean = false;




  HideSpinner() {


    /** spinner starts on init */
    this.spinner.hide();
  }
  fnFilterJob(textToFilter){
    let rawData = this.responseData;
    // console.log('Filtered data : ',rawData);
    let that = this;
    textToFilter = textToFilter.toLowerCase();
    that.filteredJobs = [];
    rawData.forEach(function (item, index, object) {
      if (that.searchFilter == "0" && (item.JobTitle.toLowerCase().indexOf(textToFilter) !== -1 || item.Location.toLowerCase().indexOf(textToFilter) !== -1 || item.CompanyName.toLowerCase().indexOf(textToFilter) !== -1)) {
        that.filteredJobs.push(item);
      }
      else if(that.searchFilter != "0" && item[that.searchFilter] && (item[that.searchFilter]).toLowerCase().indexOf(textToFilter) !== -1)
        that.filteredJobs.push(item);
    });
  }

  PostData(model, url: string, headers: any) {

    if (navigator.onLine) {
      const retVal = this.http.post(url, model, headers)
        .subscribe((response: any) => {
          this.responseData = response ? response.Data : [];
          this.filteredJobs = this.responseData;
          //console.log("home  data", this.responseData)
          //console.log("filteredJobs", this.filteredJobs)

          let len = this.filteredJobs.length;

          if (!isNullOrUndefined(this.filteredJobs) && len > 0) {
            //this.isOpenVacancy = true;

            for (let i = 0; i < len; i++) {
              if (this.filteredJobs[i].VisOrganization != "" && !this.HideOrganization)
                this.HideOrganization = true;
                //console.log(this.HideOrganization);

                if (this.filteredJobs[i].VisJobCode != "" && !this.HideJobCode)
                this.HideJobCode = true;

                if (this.filteredJobs[i].VisTotalPositions != "" && !this.HideTotalPositions)
                  this.HideTotalPositions = true;

                //if (this.filteredJobs[i].JobAttributeName != "" && this.filteredJobs[i].JobAttributeName.trim().toUpperCase() !== "N/A" && !this.HideJobAttributeName)
                //  this.HideJobAttributeName = true;

                if (this.filteredJobs[i].Location && this.filteredJobs[i].Location.trim().toUpperCase() !== "N/A") 
                  this.HideLocation = true;
            

                if (this.filteredJobs[i].AdditionalFilter != "" && !this.HideJobAttributeName)
                  this.HideJobAttributeName = true;

                for (let i = 0; i < this.filteredJobs.length; i++) {
                  const attr = this.filteredJobs[i].showJobattribute_jobportal;

                  if (attr == 70) {
                    this.lblJobAttributeName = "Division";
                    break;
                  }
                  if (attr == 84) {
                    this.lblJobAttributeName = "Department";
                    break;
                  }
                  if (attr == 24) {
                    this.lblJobAttributeName = "Sub-Department";
                    break;
                  }
                  if (attr == 63) {
                    this.lblJobAttributeName = "Location";
                    break;
                  }
                  if (attr == 79) {
                    this.lblJobAttributeName = "Region";
                    break;
                  }
                }

               

            }
          }

          this.HideSpinner();

          if (!isNullOrUndefined(this.responseData) && this.responseData.length > 0) {
            this.isJobAvailable = true;
          }


        }, (error: any) => {
          console.log(error);
        });

    }
    else {

      this.DisconnectInternet = true;
    }

  }

  // MPRDetail //

  forGridData = {

    showMeetings: false,
    showReports: false,
    showAcademicQualifications: false,
    showTrainings: false,
    showCertification: false,
    showCompetencies: false,
    showAuthorities: false,
  }

  Object = {
    listofMPR: undefined,
    reports: undefined,
    authorities: undefined,
    meetings: undefined,
    academicQualifications: undefined,
    trainings: undefined,
    certification: undefined,
    competencies: undefined
  }

  selectedJobCode: string = "";
  selectedCompanyId: number;
  GetMPRDetail(selectedRow: any) {

    this.selectedRow = selectedRow;
    this.arrHeadings = [];
    const arrPanelHeadings: string[] = ["Work Experience", "Additional Requirement", "Incentive Package",
      "Other Benefit", "Salary Remarks", "Job Summary", "Accountabilities", "Responsibilities",
      "Extra Ordinary Work Condition"];
    this.selectedJobCode = selectedRow.JobCode;
    this.selectedCompanyId = selectedRow.CompanyId;
    let RequestObject = {

      MPRCode: selectedRow.JobCode,
      CompanyId: selectedRow.CompanyId,
      Culture: Constants.Culture,
    }

    this.openSpinner();
    let getMPRDetail = this._config.environment.baseUrl + Constants.GetMPRDetail;
    this.http.post(getMPRDetail, RequestObject, { headers: this.dataService.headers })
      .subscribe((response: any) => {        
        this.arrHeadings = [];
        this.forGridData = {
          showMeetings: false,
          showReports: false,
          showAcademicQualifications: false,
          showTrainings: false,
          showCertification: false,
          showCompetencies: false,
          showAuthorities: false,
        }

        this.Object = {
          listofMPR: undefined,
          reports: undefined,
          authorities: undefined,
          meetings: undefined,
          academicQualifications: undefined,
          trainings: undefined,
          certification: undefined,
          competencies: undefined
        }

        this.MPRDETAIL = response;
        this.HideSpinner();
        

        arrPanelHeadings.forEach((item: string) => {
          for (let value of this.MPRDETAIL) {
            //debugger;
            for (let value1 of value) {
              debugger;
              if (String(value1.Heading).toLowerCase().trim() == item.toLowerCase().trim()) {
                this.arrHeadings.push(value1);
                break;

              }
            }
          }
        });

        for (let i = 0; i < this.MPRDETAIL.length; i++) {
          for (var j = 0; j < 1; j++) {
            if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "ListOfMPR".toLowerCase()) {
              this.Object.listofMPR = this.MPRDETAIL[i];
            }

            if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Authorities".toLowerCase()) {
              this.forGridData.showAuthorities = true;
              this.Object.authorities = this.MPRDETAIL[i];
            }

            if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Meetings".toLowerCase()) {
              this.forGridData.showMeetings = true;
              this.Object.meetings = this.MPRDETAIL[i];
            }

            if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Reports".toLowerCase()) {
              this.forGridData.showReports = true;
              this.Object.reports = this.MPRDETAIL[i];
            }

            if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "AcademicQualification".toLowerCase()) {
              this.forGridData.showAcademicQualifications = true;
              this.Object.academicQualifications = this.MPRDETAIL[i];
            } 

            if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Certifications".toLowerCase()) {
              this.forGridData.showCertification = true;
              this.Object.certification = this.MPRDETAIL[i];
            }


            if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Competencies".toLowerCase()) {
              this.forGridData.showCompetencies = true;
              this.Object.competencies = this.MPRDETAIL[i];
            }


            if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Trainings".toLowerCase()) {
              this.forGridData.showTrainings = true;
              this.Object.trainings = this.MPRDETAIL[i];

            }

          }

        }

      });
  }

  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n) {
    let i;
    let slides: any = document.getElementsByClassName("mySlides");
    //   let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
      slides[i].classList.remove("slideActive");
    }
    //   for (i = 0; i < dots.length; i++) {
    //       dots[i].className = dots[i].className.replace(" active", "");
    //   }
    if(slides[this.slideIndex - 1]){
      slides[this.slideIndex - 1].classList.add("slideActive");
    }
    //   dots[this.slideIndex-1].className += " active";
  }
  selectedRow: any;

  btnApplyJob_Click(selectedRow: any) {
    debugger;
    this.clickRow = false;
    localStorage.setItem("JobCode", selectedRow.JobCode);
    localStorage.setItem("CompanyID", selectedRow.CompanyId);
    localStorage.setItem("showMessage", 'true');
    this.objRouter.navigate(['/login']);
  }

  btnApply_Click(selectedRow: any) {
    debugger;
    localStorage.setItem("JobCode", selectedRow.JobCode);
    localStorage.setItem("CompanyID", selectedRow.CompanyId);
    localStorage.setItem("showMessage", 'true');
    this.objRouter.navigate(['/login']);
  }

}
