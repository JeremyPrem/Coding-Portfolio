const userInfo = document.getElementById('user-info');
const editButton = document.getElementById('edit-button');
const saveButton = document.getElementById('save-button');
const pic = document.getElementById('pic');
const user = JSON.parse(localStorage.getItem('user'))
const display = document.getElementById('data-display');
const form = document.getElementById('edit-form');
const weightTracker = document.getElementById('weight-up');

function updateUserData(){
    const new_age = document.getElementById("age").value;
    const new_feet = document.getElementById("heightFeet").value;
    const new_inches = document.getElementById("heightInches").value;
    const new_weight = document.getElementById("weight").value;
    const new_level = document.querySelector('input[name="skillLevel"]:checked');
    const new_name = document.getElementById("username").value;
    const new_cals = document.getElementById("targetCalories").value;
    const new_days = document.querySelector(".largerCheckbox").value;    
    const new_gender = document.querySelector('input[name="gender"]:checked');

    if(new_age){
        user.profile.age = new_age;
    }
    if(new_feet){
        user.profile.height.feet = new_feet;
    }
    if(new_inches){
        user.profile.height.inches = new_inches;
    }
    if(new_weight){
        user.profile.weight = new_weight;
    }
    if(new_level){
        user.profile.level = new_level;
    }
    if(new_name){
        user.profile.user_name = new_name;
    }
    if(new_cals){
        user.profile.calories = new_cals;
    }
    if(new_days){
        user.profile.days = new_days;
    }
    if(new_gender){
        user.profile.gender = new_gender;
    }
    console.log(user.profile);
}

function toggleDisplay(element) {
    element.style.display = (element.style.display === 'none') ? 'block' : 'none';
}

window.onload = function () {
    const bmi = user.profile.weight/(Number(user.profile.height.feet)+Number(user.profile.height.inches/12))
    
    const roundedBMI = bmi.toFixed(0);
    console.log(document.getElementById("name"));
    document.getElementById("user-name").innerHTML = user.profile.user_name;
    document.getElementById("user-height").innerHTML = user.profile.height.feet+" feet "+user.profile.height.inches+" inches";
    console.log(user.profile.height.feet);
    document.getElementById("user-weight").innerHTML = user.profile.weight;
    document.getElementById("user-bmi").innerHTML = roundedBMI;

    document.getElementById("username").innerHTML = user.profile.user_name;
    document.getElementById("age").innerHTML = user.profile.age;
    document.getElementById("weight").innerHTML = user.profile.weight;
    document.getElementById("age").innerHTML = user.profile.age;
    document.getElementById("targetCalories").innerHTML = user.profile.calories;

    const image = document.createElement('img');
    if(roundedBMI <= 18){
        document.getElementById("BMI-Notice").innerHTML = "Your current BMI suggests that you are <strong>underweight</strong>";
        image.src = 'underweight.png';
        image.alt = "underweight";
        const imageContainer = document.getElementById('BMI-Image');
        imageContainer.appendChild(image);
    }  else if(roundedBMI >= 19 && roundedBMI <= 24) {
        document.getElementById("BMI-Notice").innerHTML = "Your current BMI suggests that you are at a <strong>healthy weight</strong>";
        image.src = 'normal-weight.png';
        image.alt = "normal";
        const imageContainer = document.getElementById('BMI-Image');
        imageContainer.appendChild(image);
    } else if(roundedBMI >= 25 && roundedBMI <= 29) {
        document.getElementById("BMI-Notice").innerHTML = "Your current BMI suggests that you are <strong>overweight</strong>";
        image.src = 'overweight.png';
        image.alt = "overweight";
        const imageContainer = document.getElementById('BMI-Image');
        imageContainer.appendChild(image);
    } else {
        document.getElementById("BMI-Notice").innerHTML = "Your current BMI suggests that you are <strong>obese</strong>";
        image.src = 'obese.png';
        image.alt = "obese";
        const imageContainer = document.getElementById('BMI-Image');
        imageContainer.appendChild(image);
    }
};

editButton.addEventListener('click', () => {
    op = 0;
    body.style.visibility = 'visible'
    let fadeInt = setInterval(function(){
        if(op >= 1){
            clearInterval(fadeInt)
        }
        body.style.opacity = op
        body.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += .075
    },30)
    toggleDisplay(userInfo);
    toggleDisplay(form);
    toggleDisplay(pic);

   //if (display.classList.contains('active-div')) {
    // Toggle from Div 1 to Div 2
   // display.classList.remove('active-div');
    //display.classList.add('inactive-div');
   // form.classList.remove('inactive-div');
   // form.classList.add('active-div');
 // } else {
    // Toggle from Div 2 to Div 1
   // form.classList.remove('active-div');
   // form.classList.add('inactive-div');
   // display.classList.remove('inactive-div');
   // display.classList.add('active-div');
 // }
});

saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    op = 0;
    body.style.visibility = 'visible'
    let fadeInt = setInterval(function(){
        if(op >= 1){
            clearInterval(fadeInt)
        }
        body.style.opacity = op
        body.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += .075
    },30)

    // Update the displayed user data
    document.getElementById("user-name").innerHTML = user.profile.user_name;
    document.getElementById("user-height").innerHTML = user.profile.height.feet+" feet "+user.profile.height.inches+" inches";
    document.getElementById("user-weight").innerHTML = user.profile.weight;
    // Toggle back to the display mode
    toggleDisplay(pic);
    toggleDisplay(userInfo);
    toggleDisplay(form);
});

window.addEventListener('load', () => {

    op = 0;
    body.style.visibility = 'visible'
    let fadeInt = setInterval(function(){
        if(op >= 1){
            clearInterval(fadeInt)
        }
        body.style.opacity = op
        body.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += .1
    },30)
})

weightTracker.addEventListener('click', () =>{
    user.profile.weight_track.push(document.getElementById('weight-up').value);
})
function updateUI(){
    currentExerciseLevel.textContent = 'Exercise Level: ' + user.profile.level

    let workoutInfo = fetchNumberWorkouts()

    numberOfWorkouts.textContent = 'Exercises Completed: '+ workoutInfo[0]
    completedWorkoutsCircleGraph.style = "display: block; position: relative;left: 50%;top: -55%;width: 150px;height: 150px;border-radius: 50%;background: radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(green "+Math.round(workoutInfo[0]/workoutInfo[1]*100)+"%, grey 0);"
    workoutsPercentage.textContent = Math.round(workoutInfo[0]/workoutInfo[1]*100)+"%"

}

function fetchNumberWorkouts(){
    let keys = Object.keys(user['exercise']['daysEntered']);
    let total = 0;
    let completed = 0;
    for (let k of keys){
        let i = 0;
        let check = true;
        console.log(k)
        while(i < user['exercise']['daysEntered'][k]['workouts'].length){
            check = check && user['exercise']['daysEntered'][k]['workouts'][i]['done']
            i++;
        }
        if(check){
            completed++;
        }
        total++;

    }

    return[completed,total]

}