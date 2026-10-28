<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("TITLE", "Опросный лист Конденсатоотводчик");
$APPLICATION->SetPageProperty("description", "Опросный лист для подбора конденсатоотводчика TLV от компании Паровые системы");
require 'inc.functions.php';
$APPLICATION->SetTitle("Опросный лист Конденсатоотводчик");
$data = dataForms();

if ($USER->IsAdmin() || 1) {
    ?>
    <link rel="stylesheet" href="/forms/css/main.css">
    <script src="/forms/js/main.js"></script>
    <?
    include 'new/index1.php';
} else {
    ?>
    <form action="<?= $APPLICATION->GetCurPage(true); ?>" method="POST" role="form">
        <? include_once $_SERVER['DOCUMENT_ROOT'] . '/include/recaptcha.php' ?>
        <input type="hidden" name="PAGE" value="<?= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] ?>">
        <input type="hidden" name="save" value="Y">
        <input type="hidden" name="TITLE" value="Опросный лист Конденсатоотводчик">
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
                    <td width="30%">
                        <div class="cel-title">Организация:</div>
                    </td>
                    <td width="70%"><input type="text" class="form-control" required placeholder="название компании"
                                           name="COMPANY_TITLE" value="<?= $data['COMPANY_TITLE'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">Контактное лицо</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="контактное лицо" name="NAME"
                               value="<?= $data['NAME'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">Телефон/факс:</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="+7 (000) 000-00-00" name="PHONE"
                               value="<?= $data['PHONE'] ?>"></td>
                </tr>
                <tr>
                    <td>
                        <div class="cel-title">E-mail:</div>
                    </td>
                    <td><input type="text" class="form-control" required placeholder="Ваш e-mail" name="EMAIL"
                               value="<?= $data['EMAIL'] ?>"></td>
                </tr>
                </tbody>
            </table>
            <hr>
            <table border="1" bordercolor="#ccc" cellspacing="0" width="100%">
                <tr>
                    <td width="30" height="60" align="center" valign="middle" bgcolor="#eee">№</td>
                    <td align="center" valign="middle" bgcolor="#eee">Параметр</td>
                    <td align="center" valign="middle" bgcolor="#eee">Единица измерения</td>
                    <td align="center" valign="middle" bgcolor="#eee">Конденсато-<br> отводчик<br> №1</td>
                    <td align="center" valign="middle" bgcolor="#eee">Конденсато-<br> отводчик<br> №2</td>
                    <td align="center" valign="middle" bgcolor="#eee">Конденсато-<br> отводчик<br> №3</td>
                </tr>
                <tr>
                    <td align="center" valign="middle">1</td>
                    <td valign="middle">
                        <div class="cel-title">Расход конденсата:</div>
                    </td>
                    <td align="center" valign="middle">кг/ч</td>
                    <td valign="middle">
                        <input type="text" name="krashod1" value="<?= $data['krashod1'] ?>" class="form-control"
                               placeholder="кг/ч"
                               required>
                    </td>
                    <td valign="middle">
                        <input type="text" name="krashod2" value="<?= $data['krashod2'] ?>" class="form-control"
                               placeholder="кг/ч">
                    </td>
                    <td valign="middle">
                        <input type="text" name="krashod3" value="<?= $data['krashod3'] ?>" class="form-control"
                               placeholder="кг/ч">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">2</td>
                    <td valign="middle">
                        <div class="cel-title">Давление перед конденсатоотводчиком:</div>
                    </td>
                    <td align="center" valign="middle">бар изб.</td>
                    <td valign="middle">
                        <input type="text" name="davpered1" value="<?= $data['davpered1'] ?>" class="form-control"
                               placeholder="бар изб.">
                    </td>
                    <td valign="middle">
                        <input type="text" name="davpered2" value="<?= $data['davpered2'] ?>" class="form-control"
                               placeholder="бар изб.">
                    </td>
                    <td valign="middle">
                        <input type="text" name="davpered3" value="<?= $data['davpered3'] ?>" class="form-control"
                               placeholder="бар изб.">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">3</td>
                    <td valign="middle">
                        <div class="cel-title">Давление за конденсатоотводчиком (противодавление в конденсатной
                            линии):
                        </div>
                    </td>
                    <td align="center" valign="middle">бар изб.</td>
                    <td valign="middle">
                        <input type="text" name="davza1" value="<?= $data['davza1'] ?>" class="form-control"
                               placeholder="бар изб.">
                    </td>
                    <td valign="middle">
                        <input type="text" name="davza2" value="<?= $data['davza2'] ?>" class="form-control"
                               placeholder="бар изб.">
                    </td>
                    <td valign="middle">
                        <input type="text" name="davza3" value="<?= $data['davza3'] ?>" class="form-control"
                               placeholder="бар изб.">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">4</td>
                    <td valign="middle">
                        <div class="cel-title">Минимальная температура окружающей среды:</div>
                    </td>
                    <td align="center" valign="middle">°С</td>
                    <td valign="middle">
                        <input type="text" name="mint1" value="<?= $data['mint1'] ?>" class="form-control"
                               placeholder="градусов C">
                    </td>
                    <td valign="middle">
                        <input type="text" name="mint2" value="<?= $data['mint2'] ?>" class="form-control"
                               placeholder="градусов C">
                    </td>
                    <td valign="middle">
                        <input type="text" name="mint3" value="<?= $data['mint3'] ?>" class="form-control"
                               placeholder="градусов C">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">5</td>
                    <td valign="middle">
                        <div class="cel-title">Температура пара (указать только если пар перегретый):</div>
                    </td>
                    <td align="center" valign="middle">°С</td>
                    <td valign="middle"><input type="text" name="part1" value="<?= $data['part1'] ?>"
                                               class="form-control" required
                                               placeholder="градусов по C"></td>
                    <td valign="middle"><input type="text" name="part2" value="<?= $data['part2'] ?>"
                                               class="form-control"
                                               placeholder="градусов по C"></td>
                    <td valign="middle"><input type="text" name="part3" value="<?= $data['part3'] ?>"
                                               class="form-control"
                                               placeholder="градусов по C"></td>
                </tr>
                <tr>
                    <td align="center" valign="middle">6</td>
                    <td valign="middle">
                        <div class="cel-title">Место установки: дренаж паропровода, теплообменник,  пароспутник, другое
                            (указать):
                        </div>
                    </td>
                    <td align="center" valign="middle">&nbsp;</td>
                    <td valign="middle"><input type="text" name="mplace1" value="<?= $data['mplace1'] ?>"
                                               class="form-control"
                                               required></td>
                    <td valign="middle"><input type="text" name="mplace2" value="<?= $data['mplace2'] ?>"
                                               class="form-control"></td>
                    <td valign="middle"><input type="text" name="mplace3" value="<?= $data['mplace3'] ?>"
                                               class="form-control"></td>
                </tr>
                <tr>
                    <td align="center" valign="middle">7</td>
                    <td valign="middle">
                        <div class="cel-title">Тип присоединения:</div>
                    </td>
                    <td align="center" valign="middle">
                        <p align="center">&nbsp;</p>
                    </td>
                    <td valign="middle">
                        <div class="radio table-cel-title cel-title-30">
                            <input type="radio" name="tipp1" value="1" <? if ($data['tipp1'] == 1): ?>checked
                                <? endif; ?>>Резьбовой<br>
                            <input type="radio" name="tipp1" value="2" <? if ($data['tipp1'] == 2): ?>checked
                                <? endif; ?>>Фланцевый<br>
                            <input type="radio" name="tipp1" value="3" <? if ($data['tipp1'] == 3): ?>checked
                                <? endif; ?>>Приварной<br>
                        </div>
                    </td>
                    <td valign="middle">
                        <div class="radio table-cel-title cel-title-30">
                            <input type="radio" name="tipp2" value="1" <? if ($data['tipp2'] == 1): ?>checked
                                <? endif; ?>>Резьбовой<br>
                            <input type="radio" name="tipp2" value="2" <? if ($data['tipp2'] == 2): ?>checked
                                <? endif; ?>>Фланцевый<br>
                            <input type="radio" name="tipp2" value="3" <? if ($data['tipp2'] == 3): ?>checked
                                <? endif; ?>>Приварной<br>
                        </div>
                    </td>
                    <td valign="middle">
                        <div class="radio table-cel-title cel-title-30">
                            <input type="radio" name="tipp3" value="1" <? if ($data['tipp3'] == 1): ?>checked
                                <? endif; ?>>Резьбовой<br>
                            <input type="radio" name="tipp3" value="2" <? if ($data['tipp3'] == 2): ?>checked
                                <? endif; ?>>Фланцевый<br>
                            <input type="radio" name="tipp3" value="3" <? if ($data['tipp3'] == 3): ?>checked
                                <? endif; ?>>Приварной<br>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td height="35" align="center" valign="middle" bgcolor="#eee">8</td>
                    <td colspan="900" valign="middle" bgcolor="#eee">
                        <div class="cel-title">Дополнительное оборудование:</div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">8.1</td>
                    <td colspan="2" valign="middle">
                        <div class="cel-title">Фильтр:</div>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="filter1" value="1" <? if ($data['filter1']): ?>checked
                            <? endif; ?>>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="filter2" value="1" <? if ($data['filter2']): ?>checked
                            <? endif; ?>>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="filter3" value="1" <? if ($data['filter3']): ?>checked
                            <? endif; ?>>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">8.2</td>
                    <td colspan="2" valign="middle">
                        <div class="cel-title">Обратный клапан:</div>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="obrklap1" value="1" <? if ($data['obrklap1']): ?>checked
                            <? endif; ?>>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="obrklap2" value="1" <? if ($data['obrklap2']): ?>checked
                            <? endif; ?>>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="obrklap3" value="1" <? if ($data['obrklap3']): ?>checked
                            <? endif; ?>>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">8.3</td>
                    <td colspan="2" valign="middle">
                        <div class="cel-title">Отсечные вентили / байпасный вентиль:</div>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="ventil1" value="1" <? if ($data['ventil1']): ?>checked
                            <? endif; ?>>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="ventil2" value="1" <? if ($data['ventil2']): ?>checked
                            <? endif; ?>>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="ventil3" value="1" <? if ($data['ventil3']): ?>checked
                            <? endif; ?>>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">8.4</td>
                    <td colspan="2" valign="middle">
                        <div class="cel-title">Продувочный кран:</div>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="prokran1" value="1" <? if ($data['prokran1']): ?>checked
                            <? endif; ?>>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="prokran2" value="1" <? if ($data['prokran2']): ?>checked
                            <? endif; ?>>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="prokran3" value="1" <? if ($data['prokran3']): ?>checked
                            <? endif; ?>>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">8.5</td>
                    <td colspan="2" valign="middle">
                        <div class="cel-title">Прерыватель вакуума:</div>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="prervak1" value="1" <? if ($data['prervak1']): ?>checked
                            <? endif; ?>>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="prervak2" value="1" <? if ($data['prervak2']): ?>checked
                            <? endif; ?>>
                    </td>
                    <td align="center" valign="middle">
                        <input type="checkbox" name="prervak3" value="1" <? if ($data['prervak3']): ?>checked
                            <? endif; ?>>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">9</td>
                    <td colspan="900" valign="middle">
                        <div class="cel-title">Примечание:</div>
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
                <div class="col-xs-12 text-center">
                    <label class="sts21_b2_p2"><input required type="checkbox" name="legal_top" class="js-legal"
                                                      value="Y"> Нажимая кнопку “Отправить”, вы принимаете согласие на&nbsp;обработку
                        <a
                                href="/include/licenses_detail.php" target="_blank">персональных данных</a></label><br>
                    <button type="submit" class="btn-lg btn-info">Отправить</button>
                </div>
            <? endif; ?>
            <div class="col-xs-12 text-center footer">
                <? $APPLICATION->IncludeComponent("bitrix:main.include", "", array(
                        "AREA_FILE_SHOW" => "file",
                        "PATH" => SITE_DIR . "include/forms/footer.php",
                        "EDIT_TEMPLATE" => "standard.php"
                    )
                ); ?>
            </div>
        </div>
    </form>
<? } ?>
<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>