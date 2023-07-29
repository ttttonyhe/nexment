import * as React from "react"
import { createRoot } from "react-dom/client"
import Nexment from "nexment"

const App = () => {
	const config = {
		pageKey: "demoPage",
		enableLinkInput: true,
		enableReplyListModal: false,
		leancloud: {
			appId: "6Kcb9HB1iOR87HUbAvnMyUER-gzGzoHsz",
			appKey: "zf3gAf9CGIHLL8Crctb0sJLV",
			serverURL: "https://leancloud.ouorz.com",
		},
		admin: {
			name: "TonyHe",
			email: "he@holptech.com",
		},
	}
	return (
		<div className="example-container">
			<div className="title-div">
				<div className="div-1">
					<img src="https://i.loli.net/2020/08/18/qHVT3oi2v7AtMR6.png" />
					<h1>Nexment</h1>
				</div>
				<div>
					<a href="https://nexment-vue-demo.ouorz.com" target="_blank">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="26"
							height="26"
							className="svg-1"
						>
							<path fill="none" d="M0 0h24v24H0z" />
							<path
								d="M1 3h4l7 12 7-12h4L12 22 1 3zm8.667 0L12 7l2.333-4h4.035L12 14 5.632 3h4.035z"
								fill="rgba(52,72,94,1)"
							/>
						</svg>
					</a>
					<a href="https://github.com/ttttonyhe/nexment" target="_blank">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="26"
							height="26"
							className="svg-2"
						>
							<path fill="none" d="M0 0h24v24H0z"></path>
							<path
								d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
								fill="rgba(52,72,94,1)"
							></path>
						</svg>
					</a>
				</div>
			</div>
			<div className="nexment-div">
				<Nexment config={config} />
			</div>
			<style>
				{`
        body{
          margin:0px;
        }
        .example-container{
          width: 96%;
          margin: 2%;
          min-height: 100vh;
        }
        @media screen and (min-width:1000px){
          .example-container{
            width:650px;
            margin:0 auto;
            padding: 20px;
            border-left: 1px solid #eee;
            border-right: 1px solid #eee;
            min-height: 100vh;
          }
        }
        .switch-div {
          display: flex;
          background: #f7f8f9;
          padding: 1.1px 0.2px;
          border-radius: 6px;
          height: 33px;
          margin: 5px 8px 20px 8px;
        }
        .btn-left,
        .switch-div {
          transition: 0.1s ease-in-out;
        }
        .btn-left {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding-left: 0;
          color: #999;
          padding-right: 0;
          cursor: pointer;
        }
        .btn-select {
          box-shadow: 0 0 3px #e1e4e8;
          padding: 5px 0;
          font-weight: 600;
          font-family: sans-serif;
          border-radius: 6px;
          background: #fff !important;
          color: #555 !important;
        }
        .btn-right,
        .btn-select {
          transition: 0.1s ease-in-out;
        }
        .btn-right {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #999;
          padding-left: 0;
          padding-right: 0;
          cursor: pointer;
        }
        .title-div {
          display: flex;
          margin-bottom: 12px;
        }
        .title-div a{
          text-decoration: none !important;
        }
        .title-div .div-1 {
          display: flex;
          flex: 1;
        }
        .title-div .div-1 img {
          width: 50px;
          height: 50px;
        }
        .title-div .div-1 h1 {
          margin: 0;
          font-size: 30px;
          padding-top: 3px;
          margin-left: 5px;
        }
        .title-div .svg-1 {
          border-right: 1px solid #eee;
          padding-right: 8px;
          margin-right: 6px;
        }
        .title-div .svg-2 {
          margin-top: 13px;
          margin-right: 6px;
        }
        .nexment-div {
          padding: 0 8px;
        }
        `}
			</style>
		</div>
	)
}

const container = document.getElementById("root")
const root = createRoot(container!)
root.render(<App />)
