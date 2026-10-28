<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("TITLE", "Опросный лист Эжектор");
$APPLICATION->SetPageProperty("description", "Заявка на установку Автоматической станции ГВС SteamAqua в компанию ООО Паровые системы");
require 'inc.functions.php';
$APPLICATION->SetTitle("Заявка на установку Автоматической станции ГВС SteamAqua");
$data = dataForms();
if ($USER->IsAdmin() || 1) {
    ?>
    <link rel="stylesheet" href="/forms/css/main.css">
    <script src="/forms/js/main.js"></script>
    <?
    include 'new/index11.php';
} else {
    ?>

    <form action="<?= $APPLICATION->GetCurPage(true); ?>" method="POST" role="form">
        <? include_once $_SERVER['DOCUMENT_ROOT'] . '/include/recaptcha.php' ?>
        <input type="hidden" name="PAGE" value="<?= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] ?>">
        <input type="hidden" name="save" value="Y">
        <input type="hidden" name="TITLE" value="Опросный лист Эжектор">
        <input type="hidden" name="rand" value="<?= rand() ?>">
        <? foreach ($_GET as $key => $item) {
            ?>
            <input type="hidden" name="<?= $key ?>" value="<?= $item ?>">
            <?
        } ?>
        <div class="alert alert-warning reqwarning" role="alert" style="display: none">
            Пожалуйста заполните выделенные поля - они обязательны.
        </div>
        <div class="alert alert-warning formerror" role="alert" style="display: none"></div>
        <? ob_start(); ?>
        <table class="table" width="100%">
            <tbody>
            <tr>
                <td>
                    <div class="cel-title">Организация:</div>
                </td>
                <td>
                    <input type="text" class="form-control" required placeholder="название компании"
                           name="COMPANY_TITLE" value="<?= $data['COMPANY_TITLE'] ?>">
                </td>
            </tr>
            <tr>
                <td>
                    <div class="cel-title">Контактное лицо</div>
                </td>
                <td>
                    <input type="text" class="form-control" required placeholder="контактное лицо" name="NAME"
                           value="<?= $data['NAME'] ?>">
                </td>
            </tr>
            <tr>
                <td>
                    <div class="cel-title">Телефон/факс:</div>
                </td>
                <td>
                    <input type="text" class="form-control" required placeholder="+7 (000) 000-00-00" name="PHONE"
                           value="<?= $data['PHONE'] ?>">
                </td>
            </tr>
            <tr>
                <td>
                    <div class="cel-title">E-mail:</div>
                </td>
                <td>
                    <input type="text" class="form-control" required placeholder="Ваш e-mail" name="EMAIL"
                           value="<?= $data['EMAIL'] ?>">
                </td>
            </tr>
            </tbody>
        </table>
        <div class="form-group">
            <table border="0" cellpadding="0" bordercolor="#ccc" width="100%" class="noborder">
                <tbody>
                <tr>
                    <td align="center">
                        <table border="1" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                            <tr>
                                <td height="35" colspan="2" align="center" bgcolor="#eee">Пар</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Давление, бар изб.</div>
                                </td>
                                <td><input type="text" name="par1" value="<?= $data['par1'] ?>" class="form-control"
                                           required></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Температура, °С</div>
                                </td>
                                <td><input type="text" name="par2" value="<?= $data['par2'] ?>" class="form-control"
                                           required></td>
                            </tr>
                        </table>
                    </td>
                    <td rowspan="5" align="center" valign="middle"><img src="<?= SITE_TEMPLATE_PATH ?>/images/gvs.jpg"
                                                                        height="550" alt="Автоматическая станция ГВС"/>
                    </td>
                    <td rowspan="5" align="center" valign="top">
                        <div>
                            <p><strong>Преимущества автоматической станции горячего водоснабжения:</strong></p>
                            <ul style="text-align: left">
                                <li>Быстрый нагрев воды</li>
                                <li>Отсутствие колебаний температуры на выходе</li>
                                <li>Компактные размеры</li>
                                <li>Сенсорная цветная панель управления</li>
                                <li>Съемные защитные панели</li>
                                <li>Регулирующий клапан со встроенным циклонным сепаратором, фильтром и
                                    конденсатоотводчиком
                                </li>
                                <li>Предподогреватель воды на входе</li>
                                <li>Встроенный перекачивающий конденсатоотводчик</li>
                            </ul>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <table border="1" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                            <tr>
                                <td height="35" colspan="2" align="center" bgcolor="#eee">Вода на выходе</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Температура, °С</div>
                                </td>
                                <td><input type="text" name="vout1" value="<?= $data['vout1'] ?>" class="form-control"
                                           required></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <table border="1" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                            <tr>
                                <td height="35" colspan="2" align="center" bgcolor="#eee">Сжатый воздух</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Давление, бар изб.</div>
                                </td>
                                <td><input type="text" name="sv12"
                                           value="<?= $data['sv12'] ?>"
                                           class="form-control" required></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <table border="1" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                            <tr>
                                <td height="35" colspan="2" align="center" bgcolor="#eee">Вода на входе</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Давление, бар изб.</div>
                                </td>
                                <td><input type="text" name="vin3"
                                           value="<?= $data['vin3'] ?>"
                                           class="form-control" required></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Температура, °С</div>
                                </td>
                                <td><input type="text" name="vin23"
                                           value="<?= $data['vin23'] ?>"
                                           class="form-control"></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Расход, кг/ч</div>
                                </td>
                                <td><input type="text" name="vin33"
                                           value="<?= $data['vin33'] ?>"
                                           class="form-control"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <table border="1" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                            <tr>
                                <td height="35" colspan="2" align="center" bgcolor="#eee">Противодавление в конденсатной
                                    линии
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Давление, бар изб.</div>
                                </td>
                                <td><input type="text" name="pline1"
                                           value="<?= $data['pline1'] ?>"
                                           class="form-control" required></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
            <hr>
            <table width="100%" border="1" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                <tr>
                    <td width="5%" height="35" align="center" valign="middle" bgcolor="#eee">№</td>
                    <td width="40%" align="center" valign="middle" bgcolor="#eee">Дополнительно</td>
                    <td width="55%" align="center" valign="middle" bgcolor="#eee">Значение</td>
                </tr>
                <tr>
                    <td align="center" valign="middle">1</td>
                    <td valign="middle">
                        <div class="cel-title">Максимальное рабочее давление пара,  бар изб.</div>
                    </td>
                    <td valign="middle" align="center">
                        <input type="text" name="p1" value="<?= $data['p1'] ?>" class="form-control" required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">2</td>
                    <td valign="middle">
                        <div class="cel-title">Максимальна рабочая температура пара, °С</div>
                    </td>
                    <td valign="middle" align="center">
                        <input type="text" name="p2" value="<?= $data['p2'] ?>" class="form-control" required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">3.</td>
                    <td valign="middle"><span class="cel-title">
							<div class="cel-title">Примечание:</div>
						  </span></td>
                    <td valign="middle">
							<textarea name="COMMENTS" id="input"
                                      class="form-control"></textarea>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" valign="middle">
                        * Если вы затрудняетесь в определении каких-либо значений, свяжитесь с нами, мы поможем их
                        определить, основываясь на дополнительной информации о процессе / установке.
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
            <div class="row">
                <? if (empty($_GET['result'])): ?>
                    <div class="col-xs-12 text-center">
                        <div class="space"></div>
                        <label class="sts21_b2_p2"><input required type="checkbox" name="legal_top" class="js-legal"
                                                          value="Y"> Нажимая кнопку “Отправить”, вы принимаете согласие
                            на&nbsp;обработку <a
                                    href="/include/licenses_detail.php" target="_blank">персональных
                                данных</a></label><br>
                        <button type="submit" class="btn-lg btn-info">Отправить</button>
                    </div>
                <? endif; ?>
                <div class="col-xs-12 text-center">
                    <div class="space"></div>
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