// elements
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
const notification = document.getElementById('notification')
const acknowledgeNotificationButton = document.getElementById('acknowledgeNotif')

// add this is to enable data persistence across screens
// remove user.js script from html!!!
const user = JSON.parse(localStorage.getItem('user'));

let healthyHabits = ["Take a 1 mile walk",
                    "Read for 10 minutes",
                "Drink 8 glasses of water",
                "Eat 1 apple",
                "Meditate for 5 minutes",
                "Do 10 situps",
                "Do 10 pushups"]
let importance = ["According to WellandGood, walking for a mile a day has many benefits like strengthening your muscles, strengthening your bones, and improving your cardiovascular health.",
                    "According to Oberlo, reading has been proven to increase your focus, memory, empathy, and communication skills.",
                    "According to the CDC, water helps your body keep a normal temperature, lubricate and cushion your joints, protect sensitive tissues, and rid yourself of wastes.",
                    "According to Healthline, apples are rich in fiber and antioxidants. Eating one apple a day can lower your chance of getting chronic conditions such as diabetes, heart disease, and cancer.",
                    "According to Mayo Clinic, meditation is a useful way to address both positive and negative forms of stress. It is is also possible for meditation to reduce occurences of depression, chronic pain, anxiety, hypertension, and heart disease.",
                    "According to Healthline, situps are an effective way to strength and tone your abdominal muscles which are used to stabilize your core.",
                    "According to GoodRx, push-ups are a versatile exercises that are useful at helping you strengthen you upper body muscles. In particular, they target your chest, triceps, and shoulders."
                ]

let total = 3;

window.onload = function() {
    let arr = ["10/16/2023","10/17/2023","10/18/2023","10/19/2023"];
    let i = 0;
    while(i < arr.length) {
        let checks = user['habits']['daysEntered'][arr[i]][1];
        let completed = true;
        for (let index = 0; index < checks.length; index++) {
            if (user['habits']['daysEntered'][arr[i]][1][index] == false) {
                completed = false;
                break;
            }
        }
        if (completed == true) {
            week.children[i].children[1].children[0].style.visibility = 'visible';
        }
        i++;
    }
    updateHabits(selectedDate.textContent.split(', ')[1]);

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
}


// calendar related code
function changeDate(el){
    if (notification.style.display == 'block') {
        return;
    }
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
    if (date.toString() !== newDay.toString()) {
        updateHabits(newDay.toLocaleDateString());
    } 
}

function updateHabits(date) {
    total = 0;
    let goals = 0;

    if (user.profile.level == "beginner") {
        goals = 3;
    } else if (user.profile.level == "intermediate") {
        goals = 4;
    } else {
        goals = 6;
    }
    if (date in user.habits.daysEntered) {
        document.querySelector("#todoContents").innerHTML = "";
        for (let i = 0; i < user.habits.daysEntered[date][0].length; i++) {
            let currHabit = healthyHabits[user.habits.daysEntered[date][0][i]];
            let index = user.habits.daysEntered[date][0][i];

            if (user.habits.daysEntered[date][1][i] == false) {
                document.getElementById("todoContents").insertAdjacentHTML('beforeend', "<div class='entry'><input type='checkbox' id="+ i.toString() + "' class='largerCheckbox' onclick=\"updateCheck(this)\"><strong style='position: relative; top: -7%'>" + currHabit + "</strong><button id='whyImportant' class='fa-solid fa-arrow-right fa-2x' style='background-color: transparent; background-repeat: no-repeat; border: none; overflow: hidden; outline: none; margin-left: 20px; position: absolute; right: 5%; display: inline-block; font-size: 40px' onclick=displayForm(" + index + ")></button></div><br>" ); 
            } else {
                document.getElementById("todoContents").insertAdjacentHTML('beforeend', "<div class='entry'><input type='checkbox' id=" + i.toString() + "' class='largerCheckbox' checked='true' onclick=\"updateCheck(this)\"><strong style='position: relative; top: -7%'>" + currHabit + "</strong><button id='whyImportant' class='fa-solid fa-arrow-right fa-2x' style='background-color: transparent; background-repeat: no-repeat; border: none; overflow: hidden; outline: none; margin-left: 20px; position: absolute; right: 5%; display: inline-block; font-size: 40px' onclick=displayForm(" + index + ")></button></div><br>");
            }
            total++;
        }
    // Generates a new date object for the new day. 
    } else {
        let totalHabits = 6;
        document.querySelector("#todoContents").innerHTML = "";
        habitMap = [[],[]];
        let called = new Set();

        for (let i = 0; i < goals; i++) {
            let randomNum = Math.floor(Math.random() * totalHabits);
            while (called.has(randomNum)) {
                randomNum = Math.floor(Math.random() * totalHabits);
            }
            called.add(randomNum);
            let randomHabit = healthyHabits[randomNum];
            document.getElementById("todoContents").insertAdjacentHTML('beforeend', "<div class='entry'><input type='checkbox' id="+ i.toString() + "' class='largerCheckbox' onclick=\"updateCheck(this)\"><strong style='position: relative; top: -7%'>" + randomHabit + "</strong><button id='whyImportant' class='fa-solid fa-arrow-right fa-2x' style='background-color: transparent; background-repeat: no-repeat; border: none; overflow: hidden; outline: none; margin-left: 20px; position: absolute; right: 5%; display: inline-block; font-size: 40px' onclick=displayForm(" + randomNum + ")></button></div><br>");
            habitMap[0].push(randomNum);
            habitMap[1].push(false);
            total++;
        }
        user.habits.daysEntered[date] = habitMap;
    }
}

function displayForm(index) {
    addMealForm.style.display = 'grid';
    addMealButton.disabled = true;
    leftArrowContainer.disabled = true;
    rightArrowContainer.disabled = true;
    document.querySelector('#addFoodList').insertAdjacentHTML('beforeend', importance[parseInt(index)]);
}

function addMealFormClear(){
    document.querySelector('#addFoodList').innerHTML = "";
    leftArrowContainer.disabled = false
    rightArrowContainer.disabled = false
}

cancelAddMeal.addEventListener('click', () => {
    addMealForm.style.display = 'none'
    addMealFormClear()
    leftArrowContainer.disabled = false
    rightArrowContainer.disabled = false
})

function updateCheck(checkbox) {
    let index = parseInt(checkbox.id);
    let currDate = selectedDate.textContent.split(', ')[1];
    
    if (user.habits.daysEntered[currDate][1][index] == true) {
        user.habits.daysEntered[currDate][1][index] = false;
    } else {
        user.habits.daysEntered[currDate][1][index] = true;
    }
    if (checkbox.checked) {
        let checks = user['habits']['daysEntered'][currDate][1];
        let completed = true;
        for (let index = 0; index < checks.length; index++) {
            if (user['habits']['daysEntered'][currDate][1][index] == false) {
                completed = false;
                break;
                }
            }
                
        if (completed == true) {
            let k = 0;
            while (k < 7){
                if(week.children[k].style.backgroundColor != ''){
                    week.children[k].children[1].children[0].style.visibility = 'visible';
                }
                k++;
            }
            notification.style.display = 'block';
            leftArrowContainer.disabled = true;
            rightArrowContainer.disabled = true;

            let contents = document.getElementById("todoContents");
            for (let i = 0; i < contents.childElementCount; i++) {
                if (contents.children[i].childElementCount > 0) {
                    contents.children[i].children[0].disabled = true;
                    contents.children[i].children[2].disabled = true;
                }
            }
        }
    } else {
        let checks = user['habits']['daysEntered'][currDate][1];
        let completed = true;
        for (let index = 0; index < checks.length; index++) {
            if (user['habits']['daysEntered'][currDate][1][index] == false) {
                completed = false;
                break;
                }
            }
                
        if (completed == false){
            let k = 0;
            while (k < 7){
                if(week.children[k].style.backgroundColor != '') {
                    week.children[k].children[1].children[0].style.visibility = 'hidden';
                }
                k++;
            }
        }
    }
}

acknowledgeNotificationButton.addEventListener('click',() => {
    notification.style.display = 'none';
    leftArrowContainer.disabled = false;
    rightArrowContainer.disabled = false;

    let contents = document.getElementById("todoContents");
        for (let i = 0; i < contents.childElementCount; i++) {
            if (contents.children[i].childElementCount > 0) {
                contents.children[i].children[0].disabled = false;
                contents.children[i].children[2].disabled = false;
            }
        }
})

// change to previous week
// TODO: remove/add checkmarks on scroll
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
            
            if(animArr[counter-1]){
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


// change to next week
// TODO: remove/add checkmarks on scroll
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
            if(animArr[counter-1]){
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

function addEntry() {
    let entry = document.getElementById("thingTodo").value;
    let currDate = selectedDate.textContent.split(', ')[1];
    let index = (total - 1)
    addTodoForm.style.display = 'none';
    document.getElementById("thingTodo").value = "";
    document.getElementById("todoContents").insertAdjacentHTML('beforeend', "<input type='checkbox' id="+ index.toString() + "' class='largerCheckbox' onclick=\"updateCheck(this)\"><u>" + entry + "</u><br>");
    user.habits.daysEntered[currDate][0].push(index);
    user.habits.daysEntered[currDate][1].push(false);
}

function checkGoalsCompleted(week) {
    let i = 0;
    let arr = []
    while(i < week.length){
        if(user['habits']['daysEntered'][week[i]]) {
            let checks = user['habits']['daysEntered'][week[i]][1];
            let completed = true;
            for (let index = 0; index < checks.length; index++) {
                if (user['habits']['daysEntered'][week[i]][1][index] == false) {
                    completed = false;
                    break;
                }
            }
            
            if (completed == true){
                arr.push(true)
            } else {
                arr.push(false)
            }
        } else {
            arr.push(false)
        }
        i++;
    }
    return arr;
}