import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabStateService {
  private showLimitedTabs: boolean = false;

  setShowLimitedTabs(value: boolean) {
    this.showLimitedTabs = value;
  }

  getShowLimitedTabs(): boolean {
    return this.showLimitedTabs;
  }
}
