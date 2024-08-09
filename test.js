/**
 * Тест для проверки работоспособности
 * @user user_auto335
 * @user user_auto356
 * @pre Блок предустановки
 */
const {
  AUTOTEST_USERS,
  MENU_NAME,
  MULTIVIEW,
  BUTTON_CREATE_PAGE,
  CMS_ELEMENTS,
  CMS_ELEMENT_ACTION_BUTTONS,
  CMS_MODAL_ID,
  DATA_AUTOMATION_KEY,
} = require("../../../../constants.js");

const {
  openPageWithAuthentication,
  seeCmsElementWithSettings,
  addCmsElement
} = require("../../../../utils/helpers.js");

const AUTOTEST_USER = AUTOTEST_USERS.user335;
const SCENARIO_LABEL = "CMSElementActionBarButtons";

Feature(`@${SCENARIO_LABEL} - Кнопки быстрого действия для добавления, удаления, дублирования и редактирования элемента`);

//!SECTION - проверка кнопки "Добавить элемент"

Scenario(
  `Проверка работоспособности кнопки "Добавить элемент" для контейнеров #${SCENARIO_LABEL}-1`,
  async ({ I }) => {
    // Авторизоваться и перейти в "Управление контентом" -> "Настройка представлений" [Окрыта станица "Управление контентом" -> "Настройка представлений"]
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Нажать кнопку "Создать страницу" [Кнопка нажата]
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Выделить элемент "корневой элемент" [Корневой элемент выделен]
    await I.selectCmsElementByNavigationName({
      elementName: CMS_ELEMENTS.base.rootElement.name,
    });

    // Нажать кнопку "Добавить элемент" для корневого элемента (считаем, что кнопка видна)
    await I.clickCmsElementActionButton({
      elementName: CMS_ELEMENTS.base.rootElement.name,
      buttonName: CMS_ELEMENT_ACTION_BUTTONS.add,
    });

    // Выбрать элемент "заголовок" в модальном окне и нажать добавить [Элемент выбран и добавлен]
    await I.selectFromModalAddCmsElement({
      selector: CMS_ELEMENTS.printing.header.type,
      modalId: "dialog-Добавление элемента"
    });

    // Проверить, что элемент "заголовок" появился [Элемент появился]
    await seeCmsElementWithSettings(I, {
      elementName: CMS_ELEMENTS.printing.header.name,
      elementType: CMS_ELEMENTS.printing.header.type,
      parentElementName: CMS_ELEMENTS.base.rootElement.name,
    });
  }
);

Scenario(
  `Проверка отсутствия кнопки "Добавить элемент" у неконтейнеров #${SCENARIO_LABEL}-2`,
  async ({ I }) => {
    // Авторизоваться и перейти в "Управление контентом" -> "Настройка представлений" [Окрыта страница "Управление контентом" -> "Настройка представлений"]
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Нажать кнопку "Создать страницу" [Кнопка нажата, перешли на страницу создания представления]
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Добавить элемент "загловок" в представление [Заголовок добавлен в представление]
    await addCmsElement(I, {
      elementName: CMS_ELEMENTS.printing.paragraph.name,
      elementType: CMS_ELEMENTS.printing.paragraph.type,
    });

    // Проверить отсутствует ли кнопка "Добавить элемент" [Кнопка "Добавить элемент" отсутствует]
    await I.seeCmsElementActionButton({
      elementName: CMS_ELEMENTS.printing.paragraph.name,
      buttonName: CMS_ELEMENT_ACTION_BUTTONS.add,
      buttonVisible: false,
    });
  }
);

//!SECTION - проверка кнопки "Удалить элемент"

Scenario(
  `Проверка отсутствия кнопки "Удалить элемент" у корневого элемента #${SCENARIO_LABEL}-3`,
  async ({ I }) => {
    // Авторизоваться и перейти в "Управление контентом" -> "Настройка представлений" [Окрыта страница "Управление контентом" -> "Настройка представлений"]
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Нажать кнопку "Создать страницу" [Кнопка нажата, перешли на страницу создания представления]
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Выделить элемент "корневой элемент" [Корневой элемент выделен]
    await I.selectCmsElementByNavigationName({
      elementName: CMS_ELEMENTS.base.rootElement.name,
    });

    // Проверить отсутствует ли кнопка "Удалить элемент" [Кнопка "Удалить элемент" отсутствует]
    await I.seeCmsElementActionButton({
      elementName: CMS_ELEMENTS.printing.paragraph.name,
      buttonName: CMS_ELEMENT_ACTION_BUTTONS.delete,
      buttonVisible: false,
    });
  }
);

Scenario(
  `Проверка работоспособности кнопки "Удалить элемент" #${SCENARIO_LABEL}-4`,
  async ({ I }) => {
    // Авторизоваться и перейти в "Управление контентом" -> "Настройка представлений" [Окрыта страница "Управление контентом" -> "Настройка представлений"]
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Нажать кнопку "Создать страницу" [Кнопка нажата, перешли на страницу создания представления]
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Выделить элемент "корневой элемент" [Корневой элемент выделен]
    await I.selectCmsElementByNavigationName({
      elementName: CMS_ELEMENTS.base.rootElement.name,
    });

    // Добавить элемент "заголовок" (элемент уже выделен) [Элемент добавлен и выделен в представлении]
    await addCmsElement(I, {
      elementName: CMS_ELEMENTS.printing.header.name,
      elementType: CMS_ELEMENTS.printing.header.type,
    });

    // Нажать кнопку "Удалить элемент" для заголовка [Кнопка "Удалить элемент" нажата, элемент удален]
    await I.clickCmsElementActionButton({
      elementName: CMS_ELEMENTS.printing.header.name,
      buttonName: CMS_ELEMENT_ACTION_BUTTONS.delete,
    });

    // Проверить отсутствует ли заголовок [Заголовок отсутствует]
    await seeCmsElementWithSettings(I, {
      elementType: CMS_ELEMENTS.printing.header.type,
      elementName: CMS_ELEMENTS.printing.header.name,
      elementVisible: false,
    });
  }
);

//!SECTION - проверка кнопки "Дублировать элемент"

Scenario(
  `Проверка отсутствия кнопки "Дублировать элемент" у корневого элемента #${SCENARIO_LABEL}-5`,
  async ({ I }) => {
    // Авторизоваться и перейти в "Управление контентом" -> "Настройка представлений" [Окрыта страница "Управление контентом" -> "Настройка представлений"]
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Нажать кнопку "Создать страницу" [Кнопка нажата, перешли на страницу создания представления]
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Выделить элемент "корневой элемент"
    await I.selectCmsElementByNavigationName({
      elementName: CMS_ELEMENTS.base.rootElement.name,
    });

    //NOTE - у кнопки "Дублировать элемент" нет атрибута data-cy
    // Проверить отсутствие кнопки "Дублировать элемент" [Кнопка "Дублировать элемент" отсутствует]
    await I.xPathCheckNotExists(`
      //div[contains(@class, "SActionsContainer")]
      //button[@title="Дублировать элемент"]`);
  }
);

Scenario(
  `Проверка работоспособности кнопки "Дублировать элемент" #${SCENARIO_LABEL}-6`,
  async ({ I }) => {
    // Авторизоваться и перейти в "Управление контентом" -> "Настройка представлений" [Окрыта страница "Управление контентом" -> "Настройка представлений"]
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Нажать кнопку "Создать страницу" [Кнопка нажата, перешли на страницу создания представления]
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Выделить элемент "корневой элемент" [Корневой элемент выделен]
    await I.selectCmsElementByNavigationName({
      elementName: CMS_ELEMENTS.base.rootElement.name,
    });

    // Добавить элемент "заголовок" [Заголовок добавлен в представление]
    await addCmsElement(I, {
      elementName: CMS_ELEMENTS.printing.header.name,
      elementType: CMS_ELEMENTS.printing.header.type,
    });

    //NOTE - у кнопки "Дублировать элемент" нет атрибута data-cy, невозможно
    // использовать методы проверки существования кнопки и нажатия

    // Проверить наличие кнопки "Дублировать элемент" у заголовка [Кнопка "Дублировать элемент" присутсвует]
    await I.xPathCheck(`
      //div[contains(@class, "SActionsContainer")]
      //button[@title="Дублировать элемент"]`);

    // Нажать кнопку "Дублировать элемент" [Кнопка нажата, элемент продублирован]
    await I.xPathClick(`
      //div[contains(@class, "SActionsContainer")]
      //button[@title="Дублировать элемент"]`);

    // Проверим, что заголовка 2 [Количество заголовков в представлении равно двум]
    await I.checkElementsCountOnEditorBody({
      elementType: CMS_ELEMENTS.printing.header.type,
      parentName: CMS_ELEMENTS.layers.verticalContainer.name,
      expectedElementsCount: 2,
    });
  }
);

//!SECTION - проверка кнопки "Изменить элемент"

Scenario(
  `Проверка работоспособности кнопки "Изменить элемент" для корневого элемента #${SCENARIO_LABEL}-7`,
  async ({ I }) => {
    // Авторизоваться и перейти в "Управление контентом" -> "Настройка представлений" [Окрыта страница "Управление контентом" -> "Настройка представлений"]
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Нажать кнопку "Создать страницу" [Кнопка нажата, перешли на страницу создания представления]
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Выделить элемент "корневой элемент" [Корневой элемент выделен]
    await I.selectCmsElementByNavigationName({
      elementName: CMS_ELEMENTS.base.rootElement.name,
    });

    // Нажать кнопку "Изменить элемент" для корневого элемента (даже не смотря на отсутствие настроек, окно должно открыться) [Кнопка "Изменить элемент"] присутствует
    await I.clickCmsElementActionButton({
      elementName: CMS_ELEMENTS.base.rootElement.name,
      buttonName: CMS_ELEMENT_ACTION_BUTTONS.edit,
      //despite everything it's still has editor
    });

    // Появилось ли окно редактора для корневого элемента [Окно редактора для корневого элемента появилось]
    await I.xPathCheck(
      `//div[@${DATA_AUTOMATION_KEY}="${CMS_MODAL_ID}"]
      /div[@${DATA_AUTOMATION_KEY}="content-panel-${CMS_ELEMENTS.base.rootElement.name}"]`
    );
  }
);

Scenario(
  `Проверка работоспособности кнопки "Изменить элемент" #${SCENARIO_LABEL}-8`,
  async ({ I }) => {
    // Авторизоваться и перейти в "Управление контентом" -> "Настройка представлений" [Окрыта страница "Управление контентом" -> "Настройка представлений"]
    await openPageWithAuthentication({
      I,
      user: AUTOTEST_USER,
      menuName: MENU_NAME.contentManagement,
      pageData: MULTIVIEW[0],
    });

    // Нажать кнопку "Создать страницу" [Кнопка нажата, перешли на страницу создания представления]
    await I.clickButtonView({ label: BUTTON_CREATE_PAGE });

    // Добавить элемент "заголовок"
    await addCmsElement(I, {
      elementName: CMS_ELEMENTS.printing.header.name,
      elementType: CMS_ELEMENTS.printing.header.type,
    });

    // Нажать кнопку "Изменить элемент" для корневого элемента (даже не смотря на отсутствие настроек, окно должно открыться) [Кнопка нажата, открылось окно редактора]
    await I.clickCmsElementActionButton({
      elementName: CMS_ELEMENTS.printing.header.name,
      buttonName: CMS_ELEMENT_ACTION_BUTTONS.edit,
    });

    // Появилось ли окно редактора для корневого элемента [Окно редактора появилось]
    await I.xPathCheck(
      `//div[@${DATA_AUTOMATION_KEY}="${CMS_MODAL_ID}"]
      /div[@${DATA_AUTOMATION_KEY}="content-panel-${CMS_ELEMENTS.base.rootElement.name}"]`
    );

    // Правильное ли навигационное имя отображается в окне редактора [Навигационное имя элемента равно наименованию элемента]
    await I.xPathCheck(
      `//div[contains(@class, "editor__SHeader")]
      //span[contains(@class, "editor__SLabel") and text()="${CMS_ELEMENTS.printing.header.name}"]`
    );
  }
);
