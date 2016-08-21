/// <reference path="../node_modules/mocha-chai-helper/index.d.ts" />

import { Translator } from "../src/translator.service";
describe("A translator service", () => {
  let translator: Translator;
  beforeEach(() => {
    translator = new Translator();
  });

  it("sets available languages", () => {
    translator.setAvailableLanguages(["en", "de"]);
    expect(translator.getAvailableLanguages()).to.deep.equal(["en", "de"]);
  });

  describe("when guessing languages", () => {
    it("throws an error if no languages are available yet", () => {
      expect(() => { translator.guessLanguage(); }).to.throw("No languages available yet " +
        "in translator, setAvailableLanguages first");
    });

    it("uses the first availableLanguage as default if there is no navigator object", () => {
      translator.setAvailableLanguages(["en", "de", "ar"]);
      translator.guessLanguage();
      expect(translator.getLanguage()).to.equal("en");
    });

    it("uses the first availableLanguage if the navigator isn't available", () => {
      translator.setAvailableLanguages(["en", "de", "ar"]);
      translator.guessLanguage();
      expect(translator.getLanguage()).to.equal("en");
    });

    it("uses the first availableLanguage if the user agent language isn't available", () => {
      let navigator = {
        language: "de-de"
      };
      global['window'] = {
        navigator: navigator
      };
      translator = new Translator();
      translator.setAvailableLanguages(["en", "de", "ar"]);
      translator.guessLanguage();
      expect(translator.getLanguage()).to.equal("de");
      global['window'] = null;
    });

    it("uses the user agent language if it is available", () => {
      let navigator = {
        language: "en-us"
      };
      global['window'] = {
        navigator: navigator
      };
      translator.setAvailableLanguages(["en", "de", "ar"]);
      translator.guessLanguage();
      expect(translator.getLanguage()).to.equal("en");
      global['window'] = null;
    });
  });

  describe("when getting the current language", () => {
    it("throws an error if no language has been set yet", () => {
      expect(() => { translator.getLanguage(); })
      .to.throw("No language set yet");
    });
  });

  describe("when setting languages", () => {
    it("throws an error if available languages haven't been set yet", () => {
      expect(() => { translator.setLanguage("en"); })
        .to.throw('Language "en" not available in available languages []');
    });

    it("changes the current language", () => {
      translator.setAvailableLanguages(["de"]);
      translator.setLanguage("de");
      expect(translator.getLanguage()).to.equal("de");
      });

    it("sets the availabe languages", () => {
      let availableLanguages = ["en", "de", "ar"];
      translator.setAvailableLanguages(availableLanguages);
      expect(translator.getAvailableLanguages()).to.deep.equal(availableLanguages);
    });
  });

  describe("when setting translations", () => {
    beforeEach(() => {
      translator.setAvailableLanguages(["en"]);
      translator.setLanguage("en");
    });

    it("throws an error if language is not available", () => {
      expect(() => { translator.setTranslation("de", {}); })
        .to.throw('Language "de" not available in available languages ["en"]');
    });

    it("sets translations", () => {
      translator.setTranslation("en", {
        id1: "translation1",
        id2: "translation2"
      });
      for (let i of [1, 2]) {
        expect(translator.translate("id" + i)).to.equal("translation" + i);
      }
    });

    it("overwrites existing translations", () => {
      translator.setTranslation("en", {
        id1: "translation1",
        id2: "translation2"
      });
      for (let i of [1, 2]) {
        expect(translator.translate("id" + i)).to.equal("translation" + i);
      }
      translator.setTranslation("en", {
        id1: "new translation"
      });
      expect(translator.translate("id1")).to.equal("new translation");
      expect(() => { translator.translate("id2"); })
        .to.throw('No translation available for id "id2"');
    });
  });

  describe("when adding translations", () => {
    beforeEach(() => {
      translator.setAvailableLanguages(["en"]);
      translator.setLanguage("en");
    });

    it("throws an error if language is not available", () => {
      expect(() => { translator.addTranslation("de", {}); })
        .to.throw('Language "de" not available in available languages ["en"]');
    });

    it("adds translations via addTranslation", () => {
      translator.addTranslation("en", {
        id1: "translation1",
        id2: "translation2"
      });
      for (let i of [1, 2]) {
        expect(translator.translate("id" + i)).to.equal("translation" + i);
      }
      translator.addTranslation("en", {
        id3: "translation3"
      });
      for (let i of [1, 2, 3]) {
        expect(translator.translate("id" + i)).to.equal("translation" + i);
      }
    });

    it("overwrites duplicate translations when adding new ones", () => {
      translator.addTranslation("en", {
        id1: "translation1",
        id2: "translation2"
      });
      for (let i of [1, 2]) {
        expect(translator.translate("id" + i)).to.equal("translation" + i);
      }
      translator.addTranslation("en", {
        id1: "new translation",
        id3: "translation3"
      });
      expect(translator.translate("id1")).to.equal("new translation");
      for (let i of [2, 2]) {
        expect(translator.translate("id" + i)).to.equal("translation" + i);
      }
    });
  });

  describe("when translating", () => {
    beforeEach(() => {
      translator.setAvailableLanguages(["en"]);
    });

    it("throws an error if no language is set", () => {
      expect( () => { translator.translate("id"); })
        .to.throw("No language set yet");
    });

    it("throws an error if translation isn't available", () => {
      translator.setLanguage("en");
      expect( () => { translator.translate("id"); })
        .to.throw('No translation available for id "id"');
    });

    it("delivers the correct translation", () => {
      translator.setLanguage("en");
      translator.setTranslation("en", {
        id1: "translation1",
        id2: "translation2"
      });
      expect(translator.translate("id1")).to.equal("translation1");
      expect(translator.translate("id2")).to.equal("translation2");
    });
  });

  describe("when subscribed to", () => {
    beforeEach(() => {
      translator.setAvailableLanguages(["en", "de"]);
      translator.setTranslation("en", {
        "lang": "English"
      });
      translator.setTranslation("de", {
        "lang": "Deutsch"
      });
      translator.setLanguage("en");
    });

    it("sends the current translation", (done) => {
      let cb = (translation) => {
        expect(translation).to.equal("English");
        done();
      };
      translator.subscribe("lang", cb);
      setTimeout(() => {
      }, 100);
    });

    it("sends the new translation on updates", (done) => {
      let cb = sinon.spy();
      translator.subscribe("lang", cb);
      translator.setLanguage("de");
      setImmediate( () => {
        expect(cb).to.be.calledTwice;
        expect(cb.getCall(0).args[0]).to.equal("English");
        expect(cb.getCall(1).args[0]).to.equal("Deutsch");
        done();
      });
    });

    it("sends only the most recent translation", (done) => {
      let cb = sinon.spy();
      translator.setLanguage("de");
      translator.subscribe("lang", cb);
      translator.setLanguage("en");
      setImmediate(() => {
        expect(cb).to.be.calledTwice;
        expect(cb.getCall(0).args[0]).to.equal("Deutsch");
        expect(cb.getCall(1).args[0]).to.equal("English");
        done();
      });
    });

    it("sends translations to multiple recipients", (done) => {
      let cb1 = sinon.spy();
      let cb2 = sinon.spy();
      translator.setLanguage("de");
      translator.subscribe("lang", cb1);
      translator.setLanguage("en");
      translator.subscribe("lang", cb2);
      translator.setLanguage("de");
      setImmediate(() => {
        expect(cb1).to.be.calledThrice;
        expect(cb1.getCall(0).args[0]).to.equal("Deutsch");
        expect(cb1.getCall(1).args[0]).to.equal("English");
        expect(cb1.getCall(0).args[0]).to.equal("Deutsch");

        expect(cb2).to.be.calledTwice;
        expect(cb1.getCall(1).args[0]).to.equal("English");
        expect(cb1.getCall(0).args[0]).to.equal("Deutsch");

        done();
      });
    });
  });
});
