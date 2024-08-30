var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

var game = new Phaser.Game(config);
// Define text box style and text content
const padding = 20;
const cornerRadius = 20;
const borderColor = 0x000000; // Black border
const borderWidth = 4;
const backgroundColor = 0xFFFFFF; // White background
const textColor = '#000000'; // Black text
var bubbleBob, bubbleAlice;

var strokeBob, strokeAlice;
function preload () {
    this.load.image('ground', 'platform.png');
    this.load.image('background', 'sky.png');
    this.load.spritesheet('bob', 'dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('alice', 'dude2.png', { frameWidth: 32, frameHeight: 48 });
}



var bob, alice;
var bubble;
var bobMessage, aliceMessage;

function create () {
    this.add.image(400, 300, 'background');
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    bob = this.add.sprite(200, 520, 'bob');
    alice = this.add.sprite(650, 520, 'alice');
    bob.setScale(2);
    alice.setScale(2);
    bob.setFrame(5);

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('bob', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.tweens.add({
        targets: bob,
        delay: 1000,  // Delay before starting the tween
        x: 400,  // Ending x coordinate
        duration: 2000,  // Duration in milliseconds (2000 ms = 2 seconds)
        ease: 'Linear',  // Easing function
        onStart: function() {
            bob.anims.play('right', true);
        },
        onComplete: function() {
            bob.anims.stop('right', true);
        }
    });

    
   
    // Initialize SSE connection

    var source = new EventSource("/initChat/stream");
    source.onmessage = (event) => {
        var data = JSON.parse(event.data);
        handleServerEvent(data, this);
    };
}

function handleServerEvent(data, scene) {
    const tempText = scene.add.text(0, 0, data.message, { 
        fontSize: '16px', 
        fill: textColor, 
        wordWrap: { width: 400 } 
    });

    // Calculate the dimensions of the text box based on text dimensions
    const textWidth = tempText.width;
    const textHeight = tempText.height;

    const boxWidth = textWidth + padding * 2;
    const boxHeight = textHeight + padding * 2;

    // Remove the temporary text object
    tempText.destroy();

    if (data.from === 'bob' && data.to === 'alice') {
        bob.setFrame(4);
        bubbleBob = scene.add.graphics();
        bubbleBob.lineStyle(borderWidth, borderColor);
        bubbleBob.fillStyle(backgroundColor, 1);
        bubbleBob.strokeRoundedRect(150, 120, boxWidth, boxHeight, cornerRadius);
        bubbleBob.fillRoundedRect(150, 120, boxWidth, boxHeight, cornerRadius);
        bobMessage = scene.add.text(170, 140, data.message,{ 
            fontSize: '16px', 
            fill: textColor, 
            wordWrap: { width: boxWidth - padding * 2 } 
        });
        strokeBob = scene.add.graphics();
        strokeBob.lineStyle(2, "#000000", 1);
        strokeBob.beginPath();
        strokeBob.moveTo(150+ (boxWidth/2), 120 + boxHeight);  // Starting point (x1, y1)
        strokeBob.lineTo(bob.x, 500);  // Ending point (x2, y2)
        strokeBob.strokePath();

        //aliceMessage.setText('');  
       // aliceBubble.destroy();       
        setTimeout(() => {
            //bobMessage.setText('');
            bobMessage.destroy();
            bubbleBob.destroy();
            strokeBob.clear();
            bob.setFrame(5);
        }, 7000);
    }
    if (data.from === 'alice' && data.to === 'bob') {
        alice.setFrame(4);
        bubbleAlice = scene.add.graphics();
        bubbleAlice.lineStyle(borderWidth, borderColor);
        bubbleAlice.fillStyle(backgroundColor, 1);
        bubbleAlice.strokeRoundedRect(300, 120, boxWidth, boxHeight, cornerRadius);
        bubbleAlice.fillRoundedRect(300, 120, boxWidth, boxHeight, cornerRadius);
        aliceMessage = scene.add.text(320, 140, data.message,{ 
            fontSize: '16px', 
            fill: textColor, 
            wordWrap: { width: boxWidth - padding * 2 } 
        });
        strokeAlice = scene.add.graphics();
        strokeAlice.lineStyle(2, "#000000", 1);
        strokeAlice.beginPath();
        strokeAlice.moveTo(300 + (boxWidth/2), 120 + boxHeight);  // Starting point (x1, y1)
        strokeAlice.lineTo(650, 500);  // Ending point (x2, y2)
        strokeAlice.strokePath();
        //bobMessage.setText('');
        //bubbleBob.destroy();
        setTimeout(() => {
            //aliceMessage.setText('');
            alice.setFrame(0);
            aliceMessage.destroy();
            bubbleAlice.destroy();
            strokeAlice.clear()}, 7000);
    }
}

function update () {
    // Logic for updating NPCs
}