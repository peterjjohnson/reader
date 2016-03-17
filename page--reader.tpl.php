<?php
$file = $node->field_past_issue_file['und'][0];
drupal_set_title($node->title.' | '.$file['filename']);
$script_path = drupal_get_path('module', 'reader') . '/scripts/';
drupal_add_css(drupal_get_path('module', 'reader') . '/styles/reader.css');
drupal_add_js(array('reader' => array(
  'pdfWorkerSrc' => '/' . $script_path . 'pdf.worker.js',
  'pdfFile' => str_replace('http://' . $_SERVER['SERVER_NAME'], '', file_create_url($file['uri'])),
  'prefix' => $file['fid'],
)), 'setting');
drupal_add_js('https://www.promisejs.org/polyfills/promise-4.0.0.js', array(
  'type' => 'external',
  'weight' => 1
));
drupal_add_js($script_path . 'compatibility.js', array(
  'weight' => 2
));
drupal_add_js($script_path . 'pdf.js', array(
  'weight' => 3
));
drupal_add_js($script_path . 'flipmag2.js', array(
  'weight' => 4
));
drupal_add_js($script_path . 'reader2.js', array(
  'weight' => 5
));
?>
<section id="<?php echo $file['fid']; ?>-reader-container" class="reader-container">
  <div id="<?php echo $file['fid']; ?>-reader-control-panel" class="reader-control-panel"></div>
  <div class="reader-viewport"><div id="reader-loading"><div class="reader-loading-text">Loading...</div>
  </div><div id="<?php echo $file['fid']; ?>-reader-canvas-wrapper" class="reader-wrapper clearfix"></div></div>
</section>