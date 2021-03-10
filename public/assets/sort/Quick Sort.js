const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');

let finalDestinationFirstBar = null, finalDestinationSecondBar = null;
let firstBar = null, secondBar = null;

const WIDTH = 60, STARTX = 500, STARTY = 300;
const colorWhileSwapping = '#f3ca20', initialColor = '#000', PivotColor = '#f33220' ,colorDuringSwappingAndSearching = '#9f5f80',finalColor = '#ffba93';

let inputArray=[],animationArray = [], first =[],second=[],index=0,isPlaying=false,speed=1;
// event listener to resize the canvas as soon as window is resized
window.addEventListener('resize', (event) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// class defined to construct bars representing numbers
class Box {
    constructor(x, y, color, text) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.text = text;
    }

    // draws the bar, text and shadow effects
    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, WIDTH, -WIDTH);

        c.fillStyle = "#fff";

        c.fillText(this.text, this.x + 20, this.y - 20);
        c.font = '30px Calibri';

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

function lastColor(low,high){
		console.log(low,high);
        for (let i = 0; i < animationArray.length; ++i) {
        	if(i>=low && i<high)
            	{	if(animationArray[i].color==PivotColor || animationArray[i].color==finalColor)
            			{animationArray[i].color=finalColor;}
            		else{
            		animationArray[i].color = colorWhileSwapping;}
            	}
            else
            	{if(animationArray[i].color==PivotColor || animationArray[i].color==finalColor)
            			{animationArray[i].color=finalColor;}
            		else{
            	animationArray[i].color = initialColor;}
            }
        }
        animationArray[high].color = PivotColor;

        for (box of animationArray)
            box.draw();
}
//algorithm for Insertion sort
const partition = (low, high)  => {  
    
    var pivot_value = inputArray[high];
    pivot = high;
    var i = (low - 1); // Index of smaller element  

    for (var j = low; j <= high - 1; j++)  
    {  
        if (inputArray[j] < pivot_value)  
        {  
            i++; 
            [inputArray[j] , inputArray[i]] = [inputArray[i], inputArray[j]];
            first.push([i,low]);
            second.push([j,high]);

        }  
    }
    

    [inputArray[i + 1], inputArray[high]] = [inputArray[high],inputArray[i+1]];
    first.push([i+1,low]);
    second.push([high,high]);
    
    return i+1;    
}

const QuickSortHelper = (leftIndex, rightIndex) => {

    if (rightIndex > leftIndex) {
        const pi = partition(leftIndex ,rightIndex);
        console.log(inputArray[pi]);
        QuickSortHelper(leftIndex, pi - 1);  
        QuickSortHelper(pi + 1, rightIndex);  
    }
}

function QuickSort(input){
	c.clearRect(0, 0, canvas.width, canvas.height);
	$("#slider").val(speed);
	inputArray=input;
	$("#stop").html("Stop")
    animationArray = [], first =[],second=[],index=0,isPlaying=false;
    for (let i = 0; i < inputArray.length; ++i) {
        animationArray[i] = new Box(STARTX + 100 * i, STARTY, initialColor, inputArray[i]);
        animationArray[i].draw();
    }
    console.log(animationArray);

    QuickSortHelper(0, inputArray.length - 1);
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
        	 [animationArray[first[index][0]], animationArray[second[index][0]]] = [animationArray[second[index][0]], animationArray[first[index][0]]];
        	  for (let i = 0; i < animationArray.length; ++i) {
        	   animationArray[i].color = finalColor;
        	  }
              isPlaying = false;
        	}
        else {
        	cancelAnimationFrame(request);
        	[animationArray[first[index][0]], animationArray[second[index][0]]] = [animationArray[second[index][0]], animationArray[first[index][0]]];
	        index = index +1;
	        firstBar = first[index][0];
	        secondBar = second[index][0];
	        finalDestinationFirstBar = animationArray[secondBar].x;
	        finalDestinationSecondBar = animationArray[firstBar].x;
	        lastColor(first[index][1],second[index][1]);
	        animationArray[firstBar].color = colorDuringSwappingAndSearching;
	        if(second[index][1]!=secondBar){
	        animationArray[secondBar].color = colorDuringSwappingAndSearching;}
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
	    			{QuickSort($('#input').val().split(",").map(Number));}
	    		else {QuickSort([5, 11, 10, 17, 3, 14, 12, 8]);}

	    	}  
	    else if(isPlaying == false) {
	    	$(this).html("Replay");
	    	if(first.length ==0){
	    		lastColor(first[index][1],second[index][1]);
	    		c.clearRect(0, 0, canvas.width, canvas.height);
	    		for (let i = 0; i < animationArray.length; ++i) {
	    			animationArray[i].draw();
	    		}
	    		}
	    	else{
				isPlaying = true;
				firstBar = first[index][0];
			    secondBar = second[index][0];
			    console.log(first,second);
			    lastColor(first[index][1],second[index][1]);
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
		    QuickSort($('#input').val().split(",").map(Number));
		}
   })
$('#reset').click(function(){
	speed=1;
	$("#slider").val(speed);
   })

QuickSort([5, 11, 10, 17, 3, 14, 12, 8]);