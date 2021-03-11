const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const WIDTH = 60, STARTX = 500, STARTY = 300, STARTYINTERMEDIATE = 500;
const colorWhileSwapping = '#f3ca20', initialColor = '#000';

let timeAtWhichAnimationStarts = 0, finalDestinationX = null, xSpeed = null, curBar = null,index=0,isPlaying=false,speed=1,YSPEED = 5;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// event listener to resize the canvas as soon as window is resized
window.addEventListener('resize', (event) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let inputArray = [] ,animationArray = [],downArrayFirst=[],downArraySecond=[],requestDown=null,requestUp=null;

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

// merge helper of mergesort function
const merge = (leftIndex, midIndex, rightIndex) => {

    const leftSize = midIndex - leftIndex + 1;
    const rightSize = rightIndex - midIndex;

    const left = inputArray.slice(leftIndex, midIndex + 1);
    const right = inputArray.slice(midIndex + 1, rightIndex + 1);

    let i = 0, j = 0, k = leftIndex;

    while (i < leftSize && j < rightSize) {
        if (left[i] <= right[j]) {
            inputArray[k] = left[i];

            // boxes go down to their designated positions
            //delayGoingDown(i + leftIndex, k,"first");
            //console.log("first",i + leftIndex, k);
            downArrayFirst.push(i + leftIndex);
            downArraySecond.push(k);
            ++i;
            ++k;
        }
        else {
            inputArray[k] = right[j];
            //delayGoingDown(j + midIndex + 1, k,"second");
            //console.log("second",j + midIndex + 1, k);
            downArrayFirst.push(j + midIndex + 1);
            downArraySecond.push(k);
            ++j;
            ++k;
        }
    }

    while (i < leftSize) {
        inputArray[k] = left[i];
        //delayGoingDown(i + leftIndex, k,"third");
        downArrayFirst.push(i + leftIndex);
        downArraySecond.push(k);
       // console.log("third",i + leftIndex, k);
        ++i;
        ++k;
    }

    while (j < rightSize) {
        inputArray[k] = right[j];
        //delayGoingDown(j + midIndex + 1, k,"fourth");
        downArrayFirst.push(j + midIndex + 1);
        downArraySecond.push(k);
        //console.log("fourth",j + midIndex + 1, k);
        ++j;
        ++k;
    }

    // after all the boxes have reached their designated positions move the subarray back to its position
    //delayGoingUp();
    downArrayFirst.push("UP");
    downArraySecond.push("UP");
}

const mergeSortHelper = (leftIndex, rightIndex) => {

    if (rightIndex > leftIndex) {
        const midIndex = Math.floor((leftIndex + rightIndex) / 2);

        mergeSortHelper(leftIndex, midIndex);
        mergeSortHelper(midIndex + 1, rightIndex);
        merge(leftIndex, midIndex, rightIndex);
    }
}

//algorithm for merge sort
function mergeSort(input) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    $("#slider").val(speed);
    inputArray=input;
    $("#stop").html("Stop")
    animationArray = [],downArrayFirst=[],downArraySecond=[],isPlaying=false,requestDown=null,requestUp=null,index=0,YSPEED=5;
    for (let i = 0; i < inputArray.length; ++i) {
        animationArray[i] = new Box(STARTX + 100 * i, STARTY, initialColor, inputArray[i]);
        animationArray[i].draw();
    }

    //merge sort
    mergeSortHelper(0, inputArray.length - 1);
}
// utility function to sort animationArray according to the x-coordinates
const sortAnimationArray = () => {
    animationArray.sort((a, b) => a.x - b.x);
}

$("#slider").change(function(){
    speed=Number($(this).val());
    console.log(speed);
})

// function to produce animation that takes the subarray boxes down to a temporary position
function animateGoingDown() {

    requestDown = requestAnimationFrame(animateGoingDown);
    requestUp=null;

    c.clearRect(0, 0, canvas.width, canvas.height);

    // change x and y of boxes till they reach the intermediate designated position
    if (animationArray[curBar].y < STARTYINTERMEDIATE || Math.abs(animationArray[curBar].x - finalDestinationX) > 1) {
        if (animationArray[curBar].y < STARTYINTERMEDIATE) {
            animationArray[curBar].y += YSPEED;
        }
        if (animationArray[curBar].x > finalDestinationX) {
            animationArray[curBar].x -= xSpeed;
        }
        if (animationArray[curBar].x < finalDestinationX) {
            animationArray[curBar].x += xSpeed;
        }
    }
    else {
          cancelAnimationFrame(requestDown);
          if(index+1 < downArrayFirst.length)
                {
                index=index+1;
                if(downArrayFirst[index]==downArraySecond[index] && downArraySecond[index]=="UP")
                {   animateGoingUp();
                    sortAnimationArray();
                    index=index+1;
                }
                else
                {  
                    var cur=downArrayFirst[index], final = downArraySecond[index];
                    animationArray[cur].color=colorWhileSwapping;
                    animationArray[final].color=colorWhileSwapping;
                    finalDestinationX = STARTX + 100 * final;
                    curBar = cur;
                    // setting xSpeed in accordance to ySpeed so that final x and y coordinate is reached simultaneously
                    xSpeed = Math.abs(finalDestinationX - animationArray[curBar].x) / (STARTYINTERMEDIATE - STARTY) * YSPEED;
                    animateGoingDown();
                }
                }
    }

    for (bar of animationArray) {
        bar.draw();
    }
}

// this function produces animation of subarray boxes going up
function animateGoingUp() {

    requestUp = requestAnimationFrame(animateGoingUp);
    requestDown=null

    c.clearRect(0, 0, canvas.width, canvas.height);

    let goesUp = false;

    for (bar of animationArray) {

        if (bar.y > STARTY) {
            bar.y -= YSPEED;
            goesUp = true;
        }
        bar.draw();
    }
    if (!goesUp)
        {   YSPEED=5*speed;
            for (bar of animationArray) {
                bar.color=initialColor;
                bar.draw();
            }
            cancelAnimationFrame(requestUp);
            if(index < downArrayFirst.length){
                var cur=downArrayFirst[index], final = downArraySecond[index];
                animationArray[cur].color=colorWhileSwapping;
                animationArray[final].color=colorWhileSwapping;
                finalDestinationX = STARTX + 100 * final;
                curBar = cur;
                // setting xSpeed in accordance to ySpeed so that final x and y coordinate is reached simultaneously
                xSpeed = Math.abs(finalDestinationX - animationArray[curBar].x) / (STARTYINTERMEDIATE - STARTY) * YSPEED;
                animateGoingDown();
            }
        }
}

$('#start').click(function(){
        if($(this).html()=="Replay")
            {   $(this).html("Start");
                if(isPlaying==true){
                    if(requestDown)
                        {cancelAnimationFrame(requestDown);}
                    else
                        {cancelAnimationFrame(requestUp)}
                }
                if($('#input').val())
                    {mergeSort($('#input').val().split(",").map(Number));}
                else {mergeSort([6, 3, 6, 4, 8, 5, 2, 9]);}

            }  
        else if(isPlaying == false) {
            $(this).html("Replay");
                YSPEED=5*speed;
                isPlaying = true;
                var cur = downArrayFirst[index], final = downArraySecond[index];
                animationArray[cur].color=colorWhileSwapping;
                animationArray[final].color=colorWhileSwapping;
                finalDestinationX = STARTX + 100 * final;
                curBar = cur;

                // setting xSpeed in accordance to ySpeed so that final x and y coordinate is reached simultaneously
                xSpeed = Math.abs(finalDestinationX - animationArray[curBar].x) / (STARTYINTERMEDIATE - STARTY) * YSPEED;
                animateGoingDown();
            // }
        }       
})

$('#stop').click(function(){
        if(isPlaying == true)
          {
            if(requestDown)
                {cancelAnimationFrame(requestDown);}
            else
                {cancelAnimationFrame(requestUp);}

           $(this).html("Play"); 
           isPlaying = false;
           }
        else
          { if($(this).html()=="Play"){
                if(requestDown)
                    {requestAnimationFrame(animateGoingDown);}
                else
                    {requestAnimationFrame(animateGoingUp);}
               $(this).html("Stop");
               $(this).css("Stop"); 
               isPlaying=true;
            }
         }
   })

$('#enter').click(function(){
        if($('#input').val()){
            $('#start').html("Start");
            if(isPlaying==true)
                {   
                if(requestDown)
                    {cancelAnimationFrame(requestDown);}
                else
                    {cancelAnimationFrame(requestUp);}
                }
            mergeSort($('#input').val().split(",").map(Number));
        }
   })
$('#reset').click(function(){
    speed=1;
    $("#slider").val(speed);
   })

mergeSort([6, 3, 6, 4, 8, 5, 2, 9]);