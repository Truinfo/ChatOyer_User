import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { BsCurrencyRupee } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import "../pages/All.css";
import axios from "axios";
import axiosInstance from "../helpers/axios";
const Bangles = ({ addToWishlist }) => {
  const { _id } = useParams();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1); // Initialize quantity to 1
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"));
  const category = "65ca1b8d0d0fd270c281a205";

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axiosInstance.get(`/getProductByCategory/${category}`);  
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);
  const handleAddToWishlist = async (productId) => {
    try {
      if (!userId) {
        // User is not logged in, navigate to the login page
        navigate("/Login"); // Replace "/login" with the actual login page route
      } else {
        // Find the product by ID
        const selectedProduct = products.find((p) => p._id === productId);

        // Check if the selected product exists
        if (!selectedProduct) {
          console.error("Selected product not found.");
          return; // Exit the function early
        }

        const requestBody = {
          user: userId._id,
          wishlistItem: [
            {
              product: selectedProduct._id,
              name: selectedProduct.name,
              description: selectedProduct.description,
              total: selectedProduct.total,
              image: selectedProduct.productPictures[selectedImage].img,
            },
          ],
        };

        const token = localStorage.getItem("token");
        const config = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            // Add any other headers you require
          },
        };

        const response = await axios.post(
          "http://localhost:2000/api/user/wishlist/addtowishlist",
          requestBody,
          config
        );

        if (response && response.data) {
          // Check if the response contains data
          if (response.data.wishlist) {
            setWishlist(response.data.wishlist);
            navigate("/Wishlist");
          } else {
            console.error(
              "Error adding item to wishlist: Wishlist data not found in response"
            );
          }
        } else {
          console.error(
            "Error adding item to wishlist: Response data not found"
          );
        }
      }
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }
  };
  const handleSortChange1 = (event) => {
    const selectedOption = event.target.value;
    setSortBy(selectedOption);
  
    // Sort and filter the products based on the selected option
    const sortedAndFilteredProducts = [...products];
  
    if (selectedOption === "price-10k") {
      sortedAndFilteredProducts = sortedAndFilteredProducts.filter(
        (product) => product.total >= 10000 && product.total <= 40000
      );
    } else if (selectedOption === "price-40k") {
      sortedAndFilteredProducts = sortedAndFilteredProducts.filter(
        (product) => product.total > 40000 && product.total <= 80000
      );
    }else if (selectedOption === "price-80k") {
      sortedAndFilteredProducts = sortedAndFilteredProducts.filter(
        (product) => product.total > 80000 && product.total <= 130000
      );
    }
  
    // Apply the sorting after filtering
    sortedAndFilteredProducts.sort((a, b) => a.total.localeCompare(b.total));
  
    setProducts([...sortedAndFilteredProducts]); // Update the state with the sorted and filtered products
  };
  

  const handleSortChange = (event) => {
    const selectedOption = event.target.value;
    setSortBy(selectedOption);
    
    // Sort the products based on the selected option
    const sortedProducts = [...products];
    
    if (selectedOption === "price-asc") {
      sortedProducts.sort((a, b) => a.total.localeCompare(b.total));
    } else if (selectedOption === "price-desc") {
      sortedProducts.sort((a, b) => b.total.localeCompare(a.total))
    } else if (selectedOption === "name-asc") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedOption === "name-desc") {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } 
    
  
    setProducts([...sortedProducts]); // Update the state with the sorted products
  };

  const renderProductRows = () => {
    const rows = [];
    for (let i = 0; i < products.length; i += 4) {
      const rowProducts = products.slice(i, i + 4);
      rows.push(
        <div className="row" key={i}>
          {rowProducts.map((curElm) => (
            <div className="col-md-3" key={curElm._id}>
              {/* Render each product item here */}
              
                <div className="box">
                <Link to={`/description/${curElm._id}`}>
                  <div className="img_box">
                    {/* Product image */}
                    {curElm.productPictures.map((productPictures, index) => (
                      <img
                        key={index}
                        src={`http://localhost:2000${productPictures.img}`} // Adjust the URL as needed
                        alt={curElm.name}
                      />
                    ))}
                    </div>
                    </Link>
                    {/* Icons */}
                    <div className="icon">
                      <Link to={`/description/${curElm._id}`}>
                      <li>
                        <BsEye />
                      </li></Link>
                      <li>
                          <AiOutlineHeart onClick={() => handleAddToWishlist(curElm._id)}/>
                      </li>
                    </div>
                  <div className="detail">
                    <h1 >{curElm.name}</h1>
                    <h4 style={{fontSize:"18px", marginLeft:"10px"}}>
                      <BsCurrencyRupee />
                      <b>{curElm.total}/-</b>
                    </h4>
                  </div>
                </div>
            </div>
          ))}
        </div>
      );
    }
    return rows;
  };
  return (
    <div>
      <div className="Banner"

      style={{
        backgroundImage: 'url("https://static.malabargoldanddiamonds.com/media/catalog/category/gold-bangle.jpg")',
        backgroundSize:"contain",
        height: "40vh",
        width:"100vw",
        color:"#e56eeb",
        backgroundSize: '100% 100%',  
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',  
        fontFamily:"'Pacifico', cursive"
      }}
      >
        <div className="Home">
          <p>Bangles</p>
         
        </div>
      </div>
     
      <div className="sort-container">
        
        <div className="sortby ">
          <label className="sort">Sort by: </label>

          <select
            value={sortBy}
            onChange={handleSortChange1}
            className="sortinput fs-3"
            style={{ width: "180px", height: "40px" }}
          >
            <option value="Default">Default</option>
            <option value="price-10k">10k-40k</option>
            <option value="price-40k">40k-80k</option>
            <option value="price-80k">80k-130k</option>
            <option value="price-130k">130k-180k</option>
            <option value="price-180k">180k-240k</option>
            <option value="price-240k">240k-300k</option>
            <option value="price-300k">300k-360k</option>
            <option value="price-360k">360k-420k</option>
          </select>

          <select
            value={sortBy}
            onChange={handleSortChange}
            className="sortinput fs-3"
            style={{ width: "180px", height: "40px" }}
          >
            <option value="default">Default</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="name-asc">Name (A to Z)</option>
            <option value="name-desc">Name (Z to A)</option>
          </select>
        </div>
      </div>
      {/* Your existing JSX code for the product listing page */}
      <div className="product">
        <div className="container">{renderProductRows()}</div>
      </div>
    </div>
  );
};

export default Bangles;