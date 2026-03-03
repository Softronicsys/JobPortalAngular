import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '@app/Service/app-config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private _config: AppConfigService) { }

  CompanyWebsite: string = "";
  FbUrl: string = "";
  InstaUrl: string = "";
  TwitterUrl: string = "";
  lblCopyRight: string = "© ";
  lblWebsiteLinkTest: string = "";

  IsFbUrl: boolean = true;
  IsInstaUrl: boolean = true;
  IsTwitterUrl: boolean = true;


  ngOnInit() {

    this.CompanyWebsite = this._config.environment.CompanyWebsite;
    this.FbUrl = this._config.environment.FacebookSocialLink;
    this.InstaUrl = this._config.environment.InstagramSocialLink;
    this.TwitterUrl = this._config.environment.TwitterSocialLink;

    this.lblCopyRight = this.lblCopyRight + (new Date()).getFullYear() + " Copyright";
    this.lblWebsiteLinkTest = this._config.environment.WebsiteLinkTest;

    if (this.FbUrl == "")
      this.IsFbUrl = false;

    if (this.InstaUrl == "")
      this.IsInstaUrl = false;

    if (this.TwitterUrl == "")
      this.IsTwitterUrl = false;
  }


}
