import { useEffect, useState } from "react";
import "./App";
import axios from "axios";
import Swal from "sweetalert2";
const App = () => {
  const [user, setUser] = useState();

  const token = localStorage.getItem("token");
  const LoggedUser = localStorage.getItem("user");

  console.log(token,LoggedUser)


  const handleSubmit = (e) => {
    e.preventDefault();
    const userName = e.target[0].value;
    const password = e.target[1].value;
    const user = { userName, password };

    setUser(user);
  };

  useEffect(() => {
    console.log(user);
    axios
      .post("https://restaurantapi.bssoln.com/api/Auth/SignIn", user)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Welcome to BSS Restaurant",
          });

          const token = "Bearer " + res.data.token;
          const user = res.data.user;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .catch((err) => console.log(err));
  }, [user]);

  // if(token){
  //   console.log(token)
  //   window.location.href = "/dashboard";
  // }

  return (
    <div
      className="bg-cover bg-no-repeat bg-center w-screen"
      style={{
        background: `linear-gradient(0deg,rgba(255,255,255,.6),rgb(255,255,255)),url('../src/assets/img/dash-bg.png')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "white",
      }}
    >
      <div className="h-screen grid grid-cols-1 lg:grid-cols-2 items-center justify-center lg:gap-20 ">
        <div>
          <div
            className=" w-full max-h-full hidden lg:flex justify-center items-center "
            style={{
              backgroundImage: "url('../src/assets/img/food-bg2.png')",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div>
              <img
                src="../src/assets/img/login-bg.png"
                className="max-w-[600px] max-h-[600px] animate-spin-slow"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="mx-auto w-full  px-12">
          <div className=" lg:w-[500px] border p-5 bg-[#f1f1f1] rounded-xl">
            <div>
              <img
                src="../src/assets/logo.png"
                alt=""
                className="w-[110px] mx-auto"
              />
              <p className="text-center text-3xl">
                <span
                  className="text-3xl font-black"
                  style={{
                    color: "white",
                    WebkitTextFillColor: "white",
                    WebkitTextStroke: "1.5px red",
                    fontSize: "32px",
                    fontWeight: "bolder",
                  }}
                >
                  BSS RESTAURANT
                </span>
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black text-xl font-medium">
                    Username
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  defaultValue={"admin@mail.com"}
                  className="input border-2 border-black bg-gray-300 text-black"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black text-xl font-medium">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  defaultValue={"Admin@123"}
                  className="input  border-2 border-black bg-gray-300 text-black"
                />
              </div>
              <div className="form-control mt-6">
                <input
                  type="submit"
                  value="Login"
                  className="btn bg-red-700 text-white py-2 text-xl hover:bg-red-800"
                />
              </div>
            </form>
            <div className="w-full flex items-center justify-center">
              <button className=" text-red-700 text-center mt-4 hover:underline">
                Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

// <div
//           className=" drop-shadow-xl"
//             style={{
//               backgroundImage: "url('../src/assets/img/food-bg2.png')",
//               backgroundRepeat: "no-repeat",
//               backgroundPosition: "center",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "600px",
//               width: "1000px",
//               backgroundSize:'cover'
//             }}
//           >
//             <img
//               src={loginImage}
//               alt="RotatingImage"
//               className="w-[50%] animate-spin-slow"
//             />
//           </div>
