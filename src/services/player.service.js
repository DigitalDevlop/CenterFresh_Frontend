import { axiosInstance } from "../common/AxiosInstance";
import { getEncOtp } from "../common/const";
import { AES, enc } from "crypto-js";

export const PlayerService = {
  login: async (mobile, otp) => {
    try {
      const response = await axiosInstance.post(
        "/login/player/" + mobile + "/" + otp,
        {}
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPrizeConfig: async () => {
    try {
      const response = await axiosInstance.get("/prize-configurations");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  claim: async (id, category, otp) => {
    try {
      const secretKey = "centerf";
      const encryptedOTP = AES.encrypt(`${otp}`, secretKey).toString();
      console.log(encryptedOTP);
      const response = await axiosInstance.post(
        "/player/winner/" + id + "/" + category,
        {
          otp: encryptedOTP,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
