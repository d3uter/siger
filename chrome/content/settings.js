/**
 * Created by d3 on 16.07.16.
 */


/**
 * Inicjalizacja
 */
Siger = {

    var accounts;

    init: function init() {
        //aktualizacja preferencji dla pola file
        updateFileLabel("sig-path");
        //tworzenie listy kont
        fillAccountMenuList("acoMenuList");

    },


    addCheckbox: function addCheckbox() {

        var acoTabbox = document.getElementById("aBox");
        var ele = document.createElement("checkbox");

        ele.setAttribute("id", "A new Button");
        ele.setAttribute("label", "A new Button");
        aBox.appendChild(button);
    },

    /**
     * Tworzy liste kont
     * @param list_id
     */
    fillAccountMenuList: function fillAccountMenuList(list_id) {

        var accounts = getAccounts();
        var acoMenuList = document.getElementById(list_id);

        for (var i = 0; i < accounts.length; i++) {
            label = accounts[i][1] + " [" + accounts[i][2] + "]: " + accounts[i][3];
            value = accounts[i][0];
            acoMenuList.appendItem(label, value);
        }
        //set first item
        acoMenuList.selectedIndex = 0;
        //set related account val
        selectAccount(accounts[0][0]);
    },

    selectAccount: function selectAccount(id) {

        var accountPrefBox = document.getElementById("accountPrefBox");

        var ele = document.createElement("checkbox");
        ele.setAttribute("id", "accountPrefCheckbox");
        ele.setAttribute("class", "acc-chk");
        ele.setAttribute("label", id);

        while (accountPrefBox.hasChildNodes()) {
            accountPrefBox.removeChild(accountPrefBox.firstChild);
        }

        accountPrefBox.appendChild(ele);
    },

    createAccountTabPanel: function createAccountTabPanel() {

        var root = document.getElementById("acountTabbox");

        label = accounts[i][1] + " [" + accounts[i][2] + "]: " + accounts[i][3];
        value = accounts[i][0];
        acoMenuList.appendItem(label, value);
    },


// Switch Identity (from account setting window)		// add 0.4.0 S
//--------------------------------------------------------------------
    switchIdentity: function switchIdentity(idKey) {

        let el = document.getElementById("msgIdentityPopup").firstChild,
            index = 0;

        while (el) {
            if (el.getAttribute("value") == idKey) {
                // el.value could not access.. why??
                document.getElementById("msgIdentity").selectedIndex = index;
                // no fire event with set selectedIndex/selectedItem.. why??
                this.selectIdentity(idKey);
                break;
            }
            el = el.nextSibling;
            index++;
        }
    },


    selectIdentity: function selectIdentity(idkey) {

        let currentDeck = this.getCurrentDeck(SmartTemplate4.Settings.accountId),
            tabbox = document.getElementById(currentDeck);
        if (!tabbox)
            alert("A problem has occured: Cannot find account settings: " + currentDeck); // this shouldn't happen, ever!
        let tabIndex = tabbox.selectedIndex;

        const branch = (idkey == "common") ? ".common" : "." + idkey;

        // Display identity.
        let deck = document.getElementById("account_deckA"),
            index = 0,
            searchDeckName = "deckA.per_account" + branch,
            found = false;

        for (let el = deck.firstChild; el; el = el.nextSibling) {
            if (el.id == searchDeckName) {
                deck.selectedIndex = index;
                this.accountKey = branch;
                found = true;
                break;
            }
            index++;
        }

        // nothing found, then we are in common! (changed from previous behavior where common accountKey was "", now it is ".common"
        if (!found) {
            deck.selectedIndex = 0;
            this.accountKey = branch;
        }

        //reactivate the current tab: new / respond or forward!
        currentDeck = this.getCurrentDeck(SmartTemplate4.Settings.accountId);
        tabbox = document.getElementById(currentDeck);
        if (tabbox) {
            tabbox.selectedIndex = tabIndex;
            let txtDump = '',
                tabboxArray = tabbox.getElementsByTagName('textbox');
            for (let i = 0; i < tabboxArray.length; i++)
                txtDump += tabboxArray[i].value;  // append all texts
            // disable / enable Save button in case template is empty
            let disableSave = (txtDump.length === 0) && (document.getElementById('use_default.' + this.currentId).checked === true);
            document.getElementById('btnSaveTemplate').disabled = disableSave;
        }
    },


    /**
     * Aktualizuje label pola e_id z waertości elementu o id pobranego z pola o e_id->argument:preference
     * (Nazwa pliku z zapisanych preferencji)
     * @param e_id string
     */
    updateFileLabel: function updateFileLabel(e_id) {

        var e = document.getElementById(e_id);
        var preference_id = e.getAttribute('preference');
        var prefField = document.getElementById(preference_id);
        var file = prefField.value;

        //Update UI
        e.label = file.path;
    }

    /**
     * Pobierz liste kont
     * @returns {Array}
     */
    getAccounts: function getAccounts() {

        var accountIdList = [];

        var accountManager = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);
        var accounts = accountManager.accounts;

        for (var i = 0; i < accounts.length; i++) {
            var account = accounts.queryElementAt(i, Components.interfaces.nsIMsgAccount);
            var server = account.incomingServer;
            if (server.type == "pop3" || server.type == "imap") {

                //accountName = server.realHostName + " " + server.realUsername;
                accountIdList.push([account.key, server.prettyName, server.type, server.realHostName]);
                //Application.console.log(account.key+" | " + accountName);
            }
        }

        return accountIdList;
    },

    browseApp: function browseApp(fieldId) {
        var nsIFilePicker = Components.interfaces.nsIFilePicker;
        var filePicker = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        var field_id = fieldId;
        filePicker.init(window, "Select a Application", nsIFilePicker.modeOpen);
        filePicker.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterText);

        var rv = filePicker.show();
        if (rv == nsIFilePicker.returnOK) {
            var file = filePicker.file;
            var fileField = document.getElementById(field_id);
            var preference_id = fileField.getAttribute('preference');
            var prefField = document.getElementById(preference_id);

            //UPDATE PREFERENCES
            prefField.value = file;

            //UPDATE UI
            fileField.file = file;
            fileField.label = file.path;
        }
    },

}
window.addEventListener("load", init(), false);