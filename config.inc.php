<?php
/**
 * RexMarkitup be_style Plugin for Redaxo
 *
 * @version 0.9.3
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
if(is_a($I18N,'i18n')) {
  $I18N->appendFile($myroot.'lang/');
}


// AJAX API
////////////////////////////////////////////////////////////////////////////////
$api      = rex_request('api','string',false);
$data     = rex_request('rex_markitup_api','string',false);

if( $data !== false || $api === 'rex_markitup_api')
{
  $data = $data !== '' ? json_decode(stripslashes($data),true) : $data;

  if(!$data) {
    $data = $_REQUEST;
  }

  switch($data['func'])
  {
    case'get_i18n':
      rex_markitup_ajax_reply($I18N->text);
      break;

    case'rex_a79_help':
        rex_register_extension('ADDONS_INCLUDED',
          function($params) use($data,$REX)
          {
            ob_start();
            rex_a79_help_overview();
            $html = ob_get_flush();
            $html = '<div id="rex_markitup_preview"><h1 class="rex-title">Textile Markup Reference</h1>'.$html.'</div>';
            rex_markitup_ajax_reply(array('html' => $html));
          },
          array(),
          REX_EXTENSION_LATE
        );
      break;

    case'css_dummy':
        rex_register_extension('ADDONS_INCLUDED',
          function($params) use($data,$REX)
          {
            $markup = rex_get_file_contents($REX['INCLUDE_PATH'].'/addons/be_style/plugins/rex_markitup/files/custom/markitup/skins/rex_markitup/css_dummy.textile');
            $html   = rex_markitup_previewlinks(rex_a79_textile($markup));
            $html = '<div id="rex_markitup_preview">'.$html.'</div>';
            rex_markitup_ajax_reply(array('html' => $html));
          },
          array(),
          REX_EXTENSION_LATE
        );
      break;

    case'parse_preview':
      if(isset($data['rex_markitup_markup'])) {
        rex_register_extension('ADDONS_INCLUDED',
          function($params) use($data,$REX)
          {
            $textile = stripslashes($data['rex_markitup_markup']);
            $textile = str_replace('<br />','',$textile);
            $html    = rex_get_file_contents($REX['INCLUDE_PATH'].'/addons/be_style/plugins/rex_markitup/files/custom/markitup/skins/rex_markitup/preview.tmpl.html');
            $html    = str_replace('###TEXTILE###', rex_markitup_previewlinks(rex_a79_textile($textile)), $html);
            rex_markitup_ajax_reply($html, 'text/html');
          },
          array(),
          REX_EXTENSION_LATE
        );
      }else{
        rex_markitup_ajax_reply('error: no markup data..', 'text/html');
      }

      break;

    default:
      rex_markitup_ajax_reply(array('error'=>'unknown value for "func" param','html'=>'unknown value for "func" param'));

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

function rex_markitup_previewlinks($content)
{
  global $REX;

  // FIX CONTENT FROM POST
  $content = str_replace("\n","\r\n",$content);
  $content = $content.' ';

  // Hier beachten, dass man auch ein Zeichen nach dem jeweiligen Link mitmatched,
  // damit beim ersetzen von z.b. redaxo://11 nicht auch innerhalb von redaxo://112
  // ersetzt wird
  // siehe dazu: http://forum.redaxo.de/ftopic7563.html

  // -- preg match redaxo://[ARTICLEID]-[CLANG] --
  preg_match_all('@redaxo://([0-9]*)\-([0-9]*)(.){1}/?@im',$content,$matches,PREG_SET_ORDER);
  foreach($matches as $match)
  {
    if(empty($match)) continue;

    $url = rex_getURL($match[1], $match[2]);

    if($REX['REDAXO'])
    {
      $content = str_replace($match[0],'../'.$url.$match[3],$content);
    }
    else
    {
      $content = str_replace($match[0],$url.$match[3],$content);
    }

  }

  // -- preg match redaxo://[ARTICLEID] --
  preg_match_all('@redaxo://([0-9]*)(.){1}/?@im',$content,$matches,PREG_SET_ORDER);
  foreach($matches as $match)
  {
    if(empty($match)) continue;

    $url = rex_getURL($match[1], $REX['CUR_CLANG']);

    if($REX['REDAXO'])
    {
      $content = str_replace($match[0],'../'.$url.$match[2],$content);
    }
    else
    {
      $content = str_replace($match[0],$url.$match[2],$content);
    }
  }

  return $content;
}

function rex_markitup_imm_imgtypes()
{
  global $REX;
  $REX['ADDON']['image_manager']['types'] = array();
  $db = rex_sql::factory();
  foreach($db->getArray('SELECT * FROM '.$REX['TABLE_PREFIX'].'679_types ORDER BY `name` ASC') as $type) {
    $REX['ADDON']['image_manager']['types'][$type['name']] = $type['description'];
  }
}




// BACKEND ONLY
////////////////////////////////////////////////////////////////////////////////
if(!$REX['REDAXO'] || (rex_request('page','string')=='markitup' && rex_request('subpage','string')=='preview') ){
  return;
}


// REX COMMONS
////////////////////////////////////////////////////////////////////////////////
$REX['ADDON']['version'][$mypage]     = '0.9.3';
$REX['ADDON']['author'][$mypage]      = 'jdlx';
$REX['ADDON']['supportpage'][$mypage] = 'forum.redaxo.de';

$REX['ADDON']['page'][$mypage]        = $mypage;
$REX['ADDON']['title'][$mypage]       = 'RexMarkitup';

$REX['ADDON']['BE_STYLE_PAGE_CONTENT'][$mypage] = '
<h2 class="settings"><a href="index.php?page=be_style&amp;subpage='.$mypage.'">'.$REX['ADDON']['title'][$mypage].'</a></h2>
<p>Reinterpretation des bisherigen Markitup Addons mit reduzierter/schlankerer Codebase.</p>
<hr />
';


// SETTINGS
////////////////////////////////////////////////////////////////////////////////
// --- DYN
$REX["rex_markitup"]["settings"] = array (
  'buttoncss' => '',
  'buttondefinitions' => '',
  'buttonsets' => 'standard:
\'h1,h2,h3,h4,|,bold,italic,stroke,ins,cite,code,|,listbullet,listnumeric,|,immimagemenu,linkmedia,|,linkintern,linkextern,linkmailto,|,preview,fullscreen\',
compact:
\'blockmenu,|,bold,italic,stroke,ins,cite,code,|,listbullet,listnumeric,|,immimagemenu,linkmedia,|,linkmenu,|,preview,fullscreen\',
full:
\'blockmenu,|,h1,h2,h3,h4,h5,h6,|,bold,italic,stroke,ins,cite,code,|,alignleft,alignright,aligncenter,alignjustify,|,listbullet,listnumeric,|,image,linkmedia,|,linkmenu,linkintern,linkextern,linkmailto,|,preview,rex_a79_help,fullscreen\'',
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

    if(!isset($REX['ADDON']['image_manager']['types'])) {
      rex_markitup_imm_imgtypes();
    }

    // EP
    ////////////////////////////////////////////////////////////////////////////
    $ep = rex_register_extension_point('REX_MARKITUP_BUTTONS',
                                        array(
                                              'buttondefinitions' => stripslashes($REX["rex_markitup"]["settings"]["buttondefinitions"]),
                                              'buttonsets'        => stripslashes($REX["rex_markitup"]["settings"]["buttonsets"]),
                                              'buttoncss'         => stripslashes($REX["rex_markitup"]["settings"]["buttoncss"]),
                                              'immtypes'          =>              $REX['ADDON']['image_manager']['types'],
                                             )
                                      );
    $buttondefinitions = $ep['buttondefinitions'];
    $buttonsets        = $ep['buttonsets'];
    $buttoncss         = $ep['buttoncss'];
    $immtypes          = $ep['immtypes'];



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
    rex_markitup.buttonsets        = {'.PHP_EOL.$buttonsets.PHP_EOL.'} // buttonsets
    rex_markitup.immtypes          = '.json_encode($immtypes).' // immtypes
    rex_markitup.chosen_imm_type   = "" // last chosen imm type
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

