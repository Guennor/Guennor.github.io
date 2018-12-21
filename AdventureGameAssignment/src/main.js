( function() {
   
var entireString = "";
var playerInput;
var disgustGifs = ["images/cry.gif","images/eyes.gif","images/frown.gif","images/ms.gif","images/no.gif","images/stopit.webp","images/dontlike.gif"];
var rooms =
["wall","wall","wall","wall","wall",

"wall","potion","sword","boss","wall",

"wall","wall","slime","wall","wall",

"wall","map","intersection","key","wall",

"wall","wall","jammed","wall","wall",

"wall","wall","start","wall","wall",

"wall","wall","bosskey","wall","wall",

"wall","wall","wall","wall","wall"];

//Status
var inCombat = false;

var hero= 
    {
        maxHealth: 20,
        health:20,
        minAtk:1,
        maxAtk:3,
        
        die: function()
    {
        console.log("You are dead!")
    },
        getAtk: function()
        {
            return Math.floor(Math.random() * (hero.maxAtk - hero.minAtk + 1)) + hero.minAtk;
        },
        increaseHealth: function(amount)
        {
            this.health+=amount; 
        },
        takeHit: function(howMuch)
        {
            this.health -=howMuch;
            UpdateText("You were hit for "+ howMuch + " damage. Current health: " + this.health + "/" + this.maxHealth);
                if(this.health<=0)
                {
                    this.health=0;
                    Die();
                }
            if(this.health <0)
            {
            this.health = 0;
            die();
            }
        }
        /**** add the die function here ****/
        
        
    };//hero

    var monster= 
    {
        type:"",
        health:0,
        maxHP:0,
        minAtk:0,
        maxAtk:0,

        die: function()
    {
        if(this.type == "slime")
            {
                inCombat = false;
                slimeDefeated = true;
                updateAmount = 1;
                UpdateText("<p style='color:green'>You defeat the slime. Health maxed out!</p>")
            }
        if(this.type == "dragon")
            {
                dragonDefeated = true;
            }
    },
        increaseHealth: function()
        {
            this.health+=5; 
            console.log("increaseHealth() was called on "+this.name+"... and health is now: "+this.health);
        },
        takeHit: function(howMuch)
        {
            this.health -=howMuch;
                if(this.health<=0)
                {
                    this.health=0;
                    this.die();
                }
        }
        /**** add the die function here ****/
        
        
    };//monster
    
    var slimeBoi = Object.create(monster);
    slimeBoi.type = "slime";
    slimeBoi.maxHP = 20;
    slimeBoi.health = 20;
    slimeBoi.minAtk = 1;
    slimeBoi.maxAtk = 3;
    
    
//Combat
var blocking = false;
var dodging = false;
var takeCrit = false;
    
//progression locks
var areVinesCut = false;
var jammedDoorBroken = false;
var jammedDoorHP = 5;
var passwordDoorOpened = false;
var silverDoorOpened = false;
var slimeDefeated = false;
var goldenRoomOpened = false;
var dragonDefeated = false;
    
//items
var silverKey = false;
var map = false;
var goldKey = false;
var sword = false;
var potion = false;
var potionsLeft = 1;
    
    var updateAmount = 3000;

    var count = 0;
    
var mapDiv = document.querySelector("#map");
var mapRoom = document.querySelector("#mp"); 
var intersectionRoom = document.querySelector("#int");
 var jammedDoorRoom = document.querySelector("#jm");
var startRoom = document.querySelector("#str");
var potionRoom = document.querySelector("#ptn");
 var swordRoom = document.querySelector("#srd");
 var bossRoom = document.querySelector("#bss");
 var monsterRoom = document.querySelector("#mst");
 var monsterRoom = document.querySelector("#mst");
 var silverKeyRoom = document.querySelector("#svr");
 var goldenKeyRoom = document.querySelector("#gdr");
    
var currentRoomNumber = 27;

var output=document.querySelector("#output");
var input =document.querySelector("#guessbox");
var gif =document.querySelector("#imgg");
var button=document.querySelector("#submit");
button.addEventListener("click",onGuessSubmit,false);
    
window.addEventListener("keydown",onEnterPressed,false);

    var spriteObject=
        {
            IMGSRC:"images/slime_sheet.png",
            stateArray:["idle","prepare","attack","dmg"],
            //Define the X,Y position of the source sprite image and its width & height
            sourceX: 0,
            sourceY:0,
            isForward:true,

            x: 150 - 32,
            y: 150 - 32,
            
            SIZE:64, //size of each frame cell
            numOfFrames: 3, //Number of animation frames
            currentFrame:0,     //The current/starting frame
            
            updateAnimation: function()
            { 
                var chanceToDodge = (Math.random() * 50);
                var dodgeAttempt = (Math.random()*100);
                this.currentFrame = count;
                this.sourceX = this.currentFrame * this.SIZE;
               
                if(currentRoomNumber == 12 && !slimeDefeated){ 
                if(this.currentFrame == 0)
                    {
                         UpdateText("The slime is idling. Now is your chance!") 
                    }
                else if(this.currentFrame == 1)
                    {
                        var ease = "";
                        if(chanceToDodge <= 20)
                        {
                            ease = "high";
                        }else{
                            ease = "medium";
                        }
                         UpdateText("The slime is preparing to attack. You have a " + ease + " chance of dodging."); 
                    }
                else if(this.currentFrame == 2)
                    {
                        if(!takeCrit){
                        if(dodging)
                            {
                                if(dodgeAttempt <= chanceToDodge)
                                    {
                                        UpdateText("<p style='color:green'>You successfully dodge the attack!</p>");
                                    }else{
                                        var damage = (Math.floor(Math.random() * slimeBoi.maxAtk) + slimeBoi.minAtk) + 3;
                                        UpdateText("<p style='color:red'>You fail to dodge. The slime attacks you for a terrible amount of " + damage + " damage.</p>");
                                        hero.takeHit(damage);
                                    }
                                dodging = false;
                                blocking = false;
                            }else{
                        
                        if(!blocking)
                            {
                        var damage = (Math.floor(Math.random() * slimeBoi.maxAtk) + slimeBoi.minAtk);
                         UpdateText("<p style='color:red'>The slime attacks you for " + damage + " damage.</p>");
                        hero.takeHit(damage);
                                
                            }else{
                        var damage = (Math.floor(Math.random() * slimeBoi.maxAtk) + slimeBoi.minAtk);
                         UpdateText("<p style='color:orange'>You block the slime's attack and get hit only by " + Math.floor(damage/2) + " damage.</p>");
                        hero.takeHit(damage);
                                blocking = false;
                                dodging = false;
                            }
                    }
                        }//takecrit
                        else{
                             var damage = (Math.floor(Math.random() * slimeBoi.maxAtk) + slimeBoi.minAtk);
                            damage = damage*2;
                            UpdateText("<p style='color:red'>Due to your stumble, the slime attacks you for double damage! " + damage + " damage taken!</p>");
                           
                        hero.takeHit(Math.floor(damage));
                        UpdateText("Your HP: " + hero.health + "/" + hero.maxHealth);
                            blocking = false;
                            dodging = false;
                            takeCrit = false;
                        }       
                    }
                }
            },
        };
    
    var canvas = document.getElementById("cvs");
    var drawingSurface = canvas.getContext("2d");
    
    var image =new Image();
    image.addEventListener("load", loadHandler, false);
    image.src = spriteObject.IMGSRC;
        
    startGame();

function startGame()
{
    canvas.style.visibility = "hidden";
   console.log("Game Started.")
    console.log("Current room: " + rooms[currentRoomNumber] + ", " + currentRoomNumber)
    renderMap();
    
}

       function loadHandler()
    {
        //update();

        setInterval(update,updateAmount);
            
    }
    
    function update()
    {

        if(!slimeDefeated && currentRoomNumber == 12){
          //  console.log("slime defeated = " + slimeDefeated + " | currentRoom = " + currentRoomNumber + ", updating slime anim");
        count++;
        if(count >= 3)
        {
        count = 0;
        }
        spriteObject.updateAnimation(); //update the monster's animation frames  
        }else{
              //  console.log("slime defeated = " + slimeDefeated + " | currentRoom = " + currentRoomNumber);
            //    console.log("Slime defeated so changing frame");
                count = 3;
                spriteObject.currentFrame = 3;
                spriteObject.sourceX = this.currentFrame * this.SIZE;
                spriteObject.updateAnimation();
        }
        // console.log("slime defeated = " + slimeDefeated + " | currentRoom = " + currentRoomNumber);
        //console.log("rendering");
        render(); //render the animation
        
    }
    
    function render()
    {
        //clear anything drawn on the canvas previously before drawing again
        drawingSurface.clearRect(0,0, canvas.width, canvas.height);
        
        drawingSurface.drawImage(
        image,
        spriteObject.sourceX, spriteObject.sourceY, spriteObject.SIZE, spriteObject.SIZE,//source image
        0,0,canvas.width,canvas.height  //destination -- draw at 0,0 of the canvas with a X,Y dimension of the canvas
        );
    }
    

function renderMap(){
    if(!potion){potionRoom.src = "images/w_rightpotion.png";}else
    {potionRoom.src = "images/w_right.png";}
    
    if(!sword){swordRoom.src = "images/w_tsword.png"}else
    {swordRoom.src = "images/w_t.png";}
    
    if(!dragonDefeated){bossRoom.src = "images/w_leftboss.png"}else
    {bossRoom.src = "images/w_left.png";}
    
    if(!slimeDefeated){monsterRoom.src = "images/w_updownmonster.png"}else
    {bossRoom.src = "images/w_updown.png";}
    
    if(!silverKey){silverKeyRoom.src = "images/w_leftkey.png"}else
    {silverKeyRoom.src = "images/w_left.png";}
    
     if(!goldenKeyRoom){goldenKeyRoom.src = "images/w_upkey.png"}else
    {goldenKeyRoom.src = "images/w_up.png";}

    potionRoom.style= "border-color:white;border-style:double;border-width:5px";
    swordRoom.style= "border-color:white;border-style:double;border-width:5px";
    bossRoom.style="border-color:white;border-style:double;border-width:5px";
    monsterRoom.style="border-color:white;border-style:double;border-width:5px";
    mapRoom.style="border-color:white;border-style:double;border-width:5px";
    intersectionRoom.style="border-color:white;border-style:double;border-width:5px";
    silverKeyRoom.style="border-color:white;border-style:double;border-width:5px";
    jammedDoorRoom.style="border-color:white;border-style:double;border-width:5px";
    startRoom.style="border-color:white;border-style:double;border-width:5px";
    goldenKeyRoom.style="border-color:white;border-style:double;border-width:5px";
    
    if(currentRoomNumber ==6){potionRoom.style="border-color:red;border-style:double;border-width:5px";}
    if(currentRoomNumber ==7){swordRoom.style="border-color:red;border-style:double;border-width:5px";}
    if(currentRoomNumber ==8){bossRoom.style="border-color:red;border-style:double;border-width:5px";}
    if(currentRoomNumber ==12){monsterRoom.style="border-color:red;border-style:double;border-width:5px";}
    if(currentRoomNumber ==16){mapRoom.style="border-color:red;border-style:double;border-width:5px";}
    if(currentRoomNumber ==17){intersectionRoom.style="border-color:red;border-style:double;border-width:5px";}
    if(currentRoomNumber ==18){silverKeyRoom.style="border-color:red;border-style:double;border-width:5px";}
    if(currentRoomNumber ==22){jammedDoorRoom.style="border-color:red;border-style:double;border-width:5px";}
    if(currentRoomNumber ==27){startRoom.style="border-color:red;border-style:double;border-width:5px";}
    if(currentRoomNumber ==32){goldenKeyRoom.style="border-color:red;border-style:double;border-width:5px";}
    
    if(map)
    {
    console.log("has map. showing map.")
    mapDiv.style.display = "block"; 
    }
    else if(!map) 
    {
    console.log("doesnt have map. not showing map")
    mapDiv.style.display = "none";
}
}

function onEnterPressed()
{
    if(event.keyCode==13)
        checkInput();
    renderMap();
}
    
function onGuessSubmit()
{
    checkInput();
    renderMap();
}

function Die()
{
    console.log("____________________________________________");
    console.log("Game over. Resetting variables.");
    console.log("____________________________________________");
    //Combat
blocking = false;
dodging = false;
takeCrit = false;
    
//progression locks
areVinesCut = false;
jammedDoorBroken = false;
jammedDoorHP = 5;
passwordDoorOpened = false;
silverDoorOpened = false;
slimeDefeated = false;
goldenRoomOpened = false;
dragonDefeated = false;
    
//items
silverKey = false;
map = false;
goldKey = false;
sword = false;
potion = false;
potionsLeft = 1;
count = 0;
    hero.health = hero.maxHealth;
    slimeBoi.health = slimeBoi.maxHP;
     UpdateText("<p style='color:red'>You died! Resetting game!</p>");
currentRoomNumber = 27;
    UpdateStatus();
}
function checkInput()
    {   
        playerInput=input.value.toUpperCase();
        console.log("Player input: " + playerInput);
        
        //Make sure players don't input multiple directions.
        if(playerInput.includes("NORTH") && playerInput.includes("EAST") && playerInput.includes("WEST") && playerInput.includes("SOUTH"))
        {
        UpdateText("Please enter a single cardinal direction.");   
        }
        else if(playerInput.includes("NORTH") && playerInput.includes("EAST") && playerInput.includes("SOUTH"))
        {
        UpdateText("Please enter a single cardinal direction.");     
        }
        else if(playerInput.includes("NORTH") && playerInput.includes("WEST") && playerInput.includes("SOUTH"))
        {
        UpdateText("Please enter a single cardinal direction.");   
        }
        else if(playerInput.includes("EAST") && playerInput.includes("SOUTH") && playerInput.includes("WEST"))
        {
        UpdateText("Please enter a single cardinal direction.");     
        }
        else if(playerInput.includes("EAST") && playerInput.includes("NORTH") && playerInput.includes("WEST"))
        {
        UpdateText("Please enter a single cardinal direction.");   
        }
        else if(playerInput.includes("NORTH") && playerInput.includes("SOUTH"))
        {
        UpdateText("Please enter a single cardinal direction.");    
        }
         else if(playerInput.includes("NORTH") && playerInput.includes("EAST"))
        {
        UpdateText("Please enter a single cardinal direction.");   
        }
         else if(playerInput.includes("NORTH") && playerInput.includes("WEST"))
        {
        UpdateText("Please enter a single cardinal direction.");     
        }
         else if(playerInput.includes("EAST") && playerInput.includes("SOUTH"))
        {
        UpdateText("Please enter a single cardinal direction.");      
        }
         else if(playerInput.includes("EAST") && playerInput.includes("WEST"))
        {
        UpdateText("Please enter a single cardinal direction.");   
        }
         else if(playerInput.includes("SOUTH") && playerInput.includes("WEST"))
        {
        UpdateText("Please enter a single cardinal direction.");   
        }
        else if(playerInput == "MOVE")
        {
            UpdateText("Please enter a single cardinal direction.");   
        }
        else if(playerInput == "NORTH")
        {
            tryNorth();
        }
        else if(playerInput == "SOUTH")
        {
            trySouth();
            
        }
        else if(playerInput == "EAST")
        {
            tryEast();
            
        }
       else if(playerInput == "WEST")
        {
            tryWest();
            
        }
        else if(playerInput == "HINT")
        {
            Tip();
            
        }
        else if(playerInput == "SR")
        {
            silverKey = true;
            silverDoorOpened = true;
            hero.minAtk = 50;
            hero.maxAtk = 100;
            jammedDoorBroken = true;
            
        }
        else if(playerInput == "DIE")
        {
            if(hero.health > 1)
                {
            hero.takeHit(hero.health -1);
                }else{
                Die();
                }
        }
        else if(playerInput == "EGOD")
        {
            tryAttack();
            tryAttack();
            tryAttack();
            tryAttack();
            tryAttack();
            tryAttack();
        }
        else if(playerInput == "OPM")
        {
            hero.minAtk = 50;
            hero.maxAtk = 100;
            console.log("Increasing player attack");
        }
        else if(playerInput == "UNLOCK")
        {
            tryUnlock();
            
        }
        else if(playerInput.includes("INVESTIGATE") || playerInput.includes("INSPECT") || playerInput.includes("LOOK") || playerInput.includes("LOOK AROUND"))
        {
            Investigate(playerInput);
        }
        else if(playerInput == "BLOCK" || playerInput == "DEFEND")
        {
            tryDefend();
        }
        else if(playerInput == "DODGE" || playerInput == "ESCAPE")
        {
            tryDodge();
        }
        else if(playerInput == "ATTACK" || playerInput == "CUT" || playerInput == "FIGHT" || playerInput == "DESTROY" || playerInput == "PUNCH")
        {
            tryAttack();
        }
                else if(playerInput == "GET" || playerInput == "PICK" || playerInput == "PICK UP" || playerInput == "TAKE" )
        {
            tryGet();
        }
        else if(playerInput == "W3")
        {
            if(currentRoomNumber == 17)
                {
                    if(!passwordDoorOpened)
                        {
                            UpdateText("You write the passcode on the piece of paper and you hear a click coming from within the door.");
                            passwordDoorOpened = true;
                        }else{UpdateText("This does nothing.")}
                }else{
                    UpdateText("This might be useful on another room...")
                }
        }
        
        else if(playerInput == "PORCH BABY"){
            UpdateText("STOP IT RAHUL/DAREN I SWEAR TO GOD ")
            UpdateText("Porch baby: HISSSS")
            gif.src = disgustGifs[Math.floor(Math.random() * (disgustGifs.length - 0 + 1)) + 0];
        }
        else if(playerInput == "IGOR"){UpdateText("Seems like a cool guy.")}
        else if(playerInput == "EILAN"){UpdateText("1+1=5")}
        else if(playerInput == "KAS"){UpdateText("Favorite potato winkity wonkerz")}
        else if(playerInput == "RAHUL"){UpdateText("Spicy curry potato")}
        else if(playerInput == "Frank"){UpdateText("Greek Gyro Potato")}
        else if(playerInput == "Victor"){UpdateText("V I C C B O I")}
        else if(playerInput == "Daren"){UpdateText("Bark bark *cooking sounds*")}
        else if(playerInput == "Davi"){UpdateText("PLEASE COME TO BRAZIL")}
        
        
        else{UpdateText("Please enter a valid command.")}
           
    
        input.value = "";
    }//Check input

function UpdateText(stringInput)
{
    entireString = stringInput + "<br/>___________________________________________________<br/>" + entireString;
    output.innerHTML=entireString;
}

function UpdateStatus()
{
    gif.src = "";
    if(currentRoomNumber == 32)
    {
        UpdateText("You step in a foul-smelling room.");
    }
    if(currentRoomNumber == 27)
    {
        UpdateText("You are in a cold room with stone walls.");
    }
    if(currentRoomNumber == 22)
    {
        UpdateText("You are in a hallway. There seems to be a door to the north.");
    }
    if(currentRoomNumber == 17)
    {
        UpdateText("You find yourself in a claustrophobic room that has a door in each direction.");
    }
    if(currentRoomNumber == 16)
    {
        UpdateText("You are in a room that seems to be a study of sorts. You see a table with a piece of paper.");
    }
    if(currentRoomNumber == 18)
    {
        UpdateText("This small room seems to contain an altar.");
    }
    if(currentRoomNumber == 12)
    {
       
        if(!slimeDefeated)
            {
                UpdateText("<p style='color:orange'>This room seems to have cracks on the roof. A strange creature lies beyond you.</p>");
                inCombat = true;
                count = 0;
                spriteObject.currentFrame = 0;
                spriteObject.sourceX = this.currentFrame * this.SIZE;
                spriteObject.updateAnimation();
                render(); //render the animation
            }
        canvas.style.visibility = "visible";
    }
    if(currentRoomNumber == 7)
    {
        UpdateText("This room has a wooden floor. There is a skeleton on the corner of the room.");
    }
    if(currentRoomNumber == 6)
    {
        UpdateText("This seems to be an alchemy room.");
    }
    if(currentRoomNumber == 8)
    {
        UpdateText("There is a monster on this room. Beyond it, you see the exit.");
    }
    
    console.log("Current room: " + rooms[currentRoomNumber] + ", " + currentRoomNumber)
}//updatestatus
    
    function Tip()
{
    var str;
    if(currentRoomNumber == 32)
    {
       UpdateText("I mean it's kinda obvious");
    }
    if(currentRoomNumber == 27)
    {
        UpdateText("Maybe you should try <b>look</b>ing or <b>inspect</b>ing your surroundings...");
    }
    if(currentRoomNumber == 22)
    {
       UpdateText("Sometimes, violence is the only way to solve your problems.");
    }
    if(currentRoomNumber == 17)
    {
        UpdateText("You can try <b>inspect</b>ing specific <b>objects</b>...");
    }
    if(currentRoomNumber == 16)
    {
        if(!map)
        {UpdateText("Items can be useful to you. If only you could <b>get</b> them somehow...");
        }else{
            UpdateText("You still didn't <b>inspect</b> the piece of paper...");
        }
    }
    if(currentRoomNumber == 18)
    {
        UpdateText("...I mean what else there is to do in this room? This is kinda obvious");
    }
    if(currentRoomNumber == 12)
    {
        UpdateText("Sometimes you just gotta punch a slime in the face.");
    }
    if(currentRoomNumber == 7)
    {
       UpdateText("The sword doesn't seem to be very useful to the skeleton. You know, 'cause he's dead and all.");
    }
    if(currentRoomNumber == 6)
    {
        UpdateText("Fun fact: You are technically not allowed to use a red cross to represent health icons in video games. Crosses with other colors, </br>such as green, are fine, though.</br>");
        UpdateText("https://www.pcgamer.com/how-the-prison-architect-developers-broke-the-geneva-conventions/");
    }
    if(currentRoomNumber == 8)
    {
        UpdateText("You know what to do...");
        gif.src = "images/fight.gif";
    }
}//tip
        function Investigate(fullStr)
{
    var str = "";
    if(currentRoomNumber == 32)
    {
        UpdateText("This room is full of bones and rotten flesh. On the corner of the room there seems to be a corpse of an infant. Right on the center of the room is a severed hand. It seems to be holding a key.");
    }
    if(currentRoomNumber == 27)
    {
        UpdateText("The room looks like a dungeon cellar. To the south, you see thick vines. To the north you see a door.");
    }
    if(currentRoomNumber == 22 && !fullStr.includes("DOOR"))
    {
        if(!jammedDoorBroken)
            {
        UpdateText("It appears that this room used to have wooden furniture in it. But everything is wrecked beyond repairs. There is a door on the north wall and another one on the south wall.");
            }else if(jammedDoorBroken)
            {
        UpdateText("It appears that this room used to have wooden furniture in it. But everything is wrecked beyond repairs. There USED TO BE a door on the north wall. I ain't sayin names but SOMEONE broke it. Also there is another one on the south wall.");
            }
        
    }else if(currentRoomNumber == 22 && fullStr.includes("DOOR")){
        UpdateText("The door appears to be jammed. It simply won't budge. Maybe brute force might make it open...");
    }   
    if(currentRoomNumber == 17)
    {
        UpdateText("This room has doors on every direction. To the north there is a silver door. To the east there is a door with a piece of paper and a pen next to it. To the west there is a regular wooden door.");
    }
    if(currentRoomNumber == 16)
    {
        if(!map)
            {
        UpdateText("There's a table and some old shelves on this room. There seems to be a map on the wall, and a torn piece of paper on the table.");
            }else{
               UpdateText("The paper reads 'W3' "); 
            }
    }
    if(currentRoomNumber == 18)
    {
        if(!silverKey){
        UpdateText("This is a very tiny room. There's a small shelf on the wall with a silver key on it.");
        }else{UpdateText("This is a very tiny room. There's a small shelf on the wall.");}
    }
    if(currentRoomNumber == 12)
    {
        UpdateText("You look around the room, trying to ignore the gooey creature. There are cracks on the roof where sunlight comes through - you must be getting close to the exit.");
    }
    if(currentRoomNumber == 7)
    {
        UpdateText("You inspect the room and notice signs of a conflict long gone. On the corner of the room lies a skeleton holding a sword.");
    }
    if(currentRoomNumber == 6)
    {
        UpdateText("This room seems to be an alchemy lab of some sorts. Everything is trashed, except for a single vial containing a red liquid. On the label of the vial there is a green + sign.");
    }
    if(currentRoomNumber == 8)
    {
        UpdateText("This room is entirely made of marble. Large marble pillars connect the floor to the roof. A terrifying beast awaits in the middle of the chamber.");
    }
    
}//investigate
    
function tryNorth()
{
    var temp = currentRoomNumber;
    currentRoomNumber -= 5;
    if(currentRoomNumber < 0)
    {
        UpdateText("There is a wall to the North.");
        console.log("Blocked!");
        currentRoomNumber = temp;
    }else if(rooms[currentRoomNumber] == "wall")
        {
            console.log("Position " + currentRoomNumber + " is a wall. Resetting position.")
            currentRoomNumber = temp;
            UpdateText("There is a wall to the North.");
            console.log("Blocked!");
        }else if(currentRoomNumber == 17)
        {
            if(jammedDoorBroken)
            {
                UpdateText("You move North.");
                currentRoomStr = rooms[currentRoomNumber];
                UpdateStatus();
            }else{
                currentRoomNumber = temp;
                UpdateText("There is a jammed door blocking your way.");
                console.log("Blocked! (jammed door)");
                UpdateStatus();
            }
            
        }else if(currentRoomNumber == 12)
        {   count = 0;
            if(silverDoorOpened)
            {
                UpdateText("You move North.");
                currentRoomStr = rooms[currentRoomNumber];
                UpdateStatus();
            }else{
                currentRoomNumber = temp;
                if(!silverKey)
                {UpdateText("A silver door blocks your path.");}
                else{UpdateText("A silver door blocks your path. Maybe try unlocking it?");}
                
                console.log("Blocked! (silver door)");
                UpdateStatus();
            }
        }else if(currentRoomNumber == 7)
        {
            console.log("Tried leaving slime room");
         if(slimeDefeated)
            {
                console.log("Left.");
                UpdateText("You move North.");
                currentRoomStr = rooms[currentRoomNumber];
                UpdateStatus();
            }else{
                currentRoomNumber = temp;
                console.log("Could not leave.");
                UpdateText("The creature won't let you escape!");
            }
        }else if(currentRoomNumber != 32){
        UpdateText("You move North.");
        currentRoomStr = rooms[currentRoomNumber];
        UpdateStatus();
    console.log("Current position: " + currentRoomNumber);
        }//else if
    
}//tryNorth
    
 function tryEast()
{
    var temp = currentRoomNumber;
    currentRoomNumber ++;
    if(currentRoomNumber > 39)
    {
        UpdateText("There is a wall to the East.");
        console.log("Blocked!");
        currentRoomNumber = temp;
    }else if(rooms[currentRoomNumber] == "wall")
        {
            console.log("Position " + currentRoomNumber + " is a wall. Resetting position.")
            currentRoomNumber = temp;
            UpdateText("There is a wall to the East.");
            console.log("Blocked!");
        }else if(currentRoomNumber == 18)
        {
            if(passwordDoorOpened)
            {
                UpdateText("You move East.");
                currentRoomStr = rooms[currentRoomNumber];
                UpdateStatus();
            }else{
                currentRoomNumber = temp;
                UpdateText("The strange looking door with a paper and pencil next to it is blocking your way.");
                console.log("Blocked! (pass door)");
                UpdateStatus();
            }
            
        }else if(currentRoomNumber != 18){
        UpdateText("You move East.");
        currentRoomStr = rooms[currentRoomNumber];
        UpdateStatus();
        }
}
    
    
    function tryWest()
{
        var temp = currentRoomNumber;
    currentRoomNumber --;
    if(currentRoomNumber < 0)
    {
        UpdateText("There is a wall to the West.");
        console.log("Blocked!");
        currentRoomNumber = temp;
    }else if(rooms[currentRoomNumber] == "wall")
        {
            console.log("Position " + currentRoomNumber + " is a wall. Resetting position.")
            currentRoomNumber = temp;
            UpdateText("There is a wall to the West.");
            console.log("Blocked!");
        }else{
       UpdateText("You move West.");
        currentRoomStr = rooms[currentRoomNumber];
        UpdateStatus();
        }
    console.log("Current position: " + currentRoomNumber);
}
    
    
    function trySouth()
{
    var temp = currentRoomNumber;
    currentRoomNumber +=5;
    if(currentRoomNumber > 39)
    {
         UpdateText("There is a wall to the South.");
        console.log("Blocked!");
        currentRoomNumber = temp;
    }else if(rooms[currentRoomNumber] == "wall")
    {
        console.log("Position " + currentRoomNumber + " is a wall. Resetting position.")
        currentRoomNumber = temp;
        UpdateText("There is a wall to the South.");
        console.log("Blocked!");
    }else if(currentRoomNumber == 32)
        {
            if(areVinesCut)
            {
                UpdateText("You move South.");
                currentRoomStr = rooms[currentRoomNumber];
                UpdateStatus();
            }else{
                currentRoomNumber = temp;
                UpdateText("The vines block your way south. Maybe try cutting them?");
                console.log("Blocked! (vines)");
                UpdateStatus();
            }
            
        }else if(currentRoomNumber != 32){
        UpdateText("You move South.");
        currentRoomStr = rooms[currentRoomNumber];
        UpdateStatus();
        }
    
    console.log("Current position: " + currentRoomNumber);
}
    function tryAttack()
{
    if(currentRoomNumber == 12 && !slimeDefeated)
{
    if(spriteObject.currentFrame == 2 || spriteObject.currentFrame == 1)
{
    UpdateText("Too slow!");
    blocking = false;
    dodging = false;
    takeCrit = true;
    count = 2;
    spriteObject.currentFrame = 2;
    spriteObject.updateAnimation();
    render();
}else{
    if(!sword)
        {
        var damage = (Math.floor(Math.random() * hero.minAtk) + hero.maxAtk);
          UpdateText("<p style='color:green'>You attack the slime for " + damage + " damage.</p>");
            slimeBoi.takeHit(damage);
            UpdateText("Slime HP: " + slimeBoi.health + "/" + slimeBoi.maxHP);
        }else{
            var damage = (Math.floor(Math.random() * hero.minAtk + 5) + hero.maxAtk + 5);
          UpdateText("<p style='color:green'>You attack the slime for " + damage + " damage.</p>");
            slimeBoi.takehit(damage);
            UpdateText("Slime HP: " + slimeBoi.health + "/" + slimeBoi.maxHP);
        }
    
}

    if(slimeBoi.health <0)
        {
            slimeBoi.head = 0;
            slimeDefeated = true;
        }
    }
    if(currentRoomNumber == 27 && sword && !areVinesCut)
        {
            areVinesCut = true;
            UpdateText("You cut the vines.");
        }else if (currentRoomNumber == 27 && !sword && !areVinesCut)
        {
        UpdateText("You try to punch the vines, to no effect. You need something sharp.");
        }else if(currentRoomNumber == 22 && !jammedDoorBroken)
        {
        atk = hero.getAtk();
        jammedDoorHP -= atk;
        if(jammedDoorHP <1)
        {
        jammedDoorHP = 0;
        jammedDoorBroken = true;
        UpdateText("<p style='color:green'>You attack the door for " + atk + " damage. You break the door.</p>");
        }else{
        UpdateText("<p style='color:green'>You attack the door for " + atk + " damage. The door has " + jammedDoorHP + " HP.</p>");
        }
        }else if(!inCombat)
        {
           UpdateText("There is nothing to fight here.");
        }
    
}
    
    
 function tryGet()
{ 
    if(currentRoomNumber == 32 && !goldKey && !goldenRoomOpened)
       {
       UpdateText("You get the gold key from the severed hand. Gross.");
           goldKey = true;
       }
    else if(currentRoomNumber == 16 && !map)
       {
           map = true;
       UpdateText("You get the map from the table.");
       }
     else if(currentRoomNumber == 18 && !silverKey && !silverDoorOpened)
       {
           silverKey = true;
       UpdateText("You get the silver key.");
       }
    else if(currentRoomNumber == 7 && !sword)
       {
       UpdateText("You get the sword from the skeleton's hand.");
           sword = true;
       }
     else if(currentRoomNumber == 6 && !potion && potionsLeft > 0) 
       {
       UpdateText("You get the lone concoction from the shelf.");
           potion = true;
           potionsLeft --;
       }
    else{
        UpdateText("There doesn't seem to be anything you can take from here.")
    }
}
      function tryUnlock()
    {
    if(currentRoomNumber == 17)
        {
            if(silverDoorOpened)
                {
                    UpdateText("The door is already unlocked.")
                }else{
                    silverDoorOpened = true;
                    UpdateText("You use the silver key to unlock the silver door.");
                }
        }
    }  
  function tryDefend()
    {
     //   if(currentRoomNumber == 12 || !slimeDefeated)
       //     {
            
                if(dodging)
                {
    UpdateText("<p style='color:red'>You stumble between dodging and blocking!</p>");
    blocking = false;
    dodging = false;
    takeCrit = true;
    count = 2;
     spriteObject.currentFrame = 2;
    spriteObject.updateAnimation();
    render();
    }else  if(spriteObject.currentFrame == 2)
            {
                UpdateText("<p style='color:red'>Too slow! You fail to block!</p>");
            }else{
                blocking = true;
                UpdateText("You try to block!");
            }
                
            //}else{
            //Update("There is nothing to block");
            //}
    
    }  
     function tryDodge()
    {
       if(currentRoomNumber == 12 || !slimeDefeated)
            {
            
        if(blocking)
        {
    UpdateText("<p style='color:red'>You stumble between blocking and dodging!</p>");
    blocking = false;
    dodging = false;
    takeCrit = true;
    count = 2;
    spriteObject.currentFrame = 2;
    spriteObject.updateAnimation();
    render();
    }else if(spriteObject.currentFrame == 2)
            {
                UpdateText("<p style='color:red'>Too slow! You fail to dodge!</p>");
            }else{
                dodging = true;
                UpdateText("You try to dodge!");
            }
                
            }else{
            Update("There is nothing to block");
            }

    }
 function tryInventory()
    {
    
    }

}());