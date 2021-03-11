const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');

let finalDestinationFirstBar = null, finalDestinationSecondBar = null;
let firstBar = null, secondBar = null;

const WIDTH = 40, STARTX = 500, STARTY = 600;
const colorDuringSwappingAndSearching = '#9f5f80', initialColor = '#ff8e71', finalColor = '#ffba93';

let inputArray=[],animationArray = [], first =[],second=[],index=0,isPlaying=false,speed=1,traverseIndex = 0,traverseSpeed=1;
// event listener to resize the canvas as soon as window is resized
window.addEventListener('resize', (event) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// class defined to construct bars representing numbers
class Bar {
    constructor(height, x, y, color) {
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    // draws the bar, text and shadow effects
    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, WIDTH, this.height);

        c.fillStyle = "black";
        if ((-this.height) / 10 <= 2) {
            c.fillText((-this.height) / 10, this.x + 11, this.y + this.height - 10);
        }
        else {
            c.fillText((-this.height) / 10, this.x + 11, this.y - 10);
        }
        c.font = '20px Calibri';

        c.shadowBlur = 10;
        c.shadowColor = "black";

    }

    //draws border on the bars that are being swapped
    drawBorder() {
        c.lineWidth = 2;
        c.strokeStyle = '#000';
        c.strokeRect(this.x, this.y, WIDTH, this.height);
    }
}

function lastColor(){
            for(let i=0;i<animationArray.length;i++){
                let ok=true;
                for(let j=i;j<animationArray.length;j++)
                {
                if(Math.abs(animationArray[i].height)>Math.abs(animationArray[j].height))
                    {ok=false;
                     //console.log(Math.abs(animationArray[i].height),Math.abs(animationArray[j].height));
                     break;
                    }

                }
            if(ok==true)
                {
                animationArray[i].color=finalColor;}
            else
                {break;}        
            }
}

//algorithm for selection sort
function SelectionSort(input) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    $("#slider").val(speed);
    inputArray=input;
    $("#stop").html("Stop")
    animationArray = [], first =[],second=[],index=0,isPlaying=false,traverseIndex = 0;
    for (let i = 0; i < inputArray.length; ++i) {
        animationArray[i] = new Bar(-inputArray[i] * 10, STARTX + 50 * i, STARTY, initialColor);
        animationArray[i].draw();
    }

    for (let i = 0; i < inputArray.length-1; i++) {

        let min = i;

        for (let j = i + 1; j < inputArray.length; j++) {
            if (inputArray[j] < inputArray[min])
               { min = j; }
        }
        //console.log(inputArray[min],inputArray[i]);
        first.push(i);
        second.push(min);
        [inputArray[i], inputArray[min]] = [inputArray[min], inputArray[i]];
    }
}

request=null;
function traverse(temp){
    timer = setInterval(function(){
        c.clearRect(0, 0, canvas.width, canvas.height);
        animationArray[temp].color=colorDuringSwappingAndSearching;
        animationArray[traverseIndex-1].color=colorDuringSwappingAndSearching;
        for (let i = 0; i < animationArray.length;i++) {
            animationArray[i].draw();
        }
        animationArray[temp].color=initialColor;
        temp+=1;
        request=null;
        console.log(temp,animationArray.length);
        if(temp == animationArray.length)
            {clearInterval(timer);
            firstBar = first[index];
            secondBar = second[index];
            finalDestinationFirstBar = animationArray[secondBar].x;
            finalDestinationSecondBar = animationArray[firstBar].x;
            animationArray[firstBar].color = colorDuringSwappingAndSearching;
            animationArray[secondBar].color = colorDuringSwappingAndSearching;
         animate();}      
        }, (traverseSpeed*1000));
}

$("#slider").change(function(){
    speed=Number($(this).val());
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
    clearInterval(timer);
    traverse(traverseIndex);
})

// animation of swapping bars is produced by this function
function animate() {
    request = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    // changing x-coordinates of first bar until it reaches the position occupied by second bar
    // and vice-versa for second bar
    //console.log(speed);
    if (animationArray[firstBar].x < finalDestinationFirstBar || animationArray[secondBar].x > finalDestinationSecondBar) {
        if (animationArray[firstBar].x < finalDestinationFirstBar) {
            animationArray[firstBar].x += speed;
        }
        if (animationArray[secondBar].x > finalDestinationSecondBar) {
            animationArray[secondBar].x -= speed;
        }
    }
    else {
        if(index+1>=first.length)
            {console.log(animationArray,index);
             cancelAnimationFrame(request);
             [animationArray[first[index]], animationArray[second[index]]] = [animationArray[second[index]], animationArray[first[index]]];
             lastColor();
              isPlaying = false;
            }
        else {
            cancelAnimationFrame(request);
            [animationArray[first[index]], animationArray[second[index]]] = [animationArray[second[index]], animationArray[first[index]]];
            animationArray[first[index]].color = finalColor;
           // console.log(animationArray[first[index]]);
            if(first[index]!=second[index]){
            animationArray[second[index]].color = initialColor;
            }
            index = index +1;
            traverse(traverseIndex);
            traverseIndex+=1;
        }
    }

    for (let i = 0; i < animationArray.length;i++) {
                animationArray[i].draw();
    }

    // drawing the two bars being swapped after the others so that they appear over them
        if(index+1 < first.length) {
            animationArray[firstBar].draw();
            animationArray[firstBar].drawBorder();
            animationArray[secondBar].draw();
            animationArray[secondBar].drawBorder();
        }
}
function isSorted(){
    for(var i=0;i<first.length;i++)
        {if(first[i]!=second[i])
            {return false;}
        }
    return true
};
$('#start').click(function(){
        if($(this).html()=="Replay")
            {   $(this).html("Start");
                if(isPlaying==true){
                    if(request != null){
                        cancelAnimationFrame(request);
                    }
                    else
                    {clearInterval(timer);}
                }
                if($('#input').val())
                    {SelectionSort($('#input').val().split(",").map(Number));}
                else {SelectionSort([6, 2, 4, 8, 5, 1, 10, 56, 34, 33, 22, 17]);}

            }  
        else if(isPlaying == false) {
            $(this).html("Replay");
            console.log(first,second);
            if(isSorted()){
                lastColor();
                c.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < animationArray.length; ++i) {
                    animationArray[i].draw();
                }
                }
            else{
                isPlaying = true;
                traverse(traverseIndex);
                traverseIndex+=1;
             }
        }       
})

$('#stop').click(function(){
        if(isPlaying == true)
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
                {traverse(traverseIndex);}
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
                {cancelAnimationFrame(request);
                }
            SelectionSort($('#input').val().split(",").map(Number));
        }
   })
$('#reset').click(function(){
    speed=1;
    $("#slider").val(speed);
   })
SelectionSort([6, 2, 4, 8, 5, 1, 10, 56, 34, 33, 22, 17]);
