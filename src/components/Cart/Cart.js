import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { IoGiftSharp } from "react-icons/io5";
import axiosInstance from "../../helpers/axios";
import { Modal, Button } from "react-bootstrap";

const Cart = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItem, setCartItem] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [wishlistItem, setWishlistItem] = useState([]);
  const [customizedDetails, setCustomizedDetails] = useState({});
  const [show, setShow] = useState(false);
  const userId = localStorage.getItem("User");
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [curElm, setCurElm] = useState({
    selectedSize: "",
    selectedDiamondType: "",
    selectedGoldKt: "",
    selectedGoldType: "",
  });
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/getCartItems`);
        if (response && response.data.cartItems) {
          setCartItem(response.data.cartItems);

          response.data.cartItems.forEach(async (item) => {
            try {
              const customizationResponse = await axiosInstance.get(
                `/getCustamizedByProductId/${item.product}`
              );
              if (customizationResponse && customizationResponse.data) {
                setCustomizedDetails((prevState) => ({
                  ...prevState,
                  [item.product]: customizationResponse.data,
                }));
              }
            } catch (error) {
              console.error("Error fetching customized details:", error);
            }
            console.log("jdsh", customizedDetails);
          });
        } else {
          console.error("Product not found!");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleIncreaseQuantity = async (productId) => {
    try {
      const updatedCartItem = cartItem.map((item) => {
        if (item._id === productId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      const response = await axiosInstance.post("/increaseCartItemQuantity", {
        productId,
      });

      console.log("Increase Quantity Response:", response.data);

      if (response && response.data.cart) {
        setCartItem(updatedCartItem);
      } else {
        console.error("Error updating cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleApplyVoucher = () => {
    console.log("Applying voucher code:", voucherCode);
    setShowVoucherInput(false);
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      const updatedCartItem = cartItem.map((item) => {
        if (item._id === productId && item.quantity > 1) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });

      const response = await axiosInstance.post("/decreaseCartItemQuantity", {
        productId,
      });

      console.log("Decrease Quantity Response:", response.data);

      if (response && response.data.cart) {
        setCartItem(updatedCartItem);
      } else {
        console.error("Error updating cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };
  const handleSizeChange = (selectedSize) => {
    setCurElm({ ...curElm, selectedSize });
  };

  const handleGoldKTTypeChange = (selectedGoldKt) => {
    setCurElm({ ...curElm, selectedGoldKt });
  };
  const handleGoldtypeChange = (selectedGoldtype) => {
    setCurElm({ ...curElm, selectedGoldtype });
  };
  const handleDiamondTypeChange = (selectedDiamondType) => {
    setCurElm({ ...curElm, selectedDiamondType });
  };
  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await axiosInstance.delete("/removeCartItems", {
        productId,
      });

      if (response && response.data.result) {
        setCartItem((prevCart) =>
          prevCart.filter((item) => item._id !== productId)
        );
      } else {
        console.error("Error removing item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleAddToWishlist = async (curElm) => {
    try {
      const existingWishlistItem = wishlistItem.find(
        (item) => item.product === _id
      );

      if (existingWishlistItem) {
        console.log("Product already in wishlist");
      } else {
        const requestBody = {
          user: userId._id,
          wishlistItem: [
            {
              product: curElm._id,
              total: curElm.total,
              image: curElm.image,
              name: curElm.name,
              description: curElm.description,
            },
          ],
        };

        const response = await axiosInstance.post(
          "/addtowishlist",
          requestBody
        );

        if (response && response.data.wishlist) {
          setWishlistItem([...wishlistItem, response.data.wishlist]);
          navigate("/wishlist");
        } else {
          console.error("Error adding item to wishlist");
        }
      }
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }
  };

  return (
    <div className="cart container-fluid">
      <div className="row">
        <div className="col-md-8">
          <h1 className="cart-header">My Shopping Cart</h1>
          {cartItem.map((curElm) => (
            <div className="cart-box" key={curElm._id}>
              <div className="row">
                <div className="col-md-4">
                  <img
                    className="image"
                    src={`http://localhost:2000${curElm.image}`}
                    alt={curElm.name}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-12">
                      <h1 className="card-content">{curElm.name}</h1>
                    </div>
                    <h3>{curElm.Cat}</h3>
                  </div>
                  <div className="row mt-3 p-2">
                    <div className="col-md-12">
                      <h1 className="price">₹{curElm.finalTotal}/-</h1>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-4">
                      <div className="cart-quantity">
                        <label className="card-content fs-2 p-3">
                          Quantity:{" "}
                        </label>
                        <button
                          className="quantity-button"
                          onClick={() => handleDecreaseQuantity(curElm._id)}
                        >
                          -
                        </button>
                        <span className="quantity fs-3">{curElm.quantity}</span>
                        <button
                          className="quantity-button"
                          onClick={() => handleIncreaseQuantity(curElm._id)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="row">
                      <div className="col">
                        <label>Select Sizes:</label>
                        <select
                          className="design-label fs-3 ml-4"
                          value={curElm.selectedSize}
                          onChange={(e) => handleSizeChange(e.target.value)}
                          onClick={() =>
                            console.log(
                              "sd",
                              customizedDetails[curElm.product].product.size
                            )
                          }
                        >
                          {customizedDetails[curElm.product] &&
                            customizedDetails[curElm.product].product.size.map(
                              (detail) => (
                                <option key={detail} value={detail}>
                                  {detail}
                                </option>
                              )
                            )}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <label className="design-label fs-3 ml-4">
                            Gold:
                          </label>
                          <select
                            className="design-label fs-3 ml-4"
                            value={curElm.selectedGoldtype}
                            onChange={(e) =>
                              handleGoldtypeChange(e.target.value)
                            }
                          >
                            {customizedDetails[curElm.product] &&
                              customizedDetails[
                                curElm.product
                              ].product.goldType.map((detail) => (
                                <option key={detail} value={detail}>
                                  {detail}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div>
                        <label className="design-label fs-3 ml-4">
                          Diamond:
                        </label>
                        <select
                          className="design-label fs-3 ml-4"
                          value={curElm.selectedDiamondType}
                          onChange={(e) =>
                            handleDiamondTypeChange(e.target.value)
                          }
                        >
                          {customizedDetails[curElm.product] &&
                            customizedDetails[
                              curElm.product
                            ].product.diamondType.map((detail) => (
                              <option key={detail} value={detail}>
                                {detail}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div>
                        <label className="design-label fs-3 ml-4">Gold:</label>
                        <select
                          className="design-label fs-3 ml-4"
                          value={curElm.selectedGoldKt}
                          onChange={(e) => handleGoldKTTypeChange(e.target.value)}
                        >
                          {customizedDetails[curElm.product] &&
                            customizedDetails[
                              curElm.product
                            ].product.goldKt.map((detail) => (
                              <option key={detail} value={detail}>
                                {detail}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <button
                        className="remove-button"
                        onClick={() => {
                          handleRemoveFromCart(curElm._id);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="col-md-4">
                      <Link to="/wishlist">
                        <button
                          className="wishlist-button fs-3"
                          onClick={() => handleAddToWishlist(curElm)}
                        >
                          Add to Wishlist
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className=" col-md-4">
          <div className="order-summary-box">
            <h3 className="order1">
              <b>Order Summary</b>
            </h3>
            <p className="length">Total Products: {cartItem.length}</p>
            <p className="length">Total Price: ₹{}</p>
            <div className="Gift">
              <p>Gift Message (Optional)</p>
              <button onClick={handleShow} style={{ border: "none" }}>
                <IoGiftSharp
                  style={{
                    fontSize: "20px",
                    color: "#4f3267",
                    marginTop: "-15px",
                  }}
                />
              </button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header
                  closeButton
                  style={{ fontFamily: "'Domine', serif" }}
                >
                  <Modal.Title
                    style={{ marginLeft: "120px", fontSize: "18px" }}
                  >
                    <b>ADD YOUR GIFT MESSAGE</b>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <input
                    type="text"
                    placeholder="Recipient's Name"
                    style={{
                      fontSize: "16px",
                      width: "470px",
                      height: "50px",
                      paddingLeft: "20px",
                      fontFamily: "'Domine', serif",
                    }}
                  />{" "}
                  <br></br>
                  <input
                    type="text"
                    placeholder="Your Name"
                    style={{
                      fontSize: "16px",
                      width: "470px",
                      marginTop: "20px",
                      height: "50px",
                      paddingLeft: "20px",
                      fontFamily: "'Domine', serif",
                    }}
                  />{" "}
                  <br></br>
                  <textarea
                    rows="5"
                    columns="80"
                    placeholder="Your Message"
                    style={{
                      fontSize: "16px",
                      width: "470px",
                      marginTop: "20px",
                      paddingLeft: "20px",
                      fontFamily: "'Domine', serif",
                    }}
                  ></textarea>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="primary"
                    onClick={handleClose}
                    style={{
                      fontSize: "18px",
                      background:
                        "linear-gradient(to right,#DE57E5 0%,#8863FB 100%)",
                      border: "none",
                      marginRight: "180px",
                    }}
                  >
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <button className="placeorder-button">CHECK OUT</button>
            <div className="Vocher">
              <p onClick={() => setShowVoucherInput(!showVoucherInput)}>
                I have a voucher code / gift card
              </p>
              {showVoucherInput && (
                <div
                  className="Vocher-Card"
                  style={{ fontFamily: "Mulish,sans-serif" }}
                >
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    style={{
                      width: "300px",
                      padding: "10px",
                      fontSize: "16px",
                      border: "1px solid #DE57E5",
                      borderRadius: "10px 0 0 10px",
                    }}
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="voucher-apply-button"
                  >
                    Apply
                  </button>
                </div>
              )}
              <p style={{ marginTop: "30px" }}>
                Any Questions? <br />
                Please call us at <b>18004190066</b>{" "}
              </p>{" "}
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
