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
import { DomSanitizer } from '@angular/platform-browser';
import { Labels } from '@app/Service/DatabaseLbl.service'
import { DataService } from '../../Shared/Services/data.services'

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {
   
   
  res: any;
   

  forChanges: any;
  breakcode: any;
  code: any;
  btnApplyNormalView: string = "Apply";
  BorderColor: string = "";
  DefaultBorderColor: string = "";
  BackgroundImage: string = "";
  ThemeFontColor: string = "";
  DefaultFontColor: string = "";
  btnLogin: string = "SIGN IN";
  btnSignUp: string = "SIGN UP";
  JID: string = "";
  CompanyId: any = "";
  GroupID: any = ""; 
  IsDefaultTheme: boolean = true;
  HomeImage: string = "";

  WrongUrl: boolean = true;
  check: string = "false";
  paramsvalue: any
  IsShowValidation: boolean = false;
  Link: string = "";

  constructor(public sanitizer: DomSanitizer, public activatedRoute: ActivatedRoute, private Labels: Labels, private _config: AppConfigService, private http: HttpClient, private spinner: NgxSpinnerService,
    private objRouter: Router, 
    public CompanyIdService: GetCompanyParameter, public ClrThemeChng: ThemeColorService, private dataService: DataService) {

    //params.get('JId'))
    this.activatedRoute.paramMap.subscribe(params => {

     
      //this.id = params.('id'); 
      //console.log("tewst" + this.activatedRoute.snapshot.paramMap.get("JId"));//params.get('JId'))
      this.JID = this.activatedRoute.snapshot.paramMap.get("JId");//params['JID'];
      this.CompanyId;// = params['CId'];  
      this.GroupID;// = params['GId'];

      

      var ConsoleVar;

      if (!isNullOrUndefined(this.JID))
        ConsoleVar = this.JID.split("-");

      if (!isNullOrUndefined(ConsoleVar))
      {
        this.JID = ConsoleVar[0] + "-" + ConsoleVar[1] + "-"+ConsoleVar[2]
        this.GroupID = ConsoleVar[3];
        this.CompanyId = ConsoleVar[4].split(",")[0];
      }


      //if (!isNullOrUndefined(params.g)) {
      //  this.key = params['g'];
      //  this.paramsvalue = this.key;
      //  //   this.obj = [];
      //  var Id = this.key
      //  var num = 0
      //  var IfExists = false
      //  var localValueTime = new Date();
      //  for (var i = 0; i < localStorage.length; i++) {
      //    if (localStorage.key(i) === this.key) {
      //      var abc = localStorage.key(i);
      //      //    this.res = localStorage.getItem(abc).split(',');
      //      var lenghtOfGroupId = localStorage.getItem(abc).split(',')[0].length;
      //      var lenghtOfCheck = localStorage.getItem(abc).split(',')[2].length;
      //      this.res = localStorage.getItem(abc).split(',')[0].slice(1, lenghtOfGroupId);
      //      if (this.res == Id) {
      //        IfExists = true;
      //        //      var lengthOfVal = localStorage.getItem(abc).split(',')[2].length == 6 ? 4 : 5;
      //        //  var check = localStorage.getItem(abc).split(',')[2].slice(0, lengthOfVal);
      //        this.check = localStorage.getItem(abc).split(',')[2].slice(0, lenghtOfCheck);
      //        this._config.environment.CompanyGroupID = localStorage.getItem(abc).split(',')[0].slice(1, lenghtOfGroupId);
      //        if (this.check == "true") {
      //          this.WrongUrl = false;
      //        }
      //        return;
      //      }
      //      num++;
      //    }
      //  }

      //  if (!IfExists) {
      //    var str = this.key + "," + this.CompanyIdService.CompanyId + "," + IfExists + ",,,,";
      //    //  this.obj.splice(num, 0, str);
      //    localStorage.setItem(Id, str);
      //    this._config.environment.CompanyGroupID = this.key;
      //  }

      //  //    this._config.environment.CompanyGroupID = localStorage.getItem('GroupId');
      //}
      //else if (isNullOrUndefined(params.g)) {
      //  debugger;
      //  //  Mateen Bhai  Amendment
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

      //  //      }
      //  if (localStorage.length < 0) {
      //    $("#myModalWrongURL").modal("toggle");
      //    this.WrongUrl = false;
      //  } 
      //}

    });

  }

  Color() {

    this.forChanges = this.ClrThemeChng.ChangeTheme;
 

    if (isNullOrUndefined(this.forChanges)) {
      this.DefaultFontColor = "#" + Constants.default;
      this.BackgroundImage = "assets/images/" + Constants.default + "/general.png";
      this.DefaultBorderColor = "1px solid #" + Constants.default;
      this.HomeImage = "assets/images/" + Constants.default + "/home.png";
      this.IsDefaultTheme = true;
    }
    else if (!isNullOrUndefined(this.forChanges)) {
      this.breakcode = this.forChanges.split('#');
      this.code = this.breakcode[1];
      this.ThemeFontColor = this.forChanges;
      this.BackgroundImage = "assets/images/" + this.code + "/general.png";
      this.BorderColor = "1px solid " + this.forChanges;
      this.HomeImage = "assets/images/" + this.code + "/home.png";
      this.IsDefaultTheme = false;
    }
    //  this.HideSpinner()
    //alert(this.ThemeFontColor)
  }
    

  getJobPortalConfiguration() {

    //alert(this.CompanyIdService.CompanyId)
    let RequestObject = {

      CompanyId: this.CompanyIdService.CompanyId,
    };
    let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
    this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
      // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
      .subscribe((response: any) => {

        if (response.ThemeColor != null || !isNullOrUndefined(response.ThemeColor)) {
          this.ClrThemeChng.ChangeTheme = response.ThemeColor;
          this.ClrThemeChng.themeChanged.emit(response.ThemeColor);
        } 
        this.Color();
        this.HideSpinner();

      })
  }

  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  async getCompanyParameter() {
    this.openSpinner();
    debugger;
    let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this.GroupID + "&Culture=" + Constants.Culture;
    await this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {

      //if (response.CompanyId == 0) {
      //  $("#myModalWrongURL").modal("toggle");
      // // this.WrongUrl = false;
      //  localStorage.removeItem(this._config.environment.CompanyGroupID);
      //  return;
      //}
      //this.CompanyIdService.CompanyId = response.CompanyId;
      //if (response.CompanyId != 0) {
      //  var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + this.check + ",,,,";
      //  localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
      //  localStorage.setItem("LastLoginId", response.CompanyId + "," + this._config.environment.CompanyGroupID)
      //}
   
      this.CompanyIdService.CompanyId = response.CompanyId;
      this.CompanyIdService.CompanyName = response.CompanyName;
      this.CompanyIdService.RedirectPath = response.RedirectPath;
      this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
      this.getJobPortalConfiguration();

    });


  }

  btnApply_Click() {
    debugger;
    this.IsShowValidation = true;
    localStorage.setItem("JobCode", this.JID);
    localStorage.setItem("CompanyID", this.CompanyId);
    localStorage.setItem("showMessage", 'true');


    //this.objRouter.navigate(['/login']);
  }

  msg: string = "";
  correctEmail: boolean = false

  marked: boolean = false;
  staySigned: boolean = false;
  key: any;
  bankName: any;
  bankName1: any;
     
  ngOnInit() {
    this.getCompanyParameter();
    //console.log("test" + this.activatedRoute.snapshot.paramMap.get("JId"));
    //this.param1 = this.route.snapshot.paramMap.get('param1');
     
    if (!isNullOrUndefined(this.JID) && !isNullOrUndefined(this.CompanyId)) {
      this.GetMPRDetail(this.JID, this.CompanyId)
    }    
  } 



  MPRDETAIL: any[];
  arrHeadings: any[] = [];
  arrJobsDetail: any[] = [];

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
  selectedRow: any;

  GetMPRDetail(JID: any, CompId: any) {

    console.log('MPR' + JID +"CompID:"+ CompId)
    //this.selectedRow = selectedRow;
    this.arrHeadings = [];
    const arrPanelHeadings: string[] = ["Work Experience", "Additional Requirement", "Incentive Package",
      "Other Benefit", "Salary Remarks", "Job Summary", "Accountabilities", "Responsibilities",
      "Extra Ordinary Work Condition"];
    this.selectedJobCode = JID;// selectedRow.JobCode;
    this.selectedCompanyId = CompId;//JIDselectedRow.CompanyId;
    let RequestObject = {

      MPRCode: JID,//selectedRow.JobCode,
      CompanyId: CompId,//selectedRow.CompanyId,
      Culture: Constants.Culture,
    }

    this.openSpinner();
    let getMPRDetail = this._config.environment.baseUrl + Constants.GetMPRDetail;
    this.http.post(getMPRDetail, RequestObject, { headers: this.dataService.headers })
      .subscribe((response: any) => {

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
            debugger;
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

            else if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "AcademicQualification".toLowerCase()) {
              this.forGridData.showAcademicQualifications = true;
              this.Object.academicQualifications = this.MPRDETAIL[i];
            }

            else if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Trainings".toLowerCase()) {
              this.forGridData.showTrainings = true;
              this.Object.trainings = this.MPRDETAIL[i];
            }

            else if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Certifications".toLowerCase()) {
              this.forGridData.showCertification = true;
              this.Object.certification = this.MPRDETAIL[i];

            }

            else if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Competencies".toLowerCase()) {
              this.forGridData.showCompetencies = true;
              this.Object.competencies = this.MPRDETAIL[i];

            }
          }

        }

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
}
