# Lessons 7–8: full official-source evidence audit (original questions 145–192)

**Checked:** 2026-11-21. **Input:** `data/source-questions.json`, original `n` 145–192 (L7 = 145–168, L8 = 169–192). All 48 records have `tf: false`; several stems are still phrased "True or False". `a` in the input is a **zero-based** option index.

**Method and limits.** The access registry (`~/.config/opencode/skill/deep-research/ACCESS.md`) was read before retrieval. Every item's stem, options, keyed answer and explanation was inspected. Every URL below is HTTPS and was opened in this run (HTTP fetch, `curl_cffi`, or PDF text extraction) and the quoted text read; where a page refused automated access this is stated. Sources are **Tier A** (government, legislature, courts, statutory bodies, national archives/museums, established-church and official governing bodies) unless marked otherwise. This does not claim access to the paid official handbook or to the exact wording of the live test; it tests the *substance* of each keyed answer. No question data or application content was changed.

**Overall result — 48 items.**

- **Supported as keyed (37):** 146, 147, 148, 150, 151, 152, 153, 154, 155, 157, 158, 159, 160, 161, 162, 163, 166, 169, 170, 171, 172, 173, 175, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 190, 191, 192.
- **Supported but the stated answer/explanation needs correction (3):** 156 (scope of the 1833 Act), 164 (DWP is not the current route for a National Insurance number), 167 (Lent is not simply "40 days before Easter").
- **Partly supported / materially ambiguous (6):** 145, 168, 174, 176, 177, 189.
- **Unresolved — no Tier A source obtained (2):** 149 (18th-century largest employer), 165 (Royal Ascot; official site IP-blocked).

**Blockers encountered.** `ascot.com` (CloudFront 403 to `curl_cffi`, plain `curl` *and* the Playwright browser — datacenter IP); `nationalparks.uk` (401 security check, also in the browser); `royal.uk` (Cloudflare); `blog.nrscotland.gov.uk` (403 to `curl_cffi`); `britishmuseum.org` HTML pages (403 — the museum's own PDF was used instead); `legislation.gov.uk` returns 400 to `curl_cffi` and 502 to its XML API, so it was fetched with plain `curl`/`webfetch`; the 1833 and 1918 Acts have **no digitised text** on legislation.gov.uk (only a repealed-status stub), so the National Archives and Parliament were used instead. `thebookerprizes.com`, `iwm.org.uk`, `nts.org.uk` and `parliament.uk` needed `curl_cffi` (plain `curl` gets a Cloudflare interstitial).

---

## L7 — Government and law (145–168)

## 145 — "As a British citizen, what are your responsibilities?" (key: option 1 — respect/obey the law, look after your area and the environment)
**Supported claim:** Respecting and obeying the law is a stated citizenship obligation; "look after the area in which you live and the environment" is **not** in the official wording found and is at best a civic expectation.
**Evidence [Tier A]:** GOV.UK, *Citizenship ceremonies*, https://www.gov.uk/citizenship-ceremonies — section "During the ceremony": "You'll have to make an oath of allegiance … and a pledge. This means you promise to respect the rights, freedoms and laws of the UK."
**Status:** Partly supported. The legal-duty half is solid; the environmental half is unsourced. Avoid implying a specific statutory duty to tidy your neighbourhood.
**Checked:** 2026-11-21.

## 146 — "When is Halloween celebrated?" (key: 31st of October)
**Supported claim:** Halloween is observed on 31 October.
**Evidence [Tier A]:** Met Office, *Halloween weather extremes* (blog), https://www.metoffice.gov.uk/blog/2026/halloween-weather-extremes-howling-winds-and-bitter-chills — opening paragraph: "the UK's weather on 31 October has been remarkably varied".
**Status:** Confirmed, but note the source only uses the date incidentally — no government page found that *defines* Halloween's date. The date itself is not in dispute.
**Checked:** 2026-11-21.

## 147 — "True or False: The Bill of Rights of 1689 gave women the right to vote." (key: False)
**Supported claim:** False. The 1689 Bill of Rights concerns the crown, Parliament and Protestant succession; women's parliamentary vote came in 1918 (aged 30+, with a property qualification) and on equal terms in 1928.
**Evidence [Tier A]:** *Bill of Rights [1688]*, https://www.legislation.gov.uk/aep/WillandMarSess2/1/2 — declaration of rights, including "By Violating the Freedome of Election of Members to serve in Parlyament" and the recital about "the Protestant Religion and the Lawes and Liberties of this Kingdome"; no franchise for women anywhere in the text. Corroboration [Tier A]: UK Parliament, *Women get the vote*, https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/overview/thevote — "In 1918 the Representation of the People Act was passed which allowed women over the age of 30 who met a property qualification to vote."
**Status:** Confirmed. Note the Act is cited on legislation.gov.uk as "1688" (statute-book year) although conventionally 1689.
**Checked:** 2026-11-21.

## 148 — "What is the name of the famous cricket competition played between England and Australia?" (key: The Ashes)
**Supported claim:** The Ashes is the Test-cricket contest between England and Australia.
**Evidence [Tier A]:** Marylebone Cricket Club (owner of Lord's and of the Ashes urn), *The Ashes*, https://www.lords.org/lords/our-history/the-ashes — standfirst: "How a 'small but special' urn became the symbol of cricket rivalry between England and Australia"; "The term 'Ashes' was first used after England lost to Australia … at The Oval on 29th August 1882."
**Status:** Confirmed. Replace the invented "Ashes Act/Treaty/Agreement" distractors with real contests (e.g. the Ryder Cup is golf; the Rugby Championship is rugby).
**Checked:** 2026-11-21.

## 149 — "What was the biggest source of employment during the 18th century?" (key: Manufacturing)
**Supported claim:** **Not established.** No Tier A source found supports "manufacturing was the biggest source of employment during the 18th century" for the century as a whole.
**Evidence:** None obtained at Tier A. The best available research (University of Cambridge "Economies Past" occupational database, reported 2024) indicates agriculture remained very large and in some regions *grew* during the 18th century — e.g. in Norfolk the male agricultural share rose from 28% to 51% across the century — while nationally the male agricultural share fell from 64% to 42% between 1600 and 1740. These figures are from secondary reporting of that project and were **not** read from an official publication, so they are recorded as context only, not as support.
**Status:** **Unresolved.** The keyed answer is plausible only for the later 18th/early 19th century and for particular regions. Do not publish as an unqualified fact. Recommend replacing the item or restating it as "the Industrial Revolution made manufacturing the dominant employer by the 19th century" *after* a Tier A source is found.
**Checked:** 2026-11-21.

## 150 — "True or False: In 1314, the Scottish led by Robert the Bruce defeated the English at Bannockburn, and Scotland remained unconquered." (key: True)
**Supported claim:** The battle was fought on 23–24 June 1314 and Bruce's forces defeated Edward II's much larger army. "Scotland remained unconquered" is an overstatement.
**Evidence [Tier A]:** Historic Environment Scotland, *Three Things About the Battle of Bannockburn*, https://blog.historicenvironment.scot/2025/06/three-things-about-the-battle-of-bannockburn — "The Battle of Bannockburn took place on 23 – 24 June 1314"; "Bruce's forces overcame the much larger English army. Although the Wars of Independence continued for another fourteen years, this was a decisive blow against Edward II's authority in Scotland."
**Status:** Supported for the date and outcome; the second clause overstates. HES explicitly says the wars continued for 14 more years. Recommend dropping "Scotland remained unconquered".
**Checked:** 2026-11-21.

## 151 — "Which of the following is an example of a criminal offence?" (key: Smoking in public places where it is not allowed)
**Supported claim:** Smoking in a smoke-free place is a statutory criminal offence in England (and equivalent devolved legislation applies elsewhere in the UK).
**Evidence [Tier A]:** *Health Act 2006*, section 7, https://www.legislation.gov.uk/ukpga/2006/28/section/7 — heading: "Offence of smoking in smoke-free place".
**Status:** Confirmed, with jurisdiction scope. The offence applies to *enclosed/substantially enclosed* smoke-free premises and vehicles, not literally every "public place" (e.g. a park is not covered). Phrase the option accordingly.
**Checked:** 2026-11-21.

## 152 — "Which Scottish clan was killed for not taking the oath of loyalty on time?" (key: The MacDonalds of Glencoe)
**Supported claim:** The MacDonalds of Glen Coe were massacred on 13 February 1692 after their chief's oath was taken late (6 January 1692) against a 1 January deadline.
**Evidence [Tier A]:** National Trust for Scotland, *The Glen Coe Massacre*, https://www.nts.org.uk/visit/places/glencoe/the-glencoe-massacre — "Any clan signing the oath before 1 January 1692 would be pardoned"; the chief "was eventually allowed to take the oath on 6 January"; and (Glencoe property page, https://www.nts.org.uk/visit/places/glencoe) "On 13 February 1692, 38 men, women and children of Clan MacDonald were murdered by government soldiers whom they had welcomed into their homes."
**Status:** Confirmed, with two caveats: the massacre was of *members of the clan* (38 killed), not the whole clan; and the political decision to make an example of Glencoe had effectively been taken before the oath was administered, so "because they were late" alone oversimplifies.
**Checked:** 2026-11-21.

## 153 — "Which two issues can devolved administrations pass laws on?" (key: Health. Education)
**Supported claim:** Health and education are devolved (not reserved) matters, so the Scottish Parliament, Senedd and NI Assembly legislate on them.
**Evidence [Tier A]:** *Scotland Act 1998*, Schedule 5 ("Reserved matters"), https://www.legislation.gov.uk/ukpga/1998/46/schedule/5 — the Schedule sets out the reserved matters; neither health nor education appears in it (the Act's structure leaves everything not reserved within devolved competence). Section 29: https://www.legislation.gov.uk/ukpga/1998/46/section/29.
**Status:** Confirmed, but this is negative evidence from one Act. Settlement details differ in Wales and Northern Ireland (e.g. policing and justice are devolved in NI but reserved in Scotland/Wales). State the jurisdiction when teaching it.
**Checked:** 2026-11-21.

## 154 — "The assassination of Archduke Franz Ferdinand of Austria in 1914 led to which war?" (key: The First World War)
**Supported claim:** His assassination on 28 June 1914 triggered the crisis that became the First World War.
**Evidence [Tier A]:** Imperial War Museums, *First World War*, https://www.iwm.org.uk/history/first-world-war — "On 28 June 1914, Archduke Franz Ferdinand, the heir to the Austro-Hungarian throne was assassinated. In the ensuing crisis, Europe's leaders made a series of political, diplomatic and military decisions that turned a localised conflict into a global war."
**Status:** Confirmed as shorthand. It was the trigger, not the sole cause; IWM's wording ("in the ensuing crisis") is the accurate framing. Note he was heir to the Austro-Hungarian throne, not "of Austria" alone.
**Checked:** 2026-11-21.

## 155 — "What is the capital city of Scotland?" (key: Edinburgh)
**Supported claim:** Edinburgh is Scotland's capital.
**Evidence [Tier A]:** Scottish Government, *Edinburgh agglomeration: noise action plan*, https://www.gov.scot/publications/edinburgh-agglomeration-noise-action-plan/pages/6 — "Edinburgh is the Capital city of Scotland with a population of approximately 477,000."
**Status:** Confirmed. Replace the "type of law / royal decree / historical event" distractors with other Scottish cities (Glasgow, Aberdeen, Dundee).
**Checked:** 2026-11-21.

## 156 — "True or False: In 1833, the Emancipation Act abolished slavery throughout the British Empire." (key: True)
**Supported claim:** True only with qualification. The 1833 Act (Royal Assent 28 August 1833) abolished slavery in the British **Colonies** from 1 August 1834, but converted most formerly enslaved people into "apprentice labourers", and it excluded certain territories (the Act's long title covers "the British Colonies"; territories of the East India Company, Ceylon and St Helena were excluded).
**Evidence [Tier A]:** The National Archives, *The 1833 Abolition of Slavery Act and compensation claims*, https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/georgians/1833-abolition-of-slavery-act-and-compensation-claims — "In August 1833, Parliament passed *An Act for the Abolition of Slavery throughout the British Colonies*, converting enslaved people into apprentice labourers and taking steps to protect their work and wellbeing."
**Status:** **Corrected.** "Throughout the British Empire" and "in 1833" are both inaccurate as stated (colonies, from 1834, with apprenticeship and exclusions). legislation.gov.uk has no digitised text for this Act (only a "repealed 19.11.1998" stub), so the Archives page is the primary support.
**Checked:** 2026-11-21.

## 157 — "What was the process called by which Scottish landlords cleared small farms (crofts) to make room for large flocks of sheep and cattle?" (key: The Highland Clearances)
**Supported claim:** The term is "the Highland Clearances"; evictions of crofters by landlords were widespread in that period and were driven by more profitable sheep and cattle farming.
**Evidence [Tier A]:** Scottish Government consultation, *Crofting Consultation 2017*, https://consult.gov.scot/agriculture-and-rural-communities/crofting-consultation-2017/user_uploads/00523679-2.pdf — PDF page 8: "Before this, it was legal to evict any crofter at the landlord's convenience; an event that was widespread during the period known as the Highland Clearances." Corroboration [Tier A]: Scottish Land Commission, *Research Review: concentrated and large-scale land ownership*, https://www.landcommission.gov.scot/downloads/5dd7d807b8768_Research-Review-Concentrated-ownership-final-20190320.pdf — PDF page 8, section 2.1: "The control of a new class of landed gentry in the 18th and 19th centuries resulted in man[y landlords clearing people from the land …]" (sentence continues into sheep and cattle farming).
**Status:** Confirmed for the name. Note "croft" is a specific later landholding term; many cleared tenants were small tenants/tacksmen, not crofters in the modern legal sense.
**Checked:** 2026-11-21.

## 158 — "True or False: The Falkland Islands are a British Overseas Territory and are part of the United Kingdom." (key: False)
**Supported claim:** False. The Falklands are a British Overseas Territory; the UK comprises England, Scotland, Wales and Northern Ireland only.
**Evidence [Tier A]:** GOV.UK, *Falkland Islands (British Overseas Territory) travel advice*, https://www.gov.uk/foreign-travel-advice/falkland-islands — "The Falkland Islands are a British Overseas Territory, so there is no British Embassy…". Corroboration [Tier A]: GOV.UK, *Toponymic guidelines*, https://www.gov.uk/government/publications/toponymic-guidelines/toponymic-guidelines-for-map-and-other-editors-united-kingdom-of-great-britain-and-northern-ireland--2 — "The United Kingdom is a constitutional monarchy consisting of 4 constituent parts: 3 countries: England, Scotland and Wales; 1 province: Northern Ireland".
**Status:** Confirmed. British Overseas Territories are not part of the UK; they have their own constitutions and are not represented in the UK Parliament.
**Checked:** 2026-11-21.

## 159 — "Which two of the following were battles of the English Civil War?" (key: Marston Moor, Naseby)
**Supported claim:** Both were battles of the English Civil War(s): Marston Moor, July 1644; Naseby, June 1645.
**Evidence [Tier A]:** English Heritage, *History of Carlisle Castle*, https://www.english-heritage.org.uk/visit/places/carlisle-castle/history — "the defeat of his main northern army at Marston Moor, in July 1644"; "After the Royalist defeat at the Battle of Naseby in June 1645…". Corroboration [Tier A]: English Heritage, *The English Civil Wars*, https://www.english-heritage.org.uk/learn/histories/the-english-civil-wars-history-and-stories — "The English Civil Wars comprised three wars, which were fought between Charles I and Parliament between 1642 and 1651."
**Status:** Confirmed. Note it is now conventional to speak of the *Civil Wars* (three wars, 1642–1651) rather than one war.
**Checked:** 2026-11-21.

## 160 — "What was the name of the activist group that fought for women's right to vote?" (key: The Suffragettes)
**Supported claim:** The suffragettes campaigned for women's vote, using militant methods; they were one wing of a wider movement that also included the non-militant suffragists.
**Evidence [Tier A]:** UK Parliament, *Women's suffrage* (Living Heritage), https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/ — "These two groups were the 'suffragists' who campaigned using peaceful methods such as lobbying, and the 'suffragettes' who were determined to win the right to vote for women by any means."
**Status:** Confirmed with nuance: "the activist group" implies a single organisation, but the suffragettes were the Women's Social and Political Union (WSPU) and others. Replace the invented "Suffragettes Act/Treaty/Agreement" distractors with suffragists, Chartists, the Anti-Corn Law League.
**Checked:** 2026-11-21.

## 161 — "Which UK landmark was voted Britain's favourite view in 2007?" (key: The Lake District (Wastwater))
**Supported claim:** The view of Wastwater from the south-western end of the lake was voted "Britain's Favourite View" in 2007 by television viewers (an ITV programme).
**Evidence [Tier A]:** Lake District National Park Authority (the statutory park authority), *Explore Wasdale, Wastwater and West Coast*, https://lakedistrict.gov.uk/explore/places-to-go/explore-wasdale-wastwater-and-west-coast — "The view from the south-western end of the lake near the youth hostel was voted Britain's Favourite View in 2007 by television viewers."
**Status:** Confirmed, but it is a **2007 television poll**, not an official designation. Say so; do not present as a current fact. ("Wastwater" is one word in the authority's usage.)
**Checked:** 2026-11-21.

## 162 — "Who were the first people to live in Britain during what is called the Stone Age?" (key: Hunter-gatherers)
**Supported claim:** Stone Age Britain (Palaeolithic/Mesolithic) was populated by hunter-gatherer communities before farming arrived c.4000 BC.
**Evidence [Tier A]:** British Museum, *Prehistoric Britain* (schools resource), https://www.britishmuseum.org/sites/default/files/2019-09/visit-resource_prehistoric-britain-KS2.pdf — PDF pages 4 and 6: "Mesolithic hunter-gatherers moved into southern Scotland around 14,000 BC"; "Farming was introduced to Britain around 4,500 BC. Hunter-gather ways of life continued…". The BM's Stonehenge timeline (HTML, https://www.britishmuseum.org/exhibitions/world-stonehenge/stonehenge-timeline) returned 403 to automated access and could not be quoted.
**Status:** Confirmed broadly. "The first people to live in Britain" spans hundreds of thousands of years (Palaeolithic); "Stone Age = hunter-gatherers" is a simplification, and the Neolithic is also "Stone Age" but farming.
**Checked:** 2026-11-21.

## 163 — "What was the name of the religious movement against the authority of the Pope and the Catholic Church during the reign of Henry VIII?" (key: The Reformation)
**Supported claim:** The Reformation was the 16th-century movement that rejected papal authority; the Church of England broke with Rome under Henry VIII.
**Evidence [Tier A]:** The Church of England, *Our history*, https://www.churchofengland.org/about/history-church-england — "During the Reformation, the Western Church became divided between those who continued to accept Papal authority and those who did not… The Church of England was among the churches that broke with Rome. The catalyst for this decision was the Pope's refusal to annul…"
**Status:** Confirmed. Henry's initial aim was an annulment, and the "Reformation" was a Europe-wide movement, not only an English event.
**Checked:** 2026-11-21.

## 164 — "What do you need to do to apply for a National Insurance number?" (key: Contact the Department for Work and Pensions (DWP))
**Supported claim:** You apply to the National Insurance number service (online or by phone, with identity checks) via GOV.UK. **DWP is not the route named on the current official page.**
**Evidence [Tier A]:** GOV.UK, *Apply for a National Insurance number*, https://www.gov.uk/apply-national-insurance-number — "You can apply for a National Insurance number if you:" followed by the online/phone application route and identity requirements; the page names no DWP contact step.
**Status:** **Corrected / outdated.** The DWP framing reflects older practice; applications are now made through the NINo application service (HMRC/DWP joint service), and the page directs applicants to apply online or by phone. Rewrite the option as "Apply through GOV.UK (online or by phone)".
**Checked:** 2026-11-21.

## 165 — "Which of the following is a major horse racing event in England?" (key: Royal Ascot)
**Supported claim:** Royal Ascot is an annual flat-racing meeting at Ascot Racecourse, Berkshire — but no official page could be loaded to quote.
**Evidence:** None obtained. `https://www.ascot.com/royal-ascot` returned CloudFront "403 ERROR – Request blocked" to plain `curl`, `curl_cffi` (Chrome TLS) **and** the Playwright browser (datacenter IP). `britishhorseracing.com/racecourses/ascot/` returned HTTP 200 but the content is client-rendered and no substantive text was retrievable.
**Status:** **Unresolved.** The claim is not in doubt, but under the evidence standard no Tier A citation exists for it in this run. Re-check from a UK residential connection or accept a Tier B racing-body source with a stated caveat.
**Checked:** 2026-11-21.

## 166 — "How many members form a jury in Scotland?" (key: 15 members)
**Supported claim:** A Scottish criminal jury in solemn proceedings is 15 (it may continue with fewer if jurors die or are discharged); 12 is the England-and-Wales figure.
**Evidence [Tier A]:** *Victims, Witnesses, and Justice Reform (Scotland) Act 2025*, Part 6, https://www.legislation.gov.uk/asp/2025/12/part/6 — s.65 (new s.99A(4)): "in the case of a jury consisting of 14 or 15 jurors, at least 10 of the jurors are so in favour"; s.62 (new s.90(2)): the trial may proceed where "there are at least 12 remaining jurors".
**Status:** Supported. Two caveats: (i) the 2025 Act abolished the "not proven" verdict and changed the majority required to two-thirds — the *size* was kept at 15 after the Stage 2 amendment; (ii) a Scottish *civil* jury is 12, so the stem should say "criminal jury". The 15-member figure is inferred from the majority/quorum provisions rather than a single "shall consist of 15" sentence on the pages read.
**Checked:** 2026-11-21.

## 167 — "What is known as Lent?" (key: The 40 days before Easter)
**Supported claim:** Lent is the 40-day season of preparation before Easter, beginning on Ash Wednesday and **excluding Sundays** from the count.
**Evidence [Tier A]:** The Church of England, *The meaning of Lent and Easter*, https://www.churchofengland.org/faith/lent-holy-week-and-easter/meaning-lent-and-easter — "The season of Lent lasts for forty days (not including Sundays)." Corroboration: *Common questions about Lent and Easter*, https://www.churchofengland.org/node/54/lent-holy-week-and-easter/common-questions-about-lent-and-easter — "Sundays, which always celebrate the resurrection, are excluded from this total of forty."
**Status:** **Corrected.** Because Sundays are excluded, Lent spans about 46 calendar days — it is not "the 40 days immediately before Easter". Rewrite the option as "The 40-day season of fasting and preparation before Easter".
**Checked:** 2026-11-21.

## 168 — "When was the last successful foreign invasion of England?" (key: In 1066 — the Norman Conquest)
**Supported claim:** 1066 is the conventional answer (William of Normandy's invasion and victory at Hastings); the source confirms the invasion date but **not** the "last successful" superlative.
**Evidence [Tier A]:** English Heritage, *1066 and the Norman Conquest*, https://www.english-heritage.org.uk/learn/histories/1066-and-the-norman-conquest/ — "On the morning of 28 September 1066 Duke William of Normandy's invasion fleet arrived off the Sussex coast, and disembarked at Pevensey"; and "The Battle of Hastings … was fought between the armies of Harold Godwinson, King of England, and Duke William of Normandy."
**Status:** Partly supported. The date and the invasion are sourced; "last successful foreign invasion" is a handbook-style claim that depends on definitions (e.g. the 1688 Glorious Revolution, the 1797 Fishguard landing). Present it as "conventionally regarded as", not as a settled fact.
**Checked:** 2026-11-21.

---

## L8 — The role of Parliament (169–192)

## 169 — "World War II started as a result of Germany invading which country?" (key: Poland)
**Supported claim:** Germany invaded Poland on 1 September 1939; Britain and France declared war two days later.
**Evidence [Tier A]:** National Army Museum, *Second World War*, https://www.nam.ac.uk/explore/second-world-war — timeline entry: "The British Empire and France declare war on Germany following its invasion of Poland." (dated 4 September 1939 in the page's chronology).
**Status:** Confirmed as the European trigger. Note the war began in Asia earlier (1937) and the invasion was on 1 September 1939, with declarations on 3 September.
**Checked:** 2026-11-21.

## 170 — "Which flower is associated with Scotland?" (key: The thistle)
**Supported claim:** The thistle is Scotland's national flower/emblem.
**Evidence [Tier A]:** National Trust for Scotland, *The thistle – Scotland's national flower*, https://www.nts.org.uk/stories/the-thistle-scotlands-national-flower — "The thistle is the flower of Scotland and one of its most recognisable symbols. Since King Alexander III, it has been Scotland's national emblem."
**Status:** Confirmed. It is a conventional emblem, not a statutory designation. Replace "thistle Act/Agreement/Treaty" with real alternatives (shamrock, leek, rose).
**Checked:** 2026-11-21.

## 171 — "True or False: Police complaints can only be made by writing to the Chief Constable of the police force involved." (key: False)
**Supported claim:** False. Complaints may be made directly to the force, via an online form, by telephone (101) or in person at a police station; the IOPC also receives them.
**Evidence [Tier A]:** Independent Office for Police Conduct, *A guide to the complaints process*, https://www.policeconduct.gov.uk/complaints/guide-to-complaints-process — "To make a complaint, you can: complain directly to the force or organisation; complete our online form; complete the word or pdf version of our complaints form"; "You can also complain by telephoning 101 or visiting any police station."
**Status:** Confirmed. The explanation's reference to the "Independent Police Complaints Commission" is out of date — the body has been the **IOPC** since 8 January 2018. Complaints about a Chief Constable go to the Police and Crime Commissioner.
**Checked:** 2026-11-21.

## 172 — "Which of the following is a responsibility of the Home Secretary?" (key: Crime)
**Supported claim:** The Home Office, led by the Home Secretary, is the lead department for crime, policing and immigration.
**Evidence [Tier A]:** GOV.UK, *About us — Home Office*, https://www.gov.uk/government/organisations/home-office/about — "The Home Office is the lead government department for immigration and passports, drugs policy, crime, counter-terrorism and police."
**Status:** Confirmed with nuance: the Home Secretary is responsible for policing *policy* and the department's remit; operational policing is independent of ministers, and policing is devolved in Scotland and Northern Ireland. The explanation's advice to "select all three if they appear" is a test-taking tip, not a factual claim.
**Checked:** 2026-11-21.

## 173 — "When is St David's Day celebrated?" (key: 1st of March)
**Supported claim:** St David's Day is 1 March.
**Evidence [Tier A]:** Welsh Government, *Wales to celebrate St David's Day with £1 million fund for community events*, https://www.gov.wales/wales-celebrate-st-davids-day-1-million-fund-community-events — "celebrate the day of Wales' patron saint, Dydd Gwyl Dewi, on 1 March."
**Status:** Confirmed. It is not a bank holiday in Wales.
**Checked:** 2026-11-21.

## 174 — "What happened to Mary, Queen of Scots, after she spent 20 years in prison?" (key: She was executed)
**Supported claim:** She was imprisoned (from 1567 at Lochleven, then in England from 1568) and executed in 1587. The "20 years" is an approximation — about 19 years in English custody (1568–1587).
**Evidence [Tier A]:** Historic Environment Scotland, *Lochleven Castle*, https://www.historicenvironment.scot/visit-a-place/places/lochleven-castle/ — "Mary Queen of Scots was once a guest here, but her former host turned her jailer in 1567… It was here that she suffered a miscarriage and was forced to abdicate in favour of her son, James VI." Execution corroboration: National Records of Scotland, *Open Book: Mary, Queen of Scots (1542-1587)*, https://blog.nrscotland.gov.uk/2017/07/25/mary-queen-of-scots-1542-1587 — "we often focus on the tragedy of her captivity and execution" (page returned 403 to the fetcher; text seen only in a search-result excerpt, so treat as **unverified**).
**Status:** Partly supported. Imprisonment and forced abdication are Tier A sourced; the execution and the 20-year figure are not yet confirmed from a page I could read (the NRS blog blocked automated access; royal.uk and English Heritage's Fotheringhay pages were unavailable/404).
**Checked:** 2026-11-21.

## 175 — "What did Francis Crick discover?" (key: The structure of the DNA molecule)
**Supported claim:** Crick, with James Watson and Maurice Wilkins, was awarded the 1962 Nobel Prize for the molecular structure of nucleic acids (the DNA double helix), using Rosalind Franklin's X-ray data.
**Evidence [Tier A]:** NobelPrize.org, *The Nobel Prize in Physiology or Medicine 1962*, https://www.nobelprize.org/prizes/medicine/1962/summary/ — laureates listed: "Francis Crick", "James Watson", and Maurice Wilkins; Crick's prize share 1/3.
**Status:** Confirmed, with an attribution correction: it was a three-person discovery, and Rosalind Franklin's contribution was central. Avoid "Crick discovered DNA".
**Checked:** 2026-11-21.

## 176 — "True or False: Northern Ireland and Scotland have their own banknotes, which are valid everywhere in the UK." (key: True)
**Supported claim:** Six banks in Scotland and Northern Ireland issue their own banknotes, which circulate alongside Bank of England notes across the UK. They are **not legal tender in England and Wales**, and acceptance is a matter for the payee.
**Evidence [Tier A]:** Bank of England, *Scottish and Northern Ireland banknotes*, https://www.bankofengland.co.uk/banknotes/scottish-and-northern-ireland-banknotes — "Only the Bank of England issues banknotes in England and Wales, but six banks in Scotland and Northern Ireland can also issue banknotes"; "The six Scottish and Northern Ireland banks must, by law, set aside assets that are worth at least the value of all of the banknotes they have in circulation."
**Status:** **Ambiguous as worded.** "Valid everywhere" conflates three things: they are genuine sterling notes, they circulate UK-wide, but they are not legal tender in England and Wales (and no banknote is legal tender in Scotland). The BoE page does not itself use "legal tender", so that part of the correction is not quoted from a page read in this run. Rewrite the item to test the legal-tender distinction.
**Checked:** 2026-11-21.

## 177 — "How many national parks are there in England, Wales, and Scotland?" (key: 15)
**Supported claim:** 15 (10 England, 3 Wales, 2 Scotland) — but only the Scottish figure was verifiable from a Tier A page in this run.
**Evidence [Tier A]:** Scottish Government, *New National Park decision*, https://www.gov.scot/news/new-national-park-decision (29 May 2025) — "Ministers have decided not to pursue a proposal to designate Galloway and Ayrshire as a National Park", with the reporter's recommendation "not to proceed with the designation". Scotland therefore still has two national parks, so the 15 total is unchanged by that decision.
**Status:** **Partly supported.** The count of 2 in Scotland is Tier A; the 10 England / 3 Wales split and the total of 15 were **not** confirmed from an official page (`nationalparks.uk` returned 401 "Security Verification" even in the browser; `gov.uk` collection and Natural Resources Wales pages were 404). Treat the "15" as unverified pending a Natural England / NRW source.
**Checked:** 2026-11-21.

## 178 — "True or False: Northern Ireland is part of Great Britain." (key: False)
**Supported claim:** False. Great Britain = England, Scotland and Wales; the UK = Great Britain + Northern Ireland.
**Evidence [Tier A]:** GOV.UK (with the Permanent Committee on Geographical Names), *Toponymic guidelines for map and other editors*, https://www.gov.uk/government/publications/toponymic-guidelines/toponymic-guidelines-for-map-and-other-editors-united-kingdom-of-great-britain-and-northern-ireland--2 — "Great Britain consists of England, Scotland and Wales. The term is exclusive of Northern Ireland and is therefore not a synonym for the term United Kingdom."
**Status:** Confirmed.
**Checked:** 2026-11-21.

## 179 — "When out for a walk in a public place, which two things must a dog's collar have?" (key: The owner's name and address)
**Supported claim:** In England and Wales a dog in a highway or place of public resort must wear a collar with the owner's name and address (on the collar or on an attached plate/badge).
**Evidence [Tier A]:** *Control of Dogs Order 1992*, article 2(1), https://www.legislation.gov.uk/uksi/1992/901 — "every dog while in a highway or in a place of public resort shall wear a collar with the name and address of the owner inscribed on the collar or on a plate or badge attached to it."
**Status:** Confirmed, with jurisdiction scope (England and Wales; Scotland and NI have their own rules) and the statutory exemptions in article 2(2) (e.g. dogs used for sporting purposes, pack hounds).
**Checked:** 2026-11-21.

## 180 — "Which Christian holiday commemorates the death of Jesus Christ?" (key: Good Friday)
**Supported claim:** Good Friday commemorates the crucifixion and death of Jesus.
**Evidence [Tier A]:** The Church of England, *Fact File: What is Good Friday?*, https://www.churchofengland.org/stories-and-features/fact-file-what-good-friday — "Good Friday is the most sombre day of the Christian calendar when the crucifixion and death of Jesus is commemorated in churches and cathedrals."
**Status:** Confirmed.
**Checked:** 2026-11-21.

## 181 — "A key responsibility of an MP is to represent everyone in their:" (key: Constituency)
**Supported claim:** An MP is elected for a constituency and represents the people in it in the House of Commons.
**Evidence [Tier A]:** UK Parliament, *What do MPs do?*, https://www.parliament.uk/about/mps-and-lords/members/mps/ — "Members of Parliament (MPs) are sent to the House of Commons from every part of the UK to represent local people and ensure they have a voice in national decisions"; "As their representative, an MP is in a position to speak to government officials on behalf of a constituent".
**Status:** Confirmed. "Everyone" means all constituents, including those who did not vote for them.
**Checked:** 2026-11-21.

## 182 — "What was achieved with the Magna Carta?" (key: It restricted the King's power)
**Supported claim:** Magna Carta placed legal limits on royal power, including that free men could not be imprisoned or dispossessed except by lawful judgment.
**Evidence [Tier A]:** *Magna Carta (1297)*, https://www.legislation.gov.uk/aep/Edw1cc1929/25/9 — chapter 29: "NO Freeman shall be taken or imprisoned, or be disseised of his Freehold, or Liberties, or free Customs, or be outlawed, or exiled, or any other wise destroyed; nor will We not pass upon him, nor [condemn him], but by lawful judgment of his equals…"
**Status:** Confirmed, with qualification: the 1215 charter protected particular groups (free men, the Church, barons), not universal rights, and was reissued/revised (1216, 1217, 1225, 1297). "Restricted the King's power" is the correct headline.
**Checked:** 2026-11-21.

## 183 — "True or False: FGM or taking a girl or woman abroad for FGM is illegal in the UK and is a criminal offence." (key: True)
**Supported claim:** True. FGM is a criminal offence, and the Act extends to acts done outside the UK by UK nationals/residents.
**Evidence [Tier A]:** *Female Genital Mutilation Act 2003*, section 1, https://www.legislation.gov.uk/ukpga/2003/31/section/1 — "A person is guilty of an offence if he excises, infibulates or otherwise mutilates the whole or any part of a girl's labia majora, labia minora or clitoris." Section 4, https://www.legislation.gov.uk/ukpga/2003/31/section/4 — "Sections 1 to 3 extend to any act done outside the United Kingdom by a United Kingdom national or … United Kingdom resident."
**Status:** Confirmed. Section 4 as amended (Serious Crime Act 2015) covers extraterritorial acts; section 3A covers assisting a girl to mutilate her own genitalia.
**Checked:** 2026-11-21.

## 184 — "In what year were women first granted the right to vote in the UK?" (key: In 1918)
**Supported claim:** 1918 — but only for women aged 30+ meeting a property qualification; equal franchise with men came in 1928.
**Evidence [Tier A]:** UK Parliament, *Women get the vote*, https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/overview/thevote — "In 1918 the Representation of the People Act was passed which allowed women over the age of 30 who met a property qualification to vote. Although 8.5 million women met this criteria, it was only about two-thirds of the total population of women in the UK."
**Status:** Confirmed with the necessary qualification (some women, not women generally; equal terms in 1928). Note legislation.gov.uk has no digitised text of the 1918 Act, so Parliament's page is the support.
**Checked:** 2026-11-21.

## 185 — "Which two of the following are British Overseas Territories?" (key: Saint Helena; The Falkland Islands)
**Supported claim:** Both are British Overseas Territories.
**Evidence [Tier A]:** GOV.UK, *St Helena, Ascension and Tristan da Cunha travel advice*, https://www.gov.uk/foreign-travel-advice/st-helena-ascension-and-tristan-da-cunha — "St Helena, Ascension and Tristan da Cunha are British Overseas Territories." GOV.UK, *Falkland Islands travel advice*, https://www.gov.uk/foreign-travel-advice/falkland-islands — "The Falkland Islands are a British Overseas Territory".
**Status:** Confirmed. (The GOV.UK publication *The Overseas Territories* landing page was fetched but does not itself list the territories.)
**Checked:** 2026-11-21.

## 186 — "Whom did the English fleet defeat in 1588?" (key: The Spanish Armada)
**Supported claim:** The Spanish Armada was defeated in 1588; English naval action at Gravelines and then weather destroyed the invasion attempt.
**Evidence [Tier A]:** Royal Museums Greenwich, *Elizabeth I and the Spanish Armada*, https://www.rmg.co.uk/stories/royal-history/elizabeth-i-spanish-armada — "On 19 July 1588 the Spanish Armada was sighted off the Lizard in Cornwall"; the fireship attack off Calais on 28 July and the Battle of Gravelines followed.
**Status:** Confirmed, with simplification note: the Armada was broken by English attack *and* by storms; only about 67 of 138 ships returned (RMG research guide).
**Checked:** 2026-11-21.

## 187 — "Who designed the Cenotaph?" (key: Sir Edwin Lutyens)
**Supported claim:** Sir Edwin Lutyens designed the Whitehall Cenotaph (temporary 1919; permanent Portland stone version unveiled 11 November 1920).
**Evidence [Tier A]:** English Heritage, *The Cenotaph*, https://www.english-heritage.org.uk/visit/places/the-cenotaph — "Initially a temporary monument designed by Edwin Lutyens in 1919, the Cenotaph in Whitehall was replaced with the permanent Portland stone memorial and unveiled on Armistice Day, 11 November 1920."
**Status:** Confirmed. (Historic England's list entry 1357354 also says "Designed by Sir Edwin Lutyens" but returned 403 to automated access.)
**Checked:** 2026-11-21.

## 188 — "How often are members of the Welsh Government / Parliament elected?" (key: Every four years)
**Supported claim:** Senedd elections are now on a four-year ordinary cycle (changed from five by the 2024 Act); the Welsh Government is *formed from* the Senedd, not separately elected.
**Evidence [Tier A]:** *Senedd Cymru (Members and Elections) Act 2024*, section 3, https://www.legislation.gov.uk/asc/2024/4/section/3 — "Frequency of ordinary general elections … In section 3(1) (ordinary general elections) of the 2006 Act, for 'fifth' substitute 'fourth'".
**Status:** Confirmed for the ordinary cycle, with two wording fixes: it is the **Senedd** that is elected (not the Welsh Government), and the change applies to ordinary general elections after the transitional provision (the first four-year term follows the 2026 election).
**Checked:** 2026-11-21.

## 189 — "During which period did the Beatles become popular and social laws become liberalised?" (key: The 1960s)
**Supported claim:** The 1960s saw major liberalising legislation (e.g. Abortion Act 1967, Sexual Offences Act 1967). The Beatles' popularity is also a 1960s phenomenon, but **no official source** was found for that half, and the stem implies a causal link that is not established.
**Evidence [Tier A]:** *Abortion Act 1967*, https://www.legislation.gov.uk/ukpga/1967/87 and *Sexual Offences Act 1967*, https://www.legislation.gov.uk/ukpga/1967/60 — both enacted in 1967, part of the decade's social-law reform.
**Status:** Partly supported / causal overclaim. "The 1960s" is right as a period label for the legislation; presenting the Beatles' rise and legal liberalisation as one connected development is not supported by any official source. Recommend rewording to test the decade of the legislation, or drop the Beatles clause.
**Checked:** 2026-11-21.

## 190 — "The Man Booker Prize is awarded in which category?" (key: Literature)
**Supported claim:** The Booker Prize is awarded for a single work of fiction written in English and published in the UK or Ireland — i.e. literature/fiction.
**Evidence [Tier A]:** The Booker Prize Foundation, *The Booker Prize*, https://thebookerprizes.com/the-booker-prize — "Founded in the UK in 1969, the Booker Prize is the world's most significant award for a single work of fiction"; "Each year, the prize is awarded to what is, in the opinion of our judges, the best sustained work of fiction written in English and published in the UK and Ireland."
**Status:** Confirmed, with a name correction: the prize was branded "the Man Booker Prize" only 2002–2019 and has been **"The Booker Prize"** since 2019. The stem's name is out of date.
**Checked:** 2026-11-21.

## 191 — "What sort of election takes place when a Member of Parliament dies or resigns?" (key: A by-election)
**Supported claim:** A vacant Commons seat between general elections is filled by a by-election.
**Evidence [Tier A]:** UK Parliament, *By-elections*, https://www.parliament.uk/about/how/elections-and-voting/by-elections/ — "A UK parliamentary by-election happens when a seat in the House of Commons becomes vacant between general elections."
**Status:** Confirmed. Note MPs do not "resign" in the ordinary sense — they apply for appointment as Crown Steward and Bailiff of the Chiltern Hundreds or of the Manor of Northstead to vacate the seat; and no by-election is held if a general election is imminent.
**Checked:** 2026-11-21.

## 192 — "What is the Turner Prize?" (key: A contemporary art award)
**Supported claim:** The Turner Prize is Tate's annual prize for contemporary art, founded 1984.
**Evidence [Tier A]:** Tate, *The Turner Prize*, https://www.tate.org.uk/art/turner-prize — "The prize was first awarded in 1984… They formed to encourage wider interest in contemporary art"; "The prestigious prize for contemporary art returns to Tate Britain".
**Status:** Confirmed. Replace "royal decree / type of law / historical event" with real alternative art prizes (the BP Portrait Award, the John Moores Painting Prize).
**Checked:** 2026-11-21.

---

## Key sources (all Tier A, all accessed 2026-11-21)

- GOV.UK — *Citizenship ceremonies* — https://www.gov.uk/citizenship-ceremonies
- GOV.UK — *Apply for a National Insurance number* — https://www.gov.uk/apply-national-insurance-number
- GOV.UK — *About us — Home Office* — https://www.gov.uk/government/organisations/home-office/about
- GOV.UK — *Falkland Islands (British Overseas Territory) travel advice* — https://www.gov.uk/foreign-travel-advice/falkland-islands
- GOV.UK — *St Helena, Ascension and Tristan da Cunha travel advice* — https://www.gov.uk/foreign-travel-advice/st-helena-ascension-and-tristan-da-cunha
- GOV.UK — *Toponymic guidelines for map and other editors* — https://www.gov.uk/government/publications/toponymic-guidelines/toponymic-guidelines-for-map-and-other-editors-united-kingdom-of-great-britain-and-northern-ireland--2
- legislation.gov.uk — *Bill of Rights [1688]* — https://www.legislation.gov.uk/aep/WillandMarSess2/1/2
- legislation.gov.uk — *Magna Carta (1297)* — https://www.legislation.gov.uk/aep/Edw1cc1929/25/9
- legislation.gov.uk — *Scotland Act 1998*, Sch. 5 — https://www.legislation.gov.uk/ukpga/1998/46/schedule/5
- legislation.gov.uk — *Health Act 2006*, s. 7 — https://www.legislation.gov.uk/ukpga/2006/28/section/7
- legislation.gov.uk — *Control of Dogs Order 1992* — https://www.legislation.gov.uk/uksi/1992/901
- legislation.gov.uk — *Female Genital Mutilation Act 2003*, ss. 1, 4 — https://www.legislation.gov.uk/ukpga/2003/31/section/1 · /section/4
- legislation.gov.uk — *Victims, Witnesses, and Justice Reform (Scotland) Act 2025*, Part 6 — https://www.legislation.gov.uk/asp/2025/12/part/6
- legislation.gov.uk — *Senedd Cymru (Members and Elections) Act 2024*, s. 3 — https://www.legislation.gov.uk/asc/2024/4/section/3
- legislation.gov.uk — *Abortion Act 1967* / *Sexual Offences Act 1967* — https://www.legislation.gov.uk/ukpga/1967/87 · https://www.legislation.gov.uk/ukpga/1967/60
- UK Parliament — *Women get the vote* — https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/overview/thevote
- UK Parliament — *Women's suffrage* — https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/
- UK Parliament — *What do MPs do?* — https://www.parliament.uk/about/mps-and-lords/members/mps/
- UK Parliament — *By-elections* — https://www.parliament.uk/about/how/elections-and-voting/by-elections/
- Scottish Government — *New National Park decision* — https://www.gov.scot/news/new-national-park-decision
- Scottish Government — *Edinburgh agglomeration: noise action plan*, p. 6 — https://www.gov.scot/publications/edinburgh-agglomeration-noise-action-plan/pages/6
- Scottish Government — *Crofting Consultation 2017* (PDF, p. 8) — https://consult.gov.scot/agriculture-and-rural-communities/crofting-consultation-2017/user_uploads/00523679-2.pdf
- Welsh Government — *Wales to celebrate St David's Day…* — https://www.gov.wales/wales-celebrate-st-davids-day-1-million-fund-community-events
- The National Archives — *The 1833 Abolition of Slavery Act and compensation claims* — https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/georgians/1833-abolition-of-slavery-act-and-compensation-claims
- Scottish Land Commission — *Research Review: concentrated land ownership* (PDF, p. 8) — https://www.landcommission.gov.scot/downloads/5dd7d807b8768_Research-Review-Concentrated-ownership-final-20190320.pdf
- Historic Environment Scotland — *Three Things About the Battle of Bannockburn* — https://blog.historicenvironment.scot/2025/06/three-things-about-the-battle-of-bannockburn
- Historic Environment Scotland — *Lochleven Castle* — https://www.historicenvironment.scot/visit-a-place/places/lochleven-castle/
- National Trust for Scotland — *The Glen Coe Massacre* — https://www.nts.org.uk/visit/places/glencoe/the-glencoe-massacre
- National Trust for Scotland — *The thistle – Scotland's national flower* — https://www.nts.org.uk/stories/the-thistle-scotlands-national-flower
- Lake District National Park Authority — *Explore Wasdale, Wastwater and West Coast* — https://lakedistrict.gov.uk/explore/places-to-go/explore-wasdale-wastwater-and-west-coast
- English Heritage — *1066 and the Norman Conquest* — https://www.english-heritage.org.uk/learn/histories/1066-and-the-norman-conquest/
- English Heritage — *The English Civil Wars* — https://www.english-heritage.org.uk/learn/histories/the-english-civil-wars-history-and-stories
- English Heritage — *History of Carlisle Castle* — https://www.english-heritage.org.uk/visit/places/carlisle-castle/history
- English Heritage — *The Cenotaph* — https://www.english-heritage.org.uk/visit/places/the-cenotaph
- Imperial War Museums — *First World War* — https://www.iwm.org.uk/history/first-world-war
- National Army Museum — *Second World War* — https://www.nam.ac.uk/explore/second-world-war
- Royal Museums Greenwich — *Elizabeth I and the Spanish Armada* — https://www.rmg.co.uk/stories/royal-history/elizabeth-i-spanish-armada
- British Museum — *Prehistoric Britain* (schools PDF) — https://www.britishmuseum.org/sites/default/files/2019-09/visit-resource_prehistoric-britain-KS2.pdf
- Marylebone Cricket Club — *The Ashes* — https://www.lords.org/lords/our-history/the-ashes
- Bank of England — *Scottish and Northern Ireland banknotes* — https://www.bankofengland.co.uk/banknotes/scottish-and-northern-ireland-banknotes
- Independent Office for Police Conduct — *A guide to the complaints process* — https://www.policeconduct.gov.uk/complaints/guide-to-complaints-process
- The Church of England — *Our history* — https://www.churchofengland.org/about/history-church-england
- The Church of England — *The meaning of Lent and Easter* — https://www.churchofengland.org/faith/lent-holy-week-and-easter/meaning-lent-and-easter
- The Church of England — *Fact File: What is Good Friday?* — https://www.churchofengland.org/stories-and-features/fact-file-what-good-friday
- Met Office — *Halloween weather extremes* — https://www.metoffice.gov.uk/blog/2026/halloween-weather-extremes-howling-winds-and-bitter-chills
- NobelPrize.org — *The Nobel Prize in Physiology or Medicine 1962* — https://www.nobelprize.org/prizes/medicine/1962/summary/
- Tate — *The Turner Prize* — https://www.tate.org.uk/art/turner-prize
- The Booker Prize Foundation — *The Booker Prize* — https://thebookerprizes.com/the-booker-prize
