# SPIRELINE — Harakat Kontrolleri (Unreal Engine 5.4, C++)

GDD 2-bo'lim (harakat mexanikasi) va 5.1–5.2-bo'limlarning (FSM, muhit skaneri)
ishlaydigan C++ realizatsiyasi.

Dvigatel tanlovi: GDD **1.1-jadval** birlamchi dvigatel sifatida Unreal Engine 5.4 ni
belgilagan, shuning uchun kod shu dvigatel uchun yozilgan.

---

## Fayl tuzilishi

```
unreal/Source/Spireline/
├── Spireline.Build.cs                          # modul qoidalari
├── Public/
│   ├── SpirelineMovementTypes.h                # FSM holatlari, probe natijasi, probe maskasi
│   ├── SpirelineMovementTuning.h               # ⭐ BARCHA sonlar (DataAsset)
│   ├── SpirelineTraversalProbe.h               # muhit skaneri (raycast/boxcast)
│   ├── SpirelineMovementComponent.h            # ⭐ FSM yadrosi
│   └── SpirelineCharacter.h                    # input + kamera
└── Private/
    ├── SpirelineMovementTuning.cpp             # sakrash/gap matematikasi
    ├── SpirelineTraversalProbe.cpp             # 6 ta probe + debug chizmalar
    ├── SpirelineMovementComponent.cpp          # 8 holat, Phys*, inersiya, coyote/buffer
    └── SpirelineCharacter.cpp                  # FOV + roll
```

## Arxitektura bir qarashda

```
ASpirelineCharacter          (input, kamera)
        │  OnJumpPressed() / OnSlidePressed() / MoveForward()
        ▼
USpirelineMovementComponent  (UCharacterMovementComponent vorisi)
        │
        ├── TickComponent()  1) taymerlar
        │                    2) qo'nishni qayd qilish (Roll / Hard Landing)
        │                    3) EvaluateTransitions()  ← FSM
        │                    4) tezlik chegaralari
        │                    5) Super::TickComponent()  ← UE harakatni bajaradi
        │
        └── PhysCustom()  →  PhysSlide / PhysWallRun / PhysVault / PhysLedgeClimb / PhysRoll
                             (har bir harakatning o'z fizikasi)

USpirelineTraversalProbe     (har kadrda 1 marta skanerlaydi, natijani keshga yozadi)
```

**Muhim tamoyil:** harakat kodi hech qachon o'zi `LineTrace` urmaydi. Hamma muhit
ma'lumoti `FTraversalProbeResult` ichida. Shu sabab `spire.hud 2` yoqilganda
"nega bu harakat ishlamadi?" savoliga bitta ekranda javob topiladi.

---

## O'rnatish (5 qadam)

1. `unreal/Source/` papkasini loyihangizning `Source/` iga ko'chiring.
2. `<Loyiha>.uproject` → `Modules` ro'yxatiga `Spireline` modulini qo'shing
   (namuna `Spireline.Build.cs` fayli boshida).
3. **Kolliziya kanali:** `Project Settings → Collision → Trace Channels` da
   `Spireline_Traversal` kanalini yarating (Default: Ignore). Level geometriyasi va
   harakatlanadigan obyektlar uchun shu kanalga `Block` javobini bering.
4. **Blueprint:** `BP_SpirelineCharacter` yaratib (ota-klass `ASpirelineCharacter`),
   harakat komponentidagi `Tuning` maydoniga `DA_MovementTuning`
   (`USpirelineMovementTuning` DataAsset) ni biriktiring va
   `TraversalChannel = Spireline_Traversal` qilib belgilang.
5. **Input:** `Project Settings → Input` da quyidagi nomlar bilan axis/action yarating:

| Nom | Tur | Tavsiya etilgan tugma |
| --- | --- | --- |
| `MoveForward` | Axis | W / S · chap stik Y |
| `MoveRight` | Axis | A / D · chap stik X |
| `Turn` | Axis | Sichqoncha X · o'ng stik X |
| `LookUp` | Axis | Sichqoncha Y · o'ng stik Y |
| `Jump` | Action | Space · A (gamepad) |
| `Slide` | Action | Left Ctrl / C · B (gamepad) |

> `GravityScale` ni **1.0 da qoldiring** — gravitatsiya `Tuning->GravityMultiplier`
> orqali qo'llanadi (aks holda ikki marta ko'paytiriladi).

---

## FSM: holatlar va ustuvorlik

| Ustuvorlik | Holat | Kirish sharti | Chiqishda tezlik |
| --- | --- | --- | --- |
| 60 | **Roll** | Yerga tegdi + tezlik ≥ 9 m/s + tushish ≥ 3.5 m | ×0.92 (kirishda qo'llanadi) |
| 58 | **Vault** | Havoda + to'siq 0.40–1.25 m + Clearance bo'sh + forward dot > 0.5 | ×0.92 |
| 56 | **LedgeClimb** | Havoda + qirra 1.25–2.40 m (ko'krak to'siq, bosh erkin) | ×0.70 |
| 40 | **WallRun** | Havoda + bir tomonda devor (≤25° og'ish) + tezlik ≥ 9 m/s | sakrab chiqilsa ×1.05, aks holda ×0.80 |
| 30 | **Slide** | Yerda + Slide tugmasi + tezlik ≥ 6 m/s | **×0.90 (inersiya)** |
| 20 | **Fall** | Havoda (Coyote Time shu holatda ishlaydi) | — |
| 12 | **Sprint** | Yerda + tezlik ≥ 7.1 m/s | — |
| 10 | **Idle** | Yerda, boshqa shartlar bajarilmagan | — |

**"Committed" harakatlar:** Vault / LedgeClimb / Roll / Slide / WallRun o'z taymeri
tugamaguncha bekor qilinmaydi — o'yinchi yarim yo'lda "tushib qolmaydi".

## Muhit skaneri (probe) → qaror

| Probe | Shakl | Nima beradi | FSM qarori |
| --- | --- | --- | --- |
| Ground | Kapsula sweep, pastga 0.35 m | normal + qiyalik burchagi | Yerda / havoda (≤46° yurish mumkin) |
| Step | Nur, tizza balandligi, 0.55 m | to'siq ustki sathi | Avtomatik step-up (≤0.45 m) |
| Walls | 3 nur × 2 tomon, 0.55 m | o'rtacha normal, og'ish burchagi | **WallRun** |
| Obstacle | Box sweep, 1.10 m | to'siq balandligi (oyoq sathidan) | **Vault** (40–125 sm) |
| Clearance | Box sweep, to'siq ustidan | bo'sh joy bormi | Vault joiz / joiz emas |
| Ledge | 2 nur (ko'krak 1.20 m, bosh 1.70 m) | qirra balandligi | **LedgeClimb** (125–240 sm) |
| Landing | 3 kapsula sweep, pastga | qo'nish nuqtasi + tushish balandligi | **Roll** / Hard Landing |

**Vault va Mantle farqi** — aynan `ObstacleHeight` soni bilan hal qilinadi:

```
ObstacleHeight ∈ [40, 125] sm  →  VAULT        (yuqoridan sakrab o'tish)
ObstacleHeight ∈ [125, 240] sm →  LEDGE CLIMB  (ilashib chiqish / mantle)
ObstacleHeight > 240 sm        →  hech narsa (devor, WallRun yoki Fall)
```

## Coyote Time va Jump Buffering

```cpp
// 1) Yerdan chiqishda oyna ochiladi (ExitState):
if (IsGroundedState(OldState) && !IsMovingOnGround())
    CoyoteTimer = Tuning->CoyoteTime;      // 0.15 s

// 2) Sakrash tugmasi bosilganda niyat yoziladi (OnJumpPressed):
JumpBufferTimer = Tuning->JumpBufferTime;  // 0.10 s

// 3) Har kadrda "niyat + imkoniyat" birlashtiriladi (TryConsumeJump):
if (JumpBufferTimer > 0 && (IsMovingOnGround() || CoyoteTimer > 0 || bIsWallRunning))
    DoJump();
```

Natija: o'yinchi platformadan chiqib ketgandan keyin **0.15 sekund** ichida sakrasa —
sakraydi; platformaga tegishdan **0.10 sekund** oldin bosgan bo'lsa — ham sakraydi.

---

## Kod ko'rigida topilgan va tuzatilgan xatolar

Kod yozilgach butun FSM yadrosi qayta ko'zdan kechirildi. Uchta haqiqiy xato
aniqlandi va tuzatildi — ular sinovdan o'tmagan kodda eng ko'p uchraydigan
toifadagi muammolar:

**1. Taymer ikki marta kamayishi (`Vault` / `LedgeClimb` yarim vaqtda tugardi).**
`UpdateTimers()` ham, `PhysVault()` / `PhysLedgeClimb()` ham taymerni kamaytirardi.
Natijada 0.28–0.42 sekundlik vault ~0.15–0.21 sekundda tugab, o'yinchi to'siq
ustiga "tashlanib" qolardi. Endi taymer faqat `UpdateTimers()` da boshqariladi —
u har kadr, har qanday substep holatida ham kafolatlangan ishlaydi ("abadiy
qotib qolish" xavfi yo'q).

**2. `MOVE_Custom` paytida yer aloqasi yo'qolishi.** UE'ning `IsMovingOnGround()`
funksiyasi faqat `MOVE_Walking` / `MOVE_NavWalking` uchun `true` qaytaradi. Slide,
Roll, Vault va LedgeClimb — hammasi `MOVE_Custom` rejimida ishlaydi, yaʼni FSM
ularni "havoda" deb hisoblardi:

- har Roll tugagach bir kadr **Fall** holatiga o'tib, qo'nish effektlari qayta
  ishga tushardi;
- slayddan chiqishda `ExitState` yolg'on **coyote oynasi** ochardi.

Yechim: "yerga bog'liq custom faza" ekanligi aniq bo'lganda yer aloqasi
`Probe.bGrounded` dan olinadi (`EvaluateTransitions()`). Bu arxitektura tamoyiliga
ham mos: skaner harakat rejimidan qat'i nazar har kadr yangilanadi va harakat
kodi o'zi trace urmaydi.

**3. Sirpanish ishqalanishi fizikaviy noto'g'ri qo'llangan.** `SlideFriction = 0.08`
(literal μ) *eksponensial so'nish* sifatida ishlatilgan edi (`×10` ko'paytirgich
bilan) — bu 11 m/s da **8.8 m/s²** tormoz beradi va eng uzun slayd tezlikni
11 → 3.1 m/s gacha yo'q qilardi. GDD 2.4 jadvali esa slayd chiqishida ×0.90
saqlanishni va'da qiladi. Endi μ fizik ma'nosida ishlatiladi: `a = μ · g`
(0.08 × 19.6 = **1.57 m/s²**).

| Holat | Kirish | Eng uzun slayd (1.6 s) | Chiqish (×0.90) |
| --- | --- | --- | --- |
| Nishab 0° | 11.0 m/s | 8.5 m/s | **7.65 m/s** |
| Nishab 15° | 11.0 m/s | ~11.3 m/s (nishab +1.78 m/s²) | **10.2 m/s** |

Shu bilan birga Roll`dagi 2.0/s so'nish ham olib tashlandi: roll momentumni
saqlaydi, uning yagona narxi kirishdagi **×0.92** (GDD 2.4-jadval) — aks holda
0.55 sekundda tezlikning 67% i yo'qolar va "flow" uzilardi.

**Qo'shimcha (jismoniy tozalik):** `SetSlideCapsule()` da amallar tartibi
kapsulaning polga bir kadr bo'lsa ham kirib ketmasligi uchun yo'nalishga qarab
tanlanadi (kattalashishda avval aktyor ko'tariladi, kichrayishda avval kapsula
kichraytiriladi).

---

## GDD bilan muvofiqlik

Foydalanuvchi topshirig'ida ko'rsatilgan Coyote Time **0.15 s** va Jump Buffer
**0.10 s** qiymatlari GDD 2.5-bo'limidagi dastlabki sonlardan (0.120 / 0.150) farq
qilgan edi. **Topshiriq ustuvor**, shuning uchun kod shu qiymatlarni ishlatadi — va
bitta haqiqat manbai buzilmasligi uchun **hujjat ham kodga moslashtirildi**:

| Joy | Oldin | Endi |
| --- | --- | --- |
| `src/sections/S2Movement.tsx` (Jadval 2.6/2.7) | 0.120 / 0.150 s | **0.150 / 0.100 s** |
| `src/sections/S5Tech.tsx` (parametr jadvali) | 0.120 / 0.150 s | **0.150 / 0.100 s** |
| `src/components/MovementCalculator.tsx` | 7 / 9 kadr | **9 / 6 kadr** |
| `src/pages/Landing.tsx`, `src/sections/S7Production.tsx` | 0.120 / 0.150 | **0.150 / 0.100** |

Endi hujjat, kalkulyator va `SpirelineMovementTuning.h` bir xil sonlarni ko'rsatadi.

## Nima bajarilgan / nima yo'q

**To'liq bajarilgan:** FSM (8 holat, ustuvorlik jadvali, committed harakatlar),
6 ta probe, inersiya (barcha retention ko'paytiruvchilari), coyote + buffer,
asimmetrik gravitatsiya (rise/fall/apex), soft cap drag + hard cap,
sprint rampi va grace oynasi, Hard Landing jarimasi, Snag Assist,
kamera FOV/roll, debug chizmalar (GDD 8.3 ranglari).

**Ataylab soddalashtirilgan:**
- **Vault nishoni** — to'siq USTIGA qo'nadi, orqasiga trace qilinmaydi.
  Production'da `LandingProbe` natijasidan foydalanib, narigi tomonga tushish kerak.
- **Root Motion** — Vault/LedgeClimb animatsiya o'rniga kod bilan siljitiladi
  (GDD 5.6: `Motion Warping` / root motion source keyingi qadam).
- **Kinetik Zaryad (KC)** va **Flow State** — bu kontrollerda yo'q; ular qo'shimcha
  tizim sifatida ulanadi (GDD 2.3, 2.6).

**Tekshirilmagan:** bu kod UE 5.4 kompilyatori bilan **build qilinmagan** (muhitda
Unreal toolchain yo'q). U API jihatdan UE 5.4 konvensiyalariga muvofiq yozilgan va
statik tekshiruvdan (deklaratsiya ↔ definitsiya mosligi) o'tgan, lekin birinchi
build'da kichik tuzatishlar talab qilinishi mumkin.

## Debug

Harakat komponentidagi `bDrawDebugProbes = true` qiling (yoki `spire.hud 2`) —
GDD 8.3-jadvaldagi ranglar bo'yicha probe chizmalari chiqadi:

| Rang | Probe |
| --- | --- |
| `#3DE07A` yashil | Ground (qizil = yurish mumkin emas) |
| `#3D9BFF` ko'k | Walls |
| `#FF6A1F` to'q sariq | Obstacle |
| `#FFC53D` sariq | Clearance (qizil = bo'sh joy yo'q) |
| `#2FE0C4` moviy | Ledge |
| `#FF3D5A` qizil / `#3DE07A` | Landing (og'ir / yumshoq) |

`GetDebugStateString()` — bir qatorli holat matni (P2 panel formati):
`P40 WallRun | v 9.11 m/s | coyote 0 kadr | buffer 3 kadr | sprint 78%`
