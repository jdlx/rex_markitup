/**
 * RexMarkitup be_style Plugin for Redaxo
 *
 * @version 0.1.0
 * @link http://markitup.jaysalvat.com
 * @author Redaxo be_style plugin: rexdev.de
 * @package redaxo 4.3.x/4.4.x/4.5.x
 */

var markitupEditors = {};

(function ($) { // NOCONFLICT ONLOAD ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  $('textarea.rex-markitup').each(function(){
    area = $(this);

    var uid = area.constructor.guid;
    if(typeof area.attr('id') == 'undefined'){
      area.attr('id','instance-' + uid);
    }

    // w  = area.width();
    // h  = area.height();
    // ml = area.css("margin-left");

    markitupEditors[uid] = area.markItUp(rexMarkitup.sets.standard);

    // (RE)APPLY TEXTAREA DIMENSIONS
    // markitupEditors[uid].getWrapperElement().style.width = w+"px";
    // markitupEditors[uid].getWrapperElement().style.marginLeft = ml;
    // markitupEditors[uid].getScrollerElement().style.height = h+"px";
    // markitupEditors[uid].refresh();
  }); // textarea.each

////////////////////////////////////////////////////////////////////////////////
})(jQuery); // END NOCONFLICT ONLOAD ///////////////////////////////////////////
