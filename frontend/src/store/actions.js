import {
  SET_IS_LOGIN,
  SET_USER_INFO,
  SET_USER,
  LOGOUT,
  SET_PRODUCTS,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
} from "./constants";

// --- AUTH ---
export const set_is_login = (payload) => ({
  type: SET_IS_LOGIN,
  payload,
});

export const set_user_info = (payload) => ({
  type: SET_USER_INFO,
  payload,
});

export const setUser = (payload) => ({
  type: SET_USER,
  payload,
});

export const logout = () => ({
  type: LOGOUT,
});

// --- PRODUCTS ---
export const setProducts = (payload) => ({
  type: SET_PRODUCTS,
  payload,
});

// --- CART ---
export const addToCart = (payload) => ({
  type: ADD_TO_CART,
  payload, // product object
});

export const removeFromCart = (payload) => ({
  type: REMOVE_FROM_CART,
  payload, // product id
});

export const updateCartQuantity = (id, delta) => ({
  type: UPDATE_CART_QUANTITY,
  payload: { id, delta },
});

export const clearCart = () => ({
  type: CLEAR_CART,
});
