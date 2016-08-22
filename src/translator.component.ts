///<reference path="../typings/index.d.ts"/>

import { Component, OnInit, Input } from "@angular/core";
import { Translator } from "./translator.service";

@Component({
  selector: 'wf-translator',
  template: '{{translation}}'
})
export class TranslatorComponent implements OnInit {
  /**
   * ID to use for translation.
   */
  @Input() public id: string;
  public translation: string = "";
  constructor (private translator: Translator) {}

  public ngOnInit () {
    this.translator.subscribe(this.id, (translation) => {
      this.translation = translation;
    });
  }
}
