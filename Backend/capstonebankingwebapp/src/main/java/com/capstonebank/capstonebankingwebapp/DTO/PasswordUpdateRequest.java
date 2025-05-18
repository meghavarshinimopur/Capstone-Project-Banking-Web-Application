package com.capstonebank.capstonebankingwebapp.DTO;

public class PasswordUpdateRequest {

    private String currentPassword;
    private String newPassword;

    // Getter for currentPassword
    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    // Getter for newPassword
    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
