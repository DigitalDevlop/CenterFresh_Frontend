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

function ClaimMessageModal({ open, setOpen, prize }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const openOTPModal = (status) => {
    var modal = document.getElementById("cmModal");
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
    <div id="cmModal" class="modal">
      <div class="logout-modal-content animate__animated animate__bounceIn">
        <div className="p-4" style={{ textAlign: "center" }}>
          <h3>Successfully Claimed!</h3>
          <div className="ins-content" style={{ textAlign: "left" }}>
            {(prize?.category == "RELOAD-50" ||
              prize?.category == "RELOAD-100") && (
              <div className="mt-4">
                Congratulations! You have successfully claimed your prize. You
                will receive your reload as soon as possible. Enjoy your reward!
              </div>
            )}
            {prize?.category == "DARAZ" && (
              <div className="mt-4">
                Congratulations! You have successfully claimed your prize. You
                will receive your Daraz promo code as soon as possible. Enjoy
                your shopping!
              </div>
            )}
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
                TokenService.removeUser()
                window.location.reload(false)
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

export default ClaimMessageModal;
