//Home.js
import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import { BsCurrencyRupee } from "react-icons/bs";
//import HomeProducts from "./HomeProducts";
import { BsEye } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import banner1 from '../../assets/banner1.png';
import './ImageGallery.css';
import banner2 from "../../assets/banner2.png";
import axiosInstance from '../../helpers/axios';
import { Api } from "../../helpers/axios";
function Home({ addToWishlist }) {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/getCategory");
        setData(response.data.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await Api.get("/getAllProducts"); // Adjust the API endpoint as needed
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
            navigate("/Wishlist")
          } else {
            console.error(
              "Error adding item to wishlist: Wishlist data not found in response"
            );
          }
        } else {
          console.error("Error adding item to wishlist: Response data not found");
        }
      }
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }
  };
 
  return (
    <>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100 0"
            src={banner1}
            alt="First slide"
            style={{ height: "560px" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://cdnss.caratlane.us/e1597c3d-5e7c-4b01-a191-bfcbe1827055/https://cdn.caratlane.us/media/mageplaza/bannerslider/banner/image/d/e/desktop_-_2024-02-05t183045.060.jpg"
            alt="Second slide"
            style={{ height: "560px" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.candere.com/media/wysiwyg/Limited-Deal.gif"
            alt="Third slide"
            style={{ height: "560px" }}
          />
        </Carousel.Item>
      </Carousel>
      <center className="home-headings mt-2">
        <h1>Product Category</h1>
        <h4>So that you don't run out of options to choose from!</h4>
        <hr />
      </center>
      <div className="App">
      <div className="image-gallery">
      {data.map((category, index) => (
       
        <div className="image-card" key={index}  onClick={()=>navigate(`/${category.name}`)}>
          {/* Conditionally set the href based on category name */}
          
            <img className="Cimage" alt={category.name} src={`http://localhost:2000${category.categoryImage}`} />
          <h4 className="image-title">{category.name}</h4>
        </div>
      ))}
    </div>
      </div>
      <center className="home-headings mt-3">
        <h1>Collection You Love!</h1>
        <h4>Let's take a glimpse at our featured collections before diving in!</h4>
        <hr />
      </center>
      <div className="product">
        <div className="container">
          {products.map((curElm) => {
            return (
              <div className="box" key={curElm._id}>
                <Link to={`/description/${curElm._id}`}>
                  <div className="img_box">
                    {curElm.productPictures.length > 0 && ( // Ensure there are images in the array
                      <img
                        src={`http://localhost:2000${curElm.productPictures[0].img}`} // Accessing the first image
                        alt={curElm.name}
                      />
                    )}
                  </div>

                </Link>
                <div className="icon">  <Link to={`/description/${curElm._id}`}>
                  <li>
                    <BsEye />
                  </li></Link>
                  <li>
                    <AiOutlineHeart onClick={() => handleAddToWishlist(curElm._id)} />
                  </li>
                </div>
                <div className="detail">
                  <h3 className="product-name ">{curElm.name}</h3>
                  <h4 style={{fontSize:"18px", marginLeft:"10px"}}>
                    <BsCurrencyRupee />
                    <b>{curElm.total}</b>
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    

      

      <div className="Banner">
        <img
          style={{ height: 400 }}
          src="https://www.reeds.com/media/wysiwyg/homepage-L1-assets/LooseDiamond_Bridal_Gif_D.gif"
          className="d-block w-100"
          alt="Rings"
        />
      </div>


      <center className="home-headings mt-2">
        <h1>Our Promises</h1>
        <hr />
      </center>
      <div className="brand container-xxl">
        <div className="row justify-content-center justify-content-md-center mt-5">
          <div className="col-md-2 ">
            <img
              src="https://www.josalukkasonline.com/assets/images/certified-images/icon1.webp"
              alt=""
            />
            <span className="promises-text fs-4">Safe & Secure </span>
          </div>
          <div className="col-md-2 ">
            <img
              src="https://www.josalukkasonline.com/assets/images/certified-images/icon2.webp"
              alt=""
            />
            <span className="promises-text fs-4">Free Shipping</span>
          </div>
          <div className="col-md-2 ">
            <img
              src="https://www.josalukkasonline.com/assets/images/certified-images/icon3.webp"
              alt=""
            />
            <span className="promises-text fs-4">30-days Return</span>
          </div>
          <div className="col-md-2 ">
            <img
              src="https://www.josalukkasonline.com/assets/images/certified-images/icon4.webp"
              alt=""
            />
            <span className="promises-text fs-4">Certified</span>
          </div>
          <div className="col-md-2 ">
            <img
              src="https://www.josalukkasonline.com/assets/images/certified-images/icon5.webp"
              alt=""
            />
            <span className="promises-text fs-4">Bis Hallmarked</span>
          </div>
          <div className="col-md-2 ">
            <img
              src="https://www.josalukkasonline.com/assets/images/certified-images/icon6.webp"
              alt=""
            />
            <span className="promises-text fs-4">Easy Exchange</span>
          </div>
        </div>
      </div>
      <table className="d-flex justify-content-center mt-3" >
        <tr>
          <td>
            <div className="Offer" style={{marginRight:"40px"}}>
              <img
                style={{ height: 405 }}
                src="https://www.candere.com/media/home_page_images/bannerTop/RHS_160224.jpg"
                className="d-block  w-100"
                alt="Rings"
              />
            </div>
          </td>
          <td>
            <img
              style={{ height: 405 }}
              src="https://www.candere.com/media/home_page_images/bannerMid/Middle-banner_160224.jpg"
              className="d-block  w-100"
              alt="Rings"
            />
          </td>
        </tr>
      </table>
      <div className="banner">
        <img
          style={{ height: 520 }}
          src={banner2}
          className="d-block  w-100"
          alt="Rings"
        />
      </div>
      
    </>
  );
}

export default Home;
