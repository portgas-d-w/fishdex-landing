import { emptySave, parseSave } from '../../src/game/save.ts';
import { starterConfig } from '../../src/game/rig.ts';
// Profil d'avant 0.8 pour les régressions ; vraie migration du format v4.
export function oldV4() {
  const s:any=emptySave();s.version=4;delete s.progression;
  s.equipped='starter';s.inventory=['starter'];s.preparation={method:'float',bait:'worm',location:'willow-pond'};
  s.tackle.config=starterConfig('float');delete s.tackle.setups;delete s.settings.combatMode;
  return s;
}
export const legacySave=()=>parseSave(JSON.stringify(oldV4()));
