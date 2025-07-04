(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [931],
  {
    9340: function (e, t, n) {
      Promise.resolve().then(n.bind(n, 2086));
    },
    2086: function (e, t, n) {
      "use strict";
      n.r(t),
        n.d(t, {
          default: function () {
            return d;
          },
        });
      var s = n(9506),
        i = n(2820);
      let r = {
          pointsNumber: 40,
          widthFactor: 0.3,
          spring: 0.4,
          friction: 0.5,
        },
        a = (e) => {
          let { className: t } = e,
            n = (0, i.useRef)(null),
            [a, l] = (0, i.useState)({ x: 0, y: 0 }),
            [o, d] = (0, i.useState)(!1),
            [c, h] = (0, i.useState)(
              Array(r.pointsNumber)
                .fill(null)
                .map(() => ({ x: 0, y: 0, dx: 0, dy: 0 }))
            ),
            u = (e, t) => {
              l({ x: e, y: t });
            },
            x = () => {
              let e = n.current;
              e &&
                ((e.width = window.innerWidth),
                (e.height = window.innerHeight));
            };
          return (
            (0, i.useEffect)(
              () => (
                l({ x: window.innerWidth / 2, y: window.innerHeight / 2 }),
                x(),
                window.addEventListener("resize", x),
                () => window.removeEventListener("resize", x)
              ),
              []
            ),
            (0, i.useEffect)(() => {
              let e = (e) => {
                let t = 0,
                  n = 0;
                "pageX" in e
                  ? ((t = e.pageX), (n = e.pageY))
                  : ((t = e.touches[0].pageX), (n = e.touches[0].pageY)),
                  d(!0),
                  u(t, n);
              };
              return (
                window.addEventListener("click", e),
                window.addEventListener("mousemove", e),
                window.addEventListener("touchmove", e),
                () => {
                  window.removeEventListener("click", e),
                    window.removeEventListener("mousemove", e),
                    window.removeEventListener("touchmove", e);
                }
              );
            }, []),
            (0, i.useEffect)(() => {
              window.requestAnimationFrame((e) => {
                let t = n.current;
                if (!t) return;
                let s = t.getContext("2d");
                if (s) {
                  o ||
                    l({
                      x:
                        (0.5 +
                          0.3 * Math.cos(0.002 * e) * Math.sin(0.005 * e)) *
                        window.innerWidth,
                      y:
                        (0.5 +
                          0.2 * Math.cos(0.005 * e) +
                          0.1 * Math.cos(0.01 * e)) *
                        window.innerHeight,
                    }),
                    s.clearRect(0, 0, t.width, t.height),
                    h((e) => {
                      let t = [...e];
                      return (
                        t.forEach((e, t) => {
                          let n = 0 === t ? a : c[t - 1],
                            s = 0 === t ? 0.4 * r.spring : r.spring;
                          (e.dx += (n.x - e.x) * s),
                            (e.dy += (n.y - e.y) * s),
                            (e.dx *= r.friction),
                            (e.dy *= r.friction),
                            (e.x += e.dx),
                            (e.y += e.dy);
                        }),
                        t
                      );
                    }),
                    (s.lineCap = "round"),
                    s.beginPath(),
                    s.moveTo(c[0].x, c[0].y);
                  for (let e = 1; e < c.length - 1; e++) {
                    let t = 0.5 * (c[e].x + c[e + 1].x),
                      n = 0.5 * (c[e].y + c[e + 1].y);
                    s.quadraticCurveTo(c[e].x, c[e].y, t, n),
                      (s.lineWidth = r.widthFactor * (r.pointsNumber - e)),
                      s.stroke();
                  }
                  s.lineTo(c[c.length - 1].x, c[c.length - 1].y), s.stroke();
                }
              });
            }, [a, o, c]),
            (0, s.jsx)("canvas", { className: t, ref: n })
          );
        };
      var l = n(7458),
        o = n(3922);
      function d() {
        return (0, s.jsxs)("main", {
          className:
            "relative bg-white w-screen h-screen overflow-clip text-black",
          style: { height: "100svh" },
          children: [
            (0, s.jsx)(a, {
              className:
                "absolute inset-0 z-10 bg-transparent pointer-events-none",
            }),
            (0, s.jsx)(l.Z, {
              className: "absolute inset-0 z-0",
              scene:
                "https://prod.spline.design/svZku3dNHvOaMaZN/scene.splinecode",
            }),
            (0, s.jsxs)("div", {
              className:
                "absolute flex flex-col gap-3 bottom-0 bg-transparent h-fit justify-between w-full px-[5vw] md:px-[3vw] xl:px-[2vw] pb-3 z-20",
              children: [
                (0, s.jsx)("hr", {
                  className: "h-[1px] border-current w-full",
                }),
                (0, s.jsxs)("div", {
                  className: "flex flex-row items-center",
                  children: [
                    (0, s.jsx)("p", {
                      className: "whitespace-nowrap text-[3vw] md:text-lg",
                      children: "Sappy",
                    }),
                    (0, s.jsxs)("div", {
                      className:
                        "flex flex-row w-full gap-2 items-center justify-end text-[2.5vw] md:text-base md:gap-3",
                      children: [
                        (0, s.jsxs)(o.default, {
                          className: "relative",
                          href: "index.htm",
                          children: [
                            (0, s.jsx)("hr", {
                              className:
                                "h-[1px] absolute bottom-0 left-0 w-full border-current",
                            }),
                            "Home",
                          ],
                        }),
                        (0, s.jsx)(c, { href: "seals.html", text: "Monks" }),
                        (0, s.jsx)(c, {
                          href: "seals/staking.html",
                          text: "Dashboard",
                        }),
                        
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      }
      let c = (e) => {
        let { href: t, text: n } = e;
        return (0, s.jsx)(o.default, {
          className: "relative underline-animation",
          href: t,
          children: n,
        });
      };
    },
  },
  function (e) {
    e.O(0, [959, 349, 512, 184, 744], function () {
      return e((e.s = 9340));
    }),
      (_N_E = e.O());
  },
]);
