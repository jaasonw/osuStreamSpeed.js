// i suck at variable naming

clickTimes = [];
deviations = [];
timediffs = [];
testrunning = false;
function beginTest() {
    testrunning = true;
    clickLimit = Math.round(parseInt(document.getElementById('clickNum').value));
    if (clickLimit < 3)
    {
        alert("Please enter a value larger than 3");
        testrunning = false;
        return false;
    }
    clickTimes.length = 0;
    deviations.length = 0;
    timediffs.length = 0;
    beginTime = -1;
    key1 = $('#key1').val();
    key2 = $('#key2').val();
    $("div#status").html("Test ready, press key 1 or key 2 to begin.");
    $("div#Result").html("\
        You clicked 0 times in 0 seconds.<br>\
        Your stream speed is 0 bpm\
    ");
    localStorage.setItem('clickLimit', clickLimit);
    localStorage.setItem('key1', key1);
    localStorage.setItem('key2', key2);
    std = 0;
    return true;
}
$(document).keypress(function(event)
{
    if (event.keyCode == 13 && testrunning == false)
        beginTest();
    if (testrunning == true)
    {
        if (String.fromCharCode(event.which) == key1 || String.fromCharCode(event.which) == key2)
        {
            switch (beginTime)
            {
                case -1:
                    beginTime = Date.now();
                    //clickTimes[0] = beginTime;
                    $("div#status").html("Test currently running.");
                default:
                    if (clickTimes.length + 1 <= clickLimit)
                    {
                        if (timediffs.length > 3)
                        {
                            sum = timediffs.reduce(function(a, b){return a + b});
                            avg = sum / timediffs.length;
                            $.each(timediffs, function(i,v) {
                                deviations[i] = (v - avg) * (v - avg);
                            });
                            variance = deviations.reduce(function(a, b) {return a + b;});
                            std = variance / deviations.length;
                        }
                        clickTimes.push(Date.now());
                        if (clickTimes.length > 1)
                            timediffs.push(clickTimes[clickTimes.length - 1] - clickTimes[clickTimes.length - 2]);
                        else
                            timediffs.push(Date.now() - beginTime);

                        //clickTimes.push(Date.now() - clickTimes[clickTimes.length - 1]);

                        streamtime = (Date.now() - beginTime)/1000;
                        $("div#Result").html("\
                            You clicked " + clickTimes.length.toString() + " times in " + streamtime.toString() + " seconds.<br>\
                            Your stream speed is " + (Math.round((((clickTimes.length) / (Date.now() - beginTime) * 60000)/4) * 100) / 100).toString() + " bpm.<br>\
                            Your standard deviation is: " + Math.round(Math.sqrt(std)* 100) / 100 + ".\
                        ");
                    }
                    break;
            }
            if (clickTimes.length == clickLimit)
            {
                testrunning = false;
                beginTime = -1;
                $("button#submit").html("Retry");
                $("div#status").html("Time starts when you make your first click.");
                return;
            }
        }
    }
})
$(document).ready(function() {
    if(!localStorage.getItem('clickLimit'))
        $("input#clickNum").val("20");
    else
        $("input#clickNum").val(localStorage.getItem('clickLimit'));
    if(!localStorage.getItem('key1'))
        $("input#key1").val("z");
    else
        $("input#key1").val(localStorage.getItem('key1'));
    if(!localStorage.getItem('key2'))
        $("input#key2").val("x");
    else
        $("input#key2").val(localStorage.getItem('key2'));
});