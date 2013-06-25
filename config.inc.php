<?php
/**
 * RexMarkitup be_style Plugin for Redaxo
 *
 * @version 0.8.5
 * @link http://markitup.jaysalvat.com
 * @author Redaxo be_style plugin: rexdev.de
 * @package redaxo 4.4.x/4.5.x
 */

#rex_register_extension('REX_MARKITUP_BUTTONS',
#  function($params)
#  {                                                                             FB::log($params,' $params');
#    $params['subject']['buttonsets'] .= ', headline: "h1,h2,h3"';
#    $params['subject']['buttoncss'] .= '.markItUpButton.FOOBAR a {
#    background-image: url("images/foobar.png") !important;
#    }';
#    return $params['subject'];
#  }
#);


// PLUGIN IDENTIFIER & ROOT
////////////////////////////////////////////////////////////////////////////////
$mypage = 'rex_markitup';
$myroot = $REX['INCLUDE_PATH'].'/addons/be_style/plugins/'.$mypage.'/';


// APPEND LANG
////////////////////////////////////////////////////////////////////////////////
$I18N->appendFile($myroot.'lang/');


// AJAX API
////////////////////////////////////////////////////////////////////////////////
$data     = rex_request('rex_markitup_api','string',false);

if( $data !== false )
{
  $data = $data !== '' ? json_decode(stripslashes($data),true) : $data;

  switch($data['func'])
  {
    case'get_i18n':
      rex_markitup_ajax_reply($I18N->text);
      break;

    default:
      rex_markitup_ajax_reply(array('error'=>'unknown value for "func" param'));

  }
}

function rex_markitup_ajax_reply($data = false, $content_type = 'application/json')
{
  if(!$data){
    return false;
  }

  if(is_array($data) || is_object($data)) {
    $data = json_encode($data);
  }

  while(ob_get_level()){
    ob_end_clean();
  }
  ob_start();
  header('Content-Type: '.$content_type);
  echo $data;
  die();
} // END ajax_reply



// BACKEND ONLY
////////////////////////////////////////////////////////////////////////////////
if(!$REX['REDAXO'] || (rex_request('page','string')=='markitup' && rex_request('subpage','string')=='preview') ){
  return;
}


// REX COMMONS
////////////////////////////////////////////////////////////////////////////////
$REX['ADDON']['version'][$mypage]     = '0.8.5';
$REX['ADDON']['author'][$mypage]      = 'jdlx';
$REX['ADDON']['supportpage'][$mypage] = 'forum.redaxo.de';

$REX['ADDON']['page'][$mypage]        = $mypage;
$REX['ADDON']['title'][$mypage]       = 'RexMarkitup';

$REX['ADDON']['BE_STYLE_PAGE_CONTENT'][$mypage] = '
<h2 class="settings"><a href="index.php?page=be_style&amp;subpage='.$mypage.'">'.$REX['ADDON']['title'][$mypage].'</a></h2>
<p>Reinterpretation des bisherigen Markitup Addons mit reduzierter/schlankerer Codebase.. dev status: <b>alpha</b></p>
<hr />
';


// SETTINGS
////////////////////////////////////////////////////////////////////////////////
// --- DYN
$REX["rex_markitup"]["settings"] = array (
  'buttondefinitions' => 'examplebutton:
{
  name:         \'Example Button\',
  openWith:     \'[foobar]\',
  closeWith:    \'[/foobar]\',
  beforeInsert: function(h) {
    text = "You\'ve just click the "+h.name+" button ";
    text+= "which will wrap \'"+h.selection+"\' ";
    text+= "with "+h.openWith+" and "+h.closeWith+".";
    alert(text);
  },
  afterInsert:  function(h) {
    text = "The result is now:\n";
    text+= $(h.textarea).val();
    alert(text);
  },
  placeHolder: \'Placeholder Text..\'
}',
  'buttonsets' => 'standard:
\'h1,h2,h3,h4,h5,h6,|,bold,italic,stroke,|,listbullet,listnumeric,|,image,linkmedia,linkintern,linkextern,linkmailto\',

full:
\'h1,h2,h3,h4,h5,h6,|,bold,italic,stroke,|,listbullet,listnumeric,|,image,linkmedia,linkintern,linkextern,linkmailto,|,code,blockquote\'
',
);
// --- /DYN


// INCLUDE ASSETS @ OPF
////////////////////////////////////////////////////////////////////////////////
rex_register_extension('OUTPUT_FILTER',
  function($params) use($REX)
  {
    if(preg_match('/<textarea[^>]*class="[^"]*rex-markitup/',$params['subject']) == 0) {
      return;
    }

    // EP
    ////////////////////////////////////////////////////////////////////////////
    $ep = rex_register_extension_point('REX_MARKITUP_BUTTONS',
                                        array(
                                              'buttondefinitions' => stripslashes($REX["rex_markitup"]["settings"]["buttondefinitions"]),
                                              'buttonsets'        => stripslashes($REX["rex_markitup"]["settings"]["buttonsets"]),
                                              'buttoncss'         => '',
                                             )
                                      );
    $buttondefinitions = $ep['buttondefinitions'];
    $buttonsets        = $ep['buttonsets'];
    $buttoncss         = $ep['buttoncss'];


    // CSS @ HEAD
    ////////////////////////////////////////////////////////////////////////////
    $head = '
<!-- rex_markitup head assets -->
  <link rel="stylesheet" href="../files/addons/be_style/plugins/rex_markitup/custom/markitup/skins/rex_markitup/style.css">
  <link rel="stylesheet" href="../files/addons/be_style/plugins/rex_markitup/custom/markitup/sets/rex_markitup/style.css">
  <style>
    '.$buttoncss.'
  </style>
<!-- end rex_markitup head assets -->
    ';
    $params['subject'] = str_replace('</head>',$head.'</head>',$params['subject']);


    // JS @ BODY
    ////////////////////////////////////////////////////////////////////////////
    $body = '
<!-- rex_markitup body assets -->
  <script src="../files/addons/be_style/plugins/rex_markitup/vendor/markitup/jquery.markitup.js"></script>
  <script type="text/javascript">
    if(typeof rex_markitup === "undefined") { var rex_markitup = {}; }
    rex_markitup.buttondefinitions = {'.PHP_EOL.$buttondefinitions.PHP_EOL.'} // buttondefinitions
    rex_markitup.buttonsets = {'.PHP_EOL.$buttonsets.PHP_EOL.'} // buttonsets
  </script>
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

