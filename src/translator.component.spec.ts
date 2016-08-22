import { TranslatorComponent } from "./translator.component";
import { Translator } from "./translator.service";

describe("A translate component", () => {
  let translatorComponent: TranslatorComponent;
  let mockTranslator: Translator;
  beforeEach( () => {
    mockTranslator = new Translator();
    translatorComponent = new TranslatorComponent(mockTranslator);
  });
  it("starts with an empty translation", () => {
    translatorComponent.id = "id";
    mockTranslator.subscribe = sinon.stub();

    translatorComponent.ngOnInit();

    expect(mockTranslator.subscribe).to.have.been.calledOnce;
    expect(translatorComponent.translation).to.equal("");
  });

  it("updates the translation based on the subscription function", () => {
    translatorComponent.id = "id";
    mockTranslator.subscribe = sinon.stub().yields("Translation");

    translatorComponent.ngOnInit();

    expect(mockTranslator.subscribe).to.have.been.calledOnce;
    expect(translatorComponent.translation).to.equal("Translation");
  });
});