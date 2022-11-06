/* 키 객체 생성 */
const key = {
  keyDown: {},
  keyValue: {
    37: "left",
    39: "right",
    38: "up",
    40: "down",
    88: "attack",
    67: "slide",
    13: "enter",
  },
};

/* monster object 생성 */
const allMonsterComProp = {
  arr: [],
};

/* bullet object 생성 */
const bulletComProp = {
  launch: false,
  arr: [],
};

const gameBackground = {
  /* 패럴럭스를 적용할 엘리먼트 설정 gameBox라는 이름으로.. */
  gameBox: document.querySelector(".game"),
  /* --- 내가 수정 --- */
  gameMiddle: document.querySelector(".middle"),
  gameSky: document.querySelector(".sky"),
};

const stageInfo = {
  stage: [],
  totalScore: 0,
  monster: [
    { defaultMon: greenMon, bossMon: greenMonBoss },
    { defaultMon: yellowMon, bossMon: yellowMonBoss },
    { defaultMon: pinkMon, bossMon: pinkMonBoss },
  ],
  // 나중에 텀 길게..
  callPosition: [1000, 5000, 9000],
};

/* 자주 사용하는 것은 공통 처리 */
const gameProp = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  gameOver: false,
};

const renderGame = () => {
  /* 키를 눌렀을 때만 동작하는 게 아니라 */
  /* 무한으로 호출되다가 사용자가 키를 누르면 */
  /* 키에 맞는 동작을 하므로 딜레이가 없음 */
  hero.keyMotion();
  setGameBackground();

  npcOne.crash();

  bulletComProp.arr.forEach((arr, i) => {
    arr.moveBullet();
  });
  allMonsterComProp.arr.forEach((arr, i) => {
    arr.moveMonster();
  });

  stageInfo.stage.clearCheck();
  /* 재귀로 초당 60프레임을 돌며 renderGame함수가 무한 반복 */
  window.requestAnimationFrame(renderGame);
};

const endGame = () => {
  gameProp.gameOver = true;
  key.keyDown.left = false;
  key.keyDown.right = false;
  document.querySelector(".game_over").classList.add("active");
};

/* hero가 이동한 만큼 background-image도 이동 */
const setGameBackground = () => {
  /* -1을 곱해주면서 배경이 hero의 방향 반대로 이동하고 hero가 달려가는 느낌을 줌 */
  /* hero.movex : 히어로가 이동한 값 */
  /* hero의 위치에서 gameProp.screenWidth / 3만큼을 통째로 이동시켰음 */
  /* Math.min()을 넣어줌으로써 0 ~ gameProp.screenWidth / 3 까지는 배경이 안움직임 */
  /* -1을 0.5정도로 수정하면 pink가 배경보다 빨라서 너무 앞으로 감 -> 오히려 좋다면 적용하기 */
  let parallaxValue = Math.min(0, (hero.movex - gameProp.screenWidth / 4) * -1);

  gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;
  gameBackground.gameMiddle.style.transform = `translateX(${
    parallaxValue / 3
  }px)`;
  gameBackground.gameSky.style.transform = `translateX(${parallaxValue / 6}px)`;
};

/* window에 event 추가, 관리 */
const windowEvent = () => {
  window.addEventListener("keydown", (e) => {
    if (!gameProp.gameOver) key.keyDown[key.keyValue[e.which]] = true;
    if (key.keyDown["enter"]) {
      npcOne.talk();
    }
  });

  window.addEventListener("keyup", (e) => {
    key.keyDown[key.keyValue[e.which]] = false;
  });

  window.addEventListener("resize", (e) => {
    gameProp.screenWidth = window.innerWidth;
    gameProp.screenHeight = window.innerHeight;
  });
};

/* 페이지가 로드될때 이미지 로드를 미리 해놓기 위해.. 안해놓으면 끊김 */
const loadImg = () => {
  const preLoadImgSrc = [
    "../../../lib/images/pink_attack.png",
    "../../../lib/images/pink_run.png",
    "../../../lib/images/pink_run_attack.png",
    "../../../lib/images/monster/monster_devil_run_1.png",
    "../../../lib/images/monster/monster_devil_run_2.png",
    "../../../lib/images/monster/monster_devil_run_3.png",
    "../../../lib/images/carrot_crash.png",
  ];
  /* 이미지 배열의 길이만큼 반복되는 반복문을 만듬 */
  preLoadImgSrc.forEach((arr) => {
    const img = new Image();
    img.src = arr;
  });
};

let hero;
let npcOne;

/* program 시작에 필요한 function 또는 method 호출 */
const init = () => {
  /* class.js에서 생성한 Hero 클래스의 instance 생성 */
  hero = new Hero(".hero");
  stageInfo.stage = new Stage();
  npcOne = new Npc();
  /* Monster instance 생성 (몬스터 위치, 몬스터 체력) */
  /*   allMonsterComProp.arr[0] = new Monster(
    greenMonBoss,
    gameProp.screenWidth + 700
  );
  allMonsterComProp.arr[1] = new Monster(
    yellowMonBoss,
    gameProp.screenWidth + 1400
  );
  allMonsterComProp.arr[2] = new Monster(
    pinkMonBoss,
    gameProp.screenWidth + 2100
  ); */

  //allMonsterComProp.arr[1] = new Monster(1500, 5555);
  /* 이미지가 미리 로드되어 깜빡임 없이 처리 가능 */
  loadImg();
  windowEvent();
  renderGame();
};

/* 모든 요소가 로드 된 후 윈도우를 실행하여야 함 */
window.onload = () => {
  init();
};
