"use strict";
/* La parade en quatre modes : gentil, bébé, drôle (blagues, situations absurdes) et méchant
   (« pour rire », adapté aux enfants : grognon, vantard, chipeur, jamais effrayant).
   Pour chaque personnage : plusieurs noms (n) et plusieurs phrases (p), tirés au hasard ;
   {n} est remplacé par le nom tiré.
   Mêmes textes dans Kiboo (MowgAI/kiboo, lang/parade-modes.js), sauf le mode gentil.
   Clé : couleur-valeur (blue = animaux, green = dinosaures, red = robots, yellow = métiers).
   Les 40 personnages sont écrits en français et en anglais (jeux de mots adaptés, pas traduits
   mot à mot). */
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
  en: {
    gentil: {
      "blue-1": { n: ["Cheddar", "Brie"], p: [
        "I'm {n}! I'm the one who makes the holes in the cheese.",
        "I'm {n}! I've hidden a piece of cheese under your card.",
        "I'm {n}! Shh… I'm having a secret snack."] },
      "blue-2": { n: ["Feather", "Chirpy"], p: [
        "I'm {n}! I sing out of tune, but very loudly.",
        "I'm {n}! Tweet tweet, I sang before the alarm clock rang.",
        "I'm {n}! Look, I'm doing loop-the-loops over the table."] },
      "blue-3": { n: ["Yarn", "Whiskers"], p: [
        "I'm {n}! I sleep all day, and the rest of the time I take naps.",
        "I'm {n}! My ball of wool has rolled under the sofa again.",
        "I'm {n}! Sixteen hours of napping a day, that's my record."] },
      "blue-4": { n: ["Scamp", "Buddy"], p: [
        "I'm {n}! Throw me a ball, and I'll bring it back… maybe.",
        "I'm {n}! Throw the ball, I'll bring it back… maybe.",
        "I'm {n}! I ate a slipper, but shh."] },
      "blue-5": { n: ["Rosie", "Daisy"], p: [
        "I'm {n}! Mud is my bubble bath.",
        "I'm {n}! A muddy puddle? Here I come!",
        "I'm {n}! Pink from my nose to my curly tail."] },
      "blue-6": { n: ["Sly", "Clever"], p: [
        "I'm {n}! I always have a plan… and a backup plan.",
        "I'm {n}! I always have a plan… and often two.",
        "I'm {n}! My secret: a fluffy tail and clever ideas."] },
      "blue-7": { n: ["Snowflake", "Frosty"], p: [
        "I'm {n}! Even in the snow, my paws never get cold.",
        "I'm {n}! I love sliding in the snow.",
        "I'm {n}! My spots are my everyday pyjamas."] },
      "blue-8": { n: ["Honey", "Teddy"], p: [
        "I'm {n}! The honey pot? No, I haven't seen it… yum.",
        "I'm {n}! If you see a bee, tell her I like her.",
        "I'm {n}! A bear hug? Careful, it squeezes!"] },
      "blue-9": { n: ["Bamboo", "Panpan"], p: [
        "I'm {n}! For breakfast, lunch and dinner: bamboo.",
        "I'm {n}! I eat, I sleep, I eat… and start again.",
        "I'm {n}! Black and white, and always happy."] },
      "blue-10": { n: ["Carrot", "Hazel"], p: [
        "I'm {n}! With my big ears, I can even hear secrets.",
        "I'm {n}! I jump so high I almost touch the clouds.",
        "I'm {n}! My big ears hear everything, even your secrets."] },
      "green-1": { n: ["Zip", "Zippy"], p: [
        "I'm {n}! Catch me if you can, I run faster than the wind.",
        "I'm {n}! You'll never catch me, I'm far too fast!",
        "I'm {n}! I have feathers, but I'd rather run."] },
      "green-2": { n: ["Rosie", "Rosalie"], p: [
        "I'm {n}! Three horns, and my hair is always perfect.",
        "I'm {n}! Three horns and a lovely smile.",
        "I'm {n}! I put pink everywhere, even on my horns."] },
      "green-3": { n: ["Spike", "Prickles"], p: [
        "I'm {n}! Careful when you hug me: it prickles.",
        "I'm {n}! Careful, don't sit on my back!",
        "I'm {n}! My spikes are for looking good… and a little for poking."] },
      "green-4": { n: ["Chomp", "Chompy"], p: [
        "I'm {n}! I have a hundred teeth, and I brush every one of them every night.",
        "I'm {n}! I smile all the time, even at the dentist.",
        "I'm {n}! I'm green, and always keen!"] },
      "green-5": { n: ["Breeze", "Gusty"], p: [
        "I'm {n}! From up here I see everything… especially snacks.",
        "I'm {n}! I fly higher than the mountains.",
        "I'm {n}! Hold on tight, we're taking off!"] },
      "green-6": { n: ["Bluey", "Little Blue"], p: [
        "I'm {n}! I'm small, but my horns grow every day.",
        "I'm {n}! Small dino, big horns, big heart.",
        "I'm {n}! I still have a bit of eggshell on my head."] },
      "green-7": { n: ["Caramel", "Toffee"], p: [
        "I'm {n}! Why? Because! And why because?",
        "I'm {n}! I'm curious about everything, even your cards.",
        "I'm {n}! Orange like a sunset."] },
      "green-8": { n: ["Ember", "Sparky"], p: [
        "I'm {n}! I look scary… but only for fun.",
        "I'm {n}! Grrr! Did I scare you? Just kidding.",
        "I'm {n}! My frill is my best costume."] },
      "green-9": { n: ["Sail", "Splash"], p: [
        "I'm {n}! The best swimmer in prehistory, that's me.",
        "I'm {n}! I swim faster than a boat.",
        "I'm {n}! With a sail on my back, I go where the wind blows."] },
      "green-10": { n: ["Rex", "Big Rex"], p: [
        "I'm {n}! I'm huge, but I'm scared of mice.",
        "I'm {n}! The biggest, the strongest… and the hungriest.",
        "I'm {n}! When I walk, the whole table shakes."] },
      "red-1": { n: ["Clockwork", "Tick-Tock"], p: [
        "I'm {n}! Turn my key, and I dance.",
        "I'm {n}! Turn my key and I dance.",
        "I'm {n}! Tick, tock, tick, tock… off I go!"] },
      "red-2": { n: ["Beep", "Beep-Beep"], p: [
        "I'm {n}! Beep beep, that means hello.",
        "I'm {n}! Beep beep! I roll and roll and roll.",
        "I'm {n}! I'm round, so I never fall over: I just roll."] },
      "red-3": { n: ["Smiley", "Sunny"], p: [
        "I'm {n}! I smile even when it rains.",
        "I'm {n}! Smiles are free, so I give lots of them.",
        "I'm {n}! I'm an egg, but I never crack."] },
      "red-4": { n: ["Bulb", "Lumo"], p: [
        "I'm {n}! When I have an idea, I light up.",
        "I'm {n}! Ding! I've got a brilliant idea.",
        "I'm {n}! At night, I'm the one who lights up the table."] },
      "red-5": { n: ["Click", "Flash"], p: [
        "I'm {n}! Say cheese!",
        "I'm {n}! I already have a thousand photos of cats."] },
      "red-6": { n: ["Screen", "Pixel"], p: [
        "I'm {n}! There's always a cartoon on my face.",
        "I'm {n}! One big step, and I've crossed the room.",
        "I'm {n}! My face can show every cartoon."] },
      "red-7": { n: ["Box", "Strongbox"], p: [
        "I'm {n}! I keep all your secrets safe and sound.",
        "I'm {n}! Solid as a safe, and I keep your secrets.",
        "I'm {n}! I go boom, boom, when I walk."] },
      "red-8": { n: ["Cosmo", "Astro"], p: [
        "I'm {n}! I just got back from the Moon, and I brought some cheese.",
        "I'm {n}! I waved hello to the stars.",
        "I'm {n}! In space, I met a very friendly alien."] },
      "red-9": { n: ["Zoom", "Spyglass"], p: [
        "I'm {n}! I can see you… even when you hide.",
        "I'm {n}! I can see an ant at the end of the garden.",
        "I'm {n}! I can even see your cards… but I won't tell."] },
      "red-10": { n: ["Majesty", "King Bolt"], p: [
        "I'm {n}! Bow down, I'm the king of the robots.",
        "I'm {n}! My crown shines brighter than the sun."] },
      "yellow-1": { n: ["Officer Martin", "Officer Whistle"], p: [
        "I'm {n}! Stop right there… it's snack time.",
        "I'm {n}! No cheating at this table, I'm watching.",
        "I'm {n}! Nee-naw… oh no, that's the fire brigade."] },
      "yellow-2": { n: ["Fairyline", "Fairy Sparkle"], p: [
        "I'm {n}! One wave of my wand, and your homework is done. Well… almost.",
        "I'm {n}! Abracadabra, a magic card for you.",
        "I'm {n}! One wave of my wand turns 1s into 10s… just pretend."] },
      "yellow-3": { n: ["Sheriff Lasso", "Cowboy Lasso"], p: [
        "I'm {n}! My horse is called Biscuit.",
        "I'm {n}! Yee-haw, saddle up!"] },
      "yellow-4": { n: ["Lina", "Lina of the Woods"], p: [
        "I'm {n}! I can recognise any tracks… even your socks.",
        "I'm {n}! I know every track in the forest.",
        "I'm {n}! Listen… is that a bird or a squirrel?"] },
      "yellow-5": { n: ["Leo", "Leo the Striker"], p: [
        "I'm {n}! I score goals with my eyes closed.",
        "I'm {n}! Goal! And another one!",
        "I'm {n}! I can even dribble around the table."] },
      "yellow-6": { n: ["Ines", "Ines the Sleuth"], p: [
        "I'm {n}! With my magnifying glass, no clue escapes me.",
        "I'm {n}! I found a treasure: a lost sock."] },
      "yellow-7": { n: ["Doctor Sami", "Doctor Plaster"], p: [
        "I'm {n}! Say “aaah”.",
        "I'm {n}! Open wide and say “aaah”.",
        "I'm {n}! A magic kiss, and the ouch flies away."] },
      "yellow-8": { n: ["Blaze", "Captain Blaze"], p: [
        "I'm {n}! I put out every fire, except birthday candles.",
        "I'm {n}! Nee-naw, nee-naw, here I come!",
        "I'm {n}! My big ladder reaches all the way to the sky."] },
      "yellow-9": { n: ["Stella", "Commander Stella"], p: [
        "I'm {n}! I slept on the Moon, it was very quiet.",
        "I'm {n}! Three, two, one… lift-off!",
        "I'm {n}! On the Moon, I hop like a kangaroo."] },
      "yellow-10": { n: ["Professor Flask", "Professor Test-Tube"], p: [
        "I'm {n}! My experiments make bubbles… and sometimes go boom.",
        "I'm {n}! Careful, my experiment is going to bubble!",
        "I'm {n}! I invented rainbow juice."] },
    },
    bebe: {
      "blue-1": { n: ["Cheddy", "Little Cheddar", "Squeaky"], p: [
        "Me {n}! Yum yum, cheesy… goo goo!",
        "Hiya, it's {n}! Me teeny tiny, teeny tiny.",
        "{n} wants a cuddle… and a bit of cheesy!"] },
      "blue-2": { n: ["Feathy", "Little Feather", "Peep-Peep"], p: [
        "Peep peep! Me {n}, me no fly yet…",
        "It's {n}! Tweet… tweet… ooh, a wormy!",
        "{n} waves with teeny wings!"] },
      "blue-3": { n: ["Kitty", "Little Yarn", "Purry"], p: [
        "Mew mew! It's {n}, me want milky!",
        "{n} caught a tail… ouch, it's mine!",
        "Me {n}, me go purr purr… nap time."] },
      "blue-4": { n: ["Doggy", "Little Scamp", "Woofy"], p: [
        "Woof woof! Me {n}, me love everybody!",
        "{n} wants the ball! Ball! Ball!",
        "It's {n}… big lick on your nose!"] },
      "blue-5": { n: ["Rosie-Posie", "Little Oink", "Piggy"], p: [
        "Oink oink! It's {n}, me all pink!",
        "{n} went splash in the puddle… splash again!",
        "Me {n}, me want a kiss… oink!"] },
      "blue-6": { n: ["Foxy", "Little Sly", "Fluffy"], p: [
        "Hiya! It's {n}, me not sly, me super nice!",
        "{n} hid his teddy… where is it? There!",
        "Me {n}, my tail all soft… touch!"] },
      "blue-7": { n: ["Snowy", "Little Snowflake", "Snow-Kitty"], p: [
        "Brrr! It's {n}, me love the cold snow!",
        "{n} makes snowballs… poof, on your nose!",
        "Me {n}, me got spots everywhere, look!"] },
      "blue-8": { n: ["Teddy-Bear", "Little Honey", "Cubby"], p: [
        "It's {n}! Me want honey… lots of honey!",
        "{n} gives a big cuddle… so soft!",
        "Me {n}, me sleepy… yaaawn."] },
      "blue-9": { n: ["Panda-Boo", "Little Bamboo", "Bamboo-Boo"], p: [
        "Hiya! It's {n}, me do roly-polies!",
        "{n} eats bamboo… crunch crunch… more!",
        "Me {n}, me all soft, black and white."] },
      "blue-10": { n: ["Bunny", "Little Carrot", "Hoppy"], p: [
        "Hop hop! It's {n}, me jump everywhere!",
        "{n} found a carrot… crunch!",
        "Me {n}, my ears all long, look!"] },
      "green-1": { n: ["Zippy-Doo", "Little Zip", "Zippy-Zoo"], p: [
        "Zoom zoom! It's {n}, me run super fast!",
        "{n} has teeny feathers… they tickle!",
        "Me {n}, me fell down… no ouchie! Again!"] },
      "green-2": { n: ["Rosie-Lou", "Little Rosie", "Pinky"], p: [
        "Hiya! It's {n}, me all pink, all pretty!",
        "{n} has three horns… one, two… lots!",
        "Me {n}, me want a pink bow on my horn!"] },
      "green-3": { n: ["Spikey", "Little Spike", "Pokey"], p: [
        "It's {n}! Me got teeny spikes… no touching!",
        "{n} wants a cuddle… gently, it prickles!",
        "Me {n}, me nap on my back… ouch!"] },
      "green-4": { n: ["Chompy-Wompy", "Little Chomp", "Nibbles"], p: [
        "It's {n}! Me got teeny teeth… cheese!",
        "{n} nibbles his teddy… gently!",
        "Me {n}, me do a big smile, look!"] },
      "green-5": { n: ["Breezy", "Little Breeze", "Flappy"], p: [
        "It's {n}! Me fly… a bit… bump!",
        "{n} plays aeroplane! Vroooom!",
        "Me {n}, me want to fly on your back!"] },
      "green-6": { n: ["Blue-Blue", "Teeny Bluey", "Baby Bluey"], p: [
        "Goo goo! It's {n}, me teeny baby dino!",
        "{n} still has eggshell on his head… peekaboo!",
        "Me {n}, me do horn bumps… so gentle!"] },
      "green-7": { n: ["Caramelly", "Little Caramel", "Sweetie"], p: [
        "It's {n}! Why? Why? Why?",
        "{n} wants to touch everything… what's that?",
        "Me {n}, me all orange like a sweetie!"] },
      "green-8": { n: ["Embie", "Little Ember", "Grrr-Baby"], p: [
        "Grrr… goo goo! It's {n}, me scary?",
        "{n} opens his frill… peekaboo!",
        "Me {n}, me all red, all warm!"] },
      "green-9": { n: ["Saily", "Little Sail", "Splashy"], p: [
        "Splash! It's {n}, me swim like a fishy!",
        "{n} blows bubbles… blub blub blub!",
        "Me {n}, me want bath time… more bath time!"] },
      "green-10": { n: ["Rexy", "Little Rex", "Rexie-Wexie"], p: [
        "Roar roar! It's {n}, me so big… nearly!",
        "{n} scared of the mousey… mummy!",
        "Me {n}, me give big hug… careful, it squeezes!"] },
      "red-1": { n: ["Ticky", "Little Clockwork", "Ticky-Tock"], p: [
        "Tick tock! It's {n}, me spin spin!",
        "{n} all wound down… sleepy… turn my key!",
        "Me {n}, me dance… teeny steps!"] },
      "red-2": { n: ["Beepy", "Little Beep", "Beep-Boo"], p: [
        "Beep-beep! Me {n}, me teeny robot… sleepy?",
        "{n} rolls and rolls… bump! Again!",
        "It's {n}! Beep? Beep beep! Cuddle?"] },
      "red-3": { n: ["Smiley-Wiley", "Little Smiley", "Eggy"], p: [
        "Hee hee! It's {n}, me make smiles!",
        "{n} is a teeny egg… no cracking!",
        "Me {n}, me giggle all the time… hee hee hee!"] },
      "red-4": { n: ["Bulby", "Little Light", "Glowy"], p: [
        "Ding! It's {n}, me got an idea… oops… forgot!",
        "{n} goes blink, blink!",
        "Me {n}, me the night-light for sleepy-time."] },
      "red-5": { n: ["Clicky", "Little Click", "Flashy"], p: [
        "Click click! It's {n}, me take photo!",
        "{n} took a photo… of his foot!",
        "Me {n}, say… cheese! Hee hee!"] },
      "red-6": { n: ["Screeny", "Little Screen", "Telly"], p: [
        "It's {n}! Me want cartoons!",
        "{n} takes big steps… and bump, on the floor!",
        "Me {n}, look at my tummy… pictures!"] },
      "red-7": { n: ["Boxy", "Little Box", "Boxy-Woxy"], p: [
        "Boom boom! It's {n}, me so strong!",
        "{n} keeps your teddy… hidden away!",
        "Me {n}, me got secrets… shh!"] },
      "red-8": { n: ["Cosmy", "Little Cosmo", "Astro-Baby"], p: [
        "It's {n}! Me going to the Moon… vroooom!",
        "{n} saw a star… ooooh!",
        "Me {n}, me float in space… yippee!"] },
      "red-9": { n: ["Zoomy", "Little Zoom", "Peeky"], p: [
        "It's {n}! Me see you… peekaboo!",
        "{n} makes big eyes… ooooh!",
        "Me {n}, me play hide and seek… found you!"] },
      "red-10": { n: ["Baby Majesty", "Little King", "Kingy"], p: [
        "It's {n}! Me the king… me want my bottle!",
        "{n} has a teeny crown… it's falling off!",
        "Me {n}, everybody wave to the king!"] },
      "yellow-1": { n: ["Baby Martin", "Little Officer", "Marty"], p: [
        "Nee-naw… no! It's {n}, me the police!",
        "{n} blows the whistle… toot! Stop!",
        "Me {n}, me got a teeny cap!"] },
      "yellow-2": { n: ["Fairy-Wairy", "Little Fairy", "Twinkle"], p: [
        "Poof! It's {n}, me do magic!",
        "{n} broke her wand… waaah!",
        "Me {n}, me turn you into… a kiss!"] },
      "yellow-3": { n: ["Baby Lasso", "Little Sheriff", "Lassy"], p: [
        "Yee-haw! It's {n}, me on my horsey!",
        "{n} throws the lasso… caught teddy!",
        "Me {n}, me got a great big hat!"] },
      "yellow-4": { n: ["Lina-Lou", "Little Lina", "Lili"], p: [
        "Hiya! It's {n}, me follow teeny tracks!",
        "{n} saw a squirrel… ooooh!",
        "Me {n}, me hug the tree!"] },
      "yellow-5": { n: ["Leo-Leo", "Little Leo", "Leoboo"], p: [
        "Goal! It's {n}, me kick the ball!",
        "{n} kicked… his own foot!",
        "Me {n}, me run after the ball!"] },
      "yellow-6": { n: ["Inesy", "Little Ines", "Nessie"], p: [
        "It's {n}! Me looking… found it! A pebble!",
        "{n} looks through the magnifying glass… big nose!",
        "Me {n}, me found treasure… a sweetie!"] },
      "yellow-7": { n: ["Baby Sami", "Little Doctor", "Sami-Boo"], p: [
        "It's {n}! Me make teddy better!",
        "{n} puts a plaster… on your nose!",
        "Me {n}, say aaah… hee hee!"] },
      "yellow-8": { n: ["Blazy", "Little Firefighter", "Nee-Naw"], p: [
        "Nee-naw! It's {n}, me spray everything!",
        "{n} got a teeny red fire engine!",
        "Me {n}, me climb the ladder… right to the top!"] },
      "yellow-9": { n: ["Stella-Bella", "Little Stella", "Starry"], p: [
        "It's {n}! Me go to the Moon… nap in the rocket!",
        "{n} counts: three… two… one… goo goo!",
        "Me {n}, me want a star for my teddy!"] },
      "yellow-10": { n: ["Baby Flask", "Little Scientist", "Flasky"], p: [
        "Boom! It's {n}, me make bubbles!",
        "{n} mixes everything… yucky!",
        "Me {n}, me made a potion… of milk!"] },
    },
    drole: {
      "blue-1": { n: ["Cheddar Holey", "Super Cheddar", "Cheddar Twirl"], p: [
        "I'm {n}! I tried to nibble the Moon: someone told me it was made of cheese.",
        "I'm {n}! My dream: a cheese house, with a cheese roof and cheese neighbours.",
        "I'm {n}! What's a mouse's favourite game? Hide and squeak!"] },
      "blue-2": { n: ["Feather Tra-La-La", "Captain Feather", "Feather Funny-Bones"], p: [
        "I'm {n}! When I sing in the shower, the snails clap.",
        "I'm {n}! I took a plane once. Why? No idea, I've got wings!",
        "I'm {n}! I built my nest in Grandpa's cap. He hasn't noticed yet."] },
      "blue-3": { n: ["Yarn Purrfect", "Yarn Slippers", "Doctor Yarn"], p: [
        "I'm {n}! I'm not lazy, I'm just practising for the napping championships.",
        "I'm {n}! I have nine lives… and I spend them all asleep.",
        "I'm {n}! Mice? I invite them for tea, and we play cards."] },
      "blue-4": { n: ["Scamp Crash-Bang", "Scamp Socks", "Super Scamp"], p: [
        "I'm {n}! I chased my tail for an hour. Still haven't caught it.",
        "I'm {n}! Sit! Lie down! Roll over! … Oh wait, you're supposed to say that.",
        "I'm {n}! I wear socks on my ears. It's the latest dog fashion."] },
      "blue-5": { n: ["Rosie Twirl", "Rosie Bubbles", "Princess Oink-Oink"], p: [
        "I'm {n}! I take chocolate mud baths. Well… I think it's chocolate.",
        "I'm {n}! My curly tail opens bottles of apple juice.",
        "I'm {n}! Oink oink, in pig, means: pass the ketchup."] },
      "blue-6": { n: ["Sly the Joker", "Sly Peekaboo", "Professor Sly"], p: [
        "I'm {n}! I had a brilliant plan… but I forgot it.",
        "I'm {n}! I dressed up as a chicken. Nobody recognised me. Except the chickens.",
        "I'm {n}! My secret plan: eat an ice cream. Shh, don't tell anyone."] },
      "blue-7": { n: ["Snowflake Slide", "Snowflake Skates", "Snowflake Achoo"], p: [
        "I'm {n}! I built a snowman. He ran off with my scarf.",
        "I'm {n}! Achoo! Even snow leopards catch colds.",
        "I'm {n}! I counted my spots: forty-two. Or forty-three. I moved."] },
      "blue-8": { n: ["Honey Big-Hug", "Honey Pyjamas", "Honey Snores"], p: [
        "I'm {n}! I sleep all winter… and in summer, I take naps.",
        "I'm {n}! I've got honey stuck everywhere. Even on my ears. Especially on my ears.",
        "I'm {n}! When I snore, the trees shake. Zzzz… sorry."] },
      "blue-9": { n: ["Bamboo Roly-Poly", "Bamboo Pyjamas", "Kung-Fu Bamboo"], p: [
        "I'm {n}! Why am I black and white? I couldn't find my felt-tip pens.",
        "I'm {n}! I tried a pizza. It tasted like bamboo.",
        "I'm {n}! I do kung fu… but only after my nap."] },
      "blue-10": { n: ["Carrot Boing-Boing", "Turbo Carrot", "Carrot Antenna-Ears"], p: [
        "I'm {n}! My ears pick up the radio. Shh, it's my song!",
        "I'm {n}! I jumped so high a plane said hello.",
        "I'm {n}! A rabbit's favourite vegetable? Carrots. What a surprise!"] },
      "green-1": { n: ["Turbo Zip", "Rocket Zip", "Zip Zigzag"], p: [
        "I'm {n}! I run so fast I arrive before I've left.",
        "I'm {n}! I have feathers but I can't fly. I'm still waiting for the instructions.",
        "I'm {n}! I raced the wind. The wind wants a rematch."] },
      "green-2": { n: ["Rosie Sparkles", "Rosie Frills", "Rosie Curlers"], p: [
        "I'm {n}! I put curlers on my horns every night.",
        "I'm {n}! My mirror says I'm the prettiest. It's a bit of a flatterer.",
        "I'm {n}! I painted a rainbow… all in pink."] },
      "green-3": { n: ["Spike Hedgehog", "Spike Cactus", "Spike Picnic"], p: [
        "I'm {n}! I'm a coat rack, a washing line and a slide. Well, almost.",
        "I'm {n}! Balloons hate me. Pop!",
        "I'm {n}! At parties, I hold the snacks: ten sausages on my back!"] },
      "green-4": { n: ["Chomp Toothbrush", "Chomp Smiles", "Chomp Toothpaste"], p: [
        "I'm {n}! I need a tube of toothpaste a day. At least.",
        "I'm {n}! I smile so much my cheeks get cramp.",
        "I'm {n}! The tooth fairy comes to my house every night. She's exhausted."] },
      "green-5": { n: ["Breeze Parachute", "Breeze Kite", "Captain Breeze"], p: [
        "I'm {n}! Birds ask me for flying lessons. I charge in seeds.",
        "I'm {n}! I fly so high the clouds say excuse me.",
        "I'm {n}! Once I landed on an aeroplane. The pilot got a big fright."] },
      "green-6": { n: ["Bluey Eggshell", "Bluey Battering-Ram", "Bluey Blueberry"], p: [
        "I'm {n}! I still wear my eggshell as a hat. It's very fashionable.",
        "I'm {n}! I measure my horns every morning. One millimetre more!",
        "I'm {n}! I bumped into a tree. The tree's fine. Me too, almost."] },
      "green-7": { n: ["Caramel Why-Why", "Melty Caramel", "Caramel Question-Mark"], p: [
        "I'm {n}! Why is the sky blue? Why is grass green? Why am I orange?",
        "I'm {n}! I asked a pebble a question. It still hasn't answered.",
        "I'm {n}! Careful, in the sun I melt a little."] },
      "green-8": { n: ["Ember Umbrella", "Ember Fan", "Ember Barbecue"], p: [
        "I'm {n}! My frill is my umbrella. And my fan. And my hat.",
        "I'm {n}! I tried to scare a butterfly. It laughed at me.",
        "I'm {n}! I toast marshmallows with my breath. Well… I try."] },
      "green-9": { n: ["Sail Rubber-Ring", "Captain Sail", "Sail Windsurf"], p: [
        "I'm {n}! Fish think I'm a boat. They want a ticket.",
        "I'm {n}! When it's windy, I move without swimming. Very handy.",
        "I'm {n}! I learnt to swim before I could walk. I still can't walk straight."] },
      "green-10": { n: ["Rex Slippers", "Rex Tiny-Arms", "Rex Big-Tummy"], p: [
        "I'm {n}! With my tiny arms, I can't scratch my nose.",
        "I'm {n}! I tried to ride a bike. The bike said no.",
        "I'm {n}! When I sneeze, the table flies away."] },
      "red-1": { n: ["Clockwork Spinner", "Disco Clockwork", "Clockwork Springy"], p: [
        "I'm {n}! Turn my key too hard and I'll disco dance all night.",
        "I'm {n}! I lost my key. I looked everywhere… it was on my back.",
        "I'm {n}! Tick, tock… oh no, I'm not a clock."] },
      "red-2": { n: ["Beep Ball", "Beep Bowling", "Beep Bouncy"], p: [
        "I'm {n}! I'm so round people think I'm a ball.",
        "I'm {n}! Beep beep means hello. Beep beep beep means: I'm hungry.",
        "I'm {n}! I rolled to the kitchen. Then to the garden. Then to the seaside. Oops."] },
      "red-3": { n: ["Smiley Omelette", "Smiley Eggcup", "Smiley Soldiers"], p: [
        "I'm {n}! I'm an egg, but please don't invite me to breakfast.",
        "I'm {n}! I smile even when I'm doing the washing-up. And I hate washing-up.",
        "I'm {n}! Which came first, the egg or the chicken? Me."] },
      "red-4": { n: ["Genius Bulb", "Bulb Lamppost", "Blinky Bulb"], p: [
        "I'm {n}! I had a brilliant idea. Then I switched off.",
        "I'm {n}! Moths are my biggest fans.",
        "I'm {n}! When I have too many ideas, I blow a fuse."] },
      "red-5": { n: ["Click Selfie", "Click Paparazzi", "Click Flash"], p: [
        "I'm {n}! I took a thousand photos of cats. And one of a dog, by mistake.",
        "I'm {n}! I take selfies with everyone. Even with the bins.",
        "I'm {n}! Watch the flash! … Too late, you've got red eyes."] },
      "red-6": { n: ["Screen Remote", "Screen Channel-Hopper", "Screen Pixel"], p: [
        "I'm {n}! Someone changed my channel while I was asleep.",
        "I'm {n}! When I take a big step, my cartoon jumps.",
        "I'm {n}! I've watched every cartoon in the world. Twice."] },
      "red-7": { n: ["Clumsy Box", "Toy Box", "Box Boom-Boom"], p: [
        "I'm {n}! I forgot the code to my own safe. Awkward.",
        "I'm {n}! When I walk, the cups dance on the table.",
        "I'm {n}! Inside me there's treasure: socks and an old biscuit."] },
      "red-8": { n: ["Cosmo Rocket", "Cosmo Moonstruck", "Cosmo Comet"], p: [
        "I'm {n}! In space, I lost a sock. It's still going round the Earth.",
        "I'm {n}! The aliens asked me for my pancake recipe.",
        "I'm {n}! There's nobody to talk to on Mars. So I talk to the rocks."] },
      "red-9": { n: ["Zoom Binoculars", "Zoom Magnifier", "Zoom Telescope"], p: [
        "I'm {n}! I can see an ant doing its shopping on the other side of town.",
        "I'm {n}! I looked for my glasses all day. I don't wear any.",
        "I'm {n}! I can see so far I can see the back of my own head."] },
      "red-10": { n: ["Majesty Bolt", "Majesty Wonky-Crown", "His Rusty Majesty"], p: [
        "I'm {n}! My crown is made of tinfoil. Don't tell anyone.",
        "I'm {n}! I'm king of the robots, but my toaster is the boss.",
        "I'm {n}! My throne? A kitchen chair with a cushion."] },
      "yellow-1": { n: ["Officer Whistle", "Officer Croissant", "Officer Fish-Finger"], p: [
        "I'm {n}! I arrested a sock thief. It was the dog.",
        "I'm {n}! I direct the traffic… for ants.",
        "I'm {n}! I lost my whistle. So I go toot with my mouth."] },
      "yellow-2": { n: ["Fairy Sparkle", "Fairy Oops", "Fairy Muddle"], p: [
        "I'm {n}! I tried to turn a pumpkin into a coach. I made soup.",
        "I'm {n}! Abracadabra! … Oops, I turned my cat into a slipper.",
        "I'm {n}! My wand needs new batteries."] },
      "yellow-3": { n: ["Sheriff Biscuit", "Sheriff Noodle-Lasso", "Cowboy No-Rush"], p: [
        "I'm {n}! My lasso caught a cow. Then the cow caught me.",
        "I'm {n}! My horse is called Biscuit, because he's a bit crunchy.",
        "I'm {n}! I gallop so fast my hat arrives after me."] },
      "yellow-4": { n: ["Lina Compass", "Lina Mushroom", "Lina Backpack"], p: [
        "I'm {n}! I know every animal's tracks. These ones? They're mine.",
        "I'm {n}! I got lost in the forest. Luckily, the forest knew the way.",
        "I'm {n}! The owls ask me the time. I never know."] },
      "yellow-5": { n: ["Leo Ball", "Leo Boots", "Leo Overhead-Kick"], p: [
        "I'm {n}! I scored a goal… in the kitchen. Mum wasn't happy.",
        "I'm {n}! My ball is faster than me. It never waits for me.",
        "I'm {n}! I did a bicycle kick. Without a bicycle."] },
      "yellow-6": { n: ["Ines Magnifier", "Ines Treasure", "Ines Sherlock"], p: [
        "I'm {n}! I found a clue: a crumb. The culprit is the snack.",
        "I'm {n}! I explored the whole house. The most dangerous place: under the bed.",
        "I'm {n}! With my magnifying glass, ants look like dinosaurs."] },
      "yellow-7": { n: ["Doctor Plaster", "Doctor Syrup", "Doctor Achoo"], p: [
        "I'm {n}! My cure for everything: a kiss and a cuddle. Works every time.",
        "I'm {n}! I treated a dinosaur. He had toothache. In all his teeth.",
        "I'm {n}! Achoo! Doctors catch colds too."] },
      "yellow-8": { n: ["Blaze Hosepipe", "Blaze Nee-Naw", "Blaze Watering-Can"], p: [
        "I'm {n}! I put out Grandpa's barbecue. He wasn't happy.",
        "I'm {n}! My fire engine goes nee-naw. So do I, when I'm in a hurry.",
        "I'm {n}! I rescued a cat from a tree. Then the cat rescued me."] },
      "yellow-9": { n: ["Stella Rocket", "Stella Moon-Crescent", "Stella Dandelion"], p: [
        "I'm {n}! In space, my hair floats. I look like a dandelion.",
        "I'm {n}! I took a pizza in the rocket. It went all the way round the Earth.",
        "I'm {n}! On the Moon, I jumped so high I landed the next day."] },
      "yellow-10": { n: ["Professor Test-Tube", "Professor Bubbles", "Professor Kaboom"], p: [
        "I'm {n}! My experiment was supposed to make gold. It made mashed potato.",
        "I'm {n}! I invented a bedroom-tidying machine. It hid under the bed.",
        "I'm {n}! Careful, it's going to bubble… lots of bubbles… too many bubbles!"] },
    },
    mechant: {
      "blue-1": { n: ["Cheddar the Terrible", "Cheddar the Nibbler", "Cheddar the Gnawer"], p: [
        "I'm {n}! I ate ALL the cheese, and I'm not sorry.",
        "I'm {n}! Your card? I nibbled it. Serves you right!",
        "I'm {n}! The holes in your socks? That was me. Hee hee hee."] },
      "blue-2": { n: ["Feather the Screecher", "Feather the Pincher", "Feather the Loudmouth"], p: [
        "I'm {n}! I sing under your window at six in the morning. On purpose.",
        "I'm {n}! The crumbs from your snack? Stolen. Tweet tweet!",
        "I'm {n}! You can't even fly. Pfff."] },
      "blue-3": { n: ["Yarn the Scratcher", "Yarn the Cheeky", "Yarn the Grump"], p: [
        "I'm {n}! Your sofa? It's my scratching post now.",
        "I'm {n}! I knock the glasses off the table. One by one. While looking at you.",
        "I'm {n}! Move over, that's MY sunny spot."] },
      "blue-4": { n: ["Scamp the Chewer", "Scamp the Rascal", "Scamp the Terrible"], p: [
        "I'm {n}! Your homework? I ate it. And I loved it.",
        "I'm {n}! I'm keeping your ball. Come and get it, if you dare!",
        "I'm {n}! I dug a hole in the garden. Good luck finding it."] },
      "blue-5": { n: ["Rosie the Mucky", "Rosie the Muddy", "Rosie the Greedy"], p: [
        "I'm {n}! I've just rolled in the mud. Fancy a hug? Hee hee.",
        "I'm {n}! I ate your snack AND mine. Oink!",
        "I'm {n}! Have a bath? Never in a million years!"] },
      "blue-6": { n: ["Sly the Sneak", "Sly the Cheat", "Sly the Trickster"], p: [
        "I'm {n}! I looked at your cards. All of them. Hee hee hee.",
        "I'm {n}! I always win… especially when I cheat.",
        "I'm {n}! Trust me… or not."] },
      "blue-7": { n: ["Snowflake the Icy", "Snowflake the Blizzard", "Snowflake the Frosty"], p: [
        "I'm {n}! A snowball down your neck? That was me.",
        "I'm {n}! You're cold? I'm not. Too easy.",
        "I'm {n}! I watch you from way up high… and laugh."] },
      "blue-8": { n: ["Honey the Grumpy", "Honey the Greedy-Guts", "Honey the Growler"], p: [
        "I'm {n}! All the honey is mine. ALL of it. Grrr!",
        "I'm {n}! Don't wake me up in winter. Or else… grrr.",
        "I'm {n}! Bees sting me? Didn't even hurt."] },
      "blue-9": { n: ["Bamboo the Lazy", "Bamboo the Grouch", "Bamboo the Slacker"], p: [
        "I'm {n}! Play? No. I'm sleeping. Go away.",
        "I'm {n}! I ate the whole bamboo forest. There's none left for you.",
        "I'm {n}! My black eyes? They're there to scare you."] },
      "blue-10": { n: ["Carrot the Boss", "Carrot the Terrible", "Carrot the Queen"], p: [
        "I'm {n}! The strongest of the animals is me. You don't stand a chance.",
        "I'm {n}! I heard all your secrets. And I'm going to tell everyone!",
        "I'm {n}! Your vegetable patch? It's empty. Thanks for the carrots!"] },
      "green-1": { n: ["Zip the Snatcher", "Zip the Uncatchable", "Zip the Teaser"], p: [
        "I'm {n}! Catch me! Oh, too slow. As usual.",
        "I'm {n}! I snatched your card and I'm already far away. Na-na-na-na-na!",
        "I'm {n}! You run like a tired snail."] },
      "green-2": { n: ["Rosie the Show-Off", "Rosie the Fussy", "Rosie the Diva"], p: [
        "I'm {n}! Move, you're blocking my sunshine.",
        "I'm {n}! Your hair? Hmm… looks like a bird's nest.",
        "I'm {n}! I don't play with anyone who isn't pink. Sorry. Well, not really."] },
      "green-3": { n: ["Spike the Prickly", "Spike the Bristly", "Spike the Grumpy"], p: [
        "I'm {n}! A hug? Go on, try it. Hee hee.",
        "I'm {n}! I popped all your balloons. Pop, pop, pop!",
        "I'm {n}! Don't come near me: I prickle AND I sulk."] },
      "green-4": { n: ["Chomp the Cruncher", "Chomp the Greedy", "Chomp the Terrible"], p: [
        "I'm {n}! I crunched your pencil. It wasn't very tasty.",
        "I'm {n}! My smile? It's to show you all my teeth. All of them.",
        "I'm {n}! Your snack? Chomp! All gone."] },
      "green-5": { n: ["Breeze the Swiper", "Breeze the Boaster", "Breeze the Dive-Bomber"], p: [
        "I'm {n}! I fly over you and pinch your hat.",
        "I'm {n}! From up here, you look tiny. Teeny-weeny. Ha!",
        "I'm {n}! Your ice cream? Whoosh, I grabbed it in mid-air."] },
      "green-6": { n: ["Bluey the Brawler", "Bluey the Stubborn", "Bluey the Charger"], p: [
        "I'm {n}! I'm small, but I charge. Watch your knees!",
        "I'm {n}! Horn bump! Your card tower is on the floor.",
        "I'm {n}! No, no and no! I'm not going to bed."] },
      "green-7": { n: ["Caramel the Nosy", "Caramel the Chatterbox", "Caramel the Sticky"], p: [
        "I'm {n}! I read your secret diary. Very interesting.",
        "I'm {n}! Why did you lose? Why? Eh, why?",
        "I'm {n}! I stick to your fingers, like real caramel. Good luck!"] },
      "green-8": { n: ["Ember the Terrifying", "Ember the Growler", "Ember the Spitter"], p: [
        "I'm {n}! GRRR! … Why aren't you running? You should be scared!",
        "I'm {n}! I open my frill and everybody runs away. Except you. Annoying.",
        "I'm {n}! I spit… cherry stones. Watch out!"] },
      "green-9": { n: ["Sail the Splasher", "Sail the Pirate", "Sail the Sharky"], p: [
        "I'm {n}! Splash! You're soaking wet. Hee hee!",
        "I'm {n}! You swim like a rock.",
        "I'm {n}! I'm the pirate of the prehistoric seas. Hand over your cards!"] },
      "green-10": { n: ["Rex the Tyrant", "Rex the Big Bad", "Rex the Gobbler"], p: [
        "I'm {n}! I'm the biggest, the strongest, and you… the smallest.",
        "I'm {n}! Kneel before the king! … Fine, sitting is OK too.",
        "I'm {n}! I eat three cakes for breakfast. Yours."] },
      "red-1": { n: ["Clockwork the Creaky", "Clockwork the Wound-Up", "Clockwork the Ticked-Off"], p: [
        "I'm {n}! I'm all wound up… about you! Grrr, tick tock.",
        "I'm {n}! I creak on purpose while you sleep. Creeeak!",
        "I'm {n}! If you don't turn my key, I'll sulk forever."] },
      "red-2": { n: ["Beep the Grump", "Beep the Wild Roller", "Beep the Crosspatch"], p: [
        "I'm {n}! Beep beep means: get out of my way.",
        "I'm {n}! I roll over your toes. On purpose. Beep!",
        "I'm {n}! Beep beep beep! Translation: you lost."] },
      "red-3": { n: ["Smiley the Sniggerer", "Smiley the Teaser", "Smiley the Rotten Egg"], p: [
        "I'm {n}! I'm smiling because you lost. Hee hee hee.",
        "I'm {n}! My smile? It's for laughing at you.",
        "I'm {n}! If you crack me, watch out for the smell!"] },
      "red-4": { n: ["Bulb the Dazzler", "Bulb the Know-It-All", "Bulb the Burnt-Out"], p: [
        "I'm {n}! I have ALL the good ideas. You have none.",
        "I'm {n}! I switch on in the middle of the night, right in your eyes. Surprise!",
        "I'm {n}! Your answer is wrong. Ding! I knew it."] },
      "red-5": { n: ["Click the Spy", "Click the Snooper", "Click the Prankster"], p: [
        "I'm {n}! I've got a photo of you in your pyjamas. Shall I show everyone?",
        "I'm {n}! Click! I caught you picking your nose.",
        "I'm {n}! All your photos are blurry. I wobble on purpose."] },
      "red-6": { n: ["Screen the Zapper", "Screen the Scrambler", "Screen the Spoiler"], p: [
        "I'm {n}! Shall I tell you the end of the cartoon? The hero wins. There, done.",
        "I'm {n}! I change channels at the best bit. Hee hee.",
        "I'm {n}! I put snow on the screen while you watch. Pshhhh!"] },
      "red-7": { n: ["Box the Bruiser", "Box the Gruff", "Box the Padlock"], p: [
        "I'm {n}! Your toys are inside me. And I've lost the key. Ha!",
        "I'm {n}! Boom, boom! Out of my way, here I come.",
        "I'm {n}! I keep your secrets… unless someone gives me a sweet."] },
      "red-8": { n: ["Cosmo the Invader", "Cosmo the Martian", "Cosmo the Conqueror"], p: [
        "I'm {n}! I've decided to invade… your bedroom. Surrender!",
        "I'm {n}! I'm sending you to the Moon. One way!",
        "I'm {n}! The aliens are my friends. And they don't like you."] },
      "red-9": { n: ["Zoom the Spy", "Zoom the Telltale", "Zoom the Snoop"], p: [
        "I'm {n}! I can see all your cards. And I'm telling everyone!",
        "I'm {n}! I saw you eat a sweet in secret. Shall I tell your mum?",
        "I'm {n}! Hide wherever you like, I'll always find you. Hee hee."] },
      "red-10": { n: ["Majesty the Tyrant", "Majesty the Merciless", "Majesty the Big Boss"], p: [
        "I'm {n}! Bow down! Lower! Even lower!",
        "I'm {n}! I'm the king, so I always win. That's the law.",
        "I'm {n}! You'll be my servant. Start by polishing my bolts."] },
      "yellow-1": { n: ["Officer Martin the Strict", "Inspector Grumpy", "Officer Not-Happy"], p: [
        "I'm {n}! You! Did you cheat? I've got my eye on you!",
        "I'm {n}! To jail with you! … OK, jail is your bedroom.",
        "I'm {n}! Hands up! And give me your snack."] },
      "yellow-2": { n: ["Fairyline the Wicked", "Fairyline the Naughty", "Fairyline the Prankster"], p: [
        "I'm {n}! Abracadabra: your chips have turned into broccoli!",
        "I'm {n}! One wave of my wand, and all your cards are 1s. Ha ha!",
        "I'm {n}! I'm going to turn you into a toad. But a cute one."] },
      "yellow-3": { n: ["Sheriff Lasso the Fearsome", "Lasso the Bandit", "Lasso the Gruff"], p: [
        "I'm {n}! This town ain't big enough for the two of us. Go and play somewhere else!",
        "I'm {n}! I'll catch you with my lasso, and you'll do the washing-up.",
        "I'm {n}! Hands up! Give me your sweets."] },
      "yellow-4": { n: ["Lina the Wild", "Lina the Bramble", "Lina the Tracker"], p: [
        "I'm {n}! I found the tracks of your smelly socks. Yuck!",
        "I'm {n}! I know a shortcut… but I won't tell you.",
        "I'm {n}! You're lost? Too bad for you!"] },
      "yellow-5": { n: ["Leo the Show-Off", "Leo the Champion", "Leo the Cheat"], p: [
        "I'm {n}! I'm the best player in the world. You're on the bench.",
        "I'm {n}! Handball? What handball? The referee didn't see a thing.",
        "I'm {n}! I scored ten goals. You, zero. So there!"] },
      "yellow-6": { n: ["Ines the Nosy", "Ines the Relentless", "Ines the Accuser"], p: [
        "I'm {n}! I found out who ate the biscuits. It was you! Guilty!",
        "I'm {n}! Nothing gets past me. Especially not your mischief.",
        "I'm {n}! I found the treasure before you. And I'm keeping it."] },
      "yellow-7": { n: ["Doctor Sami the Strict", "Doctor Bitter-Syrup", "Doctor Grumpy"], p: [
        "I'm {n}! Open wide… you've eaten too many sweets! Forbidden!",
        "I'm {n}! To get better: a spoonful of spinach syrup. Yum… or not.",
        "I'm {n}! You're not ill, you're pretending. I've caught you out!"] },
      "yellow-8": { n: ["Blaze the Bossy", "Blaze the Cold-Shower", "Captain Strict"], p: [
        "I'm {n}! You did something naughty? Cold shower!",
        "I'm {n}! I don't blow out birthday candles. I hose them.",
        "I'm {n}! Nee-naw! Out of the way, and fast!"] },
      "yellow-9": { n: ["Stella the Supersonic", "Stella the Merciless", "Stella the Crazy Rocket"], p: [
        "I'm {n}! I went to the Moon. You went… to the bakery.",
        "I'm {n}! I'll take you to space and leave you on Pluto.",
        "I'm {n}! The stars? They're all mine. Hands off!"] },
      "yellow-10": { n: ["Professor Flask the Mad", "Professor Explosion", "Professor Diabolical"], p: [
        "I'm {n}! My experiment will turn your homework… into even more homework! Mwahaha!",
        "I'm {n}! I'm going to invent a potion that wins every time.",
        "I'm {n}! Boom! Oops. No, no, I meant to do that."] },
    },
  },
};
