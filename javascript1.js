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
var postsonpostpage = [];
var currentref = "";
var postName = "";
var likes = 0;
var postType = "";
var allComments = [];
var likedPosts = [];
var similarityScores = [];
var homePosts = [];
var checkedPosts = false;


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
                                postNames = [];
                                for (let i = 0; i < names.length; i++) {
                                    if (names[i] === nameV) {

                                    }
                                    else {
                                        firebase.database().ref('Users/' + names[i] + "/Posts").once('value', function (allRecords) {
                                            allRecords.forEach(
                                                function (CurrentRecord) {
                                                    var key = CurrentRecord.key
                                                    postNames.push(key)
                                                }
                                            )
                                        })
                                    }
                                }
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
    similarityScores = [];
    postNames = [];
    var liked = []
    var links = [];
    document.getElementById("homePage").hidden = false;
    firebase.database().ref('Users/' + nameV + "/Activity").once('value', function (allRecords) {
        allRecords.forEach(
            function (CurrentRecord) {
                liked.push(CurrentRecord.key)
                firebase.database().ref('Users/' + nameV + "/Activity/" + CurrentRecord.key).once('value', function (allRecords2) {
                    let insideSim = []
                    allRecords2.forEach(
                        function (CurrentRecord2) {
                            if (CurrentRecord2.val().Similarity !== undefined) {
                                insideSim.push(CurrentRecord2.val().Similarity)
                                postNames.push(CurrentRecord2.key)
                                links.push(CurrentRecord2.val().Link)
                            }
                        }
                    )
                    similarityScores.push(insideSim)
                    if (!checkedPosts){
                        var sumArray = [];
                        for (let i = 0; i < similarityScores[0].length; i++) {
                            sumArray.push(0)
                        }
                        for (let i = 0; i < similarityScores.length; i++) {
                            for (let j = 0; j < similarityScores[0].length; j++) {
                                sumArray[j] = (parseFloat(sumArray[j]) + Math.pow(parseFloat(similarityScores[i][j])*10,2))
                            }
                        }

                        var reducedArray = removeDuplicates(postNames)
                        var nameSim = [];
                        for (let i = 0; i < reducedArray.length; i++) {
                            var tempArray = [];
                            tempArray.push(reducedArray[i])
                            tempArray.push(sumArray[i])
                            tempArray.push(links[i])
                            nameSim.push(tempArray)
                        }
                        for (let i = 0; i < nameSim.length; i++) {
                            for (let j = 0; j < liked.length; j++) {
                                if (liked[j] === nameSim[i][0]){
                                    nameSim.splice(i,1)
                                    i = 0;
                                }
                            }
                        }

                        var done = false;
                        while (!done) {
                            done = true;
                            for (var i = 1; i < nameSim.length; i += 1) {
                                if (nameSim[i - 1][1] < nameSim[i][1]) {
                                    done = false;
                                    var tmp = nameSim[i - 1];
                                    nameSim[i - 1] = nameSim[i];
                                    nameSim[i] = tmp;
                                }
                            }
                        }
                        console.log(nameSim)//nameSim is a 2D array with both the name of the posts and its similarity score, but the ones with a similarity score of 1 are removed so it's just other posts
                        //The array is also sorted based on the similarity scores from highest to lowest
                        for (let i = 0; i < homePosts.length; i++) {
                            homePosts[i].remove();
                        }
                        homePosts = [];
                        for (let i = 0; i < nameSim.length; i++) {
                            if (i <= 9) {
                                var img2 = document.createElement('img');
                                img2.src = nameSim[i][2]
                                homePosts.push(img2)
                                document.getElementById('homePage').appendChild(img2);
                            }
                            //TODO: Update similarity score when a user makes a post
                            checkedPosts = true;
                        }
                    }
                })
            }
        )

    })
    checkedPosts = false;




}
function removeDuplicates(array) {
    return array.filter((a, b) => array.indexOf(a) === b)
}
let names = [];
function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, duration)
    })
}
function generatePosts(){

    postNames = [];
    for (let i = 0; i < names.length; i++) {
        if (names[i] === nameV) {

        }
        else {
            firebase.database().ref('Users/' + names[i] + "/Posts").once('value', function (allRecords) {
                allRecords.forEach(
                    function (CurrentRecord) {
                        var key = CurrentRecord.key
                        postNames.push(key)
                    }
                )
            })
        }
    }
}
document.getElementById("searchBtn").onclick = function () {
    hideMainDivs();
    setTimeout(() => { console.log("World!"); }, 2000);
    document.getElementById("searchbar").value = ""
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
                        postName = link.substring(link.indexOf("%2F")+3, link.indexOf(".png"))
                        postName = postName.replaceAll("%20"," ")
                        postName = postName.toLowerCase();
                        postNames.push(postName)
                        img.src = link
                        img.onclick = function () {
                            link = img.src;
                            postName = link.substring(link.indexOf("%2F")+3, link.indexOf(".png"))
                            postName = postName.replaceAll("%20"," ")
                            postName = postName.toLowerCase();
                            hideMainDivs();
                            document.getElementById("postpage").hidden = false;
                            for (let i = 0; i < postsonpostpage.length; i++) {
                                document.getElementById('postonpostpage').removeChild(postsonpostpage[i])
                            }
                            postsonpostpage = [];
                            var img2 = document.createElement('img');
                            img2.src = img.src
                            img2.className = "postimageonpostpage"

                            document.getElementById('postonpostpage').appendChild(img2);
                            postsonpostpage.push(img2);
                            for (let j = 0; j < names.length; j++) {
                                firebase.database().ref('Users/' + names[j] + "/Posts").once('value', function (allRecords2) {
                                    allRecords2.forEach(
                                        function (CurrentRecord2) {
                                            if (CurrentRecord2.val().Link == img.src){
                                                currentref = 'Users/' + names[j] + "/Posts/" + postName;
                                                viewPostPage(currentref, postName, names[j]);
                                                firebase.database().ref("Users/"+ nameV + "/Activity/"+postName).once('value', function (snapshot) {
                                                    if (snapshot.val()!==null){
                                                        document.getElementById("heart").checked = true;
                                                    }
                                                    else{
                                                        document.getElementById("heart").checked = false;

                                                    }
                                                });
                                                firebase.database().ref(currentref).once('value', function (snapshot) {
                                                    likes = snapshot.val().Likes
                                                    if (likes===1){
                                                        document.getElementById("likescounter").innerText = likes + " Like"
                                                    }
                                                    else{
                                                        document.getElementById("likescounter").innerText = likes + " Likes"
                                                    }

                                                });
                                            }
                                        }
                                    )})
                            }
                        }

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
        if (postNames[i].includes(searchText.toLowerCase())) {
            var img = document.createElement('img');
            img.src = allPosts[i][0]
            img.onclick = function () {
                console.log("blaghsghaghs " + img.src)
                hideMainDivs();
                document.getElementById("postpage").hidden = false;
                for (let j = 0; j < postsonpostpage.length; j++) {
                    document.getElementById('postonpostpage').removeChild(postsonpostpage[j])
                }

                postsonpostpage = [];
                var img2 = document.createElement('img');

                img2.src = allPosts[i][0];
                img2.className = "postimageonpostpage"

                for (let j = 0; j < names.length; j++) {
                    firebase.database().ref('Users/' + names[j] + "/Posts").once('value', function (allRecords2) {
                        allRecords2.forEach(
                            function (CurrentRecord2) {
                                if (CurrentRecord2.val().Link == img2.src) {
                                    postName = img2.src.substring(img2.src.indexOf("%2F") + 3, img2.src.indexOf(".png"))
                                    postName = postName.replaceAll("%20", " ")
                                    postName = postName.toLowerCase();
                                    currentref = 'Users/' + names[j] + "/Posts/" + postName;
                                    viewPostPage(currentref, postName, names[j]);
                                    firebase.database().ref("Users/" + nameV + "/Activity/" + postName).once('value', function (snapshot) {
                                        if (snapshot.val().Reaction === "Liked") {
                                            document.getElementById("heart").checked = true;
                                        } else {
                                            document.getElementById("heart").checked = false;

                                        }
                                    });
                                    firebase.database().ref(currentref).once('value', function (snapshot) {
                                        likes = snapshot.val().Likes
                                        if (likes === 1){
                                            document.getElementById("likescounter").innerText = likes + " Like"

                                        }
                                        else{
                                            document.getElementById("likescounter").innerText = likes + " Likes"

                                        }
                                    });
                                }
                            }
                        )
                    })
                }
                document.getElementById('postonpostpage').appendChild(img2);
                postsonpostpage.push(img2);


            }
            document.getElementById('searchPage').appendChild(img);
            totalPosts.push(img);
        }
    }
    // alert(document.getElementById("searchbar").value)
}

function commentButton(){
    let d = new Date();
    firebase.database().ref(currentref + "/Comments/" + d).set({
        postdate: "" + d,
        poster: nameV,
        comment: document.getElementById("commentbox").innerHTML,

    });
    document.getElementById("commentbox").innerHTML = ""
    firebase.database().ref(currentref + "/Comments").once('value', function (allRecords) {
        for (let i = 0; i < allComments.length; i++) {
            document.getElementById('postpage').removeChild(allComments[i])

        }
        allComments = [];
        allRecords.forEach(
            function (CurrentRecord) {
                var comment = CurrentRecord.val().poster + ": " + CurrentRecord.val().comment;

                var hr1 = document.createElement('hr')

                var img1 = document.createElement('img')
                img1.className = "pfpcomment";
                img1.onclick = function() {
                    viewProfile(CurrentRecord.val().poster)
                };

                var comment2 = document.createElement('p')

                var hr2 = document.createElement('hr')

                comment2.innerHTML = comment;
                comment2.className = "commentthing"

                var pfpsrc;
                firebase.database().ref("Users/" + CurrentRecord.val().poster + "/PFP/" + "Link").on('value', function (snapshot) {
                    pfpsrc = snapshot.val();
                    if (pfpsrc != null) {
                        img1.src = pfpsrc;
                    }
                    else{
                        img1.src = "resources/select image picture.PNG";
                    }
                });
                document.getElementById('postpage').append(hr1, img1, comment2, hr2)
                allComments.push(hr1, img1, comment2, hr2)
            }
        )
    });
}
function viewMyProfile() {
    hideMainDivs();
    document.getElementById("myprofilePage").hidden = false;
    document.getElementById("myprofile").hidden = false;
    document.getElementById("postingPage").hidden = true;

    document.getElementById("myUsername").innerHTML = nameV;

    var pfpsrc;
    firebase.database().ref("Users/" + nameV + "/PFP/" + "Link").once('value', function (snapshot) {
        pfpsrc = snapshot.val();
        if (pfpsrc != null) {
            document.getElementById("pfp").src = pfpsrc;
        }
    });


    for (let i = 0; i < yourPosts.length; i++) {
        document.getElementById('myprofile').removeChild(yourPosts[i])
    }
    yourPosts = [];
    firebase.database().ref("Users/"+nameV+"/Posts").once('value', function (snapshot) {
        snapshot.forEach(function (child) {
            var str = "Users/"+nameV+"/Posts/"+child.key;

            firebase.database().ref("Users/"+nameV+"/Posts/"+child.key + "/Link").on('value', function (snapshot) {
                var img = document.createElement('img');

                img.src = snapshot.val();
                img.onclick = function () {
                    postName = img.src.substring(img.src.indexOf("%2F")+3, img.src.indexOf(".png"))
                    postName = postName.replaceAll("%20"," ")
                    postName = postName.toUpperCase();
                    viewPostPage(str, postName, nameV)
                    hideMainDivs();
                    document.getElementById("postpage").hidden = false;
                    document.getElementById("heart2").hidden = true;
                    for (let i = 0; i < postsonpostpage.length; i++) {
                        document.getElementById('postonpostpage').removeChild(postsonpostpage[i])
                    }
                    postsonpostpage = [];
                    var img2 = document.createElement('img');
                    img2.src = img.src
                    img2.className = "postimageonpostpage"

                    document.getElementById('postonpostpage').appendChild(img2);
                    postsonpostpage.push(img2);


                }
                document.getElementById('myprofile').appendChild(img);
                yourPosts.push(img);
            })
        });
    });
}

function heartchecked() {
    var checkBox = document.getElementById("heart");
    firebase.database().ref(currentref).once('value', function (snapshot) {
        likes = snapshot.val().Likes
        if (checkBox.checked === true){
            firebase.database().ref("Users/"+nameV+"/Activity/" + postName).update({
                Reaction: "Liked",
                Name: postName
            });
            likes++;
            firebase.database().ref(currentref).update({
                Likes: likes
            });
            likedPosts = [];
            firebase.database().ref('Users/' + nameV + "/Activity").once('value', function (allRecords) {
                allRecords.forEach(
                    function (CurrentRecord) {
                        var reaction = CurrentRecord.val().Reaction;
                        if (reaction === "Liked"){
                            likedPosts.push(CurrentRecord.val().Name)
                        }
                    }

                )
                allPosts = []
                allLinks = []
                for (let r = 0; r < names.length; r++) {
                    if (names[r] === nameV) {

                    }
                    else {
                        firebase.database().ref('Users/' + names[r] + "/Posts").once('value', function (allRecords) {//goes through all Posts in the database using a foreach
                            allRecords.forEach(
                                function (CurrentRecord) {
                                    var name = CurrentRecord.key;
                                    var link = CurrentRecord.val().Link
                                    allPosts.push(name)
                                    allLinks.push(link)
                                }

                            )//pushes the names of the Posts into an array allPosts, which will be used later to generate similarity scores

                            if (r==names.length-1) {//last instance instance of the names loop(the one that's used to gather all the posts)

                                for (let i = 0; i < allPosts.length; i++) {
                                    const data = null;

                                    const xhr = new XMLHttpRequest();
                                    xhr.withCredentials = true;

                                    xhr.addEventListener("readystatechange", function () {
                                        if (this.readyState === this.DONE) {

                                            let str = this.responseText
                                            str = str.substring(str.indexOf("similarity:")+15, str.indexOf("value")-2)
                                            firebase.database().ref("Users/"+nameV+"/Activity/" + postName + "/" + allPosts[i]).set({
                                                Name: allPosts[i],
                                                Similarity: str,
                                                Link: allLinks[i]
                                            });

                                            // str.substring(str.indexOf("similarity: "), )

                                        }
                                    });

                                    xhr.open("GET", "https://twinword-text-similarity-v1.p.rapidapi.com/similarity/?text1=" + allPosts[i] + "&text2=" + postName);
                                    xhr.setRequestHeader("x-rapidapi-key", "6c0ac42843msh4bec17db4b0e9adp128a17jsnfefa5fdddb20");
                                    xhr.setRequestHeader("x-rapidapi-host", "twinword-text-similarity-v1.p.rapidapi.com");

                                    xhr.send(data);




                                }
                            }
                        })
                    }
                }
            })
        } else {
            firebase.database().ref("Users/"+nameV+"/Activity/" + postName).remove();
            likes--;
            firebase.database().ref(currentref).update({
                Likes: likes

            });
        }
        if (likes === 1){
            document.getElementById("likescounter").innerText = likes + " Like"
        }
        else{
            document.getElementById("likescounter").innerText = likes + " Likes"

        }

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
            imgName = nameV;
            var uploadTask = firebase.storage().ref('Image/'+imgName+".png").put(files[0]);

            uploadTask.on('state_changed', function (snapshot){
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById('upProgress').innerHTML = 'Upload' + progress+'%';
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
    document.getElementById("postpage").hidden = true;
    document.getElementById("viewProfiles").hidden = true;
    document.getElementById("showChatDiv").hidden = true;
    document.getElementById("showChat").hidden = true;
    chatOpened = false;
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
            if (document.getElementById("prepTimetext").value==="") {
                passesTest = false;
                alertVar = alertVar+"; Please specify the meal prep time";
            }
            if (document.getElementById("cooktimeText").value==="") {
                passesTest = false;
                alertVar = alertVar+"; Please specify the cooking time required";
            }
            if (document.getElementById("servingSize").value==="") {
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
        imgName = imgName.toLowerCase();
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
                                Likes: 0,
                                PrepTime: document.getElementById("prepTimetext").value,
                                CookTime: document.getElementById("cooktimeText").value,
                                ServingSize: document.getElementById("servingSize").value,
                                Ingredients: document.getElementById("ingredientBox").innerHTML,
                                Method: document.getElementById("methodBox").innerHTML
                            });
                            break;
                        case "workout":
                            firebase.database().ref('Users/' + nameV + "/Posts/" + imgName).set({
                                Link: imgUrl,
                                Type: postType,
                                Likes: 0,
                                Description: document.getElementById("workoutDescBox").innerHTML,
                                Workout: document.getElementById("workoutBox").innerHTML,
                            });
                            break;
                        case "quote":
                            firebase.database().ref('Users/' + nameV + "/Posts/" + imgName).set({
                                Link: imgUrl,
                                Type: postType,
                                Likes: 0,
                                Quote: document.getElementById("quoteBox").innerHTML,
                            });
                            break;
                    }

                    for (let i = 0; i < names.length; i++) {
                        if (names[i] === nameV) {

                        }
                        else {
                            firebase.database().ref('Users/' + names[i] + "/Activity").once('value', function (allRecords) {
                                allRecords.forEach(
                                    function (CurrentRecord) {
                                        const data = null;

                                        const xhr = new XMLHttpRequest();
                                        xhr.withCredentials = true;

                                        xhr.addEventListener("readystatechange", function () {
                                            if (this.readyState === this.DONE) {

                                                let str = this.responseText
                                                str = str.substring(str.indexOf("similarity:")+15, str.indexOf("value")-2)
                                                firebase.database().ref("Users/"+names[i]+"/Activity/" + CurrentRecord.key + "/" + imgName).set({
                                                    Name: imgName,
                                                    Similarity: str,
                                                    Link: imgUrl
                                                });

                                                // str.substring(str.indexOf("similarity: "), )

                                            }
                                        });

                                        xhr.open("GET", "https://twinword-text-similarity-v1.p.rapidapi.com/similarity/?text1=" + CurrentRecord.key + "&text2=" + imgName);
                                        xhr.setRequestHeader("x-rapidapi-key", "6c0ac42843msh4bec17db4b0e9adp128a17jsnfefa5fdddb20");
                                        xhr.setRequestHeader("x-rapidapi-host", "twinword-text-similarity-v1.p.rapidapi.com");

                                        xhr.send(data);
                                    }
                                )
                            })
                        }
                    }
                    alert('image added successfully');
                });
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
            // if (!(this.parentNode.querySelector('.custom-option.selected') == null)) {
            try {
                this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            }catch (e) {

            }
            // }
            this.classList.add('selected');
            this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;

            // alert(this.value);

            switch (this.innerHTML) {
                case "Recipe":
                    hidePostOps()
                    document.getElementById("recipe").hidden = false;
                    postType = "recipe";
                    break;
                case "Workout":
                    hidePostOps()
                    document.getElementById("workout").hidden = false;


                    postType = "workout";
                    break;
                case "Quote":
                    hidePostOps()
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


function hideViewOps() {
    document.getElementById("viewQuoteDiv").hidden = true;
    document.getElementById("viewRecipe").hidden = true;
    document.getElementById("viewWorkoutDiv").hidden = true;
}

function viewPostPage(postPath, titleName, username) {
    document.getElementById("viewTitle").innerHTML = titleName.toUpperCase();
    document.getElementById("heart2").hidden = false;
    document.getElementById("username").innerText = username;
    firebase.database().ref(postPath).on('value', function (snapshot) {
        hideViewOps()
        switch (snapshot.val().Type.toString()) {
            case "recipe":
                document.getElementById("postType").innerHTML = "Recipe";
                document.getElementById("viewRecipe").hidden = false;
                document.getElementById("viewPrep").innerHTML = "Prep Time: " + snapshot.val().PrepTime + "mins";
                document.getElementById("viewCook").innerHTML = "Cook Time: " + snapshot.val().CookTime + "mins";
                document.getElementById("viewServingSize").innerHTML = "Serves: " + snapshot.val().ServingSize + " people";
                document.getElementById("viewIngredients").innerHTML = "Ingredients: " + snapshot.val().Ingredients;
                document.getElementById("viewMethod").innerHTML = "Method: " + snapshot.val().Method;
                break;
            case "workout":
                document.getElementById("postType").innerHTML = "Workout";

                document.getElementById("viewWorkoutDiv").hidden = false;

                document.getElementById("viewWorkoutDesc").innerHTML = "Description: " + snapshot.val().Description;
                document.getElementById("viewWorkout").innerHTML = "Workout: " + snapshot.val().Workout;
                break;
            case "quote":
                document.getElementById("postType").innerHTML = "Quote";

                document.getElementById("viewQuoteDiv").hidden = false;

                document.getElementById("viewQuote").innerHTML = "Quote: " + snapshot.val().Quote;
                break;
        }
    });
    firebase.database().ref(postPath + "/Comments").once('value', function (allRecords) {
        for (let i = 0; i < allComments.length; i++) {
            document.getElementById('postpage').removeChild(allComments[i])

        }
        allComments = [];
        allRecords.forEach(
            function (CurrentRecord) {
                var comment = CurrentRecord.val().poster + ": " + CurrentRecord.val().comment;

                var hr1 = document.createElement('hr')

                var img1 = document.createElement('img')
                img1.className = "pfpcomment";
                img1.onclick = function () {
                    viewProfile(CurrentRecord.val().poster)
                };

                var comment2 = document.createElement('p')

                var hr2 = document.createElement('hr')

                comment2.innerHTML = comment;
                comment2.className = "commentthing"

                var pfpsrc;
                firebase.database().ref("Users/" + CurrentRecord.val().poster + "/PFP/" + "Link").on('value', function (snapshot) {
                    pfpsrc = snapshot.val();
                    if (pfpsrc != null) {
                        img1.src = pfpsrc;
                    }
                    else{
                        img1.src = "resources/select image picture.PNG";
                    }
                });
                document.getElementById('postpage').append(hr1, img1, comment2, hr2)
                allComments.push(hr1, img1, comment2, hr2)
            }
        )
    });
}

var viewProfPosts = [];
function viewProfile(userName) {
    if (userName !== nameV) {
        hideMainDivs();
        document.getElementById("viewProfiles").hidden = false;
        document.getElementById("viewUsername").innerHTML = userName;

        firebase.database().ref("Users/" + userName + "/PFP/Link").on("value", function (snapshot) {
            pfpsrc = snapshot.val();
            if (pfpsrc != null) {
                document.getElementById("viewPfp").src = pfpsrc;
            } else {
                document.getElementById("viewPfp").src = "resources/select image picture.PNG";
            }
        });

        for (let i = 0; i < viewProfPosts.length; i++) {
            document.getElementById('viewProfiles').removeChild(viewProfPosts[i])
        }
        viewProfPosts = [];
        firebase.database().ref("Users/" + userName + "/Posts").once('value', function (snapshot) {
            snapshot.forEach(function (child) {
                var str = "Users/" + userName + "/Posts/" + child.key;

                firebase.database().ref("Users/" + userName + "/Posts/" + child.key + "/Link").on('value', function (snapshot) {
                    var img = document.createElement('img');

                    img.src = snapshot.val();
                    img.onclick = function () {
                        postName = img.src.substring(img.src.indexOf("%2F") + 3, img.src.indexOf(".png"))
                        postName = postName.replaceAll("%20", " ")
                        postName = postName.toUpperCase();
                        viewPostPage(str, postName, userName)
                        hideMainDivs();
                        document.getElementById("postpage").hidden = false;
                        document.getElementById("heart2").hidden = true;
                        for (let i = 0; i < postsonpostpage.length; i++) {
                            document.getElementById('postonpostpage').removeChild(postsonpostpage[i])
                        }
                        postsonpostpage = [];
                        var img2 = document.createElement('img');
                        img2.src = img.src
                        img2.className = "postimageonpostpage"

                        document.getElementById('postonpostpage').appendChild(img2);
                        postsonpostpage.push(img2);


                    }
                    document.getElementById("viewProfiles").appendChild(img);
                    viewProfPosts.push(img);
                })
            });
        });
    } else {
        viewMyProfile();
    }
}

document.getElementById("chatsBtn").onclick = function () {
    hideMainDivs();

    document.getElementById("showChatDiv").hidden = false;

    document.getElementById("viewChats").innerHTML = "";

    firebase.database().ref("Users/"+nameV+"/Chats").once('value', function(snapshot) {
        snapshot.forEach(function (dmName) {
            var hr1 = document.createElement('hr')

            var dmpfp = document.createElement("img");
            firebase.database().ref("Users/" + dmName.key + "/PFP/" + "Link").once('value', function (snapshot) {
                let pfpsrc = snapshot.val();
                if (pfpsrc != null) {
                    dmpfp.src = pfpsrc;
                }
            });
            dmpfp.className = "profilepic"

            var dmPerson = document.createElement("p")
            dmPerson.innerHTML = dmName.key;
            var hr2 = document.createElement('hr')
            var divChats = document.createElement('div')
            divChats.append(hr1, dmpfp, dmPerson, hr2);
            divChats.onclick = function() {
                onChatClicked(dmName.key);
            }

            document.getElementById("viewChats").append(divChats);
        })
    })
}

var chatOpened = false;

function onChatClicked(dmUser) {
    hideMainDivs();
    chatOpened = true;
    document.getElementById("showChat").hidden = false;

    document.getElementById("chatName").innerHTML = dmUser;
    var dmpfp = "";
    firebase.database().ref("Users/" + dmUser + "/PFP/" + "Link").once('value', function (snapshot) {
        let pfpsrc = snapshot.val();
        if (pfpsrc != null) {
            dmpfp = pfpsrc;
        }
        document.getElementById("chatPfp").src = dmpfp;
    });

    firebase.database().ref("Users/"+nameV+"/Chats/"+dmUser).on('value', function(snapshot) {
        document.getElementById("chatBox").innerHTML = "";
        snapshot.forEach(function (text) {
            // alert(text.val().Texter)
            var chatDiv = document.createElement("div")
            var phatDiv = document.createElement("div");
            phatDiv.className = "phatDiv"
            var br = document.createElement("br")
            var hr = document.createElement("hr")
            var message = document.createElement("p")
            // var hr = document.createElement("hr")
            // hr.hidden = true;
            message.innerHTML = text.val().Text;
            chatDiv.append(message)
            phatDiv.append(chatDiv, br, hr)
            if (text.val().Texter === "You") {//sent by other
                text.val().Status = "Read";
                chatDiv.className = "leftChat";

            } else {//sent by me
                chatDiv.className = "rightChat";

            }
            document.getElementById("chatBox").append(chatDiv);
            // for (i = 0;i<chatDiv.scrollHeight;i++) {
            //     // if (i%5===0) {
            //
            //         document.getElementById("chatBox").append(br);
            //     // }
            // }
        })
    })

}


document.onkeydown = function (e) {
    if(e.keyCode === 13 && chatOpened) {
        sendChatMsg()
    }
}

document.getElementById("sendMsgBtn").onclick = function() {
    sendChatMsg()
}

function sendChatMsg() {
    var msg = document.getElementById("sendMsgtxt").value;
    var tempCheck = msg.replace(/\s/g, '');
    if (tempCheck.length > 0) {
        var x = new Date();
        // alert(formatAMPM(x))


        //2 pushes 1 to nameV and one to id="chatName"
        firebase.database().ref("Users/"+nameV+"/Chats/"+document.getElementById("chatName").innerHTML.toString()).push({
            Text: msg,
            Texter: "Me",
            Time: formatAMPM(new Date())
        })

        firebase.database().ref("Users/"+document.getElementById("chatName").innerHTML.toString()+"/Chats/"+nameV).push({
            Text: msg,
            Texter: "You",
            Time: formatAMPM(new Date()),
            Status: "Unopened"
        })

        document.getElementById("sendMsgtxt").value = "";
        //update by adding chatDiv append

    }
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours>=12 ? 'PM' : 'AM';
    hours = hours%12;
    hours = hours ? hours: 12;
    minutes = minutes <10 ? '0'+minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
}


document.getElementById("newChatBtn").onclick = function () {
    var username = prompt("What is the username of the person you are trying to message?");

    firebase.database().ref("Users/"+username).once("value", function (snapshot){
        if (snapshot.exists()) {
            hideMainDivs();
            document.getElementById("showChat").hidden = false;
            onChatClicked(username)
        } else {

            alert("There is no account with this username. Make sure you entered the right username.")
        }
    })
}

document.getElementById("msgBtn").onclick = function () {
    hideMainDivs();
    document.getElementById("showChat").hidden = false;

    document.getElementById("chatName").innerHTML = document.getElementById("viewUsername").innerHTML.toString();
    var dmpfp = "";
    firebase.database().ref("Users/" + document.getElementById("viewUsername").innerHTML.toString() + "/PFP/" + "Link").once('value', function (snapshot) {
        let pfpsrc = snapshot.val();
        if (pfpsrc != null) {
            dmpfp = pfpsrc;
        }
    });
    document.getElementById("chatPfp").src = dmpfp;


    firebase.database().ref("Users/"+nameV+"/Chats/"+document.getElementById("viewUsername").innerHTML.toString()).once('value', function (snapshot) {
        if (snapshot.exists()) {
            // alert("exists")
            onChatClicked(document.getElementById("viewUsername").innerHTML.toString())
        } else {
            document.getElementById("chatBox").innerHTML = 0;
            // alert("NO")
        }
    })
}
