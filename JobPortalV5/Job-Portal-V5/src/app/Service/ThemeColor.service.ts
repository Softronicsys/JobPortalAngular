import { Injectable, EventEmitter  } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ThemeColorService {

  public ChangeTheme;
  public themeChanged = new EventEmitter<any>();

  public IsCvShow = new EventEmitter<any>();

  //public IsGridViewShow = new EventEmitter<boolean>();
} 
