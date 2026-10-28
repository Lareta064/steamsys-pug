<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("TITLE", "Опросный лист \"Регулятор прямого действия\"");
$APPLICATION->SetPageProperty("description", "Опросный лист по регулятору прямого действия от компании Паровые системы");
require 'inc.functions.php';
$APPLICATION->SetTitle("Опросный лист Регулятор прямого действия");
$data = dataForms();

if ($USER->IsAdmin() || 1) {
    ?>
    <link rel="stylesheet" href="/forms/css/main.css">
    <script src="/forms/js/main.js"></script>
    <?
    include 'new/index7.php';
} else {
    ?>

    <form action="<?= $APPLICATION->GetCurPage(true); ?>" method="POST" role="form">
        <? include_once $_SERVER['DOCUMENT_ROOT'] . '/include/recaptcha.php' ?>
        <input type="hidden" name="PAGE" value="<?= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] ?>">
        <div class="col-md-12">
            <input type="hidden" name="save" value="Y">
            <input type="hidden" name="TITLE" value="Опросный лист Регулятор прямого действия">
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
            <div class="form-group">
                <table border="1" bordercolor="#ccc" cellspacing="0" width="100%">
                    <tr>
                        <td height="60" align="center" valign="middle" bgcolor="#eee">№</td>
                        <td align="center" valign="middle" bgcolor="#eee">Параметр</td>
                        <td align="center" valign="middle" bgcolor="#eee">Единица измерения</td>
                        <td colspan="2" align="center" valign="middle" bgcolor="#eee">Регулятор давления (редукционный
                            клапан)
                        </td>
                        <td colspan="2" align="center" valign="middle" bgcolor="#eee">Регулятор температуры</td>
                    </tr>
                    <tr>
                        <td height="35" align="center" valign="middle">1</td>
                        <td valign="middle">
                            <div class="cel-title">Расход пара мин / макс</div>
                        </td>
                        <td align="center" valign="middle">кг/ч</td>
                        <td colspan="4" valign="middle" align="center">
                            <div class="form-inline">
                                <input type="text" name="p11" value="<?= $data['p11'] ?>" class="form-control w2"
                                       checked>
                                /
                                <input type="text" name="p12" value="<?= $data['p12'] ?>" class="form-control w2">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td height="35" align="center" valign="middle">2</td>
                        <td valign="middle">
                            <div class="cel-title">Давление пара</div>
                        </td>
                        <td align="center" valign="middle">бар изб.</td>
                        <td colspan="4" align="center" valign="middle">
                            <input type="text" name="p2" value="<?= $data['p2'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td height="35" align="center" valign="middle">3</td>
                        <td valign="middle">
                            <div class="cel-title">Настройка (или диапазон настройки)</div>
                        </td>
                        <td align="center" valign="middle">бар изб./гр. °С</td>
                        <td colspan="4" align="center" valign="middle">
                            <input type="text" name="p3" value="<?= $data['p3'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td height="35" align="center" valign="middle">4</td>
                        <td valign="middle">
                            <div class="cel-title">Минимальная температура окружающей среды</div>
                        </td>
                        <td align="center" valign="middle">°С</td>
                        <td colspan="4" valign="middle" align="center">
                            <input type="text" name="p4" value="<?= $data['p4'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td height="35" align="center" valign="middle">5</td>
                        <td valign="middle">
                            <div class="cel-title">Температура пара (указать только если пар перегретый)</div>
                        </td>
                        <td align="center" valign="middle">°С</td>
                        <td colspan="4" valign="middle">
                            <input type="text" name="p5" value="<?= $data['p5'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td height="35" align="center" valign="middle">6</td>
                        <td valign="middle">
                            <div class="cel-title">Место установки: магистральный паропровод, теплообменник, калорифер,
                                другое (указать)
                            </div>
                        </td>
                        <td valign="middle"><p align="center">&nbsp;</p></td>
                        <td colspan="4" valign="middle" align="center">
                            <input type="text" name="p6" value="<?= $data['p6'] ?>" class="form-control" required>
                        </td>
                    </tr>
                    <tr>
                        <td height="35" align="center" valign="middle">7</td>
                        <td valign="middle">
                            <div class="cel-title">Тип присоединения</div>
                        </td>
                        <td valign="middle"><p align="center">&nbsp;</p></td>
                        <td colspan="4" valign="middle">
                            <div class="radio cel-title">
                                <label class="radio-inline">
                                    <input type="radio" checked name="tipp1" value="1"
                                           <? if ($data['tipp1'] == 1): ?>checked<? endif; ?>>Резьбовое
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" name="tipp1" value="2"
                                           <? if ($data['tipp1'] == 2): ?>checked<? endif; ?>>Фланцевое
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td height="35" align="center" valign="middle" bgcolor="#eee">8</td>
                        <td colspan="6" align="center" valign="middle" bgcolor="#eee">Дополнительное оборудование:</td>
                    </tr>
                    <tr>
                        <td height="32" align="center" valign="middle">8.1</td>
                        <td colspan="2" valign="middle">
                            <div class="cel-title">Фильтр</div>
                        </td>
                        <td width="156" align="center" valign="middle"><input type="checkbox" name="filter1" value="1"
                                                                              <? if ($data['filter1'] == 1): ?>checked<? endif; ?>>
                        </td>
                        <td colspan="2" valign="middle" align="center"><input type="checkbox" name="filter1" value="2"
                                                                              <? if ($data['filter1'] == 2): ?>checked<? endif; ?>>
                        </td>
                        <td width="180" align="center" valign="middle"><input type="checkbox" name="filter1" value="3"
                                                                              <? if ($data['filter1'] == 3): ?>checked<? endif; ?>>
                        </td>
                    </tr>
                    <tr>
                        <td height="32" align="center" valign="middle">8.2</td>
                        <td colspan="2" valign="middle">
                            <div class="cel-title">Предохранительный клапан</div>
                        </td>
                        <td valign="middle" align="center"><input type="checkbox" name="predk1" value="1"
                                                                  <? if ($data['predk1'] == 1): ?>checked<? endif; ?>>
                        </td>
                        <td colspan="2" valign="middle" align="center"><input type="checkbox" name="predk1" value="2"
                                                                              <? if ($data['predk1'] == 2): ?>checked<? endif; ?>>
                        </td>
                        <td valign="middle" align="center"><input type="checkbox" name="predk1" value="3"
                                                                  <? if ($data['predk1'] == 3): ?>checked<? endif; ?>>
                        </td>
                    </tr>
                    <tr>
                        <td height="32" align="center" valign="middle">8.3</td>
                        <td colspan="2" valign="middle">
                            <div class="cel-title">Отсечные вентили / байпасный вентиль</div>
                        </td>
                        <td valign="middle" align="center"><input type="checkbox" name="ventil1" value="1"
                                                                  <? if ($data['ventil1'] == 1): ?>checked<? endif; ?>>
                        </td>
                        <td colspan="2" valign="middle" align="center"><input type="checkbox" name="ventil1" value="2"
                                                                              <? if ($data['ventil1'] == 2): ?>checked<? endif; ?>>
                        </td>
                        <td valign="middle" align="center"><input type="checkbox" name="ventil1" value="3"
                                                                  <? if ($data['ventil1'] == 3): ?>checked<? endif; ?>>
                        </td>
                    </tr>
                    <tr>
                        <td height="32" align="center" valign="middle">8.4</td>
                        <td colspan="2" valign="middle">
                            <div class="cel-title">Конденсатоотводчик дренажа паропровода</div>
                        </td>
                        <td valign="middle" align="center"><input type="checkbox" name="kond1" value="1"
                                                                  <? if ($data['kond1'] == 1): ?>checked<? endif; ?>>
                        </td>
                        <td colspan="2" valign="middle" align="center"><input type="checkbox" name="kond1" value="2"
                                                                              <? if ($data['kond1'] == 2): ?>checked<? endif; ?>>
                        </td>
                        <td valign="middle" align="center"><input type="checkbox" name="kond1" value="3"
                                                                  <? if ($data['kond1'] == 3): ?>checked<? endif; ?>>
                        </td>
                    </tr>
                    <tr>
                        <td height="32" align="center" valign="middle">8.5</td>
                        <td colspan="2" valign="middle">
                            <div class="cel-title">Термометры / манометры</div>
                        </td>
                        <td valign="middle" align="center"><input type="checkbox" name="term1" value="1"
                                                                  <? if ($data['term1'] == 1): ?>checked<? endif; ?>>
                        </td>
                        <td colspan="2" valign="middle" align="center"><input type="checkbox" name="term1" value="2"
                                                                              <? if ($data['term1'] == 2): ?>checked<? endif; ?>>
                        </td>
                        <td valign="middle" align="center"><input type="checkbox" name="term1" value="3"
                                                                  <? if ($data['term1'] == 3): ?>checked<? endif; ?>>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="middle">9</td>
                        <td colspan="6" valign="middle">
                            <div class="cel-title">Примечание:</div>
                            <textarea name="COMMENTS" id="input"
                                      class="form-control"><?= $data['COMMENTS'] ?></textarea>
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
                <div class="row">
                    <? if (empty($_GET['result'])): ?>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                            <label class="sts21_b2_p2"><input required type="checkbox" name="legal_top" class="js-legal"
                                                              value="Y"> Нажимая кнопку “Отправить”, вы принимаете
                                согласие на&nbsp;обработку <a
                                        href="/include/licenses_detail.php" target="_blank">персональных
                                    данных</a></label><br>
                            <button type="submit" class="btn-lg btn-info">Отправить</button>
                        </div>
                    <? endif; ?>
                </div>
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