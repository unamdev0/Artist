import { API } from "../../backend";

export const getProducts = () => {
  return fetch(`${API}products?limit=50`, {
	method: "GET",
	headers: {
		'Accept': 'application/json',
    },
  })
    .then((data) => {
      if (data.error) {
        console.log(data.error);
        return data;
      } else {
        return data.json();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
