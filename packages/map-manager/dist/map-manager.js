import { useCallback as e, useMemo as t, useState as n } from "react";
import { Layer as r, Map as i, Marker as a, Popup as o, Source as s } from "react-map-gl/maplibre";
import { jsx as c, jsxs as l } from "react/jsx-runtime";
//#region src/soilClasses.ts
var u = [
	{
		code: "LV",
		label: "Latossolo Vermelho",
		color: "#a83232",
		description: "Latossolo profundo, bem drenado e muito intemperizado, com cor vermelha intensa devido ao alto teor de óxidos de ferro (hematita). Sul, Sudeste e Centro-Oeste, sobre basaltos e diabásios. Excelente para mecanização — produtivo em grãos, café e cana quando corrigida a fertilidade."
	},
	{
		code: "LVA",
		label: "Latossolo Vermelho-Amarelo",
		color: "#cc6644",
		description: "Latossolo com tons intermediários entre vermelho e amarelo — mistura de hematita e goethita. Uma das classes mais frequentes do Brasil (Cerrado, Amazônia, Sudeste). Bom para agricultura mecanizada e pastagens; geralmente distrófico, exige correção."
	},
	{
		code: "LA",
		label: "Latossolo Amarelo",
		color: "#e0a85c",
		description: "Latossolo amarelo dominado por goethita. Tabuleiros costeiros do Nordeste, Amazônia oriental e platôs baixos. Tende a ser coeso e ácido; bom para fruticultura (mamão, citros, dendê) e cana."
	},
	{
		code: "LB",
		label: "Latossolo Bruno",
		color: "#7a4a2a",
		description: "Latossolo de cor bruno-acinzentada, típico de regiões mais frias e úmidas. Planalto sul-brasileiro acima de 800 m (SC, RS, sul do PR). Apto para grãos (soja, milho, trigo) e fruticultura de clima temperado, como maçã."
	},
	{
		code: "PV",
		label: "Argissolo Vermelho",
		color: "#8b3a2e",
		description: "Argissolo de cor vermelha intensa no horizonte B, com aumento marcante de argila em profundidade. Sul e Sudeste, sobre rochas ricas em ferro. Boa fertilidade quando eutrófico; suscetível à erosão, exige conservação."
	},
	{
		code: "PA",
		label: "Argissolo Amarelo",
		color: "#d4a85a",
		description: "Argissolo amarelo (goethita), comum em tabuleiros costeiros do Nordeste e Amazônia. Frequentemente coeso e ácido; usado para cana, fruticultura e culturas perenes."
	},
	{
		code: "PVA",
		label: "Argissolo Vermelho-Amarelo",
		color: "#c97a44",
		description: "Argissolo com tons intermediários entre vermelho e amarelo. Uma das classes mais extensas do território nacional, presente em todas as regiões. Uso variável: pastagens, café, grãos e silvicultura."
	},
	{
		code: "PAC",
		label: "Argissolo Acinzentado",
		color: "#a8987a",
		description: "Argissolo de cor acinzentada no horizonte B, indicando hidromorfismo. Áreas de baixadas costeiras e regiões periodicamente úmidas. Drenagem deficiente limita o uso a pastagem e fruticultura adaptada."
	},
	{
		code: "NV",
		label: "Nitossolo Vermelho",
		color: "#5a1818",
		description: "Nitossolo argiloso, profundo e fértil, com cerosidade típica. Cor vermelha intensa originada de basaltos e diabásios — as clássicas \"terras roxas\" do norte do PR e oeste de SP. Altamente produtivos em soja, milho, café e cana."
	},
	{
		code: "NX",
		label: "Nitossolo Háplico",
		color: "#8c4a3a",
		description: "Nitossolo de cor variável (brunada, amarelada), sem o vermelho intenso dos derivados de basalto. Áreas de transição em diversas regiões. Bons solos agrícolas, embora menos férteis que os Nitossolos Vermelhos."
	},
	{
		code: "CX",
		label: "Cambissolo Háplico",
		color: "#9b7653",
		description: "Cambissolo jovem, em estágio inicial de desenvolvimento, raso a medianamente profundo. Áreas montanhosas do Sudeste, Nordeste semiárido e bordas de chapadas. Aptidão limitada pelo relevo e profundidade — pastagem e fruticultura."
	},
	{
		code: "CH",
		label: "Cambissolo Húmico",
		color: "#6f4e37",
		description: "Cambissolo com horizonte superficial espesso, escuro e rico em matéria orgânica. Áreas altas e úmidas do Sul e Sudeste, campos de altitude. Acentuadamente ácido e álico; pastagem natural e silvicultura."
	},
	{
		code: "RL",
		label: "Neossolo Litólico",
		color: "#7d7c7a",
		description: "Neossolo muito raso (< 50 cm), assentado diretamente sobre rocha. Áreas montanhosas e Nordeste semiárido (Caatinga). Inadequado para agricultura; ideal para preservação e pastagem extensiva."
	},
	{
		code: "RQ",
		label: "Neossolo Quartzarênico",
		color: "#f1e0a8",
		description: "Neossolo profundo, mas com mais de 95% de areia (quartzo) — quase sem argila. Cerrado, costa litorânea e oeste da Bahia. Baixíssima retenção de água e nutrientes; aptidão restrita a culturas adaptadas com manejo intensivo."
	},
	{
		code: "RU",
		label: "Neossolo Flúvico",
		color: "#a8c4d9",
		description: "Neossolo formado por sedimentos aluviais recentes, com camadas estratificadas. Várzeas e planícies de inundação. Geralmente fértil; tradicional para arroz, hortaliças e culturas de várzea."
	},
	{
		code: "RR",
		label: "Neossolo Regolítico",
		color: "#bfb098",
		description: "Neossolo sobre material em decomposição da rocha (saprolito), com mais de 50 cm de profundidade. Semiárido nordestino e relevos movimentados. Limitada; pastagem natural e culturas adaptadas à seca."
	},
	{
		code: "GX",
		label: "Gleissolo Háplico",
		color: "#5f7d8c",
		description: "Gleissolo típico, com saturação periódica por água e cores cinza-azuladas do horizonte glei. Várzeas e baixadas em todo o país. Apto para arroz irrigado e pastagem; com drenagem, para hortaliças."
	},
	{
		code: "GZ",
		label: "Gleissolo Sálico",
		color: "#7fa3a6",
		description: "Gleissolo com alta concentração de sais solúveis nos primeiros 100 cm. Mangues, áreas costeiras com influência marinha e baixadas do semiárido. Inapto à agricultura; ambientalmente importante."
	},
	{
		code: "GJ",
		label: "Gleissolo Tiomórfico",
		color: "#4a6a73",
		description: "Gleissolo com horizonte sulfúrico — extremamente ácido quando drenado. Áreas de mangues e baixadas costeiras. Inapto; a drenagem libera ácido sulfúrico, devastando a área."
	},
	{
		code: "FX",
		label: "Plintossolo Háplico",
		color: "#c46b3e",
		description: "Plintossolo com plintita ainda macia (argila e óxidos de ferro mosqueados que endurecem ao secar). Cerrado, Amazônia e áreas planas mal drenadas. Restrita: a alternância de seca e encharcamento é desafio agrícola; pastagem."
	},
	{
		code: "FF",
		label: "Plintossolo Pétrico",
		color: "#8b4727",
		description: "Plintossolo com predomínio de petroplintita — concreções ou couraça ferruginosa endurecida. Chapadas e platôs do Cerrado e Amazônia. Limitada pela presença de cascalho e baixa profundidade efetiva."
	},
	{
		code: "ES",
		label: "Espodossolo",
		color: "#5a4a3b",
		description: "Solo arenoso com horizonte E claro e B espódico escuro, cimentado por matéria orgânica e/ou ferro/alumínio. Restingas litorâneas e campinas amazônicas. Quase nenhuma aptidão agrícola; ambientalmente sensível."
	},
	{
		code: "SX",
		label: "Planossolo Háplico",
		color: "#b8a875",
		description: "Planossolo típico, com mudança textural muito abrupta entre o A arenoso e o B argiloso impermeável. Pampa gaúcho, várzeas do Nordeste e relevos planos. Tradicional para arroz irrigado e pastagem."
	},
	{
		code: "SG",
		label: "Planossolo Hidromórfico",
		color: "#8a9779",
		description: "Planossolo com saturação por água mais persistente. Baixadas e várzeas, especialmente no Rio Grande do Sul. Arroz irrigado e pecuária extensiva."
	},
	{
		code: "SN",
		label: "Planossolo Nátrico",
		color: "#9a8a55",
		description: "Planossolo com alta saturação por sódio (≥ 15%) — solo sódico, de péssima estrutura física. Sertão nordestino e áreas semiáridas. Inadequado sem recuperação; uso restrito a pastagem."
	},
	{
		code: "TC",
		label: "Luvissolo Crômico",
		color: "#a86c34",
		description: "Luvissolo raso a mediano com acúmulo de argila no B, cores vivas e alta fertilidade natural (eutrófico). Sertão nordestino (Caatinga) e regiões semiáridas. Bom potencial agrícola, limitado pela seca; algodão, milho, feijão e pastagem."
	},
	{
		code: "VC",
		label: "Vertissolo Cromado",
		color: "#3d3a36",
		description: "Vertissolo extremamente argiloso (esmectítico) que incha úmido e racha quando seco, de cor brunada a avermelhada. Áreas semiáridas do Nordeste sobre rochas calcárias. Fértil, mas de manejo físico difícil."
	},
	{
		code: "VE",
		label: "Vertissolo Ebânico",
		color: "#2a2826",
		description: "Vertissolo de cor muito escura (quase preta), rico em matéria orgânica. Recôncavo Baiano e Nordeste sobre rochas básicas. Alta fertilidade; cultivado historicamente com cana, algodão e fumo."
	},
	{
		code: "VG",
		label: "Vertissolo Hidromórfico",
		color: "#4a4640",
		description: "Vertissolo com saturação por água em parte do ano. Baixadas e várzeas com argila expansiva. Arroz irrigado e pastagem; manejo físico complicado."
	},
	{
		code: "AC",
		label: "Alissolo Crômico",
		color: "#9a5a3a",
		description: "Alissolo argilúvico com cores vivas e altíssima saturação por alumínio — solo pobre, ácido e tóxico à maioria das plantas. Áreas dispersas no Sul e Sudeste em rochas ácidas. Uso restrito; exige forte correção de acidez."
	},
	{
		code: "MT",
		label: "Chernossolo Argilúvico",
		color: "#3a2a1a",
		description: "Chernossolo com horizonte A escuro, rico em matéria orgânica e cálcio, e B textural (acúmulo de argila). Pampa gaúcho e áreas isoladas do Nordeste. Excelente para grãos e pastagem; alta fertilidade natural."
	},
	{
		code: "MD",
		label: "Chernossolo Rêndzico",
		color: "#4a3a28",
		description: "Chernossolo raso, sobre material rico em carbonato de cálcio (rochas calcárias). Áreas calcárias localizadas (semiárido nordestino, Brasil Central). Alta fertilidade, mas profundidade limitada restringe o uso."
	},
	{
		code: "ME",
		label: "Chernossolo Ebânico",
		color: "#2e2014",
		description: "Chernossolo de coloração muito escura no perfil, com estrutura bem desenvolvida. Áreas isoladas do Sul e Nordeste sobre rochas básicas. Solos férteis e produtivos."
	},
	{
		code: "OY",
		label: "Organossolo",
		color: "#3a2a18",
		description: "Solo formado pela acumulação de material orgânico (turfa), com camada orgânica espessa (> 40 cm) sobre material mineral. Várzeas, banhados e campos de altitude. Conservação ambiental; uso agrícola exige drenagem cuidadosa."
	},
	{
		code: "AR",
		label: "Afloramento Rochoso",
		color: "#9aa0a6",
		description: "Exposições de rocha na superfície, sem cobertura de solo significativa. Comum em serras, inselbergs do semiárido e topos de morros. Sem aptidão agrícola."
	},
	{
		code: "DN",
		label: "Dunas",
		color: "#f0d878",
		description: "Depósitos eólicos de areia, móveis ou semi-fixados por vegetação. Comuns no litoral nordestino (Lençóis Maranhenses, Cabo Frio) e algumas áreas continentais. Não constituem solo agricultável."
	},
	{
		code: "Magua",
		label: "Massa d'água",
		color: "#4a90c8",
		description: "Corpos d'água — rios, lagos, açudes, lagoas costeiras e zona econômica exclusiva marítima. Inseridos no mapa para completar a cobertura territorial."
	}
], d = {
	code: "OUTROS",
	label: "Outros / não catalogado",
	color: "#9e9e9e",
	description: "Polígonos cujo código de simbologia (COD_SIMBOL) não corresponde a nenhuma classe catalogada neste mapa. Inclui unidades raras, combinações específicas ou notação fora do padrão dos prefixos do SiBCS."
}, f = new Map(u.map((e) => [e.code, e]));
function p(e) {
	return e ? f.get(e) ?? d : d;
}
function m(e) {
	if (!e) return d.code;
	let t = e.match(/^[A-Za-z]+/);
	return t && f.has(t[0]) ? t[0] : d.code;
}
//#endregion
//#region src/MapView.tsx
var h = [
	"match",
	["get", "soilClass"],
	...u.flatMap((e) => [e.code, e.color]),
	d.color
], g = {
	longitude: -53,
	latitude: -14,
	zoom: 3.6
}, _ = "https://tiles.openfreemap.org/styles/liberty";
function v({ data: f, activeFilters: p, projects: m, mapStyle: v = _, initialViewState: C = g }) {
	let [w, T] = n(null), [E, D] = n(null), [O, k] = n(null), A = e((e, t) => {
		D({
			cls: e,
			anchorRight: t.right,
			anchorTop: t.top
		});
	}, []), j = e(() => D(null), []), M = t(() => [
		"in",
		["get", "soilClass"],
		["literal", Array.from(p)]
	], [p]);
	return /* @__PURE__ */ l("div", {
		className: "map-container",
		children: [
			/* @__PURE__ */ l(i, {
				initialViewState: C,
				style: {
					width: "100%",
					height: "100%"
				},
				mapStyle: v,
				interactiveLayerIds: f ? ["soil-fill"] : [],
				onClick: (e) => {
					let t = e.features?.[0];
					if (!t) {
						T(null);
						return;
					}
					T({
						longitude: e.lngLat.lng,
						latitude: e.lngLat.lat,
						properties: t.properties
					});
				},
				children: [
					f && /* @__PURE__ */ l(s, {
						id: "solos",
						type: "geojson",
						data: f,
						children: [/* @__PURE__ */ c(r, {
							id: "soil-fill",
							type: "fill",
							filter: M,
							paint: {
								"fill-color": h,
								"fill-opacity": .55
							}
						}), /* @__PURE__ */ c(r, {
							id: "soil-outline",
							type: "line",
							filter: M,
							paint: {
								"line-color": "#1a1a2e",
								"line-width": .3,
								"line-opacity": .35
							}
						})]
					}),
					w && /* @__PURE__ */ c(o, {
						longitude: w.longitude,
						latitude: w.latitude,
						onClose: () => T(null),
						closeOnClick: !1,
						anchor: "bottom",
						offset: 8,
						maxWidth: "320px",
						children: /* @__PURE__ */ c(x, { properties: w.properties })
					}),
					m?.map((e) => /* @__PURE__ */ c(a, {
						longitude: e.lng,
						latitude: e.lat,
						anchor: "bottom",
						children: /* @__PURE__ */ c("button", {
							type: "button",
							className: "project-pin",
							onMouseEnter: () => k(e),
							onMouseLeave: () => k(null),
							onFocus: () => k(e),
							onBlur: () => k(null),
							"aria-label": e.title,
							children: /* @__PURE__ */ l("svg", {
								width: "26",
								height: "34",
								viewBox: "0 0 26 34",
								fill: "none",
								"aria-hidden": "true",
								children: [/* @__PURE__ */ c("path", {
									d: "M13 0C5.82 0 0 5.82 0 13c0 9.75 13 21 13 21s13-11.25 13-21C26 5.82 20.18 0 13 0z",
									fill: "#a8521f"
								}), /* @__PURE__ */ c("circle", {
									cx: "13",
									cy: "13",
									r: "5",
									fill: "#fff"
								})]
							})
						})
					}, `${e.lat}-${e.lng}-${e.title}`)),
					O && /* @__PURE__ */ c(o, {
						longitude: O.lng,
						latitude: O.lat,
						onClose: () => k(null),
						closeOnClick: !1,
						closeButton: !1,
						anchor: "bottom",
						offset: 36,
						maxWidth: "320px",
						className: "project-popup-wrapper",
						children: /* @__PURE__ */ c(S, { project: O })
					})
				]
			}),
			!f && /* @__PURE__ */ c("div", {
				className: "map-overlay",
				children: "Carregando solos…"
			}),
			/* @__PURE__ */ l("div", {
				className: "legend",
				children: [/* @__PURE__ */ c("h3", { children: "Legenda" }), /* @__PURE__ */ l("div", {
					className: "legend-scroll",
					children: [
						u.filter((e) => p.has(e.code)).map((e) => /* @__PURE__ */ c(y, {
							cls: e,
							onShow: A,
							onHide: j
						}, e.code)),
						p.has(d.code) && /* @__PURE__ */ c(y, {
							cls: d,
							onShow: A,
							onHide: j
						}),
						p.size === 0 && /* @__PURE__ */ c("div", {
							className: "legend-empty",
							children: "Nenhuma classe selecionada."
						})
					]
				})]
			}),
			E && /* @__PURE__ */ c(b, { state: E })
		]
	});
}
function y({ cls: e, onShow: t, onHide: n }) {
	return /* @__PURE__ */ l("div", {
		className: "legend-item",
		tabIndex: 0,
		onMouseEnter: (n) => {
			t(e, n.currentTarget.getBoundingClientRect());
		},
		onMouseLeave: n,
		onFocus: (n) => {
			t(e, n.currentTarget.getBoundingClientRect());
		},
		onBlur: n,
		"aria-describedby": `legend-tooltip-${e.code}`,
		children: [/* @__PURE__ */ c("span", {
			className: "dot",
			style: { backgroundColor: e.color }
		}), /* @__PURE__ */ c("span", {
			className: "legend-name",
			children: e.label
		})]
	});
}
function b({ state: e }) {
	let { cls: t, anchorRight: n, anchorTop: r } = e;
	return /* @__PURE__ */ l("div", {
		className: "legend-tooltip",
		role: "tooltip",
		id: `legend-tooltip-${t.code}`,
		style: {
			right: window.innerWidth - n,
			top: r
		},
		children: [/* @__PURE__ */ l("div", {
			className: "legend-tooltip-title",
			children: [/* @__PURE__ */ c("span", {
				className: "legend-tooltip-code",
				children: t.code
			}), t.label]
		}), /* @__PURE__ */ c("div", {
			className: "legend-tooltip-body",
			children: t.description
		})]
	});
}
function x({ properties: e }) {
	let t = p(e.soilClass);
	return /* @__PURE__ */ l("div", {
		className: "soil-popup",
		children: [
			/* @__PURE__ */ l("div", {
				className: "popup-header",
				children: [/* @__PURE__ */ c("span", {
					className: "type-badge",
					style: { backgroundColor: t.color },
					children: t.code === d.code ? "?" : t.code
				}), t.label]
			}),
			e.DSC_COMPON && /* @__PURE__ */ l("div", {
				className: "popup-row",
				children: [/* @__PURE__ */ c("span", { children: "Componente" }), /* @__PURE__ */ c("span", { children: e.DSC_COMPON })]
			}),
			e.DSC_COMPO1 && /* @__PURE__ */ l("div", {
				className: "popup-row",
				children: [/* @__PURE__ */ c("span", { children: "Componente 2" }), /* @__PURE__ */ c("span", { children: e.DSC_COMPO1 })]
			}),
			e.DSC_COMPO2 && /* @__PURE__ */ l("div", {
				className: "popup-row",
				children: [/* @__PURE__ */ c("span", { children: "Componente 3" }), /* @__PURE__ */ c("span", { children: e.DSC_COMPO2 })]
			}),
			e.DSC_TEXTUR && /* @__PURE__ */ l("div", {
				className: "popup-row",
				children: [/* @__PURE__ */ c("span", { children: "Textura" }), /* @__PURE__ */ c("span", { children: e.DSC_TEXTUR })]
			}),
			e.COD_LEGEND && /* @__PURE__ */ l("div", {
				className: "popup-row",
				children: [/* @__PURE__ */ c("span", { children: "Código" }), /* @__PURE__ */ c("span", { children: e.COD_LEGEND })]
			})
		]
	});
}
function S({ project: e }) {
	return /* @__PURE__ */ l("div", {
		className: "project-popup",
		children: [e.urlPhoto && /* @__PURE__ */ c("img", {
			className: "project-popup-photo",
			src: e.urlPhoto,
			alt: e.title,
			loading: "lazy"
		}), /* @__PURE__ */ l("div", {
			className: "project-popup-body",
			children: [
				/* @__PURE__ */ c("div", {
					className: "project-popup-title",
					children: e.title
				}),
				/* @__PURE__ */ c("p", {
					className: "project-popup-description",
					children: e.description
				}),
				/* @__PURE__ */ l("div", {
					className: "project-popup-meta",
					children: [
						e.lat.toFixed(4),
						", ",
						e.lng.toFixed(4)
					]
				}),
				e.urlProjeto && /* @__PURE__ */ c("a", {
					className: "project-popup-link",
					href: e.urlProjeto,
					target: "_blank",
					rel: "noopener noreferrer",
					children: "Ver projeto →"
				})
			]
		})]
	});
}
//#endregion
export { v as MapView, d as OUTROS, u as SOIL_CLASSES, m as classifyCodSimbol, p as getSoilClass };

//# sourceMappingURL=map-manager.js.map