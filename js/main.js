/****************
 * 
 * Main.js
 * Coded by: Vincent Palcon
 * App Name: Flying Panda
 * Desc: Based on addictive flappy bird. Help Panda to Fly! Don't let the Panda fall or hit the obstacles!
 * Version: 1.0
 * Copyright 2014 - http://flyingpanda.vincentpalcon.tk
 * 
 */
function CEndPanel(a) {
    var d, b, c, h, g, f, e, l;
    this._init = function (a) {
        d = new createjs.Bitmap(a);
        d.x = 0;
        d.y = 0;
        e = new createjs.Text("", "bold 70px Arial", "#000");
        e.x = CANVAS_WIDTH / 2 + 2;
        e.y = CANVAS_HEIGHT / 2 - 150;
        e.textAlign = "center";
        f = new createjs.Text("", "bold 70px Arial", "#ffffff");
        f.x = CANVAS_WIDTH / 2;
        f.y = CANVAS_HEIGHT / 2 - 152;
        f.textAlign = "center";
        b = new createjs.Text("", "bold 52px Arial", "#000");
        b.x = CANVAS_WIDTH / 2 + 1;
        b.y = CANVAS_HEIGHT / 2 - 18;
        b.textAlign = "center";
        c = new createjs.Text("", "bold 52px Arial", "#ffffff");
        c.x =
            CANVAS_WIDTH / 2;
        c.y = CANVAS_HEIGHT / 2 - 20;
        c.textAlign = "center";
        h = new createjs.Text("", "bold 42px Arial", "#000");
        h.x = CANVAS_WIDTH / 2 + 1;
        h.y = CANVAS_HEIGHT / 2 + 102;
        h.textAlign = "center";
        g = new createjs.Text("", "bold 42px Arial", "#ffffff");
        g.x = CANVAS_WIDTH / 2;
        g.y = CANVAS_HEIGHT / 2 + 100;
        g.textAlign = "center";
        l = new createjs.Container;
        l.alpha = 0;
        l.visible = !1;
        l.addChild(d, b, c, h, g, e, f);
        s_oStage.addChild(l)
    };
    this.unload = function () {
        l.off("mousedown", this._onExit);
        s_oStage.removeChild(l)
    };
    this._initListener = function () {
        l.on("mousedown",
            this._onExit)
    };
    this.show = function (a, d) {
        createjs.Sound.play("game_over");
        e.text = TEXT_GAMEOVER;
        f.text = TEXT_GAMEOVER;
        b.text = TEXT_SCORE + ": " + a;
        c.text = TEXT_SCORE + ": " + a;
        h.text = TEXT_BEST_SCORE + ": " + d;
        g.text = TEXT_BEST_SCORE + ": " + d;
        l.visible = !0;
        var m = this;
        createjs.Tween.get(l).to({
            alpha: 1
        }, 500).call(function () {
            m._initListener()
        });
        $(s_oMain).trigger("save_score", a, d)
    };
    this._onExit = function () {
        l.off("mousedown", this._onExit);
        s_oStage.removeChild(l);
        s_oGame.onRestartGame()
    };
    this._init(a);
    return this
}

function CSpriteLibrary() {
    var a, d, b, c, h, g;
    this.init = function (f, e, l) {
        b = d = 0;
        c = f;
        h = e;
        g = l;
        a = {}
    };
    this.addSprite = function (b, e) {
        a.hasOwnProperty(b) || (a[b] = {
            szPath: e,
            oSprite: new Image
        }, d++)
    };
    this.getSprite = function (b) {
        return a.hasOwnProperty(b) ? a[b].oSprite : null
    };
    this._onSpritesLoaded = function () {
        h.call(g)
    };
    this._onSpriteLoaded = function () {
        c.call(g);
        ++b == d && this._onSpritesLoaded()
    };
    this.loadSprites = function () {
        for (var b in a) a[b].oSprite.oSpriteLibrary = this, a[b].oSprite.onload = function () {
            this.oSpriteLibrary._onSpriteLoaded()
        },
        a[b].oSprite.src = a[b].szPath
    };
    this.getNumSprites = function () {
        return d
    }
}
var CANVAS_WIDTH = 768,
    CANVAS_HEIGHT = 1024,
    FPS_TIME = 1E3 / 24,
    STATE_LOADING = 0,
    STATE_MENU = 1,
    STATE_HELP = 1,
    STATE_GAME = 3,
    ON_MOUSE_DOWN = 0,
    ON_MOUSE_UP = 1,
    ON_MOUSE_OVER = 2,
    ON_MOUSE_OUT = 3,
    ON_DRAG_START = 4,
    ON_DRAG_END = 5,
    GAME_STATE_BEFORE_START = 0,
    GAME_STATE_TRAINING = 1,
    GAME_STATE_START = 2,
    GAME_STATE_GAME_OVER = 3,
    HERO_START_X, HERO_START_Y, HERO_DOWN_ACCELLERATION, BG_SPEED, TIME_TRAINING, DIST_AMONG_OBSTACLES, OBSTACLE_HEIGHT_DIST, TOLERANCE_NEXT_OBST_HEIGHT = 100;

function CToggle(a, d, b, c) {
    var h, g, f, e;
    this._init = function (a, b, c, d) {
        g = [];
        f = [];
        c = new createjs.SpriteSheet({
            images: [c],
            frames: {
                width: c.width / 2,
                height: c.height,
                regX: c.width / 2 / 2,
                regY: c.height / 2
            },
            animations: {
                state_false: [0, 1],
                state_true: [1, 2]
            }
        });
        h = d;
        e = new createjs.Sprite(c, "state_" + h);
        e.x = a;
        e.y = b;
        e.stop();
        s_oStage.addChild(e);
        this._initListener()
    };
    this.unload = function () {
        e.off("mousedown", this.buttonDown);
        e.off("pressup", this.buttonRelease);
        s_oStage.removeChild(e)
    };
    this._initListener = function () {
        e.on("mousedown",
            this.buttonDown);
        e.on("pressup", this.buttonRelease)
    };
    this.addEventListener = function (a, b, e) {
        g[a] = b;
        f[a] = e
    };
    this.buttonRelease = function () {
        e.scaleX = 1;
        e.scaleY = 1;
        h = !h;
        e.gotoAndStop("state_" + h);
        g[ON_MOUSE_UP] && g[ON_MOUSE_UP].call(f[ON_MOUSE_UP], h)
    };
    this.buttonDown = function () {
        e.scaleX = 0.9;
        e.scaleY = 0.9;
        g[ON_MOUSE_DOWN] && g[ON_MOUSE_DOWN].call(f[ON_MOUSE_DOWN])
    };
    this._init(a, d, b, c)
}
(function (a) {
    (jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,
        4))
})(navigator.userAgent || navigator.vendor || window.opera);
$(window).resize(function () {
    sizeHandler()
});

function trace(a) {
    console.log(a)
}
$(window).ready(function () {
    sizeHandler()
});
window.addEventListener("orientationchange", onOrientationChange);

function onOrientationChange() {
    window.matchMedia("(orientation: portrait)").matches && sizeHandler();
    window.matchMedia("(orientation: landscape)").matches && sizeHandler()
}

function sizeHandler() {
    window.scrollTo(0, 1);
    if ($("#canvas")) {
        var a = CANVAS_WIDTH,
            d = CANVAS_HEIGHT,
            b = window.innerWidth;
        multiplier = Math.min(window.innerHeight / d, b / a);
        a *= multiplier;
        d *= multiplier;
        $("#canvas").css("width", a + "px");
        $("#canvas").css("height", d + "px");
        $("#canvas").css("left", b / 2 - a / 2 + "px")
    }
}

function randomFloatBetween(a, d, b) {
    "undefined" === typeof b && (b = 2);
    return parseFloat(Math.min(a + Math.random() * (d - a), d).toFixed(b))
}

function shuffle(a) {
    for (var d = a.length, b, c; 0 !== d;) c = Math.floor(Math.random() * d), d -= 1, b = a[d], a[d] = a[c], a[c] = b;
    return a
}

function formatTime(a) {
    a /= 1E3;
    var d = Math.floor(a / 60);
    a = parseFloat(a - 60 * d).toFixed(1);
    var b = "",
        b = 10 > d ? b + ("0" + d + ":") : b + (d + ":");
    return b = 10 > a ? b + ("0" + a) : b + a
}

function checkRectCollision(a, d) {
    var b, c;
    b = getBounds(a, 0.9);
    c = getBounds(d, 0.98);
    return calculateIntersection(b, c)
}

function calculateIntersection(a, d) {
    var b, c, h, g, f, e, l, k;
    b = a.x + (h = a.width / 2);
    c = a.y + (g = a.height / 2);
    f = d.x + (e = d.width / 2);
    l = d.y + (k = d.height / 2);
    b = Math.abs(b - f) - (h + e);
    c = Math.abs(c - l) - (g + k);
    return 0 > b && 0 > c ? (b = Math.min(Math.min(a.width, d.width), -b), c = Math.min(Math.min(a.height, d.height), -c), {
        x: Math.max(a.x, d.x),
        y: Math.max(a.y, d.y),
        width: b,
        height: c,
        rect1: a,
        rect2: d
    }) : null
}

function getBounds(a, d) {
    var b = {
        x: Infinity,
        y: Infinity,
        width: 0,
        height: 0
    };
    if (a instanceof createjs.Container) {
        b.x2 = -Infinity;
        b.y2 = -Infinity;
        var c = a.children,
            h = c.length,
            g, f;
        for (f = 0; f < h; f++) g = getBounds(c[f], 1), g.x < b.x && (b.x = g.x), g.y < b.y && (b.y = g.y), g.x + g.width > b.x2 && (b.x2 = g.x + g.width), g.y + g.height > b.y2 && (b.y2 = g.y + g.height);
        Infinity == b.x && (b.x = 0);
        Infinity == b.y && (b.y = 0);
        Infinity == b.x2 && (b.x2 = 0);
        Infinity == b.y2 && (b.y2 = 0);
        b.width = b.x2 - b.x;
        b.height = b.y2 - b.y;
        delete b.x2;
        delete b.y2
    } else {
        var e, l;
        a instanceof createjs.Bitmap ?
            (h = a.sourceRect || a.image, f = h.width * d, e = h.height * d) : a instanceof createjs.Sprite ? a.spriteSheet._frames && a.spriteSheet._frames[a.currentFrame] && a.spriteSheet._frames[a.currentFrame].image ? (h = a.spriteSheet.getFrame(a.currentFrame), f = h.rect.width, e = h.rect.height, c = h.regX, l = h.regY) : (b.x = a.x || 0, b.y = a.y || 0) : (b.x = a.x || 0, b.y = a.y || 0);
        c = c || 0;
        f = f || 0;
        l = l || 0;
        e = e || 0;
        b.regX = c;
        b.regY = l;
        h = a.localToGlobal(0 - c, 0 - l);
        g = a.localToGlobal(f - c, e - l);
        f = a.localToGlobal(f - c, 0 - l);
        c = a.localToGlobal(0 - c, e - l);
        b.x = Math.min(Math.min(Math.min(h.x,
            g.x), f.x), c.x);
        b.y = Math.min(Math.min(Math.min(h.y, g.y), f.y), c.y);
        b.width = Math.max(Math.max(Math.max(h.x, g.x), f.x), c.x) - b.x;
        b.height = Math.max(Math.max(Math.max(h.y, g.y), f.y), c.y) - b.y
    }
    return b
}

function NoClickDelay(a) {
    this.element = a;
    window.Touch && this.element.addEventListener("touchstart", this, !1)
}
NoClickDelay.prototype = {
    handleEvent: function (a) {
        switch (a.type) {
        case "touchstart":
            this.onTouchStart(a);
            break;
        case "touchmove":
            this.onTouchMove(a);
            break;
        case "touchend":
            this.onTouchEnd(a)
        }
    },
    onTouchStart: function (a) {
        a.preventDefault();
        this.moved = !1;
        this.element.addEventListener("touchmove", this, !1);
        this.element.addEventListener("touchend", this, !1)
    },
    onTouchMove: function (a) {
        this.moved = !0
    },
    onTouchEnd: function (a) {
        this.element.removeEventListener("touchmove", this, !1);
        this.element.removeEventListener("touchend",
            this, !1);
        if (!this.moved) {
            a = document.elementFromPoint(a.changedTouches[0].clientX, a.changedTouches[0].clientY);
            3 == a.nodeType && (a = a.parentNode);
            var d = document.createEvent("MouseEvents");
            d.initEvent("click", !0, !0);
            a.dispatchEvent(d)
        }
    }
};

function CTextButton(a, d, b, c, h, g, f) {
    var e, l, k;
    this._init = function (a, b, c, f, g, d, h) {
        e = [];
        l = [];
        var s = new createjs.Bitmap(c),
            r = Math.ceil(h / 20),
            n = new createjs.Text(f, "bold " + h + "px " + g, "#000000");
        n.textAlign = "center";
        var q = n.getBounds();
        n.x = c.width / 2 + r;
        n.y = (c.height - q.height) / 2 + r;
        f = new createjs.Text(f, "bold " + h + "px " + g, d);
        f.textAlign = "center";
        q = f.getBounds();
        f.x = c.width / 2;
        f.y = (c.height - q.height) / 2;
        k = new createjs.Container;
        k.x = a;
        k.y = b;
        k.regX = c.width / 2;
        k.regY = c.height / 2;
        k.addChild(s, n, f);
        s_oStage.addChild(k);
        this._initListener()
    };
    this.unload = function () {
        k.off("mousedown");
        k.off("pressup");
        s_oStage.removeChild(k)
    };
    this.setVisible = function (a) {
        k.visible = a
    };
    this._initListener = function () {
        oParent = this;
        k.on("mousedown", this.buttonDown);
        k.on("pressup", this.buttonRelease)
    };
    this.addEventListener = function (a, b, f) {
        e[a] = b;
        l[a] = f
    };
    this.buttonRelease = function () {
        k.scaleX = 1;
        k.scaleY = 1;
        e[ON_MOUSE_UP] && e[ON_MOUSE_UP].call(l[ON_MOUSE_UP])
    };
    this.buttonDown = function () {
        k.scaleX = 0.9;
        k.scaleY = 0.9;
        e[ON_MOUSE_DOWN] && e[ON_MOUSE_DOWN].call(l[ON_MOUSE_DOWN])
    };
    this.setPosition = function (a, b) {
        k.x = a;
        k.y = b
    };
    this.setX = function (a) {
        k.x = a
    };
    this.setY = function (a) {
        k.y = a
    };
    this.getButtonImage = function () {
        return k
    };
    this.getX = function () {
        return k.x
    };
    this.getY = function () {
        return k.y
    };
    this._init(a, d, b, c, h, g, f);
    return this
}

function CScrollingBg(a) {
    var d, b, c, h;
    this._init = function (a) {
        h = a;
        b = a.width;
        c = [];
        for (var f = 0; f < CANVAS_WIDTH + b;) {
            var e = new createjs.Bitmap(a);
            e.x = f;
            e.y = CANVAS_HEIGHT - a.height;
            f += a.width;
            c.push(e);
            s_oStage.addChild(e)
        }
        d = c.length - 1
    };
    this.unload = function () {
        for (var a = 0; a < c.length; a++) s_oStage.removeChild(c[a])
    };
    this.getHeight = function () {
        return h.height
    };
    this.update = function (a) {
        for (var f = -1, e = 0; e < c.length; e++) c[e].x -= a, c[e].x < -b && (f = e); - 1 !== f && (c[f].x = c[d].x + b, d = f)
    };
    this._init(a)
}

function CPreloader() {
    var a;
    this._init = function () {
        this._onAllPreloaderImagesLoaded()
    };
    this._onPreloaderImagesLoaded = function () {};
    this._onAllPreloaderImagesLoaded = function () {
        a = new createjs.Text("", "bold 22px Arial center", "#ffffff");
        a.x = CANVAS_WIDTH / 2 - 40;
        a.y = CANVAS_HEIGHT / 2;
        s_oStage.addChild(a)
    };
    this.unload = function () {
        s_oStage.removeChild(a)
    };
    this.refreshLoader = function (d) {
        a.text = d + "%"
    };
    this._init()
}

function CObstacle(a) {
    var d, b, c, h, g, f;
    this._init = function (a) {
        d = -Math.floor(a.height / 5);
        b = Math.floor(a.height / 5);
        c = a.width / 2;
        this._initLevel()
    };
    this.unload = function () {
        for (var a = 0; a < f; a++) s_oStage.addChild(f[a])
    };
    this._initLevel = function () {
        var e = CANVAS_WIDTH + a.width,
            c = Math.floor(randomFloatBetween(d, b));
        for (f = []; e < 2 * CANVAS_WIDTH + a.width;) {
            var k = new createjs.Bitmap(a);
            k.x = e;
            k.y = c;
            k.regX = a.width / 2;
            k.regY = a.height / 2;
            s_oStage.addChild(k);
            f.push(k);
            k = new createjs.Bitmap(a);
            k.x = e;
            k.y = c + a.height + OBSTACLE_HEIGHT_DIST;
            k.regX = a.width / 2;
            k.regY = a.height / 2;
            k.scaleY = -1;
            s_oStage.addChild(k);
            f.push(k);
            e += DIST_AMONG_OBSTACLES;
            c = this.assignNextHeight(c)
        }
        h = f.length - 1;
        g = -1
    };
    this.restartLevel = function () {
        for (var e = CANVAS_WIDTH + a.width, c = Math.floor(randomFloatBetween(d, b)), k = 0; k < f.length; k += 2) f[k].x = e, f[k].y = c, f[k + 1].x = e, f[k + 1].y = c + a.height + OBSTACLE_HEIGHT_DIST, e += DIST_AMONG_OBSTACLES, c = this.assignNextHeight(c);
        h = f.length - 1;
        g = -1
    };
    this.assignNextHeight = function (a) {
        var c = a - TOLERANCE_NEXT_OBST_HEIGHT;
        c < d && (c = d);
        a += TOLERANCE_NEXT_OBST_HEIGHT;
        a > b && (a = b);
        return Math.floor(randomFloatBetween(c, a))
    };
    this._checkCollision = function (a, b) {
        return checkRectCollision(a, f[b])
    };
    this.update = function (b, d) {
        for (var k = 0; k < f.length; k += 2) {
            f[k].x < -c && (f[k].x = f[h].x + c + DIST_AMONG_OBSTACLES, f[k + 1].x = f[h].x + c + DIST_AMONG_OBSTACLES, f[k].y = this.assignNextHeight(f[h].y), f[k + 1].y = f[k].y + a.height + OBSTACLE_HEIGHT_DIST, h = k);
            f[k].x -= d;
            f[k + 1].x -= d;
            if (this._checkCollision(b, k) || this._checkCollision(b, k + 1)) {
                s_oGame.collisionFound();
                break
            }
            g !== k && f[k].x < HERO_START_X && (g = k,
                s_oGame.increaseScore())
        }
    };
    this._init(a)
}

function CMenu() {
    var a, d, b, c;
    this._init = function () {
        a = new createjs.Bitmap(s_oSpriteLibrary.getSprite("bg_menu"));
        s_oStage.addChild(a);
        var h = s_oSpriteLibrary.getSprite("but_play");
        d = new CTextButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 150, h, TEXT_PLAY, "Arial", "#ffffff", 50);
        d.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        !1 === s_bMobile && (b = new CToggle(CANVAS_WIDTH - 60, 60, s_oSpriteLibrary.getSprite("audio_icon"), s_bAudioActive), b.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this));
        c = new createjs.Shape;
        c.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(c);
        createjs.Tween.get(c).to({
            alpha: 0
        }, 1E3).call(function () {
            c.visible = !1
        })
    };
    this.unload = function () {
        d.unload();
        d = null;
        !1 === s_bMobile && (b.unload(), b = null);
        s_oStage.removeChild(a);
        a = null
    };
    this._onButPlayRelease = function () {
        this.unload();
        s_oMain.gotoGame()
    };
    this._onAudioToggle = function () {
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    };
    this._init()
}

function CMain() {
    var a = 0,
        d = 0,
        b = STATE_LOADING,
        c, h;
    this.initContainer = function () {
        var a = document.getElementById("canvas");
        s_oStage = new createjs.Stage(a);
        createjs.Touch.enable(s_oStage);
        s_bMobile = jQuery.browser.mobile;
        !1 === s_bMobile && (s_oStage.enableMouseOver(20), $("body").on("contextmenu", "#canvas", function (a) {
            return !1
        }));
        s_iPrevTime = (new Date).getTime();
        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(30);
        s_oSpriteLibrary = new CSpriteLibrary;
        c = new CPreloader;
        !1 === s_bMobile &&
            this._initSounds();
        this._loadImages()
    };
    this.soundLoaded = function () {
        a++;
        a === d && (c.unload(), !1 === s_bMobile && (s_oSoundTrackSnd = createjs.Sound.play("soundtrack", {
            interrupt: createjs.Sound.INTERRUPT_ANY,
            loop: -1,
            volume: 0.5
        })), this.gotoMenu())
    };
    this._initSounds = function () {
        createjs.Sound.initializeDefaultPlugins() && (createjs.Sound.alternateExtensions = ["ogg"], createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this)), createjs.Sound.registerSound("./sounds/soundtrack.mp3", "soundtrack"),
            createjs.Sound.registerSound("./sounds/game_over.mp3", "game_over"), createjs.Sound.registerSound("./sounds/tap.mp3", "tap"), d += 3)
    };
    this._loadImages = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("msg_box",
            "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("bg_help", "./sprites/bg_help.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("hero", "./sprites/hero.png");
        s_oSpriteLibrary.addSprite("bg_scroll", "./sprites/bg_scroll.png");
        s_oSpriteLibrary.addSprite("obstacle", "./sprites/obstacle.png");
        d += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites()
    };
    this._onImagesLoaded = function () {
        a++;
        c.refreshLoader(Math.floor(a / d * 100));
        a === d && (c.unload(), !1 === s_bMobile && (s_oSoundTrackSnd = createjs.Sound.play("soundtrack", {
            interrupt: createjs.Sound.INTERRUPT_ANY,
            loop: -1,
            volume: 0.5
        })), this.gotoMenu())
    };
    this._onAllImagesLoaded = function () {};
    this.onAllPreloaderImagesLoaded = function () {
        this._loadImages()
    };
    this.gotoMenu = function () {
        new CMenu;
        b = STATE_MENU
    };
    this.gotoGame = function () {
        h = new CGame({
            hero_x: 150,
            hero_y: CANVAS_HEIGHT / 2,
            hero_down_speed: 3,
            bg_speed: 9,
            time_training: 3E3,
            dist_among_obst: 350,
            obst_height_dist: 250
        });
        b = STATE_GAME;
        $(s_oMain).trigger("game_start")
    };
    this.gotoHelp = function () {
        new CHelp;
        b = STATE_HELP
    };
    this._update = function (a) {
        var c = (new Date).getTime();
        s_iTimeElaps = c - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = c;
        1E3 <= s_iCntTime && (s_iCurFps = s_iCntFps, s_iCntTime -= 1E3, s_iCntFps = 0);
        b === STATE_GAME && h.update();
        s_oStage.update(a)
    };
    s_oMain = this;
    this.initContainer()
}
var s_bMobile, s_bAudioActive = !0,
    s_iCntTime = 0,
    s_iTimeElaps = 0,
    s_iPrevTime = 0,
    s_iCntFps = 0,
    s_iCurFps = 0,
    s_oSoundTrackSnd, s_oDrawLayer, s_oStage, s_oMain, s_oSpriteLibrary;
TEXT_GAMEOVER = "GAME OVER";
TEXT_CONGRATS = "CONGRATULATIONS";
TEXT_SCORE = "SCORE";
TEXT_BEST_SCORE = "BEST SCORE";
TEXT_TIME = "TIME";
TEXT_PLAY = "PLAY";
TEXT_HELP = "TAP THE SCREEN\n TO FLY THE\n PANDA AND \nAVOID THE WOODS";

function CInterface() {
    var a, d, b, c, h, g;
    this._init = function () {
        var f = this;
        c = new createjs.Text(TEXT_SCORE + ": 0", "bold 42px Arial", "#000000");
        c.y = 42;
        s_oStage.addChild(c);
        h = new createjs.Text(TEXT_SCORE + ": 0", "bold 42px Arial", "#07a800");
        h.y = 40;
        s_oStage.addChild(h);
        c.x = CANVAS_WIDTH / 2 + 2;
        h.x = CANVAS_WIDTH / 2;
        c.textAlign = "center";
        h.textAlign = "center";
        g = new CHelpPanel(0, 0, s_oSpriteLibrary.getSprite("bg_help"));
        b = new createjs.Shape;
        b.graphics.beginFill("white").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        b.alpha =
            0.01;
        s_oStage.addChild(b);
        b.on("pressup", function () {
            f._onTapScreen()
        });
        var e = s_oSpriteLibrary.getSprite("but_exit");
        a = new CGfxButton(CANVAS_WIDTH - e.width / 2 - 10, 10 + e.height / 2, e, !0);
        a.addEventListener(ON_MOUSE_UP, this._onExit, this);
        !1 === s_bMobile && (d = new CToggle(CANVAS_WIDTH - 140, 10 + e.height / 2, s_oSpriteLibrary.getSprite("audio_icon"), s_bAudioActive), d.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this))
    };
    this.unload = function () {
        a.unload();
        a = null;
        s_oStage.removeChild(c);
        s_oStage.removeChild(h);
        !1 ===
            s_bMobile && (d.unload(), d = null);
        var f = this;
        b.off("pressup", function () {
            f._onTapScreen()
        });
        s_oStage.removeChild(b);
        g.unload()
    };
    this.refreshScore = function (a) {
        c.text = TEXT_SCORE + ": " + a;
        h.text = TEXT_SCORE + ": " + a
    };
    this._onTapScreen = function () {
        g.unload();
        s_oGame.tapScreen()
    };
    this._onExit = function () {
        s_oGame.onExit()
    };
    this._onAudioToggle = function () {
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    };
    this._init();
    return this
}

function CHero(a, d, b) {
    var c, h, g, f, e;
    this._init = function (a, b, d) {
        g = 0;
        e = new createjs.Bitmap(d);
        e.x = c = a;
        e.y = h = b;
        e.regX = d.width / 2;
        e.regY = d.height / 2;
        s_oStage.addChild(e);
        f = d.height / 2;
        this.idle(20)
    };
    this.unload = function () {
        s_oStage.removeChild(e)
    };
    this.reset = function () {
        g = 0;
        e.x = c;
        e.y = h;
        this.idle(20)
    };
    this.idle = function (a) {
        var b = this;
        createjs.Tween.get(e).to({
            y: e.y + a
        }, 450, createjs.Ease.cubicOut).call(function () {
            b.idle(-1 * a)
        })
    };
    this.start = function () {
        createjs.Tween.removeTweens(e);
        this.moveUp()
    };
    this.moveUp =
        function () {
            createjs.Tween.removeTweens(e);
            createjs.Tween.get(e).to({
                rotation: e.rotation + 0
            }, 450);
            g = 8 * -HERO_DOWN_ACCELLERATION
    };
    this.getBottom = function () {
        return e.y + f
    };
    this.getX = function () {
        return e.x
    };
    this.getY = function () {
        return e.y
    };
    this.getRadius = function () {
        return e.width / 2
    };
    this.getSprite = function () {
        return e
    };
    this.update = function (a) {
        g += HERO_DOWN_ACCELLERATION; - 100 > e.y && (e.y = -100);
        e.y + f + g > a ? (e.y = a - f, s_oGame._gameOver()) : e.y += g
    };
    this._init(a, d, b)
}

function CHelpPanel(a, d, b) {
    var c, h, g, f;
    this._init = function (a, b, d) {
        g = new createjs.Bitmap(d);
        h = new createjs.Text(TEXT_HELP, "normal 36px Arial", "#000000");
        h.textAlign = "left";
        h.x = 142;
        h.y = 442;
        c = new createjs.Text(TEXT_HELP, "normal 36px Arial", "#ffffff");
        c.textAlign = "left";
        c.x = 140;
        c.y = 440;
        f = new createjs.Container;
        f.x = a;
        f.y = b;
        f.addChild(g, h, c);
        s_oStage.addChild(f)
    };
    this.unload = function () {
        s_oStage.removeChild(f)
    };
    this._onExitHelp = function () {
        this.unload();
        s_oGame._onExitHelp()
    };
    this._init(a, d, b)
}

function CGfxButton(a, d, b) {
    var c, h, g;
    this._init = function (a, b, d) {
        c = [];
        h = [];
        g = new createjs.Bitmap(d);
        g.x = a;
        g.y = b;
        g.regX = d.width / 2;
        g.regY = d.height / 2;
        s_oStage.addChild(g);
        this._initListener()
    };
    this.unload = function () {
        g.off("mousedown", this.buttonDown);
        g.off("pressup", this.buttonRelease);
        s_oStage.removeChild(g)
    };
    this.setVisible = function (a) {
        g.visible = a
    };
    this._initListener = function () {
        g.on("mousedown", this.buttonDown);
        g.on("pressup", this.buttonRelease)
    };
    this.addEventListener = function (a, b, d) {
        c[a] = b;
        h[a] = d
    };
    this.buttonRelease = function () {
        g.scaleX = 1;
        g.scaleY = 1;
        c[ON_MOUSE_UP] && c[ON_MOUSE_UP].call(h[ON_MOUSE_UP])
    };
    this.buttonDown = function () {
        g.scaleX = 0.9;
        g.scaleY = 0.9;
        c[ON_MOUSE_DOWN] && c[ON_MOUSE_DOWN].call(h[ON_MOUSE_DOWN])
    };
    this.setPosition = function (a, b) {
        g.x = a;
        g.y = b
    };
    this.setX = function (a) {
        g.x = a
    };
    this.setY = function (a) {
        g.y = a
    };
    this.getButtonImage = function () {
        return g
    };
    this.getX = function () {
        return g.x
    };
    this.getY = function () {
        return g.y
    };
    this._init(a, d, b);
    return this
}

function CGame(a) {
    var d = !0,
        b = -1,
        c, h, g, f, e, l, k, p, m;
    this._init = function () {
        h = c = 0;
        f = new createjs.Bitmap(s_oSpriteLibrary.getSprite("bg_game"));
        s_oStage.addChild(f);
        k = new CObstacle(s_oSpriteLibrary.getSprite("obstacle"));
        l = new CScrollingBg(s_oSpriteLibrary.getSprite("bg_scroll"));
        e = new CHero(HERO_START_X, HERO_START_Y, s_oSpriteLibrary.getSprite("hero"));
        p = new CInterface;
        b = GAME_STATE_BEFORE_START
    };
    this.unload = function () {
        s_oStage.removeChild(f);
        l.unload();
        k.unload();
        e.unload();
        m && m.unload();
        p.unload()
    };
    this.tapScreen =
        function () {
            b !== GAME_STATE_GAME_OVER && (createjs.Sound.play("tap"), d ? (d = !1, e.start(), g = 0, b = GAME_STATE_TRAINING) : e.moveUp())
    };
    this._resetLevel = function () {
        c = 0;
        p.refreshScore(c);
        e.reset();
        k.restartLevel();
        d = !0;
        b = GAME_STATE_BEFORE_START
    };
    this.collisionFound = function () {
        b = GAME_STATE_GAME_OVER
    };
    this.increaseScore = function () {
        c++;
        p.refreshScore(c)
    };
    this._gameOver = function () {
        b = -1;
        c > h && (h = c);
        m = CEndPanel(s_oSpriteLibrary.getSprite("msg_box"));
        m.show(c, h)
    };
    this.onRestartGame = function () {
        this._resetLevel()
    };
    this.onExit =
        function () {
            this.unload();
            s_oMain.gotoMenu();
            $(s_oMain).trigger("restart")
    };
    this.update = function () {
        switch (b) {
        case GAME_STATE_BEFORE_START:
            l.update(BG_SPEED);
            break;
        case GAME_STATE_TRAINING:
            g += s_iTimeElaps;
            g > TIME_TRAINING ? (g = 0, b = GAME_STATE_START) : (e.update(CANVAS_HEIGHT - l.getHeight()), l.update(BG_SPEED));
            break;
        case GAME_STATE_START:
            e.update(CANVAS_HEIGHT - l.getHeight());
            l.update(BG_SPEED);
            k.update(e.getSprite(), BG_SPEED);
            break;
        case GAME_STATE_GAME_OVER:
            e.update(CANVAS_HEIGHT - l.getHeight())
        }
    };
    s_oGame =
        this;
    HERO_START_X = a.hero_x;
    HERO_START_Y = a.hero_y;
    HERO_DOWN_ACCELLERATION = a.hero_down_speed;
    BG_SPEED = a.bg_speed;
    TIME_TRAINING = a.time_training;
    DIST_AMONG_OBSTACLES = a.dist_among_obst;
    OBSTACLE_HEIGHT_DIST = a.obst_height_dist;
    this._init()
}
var s_oGame;