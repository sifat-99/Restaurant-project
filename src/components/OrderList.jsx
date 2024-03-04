/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardContent, Typography, Grid, Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import ApiCall from "./apiCollection/ApiCall";
import Paper from "@mui/material/Paper";
import "../styles/CommonStyle.css";
import useTable from "../hooks/useTable.jsx";
import CheckCard from "./Card.jsx";
import Button from "@mui/material/Button";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import useCart from "../hooks/useCart.jsx";
import CartComponent from "./CartComponent.jsx";

const OrderList = () => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(null);
  const loader = useRef(null);
  const { data: table } = useTable(0, 10);
  const [checkedCard, setCheckedCard] = useState(null);
  const [localCartData, setLocalCartData] = useState([]);
  localStorage.setItem("cartLength", localCartData?.length);

  // const { updateCartLengthManually } = useCart();

  useEffect(() => {
    const cartData = localStorage.getItem("cartData");
    setLocalCartData(JSON.parse(cartData));
  }, []);

  const handleCheckChange = (id) => {
    setCheckedCard(id === checkedCard ? null : id);
    localStorage.removeItem("cartData");
    setLocalCartData([]);
    // updateCartLengthManually(0);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${ApiCall.baseUrl}food/datatable?page=1&per_page=10`
        );
        setMenuData(response.data.data);
        setLastPage(response.data.next_page_url);
      } catch (error) {
        console.error("Error fetching initial menu data:", error);
      }
    };
    fetchData();
  }, []);

  console.log(menuData);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    function handleObserver(entities) {
      const target = entities[0];
      if (target.isIntersecting && checkedCard) {
        if (lastPage && !loading) {
          fetchMenuData();
        }
      }
    }

    return () => observer.disconnect();
  }, [lastPage, loading, checkedCard]);

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(lastPage);
      setMenuData((prevData) => [...prevData, ...response.data.data]);
      setLastPage(response.data.next_page_url);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCard = (newData) => {
    let existingData = localStorage.getItem("cartData");
    if (existingData) {
      existingData = JSON.parse(existingData);
      const isItemAlreadyInCart = existingData.some(
        (item) => item.id === newData.id
      );
      if (isItemAlreadyInCart) {
        console.log("Item with id " + newData.id + " is already in the cart.");
        return;
      }
    } else {
      existingData = [];
    }
    existingData.push(newData);

    const updatedData = JSON.stringify(existingData);

    localStorage.setItem("cartData", updatedData);
    <CartComponent data={existingData?.length}></CartComponent>
    // updateCartLengthManually(existingData?.length);
    setLocalCartData(existingData);


    console.log("Cart updated with new data:", newData);
  };
  const localCard = localStorage.getItem("cartData");
  const parsedCartData = JSON.parse(localCard);

  console.log(parsedCartData);
  return (
    <>
      <Paper className="mainPaperStyle">
        
        <div className="page-top">
          <div>
            <span className="under-line page-title">Order Food</span>
          </div>
          <div>{/* Search container here */}</div>
        </div>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item xs={3} className="relative">
              <div className="absolute top-4 bg-white text-black border-2 border-red-500 w-[88%] lg:w-[96%] p-2">
                SELECT FOODS {menuData.length}
              </div>
              <Card
                style={{
                  height: "75vh",
                  overflowY: "auto",
                  padding: "10px",
                  scrollbarWidth: "thin",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  paddingTop: "50px",
                }}
              >
                {table.slice(0, 3).map((menuItem, index) => (
                  <CheckCard
                    key={index}
                    menuItem={menuItem}
                    menuImage={menuItem.image}
                    checked={menuItem.id === checkedCard}
                    onChange={handleCheckChange}
                  />
                ))}
              </Card>
            </Grid>
            {checkedCard ? (
              <Grid item xs={9}>
                <Container
                  sx={{
                    position: "fixed",
                    paddingBottom: "20px",
                    height: "50px",
                  }}
                ></Container>
                <Container className="relative">
                  <Card
                    style={{
                      height: "75vh",
                      width: "auto",
                      overflowY: "auto",
                      padding: "10px",
                      scrollbarColor: "white",
                      scrollbarWidth: "thin",
                    }}
                  >
                    <div className="absolute top-0 left-4 lg:left-6 bg-white text-black border-2 border-red-500 w-[88%] lg:w-[95%] p-2">
                      SELECT FOODS {menuData.length}
                    </div>
                    <div className="mt-12 ">
                      {menuData.map((menuItem) => (
                        <Card
                          key={menuItem.id}
                          style={{
                            marginBottom: "10px",
                            cursor: "pointer",
                            transition: "border-color 0.3s ease",
                            border: "1px solid transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "red";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "transparent";
                          }}
                        >
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={3}>
                                <img
                                  src={`https://restaurantapi.bssoln.com/images/food/${menuItem?.image}`}
                                  alt="Image"
                                  className="rounded-full hover:animate-spin-slow w-[190px] h-[190px]"
                                />
                              </Grid>
                              <Grid
                                item
                                xs={9}
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  margin: "auto 0px",
                                  gap: "10px",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  component="h2"
                                  sx={{ color: "black", fontWeight: "bolder" }}
                                >
                                  {menuItem.name}
                                </Typography>
                                <Typography color="text.primary">
                                  {menuItem.description}
                                </Typography>
                                {menuItem.discountPrice ? (
                                  <div>
                                    <Typography
                                      variant="h6"
                                      component="h2"
                                      style={{
                                        textDecoration: "2px line-through",
                                        color: "red",
                                        fontWeight: "bolder",
                                      }}
                                    >
                                      Price: {menuItem.price}
                                    </Typography>
                                    <div className="flex justify-between">
                                      <Typography
                                        style={{
                                          color: "green",
                                        }}
                                      >
                                        Discounted Price:{" "}
                                        <span className="font-extrabold">
                                          {menuItem.discountPrice}৳
                                        </span>
                                      </Typography>
                                      <Button
                                        variant="contained"
                                        style={{
                                          backgroundColor: localCartData?.some(
                                            (item) => item.id === menuItem.id
                                          )
                                            ? "green"
                                            : "red",
                                          color: "white",
                                          fontWeight: "bold",
                                        }}
                                        onClick={() => {
                                          handleAddToCard(menuItem);
                                        }}
                                      >
                                        Add To Cart
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <Typography
                                      variant="h6"
                                      component="h2"
                                      style={{
                                        color: "black",
                                        fontWeight: "bolder",
                                      }}
                                    >
                                      Price: {menuItem.price}৳
                                    </Typography>
                                    <Button
                                      variant="contained"
                                      style={{
                                        backgroundColor: localCartData?.some(
                                          (item) => item.id === menuItem.id
                                        )
                                          ? "green"
                                          : "red",
                                        color: "white",
                                        fontWeight: "bold",
                                      }}
                                      onClick={() => {
                                        handleAddToCard(menuItem);
                                      }}
                                    >
                                      Add To Cart
                                    </Button>
                                  </div>
                                )}
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {loading && <Typography>Loading...</Typography>}
                    <div ref={loader} />
                  </Card>
                </Container>
              </Grid>
            ) : (
              <Grid item xs={9}>
                <div className="relative h">
                  <Container
                    sx={{
                      position: "absolute",
                      width: "95%",
                      background: "white",
                      color: "black",
                      padding: "10px",
                      borderRadius: "5px",
                      top: "0",
                      left: "0",
                      zIndex: "10",
                      right: "0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <NewReleasesIcon sx={{ fontSize: 70, color: "#b71c1c" }} />
                    <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
                      At First Select A Table!
                    </Typography>
                  </Container>
                  <Container sx={{ opacity: "0.5" }}>
                    <Card
                      style={{
                        height: "75vh",
                        width: "auto",
                        padding: "10px",
                        opacity: 0.5,
                        pointerEvents: "none",
                      }}
                    >
                      <div className=" mt-12 ">
                        {menuData.map((menuItem) => (
                          <Card
                            key={menuItem.id}
                            style={{
                              marginBottom: "10px",
                              cursor: "pointer",
                              transition: "border-color 0.3s ease",
                              border: "1px solid transparent",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "red";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "transparent";
                            }}
                          >
                            <CardContent>
                              <Grid container spacing={2}>
                                <Grid item xs={3}>
                                  <img
                                    src={`https://restaurantapi.bssoln.com/images/food/${menuItem?.image}`}
                                    alt="Image"
                                    className="rounded-full hover:animate-spin-slow w-[190px] h-[190px]"
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={9}
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    margin: "auto 0px",
                                    gap: "10px",
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    component="h2"
                                    sx={{
                                      color: "black",
                                      fontWeight: "bolder",
                                    }}
                                  >
                                    {menuItem.name}
                                  </Typography>
                                  <Typography color="text.primary">
                                    {menuItem.description}
                                  </Typography>
                                  <div>
                                    <Typography
                                      variant="h6"
                                      component="h2"
                                      style={{
                                        textDecoration: "2px line-through",
                                        color: "red",
                                        fontWeight: "bolder",
                                      }}
                                    >
                                      Price: {menuItem.price}
                                    </Typography>
                                    <div className="flex justify-between">
                                      <Typography
                                        style={{
                                          color: "green",
                                        }}
                                      >
                                        Discounted Price:{" "}
                                        <span className="font-extrabold">
                                          {menuItem.discountPrice}৳
                                        </span>
                                      </Typography>
                                      <Button
                                        variant="contained"
                                        style={{
                                          backgroundColor: "red",
                                          color: "white",
                                          fontWeight: "bold",
                                          disabled: true,
                                        }}
                                      >
                                        Add To Cart
                                      </Button>
                                    </div>
                                  </div>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      {loading && <Typography>Loading...</Typography>}
                      <div ref={loader} />
                    </Card>
                  </Container>
                </div>
              </Grid>
            )}
          </Grid>
        </Container>
      </Paper>
    </>
  );
};

export default OrderList;
