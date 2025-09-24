import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIssue, geocodeAddress } from "../api/issueService";
import { useAuth } from "../context/AuthContext";

const IssueForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form field states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Roads");

  // Location-related states
  const [locationMethod, setLocationMethod] = useState("manual");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [locationStatus, setLocationStatus] = useState("");

  // Media (photo or video) states
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaType, setMediaType] = useState("");

  const handleGetLiveLocation = () => {
    setLocationStatus("Fetching your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocationStatus("Location found!");
      },
      (error) => {
        setLocationStatus(`Error: ${error.message}`);
      }
    );
  };

  const handleGeocodeAddress = async () => {
    if (!address) {
      setLocationStatus("Please enter an address.");
      return;
    }
    setLocationStatus("Finding coordinates...");
    try {
      const coords = await geocodeAddress(address);
      if (coords) {
        setLatitude(coords.lat.toFixed(6));
        setLongitude(coords.lng.toFixed(6));
        setLocationStatus("Coordinates found!");
      } else {
        setLocationStatus("Could not find coordinates for this address.");
      }
    } catch (error) {
      setLocationStatus("An error occurred while finding the address.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
      if (file.type.startsWith("image/")) {
        setMediaType("image");
      } else if (file.type.startsWith("video/")) {
        setMediaType("video");
      }
    } else {
      setMediaFile(null);
      setMediaPreview("");
      setMediaType("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      alert("Please set a location before submitting.");
      return;
    }

    let mediaUrlToSave =
      "https://images.unsplash.com/photo-1594168297979-9a6157147817";
    if (mediaFile) {
      mediaUrlToSave =
        mediaType === "image"
          ? "https://picsum.photos/600/400?" + Math.random()
          : "https://placehold.co/600x400/31343C/EEE?text=Video+Uploaded";
    }

    const newIssue = {
      title,
      description,
      category,
      location: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
      status: "Reported",
      reportedAt: new Date().toISOString(),
      userId: user.id,
      imageUrl: mediaUrlToSave,
    };

    try {
      const response = await createIssue(newIssue);
      const createdIssue = response.data;
      alert("Issue reported successfully!");
      navigate("/home", { state: { newIssueId: createdIssue.id } });
    } catch (error) {
      console.error("Failed to report issue:", error);
      alert("Error reporting issue. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="issue-form">
      {/* --- Title, Description, Category Fields --- */}
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Roads">Roads</option>
          <option value="Streetlights">Streetlights</option>
          <option value="Waste Management">Waste Management</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* --- Location Input Section --- */}
      <div className="form-group">
        <label>Location</label>
        <div className="location-method-switcher">
          <button
            type="button"
            onClick={() => setLocationMethod("live")}
            className={locationMethod === "live" ? "active" : ""}
          >
            Live Location
          </button>
          <button
            type="button"
            onClick={() => setLocationMethod("address")}
            className={locationMethod === "address" ? "active" : ""}
          >
            Type Address
          </button>
          <button
            type="button"
            onClick={() => setLocationMethod("manual")}
            className={locationMethod === "manual" ? "active" : ""}
          >
            Manual Entry
          </button>
        </div>
        <div className="location-inputs">
          {locationMethod === "live" && (
            <div className="location-input-group">
              <button type="button" onClick={handleGetLiveLocation}>
                Get My Current Location
              </button>
            </div>
          )}
          {locationMethod === "address" && (
            <div className="location-input-group">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full address"
              />
              <button type="button" onClick={handleGeocodeAddress}>
                Find on Map
              </button>
            </div>
          )}
          {locationMethod === "manual" && (
            <div className="form-group-inline">
              <div className="form-group">
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Latitude"
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Longitude"
                />
              </div>
            </div>
          )}
          {locationStatus && (
            <p className="location-status">{locationStatus}</p>
          )}
        </div>
      </div>

      {/* --- Media Upload Section --- */}
      <div className="form-group">
        <label htmlFor="issue-media">Upload Photo or Video (Optional)</label>
        <input
          type="file"
          id="issue-media"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        {mediaPreview && (
          <div className="media-preview-container">
            {mediaType === "image" && (
              <img
                src={mediaPreview}
                alt="Issue Preview"
                className="media-preview"
              />
            )}
            {mediaType === "video" && (
              <video src={mediaPreview} controls className="media-preview" />
            )}
          </div>
        )}
      </div>

      <button type="submit">Submit Report</button>
    </form>
  );
};

export default IssueForm;
