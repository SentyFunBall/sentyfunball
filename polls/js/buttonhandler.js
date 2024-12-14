function userRedirect(where) {
    window.location.href = `sentyfunball/polls/${where}`;
}

document.addEventListener("DOMContentLoaded", async() => {
    const fadeables = document.querySelectorAll(".result");

    //fade in elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting) {
                entry.target.classList.add("visible");
            } 
        });
    });
    fadeables.forEach((el) => observer.observe(el));
});