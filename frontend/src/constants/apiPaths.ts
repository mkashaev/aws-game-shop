const DEV_API_PATHS = {
  bff: "localhost:3000/dev",
  product: "localhost:3000/dev",
  order: "localhost:3000/dev",
  import: "http://localhost:3000/dev",
  cart: "localhost:3000/dev",
};

const API_PATHS = {
  bff: "https://xyv86z0c28.execute-api.eu-west-1.amazonaws.com/dev",
  product: "",
  order: "",
  import: "https://pltmh72kke.execute-api.eu-west-1.amazonaws.com/dev",
  cart: "",
};

// export default import.meta.env.DEV ? DEV_API_PATHS : API_PATHS;
export default API_PATHS;
