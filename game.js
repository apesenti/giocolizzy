// ============================================
// ROMANTIC GIFT GAME - New Layout + Pixel Style
// ============================================

// ============================================
// EDITABLE DATA: 6 Romantic Messages
// ============================================
const ENVELOPE_DATA = [
    { id: 1, text: "Apri questo quando ti manco tanto da sentire di volermi raccontare, per la millesima volta, una storia che ho già sentito. Se hai voglia di aggiungere dettagli e dettagli fino a mettere alla prova le mie capacità di ascolto e il mio ADHD. Aprilo se hai voglia di dirmi infine: “Mi stai ascoltando?”. Aprilo quando vuoi ricordarmi per la millesima volta della mia cover del capibara e del fatto che non la metto.", package: 1 },
    { id: 2, text: "Apri questo se hai voglia di mangiare insieme a me, magari con un piccolo calicino (o una bottiglia). Aprilo se hai voglia di guardarmi con quello sguardo da mangiapatatine che ormai ha già deciso la sua prossima preda. Se hai voglia di fare una maschera o obbligarmi a bere il tè. Accendi l'oggetto e lascia che ti faccia compagnia, così che in parte ci sia anche io.", package: 2 },
    { id: 3, text: "Apri questo se semplicemente sei giù: oggi il Robi ha rotto le balle, le tue amiche ti hanno risposto male o se hai litigato con tua mamma (no, quest'ultima non vale). Aprilo se vorresti solo sfogarti un po' su di me, anche se probabilmente lo hai già fatto in chat. Prova a usare questo come tappo del tuo mondo fantastico, spero ti faccia sorridere quando dovrai chiudere il tuo momento di pace in una realtà tutta tua.", package: 3 },
    { id: 4, text: "Apri questo se hai particolarmente voglia di noi, di quello che siamo diventati e di ciò che vorremmo essere. Aprilo quando pensi a noi come famiglia pronta a combattere tutto e tutti. Che questa sfida porti allo sbocciare di un sentimento ancora più forte e intenso. Ti amo tanto, sei il mio sole.", package: 4 },
    { id: 5, text: "Apri questo se vuoi sentirti a casa: comoda, tranquilla e rilassata. La tua assenza rende tutto vuoto e vivere da solo senza il tuo supporto da vicino è un macigno. Vorrei vederti scorrazzare, cantare (forse no), prendere caldo davanti alla stufa, poltrire sul divano, passare l'aspirapolvere e mangiare patatine. Vorrei solamente essere con te, perché con te sono a casa. Questo tienilo per casa, che sia la mia (anche tua) o la nostra futura è indifferente, però vorrei che questo sia il nostro simbolo di casa.", package: 5 },
    { id: 6, text: "APRIRE SOLO AL NOSTRO ANNIVERSARIO", package: 6 }
];

// ============================================
// PERSISTENCE: LocalStorage Management
// ============================================
const STORAGE_KEY = "giftGameOpened";
// Anniversario (mese 1-12)
const ANNIVERSARY = { day: 21, month: 2 }; // esempio: 21 Febbraio
const ANNIVERSARY_ENVELOPE_ID = 6;


function getOpenedEnvelopes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveOpenedEnvelope(envelopeId) {
    const opened = getOpenedEnvelopes();
    if (!opened.includes(envelopeId)) {
        opened.push(envelopeId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(opened));
    }
}

function clearProgress() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}
function isAnniversaryToday() {
    const now = new Date();
    const d = now.getDate();
    const m = now.getMonth() + 1; // 0-11 -> 1-12
    return d === ANNIVERSARY.day && m === ANNIVERSARY.month;
  }
  
  function canOpenEnvelope(envelopeId) {
    if (envelopeId === ANNIVERSARY_ENVELOPE_ID) {
      return isAnniversaryToday();
    }
    return true;
  }
// ============================================
// ADMIN RESET: Ctrl+Shift+R
// ============================================
let resetKeyPressed = { ctrl: false, shift: false, r: false };

document.addEventListener("keydown", (e) => {
    if (e.key === "Control") resetKeyPressed.ctrl = true;
    if (e.key === "Shift") resetKeyPressed.shift = true;
    if (e.key === "r" || e.key === "R") resetKeyPressed.r = true;

    if (resetKeyPressed.ctrl && resetKeyPressed.shift && resetKeyPressed.r) {
        e.preventDefault();
        const confirmed = confirm("Resettare tutto il progresso? (Solo per admin)");
        if (confirmed) {
            clearProgress();
            const resetIndicator = document.getElementById("admin-reset");
            resetIndicator.classList.remove("hidden");
            setTimeout(() => resetIndicator.classList.add("hidden"), 2000);
        }
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "Control") resetKeyPressed.ctrl = false;
    if (e.key === "Shift") resetKeyPressed.shift = false;
    if (e.key === "r" || e.key === "R") resetKeyPressed.r = false;
});

// ============================================
// MODAL SYSTEM
// ============================================
const modal = document.getElementById("envelope-modal");
const modalMessage = document.getElementById("modal-message");
const flipButton = document.getElementById("flip-button");
const closeButton = document.getElementById("close-button");

let currentEnvelope = null;

function showModal(envelopeData, isOpened, isLocked = false) {
    currentEnvelope = envelopeData;
  
    if (isLocked) {
      modalMessage.innerHTML = `
        <div>
          <p style="font-size: 1.5rem;">🔒</p>
          <p>${envelopeData.text}</p>
        </div>
      `;
      flipButton.style.display = 'none';
    }
  
    else if (isOpened) {
      modalMessage.innerHTML = `
        <div>
          <p style="margin-bottom: 0.5rem;"><strong>Già aperto ✓</strong></p>
          <p>${envelopeData.text}</p>
          <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #1b5e20;">
            Pacco numero ${envelopeData.package} già rivelato
          </p>
        </div>
      `;
      flipButton.style.display = 'none';
    }
  
    else {
      modalMessage.textContent = envelopeData.text;
      flipButton.style.display = 'block';
    }
  
    modal.classList.remove('hidden');
  }

function hideModal() {
    modal.classList.add("hidden");
    currentEnvelope = null;
}

function flipEnvelope() {
    
    if (!currentEnvelope) return;
    // blocco anniversario (extra safety)
if (!canOpenEnvelope(currentEnvelope.id)) {
    modalMessage.innerHTML = `
      <div>
        <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">⛔</p>
        <p style="font-weight: bold; font-size: 1.1rem;">
          Questo bigliettino si può aprire solo il giorno del nostro anniversario 💚
        </p>
      </div>
    `;
    flipButton.style.display = "none";
    return;
  }

    modalMessage.classList.add("flip-animation");

    setTimeout(() => {

    let contentHTML;

    // caso speciale busta 6
    if (currentEnvelope.id === 6) {
        contentHTML = `
        <div>
          <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔗</p>
          <p style="font-weight: bold; font-size: 1.2rem;">
            APRI QUESTO LINK
          </p>
          <a href="https://www.tuosito.it" target="_blank"
             style="color:#2ecc71; font-weight:bold; text-decoration:underline;">
             www.tuosito.it
          </a>
        </div>
        `;
    } else {
        contentHTML = `
        <div>
          <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">💚</p>
          <p style="font-weight: bold; font-size: 1.3rem;">
            Apri il pacco numero ${currentEnvelope.package}
          </p>
        </div>
        `;
    }

    modalMessage.innerHTML = contentHTML;
    modalMessage.classList.remove("flip-animation");

    saveOpenedEnvelope(currentEnvelope.id);
    if (window.gameScene?.sfxOpen) window.gameScene.sfxOpen.play();

    if (window.gameScene) {
        markEnvelopeOpened(currentEnvelope.id);
    }

    flipButton.style.display = "none";

}, 250);
}

flipButton.addEventListener("click", flipEnvelope);
closeButton.addEventListener("click", hideModal);

modal.addEventListener("click", (e) => {
    if (e.target === modal) hideModal();
});

// ============================================
// PHASER CONFIG (Pixel, camera, responsive)
// ============================================
const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 800;

const config = {

    type: Phaser.AUTO,
    parent: "game-container",
    pixelArt: true,
    roundPixels: true,
    backgroundColor: "#dff7e8",
    render: {
        antialias: false,
        pixelArt: true
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 700
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);
let gameScene = null;

// ============================================
// SCENE
// ============================================

function preload() { // Sfondo (solo cielo) 
    this.load.image("bg_sky", "assets/bg_sky.png"); // Tile unica lunga per pavimento e piattaforme (carica tile.png) 
    this.load.image("tile", "assets/tile.png"); // Notes (closed/open) 
    this.load.image("note", "assets/note.png");
    this.load.image("note_open", "assets/note_open.png"); // Cat (idle image) + optional walk spritesheet 
    this.load.image("cat_idle", "assets/cat_idle.png"); // Se hai uno spritesheet: 4-8 frame orizzontali // Cambia frameWidth/frameHeight in base al tuo asset 
    this.load.spritesheet("cat_walk", "assets/cat_walk.png", { frameWidth: 64, frameHeight: 64 }); // --- Placeholder per immagini sfondo (quadrati bianchi da sostituire) 
    this.load.image("quadro1", "assets/quadro1.png");
this.load.image("quadro2", "assets/quadro2.png");
this.load.image("quadro3", "assets/quadro3.png");
this.load.audio("sfx_open", "assets/sfx_open.mp3");
this.load.audio("sfx_jump", "assets/sfx_jump.mp3");
    const g = this.add.graphics(); 
    g.fillStyle(0xffffff, 1); 
    g.fillRoundedRect(0, 0, 64, 64, 8); 
    g.lineStyle(2, 0x1f6b3a, 1); 
    g.strokeRoundedRect(0, 0, 64, 64, 8); 
    g.fillStyle(0xff4d6d, 1); 
    g.fillCircle(32, 32, 10); 
    g.generateTexture("bg_placeholder", 64, 64); 
    g.destroy(); 

    // Pavimento prato (rettangolare, ripetibile) 
    const grass = this.add.graphics(); 
    grass.fillStyle(0x7cb342, 1); 
    grass.fillRect(0, 0, 64, 32); 
    grass.lineStyle(4, 0x2e7d32, 1); 
    grass.lineBetween(0, 4, 64, 4); 
    grass.generateTexture("grass_floor", 64, 32); 
    grass.destroy(); 

    // 1x1 solid texture (usata solo per collisioni invisibili) 
    const s = this.add.graphics(); 
    s.fillStyle(0xffffff, 1); 
    s.fillRect(0, 0, 1, 1); 
    s.generateTexture("solid", 1, 1); 
    s.destroy(); 
}

function create() {
   
    gameScene = this;
    window.gameScene = this;
    this.sfxOpen = this.sound.add("sfx_open", { volume: 0.6 });
this.sfxJump = this.sound.add("sfx_jump", { volume: 0.35 });
this.input.once("pointerdown", () => {
    this.sound.unlock();
  });
    // ---- WORLD & CAMERA
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  
    // ---- SFONDO
    const sky = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, "bg_sky")
  .setOrigin(0, 0);

sky.setScrollFactor(0.1);
sky.setDepth(-100);
  
    // ---- COSTANTI
    const TILE_W = 64;
    const TILE_H = 32;
    const GRASS_H = 128;
  
    // ---- SOLIDI (collisioni vere)
    const solids = this.physics.add.staticGroup();
    this.solids = solids;
  
    // ------------------
    // PAVIMENTO PRINCIPALE
    // ------------------
    const floorWidth = WORLD_WIDTH;
    const floorY = WORLD_HEIGHT - GRASS_H;
  
    // Visual prato (grafica)
    this.add.image(floorWidth / 2, floorY + GRASS_H / 2, "grass_floor")
      .setDisplaySize(floorWidth, GRASS_H)
      .setOrigin(0.5, 0.5);
  
// --- PAVIMENTO FISICO (floorHit) + DEBUG VISIBILE
const floorHit = solids.create(floorWidth / 2, floorY + GRASS_H / 2, "solid")
  .setOrigin(0.5, 0.5);

floorHit.setDisplaySize(floorWidth, GRASS_H);
floorHit.refreshBody();
console.log("floor has body?", !!floorHit.body, floorHit.body);


// DEBUG: rendilo visibile per controllare dov'è
floorHit.setVisible(false);
floorHit.setAlpha(0.35);
floorHit.setTint(0xff0000);
floorHit.setDepth(9999);

console.log("FLOOR display:", floorHit.displayWidth, floorHit.displayHeight, "pos:", floorHit.x, floorHit.y);
console.log("FLOOR body:", floorHit.body.width, floorHit.body.height, "bodypos:", floorHit.body.x, floorHit.body.y);
    // ------------------
    // PIATTAFORME
    // ------------------
    const makePlatform = (startX, y, tileCount) => {
      const width = tileCount * TILE_W;
  
      // Hitbox unica invisibile
      const hit = solids.create(startX + width / 2, y + TILE_H / 2, "solid").setOrigin(0.5, 0.5);
      hit.setScale(width, TILE_H);
      hit.refreshBody();
      hit.body.checkCollision.down = true;
hit.body.checkCollision.left = true;
hit.body.checkCollision.right = true;
      hit.setVisible(false); 
      // Tile estetici (solo grafica)
      for (let i = 0; i < tileCount; i++) {
        const x = startX + i * TILE_W;
        this.add.image(x + TILE_W / 2, y + TILE_H / 2, "tile").setOrigin(0.5, 0.5);
      }
    };
  
    makePlatform(64, 576, 4);
    makePlatform(320, 512, 4);
    makePlatform(512, 448, 5);
    makePlatform(768, 384, 4);
    makePlatform(960, 448, 4);
    makePlatform(1152, 512, 5);
  
    // ------------------
    // CAT
    // ------------------
    this.cat = this.physics.add.sprite(100, floorY - 40, "cat_idle");
    this.cat.setCollideWorldBounds(true);
    this.cat.setBounce(0.0);
  
    this.cat.body.setSize(48, 56);
    this.cat.body.setOffset(8, 8);
    this.cat.body.setMaxVelocity(300, 1000);
    this.cat.body.setSlideFactor(0, 1);
    
    
    this.cat.body.setAllowGravity(true);
    this.cat.body.setImmovable(false);
    this.cat.body.checkCollision.up = false;
  
    // Collider gatto SOLO con solids
    this.physics.add.collider(this.cat, this.solids);
  
    // ---- CAMERA FOLLOW
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.startFollow(this.cat, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(80, 60);
  
    // ---- CONTROLLI
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  
    // Evita scroll pagina + focus canvas
    this.input.keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.SPACE,
      Phaser.Input.Keyboard.KeyCodes.E
    ]);
    this.game.canvas.setAttribute("tabindex", "0");
    this.game.canvas.focus();
    this.input.on("pointerdown", () => this.game.canvas.focus());
  
    // ------------------
    // NOTES
    // ------------------
    const openedEnvelopes = getOpenedEnvelopes();
    this.openedEnvelopes = openedEnvelopes;
  
    this.envelopes = [];
    this.envelopeData = [];
  
    const envelopePositions = [
      { x: 192, y: 536 },
      { x: 448, y: 472 },
      { x: 640, y: 408 },
      { x: 896, y: 344 },
      { x: 1088, y: 408 },
      { x: 1280, y: 472 }
    ];
  
    ENVELOPE_DATA.slice(0, 6).forEach((data, index) => {
      const pos = envelopePositions[index];
      const isOpened = openedEnvelopes.includes(data.id);
  
      const note = this.physics.add.sprite(pos.x, pos.y, isOpened ? "note_open" : "note");
      note.setImmovable(true);
      note.body.setAllowGravity(false);
      note.body.setSize(48, 48);
  
      note.envelopeId = data.id;
      note.envelopeData = data;
      note.isOpened = isOpened;
  
      if (isOpened) {
        const label = this.add.text(pos.x, pos.y + 36, "Aperto", {
          fontSize: "16px",
          fontStyle: "bold",
          color: "#f4fff7",
          stroke: "#1f6b3a",
          strokeThickness: 3
        });
        label.setOrigin(0.5);
        note.label = label;
      }
  
      this.envelopes.push(note);
      this.envelopeData.push(data);
    });
  
    // ---- INTERAZIONE
    this.nearbyEnvelope = null;
  
    this.hintText = this.add.text(0, 0, "Premi E", {
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#1f6b3a",
      strokeThickness: 5,
      resolution: 1
    });
    this.hintText.setVisible(false);
    this.hintText.setDepth(999);
  
    this.physics.add.overlap(this.cat, this.envelopes, (cat, envelope) => {
      this.nearbyEnvelope = envelope;
    });
  
    const quadri = [
        { x: 180, y: 140, key: "quadro1", s: 1.0 },
        { x: 520, y: 110, key: "quadro2", s: 0.9 },
        { x: 920, y: 160, key: "quadro3", s: 1.1 },
      ];
      
      quadri.forEach(q => {
        this.add.image(q.x, q.y, q.key)
          .setOrigin(0.5)
          .setScale(q.s)
          .setAlpha(0.95)
          .setScrollFactor(0.2) // parallax leggero; metti 1 se vuoi “attaccati al mondo”
          .setDepth(-50);       // davanti al cielo, dietro al gameplay
      });
    // ---- UI
    this.progressText = this.add.text(40, 30, `${openedEnvelopes.length}/6`, {
      fontSize: "20px",
      color: "#1f6b3a",
      fontStyle: "bold",
      stroke: "#ffffff",
      strokeThickness: 4,
      resolution: 1
    }).setScrollFactor(0).setDepth(1000);
  
    this.startHint = this.add.text(WORLD_WIDTH / 3, 610, "Frecce: muovi · Spazio: salta · E: leggi\nAd ogni biglietto è collegata una specifica situazione,\ngira i biglietti con cura e parsimonia. Non essere troppo avida." ,{
      fontSize: "25px",
      color: "#2e7d32",
      fontStyle: "bold",
      stroke: "#ffffff",
      strokeThickness: 3,
      resolution: 1
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
    this.time.delayedCall(10000, () => {
      this.tweens.add({ targets: this.startHint, alpha: 0, duration: 800 });
    });
  
    // ---- POSTUPDATE
    this.events.on("postupdate", () => {
      if (this.nearbyEnvelope) {
        const d = Phaser.Math.Distance.Between(this.cat.x, this.cat.y, this.nearbyEnvelope.x, this.nearbyEnvelope.y);
        if (d > 70) this.nearbyEnvelope = null;
      }
      if (this.progressText) {
        this.progressText.setText(`${this.openedEnvelopes.length}/6`);
      }
    });
  }
  
  function fixCatBody(cat) {
    cat.body.setSize(48, 56);
    cat.body.setOffset(8, 8);
  }


    function update() {
        if (!this.cat || !this.cat.body) return;

        const cat = this.cat;

        // Feel
        const SPEED = 150;
        const JUMP_FORCE = 480;
        const JUMP_CUT = 0.55;

        // --- MOVIMENTO ORIZZONTALE
        if (this.cursors.left.isDown) {
            cat.setVelocityX(-SPEED);
            cat.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            cat.setVelocityX(SPEED);
            cat.setFlipX(false);
        } else {
            cat.setVelocityX(0);
        }

        // --- GROUND CHECK
        const onGround = cat.body.blocked.down || cat.body.touching.down;

        // --- COYOTE TIME
        if (this.coyoteTimer === undefined) this.coyoteTimer = 0;
        if (onGround) this.coyoteTimer = 100;
        else this.coyoteTimer -= (this.game.loop.delta || 16);

        const canJump = this.coyoteTimer > 0;

        // --- JUMP (UP o SPACE)
        if ((this.cursors.up.isDown || this.spaceKey.isDown) && canJump) {
            cat.setVelocityY(-JUMP_FORCE);
            this.coyoteTimer = 0;
            if (this.sfxJump) this.sfxJump.play();
        }

        // --- JUMP CUT (se molli il tasto mentre sali, salto più corto)
        if (!this.cursors.up.isDown && !this.spaceKey.isDown && cat.body.velocity.y < 0) {
            cat.setVelocityY(cat.body.velocity.y * JUMP_CUT);
        }

        // --- SWITCH TEXTURE IDLE/WALK (ANTI-FLICKER)
        // Non usare onGround per lo switch, perché sui bordi delle tile può oscillare.
        if (this.walkHoldMs === undefined) this.walkHoldMs = 0;

        const movingHoriz = Math.abs(cat.body.velocity.x) > 5;

        if (movingHoriz) {
            this.walkHoldMs = 150; // ms: più alto = meno flicker
        } else {
            this.walkHoldMs = Math.max(0, this.walkHoldMs - (this.game.loop.delta || 16));
        }

        const shouldWalk = movingHoriz || this.walkHoldMs > 0;

      /*  if (shouldWalk) {
            if (cat.texture.key !== "cat_walk") cat.setTexture("cat_walk");
            fixCatBody(cat);
        } else {
            if (cat.texture.key !== "cat_idle") cat.setTexture("cat_idle");
            fixCatBody(cat);
        }*/

        // --- INTERAZIONE BIGLIETTINO
        if (this.nearbyEnvelope) {
            this.hintText.setVisible(true);
            this.hintText.x = cat.x - 40;
            this.hintText.y = cat.y - 58;

            if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
                const envId = this.nearbyEnvelope.envelopeId;

                // blocco anniversario
                if (!canOpenEnvelope(envId)) {
                    showModal(
                      { id: envId, text: "Questo bigliettino si può aprire solo il giorno del nostro anniversario 💚", package: "?" },
                      false,
                      true
                    );
                    return;
                  }
                const isOpened = this.openedEnvelopes.includes(this.nearbyEnvelope.envelopeId);
                showModal(this.nearbyEnvelope.envelopeData, isOpened);
            }
        } else {
            this.hintText.setVisible(false);
        }
    }


    // ============================================
    // Update envelope state (called from modal)
    // ============================================
    function markEnvelopeOpened(envelopeId) {
        if (!window.gameScene) return;

        const scene = window.gameScene;
        const envelope = scene.envelopes.find((e) => e.envelopeId === envelopeId);

        if (envelope && !envelope.isOpened) {
            envelope.setTexture("note_open");
            envelope.isOpened = true;

            const label = scene.add.text(envelope.x, envelope.y + 36, "Aperto", {
                fontSize: "16px",
                color: "#c8ffd1",
                fontStyle: "bold",
                stroke: "#0b3d14",
                strokeThickness: 3
            });
            label.setOrigin(0.5);
            envelope.label = label;

            scene.openedEnvelopes.push(envelopeId);
        }
    }

    window.markEnvelopeOpened = markEnvelopeOpened;
