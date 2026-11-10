import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AiScreeningService, ScreeningMyStatus } from '@app/Service/ai-screening.service';

/*
 * The signed-in route into AI screening.
 *
 * The emailed links are unchanged and remain the primary way in. This is the
 * second door: an applicant who has signed into the portal - and who may well
 * have lost the email - lands here and is sent to whichever page matches where
 * they actually are.
 *
 * It holds no routing rules of its own. The server decides the stage, because
 * the questions it answers ("is this invite expired?", "has the room link run
 * out?") depend on times and statuses the browser should not be re-judging. A
 * stage this build does not recognise is shown as a message rather than being
 * guessed at.
 *
 * Unlike the two pages it forwards to, this one DOES require a session: there
 * is no token in the URL, so the portal login is the credential.
 */
@Component({
    selector: 'app-ai-screening-my',
    templateUrl: './ai-screening-my.component.html',
    styleUrls: ['./ai-screening-my.component.css']
})
export class AiScreeningMyComponent implements OnInit {

    /* 'loading' | 'message' - a successful lookup navigates away, so the only
       state this component ever renders is the one where it cannot. */
    state = 'loading';
    message = '';
    status: ScreeningMyStatus = null;

    constructor(private api: AiScreeningService, private router: Router) { }

    ngOnInit() {
        this.api.getMyScreening().subscribe(
            status => {
                this.status = status;

                if (status && status.Stage === 'Schedule' && status.Token) {
                    /* replaceUrl so Back does not bounce the applicant
                       straight back into this redirector. */
                    this.router.navigate(['/ai-screening/schedule'],
                        { queryParams: { token: status.Token }, replaceUrl: true });
                    return;
                }

                if (status && status.Stage === 'Interview' && status.Token) {
                    this.router.navigate(['/ai-screening/interview'],
                        { queryParams: { token: status.Token }, replaceUrl: true });
                    return;
                }

                /* None, Completed, Expired, or a stage added later. */
                this.state = 'message';
                this.message = (status && status.Message)
                    ? status.Message
                    : 'You have no AI interview to complete at the moment.';
            },
            err => {
                this.state = 'message';

                /* 401 means the session has gone, which is a different
                   problem from having no interview, and the applicant can
                   act on it. */
                this.message = (err && err.status === 401)
                    ? 'Please sign in again to see your AI interview.'
                    : 'We could not load your AI interview right now. Please try again shortly.';
            });
    }

    goToDashboard() {
        this.router.navigate(['/dashboard']);
    }
}
