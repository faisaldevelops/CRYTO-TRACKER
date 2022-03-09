import { Button, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { numberWithCommas } from '../components/Banner/Carousel';
import CoinInfo from '../components/CoinInfo';
import { SingleCoin } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { db } from '../firebase';
// import ReactHtmlParser from 'react-html-parser';   //Doesn't work on React 17

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState()

  const { currency, symbol, user, watchlist, setAlert } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id))

    setCoin(data)
  };
  
  console.log(coin);

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  
  const useStyles = makeStyles((theme)=> ({
    container: {
      display: "flex",
      [theme.breakpoints.down("md")] : {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
    },
    heading : {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "Start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      //Making it Responsive
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("md")]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },

  }));

  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist",user.uid);
    try {
      await setDoc(coinRef,{
            coins:watchlist?[...watchlist, coin.id]:[coin?.id],
          });
      setAlert({
        open: true,
        message: `${coin.name} Added to the Watchlist`,
        type: 'success',
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
      
    }
  };

  const removeFromWatchlist =  async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(coinRef, {
        coins: watchlist.filter((watch) => watch !== coin?.id)},
        {merge: "true"}  
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist`,
        type: "success",
      })
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });  
    }
  };

  const classes = useStyles();
  
  if(!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src= {coin?.image.large}
          alt = {coin?.name}
          height="200"
          style={{ marginBottom:20 }}
        />
        <Typography variant="h3" className={classes.heading}>
          {coin?.name}
        </Typography>
        <Typography variant='subtitle1' className={classes.description} dangerouslySetInnerHTML={{__html: coin?.description.en.split('.', 3)+'.' }}>
          {/* {ReactHtmlParser(coin?.description.en.split(".")[0])}. */}
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: 'flex'}}>
            <Typography variant='h5' className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant='h5'
              style={{
                fontFamily: 'Montserrat',
              }}
            >
              {coin?.market_cap_rank}
            </Typography>
          </span>
          <span style={{ display: 'flex'}}>
            <Typography variant='h5' className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant='h5'
              style={{
                fontFamily: 'Montserrat',
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: 'flex'}}>
            <Typography variant='h5' className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant='h5'
              style={{
                fontFamily: 'Montserrat',
              }}
            >
              { symbol }{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0,-6)
              )}
              M
            </Typography>
          </span>

          {user && (
            <Button
              variant = "outlined"
              style={{
                width: "100%",
                height: 40,
                backgroundColor: inWatchlist ? "#FF0000" : "#EEBC1D"
              }}
              onClick = { inWatchlist ? removeFromWatchlist : addToWatchlist }
            >
              { inWatchlist ? "Remove from Watchlist" : "Add to Watchlist" }
            </Button>
          )}
        </div>
       
      </div>

      {/* Chart */}
      <CoinInfo coin={coin} />

    </div>
  )
}

export default CoinPage;