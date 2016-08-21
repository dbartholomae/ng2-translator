# ng2-translator
[![NPM version](https://badge.fury.io/js/ng2-translator.svg)](https://npmjs.org/package/ng2-translator)
[![Build Status](https://travis-ci.org/dbartholomae/ng2-translator.svg?branch=master)](https://travis-ci.org/dbartholomae/ng2-translator)
[![Coverage Status](https://coveralls.io/repos/dbartholomae/ng2-translator/badge.svg?branch=master&service=github)](https://coveralls.io/github/dbartholomae/ng2-translator?branch=master)
[![Dependency Status](https://david-dm.org/dbartholomae/ng2-translator.svg?theme=shields.io)](https://david-dm.org/dbartholomae/ng2-translator)
[![devDependency Status](https://david-dm.org/dbartholomae/ng2-translator/dev-status.svg)](https://david-dm.org/dbartholomae/ng2-translator#info=devDependencies)
[![GitHub license](https://img.shields.io/github/license/dbartholomae/ng2-translator.svg)]()
[![Gitter](https://badges.gitter.im/dbartholomae/ng2-translator.svg)](https://gitter.im/dbartholomae/ng2-translator?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

**ng2-translator** is a simple translation service and directive that manages multiple languages

```typescript
import { Component } from '@angular/core';
import { Translator, TranslatorComponent } from 'ng2-translator';

@Component({
  selector: 'app',
  template: `
      <h2><wf-translate id="HEADER"></wf-translate></h2>
      <button (click)="changeLang('de')">In German, please!</button>
    `,
  directives: [TranslatorComponent],
  providers: [Translator]
})
export class AppComponent {
  constructor (private translator: Translator){}
 
  public changeLang(lang: string) {
    this.translator.setLanguage("de");
  }
  
  private initTranslator() {
    this.translator.setAvailableLanguages(["en", "de"]);
    this.translator.setTranslation("en", { HEADER: "Headline" });
    this.translator.setTranslation("de", { HEADER: "Überschrift" });
    this.translator.guessLanguage();
  }
}
```

## CDN

The module should be available via [npmcdn](https://npmcdn.com/) at
[https://npmcdn.com/ng2-translator](https://npmcdn.com/ng2-translator)

No guarantees for uptime or anything like that, though.

## API

The module can be required as a CommonJS module.
For usage details, read the [documentation](https://rawgit.com/dbartholomae/ng2-translator/master/doc/index.html).
