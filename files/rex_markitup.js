/**
 * RexMarkitup be_style Plugin for Redaxo
 *
 * @version 0.9.0
 * @link http://markitup.jaysalvat.com
 * @author Redaxo be_style plugin: rexdev.de
 * @package redaxo 4.4.x/4.5.x
 */

var insertFileLink = function(file){
  jQuery.markItUp({
    openWith:'"',
    closeWith:'":'+file,
    placeHolder:file
  });
};

var insertLink = function(url,desc){
  jQuery.markItUp({
    openWith:'"',
    closeWith:'":'+url,
    placeHolder:desc
  });
};

var insertImage = function(src, desc){
  // jQuery.markItUp({replaceWith:"!./"+ src +"!"});
  img = src.replace(/files\//, "");
  jQuery.markItUp({
    replaceWith:"!index.php?rex_resize=[![Image Width]!]w__"+ img +"!"
    });
};

var markitup_getURLParam = function(strParamName){
  var strReturn = "";
  var strHref = window.location.href;
  if ( strHref.indexOf("?") > -1 ){
    var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
    var aQueryString = strQueryString.split("&");
    for ( var iParam = 0; iParam < aQueryString.length; iParam++ ){
      if( aQueryString[iParam].indexOf(strParamName.toLowerCase() + "=") > -1 ){
        var aParam = aQueryString[iParam].split("=");
        strReturn = aParam[1];
        break;
      }
    }
  }
  return unescape(strReturn);
};

jQuery(function($){

  $(document).on('dblclick','.markItUpFooter', function(e){
    $(e.target).next('.markItUpPreviewFrame').remove();
  });

});

;(function ( $, window, document, undefined ) {

    var pluginName = "rexMarkItUp",
        defaults = {
            namespace: 'textile',
            buttondefinitions: {
                                // BLOCK MODIFIER
                                ////////////////////////////////////////////////
                                'h1':           {
                                                  openWith:'\n\nh1(!(([![Class]!]))!). ',
                                                  closeWith:'\n\n',
                                                  key:'1'
                                                },
                                'h2':           {
                                                  openWith:'\n\nh2(!(([![Class]!]))!). ',
                                                  closeWith:'\n\n',
                                                  key:'2'
                                                },
                                'h3':           {
                                                  openWith:'\n\nh3(!(([![Class]!]))!). ',
                                                  closeWith:'\n\n',
                                                  key:'3'
                                                },
                                'h4':           {
                                                  openWith:'\n\nh4(!(([![Class]!]))!). ',
                                                  closeWith:'\n\n',
                                                  key:'4'
                                                },
                                'h5':           {
                                                  openWith:'\n\nh5(!(([![Class]!]))!). ',
                                                  closeWith:'\n\n',
                                                  key:'5'
                                                },
                                'h6':           {
                                                  openWith:'\n\nh6(!(([![Class]!]))!). ',
                                                  closeWith:'\n\n',
                                                  key:'6'
                                                },
                                'p':            {
                                                  openWith:'\n\np(!(([![Class]!]))!). ',
                                                  closeWith:'\n\n'
                                                },
                                'blockquote':   {
                                                  openWith:'\n\nbq(!(([![Class]!]))!). ',
                                                  closeWith:'\n\n'
                                                },
                                'bc':           {
                                                  openWith:'\n\nbc(!(([![Class]!]))!). ',
                                                  closeWith:'\n\n'
                                                },

                                // PHRASE MODIFIER
                                ////////////////////////////////////////////////
                                'bold':         {
                                                  openWith:' *',
                                                  closeWith:'* ',
                                                  key:'B'
                                                },
                                'italic':       {
                                                  openWith:' _',
                                                  closeWith:'_ ',
                                                  key:'I'
                                                },
                                'stroke':       {
                                                  openWith:' -',
                                                  closeWith:'- ',
                                                  key:'S'
                                                },
                                'ins':          {
                                                  openWith:' +',
                                                  closeWith:'+ '
                                                },
                                'cite':         {
                                                  openWith:' ??',
                                                  closeWith:'?? '
                                                },
                                'code':         {
                                                  openWith:' @',
                                                  closeWith:'@ '
                                                },

                                // ALIGN
                                ////////////////////////////////////////////////
                                'aligncenter':  {
                                                  openWith:'\np(!(([![Class]!])!)=. '
                                                },
                                'alignjustify': {
                                                  openWith:'\np(!(([![Class]!])!)<>. '
                                                },
                                'alignleft':    {
                                                  openWith:'\np(!(([![Class]!])!)<. '
                                                },
                                'alignright':   {
                                                  openWith:'\np(!(([![Class]!])!)>. '
                                                },

                                // LISTS
                                ////////////////////////////////////////////////
                                'listbullet':   {
                                                  replaceWith: function(h) {
                                                    var selection = h.selection;
                                                    var lines = selection.split(/\r?\n/);
                                                    var r = "";
                                                    var start = "* ";
                                                    for (var i=0; i < lines.length; i++) {
                                                      line = lines[i];
                                                      if (line.substr(0,1) == "*" || line.substr(0,1) == "#") {
                                                        start = "*";
                                                        if (i != lines.length - 1) {
                                                          line = line + "\n";
                                                        }
                                                      } else {
                                                        line = line + "\n";
                                                      }
                                                      r = r + start + line;
                                                    }
                                                    return r;
                                                  }
                                                },
                                'listnumeric':  {
                                                  replaceWith: function(h) {
                                                    var selection = h.selection;
                                                    var lines = selection.split(/\r?\n/);
                                                    var r = "";
                                                    var start = "# ";
                                                    for (var i=0; i < lines.length; i++) {
                                                      line = lines[i];
                                                      if (line.substr(0,1) == "*" || line.substr(0,1) == "#") {
                                                        start = "*";
                                                        if (i != lines.length - 1) {
                                                          line = line + "\n";
                                                        }
                                                      } else {
                                                        line = line + "\n";
                                                      }
                                                      r = r + start + line;
                                                    }
                                                    return r;
                                                  }
                                                },
                                'image':        {
                                                  openWith:' ',
                                                  closeWith:' ',
                                                  beforeInsert:function(h) {
                                                    openMediaPool('TINYIMG');
                                                  },
                                                  key:'P'
                                                },
                                'linkmedia':    {
                                                  beforeInsert:function(h) {
                                                    openMediaPool('TINY');
                                                  },
                                                  key:'M'
                                                },
                                'linkintern':   {
                                                  beforeInsert:function() {
                                                    openLinkMap('TINY','&clang='+markitup_getURLParam('clang'));
                                                  },
                                                  key:'L'
                                                },
                                'linkextern':   {
                                                  openWith:'"',
                                                  closeWith:'":[![Link eingeben:!:http://]!]',
                                                  key:'E'
                                                },
                                'linkmailto':   {
                                                  openWith:'"',
                                                  closeWith:'":[![E-Mail-Link eingeben:!:mailto:]!]',
                                                  key:'M'
                                                },
                                'preview':      {
                                                  call:'preview'
                                                },
                                'clean':        {
                                                  replaceWith: function(h) {
                                                    var s = h.selection;
                                                    // link intern / extern / mailto / linkfiles
                                                    s = s.replace(/"(.*?)":(https?|redaxo|mailto|files)(:|\/)(\/\/)?.+?\s/g, '$1 ');
                                                    // files
                                                    s = s.replace(/!files\/.*?!/g, '');
                                                    // p
                                                    s = s.replace(/p.*?\.\s(.*?)/g, '$1');
                                                    // h(1-9)
                                                    s = s.replace(/h\d+.*?\.\s(.*?)/g, '$1');
                                                    // strong
                                                    s = s.replace(/\s\*(.*?)\*\s/g, ' $1 ');
                                                    // italic
                                                    s = s.replace(/\s\_(.*?)\_\s/g, ' $1 ');
                                                    // stroke
                                                    s = s.replace(/\s\-(.*?)\-\s/g, ' $1 ');
                                                    // underline
                                                    s = s.replace(/\s\+(.*?)\+\s/g, ' $1 ');
                                                    // superscript
                                                    s = s.replace(/\s\^(.*?)\^\s/g, ' $1 ');
                                                    // subscript
                                                    s = s.replace(/\s\~(.*?)\~\s/g, ' $1 ');
                                                    // code
                                                    s = s.replace(/\s\@(.*?)\@\s/g, ' $1 ');
                                                    // blockquote
                                                    s = s.replace(/bq.*?\.\s(.*?)/g, '$1');
                                                    // ul
                                                    s = s.replace(/\*\s(.*?)/g, '$1');
                                                    // ol
                                                    s = s.replace(/\#\s(.*?)/g, '$1');

                                                    return s;
                                                  }
                                                },
                                'fullscreen':   {
                                                  beforeInsert: function(markItUp) {
                                                    p = $(markItUp.textarea).parents("div.markItUpContainer");
                                                    if(p.hasClass("fullscreen")){
                                                      p.removeClass("fullscreen");
                                                    }else{
                                                      p.addClass("fullscreen");
                                                    }
                                                  },
                                                  key:"F"
                                                },
                                'blockmenu':    {
                                                  dropMenuButtons: ['h1','h2','h3','h4','h5','h6','|','p','blockquote','bc'],
                                                  dropMenu: []
                                                },
                                'linkmenu':     {
                                                  dropMenuButtons: ['linkintern','linkextern','linkmailto'],
                                                  dropMenu: []
                                                }

            }, // buttondefinitions

            buttonsets: {
              standard: 'h1,h2,h3,h4,|,bold,italic,stroke,|,listbullet,listnumeric,|,image,linkmedia,|,linkintern,linkextern,linkmailto,fullscreen',
              full:     'blockmenu,|,h1,h2,h3,h4,h5,h6,|,bold,italic,stroke,ins,cite,code,|,alignleft,alignright,aligncenter,alignjustify,|,listbullet,listnumeric,|,image,linkmedia,|,linkmenu,linkintern,linkextern,linkmailto,|,preview,fullscreen'
            }

        }; // defaults

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {                                                                                                       //console.log('this.options:',this.options);
            this.guid = $(this.element).constructor.guid;

            if(typeof rex_markitup.i18n === 'undefined') {
              this.getI18n();
            }

            if(typeof rex_markitup !== 'undefined') {
              if(typeof rex_markitup.buttonsets !== 'undefined') {
                this.options.buttonsets = $.extend( {}, this.options.buttonsets, rex_markitup.buttonsets );                      // console.log('this.options.buttonsets:',this.options.buttonsets);
              }
              if(typeof rex_markitup.buttondefinitions !== 'undefined') {
                this.options.buttondefinitions = $.extend( {}, this.options.buttondefinitions, rex_markitup.buttondefinitions ); // console.log('this.options.buttondefinitions:',this.options.buttondefinitions);
              }
            }

            this.options = $.extend( {}, this.options, $(this.element).data() );

            this.markupSet = [];
            this.options.buttonset = ( typeof this.options.buttonset == 'undefined' || typeof this.options.buttonsets[this.options.buttonset] == 'undefined' ) ? 'standard' : this.options.buttonset;
            this.options.buttons   = typeof this.options.buttons == 'undefined' ? this.options.buttonsets[this.options.buttonset].split(',') : this.options.buttons.split(',');

            var buttonPrepare = $.proxy(function(key){                                                                  //console.group(key);
              var def = false;
              if(key === '|'){
                def = { separator:'---------------' };
              }else if(typeof this.options.buttondefinitions[key] !== 'undefined') {
                def = this.options.buttondefinitions[key];
                if(typeof def.name === 'undefined' && typeof rex_markitup.i18n['markitup_'+key] != 'undefined'){
                  def.name = rex_markitup.i18n['markitup_'+key];
                }
                if(typeof def.placeHolder === 'undefined' && typeof rex_markitup.i18n['markitup_'+key+'_placeholder'] != 'undefined'){
                  def.placeHolder = rex_markitup.i18n['markitup_'+key+'_placeholder'];
                }
                def.className = 'markitup-'+key;
                if(typeof def.dropMenu !== 'undefined' && typeof def.dropMenuButtons !== 'undefined') {                 // console.log(def.dropMenu);
                  for(var i = 0; i < def.dropMenuButtons.length; i++) {
                    subdef = buttonPrepare(def.dropMenuButtons[i]);                                                     //console.log('subdef:',subdef);
                    def.dropMenu.push(subdef);
                  }
                }
              }                                                                                                         //console.groupEnd();
              return def;
            },this);

            for(var i = 0; i < this.options.buttons.length; i++) {
              def = buttonPrepare(this.options.buttons[i]);
              if(def){
                this.markupSet.push(def);
              }
            }

            return $(this.element).markItUp({
              nameSpace: this.options.namespace,
              markupSet: this.markupSet,
              previewParserPath: 'index.php?api=rex_markitup_api&func=parse_preview&uid='+this.guid,
              previewParserVar: 'rex_markitup_markup',
              previewAutoRefresh: true
            });
        },
        getI18n: function(){
          $.ajax({
            type: 'POST',
            url: 'index.php',
            async: false,
            dataType:'json',
            data: {'rex_markitup_api': JSON.stringify({func:'get_i18n'})},
            success: $.proxy(function(data) { rex_markitup.i18n = data; /*console.log('data:',data);*/ },this),
            error: function(e){ console.warn('error:',e); }
          });
        }

    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );



var markitupEditors = {};

(function ($) { // NOCONFLICT ONLOAD ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  $('textarea.rex-markitup').each(function(){
    area = $(this);

    var uid = area.constructor.guid;
    if(typeof area.attr('id') == 'undefined'){
      area.attr('id','instance-' + uid);
    }

    markitupEditors[uid] = area.rexMarkItUp();
  }); // textarea.each

////////////////////////////////////////////////////////////////////////////////
})(jQuery); // END NOCONFLICT ONLOAD ///////////////////////////////////////////
