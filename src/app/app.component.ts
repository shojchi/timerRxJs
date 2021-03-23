import {Component} from '@angular/core';
import {BehaviorSubject, fromEvent, NEVER, Subject, timer} from 'rxjs';
import {map, startWith, switchMap, takeUntil, takeWhile, buffer, filter, debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testTimer';

  destroy = new Subject<number>();
  timer = 0;
  current = 0;
  isStopped = false;
  isWait = false;
  rxjsTimer = timer(0, 1000);
  toggle = new BehaviorSubject(true);

     click = fromEvent(document, 'click');

     doubleClick = this.click
      .pipe(
        buffer(this.click.pipe(debounceTime(300))),
        map(clicks => clicks.length),
        filter(clicksLength => clicksLength >= 2)
      );

     doubleClickFunc(): void {
      this.doubleClick.subscribe(() => {
        if (this.isStopped) {
          this.wait();
        }
      });
    }

  start(): void {
    if (this.isStopped) {
      this.resetSubject();
    }
    this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe(val => this.timer = val);
    this.isStopped = true;
  }

  stop(): void {
    this.resetSubject();
    this.timer = 0;
    this.isStopped = false;
    this.isWait = false;
  }

  resetTime(): void {
    this.resetSubject();
    this.start();
    this.isWait = false;
  }

  resetSubject(): void {
    this.destroy.next();
    this.destroy.complete();
    this.destroy = new Subject<number>();
  }

  wait(): void {
    this.current = this.timer;
    this.resetSubject();
    this.isWait = true;
  }

  continue(): void {
    if (!this.isWait) {
      this.resetSubject();
    }

    const toNext = (t: number) => this.current + t;

    this.toggle.pipe(
      switchMap((running: boolean) => (running ? this.rxjsTimer : NEVER)),
      map(toNext),
      takeWhile(() => (!this.isWait || !this.isStopped))
    ) .pipe(startWith(this.current)).subscribe(x => this.timer = x);

    this.isWait = false;
  }
}
