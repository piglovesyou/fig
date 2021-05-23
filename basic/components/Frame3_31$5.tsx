import React, { FC, CSSProperties } from "react";
export const Frame3_31$5: FC<{
  style: CSSProperties,
}> = (props) => {
  return (
    <div
      data-fid="31:5"
      style={{
        ...{
          display: "flex",
          flexDirection: "row",
          gap: 11,
          alignItems: "center",
          position: "absolute",
          boxSizing: "border-box",
          backgroundColor: "rgba(0, 0, 0, 0)",
        },
        ...props.style,
      }}
      data-fname="Frame 3"
    >
      <div
        data-fid="31:2"
        style={{
          position: "relative",
          boxSizing: "border-box",
          flexGrow: 0,
          alignSelf: "inherit",
          width: 28,
          height: 28,
        }}
        data-fname="Ellipse 1"
      >
        <div
          className="vector"
          dangerouslySetInnerHTML={{
            __html: `<svg preserveAspectRatio="none" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="14" cy="14" r="14" fill="#C4C4C4"/>
</svg>
`,
          }}
        />
      </div>
      <div
        data-fid="31:3"
        style={{
          position: "relative",
          boxSizing: "border-box",
          flexGrow: 0,
          alignSelf: "inherit",
          width: 40,
          height: 14,
          color: "#000000",
          fontSize: 12,
          fontWeight: 400,
          fontFamily: '"Roboto"',
          fontStyle: "normal",
          lineHeight: "125%",
          letterSpacing: "0px",
          textAlign: "left",
        }}
        data-fname="aaaaaa"
      >
        <span style={{}} key="end">
          aaaaaa
        </span>
      </div>
    </div>
  );
};
