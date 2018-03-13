window.component = window.component || {};
component.GroupMessagesPage = (function () {
    var connect = ReactRedux.connect;
    var IconsPicker = component.IconsPicker;

    function isLTR(char) {
		return /[a-zA-Z]/.test(char);
    }

    function isRTL(char) {
		return /[א-ת]/.test(char);
    }

    function getTextDirection(str) {
    	var i;

    	if (str) {
            for (i = 0; i < str.length; i++) {
                var char = str.charAt(i);
                if (isRTL(char)) {
                    return "rtl";
                }

                if (isLTR(char)) {
                    return "ltr";
                }
            }
		}


		return "ltr";
	}

	//remove elements (div, br...) and replace with line break \n
    var convertElementToText = (function() {
        var convertElement = function(element) {
            switch(element.tagName) {
                case "BR":
                    return "\n";
                case "P":
                case "DIV":
                    return (element.previousSibling ? "\n" : "") + [].map.call(element.childNodes, convertElement).join("");
                case "IMG":
                    return element.outerHTML;
                default:
                    return element.textContent;
            }
        };

        return function(element) {
            return [].map.call(element.childNodes, convertElement).join("");
        };
    })();

    function pasteHtmlAtCaret(html) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }

    var INPUTS_CONTAINER_MIN_HEIGHT = 40;
    var SPRITE_ICON_SIZE = 24;

	var GroupMessagesPage = React.createClass({
        getInitialState: function() {
            if (this.props.selectedGroupId) {
                this.props.loadGroupMessages(this.props.selectedGroupId);
                this.props.resetUnreadMessage(this.props.selectedGroupId);
            }

            return {
                direction: "",
				isEmptyMessage: true,
                isIconsPickerVisible: false
			};
        },

        componentDidMount: function() {
			this.scrollToBottom();
		},

		componentDidUpdate: function(prevProps, prevState) {
        	if (this.props.groupMessages !== prevProps.groupMessages) {
                this.scrollToBottom();
            }

            if (this.state.isIconsPickerVisible !== prevState.isIconsPickerVisible) {
                this.scrollToBottom();
            }
		},

		scrollToBottom: function() {
        	if (this.scrollElem) {
                this.scrollElem.scrollTop = this.scrollElem.scrollHeight;
            }
		},

        componentWillReceiveProps: function(nextProps) {
            if (nextProps.selectedGroupId !== this.props.selectedGroupId) {
                //changed group selection -> load group messages of selected group id
                this.props.loadGroupMessages(nextProps.selectedGroupId);
                this.props.resetUnreadMessage(nextProps.selectedGroupId);
            }
        },

        pasteHTML: function(html) {
            var inputScrollTopBefore = this.inputMessageElem.scrollTop;
            this.restoreRangePosition();
            this.inputMessageElem.focus();
            pasteHtmlAtCaret(html);
            this.inputMessageElem.blur();
            this.inputMessageElem.scrollTop = inputScrollTopBefore;
        },

        onInputMessageChange: function(event) {
            this.onMessageStrChanged(event);
            this.updateInputsHeight(event);
        },

        updateInputsHeight: function() {
            var LINE_HEIGHT = 24;
            var MAX_NUM_OF_LINES = 4;
            var innerHtml = this.inputMessageElem.innerHTML;
            //var numOfLinesCalculated = innerHtml.split("<div>").length;
            //if (innerHtml.indexOf('<br class="line">') >=0 ) {
                var numOfLinesCalculated = innerHtml.split('<br class="line">').length;
            //}

            var numOfLines = Math.min(numOfLinesCalculated, MAX_NUM_OF_LINES);
            var inputsContainerHeight = INPUTS_CONTAINER_MIN_HEIGHT + ((numOfLines - 1) * LINE_HEIGHT);
            if (this.state.inputsContainerHeight !== inputsContainerHeight) {
                this.setState({
                    inputsContainerHeight: inputsContainerHeight
                })
            }
        },

        onInputMessageBlur: function(event) {
            this.onMessageStrChanged(event);
        },

        onInputKeyDown: function(e) {

            if(e.charCode === 13){ //enter && shift

                e.preventDefault(); //Prevent default browser behavior
                if (window.getSelection) {
                    var selection = window.getSelection(),
                        range = selection.getRangeAt(0),
                        br = document.createElement("br"),
                        textNode = document.createTextNode("\u00a0"); //Passing " " directly will not end up being shown correctly

                    br.classList.add("line");
                    range.deleteContents();//required or not?
                    range.insertNode(br);
                    range.collapse(false);
                    range.insertNode(textNode);
                    range.selectNodeContents(textNode);

                    selection.removeAllRanges();
                    selection.addRange(range);
                    return false;
                }

            }
        },

        onMessageStrChanged: function(event) {
            var target = event.target;
			var text = target.textContent;
        	var direction = getTextDirection(text);
        	this.saveRangePosition();
			this.setState({
                direction: direction,
                isEmptyMessage: (!text.trim()) && (target.innerHTML.indexOf("<img") === -1)
			});
		},

        saveRangePosition: function() {
            var bE = this.inputMessageElem;
            var selection = window.getSelection();
            if (selection.type === 'None') {
                return;
            }

            var range=window.getSelection().getRangeAt(0);
            var sC=range.startContainer,eC=range.endContainer;

            A=[];while(sC!==bE){A.push(this.getNodeIndex(sC));sC=sC.parentNode}
            B=[];while(eC!==bE){B.push(this.getNodeIndex(eC));eC=eC.parentNode}

            this.rp={"sC":A,"sO":range.startOffset,"eC":B,"eO":range.endOffset};
        },

        restoreRangePosition: function() {
            var bE = this.inputMessageElem;
            var rp = this.rp;

            if (!rp) {
                return;
            }
            bE.focus();
            var sel=window.getSelection(),range=sel.getRangeAt(0);
            var x,C,sC=bE,eC=bE;

            C=rp.sC;x=C.length;while(x--)sC=sC.childNodes[C[x]];
            C=rp.eC;x=C.length;while(x--)eC=eC.childNodes[C[x]];

            range.setStart(sC,rp.sO);
            range.setEnd(eC,rp.eO);
            sel.removeAllRanges();
            sel.addRange(range);
        },

        getNodeIndex: function(n){var i=0;while(n=n.previousSibling)i++;return i},

        onInputMessageClick: function(e) {
            function setCaret(el, e, textDirection) {
                var selectedElem = e.target;
                var range = document.createRange();
                var sel = window.getSelection();
                var selectedElementLeft = selectedElem.getBoundingClientRect().left;
                var selectedElementWidth = selectedElem.offsetWidth;
                var startElement;

                if ((e.pageX - selectedElementLeft) > (selectedElementWidth / 2)) {
                    //right of image
                    if (textDirection === "rtl") {
                         startElement = selectedElem;
                    } else {
                       startElement = selectedElem.nextSibling;
                    }
                } else {
                    //left
                    if (textDirection === "rtl") {
                         startElement = selectedElem.nextSibling;
                    } else {
                        startElement = selectedElem;
                    }
                }

                if (!startElement) {
                     range.setStartAfter(selectedElem);
                } else {
                    range.setStart(startElement, 0);
                }

                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                el.focus();
            }

            if (e.target.tagName === "IMG") {
                setCaret(this.inputMessageElem, e, this.state.direction);
            }

            this.setState({
                isIconsPickerVisible: false
            });
        },

        sendMessage: function() {
            var message = convertElementToText(this.inputMessageElem);

            //send message
            this.props.sendMessage({message: message}, this.props.selectedGroupId);

            //clean input
            this.inputMessageElem.innerHTML = "";
            this.rp = null;
			this.setState({
                isEmptyMessage: true,
                isIconsPickerVisible: false,
                inputsContainerHeight: INPUTS_CONTAINER_MIN_HEIGHT
			});
		},

        toggleIconsPicker: function() {
            this.setState({
                isIconsPickerVisible: !this.state.isIconsPickerVisible
            });
        },

        assignScrollRef: function(elem) {
        	this.scrollElem = elem;
		},

        assignInputMessageRef: function(elem) {
        	this.inputMessageElem = elem;
		},

        onIconPickerClicked: function(imageUrl, index) {
            var imageElem = document.createElement("img");
            imageElem.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            var position = (SPRITE_ICON_SIZE * (index % 2)) + "px -" + (SPRITE_ICON_SIZE * Math.floor(index / 2)) + "px";
            imageElem.style.backgroundImage = "url(" + imageUrl + ")";
            imageElem.style.backgroundPosition = position;
            this.pasteHTML(imageElem.outerHTML);
        },

		render: function() {
        	var props = this.props,
				state = this.state,
                groupMessages = props.groupMessages,
                users = props.users,
                userId = props.userId;

        	var tiles = groupMessages.sort(function(g1, g2){
        		//sort can be moved to server
				return new Date(g1.creationDate) - new Date(g2.creationDate);
			}).map(function(groupMessage) {
				var userNameElem;
				var groupMessageClassName = "group-message";
				var message = groupMessage.message;

				if (userId === groupMessage.userId) {
					//logged user
                    groupMessageClassName += " logged-user";
				} else {
                    var user = utils.general.findItemInArrBy(users, "_id", groupMessage.userId);
                    userNameElem = re("div", {className: "user-name"},
                        user ? user.name : ""
                    );
				}

				var iconsMatch = message.match(/\<img /g);
				if (iconsMatch && iconsMatch.length == 1) {
				    //only one icon
                    var tempDiv = document.createElement("div");
                    tempDiv.innerHTML = message;
                    if (!tempDiv.textContent.trim()) {
                        //no text
                        var backPos = tempDiv.querySelector("img").style.backgroundPosition;
                        if (backPos) {
                            var xPos = backPos.split(" ")[0].replace("px", "");
                            var yPos = backPos.split(" ")[1].replace("px", "");
                            //multiply by 3
                            xPos *= (SPRITE_ICON_SIZE * 2);
                            yPos *= (SPRITE_ICON_SIZE * 2);

                            message = message.replace(backPos, xPos + "px " + yPos + "px");
                            groupMessageClassName += " icon-only";
                        }
                    }
                }
        		return re("div", {className: groupMessageClassName, key: groupMessage._id},
					re("div", {className: "group-message-content"},
						userNameElem,
						re("div", {className: "message", dangerouslySetInnerHTML: {__html: message}, style: {direction: getTextDirection(message)}}),
						re("div", {className: "time"},
							utils.general.formatHourMinutesTime(groupMessage.creationDate)
						)
                    )
				);
			});

			return re("div", {className: "group-messages-page content" + (state.isIconsPickerVisible ? " icons-picker-open" : "")},
				re("div", {className: "scroll-container", ref: this.assignScrollRef},
                    re("div", {className: "groups-messages"},
                    	tiles
					)
				),
                re(IconsPicker, {isVisible: state.isIconsPickerVisible, onIconClicked: this.onIconPickerClicked, bottomPosition: state.inputsContainerHeight}),
                re("div", {className: "inputs-container", style: {height:  state.inputsContainerHeight + "px"}},
                    re("button", {className: "open-icons-picker", onClick: this.toggleIconsPicker}, ""),
                    re("div", {className: "input-wrapper"},
                    	re("div", {className: "input-message", ref: this.assignInputMessageRef, contentEditable:true ,onClick: this.onInputMessageClick, onKeyPress: this.onInputKeyDown, onInput: this.onInputMessageChange, onBlur: this.onInputMessageBlur, style: {direction: state.direction}})
					),
                    re("button", {className: "send-message", disabled: state.isEmptyMessage, onClick: this.sendMessage}, "")
				)
			);
		}
	});

    function mapStateToProps(state){
        return {
            selectedGroupId: state.groups.selectedGroupId,
            groupMessages: state.groupMessages.groupMessages,
			users: state.users.users,
            userId: state.authentication.userId
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadGroupMessages: function(groupId){dispatch(action.groupMessages.loadGroupMessages(groupId))},
            sendMessage: function(message, groupId){dispatch(action.groupMessages.sendMessage(message, groupId))},
            resetUnreadMessage: function(groupId){dispatch(action.groupMessages.resetUnreadMessage(groupId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GroupMessagesPage);
})();