var Core = function ($, args) {
  'use strict';

  var _window = $(window);

  var checkFadeInElePos = function () {
    $('.fade-in-ele:not(.active)').each(function(index, el) {
      if (_window.scrollTop() > parseInt($(this).attr('fade-in-val'))) {
        $(this).addClass('active');

        if ($(this).hasClass('last-fade-in-ele')) {
          $(this).closest('.slider-last-fade-in').addClass('last-fade-in-true');
        }
      }
    });
  }

  var _calcFadeInElePos = function () {
    $('.fade-in-ele').each(function(index, el) {
      var thisFadeIn = ($(this).offset().top - _window.outerHeight()) + (_window.outerHeight()/4);

      $(this).attr('fade-in-val', thisFadeIn);
    });
  }

  var _helperResizeAdminToolbar = function () {
    var calcHeight = 0;

    if ($('#toolbar-administration').length > 0) {
      calcHeight = calcHeight + $('#toolbar-bar').outerHeight();

      if ($('body').hasClass('toolbar-tray-open')) {
        calcHeight = calcHeight + $('#toolbar-item-administration-tray').outerHeight();
      }
    }

    $('.main-nav').css('transform', 'translate(0,' + calcHeight + 'px)');
  }

  var handleDrupalBigMessage = function () {
    if ($('.drupal-big-message').length > 0) {
      if ($('.page-outer-wrap').hasClass('header-sticky-on-scroll')) {
        var calcHeight = $('.drupal-big-message').outerHeight();
        $('.main-nav').css('margin-top', calcHeight);
      } else {
        var calcHeight = $('.main-nav').outerHeight();
        $('body').css('margin-top', calcHeight);
      }
    }
  }

  var _handleGeneral = function () {
    if ($('#toolbar-administration').length > 0) {
      _helperResizeAdminToolbar();

      setTimeout(function() {
        _helperResizeAdminToolbar();
      }, 500);

      setTimeout(function() {
        _helperResizeAdminToolbar();
      }, 5000);

      $('#toolbar-bar').on('click', function(event) {
        setTimeout(function() {
          _helperResizeAdminToolbar();
        }, 50);
      });
    }

    handleDrupalBigMessage();

    setTimeout(function() {
      handleDrupalBigMessage();

      setTimeout(function() {
        handleDrupalBigMessage();

        setTimeout(function() {
          handleDrupalBigMessage();
        }, 500);
      }, 250);
    }, 50);

    //main nav sticky
    _window.on('scroll', function(event) {
      if ($('.page-outer-wrap').hasClass('header-sticky-on-scroll')) {
        var checkHeight = _window.outerHeight();

        if ($('.main-nav').hasClass('hero-half-pos')) {
          checkHeight = checkHeight/2;
        }

        if (_window.scrollTop() > checkHeight) {
          $('.main-nav').addClass('sticky');
        } else {
          $('.main-nav').removeClass('sticky');
        }
      } else {
        $('.main-nav').addClass('sticky');
      }
    }).trigger('scroll');

    $('.main-nav .hamburger-menu').on('click', function(event) {
      $(this).toggleClass('active');
      $('#mobile-overlay').toggleClass('active');
    });

    //handle current hash
    _window.on('scroll', function(event) {
      //main nav
      $('.main-nav a').each(function(index, el) {
        if (this.hash !== "") {
          var urlA = this.hash.replace('#', '');

          if ($(this.hash).length > 0) {
            if (_window.scrollTop() > $(this.hash).offset().top - 5) {
              $(this).addClass('active-allowed')
            } else {
              $(this).removeClass('active-allowed');
            }
          }
        }
      });

      $('.main-nav a').removeClass('active');
      $('.main-nav .active-allowed:last').addClass('active');

      //mobile nav
      $('#mobile-overlay a').each(function(index, el) {
        if (this.hash !== "") {
          var urlA = this.hash.replace('#', '');

          if ($(this.hash).length > 0) {
            if (_window.scrollTop() > $(this.hash).offset().top - 5) {
              $(this).addClass('active-allowed')
            } else {
              $(this).removeClass('active-allowed');
            }
          }
        }
      });

      $('#mobile-overlay a').removeClass('active');
      $('#mobile-overlay .active-allowed:last').addClass('active');
    });

    //handle global hash scroling
    $('a').on('click', function(event) {
      if (this.hash !== "") {
        if ($(this.hash).length > 0) {
          event.preventDefault();

          if ($('#mobile-overlay').hasClass('active')) {
            $('#mobile-overlay').removeClass('active');
            $('.main-nav .hamburger-menu').removeClass('active');
          }

          // Store hash
          var hash = this.hash;

          // Using jQuery's animate() method to add smooth page scroll
          // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
          $('html, body').animate({
            scrollTop: $(hash).offset().top
          }, 800, function(){
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
            checkFadeInElePos();
          });
        }
      }
    });

    //footer links
    $('#footer .row-legal a').each(function(index, el) {
      if ($.trim($(this).attr('href')) == '#' || $.trim($(this).attr('href')) == '') {
        $(this).closest('li').html($(this).text());
      }
    });

    //check hr margin
    $('hr').each(function(index, el) {
      if ($(this).is(':last-child')) {
        $(this).closest('section[class^="panel-"]').addClass('hr-margin-two');
      }
    });
  }

  var _handlePanelAbout = function () {
    $('.panel-about .about-slider-wrap').each(function(index, el) {
      var thisPanel = $(this).closest('.panel-about');

      $(this).slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        prevArrow: thisPanel.find('.slider-prev'),
        nextArrow: thisPanel.find('.slider-next'),
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              arrows: false,
              centerMode: true,
              centerPadding: '10%'
            }
          }
        ]
      });
    });
  }

  var _handleBgWithText = function () {
    $('.panel-bg-with-text .bg-image').each(function(index, el) {
      var paxImage = $(this);

      _window.on('scroll', function(event) {
        if ($('body').hasClass('autumn_parallax-0') == false) {
          if (_window.outerWidth() > 767) {
            var perc = 1 - ((paxImage.offset().top - _window.scrollTop() + paxImage.outerHeight()) / (_window.outerHeight() + paxImage.outerHeight()));

            if (perc <= 0) {
              paxImage.css('transform', 'translate3d(0, 0, 0)');
            } else if (perc >= 1) {
              paxImage.css('transform', 'translate3d(0, -15vw, 0)');
            } else {
              var calcVal = perc * 15;
              var calcValPx = (_window.outerWidth()/100) * calcVal;

              paxImage.css('transform', 'translate3d(0, -'+calcValPx+'px, 0)');
            }
          }
        } else {
          paxImage.css('transform', 'translate3d(0, 0, 0)');
        }
      });
    });

    $('.panel-bg-with-text').each(function(index, el) {
      if ($(this).next().hasClass('panel-bg-with-text')) {
        $(this).addClass('no-space-bottom');
        $(this).next().addClass('no-space-top')
      }
    });

    $('.panel-quotes .slider-wrap').each(function(index, el) {
      var thisPanel = $(this).closest('.panel-quotes');

      $(this).slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        prevArrow: thisPanel.find('.slider-prev'),
        nextArrow: thisPanel.find('.slider-next'),
        adaptiveHeight: true,
        speed: 500
      });
    });
  }

  var _handlePanelFaq = function () {
    $('.faq-element .faq-title').on('click', function(event) {
      $(this).closest('.faq-element').find('.faq-text').slideToggle();
      $(this).closest('.faq-element').toggleClass('active-faq');
    });
  }

  var _handleGlobalFadeIn = function () {
    $('.panel-text').each(function(index, el) {
      $(this).find('.big-p').children().each(function(index, el) {
        $(this).addClass('fade-in-ele');
      });
    });

    //prepare for panel about
    var itemsPerRow = 3;

    if (_window.width() < 1024) {
      itemsPerRow = 2;
    }

    itemsPerRow = itemsPerRow - 1;

    $('.panel-about').each(function(index, el) {
      $(this).find('.row-headline').addClass('fade-in-ele');

      $(this).find('.element-about').each(function(index, el) {
        if (index <= itemsPerRow) {
          $(this).find('.animation-helper').addClass('fade-in-ele');
          $(this).find('.animation-helper').addClass('fade-in-delay-' + index);

          if (index == itemsPerRow) {
            $(this).find('.animation-helper').addClass('last-fade-in-ele');
            $(this).closest('.about-outer-slider-wrap').addClass('last-fade-delay-' + itemsPerRow);
            $(this).closest('.about-outer-slider-wrap').addClass('slider-last-fade-in');
          }
        }
      });
    });

    $('.panel-bg-with-text').each(function(index, el) {
      $(this).find('.animation-helper').addClass('fade-in-ele');
    });

    $('.panel-hero.not-first-hero').each(function(index, el) {
      $(this).find('.animation-helper').addClass('fade-in-ele');
    });

    $('.panel-faq').each(function(index, el) {
      $(this).find('.row-headline').addClass('fade-in-ele');

      $(this).find('.faq-element').each(function(index, el) {
        $(this).addClass('fade-in-ele');

        if ($(this).closest('.right-faq-col').length > 0 && $(window).outerWidth() > 767) {
          $(this).addClass('fade-in-delay-1');
        }
      });
    });

    _window.on('resize', function(event) {
      _calcFadeInElePos();

      setTimeout(function() {
        _calcFadeInElePos();
      }, 1000);
    }).trigger('resize');

    $('body').on('custom-resize', function(event) {
      _calcFadeInElePos();

      setTimeout(function() {
        _calcFadeInElePos();
      }, 1000);
    });

    var scrollHandling = {
      allow: true,
      reallow: function() {
        scrollHandling.allow = true;
      },
      delay: 250
    };

    _window.on('scroll', function(event) {
      if(scrollHandling.allow) {
        checkFadeInElePos();

        scrollHandling.allow = false;
        setTimeout(scrollHandling.reallow, scrollHandling.delay);
      }
    }).trigger('scroll');
  }

  var _handlePanelHero = function () {
    $('.panel-hero .bg-image').each(function(index, el) {
      var paxImage = $(this);
      var paxClosestHero = $(this).closest('.panel-hero');
      var thisAllowed = true;

      if (paxClosestHero.hasClass('slick-slide')) {
        thisAllowed = false;

        if (paxClosestHero.hasClass('slick-current')) {
          thisAllowed = true;
        }
      }

      if (thisAllowed) {
        _window.on('scroll', function(event) {
          if (_window.outerWidth() > 767) {
            if ($('body').hasClass('autumn_parallax-0') == false && paxClosestHero.hasClass('hero-half') == false) {
              if (paxClosestHero.hasClass('first-panel-hero')) {
                var perc = _window.scrollTop()/_window.outerHeight();
                var endVal = '-20vh';
                var endValInt = 20;
              } else {
                var perc = 1 - ((paxClosestHero.offset().top - _window.scrollTop() + paxClosestHero.outerHeight()) / (_window.outerHeight() + paxClosestHero.outerHeight()));
                var endVal = '-40vh';
                var endValInt = 40;
              }

              if (perc <= 0) {
                paxImage.css('transform', 'translate3d(0, 0, 0)');
              } else if (perc >= 1) {
                paxImage.css('transform', 'translate3d(0, '+endVal+', 0)');
              } else {
                var calcVal = perc * endValInt;
                var calcValPx = (_window.outerHeight()/100) * calcVal;

                paxImage.css('transform', 'translate3d(0, -'+calcValPx+'px, 0)');
              }
            } else {
              $(this).closest('.panel-hero').addClass('no-parallax');
            }
          }
        });
      } else {
        $(this).closest('.panel-hero').addClass('no-parallax');
      }
    });
  }

  var initCheckFirstHero = function () {
    if ($('.page-outer-wrap').children().first().hasClass('panel-hero')) {
      $('.page-outer-wrap').children().first().addClass('first-panel-hero');
    }

    $('.panel-hero').each(function(index, el) {
      if ($(this).hasClass('first-panel-hero') == false) {
        $(this).addClass('not-first-hero');
      } else {
        if ($(this).hasClass('hero-half')) {
          $('.main-nav').addClass('hero-half-pos');
        }
      }
    });

    //error page remove margin
    if ($('.page-outer-wrap').hasClass('page-default')) {
      if ($('.page-outer-wrap ').children().length <= 1) {
        $('.panel-hero').css('margin-bottom', '0px');
      } else {
        $('.panel-hero').css('margin-bottom', '');
      }
    } else {
      $('.panel-hero').css('margin-bottom', '');
    }
  }



  return {
    constructor: function ($, args) {

      var _self = this;

      _self.init();

      return this;

    },

    /* ==========================================================================
    init
    ========================================================================== */

    init: function () {


      initCheckFirstHero();

      $('body').on('updatelayout', function(event) {
        initCheckFirstHero();
      });

      _handleGeneral();

      if ($('.panel-about').length > 0) {
        _handlePanelAbout();
      }

      if ($('.panel-bg-with-text').length > 0) {
        _handleBgWithText();
      }

      if ($('.panel-hero').length > 0) {
        _handlePanelHero();
      }

      if ($('.panel-faq').length > 0) {
        _handlePanelFaq();
      }

      if ($('body').hasClass('autumn_fade_in-1')) {
        _handleGlobalFadeIn();
      }
    }

  }.constructor($, args);
};

jQuery(function ($) {
  'use strict';
  new Core($, {});
});
