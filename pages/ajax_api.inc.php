<?php
/**
 * RexMarkitup for Redaxo
 *
 * @version 1.0.4
 * @link http://markitup.jaysalvat.com
 * @author Redaxo Addon: rexdev.de
 * @package redaxo 4.4.x/4.5.x/4.6.x
 */



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


function rex_markitup_imm_imgtypes()
{
  global $REX;
  $REX['ADDON']['image_manager']['types'] = array();
  $db = rex_sql::factory();
  $query = rex_register_extension_point('REX_MARKITUP_IMAGE_TYPES_QUERY', 'SELECT * FROM '.$REX['TABLE_PREFIX'].'679_types '.$REX['ADDON']['rex_markitup']['settings']['imm_sql_where'].' ORDER BY `name` ASC');
  foreach($db->getArray($query) as $type) {
    $REX['ADDON']['image_manager']['types'][$type['name']] = $type['description'];
  }
}

// CATCH OLD MARKITUP CLASS CALLS
////////////////////////////////////////////////////////////////////////////////
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
