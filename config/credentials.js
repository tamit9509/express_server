"use strict";

/******************************************
 ****** Credentials Configuration ******
 ******************************************/
let credentials = {
    SENDINBLUE: {
        API_KEY: 'dummy',
        SENDER_EMAIL: 'contact@chicmic.in'
    },
    SMTP: {
        TRANSTPORT: {
            host: "webcloud5.uk.syrahost.com",
            port: 465,
            secure: true,
            auth: {
                user: "erpadmin@chicmic.co.in",
                pass: ")Q}UQvb^cFU$"
            },
        },
        SENDER: 'ERP Admin <erpadmin@chicmic.co.in>',
    },
    FCM: {
        API_KEY: 'AIzaSyCUeSXr7v6CXuu4vKlzliK_VHqA4ytyX7E'
    }
};

module.exports = credentials;