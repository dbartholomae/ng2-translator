/// <reference path="../typings/index.d.ts" />
import { OnInit } from "@angular/core";
import { Translator } from "./translator.service";
export declare class TranslateComponent implements OnInit {
    private translator;
    id: string;
    translation: string;
    constructor(translator: Translator);
    ngOnInit(): void;
}
