import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../Helper/Constant';
import { ThemeColorService } from '../../Service/ThemeColor.service';
import { isNullOrUndefined } from 'util';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { GetCompanyParameter } from '../../Service/CompanyParameter.service';
import { AppConfigService } from '@app/Service/app-config.service';
import { DataService } from '@app/Shared/Services/data.services';


@Component({
  selector: 'app-generall-popup',
  templateUrl: './generall-popup.component.html',
  styleUrls: ['./generall-popup.component.css']
})
export class GenerallPopupComponent implements OnInit {

  

        @Input() MPRDETAIL: any;
        @Input() arrHeadings: any;
        @Input() forGridData: any;
        @Input() Object: any;
        @Input() ThemeFontColor: string;


        // for backgrouud color // 

        //ThemeFontColor: string = "";
        DefaultFontColor: string = "";
        BorderColor: string = "";
        DefaultBorderColor: string = "";
        IsDefaultTheme: boolean = true;


    constructor(private _config: AppConfigService, private http: HttpClient, public ClrThemeChng: ThemeColorService,
        public CompanyIdService: GetCompanyParameter, private dataService: DataService) { }


        forChanges: any;
        breakcode: any;
        code: any;



        Color() {
          //alert(this.MPRDETAIL)
             
            //this.breakcode = this.forChanges.split('#');
            //this.code = this.breakcode[1];
          
            if (isNullOrUndefined(this.ClrThemeChng.ChangeTheme)) {
              this.DefaultFontColor = "#" + Constants.default;
              this.DefaultBorderColor = "3px dotted #" + Constants.default;
              this.IsDefaultTheme = true;
            }
            else if (!isNullOrUndefined(this.ClrThemeChng.ChangeTheme)) {
              this.ThemeFontColor = this.forChanges;
              this.BorderColor = "1px solid " + this.forChanges;
              this.IsDefaultTheme = false;
            }
    
  }

  getJobPortalConfiguration() {


    let RequestObject = {

      CompanyId: this.CompanyIdService.CompanyId,
    };
    let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
    this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
      // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
      .subscribe((response: any) => {

        if (response != null) {
          if (response.ThemeColor != null || !isNullOrUndefined(response.ThemeColor))
            this.ClrThemeChng.ChangeTheme = response.ThemeColor;

          this.Color();
        } 
      })
  }

  getCompanyParameter() {
 
    debugger;
    let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID+ "&Culture=" + Constants.Culture;
    this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {

      if (response != null) {
        if (response.CompanyId != null || !isNullOrUndefined(response.CompanyId))
          this.CompanyIdService.CompanyId = response.CompanyId;
        if (response.CompanyName != null || !isNullOrUndefined(response.CompanyName))
          this.CompanyIdService.CompanyName = response.CompanyName;
        if (response.RedirectPath != null || !isNullOrUndefined(response.RedirectPath))
          this.CompanyIdService.RedirectPath = response.RedirectPath;
        if (response.CompanyLogoBase64 != null || !isNullOrUndefined(response.CompanyLogoBase64))
          this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
      } 
      this.getJobPortalConfiguration();
    });


  }


  ngOnInit() {
    this.ClrThemeChng.themeChanged.subscribe(x => {
      this.forChanges = x;
      this.Color();
    });
    //this.getCompanyParameter();    
    //this.getJobPortalConfiguration();
  }

}
