/**
 * @file
 * Provide ckeditor images gallery object.
 */

(function ($, Drupal, CKEDITOR) {

  'use strict';

  CKEDITOR.imageGallery = CKEDITOR.imageGallery || {
    url: function (query) {
      var url = Drupal.url('imce');
      if (query) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + query;
      }
      return url;
    },
    imageDialog: function (editor) {
      var width = Math.min(1000, screen.availWidth * 0.8);
      var height = Math.min(800, screen.availHeight * 0.8);
      var url = CKEDITOR.imageGallery.url('sendto=CKEDITOR.imageGallery.sendTo&type=image&ck_id=' + encodeURIComponent(editor.name));
      editor.popup(url, width, height);
    },
    sendTo: function (File, win) {
      var imce = win.imce;
      var editor = CKEDITOR.instances[imce.getQuery('ck_id')];
      var dialog = CKEDITOR.dialog.getCurrent();
      var manageImagesList = dialog.getContentElement('gallery', 'images-list')
        .getElement();
      if (editor) {
        var i;
        var selection = imce.getSelection();
        var isImage = imce.getQuery('type') === 'image';
        var images = [];
        for (i in selection) {
          if (!imce.owns(selection, i)) {
            continue;
          }
          File = selection[i];
          if (isImage && File.isImageSource()) {
            var img = '<img src="' + File.getUrl() + '"' + (File.width ? ' width="' + File.width + '"' : '') + (File.height ? ' height="' + File.height + '"' : '') + ' alt="" />';
            img = CKEDITOR.imageGallery.wrapImageField(img);
            images.push(img);
          }
        }
        var htmlListImages = '';
        if (null !== manageImagesList.getHtml()
          .match(/<img.*?src="(.*?)"[^\\>]+>/g)) {
          htmlListImages = manageImagesList.getHtml() + images.join('');
        }
        else {
          htmlListImages = images.join('');
        }
        manageImagesList.setHtml(htmlListImages);
        var listElement = document.getElementsByClassName('cke-ig-edit-list');
        var sortable = Sortable.create(listElement[0]);
        CKEDITOR.imageGallery.bindDeleteFunction(listElement[0]);
      }
      win.close();
    },
    wrapImageField: function (image) {
      var $imgWrap = $('<div class="img-wrap">').append(image);
      var $itemWrap = $('<div class="item">');
      var $attrWrap = $('<div class="attr-wrap">');

      var $alt = $('<input type="text" class="alt-input">');
      var altValue = $(image).attr('alt');
      if (altValue) {
        $alt.attr('value', altValue);
      }
      $alt.attr('onchange', 'CKEDITOR.imageGallery.setAltValue(this)');


      var $title = $('<input type="text" class="title-input">');
      var titleValue = $(image).attr('title');
      if (titleValue) {
        $title.attr('value', titleValue);
      }
      $title.attr('onchange', 'CKEDITOR.imageGallery.setTitleValue(this)');
      $attrWrap.append($('<label>Alt</label>')).append($alt);
      $attrWrap.append($('<label>Title</label>')).append($title);
      $itemWrap.append($imgWrap).append($attrWrap);
      return $itemWrap.prop('outerHTML');
    },
    setAltValue: function (element) {
      var $image = $(element).parents('.item').find('img');
      $image.attr('alt', element.value);
    },
    setTitleValue: function (element) {
      var $image = $(element).parents('.item').find('img');
      $image.attr('title', element.value);
    },
    toWidget: function (images_edit_list) {
      var outputImages = [];
      var $manageImageslist = $('<div>' + images_edit_list + '</div>');
      $manageImageslist.find('.item').each(function () {
        var $image = $(this).find('img');
        outputImages.push($($image).prop('outerHTML'));
      });
      return '<div class="cke-ig">' + outputImages.join('') + '</div>';
    },
    getCurrentManageList: function () {
      var dialog = CKEDITOR.dialog.getCurrent();
      return dialog.getContentElement('gallery', 'images-list').getElement();
    },
    bindDeleteFunction: function (listElement) {
      $(listElement).find('.item').each(function () {
        var _self = this;
        $(_self).click(function () {
          $(_self).siblings().removeClass('selected');
          $(_self).addClass('selected');
        });
        $(_self).attr('tabindex', 0);
        $(_self).find('input').focus(function () {
          $(_self).addClass('typing');
        });
        $(_self).find('input').blur(function () {
          $(_self).removeClass('typing');
        });
        _self.addEventListener('keyup', function (e) {
          if (e.key === 'Backspace' || e.key === 'Delete') {
            var $selected = $('.cke-ig-edit-list .item.selected');
            if (!$selected.hasClass('typing')) {
              $selected.remove();
            }
          }
        });
      });

    }
  };
})(jQuery, Drupal, CKEDITOR);
