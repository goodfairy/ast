/**
 * @file
 * Provide gallery dialog.
 */

(function ($, Drupal, CKEDITOR) {

  'use strict';

  CKEDITOR.dialog.add('gallery', function (editor) {
    return {
      title: Drupal.t('Images gallery'),
      minWidth: 500,
      minHeight: 400,
      onOk: function () {
        var manageImagesList = CKEDITOR.imageGallery.getCurrentManageList();
        var widget = CKEDITOR.imageGallery.toWidget(manageImagesList.getHtml());
        var element = CKEDITOR.dom.element.createFromHtml(widget);
        editor.insertElement(element);
        editor.widgets.initOn(element, 'gallery_widget');
      },
      contents: [
        {
          id: 'gallery',
          elements: [
            {
              id: 'imce-button',
              type: 'button',
              label: 'Upload',
              onClick: function () {
                CKEDITOR.imageGallery.imageDialog(editor);
              }
            },
            {
              id: 'images-list',
              type: 'html',
              className: 'cke-ig-edit-list',
              html: '<div>' + Drupal.t('Please upload images.') + '</div>',
              setup: function (widget) {
                var manageImagesList = CKEDITOR.imageGallery.getCurrentManageList();
                var element = widget.element.getHtml();
                var images = [];
                $(element).each(function () {
                  images.push(CKEDITOR.imageGallery.wrapImageField(this));
                });
                manageImagesList.setHtml(images.join(''));
                var listElement = document.getElementsByClassName('cke-ig-edit-list');
                var sortable = Sortable.create(listElement[0]);
                CKEDITOR.imageGallery.bindDeleteFunction(listElement[0]);
              }
            }
          ]
        }
      ]
    };
  });

})(jQuery, Drupal, CKEDITOR);
