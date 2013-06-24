if(typeof rexMarkitup == 'undefined') {
  var rexMarkitup = {sets:{}};
}

rexMarkitup.sets.standard = {
  nameSpace:'textile',
  // previewParserPath: "index.php?page=markitup&subpage=preview&article_id=21&clang=0&slice_id=58&rex_version=0",
  // previewParserVar: "markitup_textile_preview_58",
  // previewAutoRefresh: true,
  markupSet:  [
    {
      name:'Überschrift 1. Ordnung',
      className:'markitup-h1',
      openWith:'\n\nh1(!(([![Class]!]))!). ',
      closeWith:'\n\n',
      placeHolder:'Überschrift 1. Ordnung hier..',
      key:'1'
    },
    {
      name:'Überschrift 2. Ordnung',
      className:'markitup-h2',
      openWith:'\n\nh2(!(([![Class]!]))!). ',
      closeWith:'\n\n',
      placeHolder:'Überschrift 2. Ordnung hier..',
      key:'2'
    },
    {
      name:'Überschrift 3. Ordnung',
      className:'markitup-h3',
      openWith:'\n\nh3(!(([![Class]!]))!). ',
      closeWith:'\n\n',
      placeHolder:'Überschrift 3. Ordnung hier..',
      key:'3'
    },
    {
      name:'Überschrift 4. Ordnung',
      className:'markitup-h4',
      openWith:'\n\nh4(!(([![Class]!]))!). ',
      closeWith:'\n\n',
      placeHolder:'Überschrift 4. Ordnung hier..',
      key:'4'
    },
    {
      name:'Überschrift 5. Ordnung',
      className:'markitup-h5',
      openWith:'\n\nh5(!(([![Class]!]))!). ',
      closeWith:'\n\n',
      placeHolder:'Überschrift 5. Ordnung hier..',
      key:'5'
    },
    {
      name:'Überschrift 6. Ordnung',
      className:'markitup-h6',
      openWith:'\n\nh6(!(([![Class]!]))!). ',
      closeWith:'\n\n',
      placeHolder:'Überschrift 6. Ordnung hier..',
      key:'6'
    },
    {
      separator:'---------------'
    {
      name:'Fett',
      className:'markitup-bold',
      openWith:'*',
      closeWith:'*',
      key:'B'
    },
    {
      name:'Kursiv',
      className:'markitup-italic',
      openWith:'_',
      closeWith:'_',
      key:'I'
    },
    {
      name:'Durchstrichen',
      className:'markitup-stroke',
      openWith:'-',
      closeWith:'-',
      key:'S'
    },
    {
      separator:'---------------'
    },
    {
      name:'Liste - ungeordnet',
      className:'markitup-listbullet',
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
    {
      name:'Liste - geordnet',
      className: 'markitup-listnumeric',
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
    {
      separator:'---------------'
    },
    {
      name:'Bild',
      className:'markitup-image',
      openWith:' ',
      closeWith:' ',
      beforeInsert:function(h) {
        openMediaPool('TINYIMG');
      },
      key:'P'
    },
    {
      name:'Datei verlinken',
      className:'markitup-linkmedia',
      beforeInsert:function() {
        openMediaPool('TINY');
      },
      key:'M'
    },
    {
      separator:'---------------'
    },
    {
      name:'Interner Link',
      className:'markitup-linkintern',
      beforeInsert:function() {
        openLinkMap('TINY','&clang='+markitup_getURLParam('clang'));
      },
      key:'L'},
    {
      name:'Externer Link',
      className:'markitup-linkextern',
      openWith:'"',
      closeWith:'":[![Link eingeben:!:http://]!]',
      placeHolder:'Linktext hier',
      key:'E'
    },
    {
      name:'Mailto-Link',
      className:'markitup-linkmailto',
      openWith:'"',
      closeWith:'":[![E-Mail-Link eingeben:!:mailto:]!]',
      placeHolder:'Linktext hier',
      key:'M'
    },
    {
      separator:'---------------'
    },
    {
      name:'Quellcode',
      className:'markitup-code',
      openWith:' @',
      closeWith:'@ '
    },
    {
      name:'Zitat',
      className:'markitup-blockquote',
      openWith:'\n\nbq(!(([![Class]!]))!). ',
      closeWith:'\n\n',
      placeHolder:'Zitat hier...'
    },
    // {
    //   separator:'---------------'},
    // {
    //   name:'Voransicht',
    //   className:'markitup-preview',
    //   call:'preview', key:'Y'
    // }

  ] // markupSet

}; // rexMarkitup.sets.default


function insertFileLink(file) {
  jQuery.markItUp({
    openWith:'"',
    closeWith:'":'+file,
    placeHolder:file
  });
}

function insertLink(url,desc) {
  jQuery.markItUp({
    openWith:'"',
    closeWith:'":'+url,
    placeHolder:desc
  });
}

function insertImage(src, desc){
  img = src.replace(/files\//, "");
  jQuery.markItUp({
    replaceWith:"!index.php?rex_resize=[![Image Width]!]w__"+ img +"!"
  });
}

function markitup_getURLParam(strParamName){
  var strReturn = "";
  var strHref = window.location.href;
  if(strHref.indexOf("?") > -1) {
    var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
    var aQueryString = strQueryString.split("&");
    for(var iParam = 0; iParam < aQueryString.length; iParam++) {
      if(aQueryString[iParam].indexOf(strParamName.toLowerCase() + "=") > -1 ){
        var aParam = aQueryString[iParam].split("=");
        strReturn = aParam[1];
        break;
      }
    }
  }
  return unescape(strReturn);
}
