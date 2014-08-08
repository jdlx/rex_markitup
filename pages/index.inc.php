<?php
/**
 * RexMarkitup for Redaxo
 *
 * @version 1.0.5
 * @link http://markitup.jaysalvat.com
 * @author Redaxo Addon: rexdev.de
 * @package redaxo 4.4.x/4.5.x/4.6.x
 */


// GET PARAMS
////////////////////////////////////////////////////////////////////////////////
$mypage     = 'rex_markitup';
$myroot     = $REX['INCLUDE_PATH'].'/addons/'.$mypage.'/';
$subpage    = rex_request('subpage', 'string');
$func       = rex_request('func', 'string');


// PAGE HEAD
////////////////////////////////////////////////////////////////////////////////
rex_register_extension('PAGE_HEADER', function($params) use($REX) {
  return $params['subject'].'
  <link rel="stylesheet" href="../files/addons/rex_markitup/backend.css">';
});

require $REX['INCLUDE_PATH'] . '/layout/top.php';

rex_title($REX['ADDON']['name'][$mypage].' <span class="addonversion">'.$REX['ADDON']['version'][$mypage].'</span>');


// SAVE SETTINGS
////////////////////////////////////////////////////////////////////////////////
if($func=='save_settings'){
  $settings   = rex_request('settings', 'array');
  $user_prefs = $REX['INCLUDE_PATH'].'/data/addons/'.$mypage.'/'.$mypage.'.settings.php';
  $content    = '<?php'.PHP_EOL.PHP_EOL;

  $it = new RecursiveIteratorIterator( new RecursiveArrayIterator($settings));
  foreach ($it as $k => $v) {
    $path = '['.var_export(stripslashes($k), true).']';
    $depth = $it->getDepth();
    while($depth > 0) {
      $depth--;
      $path = '['.var_export(stripslashes($it->getSubIterator($depth)->key()), true).']'.$path;
    }
    $content .= '$REX["ADDON"]["'.$mypage.'"]["settings"]'.$path.' = '.var_export(stripslashes($v), true).';'.PHP_EOL;
  }

  if(!file_exists(dirname($user_prefs))) {
    mkdir(dirname($user_prefs), $REX['DIRPERM'], true);
  }

  if(rex_put_file_contents($user_prefs, $content)){
    echo rex_info('Settings saved.');
    include $user_prefs;
  }else{
    echo rex_warning('Failed to save settings due to [put good reason here]..');
  }
}


// PAGE BODY
////////////////////////////////////////////////////////////////////////////////


// SUBSUB NAVI
#$subsubnavi = $subsubnavi == '' ? 'Es sind keine Plugins installiert/aktiviert.' : $subsubnavi;

echo '
<!--<div class="rex-addon-output im-plugins">
  <h2 class="rex-hl2" style="font-size:1em;border-bottom:0;">./*$subsubnavi*/.</h2>
</div>-->

<div class="rex-addon-output rex_markitup">
  <div class="rex-form">

    <form action="index.php?page='.$mypage.'" method="post">
      <input type="hidden" name="page" value="'.$mypage.'" />
      <input type="hidden" name="func" value="save_settings" />
      <input type="hidden" name="codemirror_options" value="" />

      <fieldset class="rex-form-col-1">
        <legend style="font-size:1.2em">RexMarkitup Settings</legend>
        <div class="rex-form-wrapper">


          <div class="rex-form-row">
            <p class="rex-form-col-a rex-form-text">
              <label for="imm_sql_where">IMM type condition:</label>
              <input type="text" id="imm_sql_where" style="font-family:monospace;font-size:1.3em;width:98%;margin-left:5px;" class="rex-form-text" name="settings[imm_sql_where]" value="'.htmlspecialchars($REX['ADDON'][$mypage]['settings']['imm_sql_where']).'" />
              <span style="margin-left:5px;color:gray;font-size:10px;font-family:monospace;">MySQL WHERE syntax</span>
            </p>
          </div><!-- .rex-form-row -->



          <div class="rex-form-row">
            <p class="rex-form-col-a rex-form-textarea">
              <label for="buttoncss">Button CSS</label>
              <textarea id="buttoncss" style="min-height:100px;font-family:monospace;font-size:1.3em;width:98%;margin-left:5px;" class="rex-form-textarea rex-codemirror" name="settings[buttoncss]">'.htmlspecialchars($REX['ADDON'][$mypage]['settings']['buttoncss']).'</textarea>
              <span style="margin-left:5px;color:gray;font-size:10px;font-family:monospace;">CSS markup</span>
            </p>
          </div><!-- .rex-form-row -->


          <div class="rex-form-row">
            <p class="rex-form-col-a rex-form-textarea">
              <label for="buttondefinitions" style="width:auto;">rex_markitup.buttondefinitions:&nbsp;{…}</label>
              <textarea id="buttondefinitions" style="min-height:100px;font-family:monospace;font-size:1.3em;width:98%;margin-left:5px;" class="rex-form-textarea rex-codemirror" name="settings[buttondefinitions]">'.htmlspecialchars($REX['ADDON'][$mypage]['settings']['buttondefinitions']).'</textarea>
              <span style="margin-left:5px;color:gray;font-size:10px;font-family:monospace;">JS obj syntax</span>
            </p>
          </div><!-- .rex-form-row -->


          <div class="rex-form-row">
            <p class="rex-form-col-a rex-form-textarea">
              <label for="buttonsets">rex_markitup.buttonsets:&nbsp;{…}</label>
              <textarea id="buttonsets" style="min-height:100px;font-family:monospace;font-size:1.3em;width:98%;margin-left:5px;" class="rex-form-textarea rex-codemirror" name="settings[buttonsets]">'.htmlspecialchars($REX['ADDON'][$mypage]['settings']['buttonsets']).'</textarea>
              <span style="margin-left:5px;color:gray;font-size:10px;font-family:monospace;">JS obj syntax</span>
            </p>
          </div><!-- .rex-form-row -->


          <div class="rex-form-row">
            <p class="rex-form-col-a rex-form-textarea">
              <label for="options">rex_markitup.options:&nbsp;{…}</label>
              <textarea id="options" style="min-height:100px;font-family:monospace;font-size:1.3em;width:98%;margin-left:5px;" class="rex-form-textarea rex-codemirror" name="settings[options]">'.htmlspecialchars($REX['ADDON'][$mypage]['settings']['options']).'</textarea>
              <span style="margin-left:5px;color:gray;font-size:10px;font-family:monospace;">JS obj syntax</span>
            </p>
          </div><!-- .rex-form-row -->


          <div class="rex-form-row rex-form-element-v2">
            <p class="rex-form-submit">
              <input class="rex-form-submit" type="submit" id="sendit" name="sendit" value="Einstellungen speichern" />
            </p>
          </div><!-- /rex-form-row -->

        </div><!-- /rex-form-wrapper -->
      </fieldset>
    </form>
  </div><!-- /rex-form -->
</div><!-- /rex-addon-output -->
';


$help = rex_get_file_contents($REX['INCLUDE_PATH'].'/addons/rex_markitup/README.textile');
$help = OOAddon::isActivated('textile') ? rex_a79_textile($help) : '<pre>'.$help.'</pre>';


echo '<div class="rex-addon-output">
    <h2 style="font-size:1.2em" class="rex-hl2">Infos</h2>

    <div class="rex-addon-content">
      <div class="rex_markitup_help">
        '.$help.'
      </div>
    </div><!-- /rex-addon-content -->
  </div>';


require $REX['INCLUDE_PATH'] . '/layout/bottom.php';
