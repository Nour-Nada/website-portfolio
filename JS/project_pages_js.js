const project_des_og = document.querySelectorAll(".project_des");
const project_des = document.querySelectorAll(".project_des div");
const nxtButton = document.getElementById('buttonRight');
const bckButton = document.getElementById('buttonLeft');
let slideIndex = 1;
let project_amount = project_des.length;

document.addEventListener("DOMContentLoaded", initializerSlider);

project_des[slideIndex].scrollIntoView({behavior: 'instant'});

function initializerSlider() { //adds the class that highlihgts the middle project
    project_des[slideIndex+1].classList.add("displaySlide");
    project_des[slideIndex-1].classList.add("displaySlide");
}
function uninitializerSliderNext() { //during transation it removes those highlights so they can be reaplied when going to the next slide
    project_des[slideIndex+1].classList.remove("displaySlide");
    if (slideIndex != 3) {
        setTimeout(() => { //the timer is to insure the user can not see the leftmost project going back to size
            project_des[slideIndex-2].classList.remove("displaySlide");
        }, 500);
    }
    else {}
}
function uninitializerSliderPrev() { //during transation it removes those highlights so they can be reaplied when going to the previous slide
    project_des[slideIndex-1].classList.remove("displaySlide");
    setTimeout(() => { //the timer is to insure the user can not see the rightmost project going back to size
        project_des[slideIndex+2].classList.remove("displaySlide");
    }, 500);
}
function prevSlide() { //goes to the previous slide (for it to be looping I must copy the last project to the beginning)
    bckButton.disabled = true; // disable immediately //FIX-ME ensure it works on the first slide
    if (slideIndex == 1) { //checks to make sure we are not on the last project
        console.log(slideIndex); //simiply logs the current postion
        slideIndex = project_amount - 2;
        project_des[slideIndex + 1].scrollIntoView({behavior: 'auto'});
        initializerSlider(); //calls intilizer to now intilize highlight
        prevSlide()
    }
    else {
        console.log(slideIndex); //simiply logs the current postion
        project_des[slideIndex-2].scrollIntoView({behavior: 'smooth'}); //brings next project into highlight postion
        uninitializerSliderPrev(); //calls uninitializer to now unitilize highlights
        slideIndex--; //updates slideIndex
        initializerSlider(); //calls intilizer to now intilize highlight
    }
    setTimeout(() => { //AI code snippet that re-enables the button after .6 seconds
        bckButton.disabled = false; // re-enable after .6 seconds
    }, 600);
}
function nextSlide() { //goes to the next slide (for it to be looping I must copy the first project to the end)
    nxtButton.disabled = true; // disable immediately
    if (slideIndex == project_amount-2) { //checks to make sure we are not on the last project
        console.log(slideIndex); //simiply logs the current postion
        slideIndex = 1;
        project_des[slideIndex-1].scrollIntoView({behavior: 'auto'});
        initializerSlider(); //calls intilizer to now intilize highlight
        nextSlide()
    }
    else {
        console.log(slideIndex); //simiply logs the current postion
        project_des[slideIndex+2].scrollIntoView({behavior: 'smooth'}); //brings next project into highlight postion
        uninitializerSliderNext(); //calls uninitializer to now unitilize highlights
        slideIndex++; //updates slideIndex
        initializerSlider(); //calls intilizer to now intilize highlight
    }
    setTimeout(() => { //AI code snippet that re-enables the button after .6 seconds
        nxtButton.disabled = false; // re-enable after .6 seconds
    }, 600);
}

document.addEventListener('mousedown', (e) => { //AI code snippet that pervents scrolling as to not brake the webpage
    if (e.button === 1) {
      e.preventDefault(); // Prevent middle mouse button
    }
});