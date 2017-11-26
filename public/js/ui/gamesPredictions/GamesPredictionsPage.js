component.GamesPredictionsPage = (function(){
    var connect = ReactRedux.connect;
    var GamePredictionTile = component.GamePredictionTile;

    var isGamesPredictionsRequestSent = false;

    var GamesPredictionsPage = React.createClass({
        getInitialState: function() {
            if (!isGamesPredictionsRequestSent) {
                this.props.loadGamesPredictions();
                isGamesPredictionsRequestSent = true;
            }

            return {};
        },

        render: function() {
            var games = this.props.gamesPredictions.games;
            var tiles = games.sort(function(game1, game2){
                return game1.date - game2.date;
            }).map(function(game){
                return re(GamePredictionTile, {game: game, key: game.id});
            });

            return re("div", { className: "content" + (this.props.isShowTileDialog ? " no-scroll" : "") },
                tiles
            );
        }
    });

    function mapStateToProps(state){
        return {
            gamesPredictions: state.gamesPredictions,
            isShowTileDialog: state.general.isShowTileDialog
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadGamesPredictions: function(){dispatch(action.gamesPredictions.loadGames())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GamesPredictionsPage);

})();


