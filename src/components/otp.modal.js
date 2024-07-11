import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import CFPack from "../assets/cf-pack.png";
import TokenService from "../services/TokenService";
import { formatPhoneNumber } from "../common/const";
import OTPInput from "./OtpInput";
import { PlayerService } from "../services/player.service";
import Swal from "sweetalert2";
import LoadingFullscreen from "./LoadingFullscreen";
import { AES } from "crypto-js";

function OTPModal({ open }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const queryParameters = new URLSearchParams(window.location.search);
  const mobile = queryParameters.get("mobile");
  const otpRef = queryParameters.get("otp");
  const [errorMsg, setErrorMsg] = useState(null);
  const [defaultOtp, setDefaultOtp] = useState("");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mobile) {
      setMobileNumber(formatPhoneNumber(mobile));
    }

    if (otpRef) {
      setOtp(otpRef);
      setDefaultOtp(otpRef);
    }
  }, [otpRef]);

  const openOTPModal = (status) => {
    var modal = document.getElementById("otpModal");
    var span = document.getElementsByClassName("close")[0];

    if (status) {
      modal.style.display = "block";
    } else {
      modal.style.display = "none";
    }
  };

  useEffect(() => {
    openOTPModal(open);
  }, [open]);

  const submitOTP = async () => {
    setErrorMsg(null);
    setLoading(false)

    if (!mobileNumber) {
      setErrorMsg(["mobile", "Phone Number is Required"]);
      return;
    }

    if (mobileNumber.length != 10) {
      setErrorMsg(["mobile", "Please Enter Valid Phone Number"]);
      return;
    }

    if (!otp) {
      setErrorMsg(["otp", "OTP Number is Required"]);
      return;
    }

    setLoading(true)

    await PlayerService.login(formatPhoneNumber(mobileNumber), otp)
      .then((res) => {
        if (res.status == "Success" || res.player) {
          TokenService.setUser({ user: res.player, spinned: false });
          window.location.reload(false);
          openOTPModal(false);
          setLoading(false)
        } else {
          setLoading(false)
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      })
      .catch((e) => {
        console.log(e?.response?.data.code)
        setLoading(false)
        if(e?.response?.status == 401) {
          Swal.fire({
            icon:  "error",
            title: "Oops...",
            text: e?.response?.data.code == 101 ? "The OTP you entered is incorrect. Please check the number and try again." : "It seems your OTP has expired. No worries! Just grab a new Centerfresh, scan it, and try again for your chance to win fantastic prizes!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
       
      });

    // TokenService.setUser({ user: { mobile: mobileNumber } });
    // window.location.reload(false);
  };

  return (
    <div id="otpModal" class="modal">
      <LoadingFullscreen loading={loading} message="Please Wait..."/>
      <div class="otp-modal-content animate__animated animate__bounceIn">
        <div className="animate__animated animate__bounceIn animate__slow 1s">
          <div
            style={{
              display: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              className="otp-modal-img animate__animated animate__swing animate__delay-2s animate__slower animate__infinite"
              src={CFPack}
              style={{ display: "absolute" }}
            />
          </div>
        </div>
        <div className="p-4" style={{ textAlign: "left" }}>
          <CRow>
            <CCol>
              <CFormLabel style={{ color: "white", fontWeight: "bold" }}>
                Enter Your Mobile Number
              </CFormLabel>
              <CFormInput
                placeholder="Ex: 07********"
                value={mobileNumber}
                text={
                  <span style={{ color: "#D2042D", fontWeight: "bold" }}>
                    {errorMsg && errorMsg[0] == "mobile" && errorMsg[1]}
                  </span>
                }
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </CCol>
          </CRow>

          <CRow className="mt-4">
            <CCol>
              <CFormLabel style={{ color: "white", fontWeight: "bold" }}>
                Enter OTP Number
              </CFormLabel>
              <OTPInput
                defaultOtp={defaultOtp}
                enteredOTP={(value) => setOtp(value)}
              />
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol style={{ textAlign: "right" }}>
              {/* <CButton
                color="light"
                style={{ widthe: "100%", marginRight: 10 }}
                onClick={() => openOTPModal(false)}
              >
                CANCEL
              </CButton> */}
              <CButton
                color="primary"
                style={{ widthe: "100%" }}
                onClick={submitOTP}
              >
                SUBMIT
              </CButton>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
}

export default OTPModal;
