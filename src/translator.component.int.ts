import * as browser from '@angular/platform-server/testing';

import { Component } from '@angular/core';
import { async } from '@angular/core/testing';
import { TranslatorComponent } from './translator.component';
import { Translator } from './translator.service';

@Component({
  selector: 'test',
  template: '<wf-translator id="myId"></wf-translator>',
  directives: [ TranslatorComponent ]
})
class TestComponent {}

describe("A translator component", () => {
  let translatorMock: any;

  beforeEach(() => {
    translatorMock = {
      subscribe: sinon.stub()
    };
    translatorMock.subscribe.withArgs("myId").yields("translation");

    TestBed.configureTestingModule({
      declarations: [
        TestComponent
      ],
      providers: [
        { provide: Translator, useValue: translatorMock }
      ]
    });
  });

  it('should show the correct translation', async(() => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.children[0].children[0].data).to.equal('translation');
  }));
});
