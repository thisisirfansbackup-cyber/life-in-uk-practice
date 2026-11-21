# Lesson 1 full-question evidence audit

**Checked:** 2026-11-21. **Scope:** source questions 1–24 in `data/source-questions.json`. Questions 25–48 repeat the question wording and intended correct answers, but their option order differs: do not copy numeric answer indexes between lessons.

This is source-verification research, not a content change. Each original stem, all four options, the indexed answer and the explanation were inspected. The recommendations below distinguish **support for a repaired question** from support for the original wording. Proposed alternatives are editorial recommendations, not claims that these are live official test questions.

## Findings at a glance

- **All 24 topics now have directly read official/institutional evidence for the answer or the specifically recommended repair.** This includes a supported citizenship-responsibilities correction for question 1, not verification of its original answer pair.
- **Question 1 / duplicate 25 can be resolved as a corrected select-two about the British citizenship pledge:** observe the UK's laws faithfully and uphold its democratic values. The Home Office's actual guidance, the statutory pledge and an official council ceremony booklet were read. The original family/environment pair remains unverified against official-hosted handbook text; it is not needed for the supported correction.
- Restore genuine **select-two** interaction for **1, 6 and 19**. Do not hide both correct answers in a single combined option.
- **13:** the original universal chief-constable claim is not established. Current IOPC guidance supports a narrower England-and-Wales complaint question, with eligibility and complaints against chief constables treated separately.
- **18:** an hourly fee is one possible arrangement; “usually” and “rather than the nature of the case” are not established.
- **19:** equal airtime is expressly **not** the meaning of due impartiality.
- **24:** forty days **excluding Sundays**, not forty consecutive calendar days.
- **Correction to the previous audit:** `https://www.legislation.gov.uk/aep/WillandMar/1/2` is **not** the Bill of Rights. The correct legislation citation includes **`WillandMarSess2`**: <https://www.legislation.gov.uk/aep/WillandMarSess2/1/2>. The old contents URL alone did not establish the Act's identity.
- GOV.UK's supplied `/jury-service/eligibility` address returned the general jury-service text in this run, without the age condition. Use the actual legislation for age and the guide's root URL for random selection.

## Method and source tiers

**Tier A:** legislation, government, Parliament, regulators, official national-team records, public museums/heritage registers, and a national library's own manuscript catalogue. These are primary authorities for the cited rule, collection or institutional account. **Tier B:** independent community aggregates. **Tier C:** vendor/affiliate material, including an institutional shop when used as a retail page. No Tier C source is sole support for a verified answer.

All URLs cited as evidence below were actually loaded and their relevant text read on **2026-11-21**. Parliament's ordinary HTTP fetch initially returned 403 for some pages; the prescribed smart fetcher with `curl_cffi` successfully loaded the cited Parliament pages. Historic England's Towton entry was read in the Playwright browser after HTTP access failed. Sources are qualitative text evidence, not statistical measurements. Calendar years and ages below are the historical dates or legal thresholds expressly specified by the source; no estimated ranges are substituted.

## 1 / L2 25 — Responsibilities of residents and citizens

**Original:** “What are two responsibilities that you have as a British citizen or a permanent resident of the UK?”

**Options, in source order:** “A royal decree”; “To look after the area in which you live and the environment.  To look after yourself and your family”; “A historical event”; “A type of law”. **Indexed answer:** second option.

**Assessment after the focused follow-up:** **Resolved through a supported correction; retain genuine select-two.** The exact original family/environment pair remains unverified against an accessible official-hosted handbook passage. However, the permitted correction can preserve the lesson's citizenship-responsibilities subject by asking about two commitments explicitly included in the British citizenship pledge. This is not a claim that all permanent residents take that pledge, or that every civic expectation is a statutory duty.

**Official sources actually read:**

1. [Tier A] Home Office/GOV.UK, *Citizenship ceremonies: guidance notes (English and Welsh)* — <https://www.gov.uk/government/publications/british-citizenship-successful-applicants/citizenship-ceremonies-guidance-notes-english-and-welsh>. **Locator:** “What will happen at the ceremony?” → “English version” → **“Pledge”**. **Full pledge:** “I will give my loyalty to the United Kingdom and respect its rights and freedoms. I will uphold its democratic values. I will observe its laws faithfully and fulfil my duties and obligations as a British citizen.” **Checked:** 2026-11-21; the complete guidance page and pledge were loaded/read, not inferred from search snippets.
2. [Tier A] Legislation.gov.uk, *British Nationality Act 1981*, Schedule 5 — <https://www.legislation.gov.uk/ukpga/1981/61/schedule/5>. **Locator:** **paragraph 1**, form of citizenship oath and pledge for registration or naturalisation as a British citizen; the **pledge**, not the oath or the overseas-territories paragraph. **Quote:** “I will uphold its democratic values. I will observe its laws faithfully and fulfil my duties and obligations as a British citizen.” **Checked:** 2026-11-21; the schedule's actual text was read with the smart fetcher. This supplies the statutory wording of the pledge, not a general legal duty newly attributed to every resident.
3. [Tier A] Nottinghamshire County Council, *A guide to your citizenship ceremony* — <https://www.nottinghamshire.gov.uk/media/5079508/cz-group-a-guide-to-your-citizenship-ceremony.pdf>. **Locator:** **PDF page 2 of 2**, pledge text following “The oath of allegiance”, also following “The affirmation of allegiance”; booklet marked **Updated January 2023**. **Quote:** “I will uphold its democratic values. I will observe its laws faithfully and fulfil my duties and obligations as a British citizen.” **Checked:** 2026-11-21; PDF downloaded, relevant page extracted and read. The council independently publishes the same ceremony commitments; this corroborates the official wording rather than supplying a different rule.

**Concrete supported replacement for source 1 and duplicate 25:**

- **Question:** “Which TWO commitments are included in the British citizenship pledge? Select two.”
- **Choice A — correct:** “Observe the United Kingdom's laws faithfully.”
- **Choice B — incorrect:** “Always support the political party in government.”
- **Choice C — correct:** “Uphold the United Kingdom's democratic values.”
- **Choice D — incorrect:** “Adopt a particular religion.”
- **Answer type:** multiple; require **exactly A and C**, not one combined option.
- **Explanation:** “The British citizenship pledge includes promises to uphold the UK's democratic values and observe its laws faithfully. It does not include a promise to support a governing political party or adopt a particular religion.”
- **Suggested verification status:** **corrected**, with the Home Office “English version → Pledge” and Schedule 5 paragraph 1 as sources, `checkedAt: 2026-11-21`. Both correct choices are direct paraphrases of the source. The two distractors are absent from the complete pledge actually read, not purported legal requirements.

**Scope and limits:** this correction teaches civic commitments made in the **British citizenship pledge**. Do not append “all citizens and permanent residents must make these promises”: the Home Office distinguishes adult applicants from children and this audit does not assert universal ceremony attendance. Nor does the source establish that everyone owes income tax, that everyone must vote, that all residents must have a religion, or that there is a blanket legal obligation to care for every family member. No tax or care-duty claim is used.

**Original-pair blocker, no longer a blocker to a corrected question:** no accessible official-hosted handbook passage confirming “look after yourself and your family” plus “look after your local area and the environment” was located. The earlier publisher pages establish only the official learning products' existence; they did not expose that text. Do not mark the original pair verified, but the responsibility/commitment correction above is supported without buying or accessing the paid handbook.

## 2 / L2 26 — Big Ben

**Original:** “Where is Big Ben located?”

**Options:** “In London”; “In Scotland”; “In Wales”; “At the Houses of Parliament”. **Indexed answer:** fourth option.

**Assessment:** **Answer supported, original single-answer question ambiguous.** Both “In London” and “At the Houses of Parliament” are true. Big Ben is the Great Bell; the tower is Elizabeth Tower.

**Evidence:**

1. [Tier A] UK Parliament, *Facts and figures: Big Ben and Elizabeth Tower* — <https://www.parliament.uk/about/living-heritage/building/palace/big-ben/facts-figures/>. **Locator:** “The Elizabeth Tower”. **Quote:** “334 steps to the Belfry where Big Ben, the Great Bell, hangs.” **Checked:** 2026-11-21.
2. [Tier A] UK Parliament, *Big Ben tours* — <https://www.parliament.uk/visiting/visiting-and-tours/big-ben-tour/>. **Locator:** introduction and “About the tour”. **Quotes:** “explore the famous Elizabeth Tower at UK Parliament”; “the belfry where Big Ben, the Great Bell, hangs.” **Checked:** 2026-11-21.

**Recommended question:** “In which tower at the Houses of Parliament does Big Ben, the Great Bell, hang?” **Single answer:** “Elizabeth Tower”. Other options: “Victoria Tower”; “The White Tower”; “The Round Tower”. Alternatively retain the Houses of Parliament answer by asking which landmark houses Big Ben and removing London as an overlapping distractor.

## 3 / L2 27 — Equal voting age

**Original:** “When were men and women given the right to vote at the age of 21?”

**Options:** “In 1973”; “1928”; “In 1948”; “In 1979”. **Indexed answer:** second option.

**Assessment:** **1928 verified; clarify that this equalised women's parliamentary voting rights with men's.** The original wording can imply men first acquired the vote at 21 in 1928.

**Evidence:**

1. [Tier A] UK Parliament/Parliamentary Archives, *1928 Equal Franchise Act* — <https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/case-study-the-right-to-vote/the-right-to-vote/birmingham-and-the-equal-franchise/1928-equal-franchise-act/>. **Locator:** introduction; catalogue `HL/PO/PU/1/1928/18&19G5c12`. **Quote:** “The Equal Franchise Act of 1928 granted equal voting rights to women and men. As a result, both men and women could vote at the age of 21.” **Checked:** 2026-11-21.
2. [Tier A] UK Parliament, *Women get the vote* — <https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/overview/thevote/>. **Locator:** “Representation of the People Act 1918” and “Equal Franchise Act 1928”. **Quote:** the 1918 Act “extended the vote to virtually all men over the age of 21”; women “finally achieved the same voting rights as men” in 1928. **Checked:** 2026-11-21.

**Recommended question:** “In which year did women gain the right to vote in parliamentary elections on the same terms as men, at age 21?” **Single answer:** “1928”. Suggested options: “1918”; “1928”; “1948”; “1969”. Explanation should describe the historical rule, not the current voting age.

## 4 / L2 28 — Geographical location

**Original:** “Where is the UK geographically located?”

**Options:** “In Scotland”; “In the north-west of Europe”; “In Wales”; “In London”. **Indexed answer:** second option.

**Assessment:** **North-west Europe supported.** Existing distractors confuse a country's location with places within it.

**Evidence:**

1. [Tier A] Met Office, *An ‘unprecedented’ El Niño and its implications for the weather forecast* — <https://www.metoffice.gov.uk/blog/2026/an-unprecedented-el-nino-and-its-implications-for-the-weather-forecast>. **Locator:** “What could an unprecedented El Niño mean for the UK?” **Quote:** “NW Europe, including the UK”. **Checked:** 2026-11-21. The geographical inclusion is the only claim taken from this weather article; no forecast assertion is needed for the quiz.

**Recommended question:** “In which part of Europe is the United Kingdom located?” **Single answer:** “North-western Europe”. Other options: “North-eastern Europe”; “South-western Europe”; “South-eastern Europe”.

**Coverage note:** one directly read official source, not two independent geography sources.

## 5 / L2 29 — Scotland's patron saint

**Original:** “Who is the patron saint of Scotland?”

**Options:** “St Andrew”; “A famous monarch”; “A military commander”; “A religious leader”. **Indexed answer:** first option.

**Assessment:** **St Andrew verified.** Broad category distractors are not names and “a religious leader” is not a clean mutually exclusive alternative to a saint.

**Evidence:**

1. [Tier A] Scottish Government, *The spirit of St Andrew* — <https://www.gov.scot/news/the-spirit-of-st-andrew/>. **Locator:** Minister Alasdair Allan's statement. **Quote:** “Our patron saint, St Andrew”. **Checked:** 2026-11-21.

**Recommended question:** retain stem. **Single answer:** “St Andrew”. Other options: “St David”; “St George”; “St Patrick”.

## 6 / L2 30 — Wars of the Roses

**Original:** “Which two houses fought in the Wars of the Roses?”

**Options:** “The House of York and The House of Lancaster Agreement”; “The House of York and The House of Lancaster Treaty”; “The House of York and The House of Lancaster Act”; “The House of York and The House of Lancaster”. **Indexed answer:** fourth option.

**Assessment:** **York and Lancaster verified; restore genuine select-two.** The existing explanation already says both options must be selected, but the source data instead combines both in one option and invents “Agreement/Treaty/Act” distractors.

**Evidence:**

1. [Tier A] Historic England, *Battle of Towton, 1461*, National Heritage List entry `1000040` — <https://historicengland.org.uk/listing/the-list/list-entry/1000040>. **Locator:** historical background, paragraph beginning “The Wars of the Roses”. **Quote:** “a protracted struggle for the Crown between the House of Lancaster (emblem being a red rose) and that of York (white rose).” **Checked:** 2026-11-21. Read in Playwright after HTTP 403.

**Recommended question:** “Which TWO royal houses fought for the English throne in the Wars of the Roses? Select two.” **Multiple answers:** “House of York”; “House of Lancaster”. Other options: “House of Stuart”; “House of Hanover”. Require exactly two selections.

**Access note:** Royal Family's alternative `/yorkists` page returned a browser Cloudflare interstitial and was not used as evidence.

## 7 / L2 31 — Bill of Rights

**Original:** “True or False: The Bill of Rights of 1689 confirmed the right to vote for all adult men.”

**Options:** “Cannot be determined”; “True”; “False”; “Partially false”. **Indexed answer:** third option.

**Assessment:** **False supported.** Convert to actual two-option true/false; the four-option structure and `tf: false` do not match the question.

**Evidence:**

1. [Tier A] UK Parliament/Parliamentary Archives, *Bill of Rights 1689* — <https://www.parliament.uk/about/living-heritage/evolutionofparliament/parliamentaryauthority/revolution/collections1/collections-glorious-revolution/billofrights/>. **Locator:** description of original Act, catalogue `HL/PO/PU/1/1688/1W&Ms2n2`. **Quote:** “The Bill firmly established the principles of frequent parliaments, free elections and freedom of speech within Parliament”. **Checked:** 2026-11-21.
2. [Tier A] Legislation.gov.uk, *Bill of Rights [1688]* — <https://www.legislation.gov.uk/aep/WillandMarSess2/1/2>. **Locator:** declaration under “Freedom of Election”. **Quote:** “That Election of Members of Parlyament ought to be free.” **Checked:** 2026-11-21. The declaration's text was read; it does not extend the franchise to all adult men.
3. [Tier A] UK Parliament, *Women get the vote* — <https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/overview/thevote/>. **Locator:** “Influential consideration” and 1918 Act discussion. **Quote:** “Only 58% of the adult male population was eligible to vote before 1918”; the 1918 Act “extended the vote to virtually all men over the age of 21”. **Checked:** 2026-11-21. The percentage is quoted as Parliament's historical electorate description, not a new calculation.

**Recommended question:** retain the historical claim, optionally “The Bill of Rights of 1689 gave every adult man the right to vote. True or false?” **True/false answer:** “False”. Explain free parliamentary elections versus universal suffrage.

**Citation correction:** the earlier audit's `/aep/WillandMar/1/2` citation instead loaded *Habeas Corpus Suspension Act 1688*. Do not reuse that URL for the Bill of Rights.

## 8 / L2 32 — Cenotaph

**Original:** “What is the Cenotaph?”

**Options:** “A war memorial”; “A historical event”; “A royal decree”; “A type of law”. **Indexed answer:** first option.

**Assessment:** **War memorial verified.**

**Evidence:**

1. [Tier A] Imperial War Museums, *The Cenotaph* — <https://www.iwm.org.uk/history/first-world-war/remembrance/cenotaph>. **Locator:** introductory paragraphs and concluding historical paragraph. **Quotes:** “Cenotaph means 'empty tomb'”; “the Cenotaph now memorialises those who have given their lives in all conflicts since the First World War.” The page description also expressly identifies it as “a war memorial in London, England”. **Checked:** 2026-11-21.

**Recommended question:** “What is the Cenotaph in Whitehall, London?” **Single answer:** “A war memorial”. Other options: “A royal residence”; “An art gallery”; “A cathedral”. Do not say it contains a burial.

## 9 / L2 33 — First female Prime Minister

**Original:** “Who was the first female Prime Minister of the UK?”

**Options:** “Margaret Thatcher”; “Sir Isaac Newton”; “Clement Attlee”; “Oliver Cromwell”. **Indexed answer:** first option.

**Assessment:** **Margaret Thatcher verified.**

**Evidence:**

1. [Tier A] GOV.UK, *History of Baroness Thatcher* — <https://www.gov.uk/government/history/past-prime-ministers/margaret-thatcher>. **Locator:** opening summary; “Dates in office”. **Quote:** “Baroness Margaret Thatcher, the 'Iron Lady', was the first female British Prime Minister”. Dates in office: “1979 to 1990”. **Checked:** 2026-11-21.

**Recommended question:** retain stem. **Single answer:** “Margaret Thatcher”. More coherent distractors: “Theresa May”; “Liz Truss”; “Tony Blair”. The biography expressly supports the “first” distinction, unlike the weaker extract described in the previous audit.

## 10 / L2 34 — Chair of Commons debates

**Original:** “Who chairs the debates at the House of Commons?”

**Options:** “The Speaker Agreement”; “The Speaker Treaty”; “The Speaker Act”; “The Speaker”. **Indexed answer:** fourth option.

**Assessment:** **The Speaker verified.**

**Evidence:**

1. [Tier A] House of Commons Library, *Speakers of the House of Commons and Chairmen and Deputy Chairmen of Ways and Means* — <https://commonslibrary.parliament.uk/research-briefings/sn04637/>. **Locator:** “Speaker of the House of Commons”. **Quote:** “The Speaker of the House of Commons chairs debates in the Commons chamber.” The same paragraph says the Speaker keeps order and calls MPs to speak. **Checked:** 2026-11-21.

**Recommended question:** “Which office-holder chairs debates and keeps order in the House of Commons?” **Single answer:** “The Speaker”. Other options: “The Prime Minister”; “The Lord Speaker”; “The Chancellor of the Exchequer”. Do not add “always” or imply deputies never chair proceedings.

## 11 / L2 35 — 1966 England captain

**Original:** “Who was the captain of the English football team that won the World Cup in 1966?”

**Options:** “Bobby Moore”; “Clarice Cliff”; “William the Conqueror”; “Oliver Cromwell”. **Indexed answer:** first option.

**Assessment:** **Bobby Moore verified.**

**Evidence:**

1. [Tier A] England Football/The Football Association, *England Football legend profile: Bobby Moore* — <https://www.englandfootball.com/england/mens-senior-team/squad/Legends-profiles/Bobby-Moore>. **Locator:** first and fourth profile bullets. **Quotes:** “World Cup-winning captain Bobby Moore”; “Bobby Moore – who lifted the World Cup at Wembley in 1966”. **Checked:** 2026-11-21.

**Recommended question:** “Who captained England when they won the men's football World Cup in 1966?” **Single answer:** “Bobby Moore”. Other options: “Bobby Charlton”; “Geoff Hurst”; “Gordon Banks”. Avoid implying this was a UK-wide national team.

## 12 / L2 36 — Spanish Armada

**Original:** “When did the English defeat the Spanish Armada?”

**Options:** “1588”; “In 1603”; “In 1605”; “In 1534”. **Indexed answer:** first option.

**Assessment:** **1588 verified.**

**Evidence:**

1. [Tier A] Royal Museums Greenwich/National Maritime Museum, *Research guide P3: Charts of the Spanish Armada by Robert Adams in the Museum* — <https://www.rmg.co.uk/collections/research-guides/research-guide-p3-charts-spanish-armada-robert-adams-museum>. **Locator:** “History of the Spanish Armada”, opening sentence. **Quote:** “The defeat in the Channel of the mighty Spanish Armada by an English fleet in 1588”. **Checked:** 2026-11-21.

**Recommended question:** “In which year was the Spanish Armada defeated?” **Single answer:** “1588”. Retain other year distractors but remove inconsistent “In” prefixes. Explain that battle and weather both contributed; do not claim every Spanish ship was sunk.

## 13 / L2 37 — Police complaints

**Original:** “True or False: Anyone can make a complaint about the police by writing to the chief constable of the police force involved.”

**Options:** “Cannot be determined”; “True”; “False”; “Partially true”. **Indexed answer:** second option.

**Assessment:** **Original universal claim not verified; replace rather than mechanically mark it true or false.** “Anyone” is not a reason a proposition is true. Eligibility, type of complaint, jurisdiction and who is complained about matter. Evidence for making a written complaint to a force does not by itself verify the exact chief-constable addressee as a universal UK route.

**Evidence:**

1. [Tier A] Independent Office for Police Conduct, *A guide to the complaints process* — <https://www.policeconduct.gov.uk/complaints/guide-to-complaints-process>. **Locator:** “Making a complaint”. **Quotes:** “complain directly to the force or organisation”; “complete the word or pdf version of our complaints form”; “You can also complain by telephoning 101 or visiting any police station.” The eligibility list covers experiencing, witnessing or being negatively affected by relevant behaviour, plus authorised representatives. **Checked:** 2026-11-21.
2. [Tier A] IOPC, *Submit a complaint* — <https://www.policeconduct.gov.uk/complaints/submit-a-complaint>. **Locator:** “Complaints form”. **Quotes:** “If you would prefer to send your complaint by email or in writing, please use the word or pdf version of our complaints form”; “To make a complaint about a Chief Constable, please contact the corresponding Police and Crime Commissioner (PCC).” The page cautions that concerns based only on news/social media may not qualify for processing. **Checked:** 2026-11-21.

**Recommended true/false question:** “In England and Wales, you can make a complaint directly to the police force involved if you have experienced inappropriate behaviour by one of its officers. True or false?” **Answer:** “True”. Exactly two options: “True”; “False”. Explanation: direct-force and IOPC-form routes exist; the relevant complaint must meet applicable eligibility requirements. The IOPC is not the single UK-wide complaints body.

**Unverified:** the original exact “anyone ... writing to the chief constable” statement. Do not cite IOPC evidence as though it expressly states that formulation. The recommendation is a supported correction, not confirmation of that formulation.

## 14 / L2 38 — Minimum jury age

**Original:** “What is the minimum age required to serve on a jury?”

**Options:** “15 years old”; “25 years old”; “21 years old”; “18 years old”. **Indexed answer:** fourth option.

**Assessment:** **18 verified for England and Wales using legislation; scope the question accordingly.** This audit does not separately verify Scottish and Northern Irish age provisions.

**Evidence:**

1. [Tier A] Legislation.gov.uk, *Juries Act 1974*, section 1 — <https://www.legislation.gov.uk/ukpga/1974/23/section/1>. **Locator:** section 1(1)(a), latest available revised text. **Quote:** “registered as a parliamentary or local government elector ... and aged eighteen or over but under seventy six”. **Checked:** 2026-11-21.

**Recommended question:** “What is the minimum age for jury service in England and Wales?” **Single answer:** “18 years old”. Other options: “16 years old”; “21 years old”; “25 years old”. Being 18 is not the only eligibility requirement.

**Reusable-source correction:** `/jury-service/eligibility` did not supply the age rule in the page actually returned; use the Act.

## 15 / L2 39 — Jury selection

**Original:** “How is a jury selected?”

**Options:** “Cannot be determined”; “All of the above”; “Randomly from the electoral register”; “None of the above”. **Indexed answer:** third option.

**Assessment:** **Random selection from the electoral register verified for the England-and-Wales guide.**

**Evidence:**

1. [Tier A] GOV.UK, *Jury service* — <https://www.gov.uk/jury-service>. **Locator:** “How jury service works”. **Quote:** “Your name was chosen randomly from the electoral register.” The guide expressly notes different rules for Scotland and Northern Ireland. **Checked:** 2026-11-21.

**Recommended question:** “How are people initially selected for jury service in England and Wales?” **Single answer:** “Randomly from the electoral register”. Other options: “By applying for the role”; “By the local council leader”; “By the police selecting volunteers”. “Initially” avoids implying no later eligibility checks or excusals.

## 16 / L2 40 — Bank holidays

**Original:** “What is a bank holiday?”

**Options:** “A public holiday when banks and many other businesses are closed for the day”; “A royal decree”; “A type of law”; “A historical event”. **Indexed answer:** first option.

**Assessment:** **Ordinary closure description supported, but avoid guaranteed closure or paid leave for everyone.** Official Northern Ireland guidance distinguishes statutory bank holidays from public holidays arising through custom.

**Evidence:**

1. [Tier A] nidirect, *Bank holidays* — <https://www.nidirect.gov.uk/articles/bank-holidays>. **Locator:** opening paragraph and “Time off for employees”. **Quotes:** “Banks and many other businesses close on bank holidays”; “You don't have a legal right to paid leave on bank and public holidays”. **Checked:** 2026-11-21.
2. [Tier A] GOV.UK, *UK bank holidays* — <https://www.gov.uk/bank-holidays>. **Locator:** note following holiday lists. **Quote:** “Your employer does not have to give you paid leave on bank or public holidays.” **Checked:** 2026-11-21.

**Recommended question:** “Which statement best describes a bank holiday?” **Single answer:** “A day on which banks and many other businesses normally close”. Other options: “A compulsory paid day off for every worker”; “A day when every shop must close”; “A holiday taken only by bank employees”. Explanation should explicitly avoid universal closure/leave claims.

## 17 / L2 41 — Poll cards

**Original:** “What will you be given to vote before a general election takes place?”

**Options:** “A poll card”; “A historical event”; “A type of law”; “A royal decree”. **Indexed answer:** first option.

**Assessment:** **Poll card verified; wording must not imply it is the ballot paper or a required admission document.**

**Evidence:**

1. [Tier A] GOV.UK, *How to vote: Voting in person* — <https://www.gov.uk/how-to-vote/voting-in-person>. **Locator:** “Your poll card”. **Quotes:** “You’ll be sent a poll card just before an election or referendum telling you when to vote and at which polling station”; “You do not have to take your card with you to vote.” The “When you get to the polling station” section separately describes receiving the ballot paper. **Checked:** 2026-11-21.

**Recommended question:** “What are registered voters sent before an election to tell them when and where to vote in person?” **Single answer:** “A poll card”. Other options: “A passport”; “A jury summons”; “A driving licence”. Explain that the card itself is not needed to vote and is not the ballot paper.

## 18 / L2 42 — Solicitors' charges

**Original:** “Which statement about solicitors is correct?”

**Options:** “All of the above”; “Cannot be determined”; “Solicitors usually charge based on how much time is spent on a case”; “None of the above”. **Indexed answer:** third option.

**Assessment:** **Hourly charging is verified as one arrangement; “usually” is not verified.** The explanation “rather than the importance or nature of the case” is unsupported and should be removed. The present source is consumer guidance for SRA-regulated services, not a quantitative study of every UK solicitor.

**Evidence:**

1. [Tier A] Solicitors Regulation Authority, *Understanding costs* — <https://www.sra.org.uk/consumers/instructing/costs-legal-aid/>. **Locator:** “Instructing a solicitor” → “Information your solicitor should give you”. **Quotes:** “There are many different types of work that lawyers do, as well as many different fee arrangements”; costs may be given “as a fixed fee”, “as an estimate of the amount expected”, or “as an hourly rate with an indication of how many hours are likely to be needed.” **Checked:** 2026-11-21.

**Recommended question:** “Which statement about the fees of an SRA-regulated solicitor is correct?” **Single answer:** “They may charge an hourly rate or agree a fixed fee”. Other options: “They must always work free of charge”; “Every case has the same fixed price”; “They may never explain how their fees are calculated”.

**Alternative retaining the time concept:** “When a solicitor charges an hourly rate, what affects the time-based part of the bill?” → “The amount of time spent on the work”. Do not quantify how common this is.

**Unverified:** the prevalence claim “usually”, any universal UK-wide fee method, or a claim that subject matter never affects cost.

## 19 / L2 43 — Election broadcasting

**Original:** “By law, which two types of media have to give balanced coverage to all political parties and equal time to rival viewpoints before an election?”

**Options:** “Radio”; “Internet”; “Newspapers”; “Television and Radio”. **Indexed answer:** fourth option.

**Assessment:** **Material correction required.** Television and radio broadcasting are the intended two media, but “equal time to rival viewpoints” is expressly wrong as a blanket account of due impartiality. “Radio” is also an independently true option alongside the combined intended answer. Restore select-two and avoid treating all internet material as one unregulated class: the Code also discusses BBC on-demand services.

**Evidence:**

1. [Tier A] Ofcom, *Section five: Due impartiality and due accuracy* — <https://www.ofcom.org.uk/tv-radio-and-on-demand/broadcast-standards/section-five-due-impartiality-accuracy>. **Locator:** “Meaning of ‘due impartiality’”; rules 5.1 and 5.5, with service-scope notes. **Quote:** “‘due impartiality’ does not mean an equal division of time has to be given to every view”. The scope notes explicitly name television and radio services. **Checked:** 2026-11-21.
2. [Tier A] Ofcom, *Section six: Elections and referendums* — <https://www.ofcom.org.uk/tv-radio-and-on-demand/broadcast-standards/section-six-elections-referendums>. **Locator:** rules 6.1–6.2 and definition of election period. **Quotes:** “The rules in Section Five ... apply to the coverage of elections and referendums”; “Due weight must be given to the coverage of parties and independent candidates during the election period”; broadcasters must consider “evidence of past electoral support and/or current support”. **Checked:** 2026-11-21.

**Recommended question:** “Which TWO broadcast media must follow Ofcom's due-impartiality rules when covering elections? Select two.” **Multiple answers:** “Television”; “Radio”. Other options: “Printed newspapers”; “Printed leaflets”. Require exactly two independent choices.

**Recommended explanation:** Television and radio election coverage must meet due-impartiality requirements, with due weight for parties and independent candidates. This does **not** require every viewpoint or party to receive identical airtime. The normal election-period rules have a defined period, not an unlimited “before an election”.

## 20 / L2 44 — Crown Dependencies

**Original:** “Which territory is a Crown dependency but is not part of the UK?”

**Options:** “The Channel Islands (or Isle of Man) Treaty”; “The Channel Islands (or Isle of Man)”; “The Channel Islands (or Isle of Man) Agreement”; “The Channel Islands (or Isle of Man) Act”. **Indexed answer:** second option.

**Assessment:** **Underlying distinction verified; singular stem and bundled answer need repair.** The Crown Dependencies are the Bailiwicks of Jersey and Guernsey and the Isle of Man. Do not describe the Channel Islands collectively as one single Crown Dependency.

**Evidence:**

1. [Tier A] Ministry of Justice/GOV.UK, *Crown Dependencies: Jersey, Guernsey and the Isle of Man* — <https://www.gov.uk/government/publications/crown-dependencies-jersey-guernsey-and-the-isle-of-man>. **Locator:** “Details” → “Crown Dependencies”. **Quotes:** “The Crown Dependencies are the Bailiwick of Jersey, the Bailiwick of Guernsey ... and the Isle of Man”; “The Crown Dependencies are not part of the UK but are self-governing dependencies of the Crown.” **Checked:** 2026-11-21. Other paragraphs retain outdated Queen/Her Majesty terminology; those were not used to teach the current monarch.

**Recommended question:** “Which of these is a Crown Dependency and is not part of the United Kingdom?” **Single answer:** “The Isle of Man”. Other options: “England”; “Scotland”; “Wales”. These preserve one unambiguous correct territory without fake treaty/act names.

## 21 / L2 45 — Frank Whittle

**Original:** “What did Sir Frank Whittle invent in the 1930s?”

**Options:** “The jet engine”; “The jet engine Treaty”; “The jet engine Agreement”; “The jet engine Act”. **Indexed answer:** first option.

**Assessment:** **Whittle's turbojet patent in 1930 verified.** Prefer precise patented invention wording over implying sole worldwide invention of every form of jet engine.

**Evidence:**

1. [Tier A] Ministry of Defence/Central Flying School, *AP3456 Manual of Flying, Volume 3: Propulsion* — <https://assets.publishing.service.gov.uk/media/5e18909040f0b65dc1918760/Volume_03_Propulsion.pdf>. **Locator:** chapter 4 “Gas Turbine Theory”, “Introduction”, paragraph 1; printed chapter page `3-4`, page 1 of 9; **PDF page 25**. **Quote:** “On the 16th January 1930, Sir Frank Whittle filed British patent no 347 206 for the first practical turbojet”. The same paragraph says Britain's first successful jet-powered aircraft flew in 1941 with Whittle's W1 engine and mentions an earlier German jet-powered flight in 1939. **Checked:** 2026-11-21; PDF downloaded and relevant page extracted/read.

**Recommended question:** “Which type of engine did Sir Frank Whittle patent in 1930?” **Single answer:** “A turbojet engine”. Other options: “A steam engine”; “A diesel engine”; “An electric motor”. If retaining “jet engine” for simple language, explain it as Whittle's turbojet development, without a sole-inventor assertion.

## 22 / L2 46 — Daffodils

**Original:** “Who wrote Daffodils?”

**Options:** “Tony Blair”; “Bonnie Prince Charlie”; “William Wordsworth”; “Isambard Kingdom Brunel”. **Indexed answer:** third option.

**Assessment:** **William Wordsworth verified through the British Library's own manuscript metadata.**

**Evidence:**

1. [Tier A] British Library Archives and Manuscripts Catalogue, *Songs and instrumental music by Muriel Herbert*, `MS Mus. 1724/1` — <https://searcharchives.bl.uk/catalog/040-001045518>. **Locator:** “Scope & Content”, **ff. 63–66**. **Quote:** “‘The Daffodils’, words by William Wordsworth; 1916.” **Checked:** 2026-11-21. The 1916 date identifies Herbert's musical setting, **not** the poem's composition date. Note that the search snippet appeared to associate the following folios with this entry; the full catalogue was read and confirms ff. 63–66.
2. [Tier C, institutional shop; supplementary only] British Library Shop, *‘I wandered lonely as a cloud’ or ‘Daffodils’ Print* — <https://shop.bl.uk/products/pod13813>. **Locator:** product description, “Creator” and “Shelfmark”. **Quotes:** “William Wordsworth's famous poem 'I wandered lonely as a cloud' also known as 'Daffodils'”; “Creator: William Wordsworth”; “Shelfmark: Add. 47864, f.80.” **Checked:** 2026-11-21. Do not reuse this retail description's parenthetical 1802 as a verified composition/publication date.

**Recommended question:** “Who wrote the poem ‘Daffodils’, also known as ‘I wandered lonely as a cloud’?” **Single answer:** “William Wordsworth”. Other options: “William Shakespeare”; “Robert Burns”; “Geoffrey Chaucer”. No poem date is required.

**Access note:** Wordsworth Grasmere's `/daffodils/` returned HTTP 403; Playwright reached a “Security Verification” page (401), not the article. Its `/wordsworth/the-poetry/` path also failed HTTP fetching. Search snippets from those pages are not represented here as successfully read primary evidence.

## 23 / L2 47 — Lord Protector

**Original:** “Who was given the title of Lord Protector?”

**Options:** “Florence Nightingale”; “Charles I”; “Oliver Cromwell”; “Charles II”. **Indexed answer:** third option.

**Assessment:** **Oliver Cromwell verified, but the title alone is not unique across all British history.** Date the question to the intended appointment rather than implying nobody else ever held it.

**Evidence:**

1. [Tier A] UK Parliament, *The Rump dissolved* — <https://www.parliament.uk/about/living-heritage/evolutionofparliament/parliamentaryauthority/civilwar/overview/rump-dissolved/>. **Locator:** “Lord Protector Cromwell”, concluding paragraph. **Quote:** “On 16 December 1653 Cromwell, the ‘single person’ intended, was installed as Lord Protector of the realm.” **Checked:** 2026-11-21.

**Recommended question:** “Who became Lord Protector in 1653?” **Single answer:** “Oliver Cromwell”. Other options: “Charles I”; “Charles II”; “William III”. The supplied answer can be retained, with the date resolving the broad-title issue.

## 24 / L2 48 — Lent

**Original:** “What are the 40 days before Easter called?”

**Options:** “A type of law”; “Lent”; “A historical event”; “A royal decree”. **Indexed answer:** second option.

**Assessment:** **Lent verified with an essential counting qualification.** The forty-day total excludes Sundays in the Church of England's explanation, so the original question should not teach forty consecutive calendar days immediately preceding Easter.

**Evidence:**

1. [Tier A] Church of England, *The meaning of Lent and Easter* — <https://www.churchofengland.org/faith/lent-holy-week-and-easter/meaning-lent-and-easter>. **Locator:** introductory Lent paragraphs and Ash Wednesday paragraph. **Quotes:** “The season of Lent lasts for forty days (not including Sundays)”; “It is a time when Christians reflect and prepare for the Easter celebrations”; “Ash Wednesday is the first day of Lent.” **Checked:** 2026-11-21.

**Recommended question:** “What is the Christian season of preparation for Easter, traditionally lasting forty days excluding Sundays, called?” **Single answer:** “Lent”. Other options: “Advent”; “Christmas”; “Pentecost”. Explanation should preserve the excluding-Sundays qualification and describe the cited Western/Church of England observance, without claiming every Christian tradition calculates its season identically.

## Conflicts, uncertainty and blockers

- **Question 1 follow-up resolved:** the exact original family/environment pair is still not officially verified, but there is no remaining source blocker to the explicitly scoped replacement about two commitments in the British citizenship pledge. The Home Office guidance, British Nationality Act 1981 Schedule 5 paragraph 1, and Nottinghamshire's council ceremony booklet directly support that select-two correction. Do not infer the original unseen handbook text from retail pages or practice sites.
- **Original wording not established:** question 13's unrestricted chief-constable route and question 18's “usually”. The recommended corrections are narrower and supported. Question 19's equal-airtime assertion is contradicted by the regulator.
- **Jurisdiction:** questions 13–15 are recommended with an England-and-Wales scope because that is the evidence actually read, not because this audit establishes different answers elsewhere.
- **Counting:** question 24's forty days exclude Sundays under the cited Church of England explanation.
- **Cross-check coverage:** several simple facts have only one directly read primary institutional source. Same-owner pages can clarify each other but are not independent corroboration. No unsupported claim of two-source verification is made.
- **Access:** ordinary fetch 403s for Parliament were overcome with the smart fetcher's `curl_cffi`. Historic England HTTP 403 was overcome with Playwright. Royal Family `/yorkists` remained a Cloudflare interstitial in Playwright; an official heritage-register source replaced it. Wordsworth Grasmere remained inaccessible through HTTP and a browser verification page; British Library catalogue evidence replaced it.
- **Search:** Tavily advanced search worked initially and then reported `hourly_cap_reached`; on the question 1 follow-up it reported `daily_cap_reached`. Subsequent discovery used the available `websearch` tool. No payment, subscription or user login was initiated. Search snippets alone are not listed as verified supporting passages. The question 1 follow-up directly read GOV.UK guidance, legislation and the council PDF; an additional Parliament ceremony-script page returned 403 and was not needed or used as evidence.
- **Not accessed:** the paid current Home Office handbook/e-learning text. This audit does not claim endorsement of any of the supplied questions by the Home Office.

## Key sources

- [Tier A] Home Office: citizenship ceremonies, English version → Pledge — <https://www.gov.uk/government/publications/british-citizenship-successful-applicants/citizenship-ceremonies-guidance-notes-english-and-welsh>
- [Tier A] British Nationality Act 1981, Schedule 5 paragraph 1 — <https://www.legislation.gov.uk/ukpga/1981/61/schedule/5>
- [Tier A] Nottinghamshire County Council: citizenship ceremony booklet, PDF page 2 — <https://www.nottinghamshire.gov.uk/media/5079508/cz-group-a-guide-to-your-citizenship-ceremony.pdf>
- [Tier A] Bill of Rights [1688], correct legislation identifier — <https://www.legislation.gov.uk/aep/WillandMarSess2/1/2>
- [Tier A] IOPC complaints guide — <https://www.policeconduct.gov.uk/complaints/guide-to-complaints-process>
- [Tier A] IOPC complaint submission and chief-constable distinction — <https://www.policeconduct.gov.uk/complaints/submit-a-complaint>
- [Tier A] SRA: Understanding costs — <https://www.sra.org.uk/consumers/instructing/costs-legal-aid/>
- [Tier A] Ofcom: Due impartiality and due accuracy — <https://www.ofcom.org.uk/tv-radio-and-on-demand/broadcast-standards/section-five-due-impartiality-accuracy>
- [Tier A] Ofcom: Elections and referendums — <https://www.ofcom.org.uk/tv-radio-and-on-demand/broadcast-standards/section-six-elections-referendums>
- [Tier A] Church of England: The meaning of Lent and Easter — <https://www.churchofengland.org/faith/lent-holy-week-and-easter/meaning-lent-and-easter>

All key sources checked **2026-11-21**. See each numbered entry for its specific evidence, locator and limits.
