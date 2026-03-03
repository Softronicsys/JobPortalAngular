import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Constants } from '../../../../Helper/Constant';
import { DataService } from '../../../../Shared/Services/data.services';
import { isNullOrUndefined } from 'util';
import { ThemeColorService } from '../../../../Service/ThemeColor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetCompanyParameter } from '../../../../Service/CompanyParameter.service'
import { ToastrService } from 'ngx-toastr';
import { AssessmentService } from '@app/Service/UpdateProfile.service';
import { AppConfigService } from '@app/Service/app-config.service';
import { Labels } from '@app/Service/DatabaseLbl.service';

@Component({
    selector: 'app-assessment',
    templateUrl: './assessment.component.html',
    styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {

    BehaveList: Array<any> = new Array<any>();
    IntelligenceList: Array<any> = new Array<any>();
    EmotionalIntelligenceList: Array<any> = new Array<any>();
    BehvCount: any;
    CapCount: any;
    EmoCount: any;

    constructor(private Labels: Labels, private http: HttpClient, private dataService: DataService, public CompanyIdService: GetCompanyParameter,
        public ClrThemeChng: ThemeColorService, private spinner: NgxSpinnerService, private toasterService: ToastrService,
        private _config: AppConfigService, public assessService: AssessmentService) { }

    ngOnInit() {
        //this.GetAssessmentList_Behavioral();
        //this.GetAssessmentList_IntelligenceList();
        //this.GetAssessmentList_EmotionalIntelligenceList();
        this.getAllAssessments();
        this.getJobPortalConfiguration();
    }

    //GetAssessmentList_Behavioral() {

    //    let RequestObject = {
    //        AppId: localStorage.getItem('AppId'),
    //        Culture: Constants.Culture,
    //        Search: '',
    //        CompanyId: this.CompanyIdService.CompanyId
    //    };

    //    console.log('Behavioral Request: ', RequestObject);

    //    this.dataService.post(Constants.BaseURl + 'getBehaviourAssessments', RequestObject)
    //        .subscribe(res => {
    //            console.log('Behavioral : ', res);
    //            if (res !== null) {
    //                this.BehaveList = res;
    //            }
    //            this.BehvCount = (this.BehaveList.length <= 0) ? 0 : this.BehaveList.length;
    //        }, (error: any) => {
    //            console.log(error);
    //        });
    //}

    //GetAssessmentList_IntelligenceList() {
    //    let RequestObject = {
    //        AppId: localStorage.getItem('AppId'),
    //        Culture: Constants.Culture,
    //        Search: '',
    //        CompanyId: this.CompanyIdService.CompanyId
    //    };
    //    console.log('Capability Request: ', RequestObject);
    //    this.dataService.post(Constants.BaseURl + 'getCapabilityAssessments', RequestObject)
    //        .subscribe(res => {
    //            console.log('Capability : ', res);
    //            if (res != null) {
    //                this.IntelligenceList = res;
    //            }
    //            this.CapCount = (this.IntelligenceList.length <= 0) ? 0 : this.IntelligenceList.length;

    //        }, (error: any) => {
    //            console.log(error);
    //        });
    //}

    //GetAssessmentList_EmotionalIntelligenceList() {
    //    let RequestObject = {
    //        AppId: localStorage.getItem('AppId'),
    //        Culture: Constants.Culture,
    //        Search: '',
    //        CompanyId: this.CompanyIdService.CompanyId
    //    };
    //    console.log('Emotional Request: ', RequestObject);
    //    this.dataService.post(Constants.BaseURl + 'getEmoAssessments', RequestObject)
    //        .subscribe(res => {
    //            console.log('Emotional : ', res);
    //            if (res != null) {
    //                this.EmotionalIntelligenceList = res;
    //            }
    //            this.EmoCount = (this.EmotionalIntelligenceList.length <= 0) ? 0 : this.EmotionalIntelligenceList.length;
    //        }, (error: any) => {
    //            console.log(error);
    //        });
    //}


    // labels //

    BehavioralAssessment: string = "Behavioral Assessment";
    CapabilityAssessment: string = "Capability Assessment";
    CapabilityAssessments: string = "Capability Assessments";
    EmotionalIntelligenceAssessments: string = "Emotional Intelligence Assessment";
    lblSubmitBetween: string = "Submit Between";
    AssessmentStatus: string = "Assessment Status";
    Questionnaire: string = "Questionnaire";
    Assessments: string = "";
    lblApplicantPicture: string = "";
    Upload: string = "";
    NoData: string = "No data";


    getAssessmentLabels() {
        debugger;
        if (this.Labels.dashLabels == true) {
            this.BehavioralAssessment = this.Labels.BehavioralAssessment;
            this.CapabilityAssessment = this.Labels.CapabilityAssessment;
            this.CapabilityAssessments = this.Labels.CapabilityAssessments;
            this.EmotionalIntelligenceAssessments = this.Labels.EmotionalIntelligenceAssessments;
            this.lblSubmitBetween = this.Labels.lblSubmitBetween;
            this.AssessmentStatus = this.Labels.AssessmentStatus;
            this.Questionnaire = this.Labels.Questionnaire;
            this.Assessments = this.Labels.Assessments;
            this.lblApplicantPicture = this.Labels.lblApplicantPicture;
            this.Upload = this.Labels.Upload;
            this.NoData = this.Labels.Nodata;

        }
    }
     

    getAllAssessments() {
        let RequestObject = {
            AppId: localStorage.getItem('AppId'),
            Culture: Constants.Culture,
            Search: '',
            CompanyId: this.CompanyIdService.CompanyId
        };

        this.dataService.post(this._config.environment.baseUrl + 'getAllAssessments', RequestObject).subscribe(res => {
         //   console.log('Assessments : ', res);
            if (res) {
                this.assessService.BehaveList = (res.Behav !== null) ? res.Behav : [];
                this.BehvCount = (this.BehaveList.length <= 0) ? 0 : this.BehaveList.length;

                this.assessService.IntelligenceList = (res.Cap !== null) ? res.Cap : [];
                this.CapCount = (this.IntelligenceList.length <= 0) ? 0 : this.IntelligenceList.length;

                this.assessService.EmotionalIntelligenceList = (res.Emo !== null) ? res.Emo : [];
                this.EmoCount = (this.EmotionalIntelligenceList.length <= 0) ? 0 : this.EmotionalIntelligenceList.length;
            }
        })
    }

    startAss(data) {
     //   console.log('Data : ', data);

        //let host = 'localhost:4900/Authentication/'
        //let host = 'https://assessmentpeoplepartners.azurewebsites.net/Authentication/'

        //host = host + 'QQ/' + data.pathKey + '/' + btoa(Constants.Culture);

        //if (this.validationCheck(data)) {
        //    return;
        //}
        let host = this._config.environment.AssessmentURL + 'QQ/' + data.pathKey + '/' + btoa(Constants.Culture);

     //   console.log('URL : ', host);
        window.open(host);
    }

    validationCheck(data: any): boolean {

        if (data.Expired === 1) {
            this.toasterService.warning('This Assessment has been Expired', '', {
                positionClass: "toast-bottom-right",
            });
            return true;
        }

        if (data.Submitted === 1) {
            this.toasterService.warning('This Assessment has already been Submitted', '', {
                positionClass: "toast-bottom-right",
            });
            return true;
        }

        return false;
    }

    // for Theme Color// 

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

    ThemeFontColor: string = "";
    DefaultFontColor: string = "";
    BorderColor: string = "";
    DefaultBorderColor: string = "";

    forChanges: any;
    breakcode: any;
    code: any;

    Color() {
        debugger;
        this.forChanges = this.ClrThemeChng.ChangeTheme;
        this.breakcode = this.forChanges.split('#');
        this.code = this.breakcode[1];

        if (isNullOrUndefined(this.forChanges)) {
            this.DefaultFontColor = "#" + Constants.default;
            this.DefaultBorderColor = "1px solid #" + Constants.default;
        }
        else if (!isNullOrUndefined(this.forChanges)) {
            this.ThemeFontColor = this.forChanges;
            this.BorderColor = "1px solid" + this.forChanges;
        }
    }

    getJobPortalConfiguration() {

        debugger;
        let RequestObject = {
            CompanyId: this.CompanyIdService.CompanyId,
        };
        this.openSpinner();
        let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
        this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
            // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
            .subscribe((response: any) => {

                this.ClrThemeChng.ChangeTheme = response.ThemeColor;
                this.getAssessmentLabels();
                this.Color();
                this.HideSpinner();
            })
    }

}
