/* Feeling labels come from Daily Check-In Mood Developer Specification V4. */
const FEELING_DEFINITIONS = Object.fromEntries(`
Amused|Entertained by something funny or pleasantly absurd
Cheerful|Noticeably happy, bright, and in good spirits
Delighted|Filled with strong pleasure or satisfaction
Ecstatic|Experiencing overwhelming happiness or joyful excitement
Elated|Extremely happy and uplifted
Enthusiastic|Eagerly interested and energized to participate
Excited|Energized by anticipation, possibility, or something enjoyable
Exhilarated|Thrilled, energized, and intensely alive
Glad|Pleased and happy about something
Gleeful|Openly and playfully delighted
Happy|Experiencing pleasure, well-being, or satisfaction
Hopeful|Expecting that something good or better is possible
Jubilant|Expressing great happiness, especially after success
Lighthearted|Carefree, cheerful, and relatively free of worry
Optimistic|Expecting a favorable outcome or future
Playful|Inclined toward fun, humor, or lighthearted interaction
Pleased|Satisfied or happy with an event or outcome
Thrilled|Extremely pleased and excited
At ease|Comfortable, relaxed, and free from immediate worry
Balanced|Emotionally steady, with competing needs in workable proportion
Centered|Grounded in yourself and able to respond steadily
Comfortable|Physically or emotionally at ease
Content|Quietly satisfied with what is present
Grounded|Stable, present, and connected to current reality
Peaceful|Free from inner conflict, agitation, or disturbance
Relaxed|Released from tension or strain
Relieved|Feeling pressure or worry lessen after uncertainty or difficulty
Rested|Restored by enough sleep, pause, or recovery
Safe|Protected from immediate danger or harm
Secure|Steady and protected, with confidence that important needs are held
Serene|Deeply calm and untroubled
Settled|No longer agitated, uncertain, or in motion
Steady|Emotionally consistent and not easily shaken
Tranquil|Quiet, calm, and free from disturbance
Unbothered|Not distressed or disturbed by what is happening
Accepted|Welcomed as you are without rejection
Affectionate|Feeling warm fondness and a desire to express care
Appreciated|Feeling that your effort, presence, or qualities are recognized
Caring|Concerned for another person's well-being
Close|Emotionally connected through trust or familiarity
Compassionate|Moved by suffering and wanting to respond with care
Included|Feeling invited, involved, and part of the group
Intimate|Experiencing deep emotional closeness and openness
Loved|Feeling deeply cared for, valued, and emotionally held
Loving|Feeling and expressing deep care toward someone
Respected|Feeling that your dignity, boundaries, and perspective matter
Supported|Feeling helped, encouraged, or held up by others
Tender|Gently caring, emotionally soft, and sensitive
Trusting|Willing to rely on someone or something as dependable
Understood|Feeling that another person accurately grasps your experience
Valued|Feeling important and worthy of consideration
Warm|Experiencing friendly affection, openness, or emotional closeness
Welcomed|Received with friendliness and genuine inclusion
Absorbed|So engaged that attention is fully occupied
Alert|Awake, attentive, and ready to notice or respond
Anticipatory|Focused on and emotionally preparing for what may happen next
Attentive|Actively noticing and concentrating on something
Curious|Wanting to learn, understand, or explore
Eager|Strongly interested and ready to begin
Engaged|Actively involved and mentally or emotionally present
Fascinated|Powerfully interested and drawn to understand more
Focused|Directing attention toward one chosen thing
Inspired|Moved by an idea or example toward possibility or action
Intrigued|Interested because something seems unusual or worth exploring
Motivated|Having energy and a reason to act
Open|Receptive to experience, information, or connection
Passionate|Feeling intense enthusiasm or devotion
Stimulated|Mentally or physically activated by interesting input
Wonder-filled|Experiencing awe, curiosity, and delighted amazement
Assured|Confident and free from significant self-doubt
Brave|Willing to act despite fear or difficulty
Capable|Feeling able to handle a task or situation
Competent|Feeling that you have the needed skill or knowledge
Courageous|Choosing purposeful action in the presence of fear
Determined|Firmly decided and persistent about a goal
Empowered|Feeling able and authorized to make choices or act
Encouraged|Given greater confidence, hope, or willingness to continue
Independent|Able to rely on your own judgment or resources
Prepared|Ready because you have planned, practiced, or gathered what is needed
Proud|Satisfied by effort, growth, identity, or achievement
Resilient|Able to adapt and recover after difficulty
Strong|Feeling able to withstand pressure or act effectively
Successful|Feeling that a desired result has been achieved
Worthy|Feeling deserving of dignity, care, and belonging
Amazed|Filled with great surprise or wonder
Astonished|Very strongly surprised by something unexpected
Awed|Moved by something vast, powerful, beautiful, or extraordinary
Bewildered|Deeply confused and unable to orient to what happened
Caught off guard|Unprepared for something unexpected
Confused|Unable to clearly understand or organize what is happening
Disoriented|Unsure of your position, direction, or what is happening
Dumbfounded|So surprised that thinking or responding briefly stops
Perplexed|Puzzled by something difficult to understand
Shocked|Suddenly and intensely disturbed or surprised
Startled|Experiencing a quick involuntary jolt of surprise or alarm
Stunned|Temporarily unable to respond because of intense surprise
Uncertain|Not sure what is true, likely, or best
Wonderstruck|Filled with astonishment and admiring wonder
Alarmed|Suddenly aware of possible danger or serious concern
Anxious|Uneasy and apprehensive about possible threat or uncertainty
Apprehensive|Worried that something unpleasant may happen
Concerned|Troubled or attentive because something may be wrong
Dreadful|Filled with fearful anticipation of something very unpleasant
Fearful|Experiencing fear in response to perceived danger or threat
Frightened|Made afraid by a present or imagined danger
Guarded|Cautious and emotionally protected because harm feels possible
Insecure|Uncertain about safety, belonging, ability, or worth
Nervous|Uneasy and physically activated before or during uncertainty
On edge|Tense, watchful, and easily startled
Overwhelmed|Flooded because demands or stimulation exceed current capacity
Panicked|Experiencing sudden, intense fear with urgent loss-of-control sensations
Scared|Afraid that harm, loss, or another unwanted outcome may occur
Shaken|Emotionally unsettled after something frightening or upsetting
Suspicious|Distrustful because another person's motives or actions seem unsafe
Terrified|Experiencing extreme fear
Threatened|Feeling that safety, identity, status, or something valued is at risk
Uneasy|Mildly worried or uncomfortable without feeling fully safe
Vulnerable|Exposed to possible emotional or physical harm
Worried|Repeatedly thinking about a possible problem or negative outcome
Aching|Feeling a persistent emotional pain or longing
Bereaved|Grieving the death or profound loss of someone important
Blue|Mildly sad or low in spirit
Crushed|Devastated by a painful loss, rejection, or disappointment
Defeated|Feeling beaten by difficulty and low on hope or energy
Dejected|Low-spirited after disappointment or failure
Despairing|Feeling that hope or improvement is no longer possible
Disappointed|Sad because reality did not meet an important hope or expectation
Discouraged|Losing confidence or motivation after difficulty
Down|Feeling generally sad, low, or lacking energy
Empty|Feeling an absence of emotion, meaning, connection, or fulfillment
Grief-stricken|Overwhelmed by intense grief after loss
Heartbroken|Experiencing deep emotional pain after loss or rejection
Heavyhearted|Burdened by sadness or concern
Hopeless|Unable to see a believable path toward improvement
Hurt|Experiencing emotional pain after an injury to connection, trust, or dignity
Lonely|Painfully aware of missing meaningful connection
Melancholy|Quiet, reflective sadness that may not have one clear cause
Miserable|Experiencing intense unhappiness or distress
Sorrowful|Deeply sad, often in response to loss
Tearful|Close to crying because emotion is near the surface
Unhappy|Not experiencing satisfaction, pleasure, or well-being
Wistful|Gently sad with longing for something absent or past
Aggravated|More irritated because a problem has continued or worsened
Annoyed|Mildly angry because something is bothersome or disruptive
Bitter|Angry and hurt after feeling unfairly treated over time
Enraged|Extremely angry and intensely activated
Exasperated|Strongly irritated after repeated difficulty or frustration
Frustrated|Tense and upset because something blocks progress or a need
Furious|Violently or intensely angry
Impatient|Irritated by delay or by having to wait
Incensed|Made extremely angry by something offensive or unfair
Indignant|Angry because something feels unjust or insulting
Irritated|Bothered and mildly angry
Livid|Extremely angry
Outraged|Strongly angry and shocked by something unjust or unacceptable
Resentful|Holding anger about unfair treatment, unmet needs, or unresolved hurt
Seething|Containing intense anger that is not openly expressed
Upset|Emotionally disturbed, often with anger, sadness, or worry
Vengeful|Wanting to retaliate after feeling harmed or wronged
Appalled|Shocked and disgusted by something judged unacceptable
Averse|Strongly unwilling or opposed because something feels unpleasant
Contemptuous|Viewing someone or something as beneath respect
Disapproving|Believing that something is wrong, unsuitable, or unacceptable
Disenchanted|Disappointed after losing a positive belief or ideal
Disgusted|Strongly repelled by something experienced as offensive or contaminating
Disillusioned|Distressed after discovering that a belief or ideal was false
Disturbed|Emotionally unsettled by something troubling
Horrified|Filled with shock, fear, and disgust
Offended|Hurt or angered by a perceived insult or violation
Repelled|Driven away by strong dislike or disgust
Repulsed|Experiencing an intense urge to reject or move away
Revolted|Extremely disgusted and opposed
Sickened|Made physically or emotionally nauseated by something
Uncomfortable|Experiencing physical or emotional unease
Embarrassed|Self-conscious after unwanted attention or a social mistake
Exposed|Feeling unprotected because something private or vulnerable is visible
Foolish|Ashamed because your action or judgment seems unwise
Humiliated|Painfully shamed or lowered in front of others
Inadequate|Feeling unable to meet a standard or need
Inferior|Feeling lower in worth, ability, or status than others
Mortified|Extremely embarrassed or ashamed
Self-conscious|Highly aware of yourself and how others may judge you
Small|Feeling diminished, powerless, or unimportant
Unworthy|Feeling undeserving of care, respect, or belonging
Apologetic|Feeling sorry and wanting to acknowledge harm or inconvenience
Contrite|Sincerely remorseful and wanting to repair wrongdoing
Regretful|Wishing a past choice or outcome had been different
Remorseful|Feeling deep sorrow and responsibility for harm caused
Responsible|Feeling accountable for an action, duty, or outcome
Sorry|Feeling sadness or regret about harm, loss, or inconvenience
Troubled|Worried or distressed by something difficult to resolve
Covetous|Strongly wanting something that belongs to someone else
Envious|Wanting an advantage, quality, or possession another person has
Jealous|Afraid of losing valued attention, connection, or status to someone else
Longing|Deeply wanting something absent or out of reach
Possessive|Wanting exclusive control of someone or something valued
Rivalrous|Experiencing another person as a competitor for something valued
Yearning|Feeling a deep, persistent desire for something
Alienated|Feeling estranged from others, yourself, or a group
Aloof|Emotionally distant and deliberately uninvolved
Apathetic|Lacking interest, concern, or emotional engagement
Detached|Emotionally separated from an experience or relationship
Distant|Feeling less emotionally close or available
Indifferent|Feeling little preference, interest, or concern
Isolated|Separated from meaningful contact or belonging
Numb|Feeling emotionally muted or unable to access feelings
Shut down|Emotionally or mentally withdrawn after overload or threat
Unseen|Feeling that your experience or presence is not recognized
Withdrawn|Pulling away from contact, expression, or participation
Ambivalent|Holding conflicting positive and negative feelings at once
Baffled|Completely puzzled and unable to understand
Conflicted|Pulled between incompatible wants, values, or choices
Distracted|Unable to keep attention on the intended focus
Doubtful|Uncertain that something is true, wise, or likely
Hesitant|Pausing because of uncertainty or reluctance
Indecisive|Unable to choose confidently between options
Lost|Unsure what to do, where to go, or how to understand the situation
Skeptical|Doubting a claim because evidence or trust feels insufficient
Torn|Strongly divided between competing choices or loyalties
Unclear|Not yet understandable or well defined
Unsure|Lacking confidence about what is true or what to choose
Burdened|Weighed down by responsibility, worry, or difficulty
Chaotic|Experiencing events or thoughts as disordered and hard to manage
Drained|Depleted of emotional or physical energy
Frazzled|Mentally and physically worn by stress and competing demands
Helpless|Feeling unable to influence what is happening
Overloaded|Carrying more information, work, or demand than can be processed
Pressured|Feeling pushed by expectations, urgency, or consequences
Scattered|Having attention and energy pulled in too many directions
Stressed|Strained by demands that require adaptation or effort
Swamped|Overwhelmed by an excessive amount of work or need
Tense|Physically or emotionally tight and unable to relax
Trapped|Feeling unable to leave, change, or safely respond to a situation
Unsettled|Unable to feel calm, stable, or certain
Worn down|Gradually exhausted or discouraged by prolonged strain
Disengaged|No longer mentally or emotionally involved
Dissatisfied|Feeling that needs, expectations, or standards are not met
Listless|Lacking energy, interest, or enthusiasm
Restless|Unable to settle because the body or mind seeks movement or change
Stagnant|Feeling stuck without growth, movement, or renewal
Unchallenged|Not sufficiently stretched, stimulated, or engaged
Unfulfilled|Feeling that important needs, values, or potential remain unmet
Uninterested|Not curious about or drawn toward what is present
Unmotivated|Lacking energy or a meaningful reason to act
Weary|Deeply tired after effort, worry, or repetition
Comforted|Soothed by care, reassurance, or relief from distress
Reassured|More confident or calm after uncertainty is reduced
Released|Freed from pressure, restraint, or emotional holding
Soothed|Gently calmed after pain, agitation, or distress
Thankful|Aware of and appreciative for something received
Unburdened|Freed from a weight, duty, worry, or secret
Untroubled|Free from immediate worry or distress
`.trim().split('\n').map(line=>{const i=line.indexOf('|');return [line.slice(0,i),line.slice(i+1)+'.']}));

const EMOTION_PRESENTATION = {
  Joyful:{emoji:'😄',category:'pleasant'},Calm:{emoji:'🌊',category:'pleasant'},Connected:{emoji:'💗',category:'pleasant'},Interested:{emoji:'✨',category:'pleasant'},Confident:{emoji:'🌟',category:'pleasant'},Relieved:{emoji:'😌',category:'pleasant'},
  Surprised:{emoji:'😮',category:'mixed'},Confused:{emoji:'🤔',category:'mixed'},Envious:{emoji:'💚',category:'mixed'},
  Afraid:{emoji:'😨',category:'difficult'},Sad:{emoji:'😢',category:'difficult'},Angry:{emoji:'😤',category:'difficult'},Disgusted:{emoji:'🤢',category:'difficult'},Ashamed:{emoji:'😔',category:'difficult'},Guilty:{emoji:'😞',category:'difficult'},Disconnected:{emoji:'🌑',category:'difficult'},Overwhelmed:{emoji:'🫠',category:'difficult'},Bored:{emoji:'🥱',category:'difficult'}
};

const FEELING_EMOJI = {Excited:'🤩',Hopeful:'🌅',Proud:'🌟',Content:'😌',Loved:'💗',Disappointed:'😕',Jealous:'💚',Conflicted:'🤔',Hopeless:'🌫️',Embarrassed:'😳',Frustrated:'😠',Lonely:'🌑',Overwhelmed:'🫠',Numb:'🩶',Hurt:'💔'};

const WHEEL_GUIDES = {
  Excited:{what:'A heightened, anticipatory energy about something upcoming or happening. Excitement is enthusiasm with momentum — your system is revved up and ready.',body:'Racing or fluttery heart, butterflies in the stomach, energy buzzing in the limbs, wide eyes, difficulty sitting still, talking faster than usual.',thoughts:'“I can’t wait!” “This is going to be great.” Forward-focused, planning, imagining. Excitement is future-oriented and energizing.',uncomfortable:'Excitement and anxiety feel nearly identical in the body. If excitement tips into overwhelm, slow your breath and do a quick grounding check. The anticipation is safe.',words:'“I’m so excited about…” / “I can’t wait for…” / “I feel energized just thinking about it.”'},
  Hopeful:{what:'A forward-looking feeling of expectation that things can get better or that something good is possible. Hope is the belief that the future is open.',body:'Lightness in the chest, forward-leaning energy, eyes that feel bright, a sense of possibility and momentum.',thoughts:'“Things can get better.” “I can see a path forward.” Hope tends to generate planning, imagination, and a willingness to keep going.',uncomfortable:'Hope can feel risky if you’ve been disappointed before. Holding hope lightly — as a possibility, not a guarantee — can make it feel safer. You don’t have to be certain to be hopeful.',words:'“I feel hopeful that…” / “I’m starting to believe things might turn around.” / “I can see a way through this.”'},
  Proud:{what:'A feeling of satisfaction from your own growth, effort, or achievement — or that of someone you care about. Healthy pride is self-respect, not arrogance.',body:'Upright posture, chest feels open and expanded, warmth, a sense of standing taller and feeling solid in yourself.',thoughts:'“I did that.” “My effort paid off.” You may want to share your accomplishment or feel a quiet internal recognition of your own worth.',uncomfortable:'Pride can feel vulnerable — like you’re bragging or setting yourself up to fail. Remind yourself: acknowledging your own growth is not arrogance. You’re allowed to feel good about what you’ve done.',words:'“I’m proud of myself for…” / “I worked really hard and it showed.” / “I feel good about what I accomplished.”'},
  Content:{what:'A quiet, peaceful satisfaction with how things are. Not excitement — just a calm sense that things are okay right now, and that’s enough.',body:'Relaxed muscles, slow and easy breathing, no tension, a settled and grounded quality throughout the body.',thoughts:'“This is enough.” “I’m okay right now.” Content people often feel still, present, and at ease without needing anything to change.',uncomfortable:'If stillness feels unfamiliar or even unsafe, notice that. Some people are wired to feel anxious when things are calm. Try breathing into it and staying for just a moment.',words:'“I feel at peace right now.” / “Things feel okay — I’m satisfied.” / “I’m not looking for anything more right now.”'},
  Loved:{what:'A feeling of being genuinely cared for, seen, and valued by others. Love connects you to something larger than yourself.',body:'Warmth and fullness in the chest, relaxed and open body posture, a soft face, a sense of safety and belonging.',thoughts:'“I matter to someone.” “I’m not alone.” Feeling seen and accepted can soften defenses and bring a quiet joy.',uncomfortable:'Feeling loved can be surprisingly vulnerable — especially if love has hurt you before. If you notice an urge to push it away or not trust it, that’s worth exploring gently.',words:'“I feel cared for.” / “I feel like I really matter to the people around me.” / “I felt seen and loved today.”'},
  Disappointed:{what:'A deflated, sad feeling when something you hoped for doesn’t happen. Disappointment means you cared — that’s not a weakness, it’s proof you were invested.',body:'Deflated chest, a sinking or dropping feeling, low energy, sighing, a kind of dullness.',thoughts:'“I expected more.” “This isn’t what I hoped for.” Comparing what is to what could have been. Sometimes replaying what went wrong.',uncomfortable:'Let yourself grieve the version of things you were hoping for — that loss is real. Then gently ask: what’s still possible from here? Disappointment often clears when we release the original expectation.',words:'“I’m feeling disappointed about…” / “I had really hoped this would go differently.” / “This isn’t what I expected and I need a minute.”'},
  Jealous:{what:'A complex feeling combining fear, insecurity, and comparison — often pointing to something you want or fear losing. Jealousy is worth getting curious about, not ashamed of.',body:'Tightness in the chest, stomach tension, a restless or watchful quality, heat, sometimes an urge to check or monitor.',thoughts:'“They have what I want.” “Am I enough?” “What if I lose this?” Comparison, self-doubt, and monitoring are common.',uncomfortable:'Get curious instead of ashamed. Jealousy is pointing toward something — a value, a desire, an insecurity worth exploring. Ask: what do I actually want here? What am I afraid of losing?',words:'“I’m struggling with some jealousy around…” / “I’m noticing some insecurity coming up for me.” / “I’m comparing myself to someone and it’s not helping.”'},
  Conflicted:{what:'A feeling of being pulled in two or more directions at once — wanting things that seem incompatible, or holding values that are in tension. Conflict is a sign that multiple things matter to you.',body:'Tension without a clear location, restlessness, difficulty settling, a back-and-forth quality in your mind and body.',thoughts:'“I want both things but I can’t have them.” “I don’t know what’s right.” Going back and forth, making and unmaking decisions.',uncomfortable:'Try writing both sides down — what each option gives you and what it costs you. Conflict often resolves when you identify which value matters most right now. You don’t have to be certain; you just have to choose.',words:'“I’m feeling really conflicted about…” / “Part of me wants one thing, but another part wants something else.” / “I’m torn and I could use help thinking it through.”'},
  Hopeless:{what:'A heavy feeling that things cannot get better — that effort is pointless and the future is closed. Hopelessness often comes alongside depression or prolonged difficulty.',body:'Heaviness throughout the whole body, low or no energy, slow movements, a gray or flat quality, difficulty imagining the future.',thoughts:'“Nothing will change.” “What’s the point?” “I can’t see a way out.” The mind closes off possibility and focuses on evidence that things are stuck.',uncomfortable:'Hopelessness is serious and worth sharing with someone — a friend, a therapist, or a crisis line. You don’t have to find hope right now; you just have to reach out to one person. Small steps still count.',words:'“I’ve been feeling hopeless about…” / “I’m having trouble seeing a way forward.” / “I need help — I can’t see it getting better from here.”'},
  Embarrassed:{what:'A self-conscious feeling that arises when you’ve done something that exposes you to others’ judgment or when you’ve violated a social norm. Embarrassment is usually temporary.',body:'Flushed face, desire to look away or hide, warmth or heat in the cheeks, urge to laugh nervously or disappear.',thoughts:'“Everyone saw that.” “I look foolish.” “I wish I could take that back.” Replaying the moment, imagining what others are thinking.',uncomfortable:'Remind yourself: everyone has embarrassing moments. The spotlight effect makes us think others are watching more than they are. Laughing at yourself — when you’re ready — can defuse it quickly.',words:'“I’m feeling embarrassed about…” / “I did something awkward and I’m still cringing.” / “I felt humiliated and I’m still sitting with it.”'},
  Frustrated:{what:'A tense, blocked feeling that arises when something is getting in the way of what you need or want — a person, a situation, or your own limits.',body:'Tension in the chest and jaw, sighing, restlessness, tight muscles, an urge to push through, fight, or give up.',thoughts:'“Why won’t this work?” “This shouldn’t be happening.” Repetitive, stuck thinking. The mind keeps going back to the obstacle.',uncomfortable:'Take a break — frustration feeds on itself. Step away, move your body, then return with fresh eyes. Ask: is the goal still worth it, and is my approach actually working?',words:'“I’m feeling frustrated with…” / “I keep hitting a wall on…” / “I’m struggling and I’m not sure what to do differently.”'},
  Lonely:{what:'A painful awareness of disconnection — feeling unseen, isolated, or longing for meaningful contact with others. Loneliness is not the same as being alone; you can feel it in a crowd.',body:'A hollow, aching quality in the chest, heaviness, low energy, a longing quality that doesn’t quite go away.',thoughts:'“Nobody really knows me.” “I don’t belong anywhere.” “I’m invisible.” Loneliness can drive withdrawal — which usually makes it worse.',uncomfortable:'Reach out to even one person, even briefly. Loneliness deepens in isolation. A small connection — a text, a call, sitting near someone — can interrupt the spiral.',words:'“I’ve been feeling lonely lately.” / “I’m craving real connection.” / “I feel like I’m on the outside looking in.”'},
  Overwhelmed:{what:'A flooded feeling when there are too many demands, emotions, or stimuli for your system to process at once. Overwhelm is a signal that you’ve exceeded your current capacity.',body:'Heavy head, tight chest, shallow breathing, difficulty thinking clearly, a frozen or frantically busy quality.',thoughts:'“I can’t do this.” “There’s too much.” “I don’t know where to start.” Paralysis or avoidance are common responses.',uncomfortable:'Do just one small thing. Write everything down to get it out of your head. Breathe. Ask for help. You don’t have to handle everything right now — just this one moment.',words:'“I’m feeling overwhelmed and I don’t know where to start.” / “There’s too much on my plate right now.” / “I need some support or breathing room.”'},
  Numb:{what:'An absence or muting of feeling — often a protective response when emotions have become too intense. Numbness is not indifference; it’s your system trying to protect you.',body:'Feeling disconnected from your own body, going through the motions, flat affect, a foggy or distant quality, low responsiveness.',thoughts:'“I don’t feel anything.” “What’s the point?” “I’m just going through the motions.” Numbing often signals emotional overload just beneath the surface.',uncomfortable:'Try gentle sensory input to reconnect: cold water on your face, movement, strong smells, music. Ask softly: what might I be protecting myself from feeling?',words:'“I’ve been feeling numb lately.” / “I’m disconnected from myself and I’m not sure why.” / “Something feels off — I’m not really here.”'},
  Hurt:{what:'An emotional pain caused by another person’s words, actions, or absence. Hurt signals that something important to you — connection, respect, or care — was affected.',body:'Tightness in the throat, heaviness in the chest, a tearful or fragile quality, a physical ache that’s hard to localize.',thoughts:'“They don’t care about me.” “That wasn’t okay.” “I didn’t matter.” Hurt often brings a desire to be acknowledged or to withdraw.',uncomfortable:'Try to feel the hurt rather than moving straight to anger, which can cover it. Being hurt by someone is worth naming — to yourself and to them.',words:'“I felt hurt when…” / “What happened made me feel like I didn’t matter.” / “Something you said or did really affected me and I want you to know.”'}
};

function feelingGuide(parent, feeling, parentGuide) {
  if (WHEEL_GUIDES[feeling]) return WHEEL_GUIDES[feeling];
  const lower = feeling.toLowerCase();
  return {
    what: FEELING_DEFINITIONS[feeling] || `${feeling} is a more precise way to describe the ${parent.toLowerCase()} emotion you are experiencing.`,
    body: `You may notice ${parentGuide[0]}. ${feeling} can feel different from person to person.`,
    thoughts: `Thoughts may focus on what is making you feel ${lower}, including “${parentGuide[1]}.”`,
    uncomfortable: `${parentGuide[2]}. Name the feeling without judging yourself for having it.`,
    words: `“I’m feeling ${lower} right now.” / “I felt ${lower} when that happened.” / “The more precise word for what I’m feeling is ${lower}.”`
  };
}
