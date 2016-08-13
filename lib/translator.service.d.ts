/// <reference path="../typings/index.d.ts" />
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/map';
export declare type translation = {
    [key: string]: string;
};
export declare class Translator {
    private navigator;
    private availableLanguages;
    private currentLanguage;
    private translations;
    private translator;
    /**
     * Create a new translator.
     * @param navigator - The browsers navigator object
     */
    constructor(navigator?: any);
    /**
     * Get the available languages.
     * @returns {string[]}
     */
    getAvailableLanguages(): string[];
    /**
     * Set the available languages. The first one is the default language.
     * @param {string[]} availableLanguages - The new default language, e.g. `["en", "de", "ar"]`
     */
    setAvailableLanguages(availableLanguages: string[]): void;
    /**
     * Get the currently used language.
     * @returns {string}
     * @throws if no language is set yet
     */
    getLanguage(): string;
    /**
     * Guess user language from user agent.
     * @throws If no language is available in translator
     */
    guessLanguage(): void;
    /**
     * Set the language to use for translations.
     * @param {string} language - The language to use for translations, e.g. "en"
     * @throws If language isn't available in translator
     */
    setLanguage(language: string): void;
    /**
     * Add translation data to the translator. `translation` can be a nested object.
     * @param {string} language The language for which to add the translation
     * @param translation A translation object of the form `{id: translationForId}`
     * @throws If language isn't available in translator
     */
    addTranslation(language: string, translation: any): void;
    /**
     * Overwrite translation data on the translator. `translation` can be a nested object.
     * @param {string} language The language for which to add the translation
     * @param translation A translation object of the form `{id: translationForId}`
     * @throws If language isn't available in translator
     */
    setTranslation(language: string, translation: any): void;
    /**
     * Translate an id into the corresponding translation for the current language
     * @param id
     * @returns {string}
     * @throws if no language is set yet
     * @throws if no translation is available for that id
     */
    translate(id: string): string;
    /**
     * Subscribe to translations for an id.
     * @param {string} id
     * @return {Observable} an Observable that emits new translations
     */
    observe(id: string): Observable<string>;
    /**
     * Subscribe to translations for an id.
     * @param {string} id
     * @param {(string) => void} callback
     */
    subscribe(id: string, callback: (text: string) => void): void;
    /**
     * Throws an error if language isn't available in translator
     * @param language
     * @throws If language isn't available in translator
     */
    private throwIfNotAvailable(language);
    /**
     * Flattens a translation object into flat ids.
     * @param translationObject
     * @return flattened translation object
     */
    private flattenTranslations(translationObject);
    private deepFlattenTranslations(translationObject, oldId, result);
}
