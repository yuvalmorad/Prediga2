component.LeaderBoardPage = (function(){
    var connect = ReactRedux.connect,
        LeaderBoardTiles = component.LeaderBoardTiles;

    var isLeaderBoardRequestSent = false;

    var LeaderBoardPage = React.createClass({
        getInitialState: function() {
            if (!isLeaderBoardRequestSent && this.props.leadersStatus === utils.action.REQUEST_STATUS.NOT_LOADED) {
                this.props.loadLeaderBoard(this.props.leadersStatus);
                isLeaderBoardRequestSent = true;
            }

            return {};
        },

        render: function() {
            return re("div", { className: "content" },
                re(LeaderBoardTiles, {leaders: this.props.leaders, users: this.props.users})
            );
        }
    });

    function mapStateToProps(state){
        return {
            leaders: state.leaderBoard.leaders,
            leadersStatus: state.leaderBoard.status,
            users: state.users.users
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadLeaderBoard: function(){dispatch(action.leaderBoard.loadLeaderBoard())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LeaderBoardPage);
})();


