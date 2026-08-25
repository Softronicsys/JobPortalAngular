import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Component } from '@angular/core';
import { EventManager, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppConfigService } from '@app/Service/app-config.service';
import { DataService } from '@app/Shared/Services/data.services';
import { isNullOrUndefined } from 'util';
import { Constants } from '../app/Helper/Constant';
import { GetCompanyParameter } from '../app/Service/CompanyParameter.service';
import { ThemeColorService } from './Service/ThemeColor.service';
declare var $: any;


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {


    title = 'app';

    isHeaderHide: boolean = true;
    hideHomeButton: boolean = true;
    hideSignupButton: boolean = true;
    key;
    key1;
    message: any;
    IsValid: any;
    isTick: boolean = false;
    res: any;
    check: any;
    abc: any;

    constructor(private titleService:Title, public ClrThemeChng: ThemeColorService, public activatedRoute: ActivatedRoute, private _config: AppConfigService,
        private router: Router, private eventManager: EventManager, private objRouter: Router, private http: HttpClient,
        public CompanyIdService: GetCompanyParameter, private dataService: DataService) {
        this.onOffline();
        this.onOnline();
    //    this.displayHeaders();
     //   var aa = this.dataService.PassHeader();

        if (!isNullOrUndefined(localStorage.getItem("bankName"))) {
            this.objRouter.navigate(['/registration'])
        }

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                    this.isHeaderHide = this.activatedRoute.snapshot.children[0].data['hideHeader'];

                    let hideButtons: boolean = this.activatedRoute.snapshot.children[0].data['hideButtons'];
                    if (!isNullOrUndefined(hideButtons) && hideButtons === true) {
                        this.hideHomeButton = false;
                        this.hideSignupButton = true;
                    } else {
                        this.hideHomeButton = true;
                        this.hideSignupButton = false;
                    }

                    let hideButtons1: boolean = this.activatedRoute.snapshot.children[0].data['hideButtons1'];
                    if (!isNullOrUndefined(hideButtons1) && hideButtons1 === true) {
                        this.hideHomeButton = true;
                    } else {
                        this.hideHomeButton = false;
                    }

                    this.getCompanyParameter();
                    this.message = localStorage.getItem('ApplyJobMsg');
            }


        });



    }

    forChanges: any;
    breakcode: any;
    code: any;
    ThemeFontColor: string = "";
    DefaultFontColor: string = "";
    tickImage: string = "";

    displayHeaders() {
        let header = new HttpHeaders();
        header.append('abc', '22');

        
        console.log(header.get('abc'));
    }



    Color() {
        
        if (!isNullOrUndefined(this.ClrThemeChng.ChangeTheme)) {
            this.forChanges = this.ClrThemeChng.ChangeTheme;

            if (isNullOrUndefined(this.forChanges)) {
                this.DefaultFontColor = "#" + Constants.default;
                this.tickImage = "assets/images/" + Constants.default + "/tick.png";
            }
            else if (!isNullOrUndefined(this.forChanges)) {

              this.breakcode = this.forChanges.split('#');
              this.code = this.breakcode[1];
                this.ThemeFontColor = this.forChanges;
                this.tickImage = "assets/images/" + this.code + "/tick.png";
            }

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

              this.ClrThemeChng.ChangeTheme = response.ThemeColor;
              //console.log(response.ThemeColor);
                this.Color();

            })
    }

    getJobPortalConfigurationFF() {
      debugger;
      let RequestObject = {

        CompanyId: this.CompanyIdService.CompanyId,
      };
      let GetJobPortalConfiguration_FF = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration_FF;
      this.http.post(GetJobPortalConfiguration_FF, RequestObject, { headers: this.dataService.headers })
        // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration_FF")
        .subscribe((response: any) => {

          console.log(response.ThemeColor);
          if (response != null && response !== undefined) {

          this.ClrThemeChng.ChangeTheme = response.ThemeColorFF;

          this.Color();

          } else {
            console.log("No data received from the API");

            this.objRouter.navigate(['/page-not-found']);
          }
        }, (error) => {
          console.error("Error occurred while fetching job portal configuration:", error);
        });
    }

    isFF: boolean = false;


    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            this.isFF = params['isFF'] == '1' || params['isff'] == '1';

            console.log('isFF:', this.isFF);
        });

        if (this._config.environment.AppTitle) {
            this.titleService.setTitle(this._config.environment.AppTitle);
        }
        else {
            this.titleService.setTitle("Job Portal");
        }
    }

    getCompanyParameter() {
        debugger;

        let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;

        console.log('GetCompanyParameter URL:', getCompanyParameter);
        console.log('isFF before config call:', this.isFF);

        this.http.get(getCompanyParameter).subscribe((response: any) => {

            console.log('GetCompanyParameter response:', response);

            this.CompanyIdService.CompanyId = response.CompanyId;
            this.CompanyIdService.CompanyName = response.CompanyName;
            this.CompanyIdService.RedirectPath = response.RedirectPath;
            this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64 || response.CompanyLogo;
            this.CompanyIdService.VideoSize = response.VideoSize;

            if (this.isFF) {
                this.getJobPortalConfigurationFF();
            } else {
                this.getJobPortalConfiguration();
            }

        }, (error: any) => {
            console.error('GetCompanyParameter error:', error);
        });
    }

    //ngOnInit() {

    //  let hasQueryString: boolean = false;

    //  // Check if there are query parameters
    //  this.activatedRoute.queryParams.subscribe(params => {
    //    const currentUrl = this.activatedRoute.url;
    //    //console.log(currentUrl);
    //    hasQueryString = Object.keys(params).length > 0;
    //    //console.log('Has query string:', hasQueryString);
    //  });

    //  this.isFF = hasQueryString;

    //  //console.log(this.isFF);

    //  if (this._config.environment.AppTitle)
    //  {
    //    this.titleService.setTitle(this._config.environment.AppTitle);
    //  }
    //  else
    //  {
    //    this.titleService.setTitle("Job Portal");
    //  }
    //    //if (this.check == "true") {
    //    //    this.objRouter.navigate(['/MyProfile']);
    //    //}
    //    //else {

    //    //    setTimeout(() => {

    //    //        localStorage.removeItem("AppId");
    //    //        localStorage.removeItem("Email");
    //    //        localStorage.removeItem("UserName");

    //    //    }, 86400000000)
    //    //}


    //}

    removeMsg() {
        localStorage.removeItem('ApplyJobMsg');
        localStorage.removeItem('ApplicantApplyJob');
        localStorage.removeItem('IsValid');
    }

    GetFF_Value: boolean;
    // for CompanyID //

    //getCompanyParameter() {
    //  debugger;
    //   // var yahooo = this.dataService.headers;
    //  //  console.log("this.dataService", this.dataService.headers)
        
    //    let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;
    //    this.http.get(getCompanyParameter).subscribe((response: any) => {
            
    //        this.CompanyIdService.CompanyId = response.CompanyId;
    //        this.CompanyIdService.CompanyName = response.CompanyName;
    //        this.CompanyIdService.RedirectPath = response.RedirectPath;
    //        this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
    //        this.CompanyIdService.VideoSize = response.VideoSize;

    //     //   this.Color();

    //        //this.GetFF_Value = response.isFFEnable;

    //        //console.log(this.GetFF_Value)



    //        // Check if GetFF_Value is true
    //        if (this.isFF) {

    //          this.getJobPortalConfigurationFF();

    //        } else {
    //          this.getJobPortalConfiguration();
    //        }
           
    //        //this.getJobPortalConfiguration();

    //    });

    //}

    onOffline() {
        this.eventManager.addGlobalEventListener("window", 'offline', (e) => {
            $("#myModalInternetDis").modal("show");
        });
     
    };

    onOnline() {
        this.eventManager.addGlobalEventListener("window", 'online', (e) => {
            $('#myModalInternetDis').modal('hide');
        });
    };

}


  


