define(["require", "exports", "jquery"], function(require, exports, $) {
    ///<reference path="../../lib/jquery.d.ts" />
    

    var TextField = (function () {
        function TextField(id, className, placeholder, inputType) {
            this._id = id;
            this._class = className;
            this._placeholder = placeholder;
            this._inputType = inputType;
            this.generateMarkup();
        }
        TextField.prototype.generateMarkup = function () {
            this.markup_$ = $("<input type = '" + this._inputType + "' class = 'login-field' value = '' placeholder = '" + this._placeholder + "'id = 'login-name'>");
        };

        TextField.prototype.getDOM = function () {
            return this.markup_$;
        };
        return TextField;
    })();
    
    return TextField;
});
//# sourceMappingURL=TextField.js.map
