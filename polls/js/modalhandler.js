document.addEventListener("DOMContentLoaded", function() {
    // Get the modal elements
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const span = document.getElementsByClassName("modal-close")[0];

    // Get all images that should be expandable (inside .result divs)
    const images = document.querySelectorAll('.result img');

    // Loop through all images and add the click event
    images.forEach(img => {
        img.onclick = function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
        }
    });

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    // When the user clicks anywhere on the modal background, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
