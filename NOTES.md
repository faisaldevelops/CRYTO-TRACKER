+ src= {coin?.img}    => **?** => THis is for the, if the image doesn't load so we put note of interrogation, else it might cause error if not found

+ ReactHtmlParser didn't work for me, So I used <div dangerouslySetInnerHTML={{__html: coin?.description.en.split('.', 5)+'.' }} /> in `CoinPage.js`

+ ReactHtmlParser is not yet supported on React 17

+ .split(separator, limit)

+ // eslint-disable-next-line react-hooks/exhaustive-deps 
   TO disable the warnings given by react hook useEffect


+  *TO CREATE DARK THEME*  
const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });


+   # To use the breakpoints pass theme parameter to makeStyles, then write the rest of things as shown 
const useStyles = makeStyles((theme)=> ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0, 
      },
    }
  }));


+ # Array.prototype.map() expects a value to be returned at the end of arrow function array-callback-return
just addded else statement and return statement so that warning is removed