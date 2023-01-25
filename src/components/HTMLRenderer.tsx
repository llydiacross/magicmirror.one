//import react and prop-types
import React from "react";
import PropTypes from "prop-types";

//create a react component that takes html code as a string and renders it
function HTMLRenderer({ thatHtml, style }) {
  let _html = `
    <html>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@2.47.0/dist/full.css"
          rel="stylesheet"
          type="text/css"
        />
        <style>
           ::-webkit-scrollbar{
                direction: rtl; 
                overflow: auto; 
                width: 12px;
                padding: 6px;
             } 

/* Track */
::-webkit-scrollbar-track {
    direction: rtl; 
  background: #f1f1f1; 
}

/* Handle */
::-webkit-scrollbar-thumb {
    direction: rtl; 
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    direction: rtl; 
  background: #555; 
}
          html, body {
            margin: 0;
            padding: 0;
          }
        </style>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 600px; min-height: 400px; display: none; z-index: 50;" id="box">  
          <div style="border-radius: 15px; background-color: white;">
            <div style="background-color: #1a202c; border-radius: 15px 15px 0 0;">   
              <div style="padding: 1rem;">
                <div style="color: white; font-size: 1.5rem;">
                  <div style="font-weight: bold;">You have tried to navigate away...</div>
                </div>
              </div>
            </div>
            <div style="padding: 1rem;">
              <div style="font-size: 1.25rem;">
                <div style="font-weight: bold; color: black;">Are you sure you would like to goto <u><span id="location"></span></u>?
                </div>
                <div style="display: flex; flex-direction: row; justify-content: center; margin-top: 1rem;">
                  <button class="btn btn-primary" style="margin-right: 1rem;" onClick='window.location.href = document.getElementById("location").innerHTML'>Yes</button>
                  <button class="btn btn-error" style="margin-left: 1rem;" onClick='document.getElementById("box").style.display = "none"'>No</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      <script>
        document.body.innerHTML = document.body.innerHTML + \`${thatHtml}\`;
      
        //remove all href tags from all links in the body
        let links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
          links[i].onclick = (e) => {
            e.preventDefault();

            if (e.target?.getAttribute("href")[0] === "#")
              return;

            //show box
            let box = document.getElementById("box");
            box.style.display = "block";
            //set location
            let location = document.getElementById("location");
            location.innerHTML = e.target.getAttribute("href");
          }
        }
      </script>
    </html>`;

  return (
    <iframe
      style={style}
      srcDoc={_html}
      title="preview"
      sandbox="allow-links allow-same-origin allow-scripts"
      className="w-full h-full block border-l-1 border-black overflow-scroll"
    ></iframe>
  );
}

HTMLRenderer.propTypes = {
  html: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default HTMLRenderer;
