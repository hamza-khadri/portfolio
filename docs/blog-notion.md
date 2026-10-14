# Blog Notion -> hamzakhadri.com/blog

Écris dans la base Notion **Blog HKcom**, coche **Publié**, l'article est en ligne sur
`hamzakhadri.com/blog/<slug>` 1 à 3 minutes plus tard. Décoche : il disparaît (vraie 404).
Pas de base de données côté site : chaque déploiement relit Notion et régénère des pages HTML statiques.

```
Notion (case Publié) -> Make (webhook) -> GitHub API (workflow_dispatch)
  -> GitHub Action: npm run build (sync Notion + vite build) -> wrangler deploy -> Cloudflare
```

## Réglages à faire une fois

### 1. Secrets GitHub (Settings > Secrets and variables > Actions)

| Secret | Contenu |
|---|---|
| `NOTION_TOKEN` | token de l'intégration Notion (lecture), base **Blog HKcom** partagée avec elle |
| `CLOUDFLARE_API_TOKEN` | token avec droit d'éditer les Workers (template "Edit Cloudflare Workers") |
| `CLOUDFLARE_ACCOUNT_ID` | ID du compte Cloudflare |

### 2. Cloudflare : éviter le double déploiement

Si le Worker `portfolio` est connecté à GitHub (Workers & Pages > portfolio > Settings > Builds),
Cloudflare va aussi construire à chaque push sur `main`, sans `NOTION_TOKEN` : le build échoue (voulu,
ça ne casse pas le site en ligne) mais ça pollue. **Déconnecte l'intégration Git de Cloudflare** :
GitHub Actions déploie seul.

### 3. Déclencheur (Make recommandé)

Scénario Make : Notion "Watch Database Items" (ou webhook d'automatisation Notion) puis module HTTP :

- URL : `https://api.github.com/repos/hamza-khadri/portfolio/actions/workflows/deploy.yml/dispatches`
- Méthode : `POST`
- Headers : `Authorization: Bearer <token GitHub>`, `Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28`
- Body (JSON) : `{"ref":"main"}`

Token GitHub fine-grained, limité au repo `portfolio`, permission **Actions : Read and write** uniquement
(la plus petite permission qui permet de lancer ce workflow).
Alternative : `repository_dispatch` (`{"event_type":"notion-blog-update"}` sur `/repos/.../dispatches`),
mais elle demande la permission *Contents : write*, plus large.

Automatisations Notion à créer sur la base : quand **Publié** change, et quand **Dernière publication**
change (bouton "Mettre à jour").

## Schéma de la base

| Champ | Utilisation |
|---|---|
| Titre | titre + `<h1>` |
| Publié | seul interrupteur de mise en ligne |
| Slug | `[a-z0-9-]`, ne plus le changer une fois publié |
| Description SEO | meta description (160 caractères max conseillé, sinon extrait automatique) |
| Mots-clés, Catégorie, Langue | tags affichés, `keywords` JSON-LD, `lang` de la page |
| Image de couverture + Texte alternatif | image de l'article, aperçu de partage (recadré en 1200×630 au build, zone centrale conservée), cartes de la liste |
| Date de publication | date affichée, tri, sitemap |
| Dernière publication | `dateModified` / lastmod, sert de déclencheur "Mettre à jour" |

Blocs Notion gérés : paragraphes, titres, listes (imbriquées), cases à cocher, citations, callouts, code, diagrammes Mermaid,
images, tableaux, toggles, colonnes, séparateurs, liens/bookmarks, équations (texte).
Les vidéos et fichiers hébergés par Notion sont ignorés (leurs liens expirent) : colle un lien externe.
Les images sont **téléchargées au build** et servies depuis `/blog/images/` (les URLs Notion expirent après ~1h).
**Mets une légende sous chaque image : elle sert de texte alternatif.**

### Mise en page des images (taille, position, légende)

L'API Notion ne transmet pas la taille ni l'alignement réglés dans l'éditeur : on les écrit **dans la légende**,
entre crochets. Les balises sont retirées de la légende affichée et du texte alternatif.

| Balise | Effet |
|---|---|
| `[petite]` `[moyenne]` `[grande]` | 33 %, 50 %, 75 % de la colonne de texte (EN : `small`, `medium`, `large`) |
| `[40%]` | largeur libre, de 10 % à 100 % |
| `[gauche]` `[droite]` | image flottante, le texte l'entoure (50 % par défaut sans taille) (EN : `left`, `right`) |
| `[centre]` | centrée (c'est déjà le cas par défaut) |
| `[sans légende]` | légende masquée, gardée comme texte alternatif (EN : `no caption`) |

On peut combiner : `[moyenne droite] Ma légende`, `[30% gauche] [sans légende] Texte alternatif`.
Sans balise : pleine largeur de la colonne, **même si l'image a été réduite à la souris dans Notion** (cette taille n'est pas lisible par l'API).
Une image n'est jamais agrandie au-delà de sa taille réelle en pixels (sinon elle devient floue). Un crochet qui n'est pas une balise (`[1]`, `[sic]`) reste dans la légende.
En mobile (640px et moins), les images flottantes reprennent toute la largeur.
Les titres, tableaux, code et images non flottantes passent toujours sous une image flottante.

### Diagrammes Mermaid

Un bloc **Code** dont le langage est **Mermaid** devient un vrai diagramme sur le site (SVG dessiné au build, aux couleurs du site,
aucun script chargé chez le lecteur). La légende du bloc s'affiche sous le diagramme et sert de texte alternatif.
Un diagramme plus large que la colonne défile horizontalement plutôt que de devenir illisible : pour les longues chaînes,
préfère `flowchart TD` (vertical) à `flowchart LR`.
Erreur de syntaxe : le code brut s'affiche à la place, avec un avertissement dans les logs du build (le build ne casse pas).
Teste ton diagramme sur [mermaid.live](https://mermaid.live) avant de publier.

**Colonnes** : si l'API renvoie la largeur des colonnes (`width_ratio`, versions récentes de l'API Notion), elle est respectée ;
sinon les colonnes ont la même largeur.

## En local

```bash
npm run sync            # lit Notion (NOTION_TOKEN dans l'environnement), écrit blog.html, blog/, en/ à la racine
npm run preview         # build + wrangler dev
```

**Travailler l'interface du blog** : `npm run dev:blog` puis `http://localhost:5173/blog`.
Articles fictifs (FR + EN, avec et sans couverture, sans description SEO, tous les types de blocs) définis dans
`scripts/dev/mock-blog.mjs`, sans Notion ni réseau. Chaque modif de `scripts/blog/*` ou des articles fictifs
régénère le blog et recharge la page. `BLOG_MOCK` est refusé en CI.

Sans `NOTION_TOKEN`, un blog vide est généré. En CI, un token manquant fait échouer le build.
Test sans token : `node scripts/dev/mock-notion.mjs &` puis
`NOTION_API_BASE=http://localhost:4010/v1 NOTION_TOKEN=x npm run sync`.

Fichiers générés (ignorés par git) : `blog.html`, `blog/`, `en/` (pages HTML, à la racine : Vite les construit comme la home),
`public/blog/images/`, `public/rss.xml`, `public/en/rss.xml`, `public/sitemap.xml`.
Le sitemap part de `scripts/sitemap.base.xml` (la page d'accueil) : édite celui-ci, pas `public/sitemap.xml`.

## Réglages dans le code

- Textes et structure HTML de `/blog` et des articles : `scripts/blog/templates.mjs` (même balisage que la home : nav, lignes de projets, footer)
- Styles : `v2/styles.css` (partagé avec la home) + `v2/blog.css` (en-tête d'article, colonne de lecture, blocs Notion)
- Comportements (fond lumineux, curseur, apparitions, nav, sommaire des articles : colonne sticky à gauche du texte dès 1100px, sinon carte sous la couverture + bouton flottant) : `v2/blog.jsx`
- Recherche, filtres par catégorie et pagination de `/blog` : `v2/lib/blog-index.js` (côté navigateur, état dans l'URL `?q=&cat=&page=` ; tous les articles restent dans le HTML pour le SEO). Articles par page : `PAGE_SIZE` dans `scripts/blog/templates.mjs`. Vue liste ou 3 colonnes au choix du lecteur (mémorisée dans son navigateur, `hk_blog_view`), sauf en mobile (640px et moins) : toujours en cartes sur 1 colonne, sans sélecteur ; le bloc « Voir aussi » est toujours en colonnes. Styles des cartes : `.is-grid` dans `v2/blog.css`
- Transition de page home ⇄ blog : `v2/lib/page-transition.js` (+ le voile en CSS dans `v2/styles.css`)
- Rendu des blocs : `scripts/blog/render.mjs` ; diagrammes Mermaid (thème, polices, espacements) : `scripts/blog/mermaid.mjs`
- Version de l'API Notion : variable `NOTION_VERSION` (défaut `2022-06-28`)

## Bilingue FR / EN

**Une entrée Notion par langue et par article.** Chaque entrée a sa propre `Langue`, son `Slug`, sa description et son contenu.

| Langue | Index | Article | RSS |
|---|---|---|---|
| FR | `/blog` | `/blog/<slug>` | `/rss.xml` |
| EN | `/en/blog` | `/en/blog/<slug>` | `/en/rss.xml` |

**Lier les deux versions** : sur l'entrée FR, remplis `Version anglaise` avec l'entrée EN. Notion remplit `Version française` sur l'entrée EN tout seul (relations synchronisées).

Quand les deux versions sont **publiées** :
- balises `hreflang` (+ `x-default` = FR) dans la page et dans `sitemap.xml`
- bouton "English version" / "Version française" dans l'en-tête de l'article

Sans version liée (ou version non publiée) : pas de hreflang, le bouton renvoie vers l'index de l'autre langue. Rien ne casse.

Règles :
- Le même slug peut exister en FR et en EN, pas deux fois dans la même langue.
- Une relation vers une entrée de la même langue est ignorée (avertissement dans les logs du build).
- La page de blog mémorise sa langue (`hk_lang`) : un clic sur "Accueil" ouvre la page d'accueil dans la bonne langue.

## Voir aussi (articles liés)

Propriété **Articles liés** (relation vers la même base, à sens unique). Choisis jusqu'à **3 articles** : ils s'affichent en cartes sous l'article, avant le bloc contact.

- Seuls les articles **publiés** et de la **même langue** apparaissent (un lien vers l'autre langue est ignoré, avec un avertissement dans les logs).
- Au-delà de 3, seuls les 3 premiers sont gardés. L'article lui-même et les doublons sont ignorés.
- Aucun article lié = pas de bloc "Voir aussi".
- Un article lié que tu dépublies disparaît du bloc au déploiement suivant.
