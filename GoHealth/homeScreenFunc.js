const header = document.getElementById('header');
const selectedDate = document.getElementById('selectedDate');

const exerciseList = document.getElementById('exerciseList');
const circularProgressBar = document.getElementById('circularProgressBar')
const dietProgress = document.getElementById('dietProgress')
const percentageText = document.getElementById('percentageText')
const consumedText = document.getElementById('consumedText')
const togoText = document.getElementById('togoText')
const habitsList = document.getElementById('habitsList');
const body = document.getElementById('body')

let healthyHabits = ["Take a 1 mile walk",
                    "Read for 10 minutes",
                "Drink 8 glasses of water",
                "Eat 1 apple",
                "Meditate for 5 minutes",
                "Do 10 situps",
                "Do 10 pushups"];







window.addEventListener('load',() => {
    // need to check if the localStorage data is valid
    let timeStamp = localStorage.getItem('timeStamp');
    let currentTime = new Date().getTime();

    // use the local storage for the home screen if the local storage content is less than an hour old
    if(parseInt(timeStamp)+3600000 < currentTime){
        localStorage.clear()
    } else if(localStorage.length != 0) {
        user = JSON.parse(localStorage.getItem('user'))

    }

    updateUI()

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

function updateUI(){
    header.children[0].textContent = 'Welcome back, '+user['profile']['user_name']+"!"
    // update diet info
    let goal = user['diet']['goal'].calories;
    let weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']; 
    let burned = user['exercise']['daysEntered'][selectedDate.textContent.split(' ')[3]] ? user['exercise']['daysEntered'][selectedDate.textContent.split(' ')[3]].caloriesBurned : 0;
    let consumed = user['diet']['daysEntered'][selectedDate.textContent.split(' ')[3]] ? user['diet']['daysEntered'][selectedDate.textContent.split(' ')[3]].totalCalories : 0;
    let percent = Math.min(Math.round(consumed/(goal+burned)*100),100)

    let currDate = selectedDate.textContent.split(' ')[3]
    document.querySelector('#exerciseList').innerHTML = '';
    if (user.exercise.daysEntered[currDate]) {
        for (let i = 0; i < user.exercise.daysEntered[currDate].workouts.length; i++) {
            let workout = user.exercise.daysEntered[currDate].workouts[i];
            console.log(workout)
            document.getElementById("exerciseList").insertAdjacentHTML('beforeend', '<li>' + workout.name + ' ' + workout.duration + '</li>');
        }
    } else if (user.profile.days.includes(weekdays[new Date(currDate).getDay()])) {
        for (let i = 0; i < exercises[user.profile.level].length; i++) {
            let workout = exercises[user.profile.level][i];
            document.getElementById("exerciseList").insertAdjacentHTML('beforeend', '<li>' + workout.name + ' ' + workout.duration + '</li>');
        }
    } else {
       let cont = document.getElementById("exerciseListContainer")
       let i = document.createElement('i')
       let div = document.createElement('div')
       let div3 = document.createElement('div')
       let br = document.createElement('br')
       div3.textContent = 'No Exercises for today!'
       i.className = 'fa-solid fa-award fa-3x'
       i.size = '50px'       
       div.align = 'center'
       div.append(div3)
       div.append(i)
       cont.appendChild(br)
       cont.appendChild(div)
    }

    circularProgressBar.style = "position: relative;left: 35%;top: 5%;width: 300px;height: 300px;border-radius: 50%;background: radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(green "+percent+"%, grey 0);"

    percentageText.textContent = percent+"%"
    consumedText.textContent = consumed + " cal"
    togoText.textContent = goal+burned-consumed  + " cal"

    // Update healthy habit portion of the UI

    document.querySelector('#habitsList').innerHTML = '';
    for (let i = 0; i < user.habits.daysEntered[currDate][0].length; i++) {
        let currHabit = healthyHabits[user.habits.daysEntered[currDate][0][i]];
        document.getElementById("habitsList").insertAdjacentHTML('beforeend', '<li>' + currHabit + '</li>');
    }

    let completed = true;

    for (let i = 0; i < user['habits']['daysEntered'][currDate][1].length; i++) {
        if (user['habits']['daysEntered'][currDate][1][i] == false) {
            completed = false;
            break;
        }
    }

    if (completed == true) {
        document.querySelector('#habitsList').innerHTML = '';
        document.querySelector('#habitsListContainer').insertAdjacentHTML('beforeend', '</div><div style="margin-left: 10px; margin-top: 60px">Congratulations on completing today\'s healthy habits!</div> <div style="font-size: 100px; display: block; margin-left: auto; margin-right: auto; margin-top: 80px; width: 9%"><i class="fa-solid fa-heart-circle-check"></i>');
    }

    

    //circularProgressBar.style = "background: radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(green "+percent+"%, grey 0);"


}