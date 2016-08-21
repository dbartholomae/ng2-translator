/// <reference path="../node_modules/mocha-chai-helper/index.d.ts" />

import * as browser from '@angular/platform-server/testing';

import { async, TestBed } from '@angular/core/testing';
import { TranslatorComponent } from './translator.component';
import { Translator } from './translator.service';

TestBed.initTestEnvironment(
  browser.ServerTestingModule,
  browser.platformServerTesting()
);

// TODO: Create fake wrapping component to test whether the id is used correctly

describe("A translator component", () => {
  let translatorMock: any;

  beforeEach(() => {
    translatorMock = {
      subscribe: sinon.stub().yields("translation")
    };

    TestBed.configureTestingModule({
      declarations: [
        TranslatorComponent
      ],
      providers: [
        { provide: Translator, useValue: translatorMock }
      ]
    });
  });

  it('should do something', async(() => {
    const fixture = TestBed.createComponent(TranslatorComponent);
    // Detect changes as necessary
    fixture.detectChanges();
    // Access the element
    const element = fixture.nativeElement;
    expect(element.children[0].data).to.equal('translation');
  }));
});
