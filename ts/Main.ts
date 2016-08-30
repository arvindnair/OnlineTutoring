///<reference path="lib/jquery.d.ts" />
///<reference path="../ts/lib/jqueryui.d.ts" />
///<amd-dependency path="jqueryui" />
///<amd-dependency path="advanced" />
///<amd-dependency path="wysihtml5" />

declare var require:(moduleId:string) => any;
import $ = require("jquery");
import TextField = require("ts/classes/GenericHTML/TextField");
import Button    = require("ts/classes/GenericHTML/Button");
import ChatBox = require("ts/classes/ChatBox");



class Main{
    private body_$:JQuery;
    private _chatContainer:JQuery;
    private _chat:ChatBox;
    private _loginContainer:JQuery;
    private _wrongCredentialsBox:JQuery;
    constructor() {
        this.body_$ = $("body");
        this._chatContainer = $("<div class='chatboxcontainer' id='chat-box'></div>");
    }

    public main(){
        var that = this;
        $(document).ready(function() {
            $.post('checkAuthenticated.php', function (screenName) {
                screenName = JSON.parse(screenName);
                if (screenName) {
                    // They've already been authenticated so

                    that.body_$.append(that._chatContainer);
                    // Begin the chat
                    that.beginChat(screenName[0]);
                } else {
                    // Set up the sign in so they can select their screenname
                    that._loginContainer = $("<div class = 'login-screen'></div>");
                    var loginForm:JQuery = $("<div class = 'login-form' id='login-form'></div>");
                    var loginUser:TextField = new TextField("login-name", "login-field", "Enter your desired screen name", "text");
                    loginUser.getDOM().attr('maxlength','9');
                    var submitButton:Button = new Button("submit-button-CAS", "btn btn-primary btn-large btn-block authenticate", "");
                    var buttonContainer:JQuery = $("<div class='button-container'></div>");
                    loginForm.append(loginUser.getDOM());
                    loginForm.append("</br>");
                    buttonContainer.append("<div>AUTHENTICATE</div><div style='padding-bottom: 5px'>:</div>");
                    buttonContainer.append(submitButton.getDOM());
                    loginForm.append(buttonContainer);
                    that._wrongCredentialsBox = $("<span id ='wrong-password'></span>");
                    loginForm.append(that._wrongCredentialsBox);
                    // Don't forget main container
                    that._loginContainer.append("<div class = 'app-title'><h1>LOGIN</h1></div>");
                    that._loginContainer.append(loginForm);
                    that._loginContainer.append("<div class='chatboxcontainer' id='chat-box'></div>");

                    that.body_$.append(that._loginContainer);

                    var submitClickAction = () => {
                        var screenName = loginUser.getDOM().val();
                        if (screenName.length > 0) {
                            $.post("php/cas.php", {screenName: screenName}, function (succeeded) {
                                window.location = succeeded;
                            });
                        } else {
                            submitButton.getDOM().one('click', submitClickAction);
                        }
                    };
                    submitButton.getDOM().one('click', submitClickAction);
                    $(function() {
                        loginUser.getDOM().keyup(function(e) {
                            if (e.keyCode == 13 /* The keycode for the enter button */) {
                                submitButton.getDOM().click();
                            }
                        });
                    });
                }
            });
            // Add the chatbox to the main container
            //
            // Begin the chat
            //that.beginChat(name);
        });
    }

    private beginChat(name) {
        var that = this;
        this._chat = new ChatBox(name);

        // Add the chatbox to the chat container
        this._chatContainer.append(this._chat.getChatBoxContainer());

        // Add name information to the chatbox
        $("#" + this._chat.getNameAreaID()).html("You are: <span>" + name + "</span>");
        /**
         * Add a listener that says "Whenever a user hits the enter key, send a message"
         */
        // You need to initialize the current number of messages in the database so that we know where to start
        that._chat.getCurrentNumberOfMessages();
        $(function() {
            $('#' + that._chat.getMessageID()).keyup(function(e) {
                if (e.keyCode == 13 /* The keycode for the enter button */) {
                    that._chat.sendMessage();
                }
            });
        });

        setInterval(function() {
            // Update the chatbox window every second
            that._chat.update();
        }, 1000);
    }
}

export = Main;