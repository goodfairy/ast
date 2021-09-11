/**
 * @file
 * Provide images gallery button.
 */

(function ($, Drupal, CKEDITOR) {

  'use strict';

  CKEDITOR.plugins.add('images_gallery', {
    requires: 'dialog',
    icons: 'gallery',
    init: function (editor) {
      CKEDITOR.dialog.add('gallery', CKEDITOR.getUrl(this.path + 'dialogs/gallery.js'));
      editor.addCommand('gallery', new CKEDITOR.dialogCommand('gallery'));
      editor.addContentsCss(this.path + 'styles/widget.css');

      editor.widgets.add('gallery_widget', {
        upcast: function (element) {
          return element.name === 'div' && element.hasClass('cke-ig');
        },
        requiredContent: 'div(cke-ig)',
        allowedContent: 'img',
        dialog: 'gallery'
      });

      editor.ui.addButton('Gallery', {
        label: Drupal.t('Image gallery'),
        command: 'gallery',
        toolbar: 'doctools,10'
      });
    }
  });
})(jQuery, Drupal, CKEDITOR);
