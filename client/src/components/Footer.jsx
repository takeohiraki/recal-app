import React from "react";

// const Footer = () => (
//   <footer className="bg-light p-3 text-center">
//     <h6>Copyright &copy;</h6>
//   </footer>
// );

// export default Footer;


var style = {
  backgroundColor: "#F8F8F8",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  padding: "8px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "60px",
  width: "100%",
  color: "rgb(253, 155, 91)",
}

var phantom = {
display: 'block',
padding: '10px',
height: '40px',
width: '100%',
}

function Footer() {
  return (
      <div>
          <div style={phantom} />
          <div style={style}>
            <footer className="bg-light p-3 text-center">
              <h6>Copyright &copy;</h6>
            </footer>
          </div>
      </div>
  )
}

export default Footer;
