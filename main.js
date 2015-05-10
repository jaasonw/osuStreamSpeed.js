clickNum = [];
testrunning = false;
function beginTest() {
    if (testrunning == false)
    {
        testrunning = true;
        clickLimit = parseInt(document.getElementById('clickNum').value);
        clickNum.length = 0;
        beginTime = Date.now();
    }
    else
        return;
}
$(document).keypress(function(event) {
    if (testrunning == true)
    {
        if (String.fromCharCode(event.which) == document.getElementById('key1').value || String.fromCharCode(event.which) == document.getElementById('key2').value) {
            if (clickNum.length + 1 <= clickLimit)
            {
                clickNum.push(Date.now() - clickNum[clickNum.length]);
                streamtime = (Date.now() - beginTime)/1000;
                document.getElementById('Result').innerHTML = "\
                    You clicked " + clickNum.length.toString() + " times in " + streamtime.toString() + " seconds.<br>\
                    Your stream speed is " + ((clickNum.length) / streamtime * 60).toString() + " bpm\
                ";
            }
            else {
                testrunning = false;
                return;
            }
        }
    }
})

