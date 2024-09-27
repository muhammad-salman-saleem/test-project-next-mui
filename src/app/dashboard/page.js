"use client";

import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [carModel, setCarModel] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [maxPictures, setMaxPictures] = useState(1);
  const [pictures, setPictures] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    }
  }, [router]);

  const handlePictureChange = (e) => {
    const files = Array.from(e.target.files);

    if (pictures.length + files.length > maxPictures) {
      alert(`You can only upload up to ${maxPictures} pictures.`);
      return;
    }
    setPictures((prevPictures) => [...prevPictures, ...files]);

    setPreviewUrls((prevUrls) => [
      ...prevUrls,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("carModel", carModel);
    formData.append("price", price);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("maxPictures", maxPictures);

    pictures.forEach((picture, index) => {
      formData.append(`picture_${index}`, picture);
    });

    try {
      const res = await fetch("/api/submitVehicle", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Vehicle information submitted successfully");
        router.push("/dashboard");
        setCarModel("");
        setPrice("");
        setPhone("");
        setCity("");
        setMaxPictures(1);
        setPreviewUrls([]);
        setPictures([]);
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting the form.");
    }
  };
  const handleAddPictureClick = () => {
    document.getElementById("file-input").click();
  };
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Submit Vehicle Information
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Car Model"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              required
              inputProps={{ minLength: 3 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              inputProps={{ maxLength: 11 }}
            />
          </Grid>
          <Grid item tem xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">City</FormLabel>
              <RadioGroup
                row
                aria-label="gender"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <FormControlLabel
                  value="Lahore"
                  control={<Radio />}
                  label="Lahore"
                />
                <FormControlLabel
                  value="Karachi"
                  control={<Radio />}
                  label="Karachi"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {/* Dropdown for Max Pictures */}
          <Grid item xs={12} md={6} lg={4}>
            <Select
              fullWidth
              value={maxPictures}
              onChange={(e) => setMaxPictures(e.target.value)}
              required
              displayEmpty
            >
              <MenuItem value="" disabled>
                No of copies
              </MenuItem>
              {[...Array(10).keys()].map((num) => (
                <MenuItem key={num + 1} value={num + 1}>
                  {num + 1}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Preview of Selected Images */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Preview</Typography>
            <Box sx={{ display: "flex", gap: 2,flexWrap:"wrap" }}>
              {previewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index}`}
                  width={100}
                  height={100}
                />
              ))}
              <Box>
                <input
                  accept="image/*"
                  type="file"
                  multiple
                  onChange={handlePictureChange}
                  hidden
                  id="file-input"
                />
                <Box
                  width={100}
                  height={100}
                  sx={{
                    border: "1px solid",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    marginBottom: 2,
                  }}
                  onClick={handleAddPictureClick}
                >
                  + add picture
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ width: "100%" }}
            >
              Add Car
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
