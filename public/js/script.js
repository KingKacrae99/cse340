const carousel = document.getElementById('carousel');
const dots = document.querySelectorAll('.dot');
const likeButtons = document.querySelectorAll('.like-btn');
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
let cardBox = document.querySelector('.cardContainer');

let currentIndex = 0;
const totalSlides = dots.length;

function headerFunc(){
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");

            const icon = menuBtn.querySelector("i");

            if (mobileMenu.classList.contains("hidden")) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            } else {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            }
        });
    }
}

function showSlide(index){
    currentIndex = index;
    carousel.style.transform = `translateX(-${index * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.remove('bg-[var(--accent)]');
            dot.classList.add('bg-[var(--accent)]/50');
        })

        dots[index].classList.add('bg-[var(--accent)]');
        dots[index].classList.remove('bg-[var(--accent)]/50');
}

dots.forEach( dot =>{
    dot.addEventListener('click',() =>{
        const index = dot.dataset.index;

        showSlide(index);
    })
});

setInterval(()=>{
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
},5000);

document.addEventListener('click', async (e) => {
    const button = e.target.closest('.like-btn');

    if (!button) return;

    const icon = button.querySelector('i');
    const invId = button.dataset.id;

    try {
        const response = await fetch('/favorites/toggle', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                invId
            })
        });

        const data = await response.json();

        if(!data.success){
            alert(data.message);
            window.location.href = data.redirect;
            return;
        }

        if(data.liked){
            icon.classList.remove('fa-regular');
            icon.classList.add(
                'fa-solid',
                'text-[var(--secondary)]'
            );
        } else {
            icon.classList.remove(
                'fa-solid',
                'text-[var(--secondary)]'
            );
            icon.classList.add('fa-regular');
        }

    } catch(error){
        console.error(error);
    }
});

/* ==========================================
   CARD TEMPLATE
========================================== */
function createVehicleCard(car) {
    return `
        <div class="relative border border-gray-300 shadow rounded-lg w-full max-w-[250px] mx-auto mb-20 transition-transform duration-300 hover:scale-105 bg-white">

            <!-- Heart -->
            <div class="absolute top-3 right-3 z-10">
                <button
                    class="like-btn text-white text-xl"
                    title="Add to Favorite List"
                    data-id="${car.inv_id}"
                >
                    <i class="fa-regular fa-heart"></i>
                </button>
            </div>

            <!-- Image -->
            <div class="h-[200px] overflow-hidden rounded-lg">
                <img
                    src="/${car.inv_thumbnail}"
                    alt="${car.inv_make}"
                    class="w-full h-full object-cover object-center"
                >
            </div>

            <!-- Content -->
            <div
                class="w-[230px] bg-white absolute left-1/2 -translate-x-1/2 -bottom-20 rounded-lg p-4 text-[var(--primary)] shadow-lg"
            >

                <h2 class="text-base font-bold">
                    ${car.inv_year}
                    ${car.inv_make}
                    ${car.inv_model}
                </h2>

                <p class="text-gray-600 text-sm">
                    ${Number(car.inv_miles).toLocaleString()} miles
                </p>

                <div class="flex justify-between items-center mt-2">

                    <a
                        href="/inv/details/${car.inv_id}"
                        class="bg-[var(--secondary)] text-white text-sm py-1 px-3 rounded-lg hover:bg-[var(--primary)] transition-colors duration-300"
                    >
                        View
                    </a>

                    <p class="text-base font-bold text-right">
                        ${Number(car.inv_price).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}
                    </p>

                </div>

            </div>

        </div>
    `;
}


/* ==========================================
   SEARCH FEATURE
========================================== */
function homeSearch() {
    const make = document.getElementById("make");
    const model = document.getElementById("model");
    const year = document.getElementById("year");
    const searchBtn = document.getElementById("search-btn");

    if (!searchBtn) return;

    async function performSearch() {
        const makeValue = make.value.trim();
        const modelValue = model.value.trim();
        const yearValue = year.value.trim();

        // Require at least one field
        if (!makeValue && !modelValue && !yearValue) {
            alert("Please fill in at least one search field.");
            return;
        }

        searchBtn.disabled = true;

        cardBox.innerHTML = `
            <p class="col-span-full text-center text-gray-500 py-10">
                Searching vehicles...
            </p>
        `;

        try {
            const response = await fetch("/inv/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    invMake: makeValue,
                    invModel: modelValue,
                    invYear: yearValue,
                }),
            });

            if (!response.ok) {
                throw new Error("Search request failed");
            }

            const data = await response.json();

            if (!data.success) {
                cardBox.innerHTML = `
                    <p class="col-span-full text-center text-red-500 py-10">
                        ${data.message}
                    </p>
                `;
                return;
            }

            if (data.result.length === 0) {
                cardBox.innerHTML = `
                    <p class="col-span-full text-center text-gray-500 py-10">
                        No vehicles found.
                    </p>
                `;
                return;
            }

            const cards = data.result
                .map(createVehicleCard)
                .join("");

            cardBox.innerHTML = `
                <div class="col-span-full mb-4">
                    <h3 class="text-xl font-bold text-[var(--primary)]">
                        Search Results (${data.result.length})
                    </h3>
                </div>

                ${cards}
            `;
        } catch (error) {
            console.error("Home Search Error:", error);

            cardBox.innerHTML = `
                <p class="col-span-full text-center text-red-500 py-10">
                    Something went wrong. Please try again.
                </p>
            `;
        } finally {
            searchBtn.disabled = false;
        }
    }

    /* Button Search */
    searchBtn.addEventListener("click", performSearch);

    /* Enter Key Search */
    [make, model, year].forEach((input) => {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                performSearch();
            }
        });
    });
}

async function weatherFunction() {
    try {
        const response = await fetch('/api/weather');

        if (!response.ok) {
            throw new Error("Search request failed");
        }
        const data = await response.json();

        const cityEl = document.getElementById('weather-city');
        const tempEl = document.getElementById('weather-temp');
        const tempDg = document.getElementById('weather-degree');
        const iconEl = document.getElementById('weather-icon');
        const textEl = document.getElementById('weather-text');

        const weather = data.result.current;
        const weatherLocation = data.result.location

         // 3. Update the frontend UI with real-time data
        cityEl.textContent = `Location: ${weatherLocation.name}, ${weatherLocation.country}`
        tempEl.textContent = `${weather.temp_f}° F`;
        tempDg.textContent = `${weather.temp_c}° C`
        textEl.textContent = weather.condition.text;
        
        // 4. Update and reveal the icon image
        iconEl.src = `https:${weather.condition.icon}`; // Prefix with https: because WeatherAPI returns relative paths
        iconEl.classList.remove('hidden');
        
    } catch (error) {
        console.error(error)
    }
    
}



/* ==========================================
   INITIALIZE
========================================== */
document.addEventListener("DOMContentLoaded", () => {
    headerFunc();
    homeSearch();
    weatherFunction();
});