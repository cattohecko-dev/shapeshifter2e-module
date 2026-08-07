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
  const value = Number(actor?.system?.harmony?.value);
  return Number.isFinite(value) ? value : 1;
}

function getPassionMax(actor) {
  return Number(actor?.system?.harmony?.max ?? 0);
}

function getPassionPerTurn(actor) {
  return Math.ceil(getPassionValue(actor) / 2);
}

function buildPassionHtml(actor) {
  const passionValue = getPassionValue(actor);
  const passionMax = getPassionMax(actor);
  const passionPerTurn = getPassionPerTurn(actor);

  return `
    <div class="kInput statBox big shapeshifter-passion">
      <h4>
        <label class="attribute-button shapeshifter-passion__title">Passion</label>
      </h4>
      <div class="gold-border"></div>
      <div class="niceNumber buttonsLeft shapeshifter-passion__total">
        <input name="system.harmony.value" type="number" value="${passionValue}" data-dtype="Number" step="1">
        <div class="numBtns">
          <div class="plusBtn">+</div>
          <div class="minusBtn">−</div>
        </div>
      </div>
      <div class="shapeshifter-passion__boxes">${passionBoxes}</div>
      <div class="description shapeshifter-passion__note">${passionPerTurn} Passion per turn</div>
    </div>
  `;
}

function buildRenownRowHtml(actor, renownKey, label) {
  const totalValue = Number(actor?.system?.werewolf_renown?.[renownKey]?.value ?? 0);
  const temporaryValue = Number(actor?.system?.werewolf_renown?.[renownKey]?.temporary ?? 0);
  const boxes = Array.from({ length: 5 }, (_, index) => {
    const filled = index < temporaryValue;
    return `<button type="button" class="shapeshifter-renown__box ${filled ? "is-filled" : ""}" data-renown-key="${renownKey}" data-renown-value="${index + 1}" aria-label="${label} ${index + 1}">${filled ? "x" : ""}</button>`;
  }).join("");

  return `
    <li class="attribute flexrow shapeshifter-renown__row" data-renown-key="${renownKey}">
      <div class="niceNumber buttonsLeft shapeshifter-renown__total">
        <input name="system.werewolf_renown.${renownKey}.value" type="number" value="${totalValue}" data-dtype="Number" min="0" max="5">
        <div class="numBtns">
          <div class="plusBtn">+</div>
          <div class="minusBtn">âˆ’</div>
        </div>
      </div>
      <span class="attribute-button shapeshifter-renown__label">${label}</span>
      <span class="shapeshifter-renown__boxes">${boxes}</span>
      <input type="hidden" name="system.werewolf_renown.${renownKey}.temporary" data-dtype="Number" value="${temporaryValue}">
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
        <span class="attribute-valueHeader">Tales</span>
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
      this.system.harmony ??= {};
      if (this.system.harmony.value == null) this.system.harmony.value = 1;
      this.system.werewolf_renown ??= {};

      for (const [oldKey, newKey] of Object.entries(LEGACY_RENOWN_TO_NEW)) {
        if (this.system.werewolf_renown[oldKey] && !this.system.werewolf_renown[newKey]) {
          this.system.werewolf_renown[newKey] = foundry.utils.duplicate(this.system.werewolf_renown[oldKey]);
        }
      }

      for (const key of Object.keys(SHAPESHIFTER_RENOWN)) {
        if (!this.system.werewolf_renown[key]) this.system.werewolf_renown[key] = { value: 0, temporary: 0 };
        if (this.system.werewolf_renown[key].value == null) this.system.werewolf_renown[key].value = 0;
        if (this.system.werewolf_renown[key].temporary == null) this.system.werewolf_renown[key].temporary = 0;
      }
    }

    if (!isShapeshifterWerewolf(this)) return;

    const passionValue = getPassionValue(this);
    const general = this.system?.generalModifiers;

    this.system.passion = {
      value: passionValue,
      max: getPassionMax(this),
      perTurn: getPassionPerTurn(this),
      checkedBoxes: passionValue,
      totalBoxes: getPassionMax(this),
      remainingBoxes: Math.max(0, getPassionMax(this) - passionValue),
      effectFramework: {
        checkedBoxes: passionValue,
        totalBoxes: getPassionMax(this),
        affectedSkills: []
      }
    };

    if (!general?.allDicePools) return;
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

    const passionBox = html.find(".kInput.statBox.big").filter((_, element) => {
      const box = $(element);
      const title = box.find("label.attribute-button").first().text().trim();
      return box.find("input[name='system.werewolf_traits.harmony.value']").length > 0
        || box.find("input[name='system.harmony.value']").length > 0
        || title === "Harmony"
        || title === "Passion"
        || title === "Primal Urge";
    }).first();

    html.find('.tabs .item[data-tab="gifts"]').text("Myth");

    html.find(".forms-column .item-name").each((_, element) => {
      const nameBlock = $(element);
      const nameEl = nameBlock.children("div").first();
      const subnameEl = nameBlock.children(".subname").first();
      const legacy = LEGACY_FORM_RENAMES[nameEl.text().trim()];
      if (!legacy) return;

      nameEl.text(legacy.name);
      if (subnameEl.length) subnameEl.text(`(${legacy.subname})`);
    });

    if (passionBox.length) {
      passionBox.replaceWith(buildPassionHtml(app.actor));
    }

    const passionTrack = html.find(".shapeshifter-passion").first();
    passionTrack
      .off("click.shapeshifterPassion")
      .on("click.shapeshifterPassion", ".plusBtn, .minusBtn", async ev => {
        ev.preventDefault();
        if (!app.actor?.isOwner) return;

        const isPlus = $(ev.currentTarget).hasClass("plusBtn");
        const current = Number(app.actor.system?.harmony?.value ?? 1);
        const next = current + (isPlus ? 1 : -1);

        await app.actor.update({
          "system.harmony.value": next
        });
      })
      .on("click.shapeshifterPassion", ".shapeshifter-passion__box", async ev => {
        ev.preventDefault();
        if (!app.actor?.isOwner) return;

        const boxValue = Number(ev.currentTarget.dataset.passionBox ?? 0);
        await app.actor.update({
          "system.harmony.value": boxValue
        });
      })
      .on("change.shapeshifterPassion", "input[name='system.harmony.value']", async ev => {
        if (!app.actor?.isOwner) return;

        const next = Number(ev.currentTarget.value ?? 0);
        await app.actor.update({
          "system.harmony.value": next
        });
      });

    html.find(".kInput.statBox.big").each((_, element) => {
      const box = $(element);
      const title = box.find("h4").first();
      const titleText = title.text().replace(/\s+/g, " ").trim();
      if (titleText.includes("Primal Urge")) {
        title.contents().filter((_, node) => node.nodeType === Node.TEXT_NODE).each((_, node) => {
          node.textContent = node.textContent.replace("Primal Urge", "Mythheart");
        });
      }

      if (titleText.includes("Essence")) {
        title.contents().filter((_, node) => node.nodeType === Node.TEXT_NODE).each((_, node) => {
          node.textContent = node.textContent.replace("Essence", "Glamour");
        });

        const essencePerTurn = Number(app.actor?.system?.essence_per_turn ?? 0);
        box.find(".description").first().text(`${essencePerTurn} Glamour Per Turn`);
      }
    });

    const giftsTab = html.find('.tab[data-tab="gifts"]').first();
    const renownList = giftsTab.find("ol.attributes-list").first();
    if (renownList.length) {
      renownList.replaceWith(buildRenownBlock(app.actor));
    }

    giftsTab.find(".shapeshifter-renown__box")
      .off("click.shapeshifterRenown")
      .on("click.shapeshifterRenown", async ev => {
        ev.preventDefault();
        if (!app.actor?.isOwner) return;

        const button = ev.currentTarget;
        const key = button.dataset.renownKey;
        const value = Number(button.dataset.renownValue ?? 0);
        const current = Number(app.actor.system?.werewolf_renown?.[key]?.temporary ?? 0);
        const next = current === value ? 0 : value;

        await app.actor.update({
          [`system.werewolf_renown.${key}.temporary`]: next
        });
      });

    const facetTable = giftsTab.find("table.item-table").filter((_, element) => {
      return $(element).find('.item-create[data-type="facet"]').length > 0;
    }).first();

    if (facetTable.length) {
      facetTable.replaceWith(buildMythFacetTable(app.actor));
    }

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
