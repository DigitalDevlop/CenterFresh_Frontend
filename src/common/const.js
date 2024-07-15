import darazVoucher from "../assets/daraz__1000.png";
import darazVoucherNOBG from "../assets/daraz__1000_nobg.png";

var CryptoJS = require("crypto-js");

export const MAIN_API = process.env.REACT_APP_MAIN_API_URL;

export const prizes = [
  {
    id: 1,
    price: "No Prizes",
    color: "#0C9BEF",
    deg: "4300",
    chance: "16%",
    won: false,
    category: null,
    msg: `Oh no! This time wasn't your lucky spin. But don't give up, wonderful prizes are waiting for you!`,
  },
  {
    id: 2,
    price: "Rs.50 /= Reload",
    color: "red",
    deg: "4240",
    chance: "16%",
    won: true,
    category: 'RELOAD-50',
    msg: `Fantastic! You've just won a Rs.50 /= Reload! Enjoy your prize!`,
  },
  {
    id: 3,
    price: "No Prizes",
    color: "#0C9BEF",
    deg: "4180",
    chance: "16%",
    won: false,
    category: null,
    msg: `Oh no! This time wasn't your lucky spin. But don't give up, wonderful prizes are waiting for you!`,
  },
  {
    id: 4,
    price: "Rs.100 /= Reload",
    color: "orange",
    deg: "4120",
    chance: "16%",
    won: true,
    category: 'RELOAD-100',
    msg: `Amazing! You've just won a Rs.100 /= Reload! Enjoy your reward!`,
  },
  {
    id: 5,
    price: "No Prizes",
    color: "#0C9BEF",
    deg: "4060",
    chance: "16%",
    won: false,
    category: null,
    msg: `Oh no! This time wasn't your lucky spin. But don't give up, wonderful prizes are waiting for you!`,
  },
  {
    id: 6,
    price: "Daraz Voucher",
    img: darazVoucherNOBG,
    color: "#FFF1EB",
    deg: "4000",
    chance: "16%",
    won: true,
    category: 'DARAZ',
    msg: `Congratulations! You've won an amazing Daraz Voucher! Happy shopping!`,
  },
];

export function formatPhoneNumber(number) {
  console.log(number);
  if (number.startsWith("7")) {
    number = "0" + number;
  } else if (number.startsWith("94")) {
    number = "0" + number.slice(2);
  } else if (number.startsWith("0")) {
    number = "94" + number.slice(1);
  }

  return number;
}

export const getEncOtp = async (otp) => {
  const secretKey = "centerf";
  const encryptedOTP = CryptoJS.AES.encrypt(otp, secretKey).toString();
  return encryptedOTP
};
