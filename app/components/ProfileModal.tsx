"use client";


export default function ProfileModal({


open,
onClose,
children,


}:{


open:boolean;


onClose:()=>void;


children:React.ReactNode;


}){


if(!open){


return null;


}


return(


<>


{/* 黒背景 */}


<div
style={styles.overlay}


onClick={onClose}
/>




{/* popup */}


<div
style={styles.modal}
>


{/* 閉じる */}


<button
style={styles.closeButton}


onClick={onClose}
>


✕


</button>




{children}


</div>


</>


);


}




const styles:any={


overlay:{


position:"fixed",


top:0,
left:0,


width:"100vw",
height:"100vh",


background:
"rgba(0,0,0,.5)",


zIndex:5000,


},




modal:{


position:"fixed",


top:"50%",
left:"50%",


transform:
"translate(-50%,-50%)",


width:"88%",


maxWidth:"360px",


height:"80vh",


background:"#ffffffff",


borderRadius:
"30px",


display:"flex",


flexDirection:"column",


padding:"30px",


zIndex:5001,


},




closeButton:{


position:"absolute",


top:"18px",


left:"18px",


width:"30px",
height:"30px",


borderRadius:
"999px",


border:"none",


background:"#ffffffff",


color:"#E0DCD5",


fontSize:"18px",

fontWeight:800,


cursor:"pointer",


}


};

