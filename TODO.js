const types = {
	stop: "Arrêt",
	demolition: "Démolition",
	hump: "Dos d'âne",
	traffic_signal: "Feu de circulation",
	geometry: "Géométrie",
	maxspeed: "Limite de vitesse",
	name: "Nom",
	"new": "Nouvelle rue",
	sign: "Panneau erroné",
	park: "Parc",
	crossing: "Passage piétonnier",
	restriction: "Restriction",
	oneway: "Sens unique",
	footway: "Sentier piétonnier",
	surface: "Surface",
	sidewalk: "Trottoir",
	bicycle: "Vélo",
	cycleway: "Voie cyclable",

	misc: "Autre"
}

function get_icon_url(type, show_stop_all) {
	var state = "default";
	if (type.properties) {
		var props = type.properties;
		type = props.type;
		if (show_stop_all && type == "stop" && props.name == "Arrêt toutes directions") {
			type = "stop-all";
		}
		state = props.status || "unknown";
	}

	return "img/icons/" + state + "/" + type + ".png";
}

function pointToLayer(feature, latlng) {
	var radius;
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
				iconSize: [radius * 2, radius * 2]
			})
		});
}

function onEachFeature(feature, layer) {
	layer.bindTooltip(feature.properties.name);
	var icon_tag = "<img src=\"" + get_icon_url(feature, true) + "\" width=32 height=32 /> ";
	popupContents = "<h3>" + icon_tag + feature.properties.name + "</h3>"
		+ "<table>"
	  + "<tr><th>Type:</th><td>"
		+ feature.properties.type + "</td></tr>"
	  + "<tr><th>État:</th><td>" + (feature.properties.status || "inconnu") + "</td></tr>";
	if (feature.properties.start_date) {
	  popupContents += "<tr><th>Début:</th><td>" + feature.properties.start_date + "</td></tr>"
	}
	if (feature.properties.planned_end) {
	  popupContents += "<tr><th>Fin:</th><td>" + feature.properties.planned_end + "</td></tr>"
	}
	if (feature.properties.check_date) {
	  popupContents += "<tr><th>Vérification:</th><td>" + feature.properties.check_date + "</td></tr>"
	}
	if (feature.properties.source) {
		source = feature.properties.source;
		if (source.slice(0, 4) == "http") {
			source = '<a href="' + source + '">' + source + '</a>';
		}
	  popupContents += "<tr><th>Source:</th><td>" + source + "</td></tr>"
	}
	if (feature.properties.session) {
	  popupContents += "<tr><th>Séance:</th><td>" + feature.properties.session + "</td></tr>"
	}
	if (feature.properties.resolution) {
	  popupContents += "<tr><th>Résolution:</th><td>" + feature.properties.resolution + "</td></tr>";
	}
	if (feature.properties.comments) {
	  popupContents += "<tr><th>Commentaires:</th><td>" + feature.properties.comments + "</td></tr>";
	}
	if (feature.properties["ville:projet"]) {
	  popupContents += "<tr><th>Projet:</th><td>"
			+ "<a href=\"" + "https://cartes.ville.sherbrooke.qc.ca/arcgis/rest/services/Travaux/Travaux_Diffusion/MapServer/1/query?where=numeroprojet=" + feature.properties["ville:projet"] + "&outFields=*\">"
			+ feature.properties["ville:projet"]
			+ "</a>"
			"</td></tr>";
	}
	popupContents += "</table>";
	layer.bindPopup(popupContents);
}

var layers = [];
var layers_map = {};
var overlays = {};
for (type in types) {
	if (typeof types[type] !== 'function') {
		layer = L.geoJSON(null, {
			onEachFeature,
			pointToLayer
		});
		layers.push(layer);
		layers_map[type] = layer;

		var type_descr = types[type];
		type_descr = '<img src="' + get_icon_url(type) + '" width=24 height=24 /> ' + type_descr;
		overlays[type] = {
			active: true,
			name: type_descr,
			//icon: get_icon_url(type),
			layer: layer
		};
	}
}

var overlayers = [
	{
		group: "<b>Tout sélectionner</b>",
		layers: [
			overlays.stop,
			overlays.demolition,
			overlays.hump,
			overlays.traffic_signal,
			overlays.geometry,
			overlays.maxspeed,
			overlays.name,
			overlays["new"],
			overlays.sign,
			overlays.park,
			overlays.crossing,
			overlays.restriction,
			overlays.oneway,
			overlays.footway,
			overlays.surface,
			overlays.sidewalk,
			overlays.bicycle,
			overlays.cycleway,

			overlays.misc
		]
	}
];

function fillMap(map, entries, add_control) {
	for (i = 0; i < layers.length; i++) {
		layers[i].addTo(map);
	}
	if (add_control) {
		map.addControl( new L.Control.PanelLayers(null, overlayers, {
			selectorGroup: true,
			groupCheckboxes: true
		}) );
		//L.control.layers(null, overlays, {
		//	collapsed: false
		//}).addTo(map);
	}

	features = entries["features"]
	for (i = 0; i < features.length; i++) {
		layers_map[features[i].properties.type].addData(features[i]);
	}
}
