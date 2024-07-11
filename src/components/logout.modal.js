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
import { MAIN_API } from "../common/const";

function LogoutModal({ open, setOpen }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const openOTPModal = (status) => {
    var modal = document.getElementById("logoutModal");
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
    <div id="logoutModal" class="modal">
      <div class="logout-modal-content animate__animated animate__bounceIn">
        <div className="p-4" style={{ textAlign: "center" }}>
          <h3>Action Required!</h3>
          <p>Do you really want to logout?</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <CButton
              color="light"
              onClick={() => {
                openOTPModal(false);
                setOpen(false)
              }}
            >
              CANCEL
            </CButton>
            <CButton color="danger" onClick={() => TokenService.removeUser()}>
              LOGOUT
            </CButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
