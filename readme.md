## Liste des attributs

Noter que le nom de tous les attributs (à l'exception de `name`) débute par `TODO:`, pour éviter tout conflit avec les attributs officiels.

- `name`: Courte description

- `TODO:type`: Catégorisation, parmi la liste ci-dessous:

  (La plupart des catégories sont identifiés par un préfixe et/ou une couleur, indiqués ici entre chochets.)

  - `crossing`: Traverse pour piétons \[`///`, vert]
  - `cycleway`: Piste cyclable \[magenta]
  - `delimitation`: Point de délimitation officiel
  - `footway`: Passage piétonnier \[vert]
  - `geometry`: Géométrie à ajuster \[orange]
  - `hump`: Dos d'âne \[`◠`]
  - `misc`: Autres
  - `name`: Concerne le nom de quelque chose \[`N:`]
  - `new`: Nouvelle rue \[aqua]
  - `oneway`: Sens unique à ajouter/retirer \[`→`]
  - `park`: Parc \[`▲`, vert]
  - `restriction`: Restriction à ajouter/retirer \[`✘`]
  - `sidewalk`: Trottoir \[vert]
  - `stop`: Arrêt \[rouge] \
      (Sans texte dans le cas typique d'un arrêt toutes directions à ajouter.)
  - `surface`: Surface d'une voie \[bleu pâle]
  - `traffic_signal`: Feu de circulation \[jaune]

- `TODO:status`: État de l'avancement des travaux (ou confirmation dans le cas de `certain`)
  - `certain`: Présence confirmée, mais auprès d'une source qui ne peut être citée; doit donc être vérifié sur place
  - `completed`: Travaux (théoriquement) complétés
  - `ongoing`: Travaux en cours
  - `planned`: Travaux prévus
  - `stalled`: Travaux originalement prévus, mais sans progrès visible depuis un certain temps

- `TODO:source`: Source

- `TODO:session`: Date d'une séance du conseil municipal agissant comme source

- `TODO:start_date`: Date prévue de début des travaux
- `TODO:planned_end`: Date prévue de fin des travaux
- `TODO:check_date`: Date de la dernière vérification faite sur place

- `TODO:comments`: Commentaires


(Les attributs débutant par `TODO:ville:` sont à usage interne et peuvent être ignorés.)
