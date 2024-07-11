import React, { useEffect, useState } from "react";

const OTPInput = ({ defaultOtp, enteredOTP }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ""); // Allow only digits

    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      enteredOTP(`${newOtp[0]}${newOtp[1]}${newOtp[2]}${newOtp[3]}`);

      // Focus on the next input field
      if (element.nextSibling) {
        element.nextSibling.focus();
      }
    }
  };

  useEffect(() => {
    if (defaultOtp) {
      setOtp([
        defaultOtp.charAt(0),
        defaultOtp.charAt(1),
        defaultOtp.charAt(2),
        defaultOtp.charAt(3),
      ]);
    }
  }, [defaultOtp]);

  const handleKeyDown = (event, index) => {
    // Handle backspace to focus on previous input field
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);

      // Focus on the previous input field
      if (event.target.previousSibling) {
        event.target.previousSibling.focus();
      }
    }
  };

  return (
    <div>
      {otp.map((data, index) => (
        <input
          key={index}
          type="number"
          maxLength="1"
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="otp-input"
        />
      ))}
    </div>
  );
};

export default OTPInput;
