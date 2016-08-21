///<reference path="../typings/index.d.ts"/>

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

export type translation = { [key: string]: string };

@Injectable()
///**
// * Allows to translate ids to texts in different languages. Consumers can subscribe to ids
// * and get called whenever the language changes.
// */
export class Translator {

  private availableLanguages: string[] = [];
  private currentLanguage: string;
  private translations: { [key: string]: translation } = {};
  private translationEmitter = new Subject<translation>();

  /**
   * Create a new translator.
   */
  constructor() {}

  /////////////////////
  // Public Methods //
  /////////////////////

  /**
   * Get the available languages.
   * @returns {string[]}
   */
  public getAvailableLanguages(): string[] {
    return this.availableLanguages;
  }

  /**
   * Set the available languages. The first one is the default language.
   * @param {string[]} availableLanguages - The new default language, e.g. `["en", "de", "ar"]`
   */
  public setAvailableLanguages(availableLanguages: string[]) {
    this.availableLanguages = availableLanguages;
    for (let language of availableLanguages) {
      this.translations[language] = {};
    }
  }

  /**
   * Get the currently used language.
   * @returns {string}
   * @throws if no language is set yet
   */
  public getLanguage(): string {
    if (this.currentLanguage == null) {
      throw new Error("No language set yet");
    }
    return this.currentLanguage;
  }

  /**
   * Guess user language from user agent if available, or use first available language otherwise
   * @throws If no language is available in translator
   */
  public guessLanguage() {
    if (this.availableLanguages.length < 1) {
      throw new Error("No languages available yet in translator, setAvailableLanguages first");
    }
    let userLang = "";
    if (typeof window !== 'undefined' && window.navigator != null) {
      userLang = window.navigator.language.split('-')[0];
    }
    if (this.availableLanguages.indexOf(userLang) >= 0) {
      this.currentLanguage = userLang;
    } else {
      this.currentLanguage = this.availableLanguages[0];
    }
  }

  /**
   * Set the language to use for translations.
   * @param {string} language - The language to use for translations, e.g. "en"
   * @throws If language isn't available in translator
   */
  public setLanguage(language: string) {
    this.throwIfNotAvailable(language);
    if (this.currentLanguage !== language) {
      this.currentLanguage = language;
      this.translationEmitter.next(this.translations[language]);
    }
  }

  /**
   * Add translation data to the translator. `translation` can be a nested object.
   * @param {string} language The language for which to add the translation
   * @param translation A translation object of the form `{id: translationForId}`
   * @throws If language isn't available in translator
   */
  public addTranslation(language: string, translation: any) {
    this.throwIfNotAvailable(language);
    if (this.translations[language] == null) {
      this.translations[language] = {};
    }
    Object.assign(this.translations[language], this.flattenTranslations(translation));
  }

  /**
   * Overwrite translation data on the translator. `translation` can be a nested object.
   * @param {string} language The language for which to add the translation
   * @param translation A translation object of the form `{id: translationForId}`
   * @throws If language isn't available in translator
   */
  public setTranslation(language: string, translation: any) {
    this.throwIfNotAvailable(language);
    this.translations[language] = this.flattenTranslations(translation);
  }

  /**
   * Translate an id into the corresponding translation for the current language
   * @param id
   * @returns {string}
   * @throws if no language is set yet
   * @throws if no translation is available for that id
   */
  public translate(id: string): string {
    let translation = this.translations[this.getLanguage()][id];
    if (translation == null) {
      throw new Error('No translation available for id "' + id + '"');
    } else {
      return translation;
    }
  }

  /**
   * Subscribe to translations for an id.
   * @param {string} id
   * @return {Observable} an Observable that emits new translations
   */
  public observe(id: string): Observable<string> {
    return Observable.concat(
      Observable.of(this.translate(id)),
      this.translationEmitter.map( (translation: translation) => {
        return translation[id];
      })
    );
  }

  /**
   * Subscribe to translations for an id.
   * @param {string} id
   * @param {(string) => void} callback
   */
  public subscribe(id: string, callback: (text: string) => void) {
    this.observe(id).subscribe(callback);
  }

  /////////////////////
  // Private Methods //
  /////////////////////

  /**
   * Throws an error if language isn't available in translator
   * @param language
   * @throws If language isn't available in translator
   */
  private throwIfNotAvailable(language) {
    if (this.getAvailableLanguages().indexOf(language) === -1) {
      throw new Error('Language "' + language + '" not available in available languages '
        + JSON.stringify(this.getAvailableLanguages()));
    }
  }

  /**
   * Flattens a translation object into flat ids.
   * @param translationObject
   * @return flattened translation object
   */
  private flattenTranslations(translationObject: any): translation {
    let result: translation = {};
    Object.keys(translationObject).forEach( (id) => {
      let translation = translationObject[id];
      if (typeof translation === "string") {
        result[id] = translation;
      } else {
        this.deepFlattenTranslations(translation, id, result);
      }
    });
    return result;
  };

  private deepFlattenTranslations(translationObject: any, oldId: string, result: translation) {
    let id, translation;
    Object.keys(translationObject).forEach( (id) => {
      translation = translationObject[id];
      if (typeof translation === "string") {
        result[oldId + "." + id] = translation;
      } else {
        this.deepFlattenTranslations(translation, oldId + "." + id, result);
      }
    });
  };
}
