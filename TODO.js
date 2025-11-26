"use strict";

const checkallText = "Tout sélectionner";

const types = {
    "Règles": {
        stop: "Arrêt",
        traffic_signal: "Feu de circulation",
        maxspeed: "Limite de vitesse",
        restriction: "Restriction",
        oneway: "Sens unique",
    },
    "Vélos": {
        bicycle: "Vélo",
        cycleway: "Voie cyclable",
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
        misc: "Autre",
        demolition: "Démolition",
        geometry: "Géométrie",
        name: "Nom",
        "new": "Nouvelle rue",
        sign: "Panneau erroné",
        park: "Parc",
    },
}

const statuses = {
    planned: "Prévu",
    ongoing: "En cours",
    completed: "Complété",
    resolution: "Résolution",
    official: "Officiel",
    certain: "Certain",
    dubious: "Douteux",
    '': "Inconnu",
};

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
    function elementsString(s) {
        const re = /\s*(node|way|relation)\s+(\d+)(?:[,.](\d+))?\s*/y;
        let lines = [];
        let r;
        while (r = re.exec(s)) {
            let [text, type, id, version] = r;
            const url = `https://www.openstreetmap.org/${type}/${id}`;
            lines.push(`<a href="${url}" target="_blank">${type} ${id}</a>` +
                `${version ? `, <a href="${url}/history/${version}" target="_blank">v${version}</a>` : ""}`);
        }
        return lines.join("<br />");
    }
    layer.bindTooltip(feature.properties.name);
    const icon_tag = `<img class="popup-title-icon marker-status-${feature.properties.status}" src="${ get_icon_url(feature, true) }" />`;
    let popupContents = `<div class="popup-header">${icon_tag} <span class="popup-title">${feature.properties.name}</span></div>`;

    popupContents += "<table>";
    const typesFlat = Object.assign.apply(null, [{}].concat(Object.values(types)));
    popupContents += row("Type", typesFlat[feature.properties.type]);
    popupContents += row("État", (statuses[feature.properties.status || '']));
    popupContents += row("Début", feature.properties.start_date);
    popupContents += row("Fin", feature.properties.planned_end);
    popupContents += row("Vérification", feature.properties.check_date)
    if (feature.properties.source) {
        let source = feature.properties.source;
        if (source.slice(0, 4) === "http") {
            source = `<a href="${source}" target="_blank">${source}</a>`;
        }
      popupContents += row("Source", source);
    }
    popupContents += row("Séance", feature.properties.session);
    popupContents += row("Résolution", feature.properties.resolution);
    popupContents += row("Commentaires", feature.properties.comments);
    if (feature.properties["ville:projet"]) {
        const url = `https://cartes.ville.sherbrooke.qc.ca/arcgis/rest/services/Travaux/Travaux_Diffusion/MapServer/1/query?where=numeroprojet=${ feature.properties["ville:projet"] }&outFields=*`;
        popupContents += row("Projet",
            `<a href="${url}" target="_blank">${ feature.properties["ville:projet"] }</a>`);
    }
    //popupContents += row("Éléments", elementsString(feature.properties["watch:elements"]));
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

function getAllCheckboxes() {
    const elems = document.getElementsByClassName('leaflet-panel-layers-selector');
    return [...elems].filter(
        function(input) { return input.value !== 'group' });
}

function update_checkall(checkall) {
    let checked = 0, total = 0;
    for (const input of getAllCheckboxes()) {
        total++;
        if (input.checked) {
            checked++;
        }
    }
    function set_state(indeterminate, checked) {
        checkall.indeterminate = indeterminate;
        checkall.checked = checked;
    }
    if (checked === total) {
        set_state(false, true);
    } else if (checked === 0) {
        set_state(false, false);
    } else {
        set_state(true, (checked / total) >= 0.5);
    }
}

function onCheckAllClick() {
    const checked = this.checked;
    for (const input of getAllCheckboxes()) {
        if (input.checked !== checked) {
            input.click();
        }
    }
}

function redrawMap(entries, statuses) {
    const statusFilter = function(feature) {
        return statuses ? statuses.includes(feature.properties.status || '') : true;
    };
    for (const layer of Object.values(layers)) {
        layer.clearLayers();
        layer.options.filter = statusFilter;
    }
    for (const feature of Object.values(entries.features)) {
        layers[feature.properties.type].addData(feature);
    }
}

function fillMap(map, entries, add_control) {
    for (const layer of Object.values(layers)) {
        layer.addTo(map);
    }
    redrawMap(entries);

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
        let panel = new L.Control.PanelLayers(null, overlayers, {
            selectorGroup: true,
            compact: true,
        });
        panel.addTo(map);

        let header = L.DomUtil.create('div', "todo-layers-header leaflet-panel-layers-item");
        header.id = 'todo-layers-header';
        document.getElementsByClassName("leaflet-panel-layers-overlays")[0].prepend(header);
        let label = L.DomUtil.create('label', 'leaflet-panel-layers-title', header);

        let checkall = L.DomUtil.create('input', 'todo-layers-checkall', label);
        checkall.type  = 'checkbox';
        update_checkall(checkall);

        let checkallTextElem = L.DomUtil.create('span', 'todo-layers-checkall-text', label);
        checkallTextElem.innerHTML = checkallText;

        L.DomEvent.on(checkall, 'click', onCheckAllClick);

        panel.on('panel:selected',
            function () { update_checkall(checkall) });
        panel.on('panel:unselected',
            function () { update_checkall(checkall) });

        L.control.select({
            position: "topleft",
            id: 'todo-control',
            iconMain: '<img class="todo-filter-button" src="img/filter.png" />',
            items: [
                {
                    label: "Filtrer par état",
                    value: 'filter',
                    items: Object.entries(statuses).map(([key, value]) => {
                        return { label: value, value: key };
                    })
                },
            ],
            selectedDefault: Object.keys(statuses),
            multi: true,
            iconChecked: "☑",  // "✓", "✔",
            iconUnchecked: "❒",
            onSelect: function(selection) {
                console.log(`selected ${selection}`);
                redrawMap(entries, selection);
            },
        }).addTo(map);
    }
}
