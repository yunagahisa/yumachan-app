import "./globals.css";
import { Assistant } from "next/font/google";

const assistant = Assistant({

  subsets:["latin"],

  weight:[
    "400",
    "500",
    "600",
    "700"
  ],

});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="ja">

      <body
        className={assistant.className}
        style={styles.body}
      >

        <div style={styles.background}>

          <div style={styles.phoneContainer}>

            {children}

          </div>

        </div>

      </body>

    </html>
  );
}

const styles = {

  body: {

    margin:0,

    letterSpacing:"0.03em",

  },

  background:{

    minHeight:"100vh",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    backgroundColor:"#F0F2F5",

    backgroundImage:
      `
      linear-gradient(#FFF 0px, transparent 0px),
      linear-gradient(
      90deg,
      #FFF 0px,
      transparent 0px
      )
      `,

    backgroundSize:
      "36px 36px",

  },

  phoneContainer:{

  width:"100%",

  maxWidth:"350px",

  height:"100dvh",

  background:"#fff",

  overflow:"hidden",

  position:"relative",

  boxShadow:
    "0 0 0px rgba(0,0,0,0)",

}

};