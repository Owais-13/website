 AOS.init({
 	duration: 800,
 	easing: 'slide'
 });

(function($) {

	"use strict";

	$(window).stellar({
    responsive: true,
    parallaxBackgrounds: true,
    parallaxElements: true,
    horizontalScrolling: false,
    hideDistantElements: false,
    scrollProperty: 'scroll'
  });


	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	// loader
	var loader = function() {
		setTimeout(function() { 
			if($('#ftco-loader').length > 0) {
				$('#ftco-loader').removeClass('show');
			}
		}, 1);
	};
	loader();

	// Scrollax
   $.Scrollax();

	var carousel = function() {
		$('.home-slider').owlCarousel({
	    loop:true,
	    autoplay: true,
	    margin:0,
	    animateOut: 'fadeOut',
	    animateIn: 'fadeIn',
	    nav:false,
	    autoplayHoverPause: false,
	    items: 1,
	    navText : ["<span class='ion-md-arrow-back'></span>","<span class='ion-chevron-right'></span>"],
	    responsive:{
	      0:{
	        items:1
	      },
	      600:{
	        items:1
	      },
	      1000:{
	        items:1
	      }
	    }
		});
		$('.carousel-testimony').owlCarousel({
			autoplay: true,
			center: true,
			loop: true,
			items:1,
			margin: 30,
			stagePadding: 0,
			nav: false,
			navText: ['<span class="ion-ios-arrow-back">', '<span class="ion-ios-arrow-forward">'],
			responsive:{
				0:{
					items: 1
				},
				600:{
					items: 1
				},
				1000:{
					items: 3
				}
			}
		});

	};
	carousel();

	$('nav .dropdown').hover(function(){
		var $this = $(this);
		// 	 timer;
		// clearTimeout(timer);
		$this.addClass('show');
		$this.find('> a').attr('aria-expanded', true);
		// $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
		$this.find('.dropdown-menu').addClass('show');
	}, function(){
		var $this = $(this);
			// timer;
		// timer = setTimeout(function(){
			$this.removeClass('show');
			$this.find('> a').attr('aria-expanded', false);
			// $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
			$this.find('.dropdown-menu').removeClass('show');
		// }, 100);
	});


	$('#dropdown04').on('show.bs.dropdown', function () {
	  console.log('show');
	});

	// scroll
	var scrollWindow = function() {
		$(window).scroll(function(){
			var $w = $(this),
					st = $w.scrollTop(),
					navbar = $('.ftco_navbar'),
					sd = $('.js-scroll-wrap');

			if (st > 150) {
				if ( !navbar.hasClass('scrolled') ) {
					navbar.addClass('scrolled');	
				}
			} 
			if (st < 150) {
				if ( navbar.hasClass('scrolled') ) {
					navbar.removeClass('scrolled sleep');
				}
			} 
			if ( st > 350 ) {
				if ( !navbar.hasClass('awake') ) {
					navbar.addClass('awake');	
				}
				
				if(sd.length > 0) {
					sd.addClass('sleep');
				}
			}
			if ( st < 350 ) {
				if ( navbar.hasClass('awake') ) {
					navbar.removeClass('awake');
					navbar.addClass('sleep');
				}
				if(sd.length > 0) {
					sd.removeClass('sleep');
				}
			}
		});
	};
	scrollWindow();

	
	var counter = function() {
		
		$('#section-counter').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {

				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
				$('.number').each(function(){
					var $this = $(this),
						num = $this.data('number');
						console.log(num);
					$this.animateNumber(
					  {
					    number: num,
					    numberStep: comma_separator_number_step
					  }, 7000
					);
				});
				
			}

		} , { offset: '95%' } );

	}
	counter();

	var contentWayPoint = function() {
		var i = 0;
		$('.ftco-animate').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .ftco-animate.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn ftco-animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft ftco-animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight ftco-animated');
							} else {
								el.addClass('fadeInUp ftco-animated');
							}
							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '95%' } );
	};
	contentWayPoint();


	// magnific popup
	$('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
     gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      verticalFit: true
    },
    zoom: {
      enabled: true,
      duration: 300 // don't foget to change the duration also in CSS
    }
  });

  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false
  });


  $('.appointment_date').datepicker({
	  'format': 'm/d/yyyy',
	  'autoclose': true
	});

	$('.appointment_time').timepicker();




})(jQuery);

// Premium Animations
(function($) {
    "use strict";

    // Premium Scroll Animations
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        // Navbar Animation
        if (scroll > 50) {
            $('.ftco-navbar-light').addClass('scrolled');
        } else {
            $('.ftco-navbar-light').removeClass('scrolled');
        }

        // Fade In Elements on Scroll
        $('.fade-in-element').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('visible');
            }
        });
    });

    // Premium Feature Hover Effects
    $('.premium-feature').hover(
        function() {
            $(this).find('.icon').addClass('animated pulse');
        },
        function() {
            $(this).find('.icon').removeClass('animated pulse');
        }
    );

    // Smooth Scroll for Links
    $('a[href*="#"]').not('[href="#"]').click(function(e) {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 100
                }, 1000, 'easeInOutExpo');
                return false;
            }
        }
    });

    // Enhanced Counter Animation
    $('.premium-counter').each(function() {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 4000,
            easing: 'swing',
            step: function(now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

    // Premium Carousel Settings
    $('.premium-carousel').owlCarousel({
        items: 1,
        loop: true,
        margin: 0,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<span class="ion-ios-arrow-back">', '<span class="ion-ios-arrow-forward">'],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    });

    // Initialize AOS with Custom Settings
    AOS.init({
        duration: 800,
        easing: 'slide',
        once: true,
        offset: 100,
        delay: 100
    });

    // Premium Modal Animation
    $('.premium-modal-trigger').on('click', function(e) {
        e.preventDefault();
        $('.premium-modal').addClass('show-modal');
        $('body').addClass('modal-open');
    });

    $('.premium-modal-close').on('click', function() {
        $('.premium-modal').removeClass('show-modal');
        $('body').removeClass('modal-open');
    });

    // Enhanced Magnific Popup
    $('.premium-popup-image').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        fixedContentPos: true,
        mainClass: 'mfp-no-margins mfp-with-zoom',
        image: {
            verticalFit: true
        },
        zoom: {
            enabled: true,
            duration: 300
        }
    });

    // Premium Form Validation
    $('.premium-form').on('submit', function(e) {
        e.preventDefault();
        var form = $(this);
        form.addClass('was-validated');
        
        if (form[0].checkValidity() === false) {
            e.stopPropagation();
        } else {
            // Add your form submission logic here
            alert('Form submitted successfully!');
        }
    });

})(jQuery);

// Micro Animations Controller
(function($) {
    "use strict";
    
    // Scroll Progress Indicator
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        var height = $(document).height() - $(window).height();
        var progress = (scroll / height) * 100;
        $('.scroll-progress').css('width', progress + '%');
    });

    // Smooth Element Reveal on Scroll
    function revealOnScroll() {
        $('.reveal-on-scroll').each(function(i) {
            var elementTop = $(this).offset().top;
            var elementVisible = 150;
            var windowHeight = $(window).height();
            var windowTop = $(window).scrollTop();
            
            if (elementTop < (windowTop + windowHeight - elementVisible)) {
                $(this).addClass('active');
            }
        });
    }

    $(window).on('scroll', revealOnScroll);
    
    // Hover Intent for Menu Items
    $('.nav-item').hoverIntent({
        over: function() {
            $(this).find('.dropdown-menu').addClass('show');
        },
        out: function() {
            $(this).find('.dropdown-menu').removeClass('show');
        },
        timeout: 200
    });

    // Smooth Button Click Effect
    $('.btn').on('mousedown', function() {
        $(this).addClass('clicked');
    }).on('mouseup mouseleave', function() {
        $(this).removeClass('clicked');
    });

    // Text Scramble Effect for Headlines
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += char;
                } else {
                    output += from;
                }
            }
            this.el.innerText = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Apply Text Scramble to Headlines
    $('.heading-section h2').each(function() {
        const fx = new TextScramble(this);
        let counter = 0;
        const next = () => {
            fx.setText($(this).data('text')).then(() => {
                setTimeout(next, 3000);
            });
            counter = (counter + 1) % phrases.length;
        };
        next();
    });

    // Parallax Effect for Background Images
    $(window).scroll(function() {
        var scrolled = $(window).scrollTop();
        $('.parallax').each(function() {
            var speed = $(this).data('speed') || 0.5;
            var offset = $(this).offset().top;
            var yPos = -(scrolled * speed);
            $(this).css('background-position', '50% ' + yPos + 'px');
        });
    });

    // Magnetic Buttons
    $('.btn-magnetic').on('mousemove', function(e) {
        const pos = $(this).offset();
        const mx = e.pageX - pos.left - $(this).width()/2;
        const my = e.pageY - pos.top - $(this).height()/2;
        
        $(this).css('transform', 'translate('+ mx * 0.15 +'px, '+ my * 0.3 +'px)');
    }).on('mouseleave', function() {
        $(this).css('transform', 'translate(0px, 0px)');
    });

    // Smooth Counter Animation
    $('.number').each(function() {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 2000,
            easing: 'swing',
            step: function(now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

    // Image Tilt Effect
    $('.project img').tilt({
        maxTilt: 5,
        scale: 1.02,
        speed: 400,
        transition: true,
        perspective: 500,
        glare: true,
        maxGlare: .5
    });

    // Cursor Follow Effect
    let cursor = $('<div class="cursor"></div>').appendTo('body');
    let follower = $('<div class="cursor-follower"></div>').appendTo('body');

    $(document).on('mousemove', function(e) {
        cursor.css({
            left: e.clientX,
            top: e.clientY
        });
        
        setTimeout(function() {
            follower.css({
                left: e.clientX,
                top: e.clientY
            });
        }, 100);
    });

    $('a, button').hover(
        function() {
            cursor.addClass('active');
            follower.addClass('active');
        },
        function() {
            cursor.removeClass('active');
            follower.removeClass('active');
        }
    );

})(jQuery);

// Razorpay Integration
const razorpayKey = 'YOUR_RAZORPAY_KEY_ID'; // Replace with your actual Razorpay key

function createRazorpayOrder(amount) {
  // This should call your backend API to create an order
  return fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount,
    }),
  }).then(response => response.json());
}

// Handle enrollment button clicks
$('.enroll-btn').on('click', function(e) {
  e.preventDefault();
  const amount = $(this).data('amount');
  const courseName = $(this).siblings('h3').text();
  $('#course').val(courseName.toLowerCase().replace(' ', '-'));
  $('#enrollModal').modal('show');
});

// Handle payment button click
$('#proceed-payment').on('click', function() {
  const form = document.getElementById('enrollment-form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const courseSelect = document.getElementById('course');
  const selectedOption = courseSelect.options[courseSelect.selectedIndex];
  const courseName = selectedOption.text;
  const amount = courseName.includes('Listening') ? 599900 :
                 courseName.includes('Reading') ? 699900 :
                 courseName.includes('Writing') ? 799900 : 899900;

  // Create Razorpay order
  createRazorpayOrder(amount).then(order => {
    const options = {
      key: razorpayKey,
      amount: amount,
      currency: "INR",
      name: "IELTS Master",
      description: `Enrollment for ${courseName}`,
      order_id: order.id,
      handler: function(response) {
        // Handle successful payment
        alert('Payment successful! You will receive enrollment details via email.');
        $('#enrollModal').modal('hide');
        // Here you should call your backend to verify payment and complete enrollment
      },
      prefill: {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        contact: document.getElementById('phone').value,
      },
      theme: {
        color: "#2c98f0"
      }
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }).catch(error => {
    console.error('Error creating order:', error);
    alert('Something went wrong. Please try again.');
  });
});

// Mobile responsive enhancements
function adjustForMobile() {
  if (window.innerWidth < 768) {
    // Adjust navigation
    $('.navbar-brand').addClass('w-75');
    
    // Adjust course cards
    $('.pricing-entry').addClass('mb-4');
    
    // Adjust modal for better mobile view
    $('.modal-dialog').addClass('modal-dialog-centered');
    
    // Adjust form elements for better touch interaction
    $('input, select, textarea').addClass('form-control-lg');
    
    // Enhance button touch areas
    $('.btn').addClass('btn-lg');
  } else {
    // Remove mobile-specific classes
    $('.navbar-brand').removeClass('w-75');
    $('.pricing-entry').removeClass('mb-4');
    $('.modal-dialog').removeClass('modal-dialog-centered');
    $('input, select, textarea').removeClass('form-control-lg');
    $('.btn').removeClass('btn-lg');
  }
}

// Call on load and resize
$(window).on('load resize', adjustForMobile);

// Add smooth scrolling for mobile
$('a[href*="#"]').not('[href="#"]').click(function(event) {
  if (
    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
    && 
    location.hostname == this.hostname
  ) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    if (target.length) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - 70
      }, 1000);
    }
  }
});

// Enhanced mobile menu
$('.navbar-toggler').on('click', function() {
  $(this).toggleClass('active');
  if ($('#ftco-nav').hasClass('show')) {
    $('body').css('overflow', 'auto');
  } else {
    $('body').css('overflow', 'hidden');
  }
});

// Improve mobile form experience
$('input, select, textarea').on('focus', function() {
  if (window.innerWidth < 768) {
    // Scroll to focused input
    $('html, body').animate({
      scrollTop: $(this).offset().top - 100
    }, 500);
  }
});

