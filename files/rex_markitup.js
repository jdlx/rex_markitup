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
            buttonDefinitions: {
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
                                                  placeHolder:'Linktext hier',
                                                  key:'E'
                                                },
                                'linkmailto':   {
                                                  openWith:'"',
                                                  closeWith:'":[![E-Mail-Link eingeben:!:mailto:]!]',
                                                  placeHolder:'Linktext hier',
                                                  key:'M'
                                                },
                                'code':         {
                                                  openWith:' @',
                                                  closeWith:'@ '
                                                },
                                'blockquote':   {
                                                  openWith:'\n\nbq(!(([![Class]!]))!). ',
                                                  closeWith:'\n\n',
                                                  placeHolder:'Zitat hier...'
                                                }

            }, // buttonDefinitions

            buttonSets: {
              standard: 'h1,h2,h3,h4,h5,h6,|,bold,italic,stroke,|,listbullet,listnumeric,|,image,linkmedia,linkintern,linkextern,linkmailto',
              full:     'h1,h2,h3,h4,h5,h6,|,bold,italic,stroke,|,listbullet,listnumeric,|,image,linkmedia,linkintern,linkextern,linkmailto,|,code,blockquote'
            },
            buttonSet: 'standard'

        }; // defaults

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        defaults.buttons = defaults.buttonSets[defaults.buttonSet];

        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {

            this.markupSet = [];
            this.options.buttons = this.options.buttons.split(',');

            for(var i = 0; i < this.options.buttons.length; i++) {
              key = this.options.buttons[i];
              if(key === '|') {
                def = { separator:'---------------' };
              }else if(typeof this.options.buttonDefinitions[key] !== 'undefined') {
                def = this.options.buttonDefinitions[key];
                def.name = key;
                def.placeHolder = key;
                def.className = 'markitup-'+key;
              }else {
                def = null;
              }
              this.markupSet.push(def);
            }

            return $(this.element).markItUp({
              nameSpace:'textile',
              markupSet: this.markupSet
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
