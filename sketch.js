var trex, trex_running, edges;
var groundImage, solo;
var soloinv;
var nuvem1, nuvem2;
var cacto1, cacto2, cacto3, cacto4, cacto5, cacto6, nome;
var pontos = 0
var cactosG, nuvemG
var gameState = "inicio"
var trexmorto
var gameOver
var gameOver2
var restart
var restart2
var pulo, checkpoint, die;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png")
  nuvem1 = loadImage("cloud.png")
  cacto1 = loadImage("obstacle1.png")
  cacto2 = loadImage("obstacle2.png")
  cacto3 = loadImage("obstacle3.png")
  cacto4 = loadImage("obstacle4.png")
  cacto5 = loadImage("obstacle5.png")
  cacto6 = loadImage("obstacle6.png")
  trexmorto = loadImage("trex_collided.png")
  gameOver = loadImage("gameOver.png")
  restart = loadImage("restart.png")
  pulo = loadSound ("jump.mp3")
  checkpoint = loadSound ("checkpoint.mp3")
  die = loadSound ("die.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  solo = createSprite(width/2, height-20)
  solo.addImage(groundImage)
  soloinv = createSprite(width/2,height-10, width, 10) 
  soloinv.visible = false
  //criando o trex
  trex = createSprite(50, height-40, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addImage("morto",trexmorto)
  edges = createEdgeSprites();

  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50

  gameOver2 = createSprite(width/2,height/2)
  gameOver2.addImage(gameOver)
  gameOver2.visible = false

  restart2 = createSprite(width/2,height/2+50)
  restart2.addImage(restart)
  restart2.scale = 0.5
  restart2.visible = false

  cactosG = new Group()

  nuvemG = new Group()

  //hitbox trex
  trex.debug=false
  trex.setCollider("circle",0,0,40)
  //trex.setCollider("rectangle",100,0,200,80,0)
}


function draw() {
  //definir a cor do plano de fundo 
  background("white");
  text("Score " + pontos, width-100 , 30)
  //registrando a posição y do trex
  console.log(trex.y)

  //impedir que o trex caia
  trex.collide(soloinv)
  drawSprites();

    if (pontos>0&&pontos%100===0){
      checkpoint.play()
    }

  //GameState
  if (gameState === "inicio") {
    pontos = pontos + Math.round(getFrameRate() / 60)  
    console.log(frameCount)
    //pular quando tecla de espaço for pressionada
    if (touches.length>0||keyDown("space") && trex.y > height-50) {
      trex.velocityY = -10;
      pulo.play()
      touches = []
    }

    //pulo do trex
    trex.velocityY = trex.velocityY + 0.5;
    solo.velocityX = -(10+pontos/100)

    //solo infinito
    if (solo.x < 0) {
      solo.x = solo.width / 2
    }
    criarNuvem()
    cactos()
   if (trex.isTouching(cactosG)){
    gameState = "fim" 
    die.play()
    //trex.velocityY = -10;
   }

  } else if (gameState === "fim") {
     trex.velocityY = 0
     solo.velocityX = 0
     trex.changeAnimation("morto",trexmorto)
     cactosG.setVelocityXEach(0)
     nuvemG.setVelocityXEach(0)
     cactosG.setLifetimeEach(-1)
     nuvemG.setLifetimeEach(-1)
     gameOver2.visible = true
     restart2.visible = true
    if  (touches.length>0||mousePressedOver(restart2)){

      reset()
      touches = []
    }
  }
}
//Criar nuvens
function criarNuvem() {
  if (frameCount % 80 === 0) {
    nuvem2 = createSprite(width+30, 150)
    nuvem2.addImage(nuvem1)
    nuvem2.velocityX = -8
    nuvem2.y = Math.round(random(10, height-60))
    nuvem2.depth = trex.depth
    trex.depth = trex.depth + 1
    nuvem2.lifetime = 500
    nuvemG.add(nuvem2)
  }
}
 
//Criar cactos
function cactos() {
  if (frameCount % 80 === 0) {
    nome = createSprite(width+30, height-40)
    nome.velocityX = -(10+pontos/100)
    nome.lifetime = 500
    nome.scale = 0.7
    cactosG.add(nome)
    var aleatorio = Math.round(random(1, 6))

    switch (aleatorio) {
      case 1:
        nome.addImage(cacto1)
        break;

      case 2:
        nome.addImage(cacto2)
        break;

      case 3:
        nome.addImage(cacto3)
        break;

      case 4:
        nome.addImage(cacto4)
        break;

      case 5:
        nome.addImage(cacto5)
        break;

      case 6:
        nome.addImage(cacto6)
        break;

      default:
        break;
    }
  }
}
 function reset (){

  gameState =  "inicio";
  nuvemG.destroyEach();
  cactosG.destroyEach();
  gameOver2.visible = false;
  restart2.visible = false;
  pontos = 0 ;
  trex.changeAnimation("running", trex_running)
 }