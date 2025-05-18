import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation in React Router v6
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/Profile.css"; // Ensure relevant CSS styling is included
import successImage from "../assets/success.png"; // Ensure you have this image in your assets folder

const UpdateProfile = () => {
    const storedUser = JSON.parse(localStorage.getItem("user")); // Fetch username from local storage
    const [updatedProfile, setUpdatedProfile] = useState({
        dob: "",
        gender: "",
        maritalStatus: "",
        profilePictureUrl: "",
        accountType: "",
        branchCode: "",
        branchName: "",
        occupation: "",
        annualIncome: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false); // Success state
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirmation modal state
    const [countdown, setCountdown] = useState(3); // Countdown for success modal
    const navigate = useNavigate(); // Hook for navigation (React Router v6)

    useEffect(() => {
        if (storedUser?.username) {
            axios
                .get(`http://localhost:8080/profile/${storedUser.username}`)
                .then((response) => {
                    const {
                        dob,
                        gender,
                        maritalStatus,
                        profilePictureUrl,
                        accountType,
                        branchCode,
                        branchName,
                        occupation,
                        annualIncome,
                        address1,
                        address2,
                        city,
                        state,
                        pincode,
                        country,
                    } = response.data;

                    setUpdatedProfile({
                        dob: dob || "",
                        gender: gender || "",
                        maritalStatus: maritalStatus || "",
                        profilePictureUrl: profilePictureUrl || "",
                        accountType: accountType || "",
                        branchCode: branchCode || "",
                        branchName: branchName || "",
                        occupation: occupation || "",
                        annualIncome: annualIncome || "",
                        address1: address1 || "",
                        address2: address2 || "",
                        city: city || "",
                        state: state || "",
                        pincode: pincode || "",
                        country: country || "",
                    });
                    setIsLoading(false);
                })
                .catch((err) => {
                    setError(err.response?.data || "Error fetching profile");
                    setIsLoading(false);
                });
        } else {
            setError("User is not logged in");
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (storedUser?.username) {
            try {
                await axios.put(`http://localhost:8080/profile/updateProfile/${storedUser.username}`, updatedProfile);
                setSuccess(true); // Trigger success modal
                setUpdatedProfile({
                    dob: "",
                    gender: "",
                    maritalStatus: "",
                    profilePictureUrl: "",
                    accountType: "",
                    branchCode: "",
                    branchName: "",
                    occupation: "",
                    annualIncome: "",
                    address1: "",
                    address2: "",
                    city: "",
                    state: "",
                    pincode: "",
                    country: "",
                });

                // Start countdown
                const timer = setInterval(() => {
                    setCountdown((prevCountdown) => prevCountdown - 1);
                }, 1000);

                // Redirect after 3 seconds
                setTimeout(() => {
                    clearInterval(timer);
                    setSuccess(false);
                    navigate("/viewprofile"); // Use navigate for redirection in React Router v6
                }, 3000);
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("An error occurred while updating the profile.");
            }
        } else {
            alert("User is not logged in");
        }
    };

    const handleOpenModal = (e) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    const handleCloseModal = () => {
        setShowConfirmModal(false);
    };

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="profile-container">
                    <h2>Error</h2>
                    <p className="error-message">{error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>
                <Navbar />
                <div className="profile-container">
                    <p>Loading...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="profile-container1">
                <h2>Update Your Profile</h2>

                {/* Avatar Section */}
                <div className="form-group">
                    <img
                        src={updatedProfile.avatarUrl || 'https://img.freepik.com/premium-photo/grey-silhouette-person39s-head-shoulders-circle-with-long-shadow_1387470-2915.jpg?ga=GA1.1.1133634801.1736242704&semt=ais_hybrid&w=740'}
                        alt="Avatar"
                        className="avatar"
                    />
                </div>

                {/* Profile Update Form */}
                <div className="profile-details">
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            className="form-control"
                            name="dob"
                            value={updatedProfile.dob}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            className="form-select"
                            name="gender"
                            value={updatedProfile.gender}
                            onChange={handleInputChange}
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Marital Status</label>
                        <select
                            className="form-select"
                            name="maritalStatus"
                            value={updatedProfile.maritalStatus}
                            onChange={handleInputChange}
                        >
                            <option value="">Select</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                        </select>
                    </div>
                        <input
                            type="hidden"
                            className="form-control"
                            name="profilePictureUrl"
                            value={updatedProfile.profilePictureUrl}
                            onChange={handleInputChange}
                        />

                    {/* Other fields */}
                    <div className="form-group">
                        <label>Account Type</label>
                        <select
                            className="form-select"
                            name="accountType"
                            value={updatedProfile.accountType}
                            onChange={handleInputChange}
                        >
                            <option value="">Select</option>
                            <option value="Savings">Savings</option>
                            <option value="Current">Current</option>
                            <option value="Fixed Deposit">Fixed Deposit</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Branch Code</label>
                        <input
                            type="text"
                            className="form-control"
                            name="branchCode"
                            value={updatedProfile.branchCode}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Branch Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="branchName"
                            value={updatedProfile.branchName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Occupation</label>
                        <input
                            type="text"
                            className="form-control"
                            name="occupation"
                            value={updatedProfile.occupation}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Annual Income</label>
                        <input
                            type="number"
                            className="form-control"
                            name="annualIncome"
                            value={updatedProfile.annualIncome}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Address fields */}
                    <div className="form-group">
                        <label>Address Line 1</label>
                        <input
                            type="text"
                            className="form-control"
                            name="address1"
                            value={updatedProfile.address1}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Address Line 2</label>
                        <input
                            type="text"
                            className="form-control"
                            name="address2"
                            value={updatedProfile.address2}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={updatedProfile.city}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>State</label>
                        <input
                            type="text"
                            className="form-control"
                            name="state"
                            value={updatedProfile.state}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Pincode</label>
                        <input
                            type="text"
                            className="form-control"
                            name="pincode"
                            value={updatedProfile.pincode}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Country</label>
                        <input
                            type="text"
                            className="form-control"
                            name="country"
                            value={updatedProfile.country}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="button-container">
                        <button type="button" className="btn update-profile" onClick={handleOpenModal}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
            <Footer />

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Profile Update</h5>
                                <button type="button" className="close" onClick={handleCloseModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to update your profile?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {success && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Profile Updated Successfully!</h5>
                            </div>
                            <div className="modal-body text-center">
                                <img src={successImage} alt="Success" style={{ width: '100px' }} />
                                <p className="mt-3">
                                    Your profile has been updated successfully! Redirecting in {countdown} seconds...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateProfile;