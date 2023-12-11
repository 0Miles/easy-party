import NProgressDone from "@/components/nprogress-done";

export default function NotFound() {
    return (
        <>
            <NProgressDone />
            <div style={{fontFamily: "system-ui, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"" }}
                className="flex flex:col align-items:center justify-content:center h:100vh fixed inset:0 pointer-events:none">
                <div className="flex align-items:center justify-content:center h:49 overflow:clip">
                    <h1 className="m:0|20|0|0 p:0|23|0|0 f:24 font-weight:500 line-height:49 border-right:1|solid|rgba(255,255,255,.3)">404</h1>
                    <h2 className="f:14 font-weight:400 line-height:49">This page could not be found.</h2>
                </div>
            </div>
        </>
    )
}