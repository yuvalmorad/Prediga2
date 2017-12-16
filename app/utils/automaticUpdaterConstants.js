module.exports = {
    COMPETITION: {
        ISRAEL: 42
    },
    parseName: function (rawName) {
        switch (rawName) {
            case "מכבי פתח תקוה":
                return 'Maccabi Petach Tikva';
            case "מ.ס. אשדוד":
                return 'FC Ashdod';
            case "בני סכנין":
                return 'Bnei Sakhnin';
            case "הפועל עכו":
                return 'Hapoel Akko';
            case "הפועל אשקלון":
                return 'Hapoel Ashkelon';
            case "הפועל חיפה":
                return 'Hapoel Haifa';
            case "מכבי חיפה":
                return 'Maccabi Haifa';
            case "בני יהודה ת\"א":
                return 'Bnei Yehuda';
            case "עירוני קרית שמונה":
                return 'Kiryat Shmona';
            case "הפועל רעננה":
                return 'Hapoel Raanana';
            case "מכבי נתניה":
                return 'Maccabi Netanya';
            case "הפועל באר שבע":
                return 'Hapoel Beer Sheva';
            case "בית\"ר ירושלים":
                return 'Beitar Jerusalem';
            case "מכבי תל אביב":
                return 'Maccabi Tel Aviv';

            default:
                return '';
        }
    }
};

