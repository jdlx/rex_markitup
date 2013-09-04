<?php
/**
 * RexMarkitup for Redaxo
 *
 * @version 1.0.3
 * @link http://markitup.jaysalvat.com
 * @author Redaxo Addon: rexdev.de
 * @package redaxo 4.4.x/4.5.x
 */

$error = '';

if ($error != '') {
  $REX['ADDON']['installmsg']['rex_markitup'] = $error;
} else {
  $REX['ADDON']['install']['rex_markitup'] = 0;
}
