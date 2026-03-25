package com.mihnea.restapi.dtos.Requests;

public class UpdateProfilePictureRequest {
    private String profilePicturePath;

    public String getProfilePicturePath() {
        return profilePicturePath;
    }

    public void setProfilePicturePath(String profilePicturePath) {
        this.profilePicturePath = profilePicturePath;
    }
}
