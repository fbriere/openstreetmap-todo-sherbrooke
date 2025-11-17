## Fichiers

- [`TODO.osm`](TODO.osm): La liste elle-même
- [`TODO.mapcss`](TODO.mapcss): [Modèle de rendu de carte JOSM](https://josm.openstreetmap.de/wiki/Fr%3AStyles) (*fortement recommandé*)
- [`TODO-preset.xml`](TODO-preset.xml): [Préréglage](https://josm.openstreetmap.de/wiki/Fr%3APresets) facilitant l'édition ou visualisation d'une entrée de la liste

## Liste des attributs

Noter que le nom de tous les attributs (à l'exception de `name`) débute par `TODO:`, pour éviter tout conflit avec les attributs officiels.

### Description et catégorisation

- `name`: Courte description

- `TODO:type`: Catégorisation, parmi la liste ci-dessous:

  (La plupart des catégories sont identifiées sur la carte, via [`TODO.mapcss`](TODO.mapcss), par un préfixe et/ou une couleur, indiqués ici entre chochets.)

  - `bicycle`: Infrascructure pour vélos autre que piste cyclable \[`◼`, magenta]
  - `crossing`: Traverse pour piétons \[`///`, vert]
  - `cycleway`: Piste cyclable \[magenta]
  - `demolition`: Démolition d'un immeuble \[`🕇`]
  - `footway`: Passage piétonnier \[vert]
  - `geometry`: Géométrie à ajuster \[orange]
  - `hump`: Dos d'âne \[`◠`]
  - `maxspeed`: Limite de vitesse \[`◼`, blanc]
  - `misc`: Autres
  - `name`: Concerne le nom de quelque chose \[`N:`]
  - `new`: Nouvelle rue \[aqua]
  - `oneway`: Sens unique à ajouter/retirer \[`⮕`]
  - `park`: Parc \[`▲`, vert]
  - `restriction`: Restriction à ajouter/retirer \[`✘`]
  - `sidewalk`: Trottoir \[`◼`, vert]
  - `sign`: Disparité entre le nom officiel et celui affiché sur place [`≠`]
  - `stop`: Arrêt \[rouge] \
      (Le texte est omis dans le cas typique d'un arrêt toutes directions à ajouter.)
  - `surface`: Surface d'une voie \[bleu pâle]
  - `traffic_signal`: Feu de circulation \[jaune]

### État/évolution

- `TODO:status`: État de l'avancement des travaux (ou confirmation dans le cas de `certain`)

  - `planned`: Travaux prévus
  - `ongoing`: Travaux en cours
  - `completed`: Travaux (théoriquement) complétés
  - `resolution`: Travaux qui ont fait l'objet d'une résolution à un conseil ou comité de la Ville
  - `official`: Travaux qui ont été inscrits à un règlement de la Ville
  - `certain`: Présence confirmée, mais auprès d'une source qui ne peut être citée; doit donc être vérifié sur place
  - `dubious`: Travaux sans aucun progrès visible depuis leur annonce initiale, possiblement annulés entre-temps

- `TODO:start_date`: Date prévue du début des travaux
- `TODO:planned_end`: Date prévue de la fin des travaux
- `TODO:check_date`: Date de la dernière vérification faite sur place

### Sources

- `TODO:source`: Source

- `TODO:session`: Date d'une séance d'un conseil ou comité de la Ville agissant comme source

- `TODO:resolution`: Résolution d'un conseil ou comité de la Ville agissant comme source

### Autres

- `TODO:comments`: Commentaires

(Les attributs débutant par `TODO:ville:` sont à usage interne et peuvent être ignorés.)
