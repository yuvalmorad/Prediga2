window.component = window.component || {};
component.LeaderBoardTile = (function(){
    var Tile = component.Tile,
        LeaderBoardMainTile = component.LeaderBoardMainTile,
		LeaderBoardDetails = component.LeaderBoardDetails;

    return React.createClass({
        getInitialState: function () {
            return {wasOpenInPlace: false};
        },

        onOpenInPlace: function() {
            this.setState({wasOpenInPlace: true});
        },

        render: function() {
            var props = this.props,
                state = this.state,
                borderColor = props.borderColor,
                disableOpen = props.disableOpen,
                isAuthenticatedUser = props.isAuthenticatedUser,
				isActive = true,
                leaderBoardDetailsElem;

            if (state.wasOpenInPlace) {
				leaderBoardDetailsElem = re(LeaderBoardDetails, {userId: props.user._id});
            }

            return re(Tile, {disableOpen: disableOpen, borderLeftColor: borderColor, borderRightColor: borderColor, className: "leader-board-tile" + (isAuthenticatedUser ? " is-user" : "") + (isActive ? "" : " not-active"), openInPlace: true, onOpenInPlace: this.onOpenInPlace},
                re(LeaderBoardMainTile, props),
				leaderBoardDetailsElem
            );
        }
    });

})();


