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
        health:100,
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
            console.log("You were hit for: "+ howMuch + " damage. Current health: " + this.health);
                if(this.health<=0)
                {
                    this.health=0;
                    this.die();
                }
        }
        /**** add the die function here ****/
        
        
    };//hero
    
    var monster= 
    {
        type:"",
        health:0,

        die: function()
    {
        if(this.type == "slime")
            {
                slimeDefeated = true;
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
            console.log("You were hit for: "+ howMuch + " damage. Current health: " + this.health);
                if(this.health<=0)
                {
                    this.health=0;
                    this.die();
                }
        }
        /**** add the die function here ****/
        
        
    };//hero
    
    
//progression locks
var areVinesCut = false;
var jammedDoorBroken = false;
var jammedDoorHP = 10;
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

    
var currentRoomNumber = 27;

var output=document.querySelector("#output");
var input =document.querySelector("#guessbox");
var gif =document.querySelector("#imgg");
var button=document.querySelector("#submit");
button.addEventListener("click",onGuessSubmit,false);
    
window.addEventListener("keydown",onEnterPressed,false);
 
startGame();//initializes the game with a random number

function startGame()
{
   console.log("Game Started.")
    console.log("Current room: " + rooms[currentRoomNumber] + ", " + currentRoomNumber)
}
    
function onEnterPressed()
{
    if(event.keyCode==13)
        checkInput();
}
    
function onGuessSubmit()
{
    checkInput();
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
        else if(playerInput == "TIP")
        {
            Tip();
            
        }
        else if(playerInput.includes("INVESTIGATE") || playerInput.includes("INSPECT") || playerInput.includes("LOOK") || playerInput.includes("LOOK AROUND"))
        {
            Investigate(playerInput);
        }
        else if(playerInput == "ATTACK" || playerInput == "CUT" || playerInput == "FIGHT" || playerInput == "DESTROY" || playerInput == "PUNCH")
        {
            tryAttack();
        }
                else if(playerInput == "GET" || playerInput == "PICK" || playerInput == "PICK UP" || playerInput == "TAKE" )
        {
            tryGet();
        }
        else if(playerInput == "W3 SCHOOL OF LEARNING AND FRIENDSHIP")
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
            UpdateText("STOP IT RAHUL/DAREN I SWEAR TO GOD")
            gif.src = disgustGifs[Math.floor(Math.random() * (disgustGifs.length - 0 + 1)) + 0];
        }
        else if(playerInput == "IGOR"){UpdateText("Seems like a cool guy.")}
        else if(playerInput == "EILAN"){UpdateText("1+1=5")}
        
        
        else{UpdateText("Please enter a valid command.")}
           
    
        input.value = "";
    }//Check input

function UpdateText(stringInput)
{
    entireString = entireString + "<br/>" + stringInput;
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
        UpdateText("You are in a room that seems to be a study of sorts. There is a table on it.");
    }
    if(currentRoomNumber == 18)
    {
        UpdateText("This small room seems to contain an altar.");
    }
    if(currentRoomNumber == 12)
    {
        UpdateText("This room seems to have cracks on the roof. A strange creature lies beyond you.");
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
        UpdateText("Items can be useful to you. If only you could <b>get</b> them somehow...");
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
        UpdateText("Fun fact: You are technically not allowed to use a red cross to represent health icons in video games. Crosses with other colors, such as green, are fine, though.");
        str.link("https://www.pcgamer.com/how-the-prison-architect-developers-broke-the-geneva-conventions/");
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
        UpdateText("It appears that this room used to have wooden furniture in it. But everything is wrecked beyond repairs. There is a door on the north wall and another one of the south wall.");
            }else if(jammedDoorBroken)
            {
        UpdateText("It appears that this room used to have wooden furniture in it. But everything is wrecked beyond repairs. There USED TO BE a door on the north wall. I ain't sayin names but SOMEONE broke it. Also there is another one of the south wall.");
            }
        
    }else if(currentRoomNumber == 22 && fullStr.includes("DOOR")){
        UpdateText("The door appears to be jammed. It simply won't budge. Maybe brute force might make it open...");
    }   
    if(currentRoomNumber == 17)
    {
        UpdateText("This room has doors on every direction. To the north there is a silver door. To the east there is a door with a strange dial on it. To the west there is a regular wooden door.");
    }
    if(currentRoomNumber == 16)
    {
        UpdateText("There's a table and some old shelves on this room. There seems to be a map on the wall, and a torn piece of paper on the table.");
    }
    if(currentRoomNumber == 18)
    {
        UpdateText("This is a very tiny room. There's a small shelf on the wall with a silver key on it.");
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
        {
            if(silverDoorOpened)
            {
                UpdateText("You move North.");
                currentRoomStr = rooms[currentRoomNumber];
                UpdateStatus();
            }else{
                currentRoomNumber = temp;
                UpdateText("A silver door blocks your path.");
                console.log("Blocked! (silver door)");
                UpdateStatus();
            }
            
        }else if(currentRoomNumber != 32){
        UpdateText("You move North.");
        currentRoomStr = rooms[currentRoomNumber];
        UpdateStatus();
        }
    console.log("Current position: " + currentRoomNumber);

}
    
    
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
        UpdateText("You attack the door for " + atk + " damage. You break the door.");
        }else{
        UpdateText("You attack the door for " + atk + " damage. The door has " + jammedDoorHP + " HP.");
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
  function tryDefend()
{
    
}  
 function tryInventory()
{
    
}

    
    
   
    
    
    
    
}());