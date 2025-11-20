"use strict";

const types = {
    "Règles": {
        stop: "Arrêt",
        traffic_signal: "Feu de circulation",
        maxspeed: "Limite de vitesse",
        restriction: "Restriction",
        oneway: "Sens unique",
    },
    "Vélos": {
        cycleway: "Voie cyclable",
        bicycle: "Vélo",
    },
    "Piétons": {
        crossing: "Passage piétonnier",
        footway: "Sentier piétonnier",
        sidewalk: "Trottoir",
    },
    "Chaussée": {
        hump: "Dos d'âne",
        surface: "Surface",
    },
    "Autres": {
        demolition: "Démolition",
        geometry: "Géométrie",
        name: "Nom",
        "new": "Nouvelle rue",
        sign: "Panneau erroné",
        park: "Parc",

        misc: "Autre",
    },
}

function get_icon_url(type, show_stop_all) {
    if (type.properties) {
        const props = type.properties;
        type = props.type;
        if (show_stop_all && type === "stop" && props.name === "Arrêt toutes directions") {
            type = "stop-all";
        }
    }

    return `img/icons/${type}.png`;
}

function pointToLayer(feature, latlng) {
    let radius;
    switch (feature.properties.status) {
        case "certain":
        case "completed":
        case "official":
            radius = 12;
            break;
        case "ongoing":
        case "resolution":
            radius = 10;
            break;
        case "planned":
            radius = 8;
            break;
        case "dubious":
            radius = 8;
            break;
        default:
            radius = 10;
    }

    return L.marker(latlng, {
            icon: L.icon({
                iconUrl: get_icon_url(feature),
                iconSize: [radius * 2, radius * 2],
                className: `marker-status-${feature.properties.status}`,
            })
        });
}

function onEachFeature(feature, layer) {
    function row(header, contents) {
        if (! contents) {
            return "";
        }
        return [
            `<tr class="popup-table-row">`,
              `<th class="popup-table-row-header">${header}:</th>`,
              `<td class="popup-table-row-contents">${contents}</td>`,
            `</tr>`,
        ].join('');
    }
    layer.bindTooltip(feature.properties.name);
    const icon_tag = `<img class="popup-title-icon marker-status-${feature.properties.status}" src="${ get_icon_url(feature, true) }" />`;
    let popupContents = `<span class="popup-title">${icon_tag} ${feature.properties.name}</span>`;

    popupContents += "<table>";
    popupContents += row("Type", feature.properties.type);
    popupContents += row("État", (feature.properties.status || "inconnu"));
    popupContents += row("Début", feature.properties.start_date);
    popupContents += row("Fin", feature.properties.planned_end);
    popupContents += row("Vérification", feature.properties.check_date)
    if (feature.properties.source) {
        let source = feature.properties.source;
        if (source.slice(0, 4) === "http") {
            source = `<a href="${source}">${source}</a>`;
        }
      popupContents += row("Source", source);
    }
    popupContents += row("Séance", feature.properties.session);
    popupContents += row("Résolution", feature.properties.resolution);
    popupContents += row("Commentaires", feature.properties.comments);
    if (feature.properties["ville:projet"]) {
        const url = `https://cartes.ville.sherbrooke.qc.ca/arcgis/rest/services/Travaux/Travaux_Diffusion/MapServer/1/query?where=numeroprojet=${ feature.properties["ville:projet"] }&outFields=*`;
        popupContents += row("Projet",
            `<a href="${url}">${ feature.properties["ville:projet"] }</a>`);
    }
    popupContents += "</table>";
    layer.bindPopup(popupContents);
}

let layers = {};
for (const [k, v] of Object.entries(types)) {
    for (const type of (typeof v === "object" ? Object.keys(v) : [k])) {
        layers[type] = L.geoJSON(null, {
            onEachFeature,
            pointToLayer,
        });
    }
}

function fillMap(map, entries, add_control) {
    for (const layer of Object.values(layers)) {
        layer.addTo(map);
    }
    for (const feature of Object.values(entries.features)) {
        layers[feature.properties.type].addData(feature);
    }

    if (add_control) {
        function map_layer(type, name) {
            return {
                active: true,
                name: name,
                icon: `<img src="${ get_icon_url(type) }" />`,
                layer: layers[type],
            };
        }
        const overlayers = Object.entries(types).map(
            ([k, v]) => (
                typeof v === "object" ?
                    ({
                        group: k,
                        layers: Object.entries(v).map(([k,v]) => map_layer(k, v)),
                    })
                    : map_layer(k, v)));
        console.log(overlayers);
        L.control.panelLayers(null, overlayers, {
            selectorGroup: true,
            groupCheckboxes: true,  // ?
        }).addTo(map);
    }
}
