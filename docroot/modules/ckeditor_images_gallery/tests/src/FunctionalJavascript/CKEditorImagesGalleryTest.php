<?php

namespace Drupal\Tests\ckeditor_images_gallery\FunctionalJavascript;

use Drupal\Core\Entity\Entity\EntityFormDisplay;
use Drupal\editor\Entity\Editor;
use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\file\Entity\File;
use Drupal\filter\Entity\FilterFormat;
use Drupal\FunctionalJavascriptTests\WebDriverTestBase;
use Drupal\imce\Entity\ImceProfile;
use Drupal\node\Entity\NodeType;
use Drupal\Tests\TestFileCreationTrait;

/**
 * Class CKEditorImagesGalleryTest.
 *
 * @package Drupal\Tests\ckeditor_images_gallery\FunctionalJavascript
 * @group ckeditor_images_gallery
 */
class CKEditorImagesGalleryTest extends WebDriverTestBase {
  use TestFileCreationTrait;

  protected static $modules = [
    'ckeditor_images_gallery',
    'node',
    'file',
    'media',
  ];

  protected $account;

  protected $fullHtmlFormat;

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();

    FilterFormat::create([
      'format' => 'full_html',
      'name' => 'Full HTML',
      'weight' => 0,
    ])->save();

    Editor::create([
      'format' => 'full_html',
      'editor' => 'ckeditor',
      'settings' => [
        'toolbar' => [
          'rows' => [
            [
              [
                'name' => 'Main',
                'items' => [
                  'Source',
                  'Gallery',
                ],
              ],
            ],
          ],
        ],
      ],
    ])->save();

    $this->drupalCreateContentType(['type' => 'page']);


    $this->account = $this->drupalCreateUser([
      'administer nodes',
      'create page content',
      'use text format full_html',
      'administer imce',
      'access files overview',
    ], NULL, TRUE);
    $role = $this->account->getRoles();
    $this->drupalLogin($this->account);
    /** @var \Drupal\Core\Config\ConfigFactoryInterface $config */
    $config = $this->container->get('config.factory');
    $config->getEditable('imce.settings')
      ->set('roles_profiles', [$role[2] => ['public' => 'admin']])
      ->save();

    $this->getTestFiles('image');
  }

  /**
   * Test Body field and button appeared.
   */
  public function testAddImagesGalleryFlow() {
    $this->drupalGet('node/add/page');
    $assert_session = $this->assertSession();
    $session = $this->getSession();

    $assert_session->elementExists('css', 'textarea[name="body[0][value]"]');
    $assert_session->elementExists('css', 'a.cke_button__gallery.cke_button');

    $session->getPage()->clickLink('Image gallery');
    $assert_session->waitForElementVisible('css', 'table.cke_dialog_contents');
    $assert_session->elementExists('css', 'a.cke_dialog_ui_button');

    $session->getPage()->clickLink('Upload');
    $windows = $session->getDriver()->getWindowNames();
    $session->getDriver()->switchToWindow($windows[1]);
    $assert_session->waitForElementVisible('css', 'div.file-jpg');
    $assert_session->elementExists('css', '#imce-content');

    $assert_session->elementExists('css', 'div.file-jpg')->doubleClick();

    $session->getDriver()->switchToWindow();
    $assert_session->elementExists('css', '.cke-ig-edit-list img');

    $session->getPage()->clickLink('Upload');
    $windows = $session->getDriver()->getWindowNames();
    $session->getDriver()->switchToWindow($windows[1]);
    $assert_session->waitForElementVisible('css', 'div.file-jpg');
    $assert_session->elementExists('css', '#imce-content');
    $assert_session->elementExists('css', 'div.file-jpg')->doubleClick();

    $session->getDriver()->switchToWindow();
    $selected_image = $session->getPage()->findAll('css', '.cke-ig-edit-list img');
    $this->assertEquals(2, count($selected_image));

//    $session->getPage()->clickLink('cke_dialog_ui_button_ok');
    $assert_session->elementExists('css', '.cke_dialog_ui_button_ok')->click();
    $session->getPage()->fillField('edit-title-0-value', $this->randomMachineName());
    $session->getPage()->pressButton('edit-submit');
    $assert_session->elementExists('css', '.cke-ig');
    $assert_session->elementExists('css', '.cke-ig img');
  }

}
