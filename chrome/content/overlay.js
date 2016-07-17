/**
 * Created by d3 on 14.07.16.
 */
window.addEventListener("load", function(e) {
    startup();
}, false);

window.setInterval(
    function() {
        startup();
    }, 6000); //update date every minute

function startup() {
    var myPanel = document.getElementById("my-panel");
    var date = new Date();
    var day = date.getDay();
    var dateString = date.getFullYear() + "." + (date.getMonth()+1) + "." + date.getDate();
    var timeString = date.getHours() + "." + (date.getMinutes()+1) + "." + date.getSeconds();
    myPanel.label = "Data: " + dateString + " | Czas:" + timeString;
}