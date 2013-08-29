<?php
/**
 * RexMarkitup for Redaxo
 *
 * @version 1.0.1
 * @link http://markitup.jaysalvat.com
 * @author Redaxo Addon: rexdev.de
 * @package redaxo 4.4.x/4.5.x
 */

$myself = 'rex_markitup';

// REQUIRE TEXTILE
////////////////////////////////////////////////////////////////////////////////
if(!isset($ADDONSsic['version']['textile']))
{
  $REX['ADDON']['installmsg'][$myself] = 'Textile Addon required!';
  $REX['ADDON']['install'][$myself] = 0;
  return;
}


$REX['ADDON']['install'][$myself] = 1;
