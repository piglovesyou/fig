import { Frame3_31$5 } from "./Frame3_31$5";
import React, { FC, CSSProperties } from "react";
export const Home_2$2: FC<{
  style: CSSProperties,
}> = (props) => {
  return (
    <div
      data-fid="2:2"
      style={{
        ...{
          position: "absolute",
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
        },
        ...props.style,
      }}
      data-fname="Home"
    >
      <div
        data-fid="28:1"
        style={{
          zIndex: 1,
          position: "absolute",
          boxSizing: "border-box",
          top: 26,
          height: 81,
          left: 245,
          width: 70,
        }}
        data-fname="Arrow 1"
      >
        <div
          className="vector"
          dangerouslySetInnerHTML={{
            __html: `<svg preserveAspectRatio="none" width="72" height="82" viewBox="0 0 72 82" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M71.0269 0.464673C71.0068 0.18868 70.7667 -0.0187591 70.4907 0.00134421L65.9931 0.328987C65.7171 0.34909 65.5097 0.589126 65.5298 0.865125C65.5499 1.14112 65.7899 1.34856 66.0659 1.32845L70.0638 1.03722L70.355 5.03508C70.3751 5.31108 70.6152 5.51852 70.8912 5.49841C71.1672 5.4783 71.3746 5.23827 71.3545 4.96227L71.0269 0.464673ZM0.758214 82L70.9062 0.828701L70.148 0.173455L8.66095e-07 81.3448L0.758214 82Z" fill="black"/>
</svg>
`,
          }}
        />
      </div>
      <div
        data-fid="2:5"
        style={{
          zIndex: 0,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          position: "absolute",
          boxSizing: "border-box",
          top: 53,
          height: 122,
          left: 97,
          width: 101,
          backgroundColor: "rgba(0, 0, 0, 0)",
        }}
        data-fname="Frame 2"
      >
        <div
          data-fid="2:3"
          style={{
            zIndex: 0,
            position: "relative",
            boxSizing: "border-box",
            flexGrow: 0,
            alignSelf: "inherit",
            width: 101,
            height: 50,
            backgroundColor: "#c4c4c4",
          }}
          data-fname="Rectangle 1"
        ></div>
        <div
          data-fid="2:4"
          style={{
            zIndex: 1,
            position: "relative",
            boxSizing: "border-box",
            flexGrow: 0,
            alignSelf: "inherit",
            width: 101,
            height: 50,
            backgroundColor: "#c4c4c4",
          }}
          data-fname="Rectangle 2"
        ></div>
      </div>
      <Frame3_31$5
        data-fid="31:6"
        style={{
          zIndex: 2,
          display: "flex",
          flexDirection: "row",
          gap: 11,
          alignItems: "center",
          position: "absolute",
          boxSizing: "border-box",
          top: 215,
          height: 28,
          left: 220,
          width: 95,
          backgroundColor: "rgba(0, 0, 0, 0)",
        }}
        data-fname="row direction"
      ></Frame3_31$5>
      <Frame3_31$5
        data-fid="45:0"
        style={{
          zIndex: 3,
          display: "flex",
          flexDirection: "row",
          gap: 11,
          justifyContent: "center",
          alignItems: "flex-end",
          position: "absolute",
          boxSizing: "border-box",
          top: 259,
          height: 28,
          left: 220,
          width: 95,
          backgroundColor: "rgba(0, 0, 0, 0)",
        }}
        data-fname="Frame 5"
      ></Frame3_31$5>
      <div
        data-fid="45:3"
        style={{
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "flex-end",
          position: "absolute",
          boxSizing: "border-box",
          top: 333,
          height: 145,
          left: 61,
          width: 184,
          backgroundColor: "rgba(0, 0, 0, 0)",
        }}
        data-fname="floating"
      >
        <div
          data-fid="45:4"
          style={{
            zIndex: 0,
            position: "relative",
            boxSizing: "border-box",
            flexGrow: 1,
            alignSelf: "stretch",
            width: 184,
            height: 41.66666793823242,
            backgroundColor: "#c4c4c4",
          }}
          data-fname="Rectangle 7"
        ></div>
        <div
          data-fid="47:0"
          style={{
            zIndex: 1,
            position: "relative",
            boxSizing: "border-box",
            flexGrow: 1,
            alignSelf: "inherit",
            width: 92,
            height: 41.66666793823242,
            backgroundColor: "#c4c4c4",
          }}
          data-fname="Rectangle 8"
        ></div>
        <div
          data-fid="45:5"
          style={{
            zIndex: 2,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            position: "relative",
            boxSizing: "border-box",
            flexGrow: 1,
            alignSelf: "stretch",
            width: 184,
            height: 41.66666793823242,
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          data-fname="Frame 4"
        >
          <div
            data-fid="45:6"
            style={{
              zIndex: 0,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 1,
              alignSelf: "stretch",
              width: 128,
              height: 41.66666793823242,
              backgroundColor: "#c4c4c4",
            }}
            data-fname="Rectangle 8"
          ></div>
          <div
            data-fid="45:7"
            style={{
              zIndex: 1,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "stretch",
              width: 46,
              backgroundColor: "#c4c4c4",
            }}
            data-fname="Rectangle 9"
          ></div>
        </div>
      </div>
    </div>
  );
};
