/**
 * RexMarkitup be_style Plugin for Redaxo
 *
 * @version 0.1.0
 * @link http://markitup.jaysalvat.com
 * @author Redaxo be_style plugin: rexdev.de
 * @package redaxo 4.3.x/4.4.x/4.5.x
 */

;(function ( $, window, document, undefined ) {

    var pluginName = "rexMarkItUp",
        defaults = {
            namespace: 'textile',
            buttondefinitions: {
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
                                'bold':         {
                                                  openWith:'*',
                                                  closeWith:'*',
                                                  key:'B'
                                                },
                                'italic':       {
                                                  openWith:'_',
                                                  closeWith:'_',
                                                  key:'I'
                                                },
                                'stroke':       {
                                                  openWith:'-',
                                                  closeWith:'-',
                                                  key:'S'
                                                },
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
                                'code':         {
                                                  openWith:' @',
                                                  closeWith:'@ '
                                                },
                                'blockquote':   {
                                                  openWith:'\n\nbq(!(([![Class]!]))!). ',
                                                  closeWith:'\n\n'
                                                }

            }, // buttondefinitions

            buttonsets: {
              standard: 'h1,h2,h3,h4,h5,h6,|,bold,italic,stroke,|,listbullet,listnumeric,|,image,linkmedia,linkintern,linkextern,linkmailto',
              full:     'h1,h2,h3,h4,h5,h6,|,bold,italic,stroke,|,listbullet,listnumeric,|,image,linkmedia,linkintern,linkextern,linkmailto,|,code,blockquote'
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

        init: function() {

            this.getI18n();
            if(typeof rex_markitup !== 'undefined') {
              this.options = $.extend( {}, this.options, rex_markitup ); console.log('this.options:',this.options);
            }

            this.options = $.extend( {}, this.options, $(this.element).data() );

            this.markupSet = [];
            this.options.buttonset = typeof this.options.buttonset == 'undefined' ? 'standard' : this.options.buttonset;
            this.options.buttons   = typeof this.options.buttons == 'undefined' ? this.options.buttonsets[this.options.buttonset].split(',') : this.options.buttons.split(',');

            for(var i = 0; i < this.options.buttons.length; i++) {
              key = this.options.buttons[i];
              if(key === '|') {
                def = { separator:'---------------' };
              }else if(typeof this.options.buttondefinitions[key] !== 'undefined') {
                def = this.options.buttondefinitions[key];
                def.name = typeof this.i18n['markitup_'+key] != 'undefined' ? this.i18n['markitup_'+key] : key;
                if(typeof this.i18n['markitup_'+key+'_placeholder'] != 'undefined') {
                  def.placeHolder = this.i18n['markitup_'+key+'_placeholder'];
                }
                def.className = 'markitup-'+key;
              }else {
                def = null;
              }
              this.markupSet.push(def);
            }

            return $(this.element).markItUp({
              nameSpace: this.options.namespace,
              markupSet: this.markupSet
            });
        },
        getI18n: function(){
          $.ajax({
            type: 'POST',
            url: 'index.php',
            async: false,
            dataType:'json',
            data: {'rex_markitup_api': JSON.stringify({func:'get_i18n'})},
              success: $.proxy(function(data) { //console.log('data:',data);
                this.i18n = data;
              },this),
            error: function(e){console.warn('error:',e);}
          });
        },
        buttonsEP: function(){
          $.ajax({
            type: 'POST',
            url: 'index.php',
            async: false,
            dataType:'json',
            data: {'rex_markitup_api': JSON.stringify({
              func:'buttons_ep',
              buttondefinitions: this.options.buttondefinitions
              })
            },
            success: $.proxy(function(data) { //console.log('data:',data);
              //this.i18n = data;
            },this),
            error: function(e){console.warn('error:',e);}
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
