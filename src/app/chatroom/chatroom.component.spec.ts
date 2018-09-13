import { TestBed, async } from '@angular/core/testing';
import { ChatRoomComponent } from './chatroom.component';
import { SanitizeHtmlPipe } from '../pipes/sanitize.pipe';
import { FormsModule } from '@angular/forms';
import { SafeURLPipe } from '../pipes/safeurl.pipe';
import { ActivatedRouteStub, ActivatedRoute } from '../activated.router.stub';
import { Router } from '@angular/router';
import { EmojisComponent } from '../emojis/emojis.component';
import { EmojiService } from '../services/emoji.service';

describe('ChatRoomComponent', () => {
  let activatedRoute: ActivatedRouteStub;
  beforeEach(() => {
    // assign activated route and set parameters
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.setParamMap({ id: 'abcdef' });

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        ChatRoomComponent,
        SanitizeHtmlPipe,
        EmojisComponent,
        SafeURLPipe
      ],
      providers: [
        EmojiService,
        {
          provide: Router,
          useClass: class { navigate = jasmine.createSpy('navigate'); }
        },
        { provide: ActivatedRoute, useValue: { paramMap: activatedRoute.paramMap } }]
    }).compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(ChatRoomComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should try to reestablish connection 3 times ', async(() => {
    const fixture = TestBed.createComponent(ChatRoomComponent);
    const app = fixture.debugElement.componentInstance;
    app.isonline = true;
    fixture.detectChanges();
    setTimeout(() => expect(app.retry).toBeLessThanOrEqual(4), 4000);
  }));

  it('should call sendMessage', async(() => {
    const fixture = TestBed.createComponent(ChatRoomComponent);
    const app = fixture.debugElement.componentInstance;
    spyOn(app, 'sendMessage').and.returnValue(true);
    app.send();
    fixture.detectChanges();
    expect(app.sendMessage).toHaveBeenCalled();
  }));


  it('initialize should be Undefined', async(() => {
    const fixture = TestBed.createComponent(ChatRoomComponent);
    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(app.initialize).toBeUndefined();
  }));

  it('msg should be "" after message sent', async(() => {
    const fixture = TestBed.createComponent(ChatRoomComponent);
    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    app.msg = 'hi';
    spyOn(app.webSocket, 'send').and.returnValue(true);
    app.sendMessage('hi how are you');
    expect(app.msg).toBe('');
  }));

  it('updateChat should be called', async(() => {
    const fixture = TestBed.createComponent(ChatRoomComponent);
    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    const message = new MessageEvent('fd');
    app.updateChat(message);
    expect(app.msg).toBe('');
  }));

});
