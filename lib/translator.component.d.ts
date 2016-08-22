/// <reference path="../typings/index.d.ts" />
import { OnInit } from "@angular/core";
import { Translator } from "./translator.service";
export declare class TranslatorComponent implements OnInit {
    private translator;
    /**
     * ID to use for translation.
     */
    id: string;
    translation: string;
    constructor(translator: Translator);
    ngOnInit(): void;
}
