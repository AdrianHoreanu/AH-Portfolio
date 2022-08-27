/*
Adrian Horeanu Final Project - Sept 2022
*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;

var game_score;

var flagpole;
var lives;

var platforms;
var enemies;


//Sounds
var jumpSound;
var youWillDie;
var fallSound;
var explosionDeath;
var lmusic;
var failsound;
var winSound;

//variables for repeating sounds once+genreation of certain ammont of emenies at edges+text timings
var lm = 0;
var fs = 0;
var yWDR = 0;
var yWDL = 0;
var deathCounterL = 0;
var deathCounterR = 0;
var fallCounter = 0;
var presskeystart = 0;
var win = true;

//Image variables
var dogn;

function preload()
{
    soundFormats("mp3","wav");
    
    jumpSound = loadSound("Sounds/jump.wav");
    jumpSound.setVolume(0.1);
    
    youWillDie = loadSound("Sounds/youwilldie.wav");
    youWillDie.setVolume(0.1);
    
    fallSound = loadSound("Sounds/falldeath.mp3");
    fallSound.setVolume(0.1);
    
    explosionDeath = loadSound("Sounds/explosiondeath.mp3");
    explosionDeath.setVolume(0.1);
    
    lmusic = loadSound("Sounds/levelmusic.mp3");
    lmusic.setVolume(0.1);
    
    failsound = loadSound("Sounds/fsound.mp3");
    failsound.setVolume(0.5);
    
    winSound = loadSound("Sounds/win.wav");
    winSound.setVolume(0.5); 
    
    dogn = loadImage("Images/dognose.jpg")
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 4/5;
    lives = 3;
    startGame();    
    mousePressed();
}


function draw()
{       
    background(50, 80, 80);
    noStroke();
    
    fill(50, 0, 0);
    stroke(1);
    strokeWeight(1);
	rect(0, floorPos_y, width, height/4);
    
    noStroke();
    
    fill(100,20,20);
    rect(0,floorPos_y,width,height/20);
    
    fill(25,0,0);
    rect(0,floorPos_y+height/11,width,height);
    
    fill(0);
    rect(0,floorPos_y+height/7,width,height);
    
    push();   
    translate(scrollPos,0);
    
    drawClouds();
	drawMountains();
	drawTrees();
	renderFlagpole();
    
    for (var i=0; i<platforms.length;i++)
        {
            platforms[i].drawP();
        }
    
    for (var i = 0; i < canyons.length; i++)
        {
            drawCanyon(canyons[i]);
        }
	
    for (var i = 0; i < collectables.length; i++)
        {
            if(collectables[i].isFound == false)
            {
                drawCollectable(collectables[i]);
                checkCollectable(collectables[i]);
            }
        }
    
	for (var i = 0; i < enemies.length; i++)
        {
            enemies[i].drawE();
            
            var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
            
            if (isContact)
                {                    
                    lives -= 1;
                    yWDR = 0;
                    yWDL = 0;
                    fallCounter = 0;
                    deathCounterL = 0;
                    deathCounterR = 0;
                    explosionDeath.play();
                    
                    if(lives => 0)
                        {
                            lmusic.stop();
                            lmusic.loop();
                            startGame();
                            break;
                        }
                }
        }
    
    pop();
    
    drawNewChar();
        
    textSize(20);
    fill(255);
    text("Score: " + game_score, 20, 20);
    text("Lives: " + lives, 20, 40);
        
	if(isLeft)
	{
		if(gameChar_x > width * 0.45)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.55)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5;
		}
	}

	if (gameChar_y < floorPos_y)
        {
            var isContact = false;
            for (var i=0; i < platforms.length; i++)
                {
                    if(platforms[i].checkContact(gameChar_world_x,gameChar_y))
                       {
                            isContact = true;
                            isFalling = false;
                            break;
                       }
                }
            if (!isContact)
                {
                    gameChar_y +=3;
                    isFalling = true;
                }
        }
        else
        {
            isFalling = false;
        }
    
    for (var i = 0; i < canyons.length; i++)
        {
            checkCanyon(canyons[i]);        
        }
    if (isPlummeting == true)
        {
            if(fallCounter==0)
                {
                    fallSound.play();
                }
            gameChar_y +=10;
            fallCounter+=1;
        }
    
	gameChar_world_x = gameChar_x - scrollPos;

    if (flagpole.isReached == false)
        {
            checkFlagpole();
        }
    else if(game_score==collectables.length
            &&dist(gameChar_world_x,gameChar_y,flagpole.x_pos,floorPos_y)<20
            &&checkFlagpole)
            {
                fill(0,255,255);
                textSize(30);
                strokeWeight(2);
                text("LEVEL PASSED!", width/2-150, height/2-150);
                text("Press space to start again!", width/2-200, height/2-190);
                if(win)
                    {
                        winSound.play();
                        win=false;
                    }                
                if (key==" ")
                    {
                        lives=3;
                        yWDR = 0;
                        yWDL = 0;
                        fallCounter = 0;
                        deathCounterL = 0;
                        deathCounterR = 0;
                        lmusic.stop();
                        lmusic.loop();
                        startGame();                       
                    }
                isLeft=false;
                isRight=false;
                isFalling=true;
            }
        else if (dist(gameChar_world_x,gameChar_y,flagpole.x_pos,floorPos_y)<100
                 &&game_score!=collectables.length)
        {
                fill(0,255,255);
                textSize(30);
                var lefttoget = collectables.length-game_score;
                text("Collect " + String(lefttoget) + " token(s) more to win!", width/2-175, height/2-100);

        }
//create multiple enemies left and right
    if(gameChar_world_x<-775&&yWDL==0)
        {
            youWillDie.play();
            yWDL+=1;
        }
    if(gameChar_world_x>flagpole.x_pos+150&&yWDR==0)
        {
            youWillDie.play();
            yWDR+=1;
        }
    if(gameChar_world_x<-775||gameChar_world_x>flagpole.x_pos+250)
        {
            fill(255,0,0);
            textSize(30);
            text("Go back or you DIE!", width/2-150, height/2-100);            
        }
    if (gameChar_world_x<-1000 && deathCounterL<10)
        {
            enemies.push(new Enemy(gameChar_world_x-random(500,800), floorPos_y-20, random(200,350)));
            deathCounterL+=1;
        }
    else if (gameChar_world_x>flagpole.x_pos+150 && deathCounterR<10)
       {
            enemies.push(new Enemy(gameChar_world_x+random(500,800), floorPos_y-20, random(200,350)));
            deathCounterR+=1;
        }
    
    checkPlayerDie();
    
    if (lives<=0)
        {
            fill(255, 0, 0);
            textSize(30);
            text("GAME OVER!", width/2-75, height/2-150);
            text("Press space to start again!", width/2-155, height/2-190);
            
            if (fs==0)
                {
                    failsound.play();
                    fs+=1;
                }
            
            if (key==" ")
                {
                    fs = 0;
                    lives = 3;
                    startGame();
                }
            gameChar_x = width/2;
            gameChar_y = floorPos_y;
            
            
        }
    
    if (presskeystart == 0)
        {
            fill(0, 255, 0);
            textSize(30);
            text("Press a key to start!", width/2-100, height/2-190);
            text("WAD/space/directional keys",width/2-170, height/2-150);
            text("Explore to your left and to your right!",width/2-220, height/2-110);
            if (isLeft||isRight||isFalling)
                {
                    presskeystart +=1;
                }
            
        }
    
}

function keyPressed()
{
    if(lm == 0)
        {
            lmusic.loop();
            lm = lm+1;
        }
        
    if (key == "A" || keyCode == 37)
    {
        if (lives>0 && win)
            {
                isLeft = true;
            }
        else
            {
                isLeft = false;
            }      
    }
    if(key == "D"||keyCode == 39)
    {
        if (lives>0 && win)
            {
                isRight = true;
            }
        else
            {
                isRight = false;
            }
    }
    if (key == " " || key == "W"||keyCode == 38)
    {
        if(!isFalling
           &&!isPlummeting
           &&lives>0
           &&game_score<=collectables.length)
            {               
                gameChar_y -=100;
                if(lives>0)
                    {
                        jumpSound.play();
                    }
            }
    }
    return(key);
}

function keyReleased()
{
    if (key =="A" || keyCode == 37)
    {
        isLeft = false;
    }
    if(key == "D" || keyCode == 39)
    {
        isRight = false;        
    }
}

function drawNewChar()
{
    
    if(isLeft && isFalling)
        {
            fill(100);
            stroke(1);
            strokeWeight(1);
            rect(gameChar_x-10,gameChar_y-40,20,20,5);
            fill(175);
            rect(gameChar_x-2.5,gameChar_y-20,5,5,5);
            fill(0);
            ellipse(gameChar_x+5,gameChar_y-7.5,15,15);
            fill(100);
            ellipse(gameChar_x+5,gameChar_y-7.5,5,5);
            for(i=0;i<enemies.length;i++)
                {
                    if (isFalling)
                        {
                            fill(0,255,0);
                            ellipse(gameChar_x-4,gameChar_y-30,5,5);   
                        }
                    else if(isPlummeting)
                        {
                            fill(255,0,0);
                            ellipse(gameChar_x-4,gameChar_y-30,5,5);   
                        }
                    else
                        {
                            fill(0,0,255);
                            ellipse(gameChar_x-4,gameChar_y-30,5,5);    
                        }
                }
            fill(175);
            rect(gameChar_x,gameChar_y-40,5,10,5);            
        }
    else if(isRight && isFalling)
        {
            fill(100);
            stroke(1);
            strokeWeight(1);
            rect(gameChar_x-10,gameChar_y-40,20,20,5);
            fill(175);
            rect(gameChar_x-2.5,gameChar_y-20,5,5,5);
            fill(0);
            ellipse(gameChar_x-5,gameChar_y-7.5,15,15);
            fill(100);
            ellipse(gameChar_x-5,gameChar_y-7.5,5,5);
            for(i=0;i<enemies.length;i++)
            
            for(i=0;i<enemies.length;i++)
                {
                    if (isFalling)
                        {
                            fill(0,255,0);
                            ellipse(gameChar_x+4,gameChar_y-30,5,5);    
                        }
                    else if(isPlummeting)
                        {
                            fill(255,0,0);
                            ellipse(gameChar_x+4,gameChar_y-30,5,5);    
                        }
                    else
                        {
                            fill(0,0,255);
                            ellipse(gameChar_x+4,gameChar_y-30,5,5);    
                        }
                }
            fill(175);
            rect(gameChar_x-5,gameChar_y-40,5,10,5); 
        }
    else if(isLeft)
        {
            fill(100);
            stroke(1);
            strokeWeight(1);
            rect(gameChar_x-10,gameChar_y-40,20,20,5);
            fill(175);
            rect(gameChar_x-2.5,gameChar_y-20,5,5,5);
            fill(0);
            ellipse(gameChar_x+5,gameChar_y-7.5,15,15);
            fill(100);
            ellipse(gameChar_x+5,gameChar_y-7.5,5,5);
            for(i=0;i<enemies.length;i++)
                {
                    if (isFalling)
                        {
                            fill(0,255,0);
                            ellipse(gameChar_x-4,gameChar_y-30,5,5);   
                        }
                    else if(isPlummeting)
                        {
                            fill(255,0,0);
                            ellipse(gameChar_x-4,gameChar_y-30,5,5);   
                        }
                    else
                        {
                            fill(0,0,255);
                            ellipse(gameChar_x-4,gameChar_y-30,5,5);    
                        }
                }
            fill(175);
            rect(gameChar_x,gameChar_y-40,5,10,5);            
        }
    else if(isRight)
        {
            fill(100);
            stroke(1);
            strokeWeight(1);
            rect(gameChar_x-10,gameChar_y-40,20,20,5);
            fill(175);
            rect(gameChar_x-2.5,gameChar_y-20,5,5,5);
            fill(0);
            ellipse(gameChar_x-5,gameChar_y-7.5,15,15);
            fill(100);
            ellipse(gameChar_x-5,gameChar_y-7.5,5,5);
            for(i=0;i<enemies.length;i++)
            
            for(i=0;i<enemies.length;i++)
                {
                    if (isFalling)
                        {
                            fill(0,255,0);
                            ellipse(gameChar_x+4,gameChar_y-30,5,5);    
                        }
                    else if(isPlummeting)
                        {
                            fill(255,0,0);
                            ellipse(gameChar_x+4,gameChar_y-30,5,5);    
                        }
                    else
                        {
                            fill(0,0,255);
                            ellipse(gameChar_x+4,gameChar_y-30,5,5);    
                        }
                }
            fill(175);
            rect(gameChar_x-5,gameChar_y-40,5,10,5); 
        }
        else
        {
            fill(100);
            stroke(1);
            strokeWeight(1);
            rect(gameChar_x-10,gameChar_y-40,20,20,5);
            fill(175);
            rect(gameChar_x-2.5,gameChar_y-20,5,5,5);
            fill(0);
            rect(gameChar_x-5,gameChar_y-15,10,15,5);
            for(i=0;i<enemies.length;i++)
                {
                    if (isFalling)
                        {
                            fill(0,255,0);
                            ellipse(gameChar_x-4,gameChar_y-30,5,5);   ellipse(gameChar_x+4,gameChar_y-30,5,5);    
                        }
                    else if(isPlummeting)
                        {
                            fill(255,0,0);
                            ellipse(gameChar_x-4,gameChar_y-30,5,5);   ellipse(gameChar_x+4,gameChar_y-30,5,5);    
                        }
                    else
                        {
                            fill(0,0,255);
                            ellipse(gameChar_x-4,gameChar_y-30,5,5);   ellipse(gameChar_x+4,gameChar_y-30,5,5);    
                        }
                }
            fill(175);
            rect(gameChar_x-15,gameChar_y-40,5,10,5);
            rect(gameChar_x+10,gameChar_y-40,5,10,5);
        }
                
}


function drawClouds()
{
    for (var i = 0; i < clouds.length; i++)
        {
            stroke(0);
            strokeWeight(1);
            fill(208, 236, 253); 
            ellipse(clouds[i].x_pos - 55, clouds[i].y_pos, 50, 50);
            ellipse(clouds[i].x_pos, clouds[i].y_pos+10, 75, 75);
            ellipse(clouds[i].x_pos-30, clouds[i].y_pos, 65, 65);
            ellipse(clouds[i].x_pos + 30, clouds[i].y_pos, 45, 45); 
        }
}


function drawMountains()
{
    for (var i = 0; i < mountains.length; i++)
    {
        
        fill(91, 71, 110);
        strokeWeight(1);
        stroke(0);
        triangle(mountains[i].x_pos+100, mountains[i].y_pos,
                 mountains[i].x_pos+450, mountains[i].y_pos,
                 mountains[i].x_pos+250, mountains[i].y_pos-320);
        
        fill(231, 241, 255);
        strokeWeight(1);
        beginShape();
            vertex(mountains[i].x_pos+173+20, mountains[i].y_pos-200);
            vertex(mountains[i].x_pos+250, mountains[i].y_pos-320);
            vertex(mountains[i].x_pos+350, mountains[i].y_pos-160);
            vertex(mountains[i].x_pos+275, mountains[i].y_pos-225);
            vertex(mountains[i].x_pos+255, mountains[i].y_pos-200);
            vertex(mountains[i].x_pos+235, mountains[i].y_pos-235);
        endShape(CLOSE);
        
        fill(174, 139, 222);
        strokeWeight(1);
        stroke(0);
        triangle(mountains[i].x_pos, mountains[i].y_pos,
                 mountains[i].x_pos+350, mountains[i].y_pos,
                 mountains[i].x_pos+150, mountains[i].y_pos-282);
        
        fill(231, 241, 255);
        strokeWeight(1);
        beginShape();
            vertex(mountains[i].x_pos+73, mountains[i].y_pos-140);
            vertex(mountains[i].x_pos+150, mountains[i].y_pos-282);
            vertex(mountains[i].x_pos+245, mountains[i].y_pos-150);
            vertex(mountains[i].x_pos+200, mountains[i].y_pos-180);
            vertex(mountains[i].x_pos+175, mountains[i].y_pos-140);
            vertex(mountains[i].x_pos+135, mountains[i].y_pos-190);
        endShape(CLOSE);
                
    }
}

function drawTrees()
{
   for (var i = 0; i < trees_x.length; i++)
        {
            stroke(130, 52, 52);
            strokeWeight(10);
            line (trees_x[i]-10,floorPos_y-100,trees_x[i]-25,floorPos_y-125);
            line (trees_x[i]+10,floorPos_y-100,trees_x[i]+25,floorPos_y-125);
            
            stroke(192, 101, 57);
            line (trees_x[i]-25,floorPos_y-125,trees_x[i]-25,floorPos_y-140);
            line (trees_x[i]-25,floorPos_y-125,trees_x[i]-40,floorPos_y-140);
            line (trees_x[i]+25,floorPos_y-125,trees_x[i]+10,floorPos_y-145);
            line (trees_x[i]+25,floorPos_y-125,trees_x[i]+35,floorPos_y-140);
            strokeWeight(0);
            
            fill(96,55,55);
            stroke(1);
            strokeWeight(1);
            rect(trees_x[i]-10, floorPos_y-99, 20 , 100, 5);
            
            stroke(0);
            strokeWeight(1);
            fill(96, 217, 96);
            ellipse(trees_x[i]-40, floorPos_y-177,100,75);
            fill(112, 183, 117);
            ellipse(trees_x[i]+30, floorPos_y-177,100,75);
        } 
}


function drawCanyon(t_canyon)
{
    noStroke();
    fill(31,32,34);
    rect(t_canyon.x_pos,floorPos_y,t_canyon.wideness,floorPos_y,5);
    
    fill(0);
    rect(t_canyon.x_pos+10,floorPos_y-1,t_canyon.wideness-20,floorPos_y,5);
    
    fill(255);
    beginShape();
    vertex(t_canyon.x_pos + 15, height);
    
    vertex(t_canyon.x_pos + 15 + (t_canyon.wideness-10)*0.5/6, height - floorPos_y/8);
    
    vertex(t_canyon.x_pos + 15 + (t_canyon.wideness-10)/6, height);
    
    vertex(t_canyon.x_pos + 15 + (t_canyon.wideness-10)*1.5/6, height - floorPos_y/8);
    
    vertex(t_canyon.x_pos + 15 + (t_canyon.wideness-10)*2/6, height);
    
    vertex(t_canyon.x_pos + 15 + (t_canyon.wideness-10)*2.5/6, height - floorPos_y/8);
    
    vertex(t_canyon.x_pos + 15 + (t_canyon.wideness-10)*3/6, height);
    
    vertex(t_canyon.x_pos + 15 + (t_canyon.wideness-10)*3.5/6, height - floorPos_y/8);
    
    vertex(t_canyon.x_pos +  15 + (t_canyon.wideness-10)*4/6, height);
    
    vertex(t_canyon.x_pos +  15 + (t_canyon.wideness-10)*4.5/6, height - floorPos_y/8);
    
    vertex(t_canyon.x_pos + 5 + (t_canyon.wideness-10)*5.5/6, height);
    
    endShape(CLOSE);
    
}

function checkCanyon(t_canyon)
{
    if (gameChar_world_x>t_canyon.x_pos+25 && gameChar_world_x<t_canyon.x_pos+t_canyon.wideness-25 && gameChar_y > floorPos_y - 5) //corrected so char falls in canyon
        {
            isPlummeting = true;
        }    
}

function drawCollectable(t_collectable)
{   
    
    stroke(90,75,0);
    strokeWeight(1);
    
    fill(212, 170, 0);
    ellipse(t_collectable.x_pos, t_collectable.y_pos,
            t_collectable.size, t_collectable.size);
    strokeWeight(0);
    fill(255, 204, 0);
    ellipse(t_collectable.x_pos, t_collectable.y_pos,
            t_collectable.size-10, t_collectable.size-10);
    
    fill(255, 230, 128);
    ellipse(t_collectable.x_pos, t_collectable.y_pos,
            t_collectable.size-20, t_collectable.size-20);
    
    fill(212, 170, 0);
    rect(t_collectable.x_pos-t_collectable.size/8,
         t_collectable.y_pos-t_collectable.size/8,
         t_collectable.size/4,
         t_collectable.size/4);
    
    fill(255, 230, 128);
    ellipse(t_collectable.x_pos, t_collectable.y_pos,
            t_collectable.size-35, t_collectable.size-35);
    
    strokeWeight(0);
    fill(255, 230, 128);
    ellipse(t_collectable.x_pos + 12, t_collectable.y_pos - 12,
            t_collectable.size-35, t_collectable.size-35);

}

function checkCollectable(t_collectable)
{
    if (dist(gameChar_world_x, gameChar_y,t_collectable.x_pos,t_collectable.y_pos)<t_collectable.size)
        {
            t_collectable.isFound = true;
            game_score+=1;
        }
}

function renderFlagpole()
{
    push();
    strokeWeight(10);    
    stroke(255,0,0);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 150);
    stroke(1);
    strokeWeight(1);
    
    if (flagpole.isReached&&game_score==collectables.length&&dist(gameChar_world_x,gameChar_y,flagpole.x_pos,floorPos_y)<30)
    {
        fill(0,0,255,255);
        rect(flagpole.x_pos, floorPos_y-150, 50, 40);
        image(dogn, flagpole.x_pos+7.5, floorPos_y-142.5);
    }
    else
    {   fill(0,0,255);
        rect(flagpole.x_pos,floorPos_y-50, 50, 40);
        image(dogn, flagpole.x_pos+7.5, floorPos_y-42.5);
    }
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x-flagpole.x_pos);
    if (d<15)
        {
            flagpole.isReached =true;
        }
}

function checkPlayerDie ()
{
    if (gameChar_y > height+100)
        {
            lives-=1;
            yWDR = 0;
            yWDL = 0;
            fallCounter = 0;
            deathCounterR = 0;
            deathCounterL = 0;
            lmusic.stop();
            lmusic.loop();
            startGame();
        }
}

function startGame()
{   win = true;
    gameChar_x = width/2;
    gameChar_y = floorPos_y;
        
    scrollPos = 0;
    
    gameChar_world_x = gameChar_x - scrollPos;
    
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    
    jumpDisplace = 0;
   
    trees_x = [-1250, -900, -700, -550,-250, 50, 280, 1130, 1300, 1750, 1985, 2185, 2700, 2900];
    
    clouds = [
        {x_pos: -1750, y_pos: random(35,175)},
        {x_pos: -1600, y_pos: random(35,175)},
        {x_pos: -1450, y_pos: random(35,175)},
        {x_pos: -1300, y_pos: random(35,175)},
        {x_pos: -1100, y_pos: random(35,175)},
        {x_pos: -1000, y_pos: random(35,175)},
        {x_pos: -950, y_pos: random(35,175)},
        {x_pos: -800, y_pos: random(35,175)},
        {x_pos: -700, y_pos: random(35,175)},
        {x_pos: -500, y_pos: random(35,175)},
        {x_pos: -250, y_pos: random(35,175)},
        {x_pos: -100, y_pos: random(35,175)},
        {x_pos: 100, y_pos: random(35,175)},
        {x_pos: 250, y_pos: random(35,175)},
        {x_pos: 500, y_pos: random(35,175)},
        {x_pos: 900, y_pos: random(35,175)},
        {x_pos: 1100, y_pos: random(35,175)},
        {x_pos: 1275, y_pos: random(35,175)},
        {x_pos: 1550, y_pos: random(35,175)},
        {x_pos: 1700, y_pos: random(35,175)},
        {x_pos: 1850, y_pos: random(35,175)},
        {x_pos: 1900, y_pos: random(35,175)},
        {x_pos: 2050, y_pos: random(35,175)},
        {x_pos: 2300, y_pos: random(35,175)},
        {x_pos: 2450, y_pos: random(35,175)},
        {x_pos: 2600, y_pos: random(35,175)},
        {x_pos: 2850, y_pos: random(35,175)},
        {x_pos: 3000, y_pos: random(35,175)},
        {x_pos: 3300, y_pos: random(35,175)},
        {x_pos: 3450, y_pos: random(35,175)},
        {x_pos: 3600, y_pos: random(35,175)},
        {x_pos: 3850, y_pos: random(35,175)},
        {x_pos: 4000, y_pos: random(35,175)}
    ];

    mountains = [
        {x_pos: -1700, y_pos: floorPos_y},
        {x_pos: -1400, y_pos: floorPos_y},
        {x_pos: -800, y_pos: floorPos_y},
        {x_pos: -400, y_pos: floorPos_y},
        {x_pos: 250, y_pos: floorPos_y},
        {x_pos: 1100, y_pos: floorPos_y},
        {x_pos: 1600, y_pos: floorPos_y},
        {x_pos: 2000, y_pos: floorPos_y},
        {x_pos: 2500, y_pos: floorPos_y},
        {x_pos: 3200, y_pos: floorPos_y}
    ];

    canyons = [
        {x_pos: -1150, wideness: 175},
        {x_pos: 100, wideness: 150},
        {x_pos: 850, wideness: 175},
        {x_pos: 1350, wideness: 150},
        {x_pos: 1800, wideness: 175},
        {x_pos: 2000, wideness: 175},
        {x_pos: 2200, wideness: 175},
        {x_pos: 3000, wideness: 175}
    ];

    collectables = [
        {x_pos: -225, y_pos: floorPos_y - 330, size: 40, isFound: false},
        {x_pos: 150, y_pos: floorPos_y - 220, size: 40, isFound: false},
        {x_pos: 75, y_pos: floorPos_y - 20, size: 40, isFound: false},
        {x_pos: 350, y_pos: floorPos_y - 20, size: 40, isFound: false},
        {x_pos: 375, y_pos: floorPos_y - 170, size: 40, isFound: false},
        {x_pos: 900, y_pos: floorPos_y - 170, size: 40, isFound: false},
        {x_pos: 1025, y_pos: floorPos_y - 370, size: 40, isFound: false},
        {x_pos: 1375, y_pos: floorPos_y - 170, size: 40, isFound: false},
        {x_pos: 1500, y_pos: floorPos_y - 20, size: 40, isFound: false},
        {x_pos: 1650, y_pos: floorPos_y - 20, size: 40, isFound: false},
        {x_pos: 1800, y_pos: floorPos_y - 20, size: 40, isFound: false},
        {x_pos: 1985, y_pos: floorPos_y - 20, size: 40, isFound: false},        
        {x_pos: 2185, y_pos: floorPos_y - 20, size: 40, isFound: false}        
    ];

    game_score=0;

    flagpole = {
        isReached: false,
        x_pos: 2500
    };    
    
    platforms=[];
    var platList=[
                {platX: -650, platY: 70, lenght: 75},
                {platX: -550, platY: 130, lenght: 75},
                {platX: -450, platY: 190, lenght: 75},
                {platX: -350, platY: 250, lenght: 75},
                {platX: -250, platY: 310, lenght: 50},
                {platX: -150, platY: 250, lenght: 150},
                {platX: 100, platY: 200, lenght: 100},
                {platX: 350, platY: 150, lenght: 50},
                {platX: 450, platY: 115, lenght: 125},
                {platX: 550, platY: 175, lenght: 50},
                {platX: 550, platY: 250, lenght: 100},
                {platX: 650, platY: 75, lenght: 75},
                {platX: 850, platY: 150, lenght: 100},
                {platX: 1000, platY: 350, lenght: 50},
                {platX: 1000, platY: 200, lenght: 100},
                {platX: 1100, platY: 275, lenght: 100},
                {platX: 1200, platY: 350, lenght: 75},
                {platX: 1350, platY: 150, lenght: 50},
                {platX: 1625, platY: 75, lenght: 50}
                ];
    for (var i=0;i<platList.length;i++)
        {
            platforms.push(createPlatforms(platList[i].platX, floorPos_y-platList[i].platY, platList[i].lenght));
        }
 
    enemies=[];
    var enemiesList=[
                    {enemyX: -825, enemyY: 20, spanEnemy: 250},
                    {enemyX: -525, enemyY: 20, spanEnemy: 250},
                    {enemyX: -175, enemyY: 20, spanEnemy: 250},
                    {enemyX: -125, enemyY: 270, spanEnemy: 100},
                    {enemyX: 475, enemyY: 135, spanEnemy: 75},
                    {enemyX: 1050, enemyY: 20, spanEnemy: 250},
                    {enemyX: 1525, enemyY: 20, spanEnemy: 250}
                    ]; 
 
    for (var i=0;i<enemiesList.length;i++)
        {
            enemies.push(new Enemy(enemiesList[i].enemyX, floorPos_y-enemiesList[i].enemyY, enemiesList[i].spanEnemy));
        }
}

function createPlatforms(x,y,leng)
{
    var p = {
        x: x,
        y: y,
        leng: leng,
        drawP: function ()
        {
            stroke(0);
            strokeWeight(1);
            fill(47, 79, 79);
            rect(this.x,this.y, this.leng, 20, 10);
            strokeWeight(0);
            fill(0,0,0,100);
            rect(this.x+4,this.y+9, this.leng-6, 11, 5);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x>this.x && gc_x<this.x+this.leng)
                {
                    var d=this.y-gc_y;
                    if (d>=0 && d<3)
                        {
                            return true
                        }                    
                }
            return false;
        }
    }
    return p;
}

function Enemy(x,y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.inc = 1;
    
    this.colour = [];
    for (var i=0;i<3;i++)
    {
        this.colour.push(random(0,255));
    }
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if (this.currentX >= this.x + this.range)
            {
                this.inc = -1;            
            }
        else if(this.currentX<this.x)
            {
                this.inc = 1;
            }
    }
    this.drawE = function()
    {
        this.update();
        stroke(1);
        strokeWeight(1);
        fill(this.colour[0],this.colour[1],this.colour[2]);
        rect(this.currentX-20, this.y-20, 40, 20, 5);
        fill(0, 0, 255);
        rect(this.currentX-15, this.y-15, 10, 10, 3);
        rect(this.currentX+5, this.y-15, 10, 10, 3);
        fill(100);
        rect(this.currentX-5, this.y, 10, 5,1);
        rect(this.currentX-15, this.y+5, 30, 3,1);
        fill(90,0,0);
        ellipse(this.currentX-10, this.y+15, 10, 10);
        fill(0);
        ellipse(this.currentX-10, this.y+15, 2, 2);
        fill(90,0,0);
        ellipse(this.currentX+10, this.y+15, 10, 10);
        fill(0);
        ellipse(this.currentX+10, this.y+15, 2, 2);
        
    }
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x,gc_y, this.currentX, this.y);
        
        if (d<125)
            {
                fill(255, 255, 0);
                rect(this.currentX-15, this.y-15, 10, 10, 3);
                rect(this.currentX+5, this.y-15, 10, 10, 3);
            }
        
        if (d<75)
            {
                fill(255, 0, 0);
                rect(this.currentX-15, this.y-15, 10, 10, 3);
                rect(this.currentX+5, this.y-15, 10, 10, 3);
            }
        
        if (d < 30)
            {
                return true;           
            }
        return false;        
    }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
