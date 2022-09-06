$(document).ready(function () {
    $('html,body').animate({
        scrollTop: 0
    },0);
    HideOtpButton();

    jQuery("#slider-revolution").revolution({
        sliderType: "standard",
        sliderLayout: "fullwidth",
        delay: 5000,
        navigation: {
            arrows: {
                enable: true
            },
            bullets: {
                enable: false,
                style: 'hermes'
            },

        },
        parallax: {
            type: "mouse",
            origo: "slidercenter",
            speed: 2000,
            levels: [2, 3, 4, 5, 6, 7, 12, 16, 10, 50],
        },
        spinner: "off",
        gridwidth: 1140,
        gridheight: 700,
        disableProgressBar: "on"
    });
    $('#example').DataTable( {
        data: dataSet,
        "pageLength": 50,
        // "paging": false,
        // order: ['Rank', 'desc'],
        columns: [
            { title: 'Week' },
            { title: 'Name' },
            { title: 'Rank' }
        ]
    } );

    

})

// Disabled and loading or enable not loading button 
const loadingAndUnloadingButton = (id, isLoading, text) => {
    $(`#${id}`).prop("disabled", isLoading);
    $(`#${id}`).html(isLoading ? `<i class="fa fa-spinner fa-spin"></i>` : text)
}

// To Hide the OTP button on the basis of url
const HideOtpButton = () => {
    if (!window.location.href.includes("&utm_campaign=referral")) {
        verified = true
        $('#otp-button').css('display', "none")
    }
    $('#form-reg-otp').css('display', "none")
}

// Flow after user clicks Register button
const mySubmit = async (form) => {
    const isReferral = window.location.href.includes("&utm_campaign=referral");
    // const isReferral = false
    const values = getFormsValue(form);
    const isError = checkForTheError(values, isReferral);
    // const newValues = combineNames(values);
    const numberCode = $(".iti__selected-flag").attr("title").split(" ").pop();
    const fullNumber = numberCode + values.phone_number;

    if (!isError) {
        if (!isReferral) {
            loadingAndUnloadingButton("form-submit-btn", true, "")
            validateEmailId(values.email_id, fullNumber).then(res => {
                if((res.message.email_status == 1 || res.message.email_status == 3 || res.message.email_status == 4 || res.message.email_status == 9) && res.message.phone_number_status){
                    makeRegistration(values, fullNumber);
                }
                if (res.message.email_status == 2 || res.message.email_status == 5 || res.message.email_status == 6 || res.message.email_status == 7 || res.message.email_status == 8){
                    showAndHideValueError("email_id", "The email address is invalid");
                    errorRedBorder(`#form-reg-email_id`);
                    loadingAndUnloadingButton("form-submit-btn", false, "Register");
                }
                if(!res.message.phone_number_status){
                    showAndHideValueError("phone_number", "The phone number is invalid"); 
                    errorRedBorder(`#form-reg-phone_number`);
                    loadingAndUnloadingButton("form-submit-btn", false, "Register");
                }
            
            }).catch(err => {
                showAndHideValueError("email_id", "A registration with this email id already exists")
                loadingAndUnloadingButton("form-submit-btn", false, "Register")
            })
        } else {
            validateOtp(values).then(res => {
                makeRegistration(values, fullNumber);
            }).catch(err => {
                showAndHideValueError("otp", err.message.reason)
                loadingAndUnloadingButton("form-submit-btn", false, "Register")
            })
        }
    }
    // showModalAfterSuccess(document.getElementById('form-reg-email_id').value)
    // console.log(iti);
    // console.log(values);
}

// Check for the Form Validation 
const checkForTheError = (values, isReferral) => {
    let error = false;
    //consent_2 does not need to be checked for error, so a new object newValues is created with consent_2 removed.
    const { consent_2, ...newValues } = values;
    // console.log(newValues);
    Object.keys(newValues).map(key => {
        if ((key === "otp" && !isReferral) || !key) return null;
        showAndHideValueError(key, "")
        $(`#form-reg-${key}`).css("border", "none")
        if (!newValues[key]) {
            // console.log(newValues, newValues[key]);
            if(key === "consent_1") {
                showAndHideValueError(key, `Please give consent`); 
            }
            else if (key === "otp"){
                showAndHideValueError(key, `Please enter OTP`);
            } else {
                showAndHideValueError(key, `Please enter ${capitalizeFirstLetter(key.replace("_", " "))}`);
            }
            // $(`#form-reg-${key}`).css("border", "1px solid red")
            errorRedBorder(`#form-reg-${key}`)
            // document.getElementById("name-empty").style.border = "1px solid red"
            error = true
        }
        if (key === "email_id") {
            if (!pattern.test(values[key])) {
                showAndHideValueError(key, `Please enter valid Email`);
                errorRedBorder(`#form-reg-${key}`)
                error = true;
            }
            // && values[key].length !== 10
        } else if (key === "phone_number" && !(/^\d{10}$/.test(values[key])) && $(".iti__selected-flag").attr("title").split(" ")[0] == "India") {
            showAndHideValueError(key, `Please enter valid Phone Number`);
            errorRedBorder(`#form-reg-${key}`)

            error = true;
        } else if (key === "phone_number" && !(/^\d{7,13}$/.test(values[key]))) {
            showAndHideValueError(key, `Please enter valid Phone Number`);
            errorRedBorder(`#form-reg-${key}`)
            error = true;
        }
    })
    return error
}

// Show and Hide the Errors for inputs
const showAndHideValueError = (key, msg) => {
    $(`#${key}_error`).html(msg).css("color", "red")
    // document.getElementById("name-empty").style.border = "1px solid red !important"
}

// Combine First Name and Last Name into one key called 'name'
const combineNames = (values) => {
    values.name = values['first_name'] + '  ' + values['last_name'];
    delete values['first_name'];
    delete values['last_name'];
    // console.log(values);
    return values;
}


// Validate Email Id to check its format and API call to check in DB
const validateEmailId = async (email, phone_number) => {
    return new Promise((resolve, reject) => {
        $.get(`https://y1m1c7wq22.execute-api.ap-south-1.amazonaws.com/prod/email-validate?phone_number=${phone_number}`, {
            ticket_type: "Community Ticket",
            email_id: email,
            event_id: "737c3a44-759a-4927-9384-ce50e6cfdc10"
        }, (res) => {
            if (res.status_code === 200) {
                resolve(res)   
                // console.log(res)
            } else {
                reject(res)
                // $(`#form-reg-email_id`).css("border", "1px solid red")
                errorRedBorder(`#form-reg-email_id`)
            }
        })
    })

}



// Calling Backend API for Registration

let responseBooking_id;

const makeRegistration = (values, fullNumber) => {
    // console.log(values);
    var xhttpss = new XMLHttpRequest();
    xhttpss.open("POST", "https://khd9ooi5pg.execute-api.ap-south-1.amazonaws.com/prod/event/akd", true); //--> prod
    xhttpss.send(JSON.stringify( eventDetailsToSendToBackEnd(values) ));
    // console.log(eventDetailsToSendToBackEnd(values));
    if (xhttpss.status === 0) {
        xhttpss.onreadystatechange = function() {
            if (xhttpss.readyState == XMLHttpRequest.DONE) {
                const response = JSON.parse(xhttpss.response);
                responseBooking_id = response["booking_id"];
                // console.log(xhttpss.response, response)
            }
        }
        loadingAndUnloadingButton("form-submit-btn", false, "Register");
        // document.getElementById("form-reg").reset();
        $("#form-reg-email_id").prop("disabled", false);
        showModalAfterSuccess(values.email_id, fullNumber, values.phone_number);
    }else{
        loadingAndUnloadingButton("form-submit-btn", false, "Register");
        $("#form-reg-email_id").prop("disabled", false);
    }
}

// ** Whatsapp notification **
//Whatsapp submission
const whatsappSubmit = async (whatsapp_number, consent) => {
    const fullName = capitalizeFirstLetter(document.getElementById('form-reg-name-first').value) + ' ' + capitalizeFirstLetter(document.getElementById('form-reg-name-last').value) 
    const countryCode = $(".iti__selected-flag").attr("title").split(" ").pop()
    const fullNumber = countryCode + whatsapp_number;
    const phone_number = document.getElementById('form-reg-phone_number').value;
    const isError = checkWhatsappNumber(whatsapp_number);
    // console.log(isError, fullNumber);

    if(consent) {
        if(!isError) {
            loadingAndUnloadingButton("regModalButton-success", true, "")
            validateWhatsappNumber(fullNumber).then(res => {
                if(res.message.phone_number_status || !res.message.phone_number_status){
                    // console.log(fullNumber);
                    makeWhatsappRegistration(fullNumber, consent, fullName, phone_number);
                }
                if(!res.message.phone_number_status){
                    showAndHideValueError("whatsapp", "Please Enter a Valid Mobile Number");
                }            
            }).catch(err => {
                showAndHideValueError("whatsapp", err.message.reason)
                loadingAndUnloadingButton("form-submit-btn", false, "Register")
            })
        }
    } else {
        document.getElementById("form-reg").reset();
        $("#myModalThankyou").modal('hide');     
    }

}

//Check whatsapp number

const checkWhatsappNumber = (whatsapp_number) => {
    let error = false;
 if (!(/^\d{10}$/.test(whatsapp_number)) && iti.s.name.split(" ")[0] == "India") {
    showAndHideValueError('whatsapp', `Please enter valid Phone Number`);
    errorRedBorder(`form-reg-whatsapp_phone_number`);

    error = true;
 } else if (!(/^\d{7,13}$/.test(whatsapp_number))) {
    showAndHideValueError('whatsapp', `Please enter valid Phone Number`);
    errorRedBorder(`#form-reg-whatsapp_phone_number`);

    error = true;
 }

 return error
}

//To validate whatsapp number
const validateWhatsappNumber = async (phone_number) => {
    return new Promise((resolve, reject) => {
        $.get(`https://y1m1c7wq22.execute-api.ap-south-1.amazonaws.com/prod/email-validate?phone_number=${phone_number}`,
            (res) => {
            if (res.status_code === 200) {
                resolve(res)   
                // console.log(res)
            } else {
                reject(res)
                // console.log(res)
                // $(`#form-reg-email_id`).css("border", "1px solid red")
                errorRedBorder(`#form-reg-email_id`)
            }
        })
    })
}

const makeWhatsappRegistration = (fullNumber, consent, fullName, phone_number) => {
    // var xhttpss = new XMLHttpRequest();
    // xhttpss.open("POST", "https://y1m1c7wq22.execute-api.ap-south-1.amazonaws.com/prod/event/konfhub-eventf213c2f0/whatsapp-notification", true); //--> prod
    // xhttpss.send(whatsappDetailsSendToBackEnd(whatsapp_number, consent, fullName, phone_number, email) );
    // if (xhttpss.status === 0) {
    //     alert("false issue")
    //     console.log(whatsappDetailsSendToBackEnd(whatsapp_number, consent, fullName, phone_number, email))
    // } else {
    //     console.log("done")
    //     console.log(whatsappDetailsSendToBackEnd(whatsapp_number, consent, fullName, phone_number, email))
    //     document.getElementById("form-reg").reset();
    // }

    $.ajax({
        type: "POST",
        url: "https://y1m1c7wq22.execute-api.ap-south-1.amazonaws.com/prod/event/737c3a44-759a-4927-9384-ce50e6cfdc10/whatsapp-notification",
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "actions": {
                "update": true,
                "message": true
            },
            "booking_id": responseBooking_id, 
            "whatsapp_consent": consent,
            "whatsapp_number": fullNumber, 
            "template_name": "online_free_registration_1", 
            "template_data": [ 
                {"data": fullName}, 
                {"data": "Azure Kubernetes Day"}, 
                {"data": "30th January, 2021"}, 
                {"data": responseBooking_id}, 
                {"data": "https://akd.konfhub.com/"}
            ]
        }),
        success: (res) => {
            // console.log(res);
            // loadingAndUnloadingButton("regModalButton-success", false, "SEND OTP")
            document.getElementById("form-reg").reset();
            $("#myModalThankyou").modal('hide');
            loadingAndUnloadingButton("regModalButton-success", true, "Submit")
        },
        error: (res)=> {          
            // console.log(res);
        }
    })
}
// ** Whatsapp end **

// ShowModal

const showModalAfterSuccess = (email, fullNumber, phone_number) => {
    $("#regModalLabel-error").hide();
    $("#regModalButton-error").hide();
    $("#modal-error-body").hide();
    $("#form-msg-mail").html(email);
    $("#myModalThankyou").modal();
    iti2.setNumber(fullNumber);
    // iti2.setCountry("gb");
    $("#form-reg-whatsapp_phone_number").val(phone_number);
    // jQuery("#telephone").val("+447712342828")

}

//Enable button when consent_1 is checked
// var checker = document.getElementById('box-2');
// var sendbtn = document.getElementById('form-submit-btn');
// checker.onchange = function() {
//   sendbtn.disabled = !this.checked;
// };

// converting forms values in an object
const getFormsValue = (x) => {
    var i;
    const values = {}
    for (i = 0; i < x.length; i++) {
        if (x.elements[i].name) {
            values[x.elements[i].name] = x.elements[i].value.trim()
            if (x.elements[i].type === "checkbox") {
                values[x.elements[i].name] = x.elements[i].checked
                
            }
        }
    }

    var countryData = iti.getSelectedCountryData();

    values["country"] = countryData.name;

    if(values["country"].includes("(")){
        values["country"] = values["country"].split(' (')[0];
    }
    
    return values;
}

// Validating the Entered otp
const myOtp = () => {
    const emailId = $("#form-reg-email_id").prop("value").trim();
    loadingAndUnloadingButton("otp-button", true, "")
    if (emailId === "" && !pattern.test(emailId)) {
        showAndHideValueError("email_id", "Please enter valid Email id");
        loadingAndUnloadingButton("otp-button", false, "SEND OTP");
        return null;
    }
    validateEmailId(emailId).then(res => {
        if((res.message.email_status == 1 || res.message.email_status == 3 || res.message.email_status == 4 || res.message.email_status == 9) ){
            sendOtp(emailId);
        }
        if (res.message.email_status == 2 || res.message.email_status == 5 || res.message.email_status == 6 || res.message.email_status == 7 || res.message.email_status == 8){
            showAndHideValueError("email_id", "The email address is invalid");
            loadingAndUnloadingButton("otp-button", false, "SEND OTP");
            errorRedBorder(`#form-reg-email_id`);
        }
        // if(!res.message.phone_number_status) {
        //     showAndHideValueError("phone_number", "The phone number is invalid"); 
        //     errorRedBorder(`#form-reg-phone_number`);
        //     loadingAndUnloadingButton("form-submit-btn", false, "Register");
        // }
    }).catch(err => {
        showAndHideValueError("email_id", "A registration with this email id already exists")
        loadingAndUnloadingButton("otp-button", false, "SEND OTP");
    })
}

// Sending OTP to Email ID
const sendOtp = (email) => {
    $.ajax({
        type: "GET",
        url: "https://y1m1c7wq22.execute-api.ap-south-1.amazonaws.com/prod/event/737c3a44-759a-4927-9384-ce50e6cfdc10/referral/code",
        // url: "https://kb406n7wlg.execute-api.ap-southeast-1.amazonaws.com/dev/event/a29ac0a3-6475-46b9-8a70-911fb5c4d004/referral/code",
        data: {
            "email_id": email,
            "event-id": "737c3a44-759a-4927-9384-ce50e6cfdc10",
            "event_name": "Azure Kubernetes Day"
        },
        success: (res) => {
            console.log(res);
            $("#form-reg-email_id").prop("disabled", true)
            $("#form-reg-otp").show();
            showAndHideValueError("email_id", "OTP sent");
            $("#otp-button").hide();
            // loadingAndUnloadingButton("otp-button", false, "SEND OTP")
        },
        error: (res)=>{
            console.log(res);
            // loadingAndUnloadingButton("otp-button", false, "SEND OTP")
        }
    })
}

// Checking OTP in DB
const validateOtp = (values) => {
    return new Promise((resolve, reject) => {
        if (values.otp.length !== 4 && values.otp === "") {
            showAndHideValueError("otp", "Please Enter valid OTP");
            return null;
        }
        $.get("https://y1m1c7wq22.execute-api.ap-south-1.amazonaws.com/prod/event/737c3a44-759a-4927-9384-ce50e6cfdc10/referral/validate_code", {
            "email_id": values.email_id,
            "event-id": "737c3a44-759a-4927-9384-ce50e6cfdc10",
            "otp": values.otp
        }, (res) => {
            if (res.message.otp_verified) {
                
                // $("#otp-button").hide();
                $("#form-reg-otp").css("display", "none");
                resolve(res)
            } else {
                showAndHideValueError("otp", "Email is not Verified");
                // $("#form-reg-otp").css("border", "1px solid red")
                errorRedBorder("#form-reg-otp")
                reject(res)
            }
        })
    })
}

// User Registration Details
const eventDetailsToSendToBackEnd = (values) => {
    return {
        "user_details": [{
            "email_status": localStorage.getItem("status_codes_email"),
            "name": capitalizeFirstLetter(values.first_name),
            "email_id": values.email_id,
            "organisation": values.organisation,
            "phone_number": values.phone_number,
            "country": values.country,
            "designation": values.designation,
            "conference_and_workshop": values.conference_and_workshop,

            'form_details': {
                'last_name': capitalizeFirstLetter(values.last_name),
                '<p><span_style="background-color:_transparent;_color:_rgb(0,_0,_0);">yes,_i_give_consent_to_konfhub_technologies_llp_to_contact_me_on_any_event_updates,_news_or_offers_by_email,_sms_or_phone.</span></p>': values.consent_1, 
                '<p><span_style="background-color:_transparent;_color:_rgb(0,_0,_0);">i_would_like_information,_tips,_and_offers_about_microsoft_products_and_services._</span><a_href="https://go.microsoft.com/fwlink/?linkid=521839"_rel="noopener_noreferrer"_target="_blank"_style="background-color:_transparent;_color:_rgb(17,_85,_204);">privacy_statement</a><span_style="background-color:_transparent;_color:_rgb(0,_0,_0);">.</span></p>': values.consent_2
            },
            "ticket_details": [{

                "name": "Community Ticket",
                "id": "4498",
                "date": "2020-06-03",
                "price": 0
            }],
            "ticket_name": "Community Ticket",
            "ticket_price": 0,
            "ticket_date": "2020-06-03",

        }],
        "utm": regTrack(window.location.href.split("?")[1])
        // "utm": null
    }
}

// Finding out the Referral values 
const regTrack = (_url) => {
    try {
        if (_url === '') return null;
        _url = _url.replace('?', '').split('&');
        const _temp = {};
        _url.map(e => {
            _temp[e.split('=')[0]] = e
                .split('=')[1]
                .slice(
                    0,
                    e.split('=')[1].indexOf('#') > -1 ?
                        e.split('=')[1].indexOf('#') :
                        e.split('=')[1].length
                );
        });
        return _temp;
    } catch (err) {
        return null;
    }
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const errorRedBorder = (key) => {
    $(key).css("border", "1px solid red")
}

const pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

const pointing = (section) => {
    if (window.location.href.split('#')[window.location.href.split('#').length-1] !== section){
        window.location.href = window.location.href.split('#')[0] + '#' + section
    } 
    // else {
    //     window.location.href = window.location.href.split('#')[0] + '#' + section
    // }
}

// $("nav").find("a").click(function(e) {
//     e.preventDefault();
//     var section = $(this).attr("href");
//     $("html, body").animate({
//         scrollTop: $(section).offset().top
//     });
// });


var dataSet = [
    ["1", "Anushka", "1"],
    ["1", "Rathanakumar ", "2"],
    ["1", "Sheela", "3"],
    ["2", "Jagadesh", "1"],
    ["2", "Saurabh Kumar", "2"],
    ["2", "Ajay Kumar", "3"],
    ["3", "Mohamed Imran", "1"],
    ["3", "Hameed", "2"],
    ["3", "Mohamed Ishak", "3"],
    ["4", "Muskan", "1"],
    ["4", "Ismail Faris", "2"],
    ["4", "Mohamed Abdul Kather", "3"]
];

const resetForm = () => {
    document.getElementById("form-reg").reset();
}