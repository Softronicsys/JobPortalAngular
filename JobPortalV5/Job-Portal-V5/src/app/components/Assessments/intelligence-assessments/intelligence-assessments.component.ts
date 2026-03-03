import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Constants } from '../../../Helper/Constant';
import * as $ from 'jquery';
import { AppConfigService } from '@app/Service/app-config.service';

@Component({
  selector: 'app-intelligence-assessments',
  templateUrl: './intelligence-assessments.component.html',
  styleUrls: ['./intelligence-assessments.component.css']
})
export class IntelligenceAssessmentsComponent implements OnInit {

  IsUIFIXED: boolean = false;
  ShowPrAcEnd: boolean = false;
  FactoryPracticeQuestionsLsit: any;
  IntelligenceAssessmentQuestionsList: any;
  askQuestion: string;
  _SECTION_ID: any = 1;
  PracQuestion: any = 0;
  QuestionCount: any = 0;
  _SelectedOption: string = "";
  SelectedOption: string = "";
  RowDataOptions: any = "";
  afid: any = 0;
  _AFID: any = 0;
  IS_FACQUES_FIX: boolean = false;
  //Sec1-Start
  SelectedOption1: string = "";
  SelectedOption2: string = "";
  //Sec1-END

  //Sec3 Opt-Start
  Sec3SelectedOption1: string = "";
  Sec3SelectedOption2: string = "";
  Sec3SelectedOption3: string = "";
  //Sec3 Opt-END
  IsSec3PracEnd: boolean = false;
  ShowPrAc: boolean = true;
  IsUIFIXEDSec4: boolean = false;
  ISLUI: boolean = false;
  _IsPracToHide: boolean = true;
  _UIFixCount: any = 0;
  IsSec4PracEnd: boolean = false;
  constructor(private objRouter: Router, private http: HttpClient, private _config: AppConfigService) { }
  bg: any;
  clr: any;
  border: any;

  ngOnInit() {
    this.StartUp();


  }

  StartUp() {

    this.GetFixPracticeQuestions();
    this.LoadIntelliQuestionsSectionWise(this._SECTION_ID);

  }
  btnClose_Click() {

    this.objRouter.navigate(["dashboard", { showAssessment: true }]);
  }

  //for showing text//
  myFunction1() {
    var x = document.getElementById("myDIV1");
    debugger;

    document.getElementById("demo").style.background = "white";
    document.getElementById("demo").style.color = "#007FFF";
    document.getElementById("demo").style.borderColor = "#007FFF";

    x.innerHTML = this.FactoryPracticeQuestionsLsit[this.PracQuestion].CorrectAnswer + " is the correct answer!";
    x.style.color = "green";
    document.getElementById("myDIV1").style.visibility = "visible";


  }

  myFunction() {
    //if (this.PracQuestion <= 4) {
    // var y = document.getElementById("myDIV1");
    //  y.style.color = "green";
    //  y.innerHTML = this.FactoryPracticeQuestionsLsit[this.PracQuestion].CorrectAnswer + " is the correct answer!";
    //  document.getElementById("myDIV1").style.visibility = "visible";
    //}
    //else {
    //  this.SelectedOption = this.SelectedOption1;
    //}


    var y = document.getElementById("myDIV1");
    y.style.color = "green";
    y.innerHTML = this.FactoryPracticeQuestionsLsit[this.PracQuestion].CorrectAnswer + " is the correct answer!";
    document.getElementById("myDIV1").style.visibility = "visible";
    this.SelectedOption = this.SelectedOption1;



  }

  myFunction2() {

    //if (this.PracQuestion <= 4) {
    //  document.getElementById("demo").style.background = "red";
    //  document.getElementById("demo").style.color = "white";
    //  document.getElementById("demo").style.borderColor = "red";
    //}
    //else
    //{
    //  document.getElementById("demo").style.background = "white";
    //  document.getElementById("demo").style.color = "#007FFF";
    //  document.getElementById("demo").style.borderColor = "#007FFF";
    //  this.SelectedOption = "";
    //  this.SelectedOption = this.SelectedOption2;
    //}


    document.getElementById("demo").style.background = "red";
    document.getElementById("demo").style.color = "white";
    document.getElementById("demo").style.borderColor = "red";


    document.getElementById("demo").style.background = "white";
    document.getElementById("demo").style.color = "#007FFF";
    document.getElementById("demo").style.borderColor = "#007FFF";
    this.SelectedOption = "";
    this.SelectedOption = this.SelectedOption2;



  }

  GetFixPracticeQuestions() {
    let RequestObject = {

      AFId: "0",
      ASId: "0",
      QId: "1",
      SectionId: "0",
      Question_English: "string",
      Question_Arabic: "string",
      ASRId: "0",
      QuestionImage: "string",
      options: "string",

    };
    let PracticeQuestions = this._config.environment.baseUrl + Constants.fixPracticeQuestionsList;
    this.http.post(PracticeQuestions, RequestObject)
      // this.http.post("https://jobportalapi.azurewebsites.net/GetPersonalityAssessments", RequestObject)
      .subscribe((response: any) => {
        debugger;
        this.FactoryPracticeQuestionsLsit = response;
        this.askQuestion = this.FactoryPracticeQuestionsLsit[this.PracQuestion].Question_English;
        this.SelectedOption1 = this.FactoryPracticeQuestionsLsit[this.PracQuestion].options.split("|")[0];
        this.SelectedOption2 = this.FactoryPracticeQuestionsLsit[this.PracQuestion].options.split("|")[1];
        this.PracQuestion++;

        if (!this.IS_FACQUES_FIX) {
          var PRAC_FIXQuestionCount;
          for (PRAC_FIXQuestionCount = 10; PRAC_FIXQuestionCount <= 24; PRAC_FIXQuestionCount++) {
            this.FactoryPracticeQuestionsLsit[PRAC_FIXQuestionCount].Question_English = this.FactoryPracticeQuestionsLsit[PRAC_FIXQuestionCount].options;
          }
          this.IS_FACQUES_FIX = true;
        }

      }, (error: any) => {
        console.log(error);
      });




  }
  LoadPracticeQuestion() //Next 5 in JP
  {
    if (this.SelectedOption == "") {
      alert("No Option");
      return;
    }

    if (this._SECTION_ID <= 2) {
      this.showSec3();
    }

    if (this.QuestionCount < this.IntelligenceAssessmentQuestionsList.length) {

      if (this.ShowPrAc) {

        this.askQuestion = this.FactoryPracticeQuestionsLsit[this.PracQuestion].Question_English;


        this.SelectedOption1 = this.FactoryPracticeQuestionsLsit[this.PracQuestion].options.split("|")[0];
        this.SelectedOption2 = this.FactoryPracticeQuestionsLsit[this.PracQuestion].options.split("|")[1];

        if (this._SECTION_ID >= 3) {
          this.Sec3SelectedOption1 = this.FactoryPracticeQuestionsLsit[this.PracQuestion].options.split("|")[0];
          this.Sec3SelectedOption2 = this.FactoryPracticeQuestionsLsit[this.PracQuestion].options.split("|")[1];
          this.Sec3SelectedOption3 = this.FactoryPracticeQuestionsLsit[this.PracQuestion].options.split("|")[2];
        }

        this.PracQuestion++;
        this.SelectedOption = "";
        if (this.PracQuestion == 5 && this._SECTION_ID == 1 || this.PracQuestion == 10 && this._SECTION_ID == 2 || this.PracQuestion == 15 && this._SECTION_ID == 3 || this.PracQuestion == 20 && this._SECTION_ID == 4) {
          this.ShowPrAc = false;


        }
      }

      else if (!this.ShowPrAc) {
        this.FixSec3();
        if (this._SECTION_ID == 2 && this.QuestionCount == 0) {
          this.FixSec2();

        }

        if (this._SECTION_ID <= 2) {
          this.askQuestion = this.IntelligenceAssessmentQuestionsList[this.QuestionCount].Question_English;
          this.SelectedOption1 = this.IntelligenceAssessmentQuestionsList[this.QuestionCount].options.split("|")[0].split("&")[1];
          this.SelectedOption2 = this.IntelligenceAssessmentQuestionsList[this.QuestionCount].options.split("|")[1].split("&")[0];
        }

        if (this._SECTION_ID > 2) {
          this.askQuestion = this.IntelligenceAssessmentQuestionsList[this.QuestionCount].Question_English = this.IntelligenceAssessmentQuestionsList[this.QuestionCount].options;
          this.Sec3SelectedOption1 = this.IntelligenceAssessmentQuestionsList[this.QuestionCount].options.split("&")[1].split("|")[0];
          this.Sec3SelectedOption2 = this.IntelligenceAssessmentQuestionsList[this.QuestionCount].options.split("&")[1].split("|")[1];
          this.Sec3SelectedOption3 = this.IntelligenceAssessmentQuestionsList[this.QuestionCount].options.split("&")[1].split("|")[2];
        }
        
        this.RowDataOptions = this.IntelligenceAssessmentQuestionsList[this.QuestionCount].options;
        this.afid = this.RowDataOptions.split("|")[0].split("&")[0];
        this._AFID = this.afid;
        this._SelectedOption = this.SelectedOption;

        //UPDATE START
        if (this._SelectedOption == "") {
          return;
        }
        else {
          this.UpdateResponse(1);
          this.SelectedOption = "";
          this.askQuestion = this.IntelligenceAssessmentQuestionsList[this.QuestionCount].Question_English;
          this.QuestionCount++;


        }
        //UPDATE END

        //SKIP-START
        if (this.QuestionCount == 2) {
          this.QuestionCount = 94;
        }
        //SKIP-START
      }



    }
    else {
      this._NEXT_SECTION();

    }

  }
  _NEXT_SECTION() {
    this._SECTION_ID++;
    this._SelectedOption = this.SelectedOption;
    this.UpdateResponse(this._SECTION_ID);
    this.ShowPrAc = true;
    this.SelectedOption = "";
    this.QuestionCount = 0;
    this.askQuestion = this.FactoryPracticeQuestionsLsit[this.PracQuestion].Question_English;
    //FOR SEC 3 - MULTI OPTIONS
    if (this._SECTION_ID >= 3) {
      this.Sec3SelectedOption1 = this.FactoryPracticeQuestionsLsit[this.PracQuestion].options.split("|")[0];
      this.Sec3SelectedOption2 = this.FactoryPracticeQuestionsLsit[this.PracQuestion].options.split("|")[1];
      this.Sec3SelectedOption3 = this.FactoryPracticeQuestionsLsit[this.PracQuestion].options.split("|")[2];
    }

    //FOR SEC 3 - MULTI OPTIONS END
    this.IsUIFIXED = false;
    this.FixSec3();
    this.PracQuestion++;
    this.LoadIntelliQuestionsSectionWise(this._SECTION_ID);

  }
  LoadIntelliQuestionsSectionWise(SectionId) {
    let RequestObject = {

      AFId: "0",
      ASId: "0",
      QId: "0",
      SectionId: SectionId,
      Question_English: "",
      Question_Arabic: "",
      ASRId: "0",
      QuestionImage: "",
      options: "",

    };
    let Questions = this._config.environment.baseUrl + Constants.GetIntelligenceQuestionBULK;
    this.http.post(Questions, RequestObject)
      // this.http.post("https://jobportalapi.azurewebsites.net/GetIntelligenceQuestionBULK", RequestObject)
      .subscribe((response: any) => {
        debugger;
        this.IntelligenceAssessmentQuestionsList = response;
      }, (error: any) => {
        console.log(error);
      });



  }
  UpdateResponse(sectionId) {

    let RequestObject = {

      AppId: "12",
      SectionId: 1,
      command: "10",
      Selected: this._SelectedOption + "|" + this._AFID,//"Rachel|435",
      RTime: "7 ",
      Asid: "5",


    };
    let PracticeQuestions = this._config.environment.baseUrl + Constants.GetPracticeQuestionsListIntelligence;
    this.http.post(PracticeQuestions, RequestObject)
      .subscribe((response: any) => {
        debugger;


      }, (error: any) => {
        console.log(error);
      });
    this._SelectedOption = "";
  }



  ShowPrac() {
    this._UIFixCount++;
    if (this._UIFixCount == 1) {
      document.getElementById("menu3").style.display = "none";
    }
    else {
      document.getElementById("menu3").style.display = null;
    }
  }
  HidewPrac() {

    if (!this._IsPracToHide) {

      if (this._SECTION_ID == 1) {
        document.getElementById("menu3").style.display = "contents";
      } //sec1

      if (this._SECTION_ID == 2) {
        document.getElementById("menu5").style.display = "none";
        document.getElementById("menu6").style.display = null;
        document.getElementById("menu3").style.display = "none";
        this._IsPracToHide = false;
      }

      if (this._SECTION_ID == 3) {
        document.getElementById("menu5").style.display = "none";
        document.getElementById("SEC3").style.display = "contents";
        this._IsPracToHide = false;
      }

      if (this._SECTION_ID == 4) {
        document.getElementById("menu5").style.display = "none";
        document.getElementById("SEC4").style.display = "contents";
        this._IsPracToHide = false;
      }

    }

    if (this._IsPracToHide) {

      if (this._SECTION_ID == 1) {
        document.getElementById("menu5").style.display = "none";
        document.getElementById("menu3").style.display = "block";
      } //SEC1


      if (this._SECTION_ID == 2) {
        document.getElementById("menu5").style.display = "none";
        document.getElementById("menu6").style.display = "block";
        document.getElementById("menu3").style.display = "none";
      }


    }

  }
  FixSec3() {

    
     if (!this.IsUIFIXED) {
        this.ShowPrAcEnd = true;
        document.getElementById("menu3").style.display = "none";
        this.IsUIFIXED = true;
      }
   

    if (this._SECTION_ID == 3 && this.PracQuestion < 15) {
      document.getElementById("menu6").style.display = "none";
      document.getElementById("SEC3Intro").style.display = "contents";
    }

    if (this._SECTION_ID == 4 && !this.IsUIFIXEDSec4 )
    {
      document.getElementById("SEC3").style.display = "none";
      document.getElementById("SEC4Intro").style.display = "contents";
      this.IsUIFIXEDSec4 = true;
    }

    if (this._SECTION_ID == 4 && this.PracQuestion == 20 && !this.IsSec4PracEnd) {
      document.getElementById("SEC4Intro").style.display = "none";
      document.getElementById("SEC4").style.display = "none";
      document.getElementById("menu5").style.display = "contents";
      this.IsSec3PracEnd = true;
      this.IsSec4PracEnd = true;
    }

    if (this._SECTION_ID == 5 && this.PracQuestion == 20)
    {
      document.getElementById("SEC4").style.display = "none";
      document.getElementById("SEC5Intro").style.display = "contents";
      
    }

    else

      if (!this.IsSec3PracEnd) {


     if (this._SECTION_ID == 3 && this.PracQuestion >= 15) {
          document.getElementById("SEC3Intro").style.display = "none";
          document.getElementById("SEC3").style.display = "none";
          document.getElementById("menu5").style.display = "contents";
          this.IsSec3PracEnd = true;
        }


   


      }

  }
  showSec3() {
    document.getElementById("menu3").style.display = null;

  }
  FixSec2() {

    if (this._IsPracToHide) {
      document.getElementById("menu5").style.display = "block";
      document.getElementById("menu6").style.display = "none";
      this._IsPracToHide = false;
    }
  }
  SetAnswerSectionWise(Sec, Op) {
    this.SelectedOption = Op;
  }
  StartSec3() {
    document.getElementById("SEC3Intro").style.display = "none";
    document.getElementById("SEC3").style.display = "contents";

  }

  startSec4()
  {
    document.getElementById("SEC4Intro").style.display = "none";
    document.getElementById("SEC4").style.display = "contents";
  }

  startSec5() {
    document.getElementById("SEC5Intro").style.display = "none";
    document.getElementById("Sec5").style.display = "contents";
  }
}
