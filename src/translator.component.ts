///<reference path="../typings/index.d.ts"/>

import { Component, OnInit, Input } from "@angular/core";
import { Translator } from "./translator.service";

@Component({
  selector: 'wf-translate',
  template: '{{translation}}'
})
export class TranslatorComponent implements OnInit {
  @Input() public id: string;
  public translation: string = "";
  constructor (private translator: Translator) {}

  public ngOnInit () {
    this.translator.subscribe(this.id, (translation) => {
      this.translation = translation;
    });
  }
}
