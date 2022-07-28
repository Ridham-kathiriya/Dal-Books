export const serverInfo = {
  baseUrl: "https://033nm4ea2c.execute-api.us-east-1.amazonaws.com/api",
  users: "/users",
  books: "/books",
  reviews: "/reviews"
};

export const regEx = {
  lettersOnly: /^[a-zA-Z\s]*$/,
  email:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
};

// Handle input changes
export const simpleChangeHandler = (event) => {
  return event.target.value;
};

// Handle changes and only accept alphabets
export const onlyTextChangeHandler = (event) => {
  return event.target.value.replace(/[^a-z]/gi, "");
};

// Handle changes and only accept integers
export const onlyIntegerChangeHandler = (event) => {
  return event.target.value.replace(/[^0-9]/gi, "");
};
