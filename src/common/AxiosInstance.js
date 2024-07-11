import axios from "axios";
import { MAIN_API } from "./const";

// Create an Axios instance with custom configuration, if needed
export const axiosInstance = axios.create({
  baseURL: MAIN_API, // Replace with your API's base URL
  // headers: {
  //   "Content-Type": "application/json",
  //   Authorization: TokenService.getToken()
  //     ? `Bearer ${TokenService.getToken()}`
  //     : "",
  //   // Add any custom headers you need here
  // },
});

axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    // if (response.status === 200) {
    //   // Display CoreUI modal for unauthorized access
    //   // You can customize the modal content and appearance based on your needs
    //   const modal = document.createElement('div');
    //   modal.innerHTML = <TimedOutModal open={true} />

    //   // Append modal to the document body
    //   document.body.appendChild(modal);
    // }

    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
