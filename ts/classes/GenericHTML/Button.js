define(["require", "exports", "jquery"], function(require, exports, $) {
    ///<reference path="../../lib/jquery.d.ts" />
    

    var Button = (function () {
        function Button(id, className, text) {
            this._id = id;
            this._class = className;
            this._text = text;
            this.generateMarkup();
        }
        Button.prototype.generateMarkup = function () {
            this.markup_$ = $("<div class='" + this._class + "' id='" + this._id + "'>" + this._text + "</div>");
        };

        Button.prototype.getJqueryInstance = function () {
            return this.markup_$;
        };

        Button.prototype.getDOM = function () {
            return this.markup_$;
        };
        return Button;
    })();
    
    return Button;
});
//# sourceMappingURL=Button.js.map
