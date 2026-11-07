const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isIsoDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export function validateQuestion(question) {
  const errors = [];

  if (!question || typeof question !== 'object' || Array.isArray(question)) {
    return ['question must be an object'];
  }

  if (!isNonEmptyString(question.id)) errors.push('id must be a non-empty string');
  if (!isNonEmptyString(question.question)) errors.push('question must be a non-empty string');
  if (!isNonEmptyString(question.romanUrdu)) errors.push('romanUrdu must be a non-empty string');

  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    errors.push('choices must contain exactly four entries');
  } else {
    const choiceIds = new Set();
    for (const [index, choice] of question.choices.entries()) {
      if (!choice || typeof choice !== 'object' || Array.isArray(choice)) {
        errors.push(`choices[${index}] must be an object`);
        continue;
      }
      if (!isNonEmptyString(choice.id)) errors.push(`choices[${index}].id must be a non-empty string`);
      if (!isNonEmptyString(choice.text)) errors.push(`choices[${index}].text must be a non-empty string`);
      if (isNonEmptyString(choice.id) && choiceIds.has(choice.id)) errors.push(`choice ID ${choice.id} must be unique`);
      if (isNonEmptyString(choice.id)) choiceIds.add(choice.id);
    }

    if (!Array.isArray(question.correctChoiceIds) || question.correctChoiceIds.length === 0) {
      errors.push('correctChoiceIds must be a non-empty array');
    } else {
      const correctIds = new Set(question.correctChoiceIds);
      if (correctIds.size !== question.correctChoiceIds.length) errors.push('correctChoiceIds must not contain duplicates');
      if (question.correctChoiceIds.some((id) => !choiceIds.has(id))) {
        errors.push('correctChoiceIds must refer to existing choices');
      }
      if (question.answerType === 'single' && correctIds.size !== 1) {
        errors.push('single questions must have exactly one correctChoiceId');
      }
      if (question.answerType === 'select-two' && correctIds.size !== 2) {
        errors.push('select-two questions must have exactly two correctChoiceIds');
      }
    }
  }

  if (!['single', 'select-two'].includes(question.answerType)) {
    errors.push('answerType must be single or select-two');
  }

  if (!Array.isArray(question.lessonNumbers) || question.lessonNumbers.length === 0 ||
      question.lessonNumbers.some((lesson) => !Number.isInteger(lesson) || lesson < 1)) {
    errors.push('lessonNumbers must contain one or more positive integers');
  }

  if (typeof question.explanation !== 'string') errors.push('explanation must be a string');

  if (!Array.isArray(question.sources) || question.sources.length === 0) {
    errors.push('sources must contain at least one official source locator');
  } else {
    for (const [index, source] of question.sources.entries()) {
      if (!source || typeof source !== 'object' || Array.isArray(source)) {
        errors.push(`sources[${index}] must be an object`);
        continue;
      }
      if (!isNonEmptyString(source.title)) errors.push(`sources[${index}].title is required`);
      if (!isNonEmptyString(source.locator)) errors.push(`sources[${index}].locator is required`);
      if (typeof source.url !== 'string' || !/^https:\/\//.test(source.url)) {
        errors.push(`sources[${index}].url must be an HTTPS URL`);
      }
      if (!isIsoDate(source.checkedAt)) {
        errors.push(`sources[${index}].checkedAt must use YYYY-MM-DD`);
      }
    }
  }

  return errors;
}

export function loadQuestionBank(rawData) {
  if (!Array.isArray(rawData)) {
    return { questions: [], errors: ['question bank must be an array'] };
  }

  const errors = [];
  const seenIds = new Set();

  for (const [index, question] of rawData.entries()) {
    const questionErrors = validateQuestion(question);
    for (const error of questionErrors) errors.push(`questions[${index}]: ${error}`);

    if (isNonEmptyString(question?.id)) {
      if (seenIds.has(question.id)) errors.push(`questions[${index}]: duplicate question ID ${question.id}`);
      seenIds.add(question.id);
    }
  }

  return { questions: errors.length === 0 ? rawData : [], errors };
}
