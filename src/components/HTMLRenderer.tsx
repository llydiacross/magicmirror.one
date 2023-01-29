/* eslint-disable react/prop-types */
// Import react and prop-types
import React from "react"
import PropTypes from "prop-types"

// Create a react component that takes html code as a string and renders it
function HTMLRenderer ({
  style,
  code = {} as any,
  implicit,
  currentFile,
  stylesheets = [],
  scripts = [],
  meta = []
}) {
  let safeCSS = code.css || ""
  // Remove html tags from savejs code
  safeCSS = safeCSS.replace(/<[^>]*>?/gm, "")

  const head = `
      <head>
        <!--Web.eth Site Builder by Llydia Cross (0x0zAgency) @lydsmas-->
        ${stylesheets.map((sheet) => {
          return `<link href="${sheet}" rel="stylesheet" type="text/css" />`
        })}
        ${meta.map((meta) => {
          return `<${meta.tag} ${meta.properties || ""}>${meta.children}</${
            meta.tag
          }>`
        })}
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
        </style>
        <style>
          ${safeCSS}
        </style>
        ${scripts.map((script) => {
          return `<script src="${script}"></script>`
        })}
      </head>
  `

  let safeJS = code.js || ""
  // Remove script tags from savejs code
  safeJS = safeJS.replace(/<\//g, "")

  const _html = `
    <html>
      ${head}
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
        document.body.innerHTML = document.body.innerHTML + \`${
          code.html || ""
        }\`;
      
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
      <script>
        ${safeJS}
      </script>
    </html>`

  return (
    <iframe
      style={style}
      srcDoc={implicit || _html}
      seamless
      title='preview'
      sandbox='allow-scripts'
      className='w-full h-full block border-l-1 border-black overflow-scroll'
    />
  )
}

HTMLRenderer.propTypes = {
  style: PropTypes.object,
  implicit: PropTypes.string,
  code: PropTypes.any
}

export default HTMLRenderer
