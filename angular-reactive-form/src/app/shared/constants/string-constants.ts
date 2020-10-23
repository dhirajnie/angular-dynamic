import { Injectable } from '@angular/core';

import { TranslateService } from '../services/translate/translate.service';

@Injectable()
export class StringConstants {
    public _dateFormat = 'lll';
    public _dateFormatDateOnly = 'll';
    private _hebrewLanguageCode = 'iw';
    private _hebrewLanguageNewCode = 'he';

    // send Identity info

    private _informationAbout = 'Identity information about';
    private _greetings = 'Hi,';
    private _mailBodyMessage = 'Please click on the following link to get a detailed profile about';
    private _regards = 'Regards,';

    get dateFormat() {
        return this._dateFormat;
    }

    get dateFormatDateOnly() {
        return this._dateFormatDateOnly;
    }

    get hebrewLanguageCode() {
        return this._hebrewLanguageCode;
    }

    get hebrewLanguageNewCode() {
        return this._hebrewLanguageNewCode;
    }

    get informationAbout() {
        return this.translate.get(this._informationAbout);
    }

    get greetings() {
        return this.translate.get(this._greetings);
    }

    get mailBodyMessage() {
        return this.translate.get(this._mailBodyMessage);
    }

    get regards() {
        return this.translate.get(this._regards);
    }

    constructor(private translate: TranslateService) {
    }
}