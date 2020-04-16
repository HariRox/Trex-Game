var trex, trex_running, trex_collided, ground, ground_invis, ground_img, gameOver, gameOver_img, restart, restart_img, cloud_img, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, CloudsGroup, ObstaclesGroup, count, gameState, PLAY, END;

function preload(){
  trex_running = loadAnimation ("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloud_img = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOver_img = loadImage("gameOver.png");
  restart_img = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  
  ground = createSprite(300,180,600,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -6;
  
  invisibleGround = createSprite(300,185,600,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300,100,10,10);
  gameOver.addImage(gameOver_img);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  restart = createSprite(300,120,10,10);
  restart.addImage(restart_img);
  restart.scale = 0.5;
  restart.visible = false;
  
  CloudsGroup = new Group();
  ObstaclesGroup = new Group();
  
  count = 0;
  gameState = PLAY;
  PLAY = 1;
  END = 0;
}

function draw() {
  background(180);
  
  text("Score: "+ count, 500, 50);
  
  if(gameState === PLAY){
   //jump when the space key is pressed
   if(keyDown("space") && trex.collide(invisibleGround)){
   trex.velocityY = -12;
   }
  
   //gravity
   trex.velocityY = trex.velocityY + 0.8;
    
   count = count + Math.round(getFrameRate()/60);
   
    if (ground.x < 0){
    ground.x = ground.width/2;
    }
    
    trex.collide(invisibleGround);
  
    //spawn the clouds
    spawnClouds();
    //spawn obstacles
    spawnObstacles();
    
   //End the game when trex is touching the obstacle
   if(ObstaclesGroup.isTouching(trex)){
     gameState = END;
   }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
  }
  
  if(mousePressedOver(restart) && restart.visible === true){
    reset();
  }
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloud_img);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 215;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1 : 
        obstacle.addImage(obstacle1);
        break;
      case 2 :
        obstacle.addImage(obstacle2);
        break;
      case 3 :
        obstacle.addImage(obstacle3);
        break;
      case 4 : 
        obstacle.addImage(obstacle4);
        break;
      case 5 :
        obstacle.addImage(obstacle5);
        break;
      case 6 :
        obstacle.addImage(obstacle6);
        break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 105;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function reset(){
  trex.changeAnimation("running", trex_running);
  restart.visible = false;
  gameOver.visible = false;
  gameState = PLAY;
  count = 0;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
}