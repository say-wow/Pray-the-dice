export const getValueOnLocalStorage = (key) => {
  try {
    const item = window.localStorage.getItem(key);
    return JSON.parse(item);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const setValueOnLocalStorage = (key, value) => {
  try {
    return window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
}