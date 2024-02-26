import React from "react";

const Userpage = () => {
  return (
    <div className="userpanel">
      <div className="container-fulid">
        <div className="row p-5">
          <div className="col-md-4 ">
            <div className="logo-box">
              <div className="row">
                <img
                  src="http://localhost:3000/static/media/logo.8e4358d3f2fd5a979c7d.png"
                  alt="logo"
                />
              </div>
              <div className="row">
                <h5>Change Password</h5>
              </div>
              <div className="row">
                <button className="logout-btn btn-light">Logout</button>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="pay-card p-3">
              <h4 className="text-uppercase p-4">User details</h4>
              <div className="inputbox mt-3 ">
                <input
                  type="text"
                  name="name"
                  className="form-control "
                  required="required"
                />
                <span>Name</span>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="inputbox mt-3 mr-2">
                    <input
                      type="email"
                      name="name"
                      className="form-control"
                      required="required"
                    />

                    <span>Email</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex flex-row">
                    <div className="inputbox mt-3 mr-2">
                      <input
                        type="phonenumber"
                        name="phonenumber"
                        className="form-control"
                        required="required"
                      />
                      <span>Phone Number</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="inputbox mt-3 mr-2">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      required="required"
                    />
                    <span>Street Address</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="inputbox mt-3 mr-2">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      required="required"
                    />
                    <span>City</span>
                  </div>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-6">
                  <div className="inputbox mt-3 mr-2">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      required="required"
                    />
                    <span>State/Province</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="inputbox mt-3 mr-2">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      required="required"
                    />
                    <span>Zip code</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userpage;
