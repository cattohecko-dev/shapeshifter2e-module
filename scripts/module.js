import { ActorMtA } from "/systems/mta/module/actor.js";
import { ItemMtA } from "/systems/mta/module/item.js";
import { MtAItemSheet } from "/systems/mta/module/item-sheet.js";

const MODULE_ID = "shapeshifter2e-module";
const SHAPESHIFTER_VARIANT = "shapeshifter";
const MYTH_FACET_TEMPLATE = `modules/${MODULE_ID}/templates/items/myth-facet.html`;
const TOUCHSTONE_TEMPLATE = `modules/${MODULE_ID}/templates/items/touchstone.html`;
const LAMB_TEMPLATE = `modules/${MODULE_ID}/templates/items/lamb.html`;

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

const DEFAULT_TOUCHSTONE_FONT = {
  model: "",
  weaponType: "Melee",
  damage: 0,
  penetration: 0,
  initiativeMod: 0,
  strengthReq: 1,
  size: 1,
  availability: 0,
  special: "",
  text: ""
};

const SHAPESHIFTER_MYTHHEART_LEVELS = [
  { level: 1, statMax: 5, glamourMax: 10, glamourPerTurn: 1, frailties: "One minor" },
  { level: 2, statMax: 5, glamourMax: 11, glamourPerTurn: 2, frailties: "One minor" },
  { level: 3, statMax: 5, glamourMax: 12, glamourPerTurn: 3, frailties: "Two minor" },
  { level: 4, statMax: 5, glamourMax: 13, glamourPerTurn: 4, frailties: "Two minor" },
  { level: 5, statMax: 5, glamourMax: 15, glamourPerTurn: 5, frailties: "One major, two minor" },
  { level: 6, statMax: 6, glamourMax: 20, glamourPerTurn: 6, frailties: "One major, two minor" },
  { level: 7, statMax: 7, glamourMax: 25, glamourPerTurn: 7, frailties: "One major, three minor" },
  { level: 8, statMax: 8, glamourMax: 30, glamourPerTurn: 8, frailties: "One major, three minor" },
  { level: 9, statMax: 9, glamourMax: 50, glamourPerTurn: 10, frailties: "Two major, three minor" },
  { level: 10, statMax: 10, glamourMax: 75, glamourPerTurn: 15, frailties: "Two major, three minor" }
];

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

function getMythheartLevel(actor) {
  return Math.min(10, Math.max(1, Math.trunc(getMythheartValue(actor))));
}

function getMythheartRules(actor) {
  return SHAPESHIFTER_MYTHHEART_LEVELS[getMythheartLevel(actor) - 1] ?? SHAPESHIFTER_MYTHHEART_LEVELS[0];
}

function getGlamourValue(actor) {
  const fallback = Number(actor?.system?.essence?.value ?? 0);
  const value = Number(getMythField(actor, "glamour.value", fallback));
  return Number.isFinite(value) ? value : fallback;
}

function getGlamourMax(actor) {
  return getMythheartRules(actor).glamourMax;
}

function getGlamourPerTurn(actor) {
  return getMythheartRules(actor).glamourPerTurn;
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

function getRenownState(actor, key) {
  const state = String(getMythField(actor, `renown.${key}.state`, ""));
  return state === "omen" || state === "tribe" ? state : "";
}

function escapeHtml(value) {
  return Handlebars.escapeExpression(value ?? "");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function getTouchstoneData(item) {
  return item?.getFlag?.(MODULE_ID, "touchstone") ?? item?.flags?.[MODULE_ID]?.touchstone ?? {};
}

function isTouchstoneItem(item) {
  return item?.type === "relationship" && getTouchstoneData(item)?.isTouchstone === true;
}

function isLambItem(item) {
  return item?.type === "relationship" && item?.getFlag?.(MODULE_ID, "lamb.isLamb") === true;
}

function getTouchstoneFontData(item) {
  return {
    ...DEFAULT_TOUCHSTONE_FONT,
    ...(getTouchstoneData(item)?.font ?? {})
  };
}

function getTouchstoneStatMods(item) {
  const statMods = getTouchstoneData(item)?.statMods ?? [];
  return Array.isArray(statMods) ? statMods : Object.values(statMods);
}

function getTouchstones(actor) {
  return actor.items
    .filter(isTouchstoneItem)
    .slice()
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || (a.name ?? "").localeCompare(b.name ?? ""));
}

function getShapeshifterTraitsData(actor) {
  return actor?.getFlag?.(MODULE_ID, "traits") ?? actor?.flags?.[MODULE_ID]?.traits ?? {};
}

function getShapeshifterRelationships(actor) {
  return actor.items
    .filter(item => item.type === "relationship" && !isTouchstoneItem(item))
    .slice()
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || (a.name ?? "").localeCompare(b.name ?? ""));
}

function getTouchstoneLimit(actor) {
  return getMythheartLevel(actor);
}

function getExcaliburData(actor) {
  return actor?.getFlag?.(MODULE_ID, "excalibur") ?? actor?.flags?.[MODULE_ID]?.excalibur ?? {};
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function nl2br(value) {
  return escapeHtml(value).replaceAll("\n", "<br>");
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
  const rules = getMythheartRules(actor);
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
      <div class="description shapeshifter-myth__note shapeshifter-mythheart__rules">
        Attribute/Skill Max ${rules.statMax} | Frailties: ${rules.frailties}
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
  const renownState = getRenownState(actor, renownKey);
  const renownStateLabel = renownState === "omen" ? "O" : renownState === "tribe" ? "T" : "";
  const renownStateTitle = renownState === "omen" ? "Omen Renown" : renownState === "tribe" ? "Tribe Renown" : "Set Omen or Tribe Renown";
  const boxes = buildTrackerBoxes(5, temporaryValue, "shapeshifter-renown__box", label, "data-renown-value", `data-renown-key="${renownKey}"`);

  return `
    <li class="attribute flexrow shapeshifter-renown__row" data-renown-key="${renownKey}">
      <span class="button renown-state shapeshifter-renown__state ${renownState}" title="${renownStateTitle}" data-renown-key="${renownKey}">${renownStateLabel}</span>
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

function buildShapeshifterRelationshipRow(item) {
  const kind = isLambItem(item) ? "Lamb" : "Relationship";

  return `
    <tr class="item-row item" data-item-id="${item.id}">
      <td class="cell item-name first" data-item-id="${item.id}">
        <div class="item-name-wrapper">
          <div class="item-image" style="background-image: url(${item.img})"></div>
          <span>${escapeHtml(item.name)}</span>
        </div>
      </td>
      <td class="cell">${kind}</td>
      <td class="cell">${escapeHtml(item.system?.impression ?? "Average")}</td>
      <td class="cell">${toNumber(item.system?.doors?.value)} / ${toNumber(item.system?.doors?.max, 1)}</td>
      <td class="cell">${toNumber(item.system?.penalty)}</td>
      <td class="cell edit-delete">
        <span class="button stoneButton item-edit" data-item-id="${item.id}" title="${game.i18n.localize("MTA.EditItem")}"><i class="fas fa-edit"></i></span>
        <span class="button stoneButton item-delete" data-item-id="${item.id}" title="${game.i18n.localize("MTA.DeleteItem")}"><i class="fas fa-times-circle"></i></span>
      </td>
    </tr>
  `;
}

function buildShapeshifterRelationshipsTable(actor) {
  const rows = getShapeshifterRelationships(actor).map(buildShapeshifterRelationshipRow).join("");

  return `
    <table class="item-table shapeshifter-relationships-table">
      <thead>
        <tr class="item-row header">
          <th class="cell header first">
            <span class="collapsible button fas fa-minus-square"></span>
            <span>Relationships and Lambs</span>
          </th>
          <th class="cell header">Type</th>
          <th class="cell header">Impression</th>
          <th class="cell header">Doors</th>
          <th class="cell header">Penalty</th>
          <th class="cell header shapeshifter-relationship-actions">
            <span class="button stoneButton shapeshifter-relationship-create" title="Add Relationship">+ Relationship</span>
            <span class="button stoneButton shapeshifter-lamb-create" title="Add Lamb">+ Lamb</span>
          </th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td class="cell first shapeshifter-empty-row" colspan="6">No Relationships or Lambs yet.</td></tr>`}
      </tbody>
    </table>
  `;
}

function buildShapeshifterTraitsTabHtml(actor) {
  const traits = getShapeshifterTraitsData(actor);

  return `
    <div class="shapeshifter-traits-layout">
      <section class="item-stat-block shapeshifter-traits-panel">
        <h3 class="shapeshifter-section-title">Anchors</h3>
        <div class="form-line">
          <label>Waking</label>
          <input class="shapeshifter-traits-field" name="flags.${MODULE_ID}.traits.anchors.waking" type="text" value="${escapeAttribute(traits.anchors?.waking ?? "")}">
        </div>
        <div class="form-line">
          <label>Dreaming</label>
          <input class="shapeshifter-traits-field" name="flags.${MODULE_ID}.traits.anchors.dreaming" type="text" value="${escapeAttribute(traits.anchors?.dreaming ?? "")}">
        </div>
      </section>

      ${buildShapeshifterRelationshipsTable(actor)}

      <section class="item-stat-block shapeshifter-traits-panel">
        <div class="form-line">
          <label>Age</label>
          <input class="shapeshifter-traits-field" name="system.age" type="number" data-dtype="Number" value="${toNumber(actor.system?.age)}">
        </div>
        <div class="form-line">
          <label>Pronouns</label>
          <input class="shapeshifter-traits-field" name="flags.${MODULE_ID}.traits.pronouns" type="text" value="${escapeAttribute(traits.pronouns ?? "")}">
        </div>
        <div class="form-line">
          <label>Aspirations</label>
          <textarea class="shapeshifter-traits-field" name="system.aspirations" placeholder="Aspirations">${escapeHtml(actor.system?.aspirations ?? "")}</textarea>
        </div>
      </section>

      <section class="item-stat-block shapeshifter-traits-panel">
        <div class="form-line">
          <label>Notes</label>
          <textarea class="shapeshifter-traits-field" name="system.notes" placeholder="Notes">${escapeHtml(actor.system?.notes ?? "")}</textarea>
        </div>
        <div class="form-line">
          <label>Description</label>
          <textarea class="shapeshifter-traits-field shapeshifter-traits-description" name="system.description" placeholder="Description">${escapeHtml(actor.system?.description ?? "")}</textarea>
        </div>
      </section>
    </div>
  `;
}

function buildShapeshifterPersonaTabHtml(actor) {
  const traits = getShapeshifterTraitsData(actor);
  const persona = traits.persona ?? {};

  return `
    <div class="shapeshifter-persona-layout">
      <section class="item-stat-block shapeshifter-traits-panel shapeshifter-persona-core">
        <div class="form-line">
          <label>Omen</label>
          <input class="shapeshifter-traits-field" name="flags.${MODULE_ID}.traits.persona.omen" type="text" value="${escapeAttribute(persona.omen ?? "")}">
        </div>
        <div class="form-line">
          <label>Table</label>
          <input class="shapeshifter-traits-field" name="flags.${MODULE_ID}.traits.persona.table" type="text" value="${escapeAttribute(persona.table ?? "")}">
        </div>
        <div class="form-line">
          <label>Philosophy</label>
          <input class="shapeshifter-traits-field" name="flags.${MODULE_ID}.traits.persona.philosophy" type="text" value="${escapeAttribute(persona.philosophy ?? "")}">
        </div>
      </section>

      <section class="item-stat-block shapeshifter-traits-panel shapeshifter-persona-records">
        <h3 class="shapeshifter-section-title">Records</h3>
        <div class="shapeshifter-record-grid">
          <label>
            <span>Frailties</span>
            <textarea class="shapeshifter-traits-field" name="flags.${MODULE_ID}.traits.persona.frailties">${escapeHtml(persona.frailties ?? "")}</textarea>
          </label>
          <label>
            <span>Triggers</span>
            <textarea class="shapeshifter-traits-field" name="flags.${MODULE_ID}.traits.persona.triggers">${escapeHtml(persona.triggers ?? "")}</textarea>
          </label>
          <label>
            <span>Fixations</span>
            <textarea class="shapeshifter-traits-field" name="flags.${MODULE_ID}.traits.persona.fixations">${escapeHtml(persona.fixations ?? "")}</textarea>
          </label>
          <label>
            <span>Omen Benefit</span>
            <textarea class="shapeshifter-traits-field" name="flags.${MODULE_ID}.traits.persona.omenBenefit">${escapeHtml(persona.omenBenefit ?? "")}</textarea>
          </label>
        </div>
      </section>
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

function buildTouchstoneRow(item) {
  const font = getTouchstoneFontData(item);
  const weaponSummary = [
    font.model || font.weaponType,
    `Damage ${toNumber(font.damage)}`,
    `Init ${addPlus(toNumber(font.initiativeMod))}`,
    `Str ${toNumber(font.strengthReq, 1)}`,
    `Size ${toNumber(font.size, 1)}`
  ].join(" | ");

  return `
    <tr class="item-row item shapeshifter-touchstone-row" data-item-id="${item.id}" draggable="true">
      <td class="cell item-name first" data-item-id="${item.id}">
        <div class="item-name-wrapper">
          <div class="item-image" style="background-image: url(${item.img})"></div>
          <span>${escapeHtml(item.name)}</span>
        </div>
      </td>
      <td class="cell">${escapeHtml(item.system?.impression ?? "Average")}</td>
      <td class="cell">${toNumber(item.system?.doors?.value)} / ${toNumber(item.system?.doors?.max, 1)}</td>
      <td class="cell">${escapeHtml(weaponSummary)}</td>
      <td class="cell edit-delete">
        <span class="button stoneButton item-edit" data-item-id="${item.id}" title="${game.i18n.localize("MTA.EditItem")}"><i class="fas fa-edit"></i></span>
        <span class="button stoneButton item-delete" data-item-id="${item.id}" title="${game.i18n.localize("MTA.DeleteItem")}"><i class="fas fa-times-circle"></i></span>
      </td>
    </tr>
  `;
}

function buildTouchstonesTable(actor) {
  const touchstones = getTouchstones(actor);
  const limit = getTouchstoneLimit(actor);
  const rows = touchstones.map(buildTouchstoneRow).join("");

  return `
    <table class="item-table shapeshifter-touchstones-table">
      <thead>
        <tr class="item-row header">
          <th class="cell header first">
            <span class="collapsible button fas fa-minus-square"></span>
            <span>Touchstones</span>
          </th>
          <th class="cell header">Impression</th>
          <th class="cell header">Camaraderie</th>
          <th class="cell header">Font</th>
          <th class="cell header shapeshifter-touchstone-actions">
            <span class="shapeshifter-touchstone-count">${touchstones.length} / ${limit}</span>
            <span class="button stoneButton shapeshifter-touchstone-create" title="Add Touchstone"><i class="fas fa-plus"></i></span>
          </th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td class="cell first shapeshifter-empty-row" colspan="5">No Touchstones yet. Use + to create one.</td></tr>`}
      </tbody>
    </table>
  `;
}

function buildExcaliburTabHtml(actor) {
  const excalibur = getExcaliburData(actor);
  const touchstone = excalibur.touchstoneId ? actor.items.get(excalibur.touchstoneId) : null;
  const weapon = excalibur.weaponId ? actor.items.get(excalibur.weaponId) : null;
  const isBurning = excalibur.burning === true;

  return `
    <div class="shapeshifter-excalibur-layout">
      <section class="shapeshifter-excalibur-panel">
        ${buildTouchstonesTable(actor)}
      </section>

      <section class="shapeshifter-excalibur-panel shapeshifter-excalibur-forge">
        <header class="shapeshifter-excalibur-header">
          <h3>Excalibur</h3>
          <div class="shapeshifter-excalibur-controls">
            <span>Drop one Touchstone here to draw its weapon.</span>
            <button type="button" class="stoneButton shapeshifter-excalibur-sheathe" ${touchstone ? "" : "disabled"}>Sheathe</button>
            <button type="button" class="stoneButton shapeshifter-excalibur-burn ${isBurning ? "is-burning" : ""}" ${touchstone ? "" : "disabled"}>${isBurning ? "Burning" : "Burn"}</button>
          </div>
        </header>

        <div class="shapeshifter-excalibur-fields">
          <label>
            <span>Excalibur Name</span>
            <input class="shapeshifter-excalibur-field" name="flags.${MODULE_ID}.excalibur.name" type="text" value="${escapeAttribute(excalibur.name ?? "")}" placeholder="Name the weapon">
          </label>
          <label>
            <span>Appearance</span>
            <textarea class="shapeshifter-excalibur-field" name="flags.${MODULE_ID}.excalibur.appearance" placeholder="What does this Excalibur look like?">${escapeHtml(excalibur.appearance ?? "")}</textarea>
          </label>
        </div>

        <div class="shapeshifter-excalibur-dropzone" data-drop-zone="touchstone">
          <strong>${touchstone ? escapeHtml(touchstone.name) : "Drop Touchstone"}</strong>
          <span>${touchstone ? `This Touchstone is currently shaping the Excalibur.${isBurning ? " It is burning bright." : ""}` : "Drag a Touchstone row here."}</span>
        </div>

        <div class="shapeshifter-excalibur-result">
          <span>Generated Weapon:</span>
          ${weapon ? `
            <span class="shapeshifter-excalibur-weapon-name">${escapeHtml(weapon.name)}</span>
            <span class="button stoneButton item-edit" data-item-id="${weapon.id}" title="${game.i18n.localize("MTA.EditItem")}"><i class="fas fa-edit"></i></span>
          ` : "<span>None yet.</span>"}
        </div>
      </section>
    </div>
  `;
}

async function createTouchstone(actor) {
  const limit = getTouchstoneLimit(actor);
  if (getTouchstones(actor).length >= limit) {
    ui.notifications.warn(`Mythheart ${getMythheartLevel(actor)} allows ${limit} Touchstone${limit === 1 ? "" : "s"}.`);
    return null;
  }

  const created = await actor.createEmbeddedDocuments("Item", [{
    name: "Touchstone",
    type: "relationship",
    img: CONFIG.MTA.placeholders?.get("relationship") ?? "systems/mta/icons/placeholders/Relationship.svg",
    system: {
      impression: "Average",
      doors: { value: 0, max: 1 },
      penalty: 0,
      description: ""
    },
    flags: {
      [MODULE_ID]: {
        touchstone: {
          isTouchstone: true,
          font: foundry.utils.deepClone(DEFAULT_TOUCHSTONE_FONT),
          statMods: []
        }
      }
    }
  }]);

  return created?.[0];
}

async function createShapeshifterRelationship(actor, { lamb = false } = {}) {
  const itemData = {
    name: lamb ? "Lamb" : "Relationship",
    type: "relationship",
    img: CONFIG.MTA.placeholders?.get("relationship") ?? "systems/mta/icons/placeholders/Relationship.svg",
    system: {
      impression: "Average",
      doors: { value: 0, max: 1 },
      penalty: 0,
      description: ""
    }
  };

  if (lamb) {
    itemData.flags = {
      [MODULE_ID]: {
        lamb: { isLamb: true }
      }
    };
  }

  const created = await actor.createEmbeddedDocuments("Item", [itemData]);
  return created?.[0];
}

async function clearExcalibur(actor, { deleteTouchstone = false } = {}) {
  const excalibur = getExcaliburData(actor);
  const deleteIds = [];

  if (excalibur.weaponId && actor.items.get(excalibur.weaponId)) {
    deleteIds.push(excalibur.weaponId);
  }
  if (deleteTouchstone && excalibur.touchstoneId && actor.items.get(excalibur.touchstoneId)) {
    deleteIds.push(excalibur.touchstoneId);
  }

  if (deleteIds.length) await actor.deleteEmbeddedDocuments("Item", deleteIds);
  await actor.unsetFlag(MODULE_ID, "excalibur");
}

async function toggleExcaliburBurn(actor) {
  const excalibur = getExcaliburData(actor);
  const touchstone = excalibur.touchstoneId ? actor.items.get(excalibur.touchstoneId) : null;
  if (!touchstone) return;

  if (excalibur.burning === true) {
    const confirmed = await foundry.appv1.api.Dialog.wait({
      title: "Burn Touchstone",
      content: `<p>Is ${escapeHtml(touchstone.name)} ready to be removed from this character sheet?</p>`,
      buttons: {
        yes: {
          icon: '<i class="fas fa-fire"></i>',
          label: "Remove Touchstone",
          callback: () => true
        },
        no: {
          label: "Keep Burning",
          callback: () => false
        }
      },
      default: "no",
      close: () => false
    });

    if (confirmed) await clearExcalibur(actor, { deleteTouchstone: true });
    return;
  }

  await actor.update({ [`flags.${MODULE_ID}.excalibur.burning`]: true });
  await createOrUpdateExcaliburWeapon(actor, touchstone);
}

function buildExcaliburDescription(actor, touchstone) {
  const excalibur = getExcaliburData(actor);
  const font = getTouchstoneFontData(touchstone);
  const pieces = [];

  if (excalibur.burning) pieces.push("<h2>Burning</h2><p>This Excalibur is burning its Touchstone.</p>");
  if (excalibur.appearance) pieces.push(`<h2>Appearance</h2><p>${nl2br(excalibur.appearance)}</p>`);
  if (font.model) pieces.push(`<h2>Weapon Model</h2><p>${escapeHtml(font.model)}</p>`);
  if (font.text) pieces.push(`<h2>Font</h2><p>${nl2br(font.text)}</p>`);
  if (font.special) pieces.push(`<h2>Special</h2><p>${nl2br(font.special)}</p>`);
  if (touchstone.system?.description) pieces.push(`<h2>Touchstone</h2>${touchstone.system.description}`);

  return pieces.join("");
}

async function createOrUpdateExcaliburWeapon(actor, touchstone) {
  if (!actor?.isOwner || !isTouchstoneItem(touchstone)) return null;

  const excalibur = getExcaliburData(actor);
  const font = getTouchstoneFontData(touchstone);
  const burnMultiplier = excalibur.burning === true ? 2 : 1;
  const statMods = getTouchstoneStatMods(touchstone)
    .filter(mod => mod?.name)
    .map(mod => ({
      name: mod.name,
      value: toNumber(mod.value) * burnMultiplier,
      overFive: true
    }));
  const weaponName = excalibur.name?.trim() || (font.model ? `${touchstone.name} ${font.model}` : `${touchstone.name} Excalibur`);
  const weaponData = {
    name: weaponName,
    img: CONFIG.MTA.placeholders?.get("melee") ?? "systems/mta/icons/placeholders/Melee.svg",
    system: {
      weaponType: font.weaponType || "Melee",
      damage: toNumber(font.damage) * burnMultiplier,
      penetration: toNumber(font.penetration) * burnMultiplier,
      initiativeMod: toNumber(font.initiativeMod) * burnMultiplier,
      strengthReq: toNumber(font.strengthReq, 1),
      size: toNumber(font.size, 1),
      availability: toNumber(font.availability),
      damageType: "lethal",
      applyDefense: true,
      effects: statMods,
      effectsActive: statMods.length > 0,
      description: buildExcaliburDescription(actor, touchstone)
    },
    flags: {
      [MODULE_ID]: {
        excaliburWeapon: {
          isExcalibur: true,
          sourceTouchstoneId: touchstone.id
        }
      }
    }
  };

  let weapon = excalibur.weaponId ? actor.items.get(excalibur.weaponId) : null;
  weapon ??= actor.items.find(item => item.type === "melee" && item.getFlag(MODULE_ID, "excaliburWeapon.isExcalibur"));

  if (weapon) {
    await weapon.update(weaponData);
  } else {
    [weapon] = await actor.createEmbeddedDocuments("Item", [{ ...weaponData, type: "melee" }]);
  }

  await actor.update({
    [`flags.${MODULE_ID}.excalibur.touchstoneId`]: touchstone.id,
    [`flags.${MODULE_ID}.excalibur.weaponId`]: weapon.id
  });

  return weapon;
}

async function getDroppedItem(event, actor) {
  const dataTransfer = event.originalEvent?.dataTransfer ?? event.dataTransfer;
  let data = {};

  try {
    data = JSON.parse(dataTransfer?.getData("text/plain") || "{}");
  } catch {
    data = {};
  }

  if (data.uuid) return fromUuid(data.uuid);
  if (data.id) return actor.items.get(data.id);
  if (data._id) return actor.items.get(data._id);
  if (data.data?._id) return actor.items.get(data.data._id);
  return null;
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
  CONFIG.MTA.mythFacetTypes = foundry.utils.deepClone(MYTH_FACET_CATEGORIES);
}

function patchItemSheetTemplate() {
  if (MtAItemSheet.prototype._shapeshifterMythTemplatePatched) return;

  const originalTemplate = Object.getOwnPropertyDescriptor(MtAItemSheet.prototype, "template")?.get;
  Object.defineProperty(MtAItemSheet.prototype, "template", {
    configurable: true,
    enumerable: true,
    get() {
      if (this.item?.type === "facet") return MYTH_FACET_TEMPLATE;
      if (isTouchstoneItem(this.item)) return TOUCHSTONE_TEMPLATE;
      if (isLambItem(this.item)) return LAMB_TEMPLATE;
      return originalTemplate ? originalTemplate.call(this) : "systems/mta/templates/items/item.html";
    }
  });

  const originalGetData = MtAItemSheet.prototype.getData;
  MtAItemSheet.prototype.getData = async function (...args) {
    const sheetData = await originalGetData.apply(this, args);
    if (isTouchstoneItem(this.item)) {
      const touchstone = getTouchstoneData(this.item);
      sheetData.shapeshifterTouchstone = {
        ...touchstone,
        font: {
          ...DEFAULT_TOUCHSTONE_FONT,
          ...(touchstone.font ?? {})
        },
        statMods: Array.isArray(touchstone.statMods) ? touchstone.statMods : Object.values(touchstone.statMods ?? {})
      };
    }
    return sheetData;
  };

  const originalActivateListeners = MtAItemSheet.prototype.activateListeners;
  MtAItemSheet.prototype.activateListeners = function (html) {
    originalActivateListeners.call(this, html);
    if (!isTouchstoneItem(this.item) || !this.options.editable) return;

    html.find(".shapeshifter-touchstone-stat-add").click(async event => {
      event.preventDefault();
      const statMods = getTouchstoneStatMods(this.item);
      statMods.push({ name: "attributes_physical.strength", value: 0 });
      await this.item.update({ [`flags.${MODULE_ID}.touchstone.statMods`]: statMods });
    });

    html.find(".shapeshifter-touchstone-stat-remove").click(async event => {
      event.preventDefault();
      const index = Number(event.currentTarget.dataset.index);
      const statMods = getTouchstoneStatMods(this.item);
      statMods.splice(index, 1);
      await this.item.update({ [`flags.${MODULE_ID}.touchstone.statMods`]: statMods });
    });
  };

  const originalUpdateObject = MtAItemSheet.prototype._updateObject;
  MtAItemSheet.prototype._updateObject = async function (event, formData) {
    const expandedData = formData.system ? formData : foundry.utils.expandObject(formData);
    const touchstone = expandedData.flags?.[MODULE_ID]?.touchstone;
    if (touchstone?.statMods && !Array.isArray(touchstone.statMods)) {
      touchstone.statMods = Object.values(touchstone.statMods);
    }
    return originalUpdateObject.call(this, event, expandedData);
  };

  MtAItemSheet.prototype._shapeshifterMythTemplatePatched = true;
}

function patchItemPrepareData() {
  if (ItemMtA.prototype._shapeshifterMythItemPatched) return;

  const originalPrepareData = ItemMtA.prototype.prepareData;
  ItemMtA.prototype.prepareData = function (...args) {
    originalPrepareData.apply(this, args);

    if (isTouchstoneItem(this)) {
      const touchstone = getTouchstoneData(this);
      touchstone.font ??= foundry.utils.deepClone(DEFAULT_TOUCHSTONE_FONT);
      touchstone.statMods ??= [];
    }

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
      const rules = getMythheartRules(this);
      this.system.shapeshifter_myth = {
        mythheart: {
          value: mythheart,
          final: mythheart,
          statMax: rules.statMax,
          glamourMax: rules.glamourMax,
          glamourPerTurn: rules.glamourPerTurn,
          frailties: rules.frailties
        }
      };
    }

    return result;
  };

  ActorMtA.prototype._shapeshifterMythDataPatched = true;
}

function patchActorTraitMaximums() {
  if (ActorMtA.prototype._shapeshifterMythheartMaximumPatched) return;

  const originalGetTraitMaximum = ActorMtA.prototype.getTraitMaximum;
  ActorMtA.prototype.getTraitMaximum = function (...args) {
    if (isShapeshifterWerewolf(this)) {
      return getMythheartRules(this).statMax;
    }

    return originalGetTraitMaximum.apply(this, args);
  };

  const originalCalculateAndSetMaxResource = ActorMtA.prototype.calculateAndSetMaxResource;
  ActorMtA.prototype.calculateAndSetMaxResource = function (...args) {
    if (isShapeshifterWerewolf(this)) {
      const rules = getMythheartRules(this);
      return this.update({
        "system.essence.max": rules.glamourMax,
        [`flags.${MODULE_ID}.myth.glamour.max`]: rules.glamourMax,
        [`flags.${MODULE_ID}.myth.glamour.perTurn`]: rules.glamourPerTurn
      });
    }

    return originalCalculateAndSetMaxResource.apply(this, args);
  };

  ActorMtA.prototype._shapeshifterMythheartMaximumPatched = true;
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

    let excaliburNav = html.find('.tabs .item[data-tab="excalibur"]').first();
    if (!excaliburNav.length && giftsNav.length) {
      giftsNav.after('<a class="item" data-tab="excalibur">Excalibur</a>');
      excaliburNav = html.find('.tabs .item[data-tab="excalibur"]').first();
    }

    let excaliburTab = html.find('.tab[data-tab="excalibur"]').first();
    if (!excaliburTab.length && giftsTab.length) {
      giftsTab.after('<div class="tab shapeshifter-excalibur-tab" data-tab="excalibur"></div>');
      excaliburTab = html.find('.tab[data-tab="excalibur"]').first();
    }
    if (excaliburTab.length) {
      excaliburTab.addClass("shapeshifter-excalibur-tab");
      excaliburTab.html(buildExcaliburTabHtml(app.actor));
    }

    const descriptionTab = html.find('.tab[data-tab="description"]').first();
    if (descriptionTab.length) {
      descriptionTab.addClass("shapeshifter-traits-tab");
      descriptionTab.html(buildShapeshifterTraitsTabHtml(app.actor));
    }

    const werewolfPersonaNav = html.find('.tabs .item[data-tab="werewolfPersona"]').first();
    if (werewolfPersonaNav.length) werewolfPersonaNav.text("Shapeshifter Traits");

    const werewolfPersonaTab = html.find('.tab[data-tab="werewolfPersona"]').first();
    if (werewolfPersonaTab.length) {
      werewolfPersonaTab.addClass("shapeshifter-persona-tab");
      werewolfPersonaTab.html(buildShapeshifterPersonaTabHtml(app.actor));
    }

    const bottomCharaBlock = html.find(".bottomCharaBlock").first();
    if (bottomCharaBlock.length && !bottomCharaBlock.find(".shapeshifter-passion").length) {
      bottomCharaBlock.append(buildPassionHtml(app.actor));
    }

    if (app._shapeshifterActiveTab) {
      const activeNav = html.find(`.tabs .item[data-tab="${app._shapeshifterActiveTab}"]`).first();
      const activeTab = html.find(`.tab[data-tab="${app._shapeshifterActiveTab}"]`).first();
      if (activeNav.length && activeTab.length) {
        const tabs = activeNav.closest(".tabs");
        const sheetBody = activeTab.parent();
        tabs.children(".item").removeClass("active");
        activeNav.addClass("active");
        sheetBody.children(".tab").removeClass("active");
        activeTab.addClass("active");
      }
    }

    if (!html.find(".tabs .item.active").length) {
      giftsNav.addClass("active");
      giftsTab.addClass("active");
    }

    const mythTab = giftsTab;
    const customTabs = mythTab.add(excaliburTab).add(descriptionTab).add(werewolfPersonaTab);
    if (!customTabs.length) return;

    html.off(".shapeshifterMyth");
    html.off(".shapeshifterMythScroll");

    html.on("pointerdown.shapeshifterMythScroll", "input, select, textarea, .plusBtn, .minusBtn, .item-create, .item-delete, .shapeshifter-touchstone-create, .shapeshifter-relationship-create, .shapeshifter-lamb-create, .shapeshifter-excalibur-sheathe, .shapeshifter-excalibur-burn", () => rememberSheetScroll(app, html));
    html.on("change.shapeshifterMythScroll", "input, select, textarea", () => rememberSheetScroll(app, html));

    html.on("click.shapeshifterMyth", '.tabs .item[data-tab="excalibur"]', ev => {
      ev.preventDefault();
      app._shapeshifterActiveTab = "excalibur";
      const nav = $(ev.currentTarget);
      const tabs = nav.closest(".tabs");
      const sheetBody = excaliburTab.parent();
      tabs.children(".item").removeClass("active");
      nav.addClass("active");
      sheetBody.children(".tab").removeClass("active");
      excaliburTab.addClass("active");
      restoreSheetScroll(app, html);
    });

    html.on("click.shapeshifterMyth", '.tabs .item[data-tab]:not([data-tab="excalibur"])', ev => {
      app._shapeshifterActiveTab = ev.currentTarget.dataset.tab;
    });

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

    html.on("click.shapeshifterMyth", ".shapeshifter-renown__state", async ev => {
      ev.preventDefault();
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);

      const key = ev.currentTarget.dataset.renownKey;
      const current = getRenownState(app.actor, key);
      const next = current === "omen" ? "tribe" : current === "tribe" ? "" : "omen";

      await app.actor.update({
        [`flags.${MODULE_ID}.myth.renown.${key}.state`]: next
      });
    });

    excaliburTab.on("click.shapeshifterMyth", ".shapeshifter-touchstone-create", async ev => {
      ev.preventDefault();
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);
      const item = await createTouchstone(app.actor);
      item?.sheet.render(true);
    });

    excaliburTab.on("click.shapeshifterMyth", ".shapeshifter-excalibur-sheathe", async ev => {
      ev.preventDefault();
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);
      await clearExcalibur(app.actor);
    });

    excaliburTab.on("click.shapeshifterMyth", ".shapeshifter-excalibur-burn", async ev => {
      ev.preventDefault();
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);
      await toggleExcaliburBurn(app.actor);
    });

    excaliburTab.on("change.shapeshifterMyth", ".shapeshifter-excalibur-field", async ev => {
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);
      await app.actor.update({ [ev.currentTarget.name]: ev.currentTarget.value });

      const excalibur = getExcaliburData(app.actor);
      const touchstone = excalibur.touchstoneId ? app.actor.items.get(excalibur.touchstoneId) : null;
      if (touchstone) await createOrUpdateExcaliburWeapon(app.actor, touchstone);
    });

    excaliburTab.on("dragstart.shapeshifterMyth", ".shapeshifter-touchstone-row", ev => {
      const itemId = ev.currentTarget.dataset.itemId;
      const item = app.actor.items.get(itemId);
      if (!item) return;

      ev.originalEvent.dataTransfer.setData("text/plain", JSON.stringify({
        type: "Item",
        uuid: item.uuid,
        id: item.id
      }));
    });

    excaliburTab.on("dragover.shapeshifterMyth", ".shapeshifter-excalibur-dropzone", ev => {
      ev.preventDefault();
      ev.currentTarget.classList.add("is-hovered");
    });

    excaliburTab.on("dragleave.shapeshifterMyth", ".shapeshifter-excalibur-dropzone", ev => {
      ev.currentTarget.classList.remove("is-hovered");
    });

    excaliburTab.on("drop.shapeshifterMyth", ".shapeshifter-excalibur-dropzone", async ev => {
      ev.preventDefault();
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);
      ev.currentTarget.classList.remove("is-hovered");

      const item = await getDroppedItem(ev, app.actor);
      if (!isTouchstoneItem(item) || item.parent?.id !== app.actor.id) {
        ui.notifications.warn("Drop one of this character's Touchstones here.");
        return;
      }

      await app.actor.update({ [`flags.${MODULE_ID}.excalibur.burning`]: false });
      await createOrUpdateExcaliburWeapon(app.actor, item);
      ui.notifications.info(`${item.name} shaped the Excalibur.`);
    });

    html.on("change.shapeshifterMyth", ".shapeshifter-traits-field", async ev => {
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);

      const input = ev.currentTarget;
      if (!input.name) return;

      const value = input.type === "number" ? toNumber(input.value) : input.value;
      await app.actor.update({ [input.name]: value });
    });

    descriptionTab.on("click.shapeshifterMyth", ".shapeshifter-relationship-create", async ev => {
      ev.preventDefault();
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);
      const item = await createShapeshifterRelationship(app.actor);
      item?.sheet.render(true);
    });

    descriptionTab.on("click.shapeshifterMyth", ".shapeshifter-lamb-create", async ev => {
      ev.preventDefault();
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);
      const item = await createShapeshifterRelationship(app.actor, { lamb: true });
      item?.sheet.render(true);
    });

    mythTab.on("click.shapeshifterMyth", ".shapeshifter-forms-block .item-image", async event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!app.actor?.isOwner) return;
      rememberSheetScroll(app, html);

      const itemId = event.currentTarget.dataset.itemId;
      const item = app.actor.items.get(itemId);
      if (!item || item.type !== "form") return;

      await app.actor.werewolfTransform(item);
    });

    customTabs.on("click.shapeshifterMyth", ".item-image", event => {
      if ($(event.currentTarget).closest(".shapeshifter-forms-block").length) return;
      app._onItemRoll(event);
    });
    customTabs.on("contextmenu.shapeshifterMyth", ".item-image", event => {
      if ($(event.currentTarget).closest(".shapeshifter-forms-block").length) return;
      app._onItemRoll(event, true);
    });
    customTabs.on("click.shapeshifterMyth", ".item-edit", event => {
      const itemId = event.currentTarget.dataset.itemId;
      const item = app.actor.items.get(itemId);
      item?.sheet.render(true);
    });
    customTabs.on("click.shapeshifterMyth", ".item-delete", ev => {
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

function patchExcaliburSync() {
  if (Hooks._shapeshifterExcaliburSyncPatched) return;

  Hooks.on("updateItem", async item => {
    if (!isTouchstoneItem(item)) return;

    const actor = item.parent;
    if (!isShapeshifterWerewolf(actor)) return;

    const excalibur = getExcaliburData(actor);
    if (excalibur.touchstoneId !== item.id) return;

    await createOrUpdateExcaliburWeapon(actor, item);
  });

  Hooks._shapeshifterExcaliburSyncPatched = true;
}

Hooks.once("init", () => {
  patchWerewolfTemplateConfig();
  patchItemSheetTemplate();
  patchItemPrepareData();
  patchActorPrepareData();
  patchActorTraitMaximums();
  patchWerewolfForms();
  patchSheetRender();
  patchExcaliburSync();
});

