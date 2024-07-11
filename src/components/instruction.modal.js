import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import TokenService from "../services/TokenService";

function InstructionModal({ open, setOpen }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const openOTPModal = (status) => {
    var modal = document.getElementById("insModal");
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

  return (
    <div id="insModal" class="modal">
      <div class="logout-modal-content animate__animated animate__bounceIn">
        <div className="p-4" style={{ textAlign: "center" }}>
          <h3>How To Play</h3>
          <div className="ins-content" style={{ textAlign: "left" }}>
            <div className="mt-4">
              1. Locate the spin button in the center of the spinning wheel and
              click the button to start spinning the wheel.
            </div>{" "}
            <div className="pt-2">
              2. Watch as the wheel spins and gradually slows down and once it
              stops, a popup will appear displaying your prize.
            </div>
            <div className="pt-2">
              3. Daraz Voucher: If you win a Rs.1000 Daraz voucher, a voucher
              code will be provided in the popup. Use this code to claim your
              voucher. Do not share this code with anyone & use it before 31st
              September 2024.
            </div>
            <div className="pt-2">
              4. Mobile Reload (Rs.50 or Rs.100): If you win a mobile reload,
              click the "Claim Now" button in the popup to redeem your prize.
            </div>
            <div className="pt-2">
              5. No Prize: If the wheel lands on "No Prizes", better luck next
              time!
            </div>
          </div>
          <div
            className="mt-4"
            style={{ display: "flex", gap: 10, justifyContent: "center" }}
          >
            <CButton
              color="light"
              onClick={() => {
                openOTPModal(false);
                setOpen(false);
              }}
            >
              GOT IT
            </CButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructionModal;
