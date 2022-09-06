$(document).ready(function () {







    // var monkeyList = new List('leaderboard', {
    //     // valueNames: ['name'],
    //     page: 10,
    //     pagination: true
    // });

    var filterData = [];
    $.ajax({
        type: "GET",
        url: "config.json",
        dataType: "json",
        success: function (data) {
            for (i = 0; i < data.length; i++) {
                if (data[i].quiz2_time == null) {
                    var time = (data[i].total_time_taken).toString();
                } else {
                    var time = (data[i].total_time_taken + data[i].quiz2_time).toString();
                }
                var name = data[i].user_name;
                name = toTitleCase(name);
                //console.log(name);
                if (name.length >= 15) {
                    var res = name.slice(0, 12);
                    name = res.concat("...");
                }
                time = time.slice(0, 4);
                filterData.push({
                    "user_name": name,
                    "score": data[i].score,
                    "total_time_taken": time,
                    "quiz1": data[i].quiz1_score,
                });
            }

            temp(filterData);
        }
    });
});

function temp(data) {
    var score = {
        "players": data
    }
    var playerTempalte = $("#player-template").html();

    var compiledplayerTemplate = Handlebars.compile(playerTempalte);
    $(".player-list-container").html(compiledplayerTemplate(score));
    //console.log(compiledplayerTemplate); 
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}