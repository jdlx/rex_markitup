<?php
/**
 * RexMarkitup be_style Plugin for Redaxo
 *
 * @version 0.1.0
 * @link http://markitup.jaysalvat.com
 * @author Redaxo be_style plugin: rexdev.de
 * @package redaxo 4.3.x/4.4.x/4.5.x
 */


// GET PARAMS
////////////////////////////////////////////////////////////////////////////////
$mypage     = 'rex_markitup';
$myroot     = $REX['INCLUDE_PATH'].'/addons/be_style/plugins/'.$mypage.'/';
$subpage    = rex_request('subpage', 'string');
$func       = rex_request('func', 'string');


// PAGE HEAD
////////////////////////////////////////////////////////////////////////////////
require $REX['INCLUDE_PATH'] . '/layout/top.php';

rex_title('Backend Style <span style="color:silver;font-size:0.5em;">'.$REX['ADDON']['plugins']['be_style']['title'][$mypage].' '.$REX['ADDON']['plugins']['be_style']['version'][$mypage].'</span>',$REX['ADDON']['be_style']['SUBPAGES']);


// SAVE SETTINGS
////////////////////////////////////////////////////////////////////////////////
if($func=='save_settings'){
  $settings   = rex_request('settings', 'array');
  foreach($settings as $k => $v){
    $settings[$k] = stripslashes($v);
  }

  $content = '$REX["rex_markitup"]["settings"] = '.var_export($settings,true).';';
  if(rex_replace_dynamic_contents($myroot.'config.inc.php', $content)){
    $REX["rex_markitup"]["settings"] = $settings;
  }
  echo rex_info('Settings saved.');
}


// PAGE BODY
////////////////////////////////////////////////////////////////////////////////


// SUBSUB NAVI
#$subsubnavi = $subsubnavi == '' ? 'Es sind keine Plugins installiert/aktiviert.' : $subsubnavi;

echo '
<!--<div class="rex-addon-output im-plugins">
  <h2 class="rex-hl2" style="font-size:1em;border-bottom:0;">./*$subsubnavi*/.</h2>
</div>-->

<div class="rex-addon-output im-plugins">
  <div class="rex-form">

    <form action="index.php?page=be_style&subpage='.$mypage.'" method="post">
      <input type="hidden" name="page" value="be_style" />
      <input type="hidden" name="subpage" value="'.$mypage.'" />
      <input type="hidden" name="func" value="save_settings" />
      <input type="hidden" name="codemirror_options" value="" />

      <fieldset class="rex-form-col-1">
        <legend style="font-size:1.2em">RexMarkitup Settings</legend>
        <div class="rex-form-wrapper">


          <div class="rex-form-row">
            <p class="rex-form-col-a rex-form-textarea">
              <label for="buttonsets">rex_markitup.buttonsets:&nbsp;{…}</label>
              <textarea id="buttonsets" style="min-height:100px;font-family:monospace;font-size:1.3em;width:98%;margin-left:5px;" class="rex-form-textarea rex-codemirror" name="settings[buttonsets]">'.$REX[$mypage]['settings']['buttonsets'].'</textarea>
              <br /><span style="margin-left:5px;color:gray;font-size:10px;font-family:monospace;">JS obj property notation</span>
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


require $REX['INCLUDE_PATH'] . '/layout/bottom.php';
