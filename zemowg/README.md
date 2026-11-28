# ZeMowg

ZeMowg est l'ami de son humain : il sent quand il est triste, veut lui faire plaisir, lui donne des recommandations et l'aide à progresser. Il garde tout pour lui : on peut tout lui confier, comme à un ami.

ZeMowg est la **déclinaison chocolat** de Vac, le chien de Socrate, et **l'avatar de Mowgli**, un adorable labrador chocolat.

Ce dépôt est la **source unique** de ZeMowg : la page de présentation et ses images, réutilisées dans les projets MowgAI (Kiboo, Kimind…). On corrige ici, puis on recopie dans les projets.

## L'artiste

Vac, le chien de Socrate, est une création de l'artiste **Xavier** (*L'Émotif de Xavier – graphismes narratifs*). Toujours le citer quand on utilise Vac ou ZeMowg.

Le dessin de Vac et ses déclinaisons appartiennent à leur auteur ; les photos de Mowgli appartiennent à sa famille. Ce dépôt ne donne aucun droit de réutilisation en dehors des projets MowgAI.

## Contenu

- `index.html` : la page de présentation, autonome (CSS et script dedans, aucune dépendance au code d'un jeu).
- `zemowg.webp` : ZeMowg en volume (chocolat).
- `vac-blanc.webp`, `vac-bleu.webp`, `vac-jaune.webp` : les autres déclinaisons de Vac.
- `mowgli.webp` : le vrai Mowgli ; `mowgli-bebe-*.webp`, `mowgli-ado-*.webp`, `mowgli-grand-*.webp` : Mowgli bébé, ado et aujourd'hui (photos déjà recadrées ; ne pas remettre les photos d'origine).

## Langues

La page est en français et en anglais (boutons FR · EN en haut). Elle choisit seule sa langue : `?lang=fr` ou `?lang=en` dans l'adresse, sinon le dernier choix (`kiboo.zemowg.lang`), sinon la langue de Kiboo (`kiboo.lang`, quand elle est sur le même site), sinon celle du navigateur. Le texte français est dans le HTML ; la traduction anglaise est dans l'objet `EN` du script (une clé par élément marqué `data-t` ou `data-t-alt`). La voix et l'aboiement suivent la langue.

## Utiliser ZeMowg dans un projet

Copier tout le dossier dans le projet, sous le nom `zemowg/`, sans changer les noms de fichiers, puis ajouter un bouton « ZeMowg » qui ouvre `zemowg/index.html`.

## Règles

1. Toujours citer l'artiste, Xavier (pas de nom de famille pour l'instant).
2. ZeMowg est l'avatar de Mowgli ; ne pas parler d'« hommage ».
3. Texte de Xavier, *Vac le chien, un portrait pour traits* : seulement la courte citation de la page, pas le texte entier sans son accord.
4. Voix : la voix d'homme la plus sympa de l'appareil (de préférence une voix « naturelle »). Un aboiement doux de temps en temps, pas souvent : la première fois qu'il parle, puis environ une fois sur cinq, jamais deux fois de suite. L'aboiement est fait en Web Audio (voir le script de `index.html`).
5. Confidentialité : ce qu'on confie à ZeMowg reste sur l'appareil ; jamais envoyé sur un compte ou un serveur.
6. Prononciation : ZeMowg se dit « Zemoug » et Mowgli « Mougli » (la voix les lit ainsi, voir `SAY` dans le script).
7. La phrase de bienvenue est provisoire.
