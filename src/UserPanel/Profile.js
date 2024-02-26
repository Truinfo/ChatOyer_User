import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../actions/auth.action";
import "./Profile.css";
import axiosInstance from "../helpers/axios";

const Profile = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedSecondName, setEditedSecondName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedContactNumber, setEditedContactNumber] = useState("");

  const Useremail = JSON.parse(localStorage.getItem("User"));
  const email = Useremail.email;

  const [userDetails, setUserDetails] = useState({});
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await axiosInstance.get(`/getUserByEmail/${email}`);
        if (response && response.data) {
          const user = response.data.user;
          setUserDetails(user);

          // Set initial values for input fields
          setEditedFirstName(user.firstName);
          setEditedSecondName(user.secondName);
          setEditedEmail(user.email);
          setEditedContactNumber(user.contactNumber);
        } else {
          console.error("User details not found!");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
    fetchUserDetails();
  }, [email]);

  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(signout());
    navigate("/Login");
  };

  const handleFileChange = (file) => {
    setProfilePhoto(file);
    console.log("Selected file:", file);
  };

  const saveChanges = async () => {
    const updatedDetails = {
      firstName: editedFirstName,
      secondName: editedSecondName,
      email: editedEmail,
      contactNumber: editedContactNumber,
      // Add other fields as needed
    };

    try {
      const response = await axiosInstance.put(`/updateUser/${userDetails.id}`, updatedDetails);
      console.log("Server response:", response.data);
      // You can handle success or show a message to the user
    } catch (error) {
      console.error("Error updating user details:", error);
      // Handle error, show error message to the user, etc.
    }

    setIsFormDisabled(true);
    setEditing(false);
  };

  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="sidebar mt-5">
          <div className="container-fluid">
            <ul className="profile-sidebar">
              <div className="button">
                <img
                  src={
                    profilePhoto
                      ? URL.createObjectURL(profilePhoto)
                      : "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=740"
                  }
                  alt="Avatar"
                  height="150px"
                  width="150px"
                  style={{ borderRadius: "70PX" }}
                />
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    style={{ marginTop: "10px" }}
                  />
                </div>
              </div>
              {userDetails && (
                <div className="Form" key={userDetails.id}>
                  <form>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={editedFirstName}
                      onChange={(e) => setEditedFirstName(e.target.value)}
                      style={{width:"250px", height:"40px", fontSize:"20px", borderRadius:"10px", backgroundColor:"#ede4f0", border:"none", fontFamily:"Times New Roman, Times, serif", paddingLeft:"20px"}}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={editedSecondName}
                      onChange={(e) => setEditedSecondName(e.target.value)}
                      style={{width:"250px", height:"40px", fontSize:"20px", borderRadius:"10px", backgroundColor:"#ede4f0", border:"none", fontFamily:"Times New Roman, Times, serif", paddingLeft:"20px", marginLeft:"20px"}}
                    />
                    <br/>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      style={{width:"250px", height:"40px", fontSize:"20px", borderRadius:"10px", backgroundColor:"#ede4f0", border:"none", fontFamily:"Times New Roman, Times, serif", paddingLeft:"20px", marginTop:"20px"}}
                    />
                    <input
                      type="number"
                      placeholder="Mobile"
                      value={editedContactNumber}
                      onChange={(e) => setEditedContactNumber(e.target.value)}
                      style={{width:"250px", height:"40px", fontSize:"20px", borderRadius:"10px", backgroundColor:"#ede4f0", border:"none", fontFamily:"Times New Roman, Times, serif", paddingLeft:"20px", marginLeft:"20px"}}
                    />
                   <h3 style={{fontFamily:"Times New Roman, Times, serif", marginTop:"20px", marginRight:"450px"}}><b>Address</b></h3>
                <input type="address" placeholder="Plot No" style={{width:"250px", height:"40px", fontSize:"20px", borderRadius:"10px", backgroundColor:"#ede4f0", border:"none", fontFamily:"Times New Roman, Times, serif", paddingLeft:"20px"}}/>
                <input type="street" placeholder="Street Name" style={{width:"250px", height:"40px", fontSize:"20px", borderRadius:"10px", backgroundColor:"#ede4f0", border:"none", fontFamily:"Times New Roman, Times, serif", paddingLeft:"20px", marginLeft:"20px"}}/>   <br></br>

                <input type="district" placeholder="District" style={{width:"250px", height:"40px", fontSize:"20px", borderRadius:"10px", backgroundColor:"#ede4f0", border:"none", fontFamily:"Times New Roman, Times, serif", paddingLeft:"20px", marginTop:"20px"}}/>
                <input type="state" placeholder="State" style={{width:"250px", height:"40px", fontSize:"20px", borderRadius:"10px", backgroundColor:"#ede4f0", border:"none", fontFamily:"Times New Roman, Times, serif", paddingLeft:"20px", marginLeft:"20px"}}/>    <br></br>

                <input type="country" placeholder="Country" style={{width:"250px", height:"40px", fontSize:"20px", borderRadius:"10px", backgroundColor:"#ede4f0", border:"none", fontFamily:"Times New Roman, Times, serif", paddingLeft:"20px", marginTop:"20px"}}/>
                <input type="pincode" placeholder="Pincode" style={{width:"250px", height:"40px", fontSize:"20px", borderRadius:"10px", backgroundColor:"#ede4f0", border:"none", fontFamily:"Times New Roman, Times, serif", paddingLeft:"20px", marginLeft:"20px"}}/> <br></br>
              
                  </form>

                  <div className="Edit">
                    <button
                      onClick={() => {
                        if (editing) {
                          saveChanges();
                        } else {
                          setIsFormDisabled(false);
                        }
                        setEditing((prev) => !prev);
                      }}
                      style={{
                        fontSize: "15px",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "none",
                        fontFamily: "Times New Roman, Times, serif",
                        color: "white",
                        marginTop: "20px",
                      }}
                    >
                      {editing ? "Save Changes" : "Edit Profile"}
                    </button>
                  </div>
                </div>
              )}
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
