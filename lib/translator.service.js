///<reference path="../typings/index.d.ts"/>
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
var Subject_1 = require('rxjs/Subject');
require('rxjs/add/observable/of');
require('rxjs/add/observable/concat');
require('rxjs/add/operator/map');
////@Injectable()
///**
// * Allows to translate ids to texts in different languages. Consumers can subscribe to ids
// * and get called whenever the language changes.
// */
var Translator = (function () {
    /**
     * Create a new translator.
     * @param navigator - The browsers navigator object
     */
    function Translator(navigator) {
        this.navigator = navigator;
        this.availableLanguages = [];
        this.translations = {};
        this.translator = Subject_1.Subject.create();
    }
    /////////////////////
    // Public Methods //
    /////////////////////
    /**
     * Get the available languages.
     * @returns {string[]}
     */
    Translator.prototype.getAvailableLanguages = function () {
        return this.availableLanguages;
    };
    /**
     * Set the available languages. The first one is the default language.
     * @param {string[]} availableLanguages - The new default language, e.g. `["en", "de", "ar"]`
     */
    Translator.prototype.setAvailableLanguages = function (availableLanguages) {
        this.availableLanguages = availableLanguages;
        for (var _i = 0, availableLanguages_1 = availableLanguages; _i < availableLanguages_1.length; _i++) {
            var language = availableLanguages_1[_i];
            this.translations[language] = {};
        }
    };
    /**
     * Get the currently used language.
     * @returns {string}
     * @throws if no language is set yet
     */
    Translator.prototype.getLanguage = function () {
        if (this.currentLanguage == null) {
            throw new Error("No language set yet");
        }
        return this.currentLanguage;
    };
    /**
     * Guess user language from user agent.
     * @throws If no language is available in translator
     */
    Translator.prototype.guessLanguage = function () {
        if (this.availableLanguages.length < 1) {
            throw new Error("No languages available yet in translator, setAvailableLanguages first");
        }
        var userLang = "";
        if (this.navigator != null) {
            userLang = this.navigator.language.split('-')[0];
        }
        this.currentLanguage = /(de)/gi.test(userLang) ? userLang : this.availableLanguages[0];
    };
    /**
     * Set the language to use for translations.
     * @param {string} language - The language to use for translations, e.g. "en"
     * @throws If language isn't available in translator
     */
    Translator.prototype.setLanguage = function (language) {
        this.throwIfNotAvailable(language);
        if (this.currentLanguage !== language) {
            this.currentLanguage = language;
            this.translator.next(this.translations[language]);
        }
    };
    /**
     * Add translation data to the translator. `translation` can be a nested object.
     * @param {string} language The language for which to add the translation
     * @param translation A translation object of the form `{id: translationForId}`
     * @throws If language isn't available in translator
     */
    Translator.prototype.addTranslation = function (language, translation) {
        this.throwIfNotAvailable(language);
        if (this.translations[language] == null) {
            this.translations[language] = {};
        }
        Object.assign(this.translations[language], this.flattenTranslations(translation));
    };
    /**
     * Overwrite translation data on the translator. `translation` can be a nested object.
     * @param {string} language The language for which to add the translation
     * @param translation A translation object of the form `{id: translationForId}`
     * @throws If language isn't available in translator
     */
    Translator.prototype.setTranslation = function (language, translation) {
        this.throwIfNotAvailable(language);
        this.translations[language] = this.flattenTranslations(translation);
    };
    /**
     * Translate an id into the corresponding translation for the current language
     * @param id
     * @returns {string}
     * @throws if no language is set yet
     * @throws if no translation is available for that id
     */
    Translator.prototype.translate = function (id) {
        var translation = this.translations[this.getLanguage()][id];
        if (translation == null) {
            throw new Error('No translation available for id "' + id + '"');
        }
        else {
            return translation;
        }
    };
    /**
     * Subscribe to translations for an id.
     * @param {string} id
     * @return {Observable} an Observable that emits new translations
     */
    Translator.prototype.observe = function (id) {
        return Observable_1.Observable.concat(Observable_1.Observable.of(this.translate(id)), this.translator.map(function (translation) { return translation[id]; }));
    };
    /**
     * Subscribe to translations for an id.
     * @param {string} id
     * @param {(string) => void} callback
     */
    Translator.prototype.subscribe = function (id, callback) {
        this.observe(id).subscribe(callback);
    };
    /////////////////////
    // Private Methods //
    /////////////////////
    /**
     * Throws an error if language isn't available in translator
     * @param language
     * @throws If language isn't available in translator
     */
    Translator.prototype.throwIfNotAvailable = function (language) {
        if (this.getAvailableLanguages().indexOf(language) === -1) {
            throw new Error('Language "' + language + '" not available in available languages '
                + JSON.stringify(this.getAvailableLanguages()));
        }
    };
    /**
     * Flattens a translation object into flat ids.
     * @param translationObject
     * @return flattened translation object
     */
    Translator.prototype.flattenTranslations = function (translationObject) {
        var _this = this;
        var result = {};
        Object.keys(translationObject).forEach(function (id) {
            var translation = translationObject[id];
            if (typeof translation === "string") {
                result[id] = translation;
            }
            else {
                _this.deepFlattenTranslations(translation, id, result);
            }
        });
        return result;
    };
    ;
    Translator.prototype.deepFlattenTranslations = function (translationObject, oldId, result) {
        var _this = this;
        var id, translation;
        Object.keys(translationObject).forEach(function (id) {
            translation = translationObject[id];
            if (typeof translation === "string") {
                result[oldId + "." + id] = translation;
            }
            else {
                _this.deepFlattenTranslations(translation, oldId + "." + id, result);
            }
        });
    };
    ;
    Translator = __decorate([
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [Object])
    ], Translator);
    return Translator;
}());
exports.Translator = Translator;
//# sourceMappingURL=translator.service.js.map