import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

<<<<<<< HEAD
=======
export const ShowColumn1 =
  [


    // {
    //   Column: 'S.No',
    //   type: 'S.NO',
    //   Description: 'S.No',
    //   visible: true,
    //   readonly: false,
    // },
    {
      Column: 'ASNReqNum',
      type: 'Text',
      Description: 'ASn Request ID',
      visible: true,
      readonly: true,
    },

    {
      Column: 'DocumentName',
      type: 'Text',
      Description: 'Document Name',
      visible: true,
      readonly: true,
    },
    {
      Column: 'Type',
      type: 'Text',
      Description: 'Type',
      visible: true,
      readonly: true,
    },

    {
      Column: 'UploadedOn',
      type: 'Text',
      Description: 'Uploaded On',
      visible: true,
      readonly: true,
    },

    {
      Column: 'Action',
      type: 'Text',
      Description: 'Action',
    },

    {
      Column: 'QRCode',
      type: 'Text',
      Description: 'QR Code',
    }
    ,
  ]
  
>>>>>>> 469215cf1f4d3d8ee70ca8fbf48a21e1f94cb9ca
@Injectable({ providedIn: 'root' })
export class InactivityService {
  private lastActivityTime: number = Date.now();
  private readonly INACTIVE_LIMIT = 15 * 60 * 1000; // 15 min
  private readonly WARNING_TIME = 10 * 1000; // 10 sec
  private warningShown = false;
  private countdownTimer: any;
  private checkInterval: any;

  public warning$ = new Subject<number>();
  public logout$ = new Subject<void>();

  constructor(
    private ngZone: NgZone,
     private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  startTracking() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Restore last activity from localStorage if exists
    const storedTime = localStorage.getItem('lastActivityTime');
    if (storedTime) {
      this.lastActivityTime = parseInt(storedTime, 10);
    } else {
      localStorage.setItem('lastActivityTime', this.lastActivityTime.toString());
    }

    // Listen for user activity
    ['mousemove', 'keydown', 'click', 'touchstart'].forEach(evt =>
      window.addEventListener(evt, () => this.resetActivityTimer())
    );

    // Check inactivity every second
    this.ngZone.runOutsideAngular(() => {
      this.checkInterval = setInterval(() => {
           // ✅ Skip if on login page
        if (this.router.url.includes('/login')) {
          return;
        }
        const now = Date.now();
        const inactiveTime = now - this.lastActivityTime;

        if (!this.warningShown && inactiveTime >= this.INACTIVE_LIMIT) {
          this.showWarning();
        }
      }, 1000);
    });
  }

  private resetActivityTimer() {
    this.lastActivityTime = Date.now();
    localStorage.setItem('lastActivityTime', this.lastActivityTime.toString());
    if (this.warningShown) {
      this.hideWarning();
    }
  }

  private showWarning() {
    this.warningShown = true;
    let count = this.WARNING_TIME / 1000;
    this.warning$.next(count);

    this.countdownTimer = setInterval(() => {
      count--;
      this.warning$.next(count);
      if (count <= 0) {
        clearInterval(this.countdownTimer);
        this.logout$.next();
      }
    }, 1000);
  }

  private hideWarning() {
    this.warningShown = false;
    clearInterval(this.countdownTimer);
  }

  stopTracking() {
    clearInterval(this.checkInterval);
  }
}
