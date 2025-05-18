package com.capstonebank.capstonebankingwebapp.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_profile")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "customer_id", nullable = false, unique = true)
    private Customer customer;

    private LocalDate dob;
    private String gender;
    private String maritalStatus;
    private String profilePictureUrl;
    private String accountType;
    private String branchCode;
    private String branchName;
    private String occupation;
    private BigDecimal annualIncome;
    private String avatarUrl;

    // Address fields
    private String address1;
    private String address2;
    private String city;
    private String state;
    private String pincode;
    private String country;

    // Default avatar URLs
    private static final String DEFAULT_MALE_AVATAR = "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?ga=GA1.1.1133634801.1736242704&semt=ais_hybrid";
    private static final String DEFAULT_FEMALE_AVATAR = "https://img.freepik.com/premium-photo/profile-icon-white-background_941097-161980.jpg?ga=GA1.1.1133634801.1736242704&semt=ais_hybrid";
    private static final String DEFAULT_OTHER_AVATAR = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.1133634801.1736242704&semt=ais_hybrid";

    // Constructor
    public UserProfile() {
        // Default avatar as generic if gender is not set
        this.avatarUrl = DEFAULT_OTHER_AVATAR;
    }

    // Method to set avatar based on gender
    public void setAvatarBasedOnGender() {
        if ("Male".equalsIgnoreCase(this.gender)) {
            this.avatarUrl = DEFAULT_MALE_AVATAR;
        } else if ("Female".equalsIgnoreCase(this.gender)) {
            this.avatarUrl = DEFAULT_FEMALE_AVATAR;
        } else {
            this.avatarUrl = DEFAULT_OTHER_AVATAR;
        }
    }

    // Getters for default avatars (to make them accessible externally)
    public static String getDefaultMaleAvatar() {
        return DEFAULT_MALE_AVATAR;
    }

    public static String getDefaultFemaleAvatar() {
        return DEFAULT_FEMALE_AVATAR;
    }

    public static String getDefaultOtherAvatar() {
        return DEFAULT_OTHER_AVATAR;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
        // Automatically update avatar based on gender
        setAvatarBasedOnGender();
    }

    public String getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(String maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void setBranchCode(String branchCode) {
        this.branchCode = branchCode;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public BigDecimal getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(BigDecimal annualIncome) {
        this.annualIncome = annualIncome;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getAddress1() {
        return address1;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public String getAddress2() {
        return address2;
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}