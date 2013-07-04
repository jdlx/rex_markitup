/**
 * RexMarkitup be_style Plugin for Redaxo
 *
 * @version 0.9.3
 * @link http://markitup.jaysalvat.com
 * @author Redaxo be_style plugin: rexdev.de
 * @package redaxo 4.4.x/4.5.x
 */


jQuery(function($){ ////////////////////////////////////////////////////////////

  $(document).on('dblclick','.markItUpFooter', function(e){
    $(e.target).next('.markItUpPreviewFrame').remove();
  });


}); // jQuery(function($){ /////////////////////////////////////////////////////


 var insertFileLink = function(file){
   jQuery.markItUp({
     openWith:'"',
     closeWith:'":'+file,
     placeHolder:file,
     file:file,
    className:'popup-linkmedia'
   });
 };

// var insertLink = function(url,desc){
//   jQuery.rexMarkItUp.insertFileLink(url,desc);
// };

var insertLink = function(url,desc){
  jQuery.markItUp({
    openWith:'"',
    closeWith:'":'+url,
    url: url,
    desc: desc,
    placeHolder:desc,
    className:'popup-linkintern'
  });
};

var insertImage = function(src, desc){
  // jQuery.markItUp({replaceWith:"!./"+ src +"!"});
  img = src.replace(/files\//, "");
  jQuery.markItUp({
    replaceWith:"!index.php?rex_resize=[![Image Width]!]w__"+ img +"!",
    src: src,
    desc: desc,
    className:'popup-image'
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



;(function ( $, window, document, undefined ) {

    var pluginName = "rexMarkItUp",
        defaults = {
            namespace: 'textile',
            buttondefinitions: {
                                // BLOCK MODIFIER
                                ////////////////////////////////////////////////
                                'h1':           {
                                                  openWith:'h1(!(([![Class]!]))!). ',
                                                  closeWith:'',
                                                  key:'1'
                                                },
                                'h2':           {
                                                  openWith:'h2(!(([![Class]!]))!). ',
                                                  closeWith:'',
                                                  key:'2'
                                                },
                                'h3':           {
                                                  openWith:'h3(!(([![Class]!]))!). ',
                                                  closeWith:'',
                                                  key:'3'
                                                },
                                'h4':           {
                                                  openWith:'h4(!(([![Class]!]))!). ',
                                                  closeWith:'',
                                                  key:'4'
                                                },
                                'h5':           {
                                                  openWith:'h5(!(([![Class]!]))!). ',
                                                  closeWith:'',
                                                  key:'5'
                                                },
                                'h6':           {
                                                  openWith:'h6(!(([![Class]!]))!). ',
                                                  closeWith:'',
                                                  key:'6'
                                                },
                                'p':            {
                                                  openWith:'p(!(([![Class]!]))!). ',
                                                  closeWith:''
                                                },
                                'blockquote':   {
                                                  openWith:'bq(!(([![Class]!]))!). ',
                                                  closeWith:''
                                                },
                                'bc':           {
                                                  openWith:'bc(!(([![Class]!]))!). ',
                                                  closeWith:''
                                                },

                                // PHRASE MODIFIER
                                ////////////////////////////////////////////////
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
                                'ins':          {
                                                  openWith:'+',
                                                  closeWith:'+'
                                                },
                                'cite':         {
                                                  openWith:'??',
                                                  closeWith:'??'
                                                },
                                'code':         {
                                                  openWith:'@',
                                                  closeWith:'@'
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
                                                  replaceWith: function(h) {    console.log('h.sel.cursor():',h.sel.cursor());
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
                                                  openWith:'',
                                                  closeWith:'',
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
            },
            autowhitespace: true

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

            // (SELECTION.JS) HELPERS
            var toString = Object.prototype.toString;
            var isArray = Array.isArray;
            if (!isArray) {
              isArray = function(val) {
                return toString.call(val) === '[object Array]';
              }
            }

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
                if(typeof def.openWith === 'undefined'){
                  def.openWith = '';
                }
                if(typeof def.closeWith === 'undefined'){
                  def.closeWith = '';
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
              beforeInsert:       $.proxy(function(h) { this.beforeInsertCallback(h,this); },this),
//              afterInsert:        $.proxy(function(h) { this.afterInsertCallback(h,this);  },this),
              nameSpace:          this.options.namespace,
              markupSet:          this.markupSet,
              previewParserPath:  'index.php?api=rex_markitup_api&func=parse_preview&uid='+this.guid,
              previewParserVar:   'rex_markitup_markup',
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
        },
        beforeInsertCallback: function(h, rex_markitup){                                                                console.group('beforeInsertCallback: '+h.className);
          if(!rex_markitup.options.autowhitespace || typeof h.className === 'undefined'){                               console.groupEnd();
            return;
          }

          className = h.className.replace('markitup-','');
          h.sel     = this.selection($(h.textarea));
          if(typeof h.openWith === 'undefined') {
            h.openWith = '';
          }
          if(typeof h.closeWith === 'undefined') {
            h.closeWith = '';
          }                                                                                                             console.log('className:',className);console.log('openWith:',h.openWith);console.log('closeWith:',h.closeWith);console.groupCollapsed('rex_markitup');console.dir(rex_markitup);console.groupEnd(); console.groupCollapsed('h');console.dir(h);console.groupEnd(); console.groupCollapsed('h.sel');console.log('sel.text():',h.sel.text());console.log('sel.surround():',h.sel.surround());console.log('sel.surround(2):',h.sel.surround(2));console.log('sel.cursor():',h.sel.cursor());console.log('sel.line():',h.sel.line());console.groupEnd();

          if(typeof rex_markitup.options.buttondefinitions[className] !== 'undefined') {
            def       = rex_markitup.options.buttondefinitions[className];

            if(typeof def.defaults === 'undefined') {
              def.defaults = {};
            }
            if(typeof def.defaults.openWith === 'undefined') {
              def.defaults.openWith = def.openWith;
            }
            if(typeof def.defaults.closeWith === 'undefined') {
              def.defaults.closeWith = def.closeWith;
            }
          }

          switch(className)
          {
            case'bold':
            case'italic':
            case'stroke':
            case'ins':
            case'cite':
            case'linkmailto':
            case'linkextern':
              surround    = h.sel.surround();
              h.openWith  = typeof h.openWith === 'undefined' ? '' : def.defaults.openWith;
              h.closeWith = def.defaults.closeWith;
              if(surround[0].match(/\w/) || surround[1].match(/\w/)) {
                h.openWith  = '[' + def.defaults.openWith;
                h.closeWith =  def.defaults.closeWith + ']';
              }
            break;
            case'code':
              h.openWith  = def.defaults.openWith;
              h.openWith  = surround[0] !== ' ' ? ' '+def.defaults.openWith  : def.defaults.openWith;
            break;
            case'h1':
            case'h2':
            case'h3':
            case'h4':
            case'h5':
            case'h6':
            case'p':
            case'blockquote':
            case'bc':
              surround       = h.sel.surround(2);                                                                       //console.log('surround:',surround);
              h.openWith     = def.defaults.openWith;
              h.closeWith    = def.defaults.closeWith;
              if(surround[0] == '') {
                leading = 0;
              }else{
                leading  = surround[0].match(/(\n)/) ? 2 - surround[0].match(/(\n)/).length : 2;                        //console.log('leading:',leading);
              }
              trailing = surround[1].match(/(\n)/) ? 2 - surround[1].match(/(\n)/).length : 2;                          //console.log('trailing:',trailing);
              h.openWith  = this.prependChar('\n', leading,  def.defaults.openWith);
              h.closeWith = this.appendChar('\n', trailing,  def.defaults.closeWith);
            break;
            case'popup-linkintern':
            case'popup-linkmedia':
            case'popup-image':
              surround    = h.sel.surround();
              if(surround[0].match(/\w/) || surround[1].match(/\w/)) {
                h.openWith  = '[' + h.openWith;
                h.closeWith =  h.closeWith + ']';
              }
            break;
          }                                                                                                             console.log('selection:',h.selection); console.log('openWith:',h.openWith);console.log('closeWith:',h.closeWith);console.groupEnd();
        },
        afterInsertCallback: function(h, rex_markitup){                                                                 console.group('afterInsertCallback: '+h.className);
          if(!rex_markitup.options.autowhitespace || typeof h.className === 'undefined'){                               console.groupEnd();
            return;
          }

          className = h.className.replace('markitup-','');
          h.sel     = this.selection($(h.textarea));                                                                    console.log('className:',className);console.groupCollapsed('rex_markitup');console.dir(rex_markitup);console.groupEnd(); console.groupCollapsed('h');console.dir(h);console.groupEnd(); console.groupCollapsed('h.sel');console.log('sel.text():',h.sel.text());console.log('sel.surround():',h.sel.surround());console.log('sel.surround(2):',h.sel.surround(2));console.log('sel.cursor():',h.sel.cursor());console.log('sel.line():',h.sel.line());console.groupEnd();
          //def       = rex_markitup.options.buttondefinitions[className];


                                                                                                                        console.log('selection:',h.selection); console.log('openWith:',h.openWith);console.log('closeWith:',h.closeWith);console.groupEnd();

        },
        sanitizeNewlines: function(str)
        {
          return str.replace(new RegExp('(\n){3,}', 'gim') , '\n\n');
        },
        prependChar: function(char, times, str) {
            for(var i = 0; i < times; i++) {
              str = char + str;
            }
            return str;
        },
        appendChar: function(char, times, str) {
            for(var i = 0; i < times; i++) {
              str = str + char;
            }
            return str;
        },
        insertLink: function(url,desc) { console.log('url:',url);
        },
        // http://webmisterradixlecti.blogspot.de/2012/10/javascript-secondindexof-or-xindexof.html
        xIndexOf: function(Val, Str, x) {
          if (x <= (Str.split(Val).length - 1)) {
            var Ot = Str.indexOf(Val);
            if (x > 1) {
              for (var i = 1; i < x; i++) {
                Ot = Str.indexOf(Val, Ot + 1);
              }
            }
            return Ot;
          } else {
            console.warn(Val + " Occurs less than " + x + " times");
            return 0;
          }
        },

        // GUTTED SELECTION.JS FUNCS FROM HERE ON..
        ////////////////////////////////////////////////////////////////////////
        selection: function(inputor) {
          if (inputor && inputor.length) {
            // if inputor is jQuery or zepto or a list of elements
            inputor = inputor[0];
          }
          if (inputor) {
            // detect feature first.
            if (typeof inputor.selectionStart != 'undefined') {
              return this.Selection(inputor);
            }
            var tag = inputor.tagName.toLowerCase();
          }
          if (tag && (tag === 'textarea' || tag === 'input')) {
            // if has inputor and inputor element is textarea or input
            return this.Selection(inputor, true);
          }

          if (window.getSelection) return this.DocumentSelection();
          if (document.selection) return this.DocumentSelection(true);
          console.error('your browser is very weird');
        },
        Selection: function (inputor, isIE) {
          this.element = inputor;
          this.cursor = function(start, end) {
            // get cursor
            var inputor = this.element;
            if (typeof start === 'undefined') {
              if (isIE) {
                return getIECursor(inputor);
              }
              return [inputor.selectionStart, inputor.selectionEnd];
            }

            // set cursor
            if (isArray(start)) {
              var _s = start;
              start  = _s[0];
              end    = _s[1];
            }
            if (typeof end === 'undefined') end = start;
            if (isIE) {
              setIECursor(inputor, start, end);
            } else {
              inputor.setSelectionRange(start, end);
            }
            return this;
          }
          return this;
        },
        // get or set selected text
        text: function(text, cur) {
          var inputor = this.element;
          var cursor  = this.cursor();
          if (typeof text == 'undefined') {
            return inputor.value.slice(cursor[0], cursor[1]);
          }
          return insertText(this, text, cursor[0], cursor[1], cur);
        },
        // get the surround words of the selection
        surround: function(count) {
          if (typeof count == 'undefined') count = 1;
          var value  = this.element.value;
          var cursor = this.cursor();
          var before = value.slice(
            Math.max(0, cursor[0] - count),
            cursor[0]
          );
          var after = value.slice(cursor[1], cursor[1] + count);
          return [before, after];
        },
        // append text to the end, and select the appended text
        append: function(text, cur) {
          var end = this.cursor()[1];
          return insertText(this, text, end, end, cur);
        },
        // prepend text to the start, and select the prepended text
        prepend: function(text, cur) {
          var start = this.cursor()[0];
          return insertText(this, text, start, start, cur);
        },
        // append text to the end, and select the appended text
        append: function(text, cur) {
          var end = this.cursor()[1];
          return insertText(this, text, end, end, cur);
        },
        // prepend text to the start, and select the prepended text
        prepend: function(text, cur) {
          var start = this.cursor()[0];
          return insertText(this, text, start, start, cur);
        },
        line: function() {
          var value  = this.element.value;
          var cursor = this.cursor();
          var before = value.slice(0, cursor[0]).lastIndexOf('\n');
          var after  = value.slice(cursor[1]).indexOf('\n');

          // we don't need \n
          var start = before + 1;
          if (after === -1) {
            return value.slice(start);
          }
          var end = cursor[1] + after;
          return value.slice(start, end);
        },
        // Selection on document
        // TODO: should it support this feature ?
        DocumentSelection: function(isIE) {
          if (!isIE) {
            var sel = window.getSelection();
            this.element = getSelectionElement(sel);
            this.text = function() {
              // TODO set text
              return sel.toString();
            }
          } else {
            this.text = function() {
              return document.selection.createRange().text;
            }
          }
          return this;
        },
        // IE sucks. This is how to get cursor position in IE.
        // Thanks to [ichord](https://github.com/ichord/At.js)
        getIECursor: function (inputor) {
          var range = document.selection.createRange();
          if (range && range.parentElement() === inputor) {
            var start, end;
            var normalizedValue = inputor.value.replace(/\r\n/g, '\n');
            var len = normalizedValue.length;
            var textInputRange = inputor.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());
            var endRange = inputor.createTextRange();
            endRange.collapse(false);
            if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
              start = end = len;
            } else {
              start = -textInputRange.moveStart('character', -len);
              end = -textInputRange.moveEnd('character', -len);
            }
            // when select to the last character, end = 1
            if (end < start) {
              end = len;
            }
            return [start, end];
          }
          return [0, 0];
        },
        setIECursor: function (inputor, start, end) {
          var range = inputor.createTextRange();
          range.move('character', start);
          // why should it be named as ``moveEnd`` ?
          range.moveEnd('character', end - start);
          range.select();
        },
        insertText: function (selection, text, start, end, cursor) {
          if (typeof text == 'undefined') text = '';
          var value = selection.element.value;
          selection.element.value = [
            value.slice(0, start), text, value.slice(end)
          ].join('');
          end = start + text.length;
          if (cursor === 'left') {
            selection.cursor(start);
          } else if (cursor === 'right') {
            selection.cursor(end);
          } else {
            selection.cursor(start, end);
          }
          return selection;
        },
        getSelectionElement: function (sel) {
          // start point and end point maybe in the different elements.
          // then we find their common father.
          var element = null;
          var anchorNode = sel.anchorNode;
          var focusNode = sel.focusNode;
          while (!element) {
            if (anchorNode.parentElement === focusNode.parentElement) {
              element = focusNode.parentElement;
              break;
            } else {
              anchorNode = anchorNode.parentElement;
              focusNode = focusNode.parentElement;
            }
          }
          return element;
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
