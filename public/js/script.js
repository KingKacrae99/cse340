const carousel = document.getElementById('carousel');
const dots = document.querySelectorAll('.dot');

let currentIndex = 0;
const totalSlides = dots.length;

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