"use strict";
/* La parade en quatre modes : gentil, bébé, drôle (blagues, situations absurdes) et méchant (méchant « pour rire », adapté aux enfants :
   grognon, vantard, chipeur, jamais effrayant). Pour chaque personnage : plusieurs noms (n) et
   plusieurs phrases (p), tirés au hasard ; {n} est remplacé par le nom tiré.
   Un personnage absent d'un mode garde sa phrase de lang/personnages.js.
   Clé : couleur-valeur (blue = animaux, green = dinosaures, red = robots, yellow = métiers).
   Étape 1 : les 10 animaux, en français (à relire par l'auteur). */
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
    },
  },
};
