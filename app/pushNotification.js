const webpush = require('web-push');
const vapidKeys = {
    publicKey: "BI75psBX1HkM6jpcXdEYKNV41ZZdzQU_pJf7sS_1V6r3mE-83ptsqjZ7pIVT9sfHc4ThRgc_YAnaS3XSE-igB98",
    privateKey: "y3EXBZQx5zcICy6vDEBjYWkos3HqKvNvt-AoPp8Upnc"
};

webpush.setVapidDetails(
    'mailto:shacharw6@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

let self = module.exports = {
    pushTest: function() {
        //should get all subscription from db
        var subscriptionTest = {"endpoint":"https://fcm.googleapis.com/fcm/send/dDYEMPtN7Qg:APA91bG2-zTYH1_n9KxYmqqlzdJBTEKGZEA6s0NE59cY38tSOxW3OvuQFaV2W4shzrLwz3R5zfou4ZIQUZ9CEZv_rIEHN1UBtBILfWxRoNF6rCf0hCVRKStDk2n77dUYBoDSFlfLiRcU","expirationTime":null,"keys":{"p256dh":"BFm_7XvtfV7Bl7A6iBGAB3U350vUFRVEXvXrXP2PSRe1D-iScwy7bE06dMKI2ORrWEVkCtCmob-pOy2ndhv5OsQ=","auth":"8io_IGtgeuxsd7Acv4u3PA=="}};
        webpush.sendNotification(subscriptionTest, "some tile test")
    }
};

