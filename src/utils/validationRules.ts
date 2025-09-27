export const VAL_URL = `${import.meta.env.VITE_BASE_URL}/validations/{type}`;

// Function to parse validation rules
export const parseValidationRules = (ruleString: string) => {
  const rulesArray = ruleString.split("|");
  const parsedRules: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    file?: boolean;
    mimes?: string[];
    maxFileSize?: number; // In KB
  } = {};

  rulesArray.forEach(rule => {
    if (rule === "required") {
      parsedRules.required = true;
    }
    if (rule === "file") {
      parsedRules.file = true;
    }
    if (rule.startsWith("mimes:")) {
      parsedRules.mimes = rule.split(":")[1].split(",");
    }
    if (rule.startsWith("max:")) {
      const value = parseInt(rule.split(":")[1], 10);
      if (parsedRules.file) {
        parsedRules.maxFileSize = value; // This is specific to files
      } else {
        parsedRules.maxLength = value;
      }
    }
    if (rule.startsWith("min:")) {
      parsedRules.minLength = parseInt(rule.split(":")[1], 10);
    }
  });

  return parsedRules;
};

// Example usage
const ruleString = "required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120";
const parsedRules = parseValidationRules(ruleString);
export const ValidationRules = {
  required: 'required',
  file: 'file',
  mimes: 'mimes',
  max: 'max',
  min: 'min',
};

console.log(parsedRules);


export const fetchValidationRules = () => {
  return
}