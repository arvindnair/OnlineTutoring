///<reference path="../../lib/jquery.d.ts" />
declare var require:(moduleId:string) => any;
import $ = require("jquery");
class TextField {
    private _id:string;
    private _class:string;
    private _placeholder:string;
    private _inputType:string;
    private markup_$:JQuery;
    constructor(id:string, className:string, placeholder:string, inputType:string) {
        this._id = id;
        this._class = className;
        this._placeholder = placeholder;
        this._inputType = inputType;
        this.generateMarkup();
    }

    private generateMarkup() {
        this.markup_$ = $("<input type = '" + this._inputType + "' class = 'login-field' value = '' placeholder = '" + this._placeholder + "'id = 'login-name'>")
    }

    public getDOM():JQuery{
        return this.markup_$;
    }

}
export = TextField