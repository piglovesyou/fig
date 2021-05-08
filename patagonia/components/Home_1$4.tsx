import { CarouselContent2_2$127 } from "./CarouselContent2_2$127";
import { CarouselContent1_2$44 } from "./CarouselContent1_2$44";
import { Button_1$48 } from "./Button_1$48";
import React, { FC, CSSProperties } from "react";
export const Home_1$4: FC<{
  style: CSSProperties,
}> = (props) => {
  return (
    <div
      data-fid="1:4"
      style={{
        ...{
          display: "flex",
          flexDirection: "column",
          gap: 64,
          justifyContent: "center",
          position: "absolute",
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
        },
        ...props.style,
      }}
      data-fname="Home"
    >
      <div
        data-fid="2:22"
        style={{
          zIndex: 0,
          position: "relative",
          boxSizing: "border-box",
          flexGrow: 0,
          alignSelf: "stretch",
          height: 768,
          backgroundColor: "rgba(0, 0, 0, 0)",
          backgroundImage:
            "url(https://s3-alpha-sig.figma.com/img/c73f/97be/f3d3bc2931ffab08c3df439b1392ed07?Expires=1621209600&Signature=Sg6iegIk0A5vSyD9GLSbVWZ3SfbcMUiNxFjWkCzOG5cXoTgZkkz-0lZ3FK~1QdTdQs~WyMu1xwkP1dqEY2WuVfqDp0PZsUPYtmve7KPsiEQ6FW197YD7HduV-8hZ30iQP3K7FozyD0p6DCFISctAu4xO1oARF7e4imdBG2AjhCxKdLm8U~RUblGNFUqnr2rmqDAOf-quDbz6pL65dEXLfKF95XtMyzA2cjqwiwK1AEXzIHhYUL2qo6Xcl~~5vq79vCXaSyc3bKbX0yP-tB7yYZ-dvegrOE9ujGabP0r7jJ6asTZmazObsrkeTUTD28UDBPRl2XMTXPhkVcR~iH-xGw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA)",
          backgroundSize: "cover",
        }}
        data-fname="TopTop"
      >
        <div
          data-fid="1:5"
          style={{
            zIndex: 1,
            position: "absolute",
            boxSizing: "border-box",
            top: 0,
            height: 44,
            left: 0,
            right: 0,
            backgroundColor: "#000000",
          }}
          data-fname="Toolbar"
        >
          <div
            data-fid="1:12"
            style={{
              zIndex: 0,
              position: "absolute",
              boxSizing: "border-box",
              top: "52%",
              transform: " translateY(-50%)",
              height: 13,
              right: 28,
              width: 56,
              color: "#ffffff",
              fontSize: 10.800000190734863,
              fontWeight: 400,
              fontFamily: '"Roboto"',
              fontStyle: "normal",
              lineHeight: "125%",
              letterSpacing: "0px",
              textAlign: "right",
            }}
            data-fname="asdajs asdf"
          >
            <span style={{}} key="end">
              asdajs asdf
            </span>
          </div>
          <div
            data-fid="1:14"
            style={{
              zIndex: 1,
              position: "absolute",
              boxSizing: "border-box",
              top: "52%",
              transform: " translateY(-50%) translateX(-50%)",
              height: 13,
              left: "50%",
              width: 117,
              color: "#ffffff",
              fontSize: 10.800000190734863,
              fontWeight: 400,
              fontFamily: '"Roboto"',
              fontStyle: "normal",
              lineHeight: "125%",
              letterSpacing: "0px",
              textAlign: "center",
            }}
            data-fname="Sign in"
          >
            <span style={{}} key="end">
              asldjf as asdlfkj asdasdf
            </span>
          </div>
        </div>
        <div
          data-fid="1:28"
          style={{
            zIndex: 0,
            position: "absolute",
            boxSizing: "border-box",
            top: 44,
            height: 108,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          data-fname="Frame 2"
        >
          <div
            data-fid="33:42"
            style={{
              zIndex: 2,
              position: "absolute",
              boxSizing: "border-box",
              top: 43,
              height: 19.636362075805664,
              left: 40,
              width: 18,
              backgroundColor: "#000000",
              opacity: 0,
            }}
            data-fname="shopping-bag"
          >
            <div
              data-fid="33:43"
              style={{
                zIndex: 0,
                position: "absolute",
                boxSizing: "border-box",
                height: "100%",
                top: "0%",
                width: "100%",
                left: "0%",
              }}
              data-fname="Vector"
            >
              <div
                className="vector"
                dangerouslySetInnerHTML={{
                  __html: `<svg preserveAspectRatio="none" width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.1429 6.13636V4.90909C14.1429 2.20219 11.8358 0 9 0C6.1642 0 3.85714 2.20219 3.85714 4.90909V6.13636H0V16.5682C0 18.2627 1.43908 19.6364 3.21429 19.6364H14.7857C16.5609 19.6364 18 18.2627 18 16.5682V6.13636H14.1429ZM6.42857 4.90909C6.42857 3.55564 7.5821 2.45455 9 2.45455C10.4179 2.45455 11.5714 3.55564 11.5714 4.90909V6.13636H6.42857V4.90909ZM12.8571 9.51136C12.3246 9.51136 11.8929 9.09927 11.8929 8.59091C11.8929 8.08255 12.3246 7.67045 12.8571 7.67045C13.3897 7.67045 13.8214 8.08255 13.8214 8.59091C13.8214 9.09927 13.3897 9.51136 12.8571 9.51136ZM5.14286 9.51136C4.61029 9.51136 4.17857 9.09927 4.17857 8.59091C4.17857 8.08255 4.61029 7.67045 5.14286 7.67045C5.67542 7.67045 6.10714 8.08255 6.10714 8.59091C6.10714 9.09927 5.67542 9.51136 5.14286 9.51136Z" fill="white"/>
</svg>
`,
                }}
              />
            </div>
          </div>
          <div
            data-fid="1:34"
            style={{
              zIndex: 0,
              display: "flex",
              flexDirection: "row",
              gap: 32,
              alignItems: "center",
              position: "absolute",
              boxSizing: "border-box",
              top: "49%",
              transform: " translateY(-50%)",
              height: 18.002967834472656,
              right: 40,
              width: 68,
              backgroundColor: "rgba(0, 0, 0, 0)",
            }}
            data-fname="Frame 3"
          >
            <div
              data-fid="33:41"
              style={{
                zIndex: 0,
                position: "relative",
                boxSizing: "border-box",
                flexGrow: 0,
                alignSelf: "inherit",
                width: 18,
                height: 18.002967834472656,
              }}
              data-fname="Vector"
            >
              <div
                className="vector"
                dangerouslySetInnerHTML={{
                  __html: `<svg preserveAspectRatio="none" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.7552 15.5647L14.2499 12.0594C14.0917 11.9012 13.8772 11.8133 13.6522 11.8133H13.0791C14.0495 10.5722 14.6261 9.01115 14.6261 7.31299C14.6261 3.27327 11.3528 0 7.31303 0C3.27329 0 0 3.27327 0 7.31299C0 11.3527 3.27329 14.626 7.31303 14.626C9.01121 14.626 10.5723 14.0494 11.8134 13.079V13.6521C11.8134 13.8771 11.9013 14.0916 12.0595 14.2498L15.5648 17.7551C15.8953 18.0856 16.4297 18.0856 16.7567 17.7551L17.7517 16.7601C18.0822 16.4296 18.0822 15.8952 17.7552 15.5647ZM7.31303 11.8133C4.82731 11.8133 2.81271 9.80222 2.81271 7.31299C2.81271 4.82728 4.82379 2.81269 7.31303 2.81269C9.79876 2.81269 11.8134 4.82376 11.8134 7.31299C11.8134 9.79871 9.80228 11.8133 7.31303 11.8133Z" fill="white"/>
</svg>
`,
                }}
              />
            </div>
            <div
              data-fid="33:39"
              style={{
                zIndex: 1,
                position: "relative",
                boxSizing: "border-box",
                flexGrow: 0,
                alignSelf: "inherit",
                width: 18,
                height: 15.034090042114258,
              }}
              data-fname="Vector"
            >
              <div
                className="vector"
                dangerouslySetInnerHTML={{
                  __html: `<svg preserveAspectRatio="none" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.642857 2.76136H17.3571C17.7122 2.76136 18 2.48665 18 2.14773V0.613636C18 0.274717 17.7122 0 17.3571 0H0.642857C0.287799 0 0 0.274717 0 0.613636V2.14773C0 2.48665 0.287799 2.76136 0.642857 2.76136ZM0.642857 8.89773H17.3571C17.7122 8.89773 18 8.62301 18 8.28409V6.75C18 6.41108 17.7122 6.13636 17.3571 6.13636H0.642857C0.287799 6.13636 0 6.41108 0 6.75V8.28409C0 8.62301 0.287799 8.89773 0.642857 8.89773ZM0.642857 15.0341H17.3571C17.7122 15.0341 18 14.7594 18 14.4205V12.8864C18 12.5474 17.7122 12.2727 17.3571 12.2727H0.642857C0.287799 12.2727 0 12.5474 0 12.8864V14.4205C0 14.7594 0.287799 15.0341 0.642857 15.0341Z" fill="white"/>
</svg>
`,
                }}
              />
            </div>
          </div>
          <div
            data-fid="1:30"
            style={{
              zIndex: 1,
              position: "absolute",
              boxSizing: "border-box",
              top: "49%",
              transform: " translateY(-50%) translateX(-50%)",
              height: 17,
              left: "50%",
              width: 57,
              color: "#ffffff",
              fontSize: 14.399999618530273,
              fontWeight: 700,
              fontFamily: '"Roboto"',
              fontStyle: "normal",
              lineHeight: "125%",
              letterSpacing: "0px",
              textAlign: "center",
            }}
            data-fname="asdfasdf"
          >
            <span style={{}} key="end">
              asdfasdf{" "}
            </span>
          </div>
        </div>
        <div
          data-fid="1:44"
          style={{
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            alignItems: "center",
            position: "absolute",
            boxSizing: "border-box",
            top: "55%",
            transform: " translateY(-50%) translateX(-50%)",
            height: 296,
            left: "50%",
            width: 289,
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          data-fname="header-text"
        >
          <div
            data-fid="2:20"
            style={{
              zIndex: 0,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "center",
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 289,
              height: 227,
              backgroundColor: "rgba(0, 0, 0, 0)",
            }}
            data-fname="Frame 6"
          >
            <div
              data-fid="2:21"
              style={{
                zIndex: 0,
                position: "relative",
                boxSizing: "border-box",
                flexGrow: 0,
                alignSelf: "inherit",
                width: 80,
                height: 44,
              }}
              data-fname="Rectangle 1"
            ></div>
            <div
              data-fid="1:42"
              style={{
                zIndex: 1,
                position: "relative",
                boxSizing: "border-box",
                flexGrow: 0,
                alignSelf: "inherit",
                width: 266,
                height: 67,
                color: "#ffffff",
                fontSize: 57,
                fontWeight: 400,
                fontFamily: '"Roboto"',
                fontStyle: "normal",
                lineHeight: "125%",
                letterSpacing: "0px",
                textAlign: "center",
              }}
              data-fname="aaaasdfas"
            >
              <span style={{}} key="end">
                aaaasdfas
              </span>
            </div>
            <div
              data-fid="1:43"
              style={{
                zIndex: 2,
                position: "relative",
                boxSizing: "border-box",
                flexGrow: 0,
                alignSelf: "inherit",
                width: 289,
                height: 108,
                color: "#ffffff",
                fontSize: 18,
                fontWeight: 400,
                fontFamily: '"Roboto"',
                fontStyle: "normal",
                lineHeight: "213.3333396911621%",
                letterSpacing: "0px",
                textAlign: "justify",
              }}
              data-fname="asdfasdf asd fasd fasdf asdf asdf aasdf asd fasd fasdf asdfasdf asdf asdfa sdfasd f asdfasdf"
            >
              <span style={{}} key="end">
                asdfasdf asd fasd fasdf asdf asdf aasdf asd fasd fasdf asdfasdf
                asdf asdfa sdfasd f asdfasdf
              </span>
            </div>
          </div>
          <Button_1$48
            data-fid="1:51"
            style={{
              zIndex: 1,
              display: "flex",
              flexDirection: "row",
              paddingTop: 16,
              paddingRight: 32,
              paddingBottom: 16,
              paddingLeft: 32,
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 153,
              height: 49,
              backgroundColor: "#ffffff",
              borderRadius: "68px 68px 68px 68px",
            }}
            data-fname="Button"
          ></Button_1$48>
        </div>
        <div
          data-fid="33:47"
          style={{
            zIndex: 4,
            position: "absolute",
            boxSizing: "border-box",
            height: "1.171875%",
            top: "92.1875%",
            left: "50%",
            transform: " translateX(-50%)",
            width: 14,
          }}
          data-fname="Vector"
        >
          <div
            className="vector"
            dangerouslySetInnerHTML={{
              __html: `<svg preserveAspectRatio="none" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.26039 8.69288L0.308534 2.76839C-0.102845 2.35891 -0.102845 1.69676 0.308534 1.29163L1.29759 0.307115C1.70897 -0.102372 2.37418 -0.102372 2.78118 0.307115L7 4.50654L11.2188 0.307115C11.6302 -0.102372 12.2954 -0.102372 12.7024 0.307115L13.6915 1.29163C14.1028 1.70111 14.1028 2.36326 13.6915 2.76839L7.73961 8.69288C7.33698 9.10237 6.67177 9.10237 6.26039 8.69288Z" fill="white"/>
</svg>
`,
            }}
          />
        </div>
        <div className="maxer">
          <div
            data-fid="2:6"
            style={{
              zIndex: 3,
              position: "absolute",
              boxSizing: "border-box",
              bottom: 40,
              height: 31,
              right: 61,
              width: 31,
              backgroundColor: "#ffffff",
              borderRadius: "61px 61px 61px 61px",
            }}
            data-fname="Frame 5"
          >
            <div
              data-fid="33:45"
              style={{
                zIndex: 0,
                position: "absolute",
                boxSizing: "border-box",
                height: "18.38994026184082%",
                top: "41.935483870967744%",
                width: "58.064516129032256%",
                left: "22.580645161290324%",
              }}
              data-fname="Vector"
            >
              <div
                className="vector"
                dangerouslySetInnerHTML={{
                  __html: `<svg preserveAspectRatio="none" width="18" height="6" viewBox="0 0 18 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.6129 2.85044C11.6129 4.4261 10.4444 5.70088 9 5.70088C7.55564 5.70088 6.3871 4.4261 6.3871 2.85044C6.3871 1.27478 7.55564 0 9 0C10.4444 0 11.6129 1.27478 11.6129 2.85044ZM15.3871 0C13.9427 0 12.7742 1.27478 12.7742 2.85044C12.7742 4.4261 13.9427 5.70088 15.3871 5.70088C16.8315 5.70088 18 4.4261 18 2.85044C18 1.27478 16.8315 0 15.3871 0ZM2.6129 0C1.16855 0 0 1.27478 0 2.85044C0 4.4261 1.16855 5.70088 2.6129 5.70088C4.05726 5.70088 5.22581 4.4261 5.22581 2.85044C5.22581 1.27478 4.05726 0 2.6129 0Z" fill="black"/>
</svg>
`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        data-fid="2:35"
        style={{
          zIndex: 1,
          position: "relative",
          boxSizing: "border-box",
          flexGrow: 0,
          alignSelf: "stretch",
          height: 300,
          backgroundColor: "rgba(0, 0, 0, 0)",
        }}
        data-fname="carousel"
      >
        <div
          data-fid="2:28"
          style={{
            zIndex: 0,
            display: "flex",
            flexDirection: "row",
            gap: 20,
            alignItems: "center",
            position: "absolute",
            boxSizing: "border-box",
            top: 0,
            height: 300,
            left: 72,
            width: 1260,
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          data-fname="Frame 9"
        >
          <CarouselContent1_2$44
            data-fid="2:45"
            style={{
              zIndex: 0,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 300,
              height: 300,
              backgroundColor: "rgba(0, 0, 0, 0)",
              backgroundImage:
                "url(https://s3-alpha-sig.figma.com/img/c73f/97be/f3d3bc2931ffab08c3df439b1392ed07?Expires=1621209600&Signature=Sg6iegIk0A5vSyD9GLSbVWZ3SfbcMUiNxFjWkCzOG5cXoTgZkkz-0lZ3FK~1QdTdQs~WyMu1xwkP1dqEY2WuVfqDp0PZsUPYtmve7KPsiEQ6FW197YD7HduV-8hZ30iQP3K7FozyD0p6DCFISctAu4xO1oARF7e4imdBG2AjhCxKdLm8U~RUblGNFUqnr2rmqDAOf-quDbz6pL65dEXLfKF95XtMyzA2cjqwiwK1AEXzIHhYUL2qo6Xcl~~5vq79vCXaSyc3bKbX0yP-tB7yYZ-dvegrOE9ujGabP0r7jJ6asTZmazObsrkeTUTD28UDBPRl2XMTXPhkVcR~iH-xGw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA)",
              backgroundSize: "cover",
              borderRadius: "6.75px 6.75px 6.75px 6.75px",
            }}
            data-fname="carousel content 1"
          ></CarouselContent1_2$44>
          <CarouselContent1_2$44
            data-fid="2:47"
            style={{
              zIndex: 1,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 300,
              height: 300,
              backgroundColor: "rgba(0, 0, 0, 0)",
              backgroundImage:
                "url(https://s3-alpha-sig.figma.com/img/c73f/97be/f3d3bc2931ffab08c3df439b1392ed07?Expires=1621209600&Signature=Sg6iegIk0A5vSyD9GLSbVWZ3SfbcMUiNxFjWkCzOG5cXoTgZkkz-0lZ3FK~1QdTdQs~WyMu1xwkP1dqEY2WuVfqDp0PZsUPYtmve7KPsiEQ6FW197YD7HduV-8hZ30iQP3K7FozyD0p6DCFISctAu4xO1oARF7e4imdBG2AjhCxKdLm8U~RUblGNFUqnr2rmqDAOf-quDbz6pL65dEXLfKF95XtMyzA2cjqwiwK1AEXzIHhYUL2qo6Xcl~~5vq79vCXaSyc3bKbX0yP-tB7yYZ-dvegrOE9ujGabP0r7jJ6asTZmazObsrkeTUTD28UDBPRl2XMTXPhkVcR~iH-xGw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA)",
              backgroundSize: "cover",
              borderRadius: "6.75px 6.75px 6.75px 6.75px",
            }}
            data-fname="Frame 11"
          ></CarouselContent1_2$44>
          <CarouselContent1_2$44
            data-fid="2:49"
            style={{
              zIndex: 2,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 300,
              height: 300,
              backgroundColor: "rgba(0, 0, 0, 0)",
              backgroundImage:
                "url(https://s3-alpha-sig.figma.com/img/c73f/97be/f3d3bc2931ffab08c3df439b1392ed07?Expires=1621209600&Signature=Sg6iegIk0A5vSyD9GLSbVWZ3SfbcMUiNxFjWkCzOG5cXoTgZkkz-0lZ3FK~1QdTdQs~WyMu1xwkP1dqEY2WuVfqDp0PZsUPYtmve7KPsiEQ6FW197YD7HduV-8hZ30iQP3K7FozyD0p6DCFISctAu4xO1oARF7e4imdBG2AjhCxKdLm8U~RUblGNFUqnr2rmqDAOf-quDbz6pL65dEXLfKF95XtMyzA2cjqwiwK1AEXzIHhYUL2qo6Xcl~~5vq79vCXaSyc3bKbX0yP-tB7yYZ-dvegrOE9ujGabP0r7jJ6asTZmazObsrkeTUTD28UDBPRl2XMTXPhkVcR~iH-xGw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA)",
              backgroundSize: "cover",
              borderRadius: "6.75px 6.75px 6.75px 6.75px",
            }}
            data-fname="Frame 12"
          ></CarouselContent1_2$44>
          <CarouselContent1_2$44
            data-fid="2:51"
            style={{
              zIndex: 3,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 300,
              height: 300,
              backgroundColor: "rgba(0, 0, 0, 0)",
              backgroundImage:
                "url(https://s3-alpha-sig.figma.com/img/c73f/97be/f3d3bc2931ffab08c3df439b1392ed07?Expires=1621209600&Signature=Sg6iegIk0A5vSyD9GLSbVWZ3SfbcMUiNxFjWkCzOG5cXoTgZkkz-0lZ3FK~1QdTdQs~WyMu1xwkP1dqEY2WuVfqDp0PZsUPYtmve7KPsiEQ6FW197YD7HduV-8hZ30iQP3K7FozyD0p6DCFISctAu4xO1oARF7e4imdBG2AjhCxKdLm8U~RUblGNFUqnr2rmqDAOf-quDbz6pL65dEXLfKF95XtMyzA2cjqwiwK1AEXzIHhYUL2qo6Xcl~~5vq79vCXaSyc3bKbX0yP-tB7yYZ-dvegrOE9ujGabP0r7jJ6asTZmazObsrkeTUTD28UDBPRl2XMTXPhkVcR~iH-xGw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA)",
              backgroundSize: "cover",
              borderRadius: "6.75px 6.75px 6.75px 6.75px",
            }}
            data-fname="Frame 13"
          ></CarouselContent1_2$44>
        </div>
        <div
          data-fid="2:36"
          style={{
            zIndex: 1,
            position: "absolute",
            boxSizing: "border-box",
            top: "50%",
            transform: " translateY(-50%)",
            height: 51,
            right: 36,
            width: 51,
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "61px 61px 61px 61px",
          }}
          data-fname="Frame 6"
        >
          <div
            data-fid="33:49"
            style={{
              zIndex: 0,
              position: "absolute",
              boxSizing: "border-box",
              height: "27.45098039215686%",
              top: "37.254901960784316%",
              width: "17.647058823529413%",
              left: "41.1764705882353%",
            }}
            data-fname="Vector"
          >
            <div
              className="vector"
              dangerouslySetInnerHTML={{
                __html: `<svg preserveAspectRatio="none" width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.69341 7.74352L2.76856 13.6917C2.35905 14.1028 1.69686 14.1028 1.2917 13.6917L0.307134 12.7032C-0.102378 12.2921 -0.102378 11.6273 0.307134 11.2206L4.50681 7.00437L0.307134 2.78819C-0.102378 2.37707 -0.102378 1.71228 0.307134 1.30553L1.28735 0.308341C1.69686 -0.10278 2.35905 -0.10278 2.7642 0.308341L8.68905 6.25648C9.10292 6.6676 9.10292 7.3324 8.69341 7.74352Z" fill="black"/>
</svg>
`,
              }}
            />
          </div>
        </div>
      </div>
      <div
        data-fid="2:55"
        style={{
          zIndex: 2,
          position: "relative",
          boxSizing: "border-box",
          flexGrow: 0,
          alignSelf: "stretch",
          height: 768,
          backgroundColor: "rgba(0, 0, 0, 0)",
          backgroundImage:
            "url(https://s3-alpha-sig.figma.com/img/c73f/97be/f3d3bc2931ffab08c3df439b1392ed07?Expires=1621209600&Signature=Sg6iegIk0A5vSyD9GLSbVWZ3SfbcMUiNxFjWkCzOG5cXoTgZkkz-0lZ3FK~1QdTdQs~WyMu1xwkP1dqEY2WuVfqDp0PZsUPYtmve7KPsiEQ6FW197YD7HduV-8hZ30iQP3K7FozyD0p6DCFISctAu4xO1oARF7e4imdBG2AjhCxKdLm8U~RUblGNFUqnr2rmqDAOf-quDbz6pL65dEXLfKF95XtMyzA2cjqwiwK1AEXzIHhYUL2qo6Xcl~~5vq79vCXaSyc3bKbX0yP-tB7yYZ-dvegrOE9ujGabP0r7jJ6asTZmazObsrkeTUTD28UDBPRl2XMTXPhkVcR~iH-xGw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA)",
          backgroundSize: "cover",
        }}
        data-fname="Second section"
      >
        <div
          data-fid="2:65"
          style={{
            zIndex: 0,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            position: "absolute",
            boxSizing: "border-box",
            top: 157,
            height: 284,
            left: 72,
            width: 289,
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          data-fname="Frame 4"
        >
          <div
            data-fid="2:66"
            style={{
              zIndex: 0,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 289,
              height: 215,
              backgroundColor: "rgba(0, 0, 0, 0)",
            }}
            data-fname="Frame 6"
          >
            <div
              data-fid="2:68"
              style={{
                zIndex: 0,
                position: "relative",
                boxSizing: "border-box",
                flexGrow: 0,
                alignSelf: "inherit",
                width: 154,
                height: 67,
                color: "#ffffff",
                fontSize: 57,
                fontWeight: 400,
                fontFamily: '"Roboto"',
                fontStyle: "normal",
                lineHeight: "125%",
                letterSpacing: "0px",
                textAlign: "center",
              }}
              data-fname="aaaas"
            >
              <span style={{}} key="end">
                aaaas
              </span>
            </div>
            <div
              data-fid="2:69"
              style={{
                zIndex: 1,
                position: "relative",
                boxSizing: "border-box",
                flexGrow: 0,
                alignSelf: "inherit",
                width: 289,
                height: 144,
                color: "#ffffff",
                fontSize: 18,
                fontWeight: 400,
                fontFamily: '"Roboto"',
                fontStyle: "normal",
                lineHeight: "213.3333396911621%",
                letterSpacing: "0px",
                textAlign: "justify",
              }}
              data-fname="asdfasdf asd fasd fasdf asdf asdf aasdf asd fasd fasdf asdfasdf asdf asdfa sdfasd f asdfasdf"
            >
              <span style={{}} key="23">
                asdfasdf asd fasd fasdf
              </span>
              <br key="br23" />
              <span style={{}} key="end">
                asdf asdf aasdf asd fasd fasdf asdfasdf asdf asdfa sdfasd f
                asdfasdf
              </span>
            </div>
          </div>
          <Button_1$48
            data-fid="2:70"
            style={{
              zIndex: 1,
              display: "flex",
              flexDirection: "row",
              paddingTop: 16,
              paddingRight: 32,
              paddingBottom: 16,
              paddingLeft: 32,
              alignItems: "center",
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 153,
              height: 49,
              backgroundColor: "#ffffff",
              borderRadius: "68px 68px 68px 68px",
            }}
            data-fname="Button"
          ></Button_1$48>
        </div>
        <div className="maxer">
          <div
            data-fid="2:71"
            style={{
              zIndex: 1,
              position: "absolute",
              boxSizing: "border-box",
              bottom: 40,
              height: 31,
              right: 61,
              width: 31,
              backgroundColor: "#ffffff",
              borderRadius: "61px 61px 61px 61px",
            }}
            data-fname="Frame 5"
          >
            <div
              data-fid="33:52"
              style={{
                zIndex: 0,
                position: "absolute",
                boxSizing: "border-box",
                height: "18.38994026184082%",
                top: "41.935483870967744%",
                width: "58.064516129032256%",
                left: "22.580645161290324%",
              }}
              data-fname="Vector"
            >
              <div
                className="vector"
                dangerouslySetInnerHTML={{
                  __html: `<svg preserveAspectRatio="none" width="18" height="6" viewBox="0 0 18 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.6129 2.85044C11.6129 4.4261 10.4444 5.70088 9 5.70088C7.55564 5.70088 6.3871 4.4261 6.3871 2.85044C6.3871 1.27478 7.55564 0 9 0C10.4444 0 11.6129 1.27478 11.6129 2.85044ZM15.3871 0C13.9427 0 12.7742 1.27478 12.7742 2.85044C12.7742 4.4261 13.9427 5.70088 15.3871 5.70088C16.8315 5.70088 18 4.4261 18 2.85044C18 1.27478 16.8315 0 15.3871 0ZM2.6129 0C1.16855 0 0 1.27478 0 2.85044C0 4.4261 1.16855 5.70088 2.6129 5.70088C4.05726 5.70088 5.22581 4.4261 5.22581 2.85044C5.22581 1.27478 4.05726 0 2.6129 0Z" fill="black"/>
</svg>
`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        data-fid="18:0"
        style={{
          zIndex: 3,
          position: "relative",
          boxSizing: "border-box",
          flexGrow: 0,
          alignSelf: "stretch",
          height: 119,
          backgroundColor: "rgba(0, 0, 0, 0)",
        }}
        data-fname="Frame 16"
      >
        <div
          data-fid="2:88"
          style={{
            zIndex: 0,
            display: "flex",
            flexDirection: "column",
            paddingLeft: 32,
            justifyContent: "center",
            position: "absolute",
            boxSizing: "border-box",
            top: 0,
            height: 103,
            left: 0,
            width: 321,
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          data-fname="Frame 14"
        >
          <div
            data-fid="2:86"
            style={{
              zIndex: 0,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 154,
              height: 67,
              color: "#000000",
              fontSize: 57,
              fontWeight: 400,
              fontFamily: '"Roboto"',
              fontStyle: "normal",
              lineHeight: "125%",
              letterSpacing: "0px",
              textAlign: "center",
            }}
            data-fname="aaaas"
          >
            <span style={{}} key="end">
              aaaas
            </span>
          </div>
          <div
            data-fid="2:87"
            style={{
              zIndex: 1,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 289,
              height: 36,
              color: "#000000",
              fontSize: 18,
              fontWeight: 400,
              fontFamily: '"Roboto"',
              fontStyle: "normal",
              lineHeight: "213.3333396911621%",
              letterSpacing: "0px",
              textAlign: "justify",
            }}
            data-fname="asdfasdf asd fasd fasdf"
          >
            <span style={{}} key="end">
              asdfasdf asd fasd fasdf
            </span>
          </div>
        </div>
      </div>
      <div
        data-fid="2:89"
        style={{
          zIndex: 4,
          position: "relative",
          boxSizing: "border-box",
          flexGrow: 0,
          alignSelf: "stretch",
          height: 382,
          backgroundColor: "rgba(0, 0, 0, 0)",
        }}
        data-fname="carousel"
      >
        <div
          data-fid="2:90"
          style={{
            zIndex: 0,
            display: "flex",
            flexDirection: "row",
            gap: 20,
            position: "absolute",
            boxSizing: "border-box",
            top: 0,
            bottom: 0,
            minHeight: 382,
            left: 72,
            width: 1260,
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          data-fname="Frame 9"
        >
          <CarouselContent2_2$127
            data-fid="2:128"
            style={{
              zIndex: 0,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 300,
              height: 382,
              backgroundColor: "rgba(0, 0, 0, 0)",
              backgroundImage:
                "url(https://s3-alpha-sig.figma.com/img/c73f/97be/f3d3bc2931ffab08c3df439b1392ed07?Expires=1621209600&Signature=Sg6iegIk0A5vSyD9GLSbVWZ3SfbcMUiNxFjWkCzOG5cXoTgZkkz-0lZ3FK~1QdTdQs~WyMu1xwkP1dqEY2WuVfqDp0PZsUPYtmve7KPsiEQ6FW197YD7HduV-8hZ30iQP3K7FozyD0p6DCFISctAu4xO1oARF7e4imdBG2AjhCxKdLm8U~RUblGNFUqnr2rmqDAOf-quDbz6pL65dEXLfKF95XtMyzA2cjqwiwK1AEXzIHhYUL2qo6Xcl~~5vq79vCXaSyc3bKbX0yP-tB7yYZ-dvegrOE9ujGabP0r7jJ6asTZmazObsrkeTUTD28UDBPRl2XMTXPhkVcR~iH-xGw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA)",
              backgroundSize: "cover",
              borderRadius: "6.75px 6.75px 6.75px 6.75px",
            }}
            data-fname="Frame 8"
          ></CarouselContent2_2$127>
          <CarouselContent2_2$127
            data-fid="2:134"
            style={{
              zIndex: 1,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 300,
              height: 382,
              backgroundColor: "rgba(0, 0, 0, 0)",
              backgroundImage:
                "url(https://s3-alpha-sig.figma.com/img/c73f/97be/f3d3bc2931ffab08c3df439b1392ed07?Expires=1621209600&Signature=Sg6iegIk0A5vSyD9GLSbVWZ3SfbcMUiNxFjWkCzOG5cXoTgZkkz-0lZ3FK~1QdTdQs~WyMu1xwkP1dqEY2WuVfqDp0PZsUPYtmve7KPsiEQ6FW197YD7HduV-8hZ30iQP3K7FozyD0p6DCFISctAu4xO1oARF7e4imdBG2AjhCxKdLm8U~RUblGNFUqnr2rmqDAOf-quDbz6pL65dEXLfKF95XtMyzA2cjqwiwK1AEXzIHhYUL2qo6Xcl~~5vq79vCXaSyc3bKbX0yP-tB7yYZ-dvegrOE9ujGabP0r7jJ6asTZmazObsrkeTUTD28UDBPRl2XMTXPhkVcR~iH-xGw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA)",
              backgroundSize: "cover",
              borderRadius: "6.75px 6.75px 6.75px 6.75px",
            }}
            data-fname="Frame 9"
          ></CarouselContent2_2$127>
          <CarouselContent2_2$127
            data-fid="2:140"
            style={{
              zIndex: 2,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 300,
              height: 382,
              backgroundColor: "rgba(0, 0, 0, 0)",
              backgroundImage:
                "url(https://s3-alpha-sig.figma.com/img/c73f/97be/f3d3bc2931ffab08c3df439b1392ed07?Expires=1621209600&Signature=Sg6iegIk0A5vSyD9GLSbVWZ3SfbcMUiNxFjWkCzOG5cXoTgZkkz-0lZ3FK~1QdTdQs~WyMu1xwkP1dqEY2WuVfqDp0PZsUPYtmve7KPsiEQ6FW197YD7HduV-8hZ30iQP3K7FozyD0p6DCFISctAu4xO1oARF7e4imdBG2AjhCxKdLm8U~RUblGNFUqnr2rmqDAOf-quDbz6pL65dEXLfKF95XtMyzA2cjqwiwK1AEXzIHhYUL2qo6Xcl~~5vq79vCXaSyc3bKbX0yP-tB7yYZ-dvegrOE9ujGabP0r7jJ6asTZmazObsrkeTUTD28UDBPRl2XMTXPhkVcR~iH-xGw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA)",
              backgroundSize: "cover",
              borderRadius: "6.75px 6.75px 6.75px 6.75px",
            }}
            data-fname="Frame 10"
          ></CarouselContent2_2$127>
          <CarouselContent2_2$127
            data-fid="2:146"
            style={{
              zIndex: 3,
              position: "relative",
              boxSizing: "border-box",
              flexGrow: 0,
              alignSelf: "inherit",
              width: 300,
              height: 382,
              backgroundColor: "rgba(0, 0, 0, 0)",
              backgroundImage:
                "url(https://s3-alpha-sig.figma.com/img/c73f/97be/f3d3bc2931ffab08c3df439b1392ed07?Expires=1621209600&Signature=Sg6iegIk0A5vSyD9GLSbVWZ3SfbcMUiNxFjWkCzOG5cXoTgZkkz-0lZ3FK~1QdTdQs~WyMu1xwkP1dqEY2WuVfqDp0PZsUPYtmve7KPsiEQ6FW197YD7HduV-8hZ30iQP3K7FozyD0p6DCFISctAu4xO1oARF7e4imdBG2AjhCxKdLm8U~RUblGNFUqnr2rmqDAOf-quDbz6pL65dEXLfKF95XtMyzA2cjqwiwK1AEXzIHhYUL2qo6Xcl~~5vq79vCXaSyc3bKbX0yP-tB7yYZ-dvegrOE9ujGabP0r7jJ6asTZmazObsrkeTUTD28UDBPRl2XMTXPhkVcR~iH-xGw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA)",
              backgroundSize: "cover",
              borderRadius: "6.75px 6.75px 6.75px 6.75px",
            }}
            data-fname="Frame 11"
          ></CarouselContent2_2$127>
        </div>
        <div
          data-fid="2:95"
          style={{
            zIndex: 1,
            position: "absolute",
            boxSizing: "border-box",
            top: "50%",
            transform: " translateY(-50%)",
            height: 51,
            right: 36,
            width: 51,
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "61px 61px 61px 61px",
          }}
          data-fname="Frame 6"
        >
          <div
            data-fid="33:50"
            style={{
              zIndex: 0,
              position: "absolute",
              boxSizing: "border-box",
              height: "27.45098039215686%",
              top: "37.254901960784316%",
              width: "17.647058823529413%",
              left: "41.1764705882353%",
            }}
            data-fname="Vector"
          >
            <div
              className="vector"
              dangerouslySetInnerHTML={{
                __html: `<svg preserveAspectRatio="none" width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.69341 7.74352L2.76856 13.6917C2.35905 14.1028 1.69686 14.1028 1.2917 13.6917L0.307134 12.7032C-0.102378 12.2921 -0.102378 11.6273 0.307134 11.2206L4.50681 7.00437L0.307134 2.78819C-0.102378 2.37707 -0.102378 1.71228 0.307134 1.30553L1.28735 0.308341C1.69686 -0.10278 2.35905 -0.10278 2.7642 0.308341L8.68905 6.25648C9.10292 6.6676 9.10292 7.3324 8.69341 7.74352Z" fill="black"/>
</svg>
`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
