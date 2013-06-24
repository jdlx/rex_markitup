<?php
/**
 * RexMarkitup be_style Plugin for Redaxo
 *
 * @version 0.1.0
 * @link http://markitup.jaysalvat.com
 * @author Redaxo be_style plugin: rexdev.de
 * @package redaxo 4.3.x/4.4.x/4.5.x
 */

$error = '';

if ($error != '') {
  $REX['ADDON']['installmsg']['rex_markitup'] = $error;
} else {
  $REX['ADDON']['install']['rex_markitup'] = 0;
}
