import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SanitizeHtmlPipe } from './pipes/sanitize.pipe';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule],
      declarations: [
        AppComponent,
        SanitizeHtmlPipe
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should try to reestablish connection 3 times ', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.isonline = true;
    fixture.detectChanges();
    setTimeout(() => expect(app.retry).toBeLessThanOrEqual(4), 4000);
  }));

  it('should call sendMessage', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    spyOn(app, 'sendMessage').and.returnValue(true);
    app.send();
    fixture.detectChanges();
    expect(app.sendMessage).toHaveBeenCalled();
  }));

  it('message() should call sendMessage', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const spy = spyOn(app, 'sendMessage').and.returnValue(true);
    app.message();
    fixture.detectChanges();
    expect(app.sendMessage).toHaveBeenCalled();
  }));

  it('message() should call sendMessage', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const spy = spyOn(app.webSocket, 'send').and.returnValue(true);
    app.isonline = true;
    app.sendMessage('hi');
    fixture.detectChanges();
    expect(app.webSocket.send).toHaveBeenCalled();
  }));
});
