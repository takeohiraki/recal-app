const keys = require('../config/keys');

 var nodemailer =  {
    sendEmail: function (toUser) {

        const nodemailer = require('nodemailer')
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: keys.gmailUser,
                pass: keys.gmailSecret
            }
        });

        var urlParam = toUser

        let mailOptions = {
            from: keys.gmailUser,
            to: toUser,
            subject: 'Please add an agenda',
            text: 'You created a meeting with someone that uses Recal. You must add an agenda to activate the meeting by going to this link: https://noodle-cal.herokuapp.com/meeting-details/' + urlParam + '/123/123'
        };

        transporter.sendMail(mailOptions, function (e, r) {
            if (e) {
                console.log(e);
            }
            else {
                console.log(r);
            }
            transporter.close();
        });
    },
    readEmail: function () {
        var emails = []

        var Imap = require('imap'),
            inspect = require('util').inspect;
        var fs = require('fs'), fileStream;
        var buffer = '';

        var myMap;

        var imap = new Imap({
            user: keys.gmailUser,
            password: keys.gmailSecret,
            host: "imap.gmail.com", //this may differ if you are using some other mail services like yahoo
            port: 993,
            tls: true,
            connTimeout: 10000, // Default by node-imap 
            authTimeout: 5000, // Default by node-imap, 
            debug: console.log, // Or your custom function with only one incoming argument. Default: null 
            tlsOptions: { rejectUnauthorized: false },
            mailbox: "INBOX", // mailbox to monitor 
            // searchFilter: ["UNSEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved 
            // markSeen: true, // all fetched email willbe marked as seen and not fetched next time 
            fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`, 
            mailParserOptions: { streamAttachments: true }, // options to be passed to mailParser lib. 
            attachments: true, // download attachments as they are encountered to the project directory 
            attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments 
        });

        function openInbox(cb) {
            imap.openBox('INBOX', false, cb);
        }

        imap.once('ready', function () {
            openInbox(function (err, box) {
                if (err) throw err;
                // imap.search(['UNSEEN', ['SUBJECT', 'Give Subject Here']], function (err, results) {
                imap.search(['UNSEEN', ['SINCE', 'January 1, 2018']], function (err, results) {
                    if (err) throw err;
                    var f = imap.fetch(results, { bodies: '1', markSeen: false });
                    f.on('message', function (msg, seqno) {
                        // console.log('Message #%d' + seqno);
                        // console.log('Message type' + msg.text)
                        var prefix = '(#' + seqno + ') ';
                        msg.on('body', function (stream, info) {
                            stream.on('data', function (chunk) {
                                buffer += chunk.toString('utf8');
                                
                                // console.log("BUFFER" + buffer)

                            })
                            stream.once('end', function () {
                                if (info.which === '1') {
                                    console.log("BUFFER: " + buffer)
                                    console.log("test1")
                                    emails.push(buffer)
                                    console.log("test2")
                                }
                            });
                            // console.log(prefix + 'Body');
                            // stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));


                            console.log("!")
                            console.log("!")
                            console.log("!")
                            // console.log(results)

                        });
                        msg.once('attributes', function (attrs) {
                            // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                        });
                        msg.once('end', function () {
                            // console.log(prefix + 'Finished');
                        });
                    });
                    f.once('error', function (err) {
                        console.log('Fetch error: ' + err);
                    });
                    f.once('end', function () {
                        console.log('Done fetching all messages!');
                        imap.end();
                    });
                });
            });
        });

        imap.once('error', function (err) {
            console.log(err);
        });

        imap.once('end', function () {
            console.log('Connection ended');
        });

        imap.connect();

        console.log("emails")
        console.log(emails)
    }
};

module.exports = nodemailer;
