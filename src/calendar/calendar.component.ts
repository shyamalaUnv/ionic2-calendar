import 'hammerjs';
import 'hammer-timejs';
import * as moment from 'moment';
import 'moment/locale/vi';
import 'moment/locale/lo';
import 'moment/locale/id';
import 'moment/locale/km'; // cambodia
import 'moment/locale/th';
import 'moment/locale/en-gb';

import {
  Component, OnInit, OnDestroy, Output, Input, OnChanges,
  ElementRef, ViewChild, EventEmitter, SimpleChange, ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'calendar',
  styleUrls: ['./calendar.component.scss'],
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnChanges, OnInit, OnDestroy {
  month: Array<number>;
  current: Date;
  today: Date;
  previousDay: any;
  selectedDay: any;
  i :number = 0;
  selDate : Date = new Date()
  wHeads: string[];

  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  @Output() onSelectedDate = new EventEmitter();
  @Input('acceptPast') acceptPast: boolean = true;
  @Input('selectedDay') setDay: Date;
  /**
   * Component constructor
   */
  public constructor() {
    this.wHeads = moment.weekdaysMin();
    this.today = new Date();
    this.current = new Date();
    this.current.setTime(this.today.getTime());
    this.monthRender(this.today.toISOString());
  }

  /**
   * 
   * @param changes 
   */
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    // Todo: update necessary info
    if (changes['setDay'] && this.setDay) {
      this.month.forEach((w: any) => {
        w.forEach((d: any) => {
          if (d.day.getDate() === this.setDay.getDate()
            && d.day.getMonth() === this.setDay.getMonth()
            && d.day.getFullYear() === this.setDay.getFullYear()) {
            d.selected = true;
            this.selectedDay = d;
            this.previousDay = d;
            if (changes.setDate) {
              if (changes.setDate.previousValue) {
                this.previousDay = changes.setDate.previousValue;
              }
            }
          } else {
            d.selected = false;
          }
        });
      });
    }
  }

  /**
   * Implements onInit event handler.
   */
  public ngOnInit(): void {
    console.log('ngOnInit');
    if (this.setDay) {
      this.month.forEach((w: any) => {
        w.forEach((d: any) => {
          if (d.day.getDate() === this.setDay.getDate()
            && d.day.getMonth() === this.setDay.getMonth()
            && d.day.getFullYear() === this.setDay.getFullYear()) {
            d.selected = true;
            this.selectedDay = d;
            this.previousDay = d;
          }
        });
      });
    }
  }

  /**
   * Render month week and day by date string value
   * @param {string} date 
   */
  monthRender(date: string) {
    var month = new Array();
    var firstDay = new Date(date);
    firstDay.setDate(1);
    var firstDayNextMonth = new Date();
    if (firstDay.getMonth() < 11) {
      firstDayNextMonth.setDate(1);
      firstDayNextMonth.setMonth(firstDay.getMonth() + 1);
    } else {
      firstDayNextMonth.setDate(1);
      firstDayNextMonth.setMonth(0);
    }
    var lastDay = new Date(date);
    lastDay.setTime(firstDayNextMonth.getTime() - (1 * 24 * 3600000));
    var iw = firstDay.getDay();
    var dayCount = 0;
    // build week in month
    for (let i = 0; i <= 5; i++) {
      var weekDay = new Array();
      for (var j = 0; j <= 6; j++) {
        if (i === 0 && j < iw) {
          // previous month date
          var day = new Date();
          day.setTime(firstDay.getTime() - ((iw - j) * 24 * 3600000));
          weekDay.push({ day: day });
        } else {
          if (dayCount < lastDay.getDate()) {
            var day = new Date();
            day.setTime(firstDay.getTime() + (dayCount * 24 * 3600000));
            weekDay.push({ day: day, selected: false });
            dayCount++;
          } else {
            // next month date
            dayCount++;
            var day = new Date();
            day.setTime(lastDay.getTime()
              + ((dayCount - lastDay.getDate()) * 24 * 3600000));
            weekDay.push({ day: day });
          }
        }
      }
      month.push(weekDay);
    }
    this.month = month;
    if (date) {
      this.selDate = new Date(date);
      this.month.forEach((w: any) => {
        w.forEach((d: any) => {
          if (d.day.getDate() === this.selDate.getDate()
            && d.day.getMonth() === this.selDate.getMonth()
            && d.day.getFullYear() === this.selDate.getFullYear()) {
            d.selected = true;
            this.selectedDay = d;
            this.previousDay = d;
          }
        });
      });
      this.findMonth(this.selDate);
    }
  }


  public findMonth(date: Date) {
   this.i= this.i + 1;
   if(this.i == 1){
     let momentDate = moment(date);
     var selMonth =  momentDate.format('MMMM - YYYY').toUpperCase();
   }
   else{
     date = this.selDate;
   let momentDate = moment(date);
   return momentDate.format('MMMM - YYYY').toUpperCase();
   }
 }
  /**
   * Implements ngOnDestroy event handler.
   */
  public ngOnDestroy() {
    //  
  }

  /**
   * Handler user swipe event
   * @param {SWIPE_ACTION} action 
   */
  public swipe(action = this.SWIPE_ACTION.RIGHT) {
    let slider = document.getElementById('slider');
    slider.classList.add('onswipe');
    // swipe right, next avatar
    if (action === this.SWIPE_ACTION.RIGHT) {
      this.previousMonth();
    }

    // swipe left, previous avatar
    if (action === this.SWIPE_ACTION.LEFT) {
      this.nextMonth();
    }
    setTimeout(() => {
      slider.classList.remove('onswipe');
    }, 300);
  }

  /**
   * Check when the day is today
   * @param {any} day 
   */
  isToday(day: any) {
    if (!day.selected) {
      if (this.today.getDate() === day.day.getDate()
        && this.today.getMonth() === day.day.getMonth()) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * Check whether the day not in current monty 
   * @param {any} day 
   */
  diffMonth(day: any) {
    if (this.current.getMonth() !== day.day.getMonth()) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Render previous month from current month
   */
  previousMonth() {
    let previous = new Date();
    let currentMonth = this.current.getMonth();
    if (currentMonth >= 1) {
      previous.setDate(15);
      previous.setMonth(currentMonth - 1);
      previous.setFullYear(this.current.getFullYear());
    } else {
      previous.setDate(15);
      previous.setMonth(11);
      previous.setFullYear(this.current.getFullYear() - 1);
    }
    this.current = new Date();
    this.current.setTime(previous.getTime());
    this.monthRender(this.current.toISOString());
  }

  /**
   * Render next month from current month
   */
  nextMonth() {
    let next = new Date();
    let currentMonth = this.current.getMonth();
    if (currentMonth < 11) {
      next.setDate(15);
      next.setMonth(currentMonth + 1);
      next.setFullYear(this.current.getFullYear());
    } else {
      next.setDate(15);
      next.setMonth(0);
      next.setFullYear(this.current.getFullYear() + 1);
    }
    this.current = new Date();
    this.current.setTime(next.getTime());
    this.monthRender(this.current.toISOString());
  }

  /**
   * Handler user select day event
   */
  public selectDay(day: any) {
    let flgAllowChange: boolean = false;
    if (!this.acceptPast) {
      if ((this.today.getDate() <= day.day.getDate()
        && this.today.getMonth() === day.day.getMonth()
        && this.today.getFullYear() === day.day.getFullYear())
        ||
        (this.today.getMonth() < day.day.getMonth()
          && this.today.getFullYear() === day.day.getFullYear())
        || (this.today.getFullYear() < day.day.getFullYear())) {
        flgAllowChange = true;
      }
    } else {
      flgAllowChange = true;
    }
    if (flgAllowChange) {
      day.selected = true;
      this.selectedDay = day;
      if (this.previousDay) {
        if (this.previousDay !== this.selectedDay) {
          this.previousDay.selected = false;
        }
      }
      this.previousDay = day;
      this.onSelectedDate.emit({ selectedDate: day });
    }
  }

  
}