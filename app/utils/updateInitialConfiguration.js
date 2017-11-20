var util = require('../utils/util');
module.exports = {
    loadAll: function () {
        loadScoreConfiguration(require('../initialData/scoreConfiguration.json'));
        loadGames(require('../initialData/worldcup18.json'))
    }
};

function loadGames(gameJSON) {
    util.createMatches(gameJSON.matches);
    util.createTeams(gameJSON.teams);
}

function loadScoreConfiguration(scoreConfigurationJSON) {
    util.createConfiguration(scoreConfigurationJSON.predictionScoreConfiguration);
}