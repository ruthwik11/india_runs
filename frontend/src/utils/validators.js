/**
 * Validates a complete profile object.
 * @param {object} profile - The user profile
 * @returns {{ isValid: boolean, errors: object }}
 */
export function validateProfile(profile) {
  const errors = {};

  if (!profile.age) {
    errors.age = 'Age range is required';
  }
  if (!profile.income) {
    errors.income = 'Income range is required';
  }
  if (!profile.state) {
    errors.state = 'State is required';
  }
  if (!profile.occupation) {
    errors.occupation = 'Occupation is required';
  }
  if (!profile.family_size || profile.family_size < 1 || profile.family_size > 15) {
    errors.family_size = 'Family size must be between 1 and 15';
  }
  if (profile.has_land === undefined || profile.has_land === null) {
    errors.has_land = 'Land ownership info is required';
  }
  if (profile.has_land && (!profile.land_acres || profile.land_acres <= 0)) {
    errors.land_acres = 'Please enter land area in acres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates a single step in the profile wizard.
 * @param {number} step - The current step index (0-based)
 * @param {object} profile - The user profile
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validateStep(step, profile) {
  switch (step) {
    case 0: // age
      if (!profile.age) return { isValid: false, error: 'Please select your age range' };
      break;
    case 1: // income
      if (!profile.income) return { isValid: false, error: 'Please select your income range' };
      break;
    case 2: // state
      if (!profile.state) return { isValid: false, error: 'Please select your state' };
      break;
    case 3: // occupation
      if (!profile.occupation) return { isValid: false, error: 'Please select your occupation' };
      break;
    case 4: // family_size
      if (!profile.family_size || profile.family_size < 1 || profile.family_size > 15) {
        return { isValid: false, error: 'Family size must be between 1 and 15' };
      }
      break;
    case 5: // land
      if (profile.has_land === undefined || profile.has_land === null) {
        return { isValid: false, error: 'Please indicate if you own land' };
      }
      if (profile.has_land && (!profile.land_acres || profile.land_acres <= 0)) {
        return { isValid: false, error: 'Please enter your land area' };
      }
      break;
    case 6: // review — always valid
      break;
    default:
      break;
  }
  return { isValid: true, error: null };
}
