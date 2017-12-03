var util = require('../utils/util');
module.exports = {
    loadAll: function () {
        loadScoreConfiguration(require('../initialData/scoreConfiguration.json'));
        loadGames(require('../initialData/Tournament_Worldcup_18.json'));
        //loadGames(require('../initialData/League_Champions_18.json'));
        loadGames(require('../initialData/League_Israel_17-18.json'));
    }
};

function loadGames(gameJSON) {
    util.createMatches(gameJSON.matches);
    util.createTeams(gameJSON.teams);
}

function loadScoreConfiguration(scoreConfigurationJSON) {
    util.createConfiguration(scoreConfigurationJSON.predictionScoreConfiguration);
}