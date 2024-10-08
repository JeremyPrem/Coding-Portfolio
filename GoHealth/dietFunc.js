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
const addMealButton = document.getElementById('addMealButton')
const addFoodButton = document.getElementById('addFoodButton')
const addMealForm = document.getElementById('addMealForm')
const calorieList = document.getElementById('calorieList')
const foodName = document.getElementById('foodName')
const quantity = document.getElementById('quantity')
const mealNameInput = document.getElementById('mealNameInput')
const foodSelect = document.getElementById('foodSelect')
const quantitySelect = document.getElementById('quantitySelect')
const addFoodList = document.getElementById('addFoodList')
const publishMealButton = document.getElementById('publishMealButton')
const goalActual  = document.getElementById('goalActual')
const burnedActual  = document.getElementById('burnedActual')
const consumedActual  = document.getElementById('consumedActual')
const togoActual  = document.getElementById('togoActual')
const calorieProgress = document.getElementById('calorieProgress')
const editMealForm = document.getElementById('editMealForm')
const cancelAddMeal = document.getElementById('cancelAddMeal')
const cancelEditMeal = document.getElementById('cancelEditMeal')
const editFoodName = document.getElementById('editFoodName')
const editQuantity = document.getElementById('editQuantity')
const editMealNameInput = document.getElementById('editMealNameInput')
const editFoodSelect = document.getElementById('editFoodSelect')
const editQuantitySelect = document.getElementById('editQuantitySelect')
const editFoodButton = document.getElementById('editFoodButton')
const editMealButton = document.getElementById('editMealButton')
const editFoodList = document.getElementById('editFoodList')
const notification = document.getElementById('notification')
const acknowledgeNotificationButton = document.getElementById('acknowledgeNotif')

const body = document.getElementById('body');


// add this is to enable data persistence across screens
// remove user.js script from html!!!
const user = JSON.parse(localStorage.getItem('user'))

window.addEventListener('load', () => {
    let arr = ["10/16/2023","10/17/2023","10/18/2023","10/19/2023","10/20/2023","10/21/2023","10/22/2023"]
    let i = 0;
    while(i < arr.length){
        console.log(user['diet']['daysEntered'][arr[i]])
        console.log(user['diet']['goal'].calories)
        let burnedAmt = user['exercise']['daysEntered'][arr[i]] ? user['exercise']['daysEntered'][arr[i]].caloriesBurned : 0

        if(user['diet']['daysEntered'][arr[i]] && user['diet']['daysEntered'][arr[i]].totalCalories >= user['diet']['goal'].calories+burnedAmt){
            week.children[i].children[1].children[0].style.visibility = 'visible'
        } else {
            console.log(arr[i])
            week.children[i].children[1].children[0].style.visibility = 'hidden'
        }
        i++;
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

let foodKeys = Object.keys(foods)
for (let key of Object.keys(foods)){
    let temp1 = new Option(key,key)
    let temp2 = new Option(key,key)
    foodSelect.appendChild(temp1)
    editFoodSelect.appendChild(temp2)
}

let i = 2;
while(i <= 4){
    let temp1 = new Option(i,i)
    let temp2 = new Option(i,i)
    quantitySelect.appendChild(temp1)
    editQuantitySelect.appendChild(temp2)
    i++;
}

// calendar related code
function changeDate(el){
    if(addMealForm.style.display == 'grid' || editMealForm.style.display == 'grid' || notification.style.display == 'block'){
        return
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
    let date = new Date(selectedDate.textContent.split(', ')[1])
    const newDay = new Date(el.children[0].textContent);
    selectedDate.children[0].textContent = dayOfTheWeek[newDay.getDay()] +", "+newDay.toLocaleDateString()

    updateUI()

}

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

// food list
// TODO: add meal on button press, when a meal is pressed provide pop up with calorie and macro distribution and option to edit/delete
addMealButton.addEventListener('click', () =>{
    // open a form to enter information
    addMealForm.style.display = 'grid'
    addMealButton.disabled = true
    leftArrowContainer.disabled = true
    rightArrowContainer.disabled = true
})

addFoodButton.addEventListener('click', () => {
    if(foodSelect.value == 'disabled' || addFoodList.querySelector("#"+foodSelect.value)){
        return
    }
   
    let el = document.createElement("div");
    el.className = "food"
    el.id = foodSelect.value
    let str = ``
    str = str + quantitySelect.value;
    
    while(str.length < 3){
        str = str + `\u00A0`
        
    }
    if(quantitySelect.value.length != 3){
        str = str + `\u00A0`
    }

    el.textContent = str+ `\u00A0\u00A0`+foodSelect.value
    
    let deleteEl = document.createElement("div");
    deleteEl.style.display = 'inline-block'
    deleteEl.style.position = 'absolute'
    deleteEl.style.left = '90%'
    deleteEl.style.color = 'red'
    deleteEl.textContent = 'X'
    deleteEl.id = foodSelect.value+"Del"
    deleteEl.addEventListener('click', (e) => {
        let par = e.target.parentElement
        par.parentElement.removeChild(par)
        
    })

    el.appendChild(deleteEl)
    
    addFoodList.appendChild(el);
    foodSelect.value = 'disabled'
    quantitySelect.value = 1
})

acknowledgeNotificationButton.addEventListener('click',() => {
    notification.style.display = 'none'
    addFoodButton.disabled = false
    publishMealButton.disabled = false;
    editFoodButton.disabled = false
    editMealButton.disabled = false;
    leftArrowContainer.disabled = false
    rightArrowContainer.disabled = false
    cancelAddMeal.disabled = false
    cancelEditMeal.disabled = false

})

publishMealButton.addEventListener('click', () => {
    if(mealNameInput.value == "" || (user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]] && user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]][mealNameInput.value])){
        notification.style.display = 'block'
        addFoodButton.disabled = true
        publishMealButton.disabled = true;
        cancelAddMeal.disabled = true;
        cancelEditMeal.disabled = true;
        return
    }


    let i = 0;
    let foodMap = {}
    let calSum = 0;
    while(i < addFoodList.childElementCount){
        let test = addFoodList.children[i].textContent.substring(0, addFoodList.children[i].textContent.length-1)
        let quant = test.substring(0, test.indexOf('\u00A0')); 
        let j = 0;
        while(test.substring(test.indexOf('\u00A0') + j)[0] == '\u00A0'){
            j++;
           
        }
        let food = test.substring(test.indexOf('\u00A0') + j); 


        // calories for food
        calSum += foods[food].calories*eval(quant)

        //update JSON
        foodMap[food] = quant

        i++;
    }

    // add foodMap to user JSON
    if(!user['diet']['daysEntered'][selectedDate.textContent.split(" ")[1]]){
        user['diet']['daysEntered'][selectedDate.textContent.split(" ")[1]] = {'totalCalories': 0}
    }
    let newTotal = user['diet']['daysEntered'][selectedDate.textContent.split(" ")[1]].totalCalories + calSum
    user['diet']['daysEntered'][selectedDate.textContent.split(" ")[1]][mealNameInput.value] = foodMap
    user['diet']['daysEntered'][selectedDate.textContent.split(" ")[1]]['totalCalories'] = newTotal
    
    addMealForm.style.display = "none"
    addMealFormClear()
    addMealButton.disabled = false

    updateUI()

})

cancelAddMeal.addEventListener('click', () => {
    addMealForm.style.display = 'none'
    addMealFormClear()
    addMealButton.disabled = false
    leftArrowContainer.disabled = false
    rightArrowContainer.disabled = false
})

function addMealFormClear(){
    mealNameInput.value = ''
    foodSelect.value = 'disabled'
    quantitySelect.value = '1'
    addFoodList.textContent = ''
    leftArrowContainer.disabled = false
    rightArrowContainer.disabled = false
}


function updateUI(date){
    // update calorie amount and bar
    calorieList.textContent = ""
    let burnedAmt = user['exercise']['daysEntered'][selectedDate.textContent.split(' ')[1]] ? user['exercise']['daysEntered'][selectedDate.textContent.split(' ')[1]].caloriesBurned : 0
    burnedActual.textContent = burnedAmt
    if(user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]]){
        let keys = Object.keys(user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]])
        let i = 0;

        
        while(i < keys.length){
            if(keys[i] == 'totalCalories'){
                i++;
                continue;
            }
            let mealKeys = Object.keys(user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]][keys[i]])
            let dailySum = 0;
            let el = document.createElement("div");
            el.className = "meal"
            el.id = keys[i]
            let br = document.createElement("br");
            el.appendChild(br)

            let header = document.createElement("b");
            header.textContent = keys[i]
            el.appendChild(header);

            let deleteEl = document.createElement("div");
            deleteEl.style.display = 'block'
            deleteEl.style.position = 'absolute'
            deleteEl.style.left = '95%'
            deleteEl.style.top = '7%'

            let deleteIcon = document.createElement("i")
            deleteIcon.className = "fa-solid fa-trash"
            deleteEl.appendChild(deleteIcon)

            deleteEl.id = foodSelect.value+"Delete"
            deleteEl.addEventListener('click', (e) => {
                let par = e.target.parentElement
                
                let i = 0;
                let sum = 0;
                let food = Object.keys(user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]][par.parentElement.id])
                while(i < food.length){
                    sum += Math.ceil(foods[food[i]].calories*eval(user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]][par.parentElement.id][food[i]]))
                    i++;
                }
                user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]].totalCalories = user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]].totalCalories - sum
                par.parentElement.parentElement.removeChild(par.parentElement)
                delete user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]][par.parentElement.id]
                updateUI()
            })

            el.appendChild(deleteEl)
            
            let editEl = document.createElement("div");
            editEl.style.display = 'block'
            editEl.style.position = 'absolute'
            editEl.style.left = '90%'
            editEl.style.top = '7%'

            

            let editIcon = document.createElement("i")
            editIcon.className = "fa-solid fa-pen-to-square"

            editEl.appendChild(editIcon)
            
            editEl.id = foodSelect.value+"Edit"
            editEl.addEventListener('click', (e) => {
                let par = e.target.parentElement
                editMeal(par.parentElement.id,user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]][par.parentElement.id])
                
            })

            el.appendChild(editEl)

            let j = 0;
            
            while(j < mealKeys.length){
                let food = mealKeys[j]
                let quant = user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]][keys[i]][mealKeys[j]]
                dailySum += Math.ceil(foods[food].calories * eval(quant))

                let tmp = document.createElement("div");
                tmp.className = "food"

                str = ``+quant
                while(str.length < 3){
                    str = str + `\u00A0`
                    
                }
                if(quant.length != 3){
                    str = str + `\u00A0`
                }
            
                tmp.textContent = str+ `\u00A0\u00A0`+food
                let calories = document.createElement("div");
                calories.className = "calorie"
                calories.textContent = Math.ceil(foods[food].calories*eval(quant))
                tmp.appendChild(calories)
                el.appendChild(tmp)



                j++;
            }


             // first line break
            let br1 = document.createElement("br");
            el.appendChild(br1)

            // total calorie amount
            let totalCalories = document.createElement("div")
            totalCalories.className = "food"
            let totalCalHeader = document.createElement("b");
            totalCalHeader.textContent = "Total Calories"
            totalCalories.appendChild(totalCalHeader)
            let totalCalAmount = document.createElement("div")
            totalCalAmount.className = "calorie"
            let totalCalAmtHeader = document.createElement("b");
            totalCalAmtHeader.textContent = dailySum
            totalCalAmount.append(totalCalAmtHeader)
            totalCalories.appendChild(totalCalAmount)
            el.appendChild(totalCalories)

            // second line break
            let br2 = document.createElement("br");
            el.appendChild(br2)

            calorieList.appendChild(el)


            i++;
        }

        
        
    } else {
        calorieList.textContent = ""
    }
    let sum = 0;
    if(user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]]){
        sum = user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]].totalCalories;
    }

    goalActual.textContent = user['diet']['goal'].calories

    consumedActual.textContent = sum;

    togoActual.textContent = user['diet']['goal'].calories + burnedAmt - sum;

    calorieProgress.value = Math.min(sum/(user['diet']['goal'].calories + burnedAmt)*100,100)

    if(Math.min(sum/(user['diet']['goal'].calories + burnedAmt)*100,100) == 100){
        let k = 0;
        while(k < 7){
            if(week.children[k].style.backgroundColor != ''){
                week.children[k].children[1].children[0].style.visibility = 'visible'
            }
            k++;
        }
    } else {
        let k = 0;
        while(k < 7){
            if(week.children[k].style.backgroundColor != ''){
                week.children[k].children[1].children[0].style.visibility = 'hidden'
            }
            k++;
        }
    }


}

function checkGoalsCompleted(week){
    let i = 0;
    let arr = []
    while(i < week.length){
        if(user['diet']['daysEntered'][week[i]]){
            
            if(user['diet']['daysEntered'][week[i]].totalCalories >= user['diet']['goal'].calories){
                arr.push(true)
            } else {
                arr.push(false)
            }
        } else {
            arr.push(false)
        }

        i++;
    }
    return arr
}

let oldMealName = ""
function editMeal(mealName, mealVal){
    oldMealName = mealName
    editMealNameInput.value = mealName

    let i = 0;
    let currFoods = Object.keys(mealVal);
    while(i < currFoods.length){

        let el = document.createElement("div");
        el.className = "food"
        el.id = currFoods[i]
        let str = ``
        str = str + mealVal[currFoods[i]];
        
        while(str.length < 3){
            str = str + `\u00A0`
            
        }
        if(mealVal[currFoods[i]].length != 3){
            str = str + `\u00A0`
        }
    
        el.textContent = str+ `\u00A0\u00A0`+currFoods[i]
        
        let deleteEl = document.createElement("div");
        deleteEl.style.display = 'inline-block'
        deleteEl.style.position = 'absolute'
        deleteEl.style.left = '90%'
        deleteEl.style.color = 'red'
        deleteEl.textContent = 'X'
        deleteEl.id = currFoods.value+"Del"
        deleteEl.addEventListener('click', (e) => {
            let par = e.target.parentElement
            par.parentElement.removeChild(par)
            
        })
    
        el.appendChild(deleteEl)

        editFoodList.appendChild(el)

        i++;
    }

    editMealForm.style.display = 'grid';
    leftArrowContainer.disabled = true
    rightArrowContainer.disabled = true

    
}

cancelEditMeal.addEventListener('click',() => {
    editMealForm.style.display = 'none'
    resetEditMealForm()
    leftArrowContainer.disabled = false
    rightArrowContainer.disabled = false

})

editMealButton.addEventListener('click', (e) => {
    if(editMealNameInput.value == "" || (user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]] && user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]][editMealNameInput.value]) && editMealNameInput.value != oldMealName){
        notification.style.display = 'block'
        editFoodButton.disabled = true
        editMealButton.disabled = true;
        cancelAddMeal.disabled = true;
        cancelEditMeal.disabled = true;
        return
    }

    let prevCalSum = 0;
    let k = 0;
    let oldMealKeys = Object.keys(user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]][oldMealName])
    while(k < oldMealKeys.length){
        prevCalSum += foods[oldMealKeys[k]].calories*eval(user['diet']['daysEntered'][selectedDate.textContent.split(' ')[1]][oldMealName][oldMealKeys[k]])
        k++;
    }


    let i = 0;
    let foodMap = {}
    let calSum = 0;
    while(i < editFoodList.childElementCount){
        let test = editFoodList.children[i].textContent.substring(0, editFoodList.children[i].textContent.length-1)
        let quant = test.substring(0, test.indexOf('\u00A0')); 
        let j = 0;
        while(test.substring(test.indexOf('\u00A0') + j)[0] == '\u00A0'){
            j++;
           
        }
        let food = test.substring(test.indexOf('\u00A0') + j); 

        // calories for food
        console.log(food)
        calSum += foods[food].calories*eval(quant)

        //update JSON
        foodMap[food] = quant

        i++;
    }



    // add foodMap to user JSON
    let newTotal = user['diet']['daysEntered'][selectedDate.textContent.split(" ")[1]].totalCalories + calSum - prevCalSum
    //user['diet']['daysEntered'][selectedDate.textContent.split(" ")[1]][editMealNameInput.value] = foodMap

    if(oldMealName != editMealNameInput.value){
        let i = 0;
        let mealKeys = Object.keys(user['diet']['daysEntered'][selectedDate.textContent.split(" ")[1]]);
        let newOrder = {}
        while(i < mealKeys.length){
            if(mealKeys[i] == oldMealName){
                newOrder[editMealNameInput.value] = foodMap
            } else {
                newOrder[mealKeys[i]] = user['diet']['daysEntered'][selectedDate.textContent.split(" ")[1]][mealKeys[i]]
            }
            i++;
        }
        
        user['diet']['daysEntered'][selectedDate.textContent.split(" ")[1]] = newOrder

    } else {
        user['diet']['daysEntered'][selectedDate.textContent.split(" ")[1]][editMealNameInput.value] = foodMap
    }

    user['diet']['daysEntered'][selectedDate.textContent.split(" ")[1]]['totalCalories'] = newTotal
    
    editMealForm.style.display = "none"
    resetEditMealForm()
    editMealButton.disabled = false
    calorieList.innerHTML = ""
    leftArrowContainer.disabled = false
    rightArrowContainer.disabled = false
    updateUI();


})

editFoodButton.addEventListener('click', () => {
    if(editFoodSelect.value == 'disabled' || editFoodList.querySelector("#"+editFoodSelect.value)){
        return
    }
   
    let el = document.createElement("div");
    el.className = "food"
    el.id = editFoodSelect.value
    let str = ``
    str = str + editQuantitySelect.value;
    
    while(str.length < 3){
        str = str + `\u00A0`
        
    }
    if(editQuantitySelect.value.length != 3){
        str = str + `\u00A0`
    }

    el.textContent = str+ `\u00A0\u00A0`+editFoodSelect.value
    
    let deleteEl = document.createElement("div");
    deleteEl.style.display = 'inline-block'
    deleteEl.style.position = 'absolute'
    deleteEl.style.left = '90%'
    deleteEl.style.color = 'red'
    deleteEl.textContent = 'X'
    deleteEl.id = editFoodSelect.value+"Del"
    deleteEl.addEventListener('click', (e) => {
        let par = e.target.parentElement
        par.parentElement.removeChild(par)
        
    })

    el.appendChild(deleteEl)
    
    editFoodList.appendChild(el);
    editFoodSelect.value = 'disabled'
    editQuantitySelect.value = 1
})


function resetEditMealForm(){
    editMealNameInput.value = ''
    editFoodSelect.value = 'disabled'
    editQuantitySelect.value = '1'
    editFoodList.textContent = ''
}


function updateUIPageLoad(){

}

// General TODO: create JSON structure that contains users and each diet, find or populate JSON containing food information


/* Example JSON for diet
    user : {
        exercise: {
            caloriesBurned: <int>,
        },
        diet: {
            goal: {
                calories: <int>,
                protein: <int>,
                carbs: <int>,
                fats: <int>
            },
            dietPlan: {
                breakfast: {
                    foods: {<food>: <quantity>}
                },
                lunch: {
                    foods: {<food>: <quantity>}
                },
                dinner: {
                    foods: {<food>: <quantity>}
                },
                snacks: {
                    foods: {<food>: <quantity>}
                }
            }
            daysEntered: { day_entered: {<map of meals similar to above>}}
        },
        habits: {},
        settings: {}
    }

*/
