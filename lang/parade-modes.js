"use strict";
/* La parade en quatre modes : gentil, bébé, drôle (blagues, situations absurdes) et méchant
   (« pour rire », adapté aux enfants : grognon, vantard, chipeur, jamais effrayant).
   Pour chaque personnage : plusieurs noms (n) et plusieurs phrases (p), tirés au hasard ;
   {n} est remplacé par le nom tiré.
   Mêmes textes dans Kiboo (MowgAI/kiboo, lang/parade-modes.js), sauf le mode gentil.
   Clé : couleur-valeur (blue = animaux, green = dinosaures, red = robots, yellow = métiers).
   Les 40 personnages sont écrits en français ; l'anglais viendra ensuite (en anglais, chaque
   personnage garde pour l'instant sa phrase habituelle). */
window.PARADE_MODES = {
  fr: {
    gentil: {
      "blue-1": { n: ["Gruyère", "Mimolette"], p: [
        "Je suis {n} ! Les trous dans le fromage, c'est moi qui les fais.",
        "Je suis {n} ! Je suis toute petite, mais j'ai un très grand appétit.",
        "Je suis {n} ! Si tu as un bout de fromage, on peut être amies.",
        "Je suis {n} ! Chut… je grignote en douce."] },
      "blue-2": { n: ["Plume", "Piou"], p: [
        "Je suis {n} ! Je chante faux, mais très fort.",
        "Je suis {n} ! Cui-cui, j'ai chanté avant même que le réveil sonne.",
        "Je suis {n} ! Regarde, je fais des loopings au-dessus de la table."] },
      "blue-3": { n: ["Pelote", "Moustache"], p: [
        "Je suis {n} ! Je dors toute la journée, et le reste du temps, je fais la sieste.",
        "Je suis {n} ! Ma pelote de laine a encore roulé sous le canapé.",
        "Je suis {n} ! Ronron… caresse-moi derrière les oreilles."] },
      "blue-4": { n: ["Filou", "Biscuit"], p: [
        "Je suis {n} ! Lance-moi une balle, je te la rapporte… peut-être.",
        "Je suis {n} ! Ma queue remue toute seule quand je suis content.",
        "Je suis {n} ! J'ai mangé un chausson, mais chut."] },
      "blue-5": { n: ["Rosette", "Praline"], p: [
        "Je suis {n} ! La boue, c'est mon bain moussant.",
        "Je suis {n} ! Rose de la tête jusqu'à ma queue en tire-bouchon.",
        "Je suis {n} ! Groin groin, ça veut dire : je t'aime bien."] },
      "blue-6": { n: ["Rusé", "Malin"], p: [
        "Je suis {n} ! J'ai toujours un plan… et un plan de secours.",
        "Je suis {n} ! Mon secret : une queue toute douce et des idées malignes.",
        "Je suis {n} ! Pose-moi une devinette, je trouve toujours."] },
      "blue-7": { n: ["Flocon", "Givre"], p: [
        "Je suis {n} ! Même dans la neige, je n'ai jamais froid aux pattes.",
        "Je suis {n} ! Mes taches, c'est mon pyjama de tous les jours.",
        "Je suis {n} ! J'adore faire des glissades dans la neige."] },
      "blue-8": { n: ["Miel", "Nounours"], p: [
        "Je suis {n} ! Le pot de miel ? Non, je ne l'ai pas vu… miam.",
        "Je suis {n} ! Si tu vois une abeille, dis-lui que je l'aime bien.",
        "Je suis {n} ! Un câlin d'ours ? Attention, ça serre fort !"] },
      "blue-9": { n: ["Bambou", "Panpan"], p: [
        "Je suis {n} ! Au petit-déjeuner, au déjeuner et au dîner : bambou.",
        "Je suis {n} ! Noir et blanc, et toujours de bonne humeur.",
        "Je suis {n} ! Je mange, je dors, je mange… et je recommence."] },
      "blue-10": { n: ["Carotte", "Noisette"], p: [
        "Je suis {n} ! Avec mes grandes oreilles, j'entends même les secrets.",
        "Je suis {n} ! Je saute si haut que je touche presque les nuages.",
        "Je suis {n} ! La plus forte des animaux, et la plus rapide aussi."] },
      "green-1": { n: ["Zip", "Zippy"], p: [
        "Je suis {n} ! Attrape-moi si tu peux, je cours plus vite que le vent.",
        "Je suis {n} ! Tu ne m'attraperas jamais, je cours trop vite !",
        "Je suis {n} ! J'ai des plumes, mais je préfère courir."] },
      "green-2": { n: ["Rosie", "Rosalie"], p: [
        "Je suis {n} ! Trois cornes, et toujours bien coiffée.",
        "Je suis {n} ! Trois cornes et un joli sourire.",
        "Je suis {n} ! J'ai mis du rose partout, même sur mes cornes."] },
      "green-3": { n: ["Pic", "Piquant"], p: [
        "Je suis {n} ! Attention quand tu me fais un câlin : ça pique.",
        "Je suis {n} ! Attention, ne t'assieds pas sur mon dos !",
        "Je suis {n} ! Mes pointes, c'est pour faire joli… et un peu pour piquer."] },
      "green-4": { n: ["Croc", "Crocky"], p: [
        "Je suis {n} ! J'ai cent dents, et je les brosse toutes, tous les soirs.",
        "Je suis {n} ! Je souris tout le temps, même chez le dentiste.",
        "Je suis {n} ! Je suis vert… de bonne humeur."] },
      "green-5": { n: ["Zéphyr", "Zéphyrin"], p: [
        "Je suis {n} ! De là-haut, je vois tout… surtout les goûters.",
        "Je suis {n} ! Je vole plus haut que les montagnes.",
        "Je suis {n} ! Accroche-toi bien, on décolle !"] },
      "green-6": { n: ["Bleuet", "Petit-Bleu"], p: [
        "Je suis {n} ! Je suis petit, mais mes cornes poussent tous les jours.",
        "Je suis {n} ! Petit dino, grosses cornes, gros cœur.",
        "Je suis {n} ! J'ai encore un bout de coquille d'œuf sur la tête."] },
      "green-7": { n: ["Caramel", "Chouquette"], p: [
        "Je suis {n} ! Pourquoi ? Parce que ! Et pourquoi parce que ?",
        "Je suis {n} ! Je suis curieuse de tout, même de tes cartes.",
        "Je suis {n} ! Orange comme un coucher de soleil."] },
      "green-8": { n: ["Braise", "Étincelle"], p: [
        "Je suis {n} ! Je fais peur… mais seulement pour rire.",
        "Je suis {n} ! Grrr ! Je t'ai fait peur ? C'était pour rire.",
        "Je suis {n} ! Ma collerette, c'est mon plus beau déguisement."] },
      "green-9": { n: ["Voile", "Vaguelette"], p: [
        "Je suis {n} ! Le plus grand nageur de la préhistoire, c'est moi.",
        "Je suis {n} ! Je nage plus vite qu'un bateau.",
        "Je suis {n} ! Avec ma voile sur le dos, je vais où le vent me pousse."] },
      "green-10": { n: ["Rex", "Gros Rex"], p: [
        "Je suis {n} ! Je suis énorme, mais j'ai peur des souris.",
        "Je suis {n} ! Le plus grand, le plus fort… et le plus gourmand.",
        "Je suis {n} ! Quand je marche, toute la table tremble."] },
      "red-1": { n: ["Clé-Clé", "Tic-Tac"], p: [
        "Je suis {n} ! Tourne ma clé, et je danse.",
        "Je suis {n} ! Tourne ma clé et je danse.",
        "Je suis {n} ! Tic, tac, tic, tac… j'avance !"] },
      "red-2": { n: ["Bip", "Bip-Bip"], p: [
        "Je suis {n} ! Bip bip, ça veut dire bonjour.",
        "Je suis {n} ! Bip bip ! Je roule, je roule, je roule.",
        "Je suis {n} ! Tout rond, je ne tombe jamais : je roule."] },
      "red-3": { n: ["Smiley", "Sourire"], p: [
        "Je suis {n} ! Je souris même quand il pleut.",
        "Je suis {n} ! Un sourire, c'est gratuit, alors j'en donne plein.",
        "Je suis {n} ! Je suis un œuf, mais je ne me casse jamais."] },
      "red-4": { n: ["Ampoule", "Lumio"], p: [
        "Je suis {n} ! Quand j'ai une idée, je m'allume.",
        "Je suis {n} ! Ding ! J'ai une idée géniale.",
        "Je suis {n} ! La nuit, c'est moi qui éclaire la table."] },
      "red-5": { n: ["Clic", "Flash"], p: [
        "Je suis {n} ! Souris, c'est pour la photo !",
        "Je suis {n} ! Souris pour la photo !",
        "Je suis {n} ! J'ai déjà mille photos de chats."] },
      "red-6": { n: ["Écran", "Pixel"], p: [
        "Je suis {n} ! Sur mon visage, il y a toujours un dessin animé.",
        "Je suis {n} ! Une grande enjambée, et hop, j'ai traversé la pièce.",
        "Je suis {n} ! Sur mon visage, je passe tous les dessins animés."] },
      "red-7": { n: ["Coffre", "Costaud"], p: [
        "Je suis {n} ! Je garde tous tes secrets, bien à l'abri.",
        "Je suis {n} ! Solide comme un coffre-fort, et je garde tes secrets.",
        "Je suis {n} ! Je fais boum, boum, quand je marche."] },
      "red-8": { n: ["Cosmo", "Astro"], p: [
        "Je suis {n} ! Je reviens de la Lune, et j'ai rapporté du fromage.",
        "Je suis {n} ! J'ai fait coucou aux étoiles.",
        "Je suis {n} ! Dans l'espace, j'ai croisé un extraterrestre très gentil."] },
      "red-9": { n: ["Zoom", "Lunette"], p: [
        "Je suis {n} ! Je te vois… même quand tu te caches.",
        "Je suis {n} ! Je vois une fourmi au bout du jardin.",
        "Je suis {n} ! Je vois même tes cartes… mais je ne dirai rien."] },
      "red-10": { n: ["Majesté", "Roi Boulon"], p: [
        "Je suis {n} ! Inclinez-vous, je suis le roi des robots.",
        "Je suis {n} ! Ma couronne brille plus fort que le soleil."] },
      "yellow-1": { n: ["l'agent Martin", "l'agent Sifflet"], p: [
        "Je suis {n} ! Halte-là… c'est l'heure du goûter.",
        "Je suis {n} ! Pas de triche à la table, je surveille.",
        "Je suis {n} ! Pin-pon… ah non, ça, c'est les pompiers."] },
      "yellow-2": { n: ["Féeline", "la fée Paillette"], p: [
        "Je suis {n} ! Un coup de baguette, et tes devoirs sont faits. Enfin… presque.",
        "Je suis {n} ! Abracadabra, une carte magique pour toi.",
        "Je suis {n} ! D'un coup de baguette, je change les 1 en 10… pour de faux."] },
      "yellow-3": { n: ["le shérif Lasso", "le cow-boy Lasso"], p: [
        "Je suis {n} ! Mon cheval s'appelle Biscotte.",
        "Je suis {n} ! Yi-ha, en selle !"] },
      "yellow-4": { n: ["Lina", "Lina-des-Bois"], p: [
        "Je suis {n} ! Je reconnais toutes les traces… même celles de tes chaussettes.",
        "Je suis {n} ! Je connais toutes les traces de la forêt.",
        "Je suis {n} ! Écoute… c'est un oiseau ou un écureuil ?"] },
      "yellow-5": { n: ["Léo", "Léo Ballon"], p: [
        "Je suis {n} ! Je marque des buts, même les yeux fermés.",
        "Je suis {n} ! Et but ! Encore un !",
        "Je suis {n} ! Je dribble même autour de la table."] },
      "yellow-6": { n: ["Inès", "Inès la Loupe"], p: [
        "Je suis {n} ! Avec ma loupe, aucun indice ne m'échappe.",
        "Je suis {n} ! J'ai trouvé un trésor : une chaussette perdue."] },
      "yellow-7": { n: ["le docteur Sami", "le docteur Pansement"], p: [
        "Je suis {n} ! Dis « aaah ».",
        "Je suis {n} ! Ouvre la bouche et dis « aaah ».",
        "Je suis {n} ! Un bisou magique, et le bobo s'envole."] },
      "yellow-8": { n: ["Flamme", "la capitaine Flamme"], p: [
        "Je suis {n} ! J'éteins tous les feux, sauf les bougies d'anniversaire.",
        "Je suis {n} ! Pin-pon, pin-pon, j'arrive !",
        "Je suis {n} ! Ma grande échelle monte jusqu'au ciel."] },
      "yellow-9": { n: ["Stella", "la commandante Stella"], p: [
        "Je suis {n} ! J'ai dormi sur la Lune, c'était très calme.",
        "Je suis {n} ! Trois, deux, un… décollage !",
        "Je suis {n} ! Sur la Lune, je saute comme un kangourou."] },
      "yellow-10": { n: ["la professeure Fiole", "la professeure Éprouvette"], p: [
        "Je suis {n} ! Mes expériences font des bulles… et parfois boum.",
        "Je suis {n} ! Attention, mon expérience va faire des bulles !",
        "Je suis {n} ! J'ai inventé le jus d'arc-en-ciel."] },
    },
    bebe: {
      "blue-1": { n: ["Gruyèrinette", "Mini-Gruyère", "Souricette"], p: [
        "Moi c'est {n} ! Miam miam, fomage… areuh !",
        "Coucou, c'est {n} ! Moi toute pitite, toute pitite.",
        "{n} veut un câlin… et un bout de fomage !"] },
      "blue-2": { n: ["Plumichou", "Petit Piou", "Pioupiou"], p: [
        "Piou piou ! Moi c'est {n}, moi pas encore voler…",
        "C'est {n} ! Cui… cui… oh, un vermichou !",
        "{n} fait coucou avec ses pitites ailes !"] },
      "blue-3": { n: ["Minou", "Petit Pelotou", "Minouchou"], p: [
        "Miaou miaou ! C'est {n}, moi veux du lolo !",
        "{n} a attrapé une queue… aïe, c'est la sienne !",
        "Moi {n}, moi fais ronron… dodo."] },
      "blue-4": { n: ["Toutou", "Filounet", "Petit Wouf"], p: [
        "Wouf wouf ! Moi c'est {n}, moi aime tout le monde !",
        "{n} veut la baballe ! Baballe ! Baballe !",
        "C'est {n}… léchouille sur ton nez !"] },
      "blue-5": { n: ["Rosinette", "Petit Groin", "Cochonnette"], p: [
        "Groin groin ! C'est {n}, moi toute rose !",
        "{n} a fait splash dans la flaque… re-splash !",
        "Moi {n}, moi veux un bisou… groin !"] },
      "blue-6": { n: ["Renardou", "Petit Rusé", "Roussichou"], p: [
        "Coucou ! C'est {n}, moi pas rusé, moi tout gentil !",
        "{n} a caché son doudou… il est où ? Là !",
        "Moi {n}, ma queue toute douce… touche !"] },
      "blue-7": { n: ["Floconnet", "Petit Flocon", "Minou-Neige"], p: [
        "Brrr ! C'est {n}, moi aime la neige toute froide !",
        "{n} fait des boules de neige… pouf, sur ton nez !",
        "Moi {n}, moi a des taches partout, regarde !"] },
      "blue-8": { n: ["Nounoursou", "Petit Miel", "Oursonnet"], p: [
        "C'est {n} ! Moi veux du miel… beaucoup de miel !",
        "{n} fait un gros câlin… tout doux !",
        "Moi {n}, moi a sommeil… ouaaah."] },
      "blue-9": { n: ["Pandinou", "Petit Bambou", "Bambichou"], p: [
        "Coucou ! C'est {n}, moi fais des roulades !",
        "{n} mange bambou… crounch crounch… encore !",
        "Moi {n}, moi tout doux, noir et blanc."] },
      "blue-10": { n: ["Lapinette", "Petite Carotte", "Choupinette"], p: [
        "Hop hop ! C'est {n}, moi saute partout !",
        "{n} a trouvé une carotte… crounch !",
        "Moi {n}, mes oreilles toutes longues, regarde !"] },
      "green-1": { n: ["Zipounet", "Petit Zip", "Zipichou"], p: [
        "Zoum zoum ! C'est {n}, moi cours tout vite !",
        "{n} a des pitites plumes… ça chatouille !",
        "Moi {n}, moi tombé… pas mal ! Encore !"] },
      "green-2": { n: ["Rosinette", "Petite Rosie", "Rosichou"], p: [
        "Coucou ! C'est {n}, moi toute rose, toute jolie !",
        "{n} a trois cornes… une, deux… beaucoup !",
        "Moi {n}, moi veux un nœud rose sur ma corne !"] },
      "green-3": { n: ["Picounet", "Petit Pic", "Picpic"], p: [
        "C'est {n} ! Moi a des pitits piquants… pas toucher !",
        "{n} veut un câlin… doucement, ça pique !",
        "Moi {n}, moi fais la sieste sur le dos… aïe !"] },
      "green-4": { n: ["Crocounet", "Petit Croc", "Crocki"], p: [
        "C'est {n} ! Moi a des pitites dents… cheese !",
        "{n} mordille son doudou… doucement !",
        "Moi {n}, moi fais un gros sourire, regarde !"] },
      "green-5": { n: ["Zéphyrou", "Petit Zéphyr", "Zézé"], p: [
        "C'est {n} ! Moi vole… un peu… boum !",
        "{n} fait l'avion ! Vrouuum !",
        "Moi {n}, moi veux voler sur ton dos !"] },
      "green-6": { n: ["Bleuetou", "Mini-Bleuet", "Bleubleu"], p: [
        "Areuh ! C'est {n}, moi tout pitit bébé dino !",
        "{n} a encore la coquille sur la tête… coucou !",
        "Moi {n}, moi fais des coups de corne… tout doux !"] },
      "green-7": { n: ["Caramelou", "Petite Caramel", "Bonbon"], p: [
        "C'est {n} ! Pourquoi ? Pourquoi ? Pourquoi ?",
        "{n} veut tout toucher… c'est quoi, ça ?",
        "Moi {n}, moi toute orange comme un bonbon !"] },
      "green-8": { n: ["Braisounet", "Petit Braise", "Braibrai"], p: [
        "Grrr… areuh ! C'est {n}, moi fais peur ?",
        "{n} ouvre sa collerette… coucou !",
        "Moi {n}, moi tout rouge, tout chaud !"] },
      "green-9": { n: ["Voilette", "Petite Voile", "Plouf"], p: [
        "Plouf ! C'est {n}, moi nage comme un poisson !",
        "{n} fait des bulles… blou blou blou !",
        "Moi {n}, moi veux le bain… encore le bain !"] },
      "green-10": { n: ["Rexou", "Petit Rex", "Rexichou"], p: [
        "Grou grou ! C'est {n}, moi tout grand… presque !",
        "{n} a peur de la souris… maman !",
        "Moi {n}, moi fais un gros câlin… attention, ça serre !"] },
      "red-1": { n: ["Clécléou", "Petit Clé-Clé", "Tictac"], p: [
        "Tic tac ! C'est {n}, moi tourne tourne !",
        "{n} plus de ressort… dodo… tourne ma clé !",
        "Moi {n}, moi danse… tout pitits pas !"] },
      "red-2": { n: ["Bibip", "Petit Bip", "Bipou"], p: [
        "Bibip ! Moi {n}, moi tout pitit robot… dodo ?",
        "{n} roule, roule… boum ! Encore !",
        "C'est {n} ! Bip ? Bip bip ! Câlin ?"] },
      "red-3": { n: ["Smileyou", "Petit Smiley", "Coco"], p: [
        "Hihi ! C'est {n}, moi fais des sourires !",
        "{n} est un pitit œuf… pas casser !",
        "Moi {n}, moi rigole tout le temps… hihihi !"] },
      "red-4": { n: ["Ampoulette", "Petite Lumière", "Lumilou"], p: [
        "Ding ! C'est {n}, moi a une idée… euh… oubliée !",
        "{n} fait clignote, clignote !",
        "Moi {n}, moi la veilleuse pour faire dodo."] },
      "red-5": { n: ["Cliclic", "Petit Clic", "Flashou"], p: [
        "Clic clac ! C'est {n}, moi fais photo !",
        "{n} a fait une photo… de son pied !",
        "Moi {n}, souris… cheese ! Hihi !"] },
      "red-6": { n: ["Écranou", "Petit Écran", "Télé"], p: [
        "C'est {n} ! Moi veux voir dessin animé !",
        "{n} fait des grands pas… et boum, par terre !",
        "Moi {n}, regarde mon ventre… y a des images !"] },
      "red-7": { n: ["Coffrou", "Petit Coffre", "Boîboîte"], p: [
        "Boum boum ! C'est {n}, moi tout costaud !",
        "{n} garde ton doudou… bien caché !",
        "Moi {n}, moi a des secrets… chut !"] },
      "red-8": { n: ["Cosmichou", "Petit Cosmo", "Astronou"], p: [
        "C'est {n} ! Moi va sur la Lune… vrooouum !",
        "{n} a vu une étoile… ooooh !",
        "Moi {n}, moi flotte dans l'espace… youpi !"] },
      "red-9": { n: ["Zoumzoum", "Petit Zoom", "Zoomi"], p: [
        "C'est {n} ! Moi vois toi… coucou !",
        "{n} fait de grands yeux… ooooh !",
        "Moi {n}, moi joue à cache-cache… trouvé !"] },
      "red-10": { n: ["Bébé Majesté", "Petit Roi", "Majestou"], p: [
        "C'est {n} ! Moi le roi… moi veux mon biberon !",
        "{n} a une pitite couronne… elle tombe !",
        "Moi {n}, tout le monde fait coucou au roi !"] },
      "yellow-1": { n: ["Bébé Martin", "Petit Agent", "Martinou"], p: [
        "Pin-pon… non ! C'est {n}, moi la police !",
        "{n} siffle… tuuut ! Arrêtez-vous !",
        "Moi {n}, moi a une pitite casquette !"] },
      "yellow-2": { n: ["Féelinette", "Petite Fée", "Féfée"], p: [
        "Pouf ! C'est {n}, moi fais la magie !",
        "{n} a cassé sa baguette… ouin !",
        "Moi {n}, moi transforme toi en… bisou !"] },
      "yellow-3": { n: ["Bébé Lasso", "Petit Shérif", "Lassou"], p: [
        "Yi-ha ! C'est {n}, moi sur mon dada !",
        "{n} lance le lasso… attrapé le doudou !",
        "Moi {n}, moi a un chapeau tout grand !"] },
      "yellow-4": { n: ["Linette", "Petite Lina", "Lili"], p: [
        "Coucou ! C'est {n}, moi suis les pitites traces !",
        "{n} a vu un écureuil… ooooh !",
        "Moi {n}, moi fais un câlin à l'arbre !"] },
      "yellow-5": { n: ["Léonou", "Petit Léo", "Léolé"], p: [
        "But ! C'est {n}, moi tape le ballon !",
        "{n} a tiré… dans son pied !",
        "Moi {n}, moi cours après la baballe !"] },
      "yellow-6": { n: ["Inésette", "Petite Inès", "Nénès"], p: [
        "C'est {n} ! Moi cherche… trouvé ! Un caillou !",
        "{n} regarde dans la loupe… gros nez !",
        "Moi {n}, moi a trouvé un trésor… un bonbon !"] },
      "yellow-7": { n: ["Bébé Sami", "Petit Docteur", "Samichou"], p: [
        "C'est {n} ! Moi soigne le doudou !",
        "{n} met un pansement… sur ton nez !",
        "Moi {n}, dis aaah… hihi !"] },
      "yellow-8": { n: ["Flammette", "Petite Pompière", "Pin-Pon"], p: [
        "Pin-pon ! C'est {n}, moi arrose tout !",
        "{n} a un pitit camion rouge !",
        "Moi {n}, moi monte l'échelle… tout en haut !"] },
      "yellow-9": { n: ["Stellinette", "Petite Stella", "Étoilette"], p: [
        "C'est {n} ! Moi va sur la Lune… dodo dans la fusée !",
        "{n} compte : trois… deux… un… areuh !",
        "Moi {n}, moi veux une étoile pour mon doudou !"] },
      "yellow-10": { n: ["Bébé Fiole", "Petite Savante", "Fiolette"], p: [
        "Boum ! C'est {n}, moi fais des bulles !",
        "{n} mélange tout… beurk !",
        "Moi {n}, moi a fait une potion… de lait !"] },
    },
    drole: {
      "blue-1": { n: ["Gruyère Trou-Trou", "Super Gruyère", "Gruyère Pirouette"], p: [
        "Je suis {n} ! J'ai voulu croquer la Lune : on m'avait dit qu'elle était en fromage.",
        "Je suis {n} ! Mon rêve : une maison en fromage, avec un toit en fromage et des voisins en fromage.",
        "Je suis {n} ! Pourquoi les souris aiment les cartes ? Parce qu'il y a des trous… dans le jeu !"] },
      "blue-2": { n: ["Plume Tralala", "Plume Rigolo", "Capitaine Plume"], p: [
        "Je suis {n} ! Quand je chante sous la douche, les escargots applaudissent.",
        "Je suis {n} ! J'ai pris l'avion une fois. Pourquoi ? Aucune idée, j'ai des ailes !",
        "Je suis {n} ! J'ai fait mon nid dans la casquette de papi. Il ne s'en est pas encore rendu compte."] },
      "blue-3": { n: ["Pelote Ronron", "Pelote-Pantoufle", "Docteur Pelote"], p: [
        "Je suis {n} ! Quel est le chat le plus rigolo ? Le chat-touille !",
        "Je suis {n} ! J'ai neuf vies… et je les passe toutes à dormir.",
        "Je suis {n} ! Les souris ? Je les invite au goûter, et on joue aux cartes."] },
      "blue-4": { n: ["Filou Patatras", "Filou Chaussette", "Super Filou"], p: [
        "Je suis {n} ! J'ai couru après ma queue pendant une heure. Je ne l'ai toujours pas attrapée.",
        "Je suis {n} ! Assis ! Couché ! Roulé-boulé ! … Ah non, c'est toi qui dois le dire.",
        "Je suis {n} ! J'ai mis des chaussettes sur mes oreilles. C'est la mode chez les chiens."] },
      "blue-5": { n: ["Rosette Pirouette", "Rosette Bulle", "Princesse Groin-Groin"], p: [
        "Je suis {n} ! Je prends des bains de boue au chocolat. Enfin… je crois que c'est du chocolat.",
        "Je suis {n} ! Ma queue en tire-bouchon ouvre les bouteilles de jus de pomme.",
        "Je suis {n} ! Groin groin, en cochon, ça veut dire : passe-moi le ketchup."] },
      "blue-6": { n: ["Rusé Farceur", "Rusé Coucou", "Professeur Rusé"], p: [
        "Je suis {n} ! J'avais un plan génial… mais je l'ai oublié.",
        "Je suis {n} ! Je me suis déguisé en poule. Personne ne m'a reconnu. Sauf les poules.",
        "Je suis {n} ! Mon plan secret : manger une glace. Chut, ne le dis à personne."] },
      "blue-7": { n: ["Flocon Glissade", "Flocon Patin", "Flocon Atchoum"], p: [
        "Je suis {n} ! J'ai fait un bonhomme de neige. Il est parti avec mon écharpe.",
        "Je suis {n} ! Atchoum ! Même les léopards des neiges s'enrhument.",
        "Je suis {n} ! J'ai compté mes taches : quarante-deux. Ou quarante-trois. J'ai bougé."] },
      "blue-8": { n: ["Miel Gros-Câlin", "Miel Pyjama", "Miel Ronflette"], p: [
        "Je suis {n} ! Je dors tout l'hiver… et en été, je fais la sieste.",
        "Je suis {n} ! J'ai du miel collé partout. Même sur les oreilles. Surtout sur les oreilles.",
        "Je suis {n} ! Quand je ronfle, les arbres tremblent. Zzzz… pardon."] },
      "blue-9": { n: ["Bambou Roulade", "Bambou Pyjama", "Bambou Kung-Fu"], p: [
        "Je suis {n} ! Pourquoi je suis noir et blanc ? Je n'ai pas trouvé mes feutres de couleur.",
        "Je suis {n} ! J'ai goûté une pizza. Elle avait un goût de bambou.",
        "Je suis {n} ! Je fais du kung-fu… mais seulement après la sieste."] },
      "blue-10": { n: ["Carotte Boing-Boing", "Carotte Turbo", "Carotte Oreilles-Antennes"], p: [
        "Je suis {n} ! Avec mes oreilles, j'attrape la radio. Chut, c'est ma chanson !",
        "Je suis {n} ! J'ai sauté si haut qu'un avion m'a dit bonjour.",
        "Je suis {n} ! Le légume préféré des lapins ? La carotte. Quelle surprise !"] },
      "green-1": { n: ["Zip Turbo", "Zip Fusée", "Zip Zigzag"], p: [
        "Je suis {n} ! Je cours si vite que j'arrive avant d'être parti.",
        "Je suis {n} ! J'ai des plumes, mais je ne vole pas. J'attends le mode d'emploi.",
        "Je suis {n} ! J'ai fait la course avec le vent. Le vent a demandé une revanche."] },
      "green-2": { n: ["Rosie Paillettes", "Rosie Froufrou", "Rosie Bigoudi"], p: [
        "Je suis {n} ! Je mets des bigoudis sur mes cornes tous les soirs.",
        "Je suis {n} ! Mon miroir m'a dit que j'étais la plus belle. Il est un peu flatteur.",
        "Je suis {n} ! J'ai peint un arc-en-ciel… tout en rose."] },
      "green-3": { n: ["Pic Hérisson", "Pic Cactus", "Pic Pique-Nique"], p: [
        "Je suis {n} ! Je sers de porte-manteau, d'étendoir à linge et de toboggan. Enfin, presque.",
        "Je suis {n} ! Les ballons me détestent. Pop !",
        "Je suis {n} ! J'adore les pique-niques. Forcément, avec mon nom."] },
      "green-4": { n: ["Croc Brosse-à-Dents", "Croc Sourire", "Croc Dentifrice"], p: [
        "Je suis {n} ! Il me faut un tube de dentifrice par jour. Au moins.",
        "Je suis {n} ! Je souris tellement que mes joues ont des crampes.",
        "Je suis {n} ! La petite souris passe chez moi tous les soirs. Elle est épuisée."] },
      "green-5": { n: ["Zéphyr Parachute", "Zéphyr Cerf-Volant", "Commandant Zéphyr"], p: [
        "Je suis {n} ! Les oiseaux me demandent des cours de vol. Je me fais payer en graines.",
        "Je suis {n} ! Je vole si haut que les nuages me disent pardon.",
        "Je suis {n} ! Une fois, je me suis posé sur un avion. Le pilote a eu très peur."] },
      "green-6": { n: ["Bleuet Coquille", "Bleuet Bélier", "Bleuet Myrtille"], p: [
        "Je suis {n} ! Je porte encore ma coquille d'œuf comme chapeau. C'est très à la mode.",
        "Je suis {n} ! Je mesure mes cornes tous les matins. Un millimètre de plus !",
        "Je suis {n} ! J'ai foncé dans un arbre. L'arbre va bien. Moi aussi, presque."] },
      "green-7": { n: ["Caramel Pourquoi", "Caramel Fondant", "Caramel Point-d'Interrogation"], p: [
        "Je suis {n} ! Pourquoi le ciel est bleu ? Pourquoi l'herbe est verte ? Pourquoi je suis orange ?",
        "Je suis {n} ! J'ai posé une question à un caillou. Il ne m'a toujours pas répondu.",
        "Je suis {n} ! Attention, au soleil, je fonds un peu."] },
      "green-8": { n: ["Braise Parapluie", "Braise Éventail", "Braise Barbecue"], p: [
        "Je suis {n} ! Ma collerette me sert de parapluie. Et d'éventail. Et de chapeau.",
        "Je suis {n} ! J'ai voulu faire peur à un papillon. Il s'est moqué de moi.",
        "Je suis {n} ! Je fais griller les guimauves avec mon souffle. Enfin… j'essaie."] },
      "green-9": { n: ["Voile Bouée", "Voile Capitaine", "Voile Planche-à-Voile"], p: [
        "Je suis {n} ! Les poissons me prennent pour un bateau. Ils veulent un ticket.",
        "Je suis {n} ! Quand il y a du vent, j'avance sans nager. C'est très pratique.",
        "Je suis {n} ! J'ai appris à nager avant de savoir marcher. Et je ne sais toujours pas marcher droit."] },
      "green-10": { n: ["Rex Pantoufles", "Rex Petits-Bras", "Rex Gros-Bidon"], p: [
        "Je suis {n} ! Avec mes petits bras, je n'arrive pas à me gratter le nez.",
        "Je suis {n} ! J'ai voulu faire du vélo. Le vélo a dit non.",
        "Je suis {n} ! Quand j'éternue, la table s'envole."] },
      "red-1": { n: ["Clé-Clé Toupie", "Clé-Clé Disco", "Clé-Clé Ressort"], p: [
        "Je suis {n} ! Si tu tournes ma clé trop fort, je danse le disco toute la nuit.",
        "Je suis {n} ! J'ai perdu ma clé. Je l'ai cherchée partout… elle était dans mon dos.",
        "Je suis {n} ! Tic, tac… ah non, je ne suis pas une horloge."] },
      "red-2": { n: ["Bip Boule", "Bip Bowling", "Bip Ballon"], p: [
        "Je suis {n} ! Je suis tout rond : on me prend souvent pour un ballon.",
        "Je suis {n} ! Bip bip, ça veut dire bonjour. Bip bip bip, ça veut dire : j'ai faim.",
        "Je suis {n} ! J'ai roulé jusqu'à la cuisine. Puis jusqu'au jardin. Puis jusqu'à la mer. Oups."] },
      "red-3": { n: ["Smiley Omelette", "Smiley Coquetier", "Smiley Mouillette"], p: [
        "Je suis {n} ! Je suis un œuf, mais ne m'invite pas au petit-déjeuner.",
        "Je suis {n} ! Je souris même quand je fais la vaisselle. Et je déteste la vaisselle.",
        "Je suis {n} ! Qui est arrivé en premier, l'œuf ou la poule ? Moi."] },
      "red-4": { n: ["Ampoule Génie", "Ampoule Lampadaire", "Ampoule Clignotant"], p: [
        "Je suis {n} ! J'ai eu une idée géniale. Puis je me suis éteint.",
        "Je suis {n} ! Les papillons de nuit sont mes plus grands fans.",
        "Je suis {n} ! Quand j'ai trop d'idées, je fais sauter les plombs."] },
      "red-5": { n: ["Clic Selfie", "Clic Paparazzi", "Clic Flash"], p: [
        "Je suis {n} ! J'ai pris mille photos de chats. Et une de chien, par erreur.",
        "Je suis {n} ! Je fais des selfies avec tout le monde. Même avec les poubelles.",
        "Je suis {n} ! Attention au flash ! … Trop tard, tu as les yeux rouges."] },
      "red-6": { n: ["Écran Télécommande", "Écran Zappeur", "Écran Pixel"], p: [
        "Je suis {n} ! On m'a changé de chaîne pendant que je dormais.",
        "Je suis {n} ! Quand je fais un grand pas, mon dessin animé fait des bonds.",
        "Je suis {n} ! J'ai regardé tous les dessins animés du monde. Deux fois."] },
      "red-7": { n: ["Coffre Lourdaud", "Coffre à Jouets", "Coffre Boum-Boum"], p: [
        "Je suis {n} ! J'ai oublié le code de mon propre coffre. C'est embêtant.",
        "Je suis {n} ! Quand je marche, les tasses dansent sur la table.",
        "Je suis {n} ! À l'intérieur, il y a un trésor : des chaussettes et un vieux biscuit."] },
      "red-8": { n: ["Cosmo Fusée", "Cosmo Lunatique", "Cosmo Comète"], p: [
        "Je suis {n} ! Dans l'espace, j'ai perdu une chaussette. Elle tourne autour de la Terre.",
        "Je suis {n} ! Les extraterrestres m'ont demandé la recette des crêpes.",
        "Je suis {n} ! Sur Mars, il n'y a personne à qui parler. Alors je parle aux cailloux."] },
      "red-9": { n: ["Zoom Jumelles", "Zoom Loupe", "Zoom Télescope"], p: [
        "Je suis {n} ! Je vois une fourmi qui fait ses courses à l'autre bout de la ville.",
        "Je suis {n} ! J'ai cherché mes lunettes toute la journée. Je n'en porte pas.",
        "Je suis {n} ! Je vois si loin que je vois l'arrière de ma tête."] },
      "red-10": { n: ["Majesté Boulon", "Majesté Couronne-de-Travers", "Sa Majesté Rouillée"], p: [
        "Je suis {n} ! Ma couronne est en papier d'aluminium. Ne le dis à personne.",
        "Je suis {n} ! Je suis le roi des robots, mais c'est mon grille-pain qui commande.",
        "Je suis {n} ! Mon trône ? Une chaise de cuisine avec un coussin."] },
      "yellow-1": { n: ["l'agent Sifflet", "l'agent Martin-Pêcheur", "l'agent Croissant"], p: [
        "Je suis {n} ! J'ai arrêté un voleur de chaussettes. C'était le chien.",
        "Je suis {n} ! Je règle la circulation… des fourmis.",
        "Je suis {n} ! J'ai perdu mon sifflet. Alors je fais tuuut avec la bouche."] },
      "yellow-2": { n: ["la fée Paillette", "la fée Oups", "la fée Étourdie"], p: [
        "Je suis {n} ! J'ai voulu changer une citrouille en carrosse. J'ai fait de la soupe.",
        "Je suis {n} ! Abracadabra ! … Zut, j'ai transformé mon chat en pantoufle.",
        "Je suis {n} ! Ma baguette a besoin de piles neuves."] },
      "yellow-3": { n: ["le shérif Biscotte", "le shérif Lasso-Nouille", "le cow-boy Pas-Pressé"], p: [
        "Je suis {n} ! Mon lasso a attrapé une vache. Puis la vache m'a attrapé.",
        "Je suis {n} ! Mon cheval s'appelle Biscotte, parce qu'il croustille un peu.",
        "Je suis {n} ! Je galope si vite que mon chapeau arrive après moi."] },
      "yellow-4": { n: ["Lina Boussole", "Lina Champignon", "Lina Sac-à-Dos"], p: [
        "Je suis {n} ! Je reconnais les traces de tous les animaux. Celles-ci ? Ce sont les miennes.",
        "Je suis {n} ! Je me suis perdue dans la forêt. Heureusement, la forêt connaissait le chemin.",
        "Je suis {n} ! Les hiboux me demandent l'heure. Je ne sais jamais."] },
      "yellow-5": { n: ["Léo Ballon", "Léo Crampons", "Léo Retourné"], p: [
        "Je suis {n} ! J'ai marqué un but… dans la cuisine. Maman n'était pas contente.",
        "Je suis {n} ! Mon ballon est plus rapide que moi. Il ne m'attend jamais.",
        "Je suis {n} ! J'ai fait une bicyclette. Sans vélo."] },
      "yellow-6": { n: ["Inès Loupe", "Inès Trésor", "Inès Sherlock"], p: [
        "Je suis {n} ! J'ai trouvé un indice : une miette. Le coupable, c'est le goûter.",
        "Je suis {n} ! J'ai exploré toute la maison. Le plus dangereux : sous le lit.",
        "Je suis {n} ! Avec ma loupe, les fourmis ressemblent à des dinosaures."] },
      "yellow-7": { n: ["le docteur Pansement", "le docteur Sirop", "le docteur Atchoum"], p: [
        "Je suis {n} ! Mon remède contre tout : un bisou et un câlin. Ça marche à tous les coups.",
        "Je suis {n} ! J'ai soigné un dinosaure. Il avait mal aux dents. À toutes.",
        "Je suis {n} ! Atchoum ! Les docteurs aussi s'enrhument."] },
      "yellow-8": { n: ["Flamme Tuyau", "Flamme Pin-Pon", "Flamme Arrosoir"], p: [
        "Je suis {n} ! J'ai éteint le barbecue de papi. Il n'était pas content.",
        "Je suis {n} ! Mon camion fait pin-pon. Moi aussi, quand je suis pressée.",
        "Je suis {n} ! J'ai sauvé un chat dans un arbre. Puis le chat m'a sauvée."] },
      "yellow-9": { n: ["Stella Fusée", "Stella Croissant-de-Lune", "Stella Pissenlit"], p: [
        "Je suis {n} ! Dans l'espace, mes cheveux flottent. Je ressemble à un pissenlit.",
        "Je suis {n} ! J'ai emporté une pizza dans la fusée. Elle a fait le tour de la Terre.",
        "Je suis {n} ! Sur la Lune, j'ai sauté si haut que je suis retombée le lendemain."] },
      "yellow-10": { n: ["la professeure Éprouvette", "la professeure Bulle", "la professeure Badaboum"], p: [
        "Je suis {n} ! Mon expérience devait faire de l'or. Elle a fait de la purée.",
        "Je suis {n} ! J'ai inventé une machine à ranger les chambres. Elle s'est cachée sous le lit.",
        "Je suis {n} ! Attention, ça va faire des bulles… beaucoup de bulles… trop de bulles !"] },
    },
    mechant: {
      "blue-1": { n: ["Gruyère la Terrible", "Gruyère la Grignoteuse", "Gruyère la Rongeuse"], p: [
        "Je suis {n} ! J'ai mangé TOUT le fromage, et je ne regrette rien.",
        "Je suis {n} ! Ta carte ? Je l'ai grignotée. Bien fait !",
        "Je suis {n} ! Les chats ne me font pas peur. Bon… un peu.",
        "Je suis {n} ! Les trous dans tes chaussettes ? C'est moi. Hi hi hi."] },
      "blue-2": { n: ["Plume le Braillard", "Plume le Chipeur", "Plume le Criard"], p: [
        "Je suis {n} ! Je chante sous ta fenêtre à six heures du matin. Exprès.",
        "Je suis {n} ! Les miettes de ton goûter ? Volées. Cui-cui !",
        "Je suis {n} ! Toi, tu ne sais même pas voler. Pfff."] },
      "blue-3": { n: ["Pelote le Griffu", "Pelote le Sans-Gêne", "Pelote le Grincheux"], p: [
        "Je suis {n} ! Ton canapé ? C'est mon griffoir maintenant.",
        "Je suis {n} ! Je fais tomber les verres de la table. Un par un. En te regardant.",
        "Je suis {n} ! Pousse-toi, c'est MA place au soleil."] },
      "blue-4": { n: ["Filou le Mâchouilleur", "Filou le Voyou", "Filou le Terrible"], p: [
        "Je suis {n} ! Tes devoirs ? Je les ai mangés. Et j'ai adoré.",
        "Je suis {n} ! Ta balle, je la garde. Viens la chercher, si tu l'oses !",
        "Je suis {n} ! J'ai creusé un trou dans le jardin. Bon courage pour le trouver."] },
      "blue-5": { n: ["Rosette la Crado", "Rosette la Boueuse", "Rosette la Gloutonne"], p: [
        "Je suis {n} ! Je sors de la boue. Tu veux un câlin ? Hé hé.",
        "Je suis {n} ! J'ai mangé ton goûter ET le mien. Groin !",
        "Je suis {n} ! Me laver ? Jamais de la vie !"] },
      "blue-6": { n: ["Rusé le Fourbe", "Rusé le Tricheur", "Rusé l'Embrouilleur"], p: [
        "Je suis {n} ! J'ai regardé tes cartes. Toutes. Hé hé hé.",
        "Je suis {n} ! Je gagne toujours… surtout quand je triche.",
        "Je suis {n} ! Fais-moi confiance… ou pas."] },
      "blue-7": { n: ["Flocon le Glacial", "Flocon le Blizzard", "Flocon le Givré"], p: [
        "Je suis {n} ! Une boule de neige dans ton cou ? C'était moi.",
        "Je suis {n} ! Toi, tu as froid ? Moi pas. Trop facile.",
        "Je suis {n} ! Je te regarde de tout là-haut… et je me moque."] },
      "blue-8": { n: ["Miel le Grognon", "Miel le Goinfre", "Miel le Bougon"], p: [
        "Je suis {n} ! Tout le miel est à moi. TOUT. Grrr !",
        "Je suis {n} ! Ne me réveille pas pendant l'hiver. Sinon… grrr.",
        "Je suis {n} ! Les abeilles me piquent ? Même pas mal."] },
      "blue-9": { n: ["Bambou le Paresseux", "Bambou le Ronchon", "Bambou le Flemmard"], p: [
        "Je suis {n} ! Jouer ? Non. Je dors. Va-t'en.",
        "Je suis {n} ! J'ai mangé toute la forêt de bambous. Il n'en reste plus pour toi.",
        "Je suis {n} ! Mes yeux noirs ? C'est pour te faire peur."] },
      "blue-10": { n: ["Carotte la Cheffe", "Carotte la Terrible", "Carotte la Reine"], p: [
        "Je suis {n} ! La plus forte des animaux, c'est moi. Toi, tu n'as aucune chance.",
        "Je suis {n} ! J'ai entendu tous tes secrets. Et je vais les répéter !",
        "Je suis {n} ! Ton potager ? Il est vide. Merci pour les carottes !"] },
      "green-1": { n: ["Zip le Chipeur", "Zip l'Insaisissable", "Zip le Moqueur"], p: [
        "Je suis {n} ! Attrape-moi ! Ah, trop lent. Comme d'habitude.",
        "Je suis {n} ! J'ai chipé ta carte et je suis déjà loin. Nananère !",
        "Je suis {n} ! Toi, tu cours comme un escargot fatigué."] },
      "green-2": { n: ["Rosie la Pimbêche", "Rosie la Capricieuse", "Rosie la Diva"], p: [
        "Je suis {n} ! Pousse-toi, tu me caches le soleil.",
        "Je suis {n} ! Ta coiffure ? Mmm… on dirait un nid d'oiseau.",
        "Je suis {n} ! Je ne joue pas avec ceux qui ne sont pas roses. Désolée. Enfin, pas vraiment."] },
      "green-3": { n: ["Pic le Piquant", "Pic le Hérissé", "Pic le Ronchon"], p: [
        "Je suis {n} ! Un câlin ? Vas-y, essaie. Hé hé.",
        "Je suis {n} ! J'ai crevé tous tes ballons. Pop, pop, pop !",
        "Je suis {n} ! Ne t'approche pas : je pique ET je boude."] },
      "green-4": { n: ["Croc le Croqueur", "Croc le Gourmand", "Croc le Terrible"], p: [
        "Je suis {n} ! J'ai croqué ton crayon. Il n'était pas très bon.",
        "Je suis {n} ! Mon sourire ? C'est pour montrer toutes mes dents. Toutes.",
        "Je suis {n} ! Ton goûter ? Croc ! Il n'y en a plus."] },
      "green-5": { n: ["Zéphyr le Chapardeur", "Zéphyr le Vantard", "Zéphyr le Piqueur"], p: [
        "Je suis {n} ! Je vole au-dessus de toi et je te pique ton chapeau.",
        "Je suis {n} ! De là-haut, tu es tout petit. Minuscule. Ha !",
        "Je suis {n} ! Ta glace ? Hop, je l'ai attrapée en plein vol."] },
      "green-6": { n: ["Bleuet le Bagarreur", "Bleuet le Têtu", "Bleuet le Fonceur"], p: [
        "Je suis {n} ! Je suis petit, mais je fonce. Attention à tes genoux !",
        "Je suis {n} ! Coup de corne ! Ta tour de cartes est par terre.",
        "Je suis {n} ! Non, non et non ! Je ne veux pas aller au lit."] },
      "green-7": { n: ["Caramel la Fouineuse", "Caramel la Pipelette", "Caramel la Collante"], p: [
        "Je suis {n} ! J'ai lu ton journal secret. Très intéressant.",
        "Je suis {n} ! Pourquoi tu as perdu ? Pourquoi ? Hein, pourquoi ?",
        "Je suis {n} ! Je colle aux doigts, comme un vrai caramel. Bon courage !"] },
      "green-8": { n: ["Braise le Terrifiant", "Braise le Grogneur", "Braise le Cracheur"], p: [
        "Je suis {n} ! GRRR ! … Pourquoi tu ne cours pas ? Tu devrais avoir peur !",
        "Je suis {n} ! J'ouvre ma collerette et tout le monde s'enfuit. Sauf toi. Agaçant.",
        "Je suis {n} ! Je crache… des noyaux de cerise. Attention !"] },
      "green-9": { n: ["Voile l'Éclabousseuse", "Voile la Pirate", "Voile la Requine"], p: [
        "Je suis {n} ! Splash ! Tu es tout mouillé. Hé hé !",
        "Je suis {n} ! Toi, tu nages comme un caillou.",
        "Je suis {n} ! Je suis la pirate des mers préhistoriques. Donne-moi tes cartes !"] },
      "green-10": { n: ["Rex le Tyran", "Rex le Grand Méchant", "Rex le Dévoreur"], p: [
        "Je suis {n} ! Je suis le plus grand, le plus fort, et toi… le plus petit.",
        "Je suis {n} ! À genoux devant le roi ! … Bon, d'accord, assis, c'est bien aussi.",
        "Je suis {n} ! Je mange trois gâteaux au petit-déjeuner. Les tiens."] },
      "red-1": { n: ["Clé-Clé le Grinçant", "Clé-Clé le Remonté", "Clé-Clé l'Infernal"], p: [
        "Je suis {n} ! Je suis remonté… contre toi ! Grrr, tic tac.",
        "Je suis {n} ! Je grince exprès quand tu dors. Criiic !",
        "Je suis {n} ! Si tu ne tournes pas ma clé, je boude pour toujours."] },
      "red-2": { n: ["Bip-Bip le Grognon", "Bip le Rouleur Fou", "Bip le Bougon"], p: [
        "Je suis {n} ! Bip bip, ça veut dire : pousse-toi de là.",
        "Je suis {n} ! Je roule sur tes pieds. Exprès. Bip !",
        "Je suis {n} ! Bip bip bip ! Traduction : tu as perdu."] },
      "red-3": { n: ["Smiley le Ricaneur", "Smiley le Moqueur", "Smiley l'Œuf Pourri"], p: [
        "Je suis {n} ! Je souris parce que tu as perdu. Hé hé hé.",
        "Je suis {n} ! Mon sourire ? C'est pour me moquer de toi.",
        "Je suis {n} ! Si tu me casses, attention à l'odeur !"] },
      "red-4": { n: ["Ampoule l'Éblouissant", "Ampoule le Je-Sais-Tout", "Ampoule le Grillé"], p: [
        "Je suis {n} ! J'ai TOUTES les bonnes idées. Toi, aucune.",
        "Je suis {n} ! Je m'allume en pleine nuit, juste dans tes yeux. Surprise !",
        "Je suis {n} ! Ta réponse est fausse. Ding ! Je l'avais deviné."] },
      "red-5": { n: ["Clic l'Espion", "Clic le Paparazzi", "Clic le Farceur"], p: [
        "Je suis {n} ! J'ai une photo de toi en pyjama. Je la montre à tout le monde ?",
        "Je suis {n} ! Clic ! Je t'ai pris en train de mettre les doigts dans le nez.",
        "Je suis {n} ! Toutes tes photos sont floues. C'est moi qui bouge exprès."] },
      "red-6": { n: ["Écran le Zappeur", "Écran le Brouilleur", "Écran le Spoileur"], p: [
        "Je suis {n} ! Je te raconte la fin du dessin animé ? Le héros gagne. Voilà, c'est fait.",
        "Je suis {n} ! Je zappe pile au meilleur moment. Hé hé.",
        "Je suis {n} ! Je mets de la neige sur l'écran quand tu regardes. Pchhhh !"] },
      "red-7": { n: ["Coffre le Costaud", "Coffre le Bourru", "Coffre le Cadenas"], p: [
        "Je suis {n} ! Tes jouets sont dans mon coffre. Et j'ai perdu la clé. Ha !",
        "Je suis {n} ! Boum, boum ! Pousse-toi, j'arrive.",
        "Je suis {n} ! Je garde tes secrets… sauf si on me donne un bonbon."] },
      "red-8": { n: ["Cosmo l'Envahisseur", "Cosmo le Martien", "Cosmo le Conquérant"], p: [
        "Je suis {n} ! J'ai décidé d'envahir… ta chambre. Rends-toi !",
        "Je suis {n} ! Je vais t'envoyer sur la Lune. Aller simple !",
        "Je suis {n} ! Les extraterrestres sont mes copains. Et ils ne t'aiment pas."] },
      "red-9": { n: ["Zoom l'Espion", "Zoom le Rapporteur", "Zoom le Fouineur"], p: [
        "Je suis {n} ! Je vois toutes tes cartes. Et je vais le dire à tout le monde !",
        "Je suis {n} ! Je t'ai vu manger un bonbon en cachette. Je le dis à ta maman ?",
        "Je suis {n} ! Cache-toi où tu veux, je te trouve toujours. Hé hé."] },
      "red-10": { n: ["Majesté le Tyran", "Majesté l'Impitoyable", "Majesté le Grand Chef"], p: [
        "Je suis {n} ! Inclinez-vous ! Plus bas ! Encore plus bas !",
        "Je suis {n} ! Je suis le roi, donc je gagne toujours. C'est la loi.",
        "Je suis {n} ! Toi, tu seras mon serviteur. Commence par me cirer les boulons."] },
      "yellow-1": { n: ["l'agent Martin le Sévère", "l'inspecteur Grognon", "l'agent Pas-Content"], p: [
        "Je suis {n} ! Toi ! Tu as triché ? Je t'ai à l'œil !",
        "Je suis {n} ! Au cachot ! … Bon, le cachot, c'est ta chambre.",
        "Je suis {n} ! Les mains en l'air ! Et donne-moi ton goûter."] },
      "yellow-2": { n: ["Féeline la Maléfique", "Féeline la Vilaine", "Féeline la Farceuse"], p: [
        "Je suis {n} ! Abracadabra : tes frites sont devenues des brocolis !",
        "Je suis {n} ! Un coup de baguette, et tes cartes sont toutes des 1. Ha ha !",
        "Je suis {n} ! Je vais te transformer en crapaud. Mais un crapaud mignon."] },
      "yellow-3": { n: ["le shérif Lasso le Redoutable", "le bandit Lasso", "Lasso le Bourru"], p: [
        "Je suis {n} ! Cette ville est trop petite pour nous deux. Va jouer ailleurs !",
        "Je suis {n} ! Je t'attrape au lasso, et c'est toi qui fais la vaisselle.",
        "Je suis {n} ! Haut les mains ! Donne-moi tes bonbons."] },
      "yellow-4": { n: ["Lina la Sauvage", "Lina la Ronce", "Lina la Pisteuse"], p: [
        "Je suis {n} ! J'ai trouvé les traces de tes chaussettes sales. Beurk !",
        "Je suis {n} ! Je connais un raccourci… mais je ne te le dirai pas.",
        "Je suis {n} ! Tu t'es perdu ? Tant pis pour toi !"] },
      "yellow-5": { n: ["Léo le Frimeur", "Léo le Champion", "Léo le Tricheur"], p: [
        "Je suis {n} ! Je suis le meilleur joueur du monde. Toi, tu es remplaçant.",
        "Je suis {n} ! Une main ? Quelle main ? L'arbitre n'a rien vu.",
        "Je suis {n} ! J'ai marqué dix buts. Toi, zéro. Na !"] },
      "yellow-6": { n: ["Inès la Fouineuse", "Inès l'Implacable", "Inès l'Accusatrice"], p: [
        "Je suis {n} ! J'ai trouvé qui a mangé les biscuits. C'est toi ! Coupable !",
        "Je suis {n} ! Rien ne m'échappe. Surtout pas tes bêtises.",
        "Je suis {n} ! Le trésor, je l'ai trouvé avant toi. Et je le garde."] },
      "yellow-7": { n: ["le docteur Sami le Sévère", "le docteur Sirop-Amer", "le docteur Pas-Commode"], p: [
        "Je suis {n} ! Ouvre la bouche… tu as mangé trop de bonbons ! Interdit !",
        "Je suis {n} ! Pour guérir : une cuillère de sirop aux épinards. Miam… ou pas.",
        "Je suis {n} ! Tu n'es pas malade, tu fais semblant. Je t'ai démasqué !"] },
      "yellow-8": { n: ["Flamme la Pas-Commode", "Flamme la Douche-Froide", "Flamme la Capitaine Sévère"], p: [
        "Je suis {n} ! Tu as fait une bêtise ? Douche froide !",
        "Je suis {n} ! Les bougies d'anniversaire, je ne les éteins pas. Je les arrose.",
        "Je suis {n} ! Pin-pon ! Pousse-toi, et vite !"] },
      "yellow-9": { n: ["Stella la Supersonique", "Stella l'Impitoyable", "Stella la Fusée Folle"], p: [
        "Je suis {n} ! Je suis allée sur la Lune. Toi, tu es allé… à la boulangerie.",
        "Je suis {n} ! Je t'emmène dans l'espace et je te laisse sur Pluton.",
        "Je suis {n} ! Les étoiles ? Elles sont toutes à moi. Pas touche !"] },
      "yellow-10": { n: ["la professeure Fiole la Folle", "la professeure Explosion", "la professeure Diabolique"], p: [
        "Je suis {n} ! Mon expérience va transformer tes devoirs… en encore plus de devoirs ! Mouahaha !",
        "Je suis {n} ! Je vais inventer une potion pour gagner à tous les coups.",
        "Je suis {n} ! Boum ! Oups. Non, non, c'était exprès."] },
    },
  },
};
