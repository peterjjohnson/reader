<?php
/**
 *   Copyright (c) 2016, Peter Johnson
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions are met:
 *
 *    * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 *    * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 *    * Neither the name of [project] nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *   AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *   IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *   DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 *   FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 *   DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 *   SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 *   CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 *   OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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