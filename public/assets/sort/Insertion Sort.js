const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');

let finalDestinationFirstBar = null, finalDestinationSecondBar = null;
let firstBar = null, secondBar = null;

const WIDTH = 40, STARTX = 500, STARTY = 600;
const colorDuringSwappingAndSearching = '#9f5f80', initialColor = '#ff8e71', finalColor = '#ffba93';

let inputArray=[],animationArray = [], first =[],second=[],index=0,isPlaying=false,speed=1;
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
//algorithm for Insertion sort
function InsertionSort(input) {
	c.clearRect(0, 0, canvas.width, canvas.height);
	$("#slider").val(speed);
	inputArray=input;
	$("#stop").html("Stop")
    animationArray = [], first =[],second=[],index=0,isPlaying=false;
    for (let i = 0; i < inputArray.length; ++i) {
        animationArray[i] = new Bar(-inputArray[i] * 10, STARTX + 50 * i, STARTY, initialColor);
        animationArray[i].draw();
    }

	for (let i = 0; i < inputArray.length; ++i) {
	        let key = inputArray[i];
	        let j = i - 1;
	        while (j >= 0 && inputArray[j] > key) 
	        {  
	            inputArray[j + 1] = inputArray[j];
	            first.push(j);
	            second.push(j+1);
	            j = j - 1;
	        }  
	        inputArray[j + 1] = key;  
	}
}

$("#slider").change(function(){
	speed=Number($(this).val());
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
        	{cancelAnimationFrame(request);
        	 [animationArray[first[index]], animationArray[second[index]]] = [animationArray[second[index]], animationArray[first[index]]];
        	  lastColor();
              isPlaying = false;
        	}
        else {
        	cancelAnimationFrame(request);
        	[animationArray[first[index]], animationArray[second[index]]] = [animationArray[second[index]], animationArray[first[index]]];
	    	animationArray[first[index]].color = initialColor;
	    	animationArray[second[index]].color = initialColor;
	    	lastColor();
	        index = index +1;
	        firstBar = first[index];
	        secondBar = second[index];
	        finalDestinationFirstBar = animationArray[secondBar].x;
	        finalDestinationSecondBar = animationArray[firstBar].x;
	        animationArray[firstBar].color = colorDuringSwappingAndSearching;
	        animationArray[secondBar].color = colorDuringSwappingAndSearching;
	        animate();
	    }
    }

    for (let i = 0; i < animationArray.length; ++i) {
    	if(index+1 < first.length){
	        if (i !== firstBar && i !== secondBar) {
	            animationArray[i].draw();
	        }
	    }
	    else
	    	{
	    		animationArray[i].draw();
	    	}
    }

    // drawing the two bars being swapped after the others so that they appear over them
        if(index+1 < first.length) {
	        animationArray[firstBar].draw();
	    	animationArray[firstBar].drawBorder();
	    	animationArray[secondBar].draw();
	    	animationArray[secondBar].drawBorder();
	    }
}

$('#start').click(function(){
	    if($(this).html()=="Replay")
	    	{	$(this).html("Start");
	    		if(isPlaying==true){
	    			cancelAnimationFrame(request);
	    		}
	    		if($('#input').val())
	    			{InsertionSort($('#input').val().split(",").map(Number));}
	    		else {InsertionSort([10, 35, 15, 5, 50, 45, 40, 30, 25, 20, 8]);}

	    	}  
	    else if(isPlaying == false) {
	    	$(this).html("Replay");
	    	if(first.length ==0){
	    		lastColor();
	    		c.clearRect(0, 0, canvas.width, canvas.height);
	    		for (let i = 0; i < animationArray.length; ++i) {
	    			animationArray[i].draw();
	    		}
	    		}
	    	else{
				isPlaying = true;
				firstBar = first[index];
			    secondBar = second[index];
			    finalDestinationFirstBar = animationArray[secondBar].x;
			    finalDestinationSecondBar = animationArray[firstBar].x;
			    animationArray[firstBar].color = colorDuringSwappingAndSearching;
			    animationArray[secondBar].color = colorDuringSwappingAndSearching;
			   	animate();
			 }
    	}  		
})

$('#stop').click(function(){
   	    if(isPlaying == true)
          {cancelAnimationFrame(request);
           $(this).html("Play"); 
           isPlaying = false;
           }
        else
          { if($(this).html()=="Play"){
		       requestAnimationFrame(animate);
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
		    InsertionSort($('#input').val().split(",").map(Number));
		}
   })
$('#reset').click(function(){
	speed=1;
	$("#slider").val(speed);
   })
InsertionSort([10, 35, 15, 5, 50, 45, 40, 30, 25, 20, 8])