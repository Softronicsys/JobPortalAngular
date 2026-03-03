import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfigService } from '@app/Service/app-config.service';
import { Constants } from '@app/Helper/Constant';
import { DataService } from '@app/Shared/Services/data.services';
import { GetCompanyParameter } from '@app/Service/CompanyParameter.service'
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable()

export class UpdateProfileService {

    public LastProfileUpdateValue: string = "";
    public ProfilePercentage: string = "";
    public IsGridStyle: boolean = true;

} 

@Injectable()
export class AssessmentService {

    constructor(private dataService: DataService, private CompanyIdService: GetCompanyParameter,
        private spinner: NgxSpinnerService, private _config: AppConfigService) { }

    public BehaveList = []
    public IntelligenceList = [];
    public EmotionalIntelligenceList = [];
    public assessCount: any;

    getAllAssessments() {
        let RequestObject = {
            AppId: localStorage.getItem('AppId'),
            Culture: Constants.Culture,
            Search: '',
            CompanyId: this.CompanyIdService.CompanyId
        };

        this.dataService.post(this._config.environment.baseUrl + 'getAllAssessments', RequestObject).subscribe(res => {
            console.log('Assessments : ', res);
            if (res) {

                this.BehaveList = (res.Behav !== null) ? res.Behav : [];
                //this.BehaveList = (res.Behav !== null) ? res.Behav : [];
                //this.BehvCount = (this.BehaveList.length <= 0) ? 0 : this.BehaveList.length;

                this.IntelligenceList = (res.Cap !== null) ? res.Cap : [];
                //this.CapCount = (this.IntelligenceList.length <= 0) ? 0 : this.IntelligenceList.length;

                this.EmotionalIntelligenceList = (res.Emo !== null) ? res.Emo : [];
                //this.EmoCount = (this.EmotionalIntelligenceList.length <= 0) ? 0 : this.EmotionalIntelligenceList.length;
            }
        })
    }

    
    getAssessmentTabCount() {

        //this.openSpinner();
        let obj = {
            AppId: localStorage.getItem('AppId'),
            Culture: 'en-GB',
            Search: '',
            CompanyId: this.CompanyIdService.CompanyId
        };

        this.dataService.post(this._config.environment.baseUrl + 'GetAssessmentCount', obj).subscribe(res => {
            this.assessCount = (res !== null || res !== undefined) ? res : 0;
        }, err => {
            this.assessCount = 0;
        })
    }

} 

