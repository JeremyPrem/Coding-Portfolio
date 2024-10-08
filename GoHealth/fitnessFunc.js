const leftArrowContainer = document.getElementById('leftPos');
const rightArrowContainer = document.getElementById('rightPos');
const selectedDate = document.getElementById('selectedDate');
const week = document.getElementById('week');
const monday = document.getElementById('monday');
const tuesday = document.getElementById('tuesday');
const wednesday = document.getElementById('wednesday');
const thursday = document.getElementById('thursday');
const friday = document.getElementById('friday');
const saturday = document.getElementById('saturday');
const sunday = document.getElementById('sunday');
const addTodoButton = document.getElementById('addTodoButton')
const addTodoForm = document.getElementById('addTodoForm')
const todoSubmitButton = document.getElementById('todoSubmitButton')
const workoutForm = document.getElementById('workoutForm')
const editExerciseForm = document.getElementById('editExerciseForm')


const user = JSON.parse(localStorage.getItem('user'))

let load = 0

window.onload = function() {
    let lastWeek = []
    let i = 0;
    let indCurr = -1;
    let lastWeekAnim = []
    while(i < week.childElementCount){
        const date = new Date(week.children[i].children[0].textContent)
        const newDay = new Date(date.getTime());
        let split = newDay.toLocaleDateString().split('/')
        lastWeek.push(split[0]+'/'+split[1]+'/'+(split[2].substring(2)))
        lastWeekAnim.push(split[0]+'/'+split[1]+'/'+(split[2]))
        if(week.children[i].style.backgroundColor != ''){
            indCurr = i
        }
        i++;
    }
    const animArr = checkGoalsCompleted(lastWeekAnim)
    i = 0 
    while (i < 7) {
        console.log(week.children[i].children[1].children[0])
        if(animArr[i] == 0){
            week.children[i].children[1].children[0].className = 'fa-solid fa-check fa-2x'
            week.children[i].children[1].children[0].style.color ='green'
            week.children[i].children[1].children[0].style.visibility = 'visible'
        } else if (animArr[i] == 2) {
            week.children[i].children[1].children[0].className = 'fa-solid fa-dumbbell fa-2x'
            week.children[i].children[1].children[0].style.color ='grey'
            week.children[i].children[1].children[0].style.visibility = 'visible'
        } else { 
            week.children[i].children[1].children[0].style.visibility = 'hidden'
        }
        i++
    }

    changeDate(document.getElementById(selectedDate.textContent.split(', ')[0].toLowerCase()+'Date').parentElement);

    let op = 0;
    body.style.visibility = 'visible'
    let fadeInt = setInterval(function(){
        if(op >= 1){
            clearInterval(fadeInt)
        }
        body.style.opacity = op
        body.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += .1
    },30)
};

// calendar related code
function changeDate(el){
    let i = 0;
    let indNew = 0;
    let indCurr = 0;
    let dayOfTheWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    while(i < week.childElementCount){
        if(week.children[i].style.backgroundColor != ''){
            indCurr = i
        }
        week.children[i].style.backgroundColor = ''
        if(week.children[i] == el){
            indNew = i;
        }
        i++;
    }
    el.style.backgroundColor = '#90EE90'
    let dateText = selectedDate.textContent.split(', ')[1];
    let date = new Date(dateText);
    let newDateText = el.children[0].textContent
    const newDay = new Date(newDateText);
    selectedDate.children[0].textContent = dayOfTheWeek[newDay.getDay()] +", "+newDay.toLocaleDateString()
    if (date.toString() !== newDay.toString() || load == 0) {
        load = 1
        updateUI(newDay.toLocaleDateString());
    } 
}

function updateUI(date) {
    let currDay = user['exercise']['daysEntered'][selectedDate.textContent.split(' ')[1]] ? user['exercise']['daysEntered'][selectedDate.textContent.split(' ')[1]]['workouts'] : null
    let workoutPlan = exercises[user.profile.level] 
    let weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] // will be user preference
    let schedDays = user.profile.days 
    let i = 0
    let calBurn = 0
    let weekIndex = new Date(selectedDate.textContent.split(', ')[1]).getDay()
    document.querySelector("#todoContents").innerHTML = "";
    if (currDay && (document.getElementById(weekdays[weekIndex]).children[1].children[0].className == 'fa-solid fa-dumbbell fa-2x' 
    || document.getElementById(weekdays[weekIndex]).children[1].children[0].className == 'fa-solid fa-check fa-2x')) {
        i = 0
        while (i < currDay.length) {
            let exercise = currDay[i]['duration'] + ' ' + currDay[i]['name']
            let el = document.createElement("div"); 
            el.className = "workout"
            el.id = 'workout' + i.toString()
            let checkEl = document.createElement("input")
            checkEl.id = i.toString()
            checkEl.type = 'checkbox'
            checkEl.className = 'largerCheckbox'
            checkEl.style.padding.bottom = '10px'
            
            if (currDay[i]['done']){
                calBurn += currDay[i]['calBurn']
               checkEl.setAttribute('checked', true)
            }
            let text = document.createTextNode(exercise)
            checkEl.setAttribute('onclick', 'updateCheck(this)')
            let selectEl = document.createElement('button')
            selectEl.id = 'select' + currDay[i]['name']
            selectEl.style = 'background-color: transparent; background-repeat: no-repeat; border: none; overflow: hidden; outline: none;'
            selectEl.style.position = 'absolute'
            selectEl.style.right = '2%'
            selectEl.className = 'fa-solid fa-arrow-right fa-2x'
            el.appendChild(checkEl)
            el.appendChild(text)
            el.appendChild(selectEl)
            selectEl.addEventListener('click', (e) => {
                let par = e.target.parentElement
                selectExercise(currDay[par.id.split('workout')[1]], par.id.split('workout')[1])
            })
            todoContents.appendChild(el)
            i++;
        }
    } else if ((document.getElementById(weekdays[weekIndex]).children[1].children[0].className == 'fa-solid fa-dumbbell fa-2x' 
    || document.getElementById(weekdays[weekIndex]).children[1].children[0].className == 'fa-solid fa-check fa-2x') && document.getElementById(weekdays[weekIndex]).children[1].children[0].style.visibility == 'visible') {
        i = 0
        while (i < workoutPlan.length) {
            let exercise = workoutPlan[i]['duration'] + ' ' + workoutPlan[i]['name']
            let el = document.createElement("div"); 
            el.className = "workout"
            el.id = 'workout' + i.toString()
            let checkEl = document.createElement("input")
            checkEl.id = i.toString()
            checkEl.type = 'checkbox'
            checkEl.className = 'largerCheckbox'
            checkEl.style.padding.bottom = '10px'
            if (workoutPlan[i]['done']){
                calBurn += workoutPlan[i]['calBurn']
               checkEl.setAttribute('checked', true)
            }
            let text = document.createTextNode(exercise)
            checkEl.setAttribute('onclick', 'updateCheck(this)')
            let selectEl = document.createElement('button')
            selectEl.id = 'select' + workoutPlan[i]['name']
            selectEl.style = 'background-color: transparent; background-repeat: no-repeat; border: none; overflow: hidden; outline: none;'
            selectEl.style.position = 'absolute'
            selectEl.style.right = '2%'
            selectEl.className = 'fa-solid fa-arrow-right fa-2x'
            el.appendChild(checkEl)
            el.appendChild(text)
            el.appendChild(selectEl)
            selectEl.addEventListener('click', (e) => {
                let par = e.target.parentElement
                selectExercise(workoutPlan[par.id.split('workout')[1]], par.id.split('workout')[1])
            })
            todoContents.appendChild(el)
            i++;
        }
        let newarr = JSON.parse(JSON.stringify(workoutPlan));
        user.exercise.daysEntered[selectedDate.textContent.split(', ')[1]] = {
            'workouts': newarr,
            'caloriesBurned': 0
        } 
    }
}

// function updateUI(date) {
//     let currDay = user['exercise']['daysEntered'][selectedDate.textContent.split(' ')[1]] ? user['exercise']['daysEntered'][selectedDate.textContent.split(' ')[1]]['workouts'] : null
//     let workoutPlan = exercises[user.profile.level] 
//     let weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] // will be user preference
//     let schedDays = user.profile.days 
//     let i = 0
//     let calBurn = 0
//     let weekIndex = new Date(selectedDate.textContent.split(', ')[1]).getDay()
//     document.querySelector("#todoContents").innerHTML = "";
//     if (currDay) {
//         i = 0
//         while (i < currDay.length) {
//             let exercise = currDay[i]['duration'] + ' ' + currDay[i]['name']
//             let el = document.createElement("div"); 
//             el.className = "workout"
//             el.id = 'workout' + i.toString()
//             let checkEl = document.createElement("input")
//             checkEl.id = i.toString()
//             checkEl.type = 'checkbox'
//             checkEl.className = 'largerCheckbox'
//             checkEl.style.padding.bottom = '10px'
            
//             if (currDay[i]['done']){
//                 calBurn += currDay[i]['calBurn']
//                checkEl.setAttribute('checked', true)
//             }
//             let text = document.createTextNode(exercise)
//             checkEl.setAttribute('onclick', 'updateCheck(this)')
//             let selectEl = document.createElement('button')
//             selectEl.id = 'select' + currDay[i]['name']
//             selectEl.style = 'background-color: transparent; background-repeat: no-repeat; border: none; overflow: hidden; outline: none;'
//             selectEl.style.position = 'absolute'
//             selectEl.style.right = '2%'
//             selectEl.className = 'fa-solid fa-arrow-right fa-2x'
//             el.appendChild(checkEl)
//             el.appendChild(text)
//             el.appendChild(selectEl)
//             selectEl.addEventListener('click', (e) => {
//                 let par = e.target.parentElement
//                 selectExercise(currDay[par.id.split('workout')[1]], par.id.split('workout')[1])
//             })
//             todoContents.appendChild(el)
//             i++;
//         }
//     } else if (schedDays.includes(weekdays[weekIndex])) {
//         i = 0
//         while (i < workoutPlan.length) {
//             let exercise = workoutPlan[i]['duration'] + ' ' + workoutPlan[i]['name']
//             let el = document.createElement("div"); 
//             el.className = "workout"
//             el.id = 'workout' + i.toString()
//             let checkEl = document.createElement("input")
//             checkEl.id = i.toString()
//             checkEl.type = 'checkbox'
//             checkEl.className = 'largerCheckbox'
//             checkEl.style.padding.bottom = '10px'
//             if (workoutPlan[i]['done']){
//                 calBurn += workoutPlan[i]['calBurn']
//                checkEl.setAttribute('checked', true)
//             }
//             let text = document.createTextNode(exercise)
//             checkEl.setAttribute('onclick', 'updateCheck(this)')
//             let selectEl = document.createElement('button')
//             selectEl.id = 'select' + workoutPlan[i]['name']
//             selectEl.style = 'background-color: transparent; background-repeat: no-repeat; border: none; overflow: hidden; outline: none;'
//             selectEl.style.position = 'absolute'
//             selectEl.style.right = '2%'
//             selectEl.className = 'fa-solid fa-arrow-right fa-2x'
//             el.appendChild(checkEl)
//             el.appendChild(text)
//             el.appendChild(selectEl)
//             selectEl.addEventListener('click', (e) => {
//                 let par = e.target.parentElement
//                 selectExercise(workoutPlan[par.id.split('workout')[1]], par.id.split('workout')[1])
//             })
//             todoContents.appendChild(el)
//             i++;
//         }
//         let newarr = JSON.parse(JSON.stringify(workoutPlan));
//         user.exercise.daysEntered[selectedDate.textContent.split(', ')[1]] = {
//             'workouts': newarr,
//             'caloriesBurned': 0
//         } 
//     }
// }




function selectExercise(exercise, index) {
    var selectors = document.getElementsByTagName('button');
    for (let i = 1; i < selectors.length; i++) {
        if (selectors[i].id == 'closeDescription') {
            continue;
        }
        selectors[i].disabled = true
    }
    let div = document.createElement('div')
    div.id = index.toString()
    let header = document.createElement('h1')
    header.align = 'center'
    header.textContent = exercise.name
    let duration = document.createElement('h2')
    let calories = document.createElement('h2')
    calories.style = 'padding-left: 30px;'
    calories.textContent = 'Calories you\'ll burn: ' + exercise.calBurn
    duration.textContent = 'Duration: ' + exercise.duration
    duration.style = 'padding-left: 30px'
    let description = document.createElement('p')
    description.textContent = exercise.description
    div.appendChild(header)
    div.appendChild(calories)
    div.appendChild(duration)
    div.appendChild(description)
    workoutForm.appendChild(div)
    workoutForm.style.display = 'block'
}


leftArrowContainer.addEventListener("click",() => {
    leftArrowContainer.style.color = 'green'
    setInterval(() => {
        leftArrowContainer.style.color = 'black'
    }, 500);
    var interval = null;
    let pos = 0;
    let counter = 1;
    let offset = 50;
    let lastWeek = []
    let i = 0;
    let indCurr = -1;
    let lastWeekAnim = []
    while(i < week.childElementCount){
        const date = new Date(week.children[i].children[0].textContent)
        const newDay = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
        let split = newDay.toLocaleDateString().split('/')
        lastWeek.push(split[0]+'/'+split[1]+'/'+(split[2].substring(2)))
        lastWeekAnim.push(split[0]+'/'+split[1]+'/'+(split[2]))
        if(week.children[i].style.backgroundColor != ''){
            indCurr = i
        }
        i++;
    }

    const animArr = checkGoalsCompleted(lastWeekAnim)
    
    interval = setInterval((animArr) => {
        // when to stop interval
        if(pos >= (700 + offset)){
            let i = 0;
            while(i < week.childElementCount){
                const date = new Date(week.children[i].children[0].textContent)
                if(date.toLocaleDateString() == selectedDate.children[0].textContent.split(', ')[1]){
                    week.children[i].style.backgroundColor = '#90EE90'
                } else {
                    week.children[i].style.backgroundColor = ''
                }
                i++;
            }

            clearInterval(interval)
        }
        // set text to next week when day goes out of view
        if(counter <= 7 && pos >= (counter*100)){
            week.children[counter-1].children[0].textContent = lastWeek[counter-1]
            if(indCurr == counter-1){
                week.children[indCurr].style.backgroundColor = ''
            }

            if(animArr[counter-1] == 0){
                week.children[counter-1].children[1].children[0].className = 'fa-solid fa-check fa-2x'
                week.children[counter-1].children[1].children[0].style.color ='green'
                week.children[counter-1].children[1].children[0].style.visibility = 'visible'
            } else if (animArr[counter-1] == 2){
                week.children[counter-1].children[1].children[0].className = 'fa-solid fa-dumbbell fa-2x'
                week.children[counter-1].children[1].children[0].style.color ='grey'
                week.children[counter-1].children[1].children[0].style.visibility = 'visible'
            } else {
                week.children[counter-1].children[1].children[0].style.visibility = 'hidden'
            }
            counter++;
        }
        

        monPos = pos >= (700 + offset) ? (-700 - offset) + pos : pos
        monday.style.left = monPos+"%"
        tuePos = pos >= (600 + offset) ? (-700 - offset) + pos : pos
        tuesday.style.left = tuePos+"%"
        wedPos = pos >= (500 + offset) ? (-700 - offset) + pos : pos
        wednesday.style.left = wedPos+"%"
        thuPos = pos >= (400 + offset) ? (-700 - offset) + pos : pos
        thursday.style.left = thuPos+"%"
        friPos = pos >= (300 + offset) ? (-700 - offset) + pos : pos
        friday.style.left = friPos+"%"
        satPos = pos >= (200 + offset) ? (-700 - offset) + pos : pos
        saturday.style.left = satPos+"%"
        sunPos = pos >= (100 + offset) ? (-700 - offset) + pos : pos
        sunday.style.left = sunPos+"%"
        pos += 15;
    },16.7,animArr)
});

rightArrowContainer.addEventListener("click",() => {
    rightArrowContainer.style.color = 'green'
    setInterval(() => {
        rightArrowContainer.style.color = 'black'
    }, 500);
    var interval = null;
    let pos = 0;
    let counter = 1;
    let offset = 50;
    let nextWeek = []
    let i = 0;
    let indCurr = -1;
    let nextWeekAnim = []
    while(i < week.childElementCount){
        const date = new Date(week.children[i].children[0].textContent)
        const newDay = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        let split = newDay.toLocaleDateString().split('/')
        nextWeek.push(split[0]+'/'+split[1]+'/'+(split[2].substring(2)))
        nextWeekAnim.push(split[0]+'/'+split[1]+'/'+(split[2]))
        if(week.children[i].style.backgroundColor != ''){
            indCurr = i
        }
        i++;
    }

    const animArr = checkGoalsCompleted(nextWeekAnim);

    interval = setInterval((animArr) => {
        if(pos >= (700 + offset)){
            let i = 0;
            while(i < week.childElementCount){
                const date = new Date(week.children[i].children[0].textContent)
                if(date.toLocaleDateString() == selectedDate.children[0].textContent.split(', ')[1]){
                    week.children[i].style.backgroundColor = '#90EE90'
                } else {
                    week.children[i].style.backgroundColor = ''
                }
                i++
            }
            clearInterval(interval)
        }

        // set text to next week when day goes out of view
        if(counter <= 7 && pos >= (counter*100)){
            week.children[counter-1].children[0].textContent = nextWeek[counter-1]
            if(indCurr == counter-1){
                week.children[indCurr].style.backgroundColor = ''
            }
            if(animArr[counter-1] == 0){
                week.children[counter-1].children[1].children[0].className = 'fa-solid fa-check fa-2x'
                week.children[counter-1].children[1].children[0].style.color ='green'
                week.children[counter-1].children[1].children[0].style.visibility = 'visible'
            } else if (animArr[counter-1] == 2){
                week.children[counter-1].children[1].children[0].className = 'fa-solid fa-dumbbell fa-2x'
                week.children[counter-1].children[1].children[0].style.color ='grey'
                week.children[counter-1].children[1].children[0].style.visibility = 'visible'
            } else {
                week.children[counter-1].children[1].children[0].style.visibility = 'hidden'
            }
            counter++;
        }

        monPos = pos >= (100 + offset) ? (700 + offset) - pos : -pos
        monday.style.left = monPos+"%"
        tuePos = pos >= (200 + offset) ? (700 + offset) - pos : -pos
        tuesday.style.left = tuePos+"%"
        wedPos = pos >= (300 + offset) ? (700 + offset) - pos : -pos
        wednesday.style.left = wedPos+"%"
        thuPos = pos >= (400 + offset) ? (700 + offset) - pos : -pos
        thursday.style.left = thuPos+"%"
        friPos = pos >= (500 + offset) ? (700 + offset) - pos : -pos
        friday.style.left = friPos+"%"
        satPos = pos >= (600 + offset) ? (700 + offset) - pos : -pos
        saturday.style.left = satPos+"%"
        sunPos = pos >= (700 + offset) ? (700 + offset) - pos : -pos
        sunday.style.left = sunPos+"%"
        pos += 15;
    },16.7,animArr)
});

function updateCheck(checkbox) { 
    let index = parseInt(checkbox.id);
    let arr = [6, 0, 1, 2, 3, 4, 5]
    let currDate = '' + selectedDate.textContent.split(', ')[1];
    if(user.exercise.daysEntered[currDate]) {
        if (user.exercise.daysEntered[currDate].workouts[index].done == true) {
            user.exercise.daysEntered[currDate].workouts[index].done = false;
            user.exercise.daysEntered[currDate].caloriesBurned -= user.exercise.daysEntered[currDate].workouts[index].calBurn
        } else {
            user.exercise.daysEntered[currDate].workouts[index].done = true;
            user.exercise.daysEntered[currDate].caloriesBurned += user.exercise.daysEntered[currDate].workouts[index].calBurn

        } 
        weekday = new Date(currDate).getDay()
        if (checkDailyGoal(user.exercise.daysEntered[currDate].workouts) == 0) {
            week.children[arr[weekday]].children[1].children[0].style.color ='green'
            week.children[arr[weekday]].children[1].children[0].className = 'fa-solid fa-check fa-2x'
            week.children[arr[weekday]].children[1].children[0].style.visibility = 'visible'
        } else if (checkDailyGoal(user.exercise.daysEntered[currDate].workouts) == 2) {
            week.children[arr[weekday]].children[1].children[0].className = 'fa-solid fa-dumbbell fa-2x'
            week.children[arr[weekday]].children[1].children[0].style.color ='grey'
            week.children[arr[weekday]].children[1].children[0].style.visibility = 'visible'
        } else {
            week.children[arr[weekday]].children[1].children[0].style.visibility = 'hidden'
        }
    }        
}

function checkDailyGoal(exercises){
    let count = exercises.length 
    for (let i = 0; i < exercises.length; i++) {
        if (!exercises[i].done) {
            count--;
        }
    } 
    if (count==exercises.length && exercises.length > 0) {
        return 0
    } else if (exercises.length > 0) {
        return 2
    } else {
        return 1 
    }
} 

function checkGoalsCompleted(week){
    let i = 0;
    let arr = []
    let weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    while(i < week.length) {
        let day = new Date(week[i]).getDay()
        let time = new Date(week[i]).getTime()
        if (user.exercise.oldSchedules && Object.keys(user.exercise.oldSchedules).length > 0) {
            for(let x = 0; x < Object.keys(user.exercise.oldSchedules).length; x++) {
                // let reschedTime = new Date(Object.keys(user.exercise.oldSchedules)[x])
                // if (time < reschedTime && user.exercise.daysEntered[week[i]]) {
                //     let check = checkDailyGoal(user.exercise.daysEntered[week[i]].workouts)
                //     arr.push(check)
                // } else if (time < reschedTime && Object.keys(user.exercise.oldSchedules).includes(week[i])) {
                //     arr.push(2)
                // } else if (time >= reschedTime && user.exercise.daysEntered[week[i]]) {
                //     arr.push(1)
                // } else if (time >= reschedTime && user.profile.days.includes(weekdays[day-1])) {
                //     arr.push(2)
                // } else {
                //     arr.push(1)
                // }
                let reschedTime = new Date(Object.keys(user.exercise.oldSchedules)[x]).getTime()
                if (time < reschedTime) {
                    if (user.profile.days.includes(weekdays[day])){
                        arr.push(1)
                        break
                    }
                    else if(user.exercise.daysEntered[week[i]]) {

                        let check = checkDailyGoal(user.exercise.daysEntered[week[i]].workouts)
                        arr.push(check)
                        break
                    } else if (user.exercise.oldSchedules[Object.keys(user.exercise.oldSchedules)[x]].includes(weekdays[day])) {
                        arr.push(2)
                        break
                    } else {
                        arr.push(1)
                        break
                    }
                } else if (time >= reschedTime && x < Object.keys(user.exercise.oldSchedules).length -1 && time < new Date(Object.keys(user.exercise.oldSchedules)[x+1]).getTime()) {
                    console.log(weekdays[day])

                    if(user.exercise.daysEntered[week[i]]) {
                        let check = checkDailyGoal(user.exercise.daysEntered[week[i]].workouts)
                        arr.push(check)
                        break
                    } else if (user.exercise.oldSchedules[Object.keys(user.exercise.oldSchedules)[x+1]].includes(weekdays[day])) {
                        arr.push(2)
                        break
                    } else {
                        arr.push(1)
                        break
                    }
                    
                } else if (time >= reschedTime && x == Object.keys(user.exercise.oldSchedules).length - 1) { 
                    if (user.profile.days.includes(weekdays[day])) {
                        arr.push(2)
                    } else if (user.exercise.daysEntered[week[i]]) {
                        let check = checkDailyGoal(user.exercise.daysEntered[week[i]].workouts)
                        arr.push(check)

                    } else {
                        arr.push(1)
                    }
                } 
            }
        } else {
            if(user.exercise.daysEntered[week[i]]) {
                let check = checkDailyGoal(user.exercise.daysEntered[week[i]].workouts)
                arr.push(check)
            } else {
                if (user.profile.days.includes(weekdays[day])) {
                    arr.push(2)
                } else {
                    arr.push(1)
                }
            }
        }
        i++;
    }
    console.log(arr)
    return arr
}

closeDescription.addEventListener('click', () => {
    workoutForm.removeChild(workoutForm.children[1])
    var selectors = document.getElementsByTagName('button');
    for (let i = 1; i < selectors.length; i++) {
        selectors[i].disabled = false
    }
    workoutForm.style.display = 'none'
})

closeEditForm.addEventListener('click', () => {
    var selectors = document.getElementsByTagName('button');
    for (let i = 1; i < selectors.length; i++) {
        selectors[i].disabled = false
    }
    editExerciseForm.style.display = 'none'
})


reschedule.onclick = displayPrompt;

{/* <label for="current"></label>

<input type="date" id="start" name="initialDate" value="2018-07-22" min="2018-01-01" max="2018-12-31" /> */}


function displayPrompt() {
    editExerciseForm.style.display = 'block';
    let list = document.getElementById('editFoodList')
    // let date = selectedDate.textContent.split(', ')[1]
    // let m = date.split('/')[0]
    // let d = date.split('/')[1]
    // let y = date.split('/')[2]
    // if (user.exercise.daysEntered[date]) {
    //     let workout = null
    //     for(let i = 0; i < user.exercise.daysEntered[date].workouts.length; i++) {
    //         workout = document.createElement('div')
    //         let input = document.createElement('input')
    //         let item = document.createElement('div')
    //         item.id = i
    //         item.style.display = 'inline'
    //         input.type = 'date'
    //         input.id = 'current'
    //         input.name = 'initialDate'
    //         input.setAttribute('size', '100px')
    //         input.value = y+'-'+m+'-'+d
    //         input.style.display = 'inline'
    //         workout.className = 'workoutEdit'
    //         workout.id =  user.exercise.daysEntered[date].workouts[i].name.replace(/\s/g, '') + i 
    //         workout.textContent = user.exercise.daysEntered[date].workouts[i].name
    //         let deleteEl = document.createElement("div");
    //         deleteEl.style.display = 'inline-block'
    //         deleteEl.style.position = 'absolute'
    //         deleteEl.style.left = '70%'
    //         deleteEl.style.color = 'red'
    //         deleteEl.textContent = 'X'
    //         deleteEl.id = "del"+workout.id 
    //         deleteEl.addEventListener('click', (e) => {
    //             let par = e.target.parentElement
    //             user.exercise.daysEntered[date].workouts.splice(par.id, 1)
    //             par.parentElement.removeChild(par)
    //             updateUI(date)
    //         })
    //         item.appendChild(input)
    //         item.appendChild(workout)
    //         item.appendChild(deleteEl)
    //         list.appendChild(item)
    //         list.appendChild(document.createElement('br'))
    //     }
    // }
    list.textContent = 'Reschedule and Edit functionality under development'
}

closeEditForm.onclick = newDate;


function newDate() {
    // let entry = document.getElementById("current").value;
    // let currDate = selectedDate.textContent.split(', ')[1];
    // if (entry != currDate) {
    //     let form = document.getElementById('editExerciseForm')
    //     let workoutToMove = user.exercise.daysEntered[currDate].workouts[form.children[2].id]
    //     workoutToMove.done = false
    //     user.exercise.daysEntered[currDate].workouts.splice(form.children[2].id, 1)
    //     if(user.exercise.daysEntered[entry]) {
    //         user.exercise.daysEntered[entry].workouts.push(workoutToMove)
    //     } else { 
    //         let newarr = [workoutToMove]
    //         console.log(entry)
    //         user.exercise.daysEntered[entry] = {
    //             'workouts': newarr,
    //             'caloriesBurned': 0
    //         } 
    //     } 
        
    //     let list = document.getElementById('editFoodList')
    //     list.innerHTML = ''
    //     console.log(user)
    // }
    let form = document.getElementById('editExerciseForm')
    form.style.display = 'none'
}

function isValidDateFormat(dateString) {
    var dateFormat = /^\d{2}\/\d{2}\/\d{2}$/;
    
    if (dateFormat.test(dateString)) {
        var parts = dateString.split('/');
        var month = parseInt(parts[0], 10);
        var day = parseInt(parts[1], 10);
        var year = parseInt(parts[2], 10);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 0 && year <= 99) {
        return true;
        }
    }
    
    return false;
}