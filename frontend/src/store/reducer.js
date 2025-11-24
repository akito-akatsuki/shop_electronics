import * as constants from "./constants.js";

const initState = {
  todos: [],
  userInfo: [], // Thông tin raw từ Google
  user: null, // Thông tin user đã xử lý (có role, loyalty...)
  isLogin: false,

  domain: "http://localhost:5000",
  clientId:
    "382574203305-ud2irfgr6bl243mmq6le9l67e29ire7d.apps.googleusercontent.com",
  BANK_ID: "MB",
  ACCOUNT_NO: "0325692240",

  cart: [], // Giỏ hàng
  products: [], // Danh sách sản phẩm
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    // --- AUTH ---
    case constants.SET_IS_LOGIN:
      return {
        ...state,
        isLogin: action.payload,
      };
    case constants.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case constants.SET_USER:
      return {
        ...state,
        user: action.payload,
        isLogin: !!action.payload, // Tự động set login true nếu có user
      };
    case constants.LOGOUT:
      return {
        ...state,
        user: null,
        userInfo: [],
        isLogin: false,
        cart: [], // Xóa giỏ hàng khi đăng xuất (Tùy chọn)
      };

    // --- PRODUCTS ---
    case constants.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };

    // --- CART LOGIC ---
    case constants.ADD_TO_CART: {
      const product = action.payload;
      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === product.id
      );

      let newCart;
      if (existingItemIndex > -1) {
        // Nếu đã có -> Tăng số lượng
        newCart = [...state.cart];
        newCart[existingItemIndex].quantity += 1;
      } else {
        // Nếu chưa có -> Thêm mới với quantity = 1
        newCart = [...state.cart, { ...product, quantity: 1 }];
      }

      return {
        ...state,
        cart: newCart,
      };
    }

    case constants.UPDATE_CART_QUANTITY: {
      const { id, delta } = action.payload;
      const newCart = state.cart.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      });

      return {
        ...state,
        cart: newCart,
      };
    }

    case constants.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case constants.CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    default:
      throw new Error("Invalid action.");
  }
}

export { initState };
export default reducer;
