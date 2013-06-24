<?php
/**
 * RexMarkitup be_style Plugin for Redaxo
 *
 * @version 0.1.0
 * @link http://markitup.jaysalvat.com
 * @author Redaxo be_style plugin: rexdev.de
 * @package redaxo 4.3.x/4.4.x/4.5.x
 */


// BACKEND ONLY
////////////////////////////////////////////////////////////////////////////////
if(!$REX['REDAXO'] || (rex_request('page','string')=='markitup' && rex_request('subpage','string')=='preview') ){
  return;
}


// REX COMMONS
////////////////////////////////////////////////////////////////////////////////
$mypage = 'rex_markitup';

$REX['ADDON']['version'][$mypage]     = '1.3.0';
$REX['ADDON']['author'][$mypage]      = 'jdlx';
$REX['ADDON']['supportpage'][$mypage] = 'forum.redaxo.de';

$REX['ADDON']['page'][$mypage]        = $mypage;
$REX['ADDON']['title'][$mypage]       = 'RexCodemirror';

$REX['ADDON']['BE_STYLE_PAGE_CONTENT'][$mypage] = '
<h2 class="settings"><a href="index.php?page=be_style&amp;subpage='.$mypage.'">'.$REX['ADDON']['title'][$mypage].'</a></h2>
<p>CodeMirror (<a href="https://github.com/marijnh/CodeMirror" target="_blank">Github</a>) von <a href="http://marijnhaverbeke.nl/" target="_blank">Marijn Haverbeke</a> als Redaxo be_style Plugin.</p>
<hr />
';


// SETTINGS
////////////////////////////////////////////////////////////////////////////////
/* THEMES:
 * ambiance, blackboard, cobalt, eclipse, elegant, erlang-dark,
 * lesser-dark, monokai, neat, night, rubyblue, vibrant-ink, xq-dark,
 * custom: jdlx
 */
$REX[$mypage]['settings'] = array(
  'theme'          =>'jdlx',
  'keys' => array(
    'enter_fullscreen' => 'F11',
    'leave_fullscreen' => 'Esc',
    ),
  // AUTOENABLED BACKEND PAGES - ANY TEXTAREA WILL GET CODEMIRROR
  'autoenabled_pages' => array(
      array('page'=>'template'),
      array('page'=>'module'),
    ),
  // TRIGGER CLASS - WILL ENABLE CODEMIRROR OUTSIDE AUTOENABLED PAGES
  'trigger_class' => 'rex-codemirror',
  'foldmode'        =>'tagRangeFinder', // @html: tagRangeFinder, @php: braceRangeFinder
  'codemirror_options' => '',
  );


// CHECK IF ENABLED PAGE
////////////////////////////////////////////////////////////////////////////////
$enabled_page = false;
foreach($REX[$mypage]['settings']['autoenabled_pages'] as $def) {
  foreach ($def as $k => $v) {
    $enabled_page = rex_request($k,'string') === $v;
  }
  if($enabled_page){
    break;
  }
}

$REX[$mypage]['settings']['selector'] = $enabled_page
                                      ? 'textarea'
                                      : 'textarea.'.$REX[$mypage]['settings']['trigger_class'];



// CODEMIRROR ENABLER SCRIPT @ BODY END
////////////////////////////////////////////////////////////////////////////////
rex_register_extension('OUTPUT_FILTER',
  function($params) use($REX) {

    // CSS
    $head = '
<!-- rex_markitup head assets -->
  <link rel="stylesheet" href="../files/addons/be_style/plugins/rex_markitup/custom/markitup/skins/rex_markitup/style.css">
  <link rel="stylesheet" href="../files/addons/be_style/plugins/rex_markitup/custom/markitup/sets/rex_markitup/style.css">
  <script type="text/javascript"></script>
<!-- end rex_markitup head assets -->
    ';

    $params['subject'] = str_replace('</head>',$head.'</head>',$params['subject']);

    // JS
    $body = '
<!-- rex_markitup body assets -->
  <script src="../files/addons/be_style/plugins/rex_markitup/vendor/markitup/jquery.markitup.js"></script>
  <script src="../files/addons/be_style/plugins/rex_markitup/custom/markitup/sets/rex_markitup/set.js"></script>
  <script src="../files/addons/be_style/plugins/rex_markitup/rex_markitup.js"></script>
  <script type="text/javascript">
  </script>
<!-- end rex_markitup body assets -->
    ';

    $params['subject'] = str_replace('</body>',$body.'</body>',$params['subject']);

    return $params['subject'];
  }
);



// SUBPAGE
////////////////////////////////////////////////////////////////////////////////
rex_register_extension('ADDONS_INCLUDED',
  function($params) use($REX,$mypage){

    if(!isset($REX['ADDON']['page']['be_style'])){
      $REX['ADDON']['page']['be_style'] = 'be_style';
      $REX['ADDON']['name']['be_style'] = 'Backend Style';
    }

    $REX['ADDON']['pages']['be_style'][] = array ($mypage , $REX['ADDON']['plugins']['be_style']['title'][$mypage]);
    $REX['ADDON']['be_style']['SUBPAGES'] = $REX['ADDON']['pages']['be_style'];
    if(rex_request('page', 'string') == 'be_style' && rex_request('subpage', 'string') == $mypage){
      $REX['ADDON']['navigation']['be_style']['path'] = $REX['INCLUDE_PATH'].'/addons/be_style/plugins/'.$mypage.'/pages/index.php';
    }

    rex_register_extension('BE_STYLE_PAGE_CONTENT',
      function($params) use($REX,$mypage){
        return $params['subject'].$REX['ADDON']['plugins']['be_style']['BE_STYLE_PAGE_CONTENT'][$mypage];
      }
    );
  }
);

