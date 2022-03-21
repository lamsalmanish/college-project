import img from "../../img/background.jpg";
import { HiCurrencyRupee } from "react-icons/hi";
import {
  AiOutlineClockCircle,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NotificationManager from "react-notifications/lib/NotificationManager";
const moment = require("moment");

export const Cards = ({ bid, imageURL }) => {
  const [image, setImage] = useState(null);
  const [favorite, setFavorite] = useState(false);
  useEffect(() => {
    if (bid) {
      setImage(bid.images[0]);
    }
  }, []);

  const expire_date = moment(bid?.expiry_date).format();
  const start_date = moment(bid?.start_date).format();
  const current_date = moment(Date.now()).format();
  const current_condition =
    current_date > expire_date ? 2 : current_date < start_date ? 1 : 0;

  const addFav = (itemId) => {
    axios({
      method: "post",
      url: "http://localhost:8080/api/buyer/fav",
      data: { itemId },
      headers: {
        token: localStorage.getItem("utoken"),
      },
    })
      .then((res) => {
        // console.log(res.data);
        console.log(res.data.msg);
        NotificationManager.success(res.data.msg);
      })
      .catch((err) => {
        console.log("add to fav", err);
      });
  };

  return (
    <div>
      <div className="w-60 h-82 rounded-sm shadow-lg m-16">
        <div className="h-32 bg-cover hover:bg-gray w-full bg-red-200 relative">
          <div
            className={`left-0 top-0 py-1 px-2 text-gray-100 text-xs absolute ${
              current_condition === 2
                ? "bg-red-800/[.8]"
                : current_condition === 1
                ? "bg-blue-800/[.8]"
                : "bg-green-800/[.8]"
            } rounded-br-lg`}
          >
            {current_date > expire_date
              ? "Expired"
              : current_date < start_date
              ? "Upcoming"
              : "Active"}
          </div>
          <div className="right-0 top-0 p-2 absolute bg-gray-800 rounded-bl-lg">
            {favorite ? (
              <AiFillHeart
                className="text-gray-200 text-lg cursor-pointer"
                onClick={() => {
                  setFavorite(!favorite);
                  addFav(bid?._id);
                }}
              />
            ) : (
              <AiOutlineHeart
                className="text-gray-200 text-lg cursor-pointer"
                onClick={() => {
                  setFavorite(!favorite);
                  addFav(bid?._id);
                }}
              />
            )}
          </div>
          <img
            src={image ? `${imageURL}${image}` : img}
            className="h-full w-full"
          />
        </div>
        <Link to={`/details/${bid?._id}`}>
          <div className="mx-6 my-4 border-b border-gray-light">
            <div className="font-medium text-base text-gray-darker mb-4 max-w-20">
              {bid?.title ||
                "Antique Motorbike from 1970's is at auction at very reasonable price"}
            </div>
            <p className="font-normal text-gray-dark text-sm mb-2 flex justify-between">
              <HiCurrencyRupee size={30} color="green" />
              <span className="font-bold">
                {" "}
                NRS. {bid?.base_price || "50,000"}
              </span>
            </p>
            <p className="font-normal text-gray-dark text-sm mb-4 flex justify-between mt-5">
              <AiOutlineClockCircle size={30} color="teal" />
              <span className="font-bold">
                {bid?.start_date?.split("T")[0] || "2022/1/1"}
              </span>
            </p>
            <p className="font-normal text-gray-dark text-sm mb-4 flex justify-between mt-5">
              <AiOutlineClockCircle size={30} color="red" />
              <span className="font-bold">
                {bid?.expiry_date?.split("T")[0] || "2022/1/1"}
              </span>
            </p>
          </div>
          <div className="flex justify-around py-2">
            {/* <div>
            <FiHeart size={25} color="red" />
          </div>
          <div>
            <FiEye size={25} color="green" />
          </div> */}
            <div className="text-teal-700">View Details</div>
          </div>
        </Link>
      </div>
    </div>
  );
};
