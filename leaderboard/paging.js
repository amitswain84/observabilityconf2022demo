$(document).ready(function () {

    var user = [];
    let user_array = [];
    var url = "https://y1m1c7wq22.execute-api.ap-south-1.amazonaws.com/prod/event/737c3a44-759a-4927-9384-ce50e6cfdc10/referral";
    // var params = "event-id=konfhub-eventeada8d30";
    var http = new XMLHttpRequest();
    var myJSON, user_details;
    http.open("GET", url, true);
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            // console.log(http.responseText)

            user_details = http.responseText;
            // console.log(user_details);

            myJSON = JSON.parse(user_details);
            // console.log(myJSON.user_details[0].no_of_referrals);
            let count_ref = 0,
                finalArray = [];



            myJSON.user_details.map(item => {
                // console.log(item)
                user_array.push([item.rank, item.user_name + "_" + item.url, item.no_of_referrals])
                finalArray.push([item.rank, item.url])


            })

            console.log(user_array);



            // console.log(finalArray)

            for (var i = 0; i < user_array.length; i++) {
                count_ref = parseInt(user_array[i][2] + count_ref);


            }
            // console.log(count_ref)
            document.getElementById("msgs").innerHTML = count_ref;
            var events = $('#events');
            var table = $('#example').DataTable({
                // "ajax": "data/objects.txt",

                data: user_array,
                "columns": [{
                        title: "Rank"
                    },
                    {
                        title: "Name",
                        "mRender": function(Name){
                            name = Name.split("_")[0]
                            utm_code = Name.split("?")[1].split("&")[0].split("=")[1];
                            link_tw = 'https://twitter.com/intent/tweet?url=akd.konfhub.com/?utm_source=' + utm_code + '%26utm_medium=email%26utm_campaign=referral%20&text=Join%20me%20at%20%23AzureKubernetesDay%20to%20attend%20exciting%20sessions%20on%20Kubernetes%20on%2030%20January%202021%2E%20For%20registration%20and%20event%20details:For registration and event details:'
                            // console.log(Name); For registration and event details: akd.konfhub.com/?utm_source=21a83f93&utm_medium=social&utm_campaign=referral
                            return name + '&nbsp;&nbsp;  <a href="'+ link_tw +'" id="'+name+'" class="gayab" target="_blank"><img src="img/Logos/tweet icon.png" class="fb-img" alt="No image"></a>'
                        }
                    },
                    {
                        title: "No. of Referrals"
                    },
                ]
            });

            let arr_to_find;

            $('#example tbody').on('click', 'tr', function () {
                // if ($(this).hasClass('selected')) {
                //     $(this).removeClass('selected');
                // } else {
                //     table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                arr_to_find = $(this).addClass('selected')[0].innerHTML;
                // console.log(arr_to_find)
                // console.log("data")
                // let vars = arr_to_find.search("\">");
                // let vars1 = arr_to_find.search("</td>");
                // console.log(vars1)
                // arr_to_find = arr_to_find.slice(vars + 2)
                // console.log(arr_to_find)


                var mySubString = arr_to_find.substring(
                    arr_to_find.lastIndexOf("\">") + 2,
                    arr_to_find.indexOf("</td>")
                );

                // console.log(mySubString)
                let url_final;
                finalArray.map(item => {
                    // console.log(item[0])
                    if (item[0] == mySubString) {
                        // console.log(item[1])
                        url_final = item[1];
                    }
                })

                // var a = document.createElement('a');
                // var linkText = document.createTextNode("my title text");
                // a.appendChild(linkText);
                // a.title = "my title text";
                // a.href = url_final;
                // document.body.appendChild(a);
                // let cyz = url_final.search("\&") + 1
                // // console.log(url_final.search("\&") + 1);
                // // console.log(url_final.slice(0, cyz) + "\\" + url_final.slice(cyz));
                // var name = "Bob";
                // let ebody = "Hi,%0D%0DI am attending Cloud Community Days - a 3 - day, online / virtual, developer - focused, single track conference on modern cloud technologies focusing on Containers / Kubernetes, Artificial Intelligence and Machine Learning, DevOps, Serverless, and more.This is a free conference.I am referring you to attend this conference - join by clicking this URL and register yourself: ";
                // let ebody_url = url_final;
                // // let ebody_url = ebody_url.link(url_final);

                function sendMail() {
                    var link = "mailto:?" +
                        "?cc=" +
                        "&subject=App Build Link Buit With MWFPRO's App Build Tool" +
                        "&body=" + ebody + ebody_url.link(url_final.slice(0, cyz) + "\\" + url_final.slice(cyz));
                    window.location.href = link;
                }

                // sendMail();

                // window.location.href = "mailto:?subject=Join%20me%20in%20the%20Cloud%20Community%20Days%20Conference&body=/{document.getElementById('alert-msg').innerHTML}";
                // window.location.href = "mailto:?subject=Join%20me%20in%20the%20Cloud%20Community%20Days%20Conference&body=Hi,<br />I am attending Cloud Community Days - a 3-day, online/virtual, developer-focused, single track conference on modern cloud technologies focusing on Containers/Kubernetes, Artificial Intelligence and Machine Learning, DevOps, Serverless, and more. This is a free conference. I am referring you to attend this conference - join by clicking this URL and register yourself: {url_final}. ";

                // Best Regards, 
                // <<Name>>";
                // window.location.href = "mailto:user@example.com?subject=Join%20me%20in%20the%20Cloud%20Community%20Days%20Conference&body=message%20goes%20here";


                // }

                for (let i = 0; i < finalArray.length; i++) {

                }
            });

            $('#button').click(function () {
                table.row('.selected').remove().draw(false);
                // console.log(table.row('.selected').remove().draw(false))
            });


        }
    }

    http.send(null);




});



// const _data = [
//     ["3", "Sheldon", "20"],
//     ["2", "Leonard", "35"],
//     ["1", "Howard", "45"],
//     ["4", "Raj", "19"],

//     ["5", "Luke", "15"],
//     ["6", "Alex", "14"],
//     ["7", "Haley", "13"],
//     ["8", "Manny", "12"],

//     ["9", "Phill", "10"],
//     ["10", "Claire", "9"],
//     ["12", "Mitchell", "7"],
//     ["11", "Cam", "8"],
//     {
//         "Rank": "1",
//         "Name": "Rashmi",
//         "No. of Referrals": "2"
//     },

//     {
//         "Rank": "2",
//         "Name": "Abhay",
//         "No. of Referrals": "3"
//     },

//     {
//         "Rank": "1",
//         "Name": "Bindu",
//         "No. of Referrals": "10"
//     }

// ]