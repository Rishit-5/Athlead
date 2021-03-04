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

// var nameV,rollV,secV,genV;
// function Ready(){
//     nameV = document.getElementById('namebox').value;
//     rollV = document.getElementById('rollbox').value;
//     secV = document.getElementById('secbox').value;
//     genV = document.getElementById('genbox').value;
//
// }
//
// document.getElementById('insert').onclick = function(){
//     Ready();
//     firebase.database().ref('student/'+nameV).set({
//         nameOfStudent: nameV,
//         RollNo: rollV,
//         Section: secV,
//         Gender: genV,
//     });
// }
//
// document.getElementById("select").onclick = function(){
//     Ready();
//     firebase.database().ref('student/' + rollV).on('value',function(snapshot){
//         document.getElementById("namebox").value = snapshot.val().nameOfStudent;
//         document.getElementById('secbox').value = snapshot.val().Section;
//         document.getElementById('genbox').value = snapshot.val().Gender;
//
//
//
//
//     });
// }
//
// document.getElementById('update').onclick = function(){
//     Ready();
//     firebase.database().ref('student/'+rollV).update({
//         nameOfStudent: nameV,
//         Section: secV,
//         Gender: genV
//     });
// }
//
// document.getElementById('delete').onclick = function(){
//     Ready();
//     firebase.database().ref('student/'+rollV).remove();
// }
var nameV,emailV,passWV,genV;
var files = [];
var yourPosts = [];
var imageVs = [];
var imgName, imgUrl;
var reader;

document.getElementById("enterBtn").onclick = function () {
    nameV = document.getElementById("namebox").value;
    emailV = document.getElementById("emailbox").value;
    passWV = document.getElementById("passbox").value;

    if (!(nameV == "") && !(emailV == "") && !(passWV == "")) {
        // if (firebase.database().ref("Users/" + nameV).exists()) {
        //     if (passWV == firebase.database().ref("Users/"+nameV).getChild("Password").getValue()) {
        //         alert("Welcome Back!");
        //         emailV = firebase.database().ref("Users/" + nameV).getChild("Email").getValue();
        //
        //
        //         document.getElementById("signinScreen").hidden = true;
        //         document.getElementById("app").hidden = false;
        //         hideMainDivs();
        //         document.getElementById("homePage").hidden = true;
        //     } else {
        //         alert("Incorrect password");
        //     }
        // } else {
        //     firebase.database().ref("Users/"+nameV).set({
        //         Name:nameV,
        //         Email: emailV,
        //         Password: passWV,
        //         Followers: 0,
        //
        //     });
        //     document.getElementById("signinScreen").hidden = true;
        //     document.getElementById("app").hidden = false;
        //     hideMainDivs();
        //     document.getElementById("homePage").hidden = true;
        // }
        //

        firebase.database().ref("Users/"+nameV).on('value', function (snapshot) {
            if (snapshot.exists()) {
                var passpass;
                firebase.database().ref("Users/"+nameV+"/Password").on('value', function(snapshot) {
                    passpass = snapshot.val();
                });

                if (passWV ===passpass) {
                    alert("Welcome!");
                    firebase.database().ref("Users/"+nameV+"/Email").on('value', function(snapshot) {
                        emailV = snapshot.val();
                    });

                    document.getElementById("signinScreen").hidden = true;
                    document.getElementById("app").hidden = false;
                    hideMainDivs();
                    document.getElementById("homePage").hidden = true;
                } else {
                    alert("Incorrect password");
                }
            } else {
                firebase.database().ref("Users/"+nameV).set({
                    Name:nameV,
                    Email: emailV,
                    Password: passWV,
                    Followers: 0,

                });
                document.getElementById("signinScreen").hidden = true;
                document.getElementById("app").hidden = false;
                hideMainDivs();
                document.getElementById("homePage").hidden = true;
            }
        });

    } else {
        alert("Your password, email, or name field is empty");
    }
}

// function put() {
//     nameV = document.getElementById("namebox").value;
//     emailV = document.getElementById("emailbox").value;
//     passWV = document.getElementById("passbox").value;
//     firebase.database().ref("Users/"+nameV).set({
//         Name:nameV,
//         Email: emailV,
//         Password: passWV,
//         Followers: 0,
//
//     });
// }


document.getElementById("homeBtn").onclick = function () {
    hideMainDivs();
    document.getElementById("homePage").hidden = false;
}

document.getElementById("searchBtn").onclick = function () {
    hideMainDivs();
    document.getElementById("searchPage").hidden = false;
}

document.getElementById("myprofileBtn").onclick = function () {
    hideMainDivs();
    document.getElementById("myprofilePage").hidden = false;
    document.getElementById("myprofile").hidden = false;
    document.getElementById("postingPage").hidden = true;
    for (let i = 0; i < yourPosts.length; i++) {
        document.getElementById('myprofilePage').removeChild(yourPosts[i])
    }
    firebase.database().ref("Users/"+nameV+"/Posts").once('value', function (snapshot) {
        snapshot.forEach(function (child) {
            var str = "Users/"+nameV+"/Posts/"+child.key + "/Link";
            // child.getRef().on('value', function (snapshot) {
            //     //images.add( snapshot.getChild("Link").val();
            // });
            firebase.database().ref(str).on('value', function (snapshot) {
                var img = document.createElement('img');
                img.src = snapshot.val();
                document.getElementById('myprofilePage').appendChild(img);
                yourPosts.push(img);
            })
        });
    });
    // for (let i = 0; i < images.length; i++) {
    //     imageVs.push(document.createElement('img'));
    //     imgName = "mai"
    //     firebase.database().ref('Users/'+nameV+"/Posts/"+imgName).on('value', function(snapshot){
    //         imageVs[i].src = snapshot.val().Link;
    //     });
    //     document.getElementById('body').appendChild(imageVs[i]);
    // }

}

document.getElementById("postBtn").onclick = function () {
    document.getElementById("myprofile").hidden = true;
    document.getElementById("postingPage").hidden = false;
}

// document.getElementById("quoteBtn").onclick = function () {
//     hidePostOps();
//     document.getElementById("quote").hidden = false;
// }
//
// document.getElementById("recipeBtn").onclick = function () {
//     hidePostOps();
//     document.getElementById("recipe").hidden = false;
// }
//
// document.getElementById("workoutBtn").onclick = function () {
//     hidePostOps();
//     document.getElementById("workout").hidden = false;
// }
//
// document.getElementById("postBackBtn").onclick = function () {
//     document.getElementById("myprofile").hidden = false;
//     document.getElementById("postingPage").hidden = true;
// }

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
// document.getElementById("retrieve").onclick = function(){
//     imgName = document.getElementById('namebox1').value;
//     firebase.database().ref('Pictures/'+imgName).on('value', function(snapshot){
//         document.getElementById('myimg').src = snapshot.val().Link;
//     });
//
//
// }
document.getElementById("post").onclick = function(){
    imgName = document.getElementById("namebox1").value;
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

                    firebase.database().ref('Users/'+nameV+"/Posts/" + imgName).set({
                        Link: imgUrl,
                        Type: document.getElementById("postType").value

                    });
                    alert('image added successfully');
                }
            );
        });

}


// document.getElementById('up').onclick = function(){
//     imgName = document.getElementById("namebox1").value;
//     var uploadTask = firebase.storage().ref('Image/'+imgName+".png").put(files[0]);
//
//     uploadTask.on('state_changed', function (snapshot){
//             var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             document.getElementById('upProgress').innerHTML = 'Upload' + progress+'%';
//         },
//         function(error){
//             alert('error')
//         },
//         function(){
//             uploadTask.snapshot.ref.getDownloadURL().then(function(url){
//                     imgUrl = url;
//
//                     firebase.database().ref('Pictures/'+imgName).set({
//                         Name: imgName,
//                         Link: imgUrl
//                     });
//                     alert('image added successfully');
//                 }
//             );
//         });
// }
