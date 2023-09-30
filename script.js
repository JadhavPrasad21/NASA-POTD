// Getting DOM Elements
const picHeading = document.querySelector(".pic-heading");
const picImgEle = document.querySelector("#pic");
const desciption = document.querySelector(".description");
const form = document.querySelector("#search-form");
const dateInput = document.querySelector("#search-input");
const formSubmitBtn = document.querySelector("#form-submit-btn");
const searchBtnCont = document.querySelector("#search-history");
const dateArr = [];

// API key
let apiKey = `rsVBVInwhEVU7bHai1ZXZuk1h1SczVUI7jnustka`;


// funcion for Date incoreect error

function alertUser() {
    alert(`Date must be between Jun 16, 1995 and ${new Date().toJSON().slice(0, 10)} (Today)`);
}


// Function to set the image as the loader gif
function setGifImg() {
    picImgEle.src = "./assets/load-loading.gif";
}

// Generic function to fetch the data
async function fetchDataFunction(Ondate) {
    if (Ondate) {
        try {
            let url = `https://api.nasa.gov/planetary/apod?date=${Ondate}&api_key=${apiKey}`
            let response = await fetch(url);
            if (response.status >= 400 && response.status < 600) {
                alertUser();
                return;
            }
            setGifImg();
            let result = await response.json();
            console.log(result)
            updateUi(result);
        } catch (error) {
            console.log(error);
            return;
        }
    } else {
        try {
            const date = new Date().toJSON().slice(0, 10);
            let url = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`
            let response = await fetch(url);
            if (response.status >= 400 && response.status < 600) {
                alertUser();
                return;
            }
            let result = await response.json();
            setGifImg();
            updateUi(result);
        } catch (error) {
            console.log(error);
            return;
        }
    }
}


// Getting the current image of the day on reload
function getCurrentImageOfTheDay() {

    // Checking if already users search exists in his local storage
    if (localStorage.getItem("searchArr")) {
        let localStorageArr = JSON.parse(localStorage.getItem("searchArr"));
        fetchDataFunction(localStorageArr[0]);
        // creating Date btns for each date
        localStorageArr.forEach((eachDate) => {
            addSearchToHistory(eachDate);
        })
    } else {
        // else calling the fetch function for current date
        fetchDataFunction(false);
    }

}
getCurrentImageOfTheDay();

// Fnction for handling the users date input
form.addEventListener("submit", (e) => getImageOfTheDay(e));
function getImageOfTheDay(e) {
    e.preventDefault();
    if (dateInput.value) {
        fetchDataFunction(dateInput.value);
    } else {
        alertUser();
        return;
    }
}

// Function for updating UI 
function updateUi(resObj) {
    picHeading.innerHTML = `Picture On ${resObj.date}`;
    picImgEle.src = resObj.url;
    desciption.textContent = resObj.explanation;
    saveSearch(resObj.date);
};

// Function for saving the newly searched date in localstorage
function saveSearch(date) {
    // checking if the date already exists in array
    if (localStorage.getItem("searchArr")) {
        let localStorageArr = JSON.parse(localStorage.getItem("searchArr"));
        if (localStorageArr.includes(date)) {
            return;
        }
    }
    dateArr.push(date);
    localStorage.setItem("searchArr", JSON.stringify(dateArr));
    addSearchToHistory(date)
}

// Creating button of recent searches of user
function addSearchToHistory(date) {
    let newDateBtn = document.createElement("div");
    newDateBtn.classList.add("history-btn");
    newDateBtn.textContent = date;
    newDateBtn.addEventListener("click", (e) => handleSearchHistoryBtns(e));
    searchBtnCont.appendChild(newDateBtn);
}

// Handling the click on recent search btns
function handleSearchHistoryBtns(e) {
    setGifImg();
    let clickedDate = e.target.textContent;
    fetchDataFunction(clickedDate);
}