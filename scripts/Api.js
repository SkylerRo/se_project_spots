class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
     return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
          headers: {
              authorization: "3515e1ab-2299-4d17-8ccd-400d73cf2a10"
          }
      })
          .then(res => res.json());
  }

  // other methods for working with the API
}

export default Api;
