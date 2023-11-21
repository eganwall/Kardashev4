##Overview
This project (which I have been referring to as Kardashev IV) is currently in its infancy; most of the work I've done so far has to do with standing up some foundational systems and making architectural choices. This repository is intended to showcase the latest development build, and I'll post a changelog to this page as well. 

##Future
The final vision of the game is still nebulous, but there are some key points that I've decided on. I'm planning to focus on developing and stabilizing these core features as I refine the overall aesthetic and gameplay vision. A few points I've mostly settled on:  
 - multiple progression vectors, ideally ensuring the feeling of a steadily-increasing power curve for the player
   - for example, gaining experience with a specific ship class may unlock more abilities, and accomplishing milestones with a specific ability may add more effects or unlock more configuration/loadout options
 - *meaningful* progression vectors - upgrades should generally impact gameplay in some way
   - instead of increasing damage by some % or increasing the number of projectiles per shot, upgrades should add effects, mechanics, or synergies wherever possible
 - the game should enable a wide variety of playstyles, providing organic (and non-exploitative) replay value
   - I'm planning to accomplish this largely through providing a well-rounded set of distinct classes from which the player can choose, each with its own set of stat values and unique abilities and mechanics
   - think of a cross between Vampire Survivors and League of Legends; the player will start with 1 or 2 available classes, with additional classes being unlocked upon satisfying some condition(s), and each class will have a distinct set of abilities and gameplay loop
   - the aim is to provide gameplay freshness through playstyle variety, while laying out milestones and unlocks for dedicated players to pursue
   - for example, the first class available will be a fairly standard "fighter" archetype featuring balanced offensive/defensive capabilities, limited sustain/healing, respectable damage, and some utility. An early class unlock, on the other hand, may look like a "necromancer" archetype, where the player has no innate weapons but instead has abilities which summon drones to fill certain roles (deal damage, provide sustain, CC enemies, etc); another early class may be based on dealing damage over time, providing abilities and upgrades focused on tankiness, CC, AoE damage application, and spreading damage across groups of enemies.
   - this provides an additional mechanism for pacing the complexity of the game - more complex or harder-to-use ship classes can be gated behind more difficult unlock requirements
 - wherever possible, the game should foster emergent player and enemy behavior (as opposed to curated)
   - the AI system should be flexible and allow enemy units to coordinate and support each other in a variety of ways; some examples:
     - enemies whose abilities are on cooldown (or otherwise unusable) should have actions available to them (e.g. trying to block player projectiles meant for a more "valuable" enemy unit or sacrificing itself to buff another unit)
     - different combinations of enemies should exhibit different overall behaviors
