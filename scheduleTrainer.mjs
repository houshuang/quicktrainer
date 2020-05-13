const config = {
  INTERVAL_REPETITION_1: 1,
  INTERVAL_REPETITION_2: 6,
  MIN_EASINESS: 1.3,
  MAX_EASINESS: 20,
  QUALITY_LIMIT_TO_PASS: 4,
  QUALITY_LIMIT_TO_RESET_REPETITION: 3
};

const calculateEasiness = (oldEFactor, quality) => {
  // EF':=EF+(0.1-(5-q)*(0.08+(5-q)*0.02))
  var newEasiness =
    oldEFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEasiness > config.MAX_EASINESS) {
    newEasiness = config.MAX_EASINESS;
  } else if (newEasiness < config.MIN_EASINESS) {
    newEasiness = config.MIN_EASINESS;
  }
  return Number(newEasiness.toFixed(2));
};

const train = input => {
  if (!input) {
    throw new Error("Input data must be defined");
  }
  if (
    input.qualityAssessment === undefined ||
    input.qualityAssessment === null ||
    input.qualityAssessment < 0 ||
    input.qualityAssessment > 5
  ) {
    throw new Error("Quality must be on range [0-5]");
  }
  if (
    input.lastEasinessFactor < config.MIN_EASINESS ||
    input.lastEasinessFactor > config.MAX_EASINESS
  ) {
    throw new Error(
      "Easiness factor must be greater than " +
        config.MIN_EASINESS +
        " and less than " +
        config.MAX_EASINESS
    );
  }
  var newEasiness = input.lastEasinessFactor;
  var nextRepetitionCounter = input.currentRepetition;
  var nextInterval = input.lastInterval;
  var shouldRepeatSession = false;
  newEasiness = calculateEasiness(newEasiness, input.qualityAssessment);
  // setting repetition
  if (input.qualityAssessment < config.QUALITY_LIMIT_TO_RESET_REPETITION) {
    nextRepetitionCounter = 0;
  } else {
    nextRepetitionCounter += 1;
  }
  // setting interval
  if (nextRepetitionCounter === 1) {
    nextInterval = config.INTERVAL_REPETITION_1;
  } else if (nextRepetitionCounter == 2) {
    nextInterval = config.INTERVAL_REPETITION_2;
  } else {
    // interval or repetition ??
    nextInterval = Math.round(nextRepetitionCounter * newEasiness);
  }
  shouldRepeatSession = input.qualityAssessment < config.QUALITY_LIMIT_TO_PASS;
  var result = {
    repetition: nextRepetitionCounter,
    interval: nextInterval,
    easiness: newEasiness,
    repeat: shouldRepeatSession
  };
  return result;
};

export default train;
