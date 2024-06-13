import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { Check, X } from "react-feather";
import "./Description.css";
export default function (props) {
  const input = useRef();
  const [desc, setDesc] = useState("");

  return (
    <div className="local__bootstrap">
      <div className="popover__wrapper">
        <div className="popover__content mb-2">
          <div className="label__heading d-flex justify-content-between my-2 ">
            <p style={{ fontSize: "15px" }} className="text-center">
              <b>Description</b>
            </p>
            <X
              onClick={() => props.onClose(false)}
              style={{ cursor: "pointer", width: "15px", height: "15px" }}
            />
          </div>
          <div className="row">
            <p
              style={{
                color: "#5e6c84",
                display: "block",
                fontSize: "12px",
                fontWeight: "700",
                lineHeight: "16px",
              }}
              className="my-1"
            >
              Description
            </p>
            <div className="col-12 label__input">
              <input
                type="text"
                ref={input}
                placeholder="Description"
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
              />
            </div>
            <div>
              <button
                className="create__btn my-2"
                onClick={() => {
                  if (desc !== "") {
                    props.addDesc(desc);
                    setDesc("");
                    input.current.value = "";
                  } else return;
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
