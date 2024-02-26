import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./WishList.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../helpers/axios";

const WishList = () => {
  const { _id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItem, setCartItem] = useState([]); // Example initial state is an empty array
 
  const userId = JSON.parse(localStorage.getItem("user")); // Get userId from localStorage
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);


  useEffect(() => {
    async function fetchWishlist() {
      try {
        const response = await axiosInstance.get(`/getWishlistItems`);
        if (response && response.data && response.data.wishlistItems) {
          setWishlistItems(response.data.wishlistItems);
          console.log(response.data);
        } else {
          console.error("Wishlist items not found!");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
        setIsLoading(false);
      }
    }
    fetchWishlist();
  }, [_id]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await axiosInstance.post("/removeWishlistItems",
        { productId },

      );

      if (response && response.data.result) {
        setWishlistItems((prevWishlist) =>
          prevWishlist.filter((item) => item._id !== productId)
        );
      } else {
        console.error("Error removing item from wishlist");
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const handleAddToCart = async (curElm) => {
    try {
      const existingCartItem = cartItem.find(
        (item) => item.product === curElm._id
      );

      if (existingCartItem) {
        // If the item already exists in the cart, update its quantity
        const updatedCartItem = cartItem.map((item) => {
          if (item.product === curElm._id) {
            return {
              ...item,
              quantity: item.quantity + quantity,
            };
          }
          return item;
        });

        const response = await axiosInstance.post(
          "http://localhost:2000/api/user/cart/increaseCartItemQuantity",
          { productId: curElm._id }, // Send only the productId

        );

        console.log("Increase Quantity Response:", response.data);

        if (response && response.data.cart) {
          setCartItem(updatedCartItem);
        } else {
          console.error("Error updating cart");
        }
      } else {
        // If the item is not in the cart, add it as a new item
        const requestBody = {
          user: userId._id, // Use userId from localStorage
          cartItem: [
            {
              product: curElm.product,
              quantity,
              total: curElm.total,
              image: curElm.image,
              name: curElm.name,
              description: curElm.description,
            },
          ],
        };

        const response = await axiosInstance.post("/addItemToWishlist",
          requestBody,

        );

        if (response && response.data.cart) {
          // Cart item added successfully
          setCartItem([...cartItem, response.data.cart]);
        } else {
          console.error("Error adding item to cart");
        }
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="wishlist0">
        <h1 className=" WISHLIST" >WishList</h1>
      </div>
<div className="wishlist-page">
        {wishlistItems.map((curElm) => (
          <div className="wishlist-box" key={curElm._id} >
            <img
              className="image"
              src={`http://localhost:2000${curElm.image}`}
              alt={curElm.name}
              style={{ width: "100%"}}
            />
            <div className="row" style={{marginLeft:"10px", marginTop:"10px"}}>
              <h1 className="wishlist-header">{curElm.name}</h1>
            </div>
            <div className="row mt-3 p-2" style={{marginLeft:"10px"}}>
              <h1 className="wishlist-price"><b>₹{curElm.total}/-</b></h1>
            </div>
            <div className="buttons-wishlist">
              <button
                className="wishlist-remove-button"
                onClick={() => {
                  handleRemoveFromWishlist(curElm._id);
                }}
              >
                Remove
              </button>
              <button
                className="wishlist-cart "
                onClick={() => handleAddToCart(curElm)}
                
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
    </div>
    </div>
  );
};

export default WishList;