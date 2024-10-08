/* Controls navigation between tabs */

function navigateTo(el){
    // save json file to local storage
    const body = document.getElementById('body')

    let userJSON = JSON.stringify(user)
    localStorage.setItem('user',userJSON);
    localStorage.setItem('timeStamp',new Date().getTime())
    
    console.log(el.getAttribute('id'))
    let locationStr = "";
    // begin navigation
    if(el.getAttribute('id').includes("home")){
        // navigate to home page
        
        locationStr = "./index.html"
    } else if(el.getAttribute('id').includes("fitness")){
        // navigate to fitness page
        locationStr = "./fitness.html"
    }  else if(el.getAttribute('id').includes("diet")){
        // navigate to diet page
    
        locationStr = "./diet.html"
    }  else if(el.getAttribute('id').includes("habits")){
        // navigate to habits page
        locationStr = "./habits.html"
    } else {
        // navigate to settings
        locationStr = "./profile.html"
    }

    op = 1;
    let fadeInt = setInterval(function(){
        if(op <= 0){
            location.replace(locationStr);
            clearInterval(fadeInt)
        }
        body.style.opacity = op
        body.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= .1
    },30)

}