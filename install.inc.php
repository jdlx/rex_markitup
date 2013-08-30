<?php
/**
 * RexMarkitup for Redaxo
 *
 * @version 1.0.2
 * @link http://markitup.jaysalvat.com
 * @author Redaxo Addon: rexdev.de
 * @package redaxo 4.4.x/4.5.x
 */

$myself = 'rex_markitup';


// INSTALL CONDITIONS
////////////////////////////////////////////////////////////////////////////////
$requiered_REX    = '4.4.0';
$requiered_PHP    = '5.3.0';
$requiered_addons = array('textile');


// CHECK REDAXO VERSION
////////////////////////////////////////////////////////////////////////////////
if(version_compare($REX['VERSION'].'.'.$REX['SUBVERSION'].'.'.$REX['MINORVERSION'], $requiered_REX, '<'))
{
  $REX['ADDON']['installmsg'][$myself] = 'Dieses Addon ben&ouml;tigt Redaxo Version '.$requiered_REX.' oder h&ouml;her.';
  $REX['ADDON']['install'][$myself] = 0;
  return;
}


// CHECK PHP VERSION
////////////////////////////////////////////////////////////////////////////////
if(version_compare(PHP_VERSION, $requiered_PHP, '<'))
{
  $REX['ADDON']['installmsg'][$myself] = 'Dieses Addon ben&ouml;tigt mind. PHP '.$requiered_PHP.'!';
  $REX['ADDON']['install'][$myself] = 0;
  return;
}


// CHECK REQUIERED ADDONS
////////////////////////////////////////////////////////////////////////////////
foreach($requiered_addons as $a)
{
  if (!OOAddon::isInstalled($a))
  {
    $REX['ADDON']['installmsg'][$myself] = '<br />Addon "'.$a.'" ist nicht installiert.  >>> <a href="index.php?page=addon&addonname='.$a.'&install=1">jetzt installieren</a> <<<';
    $REX['ADDON']['install'][$myself] = 0;
    return;
  }
  else
  {
    if (!OOAddon::isAvailable($a))
    {
      $REX['ADDON']['installmsg'][$myself] = '<br />Addon "'.$a.'" ist nicht aktiviert.  >>> <a href="index.php?page=addon&addonname='.$a.'&activate=1">jetzt aktivieren</a> <<<';
      $REX['ADDON']['install'][$myself] = 0;
      return;
    }

  }
}



$REX['ADDON']['install'][$myself] = 1;
