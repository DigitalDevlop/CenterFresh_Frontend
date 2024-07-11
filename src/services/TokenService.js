const localStorageName = "usercenterfreshhdsakjhvzxjhd"

const getLocalRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem(localStorageName));
  return user?.refreshToken;
};

const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem(localStorageName));
  return user?.accessToken;
};

const updateLocalAccessToken = (token) => {
  let user = JSON.parse(localStorage.getItem(localStorageName));
  user.accessToken = token;
  localStorage.setItem(localStorageName, JSON.stringify(user));
};

const getUser = () => {
  return JSON.parse(localStorage.getItem(localStorageName));
};



const setUser = (user) => {
  localStorage.setItem(localStorageName, JSON.stringify(user));
};

const removeUser = () => {
  localStorage.removeItem(localStorageName);
  window.location.reload(false)
};

const getToken = () => {
  return JSON.parse(localStorage.getItem(localStorageName))?.jwt || JSON.parse(localStorage.getItem(localStorageName))?.token;
}


const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
  getUser,
  setUser,
  removeUser,
  getToken,
};

export default TokenService;
