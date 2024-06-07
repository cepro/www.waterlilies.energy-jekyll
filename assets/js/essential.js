var McMode = (function (jQ, win, doc) {
   "use strict";
   var McMode = {
         AppInfo: {
            name: "McStudy",
            package: "1.0.0",
            version: "1.0.0",
            author: "froxtheme",
         },
      },
      components = {
         docReady: [],
         docReadyDefer: [],
         winLoad: [],
         winLoadDefer: [],
      };

   jQ(doc).ready(docReady);
   jQ(win).on("load", winLoad);

   function docReady(stmt) {
      stmt = typeof stmt === typeof undefined ? jQ : stmt;
      components.docReady
         .concat(components.docReadyDefer)
         .forEach(function (component) {
            component(stmt);
         });
   }

   function winLoad(stmt) {
      stmt = typeof stmt === "object" ? jQ : stmt;
      components.winLoad
         .concat(components.winLoadDefer)
         .forEach(function (component) {
            component(stmt);
         });
   }

   McMode.components = components;
   McMode.docReady = docReady;
   McMode.winLoad = winLoad;

   return McMode;
})(jQuery, window, document);

McMode = (function (McMode, $, window, document) {
   "use strict";
   // Defined Variables
   var $win = $(window),
      $doc = $(document),
      $body = $("body"),
      $header = $(".header-main");

   var _navBreak = 992,
      _mobBreak = 768,
      _mobMenu = "menu-mobile",
      _has_fixed = "has-fixed",
      _is_shrink = "is-shrink",
      _currentURL = window.location.href,
      _headerHT = $header.innerHeight() - 2,
      _splitURL = _currentURL.split("#");

   $.fn.exists = function () {
      return this.length > 0;
   };

   McMode.Win = {};
   McMode.Win.height = $(window).height();
   McMode.Win.width = $(window).width();

   McMode.getStatus = {};
   McMode.getStatus.isRTL =
      $body.hasClass("has-rtl") || $body.attr("dir") === "rtl" ? true : false;
   McMode.getStatus.isTouch =
      "ontouchstart" in document.documentElement ? true : false;
   McMode.getStatus.isMobile = navigator.userAgent.match(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|/i
   )
      ? true
      : false;
   McMode.getStatus.asMobile = McMode.Win.width < _mobBreak ? true : false;

   // Update on Resize
   $win.on("resize", function () {
      McMode.Win.height = $(window).height();
      McMode.Win.width = $(window).width();
      McMode.getStatus.asMobile = McMode.Win.width < _mobBreak ? true : false;
   });

   //// Utilities ////
   ///////////////////
   McMode.Util = {};
   McMode.Util.classInit = function () {
      var hastouch = function () {
            if (McMode.getStatus.isTouch === true) {
               $body.addClass("has-touch");
            } else {
               $body.addClass("no-touch");
            }
         },
         mobileview = function () {
            if (McMode.getStatus.asMobile === true) {
               $body.addClass("as-mobile");
            } else {
               $body.removeClass("as-mobile");
            }
         },
         hasrtl = function () {
            if ($body.attr("dir") === "rtl") {
               $body.addClass("has-rtl");
               McMode.getStatus.isRTL = true;
            }
         };
      hastouch();
      mobileview();
      hasrtl();
      $(window).on("resize", mobileview);
   };
   McMode.components.docReady.push(McMode.Util.classInit);

   // Browser Check
   McMode.Util.browser = function () {
      var isChrome = navigator.userAgent.indexOf("Chrome") !== -1 ? 1 : 0,
         isFirefox = navigator.userAgent.indexOf("Firefox") !== -1 ? 1 : 0,
         isSafari = navigator.userAgent.indexOf("Safari") !== -1 ? true : false,
         isIE =
            navigator.userAgent.indexOf("MSIE") !== -1 ||
            !!document.documentMode
               ? 1
               : 0,
         isEdge = !isIE && !!window.StyleMedia,
         isOpera =
            navigator.userAgent.indexOf("Opera") ||
            navigator.userAgent.indexOf("OPR")
               ? 1
               : 0;

      if (isChrome) {
         $body.addClass("chrome");
      } else if (isFirefox) {
         $body.addClass("firefox");
      } else if (isIE) {
         $body.addClass("ie");
      } else if (isEdge) {
         $body.addClass("edge");
      } else if (isOpera) {
         $body.addClass("opera");
      } else if (isSafari) {
         $body.addClass("safari");
      }
   };
   McMode.components.winLoad.push(McMode.Util.browser);

   // Dropdown
   McMode.Util.toggler = function () {
      var _trigger = ".toggle-tigger",
         _toggle = ".toggle-class";

      if ($(_trigger).exists()) {
         $doc.on("click", _trigger, function (e) {
            var $self = $(this);
            $(_trigger).not($self).removeClass("active");
            $(_toggle).not($self.parent().children()).removeClass("active");
            $self
               .toggleClass("active")
               .parent()
               .find(_toggle)
               .toggleClass("active");
            e.preventDefault();
         });
      }

      $doc.on("click", "body", function (e) {
         var $elm_tig = $(_trigger),
            $elm_tog = $(_toggle);
         if (
            !$elm_tog.is(e.target) &&
            $elm_tog.has(e.target).length === 0 &&
            !$elm_tig.is(e.target) &&
            $elm_tig.has(e.target).length === 0
         ) {
            $elm_tog.removeClass("active");
            $elm_tig.removeClass("active");
         }
      });
   };
   McMode.components.docReady.push(McMode.Util.toggler);

   // Mainmenu/Nav
   McMode.MainMenu = function () {
      var $navbar_toggle = $(".navbar-toggle"),
         $main_navbar = $(".header-navbar"),
         $main_navbar_classic = $(".header-navbar-classic"),
         $menu_toggle = $(".menu-toggle"),
         $menu_link = $(".menu-link"),
         _main_menu = ".header-menu",
         _menu_drop = ".menu-drop",
         _open_nav = "open-nav",
         _nav_overlay = ".header-navbar-overlay",
         _open_menu = "menu-shown";

      var MenuInit = {};

      // navToggle
      MenuInit.Overlay = function () {
         if ($main_navbar.exists()) {
            $main_navbar.append('<div class="header-navbar-overlay"></div>');
         }
      };
      MenuInit.navToggle = function () {
         if ($navbar_toggle.exists()) {
            $navbar_toggle.on("click", function (e) {
               var $self = $(this),
                  _self_toggle = $self.data("menu-toggle");
               $self.toggleClass("active");
               if ($main_navbar_classic.exists()) {
                  $("#" + _self_toggle)
                     .slideToggle()
                     .toggleClass(_open_menu);
               } else {
                  $("#" + _self_toggle)
                     .parent()
                     .toggleClass(_open_menu);
               }
               e.preventDefault();
            });
         }
      };
      // navClose
      MenuInit.navClose = function () {
         $(_nav_overlay).on("click", function () {
            $navbar_toggle.removeClass("active");
            $main_navbar.removeClass(_open_menu);
         });
         $doc.on("click", "body", function (e) {
            if (
               !$menu_toggle.is(e.target) &&
               $menu_toggle.has(e.target).length === 0 &&
               !$header.is(e.target) &&
               $header.has(e.target).length === 0 &&
               $win.width() < _navBreak
            ) {
               $navbar_toggle.removeClass("active");
               $main_navbar_classic.find(_main_menu).slideUp();
               $main_navbar.removeClass(_open_menu);
            }
         });
      };

      // menuToggle
      MenuInit.menuToggle = function () {
         if ($menu_toggle.exists()) {
            $menu_toggle.on("click", function (e) {
               var $parent = $(this).parent();
               if ($win.width() < _navBreak) {
                  $parent.children(_menu_drop).slideToggle(400);
                  $parent.siblings().children(_menu_drop).slideUp(400);
                  $parent.toggleClass(_open_nav);
                  $parent.siblings().removeClass(_open_nav);
               }
               e.preventDefault();
            });
         }
      };
      // mobileNav
      MenuInit.mobileNav = function () {
         if ($win.width() < _navBreak) {
            $main_navbar.delay(500).addClass(_mobMenu);
         } else {
            $main_navbar.delay(500).removeClass(_mobMenu);
            $main_navbar.removeClass(_open_menu);
         }
      };
      // currentPage
      MenuInit.currentPage = function () {
         if ($menu_link.exists()) {
            $menu_link.each(function () {
               if (_currentURL === this.href && _splitURL[1] !== "") {
                  $(this)
                     .closest("li")
                     .addClass("active")
                     .parent()
                     .closest("li")
                     .addClass("active");
               }
            });
         }
      };
      // Initialing
      MenuInit.Overlay();
      MenuInit.navToggle();
      MenuInit.navClose();
      MenuInit.menuToggle();
      MenuInit.mobileNav();
      MenuInit.currentPage();
      $win.on("resize", function () {
         MenuInit.mobileNav();
      });
   };
   McMode.components.docReady.push(McMode.MainMenu);

   //// Plugins ////
   /////////////////
   McMode.Plugins = {};

   // Carousel !Plugin  (Owl carousel)
   McMode.Plugins.carousel = function () {
      $(".tp-owl-carousel").each(function () {
         var owlCarousel = $(this),
            loop = owlCarousel.data("loop"),
            items = owlCarousel.data("items"),
            margin = owlCarousel.data("margin"),
            autoplay = owlCarousel.data("autoplay"),
            autoplayTimeout = owlCarousel.data("autoplay-timeout"),
            smartSpeed = owlCarousel.data("smart-speed"),
            dots = owlCarousel.data("dots"),
            nav = owlCarousel.data("nav"),
            navSpeed = owlCarousel.data("nav-speed"),
            xsDevice = owlCarousel.data("mobile-device"),
            xsDeviceNav = owlCarousel.data("mobile-device-nav"),
            xsDeviceDots = owlCarousel.data("mobile-device-dots"),
            smDevice = owlCarousel.data("sm-device"),
            smDeviceNav = owlCarousel.data("sm-device-nav"),
            smDeviceDots = owlCarousel.data("sm-device-dots"),
            smDevice2 = owlCarousel.data("sm-device2"),
            smDevice2Nav = owlCarousel.data("sm-device2-nav"),
            smDevice2Dots = owlCarousel.data("sm-device2-dots"),
            mdDevice = owlCarousel.data("md-device"),
            mdDeviceNav = owlCarousel.data("md-device-nav"),
            mdDeviceDots = owlCarousel.data("md-device-dots"),
            lgDevice = owlCarousel.data("lg-device"),
            lgDeviceNav = owlCarousel.data("lg-device-nav"),
            lgDeviceDots = owlCarousel.data("lg-device-dots"),
            centerMode = owlCarousel.data("center-mode"),
            HoverPause = owlCarousel.data("hoverpause"),
            stagepadding = owlCarousel.data("stagepadding");
         owlCarousel.owlCarousel({
            loop: loop ? true : false,
            items: items ? items : 4,
            lazyLoad: true,
            center: centerMode ? true : false,
            autoplayHoverPause: HoverPause ? true : false,
            margin: margin ? margin : 0,
            autoplay: autoplay ? true : false,
            autoplayTimeout: autoplayTimeout ? autoplayTimeout : 1000,
            smartSpeed: smartSpeed ? smartSpeed : 250,
            dots: dots ? true : false,
            nav: nav ? true : false,
            navText: [
               '<i class="fas fa-chevron-left"></i>',
               '<i class="fas fa-chevron-right"></i>',
            ],
            navSpeed: navSpeed ? true : false,
            responsiveClass: true,
            responsive: {
               0: {
                  items: xsDevice ? xsDevice : 1,
                  nav: xsDeviceNav ? true : false,
                  dots: xsDeviceDots ? true : false,
                  center: false,
               },
               576: {
                  items: smDevice2 ? smDevice2 : 2,
                  nav: smDevice2Nav ? true : false,
                  dots: smDevice2Dots ? true : false,
                  center: false,
               },
               768: {
                  items: smDevice ? smDevice : 3,
                  nav: smDeviceNav ? true : false,
                  dots: smDeviceDots ? true : false,
                  center: false,
               },
               992: {
                  items: mdDevice ? mdDevice : 4,
                  nav: mdDeviceNav ? true : false,
                  dots: mdDeviceDots ? true : false,
               },
               1200: {
                  items: lgDevice ? lgDevice : 4,
                  nav: lgDeviceNav ? true : false,
                  dots: lgDeviceDots ? true : false,
                  items: lgDevice ? lgDevice : 4,
                  stagePadding: stagepadding ? stagepadding : 0
               },
            },
         });
      });
   };
   McMode.components.winLoad.push(McMode.Plugins.carousel);

   // Filter
   McMode.Plugins.filterz = function () {
      var $filter_project = $(".case-studies-masonry");
      var $filter_tiger = $(".case-studies-menu li");

      $filter_project.each(function () {
         $(this).filterizr({
            layout: "packed",
         });
      });

      $filter_tiger.on("click", function () {
         $filter_tiger.removeClass("active");
         $(this).addClass("active");
      });
   };
   McMode.components.winLoad.push(McMode.Plugins.filterz);

   McMode.Plugins.popup = function () {
      var $content_popup = $(".content-popup"),
         $video_popup = $(".video-popup"),
         $image_popup = $(".image-popup");

      var popupInit = {};
      popupInit.content_popup = function () {
         if ($content_popup.exists()) {
            $content_popup.each(function () {
               $(this).magnificPopup({
                  type: "inline",
                  preloader: true,
                  removalDelay: 400,
                  mainClass: "mfp-fade content-popup",
               });
            });
         }
      };
      popupInit.video_popup = function () {
         if ($video_popup.exists()) {
            $video_popup.each(function () {
               $(this).magnificPopup({
                  type: "iframe",
                  removalDelay: 160,
                  preloader: true,
                  fixedContentPos: false,
                  callbacks: {
                     beforeOpen: function () {
                        this.st.image.markup = this.st.image.markup.replace(
                           "mfp-figure",
                           "mfp-figure mfp-with-anim"
                        );
                        this.st.mainClass = this.st.el.attr("data-effect");
                     },
                  },
               });
            });
         }
      };
      popupInit.image_popup = function () {
         if ($image_popup.exists()) {
            $image_popup.each(function () {
               $(this).magnificPopup({
                  type: "image",
                  mainClass: "mfp-fade image-popup",
               });
            });
         }
      };
      popupInit.content_popup();
      popupInit.video_popup();
      popupInit.image_popup();
   };
   McMode.components.docReady.push(McMode.Plugins.popup);

   // Back to top
   McMode.Plugins.tpBackToTop = function () {
      const backToTop = document.getElementById("back-to-top");
      window.onscroll = function () {
         scrollFunction();
      };
      function scrollFunction() {
         if (backToTop != null) {
            if (
               document.body.scrollTop > 80 ||
               document.documentElement.scrollTop > 80
            ) {
               backToTop.style.display = "block";
            } else {
               backToTop.style.display = "none";
            }
         }
      }
      if (backToTop != null) {
         backToTop.addEventListener("click", (e) => {
            e.preventDefault();
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
         });
      }
   };
   McMode.components.docReady.push(McMode.Plugins.tpBackToTop);

   // preloader
   McMode.Plugins.tpPreloader = function () {
      $("#loading").fadeOut("hide");
   };
   McMode.components.winLoad.push(McMode.Plugins.tpPreloader);
})(McMode, jQuery, window, document);