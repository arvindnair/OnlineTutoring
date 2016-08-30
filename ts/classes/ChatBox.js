define(["require", "exports", "jquery", "ts/classes/GenericHTML/Button"], function(require, exports, $, Button) {
    ///<reference path="../lib/jquery.d.ts" />
    

    var ChatBox = (function () {
        function ChatBox(userNickname) {
            this._lock = false;
            this._userNickname = userNickname;
            this._chatContainerID = "chatContainer";
            this._nameAreaID = "nameLocation";
            this._chatAreaID = "chatArea";
            this._formID = "postMessageForm";
            this._messageID = "message";
            this._textAreaFeedback = $("<div class='textarea_feedback'></div>");
            this._chatContainer_$ = $("<div id='" + this._chatContainerID + "'></div>");
            this._chatArea = $("<div id='" + this._chatAreaID + "'></div>");
            this._chatForm = $("<form id='" + this._formID + "'></form>");
            this._messageContents = $("<textarea placeholder='Enter your message...' id='" + this._messageID + "' maxlength='140'></textarea>");

            // Make submit and load more buttons
            this._sendButton = new Button("sendMessage", "btn btn-primary btn-large btn-block general", "<div>Send Message</div>");
            this._loadMoreButton = new Button("loadMore", "btn btn-primary btn-large btn-block general", "<div>Load More</div>");
            this._logoutButton = new Button("logout", "btn btn-primary btn-large btn-block general logout", "<div>Logout</div>");
            this.generateMarkup();
        }
        ChatBox.prototype.getChatContainerID = function () {
            return this._chatContainerID;
        };

        ChatBox.prototype.getNameAreaID = function () {
            return this._nameAreaID;
        };

        ChatBox.prototype.getFormID = function () {
            return this._formID;
        };

        ChatBox.prototype.getMessageID = function () {
            return this._messageID;
        };

        ChatBox.prototype.getChatAreaID = function () {
            return this._chatAreaID;
        };

        ChatBox.prototype.generateMarkup = function () {
            var that = this;
            this._chatContainer_$.append(this._chatArea);
            this._chatContainer_$.append(this._chatForm);
            this._chatForm.append(this._messageContents);
            this._chatContainer_$.append(this._textAreaFeedback);
            this._chatContainer_$.append(this._sendButton.getDOM());
            this._chatContainer_$.append(this._loadMoreButton.getDOM());
            this._chatContainer_$.append(this._logoutButton.getDOM());

            // Set up the character counter
            var text_max = parseInt(this._messageContents.attr("maxlength"));
            this._textAreaFeedback.html(0 + "/" + text_max);

            this._messageContents.keyup(function () {
                var text_length = that._messageContents.val().length;
                var text_remaining = text_length + "/" + text_max;

                that._textAreaFeedback.text(text_remaining);
            });

            // Define the button actions
            var sendMessageClickAction = function () {
                that.sendMessage();
            };
            this._sendButton.getDOM().click(sendMessageClickAction);
            var loadMoreClickAction = function () {
                that.loadMore();
            };
            this._loadMoreButton.getDOM().click(loadMoreClickAction);
            var logoutFunction = function () {
                $.post('logout.php', function () {
                    window.location = 'https://cas.iu.edu/cas/logout';
                });
            };
            this._logoutButton.getDOM().click(logoutFunction);
        };

        ChatBox.prototype.getChatBoxContainer = function () {
            return this._chatContainer_$;
        };

        ChatBox.prototype.getCurrentNumberOfMessages = function () {
            var that = this;
            if (!this._lock) {
                this._lock = true;
                $.post("process.php", { 'function': 'getState' }, function (data) {
                    data = JSON.parse(data);
                    that._currentState = data.state;
                    that._topMessageNumber = data.state;
                    that._lock = false;
                });
            }
        };

        ChatBox.prototype.loadMore = function () {
            var that = this;
            if (this._lock === false) {
                this._lock = true;
                $.post("process.php", { 'function': 'loadMore', 'topMessage': this._topMessageNumber }, function (data) {
                    data = JSON.parse(data);
                    if (data.text) {
                        for (var i = 0; i < data.text.length; i++) {
                            $('#' + that._chatAreaID).prepend($(data.text[i]));
                        }
                    }
                    that._topMessageNumber = data.topMessage;
                    that._lock = false;
                });
            }
        };

        ChatBox.prototype.update = function () {
            var that = this;
            if (this._lock === false) {
                this._lock = true;
                $.post("process.php", { 'function': 'update', 'state': this._currentState }, function (data) {
                    data = JSON.parse(data);
                    var atBottomOfMessageBox = document.getElementById(that._chatAreaID).scrollHeight - document.getElementById(that._chatAreaID).scrollTop <= 496;
                    if (data.text) {
                        for (var i = 0; i < data.text.length; i++) {
                            $('#' + that._chatAreaID).append($(data.text[i]));
                        }
                    }
                    if (atBottomOfMessageBox) {
                        document.getElementById(that._chatAreaID).scrollTop = document.getElementById(that._chatAreaID).scrollHeight;
                    }
                    that._currentState = data.state;
                    that._lock = false;
                });
            }
        };

        ChatBox.prototype.sendMessage = function () {
            var that = this;

            // Get the text to send, package it up and pass it over to the server, then update the messages window
            var message = $('#' + this.getMessageID()).val();
            $.post("process.php", { 'function': 'send', 'message': message, nickname: this._userNickname }, function () {
                $('#' + that.getMessageID()).val("");
                that.update();
                var text_max = parseInt(that._messageContents.attr("maxlength"));
                that._textAreaFeedback.html(0 + "/" + text_max);
            });
        };
        return ChatBox;
    })();
    
    return ChatBox;
});
//# sourceMappingURL=ChatBox.js.map
