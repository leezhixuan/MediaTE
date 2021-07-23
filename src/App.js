import { useState } from "react";

import { useForm } from "react-hook-form";

import { Helmet } from "react-helmet";
import styled from "styled-components";
import VideoUploader from "./components/VideoUploader";
import UploadTextField from "./components/UploadTextField";

import { Button } from "@material-ui/core";
import "./App.css";
import CustomBeatLoader from "./components/CustomBeatLoader";
import EmailField from "./components/EmailField";

function App() {
  const { handleSubmit } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState("");
  const [error, setError] = useState("");
  const [voice, setVoice] = useState("Joanna");
  const [uploadText, setUploadText] = useState("");
  const [uploadEmail, setUploadEmail] = useState("");
  const successMessage =
    "Submitted! You will receive the result video in your email when it is ready. This should take about 5 minutes for a ~20s video. Please contact us at anytutor.official@gmail.com if you face any difficulties! :)";
  const errorMessage =
    "Sorry, our services are currently not running. Please contact us for assistance!";

  const submit = (data) => {
    setSubmitting(true);
    console.log("HERE");
    console.log(submitting);

    // * Endpoint to lambda that will run our notebook
    const url =
      "https://8c3vifq9mj.execute-api.ap-southeast-1.amazonaws.com/default/test-socket";
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        // No need to overwrite Access-Control-Allow-Origin	here!
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: uploadEmail,
        uploadText: uploadText,
        lessonVid: false,
        mediaType: "media/mp4",
        voice: voice,
      }), // Make sure JSON data
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        return typeof res === "string"
          ? setComplete(successMessage) // AWS Lambda returns string if successful
          : setError(errorMessage); // If AWS services are not running
      })
      .then(() => setSubmitting(false)) // Should be inside the fetch scope to avoid jumping ahead
      .catch((error) => {
        console.log(error);
        setError(error);
        setSubmitting(false); // Still set to false when fetch fails
      });
  };

  return (
    <AppStyled>
      <div className="App">
        <Helmet>
          <meta charSet="utf-8" />
          <title>MediaTE</title>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Helmet>
        <h1>MediaTE</h1>
        <EmailField setUploadEmail={setUploadEmail} />
        <UploadTextField
          setUploadText={setUploadText}
          voice={voice}
          setVoice={setVoice}
        />
        <VideoUploader />

        <div className="submit-btn">
          {submitting ? (
            <CustomBeatLoader submitting={submitting} />
          ) : (
            <form onSubmit={handleSubmit(submit)} className="uploads">
              <Button type="submit" variant="contained" color="primary">
                Upload
              </Button>
            </form>
          )}
        </div>
      </div>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.6;
  transition: all 1s ease;

  .submit-btn {
    margin-top: 1rem;
  }

  .form-label {
    // Adding to global styles doesn't seem to work
    color: var(--font-light-color);
  }

  .text-field {
    width: 100%;
  }

  textarea,
  label,
  #voice-native-helper,
  .MuiSvgIcon-root.MuiNativeSelect-icon,
  .MuiFormHelperText-root.MuiFormHelperText-filled {
    color: var(--font-light-color);
  }

  .form-control {
    margin-top: 1rem;
  }

  .MuiOutlinedInput-root {
    fieldset,
    .Mui-focused fieldset {
      border-color: var(--font-light-color);
    }

    &:hover fieldset {
      border-color: var(--success-color);
    }
  }

  // When text field is focused, keep green color
  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: var(--success-color);
  }

  .MuiInput-underline:after {
    border-bottom: 2px solid var(--success-color);
  }
`;

export default App;
