<?php
/**
 * RexMarkitup for Redaxo
 *
 * @version 1.0.3
 * @link http://markitup.jaysalvat.com
 * @author Redaxo Addon: rexdev.de
 * @package redaxo 4.4.x/4.5.x
 */

if($REX['SETUP'] === true) {
  return;
}

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

#rex_register_extension('REX_MARKITUP_IMAGE_TYPES_QUERY',
#  function($params) use($REX)
#  {
#    return 'SELECT * FROM '.$REX['TABLE_PREFIX'].'679_types WHERE `name` NOT LIKE "rex_%" ORDER BY `name` ASC';
#  }
#);


// PLUGIN IDENTIFIER & ROOT
////////////////////////////////////////////////////////////////////////////////
$mypage = 'rex_markitup';
$myroot = $REX['INCLUDE_PATH'].'/addons/'.$mypage.'/';


// APPEND LANG
////////////////////////////////////////////////////////////////////////////////
if(is_a($I18N,'i18n')) {
  $I18N->appendFile($myroot.'lang/');
}


// AJAX API
////////////////////////////////////////////////////////////////////////////////
include $myroot.'pages/ajax_api.inc.php';


// BACKEND ONLY
////////////////////////////////////////////////////////////////////////////////
if(!$REX['REDAXO'] || (rex_request('page','string')=='markitup' && rex_request('subpage','string')=='preview') ){
  return;
}


// REX COMMONS
////////////////////////////////////////////////////////////////////////////////
$REX['ADDON']['version'][$mypage]     = '1.0.3';
$REX['ADDON']['author'][$mypage]      = 'jdlx';
$REX['ADDON']['supportpage'][$mypage] = 'forum.redaxo.de';

$REX['ADDON']['page'][$mypage]        = $mypage;
$REX['ADDON']['name'][$mypage]        = 'RexMarkitup';
$REX['ADDON']['title'][$mypage]       = 'RexMarkitup';
$REX['ADDON']['perm'][$mypage] = 'rexmarkitup[]';
$REX['PERM'][] = 'rexmarkitup[]';



// DEFAULT SETTINGS
////////////////////////////////////////////////////////////////////////////////
$REX['ADDON'][$mypage]['settings'] = array (
  'imm_sql_where' => 'WHERE `name` NOT LIKE "rex_%"',
  'buttoncss' => '',
  'buttondefinitions' => '',
  'buttonsets' => 'standard:
"h1,h2,h3,h4,|,bold,italic,stroke,ins,cite,code,|,listbullet,listnumeric,|,immimagemenu,linkmedia,|,linkintern,linkextern,linkmailto,|,preview,rex_a79_help,fullscreen,slice_update,slice_save",
compact:
"blockmenu,|,bold,italic,stroke,ins,cite,code,|,listbullet,listnumeric,|,immimagemenu,linkmedia,|,linkmenu,|,preview,rex_a79_help,fullscreen,slice_update,slice_save",
full:
"blockmenu,|,h1,h2,h3,h4,h5,h6,|,bold,italic,stroke,ins,cite,code,|,alignleft,alignright,aligncenter,alignjustify,|,listbullet,listnumeric,|,image,linkmedia,|,linkmenu,linkintern,linkextern,linkmailto,|,preview,rex_a79_help,fullscreen,slice_update,slice_save"',
  'options' => 'smartinsert: true,
previewfrontend: false',
);

// USER SETTINGS
////////////////////////////////////////////////////////////////////////////////
$user_prefs = $REX['INCLUDE_PATH'].'/data/addons/'.$mypage.'/'.$mypage.'.settings.php';
if(file_exists($user_prefs)) {
  require_once $user_prefs;
}


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
    $ep = rex_register_extension_point(
      'REX_MARKITUP_BUTTONS',
      array(
        'buttondefinitions' => stripslashes($REX['ADDON']['rex_markitup']['settings']["buttondefinitions"]),
        'buttonsets'        => stripslashes($REX['ADDON']['rex_markitup']['settings']["buttonsets"]),
        'buttoncss'         => stripslashes($REX['ADDON']['rex_markitup']['settings']["buttoncss"]),
        'options'           => stripslashes($REX['ADDON']['rex_markitup']['settings']["options"]),
        'immtypes'          =>              $REX['ADDON']['image_manager']['types'],
      )
    );
    $buttondefinitions = $ep['buttondefinitions'];
    $buttonsets        = $ep['buttonsets'];
    $buttoncss         = $ep['buttoncss'];
    $immtypes          = $ep['immtypes'];
    $options           = $ep['options'];



    // CSS @ HEAD
    ////////////////////////////////////////////////////////////////////////////
    $head = '
<!-- rex_markitup head assets -->
  <link rel="stylesheet" href="../files/addons/rex_markitup/custom/markitup/skins/rex_markitup/style.css">
  <link rel="stylesheet" href="../files/addons/rex_markitup/custom/markitup/sets/rex_markitup/style.css">
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
  <script src="../files/addons/rex_markitup/vendor/markitup/jquery.markitup.js"></script>
  <script type="text/javascript">
    if(typeof rex_markitup === "undefined") { var rex_markitup = {}; }
    rex_markitup.buttondefinitions = {'.PHP_EOL.$buttondefinitions.PHP_EOL.'} // buttondefinitions
    rex_markitup.buttonsets        = {'.PHP_EOL.$buttonsets.PHP_EOL.'} // buttonsets
    rex_markitup.options           = {'.PHP_EOL.$options.PHP_EOL.'} // buttonsets
    rex_markitup.immtypes          = '.json_encode($immtypes).' // immtypes
    rex_markitup.chosen_imm_type   = "" // last chosen imm type
  </script>
  <script src="../files/addons/rex_markitup/rex_markitup.js"></script>
  <script type="text/javascript">
  </script>
<!-- end rex_markitup body assets -->
    ';
    $params['subject'] = str_replace('</body>',$body.'</body>',$params['subject']);

    return $params['subject'];
  }
);
