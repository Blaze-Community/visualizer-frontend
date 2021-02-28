const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const STARTX = 500, STARTY = 300, WIDTH = 60,SPACING = 120;
const initialColor = "#2a9d8f", colorOfNodeBeingInserted = "#e9c46a", colorOfNodesWhosePointerIsAdjusted = "#264653";

let animationArray = [],isPlaying=false,speed=1,traverseSpeed=1,YSPEED = 1*speed, XSPEED = 1*speed,process="";

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
    constructor(box = null, arrowfront = null, arrowback = null) {
        this.box = box;
        this.arrowfront = arrowfront;
        this.arrowback = arrowback;

    }

    draw() {
        if (this.arrowfront)
            this.arrowfront.draw();
        if (this.arrowback)
            this.arrowback.draw()
        if (this.box)
            this.box.draw();
    }
}

request =null,animate=null,timer=null;

$("#slider").change(function(){
    speed=Number($(this).val());
    YSPEED = 1*speed, XSPEED = 1*speed;
    if(speed>=0.1 && speed<=0.3)
        {traverseSpeed=10;}
    if(speed>=0.4 && speed<=0.6)
        {traverseSpeed=5;}
    if(speed>0.6 && speed<1)
        {traverseSpeed=3;}
    if(Math.floor(speed==1))
        {traverseSpeed=1;}
    if(Math.floor(speed==2))
        {traverseSpeed=0.5;}
    if(Math.floor(speed==3))
        {traverseSpeed=0.4;}
    if(Math.floor(speed==4))
        {traverseSpeed=0.3;}
    if(Math.floor(speed==5))
        {traverseSpeed=0.1;}
    if(timer){
        clearInterval(timer);
        if(process === 'Delete'){
            animateDelete();
        }
        else{
            animateInsert();
        }
    }
})

// animation of insertion after adjusting pointers
function animateGoingUp() {
    animate = animateGoingUp;
    request = requestAnimationFrame(animateGoingUp);

    c.clearRect(0, 0, canvas.width, canvas.height);

    // translating all elements after the index we are inserting in
    for (let i = 0; i < animationArray.length; ++i) {
        if (i >= index) {
            animationArray[i].box.x += XSPEED;
            if (animationArray[i].arrowfront) {
                //for moving arrow forward with the boxes
                animationArray[i].arrowfront.fromX += XSPEED;
                animationArray[i].arrowfront.toX += XSPEED;
            }
            if (animationArray[i].arrowback) {
                animationArray[i].arrowback.fromX += XSPEED;
                animationArray[i].arrowback.toX += XSPEED;
            }
        }
        animationArray[i].draw();
    }

    if (elementToBeInserted.box.y >= STARTY) {

        // adjusting the arrow of the element we are inserting (RIGHT SIDE Arrows)
        elementToBeInserted.box.y -= YSPEED;
        if (elementToBeInserted.arrowfront) {
            elementToBeInserted.arrowfront.fromY = elementToBeInserted.box.y - WIDTH / 2;
            elementToBeInserted.arrowfront.toX = animationArray[index].box.x;
        }
        if (elementToBeInserted.arrowback) {
            //to make back arrow little up from the front arrow
            elementToBeInserted.arrowback.fromY = elementToBeInserted.box.y - WIDTH / 2 - 10;
            elementToBeInserted.arrowback.toX = animationArray[index - 1].box.x + WIDTH;
        }


        elementToBeInserted.draw();

        // adjusting the arrow of the element before the number we are inserting (LEFT SIDE Arrows)
        if (index - 1 >= 0) {
            animationArray[index - 1].arrowfront.toY += YSPEED;
            animationArray[index - 1].arrowfront.toX = elementToBeInserted.box.x;
            animationArray[index - 1].arrowfront.toY = elementToBeInserted.box.y - WIDTH / 2;
        }
        if (elementToBeInserted.arrowback) {
            //to make back arrow little up from the front arrow
            elementToBeInserted.arrowback.fromY = elementToBeInserted.box.y - WIDTH / 2 - 10;
            elementToBeInserted.arrowback.toX = animationArray[index - 1].box.x + WIDTH;
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
        process = "";
    }
}

function animateInsert() {

    // animate traversing the linked list
    let temp=0;
    timer = setInterval(function(){
        c.clearRect(0, 0, canvas.width, canvas.height);
        if(index > 0){
            if(temp - 1 >= 0)
                {
                    animationArray[temp - 1].box.color = initialColor;
                }
            animationArray[temp].box.color = colorOfNodesWhosePointerIsAdjusted;

        }
        for (let i = 0; i < animationArray.length;i++) {
            animationArray[i].draw();
        }
        temp+=1;
        request=null;
        if(temp >= index)
        {   clearInterval(timer);
            timer = null;
            if (index > 0 && index === animationArray.length)
                animationArray[index - 1].arrowfront = new Arrow(STARTX + (index - 1) * SPACING + WIDTH / 2, STARTY - WIDTH / 2, STARTX + index * SPACING, STARTY + SPACING - WIDTH / 2);
            else if (index === 0 && animationArray.length > 0)
                animationArray[0].arrowback = new Arrow(STARTX + WIDTH / 2, STARTY - WIDTH / 2 - 10, STARTX - SPACING + WIDTH, STARTY - WIDTH / 2 - 10);

            animateGoingUp();
        }

    }, (traverseSpeed*1000));

}

// animation of box to be deleted going down
function animateGoingDown() {
    animate = animateGoingDown;
    request = requestAnimationFrame(animateGoingDown);

    c.clearRect(0, 0, canvas.width, canvas.height);

    for (element of animationArray)
        element.draw();

    if (animationArray[index].box.y < STARTY + SPACING) {
        animationArray[index].box.y += YSPEED;
        animationArray[index].arrowfront.fromY += YSPEED;
        if (animationArray[index].arrowback) {
            animationArray[index].arrowback.fromY += YSPEED;
        }

        if (index - 1 >= 0)
            animationArray[index - 1].arrowfront.toY += YSPEED;
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

    if (animationArray[index - 1].arrowfront.toY > STARTY - WIDTH / 2) {
        animationArray[index - 1].arrowfront.toX += XSPEED;
        animationArray[index - 1].arrowfront.toY -= YSPEED;
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

    if (animationArray[index].box.x > STARTX + SPACING * index) {
        for (let i = index; i < animationArray.length; ++i) {
            animationArray[i].box.x -= XSPEED;
            if (animationArray[i].arrowfront) {
                //For shifting arrow backward with the boxes
                animationArray[i].arrowfront.fromX -= XSPEED;
                animationArray[i].arrowfront.toX -= XSPEED;
            }
            if (animationArray[i].arrowback) {
                //For shifting arrow backward with the boxes
                animationArray[i].arrowback.fromX -= XSPEED;
                animationArray[i].arrowback.toX -= XSPEED;
            }
        }
        if (index - 1 >= 0)
            animationArray[index - 1].arrowfront.toX -= XSPEED;
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
        process = "";
    }
}

function animateDelete() {

    // animate traversing the linked list
    let temp=0;
    timer = setInterval(function(){
        c.clearRect(0, 0, canvas.width, canvas.height);
        if(index > 0){
            if(temp - 1 >= 0)
                {
                    animationArray[temp - 1].box.color = initialColor;
                }
            animationArray[temp].box.color = colorOfNodesWhosePointerIsAdjusted;

        }
        for (let i = 0; i < animationArray.length;i++) {
            animationArray[i].draw();
        }
        temp+=1;
        request=null;
        if(temp >= index)
        {   clearInterval(timer);
            timer = null;
            animationArray[index].box.color = colorOfNodeBeingInserted;
            c.clearRect(0, 0, canvas.width, canvas.height);
            for (element of animationArray) {
                element.draw();
            }
            if (index === animationArray.length - 1) {
                    if (index > 0)
                        animationArray[index - 1].arrowfront = null;
                    animationArray.splice(index, 1);
                    isPlaying =false;
                    c.clearRect(0, 0, canvas.width, canvas.height);
                    for (element of animationArray) {
                        element.box.color = initialColor;
                        element.draw();
                    }
            }
            else{
                    if (index === 0 && animationArray.length > 1) {
                        animationArray[index + 1].arrowback = null;
                    }

                    animateGoingDown();

            }
        }
        
    }, (traverseSpeed*1000));
}

// insert function is called as soon as insert button is pressed
const insert = (number, ind) => {
    index = parseInt(ind);
    const box = new Box(STARTX + index * SPACING, STARTY + SPACING, colorOfNodeBeingInserted, number);
    if (index === 0) {

        if (animationArray.length == 0) {
            const element = new Element(box);
            elementToBeInserted = element;
        }
        else {
            const arrowfront = new Arrow(STARTX + index * SPACING + WIDTH / 2, STARTY + SPACING - WIDTH / 2, STARTX + index * SPACING, STARTY - WIDTH / 2);
            const element = new Element(box, arrowfront);
            elementToBeInserted = element;
        }
    }
    else if (index === animationArray.length) {
        var arrowback = new Arrow(STARTX + index * SPACING + WIDTH / 2, STARTY + SPACING - WIDTH / 2, STARTX + index * SPACING - WIDTH, STARTY - WIDTH / 2 - 10);
        const element = new Element(box, null, arrowback);
        elementToBeInserted = element;
    }
    else {
        const arrowfront = new Arrow(STARTX + index * SPACING + WIDTH / 2, STARTY + SPACING - WIDTH / 2, STARTX + index * SPACING, STARTY - WIDTH / 2);
        if (ind != 0)
            var arrowback = new Arrow(STARTX + index * SPACING + WIDTH / 2, STARTY + SPACING - WIDTH / 2, STARTX + index * SPACING - WIDTH, STARTY - WIDTH / 2 - 10);
        else
            var arrowback = null;
        const element = new Element(box, arrowfront, arrowback);
        elementToBeInserted = element;
    }
    isPlaying=true;
    process = "Insert";
    animateInsert();
}

// deleteElement function is called as soon as delete button is pressed
const deleteElement = (ind) => {
    index = parseInt(ind);
    isPlaying=true;
    process = "Delete";
    animateDelete();
}

const insertInput = document.querySelector("#number");
const insertButton = document.querySelector("#insert");
const indexInput = document.querySelector("#index");

insertButton.addEventListener('click', (event) => {
    if(isPlaying == false){
        event.preventDefault();
        const textValue = insertInput.value;
        const textIndex = indexInput.value;
        if(textIndex > animationArray.length || textIndex < 0)
            { $('.alert').html(textIndex + " is an Invaild Index!");
              $('.alert').addClass('show');
              setTimeout(function(){ 
                $('.alert').removeClass('show');
                $('.alert').html("");
              }, 2500);
            }
        else {
            if(textValue!="" && textIndex!="")
                {insert(textValue, textIndex);}
        }
    }
    else {
    $('.alert').html(process + " is in  progress!");
    $('.alert').addClass('show');
    setTimeout(function(){ 
        $('.alert').removeClass('show');
        $('.alert').html("");
    }, 2500);
    }
    insertInput.value = "";
    indexInput.value = "";
});

const deleteInput = document.querySelector("#indexDelete");
const deleteButton = document.querySelector("#delete");

deleteButton.addEventListener('click', (event) => {
    if(isPlaying === false){
        event.preventDefault();
        const textValue = deleteInput.value;
        if(textValue > animationArray.length || textValue < 0)
            { $('.alert').html(textValue + " is an Invaild Index!");
              $('.alert').addClass('show');
              setTimeout(function(){ 
                $('.alert').removeClass('show');
                $('.alert').html("");
              }, 2500);
            }
        else {
            if(textValue!="")
                {deleteElement(textValue);}
        }
    }
    else {
        $('.alert').html(process + " is in  progress!");
        $('.alert').addClass('show');
        setTimeout(function(){ 
            $('.alert').removeClass('show');
            $('.alert').html("");
        }, 2500);       
    }
    deleteInput.value = "";
});

$('#stop').click(function(){
        if(isPlaying === true)
          { if(request != null){
                cancelAnimationFrame(request);
            }
            else
                {clearInterval(timer);}
           $(this).html("Play"); 
           isPlaying = false;
           }
        else
          { if($(this).html()=="Play"){
               if(request!=null){
                    requestAnimationFrame(animate);
                }
                else
                { if(process === 'Delete'){
                    animateDelete();}
                  else{
                    animateInsert();
                  }

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