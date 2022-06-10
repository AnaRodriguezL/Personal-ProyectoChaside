(function($) {
  'use strict';
  $(function() {
    $('[data-toggle="offcanvas"]').on("click", function() {
      $('.sidebar-offcanvas, .main-panel').toggleClass('active');
    });
  });
})(jQuery);