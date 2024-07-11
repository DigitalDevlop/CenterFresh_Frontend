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

function WarnningAttemptsModal({ open, setOpen }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const openOTPModal = (status) => {
    var modal = document.getElementById("wModal");
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
    <div id="wModal" class="modal">
      <div class="logout-modal-content animate__animated animate__bounceIn">
        <div className="p-4" style={{ textAlign: "center" }}>
          <h3>Attempts Exceeded!</h3>
          <div className="ins-content" style={{ textAlign: "left", fontSize: '20px' }}>
            <div className="mt-4">
              Oops! It looks like you've reached the maximum number of attempts
              for today. Don't worry, come back for more chances to win amazing
              prizes!
            </div>{" "}
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

export default WarnningAttemptsModal;
