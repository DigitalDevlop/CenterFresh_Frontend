import { useEffect, useRef, useState } from "react";
import "./App.css";
import logo from "./assets/new-logo.png";

import OTPModal from "./components/otp.modal";
import "animate.css";
import { CButton, CImage, CPopover } from "@coreui/react";
import Lottie from "react-lottie-player";
import FireWorkLottie from "./assets/ribbon_animation.json";
import loseAnimation from "./assets/lose-animation.json";
import cashAnimation from "./assets/cash-animation";
import { prizes } from "./common/const";

import soundFile from "./assets/spinning-reel.mp3";
import winSoundFile from "./assets/win-sound.mp3";
import loseSoundFile from "./assets/lose-sound.mp3";
import TokenService from "./services/TokenService";
import LogoutModal from "./components/logout.modal";
import InstructionModal from "./components/instruction.modal";
import { cilInfo } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import WarnningAttemptsModal from "./components/warnning-attemptes.modal";
import { PlayerService } from "./services/player.service";
import LoadingFullscreen from "./components/LoadingFullscreen";
import ClaimMessageModal from "./components/claimMessage.modal";
import Swal from "sweetalert2";

function App() {
  let value = Math.ceil(Math.random() * 3600);
  const [prize, setPrize] = useState(null);

  const audioRef = useRef(null);
  const winAudioRef = useRef(null);
  const loseAudioRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [prizeConfigurations, setPrizeConfigurations] = useState(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error attempting to play:", error);
      });
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const playWinSound = () => {
    if (winAudioRef.current) {
      winAudioRef.current.play().catch((error) => {
        console.error("Error attempting to play:", error);
      });
    }
  };

  const playLoseSound = () => {
    if (loseAudioRef.current) {
      loseAudioRef.current.play().catch((error) => {
        console.error("Error attempting to play:", error);
      });
    }
  };

  const stopWinSound = () => {
    if (winAudioRef.current) {
      winAudioRef.current.pause();
    }
  };

  const [show, setShow] = useState(true);

  const [openOTPModal, setOpenOTPModal] = useState(true);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [openInstructionModal, setOpenInstructionModal] = useState(false);
  const [spinBtnAnimation, setSpinBtnAnimation] = useState(true);
  const [openWarnAttModal, setOpenWarnAttModal] = useState(false);
  const [openClaimMessageModal, setOpenClaimMessageModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const spin = async () => {
    setOpenWarnAttModal(false);
    if (TokenService.getUser()?.spinned) {
      setOpenWarnAttModal(true);
      return;
    }
    playSound();
    const prizeSelec = selectPrize();
    setSpinBtnAnimation(false);
    console.log({ prizeSelec });
    const finalAngle = prizeSelec?.deg;
    console.log({ finalAngle });
    let wheel = document.querySelector(".wheel");
    // Set the rotation of the wheel
    wheel.style.transform = `rotate(${finalAngle}deg)`;
    const user = TokenService.getUser()?.user;
    TokenService.setUser({ user: user, spinned: true });

    setTimeout(() => {
      stopSound();
      openModal(true);
      if (prizeSelec.won) {
        playWinSound();
      } else {
        playLoseSound();
      }
    }, 6000);

    setPrize(prizeSelec);
  };

  const textSizeCal = (text) => {
    const fontSize = Math.min(100, 200 / text.length);
    return fontSize;
  };

  const openModal = (status) => {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    if (status) {
      modal.style.display = "block";
    } else {
      modal.style.display = "none";
    }
  };

  function selectPrize() {
    // Calculate total chance percentage
    var updatedPrizeList = prizes;

    if (
      TokenService.getUser()?.user?.darazWin ||
      TokenService.getUser()?.user?.reloadWin >= 5 ||
      TokenService.getUser()?.user?.weeklyWin >= 2
    ) {
      return prizes[0];
    }

    if (prizeConfigurations.reloadHundred <= 0) {
      var updatedPrizeList = prizes.filter((prize) => prize.id !== 4);
    }

    if (prizeConfigurations.reloadFifty <= 0) {
      var updatedPrizeList = updatedPrizeList.filter((prize) => prize.id !== 2);
    }

    if(TokenService.getUser()?.user?.reloadWin > 0) {
      updatedPrizeList = updatedPrizeList.filter((prize) => prize.id !== 6);
    }

    if ((!TokenService.getUser()?.user?.darazWin && TokenService.getUser()?.user?.reloadWin > 0) || prizeConfigurations.darazVoucher <= 0) {
      var newupdatedPrizeList = updatedPrizeList.filter(
        (prize) => prize.id !== 6
      );
    } else {
      var newupdatedPrizeList = updatedPrizeList;
    }

    const totalChance = newupdatedPrizeList.reduce(
      (acc, prize) => acc + parseFloat(prize.chance),
      0
    );

    // Generate a random number between 0 and totalChance
    const randomNum = Math.random() * totalChance;

    // Iterate through prizes to find the selected one
    let cumulativeChance = 0;
    for (const prize of newupdatedPrizeList) {
      cumulativeChance += parseFloat(prize.chance);
      if (randomNum < cumulativeChance) {
        return prize;
      }
    }
  }

  const tokenMobile = TokenService?.getUser()?.user?.mobile;
  const tokenId = TokenService?.getUser()?.user?.id;
  const tokenOtp = TokenService?.getUser()?.user?.otp;

  const claimNow = async () => {
    console.log(prize);
    setLoading(true);
    // if (!prize?.category) {
    //   return;
    // }

    await PlayerService.claim(tokenId, prize?.category, tokenOtp)
      .then((res) => {
        setLoading(false);
        openModal(false);
        setOpenClaimMessageModal(true);
        console.log(res);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  useEffect(() => {
    if (tokenMobile) {
      getPrizeConfig();
      setOpenOTPModal(false);
      setOpenInstructionModal(true);
    } else {
      setOpenOTPModal(true);
      setOpenInstructionModal(false);
    }
  }, [tokenMobile]);

  const getPrizeConfig = async () => {
    PlayerService.getPrizeConfig()
      .then((res) => {
        console.log(res.data[0]?.attributes);
        setPrizeConfigurations(res?.data[0]?.attributes);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="App">
      <LoadingFullscreen loading={loading} message="Please Wait..." />
      <div id="myModal" class="modal">
        <div class="winning-modal-content animate__animated animate__bounceIn">
          <div
            className="mt-4"
            style={{ position: "relative", display: "inline-block" }}
          >
            <Lottie
              loop
              animationData={FireWorkLottie}
              play={prize?.won}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                display: "block",
                width: "100%",
                height: "auto",
              }}
            >
              <h4 style={{ fontWeight: "bold" }}>{prize?.msg}</h4>
              {!prize?.won && (
                <Lottie
                  className="loose-animation p-5"
                  loop
                  animationData={loseAnimation}
                  play={true}
                  style={{
                    top: 0,
                    left: 0,

                    pointerEvents: "none",
                  }}
                />
              )}

              {prize?.won &&
                (prize?.img ? (
                  <img src={prize?.img} className="winning-img" />
                ) : (
                  <>
                    <Lottie
                      className="loose-animation p-5"
                      loop
                      animationData={cashAnimation}
                      play={true}
                      style={{
                        top: 0,
                        left: 0,

                        pointerEvents: "none",
                      }}
                    />
                  </>
                ))}
              <br />
              <CButton
                color="light"
                style={{ marginRight: 10 }}
                onClick={() => {
                  if (prize?.won) {
                    Swal.fire({
                      title: "Are you sure?",
                      text: "You won't be able to claim this prize!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, I don't want!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        window.location.reload(false);
                      }
                    });
                  } else {
                    window.location.reload(false);
                  }
                }}
              >
                {prize?.won ? "CANCEL" : "GOT IT"}
              </CButton>
              {prize?.won && (
                <CButton color="primary" onClick={claimNow}>
                  CLAIM NOW
                </CButton>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <OTPModal open={openOTPModal} />
      </div>
      <div>
        <LogoutModal
          open={openLogoutModal}
          setOpen={(val) => setOpenLogoutModal(val)}
        />
      </div>
      <div>
        <InstructionModal
          open={openInstructionModal}
          setOpen={(val) => setOpenInstructionModal(val)}
        />
      </div>
      <div>
        <WarnningAttemptsModal
          open={openWarnAttModal}
          setOpen={(val) => setOpenWarnAttModal(val)}
        />
      </div>
      <div>
        <ClaimMessageModal
          prize={prize}
          open={openClaimMessageModal}
          setOpen={(val) => setOpenClaimMessageModal(val)}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 5,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <CImage className="center-img" src={logo} />
        </div>
        <br />
        <div className="login-container">
          <span
            className="login-text"
            style={{ fontWeight: "bold", boxShadow: "5px 5px 5px lightblue" }}
          >
            {TokenService?.getUser()?.user?.mobile ? (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "20px",
                    paddingRight: 10,
                    color: "rgba(12,155,239,2)",
                    cursor: "pointer",
                  }}
                  onClick={() => setOpenInstructionModal(true)}
                >
                  help
                </span>
                Logged In As:{" "}
                <span
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: "rgba(12,155,239,2)",
                    paddingLeft: 5,
                  }}
                  onClick={() => setOpenLogoutModal(true)}
                >
                  {TokenService?.getUser()?.user?.mobile}
                </span>{" "}
              </>
            ) : (
              <div>
                <CButton
                  style={{
                    backgroundColor: "rgba(12,155,239,2)",
                    color: "white",
                  }}
                  onClick={() => setOpenOTPModal(true)}
                >
                  LOGIN NOW
                </CButton>
              </div>
            )}
          </span>
        </div>
        {/* <span
          style={{ color: "#04334F", fontWeight: "bolder", fontSize: "2em" }}
        >
          Spinning Wheel
        </span> */}
      </div>
      <div className="container">
        <audio ref={audioRef} src={soundFile} />
        <audio ref={winAudioRef} src={winSoundFile} />
        <audio ref={loseAudioRef} src={loseSoundFile} />
        {TokenService?.getUser()?.user?.mobile ? (
          <>
            <div
              className={`spinBtn ${
                spinBtnAnimation &&
                "animate__animated animate__tada animate__infinite animate__slow"
              }`}
              onClick={spin}
            >
              SPIN
            </div>
            <div className="wheel">
              {prizes.map((prize, index) => (
                <div
                  key={index}
                  className="number"
                  style={{
                    background: prize.color,
                    transform: `rotate(calc(60deg * ${index + 1}))`, // Adjusted
                  }}
                >
                  {prize.img ? (
                    <img src={prize.img} className="prize-img" alt="daraz" />
                  ) : (
                    <span style={{ fontSize: textSizeCal(prize.price) }}>
                      {prize.price}
                    </span>
                  )}
                </div>
              ))}
            </div>{" "}
          </>
        ) : (
          <div style={{ fontSize: "30px" }}>
            Please Login To Win Amazing Prizes
          </div>
        )}
      </div>
      <div
        className="m-login-text"
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          height: "50px",
          backgroundColor: "whitesmoke",
          width: "100%",
          borderRadius: "100px 100px 0 0 ",
          boxShadow: "10px 10px 5px lightblue",
        }}
      >
        <div style={{ height: 10 }}></div>
        <span
          style={{ fontWeight: "bold", textAlign: "center", marginTop: "50px" }}
        >
          {TokenService?.getUser()?.user?.mobile ? (
            <>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "20px",
                  paddingRight: 10,
                  color: "rgba(12,155,239,2)",
                  cursor: "pointer",
                }}
                onClick={() => setOpenInstructionModal(true)}
              >
                help
              </span>
              Logged In As:{" "}
              <span
                style={{
                  textDecoration: "underline",
                  color: "rgba(12,155,239,2)",
                  cursor: "pointer",
                  paddingLeft: 5,
                }}
                onClick={() => setOpenLogoutModal(true)}
              >
                {TokenService?.getUser()?.user?.mobile}
              </span>{" "}
            </>
          ) : (
            <div>
              <CButton
                onClick={() => setOpenOTPModal(true)}
                style={{
                  backgroundColor: "rgba(12,155,239,2)",
                  color: "white",
                }}
              >
                LOGIN NOW
              </CButton>
            </div>
          )}
        </span>
      </div>
    </div>
  );
}

export default App;
