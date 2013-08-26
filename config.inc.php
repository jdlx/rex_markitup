<?php
/**
 * RexMarkitup for Redaxo
 *
 * @version 0.9.8
 * @link http://markitup.jaysalvat.com
 * @author Redaxo Addon: rexdev.de
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
    case'clear_session':
      rex_markitup_clear_session();
      break;

    case'get_i18n':
      rex_markitup_clear_session();
      rex_markitup_ajax_reply($I18N->text);
      break;


    case'css_dummy':
    case'rex_a79_help':
        rex_register_extension('ADDONS_INCLUDED',
          function($params) use($data,$REX)
          {
            $tmpl = rex_get_file_contents($REX['INCLUDE_PATH'].'/addons/rex_markitup/files/custom/markitup/skins/rex_markitup/preview.tmpl.html');

            switch($data['func']) {
              case'css_dummy':
                $content = rex_markitup_previewlinks(
                             rex_a79_textile(
                               rex_get_file_contents(
                                 $REX['INCLUDE_PATH'].'/addons/rex_markitup/files/custom/markitup/skins/rex_markitup/css_dummy.textile'
                               )
                             )
                           );
              break;

              case'rex_a79_help':
                ob_start();
                rex_a79_help_overview();
                $content  = ob_get_flush();
                $content  = $content == '' ? '<p class="alert alert-error">Can\'t show Redaxo internal textile help: <code>textile[help]</code> perms not set.. ask your admin.</p>' : $content;
                $content  = '<h3>Redaxo Textile Help</h3>'.$content;
                $content .= rex_a79_textile(
                              rex_get_file_contents(
                                $REX['INCLUDE_PATH'].'/addons/rex_markitup/files/custom/markitup/skins/rex_markitup/textile_class_usage.textile'
                              )
                            );
              break;
            }

            $html = str_replace('###CONTENT###', $content, $tmpl);
            rex_markitup_ajax_reply($html, 'text/html');
          },
          array(),
          REX_EXTENSION_LATE
        );
      break;

    case'preview':
    case'parse_preview':
      if(isset($data['rex_markitup_markup'])) {
        rex_register_extension('ADDONS_INCLUDED',
          function($params) use($data,$REX)
          {
            $textile = stripslashes($data['rex_markitup_markup']);
            if(isset($data['slice_id']) && isset($data['textarea_name'])) {
              $_SESSION[$REX['INSTNAME']]['rex_markitup'][$data['slice_id']][$data['textarea_name']] = $textile;
            }
            $textile = str_replace('<br />','',$textile);
            $html    = rex_get_file_contents($REX['INCLUDE_PATH'].'/addons/rex_markitup/files/custom/markitup/skins/rex_markitup/preview.tmpl.html');
            $html    = str_replace('###CONTENT###', rex_markitup_previewlinks(rex_a79_textile($textile)), $html);
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

function rex_markitup_preview($slice_id, $instance, $textile, $decode = true, $replace = array( '<br />' => '' ) )
{
  global $REX;
  $textile = $decode
           ? htmlspecialchars_decode($textile, ENT_QUOTES)
           : $textile;
  $textile = str_replace(array_keys($replace), array_values($replace), $textile);
  $textile = isset($_SESSION[$REX['INSTNAME']]['rex_markitup'][$slice_id][$instance])
           ? $_SESSION[$REX['INSTNAME']]['rex_markitup'][$slice_id][$instance]
           : $textile;
  return $textile;
}

function rex_markitup_clear_session()
{
  global $REX;
  unset($_SESSION[$REX['INSTNAME']]['rex_markitup']);
}

// CATCH OLD MARKITUP CLASS CALLS
if(!class_exists('a287_markitup')) {
  class a287_markitup {
    static $error_thrown = false;
    function a287_markitup()   { self::throw_error(); }
    static function markitup() { self::throw_error(); }
    private function throw_error() {
      if(!self::$error_thrown) {
        trigger_error('rex_markitup: deprecated call to class "a287_markitup".. update your code to use call by textarea CSS class "rex-markitup"!', E_USER_WARNING);
      }
    }
  }
}



// BACKEND ONLY
////////////////////////////////////////////////////////////////////////////////
if(!$REX['REDAXO'] || (rex_request('page','string')=='markitup' && rex_request('subpage','string')=='preview') ){
  return;
}


// REX COMMONS
////////////////////////////////////////////////////////////////////////////////
$REX['ADDON']['version'][$mypage]     = '0.9.8.8';
$REX['ADDON']['author'][$mypage]      = 'jdlx';
$REX['ADDON']['supportpage'][$mypage] = 'forum.redaxo.de';

$REX['ADDON']['page'][$mypage]        = $mypage;
$REX['ADDON']['name'][$mypage]        = 'RexMarkitup';
$REX['ADDON']['title'][$mypage]       = 'RexMarkitup';



// SETTINGS
////////////////////////////////////////////////////////////////////////////////
// --- DYN
$REX["rex_markitup"]["settings"] = array (
  'imm_sql_where' => 'WHERE `name` NOT LIKE "rex_%"',
  'buttoncss' => '',
  'buttondefinitions' => '',
  'buttonsets' => 'standard:
\'h1,h2,h3,h4,|,bold,italic,stroke,ins,cite,code,|,listbullet,listnumeric,|,immimagemenu,linkmedia,|,linkintern,linkextern,linkmailto,|,preview,rex_a79_help,fullscreen,slice_update,slice_save\',
compact:
\'blockmenu,|,bold,italic,stroke,ins,cite,code,|,listbullet,listnumeric,|,immimagemenu,linkmedia,|,linkmenu,|,preview,rex_a79_help,fullscreen,slice_update,slice_save\',
full:
\'blockmenu,|,h1,h2,h3,h4,h5,h6,|,bold,italic,stroke,ins,cite,code,|,alignleft,alignright,aligncenter,alignjustify,|,listbullet,listnumeric,|,image,linkmedia,|,linkmenu,linkintern,linkextern,linkmailto,|,preview,rex_a79_help,fullscreen,slice_update,slice_save\'',
  'options' => 'smartinsert: true,
previewfrontend: false',
);
// --- /DYN

function rex_markitup_imm_imgtypes()
{
  global $REX;
  $REX['ADDON']['image_manager']['types'] = array();
  $db = rex_sql::factory();
  $query = rex_register_extension_point('REX_MARKITUP_IMAGE_TYPES_QUERY', 'SELECT * FROM '.$REX['TABLE_PREFIX'].'679_types '.$REX['rex_markitup']['settings']['imm_sql_where'].' ORDER BY `name` ASC');
  foreach($db->getArray($query) as $type) {
    $REX['ADDON']['image_manager']['types'][$type['name']] = $type['description'];
  }
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
    $ep = rex_register_extension_point('REX_MARKITUP_BUTTONS',
                                        array(
                                              'buttondefinitions' => stripslashes($REX["rex_markitup"]["settings"]["buttondefinitions"]),
                                              'buttonsets'        => stripslashes($REX["rex_markitup"]["settings"]["buttonsets"]),
                                              'buttoncss'         => stripslashes($REX["rex_markitup"]["settings"]["buttoncss"]),
                                              'options'           => stripslashes($REX["rex_markitup"]["settings"]["options"]),
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
