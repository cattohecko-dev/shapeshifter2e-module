<<<<<<< Updated upstream
import { ActorMtA } from "systems/mta/module/actor.js";
import { ItemMtA } from "systems/mta/module/item.js";
import { MtAItemSheet } from "systems/mta/module/item-sheet.js";
=======
import { ActorMtA } from "/systems/mta/module/actor.js";
import { ItemMtA } from "/systems/mta/module/item.js";
import { MtAItemSheet } from "/systems/mta/module/item-sheet.js";
>>>>>>> Stashed changes

const MODULE_ID = "shapeshifter2e-module";
const SHAPESHIFTER_VARIANT = "shapeshifter";
const PASSION_FLAG = "passionUsesDicePools";

const MYTH_FACET_TEMPLATE = `modules/${MODULE_ID}/templates/items/myth-facet.html`;

const SHAPESHIFTER_FORMS = [
  {
    name: "Human",
    type: "form",
    img: "systems/mta/icons/forms/Hishu.svg",
    system: {
      subname: "Human",
<<<<<<< Updated upstream
      effects: [
        { name: "derivedTraits.perception", value: 1, overFive: true }
      ],
=======
      effects: [{ name: "derivedTraits.perception", value: 1, overFive: true }],
>>>>>>> Stashed changes
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

const LEGACY_FORM_RENAMES = {
  Hishu: { name: "Human", subname: "Human" },
  Dalu: { name: "Half-Myth", subname: "Half-Myth" },
  Gauru: { name: "Myth", subname: "Myth" },
  Urshul: { name: "Half-Cryptid", subname: "Half-Cryptid" },
  Urhan: { name: "Cryptid", subname: "Cryptid" }
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

function isShapeshifterWerewolf(actor) {
  return actor?.type === "character"
    && actor?.system?.characterType === "werewolf"
    && actor?.system?.characterVariant === SHAPESHIFTER_VARIANT;
}

function getPassionValue(actor) {
  return Number(actor?.system?.harmony?.value ?? 0);
}

function getPassionMax(actor) {
  return Number(actor?.system?.harmony?.max ?? 0);
}

function isPassionBonusEnabled(actor) {
  return Boolean(actor?.getFlag(MODULE_ID, PASSION_FLAG));
}

function buildPassionHtml(actor) {
  const passionValue = getPassionValue(actor);
  const passionMax = getPassionMax(actor);
  const bonusEnabled = isPassionBonusEnabled(actor);
  const checked = bonusEnabled ? "checked" : "";
  const bonusText = bonusEnabled
    ? `Adds +${passionValue} to trait and skill rolls.`
    : "Turn this on to let Passion modify trait and skill rolls.";

  return `
    <div class="kInput statBox big shapeshifter-passion">
      <h4>
        <label class="attribute-button shapeshifter-passion__title">Passion</label>
      </h4>
      <div class="gold-border"></div>
      <div class="kMageTracker passion" data-type="passion" data-name="system.harmony" data-states="max/value" data-max="${passionMax}" data-value="${passionValue}"></div>
      <label class="checkBox shapeshifter-passion__toggle" title="Use Passion boxes to modify trait and skill rolls">
        <input data-dtype="Boolean" name="flags.${MODULE_ID}.${PASSION_FLAG}" type="checkbox" ${checked}>
        <span></span>
        <span>Use Passion for trait and skill rolls</span>
      </label>
      <div class="description shapeshifter-passion__note">${bonusText}</div>
    </div>
  `;
}

function buildRenownRowHtml(actor, renownKey, label) {
  const currentValue = Number(actor?.system?.werewolf_renown?.[renownKey]?.value ?? 0);
  const boxes = Array.from({ length: 5 }, (_, index) => {
<<<<<<< Updated upstream
    const filled = index < currentValue ? "is-filled" : "";
    return `<button type="button" class="shapeshifter-renown__box ${filled}" data-renown-key="${renownKey}" data-renown-value="${index + 1}" aria-label="${label} ${index + 1}">${filled ? "x" : ""}</button>`;
=======
    const filled = index < currentValue;
    return `<button type="button" class="shapeshifter-renown__box ${filled ? "is-filled" : ""}" data-renown-key="${renownKey}" data-renown-value="${index + 1}" aria-label="${label} ${index + 1}">${filled ? "x" : ""}</button>`;
>>>>>>> Stashed changes
  }).join("");

  return `
    <li class="attribute flexrow shapeshifter-renown__row" data-renown-key="${renownKey}">
      <span class="attribute-button shapeshifter-renown__label">${label}</span>
<<<<<<< Updated upstream
      <span class="shapeshifter-renown__boxes">
        ${boxes}
      </span>
=======
      <span class="shapeshifter-renown__boxes">${boxes}</span>
>>>>>>> Stashed changes
      <input type="hidden" name="system.werewolf_renown.${renownKey}.value" data-dtype="Number" value="${currentValue}">
    </li>
  `;
}

function buildRenownBlock(actor) {
  const rows = Object.entries(CONFIG.MTA.werewolf_renown)
    .map(([key, label]) => buildRenownRowHtml(actor, key, label))
    .join("");

  return `
    <ol class="attributes-list shapeshifter-renown-list">
      <li class="attributes-header flexrow">
        <span class="attribute-key">Renown</span>
        <span class="attribute-valueHeader">Boxes</span>
      </li>
      ${rows}
    </ol>
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
<<<<<<< Updated upstream
  const effectIcon = item.system?.effects ? `<i class="activeIcon ${item.system?.effectsActive ? "fas" : "far"} fa-dot-circle" title="Effects active" data-item-id="${item._id}"></i>` : "";
=======
  const effectIcon = item.system?.effects
    ? `<i class="activeIcon ${item.system?.effectsActive ? "fas" : "far"} fa-dot-circle" title="Effects active" data-item-id="${item._id}"></i>`
    : "";
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  const subHeaderRow = (label) => `<tr class="sub-header"><td colspan="7">${label}</td></tr>`;
  const rows = Object.entries(MYTH_FACET_CATEGORIES).map(([key, label]) => {
    const categoryRows = (grouped[key] ?? []).map(buildMythFacetRow).join("");
    return `${subHeaderRow(label)}${categoryRows}`;
  }).join("");
=======
  const subHeaderRow = label => `<tr class="sub-header"><td colspan="7">${label}</td></tr>`;
  const rows = Object.entries(MYTH_FACET_CATEGORIES)
    .map(([key, label]) => `${subHeaderRow(label)}${(grouped[key] ?? []).map(buildMythFacetRow).join("")}`)
    .join("");
>>>>>>> Stashed changes

  return `
    <table class="item-table shapeshifter-myth-facet-table">
      <thead>
        <tr class="item-row header">
          <th class="cell header first">
<<<<<<< Updated upstream
          <span class="sortable button" data-type="facet">Myth Facets</span>
=======
            <span class="sortable button" data-type="facet">Myth Facets</span>
>>>>>>> Stashed changes
          </th>
          <th class="cell header">Myth</th>
          <th class="cell header">Level</th>
          <th class="cell header">Cost</th>
          <th class="cell header">Action</th>
          <th class="cell header"></th>
          <th class="cell header button item-create" data-type="facet">${game.i18n.localize("MTA.ButtonAdd")}</th>
        </tr>
      </thead>
<<<<<<< Updated upstream
      <tbody>
        ${rows}
      </tbody>
=======
      <tbody>${rows}</tbody>
>>>>>>> Stashed changes
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
    sheet: ["harmony"],
    virtueName: "MTA.Blood",
    viceName: "MTA.Bone"
  };

  CONFIG.MTA.werewolf_renown = { ...SHAPESHIFTER_RENOWN };
  CONFIG.MTA.mythFacetTypes = { ...MYTH_FACET_CATEGORIES };
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
  if (ActorMtA.prototype._shapeshifterPassionPatched) return;

  const originalPrepareData = ActorMtA.prototype.prepareData;
  ActorMtA.prototype.prepareData = function (...args) {
    originalPrepareData.apply(this, args);

    if (!this.system) return;

    if (this.type === "character" && this.system.characterType === "werewolf") {
      this.system.werewolf_renown ??= {};

      for (const [oldKey, newKey] of Object.entries(LEGACY_RENOWN_TO_NEW)) {
        if (this.system.werewolf_renown[oldKey] && !this.system.werewolf_renown[newKey]) {
          this.system.werewolf_renown[newKey] = foundry.utils.duplicate(this.system.werewolf_renown[oldKey]);
        }
      }

      for (const key of Object.keys(SHAPESHIFTER_RENOWN)) {
        if (!this.system.werewolf_renown[key]) this.system.werewolf_renown[key] = { value: 0 };
      }
    }

    if (!isShapeshifterWerewolf(this)) return;

    const passionValue = getPassionValue(this);
    const passionBonusEnabled = isPassionBonusEnabled(this);
    const general = this.system?.generalModifiers;

<<<<<<< Updated upstream
    // Keep the base Harmony data path, but expose it as Passion for this template.
=======
>>>>>>> Stashed changes
    this.system.passion = {
      value: passionValue,
      max: getPassionMax(this),
      applyToDicePools: passionBonusEnabled
    };

    if (!passionBonusEnabled || !general?.allDicePools) return;

    const currentBonus = Number.isFinite(general.allDicePools.final)
      ? Number(general.allDicePools.final)
      : Number.isFinite(general.allDicePools.raw)
        ? Number(general.allDicePools.raw)
        : Number.isFinite(general.allDicePools.value)
          ? Number(general.allDicePools.value)
          : 0;

    general.allDicePools.raw = currentBonus + passionValue;
    general.allDicePools.final = currentBonus + passionValue;
    general.allDicePools.isModified = true;
  };

  ActorMtA.prototype._shapeshifterPassionPatched = true;
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
  if (Hooks._shapeshifterPassionRenderPatched) return;

  Hooks.on("renderActorSheet", (app, html) => {
    if (!isShapeshifterWerewolf(app.actor)) return;

    const giftsTab = html.find('.tab[data-tab="gifts"]').first();
<<<<<<< Updated upstream
=======
    if (!giftsTab.length) return;
>>>>>>> Stashed changes

    html.find('.tabs .item[data-tab="gifts"]').text("Myth");

    giftsTab.find(".forms-column .item-name").each((_, element) => {
      const nameBlock = $(element);
      const nameEl = nameBlock.children("div").first();
      const subnameEl = nameBlock.children(".subname").first();
      const legacy = LEGACY_FORM_RENAMES[nameEl.text().trim()];
      if (!legacy) return;

      nameEl.text(legacy.name);
      if (subnameEl.length) subnameEl.text(`(${legacy.subname})`);
    });

<<<<<<< Updated upstream
    html.find(".kInput.statBox.big").each((_, element) => {
      const box = $(element);
      const label = box.find("label.attribute-button").first();
      const labelText = label.text().trim();
      if (labelText === "Primal Urge") {
        label.text("Mythheart");
      }
=======
    giftsTab.find(".kInput.statBox.big").each((_, element) => {
      const box = $(element);
      const label = box.find("label.attribute-button").first();
      const labelText = label.text().trim();
      if (labelText === "Primal Urge") label.text("Mythheart");
>>>>>>> Stashed changes

      if (box.find("input[name='system.essence.value']").length) {
        const title = box.find("h4").first();
        const titleText = title.text().replace(/\s+/g, " ").trim();
        if (titleText.includes("Essence")) {
          title.contents().filter((_, node) => node.nodeType === Node.TEXT_NODE).each((_, node) => {
            node.textContent = node.textContent.replace("Essence", "Glamour");
          });
        }
      }
    });

    const renownList = giftsTab.find("ol.attributes-list").first();
    if (renownList.length) {
      renownList.replaceWith(buildRenownBlock(app.actor));
    }

<<<<<<< Updated upstream
    const renownBoxes = html.find(".shapeshifter-renown__box");
    renownBoxes.off("click.shapeshifterRenown").on("click.shapeshifterRenown", async ev => {
      ev.preventDefault();
      if (!app.actor?.isOwner) return;

      const button = ev.currentTarget;
      const key = button.dataset.renownKey;
      const value = Number(button.dataset.renownValue ?? 0);
      const current = Number(app.actor.system?.werewolf_renown?.[key]?.value ?? 0);
      const next = current === value ? 0 : value;

      await app.actor.update({
        [`system.werewolf_renown.${key}.value`]: next
      });
    });
=======
    giftsTab.find(".shapeshifter-renown__box")
      .off("click.shapeshifterRenown")
      .on("click.shapeshifterRenown", async ev => {
        ev.preventDefault();
        if (!app.actor?.isOwner) return;

        const button = ev.currentTarget;
        const key = button.dataset.renownKey;
        const value = Number(button.dataset.renownValue ?? 0);
        const current = Number(app.actor.system?.werewolf_renown?.[key]?.value ?? 0);
        const next = current === value ? 0 : value;

        await app.actor.update({
          [`system.werewolf_renown.${key}.value`]: next
        });
      });
>>>>>>> Stashed changes

    const facetTable = giftsTab.find("table.item-table").filter((_, element) => {
      return $(element).find('.item-create[data-type="facet"]').length > 0;
    }).first();

    if (facetTable.length) {
      facetTable.replaceWith(buildMythFacetTable(app.actor));
    }

<<<<<<< Updated upstream
    const mythTable = html.find(".shapeshifter-myth-facet-table").first();
    if (mythTable.length) {
      mythTable.off("click.shapeshifterMyth");
      mythTable.on("click.shapeshifterMyth", ".item-image", event => app._onItemRoll(event));
      mythTable.on("contextmenu.shapeshifterMyth", ".item-image", event => app._onItemRoll(event, true));
      mythTable.on("click.shapeshifterMyth", ".item-edit", event => {
        const itemId = event.currentTarget.dataset.itemId;
        const item = app.actor.items.get(itemId);
        item?.sheet.render(true);
      });
      mythTable.on("click.shapeshifterMyth", ".item-delete", ev => {
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
            two: {
              label: "Cancel"
            }
          },
          default: "two"
        }).render(true);
      });
      mythTable.on("click.shapeshifterMyth", ".item-create", event => app._onItemCreate(event));
    }
=======
    const mythTable = giftsTab.find(".shapeshifter-myth-facet-table").first();
    if (!mythTable.length) return;

    mythTable.off(".shapeshifterMyth");
    mythTable.on("click.shapeshifterMyth", ".item-image", event => app._onItemRoll(event));
    mythTable.on("contextmenu.shapeshifterMyth", ".item-image", event => app._onItemRoll(event, true));
    mythTable.on("click.shapeshifterMyth", ".item-edit", event => {
      const itemId = event.currentTarget.dataset.itemId;
      const item = app.actor.items.get(itemId);
      item?.sheet.render(true);
    });
    mythTable.on("click.shapeshifterMyth", ".item-delete", ev => {
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
    mythTable.on("click.shapeshifterMyth", ".item-create", event => app._onItemCreate(event));
>>>>>>> Stashed changes
  });

  Hooks._shapeshifterPassionRenderPatched = true;
}

Hooks.once("init", () => {
  patchWerewolfTemplateConfig();
  patchItemSheetTemplate();
  patchItemPrepareData();
  patchActorPrepareData();
  patchWerewolfForms();
  patchSheetRender();
});
