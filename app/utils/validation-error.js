const regenerateError = (field = null, value = {}) => {
  let code;
  let message;
  if (field === "RequestError") {
    code = value.code;
    message = `${value.message}.`;
  } else if (field === "MongoError") {
    // handle Mongo errors here
    code = "mongoError";
    /*
      log any MongoDB errors that are not
      - 'duplicate key' errors
    */
    if (value.code !== 11000) {
      console.error("MongoError occured", JSON.stringify(value));
    }
  } else if (field === "CastError") {
    code = "castError";
    message =
      "Request error (Cast error). Please check your submitted data and try again.";
  } else if (value.message === "MaxLength error" && field && value.kind) {
    message = `Sorry, ${field} is too long (maximum ${value.kind} characters).`;
  } else if (value.kind === "required" || value.keyword === "required") {
    if (value.params && value.params.missingProperty) {
      code = "missingPropertyError";
      message = `Please enter ${value.params.missingProperty}.`;
    } else if (
      value.params &&
      value.params.properties &&
      value.params.properties.path
    ) {
      message = `Please enter ${value.params.properties.path}.`;
    } else if (value.path) {
      message = `Please enter ${value.path}.`;
    } else {
      message = "Property is required.";
    }
  } else if (value.message === 'should match format "email"') {
    code = "incorrectEmailError";
    message = "Sorry, incorrect email address.";
  } else if (
    value.message &&
    value.keyword === "minLength" &&
    value.dataPath.toLowerCase().includes("password") &&
    value.params.limit
  ) {
    code = "shortPasswordError";
    message = `Password is too short (minimum ${value.params.limit} characters).`;
  } else if (value.message && value.kind === "unique") {
    code = "duplicateFieldError";
    switch (value.path) {
      case "email":
        message = "This email is already registered to an account.";
        break;
      case "phone":
        message = "This number is already registered to an account.";
        break;
      default:
        message = `${value.message}.`;
    }
  } else if (value.dataPath) {
    const dataPath = value.dataPath
      .split(".")
      .filter((s) => s)
      .join("->");
    if (
      value.keyword === "additionalProperties" &&
      value.params &&
      value.params.additionalProperty
    ) {
      message = `${dataPath} : ${value.message} (${value.params.additionalProperty}).`;
    } else {
      message = `${dataPath} : ${value.message}.`;
    }
  } else if (typeof value.message === "string") {
    message = `${value.message}.`;
  }

  // default error message
  if (!message) {
    message = value;
  }
  if (!code) {
    code = "generalError";
  }
  return { code, message };
};

module.exports = (errors = {}) => {
  const maxErrors = 5;
  const newErrors = [];
  Object.keys(errors).forEach((key) => {
    newErrors.push(regenerateError(key, errors[key]));
  });
  // only send limited amount of errors to avoid huge response payload
  return newErrors.slice(0, maxErrors);
};
