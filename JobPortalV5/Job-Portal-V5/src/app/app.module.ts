import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SanitizeHtmlPipe } from './Service/Sanitizer';


/*Services*/
import { UpdateProfileService } from './Service/UpdateProfile.service'
import { GetCompanyParameter } from './Service/CompanyParameter.service'
import { ThemeColorService } from './Service/ThemeColor.service'
import { AppConfigService } from './Service/app-config.service';
import { Labels } from './Service/DatabaseLbl.service';
import { BlockCopyPasteDirective } from './Service/block-copy-paste.directive'

import { ActivatedRouteSnapshot } from '@angular/router';


/*App Routing*/
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './Shared/shared.module';

/*Components*/
import { AppComponent } from './app.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { SideNavBarComponent } from './components/layout/side-nav-bar/side-nav-bar.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyJobsComponent } from './components/dashboard/tabs/my-jobs/my-jobs.component';
import { PersonalInfoComponent } from './components/dashboard/tabs/personal-info/personal-info.component';
import { ProfessionalInfoComponent } from './components/dashboard/tabs/professional-info/professional-info.component';
import { AssessmentComponent } from './components/dashboard/tabs/assessment/assessment.component';
import { AccountSuccessComponent } from './components/account-success/account-success.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PinCodeComponent } from './components/pin-code/pin-code.component';
import { BehavioralComponent } from './components/Assessments/behavioral/behavioral.component';
import { IntelligenceAssessmentsComponent } from './components/Assessments/intelligence-assessments/intelligence-assessments.component';
import { EmotionalComponent } from './components/Assessments/emotional/emotional.component';
import { GenerallPopupComponent } from './components/generall-popup/generall-popup.component';
import { Security } from './Guards/Security.Guard';
import { AccountActivationComponent } from './components/account-activation/account-activation.component';
import { AssessmentService } from '@app/Service/UpdateProfile.service';
import { ErrorHandler } from '@angular/core';
import { AppErrorHandler } from '@app/Service/appErrorHandler.service';
import { appErrorPopup } from '@app/Shared/appErrorPopup/appErrorPopup.component.ts';
import { ImageCompressService } from './Service/image-compress.service';
import { LinkedinLoginResponseComponent } from './components/linkedin-login-response/linkedin-login-response.component';
import { FooterComponent } from './components/footer/footer.component';
import { PersonalInformationNonCorporateComponent } from './components/dashboard/tabs/personal-information-non-corporate/personal-information-non-corporate.component';
import { ProfessionalInformationNonCorporateComponent } from './components/dashboard/tabs/professional-information-non-corporate/professional-information-non-corporate.component';
import { QuickSignupComponent } from './components/quick-signup/quick-signup.component';
import { AccountActivationFFComponent } from './components/account-activation-ff/account-activation-ff.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { ApplicantPackageComponent } from './components/dashboard/tabs/applicant-package/applicant-package.component';
import { CtcOfferLetterViewComponent } from './components/dashboard/tabs/ctc-offer-letter-view/ctc-offer-letter-view.component';


// import { SanitizeHtmlPipe } from '@app/Service/Sanitizer';

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  }
};


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavBarComponent,
    LoginComponent,
    SignupComponent,
    PageNotFoundComponent,
    HomeComponent,
    DashboardComponent,
    MyJobsComponent,
    PersonalInfoComponent,
    ProfessionalInfoComponent,
    AssessmentComponent,
    AccountSuccessComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent,
    PinCodeComponent,
    BehavioralComponent,
    IntelligenceAssessmentsComponent,
    EmotionalComponent,
    GenerallPopupComponent,
    AccountActivationComponent,
    JobDetailComponent,
    BlockCopyPasteDirective,
    SanitizeHtmlPipe,
    appErrorPopup,
    LinkedinLoginResponseComponent,
    FooterComponent,
    PersonalInformationNonCorporateComponent,
    ProfessionalInformationNonCorporateComponent,
    QuickSignupComponent,
    AccountActivationFFComponent,
    ChatboxComponent,
    ApplicantPackageComponent,
    CtcOfferLetterViewComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    NoopAnimationsModule,
    ToastrModule.forRoot(), // ToastrModule added
    SharedModule,
    NgxSpinnerModule,
    HttpModule,
    ImageCropperModule
  ],
  exports: [
    SanitizeHtmlPipe
  ],
  providers: [Security, UpdateProfileService, GetCompanyParameter, Labels,
    ThemeColorService, AppConfigService, AssessmentService, ImageCompressService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    }, { provide: ErrorHandler, useClass: AppErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule { }
