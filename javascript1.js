var firebaseConfig = {
    apiKey: "AIzaSyBlTVYdKivk0KrHreXwrJ6YA8VxTVHbIJs",
    authDomain: "athlead-67a40.firebaseapp.com",
    databaseURL: "https://athlead-67a40-default-rtdb.firebaseio.com",
    projectId: "athlead-67a40",
    storageBucket: "athlead-67a40.appspot.com",
    messagingSenderId: "45769101298",
    appId: "1:45769101298:web:5ec9ec7a1e38cb4362e56b",
    measurementId: "G-GWLT1C4SZ0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var nameV,emailV,passWV,genV;
var files = [];
var yourPosts = [];
var imageVs = [];
var imgName, imgUrl;
var reader;
var loggedIN = false;
var allPosts = [];
var totalPosts = [];
var postNames = [];
var postType = "";

document.getElementById("enterBtn").onclick = function () {
    nameV = document.getElementById("namebox").value;
    emailV = document.getElementById("emailbox").value;
    passWV = document.getElementById("passbox").value;

    if (!(nameV == "") && !(emailV == "") && !(passWV == "")) {

            firebase.database().ref("Users/" + nameV).on('value', function (snapshot) {
                if (!loggedIN) {
                    if (snapshot.exists()) {
                        var passpass;
                        firebase.database().ref("Users/" + nameV + "/Password").on('value', function (snapshot) {
                            passpass = snapshot.val();
                        });

                        if (passWV === passpass) {
                            alert("Welcome!");
                            firebase.database().ref("Users/" + nameV + "/Email").on('value', function (snapshot) {
                                emailV = snapshot.val();
                                loggedIN = true;
                                firebase.database().ref('Users').once('value', function (allRecords) {
                                    allRecords.forEach(
                                        function (CurrentRecord) {
                                            var name = CurrentRecord.val().Name;
                                            names.push(name);
                                        }
                                    )
                                });
                            });

                            document.getElementById("signinScreen").hidden = true;
                            document.getElementById("app").hidden = false;
                            hideMainDivs();
                            document.getElementById("homePage").hidden = true;
                        } else {
                            alert("incorrect")
                        }
                    } else {
                        alert("We can't seem to find your account, would you like to sign up?")
                        // firebase.database().ref("Users/" + nameV).set({
                        //     Name: nameV,
                        //     Email: emailV,
                        //     Password: passWV,
                        //     Followers: 0,
                        //
                        // });
                        // document.getElementById("signinScreen").hidden = true;
                        // document.getElementById("app").hidden = false;
                        // hideMainDivs();
                        // document.getElementById("homePage").hidden = true;
                    }
                }
            });

    } else {
        alert("Your password, email, or name field is empty");
    }
}

document.getElementById("signup").onclick = function() {
    document.getElementById("signinScreen").hidden = true;
    document.getElementById("signupScreen").hidden = false;
}

document.getElementById("signupBack").onclick = function() {
    document.getElementById("signinScreen").hidden = false;
    document.getElementById("signupScreen").hidden = true;
}

document.getElementById("signupenterBtn").onclick = function() {
    nameV = document.getElementById("signUpNamebox").value;
    emailV = document.getElementById("signUpEmailbox").value;
    passWV = document.getElementById("signUpPassbox").value;

    if (!(nameV == "") && !(emailV == "") && !(passWV == "")) {
        var alreadyExists = false;

        // do {
        firebase.database().ref("Users").once('value', function (users) {
            if (users.exists()) {
                users.forEach(function (user) {
                    if (user.val().Name === nameV) {
                        if (user.val().Email === emailV && user.val().Password === passWV) {
                            alert("You already have an account, welcome back");
                            alreadyExists = true;

                            firebase.database().ref("Users/" + nameV + "/Email").on('value', function (snapshot) {
                                emailV = snapshot.val();
                                loggedIN = true;
                                firebase.database().ref('Users').once('value', function (allRecords) {
                                    allRecords.forEach(
                                        function (CurrentRecord) {
                                            var name = CurrentRecord.val().Name;
                                            names.push(name);
                                        }
                                    )
                                });
                            });

                            loggedIN = true;
                            document.getElementById("signupScreen").hidden = true;
                            document.getElementById("app").hidden = false;
                            hideMainDivs();
                            document.getElementById("homePage").hidden = true;
                        } else {
                            alert("Username already taken, please try again")
                            alreadyExists = true;
                        }
                    }
                });
            }
            if (!alreadyExists) {
                firebase.database().ref("Users/" + nameV).set({
                    Name: nameV,
                    Email: emailV,
                    Password: passWV,
                    Followers: 0,

                });
                loggedIN == true;

                firebase.database().ref("Users/" + nameV + "/Email").on('value', function (snapshot) {
                    emailV = snapshot.val();
                    loggedIN = true;
                    firebase.database().ref('Users').once('value', function (allRecords) {
                        allRecords.forEach(
                            function (CurrentRecord) {
                                var name = CurrentRecord.val().Name;
                                names.push(name);
                            }
                        )
                    });
                });

                alert("Welcome aboard")
                document.getElementById("signupScreen").hidden = true;
                document.getElementById("app").hidden = false;
                hideMainDivs();
                document.getElementById("homePage").hidden = true;
            }
        });

    }
}


document.getElementById("homeBtn").onclick = function () {
    hideMainDivs();
    document.getElementById("homePage").hidden = false;
}
let names = [];

document.getElementById("searchBtn").onclick = function () {
    hideMainDivs();
    document.getElementById("searchPage").hidden = false;
    // names = getNames(names)
    for (let i = 0; i < totalPosts.length; i++) {
        document.getElementById('searchPage').removeChild(totalPosts[i])
    }
    totalPosts = [];
    allPosts = [];
    postNames = [];
    for (let i = 0; i < names.length; i++) {
        if (names[i] === nameV) {

        }
        else {
            firebase.database().ref('Users/' + names[i] + "/Posts").once('value', function (allRecords) {
                allRecords.forEach(
                    function (CurrentRecord) {
                        var link = CurrentRecord.val().Link;
                        var img = document.createElement('img');
                        var postName = link.substring(link.indexOf("%2F")+3, link.indexOf(".png"))
                        postName = postName.replaceAll("%20"," ")
                        postName = postName.toLowerCase();
                        postNames.push(postName)

                        img.src = link
                        document.getElementById('searchPage').appendChild(img);
                        totalPosts.push(img);
                        var type = CurrentRecord.val().Type;
                        var arrayA = [link, type, names[i]];
                        allPosts.push(arrayA);
                    }
                )
            })
        }
    }
}
function updateSearch(){
    for (let i = 0; i < totalPosts.length; i++) {
        document.getElementById('searchPage').removeChild(totalPosts[i])
    }
    totalPosts = [];
    var searchText = document.getElementById("searchbar").value;
    for (let i = 0; i < postNames.length; i++) {
        if (postNames[i].includes(searchText.toLowerCase())){
            var img = document.createElement('img');
            img.src = allPosts[i][0]
            document.getElementById('searchPage').appendChild(img);
            totalPosts.push(img);
        }
    }
    // alert(document.getElementById("searchbar").value)
}

document.getElementById("myprofileBtn").onclick = function () {
    hideMainDivs();
    document.getElementById("myprofilePage").hidden = false;
    document.getElementById("myprofile").hidden = false;
    document.getElementById("postingPage").hidden = true;
    var pfpsrc;
    firebase.database().ref("Users/" + nameV + "/PFP/" + "Link").once('value', function (snapshot) {
        pfpsrc = snapshot.val();
        if (pfpsrc != null) {
            document.getElementById("pfp").src = pfpsrc;
        }
    });


    for (let i = 0; i < yourPosts.length; i++) {
        document.getElementById('myprofilePage').removeChild(yourPosts[i])
    }
    yourPosts = [];
    firebase.database().ref("Users/"+nameV+"/Posts").once('value', function (snapshot) {
        snapshot.forEach(function (child) {
            var str = "Users/"+nameV+"/Posts/"+child.key + "/Link";

            firebase.database().ref(str).on('value', function (snapshot) {
                var img = document.createElement('img');

                img.src = snapshot.val();
                img.onclick = function () {
                    hideMainDivs();

                }
                document.getElementById('myprofile').appendChild(img);
                yourPosts.push(img);
            })
        });
    });


}
document.getElementById("pfp").onclick = function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        files = e.target.files;
        reader = new FileReader();
        reader.onload = function(){
            document.getElementById("pfp").src = reader.result;
            imgName = "profile";
            var uploadTask = firebase.storage().ref('Image/'+imgName+".png").put(files[0]);

            uploadTask.on('state_changed', function (snapshot){
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById('upProgress').value = 'Upload' + progress+'%';
                },
                function(error){
                    alert('error')
                },
                function(){
                    uploadTask.snapshot.ref.getDownloadURL().then(function(url){
                            imgUrl = url;

                            firebase.database().ref('Users/'+nameV+"/PFP").set({
                                Link: imgUrl,

                            });
                        }
                    );
                });
        }
        reader.readAsDataURL(files[0]);
    }
    input.click();




}
document.getElementById("postBtn").onclick = function () {
    document.getElementById("myprofile").hidden = true;
    document.getElementById("postingPage").hidden = false;
}



function hidePostOps() {
    document.getElementById("quote").hidden = true;
    document.getElementById("recipe").hidden = true;
    document.getElementById("workout").hidden = true;
}


function hideMainDivs() {
    document.getElementById("searchPage").hidden = true;
    document.getElementById("homePage").hidden = true;
    document.getElementById("myprofilePage").hidden = true;
}


document.getElementById("simage").onclick = function(){
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        files = e.target.files;
        reader = new FileReader();
        reader.onload = function(){
            document.getElementById("myimg").src = reader.result;
        }
        reader.readAsDataURL(files[0]);
    }
    input.click();

}

document.getElementById("upload").onclick = function(){
    // alert(files[0]);
    var passesTest = true;
    var alertVar = "";

    if (files[0]==null) {
        passesTest = false;
        alertVar = alertVar+"; You don't have an image selected";
    }
    if (document.getElementById("namebox1").value === "") {
        passesTest = false;
        alertVar = alertVar+"; Please put a permissible title";
    }

    switch (postType) {
        case "":
            passesTest = false;
            alertVar = alertVar+"; Please select a valid post type";
            break;
        case "recipe":
            if (document.getElementById("prepTimetext").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please specify the meal prep time";
            }
            if (document.getElementById("cooktimeText").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please specify the cooking time required";
            }
            if (document.getElementById("servingSize").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please specify the serving size";
            }
            if (document.getElementById("ingredientBox").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please specify the ingredients";
            }
            if (document.getElementById("methodBox").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please type the method of the recipe";
            }
            break;
        case "workout":
            if (document.getElementById("workoutDescBox").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please write a workout description";
            }
            if (document.getElementById("workoutBox").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please write the workout walkthrough";
            }
            break;
        case "quote":
            if (document.getElementById("quoteBox").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please put a quote in the field required";
            }
            break;
    }

    if (passesTest) {
        imgName = document.getElementById("namebox1").value;
        var uploadTask = firebase.storage().ref('Image/' + imgName + ".png").put(files[0]);
        uploadTask.on('state_changed', function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                document.getElementById('upProgress').innerHTML = 'Upload' + progress + '%';
            },
            function (error) {
            alert(error)
                alert('error')
            },
            function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
                        imgUrl = url;
                        switch (postType) {
                            case "recipe":
                                firebase.database().ref('Users/' + nameV + "/Posts/" + imgName).set({
                                    Link: imgUrl,
                                    Type: postType,
                                    PrepTime: document.getElementById("prepTimetext").innerHTML,
                                    CookTime: document.getElementById("cooktimeText").innerHTML,
                                    ServingSize: document.getElementById("servingSize").innerHTML,
                                    Ingredients: document.getElementById("ingredientBox").innerHTML,
                                    Method: document.getElementById("methodBox").innerHTML
                                });
                                break;
                            case "workout":
                                firebase.database().ref('Users/' + nameV + "/Posts/" + imgName).set({
                                    Link: imgUrl,
                                    Type: postType,
                                    Description: document.getElementById("workoutDescBox").innerHTML,
                                    Workout: document.getElementById("workoutBox").innerHTML,
                                });
                                break;
                            case "quote":
                                firebase.database().ref('Users/' + nameV + "/Posts/" + imgName).set({
                                    Link: imgUrl,
                                    Type: postType,
                                    Quote: document.getElementById("quoteBox").innerHTML,
                                });
                                break;
                        }
                        // firebase.database().ref('Users/' + nameV + "/Posts/" + imgName).set({
                        //     Link: imgUrl,
                        //     Type: postType
                        //
                        // });
                        alert('image added successfully');
                    }
                );
            });

    } else {
        alert(alertVar);
    }

}


for (const dropdown of document.querySelectorAll(".custom-select-wrapper")) {
    dropdown.addEventListener('click', function () {
        this.querySelector('.custom-select').classList.toggle('open');
    })
}

for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener('click', function () {
        if (!this.classList.contains('selected')) {
            this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            this.classList.add('selected');
            this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;

            // alert(this.value);

            switch (this.innerHTML) {
                case "Recipe":
                    document.getElementById("recipe").hidden = false;
                    document.getElementById("workout").hidden = true;
                    document.getElementById("quote").hidden = true;

                    postType = "recipe";
                    break;
                case "Workout":
                    document.getElementById("recipe").hidden = true;
                    document.getElementById("workout").hidden = false;
                    document.getElementById("quote").hidden = true;

                    postType = "workout";
                    break;
                case "Quote":
                    document.getElementById("recipe").hidden = true;
                    document.getElementById("workout").hidden = true;
                    document.getElementById("quote").hidden = false;

                    postType = "quote";
                    break;
            }
        }
    })
}


window.addEventListener('click', function (e) {
    for (const select of document.querySelectorAll('.custom-select')) {
        if (!select.contains(e.target)) {
            select.classList.remove('open');
        }
    }
});
