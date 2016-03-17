<?php //$Id: template.tpl.php,v 1.1.2.1 2012-12-19 17:41:07 silenceandshadow Exp $
function reader_preprocess_page(&$variables) {
  if (arg(0) == 'reader') {
    var_dump($variables);
  }
}