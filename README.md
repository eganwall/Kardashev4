# Overview
This project (which I have been referring to as Kardashev IV) is currently in its infancy; most of the work I've done so far has to do with standing up some foundational systems and making architectural choices. This repository is intended to showcase the latest development build, and I'll post a changelog to this page as well. The game is a simple top-down 2D twin-stick shooter, and could have some ARPG and/or roguelite elements. It will have an in-universe sci-fi narrative premise, but the game will not be story-focused overall - pieces of lore will likely be communicated through some sort of in-menu codex/journal so as to maintain focus on gameplay while offering narrative elements to interested players.

# Current State
There's not much to do in the present build; much of the work done so far is under the hood. 

**2024.01.05 : lots of this README is outdated at this point; will update it in the near future to more accurately reflect current state and next steps**

## Controls

- WASD - move
- mouse - aim
- space - dash in current movement direction
- leftclick (hold) - fire weapon 
- Q - ability 1 
- E - ability 2 
- R - ability 3
- Esc - Pause / Ability Select

## Components

### Message-passing infrastructure
In order to decouple major game systems, I've implemented a (currently barebones) event orchestrator system. This is essentially a Singleton container for event delegate functions, and components can freely register their own handler methods in order to broadcast and receive events through this system. For instance, when an enemy unit takes enough damage to deplete its health, a component will broadcast a message that the enemy unit has been destroyed, including such metadata as the unit's location, the ability or damage source responsible for destruction, etc. That message can be received by other systems asynchronously: 
- the audio system can subscribe to this event and handle playing the appropriate sound effect in the correct location  
- the stat-tracking system can update counts tracking enemies destroyed, and even capture more granular stats including dimensions such as damage type or ability  
- the gameplay ability system could subscribe to destruction events if the player's damaging ability (or an innate/passive trait) is able to propagate some effect on death  
  - one example might be an ability whose projectiles infect enemies with a lingering damage-over-time effect which jumps to a nearby enemy if the curently-infected unit dies  

This system is, at least theoretically, flexible and extensible. As development scales up, I'm sure I'll have to revisit aspects of this architecture, but for now it suits my purposes. It currently handles messages for input events, entity destruction, ability usage, etc.

### Gameplay Ability System
After doing some research regarding how to approach designing an ability and attribute framework, Logan pointed me towards Unreal Engine's GAS. Since this is a big enough project without having to learn an entirely new engine (which is also graphical overkill for my 2d space bullshit), I resolved to implement an undoubtedly-shoddy, pared-down version of Unreal's GAS in Unity. Luckily, I quickly found that [someone has already done the hard work for me :) ](https://github.com/sjai013/unity-gameplay-ability-system)  

I've found this data-oriented framework to be a more intuitive way to decompose gameplay abilities and effects, so I've forked this defunct repo and have been using and extending its code for my own purposes. A brief TL;DR without digging into its README/wiki:  
- entities are associated with a set of Attributes, which are modified through GameplayEffects
- GameplayEffects are largely conferred/transmitted through Abilities, and can be used to represent a wide variety of effects
- state is managed through GameplayTag objects, which are simple string tags and can denote either boolean state or positive quantity (e.g. "stacking" effects)
- an example seen in the dev build above: the player's single-shot weapon
  - if the "fire" button is held down and the weapon is not on cooldown, the WeaponSystem component is invoked and fires in the direction the player is facing
  - the projectiles spawned by the WeaponSystem contain 2 GameplayEffects which are applied on collision
    - the first is an Instant GameplayEffect which modifies the target entity's Health attribute (deals damage) based on the shooting entity's BaseDamage attribute
    - the second is a Durational GameplayEffect which applies the GameplayTag "GameplayEffect.StatusEffect.Stun" for 5 seconds before automatically removing it
  - the "GameplayEffect.StatusEffect.Stun" tag has 2 effects to help it accomplish the actual "stun" effect:
    - the enemy movement controller component will check whether its GameObject contains this tag and, if so, will not move the entity
    - the enemy's Abilities can be configured to be blocked by the presence of this tag, meaning the enemy will be unable to invoke those abilities while the tag is applied

This framework seems to allow for expression of complex abilities in a modular manner - I've found it to be intuitive so far for basic implementation, but it may need to be modified or extended when I move on to creating more elaborate abilities and interactions. One notable callout: I've extended the tagging implementation based on ([another repo I stumbled across](https://github.com/KingRecycle/NeatoTags)) so that a GameObject's collection of tags is accessible in constant time in any place the GameObject itself is accessible. This provides a simple interface by which components can modify or check discrete bits of object state whenever they need to. In the above example, the enemy movement controller is not coupled with the ability system at all, but is still able to execute logic based on its host object's tags. 

The UI in this build has been integrated with GAS as well - player ability "icons" accurately reflect cooldown status and durations, player and enemy health bars are backed by their respective Attributes, and enemy prefabs include a status effect indicator showing the remaining duration of any applied effects. Damage number indicators are driven by an AttributeChangeEventHandler, which registers callbacks invoked when a specified Attribute value is changed; in this case, the Handler component registers a delegate which is fired when the host GameObject's ***HitPoints*** attribute value changes - in other words, when it takes damage or heals. The base AttributeChangeEventHandler component can be subclassed in order to perform tasks such as value clamping (for example, ensuring the HitPoints attribute value is always between 0 and MaxHitPoints), additional damage calculations, and more.


### Pooling 
Any entities which need to be instantiated outside of scene initialization, such as enemy ships and weapon projectiles & effects, are pre-created using Unity's object pooling system. The pooling system's current implementation consists of a HashMap wherein object pools are keyed by a GameplayTag identifier, meaning that anything pulling from the pool only needs a tag reference which can be passed around or configured in the editor.

# Future
The final vision of the game is still nebulous, but there are some key points to which I am mostly committed. I'm planning to focus on developing and stabilizing core features and systems as I refine the overall aesthetic and gameplay vision. Here are a few aspirational aspects of the final product:  

### multiple progression vectors, ideally ensuring the feeling of a steadily-increasing power curve for the player
   - for example, gaining experience with a specific ship class may unlock more abilities, and accomplishing milestones with a specific ability may add more effects or unlock more configuration/loadout options
### *meaningful* progression vectors - upgrades should generally impact gameplay in some way
   - instead of increasing damage by some % or increasing the number of projectiles per shot, upgrades should add effects, mechanics, or synergies wherever possible
### enable a wide variety of playstyles, providing organic (and non-exploitative) replay value
   - I'm planning to accomplish this largely through providing a well-rounded set of distinct classes from which the player can choose, each with its own set of stat values and unique abilities and mechanics
   - think of a cross between Vampire Survivors and League of Legends; the player will start with 1 or 2 available classes, with additional classes being unlocked upon satisfying some condition(s), and each class will have a distinct set of abilities and gameplay loop
   - the aim is to provide gameplay freshness through playstyle variety, while laying out milestones and unlocks for dedicated players to pursue
   - for example, the first class available will be a fairly standard "fighter" archetype featuring balanced offensive/defensive capabilities, limited sustain/healing, respectable damage, and some utility. An early class unlock, on the other hand, may look like a "necromancer" archetype, where the player has no innate weapons but instead has abilities which summon drones to fill certain roles (deal damage, provide sustain, CC enemies, etc); another early class may be based on dealing damage over time, providing abilities and upgrades focused on tankiness, CC, AoE damage application, and spreading damage across groups of enemies.
   - this provides an additional mechanism for pacing the complexity of the game - more complex or harder-to-use ship classes can be gated behind more difficult unlock requirements
### wherever possible, foster emergent player and enemy behavior (as opposed to curated)
   - the game should offer players a wide variety of synergistic build options, incentivizing experimentation
   - the AI system should be flexible and allow enemy units to coordinate and support each other in a variety of ways; some examples:
     - enemies whose abilities are on cooldown (or otherwise unusable) should have actions available to them (e.g. trying to block player projectiles meant for a more "valuable" enemy unit or sacrificing itself to buff another unit)
     - different combinations of enemies should exhibit different overall behaviors
### remain accessible to casual players
   - fast-paced combat sections of the game should be quick (2-4 minutes at a time) and allow most (non-end-game) players to hit *some* progression milestone at least every few combat runs, with the aim of offering a fulfilling experience to players whose free time is limited
     - in other words, a player should be able to sit down for 30ish minutes per day and still feel like they are progressing through the game and unlocking new options at a steady pace without feeling too grindy
   - mechanics in the game should not be so complex as to require significant investment in order for the average player to understand
     - this applies equally to synergies and the labelling thereof; mechanics should be clearly named and interactions should be straightforward
       - upon unlocking a new ability, item, or mechanic, they player should be able to easily tell which other items, abilities, and effects it should synergize with
   - item, ability, and mechanic descriptions should be complete and clear enough that the average player need not search for more information online
     - conversely, detailed information (scaling functions and ratios) should be available to players who want to min-max; possibly some configuration option to "show advanced details" or something  

## Next Steps
The next milestone I'm focused on is the design and implementation of a "rough draft" first ship class. For now, I'm going to say that the player is given up to 3 ability slots to fill from their currently-unlocked abilities, and the first ship's rough draft will include a handful of distinct abilities.  During the times I don't feel like working on this milestone, I'm researching and prototyping various AI concepts with the aim of designing a flexible enemy AI system which results in a satisfying, interesting combat experience for the player. 

I'm interested to hear feedback, critiques, and ideas - big or small!










