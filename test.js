const path = require("path");

const {
  AUTOTEST_USERS,
  MENU_NAME,
  MULTIVIEW,
  BUTTON_CREATE_PAGE,
  BUTTON_IMPORT_CONTENT,
  CMS_SIDEBAR_BUTTONS,
  AUTOTEST_SELECTOR,
  CMS_ELEMENTS,
  BUTTON_VIEW_CONTENT,
  DIALOG_CONTENT_TYPES,
  BUTTON_EXPORT_CONTENT,
  DIALOG_UPLOAD_FILE,
  CMS_GENERAL_SETTINGS,
  FIELD_TYPES_ENUM,
  CMS_ELEMENT_EDITOR_BUTTONS,
  BUTTON_SAVE,
  MODAL_OK_BUTTON_LABEL,
  DIALOG_MULTIVIEW_SAVED,
  VIEW_CREATE_TIMEOUT,
  MODAL_CANCEL_BUTTON_LABEL,
  DATA_TYPE,
  BUTTON_ADD_ELEMENT_CMS_SELECTOR,
  BUTTON_ADD_WIDGET_CMS,
  NAME_TABS_CMS
} = require("../../../../constants");

const {
  seeCmsElementWithSettings,
  filterInTable,
  removeViewSettingElementsFromTableView,
  addCmsElement,
  fillFieldValue
} = require("../../../../utils/helpers");

const {
  openPageWithAuthentication,
  openPage
} = require("../../../../utils/index").TestsHelpers;

const AUTOTEST_USER = AUTOTEST_USERS.user327;
const SCENARIO_LABEL = "CMSCommandbarImportExportButton";

const UPLOAD_FILES_PATH = path.resolve(__dirname, "uploadFiles");

const TEST_IMPORT_WITH_CLASSES_FILE = path.resolve(
  UPLOAD_FILES_PATH,
  "test_import_with_classes.json"
);
const TEST_IMPORT_WITH_IMAGES = path.resolve(
  UPLOAD_FILES_PATH,
  "test_import_with_images.json"
);
const TEST_IMPORT_WITH_WIDGET = path.resolve(
  UPLOAD_FILES_PATH,
  "test_import_widget.json"
);
const TEST_IMPORT_WITH_INSTANCE = path.resolve(
  UPLOAD_FILES_PATH,
  "test_import_with_instance.json"
);

const DEFAULT_CLASS_NAME = "CONTAINER DEFAULT";
const ACTIVE_CLASS_NAME = "CONTAINER ACTIVE";
const HOVER_CLASS_NAME = "HEADER HOVER";
const FOCUS_CLASS_NAME = "HEADER FOCUS";

const TEST_PUBLIC_IMAGE_NO_CACHE_NAME =
  "Изображение с публичной ссылкой и без кэширования";
const TEST_PUBLIC_IMAGE_CACHED_NAME =
  "Изображение с публичной ссылкой и кэшированием";
const TEST_PRIVATE_IMAGE = "Изображение без публичной ссылки";

const TEST_WIDGET_NAME = "widget_for_autotest";
const TEST_WIDGET_NAVIGATION_NAME = "Виджет для импорта";

const TEST_IMPORT_QBUTTON_TITLE = "Тест импорта";
const TEST_IMPORT_QBUTTON_NAV_NAME =
  "Проверка импорта. Кнопка быстрого создания";
const TEST_INSTANCE_VIEW_NAME = "Тест импорта. Представление сущности";

const MODAL_ID = "dialog-dialog-add-element";

const FILE_IMAGE_LINK =
  "https://testing-content-test.doctrixcloud.ru/api/fs/public/link/05335faa394b41b0bfd46fca83b6a5f4";

const CMS_TEST_PAGES = {
  exportView: {
    viewName: "autotest_cms_export",
    name: "CMS Проверка экспорта"
  }
}

/**
 * @description
 *  Функция, определяющая есть ли имя CSS класса в списке классов
 * @param {*} I
 * @param {{classType: string, className: string}} params
 * @param {*} params.classType - Тип класса (DEFAULT, ACTIVE, HOVER, FOCUS)
 * @param {*} params.className - имя CSS класса
 */
const seeCmsCssClass = async (I, { classType, className }) => {
  await I.xPathCheck(`
    //li[@${AUTOTEST_SELECTOR}="${classType}-class"]
    //div[contains(@${AUTOTEST_SELECTOR}, "${className}")]`);
};

Feature(`@${SCENARIO_LABEL} - CMS импорт/экспорт представлений`);

Scenario(
  `Проверка работоспособности кнопки "Импортировать контент" с настроенными классами #${SCENARIO_LABEL}-1`,
  async ({ I }) => {
    // Переход на страницу "Управление контентом" -> "Настройка представлений"
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Нажать кнопку "Создать"
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Нажать кнопку "Импортировать контент"
    await I.clickButtonView({ label: BUTTON_IMPORT_CONTENT });

    // Загрузить файл представления в модальном окне
    await I.loadFile({
      filePath: TEST_IMPORT_WITH_CLASSES_FILE,
      dialogId: "dialog-upload-file",
    });

    // Нажать кнопку "Список классов" в сайдбаре и открыть список классов
    await I.clickSidebarButtonCms({
      buttonName: CMS_SIDEBAR_BUTTONS.classes,
    });

    // Проверить наличие стандартного класса
    await seeCmsCssClass(I, {
      classType: "DEFAULT",
      className: DEFAULT_CLASS_NAME,
    });

    // Проверить наличие активного класса
    await seeCmsCssClass(I, {
      classType: "ACTIVE",
      className: ACTIVE_CLASS_NAME,
    });

    // Проверить наличие класса при наведении
    await seeCmsCssClass(I, {
      classType: "HOVER",
      className: HOVER_CLASS_NAME,
    });

    // Проверить наличие класса при фокусе
    await seeCmsCssClass(I, {
      classType: "FOCUS",
      className: FOCUS_CLASS_NAME,
    });
  }
);

Scenario(
  `Проверка работоспособности кнопки "Импортировать контент" с элементами медиа (изображения) с публичными ссылками и без #${SCENARIO_LABEL}-2`,
  async ({ I }) => {
    // Переход на страницу "Управление контентом" -> "Настройка представлений"
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Нажать кнопку "Создать"
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Нажать кнопку "Импортировать контент"
    await I.clickButtonView({ label: BUTTON_IMPORT_CONTENT });

    // Загрузить файл представления в модальном окне
    await I.loadFile({
      filePath: TEST_IMPORT_WITH_IMAGES,
      dialogId: "dialog-upload-file",
    });

    // Проверить отображается ли изображения с публичными ссылками

    // с кэшированием
    await I.seeCmsImageContent({
      imageNavigationName: TEST_PUBLIC_IMAGE_CACHED_NAME,
    });

    // без кэширования
    await I.seeCmsImageContent({
      imageNavigationName: TEST_PUBLIC_IMAGE_NO_CACHE_NAME,
    });

    // Проверить не отображается ли изображение с приватной ссылкой
    await I.seeCmsImageContent({
      imageNavigationName: TEST_PRIVATE_IMAGE,
      imageVisible: false,
    });
  }
);

Scenario(
  `Проверка работоспособности кнопки "Импортировать контент" с виджетом #${SCENARIO_LABEL}-3`,
  async ({ I }) => {
    // Переход на страницу "Управление контентом" -> "Настройка представлений"
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Нажать кнопку "Создать"
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Нажать кнопку "Импортировать контент"
    await I.clickButtonView({ label: BUTTON_IMPORT_CONTENT });

    // Загрузить файл представления в модальном окне
    await I.loadFile({
      filePath: TEST_IMPORT_WITH_WIDGET,
      dialogId: "dialog-upload-file",
    });

    // Проверить загрузился ли виджет с изображением
    await seeCmsElementWithSettings(I, {
      elementType: CMS_ELEMENTS.services.widget.type,
      elementName: TEST_WIDGET_NAVIGATION_NAME,
      settings: { widgetName: TEST_WIDGET_NAME },
    });
  }
);

Scenario(
  `Проверка работоспособности кнопки "Импортировать контент" с представлением сущности #${SCENARIO_LABEL}-4`,
  async ({ I }) => {
    // Переход на страницу "Управление контентом" -> "Настройка представлений"
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Нажать кнопку "Создать"
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Нажать кнопку "Импортировать контент"
    await I.clickButtonView({ label: BUTTON_IMPORT_CONTENT });

    // Загрузить файл представления в модальном окне
    await I.loadFile({
      filePath: TEST_IMPORT_WITH_INSTANCE,
      dialogId: DIALOG_UPLOAD_FILE,
    });

    // Проверить не отобразилось ли окно ошибки
    await I.dontSeeDialogWithType(DIALOG_CONTENT_TYPES.error);

    // нажать кнопку Показывать контент
    await I.clickButtonView({ label: BUTTON_VIEW_CONTENT });

    // Проверить видно ли представление сущности в онке предосмотра
    await seeCmsElementWithSettings(I, {
      elementType: CMS_ELEMENTS.advanced.instanceView.type,
      elementName: TEST_INSTANCE_VIEW_NAME,
      settings: {
        xContent: `//div[@${AUTOTEST_SELECTOR}="table" and @data-loaded="true"]`,
      },
    });

    // Проверить видна ли кнопка в окне предосмотра
    await seeCmsElementWithSettings(I, {
      elementType: CMS_ELEMENTS.base.quickButton.type,
      elementName: TEST_IMPORT_QBUTTON_NAV_NAME,
      settings: { title: TEST_IMPORT_QBUTTON_TITLE, icon: "Import" },
    });

    // Нажать на кнопку быстрого действия и перейти по ссылке
    await I.xPathClick(`//a[@title="${TEST_IMPORT_QBUTTON_TITLE}"]`);
    await I.waitForNetworkResponses();
    await I.waitIdle();

    // Проверить перешли ли поссылке
    await I.seeInCurrentUrl("ui/test_view_for_cms_import");
  }
);

Scenario(
  `Проверка работоспособности кнопки "Экспортировать контент" с виджетом #${SCENARIO_LABEL}-5`,
  async ({ I }) => {
    // Переход на страницу "Управление контентом" -> "Настройка представлений"
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Отфильтровать список по названию представления
    await filterInTable({
      I,
      nameFilter: "Отображаемое имя",
      valueFilter: CMS_TEST_PAGES.exportView.viewName
    });

    // Удалить тестовое представление
    await removeViewSettingElementsFromTableView(
      { I },
      CMS_TEST_PAGES.exportView.name
    );

    // Нажать кнопку "Создать"
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Открыть общие настройки и заполнить поля:
    await I.clickSidebarButtonCms({
      buttonName: CMS_SIDEBAR_BUTTONS.generalSettings,
      hasRequest: false,
    });

    // Заполнить название
    await fillFieldValue(I, {
      selector: CMS_GENERAL_SETTINGS.name,
      value: CMS_TEST_PAGES.exportView.viewName,
      type: FIELD_TYPES_ENUM.String,
    });

    // Заполнить отображаемое имя
    await fillFieldValue(I, {
      selector: CMS_GENERAL_SETTINGS.displayName,
      value: CMS_TEST_PAGES.exportView.name,
      type: FIELD_TYPES_ENUM.String,
    });

    // Добавить элемент "Виджет"
    await I.xPathClick(
      `//div[@${DATA_TYPE}="CONTAINER"]//button[@${AUTOTEST_SELECTOR}="${BUTTON_ADD_ELEMENT_CMS_SELECTOR}"]`
    );
    await I.waitIdle();

    // перейти на таб "Сервисы"
    await I.clickDialogViewButtonTabList({
      modalId: MODAL_ID,
      label: NAME_TABS_CMS.services,
    });

    //выбрать виджет и добавить его
    await I.xPathClick(
      `//div[@${AUTOTEST_SELECTOR}="${TEST_WIDGET_NAME}"]//button[@${AUTOTEST_SELECTOR}="${BUTTON_ADD_WIDGET_CMS}-${TEST_WIDGET_NAME}"]`
    );
    await I.waitForNetworkResponses();
    await I.waitIdle();

    // Сохранить представление
    await I.clickButtonView({ label: BUTTON_SAVE.ru });
    await I.clickModalButton(MODAL_CANCEL_BUTTON_LABEL, {
      modalId: DIALOG_MULTIVIEW_SAVED,
    });
    await I.waitForTimeout(VIEW_CREATE_TIMEOUT);

    // Нажать кнопку "Экспортировать контент"
    await I.clickButtonView({ label: BUTTON_EXPORT_CONTENT });

    // Проверить не отобразилось ли окно ошибки
    await I.dontSeeDialogWithType(DIALOG_CONTENT_TYPES.error);
  }
);

Scenario(
  `Проверка работоспособности кнопки "Экспортировать контент" с изображением #${SCENARIO_LABEL}-6`,
  async ({ I }) => {
    // Переход на страницу "Управление контентом" -> "Настройка представлений"
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Отфильтровать список по названию представления
    await filterInTable({
      I,
      nameFilter: "Отображаемое имя",
      valueFilter: CMS_TEST_PAGES.exportView.viewName
    });

    // Удалить тестовое представление
    await removeViewSettingElementsFromTableView(
      { I },
      CMS_TEST_PAGES.exportView.name
    );

    // Нажать кнопку "Создать"
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Открыть общие настройки и заполнить поля:
    await I.clickSidebarButtonCms({
      buttonName: CMS_SIDEBAR_BUTTONS.generalSettings,
      hasRequest: false,
    });

    // Заполнить название
    await fillFieldValue(I, {
      selector: CMS_GENERAL_SETTINGS.name,
      value: CMS_TEST_PAGES.exportView.viewName,
      type: FIELD_TYPES_ENUM.String,
    });

    // Заполнить отображаемое имя
    await fillFieldValue(I, {
      selector: CMS_GENERAL_SETTINGS.displayName,
      value: CMS_TEST_PAGES.exportView.name,
      type: FIELD_TYPES_ENUM.String,
    });

    // Добавить элемент "Изображение"
    await addCmsElement(I, {
      elementName: CMS_ELEMENTS.media.image.name,
      elementType: CMS_ELEMENTS.media.image.type
    });

    // Выбрать тип загрузки файла
    await fillFieldValue(I, {
      selector: "fileInsertType",
      value: "Внешняя ссылка",
      type: FIELD_TYPES_ENUM.Select
    });

    // Ввести значение внешней ссылки
    await fillFieldValue(I, {
      selector: "fileLink",
      value: FILE_IMAGE_LINK,
      type: FIELD_TYPES_ENUM.String
    });

    // Применить изменения
    await I.clickCommandPanelButtonCms({
      buttonName: CMS_ELEMENT_EDITOR_BUTTONS.apply,
      hasRequest: false
    });

    // Сохранить представление
    await I.clickButtonView({ label: BUTTON_SAVE.ru });
    await I.clickModalButton(MODAL_CANCEL_BUTTON_LABEL, {
      modalId: DIALOG_MULTIVIEW_SAVED,
    });
    await I.waitForTimeout(VIEW_CREATE_TIMEOUT);

    // Нажать кнопку "Экспортировать контент"
    await I.clickButtonView({ label: BUTTON_EXPORT_CONTENT });

    // Проверить не отобразилось ли окно ошибки
    await I.dontSeeDialogWithType(DIALOG_CONTENT_TYPES.error);
  }
);
