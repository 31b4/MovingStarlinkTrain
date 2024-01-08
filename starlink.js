document.addEventListener('DOMContentLoaded', () => {
    const starsContainer = document.querySelector('.starlinks');
    var viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    // y start pos between 50px -> viewportHeight-50px 
    var randomY = Math.floor(Math.random() * (viewportHeight - 100)) + 50; 
    // x start pos -200 so when its generated it's not visible
    var randomX = -200
    // z is the angle direction if it 0 its going horizontally if its -20 it's going slightly up
    var randomZ = Math.floor(Math.random() * 11) - 5; // -5 -> 5
    // if its generated in the lower part of the site and train is going down, change its dir to up
    // and if its in the upper part, its the other way around
    if (randomY > viewportHeight/2 && randomZ >0 || randomY < viewportHeight/2 && randomZ <0) {
        randomZ = -randomZ
    }
    
    
    Start()// start train on load

    //start a timer if something goes wrong its restarts the train generation
    var timer = setInterval(Start, 19000);
    var userGone = false // user clicks off the site
    var exit = true // train is off the website


    // Start funciton, reset everything
    function Start(){
        for (let i = 0; i < 20; i++) {
            createStar(i);
        }
        updateStarsPosition(); // stating the animation
    }


    function createStar(index) {
        const star = document.createElement('div');
        star.classList.add('starlink');
        star.style.top = `${randomY + (randomZ * index)}px`; // Adjust the vertical position
        star.style.left = `${randomX + (index * 10)}px`; // Adjust the horizontal position
        star.style.animationDuration = `${Math.random() * 2 + 1}s`;// Adjust the speed between 1-3s
        starsContainer.appendChild(star);
    }


    // animtation
    function updateStarsPosition() {
        if (userGone) { // if user is not looking at the site, shut down the animation
            return
        }

        // get all stars of the starlink train
        const stars = document.querySelectorAll('.starlink');
        exit = false // the starlink is not off the map

        stars.forEach((star) => { // move them
            // get px py
            const currentTransform = star.style.transform;
            const [currentX, currentY] = extractTranslateValues(currentTransform);
            
            // Move the star in straight with the other stars
            const newX = currentX + (10 / 5) // deviding by 5 to slow down
            const newY = currentY + (randomZ / 5)

            // Check if the star is still within the viewport
            if (newX < window.innerWidth+200 &&  newX >= 0 ) {
                star.style.transform = `translate(${newX}px, ${newY}px)`;
            } else {
                // Reset the star's position when it goes out of the viewport
                randomY = Math.floor(Math.random() * (viewportHeight - 100)) + 50; 
                randomZ = Math.floor(Math.random() * 11) - 5;

                if (randomY > viewportHeight/2 && randomZ >0 || randomY < viewportHeight/2 && randomZ <0) {
                    randomZ = -randomZ
                }

                // remove every prev stars
                stars.forEach((s) => s.remove());    
                exit = true                
                
            }
        });

        // if stalink still visible, move it
        if (exit == false) {
            requestAnimationFrame(updateStarsPosition);                
        }
        else{
            // restarting
            clearInterval(timer)
            Start()
            timer = setInterval(Start, 19000);
        }
    }

    // get pos of star
    function extractTranslateValues(transform) {
        const match = transform.match(/translate\(([^,]+)px,([^)]+)px\)/);
        if (match) {
            return [parseFloat(match[1]), parseFloat(match[2])];
        }
        return [0, 0];
    }
    
    
    // Function to handle page visibility changes
    function handleVisibilityChange() {
        if (document.visibilityState === "visible") {
            // user is looking at the site
            // resetting the timer
            clearInterval(timer);
            Start()
            timer = setInterval(Start, 19000);
            userGone = false
        } else {
            // user gone, deleting the starlink
            const stars = document.querySelectorAll('.starlink');
            stars.forEach((s) => s.remove());    
            userGone = true
            // Page is not visible, clear the interval
            clearInterval(timer);
        }
    }

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);
});