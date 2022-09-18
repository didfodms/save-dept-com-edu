/* hero 클래스 만들기 */
class Hero {
  constructor(el) {
    this.el = document.querySelector(el);
    this.movex = 0;
    this.speed = 12;
    this.direction = "right";
  }
  /* keyMotion 메소드, 키를 누를 때 hero의 motion 변경 */
  keyMotion() {
    if (key.keyDown["left"]) {
      this.direction = "left";
      this.el.classList.add("run");
      this.el.classList.add("flip");

      this.movex = this.movex - this.speed;
    } else if (key.keyDown["right"]) {
      this.direction = "right";
      this.el.classList.add("run");
      this.el.classList.remove("flip");

      this.movex = this.movex + this.speed;
    }

    if (key.keyDown["attack"]) {
      if (!bulletComProp.launch) {
        this.el.classList.add("attack");
        // 공격 키를 누를때마다 bullet object에 instance 추가
        bulletComProp.arr.push(new Bullet());

        bulletComProp.launch = true;
      }
    }

    if (!key.keyDown["left"] && !key.keyDown["right"]) {
      this.el.classList.remove("run");
    }

    if (!key.keyDown["attack"]) {
      this.el.classList.remove("attack");
      bulletComProp.launch = false;
    }
    /* hero Element의 hero box(Parent Element)에 */
    this.el.parentNode.style.transform = `translateX(${this.movex}px)`;
  }
  position() {
    /* position Object를 리턴 */
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom: gameProp.screenHeight - this.el.getBoundingClientRect().bottom,
    };
  }
  size() {
    return {
      // getBoundingClientRect() 를 사용해도 되지만 offset width와 height를 사용해봄
      width: this.el.offsetWidth,
      height: this.el.offsetHeight,
    };
  }
}

/* 수리검 클래스 */
class Bullet {
  constructor() {
    // 수리검은 game element에 추가됨 (this.parentNode가 game element임)
    this.parentNode = document.querySelector(".game");
    this.el = document.createElement("div");
    this.el.className = "hero_bullet";
    this.x = 0;
    this.y = 0;
    this.speed = 20;
    this.distance = 0;
    this.bulletDirection = "right";
    this.init();
  }
  init() {
    this.bulletDirection = hero.direction === "left" ? "left" : "right";
    this.x = hero.position().left + hero.size().width / 2;
    // 수리검은 transform으로 위치를 잡기 떄문에 빼줘야함
    this.y = hero.position().bottom - hero.size().height / 2;
    this.distance = this.x;
    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    this.parentNode.appendChild(this.el);
  }
  moveBullet() {
    let setRotate = "";

    if (this.bulletDirection === "left") {
      this.distance -= this.speed;
      setRotate = "rotate(180deg)";
    } else {
      this.distance += this.speed;
    }

    this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`;
    this.crashBullet();
  }
  position() {
    /* position Object를 리턴 */
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom: gameProp.screenHeight - this.el.getBoundingClientRect().bottom,
    };
  }
  /* 충돌 처리 */
  crashBullet() {
    /* bullet이 화면을 벗어났을 경우 없애기 */
    if (
      this.position().left > gameProp.screenWidth ||
      this.position().right < 0
    ) {
      this.el.remove();
    }
  }
}
