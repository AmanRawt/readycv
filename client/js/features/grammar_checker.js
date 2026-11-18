/* ============================================================
   ReadyCVs — grammar_checker.js  v2
   Standalone grammar + spell checker.
   Include BEFORE ai_resume_writer.js
   Usage:  window.GrammarChecker.fix(text)  → corrected string
           window.GrammarChecker.issues(text) → array of issue strings
   ============================================================ */
'use strict';

(function () {

  /* ── 500+ misspelling dictionary ────────────────────────────
     Key   = misspelled word (lowercase)
     Value = correct word
  ──────────────────────────────────────────────────────────── */
  const DICT = {
    // A
    abilitys:'abilities', absense:'absence', absense:'absence',
    accesible:'accessible', accidentaly:'accidentally', accidentelly:'accidentally',
    accomadate:'accommodate', accomodate:'accommodate', accomodation:'accommodation',
    achive:'achieve', achived:'achieved', achiving:'achieving',
    acheive:'achieve', acheived:'achieved', acheiving:'achieving',
    acnowledge:'acknowledge', acnowledged:'acknowledged',
    acording:'according', acordingly:'accordingly',
    acount:'account', acounts:'accounts',
    acurate:'accurate', acuracy:'accuracy',
    acutal:'actual', acutally:'actually',
    adress:'address', adressed:'addressed', adresses:'addresses', adressing:'addressing',
    adviced:'advised', adviseing:'advising',
    aggreed:'agreed', agrement:'agreement', agreemnt:'agreement',
    alot:'a lot', allot:'a lot',
    allready:'already', allways:'always', alwayes:'always',
    alternatly:'alternately', alternativly:'alternatively',
    amature:'amateur', amatures:'amateurs',
    analised:'analysed', analize:'analyze', analizing:'analyzing',
    anonimous:'anonymous',
    aparent:'apparent', aparently:'apparently',
    appologies:'apologies', appologize:'apologize', appology:'apology',
    apropriate:'appropriate', apropriately:'appropriately',
    aproximate:'approximate', aproximately:'approximately',
    arguement:'argument', arguements:'arguments',
    arround:'around',
    assesment:'assessment', assesments:'assessments',
    assistence:'assistance', assistent:'assistant',
    atribute:'attribute', atributes:'attributes', atributed:'attributed',
    audiense:'audience',
    automaticaly:'automatically', automaticly:'automatically',
    // B
    basicaly:'basically', basicly:'basically',
    becuase:'because', becasue:'because', beacuse:'because',
    begining:'beginning', beggiing:'beginning',
    beleive:'believe', beleived:'believed', beleiving:'believing',
    belive:'believe', belived:'believed',
    benificial:'beneficial', benifically:'beneficially',
    benifit:'benefit', benifits:'benefits', benifited:'benefited',
    buget:'budget', bugets:'budgets',
    buisness:'business', buisnesses:'businesses',
    // C
    calander:'calendar', calender:'calendar',
    cancelation:'cancellation',
    carear:'career', carears:'careers',
    carefuly:'carefully', carful:'careful',
    catagory:'category', catagories:'categories',
    challange:'challenge', challanged:'challenged', challanges:'challenges',
    chanelling:'channelling',
    charachter:'character', charachters:'characters',
    cheif:'chief',
    colaborate:'collaborate', colaborated:'collaborated', colaboration:'collaboration',
    colege:'college', coleges:'colleges',
    comitment:'commitment', comitments:'commitments',
    commited:'committed', comitting:'committing',
    commitee:'committee',
    communiction:'communication', communicaton:'communication',
    compatable:'compatible', compatability:'compatibility',
    competance:'competence', competant:'competent', compitent:'competent',
    completly:'completely', completeley:'completely',
    concious:'conscious', conciousness:'consciousness',
    confussed:'confused', confussion:'confusion',
    continuosly:'continuously', continously:'continuously',
    controll:'control', controled:'controlled', controling:'controlling',
    corect:'correct', corected:'corrected', corecting:'correcting',
    cordinates:'coordinates',
    costumer:'customer', costumers:'customers',
    critisism:'criticism', critisise:'criticise',
    // D
    decison:'decision', decisons:'decisions',
    definately:'definitely', definitly:'definitely', definetly:'definitely',
    deffinetly:'definitely', definatly:'definitely',
    delevop:'develop', delevoped:'developed', delevoping:'developing',
    delevopment:'development',
    dependancy:'dependency', dependancies:'dependencies',
    desicion:'decision', desicions:'decisions',
    developement:'development',
    develope:'develop', developped:'developed',
    diferent:'different', diferently:'differently', diference:'difference',
    difficutly:'difficulty', dificult:'difficult',
    discription:'description', discriptions:'descriptions',
    dicipline:'discipline', disipline:'discipline',
    doesnt:"doesn't", dont:"don't", didnt:"didn't",
    // E
    eariler:'earlier',
    effecient:'efficient', eficient:'efficient', efficiancy:'efficiency',
    elaborete:'elaborate',
    embaras:'embarrass', embarassed:'embarrassed', embarasment:'embarrassment',
    emoployee:'employee', employes:'employees',
    emplayment:'employment',
    encoraging:'encouraging',
    enought:'enough',
    entrepeneuer:'entrepreneur', entrepenuer:'entrepreneur',
    enviroment:'environment', enviromental:'environmental', enviroments:'environments',
    equiptment:'equipment',
    especialy:'especially', expecially:'especially',
    excede:'exceed', exceded:'exceeded',
    excelence:'excellence', excelent:'excellent', excellant:'excellent',
    excercise:'exercise', excercised:'exercised',
    existance:'existence',
    experiance:'experience', expereince:'experience', experince:'experience',
    expirience:'experience', experiances:'experiences',
    explaination:'explanation', explaintion:'explanation',
    // F
    faciliate:'facilitate', facilitated:'facilitated', facillitate:'facilitate',
    familair:'familiar',
    feild:'field', feilds:'fields',
    finacial:'financial', finacially:'financially',
    finaly:'finally', finaly:'finally',
    foriegn:'foreign',
    forseeable:'foreseeable',
    foward:'forward',
    frequantly:'frequently', frequentely:'frequently',
    freind:'friend', freinds:'friends',
    fullfil:'fulfill', fullfiled:'fulfilled', fullfill:'fulfill',
    funtion:'function', funtionality:'functionality', funtions:'functions',
    // G
    generaly:'generally', generaly:'generally',
    goverment:'government', goverments:'governments',
    gramar:'grammar', grammer:'grammar',
    guarentee:'guarantee', guarenteed:'guaranteed',
    guidence:'guidance',
    // H
    happend:'happened', happning:'happening',
    harasment:'harassment',
    hardwear:'hardware',
    hasnt:"hasn't", havent:"haven't", hadnt:"hadn't",
    higlight:'highlight', higlights:'highlights',
    // I
    idependently:'independently',
    immeditaly:'immediately', imediately:'immediately',
    implmentation:'implementation', implmentations:'implementations',
    implmented:'implemented', implmenting:'implementing',
    implementated:'implemented',
    importent:'important',
    improvment:'improvement', improvments:'improvements',
    inaccesible:'inaccessible',
    incidently:'incidentally',
    independantly:'independently',
    indipendent:'independent', indipendently:'independently',
    indispensible:'indispensable',
    infomation:'information',
    intergration:'integration', integartion:'integration',
    inteligence:'intelligence', inteligent:'intelligent',
    intrest:'interest', intrested:'interested', intresting:'interesting',
    involement:'involvement',
    isnt:"isn't",
    // J
    judgement:'judgment',
    jurnalist:'journalist',
    // K
    knowlege:'knowledge', knowlegeable:'knowledgeable', knowlegde:'knowledge',
    // L
    laguage:'language', laguages:'languages',
    lauch:'launch', lauched:'launched', lauching:'launching',
    leadreship:'leadership',
    learnign:'learning',
    lisence:'license', lisenced:'licensed',
    logicaly:'logically',
    // M
    maintanance:'maintenance', maintance:'maintenance',
    managment:'management', managemet:'management',
    manageing:'managing', manaement:'management',
    memeber:'member', memebers:'members',
    minumum:'minimum',
    misspeling:'misspelling',
    moddel:'model', moddels:'models',
    multipul:'multiple',
    // N
    necesary:'necessary', necessite:'necessitate',
    negociate:'negotiate', negociated:'negotiated',
    // O
    obiously:'obviously',
    occassion:'occasion', occassional:'occasional',
    occured:'occurred', occurence:'occurrence', occurrance:'occurrence',
    ommit:'omit', omision:'omission',
    opertunity:'opportunity', oportunity:'opportunity',
    orgainze:'organize', orgainzed:'organized',
    orignal:'original',
    outsorcing:'outsourcing',
    oversigth:'oversight',
    // P
    paricular:'particular', particuler:'particular',
    perfomance:'performance', performence:'performance',
    peice:'piece',
    percieve:'perceive', percieved:'perceived',
    persistance:'persistence',
    personaly:'personally',
    persue:'pursue',
    planing:'planning',
    posible:'possible', posibly:'possibly',
    prefered:'preferred', preffered:'preferred',
    presntation:'presentation', presntations:'presentations',
    probelm:'problem', probelms:'problems',
    profecional:'professional', professinal:'professional',
    programe:'program', programing:'programming',
    promt:'prompt',
    pronounciation:'pronunciation',
    // Q
    quailty:'quality',
    quaterly:'quarterly',
    // R
    realy:'really',
    recieve:'receive', recieved:'received', recieving:'receiving',
    reccomend:'recommend', recomend:'recommend',
    recomended:'recommended', recomendation:'recommendation',
    refered:'referred',
    referance:'reference', referances:'references',
    relevent:'relevant', relivant:'relevant',
    remeber:'remember', rember:'remember',
    repsonsibility:'responsibility',
    resently:'recently',
    responsibilty:'responsibility', responsibily:'responsibly',
    resourse:'resource', resourses:'resources',
    retreive:'retrieve',
    rigourous:'rigorous',
    // S
    safty:'safety',
    scedule:'schedule', scedules:'schedules', shedule:'schedule',
    secratary:'secretary',
    securiy:'security',
    seperate:'separate', seperated:'separated', seperation:'separation',
    sinceerly:'sincerely',
    softwear:'software',
    somthing:'something',
    specialy:'specially',
    strenths:'strengths', strenghts:'strengths', strenghten:'strengthen',
    sturcture:'structure',
    sucess:'success', succesful:'successful', succesfully:'successfully',
    sucessful:'successful', sucessfully:'successfully',
    sumary:'summary',
    suppot:'support',
    // T
    tecnology:'technology', technolgy:'technology',
    teh:'the', hte:'the', hte:'the',
    tendancy:'tendency',
    thoguht:'thought',
    thier:'their', thier:'their',
    throught:'throughout',
    tommorow:'tomorrow', tomarrow:'tomorrow',
    toghether:'together', togehter:'together',
    transfered:'transferred',
    tryed:'tried',
    // U
    understad:'understand', understod:'understood',
    unfortunatly:'unfortunately',
    untill:'until',
    usally:'usually',
    // V
    valueable:'valuable',
    variaty:'variety',
    visability:'visibility', visable:'visible',
    // W
    wasnt:"wasn't", werent:"weren't",
    wheter:'whether',
    widley:'widely',
    wierd:'weird',
    wont:"won't", wouldnt:"wouldn't", couldnt:"couldn't", shouldnt:"shouldn't",
    writting:'writing',
    // Y
    yeild:'yield',
    youre:"you're", youd:"you'd", youll:"you'll",
    // Indian-English extras
    prepone:'bring forward',
    revert:'reply', reverting:'replying',
    batchelor:'bachelor',
    grammer:'grammar',
    // Common resume words
    managemet:'management', managment:'management',
    developement:'development', develpoment:'development',
    implmentation:'implementation',
    performence:'performance', perfomance:'performance',
    reccomendation:'recommendation',
    achievment:'achievement', achievments:'achievements',
    comunication:'communication',
    colaboration:'collaboration',
    experiance:'experience',
    knowlege:'knowledge',
    leadreship:'leadership',
    orginaztion:'organization', orginization:'organization',
    responsibilites:'responsibilities',
    skillset:'skill set',
  };

  /* ── Preserve capitalisation of the original word ──────── */
  function matchCase(original, corrected) {
    if (!original || !corrected) return corrected;
    // ALL CAPS
    if (original === original.toUpperCase() && original.length > 1) return corrected.toUpperCase();
    // Title Case (first letter capital)
    if (original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) {
      return corrected[0].toUpperCase() + corrected.slice(1);
    }
    return corrected;
  }

  /* ── Core fix function ──────────────────────────────────── */
  function fix(text) {
    if (!text || typeof text !== 'string') return text;
    let t = text;

    /* PASS 1: word-by-word dictionary lookup */
    t = t.replace(/\b([A-Za-z']+)\b/g, (word) => {
      const lower = word.toLowerCase();
      if (DICT[lower] !== undefined) return matchCase(word, DICT[lower]);
      return word;
    });

    /* PASS 2: contractions without apostrophes (after dict so dict takes priority) */
    const contractions = [
      [/\bim\b/gi, "I'm"],
      [/\bid\b/g, "I'd"],
      [/\bive\b/gi, "I've"],
      [/\bill\b/gi, "I'll"],
      [/\btheyre\b/gi, "they're"],
      [/\btheyve\b/gi, "they've"],
      [/\btheyll\b/gi, "they'll"],
      [/\bweve\b/gi, "we've"],
      [/\bwell\b/gi, m => m], // keep well as-is
      [/\byouve\b/gi, "you've"],
      [/\byoull\b/gi, "you'll"],
      [/\bweve\b/gi, "we've"],
      [/\bitsn\b/gi, "isn't"],
    ];
    contractions.forEach(([re, rep]) => {
      if (typeof rep === 'string') t = t.replace(re, rep);
    });

    /* PASS 3: standalone lowercase "i" → "I" */
    // Between spaces/punctuation
    t = t.replace(/(?<=^|\s)i(?=\s|[,.!?;:]|$)/gm, 'I');
    // At start of string
    t = t.replace(/^i\s/i, m => 'I ');

    /* PASS 4: capitalize first letter of each sentence */
    t = t.replace(/(^|[.!?]\s+)([a-z])/g, (_, punct, letter) => punct + letter.toUpperCase());

    /* PASS 5: fix spaces before punctuation */
    t = t.replace(/ ([,;:.!?])/g, '$1');

    /* PASS 6: fix double spaces */
    t = t.replace(/  +/g, ' ');

    /* PASS 7: remove duplicate consecutive words */
    t = t.replace(/\b(\w+)\s+\1\b/gi, '$1');

    /* PASS 8: Indian-English redundancies */
    const redundancies = [
      [/\bdiscuss about\b/gi, 'discuss'],
      [/\breturn back\b/gi, 'return'],
      [/\brepeat again\b/gi, 'repeat'],
      [/\bpast history\b/gi, 'history'],
      [/\bfuture plans\b/gi, 'plans'],
      [/\bfree gift\b/gi, 'gift'],
      [/\bon the behalf of\b/gi, 'on behalf of'],
      [/\bam having\b/gi, 'have'],
      [/\bis having\b/gi, 'has'],
      [/\bwere having\b/gi, 'had'],
      [/\bdid the needful\b/gi, 'completed the task'],
      [/\bkindly revert\b/gi, 'please reply'],
      [/\brevert back\b/gi, 'reply'],
      [/\bpre-planned\b/gi, 'planned'],
      [/\bpre planned\b/gi, 'planned'],
      [/\bunexpected surprise\b/gi, 'surprise'],
      [/\benter into\b/gi, 'enter'],
    ];
    redundancies.forEach(([re, rep]) => { t = t.replace(re, rep); });

    /* PASS 9: article correction a/an */
    t = t.replace(/\ba ([aeiouAEIOU][a-zA-Z])/g, 'an $1');
    t = t.replace(/\ban ([bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ](?![aeiouAEIOU]))/g, 'a $1');

    /* PASS 10: trim */
    t = t.trim();

    return t;
  }

  /* ── Detect issues for hint badge ──────────────────────── */
  function issues(text) {
    if (!text) return [];
    const found = [];
    const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
    const seen = new Set();
    words.forEach(w => {
      if (DICT[w] && !seen.has(w)) {
        found.push(`"${w}" → "${DICT[w]}"`);
        seen.add(w);
      }
    });
    // standalone i
    if (/(?:^|\s)i(?:\s|[,.!?]|$)/m.test(text)) found.push('lowercase "i" should be "I"');
    // double space
    if (/  /.test(text)) found.push('double spaces');
    // duplicate word
    if (/\b(\w+)\s+\1\b/i.test(text)) found.push('duplicate word');
    return found;
  }

  /* ── Count how many words changed ──────────────────────── */
  function countChanges(original, corrected) {
    const a = original.split(/\s+/);
    const b = corrected.split(/\s+/);
    let n = 0;
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      if ((a[i] || '') !== (b[i] || '')) n++;
    }
    return n;
  }

  /* ── Expose public API ──────────────────────────────────── */
  window.GrammarChecker = { fix, issues, countChanges };

})();
