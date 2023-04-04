import React, { Fragment, useState } from "react";
import "./Shipping.css";
import { Country, State } from "country-state-city";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useAlert } from "react-alert";
import { useDispatch } from "react-redux";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocationCityRoundedIcon from "@mui/icons-material/LocationCityRounded";
import PinDropRoundedIcon from "@mui/icons-material/PinDropRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import TransferWithinAStationRoundedIcon from "@mui/icons-material/TransferWithinAStationRounded";
import CheckoutSteps from "./CheckoutSteps";
import { saveShippingInfo } from "../../actions/cartActions";

const Shipping = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber);
  const [country, setCountry] = useState(shippingInfo.country);
  const [state, setState] = useState(shippingInfo.state);

  const shippingSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      alert.error("Phone number must be 10 digits");
      return;
    }
    dispatch(
      saveShippingInfo({ address, city, pinCode, phoneNumber, country, state })
    );
    navigate("/order/confirm");
  };

  return (
    <Fragment>
      <MetaData title="Shipping Details" />

      <CheckoutSteps activeStep={0} />

      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>

          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >
            <div>
              <HomeRoundedIcon />
              <input
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <LocationCityRoundedIcon />
              <input
                type="text"
                placeholder="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <PinDropRoundedIcon />
              <input
                type="number"
                placeholder="Pin Code"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>

            <div>
              <LocalPhoneRoundedIcon />
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                size="10"
              />
            </div>

            <div>
              <PublicRoundedIcon />

              <select
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Country</option>
                {Country &&
                  Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {country && (
              <div>
                <TransferWithinAStationRoundedIcon />

                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
              disabled={state ? false : true}
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
