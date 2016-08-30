///<reference path="../../lib/jquery.d.ts" />
declare var require:(moduleId:string) => any;
import $ = require("jquery");
class Button {
    private _id:string;
    private _class:string;
    private _text:string;
    private markup_$:JQuery;
    constructor(id:string, className:string, text:string) {
        this._id = id;
        this._class = className;
        this._text = text;
        this.generateMarkup();
    }

    private generateMarkup() {
        this.markup_$ = $("<div class='" + this._class + "' id='" + this._id +"'>" + this._text + "</div>")
    }

    public getJqueryInstance():JQuery {
        return this.markup_$;
    }

    public getDOM():JQuery{
        return this.markup_$;
    }


}
export = Button