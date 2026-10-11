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
| Image de couverture + Texte alternatif | image de l'article, aperçu OG, cartes de la liste |
| Date de publication | date affichée, tri, sitemap |
| Dernière publication | `dateModified` / lastmod, sert de déclencheur "Mettre à jour" |

Blocs Notion gérés : paragraphes, titres, listes (imbriquées), cases à cocher, citations, callouts, code,
images, tableaux, toggles, colonnes, séparateurs, liens/bookmarks, équations (texte).
Les vidéos et fichiers hébergés par Notion sont ignorés (leurs liens expirent) : colle un lien externe.
Les images sont **téléchargées au build** et servies depuis `/blog/images/` (les URLs Notion expirent après ~1h).
**Mets une légende sous chaque image : elle sert de texte alternatif.**

## En local

```bash
npm run sync            # lit Notion (NOTION_TOKEN dans l'environnement), écrit public/blog*
npm run preview         # build + wrangler dev
```

Sans `NOTION_TOKEN`, un blog vide est généré. En CI, un token manquant fait échouer le build.
Test sans token : `node scripts/dev/mock-notion.mjs &` puis
`NOTION_API_BASE=http://localhost:4010/v1 NOTION_TOKEN=x npm run sync`.

Fichiers générés (ignorés par git) : `public/blog.html`, `public/blog/`, `public/en/`, `public/rss.xml`, `public/sitemap.xml`.
Le sitemap part de `scripts/sitemap.base.xml` (la page d'accueil) : édite celui-ci, pas `public/sitemap.xml`.

## Réglages dans le code

- Textes de la page `/blog`, CTA de fin d'article, CSS : `scripts/blog/templates.mjs`
- Rendu des blocs : `scripts/blog/render.mjs`
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
