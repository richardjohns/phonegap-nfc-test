var app = {
    initialize: function() {
        this.bind()
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false)
    },
    deviceready: function() {
        // note that this is an event handler so the scope is that of the event
        // so we need to call app.report(), and not this.report()
        app.report('deviceready')
        
        // Read NDEF formatted NFC Tags
        nfc.addNdefListener (
            function (nfcEvent) {
                //var tag = nfcEvent.tˀag,
                var tag = nfcEvent.tag
                ndefMessage = tag.ndefMessage;

                // dump the raw json of the message
                // note: real code will need to decode
                // the payload from each record
                app.display(JSON.stringify(ndefMessage));

                // assuming the first record in the message has 
                // a payload that can be converted to a string.
                app.display(nfc.bytesToString(ndefMessage[0].payload).substring(3));
            }, 
            function () { // success callback
                // Don't use an alert in real code, this will just confirm things are working
                app.display("APP status: Waiting for NDEF tag");
            },
            function (error) { // error callback
                console.log("APP status: Error adding NDEF listener " + JSON.stringify(error));
            }
        )

        nfc.addTagDiscoveredListener(
            app.onNFC, // eventhandler called when tag scanned
            function (status) { // listener successfully initialised
                app.display("APP.ONNFC Status: Tap a tag to read its ID number")
            },
            function (error) {
                app.display2("APP.ONNFC Status: NFC reader failed to initialise: " + JSON.stringify(error))
            }
        )
    },

    onNfc: function (nfcEvent) {
        var tag = nfc.Event.tag
        app.display("Read tag: " + nfc.bytesToHexString(tag.id))
    },

    display: function (message) {
        var label = document.createTextNode(message)
        lineBreak = document.createElement("br")
        messageDiv.appendChild(lineBreak)
        messageDiv.appendChild(label)
    },

    display2: function (message) {
        var label = document.createTextNode(message)
        lineBreak = document.createElement("br")
        messageDiv2.appendChild(lineBreak)
        messageDiv2.appendChild(label)
    },

    clear: function (message) {
        messageDiv.innerHTML = ""
    },

    report: function(id) { 
        console.log("report:" + id);
        // hide the .pending <p> and show the .complete <p>
        document.querySelector('#' + id + ' .pending').className += ' hide';
        var completeElem = document.querySelector('#' + id + ' .complete');
        completeElem.className = completeElem.className.split('hide').join('');
    }
};

/*global NdefPlugin, Ndef */

function writeTag(nfcEvent) {
    // ignore what's on the tag for now, just overwrite

    var mimeType = document.forms[0].elements["mimeType"].value,
        payload = document.forms[0].elements["payload"].value,
        record = ndef.mimeMediaRecord(mimeType, nfc.stringToBytes(payload));

    nfc.write(
        [record],
        function () {
            window.plugins.toast.showShortBottom("Wrote data to tag.");
            navigator.notification.vibrate(100);
        },
        function (reason) {
            navigator.notification.alert(reason, function () {}, "There was a problem");
        }
    );
}

var ready = function () {

    function win() {
        app.display("READY Status: Listening for NDEF tags");
    }

    function fail() {
        app.display('READY Status: Failed to register NFC Listener');
    }

    nfc.addTagDiscoveredListener(writeTag, win, fail);

    document.addEventListener("volumeupbutton", showSampleData, false);
    document.addEventListener("volumedownbutton", showSampleData, false);

};

var data = [{
        mimeType: 'text/pg',
        payload: 'Hello PhoneGap'
    },
    {
        mimeType: 'text/plain',
        payload: 'Hello PhoneGap'
    },
    {
        mimeType: 'text/x-vCard',
        payload: 'BEGIN:VCARD\n' +
            'VERSION:2.1\n' +
            'N:Coleman;Don;;;\n' +
            'FN:Don Coleman\n' +
            'ORG:Chariot Solutions;\n' +
            'URL:http://chariotsolutions.com\n' +
            'TEL;WORK:215-358-1780\n' +
            'EMAIL;WORK:dcoleman@chariotsolutions.com\n' +
            'END:VCARD'
    },
    {
        mimeType: 'text/x-vCard',
        payload: 'BEGIN:VCARD\n' +
            'VERSION:2.1\n' +
            'N:Griffin;Kevin;;;\n' +
            'FN:Kevin Griffin\n' +
            'ORG:Chariot Solutions;\n' +
            'URL:http://chariotsolutions.com\n' +
            'TEL;WORK:215-358-1780\n' +
            'EMAIL;WORK:kgriffin@chariotsolutions.com\n' +
            'END:VCARD'
    },
    {
        mimeType: 'game/rockpaperscissors',
        payload: 'Rock'
    },
    {
        mimeType: '',
        payload: ''
    }
];

var index = 0;

function showSampleData(e) {

    var mimeTypeField = document.forms[0].elements["mimeType"],
        payloadField = document.forms[0].elements["payload"];

    if (e.type === 'volumedownbutton') {
        index--;
    } else {
        index++;
    }

    if (index >= data.length) {
        index = 0;
    } else if (index < 0) {
        index = data.length - 1;
    }

    var record = data[index];
    mimeTypeField.value = record.mimeType;
    payloadField.value = record.payload;
}

