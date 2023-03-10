const SIDE = {
  MAFIA: "mafia",
  CITY: "city",
};

const STATE = {
  LIVE: "live",
  DIE: "die",
  Election: "election",
  KICK: "kick",
};

const INFINITE = "∞";

const IN_GAME = {
  ACTIVE: true,
  DEACTIVE: false,
};

const PLAYERS = "players";
const CHARACTERS = "characters";
let list = "";
$(() => {
  clicks.forEach((i) => on.click(i.selector, i.func));

  list = storage.run(PLAYERS);
  if (list && list.length > 0) {
    Player.List = list.fromJson();
    Player.List.forEach((i) => dom.addPlayer(i));
  }
  $(".smallCharacter .parent").each(function () {
    console.log($(this).attr("id"));
  });
});

class Player {
  constructor(name) {
    this.id = getId();
    this.characterId = 0;
    this.name = name;
    this.inGame = IN_GAME.ACTIVE;
    this.state = STATE.LIVE;
    this.side = SIDE.MAFIA;
  }
  static List = [];

  static Get(id) {
    return this.List.find((i) => i.id == id);
  }

  static Add(player) {
    this.List.push(player);
    storage.run(PLAYERS, this.List.toJson());
    $("players").html("");
    this.List.forEach((i) => dom.addPlayer(i)); // for show playerName
  }

  static Delete(id) {
    let found = this.Get(id);
    if (found) {
      this.List.remove(found);
      storage.run(PLAYERS, this.List.toJson());
    }
  }

  static Edit() {
    storage.run(PLAYERS, this.List.toJson());
  }
}

class Character {
  constructor(id, name, description, counterAbility, nickname, side) {
    this.id = id || 0;
    this.name = name || "";
    this.description = description || "";
    this.counterAbility = counterAbility || INFINITE;
    this.nickname = nickname || "";
    this.side = side || "default";
  }
}

// createCaracter
const DOCTER_LECTER = new Character(
  5,
  "دکتر لکتر",
  "هرشب یک نفر را انتخاب می کند و اگر مورد حمله قرارگیرد، آن نفر نجات پیدا می کند. فقط یک شب می تواند خودش را انتخاب کند.",
  INFINITE,
  "(جراح)",
  SIDE.MAFIA
);

const DIE_HARD = new Character(
  2,
  "جان سخت",
  "دو شب در طول بازی به گرداننده اعلام مکیند که کارت های خارج شده از بازی را برای فردا رو کند یکبار در طول بازی از حمله شبانه درامان است.",
  2,
  "(گورکن)",
  SIDE.CITY
);

const DETECTIVE = new Character(
  1,
  "کارآگاه",
  "هرشب یک نفر را انتخاب میکند و گرداننده به او اعلام میکند که آیا او مافیا هست یا نه!",
  INFINITE,
  "",
  SIDE.CITY
);

const CITYZEN = new Character(
  0,
  "شهروند",
  "قابلیت خاصی ندارد فقط هر روز صحب می کند و رای میگیرد.",
  0,
  "",
  SIDE.CITY
);

const DOCTOR = new Character(
  3,
  "دکتر",
  "هرشب یک نفر را انتخاب می کند و اگر مورد حمله قرارگیرد، آن نفر نجات پیدا می کند. فقط یک شب می تواند خودش را انتخاب کند.",
  INFINITE,
  "",
  SIDE.CITY
);

const GOD_FATHER = new Character(
  8,
  "پدرخوانده",
  "هرشب تصمیم میگیرد مافیا چه کسی را بکشد.",
  INFINITE,
  "(رییس گروه)",
  SIDE.MAFIA
);

const MAFIA = new Character(
  10,
  "مافیا ساده",
  "قابلیت خاصی ندارد فقط هر روز صحب می کند و رای میگیرد.",
  0,
  "",
  SIDE.MAFIA
);

const JOKER = new Character(
  7,
  "جوکر",
  "دو شب در طول بازی یک نفر را انتخاب می کند ، گرداننده گروه آن بازیکن را با کارآگاه برعکس می گوید.",
  2,
  "(شارلاتان)",
  SIDE.MAFIA
);

const SPACIAL = new Character(
  9,
  "حرفه ای",
  "هر شب می تواند یک نفر را انتخاب کند اگر آن شخص مافیا باشد ، مافیا کشته می شود . اگر شهروند باشد ، کلانتر کشته می شود و اگر مستقل را انتخاب کند هیچ اتفاقی نمی افتد.",
  INFINITE,
  "(کلانتر)",
  SIDE.CITY
);
const CONDUCTOR = new Character(
  100,
  "گرداننده",
  "برای انتخاب نقش، اسم بازیکن رو انتخاب کن و سپس نقشش رو انتخاب کن. توجه کن تا زمانی که بازیکن رو از حالت انتخاب در نیاری با انتخاب نقش، نقش بازیکن انتخاب شده عوض میشه.",
  INFINITE,
  "",
  null
);

var characters = [
  CONDUCTOR,
  GOD_FATHER,
  MAFIA,
  JOKER,
  DOCTER_LECTER,
  DETECTIVE,
  DIE_HARD,
  CITYZEN,
  DOCTOR,
  SPACIAL,
];

// endCharacterObjects

let playerCharacter = "";
let characterObject = "";
const clicks = [
  {
    selector: ".addPlayer .btn",
    func() {
      let p = new Player();
      let name = $(".txtName").val();
      if (name.length >= 2) {
        p.name = name;
        Player.Add(p);
      } else {
        message.show(
          "خطا",
          ".نام کاربر وارد شده کمتر از حد مجاز می باشد",
          "error"
        );
        return false;
      }
    },
  },
  {
    selector: ".removePlayer",
    func(e) {
      let id = e.closest(".playerCondition").attr("id");
      Player.Delete(id);
      dom.removePlayer(e);
    },
  },
  {
    selector: ".playerCondition .checkbox input",
    func(e) {
      let id = e.closest(".playerCondition").attr("id");
      let inGame = e.is(":checked");
      let found = Player.Get(id);
      found.inGame = inGame;
      Player.Edit(found);
    },
  },

  {
    selector: "backWard , .closeBtn",
    func(e) {
      $("backward").removeClass("active");
      $(".alertBox").addClass("hide");
    },
  },

  {
    selector: ".next",
    func: (e) => nextPage(e),
  },

  {
    selector: ".prev",
    func: (e) => prevPage(e),
  },

  {
    selector: ".btn.cancle",
    func: (e) => cancel(e),
  },

  {
    selector: ".players .next",
    func(e) {
      if (Player.List.length < 5) {
        message.show(
          "خطا",
          ".حداقل تعداد کاربر وارد شده 5 نفر می باشد",
          "error"
        );
        return false;
      } else {
        $("aboutcard").html("");
        dom.ability(CONDUCTOR.id);
        dom.smallCard();
        dom.card();
      }
      return true;
    },
  },

  {
    selector: ".rules .parent",
    func: (e) => chooseSmallCard(e),
  },
  {
    selector: ".rules .card",
    // تابع تک خطی اینطوری باشد
    func: (e) => selectCard(e),
  },

  {
    selector: ".rules .next",
    func: (e) => dom.gamePlayeItem(e),
  },

  {
    selector: ".gamePlay .item",
    func: (e) => gamePlayItem(e),
  },
  {
    selector: ".gamePlay .watch",
    func: (e) => $(".item .card").toggleClass("unknow")
  },
];

var dom = {
  addPlayer: (player) => {
    let res = `<div id="${player.id}" class="playerCondition">
                    <a href="#" class="ligthShadow btn ico danger removePlayer">
                        <icon class="disAgree"></icon>
                    </a>
                    <div class="inputBox ligthShadow left">
                        <input type="text" placeholder="نام بازکن" value="${
                          player.name
                        }" disabled>
                    </div>
                    <label for="chk#${
                      player.id
                    }" class="checkbox ligthShadow rigth">
                        <input id="chk#${
                          player.id
                        }" type="checkbox" class="hide" ${
      player.inGame ? "checked" : ""
    }>
                        <span class="checkmark"></span>
                    </label>
                </div>`;
    $(".txtName").val("");
    $("players").append(res);
  },
  removePlayer: (e) => e.parent(".playerCondition").remove(),

  smallCard: () => {
    let res = "";
    Player.List.filter((i) => i.inGame == IN_GAME.ACTIVE).forEach((i) => {
      res += `
      <div id="sc#${i.id}" class="parent">
      <span class="ligthShadow">${i.name}</span>
      <div class="smallCard pending" chID="${i.characterId}">
        <div class="ImageParent ligthShadow">
          <img src="" alt="" onerror="this.src='./images/Question.png'">
        </div>
        <div class="caracterName">
          <span class="miniTitle"></span>
        </div>
      </div>
    </div>`;
      $(".smallCharacter").html(res);
    });
  },
  card: () => {
    let res = "";
    characters
      .filter((i) => i.id != 100)
      .forEach((i) => {
        res += `
    <div id="${i.id}"  class="card ${i.side}">
      <div class="caracter">
        <div class="shield">
          <div class="selectedCaracter">
            <img src="./images/${i.side}/${i.id}.png" alt="${i.name}">
          </div>
        </div>
        <div class="nameBox title">
            ${i.name}
        </div>
      </div>
    </div>`;
        //اصلاح شود
        $(".mainCharacter").html(res);
      });
  },

  ability: (e) => {
    let res = "";
    characters
      .filter((i) => i.id == e)
      .forEach((i) => {
        res += `
      <ability class=${i.side}>
      <div class="ligthShadow">
        <div class="imageParent">
          <img src="./images/${i.side}/${i.id}.png" alt="${i.name}" onerror="this.src='./images/conductor.png'"/>
        </div>
      </div>
      <div class="box">
        <name>
          <span class='nameCharacter'>${i.name}</span>
          <span>${i.nickname}</span>
        </name>
        <div class="info">
          <span class="nigth"></span>
          <span>${i.counterAbility}</span>
        </div>
      </div>
      <p class="description">
        ${i.description}
      </p>
      </ability>
      `;
        $("aboutCard").html(res);
      });
  },

  gamePlayeItem: (e) => {
    let res = "";
    let id = e.attr("id");
    // let character = characters.find((i) => i.id == id);
    Player.List.filter((i) => i.inGame == IN_GAME.ACTIVE).forEach((i) => {
      res += `
    <div class="item" cardID=${i.characterId}>
      <div class="card ${i.side} unknow">
          <span class="cardTitle ligthShadow">${i.name}</span>
          <div class="caracter">
              <div class="shield">
                  <div class="selectedCaracter">
                      <img src="" alt="" onerror="this.src='./images/Question.png'">
                  </div>
              </div>
              <div class="nameBox title">
                 
              </div>
          </div>
      </div>
      <label class="checkbox ligthShadow hide">
          <input type="checkbox" class="hide" checked="checked">
          <span class="checkmark"></span>
      </label>
  </div>
      `;
      $(".nightCard").html(res);
    });
  },
};

const message = {
  show(title, text, bg) {
    let alert = `
            <div msg=${bg} class='alertBox'>
            <a class="ico closeBtn">
            <icon class='close'></icon>
            </a>
                <title>${title}</title>
                <p class='txtBox'>${text}</p>
            </div>`;
    $("body").prepend(alert);
    let box = $(".alertBox").addClass("active");
    setTimeout(function () {
      box.removeClass("active");
    }, 3000);
    return false;
  },
};

var on = {
  click: (selector, func) =>
    $("body").delegate(selector, "click", function (e) {
      if (func) func($(this));
    }),
};

const storage = {
  run(key, value) {
    if (value != null) localStorage.setItem(key, value);
    return localStorage.getItem(key);
  },
  remove: (key) => localStorage.removeItem(key),
};
function getId() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

function defineMethod(name, func) {
  Object.defineProperty(Object.prototype, name, {
    value: func,
    writable: true,
    configurable: true,
  });
}

defineMethod("toJson", function () {
  return JSON.stringify(this);
});

defineMethod("fromJson", function () {
  return JSON.parse(this);
});

defineMethod("remove", function (i) {
  const index = this.indexOf(i);
  if (index > -1) {
    this.splice(index, 1);
  }
});

const nextPage = (btn) => {
  let page = btn.closest("page");
  btn.parent().addClass("hide");
  page.next("page").attr("active", true);
  page.removeAttr("active");
  page.next().find(".panelEvent, .parentBtns ,.pnlBtns").removeClass("hide");
};

const prevPage = (btn) => {
  let page = btn.closest("page");
  // if (btn.hasClass("cancle")) {
  //   message.show("هشدار", "آیا می خواهید از بازی خارج شوید؟", "pending");
  //   $(".modal").addClass("active");
  //   return false;
  // }

  btn.closest("page").prev().find(".panelEvent").removeClass("hide");
  page.removeAttr("active");
  page.prev().attr("active", true);
  page.next().removeAttr("active");
};

const cancel = (btn) => {
  btn.closest("page");

  btn.closest(".pagesParent").find(".welcome").attr("active", "true") &&
    btn
      .closest(".pagesParent")
      .find(".welcome .welcomePage ")
      .removeClass("hide");
  btn.closest("page").removeAttr("active");
};

let character = "";

const selectCard = (e) => {
  $(".card.selected").removeClass("selected");
  e.find(".card").addClass("selected");

  let id = e.attr("id");
  character = characters.find((i) => i.id == id);
  let side = character.side;
  let card = $(".rules .parent .smallCard.selected");
  if (
    $(".parent .smallCard").hasClass("selected") &&
    e
      .closest(".mainCharacter")
      .children(".card.selected")
      .removeClass("selected")
  ) {
    e.toggleClass("selected");
    e.attr("disabled", "disabled");
    $(".rules .parent .smallCard.selected").attr("chID", id);
    $(".rules .parent .smallCard.selected img").attr(
      "src",
      `./images/${character.side}/${id}.png`
    );
    card.find(".miniTitle").text(`${character.name}`);
    card.find(".miniTitle").addClass(character.side);
    res.characterId = id;
    res.side = side;
    $(
      `.rules .parent .smallCard[chID=${$(".card.selected").attr("id")}]`
    ).addClass(character.side);
    $("ability").addClass(e.SIDE);
    dom.ability(id);
  }
};

let res = "";

const chooseSmallCard = (e) => {
  res = Player.List.find((i) => i.id == e.attr("id").split("#")[1]);
  let smallCard = e.find(".smallCard");
  $(".smallCard.pending.selected").removeClass("selected");
  smallCard.addClass("selected");

  if (e.attr("chID") != $(".card").attr("id")) {
    $(".card").removeClass("selected");
  }

  if (smallCard.hasClass("selected") != true) {
    smallCard.addClass();
  }
};
let card = "";
const gamePlayItem = (e) => {
  card = characters.find((i) => i.id == e.attr("cardID"));
  let res = e.find(".card");
  res.toggleClass("unknow");
  e.find(".checkbox").toggleClass("hide");
  if (res.hasClass("unknow")) {
    e.find(".card img").attr("src", "");
    e.find(".card .nameBox").text("");
  } else {
    e.find(".card img").attr("src", `./images/${card.side}/${card.id}.png`);
    e.find(".card .nameBox").text(card.name);
  }
};



