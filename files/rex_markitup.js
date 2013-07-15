/**
 * RexMarkitup be_style Plugin for Redaxo
 *
 * @version 0.9.8
 * @link http://markitup.jaysalvat.com
 * @author Redaxo be_style plugin: rexdev.de
 * @package redaxo 4.4.x/4.5.x
 */


 var insertFileLink = function(file) {
   jQuery.markItUp({
     openWith:'"',
     closeWith:'":'+file,
     placeHolder:file,
     file:file,
    className:'popup-linkmedia'
   });
 };

var insertLink = function(url,desc) {
  jQuery.markItUp({
    openWith:'"',
    closeWith:'":'+url,
    url: url,
    desc: desc,
    placeHolder:desc,
    className:'popup-linkintern'
  });
};


var insertImage = function(src, desc) {

  switch(rex_markitup.caller) {
    case'immimagemenu':
      replaceWith = '![![' + rex_markitup.i18n.markitup_prompt_align_markup.replace(/\<br\>/g,"\n") + ']!]index.php?rex_img_type=' + rex_markitup.chosen_imm_type + '&rex_img_file=' + src.replace(/files\//, '') +'!';
      break;
    default:
      replaceWith = '!index.php?rex_resize=[![Image Width]!]w__' + src.replace(/files\//, '') + '!';
  }

  jQuery.markItUp({
    replaceWith: replaceWith,
    src:         src,
    desc:        desc,
    className:   'popup-immimage'
  });
};

var rex_markitup_getURLParam = function(strParamName) {
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

    $.ajax({
      type:     'POST',
      url:      'index.php',
      async:    false,
      dataType: 'json',
      data:     {'rex_markitup_api': JSON.stringify({func:'get_i18n'})},
      success:  $.proxy(function(data) { rex_markitup.i18n = data; /*console.log('data:',data);*/ },this),
      error:    function(e){ console.warn('error:',e); }
    });

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
                                openWith:'*(!(([![Class]!]))!)',
                                closeWith:'*',
                                key:'B'
                              },
              'italic':       {
                                openWith:'_(!(([![Class]!]))!)',
                                closeWith:'_',
                                key:'I'
                              },
              'stroke':       {
                                openWith:'-(!(([![Class]!]))!)',
                                closeWith:'-',
                                key:'S'
                              },
              'ins':          {
                                openWith:'+(!(([![Class]!]))!)',
                                closeWith:'+'
                              },
              'cite':         {
                                openWith:'??(!(([![Class]!]))!)',
                                closeWith:'??'
                              },
              'code':         {
                                openWith:'@(!(([![Class]!]))!)',
                                closeWith:'@'
                              },

              // ALIGNED PARAGRAPHS
              ////////////////////////////////////////////////
              'aligncenter':  {
                                openWith:'p(!(([![Class]!]))!)=. '
                              },
              'alignjustify': {
                                openWith:'p(!(([![Class]!]))!)<>. '
                              },
              'alignleft':    {
                                openWith:'p(!(([![Class]!]))!)<. '
                              },
              'alignright':   {
                                openWith:'p(!(([![Class]!]))!)>. '
                              },

              // LISTS
              ////////////////////////////////////////////////
              'listbullet':   {
                                openWith:'* '
                              },
              'listnumeric':  {
                                openWith:'# '
                              },

              // MEDIA
              ////////////////////////////////////////////////
              'image':        {
                                openWith:'',
                                closeWith:'',
                                beforeInsert:function(h) {
                                  rex_markitup.caller = 'image';
                                  openMediaPool('TINYIMG');
                                },
                                key:'P'
                              },
              'linkmedia':    {
                                beforeInsert:function(h) {
                                  rex_markitup.caller = 'linkmedia';
                                  openMediaPool('TINY');
                                },
                                key:'M'
                              },

              // LINKS
              ////////////////////////////////////////////////
              'linkintern':   {
                                beforeInsert:function(h) {
                                  rex_markitup.caller = 'linkintern';
                                  openLinkMap('TINY','&clang='+rex_markitup_getURLParam('clang'));
                                },
                                key:'L'
                              },
              'linkextern':   {
                                openWith:'"(!(([![Class]!]))!)',
                                closeWith:'":[![' + rex_markitup.i18n.markitup_prompt_linkextern + ':!:http://]!]',
                                key:'E'
                              },
              'linkmailto':   {
                                openWith:'"(!(([![Class]!]))!)',
                                closeWith:'":mailto:[![' + rex_markitup.i18n.markitup_prompt_linkmailto + ']!]',
                                key:'M'
                              },

              // OTHERS
              ////////////////////////////////////////////////
              'preview':      {
                                name:'Preview',
                                key:'Enter'
                              },
              'rex_a79_help': {
                                name:'Textile Reference',
                                key: 'H'
                              },
              'css_dummy':    {
                                name:'CSS Dummy'
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
                                beforeInsert: function(h) {
                                  p = $(h.textarea).parents("div.markItUp");
                                  if(p.hasClass("fullscreen")){
                                    p.removeClass("fullscreen");
                                    $(h.textarea).css('height','200px');
                                    $(h.textarea).nextAll('.markItUpPreviewFrame').css('height','200px');
                                    $('body').removeClass("rex_markitup_fullscreen");
                                  }else{
                                    p.addClass("fullscreen");
                                    $(h.textarea).css('height','50%');
                                    $(h.textarea).nextAll('.markItUpPreviewFrame').css('height','50%');
                                    $('body').addClass("rex_markitup_fullscreen");
                                  }
                                },
                                key:"F"
                              },
              'rex_save':     {
                                name:rex_markitup.i18n.save_block
                              },
              'rex_update':   {
                                name:rex_markitup.i18n.update_block
                              },


              // MENUS
              ////////////////////////////////////////////////
              'blockmenu':    {
                                dropMenuButtons: ['h1','h2','h3','h4','h5','h6','|','p','alignright','aligncenter','alignjustify','|','blockquote','bc'],
                                dropMenu: []
                              },
              'linkmenu':     {
                                dropMenuButtons: ['linkintern','linkextern','linkmailto'],
                                dropMenu: []
                              },
              'immimagemenu': {
                                dropMenuButtons: [],
                                dropMenu: []
                              }

            }, // buttondefinitions

            buttonsets: {
              standard: 'h1,h2,h3,h4,|,bold,italic,stroke,ins,cite,code,|,listbullet,listnumeric,|,immimagemenu,linkmedia,|,linkintern,linkextern,linkmailto,|,preview,rex_a79_help,fullscreen,rex_update,rex_save',
              compact:  'blockmenu,|,bold,italic,stroke,ins,cite,code,|,listbullet,listnumeric,|,immimagemenu,linkmedia,|,linkmenu,|,preview,rex_a79_help,fullscreen,rex_update,rex_save',
              full:     'blockmenu,|,h1,h2,h3,h4,h5,h6,|,bold,italic,stroke,ins,cite,code,|,alignleft,alignright,aligncenter,alignjustify,|,listbullet,listnumeric,|,image,linkmedia,|,linkmenu,linkintern,linkextern,linkmailto,|,preview,rex_a79_help,fullscreen,rex_update,rex_save',
              dev:      'blockmenu,|,h1,h2,h3,h4,h5,h6,|,bold,italic,stroke,ins,cite,code,|,alignleft,alignright,aligncenter,alignjustify,|,listbullet,listnumeric,|,immimagemenu,image,linkmedia,|,linkmenu,linkintern,linkextern,linkmailto,|,preview,rex_a79_help,|,css_dummy,fullscreen,rex_update,rex_save'
            },
            smartinsert: true,
            previewfrontend: false

        }; // defaults


    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }


    Plugin.prototype = {

        init: function() {                                                                                              //console.log('this.options:',this.options);

            $(document).on('dblclick','.markItUpFooter', function(e){
              $(e.target).next('.markItUpPreviewFrame').remove();
            });

            $(document).on('click','div.markItUp.fullscreen .markItUpFooter', $.proxy(function(e){
              this.setIframeHeight(e);
            },this));

            // (SELECTION.JS) HELPERS
            var toString = Object.prototype.toString;
            var isArray = Array.isArray;
            if (!isArray) {
              isArray = function(val) {
                return toString.call(val) === '[object Array]';
              };
            }

            this.guid = $(this.element).constructor.guid;

            if(typeof rex_markitup.i18n === 'undefined') {
              this.getI18n();
            }

            if(typeof rex_markitup !== 'undefined') {
              if(typeof rex_markitup.options !== 'undefined') {
                this.options = $.extend( {}, this.options, rex_markitup.options );                                      //console.log('this.options:',this.options);
              }
              if(typeof rex_markitup.buttonsets !== 'undefined') {
                this.options.buttonsets = $.extend( {}, this.options.buttonsets, rex_markitup.buttonsets );             //console.log('this.options:',this.options);
              }
              if(typeof rex_markitup.buttondefinitions !== 'undefined') {
                this.options.buttondefinitions = $.extend( {}, this.options.buttondefinitions, rex_markitup.buttondefinitions ); //console.log('this.options:',this.options);
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
                  def.placeHolder = rex_markitup.i18n['markitup_'+key+'_placeholder'].replace(/\\n/g,'\n');
                }
                if(typeof def.openWith === 'undefined'){
                  def.openWith = '';
                }
                if(typeof def.closeWith === 'undefined'){
                  def.closeWith = '';
                }
                def.className = 'markitup-'+key;

                if(typeof def.dropMenu !== 'undefined' && typeof def.dropMenuButtons !== 'undefined') {                 //console.log(def.dropMenu);

                  if(key === 'immimagemenu') {
                    $.each(rex_markitup.immtypes, function(name,desc) {
                      subdef = {
                        name: name,
                        desc: desc,
                        openWith: '',
                        closeWith: '',
                        beforeInsert: function(h) {
                          rex_markitup.caller = key;
                          rex_markitup.chosen_imm_type = h.name;
                          openMediaPool('TINYIMG');
                        }
                      };                                                                                                //console.log('subdef:',subdef);
                      def.dropMenu.push(subdef);
                    });

                  }else{
                    for(var i = 0; i < def.dropMenuButtons.length; i++) {
                      subdef = buttonPrepare(def.dropMenuButtons[i]);                                                   //console.log('subdef:',subdef);
                      def.dropMenu.push(subdef);
                    }
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

            if(this.options.previewfrontend) {

              rex_markitup.sessionCleared = false;
              $(document).on('click','.rex-form-content-editmode-edit-slice input.rex-form-submit', $.proxy(function(e){
                if(!rex_markitup.sessionCleared) { console.log('clearing session..');
                  $.ajax({
                    type: 'POST',
                    url: 'index.php',
                    async: false,
                    data: {'rex_markitup_api': JSON.stringify({func:'clear_session'})},
                    success: $.proxy(function(data) {
                      rex_markitup.sessionCleared = true;
                    },this),
                    error: function(e){ console.warn('error:',e); }
                  });
                }
              },this));

              if(typeof rex_markitup.backendUrl === 'undefined') {
                rex_markitup.backendUrl = this.parseURL();
              }
              this.backendUrl = rex_markitup.backendUrl;

              if(typeof rex_markitup.frontendUrl === 'undefined') {
                rex_markitup.frontendUrl = 'http://' + window.location.hostname + $('ul.rex-navi-content li:last-child a').attr('href').replace('../','/');
              }
              this.frontendUrl = rex_markitup.frontendUrl;
            }

            options = {
              onCtrlEnter:        {className:'preview'},
              nameSpace:          this.options.namespace,
              markupSet:          this.markupSet,
              previewParserPath:  'index.php?api=rex_markitup_api&func=parse_preview&uid='+this.guid,
              previewParserVar:   'rex_markitup_markup',
              previewAutoRefresh: true
            };

            if(this.options.smartinsert) {
              options.beforeInsert = $.proxy(function(h) { this.beforeInsertCallback(h, this); }, this);
              //options.afterInsert  = $.proxy(function(h) { this.afterInsertCallback(h, this);  }, this);
            }

            return $(this.element).markItUp(options);
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
        showInPreview: function(className, h){
          var data = {
            func: className
          };
          if(className === 'preview') {
            data.rex_markitup_markup = h.textarea.value;
            if(this.options.previewfrontend) {
              data.textarea_name       = h.textarea.name;
              data.slice_id            = rex_markitup.backendUrl.params.slice_id;
            }
          }
          $.ajax({
            type: 'POST',
            url: 'index.php',
            async: false,
            //dataType:'json',
            data: {'rex_markitup_api': JSON.stringify(data)},
            success: $.proxy(function(data) {
              footer = $(this.element).next('.markItUpFooter');
              iFrame = $(this.element).nextAll('iframe.markItUpPreviewFrame.rex_markitup');
              style  = $(this.element).parents('div.markItUp').hasClass('fullscreen') ? ' style="height:50%" ' : '';

              if(iFrame.length === 0) {
                iFrame = $('<iframe class="markItUpPreviewFrame rex_markitup"'+style+'></iframe>');
                iFrame.insertAfter(footer);
              }

              if(className === 'preview' && this.options.previewfrontend) {
                $(iFrame).attr('src',this.frontendUrl);
                return;
              }

              previewWindow = iFrame[iFrame.length - 1].contentWindow || frame[iFrame.length - 1];
              try {
                sp = iFrame.document.documentElement.scrollTop;
              } catch(e) {
                sp = 0;
              }
              previewWindow.document.open();
              previewWindow.document.write(data);
              previewWindow.document.close();
              previewWindow.document.documentElement.scrollTop = sp;

            },this),
            error: function(e){ console.warn('error:',e); }
          });

        },
        beforeInsertCallback: function(h, rex_markitup){
          if (typeof h === 'undefined' || typeof h.className === 'undefined') {
            return;
          }

          className = h.className.replace('markitup-','');                                                              //console.clear();console.group('beforeInsertCallback: '+className); //console.log('h:',h);

          switch(className)
          {
            // SPECIAL FUNCS
            case'preview':
            case'css_dummy':
            case'rex_a79_help':                                                                                         //console.log('h:',h);console.groupEnd();
              if(h.altKey) {
                $('iframe.markItUpPreviewFrame.rex_markitup').remove();
              } else {
                this.showInPreview(className, h);
                return;
              }
            break;

            case'rex_update':
            case'rex_save':
              name = className.replace('rex_','btn_');
              $('.rex-form-content-editmode-edit-slice p.rex-form-submit input[name*="'+name+'"]').click();
            break;
          }

          // ONLY DEFINED BUTTONS FROM HERE ON..
          if(!rex_markitup.options.smartinsert || typeof h.className === 'undefined'){                                  //console.groupEnd();
            return;
          }

          h.sel     = this.selection($(h.textarea));
          if(typeof h.openWith === 'undefined') {
            h.openWith = '';
          }
          if(typeof h.closeWith === 'undefined') {
            h.closeWith = '';
          }                                                                                                             /*console.log('className:',className);console.log('openWith:',h.openWith);console.log('closeWith:',h.closeWith);console.groupCollapsed('rex_markitup');console.dir(rex_markitup);console.groupEnd();*/ //console.groupCollapsed('h');console.dir(h);console.groupEnd(); console.groupCollapsed('h.sel');console.log('sel.text():',h.sel.text());console.log('sel.surround():',h.sel.surround());console.log('sel.surround(2):',h.sel.surround(2));console.log('sel.cursor():',h.sel.cursor());console.log('sel.line():',h.sel.line());console.groupEnd();

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

            case'listbullet':
            case'listnumeric':
              text      = h.sel.text();                                                                                 //console.log('text:',text);
              surround  = h.sel.surround(3);                                                                            //console.log('surround:',surround);
              multiline = h.sel.multiline();                                                                            //console.log('multiline:',multiline);
              lines     = h.sel.lines();                                                                                //console.log('lines:',lines);

              markup    = className == 'listbullet' ? '*' : '#';
              delete h.replaceWith;

              h.openWith = def.defaults.openWith = '';

              if(surround[0] === '') {
                leading = 0;
              }else{                                                                                                    //console.log('surround[0].match:',surround[0].match(/(\n)/g));
                leading  = surround[0].match(/\n/g) ? 2 - surround[0].match(/\n/g).length : 2;                          //console.log('leading:',leading);
              }
              trailing = surround[1].match(/\n/g) ? 2 - surround[1].match(/\n/g).length : 2;                            //console.log('surround[1].match:',surround[1].match(/(\n)/g)); console.log('trailing:',trailing); console.log('h.selection.charAt(0):',h.selection.charAt(h.selection.length-2));
              leading  = h.selection.charAt(0)                    === '\n' ? leading-1 : leading;
              trailing = h.selection.charAt(h.selection.length-1) === '\n' ? trailing-1 : trailing;

              h.openWith  = this.prependChar('\n', leading,  def.defaults.openWith);
              h.closeWith = this.appendChar('\n', trailing,  def.defaults.closeWith);                                   //console.log('openWith:',h.openWith);console.log('closeWith:',h.closeWith);

              if(text !== '')
              {
                switch(multiline)
                {
                  case true:
                    $(lines).each(function(i){
                      prepend = lines[i].charAt(0) === markup ? markup : markup + ' ';
                      lines[i] = prepend + lines[i];
                    });                                                                                                 //console.log('lines:',lines);
                    h.replaceWith = lines.join('\n');                                                                   //console.log('h.selection:',h.selection);
                  break;

                  case false:
                    if(typeof h.sel.line(-1) === 'undefined' || h.sel.line(-1).charAt(0) === markup) {
                      h.openWith = '';
                    }
                    if(typeof h.sel.line(1) === 'undefined' || h.sel.line(1).charAt(0) === markup) {
                      h.closeWith = '';
                    }
                    prepend = h.selection.charAt(0) === markup ? markup : markup + ' ';
                    h.replaceWith = prepend + h.selection;
                    break;
                }
              }

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
            case'alignleft':
            case'alignright':
            case'aligncenter':
            case'alignjustify':
              surround       = h.sel.surround(3);                                                                       //console.log('surround:',surround);
              h.openWith     = def.defaults.openWith;
              h.closeWith    = def.defaults.closeWith;
              if(surround[0] === '') {
                leading = 0;
              }else{                                                                                                    //console.log('surround[0].match:',surround[0].match(/(\n)/g));
                leading  = surround[0].match(/\n/g) ? 2 - surround[0].match(/\n/g).length : 2;                          //console.log('leading:',leading);
              }
              trailing = surround[1].match(/\n/g) ? 2 - surround[1].match(/\n/g).length : 2;                            //console.log('surround[1].match:',surround[1].match(/(\n)/g)); console.log('trailing:',trailing);
              h.openWith  = this.prependChar('\n', leading,  def.defaults.openWith);
              h.closeWith = this.appendChar('\n', trailing,  def.defaults.closeWith);
            break;

            case'popup-linkintern':
            case'popup-linkmedia':
            case'popup-image':
            case'popup-immimage':
              surround    = h.sel.surround();
              /*if(surround[0].match(/\n/) && surround[1].match(/\n/)) {
                h.openWith  = '\n' + h.openWith;
                h.closeWith =  h.closeWith + '\n';
              }else */if(surround[0].match(/\w/) || surround[1].match(/\w/)) {
                h.openWith  = '[' + h.openWith;
                h.closeWith =  h.closeWith + ']';
              }
            break;
          }                                                                                                             //console.log('selection:',h.selection); console.log('openWith:',h.openWith);console.log('closeWith:',h.closeWith);console.groupEnd();
        },
        afterInsertCallback: function(h, rex_markitup){                                                                 //console.group('afterInsertCallback: '+h.className);
          if(!rex_markitup.options.smartinsert || typeof h.className === 'undefined'){                                  //console.groupEnd();
            return;
          }
          className = h.className.replace('markitup-','');
          h.sel     = this.selection($(h.textarea));                                                                    //console.log('className:',className);console.groupCollapsed('rex_markitup');console.dir(rex_markitup);console.groupEnd(); console.groupCollapsed('h');console.dir(h);console.groupEnd(); console.groupCollapsed('h.sel');console.log('sel.text():',h.sel.text());console.log('sel.surround():',h.sel.surround());console.log('sel.surround(2):',h.sel.surround(2));console.log('sel.cursor():',h.sel.cursor());console.log('sel.line():',h.sel.line());console.groupEnd();
                                                                                                                        //console.log('selection:',h.selection); console.log('openWith:',h.openWith);console.log('closeWith:',h.closeWith);console.groupEnd();
        },
        sanitizeNewlines: function(str) {
          str = str.replace(new RegExp('(\n){3,}', 'gim') , '\n\n');
          return str;
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
        setIframeHeight: function(e) {
          p = $(e.target).parents('div.markItUpContainer');
          h = p.children('div.markItUpHeader').height();
          a = p.children('textarea.markItUpEditor').height();
          f = p.children('div.markItUpFooter').height();
          var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName("body")[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
          r = y-h-a-f-26;
          p.children('iframe.markItUpPreviewFrame').css('height', r);
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
        parseURL: function(url)
        {                                                                                                                     //console.group('parseUrl:',url);
          if(typeof url == 'undefined') {
            url = window.location.href;
          }

          var a =  document.createElement('a');
          a.href = url;                                                                                                       //console.log('url:',url);
          var parsed = {
              source: url,
              protocol: a.protocol.replace(':',''),
              host: a.hostname,
              port: a.port,
              query: a.search,
              file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
              hash: a.hash.replace('#',''),
              path: a.pathname.replace(/^([^\/])/,'/$1'),
              relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
              segments: a.pathname.replace(/^\//,'').split('/')
          };
          parsed.params = (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
          })();
          parsed.redaxo = (function(){
            if(parsed.protocol !== 'redaxo'){
              return false;
            }
            var rex = {};
            p = url.match(/redaxo\:\/\/(\d+)(?:-(\d*))*/i);
            rex.article_id = +p[1];
            rex.clang = (typeof p[2] == 'undefined')  ? 0 : +p[2];
            return rex;
          })();
          parsed.anchor_only = (function(){
            var loc = self.location.href.replace(/#.*/i,'');
            return url.replace(loc,'').search(/^#/gi) === 0 ? true : false;
          })();
          parsed.email = (function(){
            return parsed.protocol === 'mailto' ? parsed.source.replace(/mailto:/,'') : false;
          })();                                                                                                               //console.log('parsed:',parsed);console.groupEnd();

          return parsed;
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
        // get whole line of selected text
        line: function(offset) {                                                //console.group('line:');
          offset = typeof offset === 'undefined' ? 0 : offset;                  //console.log('offset:',offset);
          var value      = this.element.value;
          var cursor     = this.cursor();
          var val_before = value.slice(0, cursor[0]);                           // console.log('val_before:',val_before);
          var val_after  = value.slice(cursor[1]);                              // console.log('val_after:',val_after);
          var before     = val_before.lastIndexOf('\n');                        // console.log('before:',before);
          var after      = val_after.indexOf('\n');                             // console.log('after:',after);

          if(offset === 0)
          {
            // we don't need \n
            var start = before + 1;
            if (after === -1) {
              return value.slice(start);
            }
            var end = cursor[1] + after;                                        //console.groupEnd();
            return value.slice(start, end);
          }
          else if (offset < 0)
          {
            val_before = val_before.split('\n');                                //console.log('val_before:',val_before);
            i = val_before.length + offset;                                     //console.log('i:',i);
            while(val_before[i] === '') {
              i--;
            }                                                                   //console.log('i:',i);console.groupEnd();
            return val_before[i];
          }
          else
          {
            val_after  = val_after.split('\n');                                 //console.log('val_after:',val_after);
            while(val_after[offset] === '\n') {
              offset++;
            }                                                                   //console.groupEnd();
            return val_after[offset];
          }
        },
        lines: function() {
          return this.line().split(/\n/);
        },
        multiline: function() {
          return this.line().match(/\n/g) !== null ? true : false;
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
