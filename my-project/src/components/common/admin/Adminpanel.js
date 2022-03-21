import React, { useState, useEffect } from "react";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";

const Adminpanel = () => {
  const [sellers, setSellers] = useState();
  const [users, setUsers] = useState();
  const [buyers, setBuyers] = useState();
  const [items, setItems] = useState();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState("");

  const fetchBuyers = () => {
    axios({
      method: "get",
      url: "http://localhost:8080/api/admin/getbuyer",
      headers: {
        authorization: localStorage.getItem("admin_token"),
      },
    })
      .then((res) => {
        console.log(res.data);
        setBuyers(res.data);
      })
      .catch((err) => {
        console.log("item list", err);
      });
  };

  const fetchUsers = () => {
    axios({
      method: "get",
      url: "http://localhost:8080/api/admin/getuser",
      headers: {
        authorization: localStorage.getItem("admin_token"),
      },
    })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log("seller list", err);
      });
  };

  const fetchSellers = () => {
    axios({
      method: "get",
      url: "http://localhost:8080/api/admin/getseller",
      headers: {
        authorization: localStorage.getItem("admin_token"),
      },
    })
      .then((res) => {
        console.log("seller", res.data);
        setSellers(res.data);
      })
      .catch((err) => {
        console.log("seller list", err);
      });
  };

  const SuspendUser = (user) => {
    axios({
      method: "put",
      url: `http://localhost:8080/api/admin/suspend/${user}`,
      headers: {
        authorization: localStorage.getItem("admin_token"),
      },
    })
      .then((res) => {
        console.log(res.data);
        NotificationManager.success(res.data.msg || "success");
        fetchUsers();
      })
      .catch((err) => {
        console.log("seller list", err);
      });
  };

  const VerifySeller = (seller) => {
    axios({
      method: "put",
      url: `http://localhost:8080/api/admin/verify-seller/${seller}`,
      headers: {
        authorization: localStorage.getItem("admin_token"),
      },
    })
      .then((res) => {
        NotificationManager.success(res.data.msg || "success");
        fetchSellers();
      })
      .catch((err) => {
        console.log("seller list", err);
      });
  };

  const VerifyBuyer = (buyer) => {
    axios({
      method: "put",
      url: `http://localhost:8080/api/admin/verify-buyer/${buyer}`,
      headers: {
        authorization: localStorage.getItem("admin_token"),
      },
    })
      .then((res) => {
        NotificationManager.success(res.data.msg || "success");
        fetchBuyers();
      })
      .catch((err) => {
        console.log("seller list", err);
      });
  };

  const VerifyItem = (item) => {
    axios({
      method: "put",
      url: `http://localhost:8080/api/admin/verify-items/${item}`,
      headers: {
        authorization: localStorage.getItem("admin_token"),
      },
    })
      .then((res) => {
        NotificationManager.success(res.data.msg || "success");
        fetchItems();
      })
      .catch((err) => {
        console.log("property", err);
      });
  };

  const sendNotifications = (msg) => {
    NotificationManager.success(msg);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const fetchItems = () => {
    axios({
      method: "get",
      url: "http://localhost:8080/api/admin/getitems",
      headers: {
        authorization: localStorage.getItem("admin_token"),
      },
    })
      .then((res) => {
        console.log(res.data);
        setItems(res.data);
      })
      .catch((err) => {
        console.log("item list", err);
      });
  };

  useEffect(() => {
    fetchBuyers();
    fetchUsers();
    fetchItems();
    fetchSellers();
  }, []);

  return (
    <div className="h-screen w-screen bg-red-400 flex">
      <div className="w-1/3 bg-blue-500 h-full flex flex-col items-center  px-4">
        <h2 className="text-4xl font-bold ">Admin</h2>
        <div
          className="h-24 w-full bg-gray-100 mt-8 flex items-center justify-center text-xl font-semibold"
          onClick={() => setCurrentView("users")}
        >
          Users
        </div>
        <div
          className="h-24 w-full bg-gray-100 mt-8 flex items-center justify-center text-xl font-semibold"
          onClick={() => setCurrentView("buyers")}
        >
          Buyers
        </div>
        <div
          className="h-24 w-full bg-gray-100 mt-8 flex items-center justify-center text-xl font-semibold"
          onClick={() => setCurrentView("sellers")}
        >
          Sellers
        </div>
        <div
          className="h-24 w-full bg-gray-100 mt-8 flex items-center justify-center text-xl font-semibold"
          onClick={() => setCurrentView("items")}
        >
          Items
        </div>
      </div>
      <div className="w-full bg-yellow-500 h-full p-4 flex flex-col items-start">
        <div className="w-full h-24 bg-gray-900 flex items-center justify-start p-4 mb-8">
          <div className="text-center text-gray-100">
            <h2 className="text-3xl font-bold">{users?.length}</h2>
            <p>Buyers</p>
          </div>
          <div className="text-center ml-16 text-gray-100">
            <h2 className="text-3xl font-bold">{sellers?.length}</h2>
            <p>Sellers</p>
          </div>
          <div className="text-center ml-16 text-gray-100">
            <h2 className="text-3xl font-bold">{items?.length}</h2>
            <p>Items</p>
          </div>
        </div>
        {currentView === "users" && (
          <div className="w-full">
            {users?.map((user) => (
              <div className="bg-gray-200 px-2 py-2 my-1 w-full flex items-center justify-between w-full">
                <p>{user.email}</p>
                <p>{user.fullName}</p>
                <p>{user.role}</p>
                <div>
                  {user && user?.isSuspended ? (
                    <button
                      className="bg-green-400 py-1 px-2 text-xs mx-2 rounded-md cursor-pinter hover:bg-green-500 text-white"
                      onClick={() => {
                        SuspendUser(user?._id);
                      }}
                    >
                      UnSuspend
                    </button>
                  ) : (
                    <button
                      className="bg-red-400 py-1 px-2 text-xs mx-2 rounded-md"
                      onClick={() => {
                        SuspendUser(user?._id);
                      }}
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {currentView === "buyers" && (
          <div className="w-full">
            {buyers?.map((user) => (
              <div className="bg-gray-200 px-2 py-2 my-1 w-full flex items-center justify-between w-full">
                <p>{user.email}</p>
                <p>{user.fullName}</p>
                <p>{user.role}</p>
                <div>
                  {user && user?.isVerified ? (
                    <button
                      className="bg-green-400 py-1 px-2 text-xs mx-2 rounded-md"
                      onClick={() => {
                        sendNotifications("User already Verified");
                      }}
                    >
                      Already Verified
                    </button>
                  ) : (
                    <button
                      className="bg-green-400 py-1 px-2 text-xs mx-2 rounded-md"
                      onClick={() => {
                        VerifyBuyer(user?._id);
                      }}
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentView === "sellers" && (
          <div className="w-full">
            {sellers?.map((user) => (
              <div className="bg-gray-200 px-2 py-2 my-1 w-full flex items-center justify-between w-full">
                <p>{user.email}</p>
                <p>{user.fullName}</p>
                <p>{user.role}</p>
                <div>
                  {user && user?.isVerified ? (
                    <button
                      className="bg-green-400 py-1 px-2 text-xs mx-2 rounded-md"
                      onClick={() => {
                        sendNotifications("User already Verified");
                      }}
                    >
                      Already Verified
                    </button>
                  ) : (
                    <button
                      className="bg-green-400 py-1 px-2 text-xs mx-2 rounded-md"
                      onClick={() => {
                        VerifySeller(user?._id);
                      }}
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentView === "items" && (
          <div className="w-full">
            {items?.map((item) => (
              <div className="bg-gray-200 px-2 py-2 my-1 w-full flex items-center justify-between">
                <p>{item.title}</p>
                <p>{item.base_price}</p>
                <p>{item.category}</p>
                {item && item?.isVerified ? (
                  <button
                    className="bg-green-400 py-1 px-2 text-xs mx-2 rounded-md"
                    onClick={() => {
                      sendNotifications("User already Verified");
                    }}
                  >
                    Already Verified
                  </button>
                ) : (
                  <button
                    className="bg-green-400 py-1 px-2 text-xs mx-2 rounded-md"
                    onClick={() => {
                      VerifyItem(item?._id);
                    }}
                  >
                    Verify Item
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <button
          className="bg-green-600 hover:background-green-700 text-white p-2 rounded-lg mt-10"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Adminpanel;
