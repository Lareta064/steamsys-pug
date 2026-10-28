<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("TITLE", "Опросный лист Эжектор");
$APPLICATION->SetPageProperty("description", "Опросный лист для подбора оптимального парового эжектора от ООО Паровые системы");
require 'inc.functions.php';
$APPLICATION->SetTitle("Опросный лист Эжектор");
$data = dataForms();
if ($USER->IsAdmin() || 1) {
    ?>
    <link rel="stylesheet" href="/forms/css/main.css">
    <script src="/forms/js/main.js"></script>
    <?
    include 'new/index9.php';
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
            <table class="table" width="100%">
                <tbody>
                <tr>
                    <td valign="middle">
                        <div class="cel-title r-title">Тип оборудования:</div>
                    </td>
                    <td valign="middle">
                        <div class="radio required-radio">
                            <label class="radio-inline">
                                <input type="radio" name="type"
                                       value="1" <? if ($data['type'] == 1): ?>checked<? endif; ?>> Термокомпрессор
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="type" value="2"
                                       <? if ($data['type'] == 2): ?>checked<? endif; ?>> Циркуляционный эжектор
                            </label>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <table border="0" cellpadding="0" bordercolor="#ccc" width="100%" class="noborder">
                <tbody>
                <tr>
                    <td align="center">
                        <table border="1" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                            <tr>
                                <td height="35" colspan="2" align="center" bgcolor="#eee">Пар высокого давления</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Давление, бар изб.</div>
                                </td>
                                <td><input type="text" name="pv1" value="<?= $data['pv1'] ?>" class="form-control"
                                           required></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Температура, °С</div>
                                </td>
                                <td><input type="text" name="pv2" value="<?= $data['pv2'] ?>" class="form-control"
                                           required></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Расход, кг/ч</div>
                                </td>
                                <td><input type="text" name="pv3" value="<?= $data['pv3'] ?>" class="form-control"
                                           required></td>
                            </tr>
                        </table>
                    </td>
                    <td align="center" valign="middle"><img src="<?= SITE_TEMPLATE_PATH ?>/images/ejector_mini.jpg"
                                                            alt="Опросный лист Эжектор"/></td>
                    <td align="center">
                        <table border="1" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                            <tr>
                                <td height="35" colspan="2" align="center" bgcolor="#eee">Пар среднего давления</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Давление, бар изб.</div>
                                </td>
                                <td><input type="text" name="pm1"
                                           value="<?= $data['pm1'] ?>"
                                           class="form-control" required></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Температура, °С</div>
                                </td>
                                <td><input type="text" name="pm2"
                                           value="<?= $data['pm2'] ?>"
                                           class="form-control"></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Расход, кг/ч</div>
                                </td>
                                <td><input type="text" name="pm3"
                                           value="<?= $data['pm3'] ?>"
                                           class="form-control"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center"></td>
                    <td align="center">
                        <table border="1" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                            <tr>
                                <td height="35" colspan="2" align="center" bgcolor="#eee">Пар низкого давления</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Давление, бар изб.</div>
                                </td>
                                <td>
                                    <input type="text" name="pn1" value="<?= $data['pn1'] ?>" class="form-control"
                                           required>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Температура, °С</div>
                                </td>
                                <td>
                                    <input type="text" name="pn2" value="<?= $data['pn2'] ?>" class="form-control"
                                           required>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cel-title">Расход, кг/ч</div>
                                </td>
                                <td>
                                    <input type="text" name="pn3" value="<?= $data['pn3'] ?>" class="form-control"
                                           required>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td align="center"></td>
                </tr>
                </tbody>
            </table>
            <hr>
            <table width="100%" border="1" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                <tr>
                    <td width="5%" height="35" align="center" valign="middle" bgcolor="#eee">№</td>
                    <td width="40%" align="center" valign="middle" bgcolor="#eee">Параметр</td>
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
                    <td align="center" valign="middle">3</td>
                    <td valign="middle">
                        <div class="cel-title">Материал корпуса</div>
                    </td>
                    <td valign="middle" align="center">
                        <input type="text" name="p3" value="<?= $data['p3'] ?>" class="form-control" required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">4</td>
                    <td valign="middle">
                        <div class="cel-title">Исполнение эжектора</div>
                    </td>
                    <td valign="middle">
                        <div class="radio required-radio cel-title">
                            <div><label><input type="radio" name="isp" value="1"
                                               <? if ($data['isp'] == 1): ?>checked<? endif; ?>>регулируемый – с
                                    приводом</label></div>
                            <div><label><input type="radio" name="isp" value="2"
                                               <? if ($data['isp'] == 2): ?>checked<? endif; ?>>нерегулируемый – без
                                    привода</label></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">5</td>
                    <td valign="middle">
                        <div class="cel-title">Тип присоединения</div>
                    </td>
                    <td valign="middle">
                        <div class="radio cel-title">
                            <div><label><input type="radio" name="typep" value="1"
                                               <? if ($data['typep'] == 1): ?>checked<? endif; ?>>Резьбовой</label>
                            </div>
                            <div><label><input type="radio" name="typep" value="2"
                                               <? if ($data['typep'] == 2): ?>checked<? endif; ?>>Фланцевый</label>
                            </div>
                            <div><label><input type="radio" name="typep" value="3"
                                               <? if ($data['typep'] == 3): ?>checked<? endif; ?>>Приварной</label>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">6</td>
                    <td valign="middle">
                        <div class="cel-title">Стандарт исполнения присоединения</div>
                    </td>
                    <td valign="middle">
                        <div class="radio cel-title">
                            <div><label><input type="radio" name="standpri"
                                               value="1"
                                               <? if ($data['standpri'] == 1): ?>checked<? endif; ?>>DIN</label>
                            </div>
                            <div><label><input type="radio" name="standpri"
                                               value="2" <? if ($data['standpri'] == 2): ?>checked<? endif; ?>>ANSI
                                    / ASME</label></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">7.</td>
                    <td valign="middle"><span class="cel-title">
							<div class="cel-title">Примечание:</div>
						  </span></td>
                    <td valign="middle">
							<textarea name="COMMENTS" id="input"
                                      class="form-control"></textarea>
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