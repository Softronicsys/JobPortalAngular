import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*Components*/
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccountSuccessComponent } from './components/account-success/account-success.component';
import { LoginComponent } from './components/login/login.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PinCodeComponent } from './components/pin-code/pin-code.component';
import { BehavioralComponent } from './components/Assessments/behavioral/behavioral.component';
import { IntelligenceAssessmentsComponent } from './components/Assessments/intelligence-assessments/intelligence-assessments.component';
import { EmotionalComponent } from './components/Assessments/emotional/emotional.component';
import { GenerallPopupComponent } from './components/generall-popup/generall-popup.component';
import { Security } from './Guards/Security.Guard';
import { AccountActivationComponent } from './components/account-activation/account-activation.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { LinkedinLoginResponseComponent } from './components/linkedin-login-response/linkedin-login-response.component';
import { QuickSignupComponent } from './components/quick-signup/quick-signup.component';
import { AccountActivationFFComponent } from './components/account-activation-ff/account-activation-ff.component';
import { CtcOfferLetterViewComponent } from './components/dashboard/tabs/ctc-offer-letter-view/ctc-offer-letter-view.component';
import { AiScreeningScheduleComponent } from './components/ai-screening/schedule/ai-screening-schedule.component';
import { AiScreeningRoomComponent } from './components/ai-screening/room/ai-screening-room.component';


const appRoutes: Routes = [

    {
        path: 'AccountActivation',
        component: AccountActivationComponent,
        data: {
            hideHeader: true,
        },
    },
    {
      path: 'JobDetail/:JId',
      component: JobDetailComponent,
      data: {
        hideButtons1: true,
      }  
    },
    {
        path: 'generall-popup',
        component: GenerallPopupComponent
    },

    {
        path: '',
        component: HomeComponent,
        data: {
            hideButtons1: true,
        } 
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
      path: 'linkedInLogin',
      component: LinkedinLoginResponseComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        data: {
            hideButtons1: true,
        }
    },
    {
        path: 'registration/:regtype/:jobcode',
        component: SignupComponent
    },
    {
      path: 'registration',
      component: SignupComponent
    },
    {
        path: 'MyProfile',
        component: DashboardComponent,
        canActivate: [Security],
        data: {
            hideHeader: true,
        }
     
    },
    {
        path: 'ctc-offer-letter',
        component: CtcOfferLetterViewComponent,
        canActivate: [Security],
        data: {
            hideHeader: true,
        }
    },

    {
        path: 'account-success',
        component: AccountSuccessComponent,
        data: {
            hideHeader: true,
        },
    },    
    {
        path: 'forget-password',
        component: ForgetPasswordComponent,
    
    },
    {
        path: 'Change-Password',
        component: ChangePasswordComponent,
        
    },
    {
        path: 'behavioral',
        component: BehavioralComponent,
        data: {
            hideHeader: true
        },
        canActivate: [Security]
    },
    {
        path: 'emotional',
        component: EmotionalComponent,
        data: {
            hideHeader: true
        },
        canActivate: [Security]
    },
    {
        path: 'intelligence-assessments',
        component: IntelligenceAssessmentsComponent,
        data: {
            hideHeader: true
        },
        canActivate: [Security]
    },
    {
        path: 'pin/code',
        component: PinCodeComponent,
    },

    {
      path: 'quick-signup',
      component: QuickSignupComponent,
    },

    {
      path: 'account-activation-FF',
      component: AccountActivationFFComponent,
      data: {
        hideHeader: true
      },
    },

    /* AI screening - both reached from an emailed link with the token in the
       query string, and both deliberately OUTSIDE the Security guard: the
       applicant may click days later with no live portal session, so the token
       is the credential.

       Both header flags are set, and both are needed: app.component reads
       hideButtons to hide Sign up / Sign in, and hideButtons1 to hide Home.
       Neither page has a session behind it, so offering either is misleading -
       and on the interview room it is worse than misleading, since a stray
       click mid-recording navigates away from the sitting. */
    {
      path: 'ai-screening/schedule',
      component: AiScreeningScheduleComponent,
      data: { hideButtons: true, hideButtons1: true }
    },
    {
      path: 'ai-screening/interview',
      component: AiScreeningRoomComponent,
      data: { hideButtons: true, hideButtons1: true }
    },

    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }

