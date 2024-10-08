const body = document.getElementById('body')
const cancelEditButton = document.getElementById('cancelEditButton');
const user = JSON.parse(localStorage.getItem('user'))
console.log(user['profile'])

const username = document.getElementById('username')
const male = document.getElementById('male')
const female = document.getElementById('female')
const nonBin = document.getElementById('nonBin')
const age = document.getElementById('age')
const heightFeet = document.getElementById('heightFeet')
const heightInches = document.getElementById('heightInches')
const weight = document.getElementById('weight')

const beginner = document.getElementById('beginner')
const intermediate = document.getElementById('intermediate')
const advanced = document.getElementById('advanced')
const targetCalories = document.getElementById('targetCalories')

const sundaySelect = document.getElementById('SundaySelect')
const mondaySelect = document.getElementById('MondaySelect')
const tuesdaySelect = document.getElementById('TuesdaySelect')
const wednesdaySelect = document.getElementById('WednesdaySelect')
const thursdaySelect = document.getElementById('ThursdaySelect')
const fridaySelect = document.getElementById('FridaySelect')
const saturdaySelect = document.getElementById('SaturdaySelect')

const saveButton = document.getElementById('saveButton');
const notification = document.getElementById('notification')

const acknowledgeNotif = document.getElementById('acknowledgeNotif')

const selectedDate = document.getElementById('selectedDate')


window.addEventListener('load',() => {

    updateUI()

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




})

acknowledgeNotif.addEventListener('click',() =>{
    notification.style.display = 'none'
    saveButton.disabled = false
})

function isValidForm() {
    // assumes all inputs are valid
    if(username.value == ""){
        notification.children[1].textContent = 'Please enter a valid name'
        notification.style.display = 'block'
        saveButton.disabled = true
        return false
    } else if(male.checked == false && female.checked == false && nonBin.checked == false){
        notification.children[1].textContent = 'Please select a gender'
        notification.style.display = 'block'
        saveButton.disabled = true
        return false
    } else if(age.value == ""){
        notification.children[1].textContent = 'Please enter a valid age'
        notification.style.display = 'block'
        saveButton.disabled = true
        return false
    } else if(heightFeet.value == ""){
        notification.children[1].textContent = 'Please enter a valid feet amount'
        notification.style.display = 'block'
        saveButton.disabled = true
        return false
    } else if(heightInches.value == ""){
        notification.children[1].textContent = 'Please enter a valid inches amount'
        notification.style.display = 'block'
        saveButton.disabled = true
        return false
    } else if(beginner.checked == false && intermediate.checked == false && advanced.checked == false){
        notification.children[1].textContent = 'Please select a level'
        notification.style.display = 'block'
        saveButton.disabled = true
        return false
    } else if(targetCalories.value == ""){
        notification.children[1].textContent = 'Please enter a valid number of calories'
        notification.style.display = 'block'
        saveButton.disabled = true
        return false

    } else if(mondaySelect.checked == false && tuesdaySelect.checked == false && wednesdaySelect.checked == false && thursdaySelect.checked == false && fridaySelect.checked == false && saturdaySelect.checked == false && sundaySelect.checked == false){
        notification.children[1].textContent = 'Please select at least one day'
        notification.style.display = 'block'
        saveButton.disabled = true
        return false
    }
    


    user['profile']['user_name'] = username.value
    console.log(username.value)

    if(male.checked){
        user['profile']['gender'] = 'male'
    } else if(female.checked){
        user['profile']['gender'] = 'female'
    } else {
        user['profile']['gender'] = 'Non-binary'
    }

    user['profile']['age'] = parseInt(age.value)
    user['profile']['height']['feet'] = parseInt(heightFeet.value)
    user['profile']['height']['inches'] = parseInt(heightInches.value)
    user['profile']['weight'] = parseInt(weight.value)

    if(beginner.checked == true){
        user['profile']['level'] = 'beginner'
    } else if(intermediate.checked == true){
        user['profile']['level'] = 'intermediate'
    } else {
        user['profile']['level'] = 'advanced'
    }

    user['diet']['goal']['calories'] = Math.round(parseInt(targetCalories.value))

    let arr = []
    if(mondaySelect.checked == true){
        arr.push('monday')
    }
    if(tuesdaySelect.checked == true){
        arr.push('tuesday')
    }
    if(wednesdaySelect.checked == true) {
        arr.push('wednesday')
    }
    if(thursdaySelect.checked == true){
        arr.push('thursday')
    }
    if(fridaySelect.checked == true) {
        arr.push('friday')
    }
    if(saturdaySelect.checked == true){
        arr.push('saturday')
    }
    if(sundaySelect.checked == true) {
        arr.push('sunday')
    }
    let sum = 0;
    for (let d of arr){
        if(user['profile']['days'].indexOf(d) >= 0){
            sum++;
        }
    }

    if(user['profile']['days'].length == arr.length && sum == arr.length){
        // do nothing
        
    } else {
        user['exercise']['oldSchedules'][selectedDate.textContent.split(' ')[1]] = user['profile']['days']
        user['profile']['days'] = arr
        
    }
    
    
    let userJSON = JSON.stringify(user)
    
    localStorage.setItem('user',userJSON);
    localStorage.setItem('timeStamp',new Date().getTime())

    
}


cancelEditButton.addEventListener('click', () => {

    op = 1;
    let fadeInt = setInterval(function(){
        if(op <= 0){
            location.replace('./profile.html');
            clearInterval(fadeInt)
        }
        body.style.opacity = op
        body.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= .1
    },30)
})


function updateUI(){
    // populate data entry with existing information
    username.value = user['profile']['user_name']

    if(user['profile']['gender'] == 'male'){
        male.checked = true
    } else if(user['profile']['gender'] == 'female'){
        female.checked = true
    } else {
        nonBin.checked = true
    }

    age.value = user['profile']['age']
    heightFeet.value = user['profile']['height']['feet']
    heightInches.value = user['profile']['height']['inches']
    weight.value = user['profile']['weight']

    if(user['profile']['level'] == 'beginner'){
        beginner.checked = true
    } else if(user['profile']['level'] == 'intermediate'){
        intermediate.checked = true
    } else {
        advanced.checked = true
    }

    targetCalories.value = user['diet']['goal']['calories']

    for(let d of user['profile']['days']){
        if(d == 'monday'){
            mondaySelect.checked = true
        } else if(d == 'tuesday'){
            tuesdaySelect.checked = true
        } else if(d == 'wednesday') {
            wednesdaySelect.checked = true
        }  else if(d == 'thursday'){
            thursdaySelect.checked = true
        } else if(d == 'friday') {
            fridaySelect.checked = true
        }  else if(d == 'saturday'){
            saturdaySelect.checked = true
        } else if(d == 'sunday') {
            sundaySelect.checked = true
        }

    }

    



}