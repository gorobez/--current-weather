"use strict"

// AJAX запит

const weatherBlock = document.querySelector('#weather');
const select = document.querySelector('select');
let server = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=Kyiv&appid=7686dc8d2a2716bf9c4ef7ca0846e00e';
const checkBox = document.querySelector('.checkbox');
const cityWrapper = document.querySelector('.city__wrepper');
let city = document.querySelector('.city');
const inputCity = document.querySelector('.input__city');


let xhttp = new XMLHttpRequest();

// Ф-я підвантаження данних
function loadWeather() {
    xhttp.open("GET", server, true);
    xhttp.send();
    xhttp.onload = () => {
        const responseRezult = JSON.parse(xhttp.response);
        getWeather(responseRezult);
    }
}

let id;
checkBox.addEventListener('change', function () {
    if (this.checked == true) {
        id = setInterval(loadWeather, 60000);
    } else {
        clearInterval(id);
    }

})

// Підвантажуємо лoкальні дані з json файлу по містам, при виборі країни
select.addEventListener('change', function () {
    inputCity.value = '';
    // Змінна, в яку будуть складатись всі елементи списку і інтегруватись в html
    let out = '';
    let n = this.value;

    cityWrapper.classList.remove('hide');

    fetch('./current.city.list.min.json')
        .then(res => res.json())
        .then(data => {

            for (let key in data) {
                if (data[key].country == n) {
                    out += `<li value="${data[key].id}">${data[key].name}</li>`
                }
            }

            document.querySelector('.city').innerHTML = out;

            let cityItem = document.querySelectorAll('.city li');

            cityItem.forEach(function (elem) {
                elem.addEventListener("click", function () {
                    console.log(elem.innerText);
                    server = `https://api.openweathermap.org/data/2.5/weather?units=metric&id=${elem.value}&appid=7686dc8d2a2716bf9c4ef7ca0846e00e`;

                    inputCity.value = elem.innerText;

                    loadWeather();

                    city.classList.add('hide');
                })
            })
            city.classList.remove('hide');
        })
})


// Робимо живий пошук
document.querySelector('.input__city').oninput = function () {
    let val = this.value.trim().toLowerCase();
    city.classList.remove('hide');

    if (val != '') {

        let cityItem = document.querySelectorAll('.city li');

        cityItem.forEach(function (elem) {

            if (elem.innerText.toLowerCase().search(val) == -1) {
                elem.classList.add('hide');

            } else {
                elem.classList.remove('hide');
            }
        })
    }
}

// Отримуємо данні які нам повертає цей запит
function getWeather(data) {
    // Обробляємо та виводимо дані в html

    const location = data.name;
    const temp = Math.round(data.main.temp);
    const fellsLike = Math.round(data.main.feels_like);
    const weatherStatus = data.weather[0].main;
    const weatherIcon = data.weather[0].icon;

    const template = `<div class="weather__header">
    <div class="weather__main">
        <div class="weather__city">${location}</div>
        <div class="weather__status">${weatherStatus}</div>
    </div>
    <div class="weather__icon">
        <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="${weatherStatus}">
    </div>
    </div>
    <div class="weather__temp">${temp}</div>
    <div class="weather__feels-like">Feels like: ${fellsLike}</div>`

    weatherBlock.innerHTML = template;
}


if (weatherBlock) {
    loadWeather();
}


