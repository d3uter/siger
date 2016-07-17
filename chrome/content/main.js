/**
 * Created by d3 on 15.07.16.
 */
/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Signature Fixer.
 *
 * The Initial Developer of the Original Code is
 * Adan Rehtla <djravine@wowps.org>.
 * Portions created by the Initial Developer are Copyright (C) 2012
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): Adan Rehtla <djravine@wowps.org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


if ("undefined" == typeof(signaturefixer)) {

    var signaturefixer = function () {

        return {

            // FUNCTION: init
            init : function () {
                //alert("Signature Fixer - INIT");
                document.getElementById("msgIdentityPopup").onclick = function() { signaturefixer.run(); }
            },








            // FUNCTION: cursor_top
            cursor_top : function () {
                //alert("Signature Fixer - CURSOR_TOP");
                var element = document.getElementById("content-frame").contentDocument.head;
                var editor = window.gMsgCompose.editor; //"email mesage" field
                var range = editor.document.createRange();
                range.setStartAfter(element);
                range.setEndAfter(element);
                editor.selection.removeAllRanges();
                editor.selection.addRange(range);
            },









            // FUNCTION: remove_sig
            remove_sig : function (v_prefix,v_suffix) {
                //alert("Signature Fixer - REMOVE_SIG");

                // GET MESSAGE CONTENT
                var msgcomposeWindow = document.getElementById( "msgcomposeWindow" );
                var msg_type = msgcomposeWindow.getAttribute( "msgtype" );
                if( !(msg_type == nsIMsgCompDeliverMode.Now || msg_type == nsIMsgCompDeliverMode.Later) ) return;
                var editor = window.gMsgCompose.editor; //"email mesage" field
                var html_editor = editor.QueryInterface(Components.interfaces.nsIHTMLEditor);
                var msg = editor.outputToString('text/html', editor.eNone);

                // PARSE THRU MESAGE CONTENT
                var start_pos = msg.indexOf(v_prefix);
                var end_pos = msg.indexOf(v_suffix,start_pos) + v_suffix.length;
                //alert('REMOVE_SIG\n\nSTART POS: '+start_pos+' (\''+v_prefix+'\')\nEND POS: '+end_pos+' (\''+v_suffix+'\')');
                if ( start_pos != -1 ) {

                    var msg = msg.substring(0,start_pos) + msg.substring(end_pos,msg.length);

                    // TRASH HTML THAT MAY APPEAR
                    var msg = msg.replace('<div class="moz-signature"></div>','');
                    var msg = msg.replace('<div class="moz-signature">\n</div>','');
                    var msg = msg.replace('  <div class="moz-signature">\n  </div>','');
                    var msg = msg.replace('\n','');
                    var msg = msg.replace('<br>','');
                    var msg = msg.replace('&lt;head&gt;','');
                    var msg = msg.replace('\n<head>\n','');
                    var msg = msg.replace('\n<head> ','');

                    // SAVE MESSAGE CONTENT
                    html_editor.rebuildDocumentFromSource('');
                    html_editor.insertHTML(msg);
                }

                //alert('REMOVE_SIG\n\nMESSAGE:\n'+msg);
            },





            // FUNCTION: remove_tag
            remove_tag : function (v_prefix) {
                //alert("Signature Fixer - REMOVE_TAG");

                // GET MESSAGE CONTENT
                var msgcomposeWindow = document.getElementById( "msgcomposeWindow" );
                var msg_type = msgcomposeWindow.getAttribute( "msgtype" );
                if( !(msg_type == nsIMsgCompDeliverMode.Now || msg_type == nsIMsgCompDeliverMode.Later) ) return;
                var editor = window.gMsgCompose.editor; //"email mesage" field
                var html_editor = editor.QueryInterface(Components.interfaces.nsIHTMLEditor);
                var msg = editor.outputToString('text/html', editor.eNone);

                // PARSE THRU MESAGE CONTENT
                var comment_start_pos = msg.indexOf(v_prefix);
                var comment_start_pos_end = comment_start_pos + v_prefix.length;
                while ( comment_start_pos != -1 ) {

                    //alert('REMOVE_TAG\n\nSTART POS: '+comment_start_pos+' (\''+v_prefix+'\')\nEND POS: '+comment_start_pos_end+' (\''+v_prefix+'\')');
                    var msg = msg.substring(0,comment_start_pos) + msg.substring(comment_start_pos_end,msg.length);
                    var comment_start_pos = msg.indexOf(v_prefix);
                    var comment_start_pos_end = comment_start_pos + v_prefix.length;

                    // SAVE MESSAGE CONTENT
                    html_editor.rebuildDocumentFromSource('');
                    html_editor.insertHTML(msg);
                }

                //alert('REMOVE_TAG\n\nMESSAGE:\n'+msg);
            },



            // FUNCTION: remove_tag
            remove_tag_set : function (v_prefix,v_suffix,sig_prefix) {
                //alert("Signature Fixer - REMOVE_TAG_SET");

                // GET MESSAGE CONTENT
                var msgcomposeWindow = document.getElementById( "msgcomposeWindow" );
                var msg_type = msgcomposeWindow.getAttribute( "msgtype" );
                if( !(msg_type == nsIMsgCompDeliverMode.Now || msg_type == nsIMsgCompDeliverMode.Later) ) return;
                var editor = window.gMsgCompose.editor; //"email mesage" field
                var html_editor = editor.QueryInterface(Components.interfaces.nsIHTMLEditor);
                var msg = editor.outputToString('text/html', editor.eNone);

                // PARSE THRU MESAGE CONTENT
                var comment_start_pos = msg.indexOf(v_prefix);
                var comment_start_pos_end = comment_start_pos + v_prefix.length;
                var comment_end_pos = msg.indexOf(v_suffix,comment_start_pos);
                var comment_end_pos_end = comment_end_pos + v_suffix.length;
                while ( comment_start_pos != -1 ) {

                    //alert('REMOVE_TAG_SET\n\nSTART POS: '+comment_start_pos+' (\''+v_prefix+'\')\nEND POS: '+comment_end_pos+' (\''+v_suffix+'\')');
                    if (  v_prefix == sig_prefix ) {
                        var msg = msg.substring(0,comment_start_pos) + '<br/>' + msg.substring(comment_start_pos_end, comment_end_pos) + msg.substring(comment_end_pos_end,msg.length);
                    } else {
                        var msg = msg.substring(0,comment_start_pos) + msg.substring(comment_start_pos_end, comment_end_pos) + msg.substring(comment_end_pos_end,msg.length);
                    }
                    var comment_start_pos = msg.indexOf(v_prefix);
                    var comment_start_pos_end = comment_start_pos + v_prefix.length;
                    var comment_end_pos = msg.indexOf(v_suffix,comment_start_pos);
                    var comment_end_pos_end = comment_end_pos + v_suffix.length;

                    // SAVE MESSAGE CONTENT
                    html_editor.rebuildDocumentFromSource('');
                    html_editor.insertHTML(msg);
                }
                //alert('REMOVE_TAG_SET\n\nMESSAGE:\n'+msg);
            },











            // FUNCTION: run
            run : function () {
                //alert("Signature Fixer - RUN");

                // GET SIGNATURE PREFERENCES
                var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getBranch("extensions.siger.");
                prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
console.log(prefs);
                var vprefix = prefs.getCharPref("prefix");
                var vsuffix = prefs.getCharPref("suffix");
                //alert("PREFIX: " + vprefix + "\nSUFFIX: " + vsuffix );

                // FIND AND REMOVE SIGNATURE TEXT (BETWEEN PREFIX AND SUFFIX)
                signaturefixer.remove_sig(vprefix,vsuffix);
                signaturefixer.cursor_top();
            },


            // FUNCTION: send
            send : function (e) {
                //alert("Signature Fixer - SEND");

                // GET SIGNATURE PREFERENCES
                var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getBranch("extensions.siger.");
                prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
                var vprefix = prefs.getCharPref("prefix");
                var vsuffix = prefs.getCharPref("suffix");

                // CHECK FOR BAD COMMENTS
                signaturefixer.remove_tag('<head>');
                signaturefixer.remove_tag_set('<!--[if !supportLists]-->','<!--[endif]-->',vprefix);

                // FIND AND REMOVE PREFIX AND SUFFIX
                signaturefixer.remove_tag_set(vprefix,vsuffix,vprefix);
                signaturefixer.cursor_top();
            }

        };
    }();
}

window.addEventListener("load", signaturefixer.init, false);
window.addEventListener("compose-send-message", signaturefixer.send, true);

