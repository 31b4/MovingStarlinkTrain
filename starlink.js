document.addEventListener('DOMContentLoaded', () => {
    const starsContainer = document.querySelector('.starlinks');
    let mouseX = 0;
    let mouseY = 0;
    var viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    var viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    
    
    
    var randomY = Math.floor(Math.random() * (viewportHeight - 100)) + 50; // 50 H-50
    var randomX = -200
    var randomZ = Math.floor(Math.random() * 11) - 5; // -20 20
    if (randomY > viewportHeight/2 && randomZ >0) {
        randomZ = -randomZ
    }
    else if (randomY < viewportHeight/2 && randomZ <0) {
        randomZ = -randomZ
    }
    var exit = true


    function createStar(index) {
        const star = document.createElement('div');
        star.classList.add('starlink');
        star.style.top = `${randomY+randomZ*index}px`; // Adjust the vertical position
        star.style.left = `${randomX + index*10}px`; // Adjust the horizontal position
        star.style.animationDuration = `${Math.random() * 2 + 1}s`;
        starsContainer.appendChild(star);
    }

    function updateStarsPosition() {
        if (userGone) {
            return
        }
        const stars = document.querySelectorAll('.starlink');
        exit = false
        stars.forEach((star) => {
            const currentTransform = star.style.transform;
            const [currentX, currentY] = extractTranslateValues(currentTransform);
            
            // Move the star to the right by 1 pixel
            const newX = currentX + 10/5;
            const newY = currentY + randomZ/5
            // Check if the star is still within the viewport
            if (newX < window.innerWidth+200 &&  newX >= 0 ) {
                star.style.transform = `translate(${newX}px, ${newY}px)`;
            } else {
            // Reset the star's position when it goes out of the viewport
                randomY = Math.floor(Math.random() * (viewportHeight - 150)) + 100; // 50 H-50
                randomZ = Math.floor(Math.random() * 11) - 5; // -20 20
                if (randomY > viewportHeight/2 && randomZ >0) {
                    randomZ = -randomZ
                }
                else if (randomY < viewportHeight/2 && randomZ <0) {
                    randomZ = -randomZ
                }
                stars.forEach((s) => s.remove());    
                exit = true
                return true
                
                
                
            }
        });
        if (exit == false) {
            requestAnimationFrame(updateStarsPosition);                
        }
        else{
            clearInterval(timer)
            Start()
            timer = setInterval(Start, 19000);
            return
            //updateStarsPosition();

        }
    }

    function extractTranslateValues(transform) {
        const match = transform.match(/translate\(([^,]+)px,([^)]+)px\)/);
        if (match) {
            return [parseFloat(match[1]), parseFloat(match[2])];
        }
        return [0, 0];
    }


    



    function Start(){
        for (let i = 0; i < 20; i++) {
            createStar(i);
        }
        updateStarsPosition();
    }
    
    
    Start()
    var timer = setInterval(Start, 19000);
    var userGone = false
    // Function to handle page visibility changes
    function handleVisibilityChange() {
        if (document.visibilityState === "visible") {
            // Page is visible, adjust the timer if needed
            console.log("back")
            clearInterval(timer);
            Start()
            timer = setInterval(Start, 19000);
            userGone = false
        } else {
            const stars = document.querySelectorAll('.starlink');
            stars.forEach((s) => s.remove());    
            userGone = true
            console.log("bye")
            // Page is not visible, clear the interval
            clearInterval(timer);
        }
    }

// Listen for visibility changes
document.addEventListener("visibilitychange", handleVisibilityChange);

    
});