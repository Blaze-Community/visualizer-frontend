const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const STARTX = 500, STARTY = 200, WIDTH = 60, SPACING = 80;
const initialColor = "#2a9d8f", colorOfNodeBeingInserted = "#e9c46a", colorOfNodesWhosePointerIsAdjusted = "#264653";

let animationArray = [],isPlaying=false,speed=1,YSPEED = 1*speed, XSPEED = 1*speed,process="";;

let elementToBeInserted = null, index = null;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// event listener to resize the canvas as soon as window is resized
window.addEventListener('resize', (event) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

$("#slider").val(speed);

// class defined to construct arrows
class Arrow {
    constructor(fromX, fromY, toX, toY, color = "black", width = "2") {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.color = color;
        this.width = width;
    }

    // draws arrows of desired length
    draw() {
        c.beginPath();
        const headlen = 10;
        const dx = this.toX - this.fromX;
        const dy = this.toY - this.fromY;
        const angle = Math.atan2(dy, dx);
        c.lineWidth = this.width;
        c.moveTo(this.fromX, this.fromY);
        c.lineTo(this.toX, this.toY);
        c.lineTo(this.toX - headlen * Math.cos(angle - Math.PI / 6), this.toY - headlen * Math.sin(angle - Math.PI / 6));
        c.moveTo(this.toX, this.toY);
        c.lineTo(this.toX - headlen * Math.cos(angle + Math.PI / 6), this.toY - headlen * Math.sin(angle + Math.PI / 6));
        c.stroke();
    }
}

// class defined to construct boxes representing numbers
class Box {
    constructor(x, y, color, text) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.text = text;
    }

    // draws boxes, numbers and shadow effects
    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, WIDTH, -WIDTH);

        c.fillStyle = "#fff";

        c.fillText(this.text, this.x + 20, this.y - 20);
        c.font = '30px Calibri';

        c.shadowBlur = 10;
        c.shadowColor = "black";
    }
}

// class made to group together an arrow and a box
class Element {
    constructor(box = null, arrow = null) {
        this.box = box;
        this.arrow = arrow;
    }

    draw() {
        if (this.arrow)
            this.arrow.draw();
        if (this.box)
            this.box.draw();
    }
}

$("#slider").change(function(){
    speed=Number($(this).val());
    YSPEED = 1*speed, XSPEED = 1*speed;
})

request =null,animate=null;

// animation of insertion after adjusting pointers
function animateGoingRight() {
    animate = animateGoingRight;
    request = requestAnimationFrame(animateGoingRight);

    c.clearRect(0, 0, canvas.width, canvas.height);

    // translating all elements after the index we are inserting in
    for (let i = 0; i < animationArray.length; ++i) {
        if (i >= index) {
            animationArray[i].box.y += YSPEED;
            if (animationArray[i].arrow) {
                animationArray[i].arrow.fromY += YSPEED;
                animationArray[i].arrow.toY += YSPEED;
            }
        }
        animationArray[i].draw();
    }

    if (elementToBeInserted.box.x <= STARTX) {

        // adjusting the arrow of the element we are inserting
        elementToBeInserted.box.x += XSPEED;
        if (elementToBeInserted.arrow) {
            elementToBeInserted.arrow.fromX = elementToBeInserted.box.x + WIDTH / 2;
            elementToBeInserted.arrow.toY = animationArray[index].box.y - WIDTH;
        }
        elementToBeInserted.draw();

        // adjusting the arrow of the element before the number we are inserting
        if (index - 1 >= 0) {
            animationArray[index - 1].arrow.toY = elementToBeInserted.box.y;
            animationArray[index - 1].arrow.toX -= XSPEED;
            animationArray[index - 1].arrow.toX = elementToBeInserted.box.x + WIDTH / 2;
        }
    }
    else {

        // insert element at correct position after the animation is complete because we are animating using index
        // and if we change it during animation, desired result wont be achieved
        animationArray.splice(index, 0, elementToBeInserted);
        c.clearRect(0, 0, canvas.width, canvas.height);
        for (let element of animationArray)
            element.draw();
        cancelAnimationFrame(request);
        for (element of animationArray)
            {element.box.color = initialColor;}

        c.clearRect(0, 0, canvas.width, canvas.height);

        for (element of animationArray)
            {element.draw();}

        elementToBeInserted = null;
        index = null;
        isPlaying = false;
        process=""
    }
}

function animateInsert() {
    animateGoingRight();
}

// animation of box to be deleted going down
function animateGoingLeft() {
    animate = animateGoingLeft;
    request = requestAnimationFrame(animateGoingLeft);

    c.clearRect(0, 0, canvas.width, canvas.height);

    for (element of animationArray)
        element.draw();
        //console.log(animationArray[index].box.x,STARTX - SPACING);
    if (animationArray[index].box.x > STARTX - SPACING) {
        animationArray[index].box.x -= XSPEED;
        animationArray[index].arrow.fromX -= XSPEED;

        if (index - 1 >= 0)
            animationArray[index - 1].arrow.toX -= XSPEED;
    }
    else {
        if (index - 1 < 0)
            animationArray.splice(index, 1);
        cancelAnimationFrame(request);
        if (index - 1 >= 0) {
            adjustPointerDelete();
        }
        else {
            shiftBack();
        }
    }
}

// animation of adjusting pointers while deleting
function adjustPointerDelete() {
    animate = adjustPointerDelete;
    request = requestAnimationFrame(adjustPointerDelete);

    c.clearRect(0, 0, canvas.width, canvas.height);

    for (element of animationArray)
        element.draw();
    if (animationArray[index - 1].arrow.toY > STARTY - WIDTH / 2) {
        animationArray[index - 1].arrow.toX += XSPEED;
        animationArray[index - 1].arrow.toY -= YSPEED;
    }
    else {
        animationArray.splice(index, 1);
        cancelAnimationFrame(request);
        shiftBack();
    }
}

// function to scale back the enlarged arrow to its normal size
function shiftBack() {
    animate = shiftBack;
    request = requestAnimationFrame(shiftBack);

    c.clearRect(0, 0, canvas.width, canvas.height);

    for (element of animationArray)
        element.draw();

    if (animationArray[index].box.y > STARTY + SPACING * index) {
        for (let i = index; i < animationArray.length; ++i) {
            animationArray[i].box.y -= YSPEED;
            if (animationArray[i].arrow) {
                animationArray[i].arrow.fromY -= YSPEED;
                animationArray[i].arrow.toY -= YSPEED;
            }
        }
        if (index - 1 >= 0)
            animationArray[index - 1].arrow.toY -= YSPEED;
    }
    else {
        cancelAnimationFrame(request);
        for (element of animationArray)
            element.box.color = initialColor;

        c.clearRect(0, 0, canvas.width, canvas.height);

        for (element of animationArray)
            element.draw();

        elementToBeInserted = null;
        index = null;
        isPlaying = false;
        process=""
    }
}

function animateDelete() {
    animationArray[index].box.color = colorOfNodeBeingInserted;
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (element of animationArray) {
        element.draw();
    }
    if (index === animationArray.length - 1) {
            if (index > 0)
                animationArray[index - 1].arrow = null;
            animationArray.splice(index, 1);
            isPlaying =false;
            c.clearRect(0, 0, canvas.width, canvas.height);
            for (element of animationArray) {
                element.box.color = initialColor;
                element.draw();
            }
    }

    else
    {
        animateGoingLeft();
    }
}

// insert function is called as soon as insert button is pressed
const insert = (number, ind) => {
    index = parseInt(ind);
    const box = new Box(STARTX - SPACING, STARTY + index * SPACING, colorOfNodeBeingInserted, number);
    if (index === animationArray.length) {
        const element = new Element(box);
        elementToBeInserted = element;
    }
    else {
        const arrow = new Arrow(STARTX - SPACING + WIDTH / 2, STARTY - WIDTH / 2 , STARTX + WIDTH / 2, STARTY + index * SPACING);
        const element = new Element(box, arrow);
        elementToBeInserted = element;
    }
    isPlaying=true;
    process = "Push";
    animateInsert();
}

// deleteElement function is called as soon as delete button is pressed
const deleteElement = (ind) => {
    index = parseInt(ind);
    isPlaying=true;
    process = "Pop";
    animateDelete();

}

const insertInput = document.querySelector("#number");
const insertButton = document.querySelector("#insert");

insertButton.addEventListener('click', (event) => {
    if(isPlaying === false){
        event.preventDefault();
        const textValue = insertInput.value;
        const textIndex = 0;
        if(textValue!="")
            {   insertInput.value = "";
                insert(textValue, textIndex);}    
            }
    else{
        $('.alert').html(process + " is in  progress!");
        $('.alert').addClass('show');
        setTimeout(function(){ 
            $('.alert').removeClass('show');
            $('.alert').html("");
        }, 2500);
    }
});

const deleteButton = document.querySelector("#delete");

deleteButton.addEventListener('click', (event) => {
    if(isPlaying === false){
        event.preventDefault();
        const textValue = 0;
        if(animationArray.length != 0){
            deleteElement(textValue);
        }
    }
    else{
        $('.alert').html(process + " is in  progress!");
        $('.alert').addClass('show');
        setTimeout(function(){ 
            $('.alert').removeClass('show');
            $('.alert').html("");
        }, 2500);
    }
}); 

$('#stop').click(function(){
        if(isPlaying === true)
          { if(request != null){
                cancelAnimationFrame(request);
            }

           $(this).html("Play"); 
           isPlaying = false;
           }
        else
          { if($(this).html()=="Play"){
               if(request!=null){
                    requestAnimationFrame(animate);
                }
               $(this).html("Stop");
               $(this).css("Stop"); 
               isPlaying=true;
            }
         }
   })

$('#reset').click(function(){
    speed=1;
    $("#slider").val(speed);
   })