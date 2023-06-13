jQuery( function ($) {
  $(document).on( "click", ".wpvcb-youtube-play",function (e) {
    e.preventDefault();
    var th = $(this);
    var type = th.data('vtype');
    var id = th.data('vid');
    var params = th.data('params');
    var embed_url = 'https://www.youtube.com/embed/' + id + params;
    if( type == 'vimeo' ) {
      embed_url = 'https://player.vimeo.com/video/' + id + params;
    }
    
    var width = th.data('width');
    var height = th.data('height');
    var autoplay = th.data('autoplay');
    var fullscreen = th.data('fullscreen');
    var extra_attr = '';
    extra_attr = ( autoplay ) ? 'allow="autoplay"' : '';
    if( type == 'vimeo' ) {
      if( autoplay || fullscreen ) {
        extra_attr = 'allow="';
        extra_attr = ( autoplay ) ? extra_attr + 'autoplay;' : '';
        extra_attr = ( fullscreen ) ? extra_attr + 'fullscreen;' : '';
        extra_attr =  extra_attr + '"';
      }
    }
    var iframe = '<iframe src="'+embed_url+'" width="'+width+'" height="'+height+'" '+fullscreen+' '+extra_attr+'></iframe>';
    th.parent().html(iframe);
  });
  $(document).on( "click", ".wpvcb-vimeo-play",function (e) {
    e.preventDefault();
    var th = $(this);
    var type = th.data('vtype');
    var id = th.data('vid');
    var params = th.data('params');
    var embed_url = 'https://player.vimeo.com/video/' + id + params;
    var width = th.data('width');
    var height = th.data('height');
    var autoplay = th.data('autoplay');
    var fullscreen = th.data('fullscreen');
    var extra_attr = '';
    if( autoplay || fullscreen ) {
      extra_attr = 'allow="';
      extra_attr = ( autoplay ) ? extra_attr + 'autoplay;' : '';
      extra_attr = ( fullscreen ) ? extra_attr + 'fullscreen;' : '';
      extra_attr =  extra_attr + '"';
    }
    var iframe = '<iframe src="'+embed_url+'" width="'+width+'" height="'+height+'" '+fullscreen+' '+extra_attr+'></iframe>';
    th.parent().html(iframe);
  });

});