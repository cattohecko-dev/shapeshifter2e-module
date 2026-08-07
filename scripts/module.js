Hooks.once("init", () => {
  const werewolfConfig = CONFIG.MTA?.characterConfig?.character?.werewolf;
  if (!werewolfConfig) {
    console.warn("Shapeshifter 2e Module: MTA werewolf template config was not found.");
    return;
  }

  if (!werewolfConfig.shapeshifter) {
    werewolfConfig.shapeshifter = {
      locale: "Shapeshifter",
      sheet: ["harmony"],
      virtueName: "MTA.Blood",
      viceName: "MTA.Bone"
    };
  }
});
