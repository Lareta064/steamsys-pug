<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("TITLE", "Опросный лист техническая экспертиза");
$APPLICATION->SetPageProperty("description", "Опросный лист на проведение технической экспертизы пароконтенсатных систем от компании Паровые системы");
require 'inc.functions.php';
$APPLICATION->SetTitle("Опросный лист техническая экспертиза");
$data = dataForms();
if ($USER->IsAdmin() || 1) {
    ?>
    <link rel="stylesheet" href="/forms/css/main.css">
    <script src="/forms/js/main.js"></script>
    <?
    include 'new/index10.php';
} else {
    ?>

    <form action="<?= $APPLICATION->GetCurPage(true); ?>" method="POST" role="form">
        <? include_once $_SERVER['DOCUMENT_ROOT'] . '/include/recaptcha.php' ?>
        <input type="hidden" name="PAGE" value="<?= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] ?>">
        <input type="hidden" name="save" value="Y">
        <input type="hidden" name="TITLE" value="Опросный лист техническая экспертиза">
        <input type="hidden" name="rand" value="<?= rand() ?>">
        <? foreach ($_GET as $key => $item) {
            ?>
            <input type="hidden" name="<?= $key ?>" value="<?= $item ?>">
            <?
        } ?>
        <div class="alert alert-warning reqwarning" role="alert" style="display: none">
            Пожалуйста заполните выделенные поля - они обязательны.
        </div>

        <div class="alert alert-warning formerror" role="alert" style="display: none">
        </div>

        <div class="form-group">
            <? ob_start(); ?>
            <table class="table">
                <tbody>
                <tr>
                    <td>
                        <div class="cel-title">Организация:</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="название компании"
                               name="COMPANY_TITLE" value="<?= $data['COMPANY_TITLE'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">Контактное лицо</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="контактное лицо"
                               name="NAME"
                               value="<?= $data['NAME'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">Телефон/факс:</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="+7 (000) 000-00-00"
                               name="PHONE"
                               value="<?= $data['PHONE'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">E-mail:</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="Ваш e-mail"
                               name="EMAIL"
                               value="<?= $data['EMAIL'] ?>"></td>
                </tr>
                </tbody>
            </table>
            <hr>
            <table border="1" bordercolor="#cccccc" cellspacing="0" width="100%">
                <tr>
                    <td width="30" align="center" valign="middle">1</td>
                    <td valign="middle">
                        <div class="cel-title">Источник пара:</div>
                    </td>
                    <td valign="middle">
                        <div class="radio required-radio cel-title" style="height: 75px">
                            <label class="radio-inline">
                                <input type="radio" name="type" value="1" style="float: none"
                                       <? if ($data['type'] == 1): ?>checked<? endif; ?>>собственная котельная
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="type" value="2" style="float: none"
                                       <? if ($data['type'] == 2): ?>checked<? endif; ?>>внешний источник
                            </label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">2</td>
                    <td valign="middle">
                        <div class="cel-title">Стоимость Гкал/ч:</div>
                    </td>
                    <td valign="middle"><input type="text" name="p2" value="<?= $data['p2'] ?>" class="form-control"
                                               required></td>
                </tr>
                <tr>
                    <td align="center" valign="middle">3</td>
                    <td valign="middle">
                        <div class="cel-title">Располагаемые давление и температура пара от источника:</div>
                    </td>
                    <td valign="middle"><input type="text" name="p3" value="<?= $data['p3'] ?>" class="form-control"
                                               required></td>
                </tr>
                <tr>
                    <td align="center" valign="middle">4</td>
                    <td valign="middle">
                        <div class="cel-title">Рассматриваемый потребитель:<br>
                            завод, цех, участок
                        </div>
                    </td>
                    <td valign="middle">
                        <div class="radio required-radio cel-title" style="height: 75px">
                            <label class="radio-inline">
                                <input type="radio" style="float: none" name="p4" value="1"
                                       <? if ($data['p4'] == 1): ?>checked<? endif; ?>>завод</label>
                            <label class="radio-inline">
                                <input type="radio" style="float: none" name="p4" value="2"
                                       <? if ($data['p4'] == 2): ?>checked<? endif; ?>>цех</label>
                            <label class="radio-inline">
                                <input type="radio" style="float: none" name="p4" value="3"
                                       <? if ($data['p4'] == 3): ?>checked<? endif; ?>>участок</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">5</td>
                    <td valign="middle">
                        <div class="cel-title">Расход пара на потребителе:</div>
                    </td>
                    <td valign="middle"><input type="text" name="p5" value="<?= $data['p5'] ?>" class="form-control"
                                               required></td>
                </tr>
                <tr>
                    <td align="center" valign="middle">6</td>
                    <td valign="middle">
                        <div class="cel-title">Краткое описание задачи:</div>
                    </td>
                    <td valign="middle"><input type="text" name="p6" value="<?= $data['p6'] ?>" class="form-control"
                                               required></td>
                </tr>
                <tr>
                    <td align="center" valign="middle">7</td>
                    <td valign="middle">
                        <div class="cel-title">Желаемые сроки выполнения:</div>
                    </td>
                    <td valign="middle"><input type="text" name="p7" value="<?= $data['p7'] ?>" class="form-control"
                                               required></td>
                </tr>
                <tr>
                    <td align="center" valign="middle">8</td>
                    <td valign="middle">
                        <div class="cel-title">Прочие условия:</div>
                    </td>
                    <td valign="middle"><input type="text" name="p8" value="<?= $data['p8'] ?>" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">9</td>
                    <td valign="middle">
                        <div class="cel-title">Примечания:</div>
                    </td>
                    <td valign="middle">
                        <textarea name="COMMENTS" id="input" class="form-control"><?= $data['COMMENTS'] ?></textarea>
                    </td>
                </tr>
            </table>
            <?
            $content = ob_get_contents();
            ob_end_flush();

            if ($_REQUEST['save'] == 'Y') {
                nimdaCreateLead($content);
            }
            ?>
            <hr>
            <? if (empty($_GET['result'])): ?>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                    <div class="space"></div>
                    <label class="sts21_b2_p2"><input required type="checkbox" name="legal_top" class="js-legal"
                                                      value="Y"> Нажимая кнопку “Отправить”, вы принимаете согласие на&nbsp;обработку
                        <a
                                href="/include/licenses_detail.php" target="_blank">персональных данных</a></label><br>
                    <button type="submit" class="btn-lg btn-info">Отправить</button>
                </div>
            <? endif; ?>
            <div class="col-md-12 text-center footer">
                <? $APPLICATION->IncludeComponent("bitrix:main.include", "", array(
                        "AREA_FILE_SHOW" => "file",
                        "PATH" => SITE_DIR . "include/forms/footer.php",
                        "EDIT_TEMPLATE" => "standard.php"
                    )
                ); ?>
            </div>
        </div>
        </div>
    </form>
<? } ?>
<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>