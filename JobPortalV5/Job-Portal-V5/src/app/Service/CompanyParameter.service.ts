import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
//import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
//import { Constants } from '../Helper/Constant';
//import { BehaviorSubject } from 'rxjs';


@Injectable()
export class GetCompanyParameter {


    public CompanyId: string = "";
    public CompanyName: string = "";
    public CompanyShortName: string = "";
    public RedirectPath: string = "";
    public CompanyLogoBase64: string = "";
    public PicSize: number;
    public VideoSize: number;
    public BaseCurrencyId: any;
    public ShowAppStatusAtjobportal: boolean;


   // SignedIn work for multiple companies handling //

    public AppId: any;
    public Email: any;
    public UserName: any;

    public IsLinkedInLogin: string;

} 
