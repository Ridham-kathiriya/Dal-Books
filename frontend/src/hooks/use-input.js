import { useState } from "react";

const useInput = (validateValue, valueChangeReturn) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [IsTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && IsTouched;

  const valueChangeHandler = (event) => {
    setEnteredValue(valueChangeReturn(event));
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
    setEnteredValue
  };
};

export default useInput;