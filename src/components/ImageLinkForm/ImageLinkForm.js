import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onPictureSubmit }) => {
  return (
    <div>
      <p className="f3">
        We'll magically detect faces in your pictures
        <span role="img" aria-label="Wink">
          😉
        </span>
      </p>
      <div className="center">
        <div className="center form pa4 br3 shadow-5">
          <input
            onChange={onInputChange}
            type="text"
            className="f4 pa2 w-70 center"
            placeholder="Paste Image Link Here..."
          />
          <button
            onClick={onPictureSubmit}
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
