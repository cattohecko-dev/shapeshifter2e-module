import { ActorMtA } from "/systems/mta/module/actor.js";
import { ItemMtA } from "/systems/mta/module/item.js";
import { MtAItemSheet } from "/systems/mta/module/item-sheet.js";

const MODULE_ID = "shapeshifter2e-module";
const SHAPESHIFTER_VARIANT = "shapeshifter";
const MYTH_FACET_TEMPLATE = `modules/${MODULE_ID}/templates/items/myth-facet.html`;

const SHAPESHIFTER_FORMS = [
  {
    name: "Human",
    type: "form",
    img: "systems/mta/icons/forms/Hishu.svg",
    system: {
      subname: "Human",
      effects: [{ name: "derivedTraits.perception", value: 1, overFive: true }],
      description_short: "Sheep's Clothing",
      description: "",
      effectsActive: true
    }
  },
  {
    name: "Half-Myth",
    type: "form",
    img: "systems/mta/icons/forms/Dalu.svg",
    system: {
      subname: "Half-Myth",
      effects: [
        { name: "attributes_physical.strength", value: 1, overFive: true },
        { name: "attributes_physical.stamina", value: 1, overFive: true },
        { name: "attributes_social.manipulation", value: -1, overFive: true },
        { name: "derivedTraits.size", value: 1, overFive: true },
        { name: "derivedTraits.perception", value: 2, overFive: true }
      ],
      description_short: "Teeth/Claws +0L\nDefense vs. Firearms\nMild Lunacy\nBadass Motherfucker",
      description: ""
    }
  },
  {
    name: "Myth",
    type: "form",
    img: "systems/mta/icons/forms/Gauru.svg",
    system: {
      subname: "Myth",
      effects: [
        { name: "attributes_physical.strength", value: 3, overFive: true },
        { name: "attributes_physical.dexterity", value: 1, overFive: true },
        { name: "attributes_physical.stamina", value: 2, overFive: true },
        { name: "derivedTraits.size", value: 2, overFive: true },
        { name: "derivedTraits.perception", value: 3, overFive: true }
      ],
      description_short: "Teeth/Claws +2L\n(Initiative +3)\nDefense vs. Firearms\nFull Lunacy\nRegeneration\nRage\nPrimal Fear",
      description: ""
    }
  },
  {
    name: "Half-Cryptid",
    type: "form",
    img: "systems/mta/icons/forms/Urshul.svg",
    system: {
      subname: "Half-Cryptid",
      effects: [
        { name: "attributes_physical.strength", value: 2, overFive: true },
        { name: "attributes_physical.dexterity", value: 2, overFive: true },
        { name: "attributes_physical.stamina", value: 2, overFive: true },
        { name: "attributes_social.manipulation", value: -1, overFive: true },
        { name: "derivedTraits.size", value: 1, overFive: true },
        { name: "derivedTraits.speed", value: 3, overFive: true },
        { name: "derivedTraits.perception", value: 3, overFive: true }
      ],
      description_short: "Teeth +2L/Claws +1L\nDefense vs. Firearms\nModerate Lunacy\nWeaken the Prey",
      description: ""
    }
  },
  {
    name: "Cryptid",
    type: "form",
    img: "systems/mta/icons/forms/Urhan.svg",
    system: {
      subname: "Cryptid",
      effects: [
        { name: "attributes_physical.dexterity", value: 2, overFive: true },
        { name: "attributes_physical.stamina", value: 1, overFive: true },
        { name: "attributes_social.manipulation", value: -1, overFive: true },
        { name: "derivedTraits.size", value: -1, overFive: true },
        { name: "derivedTraits.speed", value: 3, overFive: true },
        { name: "derivedTraits.perception", value: 4, overFive: true }
      ],
      description_short: "Teeth +1L\nChase Down",
      description: ""
    }
  }
];

const SHAPESHIFTER_RENOWN = {
  competence: "Competence",
  guardianship: "Guardianship",
  civility: "Civility",
  integrity: "Integrity",
  empathy: "Empathy",
  magnanimity: "Magnanimity"
};

const LEGACY_RENOWN_TO_NEW = {
  purity: "competence",
  glory: "guardianship",
  honor: "civility",
  wisdom: "integrity",
  cunning: "empathy"
};

const MYTH_FACET_CATEGORIES = {
  nightmare: "Nightmare Myths",
  wyrd: "Wyrd Myths",
  excalibur: "Excalibur Myths"
};

const LEGACY_FACET_CATEGORY_TO_NEW = {
  moon: "nightmare",
  shadow: "wyrd",
  wolf: "excalibur"
};

const SHAPESHIFTER_FORM_DISPLAY = {
  Hishu: ["Human", "Human"],
  Human: ["Human", "Human"],
  Dalu: ["Half-Myth", "Half-Myth"],
  "Half-Myth": ["Half-Myth", "Half-Myth"],
  Gauru: ["Myth", "Myth"],
  Myth: ["Myth", "Myth"],
  Urshul: ["Half-Cryptid", "Half-Cryptid"],
  "Half-Cryptid": ["Half-Cryptid", "Half-Cryptid"],
  Urhan: ["Cryptid", "Cryptid"],
  Cryptid: ["Cryptid", "Cryptid"]
};

const SHAPESHIFTER_FORM_ORDER = ["Human", "Half-Myth", "Myth", "Half-Cryptid", "Cryptid"];

function isShapeshifterWerewolf(actor) {
  return actor?.type === "character"
    && actor?.system?.characterType === "werewolf"
    && actor?.system?.characterVariant === SHAPESHIFTER_VARIANT;
}

function getSheetScroller(html) {
  const appShell = html.closest(".window-app, .application");
  const scroller = appShell.find(".window-content").first();
  return scroller.length ? scroller : html.parent();
}

function rememberSheetScroll(app, html) {
  const scroller = getSheetScroller(html);
  app._shapeshifterScrollTop = scroller.scrollTop();
}

function restoreSheetScroll(app, html) {
  const scrollTop = app._shapeshifterScrollTop;
  if (!Number.isFinite(scrollTop)) return;

  window.requestAnimationFrame(() => {
    getSheetScroller(html).scrollTop(scrollTop);
  });
}

function getFormDisplay(item) {
  return SHAPESHIFTER_FORM_DISPLAY[item.name] ?? SHAPESHIFTER_FORM_DISPLAY[item.system?.subname] ?? [item.name, item.system?.subname ?? ""];
}

function getFormSortIndex(item) {
  return SHAPESHIFTER_FORM_ORDER.indexOf(getFormDisplay(item)[0]);
}

function addPlus(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function translateTraitName(value) {
  const translated = value.split(".").reduce((object, key) => object?.[key], CONFIG.MTA);
  return translated ?? value;
}

function getModuleMythData(actor) {
  return actor?.flags?.[MODULE_ID]?.myth ?? {};
}

function getMythField(actor, path, fallback) {
  const value = foundry.utils.getProperty(getModuleMythData(actor), path);
  if (value === null || value === undefined || value === "") return fallback;
  return value;
}

function getMythheartValue(actor) {
  const fallback = Number(actor?.system?.harmony?.value ?? 1);
  const value = Number(getMythField(actor, "mythheart", fallback));
  return Number.isFinite(value) ? value : fallback;
}

function getGlamourValue(actor) {
  const fallback = Number(actor?.system?.essence?.value ?? 0);
  const value = Number(getMythField(actor, "glamour.value", fallback));
  return Number.isFinite(value) ? value : fallback;
}

function getGlamourMax(actor) {
  const mythheart = Math.min(9, Math.max(0, getMythheartValue(actor) - 1));
  const fallback = Number(CONFIG.MTA?.primalUrge_levels?.[mythheart]?.max_essence ?? actor?.system?.essence?.max ?? 10);
  const value = Number(getMythField(actor, "glamour.max", fallback));
  return Number.isFinite(value) ? value : fallback;
}

function getGlamourPerTurn(actor) {
  const mythheart = Math.min(9, Math.max(0, getMythheartValue(actor) - 1));
  const fallback = Number(CONFIG.MTA?.primalUrge_levels?.[mythheart]?.essence_per_turn ?? actor?.system?.essence_per_turn ?? 1);
  const value = Number(getMythField(actor, "glamour.perTurn", fallback));
  return Number.isFinite(value) ? value : fallback;
}

function getPassionValue(actor) {
  const fallback = Number(actor?.system?.harmony?.value ?? 1);
  const value = Number(getMythField(actor, "passion.value", fallback));
  return Number.isFinite(value) ? value : fallback;
}

function getPassionCheckedBoxes(actor) {
  const value = Number(getMythField(actor, "passion.checkedBoxes", 0));
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function getPassionPerTurn(actor) {
  return Math.ceil(getPassionValue(actor) / 2);
}

function getRenownValue(actor, key) {
  const legacyKey = Object.entries(LEGACY_RENOWN_TO_NEW).find(([, newKey]) => newKey === key)?.[0];
  const fallback = Number(actor?.system?.werewolf_renown?.[key]?.value
    ?? (legacyKey ? actor?.system?.werewolf_renown?.[legacyKey]?.value : 0)
    ?? 0);
  const value = Number(getMythField(actor, `renown.${key}.value`, fallback));
  return Number.isFinite(value) ? value : fallback;
}

function getRenownTemporary(actor, key) {
  const legacyKey = Object.entries(LEGACY_RENOWN_TO_NEW).find(([, newKey]) => newKey === key)?.[0];
  const fallback = Number(actor?.system?.werewolf_renown?.[key]?.temporary
    ?? (legacyKey ? actor?.system?.werewolf_renown?.[legacyKey]?.temporary : 0)
    ?? 0);
  const value = Number(getMythField(actor, `renown.${key}.temporary`, fallback));
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

function buildTrackerBoxes(count, filledCount, baseClass, ariaPrefix, valueAttr = "data-track-value", extraAttributes = "") {
  const total = Math.max(0, Math.trunc(count));
  const filled = Math.max(0, Math.min(total, Math.trunc(filledCount)));
  return Array.from({ length: total }, (_, index) => {
    const isFilled = index < filled;
    return `<div class="${baseClass} ${isFilled ? "is-filled" : ""}" data-state="${isFilled ? 1 : 0}" data-index="${index}" ${valueAttr}="${index + 1}" ${extraAttributes} aria-label="${ariaPrefix} ${index + 1}">${isFilled ? "x" : ""}</div>`;
  }).join("");
}

function buildMythheartHtml(actor) {
  const value = getMythheartValue(actor);
  const checkboxId = `ShapeshifterMythheart${actor.id}`;

  return `
    <div class="kInput statBox big shapeshifter-myth__stat shapeshifter-myth__mythheart" data-myth-path="mythheart">
      <h4>
        <input class="attribute-check" id="${checkboxId}" data-trait="shapeshifter_myth.mythheart" data-attributeValue="${value}" data-attributeLabel="Mythheart" type="checkbox" data-dtype="Boolean">
        <label class="button attribute-button shapeshifter-myth__title" for="${checkboxId}">Mythheart</label>
      </h4>
      <div class="gold-border"></div>
      <div class="split">
        <div class="niceNumber buttonsLeft shapeshifter-myth__number" data-update-path="flags.${MODULE_ID}.myth.mythheart">
          <input name="flags.${MODULE_ID}.myth.mythheart" type="number" value="${value}" data-dtype="Number" step="1">
          <div class="numBtns">
            <div class="plusBtn">+</div>
            <div class="minusBtn">-</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildGlamourHtml(actor) {
  const value = getGlamourValue(actor);
  const max = getGlamourMax(actor);
  const perTurn = getGlamourPerTurn(actor);

  return `
    <div class="kInput statBox big shapeshifter-myth__stat shapeshifter-myth__glamour" data-myth-path="glamour">
      <h4>
        <label class="attribute-button shapeshifter-myth__title">Glamour</label>
      </h4>
      <div class="gold-border"></div>
      <div class="split">
        <div class="niceNumber buttonsLeft shapeshifter-myth__number" data-update-path="flags.${MODULE_ID}.myth.glamour.value" data-clamp-min="0" data-clamp-max="${max}">
          <input name="flags.${MODULE_ID}.myth.glamour.value" type="number" value="${value}" data-dtype="Number" step="1">
          <div class="numBtns">
            <div class="plusBtn">+</div>
            <div class="minusBtn">-</div>
          </div>
        </div>
        <span class="delimiter"> / </span>
        <div class="niceNumber shapeshifter-myth__max">
          <input type="number" value="${max}" data-dtype="Number" readonly>
        </div>
      </div>
      <div class="description shapeshifter-myth__note">${perTurn} Glamour Per Turn</div>
    </div>
  `;
}

function buildPassionHtml(actor) {
  const passionValue = getPassionValue(actor);
  const passionBoxCount = Math.max(0, Math.trunc(passionValue));
  const passionChecked = Math.max(0, Math.min(passionBoxCount, Math.trunc(getPassionCheckedBoxes(actor))));
  const passionPerTurn = getPassionPerTurn(actor);
  const passionBoxes = buildTrackerBoxes(passionBoxCount, passionChecked, "shapeshifter-passion__box", "Passion", "data-passion-box");

  return `
    <div class="kInput statBox big kMageTracker shapeshifter-passion"
      data-type="passion"
      data-name="flags.${MODULE_ID}.myth.passion"
      data-states="max/value"
      data-max="${passionBoxCount}"
      data-value="${passionValue}"
      data-checked-boxes="${passionChecked}"
      data-initialised="yes">
      <h4>
        <label class="attribute-button shapeshifter-passion__title">Passion</label>
      </h4>
      <div class="gold-border"></div>
      <div class="niceNumber buttonsLeft shapeshifter-passion__total" data-update-path="flags.${MODULE_ID}.myth.passion.value">
        <input name="flags.${MODULE_ID}.myth.passion.value" type="number" value="${passionValue}" data-dtype="Number" step="1">
        <div class="numBtns">
          <div class="plusBtn">+</div>
          <div class="minusBtn">-</div>
        </div>
      </div>
      <div class="boxes shapeshifter-passion__boxes">${passionBoxes}</div>
      <div class="info description shapeshifter-passion__note">${passionPerTurn} Passion per turn</div>
    </div>
  `;
}

function buildRenownRowHtml(actor, renownKey, label) {
  const totalValue = getRenownValue(actor, renownKey);
  const temporaryValue = Math.min(5, getRenownTemporary(actor, renownKey));
  const boxes = buildTrackerBoxes(5, temporaryValue, "shapeshifter-renown__box", label, "data-renown-value", `data-renown-key="${renownKey}"`);

  return `
    <li class="attribute flexrow shapeshifter-renown__row" data-renown-key="${renownKey}">
      <div class="niceNumber buttonsLeft shapeshifter-renown__total" data-update-path="flags.${MODULE_ID}.myth.renown.${renownKey}.value" data-clamp-min="0" data-clamp-max="5">
        <input name="flags.${MODULE_ID}.myth.renown.${renownKey}.value" type="number" value="${totalValue}" data-dtype="Number" min="0" max="5">
        <div class="numBtns">
          <div class="plusBtn">+</div>
          <div class="minusBtn">-</div>
        </div>
      </div>
      <span class="attribute-button shapeshifter-renown__label">${label}</span>
      <span class="boxes shapeshifter-renown__boxes">${boxes}</span>
      <input type="hidden" name="flags.${MODULE_ID}.myth.renown.${renownKey}.temporary" data-dtype="Number" value="${temporaryValue}">
    </li>
  `;
}

function buildRenownBlock(actor) {
  const rows = Object.entries(SHAPESHIFTER_RENOWN)
    .map(([key, label]) => buildRenownRowHtml(actor, key, label))
    .join("");

  return `
    <ol class="attributes-list shapeshifter-renown-list">
      <li class="attributes-header flexrow">
        <span class="attribute-key">Renown</span>
        <span class="attribute-valueHeader">Tales</span>
      </li>
      ${rows}
    </ol>
  `;
}

function buildFormsBlockHtml(actor) {
  const forms = actor.items
    .filter(item => item.type === "form")
    .slice()
    .sort((a, b) => {
      const orderA = getFormSortIndex(a);
      const orderB = getFormSortIndex(b);
      if (orderA !== orderB) return (orderA < 0 ? 99 : orderA) - (orderB < 0 ? 99 : orderB);
      return (a.sort ?? 0) - (b.sort ?? 0) || (a.name ?? "").localeCompare(b.name ?? "");
    });

  return `
    <div class="forms-block shapeshifter-forms-block">
      ${forms.map(item => {
        const effects = item.system?.effects ?? [];
        const description = item.system?.description_short ?? "";
        const active = item.system?.effectsActive ? "effectActive" : "";
        const [displayName, displaySubname] = getFormDisplay(item);
        return `
          <div class="forms-column ${active}">
            <div class="top-row">
              <span class="item-image" style="background-image: url(${item.img})" data-item-id="${item._id}" title="Transform"></span>
              <span class="item-name">
                <div>${displayName}</div>
                <div class="subname">(${displaySubname})</div>
              </span>
              <span class="button-panel">
                <span class="button stoneButton item-edit" data-item-id="${item._id}" title="${game.i18n.localize("MTA.EditItem")}"><i class="fas fa-edit"></i></span>
                <span class="button stoneButton item-delete" data-item-id="${item._id}" title="${game.i18n.localize("MTA.DeleteItem")}"><i class="fas fa-times-circle"></i></span>
              </span>
            </div>
            <div class="effect-list">
              ${effects.map(effect => `<div>${addPlus(effect.value)} ${translateTraitName(effect.name)}</div>`).join("")}
            </div>
            <div class="description">${description.replaceAll("\n", "<br>")}</div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function buildMythTabHtml(actor) {
  return `
    <div class="shapeshifter-myth-layout">
      ${buildFormsBlockHtml(actor)}

      <div class="attributes-flexrow shapeshifter-myth-resource-row">
        ${buildRenownBlock(actor)}
        <div class="flex-col shapeshifter-myth-resource-column">
          ${buildMythheartHtml(actor)}
          ${buildGlamourHtml(actor)}
        </div>
      </div>

      <div class="items-block shapeshifter-myth-tab__facets">
        <div class="items-table">
          ${buildMythFacetTable(actor)}
          ${buildRitesTable(actor)}
        </div>
      </div>
    </div>
  `;
}

function buildMythFacetRow(item) {
  const category = item.system?.giftType ?? "wyrd";
  const level = item.system?.level ?? "";
  const costValue = item.system?.cost?.value ?? "";
  const costMisc = item.system?.cost?.misc ?? "";
  const action = item.system?.action ?? "";
  const effectActive = item.system?.effectsActive ? "effectActive" : "";
  const favorite = item.system?.isFavorite ? "fas" : "far";
  const effectIcon = item.system?.effects
    ? `<i class="activeIcon ${item.system?.effectsActive ? "fas" : "far"} fa-dot-circle" title="Effects active" data-item-id="${item._id}"></i>`
    : "";

  return `
    <tr class="item-row item" data-item-id="${item._id}" data-myth-category="${category}">
      <td class="cell item-name first" data-item-id="${item._id}">
        <div class="item-name-wrapper">
          <div class="item-image ${effectActive}" style="background-image: url(${item.img})"></div>
          <span>${item.name}</span>
        </div>
      </td>
      <td class="cell">${item.system?.gift ?? ""}</td>
      <td class="cell">${level}</td>
      <td class="cell">${costValue} ${costMisc}</td>
      <td class="cell">${action}</td>
      <td class="cell">
        ${effectIcon}
        <i class="favicon ${favorite} fa-star" title="Favorite" data-item-id="${item._id}"></i>
      </td>
      <td class="cell edit-delete">
        <span class="button stoneButton item-edit" data-item-id="${item._id}" title="${game.i18n.localize("MTA.EditItem")}"><i class="fas fa-edit"></i></span>
        <span class="button stoneButton item-delete" data-item-id="${item._id}" title="${game.i18n.localize("MTA.DeleteItem")}"><i class="fas fa-times-circle"></i></span>
      </td>
    </tr>
  `;
}

function buildMythFacetTable(actor) {
  const items = actor.items
    .filter(item => item.type === "facet")
    .slice()
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || (a.name ?? "").localeCompare(b.name ?? ""));

  const grouped = Object.fromEntries(Object.keys(MYTH_FACET_CATEGORIES).map(key => [key, []]));
  for (const item of items) {
    const category = LEGACY_FACET_CATEGORY_TO_NEW[item.system?.giftType] ?? item.system?.giftType ?? "wyrd";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(item);
  }

  const subHeaderRow = label => `<tr class="sub-header"><td colspan="7">${label}</td></tr>`;
  const rows = Object.entries(MYTH_FACET_CATEGORIES)
    .map(([key, label]) => `${subHeaderRow(label)}${(grouped[key] ?? []).map(buildMythFacetRow).join("")}`)
    .join("");

  return `
    <table class="item-table shapeshifter-myth-facet-table">
      <thead>
        <tr class="item-row header">
          <th class="cell header first">
            <span class="sortable button" data-type="facet">Myth Facets</span>
          </th>
          <th class="cell header">Myth</th>
          <th class="cell header">Level</th>
          <th class="cell header">Cost</th>
          <th class="cell header">Action</th>
          <th class="cell header"></th>
          <th class="cell header button item-create" data-type="facet">${game.i18n.localize("MTA.ButtonAdd")}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildRitesTable(actor) {
  const inventory = actor.items
    .filter(item => item.type === "werewolf_rite")
    .slice()
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || (a.name ?? "").localeCompare(b.name ?? ""));

  const rows = inventory.map(item => `
    <tr class="item-row item" data-item-id="${item._id}">
      <td class="cell item-name first" data-item-id="${item._id}">
        <div class="item-name-wrapper">
          <div class="item-image ${item.system?.effectsActive ? "effectActive" : ""}" style="background-image: url(${item.img})"></div>
          <span>${item.name}</span>
        </div>
      </td>
      <td class="cell">${item.system?.riteType ?? ""}</td>
      <td class="cell">${item.system?.level ?? ""}</td>
      <td class="cell">${item.system?.action ?? ""}</td>
      <td class="cell">
        ${item.system?.effects ? `<i class="activeIcon ${item.system?.effectsActive ? "fas" : "far"} fa-dot-circle" title="Effects active" data-item-id="${item._id}"></i>` : ""}
        <i class="favicon ${item.system?.isFavorite ? "fas" : "far"} fa-star" title="Favorite" data-item-id="${item._id}"></i>
      </td>
      <td class="cell edit-delete">
        <span class="button stoneButton item-edit" data-item-id="${item._id}" title="${game.i18n.localize("MTA.EditItem")}"><i class="fas fa-edit"></i></span>
        <span class="button stoneButton item-delete" data-item-id="${item._id}" title="${game.i18n.localize("MTA.DeleteItem")}"><i class="fas fa-times-circle"></i></span>
      </td>
    </tr>
  `).join("");

  return `
    <table class="item-table shapeshifter-rites-table">
      <thead>
        <tr class="item-row header">
          <th class="cell header first">
            <span class="collapsible button fas fa-minus-square"></span>
            <span class="sortable button" data-sorttype="werewolf_rite" data-sortproperty="name" data-type="werewolf_rite">Rites<i class="fas fa-sort"></i></span>
          </th>
          <th class="cell header">Type</th>
          <th class="cell header">Level</th>
          <th class="cell header">Action</th>
          <th class="cell header"></th>
          <th class="cell header button item-create" data-type="werewolf_rite">${game.i18n.localize("MTA.ButtonAdd")}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function patchWerewolfTemplateConfig() {
  const werewolfConfig = CONFIG.MTA?.characterConfig?.character?.werewolf;
  if (!werewolfConfig) {
    console.warn("Shapeshifter 2e Module: MTA werewolf template config was not found.");
    return;
  }

  werewolfConfig.shapeshifter ??= {
    locale: "Shapeshifter",
    sheet: [],
    virtueName: "MTA.Blood",
    viceName: "MTA.Bone"
  };
  werewolfConfig.shapeshifter.sheet = [];
  CONFIG.MTA.shapeshifter_myth ??= {};
  CONFIG.MTA.shapeshifter_myth.mythheart = "Mythheart";
}

function patchItemSheetTemplate() {
  if (MtAItemSheet.prototype._shapeshifterMythTemplatePatched) return;

  const originalTemplate = Object.getOwnPropertyDescriptor(MtAItemSheet.prototype, "template")?.get;
  Object.defineProperty(MtAItemSheet.prototype, "template", {
    configurable: true,
    enumerable: true,
    get() {
      if (this.item?.type === "facet") return MYTH_FACET_TEMPLATE;
      return originalTemplate ? originalTemplate.call(this) : "systems/mta/templates/items/item.html";
    }
  });

  MtAItemSheet.prototype._shapeshifterMythTemplatePatched = true;
}

function patchItemPrepareData() {
  if (ItemMtA.prototype._shapeshifterMythItemPatched) return;

  const originalPrepareData = ItemMtA.prototype.prepareData;
  ItemMtA.prototype.prepareData = function (...args) {
    originalPrepareData.apply(this, args);

    if (this.type !== "facet") return;

    const category = LEGACY_FACET_CATEGORY_TO_NEW[this.system?.giftType] ?? this.system?.giftType;
    if (category && category !== this.system?.giftType) {
      this.system.giftType = category;
    }

    if (!this.img || this.img === "icons/svg/item-bag.svg" || this.img.startsWith("systems/mta/icons/placeholders")) {
      const iconKey = category === "nightmare"
        ? "moonGift"
        : category === "wyrd"
          ? "shadowGift"
          : category === "excalibur"
            ? "wolfGift"
            : null;

      if (iconKey) {
        const placeholder = CONFIG.MTA.placeholders.get(iconKey);
        if (placeholder) this.img = placeholder;
      }
    }
  };

  ItemMtA.prototype._shapeshifterMythItemPatched = true;
}

function patchActorPrepareData() {
  if (ActorMtA.prototype._shapeshifterMythDataPatched) return;

  const originalPrepareData = ActorMtA.prototype.prepareData;
  ActorMtA.prototype.prepareData = function (...args) {
    const result = originalPrepareData.apply(this, args);

    if (isShapeshifterWerewolf(this)) {
      const mythheart = getMythheartValue(this);
      this.system.shapeshifter_myth = {
        mythheart: {
          value: mythheart,
          final: mythheart
        }
      };
    }

    return result;
  };

  ActorMtA.prototype._shapeshifterMythDataPatched = true;
}

function patchWerewolfForms() {
  if (ActorMtA.prototype._shapeshifterFormsPatched) return;

  const originalCreateWerewolfForms = ActorMtA.prototype.createWerewolfForms;
  ActorMtA.prototype.createWerewolfForms = async function (...args) {
    if (!isShapeshifterWerewolf(this)) {
      return originalCreateWerewolfForms.apply(this, args);
    }

    const oldForms = this.items.filter(item => item.type === "form").map(item => item.id);
    if (oldForms.length) await this.deleteEmbeddedDocuments("Item", oldForms);
    await this.createEmbeddedDocuments("Item", SHAPESHIFTER_FORMS);
  };

  ActorMtA.prototype._shapeshifterFormsPatched = true;
}

function patchSheetRender() {
  if (Hooks._shapeshifterMythRenderPatched) return;

  Hooks.on("renderActorSheet", (app, html) => {
    if (!isShapeshifterWerewolf(app.actor)) return;

    restoreSheetScroll(app, html);

    html.find('.tabs .item[data-tab="myth"], .tab[data-tab="myth"]').remove();

    const giftsNav = html.find('.tabs .item[data-tab="gifts"]').first();
    if (giftsNav.length) giftsNav.text("Myth");

    const giftsTab = html.find('.tab[data-tab="gifts"]').first();
    if (giftsTab.length) {
      giftsTab.addClass("shapeshifter-myth-tab");
      giftsTab.html(buildMythTabHtml(app.actor));
    }

    const bottomCharaBlock = html.find(".bottomCharaBlock").first();
    if (bottomCharaBlock.length && !bottomCharaBlock.find(".shapeshifter-passion").length) {
      bottomCharaBlock.append(buildPassionHtml(app.actor));
    }

    if (!html.find(".tabs .item.active").length) {
      giftsNav.addClass("active");
      giftsTab.addClass("active");
    }

    const mythTab = giftsTab;
    if (!mythTab.length) return;

    html.off(".shapeshifterMyth");
    html.off(".shapeshifterMythScroll");

    html.on("pointerdown.shapeshifterMythScroll", "input, select, textarea, .plusBtn, .minusBtn, .item-create, .item-delete", () => rememberSheetScroll(app, html));
    html.on("change.shapeshifterMythScroll", "input, select, textarea", () => rememberSheetScroll(app, html));

    html.on("click.shapeshifterMyth", ".shapeshifter-passion .plusBtn, .shapeshifter-passion .minusBtn, .shapeshifter-renown__total .plusBtn, .shapeshifter-renown__total .minusBtn, .shapeshifter-myth__stat .plusBtn, .shapeshifter-myth__stat .minusBtn", async ev => {
      ev.preventDefault();
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);

      const button = $(ev.currentTarget);
      const control = button.closest("[data-update-path]");
      const path = control.data("updatePath");
      if (!path) return;

      const input = control.find("input[type='number']").first();
      const current = Number(input.val() ?? 0);
      const delta = button.hasClass("plusBtn") ? 1 : -1;
      let next = current + delta;

      const min = control.data("clampMin");
      const max = control.data("clampMax");
      if (min !== undefined && min !== null && min !== "") next = Math.max(Number(min), next);
      if (max !== undefined && max !== null && max !== "") next = Math.min(Number(max), next);

      await app.actor.update({ [path]: next });
    });

    html.on("change.shapeshifterMyth", ".shapeshifter-passion input[type='number'], .shapeshifter-renown__total input[type='number'], .shapeshifter-myth__stat input[type='number']", async ev => {
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);

      const input = ev.currentTarget;
      const path = input.name;
      if (!path) return;

      const wrapper = $(input).closest("[data-update-path]");
      let next = Number(input.value ?? 0);
      const min = wrapper.data("clampMin");
      const max = wrapper.data("clampMax");
      if (min !== undefined && min !== null && min !== "") next = Math.max(Number(min), next);
      if (max !== undefined && max !== null && max !== "") next = Math.min(Number(max), next);

      await app.actor.update({ [path]: next });
    });

    html.on("click.shapeshifterMyth", ".shapeshifter-passion__box", async ev => {
      ev.preventDefault();
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);

      const boxIndex = Number(ev.currentTarget.dataset.index ?? 0);
      const current = Math.max(0, Math.trunc(getPassionCheckedBoxes(app.actor)));
      const next = current === boxIndex + 1 ? 0 : boxIndex + 1;

      await app.actor.update({
        [`flags.${MODULE_ID}.myth.passion.checkedBoxes`]: next
      });
    });

    html.on("click.shapeshifterMyth", ".shapeshifter-renown__box", async ev => {
      ev.preventDefault();
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);

      const button = ev.currentTarget;
      const key = button.dataset.renownKey;
      const value = Number(button.dataset.renownValue ?? 0);
      const current = Number(getMythField(app.actor, `renown.${key}.temporary`, 0));
      const next = current === value ? 0 : value;

      await app.actor.update({
        [`flags.${MODULE_ID}.myth.renown.${key}.temporary`]: next
      });
    });

    mythTab.on("click.shapeshifterMyth", ".item-image", event => app._onItemRoll(event));
    mythTab.on("contextmenu.shapeshifterMyth", ".item-image", event => app._onItemRoll(event, true));
    mythTab.on("click.shapeshifterMyth", ".item-edit", event => {
      const itemId = event.currentTarget.dataset.itemId;
      const item = app.actor.items.get(itemId);
      item?.sheet.render(true);
    });
    mythTab.on("click.shapeshifterMyth", ".item-delete", ev => {
      const itemId = ev.currentTarget.dataset.itemId;
      if (!itemId) return;

      if (ev.shiftKey) {
        app.actor.deleteEmbeddedDocuments("Item", [itemId]);
        return;
      }

      new foundry.appv1.api.Dialog({
        title: "Confirm delete",
        content: "<p>Are you sure you want to permanently delete this item?</p><p>(Holding shift skips this dialogue)</p>",
        buttons: {
          one: {
            icon: '<i class="fas fa-trash"></i>',
            label: "Delete",
            callback: () => app.actor.deleteEmbeddedDocuments("Item", [itemId])
          },
          two: { label: "Cancel" }
        },
        default: "two"
      }).render(true);
    });
    mythTab.on("click.shapeshifterMyth", ".item-create", event => app._onItemCreate(event));
  });

  Hooks._shapeshifterMythRenderPatched = true;
}

Hooks.once("init", () => {
  patchWerewolfTemplateConfig();
  patchItemSheetTemplate();
  patchItemPrepareData();
  patchActorPrepareData();
  patchWerewolfForms();
  patchSheetRender();
});

