import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent {
  // Declare variables to store data
  public someData: string | null = null;

  // Inject the platform identifier
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    // Check if we are in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Access localStorage safely
      this.someData = localStorage.getItem('someDataKey');
      console.log(this.someData); // Safe to use localStorage here
    } else {
      console.log('Running on the server side. No localStorage available.');
    }
  }
}
